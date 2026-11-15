// src/stores/useRefLibraryStore.js 
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ref as dbRef, onValue, set, get } from 'firebase/database'
// Hãy đảm bảo đường dẫn import `db` khớp với file cấu hình Firebase trong dự án của bạn:
import { db } from '../firebase'
import bundledRefLibraryJson from '../data/ref_library.json'
import { useNotificationStore } from './useNotificationStore'

const API_BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/__ref_library`
const FB_MAIN_PATH = 'cmg_ref_library'
const FB_BACKUP_PATH = 'cmg_ref_library_backup'
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i

// Mã hóa & Giải mã Key cho Firebase RTDB (Vì Firebase cấm '.', '#', '$', '/', '[', ']' trong Key)
const encodeFbKey = (rawKey) =>
  String(rawKey)
    .replace(/%/g, '%25')
    .replace(/\./g, '%2E')
    .replace(/#/g, '%23')
    .replace(/\$/g, '%24')
    .replace(/\//g, '%2F')
    .replace(/\\/g, '%5C')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D')

const decodeFbKey = (encodedKey) => {
  try {
    return decodeURIComponent(String(encodedKey))
  } catch {
    return String(encodedKey)
  }
}

// Lưu nhớ Folder Handle vào IndexedDB của trình duyệt (Phục vụ khi mở trên GitHub Pages)
const IDB_NAME = 'cmg_local_ref_db_v2'
const IDB_STORE = 'handles'

const openIdb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const saveHandleToIdb = async (handle) => {
  try {
    const idb = await openIdb()
    const tx = idb.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(handle, 'root_dir')
  } catch (e) {
    console.warn('Could not cache folder handle:', e)
  }
}

const loadHandleFromIdb = async () => {
  try {
    const idb = await openIdb()
    return await new Promise((resolve) => {
      const tx = idb.transaction(IDB_STORE, 'readonly')
      const req = tx.objectStore(IDB_STORE).get('root_dir')
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export const useRefLibraryStore = defineStore('refLibrary', () => {
  const notify = useNotificationStore()

  // Trạng thái kết nối
  const isFirebaseSynced = ref(false)
  const isSavingFirebase = ref(false)
  const isLocalViteServer = ref(Boolean(import.meta.env.DEV))
  let isRealtimeListening = false

  // State chính đồng bộ với nhánh `cmg_ref_library` trên Firebase
  const libraryData = ref({
    version: 2,
    lastFolderPath: '',
    updatedAt: '',
    categories: [],
    items: {}
  })
  const backupMeta = ref(null)

  // Lưu trữ kết nối thư mục trình duyệt (Khi mở trên GitHub Pages hoặc không chạy qua Vite)
  const savedBrowserDirHandle = ref(null)
  const browserRuntimeMap = ref({}) // { [keyOrFileName]: { previewUrl, fileHandle, parentDirHandle } }

  // State Thanh công cụ & Bộ lọc
  const folderPathInput = ref('')
  const importTargetCategoryId = ref('__AUTO_FOLDER__')
  const isScanning = ref(false)

  const selectedFilter = ref('ALL')
  const includeSubcategoriesInView = ref(true)
  const showTrashedCategories = ref(false)
  const searchQuery = ref('')
  const selectedKeys = ref([])
  const batchTargetCatId = ref('')

  // State 3 Modals
  const categoryModal = ref({
    show: false,
    isEdit: false,
    form: {
      id: '',
      name: '',
      icon: '📌',
      parentId: null,
      sortOrder: 1,
      created_at: '',
      updated_at: '',
      deleted_at: null
    }
  })

  const renamingItem = ref(null)
  const previewingItem = ref(null)

  const getNowStr = () => {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  // ==========================================================================
  // CHUẨN HÓA DỮ LIỆU ĐỌC / GHI GIỮA STORE VÀ FIREBASE RTDB
  // ==========================================================================
  const serializeForFirebase = (dataObj) => {
    const cloned = JSON.parse(JSON.stringify(dataObj || { categories: [], items: {} }))
    const encodedItems = {}

    Object.entries(cloned.items || {}).forEach(([rawKey, val]) => {
      const safeKey = encodeFbKey(rawKey)
      encodedItems[safeKey] = {
        ...val,
        key: rawKey,
        deleted_at: val.deleted_at || null
      }
    })

    cloned.items = encodedItems
    cloned.categories = (cloned.categories || []).map((cat, idx) => ({
      ...cat,
      parentId: cat.parentId || null,
      sortOrder: Number(cat.sortOrder ?? (idx + 1)),
      deleted_at: cat.deleted_at || null
    }))

    return cloned
  }

  const deserializeFromFirebase = (fbRaw) => {
    const raw = JSON.parse(JSON.stringify(fbRaw || { categories: [], items: {} }))
    const now = getNowStr()

    raw.categories = (raw.categories || []).map((cat, idx) => ({
      id: cat.id,
      name: cat.name || 'Unnamed',
      icon: cat.icon || '📌',
      parentId: cat.parentId || null,
      sortOrder: Number(cat.sortOrder ?? (idx + 1)),
      created_at: cat.created_at || now,
      updated_at: cat.updated_at || now,
      deleted_at: cat.deleted_at || null
    }))

    const decodedItems = {}
    Object.entries(raw.items || {}).forEach(([encodedKey, val]) => {
      const originalKey = val.key || decodeFbKey(encodedKey)
      const isWinPath = /^[a-zA-Z]:\\/.test(originalKey) || /^[a-zA-Z]:\//.test(originalKey)
      const fileName = val.fileName || (isWinPath ? originalKey.split(/[\\/]/).pop() : originalKey)

      decodedItems[originalKey] = {
        key: originalKey,
        fileName,
        windowsPath: val.windowsPath || (isWinPath ? originalKey : ''),
        folderPath: val.folderPath || '',
        categoryId: val.categoryId || '',
        isFavorite: Boolean(val.isFavorite),
        created_at: val.created_at || now,
        updated_at: val.updated_at || now,
        deleted_at: val.deleted_at || null
      }
    })

    raw.items = decodedItems
    return raw
  }

  // Hiển thị ảnh từ ổ cứng Windows (Hỗ trợ cả Local Vite Stream & Browser Blob URL)
  const getImageStreamUrl = (img) => {
    if (!img) return ''
    const runtime = browserRuntimeMap.value[img.key] || browserRuntimeMap.value[img.fileName]
    if (runtime?.previewUrl) {
      return runtime.previewUrl
    }
    if (isLocalViteServer.value && img.windowsPath) {
      return `${API_BASE}/image?path=${encodeURIComponent(img.windowsPath)}&v=${encodeURIComponent(img.updated_at || '')}`
    }
    return ''
  }

  // ==========================================================================
  // 1. ĐỒNG BỘ REAL-TIME VỚI FIREBASE (`cmg_ref_library` & `cmg_ref_library_backup`)
  // ==========================================================================
  const loadLibraryFromDisk = async () => {
    savedBrowserDirHandle.value = await loadHandleFromIdb()

    // Kiểm tra xem có đang chạy cùng Vite Local Middleware hay không
    if (import.meta.env.DEV) {
      try {
        const res = await fetch(`${API_BASE}/load`)
        const ct = res.headers.get('content-type') || ''
        isLocalViteServer.value = res.ok && ct.includes('application/json')
      } catch {
        isLocalViteServer.value = false
      }
    } else {
      isLocalViteServer.value = false
    }

    if (isRealtimeListening) return
    isRealtimeListening = true

    const mainNodeRef = dbRef(db, FB_MAIN_PATH)
    const backupNodeRef = dbRef(db, FB_BACKUP_PATH)

    // Lắng nghe nhánh chính `cmg_ref_library`
    onValue(mainNodeRef, async (snapshot) => {
      if (snapshot.exists()) {
        const parsed = deserializeFromFirebase(snapshot.val())
        libraryData.value = parsed
        if (parsed.lastFolderPath && !folderPathInput.value) {
          folderPathInput.value = parsed.lastFolderPath
        }
        isFirebaseSynced.value = true
      } else {
        // Nếu trên Firebase chưa có nhánh `cmg_ref_library`, tự động khởi tạo từ file ref_library.json
        const initialSeed = deserializeFromFirebase(bundledRefLibraryJson)
        initialSeed.updatedAt = getNowStr()
        libraryData.value = initialSeed
        await set(mainNodeRef, serializeForFirebase(initialSeed))
        isFirebaseSynced.value = true
      }
    })

    // Lắng nghe nhánh dự phòng `cmg_ref_library_backup`
    onValue(backupNodeRef, (snapshot) => {
      if (snapshot.exists()) {
        const bk = snapshot.val()
        backupMeta.value = {
          updatedAt: bk.backupSavedAt || bk.updatedAt || 'Mới',
          backupReason: bk.backupReason || 'Auto Backup trên Firebase',
          itemCount: Object.keys(bk.items || {}).length,
          categoryCount: (bk.categories || []).length
        }
      } else {
        backupMeta.value = null
      }
    })
  }

  // Lưu lên Firebase (Tự động đẩy bản hiện tại sang `cmg_ref_library_backup` trước khi ghi đè)
  const saveLibraryToDisk = async (reason = 'Cập nhật thư viện ảnh tham khảo') => {
    isSavingFirebase.value = true
    const now = getNowStr()
    const mainNodeRef = dbRef(db, FB_MAIN_PATH)
    const backupNodeRef = dbRef(db, FB_BACKUP_PATH)

    try {
      // 1. Đọc trạng thái hiện tại trên Firebase để cất vào `cmg_ref_library_backup`
      const currentSnap = await get(mainNodeRef)
      if (currentSnap.exists()) {
        const currentVal = currentSnap.val()
        currentVal.backupReason = reason
        currentVal.backupSavedAt = now
        await set(backupNodeRef, currentVal)
      }

      // 2. Ghi dữ liệu mới lên `cmg_ref_library`
      libraryData.value.updatedAt = now
      const serialized = serializeForFirebase(libraryData.value)
      await set(mainNodeRef, serialized)
      return true
    } catch (err) {
      notify.error('Lỗi đồng bộ Firebase', err.message)
      return false
    } finally {
      isSavingFirebase.value = false
    }
  }

  // Xuất file JSON dự phòng về máy tính bất cứ lúc nào
  const exportJsonFile = () => {
    const blob = new Blob([JSON.stringify(libraryData.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ref_library_firebase_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ==========================================================================
  // 2. CÂY CATEGORY CHA - CON & BỘ ĐẾM
  // ==========================================================================
  const activeCategoriesList = computed(() =>
    (libraryData.value.categories || [])
      .filter(c => !c.deleted_at)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
  )

  const trashedCategoriesList = computed(() =>
    (libraryData.value.categories || []).filter(c => Boolean(c.deleted_at))
  )

  const flattenedCategoryTree = computed(() => {
    const list = activeCategoriesList.value
    const validIds = new Set(list.map(c => c.id))
    const result = []
    const visited = new Set()

    const walk = (parentId = null, depth = 0) => {
      const children = list
        .filter(c => {
          const effectiveParent = (c.parentId && validIds.has(c.parentId) && c.parentId !== c.id) ? c.parentId : null
          return effectiveParent === parentId
        })
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

      for (const child of children) {
        if (visited.has(child.id)) continue
        visited.add(child.id)
        result.push({ ...child, depth })
        walk(child.id, depth + 1)
      }
    }

    walk(null, 0)
    return result
  })

  const getDescendantCategoryIds = (rootCatId) => {
    const descendants = new Set([rootCatId])
    let added = true
    while (added) {
      added = false
      for (const cat of activeCategoriesList.value) {
        if (cat.parentId && descendants.has(cat.parentId) && !descendants.has(cat.id)) {
          descendants.add(cat.id)
          added = true
        }
      }
    }
    return descendants
  }

  const availableParentCategoryOptions = computed(() => {
    if (!categoryModal.value.isEdit) return flattenedCategoryTree.value
    const forbiddenIds = getDescendantCategoryIds(categoryModal.value.form.id)
    return flattenedCategoryTree.value.filter(node => !forbiddenIds.has(node.id))
  })

  const getCategoryLabel = (catId) => {
    if (!catId) return '❓ Chưa phân loại'
    const found = (libraryData.value.categories || []).find(c => c.id === catId)
    return found ? `${found.icon || '📌'} ${found.name}` : '❓ Chưa phân loại'
  }

  // ==========================================================================
  // 3. DANH SÁCH ẢNH & BỘ LỌC
  // ==========================================================================
  const allItemsArray = computed(() =>
    Object.entries(libraryData.value.items || {}).map(([key, val]) => ({
      ...val,
      key
    }))
  )

  const activeItemsList = computed(() => allItemsArray.value.filter(i => !i.deleted_at))
  const trashedItemsList = computed(() => allItemsArray.value.filter(i => Boolean(i.deleted_at)))
  const favoriteItemsCount = computed(() => activeItemsList.value.filter(i => i.isFavorite).length)
  const uncategorizedItemsCount = computed(() => activeItemsList.value.filter(i => !i.categoryId).length)

  const countImagesForCategoryNode = (catId) => {
    if (includeSubcategoriesInView.value) {
      const allowedSet = getDescendantCategoryIds(catId)
      return activeItemsList.value.filter(i => allowedSet.has(i.categoryId)).length
    }
    return activeItemsList.value.filter(i => i.categoryId === catId).length
  }

  const filteredImages = computed(() => {
    let list = selectedFilter.value === 'TRASH_ITEMS'
      ? [...trashedItemsList.value]
      : [...activeItemsList.value]

    if (selectedFilter.value === 'FAVORITES') {
      list = list.filter(i => i.isFavorite)
    } else if (selectedFilter.value === 'UNCATEGORIZED') {
      list = list.filter(i => !i.categoryId)
    } else if (!['ALL', 'TRASH_ITEMS'].includes(selectedFilter.value)) {
      if (includeSubcategoriesInView.value) {
        const allowedSet = getDescendantCategoryIds(selectedFilter.value)
        list = list.filter(i => allowedSet.has(i.categoryId))
      } else {
        list = list.filter(i => i.categoryId === selectedFilter.value)
      }
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(i =>
        (i.fileName || '').toLowerCase().includes(q) ||
        (i.windowsPath || '').toLowerCase().includes(q)
      )
    }

    return list.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || '', undefined, { numeric: true }))
  })

  // ==========================================================================
  // 4. QUÉT FOLDER WINDOWS & ĐỒNG BỘ LÊN FIREBASE (CÓ CONFIRM DIALOG)
  // ==========================================================================
  const integrateScannedFilesIntoFirebase = async (folderPath, folderName, files) => {
    const confirmed = await notify.confirm({
      title: 'Xác nhận đồng bộ đường dẫn Windows lên Firebase?',
      message: `Hệ thống tìm thấy ${files.length} file hình ảnh trong thư mục "${folderName}". Bạn có muốn lưu thông tin đường dẫn vật lý của chúng lên Firebase không?`,
      highlightText: `${folderPath} (${files.length} ảnh)`,
      confirmText: 'Đồng ý Lưu lên Firebase',
      cancelText: 'Hủy bỏ',
      variant: 'info',
      icon: '☁️'
    })
    if (!confirmed) return

    const now = getNowStr()
    let targetCatId = importTargetCategoryId.value

    if (targetCatId === '__AUTO_FOLDER__') {
      const existingCat = activeCategoriesList.value.find(
        c => c.name.toLowerCase() === folderName.toLowerCase()
      )
      if (existingCat) {
        targetCatId = existingCat.id
      } else {
        targetCatId = `cat_${folderName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString().slice(-3)}`
        const maxOrder = activeCategoriesList.value.reduce((m, c) => Math.max(m, Number(c.sortOrder || 0)), 0)
        libraryData.value.categories.push({
          id: targetCatId,
          name: folderName,
          icon: '📌',
          parentId: null,
          sortOrder: maxOrder + 1,
          created_at: now,
          updated_at: now,
          deleted_at: null
        })
      }
    }

    files.forEach(fileObj => {
      const winKey = fileObj.windowsPath
      const legacyRecord = libraryData.value.items[fileObj.fileName]
      const existingRecord = libraryData.value.items[winKey] || legacyRecord

      libraryData.value.items[winKey] = {
        key: winKey,
        fileName: fileObj.fileName,
        windowsPath: fileObj.windowsPath,
        folderPath: fileObj.folderPath,
        categoryId: existingRecord?.categoryId || targetCatId || '',
        isFavorite: Boolean(existingRecord?.isFavorite),
        created_at: existingRecord?.created_at || now,
        updated_at: now,
        deleted_at: existingRecord?.deleted_at || null
      }

      if (legacyRecord && winKey !== fileObj.fileName) {
        delete libraryData.value.items[fileObj.fileName]
      }
    })

    libraryData.value.lastFolderPath = folderPath
    folderPathInput.value = folderPath
    if (targetCatId) selectedFilter.value = targetCatId

    await saveLibraryToDisk(`Quét thư mục Windows: ${folderName} (${files.length} ảnh)`)
    notify.success('Đã đồng bộ Firebase!', `Đã lưu đường dẫn của ${files.length} ảnh lên Firebase.`)
  }

  // Nạp ảnh từ DirectoryHandle trình duyệt (Dùng khi mở trên GitHub Pages)
  const populateBrowserRuntimeFromHandle = async (dirHandle) => {
    const files = []
    const basePrefix = folderPathInput.value.trim() || dirHandle.name

    const scanHandle = async (handle, relDir = '') => {
      for await (const entry of handle.values()) {
        if (entry.kind === 'directory') {
          await scanHandle(entry, relDir ? `${relDir}\\${entry.name}` : entry.name)
        } else if (entry.kind === 'file' && IMAGE_EXT_REGEX.test(entry.name)) {
          const file = await entry.getFile()
          const folderPath = relDir ? `${basePrefix}\\${relDir}` : basePrefix
          const windowsPath = `${folderPath}\\${entry.name}`
          const previewUrl = URL.createObjectURL(file)
          browserRuntimeMap.value[windowsPath] = { previewUrl, fileHandle: entry, parentDirHandle: handle }
          browserRuntimeMap.value[entry.name] = { previewUrl, fileHandle: entry, parentDirHandle: handle }
          files.push({
            fileName: entry.name,
            windowsPath,
            folderPath
          })
        }
      }
    }

    await scanHandle(dirHandle)
    return { basePrefix, folderName: dirHandle.name, files }
  }

  const reconnectSavedBrowserFolder = async () => {
    if (!savedBrowserDirHandle.value) return
    try {
      const perm = await savedBrowserDirHandle.value.requestPermission({ mode: 'readwrite' })
      if (perm === 'granted') {
        await populateBrowserRuntimeFromHandle(savedBrowserDirHandle.value)
        notify.success('Đã kết nối ổ đĩa!', `Đã nạp hiển thị ảnh từ thư mục "${savedBrowserDirHandle.value.name}".`)
      }
    } catch (err) {
      notify.error('Không thể kết nối lại folder', err.message)
    }
  }

  const pickFolderViaBrowserApi = async () => {
    if (!('showDirectoryPicker' in window)) {
      notify.error('Trình duyệt không hỗ trợ', 'Vui lòng dùng Opera, Chrome hoặc Edge trên Windows!')
      return
    }
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' })
    savedBrowserDirHandle.value = dirHandle
    await saveHandleToIdb(dirHandle)
    const { basePrefix, folderName, files } = await populateBrowserRuntimeFromHandle(dirHandle)
    await integrateScannedFilesIntoFirebase(basePrefix, folderName, files)
  }

  const handlePickWindowsFolderDialog = async () => {
    isScanning.value = true
    try {
      if (isLocalViteServer.value) {
        const res = await fetch(`${API_BASE}/pick_windows_folder`)
        const json = await res.json()
        if (json.ok && json.files) {
          await integrateScannedFilesIntoFirebase(json.folderPath, json.folderName, json.files)
        }
      } else {
        await pickFolderViaBrowserApi()
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        notify.error('Không thể mở thư mục', err.message)
      }
    } finally {
      isScanning.value = false
    }
  }

  const handleScanTypedFolderPath = async () => {
    if (!folderPathInput.value.trim()) return
    if (!isLocalViteServer.value) {
      return handlePickWindowsFolderDialog()
    }
    isScanning.value = true
    try {
      const res = await fetch(`${API_BASE}/scan_folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: folderPathInput.value.trim() })
      })
      const json = await res.json()
      if (!json.ok) {
        notify.error('Đường dẫn không tồn tại', json.error)
        return
      }
      await integrateScannedFilesIntoFirebase(json.folderPath, json.folderName, json.files)
    } catch (err) {
      notify.error('Lỗi quét thư mục', err.message)
    } finally {
      isScanning.value = false
    }
  }

  // ==========================================================================
  // 5. CRUD CÂY CATEGORY CHA - CON (LƯU LÊN FIREBASE KÈM CONFIRM DIALOG)
  // ==========================================================================
  const openCreateCategoryModal = (defaultParentId = null) => {
    const maxOrder = activeCategoriesList.value.reduce((m, c) => Math.max(m, Number(c.sortOrder || 0)), 0)
    categoryModal.value = {
      show: true,
      isEdit: false,
      form: {
        id: '',
        name: '',
        icon: '📌',
        parentId: defaultParentId,
        sortOrder: maxOrder + 1,
        created_at: '',
        updated_at: '',
        deleted_at: null
      }
    }
  }

  const openEditCategoryModal = (catNode) => {
    categoryModal.value = {
      show: true,
      isEdit: true,
      form: {
        id: catNode.id,
        name: catNode.name,
        icon: catNode.icon || '📌',
        parentId: catNode.parentId || null,
        sortOrder: Number(catNode.sortOrder || 1),
        created_at: catNode.created_at,
        updated_at: catNode.updated_at,
        deleted_at: catNode.deleted_at || null
      }
    }
  }

  const handleSubmitCategoryModal = async () => {
    const f = categoryModal.value.form
    if (!f.name.trim()) {
      notify.warning('Thiếu tên Category', 'Vui lòng nhập tên Category!')
      return
    }

    const confirmed = await notify.confirm({
      title: categoryModal.value.isEdit ? 'Xác nhận cập nhật Category lên Firebase?' : 'Xác nhận tạo Category mới trên Firebase?',
      message: categoryModal.value.isEdit
        ? 'Thông tin tên, biểu tượng, thứ tự ưu tiên và mối quan hệ Cha - Con của Category này sẽ được đồng bộ lên Firebase.'
        : 'Category mới sẽ được thêm vào cây thư mục trên Firebase.',
      highlightText: `${f.icon} ${f.name.trim()} (Ưu tiên: #${f.sortOrder})`,
      confirmText: categoryModal.value.isEdit ? 'Đồng ý Cập nhật' : 'Đồng ý Tạo mới',
      cancelText: 'Quay lại',
      variant: 'info',
      icon: '🏷️'
    })
    if (!confirmed) return

    const now = getNowStr()
    if (categoryModal.value.isEdit) {
      const idx = libraryData.value.categories.findIndex(c => c.id === f.id)
      if (idx !== -1) {
        libraryData.value.categories[idx] = {
          ...libraryData.value.categories[idx],
          name: f.name.trim(),
          icon: f.icon.trim() || '📌',
          parentId: f.parentId || null,
          sortOrder: Number(f.sortOrder || 1),
          updated_at: now
        }
      }
    } else {
      const newId = `cat_${f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString().slice(-3)}`
      libraryData.value.categories.push({
        id: newId,
        name: f.name.trim(),
        icon: f.icon.trim() || '📌',
        parentId: f.parentId || null,
        sortOrder: Number(f.sortOrder || 1),
        created_at: now,
        updated_at: now,
        deleted_at: null
      })
    }

    categoryModal.value.show = false
    await saveLibraryToDisk(categoryModal.value.isEdit ? `Cập nhật Category: ${f.name}` : `Tạo Category: ${f.name}`)
    notify.success('Đã đồng bộ Firebase!', 'Cấu trúc Cây Category đã được lưu lên Firebase.')
  }

  const handleMoveCategoryOrder = async (node, direction) => {
    const confirmed = await notify.confirm({
      title: 'Xác nhận thay đổi thứ tự ưu tiên Category?',
      message: `Bạn muốn dịch chuyển thứ tự ưu tiên của Category "${node.name}" ${direction < 0 ? 'lên trên' : 'xuống dưới'}?`,
      highlightText: `${node.icon} ${node.name} (Hiện tại: #${node.sortOrder})`,
      confirmText: 'Đồng ý Đổi thứ tự',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '🔢'
    })
    if (!confirmed) return

    const siblings = activeCategoriesList.value
      .filter(c => (c.parentId || null) === (node.parentId || null))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

    const currentIdx = siblings.findIndex(s => s.id === node.id)
    const targetIdx = currentIdx + direction
    if (currentIdx === -1 || targetIdx < 0 || targetIdx >= siblings.length) return

    const now = getNowStr()
    const currentCat = libraryData.value.categories.find(c => c.id === siblings[currentIdx].id)
    const swapCat = libraryData.value.categories.find(c => c.id === siblings[targetIdx].id)

    if (currentCat && swapCat) {
      const tempOrder = currentCat.sortOrder
      currentCat.sortOrder = swapCat.sortOrder
      swapCat.sortOrder = tempOrder === swapCat.sortOrder ? tempOrder + direction : tempOrder
      currentCat.updated_at = now
      swapCat.updated_at = now
      await saveLibraryToDisk(`Đổi thứ tự ưu tiên Category: ${node.name}`)
    }
  }

  const handleSoftDeleteCategory = async (node) => {
    const confirmed = await notify.confirm({
      title: 'Xác nhận xóa mềm (Soft Delete) Category?',
      message: 'Category này sẽ được đánh dấu deleted_at trên Firebase. Các Category con (nếu có) sẽ được nâng lên cấp cha. File ảnh trên ổ đĩa Windows không bị ảnh hưởng.',
      highlightText: `${node.icon} ${node.name}`,
      confirmText: 'Xóa mềm Category',
      cancelText: 'Hủy bỏ',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    const target = libraryData.value.categories.find(c => c.id === node.id)
    if (target) {
      target.deleted_at = now
      target.updated_at = now
      libraryData.value.categories.forEach(c => {
        if (c.parentId === node.id) {
          c.parentId = target.parentId || null
          c.updated_at = now
        }
      })
      if (selectedFilter.value === node.id) selectedFilter.value = 'ALL'
      await saveLibraryToDisk(`Xóa mềm Category: ${node.name}`)
      notify.info('Đã xóa mềm Category', `Category "${node.name}" đã chuyển vào danh sách đã xóa.`)
    }
  }

  const handleRestoreCategory = async (tCat) => {
    const confirmed = await notify.confirm({
      title: 'Khôi phục Category đã xóa mềm?',
      message: 'Category này sẽ được xóa cờ deleted_at và hiển thị trở lại trên Cây danh mục.',
      highlightText: `${tCat.icon} ${tCat.name}`,
      confirmText: 'Khôi phục ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '♻️'
    })
    if (!confirmed) return

    tCat.deleted_at = null
    tCat.updated_at = getNowStr()
    await saveLibraryToDisk(`Khôi phục Category: ${tCat.name}`)
    notify.success('Đã khôi phục!', `Category "${tCat.name}" đã hoạt động trở lại.`)
  }

  const handlePermanentDeleteCategory = async (tCat) => {
    const confirmed = await notify.confirm({
      title: 'Xóa vĩnh viễn Category khỏi Firebase?',
      message: 'Category này sẽ bị xóa hẳn khỏi nhánh cmg_ref_library trên Firebase và các ảnh thuộc về nó sẽ chuyển sang Chưa phân loại.',
      highlightText: `${tCat.icon} ${tCat.name}`,
      confirmText: 'Xóa Vĩnh Viễn',
      cancelText: 'Hủy',
      variant: 'danger',
      icon: '⚠️'
    })
    if (!confirmed) return

    libraryData.value.categories = libraryData.value.categories.filter(c => c.id !== tCat.id)
    Object.values(libraryData.value.items).forEach(item => {
      if (item.categoryId === tCat.id) item.categoryId = ''
    })
    await saveLibraryToDisk(`Xóa vĩnh viễn Category: ${tCat.name}`)
  }

  // ==========================================================================
  // 6. THAO TÁC TRÊN ITEM ẢNH & ĐỔI TÊN FILE WINDOWS
  // ==========================================================================
  const handleToggleFavorite = async (img) => {
    const nextState = !img.isFavorite
    const confirmed = await notify.confirm({
      title: nextState ? 'Đánh dấu ảnh quan trọng (Favorite)?' : 'Bỏ đánh dấu sao cho ảnh này?',
      message: 'Trạng thái đánh dấu sao và thời gian updated_at sẽ được đồng bộ lên Firebase.',
      highlightText: img.fileName,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '⭐'
    })
    if (!confirmed) return

    const record = libraryData.value.items[img.key]
    if (record) {
      record.isFavorite = nextState
      record.updated_at = getNowStr()
      await saveLibraryToDisk(`Đổi trạng thái Favorite: ${img.fileName}`)
    }
  }

  const handleSingleCategoryChange = async (img, newCatId, event) => {
    const oldCatId = img.categoryId || ''
    const targetLabel = getCategoryLabel(newCatId)
    const confirmed = await notify.confirm({
      title: 'Xác nhận chuyển Category cho ảnh?',
      message: `Bạn có muốn chuyển ảnh này sang mục "${targetLabel}" và lưu lên Firebase không?`,
      highlightText: `${img.fileName} → ${targetLabel}`,
      confirmText: 'Đồng ý Chuyển',
      cancelText: 'Giữ nguyên',
      variant: 'info',
      icon: '🏷️'
    })
    if (!confirmed) {
      if (event?.target) event.target.value = oldCatId
      return
    }

    const record = libraryData.value.items[img.key]
    if (record) {
      record.categoryId = newCatId
      record.updated_at = getNowStr()
      await saveLibraryToDisk(`Chuyển Category ảnh: ${img.fileName}`)
      notify.success('Đã cập nhật Firebase!', `Đã chuyển "${img.fileName}" sang ${targetLabel}.`)
    }
  }

  const toggleSelectAllVisible = () => {
    if (selectedKeys.value.length === filteredImages.value.length) {
      selectedKeys.value = []
    } else {
      selectedKeys.value = filteredImages.value.map(i => i.key)
    }
  }

  const handleBatchAssignCategory = async () => {
    if (!batchTargetCatId.value || !selectedKeys.value.length) return
    const finalCatId = batchTargetCatId.value === '__CLEAR__' ? '' : batchTargetCatId.value
    const targetLabel = getCategoryLabel(finalCatId)

    const confirmed = await notify.confirm({
      title: 'Xác nhận gán Category hàng loạt trên Firebase?',
      message: `Toàn bộ ${selectedKeys.value.length} ảnh đang chọn sẽ được cập nhật sang "${targetLabel}".`,
      highlightText: `${selectedKeys.value.length} ảnh → ${targetLabel}`,
      confirmText: 'Áp dụng ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '📦'
    })
    if (!confirmed) return

    const now = getNowStr()
    selectedKeys.value.forEach(k => {
      if (libraryData.value.items[k]) {
        libraryData.value.items[k].categoryId = finalCatId
        libraryData.value.items[k].updated_at = now
      }
    })
    selectedKeys.value = []
    batchTargetCatId.value = ''
    await saveLibraryToDisk(`Gán Category hàng loạt sang ${targetLabel}`)
    notify.success('Hoàn tất!', 'Đã phân loại hàng loạt và đồng bộ lên Firebase.')
  }

  const handleSoftDeleteSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Xóa mềm (Soft Delete) bản ghi ảnh này?',
      message: 'Ảnh sẽ được gắn mốc thời gian deleted_at và chuyển vào Thùng rác trên Firebase. File gốc trên ổ đĩa Windows được giữ nguyên 100%.',
      highlightText: img.windowsPath || img.fileName,
      confirmText: 'Đưa vào Thùng rác',
      cancelText: 'Hủy',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    if (libraryData.value.items[img.key]) {
      libraryData.value.items[img.key].deleted_at = now
      libraryData.value.items[img.key].updated_at = now
      await saveLibraryToDisk(`Xóa mềm ảnh: ${img.fileName}`)
      notify.info('Đã đưa vào Thùng rác', `Đã xóa mềm "${img.fileName}".`)
    }
  }

  const handleBatchSoftDeleteItems = async () => {
    if (!selectedKeys.value.length) return
    const confirmed = await notify.confirm({
      title: 'Xóa mềm hàng loạt ảnh đã chọn?',
      message: `Đánh dấu deleted_at cho ${selectedKeys.value.length} ảnh và chuyển vào Thùng rác trên Firebase.`,
      highlightText: `${selectedKeys.value.length} ảnh được chọn`,
      confirmText: 'Xóa mềm tất cả',
      cancelText: 'Hủy',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    selectedKeys.value.forEach(k => {
      if (libraryData.value.items[k]) {
        libraryData.value.items[k].deleted_at = now
        libraryData.value.items[k].updated_at = now
      }
    })
    selectedKeys.value = []
    await saveLibraryToDisk('Xóa mềm hàng loạt ảnh')
  }

  const handleRestoreSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Khôi phục ảnh từ Thùng rác?',
      message: 'Xóa cờ deleted_at và đưa ảnh hiển thị trở lại.',
      highlightText: img.fileName,
      confirmText: 'Khôi phục ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '♻️'
    })
    if (!confirmed) return

    if (libraryData.value.items[img.key]) {
      libraryData.value.items[img.key].deleted_at = null
      libraryData.value.items[img.key].updated_at = getNowStr()
      await saveLibraryToDisk(`Khôi phục ảnh: ${img.fileName}`)
      notify.success('Đã khôi phục!', `"${img.fileName}" đã hoạt động trở lại.`)
    }
  }

  const handlePermanentDeleteSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Xóa vĩnh viễn bản ghi này khỏi Firebase?',
      message: 'Bản ghi sẽ bị xóa khỏi nhánh cmg_ref_library trên Firebase (File ảnh thật trên ổ đĩa Windows vẫn giữ nguyên).',
      highlightText: img.windowsPath || img.fileName,
      confirmText: 'Xóa khỏi Firebase',
      cancelText: 'Hủy',
      variant: 'danger',
      icon: '⚠️'
    })
    if (!confirmed) return

    delete libraryData.value.items[img.key]
    await saveLibraryToDisk(`Xóa vĩnh viễn bản ghi ảnh: ${img.fileName}`)
  }

  const confirmRenameFileOnWindows = async (item, finalNewName) => {
    const confirmed = await notify.confirm({
      title: 'Xác nhận đổi tên file thật trên ổ đĩa Windows?',
      message: 'File trên ổ cứng Windows sẽ được đổi tên trực tiếp, đồng thời đường dẫn vật lý trên Firebase sẽ được cập nhật đồng bộ.',
      highlightText: `${item.fileName}  ➔  ${finalNewName}`,
      confirmText: 'Đồng ý Đổi tên & Lưu Firebase',
      cancelText: 'Hủy bỏ',
      variant: 'warning',
      icon: '✏️'
    })
    if (!confirmed) return false

    try {
      let newWindowsPath = ''
      let folderPath = item.folderPath || ''

      if (isLocalViteServer.value) {
        const res = await fetch(`${API_BASE}/rename_file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldWindowsPath: item.windowsPath,
            newFileName: finalNewName
          })
        })
        const json = await res.json()
        if (!json.ok) {
          notify.error('Không thể đổi tên file', json.error)
          return false
        }
        newWindowsPath = json.newWindowsPath
        folderPath = json.folderPath
      } else {
        const runtime = browserRuntimeMap.value[item.key] || browserRuntimeMap.value[item.fileName]
        if (!runtime?.fileHandle) {
          notify.warning('Chưa cấp quyền thư mục', 'Hãy bấm "Mở lại Folder" hoặc "Chọn Folder trên Windows" để cấp quyền đọc/ghi cho trình duyệt trước khi đổi tên!')
          return false
        }
        if (typeof runtime.fileHandle.move === 'function') {
          await runtime.fileHandle.move(finalNewName)
        }
        newWindowsPath = folderPath ? `${folderPath}\\${finalNewName}` : finalNewName
        browserRuntimeMap.value[newWindowsPath] = runtime
        browserRuntimeMap.value[finalNewName] = runtime
      }

      const now = getNowStr()
      const oldRecord = libraryData.value.items[item.key] || {}
      delete libraryData.value.items[item.key]

      libraryData.value.items[newWindowsPath] = {
        ...oldRecord,
        key: newWindowsPath,
        fileName: finalNewName,
        windowsPath: newWindowsPath,
        folderPath,
        updated_at: now
      }

      renamingItem.value = null
      await saveLibraryToDisk(`Đổi tên file Windows: ${item.fileName} -> ${finalNewName}`)
      notify.success('Đổi tên thành công!', `Đã đổi thành "${finalNewName}" và đồng bộ lên Firebase.`)
      return true
    } catch (err) {
      notify.error('Lỗi đổi tên file', err.message)
      return false
    }
  }

  // ==========================================================================
  // 7. BACKUP & ROLLBACK TRỰC TIẾP TRÊN FIREBASE (`cmg_ref_library_backup`)
  // ==========================================================================
  const handleManualBackup = async () => {
    const confirmed = await notify.confirm({
      title: 'Tạo bản sao lưu lên nhánh Firebase Backup?',
      message: 'Toàn bộ trạng thái hiện tại sẽ được sao chép sang nhánh dự phòng cmg_ref_library_backup trên Firebase.',
      highlightText: `${activeItemsList.value.length} ảnh & ${activeCategoriesList.value.length} Category`,
      confirmText: 'Sao lưu lên Firebase',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '🛡️'
    })
    if (!confirmed) return

    try {
      const now = getNowStr()
      const serialized = serializeForFirebase(libraryData.value)
      serialized.backupSavedAt = now
      serialized.backupReason = 'Sao lưu thủ công bởi Admin'
      await set(dbRef(db, FB_BACKUP_PATH), serialized)
      notify.success('Đã tạo bản Backup!', 'Nhánh cmg_ref_library_backup trên Firebase đã được cập nhật.')
    } catch (err) {
      notify.error('Lỗi tạo Backup trên Firebase', err.message)
    }
  }

  const handleRollbackBackup = async () => {
    if (!backupMeta.value) return
    const confirmed = await notify.confirm({
      title: 'Khôi phục (Rollback) từ nhánh Firebase Backup?',
      message: 'Dữ liệu từ nhánh cmg_ref_library_backup sẽ được khôi phục đè lên nhánh chính cmg_ref_library (Trạng thái hiện tại cũng sẽ được hoán đổi sang Backup để bạn có thể quay lại nếu cần).',
      highlightText: `Bản lưu lúc: ${backupMeta.value.updatedAt} (${backupMeta.value.backupReason})`,
      confirmText: '⏪ Đồng ý Khôi phục Version trước',
      cancelText: 'Hủy bỏ',
      variant: 'warning',
      icon: '⏪'
    })
    if (!confirmed) return

    try {
      const mainNodeRef = dbRef(db, FB_MAIN_PATH)
      const backupNodeRef = dbRef(db, FB_BACKUP_PATH)

      const [backupSnap, mainSnap] = await Promise.all([
        get(backupNodeRef),
        get(mainNodeRef)
      ])

      if (!backupSnap.exists()) {
        notify.error('Không tìm thấy bản Backup', 'Nhánh cmg_ref_library_backup trên Firebase đang trống!')
        return
      }

      const now = getNowStr()
      const backupVal = backupSnap.val()
      const currentVal = mainSnap.exists() ? mainSnap.val() : null

      // Hoán đổi bản hiện tại vào nhánh Backup trước khi ghi đè
      if (currentVal) {
        currentVal.backupReason = 'Bản lưu tự động trước khi Rollback'
        currentVal.backupSavedAt = now
        await set(backupNodeRef, currentVal)
      }

      backupVal.updatedAt = now
      await set(mainNodeRef, backupVal)
      notify.success('Đã khôi phục thành công!', 'Dữ liệu trên Firebase đã quay về phiên bản Backup trước đó.')
    } catch (err) {
      notify.error('Lỗi khôi phục Backup', err.message)
    }
  }

  return {
    isFirebaseSynced,
    isSavingFirebase,
    isLocalViteServer,
    savedBrowserDirHandle,
    libraryData,
    backupMeta,
    folderPathInput,
    importTargetCategoryId,
    isScanning,
    selectedFilter,
    includeSubcategoriesInView,
    showTrashedCategories,
    searchQuery,
    selectedKeys,
    batchTargetCatId,
    categoryModal,
    renamingItem,
    previewingItem,
    activeCategoriesList,
    trashedCategoriesList,
    flattenedCategoryTree,
    availableParentCategoryOptions,
    activeItemsList,
    trashedItemsList,
    favoriteItemsCount,
    uncategorizedItemsCount,
    filteredImages,
    getImageStreamUrl,
    getCategoryLabel,
    countImagesForCategoryNode,
    loadLibraryFromDisk,
    exportJsonFile,
    reconnectSavedBrowserFolder,
    handlePickWindowsFolderDialog,
    handleScanTypedFolderPath,
    openCreateCategoryModal,
    openEditCategoryModal,
    handleSubmitCategoryModal,
    handleMoveCategoryOrder,
    handleSoftDeleteCategory,
    handleRestoreCategory,
    handlePermanentDeleteCategory,
    handleToggleFavorite,
    handleSingleCategoryChange,
    toggleSelectAllVisible,
    handleBatchAssignCategory,
    handleSoftDeleteSingleItem,
    handleBatchSoftDeleteItems,
    handleRestoreSingleItem,
    handlePermanentDeleteSingleItem,
    confirmRenameFileOnWindows,
    handleManualBackup,
    handleRollbackBackup
  }
})
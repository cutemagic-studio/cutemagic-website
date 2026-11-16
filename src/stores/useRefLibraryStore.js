// src/stores/useRefLibraryStore.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ref as dbRef, onValue, set, get } from 'firebase/database'
import { db } from '../firebase'
import bundledRefLibraryJson from '../data/ref_library.json'
import { useNotificationStore } from './useNotificationStore'

import {
  API_BASE,
  FB_PHYSICAL_MAIN_PATH,
  FB_PHYSICAL_BACKUP_PATH,
  FB_VIRTUAL_MAIN_PATH,
  FB_VIRTUAL_BACKUP_PATH,
  FB_LEGACY_MAIN_PATH,
  getNowStr,
  loadHandleFromIdb,
  serializeTableForFirebase,
  deserializeTableFromFirebase,
  splitLegacyCombinedData
} from './ref_library/refLibraryHelpers'
import { createRefCategoryTreeModule } from './ref_library/refCategoryTreeLogic'
import { createRefFolderScannerModule } from './ref_library/refFolderScannerLogic'
import { createRefItemActionsModule } from './ref_library/refItemActionsLogic'

export const useRefLibraryStore = defineStore('refLibrary', () => {
  const notify = useNotificationStore()

  const isFirebaseSynced = ref(false)
  const isSavingFirebase = ref(false)
  const isLocalViteServer = ref(Boolean(import.meta.env.DEV))
  let isRealtimeListening = false

  // BẢNG 1: Kho Thật trên ổ đĩa Windows (`cmg_ref_physical`)
  const physicalData = ref({
    version: 3,
    lastFolderPath: '',
    updatedAt: '',
    categories: [],
    items: {}
  })

  // BẢNG 2: Kho Category Ảo (`cmg_ref_virtual`)
  const virtualData = ref({
    version: 3,
    updatedAt: '',
    categories: [],
    items: {}
  })

  // Tương thích hiển thị thời gian cập nhật chung trên Header
  const libraryData = computed(() => ({
    updatedAt: virtualData.value.updatedAt || physicalData.value.updatedAt || '',
    lastFolderPath: physicalData.value.lastFolderPath || ''
  }))

  const backupMeta = ref(null)
  const savedBrowserDirHandle = ref(null)
  const browserRuntimeMap = ref({})

  const folderPathInput = ref('')
  const importTargetCategoryId = ref('__AUTO_FOLDER__')
  const isScanning = ref(false)

  const selectedFilter = ref('ALL')
  const includeSubcategoriesInView = ref(true)
  const showTrashedCategories = ref(false)
  const searchQuery = ref('')
  const selectedKeys = ref([])
  const batchTargetCatId = ref('')

  // Phân trang
  const currentPage = ref(1)
  const itemsPerPage = ref(18)

  const categoryModal = ref({
    show: false,
    isEdit: false,
    form: {
      id: '',
      name: '',
      icon: '📌',
      parentId: null,
      sortOrder: 1,
      isPhysicalFolder: false,
      created_at: '',
      updated_at: '',
      deleted_at: null
    }
  })
  const renamingItem = ref(null)
  const previewingItem = ref(null)

  // ==========================================================================
  // 1. ĐỒNG BỘ 2 BẢNG RIÊNG BIỆT TRÊN FIREBASE (`cmg_ref_physical` & `cmg_ref_virtual`)
  // ==========================================================================
  const loadLibraryFromDisk = async () => {
    savedBrowserDirHandle.value = await loadHandleFromIdb()

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

    const physMainRef = dbRef(db, FB_PHYSICAL_MAIN_PATH)
    const physBkRef = dbRef(db, FB_PHYSICAL_BACKUP_PATH)
    const virtMainRef = dbRef(db, FB_VIRTUAL_MAIN_PATH)
    const virtBkRef = dbRef(db, FB_VIRTUAL_BACKUP_PATH)

    // Kiểm tra và tự động di cư từ bảng cũ `cmg_ref_library` sang 2 bảng mới nếu chưa tồn tại
    try {
      const [physSnap, virtSnap] = await Promise.all([get(physMainRef), get(virtMainRef)])
      if (!physSnap.exists() && !virtSnap.exists()) {
        const legacySnap = await get(dbRef(db, FB_LEGACY_MAIN_PATH))
        const sourceSeed = legacySnap.exists() ? legacySnap.val() : bundledRefLibraryJson
        const { physicalTable, virtualTable } = splitLegacyCombinedData(sourceSeed)

        physicalData.value = physicalTable
        virtualData.value = virtualTable

        await Promise.all([
          set(physMainRef, serializeTableForFirebase(physicalTable, true)),
          set(virtMainRef, serializeTableForFirebase(virtualTable, false))
        ])
      }
    } catch (e) {
      console.warn('Migration check warning:', e)
    }

    // Lắng nghe Bảng 1: `cmg_ref_physical`
    onValue(physMainRef, (snapshot) => {
      if (snapshot.exists()) {
        const parsed = deserializeTableFromFirebase(snapshot.val(), true)
        physicalData.value = parsed
        if (parsed.lastFolderPath && !folderPathInput.value) {
          folderPathInput.value = parsed.lastFolderPath
        }
        isFirebaseSynced.value = true
      }
    })

    // Lắng nghe Bảng 2: `cmg_ref_virtual`
    onValue(virtMainRef, (snapshot) => {
      if (snapshot.exists()) {
        const parsed = deserializeTableFromFirebase(snapshot.val(), false)
        virtualData.value = parsed
        isFirebaseSynced.value = true
      }
    })

    // Lắng nghe thông tin Backup của cả 2 bảng
    const updateBackupBanner = (bkSnap) => {
      if (bkSnap.exists()) {
        const bk = bkSnap.val()
        backupMeta.value = {
          updatedAt: bk.backupSavedAt || bk.updatedAt || 'Mới',
          backupReason: bk.backupReason || 'Firebase 2-Table Backup'
        }
      }
    }
    onValue(virtBkRef, updateBackupBanner)
    onValue(physBkRef, updateBackupBanner)
  }

  // Lưu riêng Bảng Thật (`cmg_ref_physical` + `cmg_ref_physical_backup`)
  const savePhysicalToFirebase = async (reason = 'Cập nhật Bảng Folder Thật') => {
    isSavingFirebase.value = true
    const now = getNowStr()
    const mainRef = dbRef(db, FB_PHYSICAL_MAIN_PATH)
    const bkRef = dbRef(db, FB_PHYSICAL_BACKUP_PATH)
    try {
      const curSnap = await get(mainRef)
      if (curSnap.exists()) {
        const curVal = curSnap.val()
        curVal.backupReason = reason
        curVal.backupSavedAt = now
        await set(bkRef, curVal)
      }
      physicalData.value.updatedAt = now
      await set(mainRef, serializeTableForFirebase(physicalData.value, true))
      return true
    } catch (err) {
      notify.error('Lỗi lưu Bảng Thật Firebase', err.message)
      return false
    } finally {
      isSavingFirebase.value = false
    }
  }

  // Lưu riêng Bảng Ảo (`cmg_ref_virtual` + `cmg_ref_virtual_backup`)
  const saveVirtualToFirebase = async (reason = 'Cập nhật Bảng Category Ảo') => {
    isSavingFirebase.value = true
    const now = getNowStr()
    const mainRef = dbRef(db, FB_VIRTUAL_MAIN_PATH)
    const bkRef = dbRef(db, FB_VIRTUAL_BACKUP_PATH)
    try {
      const curSnap = await get(mainRef)
      if (curSnap.exists()) {
        const curVal = curSnap.val()
        curVal.backupReason = reason
        curVal.backupSavedAt = now
        await set(bkRef, curVal)
      }
      virtualData.value.updatedAt = now
      await set(mainRef, serializeTableForFirebase(virtualData.value, false))
      return true
    } catch (err) {
      notify.error('Lỗi lưu Bảng Ảo Firebase', err.message)
      return false
    } finally {
      isSavingFirebase.value = false
    }
  }

  // Lưu đồng thời cả 2 Bảng (Dùng khi Refresh thư mục Windows hoặc Đổi tên file)
  const saveBothTablesToFirebase = async (reason = 'Đồng bộ 2 Bảng Thật & Ảo') => {
    isSavingFirebase.value = true
    const now = getNowStr()
    const physMainRef = dbRef(db, FB_PHYSICAL_MAIN_PATH)
    const physBkRef = dbRef(db, FB_PHYSICAL_BACKUP_PATH)
    const virtMainRef = dbRef(db, FB_VIRTUAL_MAIN_PATH)
    const virtBkRef = dbRef(db, FB_VIRTUAL_BACKUP_PATH)

    try {
      const [physSnap, virtSnap] = await Promise.all([get(physMainRef), get(virtMainRef)])
      const backupPromises = []

      if (physSnap.exists()) {
        const pVal = physSnap.val()
        pVal.backupReason = reason
        pVal.backupSavedAt = now
        backupPromises.push(set(physBkRef, pVal))
      }
      if (virtSnap.exists()) {
        const vVal = virtSnap.val()
        vVal.backupReason = reason
        vVal.backupSavedAt = now
        backupPromises.push(set(virtBkRef, vVal))
      }
      await Promise.all(backupPromises)

      physicalData.value.updatedAt = now
      virtualData.value.updatedAt = now

      await Promise.all([
        set(physMainRef, serializeTableForFirebase(physicalData.value, true)),
        set(virtMainRef, serializeTableForFirebase(virtualData.value, false))
      ])
      return true
    } catch (err) {
      notify.error('Lỗi đồng bộ 2 Bảng Firebase', err.message)
      return false
    } finally {
      isSavingFirebase.value = false
    }
  }

  const exportJsonFile = () => {
    const payload = {
      exportedAt: getNowStr(),
      cmg_ref_physical: physicalData.value,
      cmg_ref_virtual: virtualData.value
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ref_library_2tables_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getImageStreamUrl = (img) => {
    if (!img) return ''
    const runtime = browserRuntimeMap.value[img.key] || browserRuntimeMap.value[img.fileName]
    if (runtime?.previewUrl) return runtime.previewUrl
    if (isLocalViteServer.value && img.windowsPath) {
      return `${API_BASE}/image?path=${encodeURIComponent(img.windowsPath)}&v=${encodeURIComponent(img.updated_at || '')}`
    }
    return ''
  }

  // ========================================================================== 
  // 2. KHỞI TẠO MODULE CÂY CATEGORY & BỘ ĐẾM CHÍNH XÁC (LOẠI BỎ CATEGORY ĐÃ XÓA)
  // ==========================================================================
  const categoryTreeModule = createRefCategoryTreeModule({
    physicalData,
    virtualData,
    selectedFilter,
    categoryModal,
    notify,
    saveVirtualToFirebase,
    savePhysicalToFirebase,
    saveBothTablesToFirebase
  })

  // Tập ID của các Category Thật & Category Ảo đang hoạt động (Không bị xóa mềm)
  const activePhysicalCatIdSet = computed(
    () => new Set(categoryTreeModule.activePhysicalCategoriesList.value.map(c => c.id))
  )
  const activeVirtualCatIdSet = computed(
    () => new Set(categoryTreeModule.activeVirtualCategoriesList.value.map(c => c.id))
  )

  // Kết hợp thông tin Ảnh từ Bảng Thật (`physicalData.items`) và Bảng Ảo (`virtualData.items`)
  const allItemsArray = computed(() => {
    const physItems = physicalData.value.items || {}
    const virtItems = virtualData.value.items || {}
    const allKeys = new Set([...Object.keys(physItems), ...Object.keys(virtItems)])
    const mergedList = []

    allKeys.forEach(key => {
      const pItem = physItems[key]
      const vItem = virtItems[key]
      const base = pItem || vItem
      if (!base) return

      const rawPhysCatId = pItem?.physicalCategoryId || vItem?.physicalCategoryId || ''
      const rawVirtCatId = vItem?.categoryId || ''

      // Nếu Category Ảo đã bị xóa mềm -> không tính bức ảnh này vào Category Ảo đó nữa
      const effectiveVirtualCatId =
        rawVirtCatId && activeVirtualCatIdSet.value.has(rawVirtCatId) ? rawVirtCatId : ''

      // Kiểm tra xem Category Thật chứa bức ảnh này có bị xóa không
      const isPhysicalCategoryDeleted =
        Boolean(rawPhysCatId) && !activePhysicalCatIdSet.value.has(rawPhysCatId)

      const effectiveDeletedAt =
        pItem?.deleted_at || vItem?.deleted_at || (isPhysicalCategoryDeleted ? ' Category Đã Xóa' : null)

      mergedList.push({
        key,
        fileName: pItem?.fileName || vItem?.fileName || key,
        windowsPath: pItem?.windowsPath || vItem?.windowsPath || key,
        folderPath: pItem?.folderPath || vItem?.folderPath || '',
        physicalCategoryId: rawPhysCatId && activePhysicalCatIdSet.value.has(rawPhysCatId) ? rawPhysCatId : '',
        categoryId: effectiveVirtualCatId,
        isFavorite: Boolean(vItem?.isFavorite ?? pItem?.isFavorite),
        created_at: pItem?.created_at || vItem?.created_at || '',
        updated_at: vItem?.updated_at || pItem?.updated_at || '',
        deleted_at: effectiveDeletedAt
      })
    })

    return mergedList
  })

  // Tổng số ảnh đang hoạt động (Đã loại trừ ảnh xóa mềm và ảnh nằm trong Category đã xóa)
  const activeItemsList = computed(() => allItemsArray.value.filter(i => !i.deleted_at))

  const trashedItemsList = computed(() =>
    allItemsArray.value.filter(i => Boolean(i.deleted_at) && i.deleted_at !== ' Category Đã Xóa')
  )

  const favoriteItemsCount = computed(() => activeItemsList.value.filter(i => i.isFavorite).length)

  const uncategorizedItemsCount = computed(() =>
    activeItemsList.value.filter(i => !i.categoryId).length
  )

  // Kiểm tra ảnh khớp với tập ID Category đang chọn (Trả về 0 ngay lập tức nếu Category đã bị xóa)
  const itemMatchesCategorySet = (item, allowedSet) => {
    if (!allowedSet || allowedSet.size === 0) return false
    return (
      (item.categoryId && allowedSet.has(item.categoryId)) ||
      (item.physicalCategoryId && allowedSet.has(item.physicalCategoryId))
    )
  }

  const countImagesForCategoryNode = (catId) => {
    const allowedSet = includeSubcategoriesInView.value
      ? categoryTreeModule.getDescendantCategoryIds(catId, false)
      : (activePhysicalCatIdSet.value.has(catId) || activeVirtualCatIdSet.value.has(catId)
          ? new Set([catId])
          : new Set())

    if (allowedSet.size === 0) return 0
    return activeItemsList.value.filter(i => itemMatchesCategorySet(i, allowedSet)).length
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
      const allowedSet = includeSubcategoriesInView.value
        ? categoryTreeModule.getDescendantCategoryIds(selectedFilter.value, false)
        : new Set([selectedFilter.value])

      list = list.filter(i => itemMatchesCategorySet(i, allowedSet))
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

  // Category Thật đang được chọn (Để hiển thị nút Refresh nhanh trên Header/Sidebar)
  const selectedPhysicalCategoryNode = computed(() => {
    const node = categoryTreeModule.findCategoryNodeById(selectedFilter.value)
    return node?.isPhysicalFolder ? node : null
  })

  // Phân trang
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredImages.value.length / itemsPerPage.value))
  )

  const paginatedImages = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredImages.value.slice(start, start + itemsPerPage.value)
  })

  watch([selectedFilter, includeSubcategoriesInView, searchQuery, itemsPerPage], () => {
    currentPage.value = 1
  })

  watch(totalPages, (maxPage) => {
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  })

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(Number(page) || 1, totalPages.value))
    currentPage.value = p
  }

  const folderScannerModule = createRefFolderScannerModule({
    isLocalViteServer,
    physicalData,
    virtualData,
    folderPathInput,
    importTargetCategoryId,
    isScanning,
    selectedFilter,
    savedBrowserDirHandle,
    browserRuntimeMap,
    getDescendantCategoryIds: categoryTreeModule.getDescendantCategoryIds,
    notify,
    saveBothTablesToFirebase
  })

  const itemActionsModule = createRefItemActionsModule({
    isLocalViteServer,
    physicalData,
    virtualData,
    backupMeta,
    browserRuntimeMap,
    selectedKeys,
    batchTargetCatId,
    renamingItem,
    activeItemsList,
    activeCategoriesList: categoryTreeModule.activeCategoriesList,
    filteredImages,
    paginatedImages,
    getCategoryLabel: categoryTreeModule.getCategoryLabel,
    notify,
    saveVirtualToFirebase,
    saveBothTablesToFirebase
  })

  return {
    isFirebaseSynced,
    isSavingFirebase,
    isLocalViteServer,
    savedBrowserDirHandle,
    physicalData,
    virtualData,
    libraryData,
    backupMeta,
    folderPathInput,
    importTargetCategoryId,
    isScanning,
    selectedFilter,
    selectedPhysicalCategoryNode,
    includeSubcategoriesInView,
    showTrashedCategories,
    searchQuery,
    selectedKeys,
    batchTargetCatId,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedImages,
    goToPage,
    categoryModal,
    renamingItem,
    previewingItem,
    activeItemsList,
    trashedItemsList,
    favoriteItemsCount,
    uncategorizedItemsCount,
    filteredImages,
    getImageStreamUrl,
    countImagesForCategoryNode,
    loadLibraryFromDisk,
    savePhysicalToFirebase,
    saveVirtualToFirebase,
    saveBothTablesToFirebase,
    exportJsonFile,
    ...categoryTreeModule,
    ...folderScannerModule,
    ...itemActionsModule
  }
})
// src/stores/ref_library/refItemActionsLogic.js
import { ref } from 'vue'
import { ref as dbRef, set, get } from 'firebase/database'
import { db } from '../../firebase'
import {
  API_BASE,
  FB_PHYSICAL_MAIN_PATH,
  FB_PHYSICAL_BACKUP_PATH,
  FB_VIRTUAL_MAIN_PATH,
  FB_VIRTUAL_BACKUP_PATH,
  getNowStr,
  normalizeWinPath,
  serializeTableForFirebase
} from './refLibraryHelpers'

export function createRefItemActionsModule({
  isLocalViteServer,
  physicalData,
  virtualData,
  backupMeta,
  browserRuntimeMap,
  selectedKeys,
  batchTargetCatId,
  renamingItem,
  activeItemsList,
  activeCategoriesList,
  filteredImages,
  paginatedImages,
  getCategoryLabel,
  notify,
  saveVirtualToFirebase,
  saveBothTablesToFirebase
}) {
  const draggingImageKeys = ref([])
  const dragOverCategoryId = ref(null)

  // Đảm bảo bản ghi ảnh tồn tại trong Bảng Ảo (`virtualData.items`) khi gán Category Ảo hoặc gắn Sao
  const ensureVirtualItemRecord = (key, now = getNowStr()) => {
    const cleanKey = normalizeWinPath(key)
    const physRecord = physicalData.value.items[cleanKey]
    const existingVirt = virtualData.value.items[cleanKey]

    if (existingVirt) {
      if (physRecord) {
        existingVirt.fileName = physRecord.fileName
        existingVirt.windowsPath = physRecord.windowsPath
        existingVirt.folderPath = physRecord.folderPath
        existingVirt.physicalCategoryId = physRecord.physicalCategoryId
      }
      return existingVirt
    }

    const created = {
      key: cleanKey,
      fileName: physRecord?.fileName || cleanKey.split('\\').pop() || cleanKey,
      windowsPath: physRecord?.windowsPath || cleanKey,
      folderPath: physRecord?.folderPath || '',
      physicalCategoryId: physRecord?.physicalCategoryId || '',
      categoryId: '',
      isFavorite: false,
      created_at: physRecord?.created_at || now,
      updated_at: now,
      deleted_at: null
    }
    virtualData.value.items[cleanKey] = created
    return created
  }

  // ==========================================================================
  // KÉO & THẢ ẢNH VÀO BẢNG CATEGORY ẢO (`cmg_ref_virtual`)
  // ==========================================================================
  const handleDragStartImage = (img, event) => {
    if (!img || img.deleted_at) {
      event?.preventDefault()
      return
    }

    if (selectedKeys.value.includes(img.key)) {
      draggingImageKeys.value = [...selectedKeys.value]
    } else {
      draggingImageKeys.value = [img.key]
    }

    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('text/plain', JSON.stringify(draggingImageKeys.value))
    }
  }

  const handleDragEndImage = () => {
    draggingImageKeys.value = []
    dragOverCategoryId.value = null
  }

  const handleDragOverCategory = (targetNodeOrType, event) => {
    if (!draggingImageKeys.value.length) return

    const isUncategorizedSlot = targetNodeOrType === 'UNCATEGORIZED'
    const targetId = isUncategorizedSlot ? 'UNCATEGORIZED' : targetNodeOrType?.id
    const isPhysical = !isUncategorizedSlot && Boolean(targetNodeOrType?.isPhysicalFolder)

    dragOverCategoryId.value = targetId

    if (event?.dataTransfer) {
      event.dataTransfer.dropEffect = isPhysical ? 'none' : 'copy'
    }
  }

  const handleDragLeaveCategory = (targetId) => {
    if (dragOverCategoryId.value === targetId) {
      dragOverCategoryId.value = null
    }
  }

  const handleDropToCategory = async (targetNodeOrType) => {
    const keysToAssign = [...draggingImageKeys.value]
    draggingImageKeys.value = []
    dragOverCategoryId.value = null

    if (!keysToAssign.length) return

    const isUncategorizedSlot = targetNodeOrType === 'UNCATEGORIZED'

    if (!isUncategorizedSlot && targetNodeOrType?.isPhysicalFolder) {
      notify.warning(
        'Thư mục Windows Chỉ Đọc (Read-Only) 🔒',
        `Mục "${targetNodeOrType.name}" thuộc bảng Folder Thật trên ổ đĩa Windows nên không nhận ảnh kéo thả. Bạn chỉ có thể thả ảnh vào các Category Ảo (✨)!`
      )
      return
    }

    const finalCatId = isUncategorizedSlot ? '' : (targetNodeOrType?.id || '')
    const targetLabel = isUncategorizedSlot
      ? '❓ Chưa phân loại (Gỡ khỏi Bảng Category Ảo)'
      : `${targetNodeOrType.icon || '📌'} ${targetNodeOrType.name}`

    const validKeys = keysToAssign.filter(k => {
      const pItem = physicalData.value.items[k]
      const vItem = virtualData.value.items[k]
      return (pItem && !pItem.deleted_at) || (vItem && !vItem.deleted_at)
    })

    if (!validKeys.length) return

    const firstFileName =
      physicalData.value.items[validKeys[0]]?.fileName ||
      virtualData.value.items[validKeys[0]]?.fileName ||
      validKeys[0]

    const sampleNames =
      validKeys.length === 1
        ? firstFileName
        : `${validKeys.length} hình ảnh (${firstFileName}...)`

    const confirmed = await notify.confirm({
      title: isUncategorizedSlot
        ? 'Xác nhận gỡ ảnh khỏi Category Ảo?'
        : 'Xác nhận thả ảnh vào Bảng Category Ảo?',
      message: isUncategorizedSlot
        ? `Gỡ phân loại Category Ảo cho ${validKeys.length} ảnh trong bảng cmg_ref_virtual.`
        : `Lưu ${validKeys.length} ảnh vừa kéo thả vào Category Ảo "${targetLabel}" trong bảng cmg_ref_virtual trên Firebase.`,
      highlightText: `${sampleNames}  ➔  ${targetLabel}`,
      confirmText: 'Đồng ý Lưu Bảng Ảo',
      cancelText: 'Hủy bỏ',
      variant: 'info',
      icon: '📥'
    })
    if (!confirmed) return

    const now = getNowStr()
    validKeys.forEach(k => {
      const rec = ensureVirtualItemRecord(k, now)
      rec.categoryId = finalCatId
      rec.updated_at = now
    })

    if (selectedKeys.value.length > 0) {
      selectedKeys.value = []
    }

    await saveVirtualToFirebase(`Kéo thả ${validKeys.length} ảnh vào ${targetLabel}`)
    notify.success(
      'Đã đồng bộ Bảng Category Ảo!',
      `Đã cập nhật ${validKeys.length} ảnh vào "${targetLabel}".`
    )
  }

  // ==========================================================================
  // CÁC THAO TÁC TRÊN ITEM ẢNH
  // ==========================================================================
  const handleToggleFavorite = async (img) => {
    const nextState = !img.isFavorite
    const confirmed = await notify.confirm({
      title: nextState ? 'Đánh dấu ảnh quan trọng (Favorite)?' : 'Bỏ đánh dấu sao cho ảnh này?',
      message: 'Trạng thái đánh dấu sao sẽ được đồng bộ vào bảng cmg_ref_virtual trên Firebase.',
      highlightText: img.fileName,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '⭐'
    })
    if (!confirmed) return

    const now = getNowStr()
    const rec = ensureVirtualItemRecord(img.key, now)
    rec.isFavorite = nextState
    rec.updated_at = now
    if (physicalData.value.items[img.key]) {
      physicalData.value.items[img.key].isFavorite = nextState
    }
    await saveVirtualToFirebase(`Đổi trạng thái Favorite: ${img.fileName}`)
  }

  const handleSingleCategoryChange = async (img, newCatId, event) => {
    const oldCatId = img.categoryId || ''
    const targetLabel = getCategoryLabel(newCatId)
    const confirmed = await notify.confirm({
      title: 'Xác nhận chuyển Category Ảo cho ảnh?',
      message: `Bạn có muốn chuyển ảnh này sang Category Ảo "${targetLabel}" trong bảng cmg_ref_virtual không?`,
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

    const now = getNowStr()
    const rec = ensureVirtualItemRecord(img.key, now)
    rec.categoryId = newCatId
    rec.updated_at = now
    await saveVirtualToFirebase(`Chuyển Category ảo cho ảnh: ${img.fileName}`)
    notify.success('Đã cập nhật Bảng Ảo!', `Đã chuyển "${img.fileName}" sang ${targetLabel}.`)
  }

  const toggleSelectAllVisible = () => {
    if (selectedKeys.value.length === filteredImages.value.length) {
      selectedKeys.value = []
    } else {
      selectedKeys.value = filteredImages.value.map(i => i.key)
    }
  }

  const toggleSelectCurrentPage = () => {
    const pageKeys = paginatedImages.value.map(i => i.key)
    const allPageSelected = pageKeys.length > 0 && pageKeys.every(k => selectedKeys.value.includes(k))
    if (allPageSelected) {
      const pageSet = new Set(pageKeys)
      selectedKeys.value = selectedKeys.value.filter(k => !pageSet.has(k))
    } else {
      const merged = new Set([...selectedKeys.value, ...pageKeys])
      selectedKeys.value = Array.from(merged)
    }
  }

  const handleBatchAssignCategory = async () => {
    if (!batchTargetCatId.value || !selectedKeys.value.length) return
    const finalCatId = batchTargetCatId.value === '__CLEAR__' ? '' : batchTargetCatId.value
    const targetLabel = getCategoryLabel(finalCatId)

    const confirmed = await notify.confirm({
      title: 'Xác nhận gán Category Ảo hàng loạt?',
      message: `Toàn bộ ${selectedKeys.value.length} ảnh đang chọn sẽ được lưu vào "${targetLabel}" trong bảng cmg_ref_virtual.`,
      highlightText: `${selectedKeys.value.length} ảnh → ${targetLabel}`,
      confirmText: 'Áp dụng ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '📦'
    })
    if (!confirmed) return

    const now = getNowStr()
    selectedKeys.value.forEach(k => {
      const rec = ensureVirtualItemRecord(k, now)
      rec.categoryId = finalCatId
      rec.updated_at = now
    })
    selectedKeys.value = []
    batchTargetCatId.value = ''
    await saveVirtualToFirebase(`Gán Category ảo hàng loạt sang ${targetLabel}`)
    notify.success('Hoàn tất!', 'Đã phân loại hàng loạt vào Bảng Category Ảo.')
  }

  const handleSoftDeleteSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Xóa mềm (Soft Delete) bản ghi ảnh này?',
      message: 'Ảnh sẽ được gắn mốc thời gian deleted_at ở cả Bảng Thật & Bảng Ảo để đưa vào Thùng rác (và không tính vào số lượng ảnh hoạt động). File gốc trên ổ đĩa Windows được giữ nguyên 100%.',
      highlightText: img.windowsPath || img.fileName,
      confirmText: 'Đưa vào Thùng rác',
      cancelText: 'Hủy',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    if (physicalData.value.items[img.key]) {
      physicalData.value.items[img.key].deleted_at = now
      physicalData.value.items[img.key].updated_at = now
    }
    if (virtualData.value.items[img.key]) {
      virtualData.value.items[img.key].deleted_at = now
      virtualData.value.items[img.key].updated_at = now
    }
    await saveBothTablesToFirebase(`Xóa mềm ảnh: ${img.fileName}`)
    notify.info('Đã đưa vào Thùng rác', `Đã xóa mềm "${img.fileName}".`)
  }

  const handleBatchSoftDeleteItems = async () => {
    if (!selectedKeys.value.length) return
    const confirmed = await notify.confirm({
      title: 'Xóa mềm hàng loạt ảnh đã chọn?',
      message: `Đánh dấu deleted_at cho ${selectedKeys.value.length} ảnh và chuyển vào Thùng rác.`,
      highlightText: `${selectedKeys.value.length} ảnh được chọn`,
      confirmText: 'Xóa mềm tất cả',
      cancelText: 'Hủy',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    selectedKeys.value.forEach(k => {
      if (physicalData.value.items[k]) {
        physicalData.value.items[k].deleted_at = now
        physicalData.value.items[k].updated_at = now
      }
      if (virtualData.value.items[k]) {
        virtualData.value.items[k].deleted_at = now
        virtualData.value.items[k].updated_at = now
      }
    })
    selectedKeys.value = []
    await saveBothTablesToFirebase('Xóa mềm hàng loạt ảnh')
  }

  const handleRestoreSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Khôi phục ảnh từ Thùng rác?',
      message: 'Xóa cờ deleted_at ở cả 2 bảng và đưa ảnh hiển thị trở lại.',
      highlightText: img.fileName,
      confirmText: 'Khôi phục ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '♻️'
    })
    if (!confirmed) return

    const now = getNowStr()
    if (physicalData.value.items[img.key]) {
      physicalData.value.items[img.key].deleted_at = null
      physicalData.value.items[img.key].updated_at = now
    }
    if (virtualData.value.items[img.key]) {
      virtualData.value.items[img.key].deleted_at = null
      virtualData.value.items[img.key].updated_at = now
    }
    await saveBothTablesToFirebase(`Khôi phục ảnh: ${img.fileName}`)
    notify.success('Đã khôi phục!', `"${img.fileName}" đã hoạt động trở lại.`)
  }

  const handlePermanentDeleteSingleItem = async (img) => {
    const confirmed = await notify.confirm({
      title: 'Xóa vĩnh viễn bản ghi này khỏi Firebase?',
      message: 'Bản ghi sẽ bị xóa khỏi cả 2 bảng trên Firebase (File ảnh thật trên ổ đĩa Windows vẫn giữ nguyên).',
      highlightText: img.windowsPath || img.fileName,
      confirmText: 'Xóa khỏi Firebase',
      cancelText: 'Hủy',
      variant: 'danger',
      icon: '⚠️'
    })
    if (!confirmed) return

    delete physicalData.value.items[img.key]
    delete virtualData.value.items[img.key]
    await saveBothTablesToFirebase(`Xóa vĩnh viễn bản ghi ảnh: ${img.fileName}`)
  }

  // Đổi tên file trên ổ đĩa Windows -> Đồng bộ tức thì cả Bảng Thật & Bảng Ảo
  const confirmRenameFileOnWindows = async (item, finalNewName) => {
    const confirmed = await notify.confirm({
      title: 'Xác nhận đổi tên file thật trên ổ đĩa Windows?',
      message: 'File trên ổ cứng Windows sẽ được đổi tên trực tiếp, đồng thời cập nhật đồng bộ trong cả Bảng Thật (cmg_ref_physical) và Bảng Category Ảo (cmg_ref_virtual).',
      highlightText: `${item.fileName}  ➔  ${finalNewName}`,
      confirmText: 'Đồng ý Đổi tên & Đồng bộ 2 Bảng',
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
        newWindowsPath = normalizeWinPath(json.newWindowsPath)
        folderPath = normalizeWinPath(json.folderPath)
      } else {
        const runtime = browserRuntimeMap.value[item.key] || browserRuntimeMap.value[item.fileName]
        if (!runtime?.fileHandle) {
          notify.warning('Chưa cấp quyền thư mục', 'Hãy bấm "Mở lại Folder" hoặc "Chọn Folder trên Windows" để cấp quyền đọc/ghi trước khi đổi tên!')
          return false
        }
        if (typeof runtime.fileHandle.move === 'function') {
          await runtime.fileHandle.move(finalNewName)
        }
        newWindowsPath = normalizeWinPath(folderPath ? `${folderPath}\\${finalNewName}` : finalNewName)
        browserRuntimeMap.value[newWindowsPath] = runtime
        browserRuntimeMap.value[finalNewName] = runtime
      }

      const now = getNowStr()

      // 1. Cập nhật trong Bảng Thật (`physicalData.items`)
      if (physicalData.value.items[item.key]) {
        const oldPhys = physicalData.value.items[item.key]
        delete physicalData.value.items[item.key]
        physicalData.value.items[newWindowsPath] = {
          ...oldPhys,
          key: newWindowsPath,
          fileName: finalNewName,
          windowsPath: newWindowsPath,
          folderPath,
          updated_at: now
        }
      }

      // 2. Cập nhật đồng bộ trong Bảng Ảo (`virtualData.items`)
      if (virtualData.value.items[item.key]) {
        const oldVirt = virtualData.value.items[item.key]
        delete virtualData.value.items[item.key]
        virtualData.value.items[newWindowsPath] = {
          ...oldVirt,
          key: newWindowsPath,
          fileName: finalNewName,
          windowsPath: newWindowsPath,
          folderPath,
          updated_at: now
        }
      }

      renamingItem.value = null
      await saveBothTablesToFirebase(`Đổi tên file Windows: ${item.fileName} -> ${finalNewName}`)
      notify.success('Đổi tên & Đồng bộ thành công!', `Đã đổi thành "${finalNewName}" trên cả Bảng Thật và Bảng Ảo.`)
      return true
    } catch (err) {
      notify.error('Lỗi đổi tên file', err.message)
      return false
    }
  }

  // ==========================================================================
  // BACKUP & ROLLBACK ĐỒNG BỘ CHO CẢ 2 BẢNG TRÊN FIREBASE
  // ==========================================================================
  const handleManualBackup = async () => {
    const confirmed = await notify.confirm({
      title: 'Tạo bản sao lưu cho cả 2 Bảng (Thật & Ảo) trên Firebase?',
      message: 'Hệ thống sẽ sao lưu đồng thời cmg_ref_physical_backup và cmg_ref_virtual_backup trên Firebase.',
      highlightText: `${activeItemsList.value.length} ảnh hoạt động & ${activeCategoriesList.value.length} Category`,
      confirmText: 'Sao lưu cả 2 Bảng',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '🛡️'
    })
    if (!confirmed) return

    try {
      const now = getNowStr()
      const physSerialized = serializeTableForFirebase(physicalData.value, true)
      physSerialized.backupSavedAt = now
      physSerialized.backupReason = 'Sao lưu thủ công bởi Admin'

      const virtSerialized = serializeTableForFirebase(virtualData.value, false)
      virtSerialized.backupSavedAt = now
      virtSerialized.backupReason = 'Sao lưu thủ công bởi Admin'

      await Promise.all([
        set(dbRef(db, FB_PHYSICAL_BACKUP_PATH), physSerialized),
        set(dbRef(db, FB_VIRTUAL_BACKUP_PATH), virtSerialized)
      ])
      notify.success('Đã tạo bản Backup!', 'Cả 2 bảng cmg_ref_physical_backup và cmg_ref_virtual_backup đã được cập nhật.')
    } catch (err) {
      notify.error('Lỗi tạo Backup trên Firebase', err.message)
    }
  }

  const handleRollbackBackup = async () => {
    if (!backupMeta.value) return
    const confirmed = await notify.confirm({
      title: 'Khôi phục (Rollback) cả 2 Bảng về phiên bản trước?',
      message: 'Dữ liệu từ cmg_ref_physical_backup và cmg_ref_virtual_backup sẽ được khôi phục về 2 bảng chính.',
      highlightText: `Bản lưu lúc: ${backupMeta.value.updatedAt} (${backupMeta.value.backupReason})`,
      confirmText: '⏪ Đồng ý Khôi phục Version trước',
      cancelText: 'Hủy bỏ',
      variant: 'warning',
      icon: '⏪'
    })
    if (!confirmed) return

    try {
      const physMainRef = dbRef(db, FB_PHYSICAL_MAIN_PATH)
      const physBkRef = dbRef(db, FB_PHYSICAL_BACKUP_PATH)
      const virtMainRef = dbRef(db, FB_VIRTUAL_MAIN_PATH)
      const virtBkRef = dbRef(db, FB_VIRTUAL_BACKUP_PATH)

      const [physBkSnap, physMainSnap, virtBkSnap, virtMainSnap] = await Promise.all([
        get(physBkRef),
        get(physMainRef),
        get(virtBkRef),
        get(virtMainRef)
      ])

      const now = getNowStr()
      const tasks = []

      if (physBkSnap.exists()) {
        const bkVal = physBkSnap.val()
        if (physMainSnap.exists()) {
          const curVal = physMainSnap.val()
          curVal.backupReason = 'Trước khi Rollback'
          curVal.backupSavedAt = now
          tasks.push(set(physBkRef, curVal))
        }
        bkVal.updatedAt = now
        tasks.push(set(physMainRef, bkVal))
      }

      if (virtBkSnap.exists()) {
        const bkVal = virtBkSnap.val()
        if (virtMainSnap.exists()) {
          const curVal = virtMainSnap.val()
          curVal.backupReason = 'Trước khi Rollback'
          curVal.backupSavedAt = now
          tasks.push(set(virtBkRef, curVal))
        }
        bkVal.updatedAt = now
        tasks.push(set(virtMainRef, bkVal))
      }

      await Promise.all(tasks)
      notify.success('Đã khôi phục thành công!', 'Cả 2 bảng Thật & Ảo đã quay về phiên bản Backup trước đó.')
    } catch (err) {
      notify.error('Lỗi khôi phục Backup', err.message)
    }
  }

  // ==========================================================================
  // MỞ THƯ MỤC CHỨA ẢNH TRÊN WINDOWS EXPLORER (OPEN IN FOLDER)
  // ==========================================================================
  const handleOpenInFolder = async (img) => {
    if (!img?.windowsPath) {
      notify.warning('Chưa có đường dẫn', 'Bức ảnh này chưa có đường dẫn vật lý trên ổ đĩa Windows!')
      return
    }

    if (isLocalViteServer.value) {
      try {
        const res = await fetch(`${API_BASE}/open_in_folder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ windowsPath: img.windowsPath })
        })
        const json = await res.json()
        if (!json.ok) {
          notify.error('Không thể mở thư mục', json.error)
        }
      } catch (err) {
        notify.error('Lỗi gọi Windows Explorer', err.message)
      }
    } else {
      // Nếu mở trên GitHub Pages (Môi trường tĩnh không gọi được explorer.exe) -> Copy đường dẫn vào Clipboard
      await navigator.clipboard.writeText(img.windowsPath)
      notify.info(
        'Đã sao chép đường dẫn Windows!',
        `Đường dẫn "${img.windowsPath}" đã được copy vào Clipboard.`
      )
    }
  }

  return {
    draggingImageKeys,
    dragOverCategoryId,
    handleDragStartImage,
    handleDragEndImage,
    handleDragOverCategory,
    handleDragLeaveCategory,
    handleDropToCategory,
    handleOpenInFolder,
    handleToggleFavorite,
    handleSingleCategoryChange,
    toggleSelectAllVisible,
    toggleSelectCurrentPage,
    handleBatchAssignCategory,
    handleSoftDeleteSingleItem,
    handleBatchSoftDeleteItems,
    handleRestoreSingleItem,
    handlePermanentDeleteSingleItem,
    confirmRenameFileOnWindows,
    handleManualBackup,
    handleRollbackBackup
  }
}
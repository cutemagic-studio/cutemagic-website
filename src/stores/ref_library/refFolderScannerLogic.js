// src/stores/ref_library/refFolderScannerLogic.js
import {
  API_BASE,
  IMAGE_EXT_REGEX,
  getNowStr,
  normalizeWinPath,
  saveHandleToIdb
} from './refLibraryHelpers'

export function createRefFolderScannerModule({
  isLocalViteServer,
  physicalData,
  virtualData,
  folderPathInput,
  importTargetCategoryId,
  isScanning,
  selectedFilter,
  savedBrowserDirHandle,
  browserRuntimeMap,
  getDescendantCategoryIds,
  notify,
  saveBothTablesToFirebase
}) {
  // Tìm hoặc tạo Category Thật trong bảng `physicalData.categories`
  const findOrCreatePhysicalFolderCategory = (
    name,
    parentId,
    windowsFolderPath,
    icon = '📁',
    now = getNowStr()
  ) => {
    const cleanName = String(name || '').trim()
    const normalizedParent = parentId || null
    const cleanWinFolder = normalizeWinPath(windowsFolderPath)

    let found = physicalData.value.categories.find(
      c =>
        (cleanWinFolder &&
          c.windowsFolderPath &&
          normalizeWinPath(c.windowsFolderPath).toLowerCase() === cleanWinFolder.toLowerCase()) ||
        (c.name.toLowerCase() === cleanName.toLowerCase() &&
          (c.parentId || null) === normalizedParent)
    )

    if (found) {
      found.isPhysicalFolder = true
      found.windowsFolderPath = cleanWinFolder || found.windowsFolderPath || ''
      found.icon = parentId ? '📁' : '📂'
      found.deleted_at = null
      found.updated_at = now
      return found.id
    }

    const maxOrder = physicalData.value.categories.reduce(
      (m, c) => Math.max(m, Number(c.sortOrder || 0)),
      0
    )
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'folder'
    const newId = `win_${slug}_${Date.now().toString().slice(-3)}_${Math.floor(Math.random() * 900 + 100)}`

    physicalData.value.categories.push({
      id: newId,
      name: cleanName,
      icon: parentId ? '📁' : '📂',
      parentId: normalizedParent,
      sortOrder: maxOrder + 1,
      isPhysicalFolder: true,
      windowsFolderPath: cleanWinFolder,
      created_at: now,
      updated_at: now,
      deleted_at: null
    })

    return newId
  }

  // Suy luận đường dẫn vật lý trên ổ đĩa cho 1 Category Thật bất kỳ
  const resolveWindowsPathForPhysicalCategory = (catNode) => {
    if (!catNode) return ''
    if (catNode.windowsFolderPath) {
      return normalizeWinPath(catNode.windowsFolderPath)
    }

    const branchIds = getDescendantCategoryIds(catNode.id, true)
    const branchItems = Object.values(physicalData.value.items || {}).filter(
      i => branchIds.has(i.physicalCategoryId) && i.folderPath
    )

    if (branchItems.length > 0) {
      const catNameLower = catNode.name.trim().toLowerCase()
      const catNameCompact = catNameLower.replace(/\s+/g, '')

      for (const item of branchItems) {
        const parts = normalizeWinPath(item.folderPath).split('\\')
        const matchIdx = parts.findIndex(p => {
          const pLow = p.trim().toLowerCase()
          return pLow === catNameLower || pLow.replace(/\s+/g, '') === catNameCompact
        })
        if (matchIdx !== -1) {
          return parts.slice(0, matchIdx + 1).join('\\')
        }
      }

      const sampleFolder = normalizeWinPath(branchItems[0].folderPath)
      if (catNode.parentId === null) {
        const lastSlash = sampleFolder.lastIndexOf('\\')
        return lastSlash > 2 ? sampleFolder.slice(0, lastSlash) : sampleFolder
      }
      return sampleFolder
    }

    return normalizeWinPath(folderPathInput.value || physicalData.value.lastFolderPath || '')
  }

  // ==========================================================================
  // HÀM ĐỒNG BỘ CHÍNH: CẬP NHẬT BẢNG THẬT & ĐỒNG BỘ SANG BẢNG ẢO
  // ==========================================================================
  const syncScannedDiskTreeIntoTables = async ({
    rootFolderPath,
    rootFolderName,
    files,
    targetParentPhysicalId = null,
    existingRootPhysicalCat = null,
    isRefreshMode = false
  }) => {
    const cleanRootPath = normalizeWinPath(rootFolderPath)
    const cleanRootLower = cleanRootPath.toLowerCase()

    const uniqueSubfolderPaths = new Set()
    files.forEach(f => {
      const fDir = normalizeWinPath(f.folderPath)
      if (fDir && fDir.toLowerCase() !== cleanRootLower) {
        uniqueSubfolderPaths.add(fDir)
      }
    })

    const confirmed = await notify.confirm({
      title: isRefreshMode
        ? `Làm mới (Refresh) Category thật "${rootFolderName}"?`
        : 'Xác nhận quét Cây Folder Windows vào Bảng Thật?',
      message: isRefreshMode
        ? `Quét lại thư mục "${cleanRootPath}" trên ổ đĩa Windows (${uniqueSubfolderPaths.size} folder con • ${files.length} ảnh). Hệ thống sẽ cập nhật Bảng Thật (cmg_ref_physical) và tự động đồng bộ mọi thay đổi thông tin ảnh sang Bảng Category Ảo (cmg_ref_virtual).`
        : `Tìm thấy ${files.length} hình ảnh và ${uniqueSubfolderPaths.size} thư mục con bên trong "${rootFolderName}". Hệ thống sẽ lưu vào Bảng Thật (cmg_ref_physical) và đồng bộ với Bảng Category Ảo (cmg_ref_virtual).`,
      highlightText: `${cleanRootPath} (${uniqueSubfolderPaths.size} folder con • ${files.length} ảnh)`,
      confirmText: isRefreshMode ? '🔄 Đồng ý Làm mới & Đồng bộ 2 Bảng' : '☁️ Đồng ý Lưu & Đồng bộ',
      cancelText: 'Hủy bỏ',
      variant: 'info',
      icon: isRefreshMode ? '🔄' : '💻'
    })
    if (!confirmed) return

    const now = getNowStr()

    // 1. Đảm bảo Category Thật gốc tồn tại và được gắn đúng `windowsFolderPath`
    const rootPhysicalCatId = existingRootPhysicalCat
      ? (() => {
          existingRootPhysicalCat.windowsFolderPath = cleanRootPath
          existingRootPhysicalCat.deleted_at = null
          existingRootPhysicalCat.updated_at = now
          return existingRootPhysicalCat.id
        })()
      : findOrCreatePhysicalFolderCategory(
          rootFolderName,
          targetParentPhysicalId,
          cleanRootPath,
          targetParentPhysicalId ? '📁' : '📂',
          now
        )

    // Lưu lại danh sách ID các Category con trong nhánh trước khi quét
    const existingBranchCatIds = getDescendantCategoryIds(rootPhysicalCatId, true)

    const optionalVirtualCatId =
      !isRefreshMode &&
      importTargetCategoryId.value &&
      importTargetCategoryId.value !== '__AUTO_FOLDER__'
        ? importTargetCategoryId.value
        : ''

    // Tập hợp toàn bộ ID các Category Thật còn tồn tại trên đĩa trong đợt quét này
    const touchedPhysicalCatIds = new Set([rootPhysicalCatId])
    const relativeFolderToCatIdMap = new Map()
    relativeFolderToCatIdMap.set('', rootPhysicalCatId)

    const resolvePhysicalCategoryForFolder = (fileFolderPath) => {
      const cleanFileDir = normalizeWinPath(fileFolderPath)
      if (!cleanFileDir || cleanFileDir.toLowerCase() === cleanRootLower) {
        return rootPhysicalCatId
      }

      let relPath = ''
      if (cleanFileDir.toLowerCase().startsWith(cleanRootLower + '\\')) {
        relPath = cleanFileDir.slice(cleanRootPath.length + 1)
      } else {
        relPath = cleanFileDir.split('\\').pop() || ''
      }

      if (relativeFolderToCatIdMap.has(relPath)) {
        return relativeFolderToCatIdMap.get(relPath)
      }

      const segments = relPath.split('\\').map(s => s.trim()).filter(Boolean)
      let currentParentId = rootPhysicalCatId
      let builtRel = ''

      for (const segName of segments) {
        builtRel = builtRel ? `${builtRel}\\${segName}` : segName
        const fullSubPath = `${cleanRootPath}\\${builtRel}`

        if (relativeFolderToCatIdMap.has(builtRel)) {
          currentParentId = relativeFolderToCatIdMap.get(builtRel)
          touchedPhysicalCatIds.add(currentParentId)
        } else {
          const childCatId = findOrCreatePhysicalFolderCategory(
            segName,
            currentParentId,
            fullSubPath,
            '📁',
            now
          )
          relativeFolderToCatIdMap.set(builtRel, childCatId)
          touchedPhysicalCatIds.add(childCatId)
          currentParentId = childCatId
        }
      }

      return currentParentId
    }

    // 2. Duyệt danh sách file quét được để cập nhật Bảng Thật (`physicalData.items`)
    const scannedWinKeysSet = new Set()
    let addedImagesCount = 0
    let updatedImagesCount = 0
    let removedImagesCount = 0
    let syncedVirtualImagesCount = 0

    const existingBranchPhysicalItems = Object.values(physicalData.value.items || {}).filter(item => {
      const iPath = normalizeWinPath(item.windowsPath).toLowerCase()
      return (
        iPath.startsWith(cleanRootLower + '\\') ||
        existingBranchCatIds.has(item.physicalCategoryId)
      )
    })

    files.forEach(fileObj => {
      const winKey = normalizeWinPath(fileObj.windowsPath)
      const cleanFolder = normalizeWinPath(fileObj.folderPath)
      scannedWinKeysSet.add(winKey.toLowerCase())

      const physicalCatId = resolvePhysicalCategoryForFolder(cleanFolder)
      touchedPhysicalCatIds.add(physicalCatId)

      const existingPhys =
        physicalData.value.items[winKey] ||
        physicalData.value.items[fileObj.fileName]

      if (!existingPhys) {
        addedImagesCount++
        physicalData.value.items[winKey] = {
          key: winKey,
          fileName: fileObj.fileName,
          windowsPath: winKey,
          folderPath: cleanFolder,
          physicalCategoryId: physicalCatId,
          categoryId: '',
          isFavorite: false,
          created_at: now,
          updated_at: now,
          deleted_at: null
        }
      } else {
        const hasChanged =
          existingPhys.fileName !== fileObj.fileName ||
          existingPhys.windowsPath !== winKey ||
          existingPhys.folderPath !== cleanFolder ||
          existingPhys.physicalCategoryId !== physicalCatId ||
          existingPhys.deleted_at !== null

        if (hasChanged) {
          updatedImagesCount++
        }

        physicalData.value.items[winKey] = {
          ...existingPhys,
          key: winKey,
          fileName: fileObj.fileName,
          windowsPath: winKey,
          folderPath: cleanFolder,
          physicalCategoryId: physicalCatId,
          updated_at: hasChanged ? now : (existingPhys.updated_at || now),
          deleted_at: null
        }

        if (physicalData.value.items[fileObj.fileName] && winKey !== fileObj.fileName) {
          delete physicalData.value.items[fileObj.fileName]
        }
      }

      if (optionalVirtualCatId) {
        const existingVirt = virtualData.value.items[winKey]
        virtualData.value.items[winKey] = {
          key: winKey,
          fileName: fileObj.fileName,
          windowsPath: winKey,
          folderPath: cleanFolder,
          physicalCategoryId: physicalCatId,
          categoryId: optionalVirtualCatId,
          isFavorite: Boolean(existingVirt?.isFavorite),
          created_at: existingVirt?.created_at || now,
          updated_at: now,
          deleted_at: null
        }
      }
    })

    // 3. Đánh dấu xóa mềm các Folder con/cháu trong nhánh nếu đã bị xóa trên ổ đĩa Windows
    physicalData.value.categories.forEach(c => {
      if (
        c.id !== rootPhysicalCatId &&
        existingBranchCatIds.has(c.id) &&
        !touchedPhysicalCatIds.has(c.id) &&
        !c.deleted_at
      ) {
        c.deleted_at = now
        c.updated_at = now
      }
    })

    // 4. Phát hiện các ảnh đã bị xóa hoặc di chuyển trên ổ đĩa Windows trong nhánh đang quét
    existingBranchPhysicalItems.forEach(oldItem => {
      const oldKeyLower = normalizeWinPath(oldItem.windowsPath || oldItem.key).toLowerCase()
      if (!scannedWinKeysSet.has(oldKeyLower) && !oldItem.deleted_at) {
        oldItem.deleted_at = now
        oldItem.updated_at = now
        removedImagesCount++
      }
    })

    // ========================================================================
    // 5. ĐỒNG BỘ CHÉO SANG BẢNG CATEGORY ẢO (`virtualData.items`)
    // ========================================================================
    Object.entries(virtualData.value.items || {}).forEach(([virtKey, virtItem]) => {
      const cleanVirtKey = normalizeWinPath(virtKey)
      const directPhysMatch = physicalData.value.items[cleanVirtKey]

      if (directPhysMatch) {
        const infoChanged =
          virtItem.fileName !== directPhysMatch.fileName ||
          virtItem.windowsPath !== directPhysMatch.windowsPath ||
          virtItem.folderPath !== directPhysMatch.folderPath ||
          virtItem.physicalCategoryId !== directPhysMatch.physicalCategoryId ||
          Boolean(virtItem.deleted_at) !== Boolean(directPhysMatch.deleted_at)

        if (infoChanged) {
          virtualData.value.items[cleanVirtKey] = {
            ...virtItem,
            key: directPhysMatch.key,
            fileName: directPhysMatch.fileName,
            windowsPath: directPhysMatch.windowsPath,
            folderPath: directPhysMatch.folderPath,
            physicalCategoryId: directPhysMatch.physicalCategoryId,
            deleted_at: directPhysMatch.deleted_at,
            updated_at: now
          }
          if (virtKey !== cleanVirtKey) {
            delete virtualData.value.items[virtKey]
          }
          syncedVirtualImagesCount++
        }
        return
      }

      const relocateCandidate = files.find(
        f =>
          f.fileName.toLowerCase() === (virtItem.fileName || '').toLowerCase() &&
          !virtualData.value.items[normalizeWinPath(f.windowsPath)]
      )

      if (relocateCandidate) {
        const newWinKey = normalizeWinPath(relocateCandidate.windowsPath)
        const newPhysRecord = physicalData.value.items[newWinKey]
        if (newPhysRecord) {
          delete virtualData.value.items[virtKey]
          virtualData.value.items[newWinKey] = {
            ...virtItem,
            key: newWinKey,
            fileName: newPhysRecord.fileName,
            windowsPath: newWinKey,
            folderPath: newPhysRecord.folderPath,
            physicalCategoryId: newPhysRecord.physicalCategoryId,
            deleted_at: null,
            updated_at: now
          }
          syncedVirtualImagesCount++
        }
      }
    })

    physicalData.value.lastFolderPath = cleanRootPath
    folderPathInput.value = cleanRootPath
    selectedFilter.value = optionalVirtualCatId || rootPhysicalCatId

    await saveBothTablesToFirebase(
      `${isRefreshMode ? 'Refresh' : 'Quét'} Category thật: ${rootFolderName} (+${addedImagesCount} mới, ~${updatedImagesCount} sửa, -${removedImagesCount} ẩn, đồng bộ ${syncedVirtualImagesCount} ảnh ảo)`
    )

    notify.success(
      isRefreshMode ? `Đã Refresh "${rootFolderName}"!` : 'Đã đồng bộ Cây Folder Windows!',
      `Bảng Thật: +${addedImagesCount} ảnh mới, ${updatedImagesCount} cập nhật, ${removedImagesCount} đã xóa trên đĩa • Đồng bộ ${syncedVirtualImagesCount} ảnh trong Category Ảo.`
    )
  }

  // ==========================================================================
  // CHỨC NĂNG REFRESH TRỰC TIẾP CHO CATEGORY THẬT ĐANG CHỌN (`🔄 Refresh`)
  // ==========================================================================
  const handleRefreshPhysicalCategory = async (catNode) => {
    if (!catNode || !catNode.isPhysicalFolder) {
      notify.warning('Chỉ áp dụng cho Category Thật', 'Tính năng Refresh từ ổ đĩa chỉ dành cho các Folder Thật trên Windows!')
      return
    }

    const targetWinPath = resolveWindowsPathForPhysicalCategory(catNode)
    if (!targetWinPath) {
      notify.warning(
        'Chưa xác định được đường dẫn ổ đĩa',
        `Vui lòng nhập đường dẫn của "${catNode.name}" vào ô trên cùng rồi bấm "Quét Đường dẫn này" 1 lần để gắn đường dẫn gốc!`
      )
      return
    }

    if (!isLocalViteServer.value) {
      return handlePickWindowsFolderDialog()
    }

    isScanning.value = true
    try {
      const res = await fetch(`${API_BASE}/scan_folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: targetWinPath })
      })
      const json = await res.json()
      if (!json.ok) {
        notify.error('Không tìm thấy thư mục trên ổ đĩa', json.error)
        return
      }

      const rawCatInStore = physicalData.value.categories.find(c => c.id === catNode.id)
      await syncScannedDiskTreeIntoTables({
        rootFolderPath: json.folderPath,
        rootFolderName: catNode.name || json.folderName,
        files: json.files,
        targetParentPhysicalId: catNode.parentId || null,
        existingRootPhysicalCat: rawCatInStore || null,
        isRefreshMode: true
      })
    } catch (err) {
      notify.error('Lỗi khi Refresh thư mục', err.message)
    } finally {
      isScanning.value = false
    }
  }

  const populateBrowserRuntimeFromHandle = async (dirHandle) => {
    const files = []
    const basePrefix = normalizeWinPath(folderPathInput.value.trim() || dirHandle.name)

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
    await syncScannedDiskTreeIntoTables({
      rootFolderPath: basePrefix,
      rootFolderName: folderName,
      files,
      isRefreshMode: false
    })
  }

  const handlePickWindowsFolderDialog = async () => {
    isScanning.value = true
    try {
      if (isLocalViteServer.value) {
        const res = await fetch(`${API_BASE}/pick_windows_folder`)
        const json = await res.json()
        if (json.ok && json.files) {
          await syncScannedDiskTreeIntoTables({
            rootFolderPath: json.folderPath,
            rootFolderName: json.folderName,
            files: json.files,
            isRefreshMode: false
          })
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
      await syncScannedDiskTreeIntoTables({
        rootFolderPath: json.folderPath,
        rootFolderName: json.folderName,
        files: json.files,
        isRefreshMode: false
      })
    } catch (err) {
      notify.error('Lỗi quét thư mục', err.message)
    } finally {
      isScanning.value = false
    }
  }

  return {
    resolveWindowsPathForPhysicalCategory,
    handleRefreshPhysicalCategory,
    reconnectSavedBrowserFolder,
    handlePickWindowsFolderDialog,
    handleScanTypedFolderPath
  }
}
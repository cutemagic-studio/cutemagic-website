// src/stores/ref_library/refLibraryHelpers.js
export const API_BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/__ref_library`

// 2 Bảng Chính & 2 Bảng Backup riêng biệt trên Firebase RTDB
export const FB_PHYSICAL_MAIN_PATH = 'cmg_ref_physical'
export const FB_PHYSICAL_BACKUP_PATH = 'cmg_ref_physical_backup'

export const FB_VIRTUAL_MAIN_PATH = 'cmg_ref_virtual'
export const FB_VIRTUAL_BACKUP_PATH = 'cmg_ref_virtual_backup'

// Bảng cũ (Dùng để tự động di cư dữ liệu sang 2 bảng mới trong lần đầu chạy)
export const FB_LEGACY_MAIN_PATH = 'cmg_ref_library'

export const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i

export const getNowStr = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const normalizeWinPath = (p) =>
  String(p || '')
    .replace(/\//g, '\\')
    .replace(/\\+$/, '')
    .trim()

export const encodeFbKey = (rawKey) =>
  String(rawKey)
    .replace(/%/g, '%25')
    .replace(/\./g, '%2E')
    .replace(/#/g, '%23')
    .replace(/\$/g, '%24')
    .replace(/\//g, '%2F')
    .replace(/\\/g, '%5C')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D')

export const decodeFbKey = (encodedKey) => {
  try {
    return decodeURIComponent(String(encodedKey))
  } catch {
    return String(encodedKey)
  }
}

const IDB_NAME = 'cmg_local_ref_db_v2'
const IDB_STORE = 'handles'

const openIdb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

export const saveHandleToIdb = async (handle) => {
  try {
    const idb = await openIdb()
    const tx = idb.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(handle, 'root_dir')
  } catch (e) {
    console.warn('Could not cache folder handle:', e)
  }
}

export const loadHandleFromIdb = async () => {
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

// ============================================================================
// CHUẨN HÓA ĐỌC / GHI CHO TỪNG BẢNG (PHYSICAL TABLE & VIRTUAL TABLE)
// ============================================================================
export const serializeTableForFirebase = (tableObj, isPhysicalTable = false) => {
  const cloned = JSON.parse(JSON.stringify(tableObj || { categories: [], items: {} }))
  const encodedItems = {}

  Object.entries(cloned.items || {}).forEach(([rawKey, val]) => {
    const cleanKey = normalizeWinPath(val.key || rawKey)
    const safeKey = encodeFbKey(cleanKey)
    encodedItems[safeKey] = {
      ...val,
      key: cleanKey,
      windowsPath: normalizeWinPath(val.windowsPath || cleanKey),
      folderPath: normalizeWinPath(val.folderPath || ''),
      physicalCategoryId: val.physicalCategoryId || '',
      categoryId: isPhysicalTable ? '' : (val.categoryId || ''),
      isFavorite: Boolean(val.isFavorite),
      deleted_at: val.deleted_at || null
    }
  })

  cloned.items = encodedItems
  cloned.categories = (cloned.categories || []).map((cat, idx) => ({
    ...cat,
    parentId: cat.parentId || null,
    sortOrder: Number(cat.sortOrder ?? (idx + 1)),
    isPhysicalFolder: Boolean(isPhysicalTable),
    windowsFolderPath: isPhysicalTable ? normalizeWinPath(cat.windowsFolderPath || '') : '',
    deleted_at: cat.deleted_at || null
  }))

  return cloned
}

export const deserializeTableFromFirebase = (fbRaw, isPhysicalTable = false) => {
  const raw = JSON.parse(JSON.stringify(fbRaw || { categories: [], items: {} }))
  const now = getNowStr()

  const decodedItems = {}
  Object.entries(raw.items || {}).forEach(([encodedKey, val]) => {
    const originalKey = normalizeWinPath(val.key || decodeFbKey(encodedKey))
    const isWinPath = /^[a-zA-Z]:\\/.test(originalKey)
    const fileName = val.fileName || (isWinPath ? originalKey.split('\\').pop() : originalKey)

    decodedItems[originalKey] = {
      key: originalKey,
      fileName,
      windowsPath: normalizeWinPath(val.windowsPath || (isWinPath ? originalKey : '')),
      folderPath: normalizeWinPath(val.folderPath || ''),
      physicalCategoryId: val.physicalCategoryId || (isPhysicalTable ? (val.categoryId || '') : ''),
      categoryId: isPhysicalTable ? '' : (val.categoryId || ''),
      isFavorite: Boolean(val.isFavorite),
      created_at: val.created_at || now,
      updated_at: val.updated_at || now,
      deleted_at: val.deleted_at || null
    }
  })

  raw.categories = (raw.categories || []).map((cat, idx) => ({
    id: cat.id,
    name: cat.name || 'Unnamed',
    icon: isPhysicalTable ? (cat.parentId ? '📁' : '📂') : (cat.icon || '📌'),
    parentId: cat.parentId || null,
    sortOrder: Number(cat.sortOrder ?? (idx + 1)),
    isPhysicalFolder: Boolean(isPhysicalTable),
    windowsFolderPath: isPhysicalTable ? normalizeWinPath(cat.windowsFolderPath || '') : '',
    created_at: cat.created_at || now,
    updated_at: cat.updated_at || now,
    deleted_at: cat.deleted_at || null
  }))

  // Tự động suy luận `windowsFolderPath` cho các Category thật cũ nếu chưa được lưu đường dẫn
  if (isPhysicalTable) {
    const catById = new Map(raw.categories.map(c => [c.id, c]))

    // Bước 1: Suy luận từ folderPath của các ảnh trực thuộc Category đó
    Object.values(decodedItems).forEach(item => {
      if (item.physicalCategoryId && item.folderPath && catById.has(item.physicalCategoryId)) {
        const cat = catById.get(item.physicalCategoryId)
        if (!cat.windowsFolderPath) {
          cat.windowsFolderPath = item.folderPath
        }
      }
    })

    // Bước 2: Suy luận ngược từ Category con lên Category cha (VD: G:\DanhSachDao\9af17b -> G:\DanhSachDao)
    let updatedParentPath = true
    while (updatedParentPath) {
      updatedParentPath = false
      for (const cat of raw.categories) {
        if (cat.windowsFolderPath && cat.parentId && catById.has(cat.parentId)) {
          const parentCat = catById.get(cat.parentId)
          if (!parentCat.windowsFolderPath) {
            const lastSlash = cat.windowsFolderPath.lastIndexOf('\\')
            if (lastSlash > 2) {
              parentCat.windowsFolderPath = cat.windowsFolderPath.slice(0, lastSlash)
              updatedParentPath = true
            }
          }
        }
      }
    }
  }

  raw.items = decodedItems
  return raw
}

// ============================================================================
// HÀM TÁCH BẢNG CŨ (`cmg_ref_library`) THÀNH 2 BẢNG MỚI (`physical` & `virtual`)
// ============================================================================
export const splitLegacyCombinedData = (legacyRaw) => {
  const now = getNowStr()
  const raw = JSON.parse(JSON.stringify(legacyRaw || { categories: [], items: {} }))

  const defaultVirtualIds = new Set([
    'cat_islands',
    'cat_trees',
    'cat_buildings',
    'cat_props',
    'cat_palettes'
  ])

  const folderSegmentsSet = new Set()
  const rawItemsEntries = Object.entries(raw.items || {})

  rawItemsEntries.forEach(([encodedKey, val]) => {
    const folderPath = normalizeWinPath(val.folderPath || '')
    folderPath.split('\\').forEach(seg => {
      const cleanSeg = seg.trim().toLowerCase()
      if (cleanSeg && !cleanSeg.includes(':')) {
        folderSegmentsSet.add(cleanSeg)
        folderSegmentsSet.add(cleanSeg.replace(/\s+/g, ''))
      }
    })
  })

  const allCats = (raw.categories || []).map((cat, idx) => {
    const cleanNameLower = String(cat.name || '').trim().toLowerCase()
    const compactNameLower = cleanNameLower.replace(/\s+/g, '')
    const isHexFolderPattern = /^[0-9a-f]{12,16}(_[a-z0-9]+)?$/i.test(cleanNameLower)

    const inferredPhysical =
      Boolean(cat.isPhysicalFolder) ||
      Boolean(cat.windowsFolderPath) ||
      String(cat.id || '').startsWith('win_') ||
      (!defaultVirtualIds.has(cat.id) &&
        (folderSegmentsSet.has(cleanNameLower) ||
          folderSegmentsSet.has(compactNameLower) ||
          isHexFolderPattern))

    return {
      ...cat,
      parentId: cat.parentId || null,
      sortOrder: Number(cat.sortOrder ?? (idx + 1)),
      isPhysicalFolder: inferredPhysical
    }
  })

  const catMap = new Map(allCats.map(c => [c.id, c]))
  allCats.forEach(c => {
    if (c.isPhysicalFolder && c.parentId && catMap.has(c.parentId)) {
      const p = catMap.get(c.parentId)
      if (!defaultVirtualIds.has(p.id)) p.isPhysicalFolder = true
    }
  })

  const physicalCategories = allCats.filter(c => c.isPhysicalFolder)
  const virtualCategories = allCats.filter(c => !c.isPhysicalFolder)
  const physicalCatIdSet = new Set(physicalCategories.map(c => c.id))
  const virtualCatIdSet = new Set(virtualCategories.map(c => c.id))

  const physicalItems = {}
  const virtualItems = {}

  rawItemsEntries.forEach(([encodedKey, val]) => {
    const originalKey = normalizeWinPath(val.key || decodeFbKey(encodedKey))
    const isWinPath = /^[a-zA-Z]:\\/.test(originalKey)
    const fileName = val.fileName || (isWinPath ? originalKey.split('\\').pop() : originalKey)
    const folderPath = normalizeWinPath(val.folderPath || '')

    const physicalCategoryId =
      val.physicalCategoryId ||
      (physicalCatIdSet.has(val.categoryId) ? val.categoryId : '')

    const virtualCategoryId =
      val.categoryId && virtualCatIdSet.has(val.categoryId) ? val.categoryId : ''

    const baseItem = {
      key: originalKey,
      fileName,
      windowsPath: normalizeWinPath(val.windowsPath || (isWinPath ? originalKey : '')),
      folderPath,
      physicalCategoryId,
      categoryId: virtualCategoryId,
      isFavorite: Boolean(val.isFavorite),
      created_at: val.created_at || now,
      updated_at: val.updated_at || now,
      deleted_at: val.deleted_at || null
    }

    physicalItems[originalKey] = { ...baseItem, categoryId: '' }

    if (virtualCategoryId || baseItem.isFavorite) {
      virtualItems[originalKey] = { ...baseItem }
    }
  })

  return {
    physicalTable: deserializeTableFromFirebase(
      {
        version: 3,
        lastFolderPath: normalizeWinPath(raw.lastFolderPath || ''),
        updatedAt: now,
        categories: physicalCategories,
        items: physicalItems
      },
      true
    ),
    virtualTable: deserializeTableFromFirebase(
      {
        version: 3,
        updatedAt: now,
        categories: virtualCategories,
        items: virtualItems
      },
      false
    )
  }
}
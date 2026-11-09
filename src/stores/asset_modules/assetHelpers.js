// src/stores/asset_modules/assetHelpers.js
import { mockAssets } from '../../data/assets/cmg/cmg_assets'
import { CmgAssetModel } from '../../models/cmg/Cmg_AssetModel'

// ==========================================
// 1. CÁC HẰNG SỐ CẤU HÌNH DÙNG CHUNG
// ==========================================
export const RECENTLY_VIEWED_KEY = 'cmg_recently_viewed_ids'
export const FAVORITE_ASSETS_KEY = 'cmg_favorite_ids'
export const FIREBASE_CACHE_KEY = 'cmg_firebase_assets_cache_v1'

export const FIREBASE_ASSETS_PATH = 'cmg_assets'
// Nhánh lưu Bản ghi song song (Parallel Backup) cho từng Asset Pack
export const FIREBASE_ASSETS_BACKUP_PATH = 'cmg_assets_backup'

export const MAX_RECENT_ITEMS = 20
export const MAX_FAVORITE_ITEMS = 50
export const DISPLAY_LIMIT = 12

// ==========================================
// 2. HELPER ĐỌC / GHI LOCAL STORAGE AN TOÀN
// ==========================================
export const loadIdsFromStorage = (storageKey) => {
  try {
    const rawData = localStorage.getItem(storageKey)
    if (!rawData) return []
    const parsed = JSON.parse(rawData)
    return Array.isArray(parsed)
      ? parsed.map(Number).filter(id => !isNaN(id) && id > 0)
      : []
  } catch (error) {
    return []
  }
}

export const saveIdsToStorage = (storageKey, ids) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  } catch (error) {
    console.warn(`[CuteMagic] Không thể lưu (${storageKey}):`, error)
  }
}

/**
 * Khởi tạo danh sách Assets đang hoạt động (chưa bị xóa mềm deleted_at)
 */
export const loadInitialAssets = () => {
  try {
    const cachedRaw = localStorage.getItem(FIREBASE_CACHE_KEY)
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map(item => new CmgAssetModel(item))
          .filter(model => !model.isDeleted)
      }
    }
  } catch (e) {
    console.warn('[AssetStore] Không thể đọc cache Firebase:', e)
  }
  return mockAssets
    .map(item => (item instanceof CmgAssetModel ? item : new CmgAssetModel(item)))
    .filter(model => !model.isDeleted)
}

export const saveFirebaseCacheToLocal = (rawItems) => {
  try {
    localStorage.setItem(FIREBASE_CACHE_KEY, JSON.stringify(rawItems))
  } catch (e) {
    console.warn('[AssetStore] Không thể lưu cache Firebase:', e)
  }
}

// ==========================================
// 3. HELPER NGÀY THÁNG & TIMESTAMP
// ==========================================
export const getTodayDateString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const getNowDateTimeString = () => {
  const d = new Date()
  const datePart = getTodayDateString()
  const timePart = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  return `${datePart} ${timePart}`
}
// src/stores/asset_modules/assetUserActivityModule.js
import { db } from '../../firebase'
import { ref as dbRef, update } from 'firebase/database'
import {
  RECENTLY_VIEWED_KEY,
  FAVORITE_ASSETS_KEY,
  FIREBASE_ASSETS_PATH,
  MAX_RECENT_ITEMS,
  MAX_FAVORITE_ITEMS,
  DISPLAY_LIMIT,
  saveIdsToStorage
} from './assetHelpers'

// ==========================================
// 1. GETTERS CHO RECENTLY VIEWED & FAVORITES
// ==========================================
export const userActivityGetters = {
  // --- RecentlyViewedSection.vue ---
  hasRecentlyViewed() {
    return this.getRecentlyViewedAssets.length > 0
  },

  getRecentlyViewedAssets: (state) => {
    if (!state.recentlyViewedIds?.length) return []
    const assetMap = new Map(state.assets.map(asset => [Number(asset.id), asset]))
    return state.recentlyViewedIds
      .map(id => assetMap.get(Number(id)))
      .filter(Boolean)
      .slice(0, DISPLAY_LIMIT)
  },

  // --- FavoriteAssetsSection.vue & Nút Trái Tim ---
  hasFavorites() {
    return this.getFavoriteAssets.length > 0
  },

  isFavorite: (state) => {
    const favSet = new Set(state.favoriteIds.map(Number))
    return (assetId) => favSet.has(Number(assetId))
  },

  getFavoriteAssets: (state) => {
    if (!state.favoriteIds?.length) return []
    const assetMap = new Map(state.assets.map(asset => [Number(asset.id), asset]))
    return state.favoriteIds
      .map(id => assetMap.get(Number(id)))
      .filter(Boolean)
  }
}

// ==========================================
// 2. ACTIONS GHI NHẬN VIEW / LIKE / DOWNLOAD
// ==========================================
export const userActivityActions = {
  /**
   * Ghi nhận người dùng mở xem trang Chi tiết Asset:
   * +1 lượt View lên Firebase & đưa lên đầu danh sách Recently Viewed
   */
  recordAssetView(assetIdOrSlug) {
    const targetAsset = this.getAssetByIdOrSlug
      ? this.getAssetByIdOrSlug(assetIdOrSlug)
      : this.assets.find(a => Number(a.id) === Number(assetIdOrSlug))

    if (!targetAsset) return
    const numericId = Number(targetAsset.id)

    const newViews = (targetAsset.metrics?.views || 0) + 1
    if (targetAsset.metrics) {
      targetAsset.metrics.views = newViews
    }

    // Đồng bộ số lượt xem mới lên Firebase
    update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/metrics`), {
      views: newViews
    }).catch(() => {})

    // Cập nhật danh sách Xem gần đây dưới LocalStorage
    const filteredIds = this.recentlyViewedIds.filter(id => id !== numericId)
    this.recentlyViewedIds = [numericId, ...filteredIds].slice(0, MAX_RECENT_ITEMS)
    saveIdsToStorage(RECENTLY_VIEWED_KEY, this.recentlyViewedIds)
  },

  /**
   * Ghi nhận lượt tải xuống (+1 vào metrics.downloads trên Firebase)
   */
  recordAssetDownload(assetIdOrSlug) {
    const targetAsset = this.getAssetByIdOrSlug
      ? this.getAssetByIdOrSlug(assetIdOrSlug)
      : this.assets.find(a => Number(a.id) === Number(assetIdOrSlug))

    if (!targetAsset) return
    const numericId = Number(targetAsset.id)

    const newDownloads = (targetAsset.metrics?.downloads || 0) + 1
    if (targetAsset.metrics) {
      targetAsset.metrics.downloads = newDownloads
    }

    update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/metrics`), {
      downloads: newDownloads
    }).catch(() => {})
  },

  clearRecentlyViewed() {
    this.recentlyViewedIds = []
    localStorage.removeItem(RECENTLY_VIEWED_KEY)
  },

  /**
   * Bật / Tắt Yêu thích (Thả tim) & đồng bộ số lượng Likes thật lên Firebase
   */
  toggleFavorite(assetId) {
    const numericId = Number(assetId)
    if (!numericId || isNaN(numericId)) return

    const targetAsset = this.assets.find(asset => Number(asset.id) === numericId)
    if (!targetAsset) return

    const existingIndex = this.favoriteIds.indexOf(numericId)

    if (existingIndex !== -1) {
      this.favoriteIds.splice(existingIndex, 1)
      if (targetAsset.metrics?.likes > 0) targetAsset.metrics.likes--
    } else {
      this.favoriteIds = [numericId, ...this.favoriteIds].slice(0, MAX_FAVORITE_ITEMS)
      if (targetAsset.metrics) targetAsset.metrics.likes = (targetAsset.metrics.likes || 0) + 1
    }

    // Đồng bộ lượt Like thật lên Firebase
    update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/metrics`), {
      likes: targetAsset.metrics?.likes || 0
    }).catch(() => {})

    saveIdsToStorage(FAVORITE_ASSETS_KEY, this.favoriteIds)
  },

  removeFavorite(assetId) {
    const numericId = Number(assetId)
    if (this.favoriteIds.includes(numericId)) {
      this.toggleFavorite(numericId)
    }
  },

  clearFavorites() {
    this.favoriteIds = []
    localStorage.removeItem(FAVORITE_ASSETS_KEY)
  }
}
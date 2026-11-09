// src/stores/useAssetStore.js
import { defineStore } from 'pinia'
import { mockCategories } from '../data/assets/cmg/cmg_categories'

// 1. Import các hàm khởi tạo & tiện ích từ Nhánh 1 (Helpers)
import {
  RECENTLY_VIEWED_KEY,
  FAVORITE_ASSETS_KEY,
  loadIdsFromStorage,
  loadInitialAssets,
  getTodayDateString
} from './asset_modules/assetHelpers'

// 2. Import các Nhánh Logic Con (Catalog, Showcase, UserActivity, FirebaseAdmin) 
import { catalogGetters } from './asset_modules/assetCatalogModule'
import { showcaseGetters } from './asset_modules/assetShowcaseModule'
import { userActivityGetters, userActivityActions } from './asset_modules/assetUserActivityModule'
import { firebaseAdminGetters, firebaseAdminActions } from './asset_modules/assetFirebaseAdminModule'

// Xuất lại getTodayDateString để tương thích ngược 100% với các component hiện tại
export { getTodayDateString }

export const useAssetStore = defineStore('assetStore', {
  // ========================================================
  // STATE TRUNG TÂM (SINGLE SOURCE OF TRUTH)
  // ========================================================
  state: () => ({
    categories: mockCategories,
    // Danh sách các Asset Pack đang hoạt động (deleted_at === null) hiển thị cho User & Admin
    assets: loadInitialAssets(),
    // Danh sách các Asset Pack đã xóa mềm (deleted_at !== null) chỉ hiển thị trong Thùng rác Admin
    deletedAssets: [],
    // Bản đồ lưu trữ các Bản ghi song song (Parallel Backups) theo ID: { [id]: backupRecord }
    backupMap: {},

    isFirebaseSynced: false,
    isLoadingFirebase: false,
    recentlyViewedIds: loadIdsFromStorage(RECENTLY_VIEWED_KEY),
    favoriteIds: loadIdsFromStorage(FAVORITE_ASSETS_KEY)
  }),

  // ========================================================
  // HỢP NHẤT GETTERS TỪ 4 NHÁNH CON
  // ========================================================
  getters: {
    ...catalogGetters,       // Tra cứu ID/Slug, Danh mục, Thống kê tổng
    ...showcaseGetters,      // QuickList (New, Top, Upcoming) & Roadmap
    ...userActivityGetters,  // Recently Viewed & Favorites
    ...firebaseAdminGetters  // Thống kê Pool 100 ID 6 chữ số, Backup & Trash
  },

  // ========================================================
  // HỢP NHẤT ACTIONS TỪ CÁC NHÁNH CON
  // ========================================================
  actions: {
    ...firebaseAdminActions, // Đồng bộ Firebase Real-time, Parallel Backup, Soft Delete & CRUD Admin
    ...userActivityActions   // Ghi nhận View, Like, Download của người dùng
  }
})
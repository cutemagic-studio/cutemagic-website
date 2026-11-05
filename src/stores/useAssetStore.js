import { defineStore } from 'pinia'

// 1. IMPORT DỮ LIỆU TỪ CẤU TRÚC FOLDER MỚI
import { mockAssets } from '../data/assets/cmg/cmg_assets'
import { mockCategories } from '../data/assets/cmg/cmg_categories'
// (Tùy chọn) Import CmgAssetModel để chuẩn hóa dữ liệu khi gọi API thực tế sau này
// import { CmgAssetModel } from '../models/CmgAssetModel'

// ==========================================
// CẤU HÌNH & HELPER LOCAL STORAGE AN TOÀN
// ==========================================
const RECENTLY_VIEWED_KEY = 'cmg_recently_viewed_ids'
const FAVORITE_ASSETS_KEY = 'cmg_favorite_ids'
const MAX_RECENT_ITEMS = 20   // Lưu tối đa 20 pack trong lịch sử
const MAX_FAVORITE_ITEMS = 50 // Lưu tối đa 50 pack yêu thích
const DISPLAY_LIMIT = 12      // Hiển thị tối đa 12 pack lên giao diện (3 hàng x 4 cột)

const loadIdsFromStorage = (storageKey) => {
  try {
    const rawData = localStorage.getItem(storageKey)
    if (!rawData) return []
    const parsed = JSON.parse(rawData)
    // Đảm bảo dữ liệu đọc lên bắt buộc phải là mảng các con số ID hợp lệ (> 0)
    return Array.isArray(parsed) ? parsed.map(Number).filter(id => !isNaN(id) && id > 0) : []
  } catch (error) {
    console.warn(`[CuteMagic] Không thể đọc dữ liệu (${storageKey}) từ LocalStorage:`, error)
    return []
  }
}

const saveIdsToStorage = (storageKey, ids) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  } catch (error) {
    console.warn(`[CuteMagic] Không thể lưu dữ liệu (${storageKey}) xuống LocalStorage:`, error)
  }
}

export const useAssetStore = defineStore('assetStore', {
  state: () => ({
    categories: mockCategories,
    // Danh sách 30 instances của CmgAssetModel
    assets: mockAssets,
    recentlyViewedIds: loadIdsFromStorage(RECENTLY_VIEWED_KEY),
    favoriteIds: loadIdsFromStorage(FAVORITE_ASSETS_KEY)
  }),

  // ==========================================
  // 2. GETTERS: HÀM TRÍCH XUẤT & XỬ LÝ DỮ LIỆU
  // ==========================================
  getters: {
    // 2.1. Lấy toàn bộ danh sách để đổ ra Gallery (Chỉ lấy các pack đã phát hành)
    getAllAssets: (state) => state.assets,

    // 2.2. Lấy dữ liệu 1 sản phẩm chi tiết theo ID hoặc Slug (Dùng cho AssetDetailView)
    getAssetBySlug: (state) => {
      return (slug) => state.assets.find(asset => asset.slug === slug)
    },
    getAssetById: (state) => {
      return (id) => state.assets.find(asset => Number(asset.id) === Number(id))
    },

    // 2.3. Lấy sản phẩm theo Category (Dùng cho chức năng Filter)
    getAssetsByCategory: (state) => {
      return (categoryId) => {
        if (!categoryId || categoryId === 'all') return state.assets
        return state.assets.filter(asset => asset.categoryId === categoryId)
      }
    },

    // 2.4. Lấy ra 4 sản phẩm mới ra mắt gần nhất (Không lấy hàng Coming Soon)
    getLatestAssets: (state) => {
      return [...state.assets]
        .filter(asset => !asset.dates.availableIn) // Loại bỏ các pack chưa ra mắt
        .sort((a, b) => new Date(b.dates.initialRelease) - new Date(a.dates.initialRelease))
        .slice(0, 4)
    },

    // 2.5. Các con số thống kê chuẩn theo nhóm techSpecs của CmgAssetModel
    getStatistics: (state) => {
      const totalPacks = state.assets.reduce((sum, asset) => sum + (asset.techSpecs?.packCount || 0), 0)
      const totalModels = state.assets.reduce((sum, asset) => sum + (asset.techSpecs?.modelCount || 0), 0)
      const totalCategories = state.categories.filter(c => c.id !== 'all').length

      return {
        packs: totalPacks,
        models: totalModels,
        categories: totalCategories
      }
    },

    // --- NHÓM GETTERS: RECENTLY VIEWED (XEM GẦN ĐÂY) ---
    // 2.6. Kiểm tra xem người dùng có lịch sử xem hợp lệ hay không
    hasRecentlyViewed() {
      return this.getRecentlyViewedAssets.length > 0
    },

    // 2.7. Lấy danh sách 12 CmgAssetModel theo đúng thứ tự thời gian người dùng đã xem
    getRecentlyViewedAssets: (state) => {
      if (!state.recentlyViewedIds || state.recentlyViewedIds.length === 0) return []

      const assetMap = new Map(state.assets.map(asset => [Number(asset.id), asset]))

      return state.recentlyViewedIds
        .map(id => assetMap.get(Number(id)))
        .filter(Boolean)
        .slice(0, DISPLAY_LIMIT)
    },

    // --- NHÓM GETTERS: FAVORITES (YÊU THÍCH) ---
    // 2.8. Kiểm tra xem người dùng có sản phẩm yêu thích nào không
    hasFavorites() {
      return this.getFavoriteAssets.length > 0
    },

    // 2.9. Kiểm tra nhanh 1 Asset ID có đang được bấm Thích hay không (O(1) lookup)
    isFavorite: (state) => {
      const favSet = new Set(state.favoriteIds.map(Number))
      return (assetId) => favSet.has(Number(assetId))
    },

    // 2.10. Lấy danh sách đầy đủ các CmgAssetModel đã được Yêu thích
    getFavoriteAssets: (state) => {
      if (!state.favoriteIds || state.favoriteIds.length === 0) return []

      const assetMap = new Map(state.assets.map(asset => [Number(asset.id), asset]))

      return state.favoriteIds
        .map(id => assetMap.get(Number(id)))
        .filter(Boolean)
    },

    // ==========================================
    // 3 GETTERS DÀNH CHO QUICK LIST (TRANG CHỦ)
    // ==========================================

    // 1. New Releases: Chỉ lấy các pack đã phát hành, xếp theo ngày ra mắt mới nhất -> cũ nhất
    newAssets: (state) => {
      return [...state.assets]
        .filter(asset => !asset.dates.availableIn)
        .sort((a, b) => new Date(b.dates.initialRelease) - new Date(a.dates.initialRelease))
    },

    // 2. Top Rated: Xếp hạng dựa trên metrics.likes (và metrics.downloads nếu bằng điểm like)
    topAssets: (state) => {
      return [...state.assets]
        .filter(asset => !asset.dates.availableIn)
        .sort((a, b) => {
          const likeDiff = (b.metrics?.likes || 0) - (a.metrics?.likes || 0)
          if (likeDiff !== 0) return likeDiff
          return (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0)
        })
    },

    // 3. Coming Soon: Chỉ lấy các pack có thông tin availableIn (hoặc nằm ở roadmap 'next')
    upcomingAssets: (state) => {
      return [...state.assets]
        .filter(asset => Boolean(asset.dates?.availableIn) || asset.roadmap?.status === 'next')
        .sort((a, b) => new Date(a.dates.initialRelease) - new Date(b.dates.initialRelease))
    },

    // ==========================================
    // GETTERS DÀNH CHO ROADMAP SECTION (MỚI)
    // ==========================================
    // Lấy toàn bộ các pack có tham gia vào Roadmap
    roadmapAssets: (state) => {
      return state.assets.filter(asset => asset.isInRoadmap)
    },

    // Phân nhóm sẵn 3 cột Roadmap ('prev', 'current', 'next') để truyền thẳng vào UI
    roadmapByStatus: (state) => {
      return {
        prev: state.assets.filter(asset => asset.roadmap?.status === 'prev'),
        current: state.assets.filter(asset => asset.roadmap?.status === 'current'),
        next: state.assets.filter(asset => asset.roadmap?.status === 'next')
      }
    }
  },

  // ==========================================
  // 3. ACTIONS: CÁC HÀM THAO TÁC DATA
  // ==========================================
  actions: {
    // Ví dụ khi kết nối Backend Laravel sau này, map qua CmgAssetModel:
    // async fetchAssetsFromAPI() {
    //   const response = await fetch('https://api.cutemagic.com/assets')
    //   const rawList = await response.json()
    //   this.assets = rawList.map(item => new CmgAssetModel(item))
    // },

    // --- NHÓM ACTIONS: RECENTLY VIEWED ---
    recordAssetView(assetId) {
      const numericId = Number(assetId)
      if (!numericId || isNaN(numericId)) return

      const targetAsset = this.assets.find(asset => Number(asset.id) === numericId)
      if (!targetAsset) return

      // Tăng nhẹ bộ đếm lượt xem trong metrics mỗi khi người dùng mở trang chi tiết
      if (typeof targetAsset.metrics?.views === 'number') {
        targetAsset.metrics.views++
      }

      const filteredIds = this.recentlyViewedIds.filter(id => id !== numericId)
      this.recentlyViewedIds = [numericId, ...filteredIds].slice(0, MAX_RECENT_ITEMS)
      saveIdsToStorage(RECENTLY_VIEWED_KEY, this.recentlyViewedIds)
    },

    clearRecentlyViewed() {
      this.recentlyViewedIds = []
      localStorage.removeItem(RECENTLY_VIEWED_KEY)
    },

    // --- NHÓM ACTIONS: FAVORITES (YÊU THÍCH) ---
    /**
     * Bật / Tắt trạng thái Yêu thích của 1 Pack (Cập nhật trực tiếp vào metrics.likes)
     * @param {Number|String} assetId 
     */
    toggleFavorite(assetId) {
      const numericId = Number(assetId)
      if (!numericId || isNaN(numericId)) return

      const targetAsset = this.assets.find(asset => Number(asset.id) === numericId)
      if (!targetAsset) return

      const existingIndex = this.favoriteIds.indexOf(numericId)

      if (existingIndex !== -1) {
        // TRƯỜNG HỢP 1: Đã thích rồi -> Bấm lần nữa sẽ BỎ THÍCH
        this.favoriteIds.splice(existingIndex, 1)

        if (targetAsset.metrics.likes > 0) {
          targetAsset.metrics.likes--
        }
      } else {
        // TRƯỜNG HỢP 2: Chưa thích -> Đẩy lên đầu danh sách và giới hạn 50 item
        this.favoriteIds = [numericId, ...this.favoriteIds].slice(0, MAX_FAVORITE_ITEMS)
        targetAsset.metrics.likes++
      }

      saveIdsToStorage(FAVORITE_ASSETS_KEY, this.favoriteIds)
    },

    /**
     * Xóa lẻ 1 pack khỏi danh sách yêu thích
     */
    removeFavorite(assetId) {
      const numericId = Number(assetId)
      if (this.favoriteIds.includes(numericId)) {
        this.toggleFavorite(numericId)
      }
    },

    /**
     * Xóa toàn bộ danh sách Yêu thích
     */
    clearFavorites() {
      this.favoriteIds = []
      localStorage.removeItem(FAVORITE_ASSETS_KEY)
    }
  }
})
import { defineStore } from 'pinia'
// Lúc này nó sẽ tự động trỏ vào file src/data/index.js
import { mockAssets, mockCategories } from '../data' 

export const useAssetStore = defineStore('assetStore', {
  state: () => ({
    categories: mockCategories,
    assets: mockAssets
  }),

  // 2. GETTERS: HÀM TRÍCH XUẤT & XỬ LÝ DỮ LIỆU
  // ==========================================
  getters: {
    // 2.1. Lấy toàn bộ danh sách để đổ ra Gallery
    getAllAssets: (state) => state.assets,

    // 2.2. Lấy dữ liệu 1 sản phẩm chi tiết theo ID hoặc Slug (Dùng cho AssetDetailView)
    getAssetBySlug: (state) => {
      return (slug) => state.assets.find(asset => asset.slug === slug)
    },
    getAssetById: (state) => {
      return (id) => state.assets.find(asset => asset.id === Number(id))
    },

    // 2.3. Lấy sản phẩm theo Category (Dùng cho chức năng Filter)
    getAssetsByCategory: (state) => {
      return (categoryId) => {
        if (categoryId === 'all') return state.assets
        return state.assets.filter(asset => asset.categoryId === categoryId)
      }
    },

    // 2.4. Lấy ra các sản phẩm mới nhất (Dùng cho Slide ở Home / Related Products)
    getLatestAssets: (state) => {
        // [QUAN TRỌNG]: Thêm dấu [...] để copy mảng, tránh làm xáo trộn mảng gốc ban đầu
        return [...state.assets]
            .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
            .slice(0, 4)
    },

    // 2.5. Các con số thống kê (Dùng cho 3 ô số liệu ở Hero Section)
    getStatistics: (state) => {
        const totalPacks = state.assets.reduce((sum, asset) => sum + asset.packCount, 0);
        const totalModels = state.assets.reduce((sum, asset) => sum + asset.modelCount, 0);
        const totalCategories = state.categories.filter(c => c.id !== 'all').length;
        
        return {
            packs: totalPacks,
            models: totalModels,
            categories: totalCategories
        }
    }
  },

  // ==========================================
  // 3. ACTIONS: CÁC HÀM THAO TÁC DATA (Nếu cần fetch API thực tế sau này)
  // ==========================================
  actions: {
    // Ví dụ sau này có Backend, bạn chỉ cần sửa ở đây:
    // async fetchAssetsFromAPI() {
    //    const response = await fetch('https://api.cutemagic.com/assets')
    //    this.assets = await response.json()
    // }
  }
})
// src/stores/asset_modules/assetCatalogModule.js

export const catalogGetters = {
  // Lấy toàn bộ Asset Pack
  getAllAssets: (state) => state.assets,

  // Tìm chính xác theo Slug
  getAssetBySlug: (state) => {
    return (slug) => state.assets.find(asset => asset.slug === slug)
  },

  // Tìm chính xác theo ID (Hỗ trợ cả kiểu chuỗi lẫn kiểu số)
  getAssetById: (state) => {
    return (id) => state.assets.find(asset => Number(asset.id) === Number(id))
  },

  // Tìm linh hoạt theo cả ID 6 chữ số HOẶC Slug trên URL (Dùng cho AssetDetailView)
  getAssetByIdOrSlug: (state) => {
    return (param) => {
      if (!param) return null
      const asNum = Number(param)
      if (!isNaN(asNum) && asNum > 0) {
        const byId = state.assets.find(asset => Number(asset.id) === asNum)
        if (byId) return byId
      }
      return state.assets.find(asset => asset.slug === String(param))
    }
  },

  // Lọc danh sách Asset theo Category ID
  getAssetsByCategory: (state) => {
    return (categoryId) => {
      if (!categoryId || categoryId === 'all') return state.assets
      return state.assets.filter(asset => asset.categoryId === categoryId)
    }
  },

  // Thống kê tổng số lượng Packs, 3D Models và Categories (Dùng cho HeroSection / Banner)
  getStatistics: (state) => {
    const totalPacks = state.assets.reduce((sum, asset) => sum + (asset.techSpecs?.packCount || 0), 0)
    const totalModels = state.assets.reduce((sum, asset) => sum + (asset.techSpecs?.modelCount || 0), 0)
    const totalCategories = state.categories.filter(c => c.id !== 'all').length

    return {
      packs: totalPacks,
      models: totalModels,
      categories: totalCategories
    }
  }
}
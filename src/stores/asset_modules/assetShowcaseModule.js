// src/stores/asset_modules/assetShowcaseModule.js

export const showcaseGetters = {
  // 1. Lấy 4 sản phẩm mới ra mắt hoặc mới cập nhật gần nhất (Dùng cho AssetLibrarySection ở Trang chủ)
  getLatestAssets: (state) => {
    return [...state.assets]
      .filter(asset => !asset.dates?.availableIn)
      .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
      .slice(0, 4)
  },

  // 2. Cột "New Releases" trong QuickListSection (Xếp theo latestUpdate / releaseDate mới nhất)
  newAssets: (state) => {
    return [...state.assets]
      .filter(asset => !asset.dates?.availableIn)
      .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
  },

  // 3. Cột "Top Rated" trong QuickListSection (Ưu tiên lượt Like, sau đó đến lượt Download)
  topAssets: (state) => {
    return [...state.assets]
      .filter(asset => !asset.dates?.availableIn)
      .sort((a, b) => {
        const likeDiff = (b.metrics?.likes || 0) - (a.metrics?.likes || 0)
        if (likeDiff !== 0) return likeDiff
        return (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0)
      })
  },

  // 4. Cột "Coming Soon" trong QuickListSection
  upcomingAssets: (state) => {
    return [...state.assets]
      .filter(asset => Boolean(asset.dates?.availableIn) || asset.roadmap?.status === 'next')
      .sort((a, b) => new Date(a.dates?.initialRelease || 0) - new Date(b.dates?.initialRelease || 0))
  },

  // 5. Danh sách toàn bộ các Pack có mặt trong ProductionRoadmapSection
  roadmapAssets: (state) => state.assets.filter(asset => asset.isInRoadmap),

  // 6. Phân nhóm Roadmap theo 3 cột trạng thái: Tháng trước (prev), Tháng này (current), Tháng sau (next)
  roadmapByStatus: (state) => ({
    prev: state.assets.filter(asset => asset.roadmap?.status === 'prev'),
    current: state.assets.filter(asset => asset.roadmap?.status === 'current'),
    next: state.assets.filter(asset => asset.roadmap?.status === 'next')
  })
}
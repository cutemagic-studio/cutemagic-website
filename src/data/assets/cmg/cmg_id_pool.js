// src/data/assets/cmg/cmg_id_pool.js

/**
 * KHO 100 MÃ ID 6 CHỮ SỐ CỐ ĐỊNH DÀNH CHO CMG ASSET PACKS
 * - 30 mã đầu tiên (Index 0 -> 29) có thể dùng cho 30 gói dữ liệu mẫu hiện tại.
 * - 70 mã tiếp theo (Index 30 -> 99) sẵn sàng cấp phát cho các Pack tạo mới.
 */
export const CMG_ASSET_ID_POOL = [
  // Nhóm 1 -> 10
  102401, 104802, 108503, 112904, 115605, 119206, 123407, 127808, 131509, 136910,
  // Nhóm 11 -> 20
  142111, 148512, 153213, 157914, 162415, 168016, 174317, 179618, 185119, 190420,
  // Nhóm 21 -> 30
  201521, 206822, 213423, 218924, 224525, 230126, 236727, 241228, 248929, 254330,
  // Nhóm 31 -> 40
  301831, 307432, 312933, 318534, 324135, 329636, 335237, 340838, 346339, 351940,
  // Nhóm 41 -> 50
  402741, 408342, 413843, 419444, 425045, 430546, 436147, 441748, 447249, 452850,
  // Nhóm 51 -> 60
  503651, 509252, 514753, 520354, 525955, 531456, 537057, 542658, 548159, 553760,
  // Nhóm 61 -> 70
  604561, 610162, 615663, 621264, 626865, 632366, 637967, 643568, 649069, 654670,
  // Nhóm 71 -> 80
  705471, 711072, 716573, 722174, 727775, 733276, 738877, 744478, 749979, 755580,
  // Nhóm 81 -> 90
  806381, 811982, 817483, 823084, 828685, 834186, 839787, 845388, 850889, 856490,
  // Nhóm 91 -> 100
  907291, 912892, 918393, 923994, 929595, 935096, 940697, 946298, 951799, 998100
]

/**
 * 1. Lấy danh sách toàn bộ các ID 6 chữ số CHƯA ĐƯỢC SỬ DỤNG
 * @param {Array} currentAssets - Mảng danh sách các Asset hiện có trong Store/Firebase
 * @returns {Array<Number>} Mảng các ID còn trống
 */
export const getAvailableAssetIds = (currentAssets = []) => {
  const usedIds = new Set(currentAssets.map(asset => Number(asset.id)))
  return CMG_ASSET_ID_POOL.filter(id => !usedIds.has(id))
}

/**
 * 2. Lấy tự động 1 mã ID 6 chữ số đầu tiên còn trống để gán cho Asset Pack mới
 * @param {Array} currentAssets - Mảng danh sách các Asset hiện có
 * @returns {Number} Mã ID 6 chữ số chưa từng được dùng
 */
export const getNextUnusedAssetId = (currentAssets = []) => {
  const availableIds = getAvailableAssetIds(currentAssets)
  
  if (availableIds.length > 0) {
    return availableIds[0] // Trả về ID trống đầu tiên trong Pool 100 số
  }

  // Dự phòng an toàn: Nếu sau này bạn tạo vượt quá 100 Pack, tự động sinh ngẫu nhiên 1 số 6 chữ số không trùng
  const usedIds = new Set(currentAssets.map(asset => Number(asset.id)))
  let fallbackId = Math.floor(100000 + Math.random() * 900000)
  while (usedIds.has(fallbackId)) {
    fallbackId = Math.floor(100000 + Math.random() * 900000)
  }
  return fallbackId
}

/**
 * 3. Thống kê dung lượng Pool ID hiện tại (Dùng để hiển thị lên Admin)
 */
export const getIdPoolStats = (currentAssets = []) => {
  const available = getAvailableAssetIds(currentAssets)
  return {
    totalPool: CMG_ASSET_ID_POOL.length,
    usedCount: CMG_ASSET_ID_POOL.length - available.length,
    availableCount: available.length,
    nextAvailableId: available[0] || null
  }
}
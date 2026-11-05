import { mockCharacterAssets } from './cmg_characters'
import { mockEnvironmentAssets } from './cmg_environments'
import { mockInteriorAssets } from './cmg_interiors'
import { mockNatureAssets } from './cmg_nature'
import { mockVehicleAssets } from './cmg_vehicles'

// =========================================================================
// GỘP TOÀN BỘ 30 BẢN DỮ LIỆU MẪU VÀO MẢNG TỔNG 'mockAssets'
// (Dùng trực tiếp cho useAssetStore.js)
// =========================================================================
export const mockAssets = [
    ...mockCharacterAssets,   // ID: 1 -> 6
    ...mockEnvironmentAssets, // ID: 7 -> 12
    ...mockInteriorAssets,    // ID: 13 -> 18
    ...mockNatureAssets,      // ID: 19 -> 24
    ...mockVehicleAssets      // ID: 25 -> 30
]
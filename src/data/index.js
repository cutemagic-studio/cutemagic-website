import { categoriesData } from './categoriesData'

// Import từng phần data đã được chia nhỏ
import { characterAssets } from './assets/characters'
import { environmentAssets } from './assets/environments'
import { uiKitAssets } from './assets/uiKits'

// Export trực tiếp category
export const mockCategories = categoriesData

// Gộp tất cả các mảng asset nhỏ thành 1 mảng lớn duy nhất
export const mockAssets = [
    ...characterAssets,
    ...environmentAssets,
    ...uiKitAssets
]
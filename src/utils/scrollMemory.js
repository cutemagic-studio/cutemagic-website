// src/utils/scrollMemory.js

const SCROLL_STATE_KEY = 'cmg_home_scroll_memory_v1'
const GALLERY_FILTER_KEY = 'cmg_home_gallery_state_v1'

// Danh sách các Section trên HomeView để đo tọa độ tương đối (Chống lệch khi RecentlyViewed xuất hiện)
const TRACKED_SECTION_IDS = [
  'HeroSection',
  'RecentlyViewedSection',
  'WhyChooseUsSection',
  'AssetLibrarySection',
  'AssetSpecSection',
  'ProductionRoadmapSection',
  'QuickListSection',
  'TestimonialSection',
  'FaqAccordionSection',
  'FavoriteAssetsSection',
  'ContactSection'
]

/**
 * 1. LƯU VỊ TRÍ CUỘN TRƯỚC KHI RỜI TRANG HOME
 * Lưu cả tọa độ tuyệt đối (scrollY) VÀ tọa độ tương đối so với Section đang đứng (offsetFromSectionTop)
 */
export const saveHomeScrollPosition = (clickedAssetId = null) => {
  try {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0
    let anchorSectionId = 'AssetLibrarySection'
    let offsetFromSectionTop = 0

    // Tìm Section đang nằm gần vùng nhìn hiện tại nhất
    for (const secId of TRACKED_SECTION_IDS) {
      const el = document.getElementById(secId)
      if (el && el.offsetHeight > 0) {
        const rect = el.getBoundingClientRect()
        const secTop = rect.top + scrollY
        const secBottom = secTop + rect.height

        // Nếu người dùng đang đứng trong phạm vi của Section này
        if (scrollY + 120 >= secTop && scrollY < secBottom) {
          anchorSectionId = secId
          offsetFromSectionTop = scrollY - secTop
          break
        }
      }
    }

    const payload = {
      scrollY,
      anchorSectionId,
      offsetFromSectionTop,
      clickedAssetId: clickedAssetId ? Number(clickedAssetId) : null,
      timestamp: Date.now()
    }

    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('[ScrollMemory] Không thể lưu vị trí cuộn:', e)
  }
}

/**
 * 2. ĐỌC VÀ KHÔI PHỤC CHÍNH XÁC VỊ TRÍ CUỘN KHI BẤM BACK VỀ HOME
 */
export const restoreHomeScrollPosition = () => {
  try {
    const raw = sessionStorage.getItem(SCROLL_STATE_KEY)
    if (!raw) return false

    const saved = JSON.parse(raw)
    // Chỉ khôi phục nếu phiên lưu trong vòng 30 phút gần nhất
    if (!saved || Date.now() - (saved.timestamp || 0) > 30 * 60 * 1000) {
      sessionStorage.removeItem(SCROLL_STATE_KEY)
      return false
    }

    const applyScroll = () => {
      // Ưu tiên 1: Tính lại vị trí chính xác dựa trên đỉnh hiện tại của Section neo (Chống lệch Layout Shift 100%)
      if (saved.anchorSectionId) {
        const sectionEl = document.getElementById(saved.anchorSectionId)
        if (sectionEl && sectionEl.offsetHeight > 0) {
          const newSectionTop = sectionEl.getBoundingClientRect().top + window.scrollY
          const targetY = Math.max(0, newSectionTop + (saved.offsetFromSectionTop || 0))
          window.scrollTo({ top: targetY, behavior: 'instant' })
          return
        }
      }

      // Ưu tiên 2: Fallback về scrollY tuyệt đối
      window.scrollTo({ top: saved.scrollY || 0, behavior: 'instant' })
    }

    // Thực hiện khôi phục qua 2 nhịp rAF để đảm bảo các thẻ Card và ảnh đã dựng xong khung chiều cao
    requestAnimationFrame(() => {
      applyScroll()
      setTimeout(() => {
        applyScroll()
        sessionStorage.removeItem(SCROLL_STATE_KEY)
      }, 80)
    })

    return true
  } catch (e) {
    return false
  }
}

/**
 * 3. LƯU & KHÔI PHỤC TRẠNG THÁI PHÂN TRANG (1, 2, 3, 4) VÀ DANH MỤC CỦA ASSET GALLERY
 */
export const saveGalleryFilterState = ({ page = 1, category = 'all', search = '' }) => {
  try {
    sessionStorage.setItem(
      GALLERY_FILTER_KEY,
      JSON.stringify({ page, category, search, updatedAt: Date.now() })
    )
  } catch {}
}

export const loadGalleryFilterState = () => {
  try {
    const raw = sessionStorage.getItem(GALLERY_FILTER_KEY)
    if (!raw) return { page: 1, category: 'all', search: '' }
    const parsed = JSON.parse(raw)
    return {
      page: Number(parsed.page) || 1,
      category: parsed.category || 'all',
      search: parsed.search || ''
    }
  } catch {
    return { page: 1, category: 'all', search: '' }
  }
}
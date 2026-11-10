<!-- src/components/layout/BottomSectionDock.vue -->
<template>
  <!-- Neo cố định sát đáy màn hình (Viewport Bottom) -->
  <div class="fixed inset-x-0 bottom-0 z-50 pointer-events-none select-none font-sans">
    
    <!-- 1. NÚT ĐÓNG / MỞ NHỎ GỌN BÊN PHẢI SÁT ĐÁY MÀN HÌNH -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex justify-end">
      <button
        type="button"
        @click="toggleDock"
        class="pointer-events-auto group relative flex items-center gap-1.5 px-3 py-1 rounded-t-xl bg-[#131722]/90 hover:bg-[#1e1e1e] backdrop-blur-xl border-t border-x border-white/15 hover:border-[#ffe600] text-white shadow-[0_-4px_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
        :title="isOpen ? 'Thu gọn thanh điều hướng' : 'Mở thanh điều hướng Section'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[#00EE76] animate-pulse"></span>
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-300 group-hover:text-[#ffe600]">
          {{ isOpen ? 'Ẩn thanh' : (currentSection?.label || 'Mục lục') }}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-3 h-3 text-[#ffe600] transition-transform duration-300"
          :class="isOpen ? 'rotate-180' : 'rotate-0'"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>

    <!-- 2. KHUNG DIV MỜ ĐÃ GIẢM 50% CHIỀU CAO (h-9 sm:h-10 ~ 36px-40px) -->
    <div
      class="w-full bg-[#0b0e16]/70 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out overflow-hidden"
      :class="isOpen ? 'h-9 sm:h-10 opacity-100 pointer-events-auto' : 'h-0 opacity-0 pointer-events-none border-t-0'"
    >
      <div class="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 relative">

        <!-- NÚT TRÁI (<) NHỎ GỌN, KHÔNG CÒN VỆT ĐEN CẮT DỌC -->
        <button
          type="button"
          :disabled="activeIndex <= 0"
          @click="goToPrevSection"
          class="z-30 w-7 h-7 rounded-lg bg-white/5 hover:bg-[#ffe600] text-slate-200 hover:text-black disabled:opacity-20 disabled:pointer-events-none border border-white/10 hover:border-black flex items-center justify-center text-xs font-black transition-all shrink-0 cursor-pointer"
          title="Section trước đó"
        >
          ❮
        </button>

        <!-- VÙNG TRACK GALLERY DÙNG MASK-IMAGE MỜ TỰ NHIÊN (ĐÃ XÓA KHUNG VIỀN THỪA Ở GIỮA) -->
        <div
          ref="trackRef"
          @mousedown="startDrag"
          @touchstart.passive="startTouchDrag"
          class="relative flex-1 h-full flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        >
          <!-- Các Item Section (A - B - C): Mục giữa to & rõ, 2 mục bên nhỏ & mờ -->
          <div
            v-for="(sec, idx) in availableSections"
            :key="sec.id"
            @click="handleItemClick(idx)"
            :style="getItemTransformStyle(idx)"
            class="absolute flex items-center justify-center px-3.5 py-1 rounded-full select-none whitespace-nowrap will-change-transform"
            :class="[
              isDragging
                ? 'transition-none'
                : 'transition-[transform,opacity,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              Math.round(continuousIndex) === idx
                ? 'bg-gradient-to-r from-blue-600 to-[#8470FF] text-white border border-[#ffe600] shadow-[0_0_14px_rgba(132,112,255,0.45)] z-20'
                : 'bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 border border-white/10 z-10'
            ]"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-xs leading-none">{{ sec.icon }}</span>
              <span 
                class="tracking-tight leading-none"
                :class="Math.round(continuousIndex) === idx ? 'text-[11px] sm:text-xs font-black text-white' : 'text-[10px] sm:text-[11px] font-bold text-slate-300'"
              >
                {{ sec.label }}
              </span>
              <span 
                v-if="Math.round(continuousIndex) === idx"
                class="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#ffe600] text-black text-[9px] font-mono font-black leading-tight"
              >
                {{ idx + 1 }}/{{ availableSections.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- NÚT PHẢI (>) NHỎ GỌN -->
        <button
          type="button"
          :disabled="activeIndex >= availableSections.length - 1"
          @click="goToNextSection"
          class="z-30 w-7 h-7 rounded-lg bg-white/5 hover:bg-[#ffe600] text-slate-200 hover:text-black disabled:opacity-20 disabled:pointer-events-none border border-white/10 hover:border-black flex items-center justify-center text-xs font-black transition-all shrink-0 cursor-pointer"
          title="Section tiếp theo"
        >
          ❯
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAssetStore } from '../../stores/useAssetStore'

const assetStore = useAssetStore()

const SECTION_DEFINITIONS = [
  { id: 'HeroSection', icon: '🚀', label: 'Hero Showcase' },
  { id: 'RecentlyViewedSection', icon: '🕒', label: 'Recently Viewed' },
  { id: 'WhyChooseUsSection', icon: '💎', label: 'Why Choose Us' },
  { id: 'AssetLibrarySection', icon: '📦', label: 'Asset Library' },
  { id: 'AssetSpecSection', icon: '⚙️', label: '3D Tech Specs' },
  { id: 'ProductionRoadmapSection', icon: '🗺️', label: 'Roadmap' },
  { id: 'QuickListSection', icon: '⚡', label: 'Quick List' },
  { id: 'TestimonialSection', icon: '💬', label: 'Testimonials' },
  { id: 'FaqAccordionSection', icon: '❓', label: 'FAQ' },
  { id: 'FavoriteAssetsSection', icon: '❤️', label: 'My Favorites' },
  { id: 'ContactSection', icon: '✉️', label: 'Contact Us' }
]

const DOCK_STORAGE_KEY = 'cmg_bottom_section_dock_open'
const isOpen = ref(localStorage.getItem(DOCK_STORAGE_KEY) !== 'false')

const activeIndex = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragDeltaX = ref(0)
const hasMovedDuringDrag = ref(false)

let isProgrammaticScroll = false
let scrollAnimationRaf = null

// Khoảng cách ngang giữa tâm các thẻ A - B - C
const ITEM_SPACING_PX = 210

/**
 * [YÊU CẦU 3]: Kiểm tra điều kiện hiển thị thực tế của RecentlyViewed & FavoriteAssets
 * Nếu người dùng mới vào trang chưa có dữ liệu ở 2 mục này, tự động loại khỏi danh sách!
 */
const availableSections = computed(() => {
  return SECTION_DEFINITIONS.filter((sec) => {
    if (sec.id === 'RecentlyViewedSection') {
      return Boolean(assetStore.hasRecentlyViewed)
    }
    if (sec.id === 'FavoriteAssetsSection') {
      return Boolean(assetStore.hasFavorites)
    }
    return true
  })
})

// Đảm bảo activeIndex không bị vượt giới hạn khi danh sách Section thay đổi động
watch(availableSections, (newList) => {
  if (activeIndex.value >= newList.length) {
    activeIndex.value = Math.max(0, newList.length - 1)
  }
})

const continuousIndex = computed(() => {
  const dragIndexOffset = -dragDeltaX.value / ITEM_SPACING_PX
  const raw = activeIndex.value + dragIndexOffset
  return Math.max(0, Math.min(availableSections.value.length - 1, raw))
})

const currentSection = computed(() => availableSections.value[activeIndex.value] || null)

const getItemTransformStyle = (idx) => {
  const diff = idx - continuousIndex.value
  const absDiff = Math.abs(diff)

  if (absDiff > 2.6) {
    return {
      transform: `translate3d(${diff * ITEM_SPACING_PX}px, 0, 0) scale(0.65)`,
      opacity: 0,
      pointerEvents: 'none'
    }
  }

  const translateX = diff * ITEM_SPACING_PX
  // Mục ở giữa (diff = 0) phóng to 1.08, 2 mục bên cạnh thu nhỏ 0.84 và mờ 0.42
  const scale = Math.max(0.72, 1.08 - absDiff * 0.24)
  const opacity = absDiff < 0.15 ? 1 : Math.max(0.15, 0.78 - absDiff * 0.36)

  return {
    transform: `translate3d(${translateX}px, 0, 0) scale(${scale})`,
    opacity
  }
}

const toggleDock = () => {
  isOpen.value = !isOpen.value
  localStorage.setItem(DOCK_STORAGE_KEY, isOpen.value ? 'true' : 'false')
}

// =========================================================================
// [YÊU CẦU 2]: HÀM CUỘN TRANG SIÊU MƯỢT BẰNG REQUESTANIMATIONFRAME (EASE-IN-OUT)
// =========================================================================
const smoothScrollToY = (targetY, duration = 680) => {
  if (scrollAnimationRaf) {
    cancelAnimationFrame(scrollAnimationRaf)
  }

  const startY = window.scrollY || document.documentElement.scrollTop
  const distance = targetY - startY
  if (Math.abs(distance) < 4) {
    isProgrammaticScroll = false
    return
  }

  isProgrammaticScroll = true
  const startTime = performance.now()

  // Hàm nội suy mượt mà ở cả điểm bắt đầu lẫn điểm kết thúc (easeInOutCubic)
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(1, elapsed / duration)
    const eased = easeInOutCubic(progress)

    window.scrollTo(0, startY + distance * eased)

    if (progress < 1) {
      scrollAnimationRaf = requestAnimationFrame(step)
    } else {
      scrollAnimationRaf = null
      setTimeout(() => {
        isProgrammaticScroll = false
      }, 60)
    }
  }

  scrollAnimationRaf = requestAnimationFrame(step)
}

const scrollToIndex = (targetIdx) => {
  if (targetIdx < 0 || targetIdx >= availableSections.value.length) return
  activeIndex.value = targetIdx

  const targetSec = availableSections.value[targetIdx]
  const el = document.getElementById(targetSec.id)
  if (!el) return

  const headerOffset = 68
  const topPos = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset)
  smoothScrollToY(topPos, 680)
}

const goToPrevSection = () => {
  if (activeIndex.value > 0) scrollToIndex(activeIndex.value - 1)
}

const goToNextSection = () => {
  if (activeIndex.value < availableSections.value.length - 1) scrollToIndex(activeIndex.value + 1)
}

const handleItemClick = (idx) => {
  if (hasMovedDuringDrag.value) return
  scrollToIndex(idx)
}

// =========================================================================
// XỬ LÝ KÉO CHUỘT NGANG (MOUSE DRAG & TOUCH DRAG)
// =========================================================================
const startDrag = (e) => {
  isDragging.value = true
  hasMovedDuringDrag.value = false
  dragStartX.value = e.clientX
  dragDeltaX.value = 0

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', endDrag)
}

const startTouchDrag = (e) => {
  if (!e.touches?.[0]) return
  isDragging.value = true
  hasMovedDuringDrag.value = false
  dragStartX.value = e.touches[0].clientX
  dragDeltaX.value = 0

  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', endDrag)
}

const onDragMove = (e) => {
  if (!isDragging.value) return
  const delta = e.clientX - dragStartX.value
  if (Math.abs(delta) > 5) hasMovedDuringDrag.value = true
  dragDeltaX.value = delta
}

const onTouchMove = (e) => {
  if (!isDragging.value || !e.touches?.[0]) return
  const delta = e.touches[0].clientX - dragStartX.value
  if (Math.abs(delta) > 5) hasMovedDuringDrag.value = true
  dragDeltaX.value = delta
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false

  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', endDrag)

  if (hasMovedDuringDrag.value) {
    const snappedIndex = Math.round(continuousIndex.value)
    dragDeltaX.value = 0
    scrollToIndex(snappedIndex)
  } else {
    dragDeltaX.value = 0
  }
}

// Hủy cuộn tự động nếu người dùng chủ động lăn con lăn chuột
const cancelAutoScrollOnWheel = () => {
  if (scrollAnimationRaf) {
    cancelAnimationFrame(scrollAnimationRaf)
    scrollAnimationRaf = null
    isProgrammaticScroll = false
  }
}

// =========================================================================
// ĐỒNG BỘ KHI NGƯỜI DÙNG LĂN CHUỘT TRÊN TRANG WEB
// =========================================================================
const handleWindowScroll = () => {
  if (isProgrammaticScroll || isDragging.value) return

  const viewportFocus = window.scrollY + window.innerHeight * 0.4
  let bestIndex = 0
  let minDistance = Infinity

  availableSections.value.forEach((sec, idx) => {
    const el = document.getElementById(sec.id)
    if (el && el.offsetHeight > 10) {
      const rect = el.getBoundingClientRect()
      const secTop = rect.top + window.scrollY
      const secCenter = secTop + rect.height / 2
      const dist = Math.abs(viewportFocus - secCenter)
      if (dist < minDistance) {
        minDistance = dist
        bestIndex = idx
      }
    }
  })

  if (activeIndex.value !== bestIndex) {
    activeIndex.value = bestIndex
  }
}

onMounted(() => {
  setTimeout(handleWindowScroll, 250)
  window.addEventListener('scroll', handleWindowScroll, { passive: true })
  window.addEventListener('wheel', cancelAutoScrollOnWheel, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
  window.removeEventListener('wheel', cancelAutoScrollOnWheel)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', endDrag)
  if (scrollAnimationRaf) cancelAnimationFrame(scrollAnimationRaf)
})
</script>
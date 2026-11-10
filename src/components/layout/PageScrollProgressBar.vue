<!-- src/components/layout/PageScrollProgressBar.vue -->
<template>
  <!-- Đặt ở đáy TheHeader (Vị trí B): Chỉ hiển thị trên các trang có nội dung cuộn -->
  <div 
    class="relative w-full h-1.5 bg-slate-900/90 dark:bg-[#0d1017] select-none group z-40 transition-all duration-200 hover:h-2.5"
  >
    <!-- 1. Thanh nền Gradient chạy theo % cuộn trang -->
    <div
      class="h-full bg-gradient-to-r from-blue-500 via-[#8470FF] to-[#00EE76] transition-all duration-100 ease-out relative rounded-r-full"
      :style="{ width: `${scrollPercent}%` }"
    >
      <!-- Đầu ánh sáng phát quang (Glowing Comet Tip) ở mũi thanh tiến trình -->
      <span 
        v-if="scrollPercent > 1"
        class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00EE76] shadow-[0_0_12px_3px_rgba(0,238,118,0.85)] animate-pulse"
      ></span>
    </div>

    <!-- 2. Các đốt đánh dấu vị trí từng Section trên Landing Page (Click để nhảy tới Section) -->
    <div class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
      <button
        v-for="sec in detectedSections"
        :key="sec.id"
        type="button"
        @click="scrollToSection(sec.id)"
        :style="{ left: `${sec.positionPercent}%` }"
        class="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-200 cursor-pointer"
        :class="[
          scrollPercent >= sec.positionPercent
            ? 'bg-[#ffe600] border border-slate-950 scale-110 shadow-[0_0_8px_#ffe600]'
            : 'bg-slate-600/70 hover:bg-white scale-75 group-hover:scale-110'
        ]"
        :title="`Chuyển tới: ${sec.label}`"
      ></button>
    </div>

    <!-- 3. Huy hiệu nổi (Floating Pill) báo tên Section hiện tại, % và Thời lượng đọc còn lại -->
    <transition name="pill-fade">
      <div
        v-if="scrollPercent > 2 || isHoveringBar"
        class="absolute right-6 top-3 px-3 py-1 rounded-full bg-[#161a23]/95 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center gap-2.5 text-[11px] font-bold text-slate-200 pointer-events-none"
      >
        <!-- Chấm trạng thái & Tên phần nội dung đang đọc -->
        <span class="flex items-center gap-1.5 text-[#00EE76] font-black">
          <span class="w-1.5 h-1.5 rounded-full bg-[#00EE76] animate-ping"></span>
          {{ currentSectionLabel }}
        </span>

        <span class="text-slate-600">•</span>

        <!-- Phần trăm tiến độ trang -->
        <span class="font-mono font-black text-[#ffe600]">
          {{ Math.round(scrollPercent) }}%
        </span>

        <span class="text-slate-600 hidden sm:inline">•</span>

        <!-- Thời lượng đọc ước tính còn lại -->
        <span class="text-[10px] text-slate-400 font-semibold hidden sm:inline">
          {{ estimatedTimeRemaining }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollPercent = ref(0)
const isHoveringBar = ref(false)
const currentSectionLabel = ref('Khám phá Mở đầu')
const detectedSections = ref([])

// Danh sách các Section tiêu biểu trên trang Landing Page của bạn
const LANDING_SECTIONS = [
  { id: 'HeroSection', label: '🚀 Mở đầu (Hero)' },
  { id: 'WhyChooseUsSection', label: '💎 Vì sao chọn CuteMagic' },
  { id: 'AssetLibrarySection', label: '📦 Thư viện 3D Pack' },
  { id: 'AssetSpecSection', label: '⚙️ Thông số Kỹ thuật' },
  { id: 'ProductionRoadmapSection', label: '🗺️ Lộ trình Sản xuất' },
  { id: 'QuickListSection', label: '⚡ Bảng xếp hạng Nhanh' },
  { id: 'TestimonialSection', label: '💬 Đánh giá Khách hàng' },
  { id: 'FaqAccordionSection', label: '❓ Câu hỏi thường gặp' },
  { id: 'ContactSection', label: '✉️ Liên hệ & Hỗ trợ' }
]

// Tính thời lượng xem còn lại (Giả định toàn trang Landing Page cần khoảng 3 phút trải nghiệm)
const estimatedTimeRemaining = computed(() => {
  const totalSeconds = 180
  const remainingSec = Math.max(0, Math.round(totalSeconds * (1 - scrollPercent.value / 100)))
  if (remainingSec === 0) return 'Đã xem hết trang 🎉'
  if (remainingSec < 60) return `Còn ~${remainingSec}s xem`
  return `Còn ~${Math.ceil(remainingSec / 60)} phút xem`
})

const calculateSectionPositions = () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) return

  const found = []
  LANDING_SECTIONS.forEach((sec) => {
    const el = document.getElementById(sec.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY
      const posPercent = Math.min(98, Math.max(2, Math.round((offsetTop / docHeight) * 100)))
      found.push({
        ...sec,
        offsetTop,
        positionPercent: posPercent
      })
    }
  })
  detectedSections.value = found
}

const updateScrollProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight

  if (docHeight <= 0) {
    scrollPercent.value = 0
    return
  }

  const rawPercent = (scrollTop / docHeight) * 100
  scrollPercent.value = Math.min(100, Math.max(0, rawPercent))

  // Xác định người dùng đang đứng ở Section nào
  if (detectedSections.value.length > 0) {
    const viewportTrigger = scrollTop + window.innerHeight * 0.35
    let active = detectedSections.value[0]
    for (const sec of detectedSections.value) {
      if (viewportTrigger >= sec.offsetTop) {
        active = sec
      }
    }
    currentSectionLabel.value = active.label
  } else {
    if (scrollPercent.value < 15) currentSectionLabel.value = '🚀 Mở đầu (Hero)'
    else if (scrollPercent.value < 45) currentSectionLabel.value = '📦 Kho Tài nguyên 3D'
    else if (scrollPercent.value < 75) currentSectionLabel.value = '🗺️ Lộ trình & Xếp hạng'
    else currentSectionLabel.value = '✉️ Thông tin & Liên hệ'
  }
}

const scrollToSection = (sectionId) => {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

let resizeTimer = null
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    calculateSectionPositions()
    updateScrollProgress()
  }, 200)
}

onMounted(() => {
  setTimeout(() => {
    calculateSectionPositions()
    updateScrollProgress()
  }, 400)
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pill-fade-enter-active,
.pill-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.pill-fade-enter-from,
.pill-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
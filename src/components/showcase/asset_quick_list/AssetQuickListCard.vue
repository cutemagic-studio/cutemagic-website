<template>
  <!-- 1. THẺ CHA: Ép chiều cao cố định (Mobile: 120px, Desktop: 136px) -->
  <div 
    @click="goToDetail"
    :class="[theme.ui.assetCardQuickList, 'cursor-pointer']"
  >

    <!-- ==========================================
         2. KHU VỰC ẢNH: Đặt h-full để giãn bằng 100% chiều cao thẻ cha
         ========================================== -->
    <div class="relative group shrink-0 w-[120px] sm:w-[136px] h-full border-r border-cmg-subtle/50">
      
      <div class="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          v-if="asset?.media?.cover"
          :src="asset.media.cover" 
          :alt="asset?.title"
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
        />
      </div>
      
      <!-- Model Count (Đọc chuẩn từ techSpecs.modelCount hoặc getter modelCount) -->
      <div 
        v-if="modelCount > 0" 
        class="absolute top-0 right-0 bg-[#ffe600] text-black text-[10px] font-black px-1.5 py-0.5 uppercase tracking-tight rounded-bl-md z-10"
        title="Tổng số lượng 3D Models trong Pack"
      >
        {{ modelCount }}
      </div>

      <!-- Huy hiệu Featured / Exclusive góc trái trên (nếu bật trong Admin) -->
      <div 
        v-if="asset?.flags?.isFeatured || asset?.flags?.isExclusive" 
        class="absolute top-0 left-0 px-1.5 py-0.5 text-[9px] font-black uppercase rounded-br-md z-10"
        :class="asset?.flags?.isExclusive ? 'bg-purple-600 text-white' : 'bg-amber-500 text-black'"
      >
        {{ asset?.flags?.isExclusive ? '💎' : '⭐' }}
      </div>
      
      <!-- Category Bar -->
      <div class="absolute bottom-0 w-full flex flex-col z-10">
        <div class="bg-[#ffe600] text-black text-center font-black uppercase tracking-widest py-1 text-[9px] truncate px-1">
          {{ asset?.categoryId || 'all' }}
        </div>
      </div>
      
      <!-- Action Pill (Quick Action & Heart Favorite thực tế) -->
      <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#161616]/95 rounded-full flex items-center px-3 py-1.5 gap-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-700 z-20">
        <!-- Nút mở nhanh Store / Chi tiết -->
        <button 
          type="button"
          @click.stop="handleQuickStoreAction" 
          class="text-white hover:text-[#ffe600] transition-colors cursor-pointer"
          :title="isFree ? 'Download for free' : 'Quick Store / View Details'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>

        <div class="w-px h-3 bg-gray-600"></div>

        <!-- Nút Yêu thích đồng bộ trực tiếp với Pinia & Firebase -->
        <button 
          type="button"
          @click.stop="toggleWishlist" 
          class="transition-transform active:scale-90 cursor-pointer"
          :class="isLiked ? 'text-[#ff005b]' : 'text-white hover:text-[#ff005b]'"
          :title="isLiked ? 'Unfavorite' : 'Add to favorites'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :fill="isLiked ? 'currentColor' : 'none'" 
            viewBox="0 0 24 24" 
            stroke-width="2" 
            stroke="currentColor" 
            class="w-4 h-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ==========================================
         3. KHU VỰC NỘI DUNG: Dùng h-full và justify-between
         ========================================== -->
    <div class="p-2.5 flex flex-col flex-1 min-w-0 h-full justify-between">
      
      <!-- Nửa trên: Tên Pack (Tự động neo sát trần) -->
      <div class="flex flex-col">
        <h3 :class="[theme.ui.assetCardTitleQuickList]" :title="asset?.title">
          {{ asset?.title }}
        </h3>
      </div>

      <!-- Nửa dưới: Khối thông tin đặc thù theo từng cột (Tự động neo sát đáy) -->
      <div class="mt-auto">
        
        <!-- ===================================================== -->
        <!-- TRƯỜNG HỢP 1: NEW RELEASES (Mới ra mắt & Mới cập nhật) -->
        <!-- ===================================================== -->
        <template v-if="variant === 'new'">
          <div class="flex flex-col gap-1">
            <!-- Dòng hiển thị Ngày cập nhật gần nhất (Để khách thấy Pack luôn được chăm sóc) -->
            <div v-if="displayUpdateDate" class="flex items-center gap-1 text-[10px] font-bold text-cmg-muted">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span class="truncate">
                {{ hasRecentUpdate ? 'Updated:' : 'Released:' }} 
                <strong class="text-cmg-title">{{ displayUpdateDate }}</strong>
              </span>
            </div>

            <!-- Dòng thời hạn giảm giá (Nếu đang chạy Sale trong Admin) -->
            <span 
              v-if="discountEndsIn" 
              class="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">Sale: {{ discountEndsIn }}</span>
            </span>

            <!-- Giá bán & Khuyến mãi đồng bộ qua AssetPriceTag -->
            <div class="flex justify-start w-full pt-0.5">
              <AssetPriceTag :asset="asset" size="sm" />
            </div>
          </div>
        </template>

        <!-- ===================================================== -->
        <!-- TRƯỜNG HỢP 2: TOP RATED (Xếp hạng Tương tác Thực tế)  -->
        <!-- ===================================================== -->
        <template v-else-if="variant === 'top'">
          <div class="flex flex-col gap-0.5 text-[9px] sm:text-[10px] text-cmg-muted font-medium mb-1">
            <div class="flex items-center gap-1.5">
              <span class="text-red-500">❤️</span> Like: 
              <span class="text-cmg-title font-bold">{{ formatNumber(likesCount) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-blue-500">👁️</span> View: 
              <span class="text-cmg-title font-bold">{{ formatNumber(viewsCount) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-500">⬇️</span> Down: 
              <span class="text-cmg-title font-bold">{{ formatNumber(downloadsCount) }}</span>
            </div>
          </div>
          <!-- Nhúng Component Giá -->
          <div class="flex justify-start w-full">
            <AssetPriceTag :asset="asset" size="sm" />
          </div>
        </template>

        <!-- ===================================================== -->
        <!-- TRƯỜNG HỢP 3: COMING SOON (Sắp ra mắt & Tiến độ)      -->
        <!-- ===================================================== -->
        <template v-else-if="variant === 'upcoming'">
          <div class="flex flex-col gap-1">
            <!-- Thanh tiến độ nhỏ nếu Pack có cấu hình Roadmap progress > 0 -->
            <div v-if="roadmapProgress > 0" class="w-full space-y-0.5">
              <div class="flex justify-between text-[9px] font-black uppercase text-indigo-500 dark:text-indigo-400">
                <span>Tiến độ 3D</span>
                <span>{{ roadmapProgress }}%</span>
              </div>
              <div class="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  :style="{ width: `${roadmapProgress}%` }"
                ></div>
              </div>
            </div>

            <span v-else class="text-[11px] sm:text-xs text-cmg-muted truncate">
              Release: <strong class="text-cmg-title">{{ upcomingReleaseTarget }}</strong>
            </span>

            <!-- Nhãn thời gian dự kiến (Available In) -->
            <span class="text-[10px] sm:text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">Available in: {{ availableInLabel }}</span>
            </span>
          </div>
        </template>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../../stores/useThemeStore.js'
import { useAssetStore } from '../../../stores/useAssetStore.js'

import AssetPriceTag from '../../../views/pages/assets/asset_detail/child_components/AssetPriceTag.vue'

const router = useRouter()
const theme = useThemeStore()
const assetStore = useAssetStore()

const props = defineProps({
  asset: {
    type: Object,
    required: true,
    default: () => ({})
  },
  variant: {
    type: String,
    default: 'top',
    validator: (value) => ['new', 'top', 'upcoming'].includes(value)
  }
})

// ==========================================
// COMPUTED PROPERTIES CHUẨN HÓA CMGASSETMODEL
// ==========================================

// 1. Số lượng 3D Models
const modelCount = computed(() => {
  return Number(props.asset?.techSpecs?.modelCount ?? props.asset?.modelCount ?? 0)
})

// 2. Kiểm tra miễn phí & Khuyến mãi
const isFree = computed(() => {
  return Number(props.asset?.pricing?.price ?? props.asset?.price ?? 0) === 0
})

const discountEndsIn = computed(() => {
  return props.asset?.pricing?.discountEndsIn || props.asset?.discountEndsIn || ''
})

// 3. Ngày cập nhật / Phát hành cho cột New Releases
const hasRecentUpdate = computed(() => {
  const latest = props.asset?.dates?.latestUpdate
  const initial = props.asset?.dates?.initialRelease
  return Boolean(latest && latest !== initial)
})

const displayUpdateDate = computed(() => {
  return props.asset?.dates?.latestUpdate || props.asset?.dates?.initialRelease || props.asset?.releaseDate || ''
})

// 4. Các chỉ số tương tác thực tế từ Firebase cho cột Top Rated
const likesCount = computed(() => Number(props.asset?.metrics?.likes ?? props.asset?.likes ?? 0))
const viewsCount = computed(() => Number(props.asset?.metrics?.views ?? props.asset?.views ?? 0))
const downloadsCount = computed(() => Number(props.asset?.metrics?.downloads ?? props.asset?.downloads ?? 0))

// 5. Thông tin Lịch trình & Roadmap cho cột Coming Soon
const roadmapProgress = computed(() => Number(props.asset?.roadmap?.progress ?? 0))

const upcomingReleaseTarget = computed(() => {
  return props.asset?.roadmap?.estimatedDelivery || props.asset?.dates?.initialRelease || 'TBA'
})

const availableInLabel = computed(() => {
  return props.asset?.dates?.availableIn || props.asset?.availableIn || props.asset?.roadmap?.estimatedDelivery || 'Sắp ra mắt'
})

// 6. Trạng thái Yêu thích (Tim hồng)
const isLiked = computed(() => {
  if (!props.asset?.id) return false
  return assetStore.isFavorite(props.asset.id)
})

// ==========================================
// CÁC HÀM XỬ LÝ SỰ KIỆN
// ==========================================
const formatNumber = (num) => {
  const n = Number(num || 0)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

const goToDetail = () => {
  if (props.asset?.id) {
    router.push({ name: 'AssetDetailView', params: { id: props.asset.id } })
  }
}

const toggleWishlist = () => {
  if (props.asset?.id) {
    assetStore.toggleFavorite(props.asset.id)
  }
}

const handleQuickStoreAction = () => {
  // Mở nhanh link cửa hàng ưu tiên nếu có, nếu không thì vào trang chi tiết
  const links = props.asset?.links || {}
  const targetUrl = links.unity || links.fab || links.itch || links.cgtrader
  if (targetUrl) {
    window.open(targetUrl, '_blank')
  } else {
    goToDetail()
  }
}
</script>
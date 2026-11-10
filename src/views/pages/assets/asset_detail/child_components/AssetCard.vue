<template>
  <div @click="goToDetail" :class="[theme.ui.assetCard, 'cursor-pointer']">

    <!-- Image Area (Relative for absolute positioning inside) -->
    <div class="relative group shrink-0">

      <!-- Thumbnail Image -->
      <div class="aspect-[4/3] w-full overflow-hidden">
        <img :src="asset?.media?.cover" :alt="asset?.title"
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
      </div>

      <!-- Top Right Badge (Model Count) -->
      <div v-if="modelCount > 0"
        class="absolute top-0 right-0 bg-[#ffe600] text-black text-[11px] sm:text-xs font-black px-2 py-1 uppercase tracking-tight custom-round z-10">
        {{ modelCount }} Models!
      </div>

      <!-- Bottom Overlays (Category) -->
      <div class="absolute bottom-0 w-full flex flex-col">
        <div
          class="bg-[#ffe600] text-black text-center font-black uppercase tracking-widest py-1.5 text-[10px] sm:text-xs">
          {{ asset?.categoryId }}
        </div>
      </div>

      <!-- Action Pill (Cart & Heart) - Hiển thị khi Hover -->
      <div
        class="absolute left-1/2 -translate-x-1/2 bottom-6 bg-[#161616]/95 rounded-full flex items-center px-5 py-2.5 gap-5 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-700 z-20">

        <!-- Quick Store / Detail Button -->
        <button 
          type="button"
          @click.stop="handleQuickStoreAction" 
          class="text-white hover:text-[#ffe600] transition-colors cursor-pointer" 
          :title="asset?.isFree ? 'Tải xuống miễn phí' : 'Mở nhanh Cửa hàng / Chi tiết'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>

        <!-- Divider Line -->
        <div class="w-px h-4 bg-gray-600"></div>

        <!-- Wishlist Button (Đồng bộ Pinia & Firebase) -->
        <button 
          type="button"
          @click.stop="toggleWishlist" 
          class="transition-transform active:scale-90 cursor-pointer"
          :class="isLiked ? 'text-[#ff005b]' : 'text-white hover:text-[#ff005b]'"
          :title="isLiked ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :fill="isLiked ? 'currentColor' : 'none'" 
            viewBox="0 0 24 24" 
            stroke-width="2" 
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

      </div>

    </div>

    <!-- Text Details Area -->
    <div class="px-2 py-2 flex flex-col flex-1 bg-[#1e1e1e]">
      <h3 :class="[theme.ui.assetCardTitle]">
        {{ asset?.title }}
      </h3>

      <div class="mt-auto pt-2 flex justify-center w-full">
        <AssetPriceTag :asset="asset" size="sm" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../../../../stores/useThemeStore.js'
import { useAssetStore } from '../../../../../stores/useAssetStore.js'

import AssetPriceTag from './AssetPriceTag.vue'

const router = useRouter()
const theme = useThemeStore()
const assetStore = useAssetStore()

const props = defineProps({
  asset: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const modelCount = computed(() => {
  return Number(props.asset?.techSpecs?.modelCount ?? props.asset?.modelCount ?? 0)
})

const isLiked = computed(() => {
  if (!props.asset?.id) return false
  return assetStore.isFavorite(props.asset.id)
})

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
  const links = props.asset?.links || {}
  const targetUrl = links.unity || links.fab || links.itch || links.cgtrader
  if (targetUrl) {
    window.open(targetUrl, '_blank')
  } else {
    goToDetail()
  }
}
</script>

<style lang="css">
.custom-round {
  border-bottom-left-radius: 10px;
}
</style>
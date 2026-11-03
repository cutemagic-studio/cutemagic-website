<template>
  <div class="flex flex-col bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 w-full border-2 border-slate-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-gray-500 group/card">
  <!-- <div class="flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 w-full border-2"> -->
    
    <!-- Image Area (Relative for absolute positioning inside) -->
    <div class="relative group cursor-pointer">
      
      <!-- Thumbnail Image -->
      <div class="aspect-[4/3] w-full overflow-hidden">
        <img :src="asset?.media?.cover" :alt="asset.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      
      <!-- Top Right Badge (Model Count) -->
      <div v-if="asset.modelCount" class="absolute top-0 right-0 bg-[#ffe600] text-black text-[11px] sm:text-xs font-black px-2 py-1 uppercase tracking-tight custom-round">
        {{ asset.modelCount }} Models!
      </div>
      
      <!-- Bottom Overlays (Sub-title & Category) -->
      <div class="absolute bottom-0 w-full flex flex-col">
        <!-- Semi-transparent grey bar -->
        <!-- <div class="bg-black/60 backdrop-blur-sm text-white text-center font-bold uppercase tracking-wider py-1.5 text-xs sm:text-sm">
          {{ asset.series }}
        </div> -->
        <!-- Solid yellow bar -->
        <div class="bg-[#ffe600] text-black text-center font-black uppercase tracking-widest py-1.5 text-[10px] sm:text-xs">
          {{ asset.categoryId }}
        </div>
      </div>

      <!-- Action Pill (Cart & Heart) - Hiển thị khi Hover -->
      <div class="absolute left-1/2 -translate-x-1/2 bottom-6 bg-[#161616] rounded-full flex items-center px-5 py-2.5 gap-5 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-700 z-10">
        
        <!-- Add to Cart Button -->
        <button @click.stop="addToCart" class="text-white hover:text-[#ffe600] transition-colors" title="Add to Cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>

        <!-- Divider Line -->
        <div class="w-px h-4 bg-gray-600"></div>

        <!-- Wishlist Button -->
        <button @click.stop="addToWishlist" class="text-white hover:text-[#e11d48] transition-colors" title="Add to Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

      </div>

    </div>

    <!-- Text Details Area -->
    <div class="px-4 py-3 flex flex-col items-center justify-center bg-[#1e1e1e]">
      <h3 class="text-white text-sm sm:text-base font-bold text-center leading-tight mb-1.5 hover:text-[#ffe600] transition-colors cursor-pointer" @click="goToDetail">
        {{ asset.title }}
      </h3>
      <!-- <span class="text-[#ff0055] text-lg sm:text-xl font-black">
        ${{ asset.price }}
      </span> -->
      <div>
        <!-- Khối div mờ bọc ngoài giá tiền -->
        <div class="px-3 py-0.5 bg-black/40 backdrop-blur-sm border border-[#ff0055]/50 rounded-md shadow-sm">
            <span class="text-[#ff0055] text-base sm:text-lg font-black tracking-wide">
            ${{ asset.price }}
            </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Định nghĩa Props nhận từ component cha (AssetGallery)
const props = defineProps({
  asset: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      image: 'https://via.placeholder.com/400x300',
      modelCount: 879,
      series: 'APARTMENT INTERIOR & EXTERIOR',
      category: 'LOW POLY ASSETS',
      title: 'Low Poly Apartment Interior & Exterior',
      price: '49.99'
    })
  }
}) 

// Các hàm xử lý sự kiện
const goToDetail = () => {
  router.push({ name: 'AssetDetailView', params: { id: props.asset.id } })
}

const addToCart = () => {
  console.log('Đã thêm vào giỏ hàng:', props.asset.title)
  // Gọi action của Store Pinia tại đây
}

const addToWishlist = () => {
  console.log('Đã thêm vào yêu thích:', props.asset.title)
  // Gọi API hoặc Store tại đây
}
</script>

<style lang="css">
.custom-round {
    border-bottom-left-radius: 10px;
}
</style>
<template>
    <div class="mt-16 mb-12">
        <h2 class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-6">Related products</h2>
        
        <div class="relative px-10 sm:px-14">
            
            <!-- NÚT TRÁI (PREV) -->
            <button 
                v-if="totalPages > 1"
                @click="prevPage" 
                class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white bg-transparent hover:bg-blue-600 dark:hover:bg-[#ff005b] rounded-full transition-all duration-300 z-10 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Khối chứa danh sách sản phẩm -->
            <div class="overflow-hidden py-2">
                <transition :name="transitionName" mode="out-in">
                    <div :key="currentPage" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
                        
                        <!-- SỬ DỤNG COMPONENT ASSETCARD -->
                        <AssetCard 
                            v-for="product in paginatedProducts" 
                            :key="product.id"
                            :asset="product"
                        />

                    </div>
                </transition>
            </div>

            <!-- NÚT PHẢI (NEXT) -->
            <button 
                v-if="totalPages > 1"
                @click="nextPage" 
                class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white bg-transparent hover:bg-blue-600 dark:hover:bg-[#ff005b] rounded-full transition-all duration-300 z-10 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            
        </div>

        <!-- KHỐI PHÂN TRANG (Dấu chấm) -->
        <div class="flex justify-center items-center gap-3 mt-8" v-if="totalPages > 1">
            <button 
                v-for="page in totalPages" 
                :key="page"
                @click="goToPage(page)"
                class="rounded-full transition-all duration-300 outline-none cursor-pointer"
                :class="currentPage === page 
                    ? 'w-2 h-2 bg-slate-900 dark:bg-white' 
                    : 'w-2 h-2 bg-transparent border border-slate-400 dark:border-gray-500 hover:border-slate-600 dark:hover:border-gray-300'"
                :aria-label="'Page ' + page"
            ></button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssetStore } from '../../../../../stores/useAssetStore' // Cập nhật đúng đường dẫn của bạn

import AssetCard from './AssetCard.vue' // Cập nhật đúng đường dẫn AssetCard

// 1. NHẬN PROPS TỪ TRANG CHI TIẾT
const props = defineProps({
    currentAssetId: {
        type: Number,
        default: null
    },
    categoryId: {
        type: String,
        default: ''
    }
})

// Khởi tạo Store và lấy danh sách assets
const assetStore = useAssetStore()
// Sử dụng bí danh allAssets để tránh nhầm lẫn biến
const { assets: allAssets } = storeToRefs(assetStore)

// 2. LOGIC LỌC SẢN PHẨM LIÊN QUAN
const relatedAssets = computed(() => {
    // Lưu ý: Vì dùng storeToRefs, allAssets hiện tại là một Ref, cần gọi .value
    if (!allAssets.value || allAssets.value.length === 0) return []

    // Lọc các asset cùng danh mục và KHÁC với asset đang xem
    let filtered = allAssets.value.filter(asset => 
        asset.categoryId === props.categoryId && asset.id !== props.currentAssetId
    )
    
    // Nếu không có sản phẩm cùng danh mục, lấy các sản phẩm ngẫu nhiên khác để hiển thị
    if (filtered.length === 0) {
        filtered = allAssets.value.filter(asset => asset.id !== props.currentAssetId)
    }

    // Giới hạn 9 sản phẩm
    return filtered.slice(0, 9)
})

// 3. STATE QUẢN LÝ PHÂN TRANG VÀ ANIMATION
const itemsPerPage = 3 
const currentPage = ref(1) 
const transitionName = ref('slide-left') 

const totalPages = computed(() => {
    return Math.ceil(relatedAssets.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return relatedAssets.value.slice(start, end)
})

// 4. HÀM ĐIỀU KHIỂN CHUYỂN TRANG
const nextPage = () => {
    transitionName.value = 'slide-left'
    currentPage.value = currentPage.value < totalPages.value ? currentPage.value + 1 : 1
}

const prevPage = () => {
    transitionName.value = 'slide-right'
    currentPage.value = currentPage.value > 1 ? currentPage.value - 1 : totalPages.value
}

const goToPage = (page) => {
    if (page === currentPage.value) return
    transitionName.value = page > currentPage.value ? 'slide-left' : 'slide-right'
    currentPage.value = page
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-left-enter-from {
    opacity: 0;
    transform: translateX(40px);
}
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-40px);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-40px);
}
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(40px);
}
</style>
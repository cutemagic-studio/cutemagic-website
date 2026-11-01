<template>
    <div class="mt-16 mb-12">
        <h2 class="text-xl lg:text-2xl font-bold text-white mb-6">Related products</h2>
        
        <!-- Khung chứa có padding 2 bên để nhường chỗ cho 2 nút bấm mũi tên -->
        <div class="relative px-10 sm:px-14">
            
            <!-- NÚT TRÁI (PREV) -->
            <button 
                v-if="totalPages > 1"
                @click="prevPage" 
                class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-transparent hover:bg-[#ff005b] rounded-full transition-all duration-300 z-10 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Khối chứa danh sách sản phẩm (Bọc overflow-hidden để lúc trượt không bị tràn thanh cuộn ngang) -->
            <div class="overflow-hidden py-2">
                <!-- Transition với tên class thay đổi động (slide-left hoặc slide-right) -->
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
                class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-transparent hover:bg-[#ff005b] rounded-full transition-all duration-300 z-10 cursor-pointer"
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
                    ? 'w-2 h-2 bg-white' 
                    : 'w-2 h-2 bg-transparent border border-gray-500 hover:border-gray-300'"
                :aria-label="'Page ' + page"
            ></button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import AssetCard from './AssetCard.vue'
import dummyUrl from '../../../../assets/asset_gallery/tree_1.png'

const router = useRouter()

// 1. DỮ LIỆU MẪU (Đã set thành 9 để khớp với yêu cầu 3 trang của bạn)
const assets = Array.from({ length: 9 }).map((_, index) => {
    const isEven = index % 2 === 0;
    return {
        id: index + 1,
        title: `Low Poly Asset Pack ${index + 1}`,
        series: 'APARTMENT INTERIOR & EXTERIOR',
        category: index % 3 === 0 ? '3D Model' : 'SkyIsland',
        modelCount: 800 + index,
        price: isEven ? 29.99 : 49.99, // Để dạng số thực tế để AssetCard dễ format
        software: isEven ? 'Blender' : 'Unity', 
        image: dummyUrl,
        createdAt: new Date(2026, 0, index + 1).getTime() 
    }
})

// 2. STATE QUẢN LÝ PHÂN TRANG VÀ ANIMATION
const itemsPerPage = 3 
const currentPage = ref(1) 
const transitionName = ref('slide-left') // Biến điều khiển hướng trượt CSS

// Tính tổng số trang (9 sản phẩm / 3 = 3 trang)
const totalPages = computed(() => {
    return Math.ceil(assets.length / itemsPerPage)
})

// Cắt mảng để lấy đúng 3 sản phẩm cho trang hiện tại
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return assets.slice(start, end)
})

// 3. CÁC HÀM ĐIỀU KHIỂN CHUYỂN TRANG BẰNG NÚT BẤM
const nextPage = () => {
    transitionName.value = 'slide-left' // Đặt hiệu ứng trượt sang trái
    currentPage.value = currentPage.value < totalPages.value ? currentPage.value + 1 : 1
}

const prevPage = () => {
    transitionName.value = 'slide-right' // Đặt hiệu ứng trượt sang phải
    currentPage.value = currentPage.value > 1 ? currentPage.value - 1 : totalPages.value
}

const goToPage = (page) => {
    if (page === currentPage.value) return
    // Tự động phân tích bấm tiến hay lùi để gọi hướng trượt đúng
    transitionName.value = page > currentPage.value ? 'slide-left' : 'slide-right'
    currentPage.value = page
}
</script>

<style scoped>
/* ==========================================
   HIỆU ỨNG TRƯỢT SANG TRÁI (Dùng cho Next)
   ========================================== */
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

/* ==========================================
   HIỆU ỨNG TRƯỢT SANG PHẢI (Dùng cho Prev)
   ========================================== */
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
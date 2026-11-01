<template>
    <section id="gallery" class="py-24">
        
        <!-- VÙNG 1: HEADER & FILTER (Giữ nguyên max-w-7xl để trông rộng rãi) -->
        <div class="max-w-7xl mx-auto px-6 mb-12">
            <div class="flex flex-col md:flex-row justify-between items-end gap-6">
                <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl w-full md:w-auto">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        AssetGallery
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-6"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                        A professional asset library, built for every project and every developer.
                    </p>
                </div>

                <div class="flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    <button v-for="cat in categories" :key="cat" @click="changeCategory(cat)" :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'
                    ]">
                        {{ cat }}
                    </button>
                </div>
            </div>
        </div>

        <!-- VÙNG 2: LƯỚI ITEM & PHÂN TRANG (Thu hẹp thành max-w-4xl để item tự động bằng 2/3 kích thước cũ) -->
        <div class="mx-auto px-4">
        <!-- <div class="max-w-4xl mx-auto px-6"> -->
            
            <div v-if="paginatedAssets.length === 0" class="text-center py-20 text-gray-500">
                Không tìm thấy asset nào trong danh mục này.
            </div>

            <!-- Đã sửa: lg:grid-cols-3 thành md:grid-cols-3 -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <!-- <div v-for="asset in paginatedAssets" :key="asset.id"
                   class="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-3 border-gray-300 hover:border-blue-400" 
                    >
                    <div class="aspect-[4/3] overflow-hidden">
                        <img :src="asset.img" :alt="asset.title"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>

                    <div class="absolute top-4 left-4 z-10">
                        <BaseBadge :label="asset.tag" :type="asset.tagType" />
                    </div>

                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <span class="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                            {{ asset.category }}
                        </span>
                        <h3 class="text-white text-xl font-bold leading-tight">{{ asset.title }}</h3>
                        
                        <button @click="goToDetail(asset.id)"
                            class="mt-4 w-full py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-sm">
                            View Details
                        </button>
                    </div>
                </div> -->
                
                <AssetCard 
                    v-for="item in paginatedAssets" 
                    :key="item.id" 
                    :asset="item" 
                />
                
            </div>

            <!-- Pagination UI (Đã thu gọn margin top cho cân đối) -->
            <div v-if="totalPages > 1" class="mt-10 flex justify-center items-center space-x-2">
                <!-- NÚT ALL MỚI THÊM -->
                <button @click="goToAllAssets" 
                    class="mr-4 px-6 py-2 rounded-lg font-black tracking-wider transition-colors border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white shadow-sm cursor-pointer">
                    ALL
                </button>
                
                <button @click="prevPage" :disabled="currentPage === 1" 
                    class="px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" 
                    :class="[
                        'w-10 h-10 rounded-lg font-medium transition-all border',
                        currentPage === page 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    ]">
                    {{ page }}
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages" 
                    class="px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseBadge from '../../base/BaseBadge.vue'

// Tạm thời dùng 1 ảnh đại diện để làm mộc data nhanh
import dummyUrl from '../../../assets/asset_gallery/tree_1.png'

import AssetCard from './child_components/AssetCard.vue'

const router = useRouter()
const selectedCategory = ref('All')
const categories = ['All', 'UI Kit', '3D Model', 'Templates']

// Biến cho Phân trang
const itemsPerPage = 12
const currentPage = ref(1)

// Tạo mảng 15 items mẫu để test tính năng phân trang (12 item trang 1, 3 item trang 2)
const assets = Array.from({ length: 15 }).map((_, index) => (
    {
        id: 1,
        title: 'Low Poly Apartment Interior & Exterior',
        series: 'APARTMENT INTERIOR & EXTERIOR',
        category: 'SkyIsland',
        modelCount: 879,
        price: '49.99',
        image: dummyUrl
    }
))

// 1. Lọc danh sách theo Category
const filteredAssets = computed(() => {
  if (selectedCategory.value === 'All') return assets
  return assets.filter(a => a.category === selectedCategory.value)
})

// 2. Tính tổng số trang dựa trên mảng đã lọc
const totalPages = computed(() => {
    return Math.ceil(filteredAssets.value.length / itemsPerPage)
})

// 3. Cắt mảng để lấy đúng 12 item cho trang hiện tại
const paginatedAssets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAssets.value.slice(startIndex, endIndex)
})

// === CÁC HÀM XỬ LÝ SỰ KIỆN ===

// Đổi category (Cần reset lại về trang 1 mỗi khi đổi tab)
const changeCategory = (cat) => {
    selectedCategory.value = cat
    currentPage.value = 1 
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
    currentPage.value = page
}

const goToDetail = (id) => {
  router.push({ name: 'AssetDetailView', params: { id: id } })
}

// Hàm điều hướng sang trang Asset Library tổng
const goToAllAssets = () => {
    // Tên 'AssetLibrary' phải khớp với name bạn đã khai báo trong router/index.js
    router.push({ name: 'AssetLibrary' }) 
}
</script>
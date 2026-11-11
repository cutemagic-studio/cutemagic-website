<template>
    <section id="AssetLibrarySection" class="py-12 z-0">

        <!-- VÙNG 1: HEADER (TITLE + SLIDER + TOOLBAR) -->
        <div class="max-w-7xl mx-auto px-6 mb-12 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">

                <!-- CỘT TRÁI: Khối Tiêu đề (Chiếm 5 phần) -->
                <div
                    class="md:col-span-6 lg:col-span-6 bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-3xl p-8 lg:p-10 flex flex-col shadow-2xl relative overflow-hidden h-full">
                    <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                    <h3
                        class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6 text-white relative z-10">
                        Asset Library
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-6 relative z-10"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed relative z-10">
                        A professional asset library, built for every project and every developer.
                    </p>

                    <!-- KHỐI SỐ LIỆU (Thêm mới) -->
                    <!-- Dùng mt-auto để luôn đẩy khối này xuống đáy thẻ, tự động cân bằng với chiều cao của Slide bên phải -->
                    <div class="mt-auto pt-8 grid grid-cols-3 gap-3 relative z-10">

                        <!-- Ô 1: Tổng số Pack (Màu trắng) -->
                        <div
                            class="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 cursor-default">

                            <!-- Ô 1: Tổng số Pack -->
                            <span class="text-2xl xl:text-3xl font-black text-white mb-1">{{ stats.packs }}+</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Packs</span>
                        </div>

                        <!-- Ô 2: Tổng số Model (Màu xanh dương) -->

                        <div
                            class="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 cursor-default">

                            <!-- Ô 2: Tổng số Model -->
                            <span class="text-2xl xl:text-3xl font-black text-blue-400 mb-1">{{ stats.models }}+</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Models</span>
                        </div>


                        <!-- Ô 3: Số lượng Danh mục (Màu Vàng Amber) -->

                        <div
                            class="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 cursor-default">
                            <!-- Ô 3: Số lượng Danh mục -->
                            <span class="text-2xl xl:text-3xl font-black text-[#FFD700] mb-1">{{ stats.categories
                            }}</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</span>
                        </div>
                    </div>
                </div>

                <!-- CỘT PHẢI: Slide Tự Động & Thanh Công Cụ (Chiếm 7 phần) -->
                <div class="md:col-span-6 lg:col-span-6 flex flex-col gap-5">

                    <!-- AUTO GALLERY SLIDE -->
                    <div
                        class="relative w-full h-[250px] sm:h-[300px] bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 rounded-3xl overflow-hidden shadow-lg group">

                        <transition-group name="fade" tag="div" class="relative w-full h-full">
                            <div v-for="(slide, index) in latestAssets" :key="'slide' + index"
                                v-show="currentSlide === index" class="absolute inset-0 w-full h-full cursor-pointer"
                                @click="$router.push({ name: 'AssetDetailView', params: { slug: slide.slug } })">
                                <!-- Ảnh -->
                                <img :src="slide.media.cover" :alt="slide.title"
                                    class="w-full h-full object-cover object-center" />

                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                                </div>

                                <!-- Số Pack -->
                                <div v-if="slide.packCount > 0"
                                    class="absolute top-4 right-4 bg-[#FFD700] text-[#1C1C1C] px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#1C1C1C] shadow-sm">
                                    {{ slide.packCount }} Packs
                                </div>

                                <!-- Tên Sản Phẩm -->
                                <div class="absolute bottom-4 left-6 pr-6">
                                    <h4
                                        class="text-white font-black text-2xl sm:text-3xl tracking-tight drop-shadow-md line-clamp-1">
                                        {{ slide.title }}
                                    </h4>
                                </div>
                            </div>
                        </transition-group>

                        <!-- Nút điều hướng -->
                        <button @click="prevSlide"
                            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-[#1C1C1C] dark:border-slate-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-blue-600 hover:text-white z-10 font-bold dark:text-white cursor-pointer">
                            ❮
                        </button>
                        <button @click="nextSlide"
                            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-[#1C1C1C] dark:border-slate-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-blue-600 hover:text-white z-10 font-bold dark:text-white cursor-pointer">
                            ❯
                        </button>

                        <!-- Chấm tròn -->
                        <!-- Đã dời chấm tròn ra giữa dưới cùng một chút để không đè lên Tên Category -->
                        <div class="absolute bottom-4 right-6 flex gap-2 z-10">
                            <span v-for="(slide, index) in latestAssets" :key="'dot' + index" @click="goToSlide(index)"
                                :class="['w-2.5 h-2.5 rounded-full cursor-pointer transition-all border-2 border-[#1C1C1C] dark:border-slate-800 shadow-sm', currentSlide === index ? 'bg-blue-500 w-6' : 'bg-white hover:bg-blue-400']"></span>
                        </div>
                    </div>

                    <!-- NÚT XEM ALL GALLERY (FULL WIDTH) -->
                    <div class="w-full mt-1">
                        <button @click="goToAllAssets"
                            :class="[theme.ui.buttonRoundedBorderBlue, 'w-full', 'px-6', 'py-4', 'rounded-2xl', 'font-black', 'text-base', 'transition-all', 'flex', 'items-center', 'justify-between']"
                            >
                            <span>View All</span>
                            <span class="text-xl leading-none">➜</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- VÙNG 2: LƯỚI ITEM & PHÂN TRANG -->
        <div class="max-w-7xl mx-auto px-6 relative z-10">

            <div v-if="paginatedAssets.length === 0"
                class="text-center py-20 text-slate-500 dark:text-slate-400 font-bold">
                No assets found in this category.
            </div>

            <!-- Grid Sản Phẩm -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <AssetCard v-for="item in paginatedAssets" :key="item.id" :asset="item" />
            </div>

            <!-- Pagination UI (Glassmorphism & Dark Mode) -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">

                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 rounded-xl font-black text-sm transition-all border-2 border-[#1C1C1C] dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-[#1C1C1C] hover:text-white dark:hover:border-blue-500 dark:hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer">
                    ❮ Prev
                </button>

                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                    'w-10 h-10 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center cursor-pointer',
                    currentPage === page
                        ? 'bg-[#1C1C1C] dark:bg-blue-600 text-white border-[#1C1C1C] dark:border-blue-600 shadow-md'
                        : 'bg-white/70 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 border-[#1C1C1C] dark:border-slate-700 hover:bg-slate-200 dark:hover:border-blue-500'
                ]">
                    {{ page }}
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 rounded-xl font-black text-sm transition-all border-2 border-[#1C1C1C] dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-[#1C1C1C] hover:text-white dark:hover:border-blue-500 dark:hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer">
                    Next ❯
                </button>
            </div>

        </div>
    </section>
</template>

<!-- <script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// Đảm bảo import đúng đường dẫn component con của bạn
import AssetCard from './child_components/AssetCard.vue'

// Import dummy image cho data test (và làm placeholder cho slider)
import dummyUrl from '../../../assets/asset_gallery/tree_1.png'

const router = useRouter()

// === LOGIC SLIDER ===
// Tích hợp dữ liệu: Hình ảnh, Tên Category, Số lượng Pack
const slideData = [
  { 
      image: dummyUrl, 
      categoryName: 'Stylized Environment', 
      packCount: '24 Packs' 
  },
  { 
      image: dummyUrl, 
      categoryName: 'Lowpoly UI Kits', 
      packCount: '12 Packs' 
  },
  { 
      image: dummyUrl, 
      categoryName: 'Fantasy Characters', 
      packCount: '8 Packs' 
  }
]

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slideData.length
}
const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slideData.length - 1 : currentSlide.value - 1
}
const goToSlide = (index) => {
  currentSlide.value = index
  resetInterval()
}
const resetInterval = () => {
  clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 3500)
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 3500)
})
onUnmounted(() => {
  clearInterval(slideInterval)
})

// === LOGIC FILTER & DATA ===
const selectedCategory = ref('All')
// Đã xóa '3D Model' theo yêu cầu từ bản vẽ
const categories = ['All', 'UI Kit', 'Templates']

const itemsPerPage = 12
const currentPage = ref(1)

// Mảng 15 items mẫu
const assets = Array.from({ length: 15 }).map((_, index) => (
    {
        id: index + 1,
        title: 'Low Poly Apartment Interior & Exterior',
        series: 'APARTMENT INTERIOR & EXTERIOR',
        category: index % 3 === 0 ? 'UI Kit' : 'Templates', // Mix category để test filter
        modelCount: 879,
        price: '49.99',
        image: dummyUrl
    }
))

// 1. Lọc
const filteredAssets = computed(() => {
  if (selectedCategory.value === 'All') return assets
  return assets.filter(a => a.category === selectedCategory.value)
})

// 2. Phân trang
const totalPages = computed(() => {
    return Math.ceil(filteredAssets.value.length / itemsPerPage)
})

const paginatedAssets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAssets.value.slice(startIndex, endIndex)
})

// === HÀM XỬ LÝ SỰ KIỆN ===
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

const goToAllAssets = () => {
    // Điều hướng sang trang xem toàn bộ thư viện (Cập nhật đúng name route của bạn)
    router.push({ name: 'AssetLibrary'}) 
}
</script> -->

<script setup>

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAssetStore } from '../../../stores/useAssetStore.js' // Thay đường dẫn theo dự án của bạn
import { useThemeStore } from '../../../stores/useThemeStore.js'
import AssetCard from '../../../views/pages/assets/asset_detail/child_components/AssetCard.vue'

import { loadGalleryFilterState, saveGalleryFilterState } from '../../../utils/scrollMemory'

const router = useRouter()
const assetStore = useAssetStore()
const theme = useThemeStore()

// Lấy mảng dữ liệu từ Store
const { assets } = storeToRefs(assetStore)

// 1. Khởi tạo số trang & danh mục từ bộ nhớ phiên (Thay vì mặc định luôn là 1 và 'all') 
const savedGalleryState = loadGalleryFilterState()
const currentPage = ref(savedGalleryState.page || 1)
const selectedCategory = ref(savedGalleryState.category || 'all')

// === LOGIC THỐNG KÊ (Cho 3 ô vuông) ===
const stats = computed(() => assetStore.getStatistics)

// === LOGIC SLIDER TỰ ĐỘNG TỪ DATA ===
const latestAssets = computed(() => assetStore.getLatestAssets)
const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
    if (latestAssets.value.length === 0) return;
    currentSlide.value = (currentSlide.value + 1) % latestAssets.value.length
}
const prevSlide = () => {
    if (latestAssets.value.length === 0) return;
    currentSlide.value = currentSlide.value === 0 ? latestAssets.value.length - 1 : currentSlide.value - 1
}
const goToSlide = (index) => {
    currentSlide.value = index
    resetInterval()
}
const resetInterval = () => {
    clearInterval(slideInterval)
    slideInterval = setInterval(nextSlide, 3500)
}

onMounted(() => {
    if (latestAssets.value.length > 0) {
        slideInterval = setInterval(nextSlide, 3500)
    }
})
onUnmounted(() => {
    clearInterval(slideInterval)
})

// === LOGIC FILTER & PHÂN TRANG ===
// Sử dụng mảng Category có sẵn trong store, loại bỏ mục 'All' để gộp vào nút
const displayCategories = computed(() => {
    return assetStore.categories.filter(c => c.id !== 'all')
})

const selectedCategoryId = ref('all')
const itemsPerPage = 12
// const currentPage = ref(1)

// Lọc Asset
const filteredAssets = computed(() => {
    return assetStore.getAssetsByCategory(selectedCategoryId.value)
})

// Tính Tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredAssets.value.length / itemsPerPage)
})

// Data cắt ra cho từng trang
const paginatedAssets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAssets.value.slice(startIndex, endIndex)
})

// === HÀM XỬ LÝ SỰ KIỆN ===
const changeCategory = (catId) => {
    selectedCategoryId.value = catId
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
const goToAllAssets = () => {
    router.push({ name: 'AssetLibrary' })
}

// 2. Tự động lưu lại mỗi khi người dùng chuyển trang (1, 2, 3, 4) hoặc đổi danh mục
watch([currentPage, selectedCategory], ([newPage, newCat]) => {
  saveGalleryFilterState({
    page: newPage,
    category: newCat
  })
})
</script>

<style scoped>
h3 {
    letter-spacing: -0.04em;
}

/* Hiệu ứng chuyển cảnh mượt mà cho ảnh Slider */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
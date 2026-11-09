<template>
    <div>

        <AssetLibraryMegaMenu mode="floating" offsetTop="top-[48px]" :is-open="activeMenu === 'asset'"
            @toggle="toggleMenu('asset')" @close="activeMenu = null" />

        <div class="min-h-screen pt-0 pb-20 transition-colors duration-300">

            <!-- 1. THANH BREADCRUMB (Nền Solid thay vì kính mờ) -->
            <div :class="[
                'sticky top-0 z-50 bg-white dark:bg-[#161a23] transition-all duration-300',
                isScrolled
                    ? 'shadow-sm border-b border-gray-200 dark:border-slate-800'
                    : 'shadow-none border-transparent'
            ]">
                <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">

                    <div class="flex items-center gap-6 sm:gap-8">
                        <div class="-my-4 flex items-center gap-4">
                            <HomeButton />
                        </div>

                        <!-- BÊN TRÁI: Đường dẫn Breadcrumb -->
                        <nav class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <router-link to="/"
                                class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                Home
                            </router-link>
                            <span class="text-gray-300 dark:text-gray-700">/</span>
                            <span class="text-gray-900 dark:text-gray-200 font-bold">Asset Library</span>
                        </nav>
                    </div>


                    <!-- BÊN PHẢI: Đặt ThemeToggle vào bên trong div flex này -->
                    <div class="-my-4 flex items-center gap-4">
                        <BackButton to="/" />
                        <ThemeToggle />
                        <DonateButton />

                    </div>

                </div>
            </div>



            <!-- 2. HEADER TRANG (Tiêu đề + Nút Về trang chủ) -->
            <div class="max-w-7xl mx-auto px-6 mt-6 mb-10"> <!-- ĐÃ XÓA relative z-10 Ở ĐÂY -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <!-- ĐƯA relative z-0 TRỰC TIẾP VÀO ĐÂY ĐỂ ÉP NÓ NẰM DƯỚI BREADCRUMB -->
                    <div :class="[
                        'relative z-0 transition-all duration-300 ease-out transform',
                        isScrolled
                            ? 'opacity-0 -translate-x-16 pointer-events-none'
                            : 'opacity-100 translate-x-0'
                    ]">
                        <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Asset
                            Library</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Explore our entire collection of high-quality assets for your projects.
                        </p>
                    </div>

                    <!-- Nút Về Trang Chủ -->
                    <!-- ... -->


                </div>
            </div>

            <!-- MAIN LAYOUT: SIDEBAR (Trái) & GRID (Phải) -->
            <div class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">

                <!-- 1. BỌC SIDEBAR BỘ LỌC VÀO TRANSITION & V-SHOW -->
                <transition name="fade-slide">
                    <aside v-show="isFilterOpen" class="w-full lg:w-[22rem] shrink-0 flex flex-col gap-6 origin-left">

                        <!-- KHỐI 2 CỘT: TRÁI (Tìm kiếm + Giá) & PHẢI (Danh mục) -->
                        <div class="grid grid-cols-2 gap-4">

                            <!-- CỘT TRÁI -->
                            <div class="flex flex-col gap-4">

                                <!-- 1. Search Box -->
                                <div
                                    class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 h-fit">
                                    <h3
                                        class="text-[11px] font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                                        SEARCH</h3>
                                    <input v-model="searchQuery" type="text" placeholder="Asset name..."
                                        class="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                </div>

                                <!-- 2. Lọc theo giá -->
                                <div
                                    class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex-1">
                                    <h3
                                        class="text-[11px] font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                                        OPTIONS</h3>

                                    <!-- Checkbox Yêu thích (Đặt ngay trên Checkbox Miễn phí trong Sidebar) -->
                                    <label class="flex items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-gray-100 dark:border-slate-800 cursor-pointer group">
                                        <div class="flex items-center gap-2">
                                            <input type="checkbox" v-model="isFavoritesOnly" @change="currentPage = 1"
                                                class="w-3.5 h-3.5 rounded border-gray-300 text-[#ff005b] focus:ring-[#ff005b] dark:border-slate-600 dark:bg-slate-700 transition-colors">
                                            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#ff005b] transition-colors flex items-center gap-1">
                                                Favorited <span class="text-[#ff005b]">❤️</span>
                                            </span>
                                        </div>
                                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 dark:bg-pink-500/10 text-[#ff005b]">
                                            {{ favoriteIds.length }}
                                        </span>
                                    </label>

                                    <!-- Checkbox Miễn phí -->
                                    <label class="flex items-center gap-2 mb-3 lg:mb-4 cursor-pointer group">
                                        <input type="checkbox" v-model="isFreeOnly"
                                            class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 transition-colors">
                                        <span
                                            class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                            Free Assets
                                        </span>
                                    </label>

                                    <!-- Min/Max Price (Ngang ở màn hình nhỏ, dọc ở màn hình lớn) -->
                                    <div class="grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-3 transition-opacity duration-300"
                                        :class="{ 'opacity-40 pointer-events-none': isFreeOnly }">
                                        <div>
                                            <span class="text-[10px] text-gray-500 block mb-1">Min ($)</span>
                                            <input v-model.number="minPrice" type="number" min="0" placeholder="Min"
                                                class="w-full px-2 lg:px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        </div>
                                        <div>
                                            <span class="text-[10px] text-gray-500 block mb-1">Max ($)</span>
                                            <input v-model.number="maxPrice" type="number" min="0" placeholder="Max"
                                                class="w-full px-2 lg:px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CỘT PHẢI: Danh mục -->
                            <div
                                class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 h-full flex flex-col">
                                <h3
                                    class="text-[11px] font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                                    CATEGORIES</h3>
                                <div class="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 -mr-1 pr-1">

                                    <!-- Sửa vòng lặp và cập nhật biến so sánh -->
                                    <button v-for="cat in categories" :key="cat.id" @click="changeCategory(cat.id)"
                                        :class="[
                                            'text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                                            selectedCategoryId === cat.id
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-500'
                                        ]">
                                        <!-- Render tên danh mục -->
                                        {{ cat.name }}
                                    </button>

                                </div>
                            </div>

                        </div>

                    </aside>
                </transition>

                <!-- 2. KHU VỰC HIỂN THỊ ASSET (Tự động giãn 100% khi Sidebar ẩn) -->
                <main id="asset-grid" class="flex-1 w-full transition-all duration-300 scroll-mt-20">

                    <!-- THANH CÔNG CỤ (Đã gộp nút Mở/Đóng và Xóa bộ lọc) -->
                    <div
                        class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white dark:bg-[#161a23] p-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 gap-4">

                        <!-- NHÓM BÊN TRÁI: Các thao tác liên quan đến Bộ lọc & Kết quả -->
                        <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">

                            <!-- Nút Đóng/Mở bộ lọc (Chữ tự động thay đổi) -->
                            <button @click="isFilterOpen = !isFilterOpen"
                                :class="isFilterOpen ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500'"
                                class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {{ isFilterOpen ? 'Close Filters' : 'Open Filters' }}
                            </button>

                            <!-- [THÊM MỚI]: Nút Lọc nhanh Yêu thích (Kèm Badge đếm số lượng) -->
                            <button @click="toggleFavoriteFilter"
                                :class="isFavoritesOnly 
                                    ? 'bg-pink-500/10 dark:bg-pink-500/20 text-[#ff005b] border-2 border-[#ff005b] shadow-sm' 
                                    : 'bg-gray-50 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:text-[#ff005b] hover:border-[#ff005b]/50'"
                                class="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold border transition-all cursor-pointer group">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:scale-110" 
                                    :class="isFavoritesOnly ? 'text-[#ff005b]' : 'text-gray-400 group-hover:text-[#ff005b]'"
                                    :fill="isFavoritesOnly ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Favorites</span>
                                <span v-if="favoriteIds.length > 0" 
                                    :class="isFavoritesOnly ? 'bg-[#ff005b] text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400'"
                                    class="px-1.5 py-0.2 text-[11px] rounded-full font-extrabold transition-colors">
                                    {{ favoriteIds.length }}
                                </span>
                            </button>

                            <!-- Nút Xóa bộ lọc: Hiện khi đang mở Filter HOẶC khi đang bật lọc Yêu thích -->
                            <button v-if="isFilterOpen || isFavoritesOnly" @click="resetFilters"
                                class="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 border border-transparent">
                                Clear Filters
                            </button>

                            <!-- Trục dọc phân cách -->
                            <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>

                            <!-- Số lượng kết quả -->
                            <p class="text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                <span class="text-blue-600 dark:text-blue-400">{{ filteredAssets.length }}</span>
                                 results
                            </p>
                        </div>

                        <!-- NHÓM BÊN PHẢI: Sắp xếp -->
                        <div class="flex items-center gap-4 w-full sm:w-auto justify-end">

                            <!-- BỘ NÚT CHUYỂN ĐỔI GRID (3 cột / 4 cột) -->
                            <div class="hidden md:flex items-center gap-2">

                                <!-- Nút 3 Cột --> 
                                <!-- <button @click="gridCols = 3" 
                                        :class="[theme.ui.buttonRoundedBorderBlue]">
                                    SVG 3 cột
                                </button> -->

                                <!-- Nút 3 Cột -->
                                <button @click="gridCols = 3"
                                    :class="gridCols === 3
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-500 hover:bg-[#32CD32] hover:text-white dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-[#32CD32] dark:hover:text-white'"
                                    class="p-2.5 rounded-xl transition-all duration-200 cursor-pointer outline-none group"
                                    title="Grid 3 columns">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 transition-transform duration-200" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="5" y="5" width="5" height="5" rx="1"></rect>
                                        <rect x="14" y="5" width="5" height="5" rx="1"></rect>
                                        <rect x="5" y="14" width="5" height="5" rx="1"></rect>
                                        <rect x="14" y="14" width="5" height="5" rx="1"></rect>
                                    </svg>
                                </button>

                                <!-- Nút 4 Cột -->
                                <button @click="gridCols = 4"
                                    :class="gridCols === 4
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-500 hover:bg-[#32CD32] hover:text-white dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-[#32CD32] dark:hover:text-white'"
                                    class="p-2.5 rounded-xl transition-all duration-200 cursor-pointer outline-none group"
                                    title="Grid 4 columns">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 transition-transform duration-200" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="3" y="3" width="5" height="5" rx="1"></rect>
                                        <rect x="10" y="3" width="5" height="5" rx="1"></rect>
                                        <rect x="17" y="3" width="5" height="5" rx="1"></rect>
                                        <rect x="3" y="10" width="5" height="5" rx="1"></rect>
                                        <rect x="10" y="10" width="5" height="5" rx="1"></rect>
                                        <rect x="17" y="10" width="5" height="5" rx="1"></rect>
                                        <rect x="3" y="17" width="5" height="5" rx="1"></rect>
                                        <rect x="10" y="17" width="5" height="5" rx="1"></rect>
                                        <rect x="17" y="17" width="5" height="5" rx="1"></rect>
                                    </svg>
                                </button>

                            </div>

                            <!-- Vạch phân cách -->
                            <div class="hidden md:block w-px h-5 bg-gray-300 dark:bg-slate-700"></div>

                            <!-- Sort Dropdown (Giữ nguyên) -->
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</span>
                                <select v-model="sortOrder"
                                    class="bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none cursor-pointer">
                                    <option value="newest">Newest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Lưới Asset -->
                    <div v-if="paginatedAssets.length === 0"
                        class="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#161a23] rounded-2xl border border-gray-200 dark:border-slate-800">
                        <span class="text-4xl mb-4 block">🔍</span>
                        We couldn't find any assets matching your filter criteria.
                    </div>

                    <div v-else :class="[
                        'grid gap-6 transition-all duration-500',
                        gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
                    ]">
                        <!-- GỌI COMPONENT ASSET CARD -->
                        <!-- Lưu ý: Cập nhật lại đường dẫn import file AssetCard.vue cho phù hợp với vị trí file mới này -->
                        <AssetCard v-for="item in paginatedAssets" :key="item.id" :asset="item" />
                    </div>

                    <!-- Phân trang -->
                    <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center space-x-2">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>

                        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                            'w-10 h-10 rounded-lg font-medium transition-all border',
                            currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 cursor-pointer border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                        ]">
                            {{ page }}
                        </button>

                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>

                </main>
            </div>
        </div>
        <TheFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAssetStore } from '../../../../stores/useAssetStore.js'
import { useThemeStore } from '../../../../stores/useThemeStore'

import AssetCard from '../asset_detail/child_components/AssetCard.vue'
import TheFooter from '../../../../components/layout/TheFooter.vue'

import ThemeToggle from '../../../../components/base/ThemeToggle.vue'
import DonateButton from '../../../../components/base/DonateButton.vue'
import BackButton from '../../../../components/base/BackButton.vue'
import HomeButton from '../../../../components/base/HomeButton.vue'

import AssetLibraryMegaMenu from '../../../../components/layout/AssetLibraryMegaMenu.vue'

// Khởi tạo Store & Router
const assetStore = useAssetStore()
const theme = useThemeStore()
const route = useRoute()
const router = useRouter()

// Lấy dữ liệu Reactive trực tiếp từ Pinia Store (tự động cập nhật khi Firebase thay đổi)
const { assets, categories, favoriteIds } = storeToRefs(assetStore)

// ========================================================
// MegaMenu
// ========================================================
const activeMenu = ref(null)
const toggleMenu = (menuName) => {
    activeMenu.value = activeMenu.value === menuName ? null : menuName
}

// --- STATE BẮT SỰ KIỆN CUỘN TRANG (CHO BREADCRUMB) ---
const isScrolled = ref(false)
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

// Biến quản lý số cột của lưới (mặc định 4 cột)
const gridCols = ref(4)

// --- HÀM GIẢM KHOẢNG CÁCH LĂN CHUỘT ---
let isTicking = false
const handleCustomWheel = (e) => {
    if (e.ctrlKey) return
    const isTrackpad = (e.deltaY % 1 !== 0) || (Math.abs(e.deltaY) < 50) || (Math.abs(e.deltaX) > 0)
    if (isTrackpad) return
    e.preventDefault()

    if (!isTicking) {
        window.requestAnimationFrame(() => {
            const scrollStep = 70
            const direction = Math.sign(e.deltaY)
            window.scrollBy({
                top: direction * scrollStep,
                behavior: 'auto'
            })
            isTicking = false
        })
        isTicking = true
    }
}

onMounted(() => {
    // [QUAN TRỌNG]: Đảm bảo kho Asset luôn được đồng bộ với Firebase khi vào thẳng trang Library
    assetStore.initFirebaseAssetsSync()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('wheel', handleCustomWheel, { passive: false })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('wheel', handleCustomWheel)
})

// --- BIẾN TRẠNG THÁI BỘ LỌC (STATE) ---
const isFilterOpen = ref(false)
const searchQuery = ref('')
const selectedCategoryId = ref('all')
const sortOrder = ref('newest')

const isFavoritesOnly = ref(false)
const isFreeOnly = ref(false)
const minPrice = ref(null)
const maxPrice = ref(null)

const itemsPerPage = 12
const currentPage = ref(1)

// Hàm bật/tắt nhanh nút Yêu thích trên thanh công cụ
const toggleFavoriteFilter = () => {
    isFavoritesOnly.value = !isFavoritesOnly.value
    currentPage.value = 1
}

// Tự động đưa về trang 1 khi người dùng gõ tìm kiếm hoặc đổi bộ lọc giá/sắp xếp
watch([searchQuery, isFreeOnly, minPrice, maxPrice, sortOrder], () => {
    currentPage.value = 1
})

// --- LOGIC BỘ LỌC TỔNG HỢP (COMPUTED) ĐỒNG BỘ THỜI GIAN THỰC VỚI FIREBASE ---
const filteredAssets = computed(() => {
    // 1. Đọc trực tiếp từ assets.value để Vue theo dõi (track) mọi thay đổi từ Firebase
    let result = selectedCategoryId.value === 'all' || !selectedCategoryId.value
        ? [...assets.value]
        : assets.value.filter(a => a.categoryId === selectedCategoryId.value)

    // 2. Lọc theo trạng thái "Yêu thích"
    if (isFavoritesOnly.value) {
        const favSet = new Set(favoriteIds.value.map(Number))
        result = result.filter(a => favSet.has(Number(a.id)))
    }

    // 3. Lọc theo Tìm kiếm Text (Hỗ trợ tìm theo Tên, Mã ID 6 số, Slug hoặc Tags)
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase().trim()
        result = result.filter(a => {
            const matchTitle = (a.title || '').toLowerCase().includes(query)
            const matchId = String(a.id || '').includes(query)
            const matchSlug = (a.slug || '').toLowerCase().includes(query)
            const matchTags = Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(query))
            return matchTitle || matchId || matchSlug || matchTags
        })
    }

    // 4. Lọc theo Mức giá (Tương thích chuẩn với CmgAssetModel)
    if (isFreeOnly.value) {
        result = result.filter(a => Number(a.pricing?.price ?? a.price ?? 0) === 0)
    } else {
        if (minPrice.value !== null && minPrice.value !== '') {
            result = result.filter(a => Number(a.pricing?.price ?? a.price ?? 0) >= Number(minPrice.value))
        }
        if (maxPrice.value !== null && maxPrice.value !== '') {
            result = result.filter(a => Number(a.pricing?.price ?? a.price ?? 0) <= Number(maxPrice.value))
        }
    }

    // 5. Sắp xếp (Sort)
    if (sortOrder.value === 'price_asc') {
        result.sort((a, b) => Number(a.pricing?.price ?? a.price ?? 0) - Number(b.pricing?.price ?? b.price ?? 0))
    } else if (sortOrder.value === 'price_desc') {
        result.sort((a, b) => Number(b.pricing?.price ?? b.price ?? 0) - Number(a.pricing?.price ?? a.price ?? 0))
    } else if (sortOrder.value === 'popular') {
        // Ưu tiên xếp theo lượt Like trên Firebase, nếu bằng nhau thì xét tiếp lượt Download
        result.sort((a, b) => {
            const likeDiff = (b.metrics?.likes ?? b.likes ?? 0) - (a.metrics?.likes ?? a.likes ?? 0)
            if (likeDiff !== 0) return likeDiff
            return (b.metrics?.downloads ?? 0) - (a.metrics?.downloads ?? 0)
        })
    } else {
        // 'newest': Xếp theo ngày cập nhật mới nhất (latestUpdate) hoặc ngày phát hành (initialRelease)
        result.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
    }

    return result
})

// Tính tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredAssets.value.length / itemsPerPage) || 1
})

// Cắt mảng lấy sản phẩm cho trang hiện tại
const paginatedAssets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAssets.value.slice(startIndex, endIndex)
})

// --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
const resetFilters = () => {
    searchQuery.value = ''
    selectedCategoryId.value = 'all'
    isFavoritesOnly.value = false
    isFreeOnly.value = false
    minPrice.value = null
    maxPrice.value = null
    sortOrder.value = 'newest'
    currentPage.value = 1

    if (Object.keys(route.query).length > 0) {
        router.replace({ path: route.path, query: {} })
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        scrollToGrid()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        scrollToGrid()
    }
}

const goToPage = (page) => {
    currentPage.value = page
    scrollToGrid()
}

const changeCategory = (categoryId) => {
    selectedCategoryId.value = categoryId
    currentPage.value = 1
    scrollToGrid()
}

const scrollToGrid = () => {
    const gridEl = document.getElementById('asset-grid')
    if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

// ========================================================
// ĐỒNG BỘ URL QUERY TỪ MEGA MENU VÀO BỘ LỌC
// ========================================================
watch(
    () => route.query,
    (query) => {
        if (query.filter === 'free') {
            isFreeOnly.value = true
            isFavoritesOnly.value = false
            minPrice.value = null
            maxPrice.value = null
            isFilterOpen.value = true
            currentPage.value = 1
        } else if (query.filter === 'favorites') {
            isFavoritesOnly.value = true
            isFreeOnly.value = false
            currentPage.value = 1
        } else if (!query.filter) {
            isFreeOnly.value = false
            isFavoritesOnly.value = false
        }

        if (query.category) {
            selectedCategoryId.value = query.category
            isFilterOpen.value = true
            currentPage.value = 1
        }

        if (query.sort && ['newest', 'popular', 'price_asc', 'price_desc'].includes(query.sort)) {
            sortOrder.value = query.sort
            currentPage.value = 1
        }
    },
    { immediate: true }
)
</script>

<style scoped>
/* Hiệu ứng trượt ngang cho bộ lọc */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px) scale0.98;
    width: 0;
    margin-right: -2rem;
    /* Ép khoảng trống gap-8 biến mất khi thu gọn */
}
</style>
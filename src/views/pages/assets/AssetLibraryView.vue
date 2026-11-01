<template>
    <div class="min-h-screen pt-0 pb-20 bg-gray-50 dark:bg-[#0b0e14] transition-colors duration-300">        

        <!-- 1. THANH BREADCRUMB (Nền Solid thay vì kính mờ) -->
        <div :class="[
            'sticky top-0 z-50 bg-white dark:bg-[#161a23] transition-all duration-300',
            isScrolled 
                ? 'shadow-sm border-b border-gray-200 dark:border-slate-800' 
                : 'shadow-none border-transparent'
        ]">
            <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
                <nav class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <router-link to="/" class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Trang chủ
                    </router-link>
                    <span class="text-gray-300 dark:text-gray-700">/</span>
                    <span class="text-gray-900 dark:text-gray-200 font-bold">Asset Library</span>
                </nav>
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
                    <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Asset Library</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Khám phá toàn bộ kho tài nguyên chất lượng cao cho dự án của bạn.
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
                            <div class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 h-fit">
                                <h3 class="text-[11px] font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Tìm kiếm</h3>
                                <input 
                                    v-model="searchQuery" 
                                    type="text" 
                                    placeholder="Tên asset..." 
                                    class="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                            </div>

                            
                            <!-- 2. Lọc theo giá -->
                            <div class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex-1">
                                <h3 class="text-[11px] font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Lọc theo giá</h3>
                                
                                <!-- Checkbox Miễn phí -->
                                <label class="flex items-center gap-2 mb-3 lg:mb-4 cursor-pointer group">
                                    <input type="checkbox" v-model="isFreeOnly" class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 transition-colors">
                                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">Miễn phí (Free)</span>
                                </label>

                                <!-- Min/Max Price (Ngang ở màn hình nhỏ, dọc ở màn hình lớn) -->
                                <div class="grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-3 transition-opacity duration-300" :class="{ 'opacity-40 pointer-events-none': isFreeOnly }">
                                    <div>
                                        <span class="text-[10px] text-gray-500 block mb-1">Từ ($)</span>
                                        <input v-model.number="minPrice" type="number" min="0" placeholder="Min" class="w-full px-2 lg:px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    </div>
                                    <div>
                                        <span class="text-[10px] text-gray-500 block mb-1">Đến ($)</span>
                                        <input v-model.number="maxPrice" type="number" min="0" placeholder="Max" class="w-full px-2 lg:px-3 py-1.5 bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CỘT PHẢI: Danh mục -->
                        <div class="bg-white dark:bg-[#161a23] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 h-full flex flex-col">
                            <h3 class="text-[11px] font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Danh mục</h3>
                            <div class="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 -mr-1 pr-1">
                                <button 
                                    v-for="cat in categories" :key="cat" 
                                    @click="changeCategory(cat)"
                                    :class="[
                                        'text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                                        selectedCategory === cat 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-500'
                                    ]"
                                >
                                    {{ cat }}
                                </button>
                            </div>
                        </div>

                    </div>
                    
                </aside>
            </transition>

            <!-- 2. KHU VỰC HIỂN THỊ ASSET (Tự động giãn 100% khi Sidebar ẩn) -->
            <main id="asset-grid" class="flex-1 w-full transition-all duration-300 scroll-mt-20">
                
                <!-- THANH CÔNG CỤ (Đã gộp nút Mở/Đóng và Xóa bộ lọc) -->
                <div class="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white dark:bg-[#161a23] p-3 px-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 gap-4">
                    
                    <!-- NHÓM BÊN TRÁI: Các thao tác liên quan đến Bộ lọc & Kết quả -->
                    <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                        
                        <!-- Nút Đóng/Mở bộ lọc (Chữ tự động thay đổi) -->
                        <button @click="isFilterOpen = !isFilterOpen" 
                            :class="isFilterOpen ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-[#0b0e14] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500'"
                            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {{ isFilterOpen ? 'Đóng bộ lọc' : 'Mở bộ lọc' }}
                        </button>

                        <!-- Nút Xóa bộ lọc (Chuyển lên cạnh nút Mở/Đóng) -->
                        <button v-if="isFilterOpen" @click="resetFilters" 
                            class="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 border border-transparent">
                            Xóa bộ lọc
                        </button>

                        <!-- Trục dọc phân cách -->
                        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>

                        <!-- Số lượng kết quả -->
                        <p class="text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            <span class="text-blue-600 dark:text-blue-400">{{ filteredAssets.length }}</span> kết quả
                        </p>
                    </div>
                    
                    <!-- NHÓM BÊN PHẢI: Sắp xếp -->
                    <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <span class="text-sm font-medium text-gray-500 whitespace-nowrap">Sắp xếp:</span>
                        <select v-model="sortOrder" class="bg-gray-50 dark:bg-[#0b0e14] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none cursor-pointer">
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                            <option value="price_desc">Giá: Cao đến Thấp</option>
                        </select>
                    </div>
                </div>
                
                <!-- Lưới Asset -->
                <div v-if="paginatedAssets.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#161a23] rounded-2xl border border-gray-200 dark:border-slate-800">
                    <span class="text-4xl mb-4 block">🔍</span>
                    Không tìm thấy asset nào phù hợp với bộ lọc.
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                    <!-- GỌI COMPONENT ASSET CARD -->
                    <!-- Lưu ý: Cập nhật lại đường dẫn import file AssetCard.vue cho phù hợp với vị trí file mới này -->
                    <AssetCard 
                        v-for="item in paginatedAssets" 
                        :key="item.id" 
                        :asset="item" 
                    />
                </div>

                <!-- Phân trang -->
                <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center space-x-2">
                    <button @click="prevPage" :disabled="currentPage === 1" 
                        class="px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        Trang trước
                    </button>
                    
                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" 
                        :class="[
                            'w-10 h-10 rounded-lg font-medium transition-all border',
                            currentPage === page 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                        ]">
                        {{ page }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages" 
                        class="px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#161a23] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        Trang sau
                    </button>
                </div>

            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'


// Tạm thời dùng 1 ảnh đại diện để làm mộc data nhanh
// NHỚ ĐỔI ĐƯỜNG DẪN IMPORT NÀY NẾU BẠN DI CHUYỂN FILE
import dummyUrl from '../../../assets/asset_gallery/tree_1.png'
import AssetCard from '../../../components/showcase/asset_gallery/child_components/AssetCard.vue'

// --- STATE BẮT SỰ KIỆN CUỘN TRANG (CHO BREADCRUMB) ---
const isScrolled = ref(false)

const handleScroll = () => {
    // Nếu cuộn qua 20px thì bật hiệu ứng Header
    isScrolled.value = window.scrollY > 20
}

// --- HÀM GIẢM KHOẢNG CÁCH LĂN CHUỘT (BẢN TỐI ƯU HIỆU NĂNG) ---
let isTicking = false // Biến khóa (van an toàn)

const handleCustomWheel = (e) => {
    if (e.ctrlKey) return

    const isTrackpad = (e.deltaY % 1 !== 0) || (Math.abs(e.deltaY) < 50) || (Math.abs(e.deltaX) > 0)
    if (isTrackpad) return 

    e.preventDefault() 

    // Nếu trình duyệt đang bận xử lý frame cuộn trước đó thì bỏ qua, không nhồi nhét thêm
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            const scrollStep = 70 
            const direction = Math.sign(e.deltaY)

            window.scrollBy({
                top: direction * scrollStep,
                behavior: 'auto' 
            })
            
            // Xử lý xong frame này thì mở khóa cho lần cuộn tiếp theo
            isTicking = false 
        })
        
        isTicking = true // Khóa lại trong lúc chờ frame render
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)

    window.addEventListener('wheel', handleCustomWheel, { passive: false })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)

    window.removeEventListener('wheel', handleCustomWheel)
})

// --- BIẾN TRẠNG THÁI (STATE) ---
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedSoftwares = ref([])
const sortOrder = ref('newest')

const isFreeOnly = ref(false)
const minPrice = ref(0)
const maxPrice = ref(100)

const categories = ['All', 'SkyIsland', 'UI Kit', '3D Model', 'Templates']
const softwareOptions = ['Unity', 'Unreal Engine', 'Blender', 'Figma']

// Biến cho Phân trang
const itemsPerPage = 12
const currentPage = ref(1)

// --- BIẾN TRẠNG THÁI (STATE) ---
const isFilterOpen = ref(false) // Thêm dòng này (mặc định đóng)
// ...

// --- DỮ LIỆU MẪU ĐÃ MỞ RỘNG ---
// Tôi thêm trường 'software' và random 'price' để bạn test tính năng Sort và Filter
const assets = Array.from({ length: 50 }).map((_, index) => {
    const isEven = index % 2 === 0;
    return {
        id: index + 1,
        title: `Low Poly Asset Pack ${index + 1}`,
        series: 'APARTMENT INTERIOR & EXTERIOR',
        category: index % 3 === 0 ? '3D Model' : 'SkyIsland',
        modelCount: 800 + index,
        price: isEven ? '29.99' : '49.99', // Giá khác nhau để test sắp xếp
        software: isEven ? 'Blender' : 'Unity', // Gắn thẻ software để test filter checkbox
        image: dummyUrl,
        createdAt: new Date(2026, 0, index + 1).getTime() // Ngày tạo giả định
    }
})

// --- LOGIC BỘ LỌC TỔNG HỢP (COMPUTED) ---
const filteredAssets = computed(() => {
    let result = assets

    // 1. Lọc theo tìm kiếm text
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(a => a.title.toLowerCase().includes(query))
    }

    // 2. Lọc theo Danh mục
    if (selectedCategory.value !== 'All') {
        result = result.filter(a => a.category === selectedCategory.value)
    }

    // 3. Lọc theo Phần mềm (Checkbox đa chọn)
    if (selectedSoftwares.value.length > 0) {
        result = result.filter(a => selectedSoftwares.value.includes(a.software))
    }

    // 4. Sắp xếp (Sort)
    if (sortOrder.value === 'price_asc') {
        result = result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortOrder.value === 'price_desc') {
        result = result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    } else { // newest
        result = result.sort((a, b) => b.createdAt - a.createdAt)
    }

    return result
})

// Tính tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredAssets.value.length / itemsPerPage)
})

// Cắt mảng để lấy item cho trang hiện tại
const paginatedAssets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAssets.value.slice(startIndex, endIndex)
})

// --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

// Xóa trắng toàn bộ filter
const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'All'
    selectedSoftwares.value = []
    sortOrder.value = 'newest'
    currentPage.value = 1
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        scrollToGrid() // Gọi hàm cuộn khi lùi trang
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        scrollToGrid() // Gọi hàm cuộn khi tiến trang
    }
}

const goToPage = (page) => {
    currentPage.value = page
    scrollToGrid() // Gọi hàm cuộn khi bấm vào số trang cụ thể
}

// Bổ sung thêm: Khi đổi Danh mục cũng nên cuộn lên và reset về trang 1
const changeCategory = (cat) => {
    selectedCategory.value = cat
    currentPage.value = 1 
    scrollToGrid() 
}

// Hàm cuộn mượt lên đầu lưới Asset
const scrollToGrid = () => {
    const gridEl = document.getElementById('asset-grid')
    if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

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
    margin-right: -2rem; /* Ép khoảng trống gap-8 biến mất khi thu gọn */
}
</style>
<template>
    <section id="FavoriteAssetsSection" v-if="assetStore.hasFavorites" class="py-6">
        <div class="max-w-7xl mx-auto px-6">
            <div class="mb-6 relative z-10">
                <!-- ==========================================
                     KHUNG VIỀN CẮT NGANG (FIELDSET + LEGEND)
                     ========================================== -->
                <fieldset
                    class="border-2 border-gray-600 dark:border-gray-600/80 rounded-xl p-6 relative transition-all duration-300">

                    <!-- LEGEND: Phần tiêu đề cắt ngang đường viền -->
                    <legend class="px-4 ml-4">
                        <div class="flex items-center gap-3">
                            <h2
                                class="text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-200 tracking-tight flex items-center gap-2">
                                Favorite Assets
                            </h2>

                        </div>
                    </legend>

                    <!-- KHỐI NÚT CÔNG CỤ (XÓA & MỞ RỘNG) -->
                    <!-- Đặt chung vào một div, dùng flex để sắp xếp nằm ngang, đè lên góc phải trên cùng -->
                    <div
                        class="absolute -top-[0.85rem] right-6 sm:right-10 flex items-center gap-2 bg-white dark:bg-[#0b0e14] px-2 z-10 rounded-md">

                        <!-- Nút Xóa (1) -->
                        <button @click="assetStore.clearFavorites()"
                            class="flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-semibold text-cmg-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear
                        </button> 

                        <!-- Đường gạch dọc phân cách nhẹ nhàng -->
                        <div v-if="favoriteAssets.length > 4" class="w-[1.5px] h-3.5 bg-gray-300 dark:bg-slate-700"></div>

                        <!-- Nút Mở Rộng / Thu Gọn (2) - Chỉ hiện khi có nhiều hơn 1 hàng -->
                        <button v-if="favoriteAssets.length > 4" @click="isExpanded = !isExpanded"
                            class="flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors cursor-pointer">
                            <span>{{ isExpanded ? 'Show Less' : 'View All' }}</span>
                            <svg :class="isExpanded ? 'rotate-180' : 'rotate-0'" xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                    </div>

                    <!-- GRID 4 CỘT (Duyệt qua danh sách đã được tính toán) -->
                    <!-- Bổ sung overflow-hidden để animation mượt mà nếu bạn muốn làm phức tạp thêm sau này -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                        <!-- Thêm TransitionGroup nếu muốn hiệu ứng mượt mà khi item bị ẩn/hiện (Tùy chọn nâng cao) -->
                        <FavouriteAssetCard v-for="item in visibleFavorites" :key="item.id" :asset="item" />
                    </div>

                </fieldset>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAssetStore } from '../../../stores/useAssetStore'
import FavouriteAssetCard from './FavouriteAssetCard.vue'

const assetStore = useAssetStore()

// State điều khiển việc mở rộng (View All)
const isExpanded = ref(false)
const windowWidth = ref(window.innerWidth)

// Lắng nghe kích thước màn hình để quyết định 1 hàng có bao nhiêu item
const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})

// // Toàn bộ dữ liệu
// const recentAssets = computed(() => assetStore.getRecentlyViewedAssets)

// // Tính toán số item cần hiển thị (1 hàng) tùy theo màn hình hiện tại
// const itemsPerRow = computed(() => {
//     if (windowWidth.value >= 1024) return 4 // lg (Desktop lớn)
//     if (windowWidth.value >= 768) return 3  // md (Tablet / Laptop nhỏ)
//     if (windowWidth.value >= 640) return 2  // sm (Điện thoại ngang)
//     return 1 // Mặc định (Điện thoại dọc)
// })

// // Dữ liệu sẽ được render ra ngoài giao diện
// const visibleAssets = computed(() => {
//     // NẾU MỞ RỘNG: Trả về toàn bộ mảng
//     if (isExpanded.value) {
//         return recentAssets.value
//     }
//     // NẾU THU GỌN: Chỉ cắt (slice) đúng số lượng item của 1 hàng tương ứng với màn hình
//     return recentAssets.value.slice(0, itemsPerRow.value)
// })

// Toàn bộ danh sách yêu thích từ Store
const favoriteAssets = computed(() => assetStore.getFavoriteAssets)

// Tính số item trên 1 hàng theo độ rộng màn hình (3 trên laptop nhỏ/tablet, 4 trên màn lớn)
const itemsPerRow = computed(() => {
    if (windowWidth.value >= 1024) return 4 // lg & xl
    if (windowWidth.value >= 768) return 3  // md
    if (windowWidth.value >= 640) return 2  // sm
    return 1
})

// Danh sách thực tế được render ra giao diện
const visibleFavorites = computed(() => {
    if (isExpanded.value) {
        return favoriteAssets.value
    }
    return favoriteAssets.value.slice(0, itemsPerRow.value)
})
</script>

<style scoped>
/* Đồng bộ letter-spacing hẹp cho font chữ mạnh mẽ */
h3,
h4 {
    letter-spacing: -0.04em;
}
</style>
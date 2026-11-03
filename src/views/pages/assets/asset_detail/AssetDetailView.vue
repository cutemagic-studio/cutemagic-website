<template>

    <div>
        <AssetLibraryMegaMenu mode="floating" offsetTop="top-[48px]"/>
        
        <div class="min-h-screen pt-0 pb-20 transition-colors duration-300 z-0">

            <!-- ==========================================
             1. THANH BREADCRUMB
             ========================================== -->
            <div :class="[
                'sticky top-0 z-50 transition-all duration-300',
                /* Áp dụng nền kính mờ (Glassmorphism) */
                'bg-white/80 dark:bg-[#161a23]/80 backdrop-blur-xl',
                isScrolled
                    ? 'shadow-sm border-b-2 border-[#1C1C1C] dark:border-slate-800'
                    : 'shadow-none border-b-2 border-transparent'
            ]">
                <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center gap-4">

                    <!-- [CẬP NHẬT Ở ĐÂY]: Thêm flex-1 min-w-0 vào thẻ div ôm trọn BÊN TRÁI -->
                    <div class="flex items-center gap-6 sm:gap-8 flex-1 min-w-0">

                        <div class="-my-4 flex items-center gap-4 shrink-0">
                            <HomeButton />
                        </div>

                        <!-- Đường dẫn Breadcrumb -->
                        <nav
                            class="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 flex-1 min-w-0">

                            <router-link to="/"
                                class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors shrink-0">
                                Home
                            </router-link>

                            <span class="text-slate-300 dark:text-gray-600 shrink-0">/</span>

                            <router-link to="/assets"
                                class="hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors whitespace-nowrap shrink-0">
                                Asset Library
                            </router-link>

                            <span class="text-slate-300 dark:text-gray-600 shrink-0">/</span>

                            <!-- Chữ sẽ được cắt gọn gàng bằng dấu ... khi hết chỗ -->
                            <span class="font-bold text-slate-900 dark:text-white truncate">
                                {{ currentAsset?.title || 'Loading...' }}
                            </span>

                        </nav>
                    </div>

                    <!-- BÊN PHẢI: Các nút công cụ -->
                    <div class="-my-4 flex items-center shrink-0 gap-4">
                        <BackButton />
                        <ThemeToggle />
                        <DonateButton />
                        <div class="w-[1.5px] h-8 bg-gray-200 dark:bg-slate-700/80 mx-1 rounded-full hidden lg:block">
                        </div>
                        <div>
                            <AssetNavigation v-if="currentAsset?.id" :current-asset-id="currentAsset.id" />
                        </div>
                    </div>

                </div>
            </div>

            <div class="max-w-7xl mx-auto px-6 pt-6">

                <!-- ==========================================
                 2. KHU VỰC HERO: HÌNH ẢNH & THÔNG TIN
                 ========================================== -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">

                    <!-- CỘT TRÁI: CAROUSEL HÌNH ẢNH -->
                    <div class="flex flex-col gap-4">
                        <AssetImageGallery :images="currentAsset?.media?.gallery || []"
                            @openFullscreen="handleOpenFullscreen" />
                    </div>

                    <!-- CỘT PHẢI: THÔNG TIN CHI TIẾT -->
                    <div class="flex flex-col pt-2 h-full">
                        <!-- Tên Asset (Giữ nguyên text-2xl font-bold, cập nhật màu) -->
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            {{ currentAsset?.title }}
                        </h3>

                        <!-- Giá tiền (Kính mờ, viền đồng bộ) -->
                        <div class="mb-6">
                            <AssetPriceTag :asset="currentAsset" size="md" />
                        </div>

                        <!-- Mô tả ngắn (Giữ nguyên text-[15px], cập nhật màu) -->
                        <p class="text-[15px] text-slate-700 dark:text-gray-300 leading-relaxed mb-8">
                            {{ currentAsset?.shortDescription }}
                        </p>

                        <!-- Khối Nút Tương tác -->
                        <AssetActionButtons :asset="currentAsset" />
                    </div>
                </div>

                <AssetMetaInfo :asset="currentAsset" />

                <!-- ==========================================
                 3. KHU VỰC CHI TIẾT (Responsive: Accordion Mobile / Tabs Desktop)
                 ========================================== -->
                <AssetDetailsSection :asset="currentAsset" />

                <!-- ==========================================
                 4. KHU VỰC SẢN PHẨM LIÊN QUAN
                 ========================================== -->
                <div class="mt-16 mb-8 relative z-10">
                    <RelatedAsset :current-asset-id="currentAsset?.id" :category-id="currentAsset?.categoryId" />
                </div>

            </div>

            <!-- ==========================================
             5. NÚT SCROLL TO TOP 
             ========================================== -->
            <button @click="scrollToTop"
                class="fixed bottom-8 right-8 w-12 h-12 bg-white dark:bg-[#111] hover:bg-blue-600 dark:hover:bg-[#ff005b] border-2 border-[#1C1C1C] dark:border-gray-700 text-slate-900 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-50 group cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-y-1 transition-transform"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>

        </div>

        <TheFooter />
    </div>
</template>

<!-- <script setup> 
import { ref, computed, onMounted, onUnmounted } from 'vue'

import RelatedAsset from '../../../components/showcase/asset_gallery/child_components/RelatedAsset.vue' // Điều chỉnh đường dẫn tùy cấu trúc thư mục của bạn

import TheFooter from '../../../components/layout/TheFooter.vue'

// --- TRẠNG THÁI CHO ACCORDION TABS (MOBILE) ---
const isDescOpen = ref(true)
const isReviewsOpen = ref(false)

// --- TRẠNG THÁI CHO TABS NGANG (DESKTOP) ---
const activeTab = ref('description') // Mặc định mở tab description

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

// --- DỮ LIỆU HÌNH ẢNH MẪU (Carousel) ---
const images = ref([
    'https://images.unsplash.com/photo-1618336306534-1188d8dbde69?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop',
])

// --- LOGIC ĐIỀU KHIỂN CAROUSEL ---
const currentIdx = ref(0)

const prevImage = () => {
    currentIdx.value = currentIdx.value > 0 ? currentIdx.value - 1 : images.value.length - 1
}

const nextImage = () => {
    currentIdx.value = currentIdx.value < images.value.length - 1 ? currentIdx.value + 1 : 0
}

// --- HÀM CUỘN LÊN ĐẦU TRANG ---
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
</script> -->

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssetStore } from '../../../../stores/useAssetStore.js' // Thay đường dẫn Store của bạn vào đây

import TheFooter from '../../../../components/layout/TheFooter.vue'

import AssetImageGallery from './child_components/AssetImageGallery.vue'
import AssetActionButtons from './child_components/AssetActionButtons.vue'
import AssetPriceTag from './child_components/AssetPriceTag.vue'

import AssetMetaInfo from './child_components/AssetMetaInfo.vue'
import AssetDetailsSection from './child_components/AssetDetailsSection.vue'
import RelatedAsset from './child_components/RelatedAsset.vue'

import AssetNavigation from './child_components/AssetNavigation.vue'

import ThemeToggle from '../../../../components/base/ThemeToggle.vue'
import DonateButton from '../../../../components/base/DonateButton.vue'
import BackButton from '../../../../components/base/BackButton.vue'
import HomeButton from '../../../../components/base/HomeButton.vue'

import AssetLibraryMegaMenu from '../../../../components/layout/AssetLibraryMegaMenu.vue'

// --- KẾT NỐI STORE & ROUTER ---
const route = useRoute()
const router = useRouter()
const assetStore = useAssetStore()

// Lấy thông tin Asset dựa trên URL Params (VD: /asset/stylized-funny-male-character)
const currentAsset = computed(() => {
    // Dùng getAssetBySlug (hoặc getAssetById nếu URL của bạn dùng ID)
    const asset = assetStore.getAssetById(route.params.id) // Nhớ đổi 'slug' thành 'id' nếu file Router của bạn dùng :id

    // Xử lý khi không tìm thấy sản phẩm (nhập sai URL)
    if (!asset) {
        // Tùy chọn: router.push('/404') hoặc đẩy về trang danh sách
        router.push('/assets')
        return null
    }
    return asset
})

// --- LOGIC HÌNH ẢNH CAROUSEL & THUMBNAIL (Dùng Data Thật) ---
const currentImageIdx = ref(0)
const thumbContainer = ref(null)

// Lấy mảng ảnh từ dữ liệu thật
const galleryImages = computed(() => {
    return currentAsset.value?.media?.gallery || []
})

const nextImage = () => {
    if (galleryImages.value.length === 0) return;
    currentImageIdx.value = (currentImageIdx.value + 1) % galleryImages.value.length
}
const prevImage = () => {
    if (galleryImages.value.length === 0) return;
    currentImageIdx.value = currentImageIdx.value === 0
        ? galleryImages.value.length - 1
        : currentImageIdx.value - 1
}

// Logic trượt hàng Thumbnail
const scrollThumbLeft = () => {
    if (thumbContainer.value) {
        thumbContainer.value.scrollBy({ left: -200, behavior: 'smooth' })
    }
}
const scrollThumbRight = () => {
    if (thumbContainer.value) {
        thumbContainer.value.scrollBy({ left: 200, behavior: 'smooth' })
    }
}

// Tự động reset hình ảnh và tab khi click sang sản phẩm khác (ở phần Related)
watch(
    () => route.params.slug, // Hoặc route.params.id
    () => {
        currentImageIdx.value = 0
        activeTab.value = 'description'
        isDescOpen.value = true
        isReviewsOpen.value = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
)

// --- TRẠNG THÁI CHO ACCORDION & TABS ---
const isDescOpen = ref(true)
const isReviewsOpen = ref(false)
const activeTab = ref('description')

// --- STATE BẮT SỰ KIỆN CUỘN TRANG (CHO BREADCRUMB) ---
const isScrolled = ref(false)
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

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
            window.scrollBy({ top: direction * scrollStep, behavior: 'auto' })
            isTicking = false
        })
        isTicking = true
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

// --- HÀM CUỘN LÊN ĐẦU TRANG ---
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
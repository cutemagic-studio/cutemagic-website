<template>
    <header :class="[
        /* CỐ ĐỊNH: Luôn là màu solid (đặc) từ đầu đến cuối, không dùng kính mờ */
        'fixed top-0 w-full z-50 px-6 transition-all duration-300 bg-white dark:bg-[#0b0e14]',

        /* SCROLL: Khi cuộn chỉ thu nhỏ chiều cao và hiện viền đen 2px / bóng đổ */
        isScrolled
            ? 'py-2 border-b-2 border-[#1C1C1C] dark:border-white/10 shadow-lg'
            : 'py-4 border-b-2 border-transparent shadow-none',

        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="#hero-section">
                <div class="flex items-center gap-2 group cursor-pointer">

                    <!-- [ĐÃ CẬP NHẬT] Đổi thành w-11 h-11 (vuông vắn) -->
                    <div
                        class="w-9 h-9 overflow-hidden bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-md border-2 border-[#1C1C1C] dark:border-white/10 rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-300">

                        <!-- [ĐÃ CẬP NHẬT] Dùng w-full h-full object-cover để lấp đầy div -->
                        <img :src="logoUrl" alt="CuteMagic Logo"
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <div
                        class="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                        Cute<span class="text-gray-900 dark:text-white transition-colors">Magic</span>
                    </div>
                </div>
            </a>

            <!-- CHÚ Ý: Đảm bảo thẻ nav KHÔNG có class 'relative', để Mega Menu bên trong có thể tràn viền dựa theo thẻ <header> -->
            <nav class="hidden md:flex items-center space-x-10 font-bold static">

                <a href="#why-choose-us"
                    :class="[isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-800 dark:text-gray-300']"
                    class="hover:text-blue-600 dark:hover:text-blue-400 transition relative group/link text-sm py-2">
                    Why choose us
                    <span
                        class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover/link:w-full"></span>
                </a>

                <!-- ==========================================
                     NÚT ASSET LIBRARY VỚI MEGA MENU (KIỂU ASSET STORE)
                     ========================================== -->
                <!-- ==========================================
                     [CẬP NHẬT]: TRUYỀN BIẾN activeMenu XUỐNG 2 COMPONENT CON
                     ========================================== -->
                <AssetLibraryMegaMenu 
                    :is-scrolled="isScrolled" 
                    :is-open="activeMenu === 'asset'"
                    @toggle="toggleMenu('asset')"
                    @close="activeMenu = null"
                />

                <MegaMenuResources 
                    :is-scrolled="isScrolled" 
                    :is-open="activeMenu === 'resources'"
                    @toggle="toggleMenu('resources')"
                    @close="activeMenu = null"
                />

            </nav>

            <div class="-my-4 flex items-center shrink-0 gap-4">
                <!-- NÚT TOGGLE DARK MODE THÊM VÀO ĐÂY -->
                <!-- <button @click="toggleTheme"
                    class="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"> -->

                <button @click="toggleTheme"
                        :class="[theme.ui.buttonRoundedBorderBlue]">

                    <!-- Icon Mặt trời (hiện khi đang ở Dark Mode) -->
                    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM6.166 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.06 1.06l1.59 1.591zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.06-1.06l-1.59-1.591z" />
                    </svg>

                    <!-- Icon Mặt trăng (hiện khi đang ở Light Mode) -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                </button>

                <div class="flex items-center gap-4">
                    <!-- <button @click="goToDonate" class="relative px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 cursor-pointer
                           /* Hiệu ứng kính mờ (Nền trong suốt + Blur) */
                           bg-blue-500/10 dark:bg-blue-500/20 
                           backdrop-blur-md 
                           
                           /* Viền màu xanh phát sáng nhẹ để nổi bật khối div */
                           border border-blue-500/40 dark:border-blue-400/50
                           
                           /* Màu chữ tương phản: Xanh đậm (Light) / Xanh sáng (Dark) */
                           text-blue-700 dark:text-blue-300
                           
                           /* Đổ bóng phát quang (Glow effect) bao quanh nút */
                           shadow-[0_0_15px_rgba(37,99,235,0.15)] dark:shadow-[0_0_20px_rgba(96,165,250,0.25)]
                           
                           /* Hiệu ứng khi di chuột (Hover) */
                           hover:bg-blue-500/20 dark:hover:bg-blue-400/30
                           hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] dark:hover:shadow-[0_0_25px_rgba(96,165,250,0.4)]
                           hover:-translate-y-0.5">
                        Donate
                    </button> -->
                    <button @click="goToDonate"
                        :class="[theme.ui.buttonRoundedBorderBlue , 'py-2', 'px-6', 'font-bold']">
                        Donate
                        </button>
                </div>
            </div>

        </div>

        <!-- <PageScrollProgressBar/> -->
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../stores/useThemeStore'

import logoUrl from '../../assets/logo.webp'

import { useTheme } from '../../composables/useTheme'

import AssetLibraryMegaMenu from './AssetLibraryMegaMenu.vue'
import MegaMenuResources from './MegaMenuResources.vue'
import PageScrollProgressBar from './PageScrollProgressBar.vue'

const router = useRouter()
const theme = useThemeStore()
const { isDark, toggleTheme } = useTheme()

// ========================================================
// [CẬP NHẬT]: THAY THẾ isMegaMenuOpen THÀNH activeMenu
// ========================================================
// Biến lưu trữ tên menu đang được mở: 'asset', 'resources', hoặc null (đóng hết)
const activeMenu = ref(null)

// Hàm xử lý việc chuyển đổi giữa các menu
const toggleMenu = (menuName) => {
    if (activeMenu.value === menuName) {
        // Click lại đúng nút đang mở -> Đóng nó
        activeMenu.value = null
    } else {
        // Click nút khác -> Gán tên nút đó (Tự động đóng nút cũ)
        activeMenu.value = menuName 
    }
}

// ========================================================
// LOGIC KHÓA CUỘN TRANG (SCROLL LOCK) KHI MỞ MEGA MENU
// ========================================================
// Đổi watch từ isMegaMenuOpen sang activeMenu
// watch(activeMenu, (currentActiveMenu) => {
//     if (currentActiveMenu !== null) {
//         // Thêm class overflow-hidden của Tailwind vào body để khóa cuộn
//         document.body.classList.add('overflow-hidden')
//     } else {
//         // Gỡ class overflow-hidden khi đóng menu để cuộn bình thường
//         document.body.classList.remove('overflow-hidden')
//     }
// })

const isScrolled = ref(false)
const isHidden = ref(false) // Trạng thái ẩn/hiện header
let lastScrollPosition = 0  // Lưu vị trí cuộn trước đó để so sánh

// Logic xử lý đổi trạng thái khi cuộn chuột
const handleScroll = () => {
    const currentScrollPosition = window.scrollY

    // 1. Logic đổi nền khi rời khỏi top
    isScrolled.value = currentScrollPosition > 20

    // 2. Logic ẩn/hiện header khi cuộn lên/xuống
    // (Chỉ bắt đầu ẩn khi đã cuộn qua một mốc nhất định, ví dụ 80px)
    if (currentScrollPosition > 80) {
        if (currentScrollPosition > lastScrollPosition) {
            // Đang cuộn xuống -> Ẩn menu
            isHidden.value = true
        } else {
            // Đang cuộn lên -> Hiện menu
            isHidden.value = false
        }
    } else {
        // Luôn đảm bảo hiện menu khi ở trên cùng
        isHidden.value = false
    }

    // Cập nhật lại vị trí cuộn cũ
    lastScrollPosition = currentScrollPosition
}

onMounted(() => window.addEventListener('scroll', handleScroll))

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    // [THÊM DÒNG NÀY]: Đảm bảo luôn gỡ khóa cuộn khi component bị hủy
    document.body.classList.remove('overflow-hidden')
})

// Hàm tiện ích để mở link Store
const goToStore = () => {
    // window.open('LINK_STORE_CUA_BAN', '_blank') 
}
const goToDonate = () => {
    router.push({ name: 'Donate' })
}
</script>

<style scoped>
/* Hiệu ứng mượt mà khi đổi màu chữ, padding và trượt (transform) */
header {
    will-change: transform, background-color, padding;
}

/* Đảm bảo text tương phản tốt trên nền ảnh Hero */
a {
    text-rendering: optimizeLegibility;
}
</style>
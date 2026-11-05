<template>
    <!-- Khối bọc ngoài cùng: Giữ nguyên class của bạn cho trường hợp Header -->
    <div :class="mode === 'header' ? 'static flex items-center h-full' : ''">

        <!-- ==========================================
             TRƯỜNG HỢP 1: NÚT CHA CHÍNH TRÊN HEADER
             ========================================== -->
        <a v-if="mode === 'header'" href="#" @click.prevent="$emit('toggle')"
            :class="[isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-800 dark:text-gray-300']"
            class="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 text-sm cursor-pointer relative group/link">
            Asset Library

            <!-- Icon Mũi tên -->
            <svg :class="isOpen ? 'rotate-180' : 'rotate-0'" xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>

            <!-- Đường gạch chân -->
            <span :class="isOpen ? 'w-full' : 'w-0'"
                class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover/link:w-full"></span>
        </a>

        <!-- ==========================================
             TRƯỜNG HỢP 2: NÚT HAMBURGER TRÔI NỔI
             ========================================== -->
        <button v-if="mode === 'floating'" @click="$emit('toggle')" class="fixed left-0 top-1/8 z-50 flex items-center justify-center 
                   w-5 h-15 bg-white/70 dark:bg-[#11141b]/70 backdrop-blur-md 
                   border-y border-r border-gray-300 dark:border-white/10 rounded-r-xl 
                   shadow-sm
                   hover:w-12 hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-transparent dark:hover:border-transparent
                   hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]
                   transition-all duration-200 ease-out group outline-none cursor-pointer overflow-hidden">

            <!-- Icon 3 gạch -->
            <svg xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-white transition-all duration-200 group-hover:scale-110"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <!-- ==========================================
             PANEL MEGA MENU (XÀI CHUNG CHO CẢ 2 TRƯỜNG HỢP)
             ========================================== -->
        <div :class="[
            isOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 pointer-events-none',
            mode === 'header' ? 'absolute left-0 top-full w-full z-50' : `fixed left-0 ${offsetTop} w-full z-40`
        ]" class="transition-all duration-300">

            <div
                class="relative w-full bg-white dark:bg-[#0b0e14] border-y border-gray-200 dark:border-white/10 shadow-2xl flex flex-col">

                <!-- NỘI DUNG MEGA MENU -->
                <div class="max-w-7xl mx-auto px-6 pt-6 pb-12 w-full">

                    <div class="grid grid-cols-4 gap-8 xl:gap-12">

                        <!-- CỘT 1: HÀNH ĐỘNG NHANH -->
                        <div
                            class="dashed-boundary rounded-2xl p-4 xl:p-5 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <h3
                                :class="[theme.ui.megamenuTitleHeader]">
                                Explore</h3>
                            <ul class="space-y-1 relative z-10">
                                <li><a href="#asset-library" @click.prevent="scrollToSection('AssetLibrarySection')"
                                        :class="[theme.ui.megamenuRouterLink]">Library Overview</a></li>
                                <li><router-link :to="{ path: '/assets' }" @click="$emit('close')"
                                        :class="[theme.ui.megamenuRouterLink]">View All Assets</router-link></li>
                                <li><router-link :to="{ path: '/assets', query: { filter: 'free' } }"
                                        @click="$emit('close')" :class="[theme.ui.megamenuRouterLink]">Free
                                        Assets</router-link></li>
                                <li><router-link :to="{ path: '/assets', query: { filter: 'favorites' } }"
                                        @click="$emit('close')" :class="[theme.ui.megamenuRouterLink]">Favorite
                                        Assets</router-link></li>
                            </ul>
                        </div>

                        <!-- CỘT 2: DANH MỤC 3D -->
                        <div
                            class="dashed-boundary rounded-2xl p-4 xl:p-5 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <h3
                                :class="[theme.ui.megamenuTitleHeader]">
                                3D Models</h3>
                            <ul class="space-y-1 relative z-10">
                                
                                <!-- 1. Danh mục Characters -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'characters' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        Characters
                                    </router-link>
                                </li>
                                <!-- 2. Danh mục Environments -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'environments' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        Environments
                                    </router-link>
                                </li>
                                <!-- 3. Danh mục Props & Items (Interiors) -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'interiors' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        Props & Items
                                    </router-link>
                                </li>
                                <!-- 4. Danh mục Vehicles -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'vehicles' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        Vehicles
                                    </router-link>
                                </li>
                            </ul>
                        </div>

                        <!-- CỘT 3: 2D & GIAO DIỆN -->
                        <div
                            class="dashed-boundary rounded-2xl p-4 xl:p-5 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <h3
                                :class="[theme.ui.megamenuTitleHeader]">
                                2D & UI</h3>
                            <ul class="space-y-1 relative z-10">
                                
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'ui-elements' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        UI Elements
                                    </router-link>
                                </li>
                                <!-- 2. Danh mục Icons & Textures -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: 'icons' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        Icons & Textures
                                    </router-link>
                                </li>
                                <!-- 3. Danh mục 2D Characters -->
                                <li>
                                    <router-link :to="{ path: '/assets', query: { category: '2d-characters' } }"
                                        @click="handleCloseMenu" :class="[theme.ui.megamenuRouterLink]">
                                        2D Characters
                                    </router-link>
                                </li>
                            </ul>
                        </div>

                        <!-- CỘT 4: NỔI BẬT -->
                        <div
                            class="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 xl:p-5 border border-gray-100 dark:border-white/5 transition-all hover:border-gray-200 dark:hover:border-white/10">
                            <h3
                                class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1">
                                Trending 🔥</h3>
                            <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
                                <img src="https://via.placeholder.com/300x150/1C1C1C/505050?text=Hot+Pack"
                                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                            <a href="#"
                                class="text-[14.5px] font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors block px-1">Stylized
                                Island Mega Pack</a>
                            <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 px-1">50% off this week!</p>
                        </div>

                    </div>
                </div>

                <!-- NÚT ĐÓNG BÊN DƯỚI -->
                <button @click="$emit('close')"
                    class="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center w-28 h-7 bg-slate-50 hover:bg-slate-100 dark:bg-[#11141b]/90 dark:hover:bg-[#161a23] backdrop-blur-md border-t border-x border-slate-200 dark:border-white/10 border-b-0 rounded-t-2xl transition-all duration-300 cursor-pointer outline-none group/close shadow-[0_-5px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-50">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover/close:text-blue-600 dark:group-hover/close:text-blue-400 transition-transform duration-300 group-hover/close:-translate-y-0.5"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>

            </div>
        </div>

        <!-- [CẬP NHẬT 1: THÊM LẠI] Lớp phủ mờ (Chỉ hiện khi dùng nút trôi nổi) -->
        <div v-if="mode === 'floating' && isOpen" @click="$emit('close')"
            class="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-30 transition-opacity"></div>

    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

import { useThemeStore } from '../../stores/useThemeStore'

const theme = useThemeStore()

// Nhận biến isScrolled từ Header truyền vào để đổi màu chữ cho khớp
const props = defineProps({
    isScrolled: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'header' // 'header' hoặc 'floating'
    },
    offsetTop: { type: String, default: 'top-[72px]' },

    isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle', 'close'])

// Hàm xử lý: Tự động đóng menu nếu người dùng cuộn trang
const closeMenuOnScroll = () => {
    if (props.isOpen) {
        emit('close') // Gửi lệnh 'close' lên component cha
    }
}

// === NẾU BẠN ĐANG SỬA FILE MegaMenuResources.vue, HÃY CẬP NHẬT HÀM scrollToSection ===
// Hàm cuộn trang mượt mà (Smooth scroll) đến các khu vực trên Landing Page
const scrollToSection = (id) => {
    emit('close') // Gửi lệnh đóng menu cho Header trước khi cuộn

    setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
            const headerOffset = 10
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }, 150)
}

// Theo dõi trạng thái menu để bật/tắt lắng nghe cuộn
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        window.addEventListener('scroll', closeMenuOnScroll, { passive: true })
    } else {
        window.removeEventListener('scroll', closeMenuOnScroll)
    }
})

// Đảm bảo dọn dẹp sạch sẽ sự kiện nếu người dùng bấm link chuyển sang trang khác
onUnmounted(() => {
    window.removeEventListener('scroll', closeMenuOnScroll)
})
</script>
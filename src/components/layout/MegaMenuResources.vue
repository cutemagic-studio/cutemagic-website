<template>
    <!-- Khối bọc ngoài cùng: Giữ nguyên class của bạn cho trường hợp Header -->
    <div :class="mode === 'header' ? 'static flex items-center h-full' : ''">

        <!-- ==========================================
             NÚT MỞ MENU TRÊN HEADER
             ========================================== -->
        <a v-if="mode === 'header'" href="#" @click.prevent="$emit('toggle')"
            :class="[isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-800 dark:text-gray-300']"
            class="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 text-sm cursor-pointer relative group/link">
            
            Resources

            <!-- Icon Mũi tên -->
            <svg :class="isOpen ? 'rotate-180' : 'rotate-0'" xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>

            <!-- Đường gạch chân -->
            <span :class="isOpen ? 'w-full' : 'w-0'"
                class="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover/link:w-full"></span>
        </a>

        <!-- (Lược bỏ nút Floating ở đây vì phần Resources thường chỉ nằm trên Header chính) -->

        <!-- ==========================================
             PANEL MEGA MENU RESOURCES
             ========================================== -->
        <div :class="[
                isOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 pointer-events-none',
                mode === 'header' ? 'absolute left-0 top-full w-full z-50' : `fixed left-0 ${offsetTop} w-full z-40`
             ]"
             class="transition-all duration-300">
            
            <div class="relative w-full bg-white dark:bg-[#0b0e14] border-y border-gray-200 dark:border-white/10 shadow-2xl flex flex-col">
                
                <!-- NỘI DUNG MEGA MENU -->
                <div class="max-w-7xl mx-auto px-6 pt-6 pb-12 w-full">
                    
                    <!-- Lưới Grid: Chỉnh lại thành 2 cột nằm giữa cho gọn gàng -->
                    <div class="flex justify-center gap-8 xl:gap-16">
                        
                        <!-- CỘT 1: DỰ ÁN & KỸ THUẬT -->
                        <div class="dashed-boundary rounded-2xl p-4 xl:p-6 w-80 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <h3 :class="[theme.ui.megamenuTitleHeader]">
                                PROJECT & TECHNICAL
                            </h3>
                            <ul class="space-y-1 relative z-10">
                                <li>
                                    <a href="#roadmap" @click.prevent="scrollToSection('ProductionRoadmapSection')" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        Production Roadmap
                                    </a>
                                </li>
                                <li>
                                    <a href="#tech-specs" @click.prevent="scrollToSection('AssetSpecSection')" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        Technical Specs
                                    </a>
                                </li>
                                <li>
                                    <a href="#quick-list" @click.prevent="scrollToSection('QuickListSection')" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        Quick List
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- CỘT 2: HỖ TRỢ & LIÊN HỆ -->
                        <div class="dashed-boundary rounded-2xl p-4 xl:p-6 w-80 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <h3 :class="[theme.ui.megamenuTitleHeader]">
                                CUSTOMER SUPPORT
                            </h3>
                            <ul class="space-y-1 relative z-10">
                                <li>
                                    <a href="#faq" @click.prevent="scrollToSection('FaqAccordionSection')" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        FAQ & Help
                                    </a>
                                </li>
                                <li>
                                    <a href="#contact" @click.prevent="scrollToSection('ContactSection')" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:cutemagic15081998@gmail.com" :class="[theme.ui.megamenuResRouterLink]">
                                        
                                        Email Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                    </div>
                </div>

                <!-- NÚT ĐÓNG BÊN DƯỚI -->
                <button @click="$emit('close')"
                    class="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center w-28 h-7 bg-slate-50 hover:bg-slate-100 dark:bg-[#11141b]/90 dark:hover:bg-[#161a23] backdrop-blur-md border-t border-x border-slate-200 dark:border-white/10 border-b-0 rounded-t-2xl transition-all duration-300 cursor-pointer outline-none group/close shadow-[0_-5px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover/close:text-blue-600 dark:group-hover/close:text-blue-400 transition-transform duration-300 group-hover/close:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>

            </div>
        </div>
        
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

// Theo dõi trạng thái menu để bật/tắt lắng nghe cuộn
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        window.addEventListener('scroll', closeMenuOnScroll, { passive: true })
    } else {
        window.removeEventListener('scroll', closeMenuOnScroll)
    }
})

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

// Đảm bảo dọn dẹp sạch sẽ sự kiện nếu người dùng bấm link chuyển sang trang khác
onUnmounted(() => {
    window.removeEventListener('scroll', closeMenuOnScroll)
})
</script>
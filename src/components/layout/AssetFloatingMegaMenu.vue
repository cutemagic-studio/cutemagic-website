<template>
    <Teleport to="body">
        <div>

            <!-- <button @click.stop="isMegaMenuOpen = !isMegaMenuOpen" -->
            <button @click="testButtonClick" class="fixed left-0 top-1/8 z-[9999] flex items-center justify-center 
                   w-5 h-15 bg-white/70 dark:bg-[#11141b]/70 backdrop-blur-md 
                   border-y border-r border-gray-300 dark:border-white/10 rounded-r-xl 
                   shadow-sm cursor-pointer overflow-hidden
                   hover:w-12 hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-transparent dark:hover:border-transparent
                   hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]
                   transition-all duration-200 ease-out group outline-none">

                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-white transition-all duration-200 group-hover:scale-110"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- ==========================================
             PANEL MEGA MENU CHÍNH
             ========================================== -->
            <!-- Đổi isOpen thành isMegaMenuOpen -->
            <div :class="[
                isMegaMenuOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 pointer-events-none',
                `fixed left-0 ${offsetTop} w-full z-[9998]`
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
                                    class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1 relative z-10">
                                    Khám Phá</h3>
                                <ul class="space-y-1 relative z-10">
                                    <li><a href="#asset-library"
                                            class="flex items-center gap-2 px-3 py-2.5 -mx-3 text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200">Tổng
                                            quan thư viện</a></li>
                                    <li><router-link to="/assets"
                                            class="flex items-center gap-2 px-3 py-2.5 -mx-3 text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200">Xem
                                            All Assets</router-link></li>
                                    <li><a href="#"
                                            class="flex items-center gap-2 px-3 py-2.5 -mx-3 text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200">Tài
                                            nguyên miễn phí (Free)</a></li>
                                </ul>
                            </div>

                            <!-- CỘT 2: DANH MỤC 3D -->
                            <div
                                class="dashed-boundary rounded-2xl p-4 xl:p-5 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                <h3
                                    class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1 relative z-10">
                                    Mô hình 3D</h3>
                                <ul class="space-y-1 relative z-10">
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">Characters</a>
                                    </li>
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">Environments</a>
                                    </li>
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">Props
                                            & Items</a></li>
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">Vehicles</a>
                                    </li>
                                </ul>
                            </div>

                            <!-- CỘT 3: 2D & GIAO DIỆN -->
                            <div
                                class="dashed-boundary rounded-2xl p-4 xl:p-5 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                <h3
                                    class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1 relative z-10">
                                    2D & Giao Diện</h3>
                                <ul class="space-y-1 relative z-10">
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">UI
                                            Elements</a></li>
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">Icons
                                            & Textures</a></li>
                                    <li><a href="#"
                                            class="block px-3 py-2 -mx-3 text-[14px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all duration-200">2D
                                            Characters</a></li>
                                </ul>
                            </div>

                            <!-- CỘT 4: NỔI BẬT -->
                            <div
                                class="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 xl:p-5 border border-gray-100 dark:border-white/5 transition-all hover:border-gray-200 dark:hover:border-white/10">
                                <h3
                                    class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1">
                                    Đang Hot 🔥</h3>
                                <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
                                    <img src="https://via.placeholder.com/300x150/1C1C1C/505050?text=Hot+Pack"
                                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                                </div>
                                <a href="#"
                                    class="text-[14.5px] font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors block px-1">Stylized
                                    Island Mega Pack</a>
                                <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 px-1">Giảm giá 50% tuần
                                    này!</p>
                            </div>

                        </div>
                    </div>

                    <!-- NÚT ĐÓNG BÊN DƯỚI -->
                    <button @click.stop="isMegaMenuOpen = false"
                        class="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center w-28 h-7 bg-slate-50 hover:bg-slate-100 dark:bg-[#11141b]/90 dark:hover:bg-[#161a23] backdrop-blur-md border-t border-x border-slate-200 dark:border-white/10 border-b-0 rounded-t-2xl transition-all duration-300 cursor-pointer outline-none group/close shadow-[0_-5px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-50">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover/close:text-blue-600 dark:group-hover/close:text-blue-400 transition-transform duration-300 group-hover/close:-translate-y-0.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>

                </div>
            </div>

            <!-- ==========================================
             LỚP PHỦ MỜ (BACKDROP OVERLAY)
             ========================================== -->
            <!-- Click ra ngoài overlay cũng sẽ đóng menu -->
            <div v-if="isMegaMenuOpen" @click.stop="isMegaMenuOpen = false"
                class="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[9997] transition-opacity"></div>

        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
    offsetTop: {
        type: String,
        default: 'top-[48px]'
    }
})

// TRẠNG THÁI NỘI BỘ (Không dùng props isOpen hay emit nữa)
const isMegaMenuOpen = ref(false)

// Hàm đóng menu khi cuộn
const closeMenuOnScroll = () => {
    if (isMegaMenuOpen.value) {
        isMegaMenuOpen.value = false
    }
}

const testButtonClick = () => {
    console.log('A')
    alert('BUTTON CLICKED!')
}

// Bật/tắt lắng nghe cuộn trang dựa trên trạng thái nội bộ
watch(isMegaMenuOpen, (isOpen) => {
    if (isOpen) {
        window.addEventListener(
            'scroll',
            closeMenuOnScroll,
            { passive: true }
        )
    } else {
        window.removeEventListener(
            'scroll',
            closeMenuOnScroll
        )
    }
})

onUnmounted(() => {
    window.removeEventListener('scroll', closeMenuOnScroll)
})
</script>
<template>
    <div class="min-h-screen pt-0 pb-20 bg-gray-50 dark:bg-[#0b0e14] transition-colors duration-300">
        
        <!-- ==========================================
             1. THANH BREADCRUMB (Nền Solid + Chứa nút điều hướng)
             ========================================== -->
        <div :class="[
            'sticky top-0 z-50 bg-white dark:bg-[#161a23] transition-all duration-300',
            isScrolled 
                ? 'shadow-sm border-b border-gray-200 dark:border-slate-800' 
                : 'shadow-none border-transparent'
        ]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
                
                <!-- Đường dẫn Breadcrumb -->
                <nav class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <router-link to="/" class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Trang chủ
                    </router-link>
                    <span class="text-gray-300 dark:text-gray-700">/</span>
                    <router-link to="/assets" class="hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors cursor-pointer">Asset Library</router-link>
                    <span class="text-gray-300 dark:text-gray-700">/</span>
                    <!-- Tên Asset đang xem -->
                    <span class="text-gray-900 dark:text-gray-200 font-bold truncate max-w-[120px] sm:max-w-none">Stylized Funny Male Character</span>
                </nav>

                <!-- Icon điều hướng bên phải: Prev (<) | Grid | Next (>) -->
                <div class="flex items-center gap-4 text-gray-400">
                    <button class="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" title="Previous Asset">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <router-link to="/assets" class="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" title="Back to Grid">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </router-link>
                    <button class="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" title="Next Asset">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

            </div>
        </div>
        
        <div class="max-w-7xl mx-auto px-6 pt-6">

            <!-- ==========================================
                 2. KHU VỰC HERO: HÌNH ẢNH & THÔNG TIN (Tỷ lệ 1.35 : 1)
                 ========================================== -->
            <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] md:grid-cols-[1.1fr_1fr] gap-10 mb-12 ">
                
                <!-- CỘT TRÁI: CAROUSEL HÌNH ẢNH -->
                <div class="flex flex-col gap-4">
                    
                    <div class="relative w-full aspect-[16/10] bg-[#111] rounded-xl overflow-hidden group shadow-lg">
                        <img :src="images[currentIdx]" alt="Asset Preview" class="w-full h-full object-cover transition-opacity duration-300">
                        
                        <!-- Mũi tên TRÁI -->
                        <button @click="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <!-- Mũi tên PHẢI -->
                        <button @click="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <!-- Nút Fullscreen -->
                        <button class="absolute bottom-5 left-5 p-3 bg-[#1e1e1e]/80 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>

                    <!-- HÀNG THUMBNAIL BÊN DƯỚI -->
                    <div class="relative w-full group/thumb mt-1">
                        <!-- Nút cuộn trái (Hiển thị khi hover vào cụm thumbnail) -->
                        <button @click="scrollThumbLeft" class="absolute left-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-[#ff005b] text-white px-0.5 transition-all opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center cursor-pointer rounded-l-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <!-- Danh sách ảnh con -->
                        <div ref="thumbContainer" class="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth snap-x">
                            <button
                                v-for="(img, index) in images"
                                :key="index"
                                @click="currentIdx = index"
                                class="relative shrink-0 w-[100px] sm:w-[110px] aspect-[16/10] rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer snap-start"
                                :class="currentIdx === index ? 'border-[#ff005b] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'"
                            >
                                <img :src="img" class="w-full h-full object-cover">
                            </button>
                        </div>

                        <!-- Nút cuộn phải -->
                        <button @click="scrollThumbRight" class="absolute right-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-[#ff005b] text-white px-0.5 transition-all opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center cursor-pointer rounded-r-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <!-- CỘT PHẢI: THÔNG TIN CHI TIẾT -->
                <div class="flex flex-col pt-2">
                    <h3 class="text-2xl font-bold text-white mb-3 tracking-tight">Stylized Funny Male Character</h3>
                    
                    <!-- Giá tiền (Hiệu ứng kính mờ viền hồng) -->
                    <div class="mb-6">
                        <div class="inline-flex items-center px-4 py-1.5 bg-black/40 backdrop-blur-sm border border-[#ff005b]/50 rounded-lg shadow-sm">
                            <span class="text-[#ff005b] text-1xl font-black tracking-wide">
                                $69,99
                            </span>
                        </div>
                    </div>

                    
                    <!-- Mô tả ngắn -->
                    <p class="text-[15px] text-gray-300 leading-relaxed mb-8">
                        A stylized goofy male character with three looks: underwear, a relaxed outfit, and a business suit. Mix and match removable clothing pieces, add accessories, and use free Mixamo animations to bring this expressive NPC into your game.
                    </p>

                    <!-- Khối Nút Mua Hàng (Đã đổi sang w-fit để nút co lại ôm sát chữ) -->
                    <div class="flex flex-col gap-3 mb-4">
                        <button class="w-fit bg-[#ff005b] hover:bg-[#d6004c] text-white font-bold py-2.5 px-8 rounded-lg uppercase text-[12px] lg:text-[13px] tracking-[0.1em] transition-colors cursor-pointer shadow-md shadow-[#ff005b]/20">
                            Buy on Unity Asset Store
                        </button>
                        <button class="w-fit bg-[#ff005b] hover:bg-[#d6004c] text-white font-bold py-2.5 px-8 rounded-lg uppercase text-[12px] lg:text-[13px] tracking-[0.1em] transition-colors cursor-pointer shadow-md shadow-[#ff005b]/20">
                            Buy on Itch.io
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==========================================
                 3. KHU VỰC CHI TIẾT (Responsive: Accordion Mobile / Tabs Desktop)
                 ========================================== -->
            <div class="mt-16">
                
                <!-- GIAO DIỆN ACCORDION (CHỈ HIỂN THỊ TRÊN MOBILE/TABLET) -->
                <div class="lg:hidden border-t border-gray-800">
                    <!-- Tab: Description -->
                    <div>
                        <button 
                            @click="isDescOpen = !isDescOpen" 
                            class="w-full flex justify-between items-center py-5 border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer group outline-none"
                        >
                            <span class="text-lg font-bold text-white tracking-wide">Description</span>
                            <svg :class="{'rotate-180': isDescOpen}" class="w-4 h-4 text-gray-500 group-hover:text-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-show="isDescOpen" class="py-6 text-sm text-gray-300 leading-relaxed bg-[#1a1a1a] px-5 rounded-b-lg mb-2">
                            <h3 class="text-lg font-bold text-white mb-3">Technical Details</h3>
                            <ul class="list-disc list-inside space-y-2">
                                <li>Rigged: Yes</li>
                                <li>Animated: Yes (Compatible with Mixamo)</li>
                                <li>Polycount: 12,000 Triangles</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Tab: Reviews -->
                    <div>
                        <button 
                            @click="isReviewsOpen = !isReviewsOpen" 
                            class="w-full flex justify-between items-center py-5 border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer group outline-none"
                        >
                            <span class="text-lg font-bold text-white tracking-wide">Reviews (0)</span>
                            <svg :class="{'rotate-180': isReviewsOpen}" class="w-4 h-4 text-gray-500 group-hover:text-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-show="isReviewsOpen" class="py-8 text-center text-gray-500 bg-[#1a1a1a] px-5 rounded-b-lg">
                            No reviews yet. Be the first to review this asset!
                        </div>
                    </div>
                </div>

                <!-- GIAO DIỆN TABS (CHỈ HIỂN THỊ TRÊN LAPTOP/DESKTOP) -->
                <div class="hidden lg:block">
                    
                    <!-- Dải Nút Tabs -->
                    <div class="flex justify-center gap-12 border-t border-gray-800">
                        <button 
                            @click="activeTab = 'description'"
                            class="relative pt-6 pb-4 font-bold text-sm uppercase tracking-wider transition-colors outline-none"
                            :class="activeTab === 'description' ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
                        >
                            Description
                            <!-- Đường gạch hồng nổi trên cùng -->
                            <div v-if="activeTab === 'description'" class="absolute top-[-1px] left-0 w-full h-[3px] bg-[#ff005b]"></div>
                        </button>
                        
                        <button 
                            @click="activeTab = 'reviews'"
                            class="relative pt-6 pb-4 font-bold text-sm uppercase tracking-wider transition-colors outline-none"
                            :class="activeTab === 'reviews' ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
                        >
                            Reviews (0)
                            <div v-if="activeTab === 'reviews'" class="absolute top-[-1px] left-0 w-full h-[3px] bg-[#ff005b]"></div>
                        </button>
                    </div>

                    <!-- Nội dung Tabs -->
                    <div class="py-8 min-h-[300px]">
                        
                        <!-- Nội dung Tab: Description (Đã format text theo đúng ảnh) -->
                        <div v-if="activeTab === 'description'" class="text-[15px] text-gray-300 leading-relaxed max-w-[1000px] space-y-6">
                            <p>Bring a little comedy to your game with this Stylized Goofy Male Character!</p>
                            
                            <p>This expressive character comes with three looks: underwear, a relaxed outfit, and a business suit. The clothing is modular, so you can remove individual pieces and mix them to create different looks.</p>
                            
                            <h3 class="text-2xl font-black text-white mt-10 mb-5">Features</h3>
                            
                            <ul class="list-disc list-inside space-y-3">
                                <li><strong class="text-white font-bold">1 Stylized Male Character</strong></li>
                                <li><strong class="text-white font-bold">Three Looks</strong> – underwear, a relaxed outfit, and a business suit</li>
                                <li><strong class="text-white font-bold">Modular Clothing</strong> – remove individual pieces and combine them in different ways</li>
                                <li><strong class="text-white font-bold">Accessories</strong> – a flower for the jacket and a gold chain necklace</li>
                                <li><strong class="text-white font-bold">Rigged Face</strong> – movable jaw, eyes, and nose</li>
                                <li><strong class="text-white font-bold">Mixamo Compatible</strong> – works with free Mixamo animations</li>
                            </ul>

                            <p class="pt-2">Whether he's taking it easy, trying to look professional, or caught in an awkward moment, this character can add personality to NPCs, comedy games, and lighthearted scenes.</p>

                            <h3 class="text-2xl font-black text-white mt-10 mb-5">FAQ</h3>
                            <h4 class="text-xl font-bold text-white">Can I use this character with Mixamo animations?</h4>
                        </div>

                        <!-- Nội dung Tab: Reviews -->
                        <div v-if="activeTab === 'reviews'" class="text-gray-500 pt-8 text-center">
                            No reviews yet. Be the first to review this asset!
                        </div>

                    </div>
                </div>

            </div>

            <!-- ==========================================
                 4. KHU VỰC SẢN PHẨM LIÊN QUAN (Related products)
                 ========================================== -->
            <div class="mt-16 mb-8">
                <!-- <h2 class="text-2xl font-bold text-white mb-8">Related products</h2> -->
                
                <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div class="bg-[#111] rounded-xl overflow-hidden cursor-pointer group border border-gray-800 hover:border-[#ff005b] transition-colors shadow-md">
                        <div class="aspect-[16/9] overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1614294148960-9aa740632a87?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                    </div>

                   
                    <div class="bg-[#111] rounded-xl overflow-hidden cursor-pointer group border border-gray-800 hover:border-[#ff005b] transition-colors shadow-md">
                        <div class="aspect-[16/9] overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                    </div>

                    
                    <div class="bg-[#111] rounded-xl overflow-hidden cursor-pointer group border border-gray-800 hover:border-[#ff005b] transition-colors shadow-md">
                        <div class="aspect-[16/9] overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                    </div>
                </div> -->

                <RelatedAsset/>
            </div>

        </div>

        <!-- ==========================================
             5. NÚT SCROLL TO TOP 
             ========================================== -->
        <button 
            @click="scrollToTop"
            class="fixed bottom-8 right-8 w-12 h-12 bg-[#111] hover:bg-[#ff005b] border border-gray-700 hover:border-[#ff005b] text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-50 group cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
            </svg>
        </button>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import RelatedAsset from '../../../components/showcase/asset_gallery/child_components/RelatedAsset.vue' // Điều chỉnh đường dẫn tùy cấu trúc thư mục của bạn

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
</script>
<template>
    <div class="min-h-screen pt-0 pb-24 bg-gray-50 dark:bg-[#0b0e14] transition-colors duration-300 font-sans">

        <!-- ==========================================
             1. THANH BREADCRUMB / MENU TRÊN CÙNG
             (Tự động trượt ẩn & thu gọn chiều cao về 0 trong 10s hiển thị thông báo cảm ơn)
             ========================================== -->
        <div :class="[
            'sticky top-0 z-50 bg-white dark:bg-[#161a23] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            isCardsCompact
                ? 'max-h-0 -translate-y-full opacity-0 pointer-events-none border-transparent shadow-none'
                : 'max-h-24 translate-y-0 opacity-100',
            !isCardsCompact && isScrolled
                ? 'shadow-sm border-b border-gray-200 dark:border-slate-800'
                : 'shadow-none border-transparent'
        ]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">

                <div class="flex items-center gap-6 sm:gap-8">
                    <div class="-my-4 flex items-center gap-4">
                        <HomeButton />
                    </div>
                    <!-- Đường dẫn Breadcrumb -->
                    <nav class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <router-link to="/"
                            class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-[#ff005b] transition-colors cursor-pointer">
                            Home
                        </router-link>
                        <span class="text-gray-300 dark:text-gray-700">/</span>
                        <span
                            class="text-gray-900 dark:text-gray-200 font-bold truncate max-w-[120px] sm:max-w-none">Donate</span>
                    </nav>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Nút nhỏ cho phép mở lại lời giới thiệu nếu đã bị left-fade -->
                    <button
                        v-if="hasLeftFadedIntro"
                        type="button"
                        @click="restoreIntroHeader"
                        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                        title="Hiện lại lời giới thiệu"
                    >
                        <span>ℹ️</span>
                        <span>Your support matters</span>
                    </button>

                    <div class="-my-4 flex items-center gap-4">
                        <BackButton />
                        <ThemeToggle />
                        <DonateButton />
                    </div>
                </div>
            </div>
        </div>

        <!-- ==========================================
             2. NỘI DUNG CHÍNH TRANG DONATE
             (Tự động giảm padding-top khi ẩn menu để khung thông báo nằm trọn trong màn hình)
             ========================================== -->
        <div
            class="max-w-7xl mx-auto px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="isCardsCompact ? 'pt-4' : (hasLeftFadedIntro ? 'pt-8' : 'pt-14')"
        >

            <div class="max-w-5xl mx-auto">

                <!-- =========================================================
                     KHU VỰC TEXT TIÊU ĐỀ (LEFT-FADE KHI SCROLL XUỐNG LẦN ĐẦU)
                     ========================================================= -->
                <div
                    class="grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    :class="hasLeftFadedIntro
                        ? 'grid-rows-[0fr] opacity-0 -translate-x-28 pointer-events-none mb-0'
                        : 'grid-rows-[1fr] opacity-100 translate-x-0 mb-14'"
                >
                    <div class="overflow-hidden">
                        <div class="max-w-3xl mx-auto text-center">
                            <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                                Your support matters.
                            </h1>

                            <p class="text-[15px] md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Cute Magic provides <router-link to="/assets"
                                    class="underline underline-offset-4 hover:text-[#ff005b] font-bold transition-colors">stylized
                                    3D game assets</router-link> crafted with care for personal, educational, and commercial projects.
                                Whether you support us by following our store, sending a burst of spiritual motivation with a click,
                                or scanning our PayPal QR code — thank you for joining our mission!
                            </p>
                        </div>
                    </div>
                </div>

                <!-- =========================================================
                     KHU VỰC 3 THẺ ỦNG HỘ (TỰ ĐỘNG THU GỌN NỘI DUNG PHỤ TRONG 10S)
                     ========================================================= -->
                <div ref="cardsSectionRef" class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    <!-- CARD 1: QUAN TÂM & ĐỒNG HÀNH CÙNG CỬA HÀNG (Màu Xanh Ngọc) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                        :class="thankYouBanner.visible && activeBannerType === 'follow'
                            ? 'border-[#29abe0] ring-4 ring-[#29abe0]/20'
                            : 'border-gray-100 dark:border-gray-800'"
                    >
                        <div>
                            <!-- Thanh màu trên cùng (Thu gọn nhẹ khi đang hiện thông báo) -->
                            <div
                                class="bg-[#a6e6e2] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/15 text-slate-900 text-[10px] font-black uppercase tracking-wider"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    Free • Community
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Icon nổi -->
                                <div
                                    class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm transition-transform duration-150"
                                    :class="isPulseAnimatingStar ? 'scale-125' : 'scale-100'">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#29abe0]"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>

                                <h3
                                    class="text-xl font-bold text-gray-900 dark:text-white mt-3 transition-all duration-500"
                                    :class="isCardsCompact ? 'mb-3' : 'mb-2'"
                                >
                                    Follow &amp; Love Store
                                </h3>

                                <!-- Nội dung phụ: Tự động thu gọn trong 10s khi thông báo bật, sau đó mở lại -->
                                <div
                                    class="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    :class="isCardsCompact ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-6'"
                                >
                                    <div class="overflow-hidden">
                                        <p class="text-sm text-gray-500 dark:text-gray-400 min-h-[60px] leading-relaxed">
                                            Always keep an eye on our store, bookmark your favorite 3D asset packs, and share Cute Magic with fellow indie developers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 transition-all duration-500" :class="isCardsCompact ? 'pb-5' : 'pb-8'">
                            <button
                                type="button"
                                @click="handleTriggerFollowSupport"
                                class="w-full bg-[#29abe0] hover:bg-[#208ab5] active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 select-none">
                                <span>🌟</span>
                                <span>{{ hasFollowed ? 'Following & Supporting!' : 'Pledge Your Support' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- CARD 2: SỨC MẠNH TINH THẦN - SUPPORT BY CLICK (Màu Xanh Lá) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                        :class="thankYouBanner.visible && activeBannerType === 'mana'
                            ? 'border-[#f96854] ring-4 ring-[#f96854]/20'
                            : 'border-gray-100 dark:border-gray-800'"
                    >
                        <div>
                            <!-- Thanh màu trên cùng -->
                            <div
                                class="bg-[#a7e4a9] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/15 text-slate-900 text-[10px] font-black uppercase tracking-wider"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    1-Click Spirit Boost
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Icon nổi -->
                                <div
                                    class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm transition-transform duration-150"
                                    :class="isPulseAnimatingHeart ? 'scale-125' : 'scale-100'">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#f96854]"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>

                                <h3
                                    class="text-xl font-bold text-gray-900 dark:text-white mt-3 transition-all duration-500"
                                    :class="isCardsCompact ? 'mb-3' : 'mb-2'"
                                >
                                    Spiritual Mana Boost
                                </h3>

                                <!-- Nội dung phụ: Tự động thu gọn trong 10s khi thông báo bật, sau đó mở lại -->
                                <div
                                    class="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    :class="isCardsCompact ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-6'"
                                >
                                    <div class="overflow-hidden">
                                        <p class="text-sm text-gray-500 dark:text-gray-400 min-h-[60px] leading-relaxed">
                                            No wallet needed! Support by Click to send a burst of creative energy and motivation straight to our 3D modeling forge.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 transition-all duration-500" :class="isCardsCompact ? 'pb-5' : 'pb-8'">
                            <button
                                type="button"
                                @click="handleTriggerManaClick"
                                class="w-full bg-[#f96854] hover:bg-[#d85544] active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 select-none">
                                <span>🔥</span>
                                <span>Support by Click (+{{ manaClicks }} Mana)</span>
                            </button>
                        </div>
                    </div>

                    <!-- CARD 3: DONATE BẰNG QUÉT MÃ QR PAYPAL (Màu Cam Đào - Duy nhất bằng tiền) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-800 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between">
                        <div>
                            <!-- Thanh màu trên cùng -->
                            <div
                                class="bg-[#f8cd9f] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-900/20 text-amber-950 text-[10px] font-black uppercase tracking-wider"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    QR Scan • Monetary
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Icon nổi -->
                                <div
                                    class="w-16 h-16 bg-white dark:bg-[#1a1a24] rounded-full flex items-center justify-center -mt-8 mx-auto border-4 border-white dark:border-[#1a1a24] shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#00457c] dark:text-[#ffe600]"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h3
                                    class="text-xl font-bold text-gray-900 dark:text-white mt-3 transition-all duration-500"
                                    :class="isCardsCompact ? 'mb-3' : 'mb-2'"
                                >
                                    Custom Donation
                                </h3>

                                <!-- Nội dung phụ: Tự động thu gọn đồng bộ với 2 thẻ bên cạnh -->
                                <div
                                    class="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    :class="isCardsCompact ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-6'"
                                >
                                    <div class="overflow-hidden">
                                        <p class="text-sm text-gray-500 dark:text-gray-400 min-h-[60px] leading-relaxed">
                                            Our only monetary donation method. Scan our official PayPal QR code to fuel new 3D asset packs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 transition-all duration-500" :class="isCardsCompact ? 'pb-5' : 'pb-8'">
                            <button
                                type="button"
                                @click="showPaypalQrModal = true"
                                class="w-full bg-[#00457c] hover:bg-[#003159] active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 select-none">
                                <span>📱</span>
                                <span>Donate via PayPal QR</span>
                            </button>
                        </div>
                    </div>

                </div>

                <!-- =========================================================
                     3. THANH THÔNG BÁO CẢM ƠN (HIỂN THỊ TỐI ĐA 10S - VÒNG KHÉP KÍN)
                     ========================================================= -->
                <div class="mt-5">
                    <transition name="banner-collapse">
                        <div
                            v-if="thankYouBanner.visible"
                            class="relative rounded-2xl p-5 sm:p-6 border-2 shadow-2xl transition-all duration-200 overflow-hidden"
                            :class="[
                                activeBannerType === 'follow'
                                    ? 'bg-sky-50 dark:bg-[#112233] border-[#29abe0] text-slate-900 dark:text-white'
                                    : 'bg-rose-50 dark:bg-[#25161b] border-[#f96854] text-slate-900 dark:text-white',
                                isPulseAnimating ? 'scale-[1.015]' : 'scale-100'
                            ]"
                        >
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div class="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                                    <!-- Icon cảm ơn nảy nhẹ mỗi khi bấm liên tục -->
                                    <div
                                        class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 shadow-inner transition-transform duration-150"
                                        :class="[
                                            activeBannerType === 'follow'
                                                ? 'bg-[#29abe0]/20 border-[#29abe0] text-[#29abe0]'
                                                : 'bg-[#f96854]/20 border-[#f96854] text-[#f96854]',
                                            isPulseAnimating ? 'scale-115 rotate-6' : 'scale-100 rotate-0'
                                        ]"
                                    >
                                        {{ thankYouBanner.icon }}
                                    </div>

                                    <div class="space-y-1">
                                        <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                            <span
                                                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                                                :class="activeBannerType === 'follow' ? 'bg-[#29abe0]' : 'bg-[#f96854]'"
                                            >
                                                {{ thankYouBanner.badge }}
                                            </span>
                                            <span class="text-[11px] font-mono font-bold text-gray-400 dark:text-slate-400">
                                                ⏳ Tự đóng sau {{ Math.ceil(remainingMs / 1000) }}s
                                            </span>
                                        </div>

                                        <h4 class="text-base sm:text-lg font-black leading-snug">
                                            {{ thankYouBanner.title }}
                                        </h4>

                                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                            {{ thankYouBanner.message }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Cụm nút phụ bên phải thanh cảm ơn -->
                                <div class="flex items-center gap-2.5 shrink-0 select-none">
                                    <router-link
                                        v-if="activeBannerType === 'follow'"
                                        to="/assets"
                                        class="px-4 py-2.5 rounded-xl bg-[#29abe0] hover:bg-[#208ab5] text-white text-xs font-black shadow transition-colors whitespace-nowrap"
                                    >
                                        Khám phá Kho 3D →
                                    </router-link>
                                    <button
                                        v-else
                                        type="button"
                                        @click="handleTriggerManaClick"
                                        class="px-4 py-2.5 rounded-xl bg-[#f96854] hover:bg-[#d85544] text-white text-xs font-black shadow transition-transform active:scale-90 cursor-pointer whitespace-nowrap"
                                    >
                                        ⚡ Bơm thêm +1 Mana
                                    </button>

                                    <button
                                        type="button"
                                        @click="closeThankYouLoop"
                                        class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white text-xs font-black flex items-center justify-center transition-colors cursor-pointer"
                                        title="Đóng ngay & Hiện lại thanh Menu"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <!-- Thanh tiến trình đếm ngược 10 giây nằm sát đáy Banner -->
                            <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 overflow-hidden">
                                <div
                                    class="h-full transition-none"
                                    :class="activeBannerType === 'follow' ? 'bg-[#29abe0]' : 'bg-[#f96854]'"
                                    :style="{ width: `${(remainingMs / BANNER_LIFETIME_MS) * 100}%` }"
                                ></div>
                            </div>
                        </div>
                    </transition>
                </div>

            </div>
        </div>

        <!-- ==========================================
             4. POPUP HIỂN THỊ MÃ QR PAYPAL (CHO THẺ SỐ 3)
             ========================================== -->
        <PaypalQrModal
            :show="showPaypalQrModal"
            paypal-email="cutemagic15081998@gmail.com"
            paypal-link="https://www.paypal.com/"
            @close="showPaypalQrModal = false"
        />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '../../../components/base/ThemeToggle.vue'
import DonateButton from '../../../components/base/DonateButton.vue'
import BackButton from '../../../components/base/BackButton.vue'
import HomeButton from '../../../components/base/HomeButton.vue'
import PaypalQrModal from '../../../components/donate/PaypalQrModal.vue'
import { pushActivityNotificationLog } from '../../../services/activityLogService'
import { playActivityNotificationSound } from '../../../services/soundService'

const FOLLOW_STORAGE_KEY = 'cmg_donate_followed_store'
const MANA_STORAGE_KEY = 'cmg_donate_mana_clicks'
const BANNER_LIFETIME_MS = 10000 // Thời gian hiển thị tối đa: 10 giây (10.000ms)

const isScrolled = ref(false)
const hasLeftFadedIntro = ref(false) // Trạng thái left-fade của khối "Your support matters."
const showPaypalQrModal = ref(false)
const cardsSectionRef = ref(null)

const hasFollowed = ref(localStorage.getItem(FOLLOW_STORAGE_KEY) === 'true')
const manaClicks = ref(Number(localStorage.getItem(MANA_STORAGE_KEY) || 0))
const activeBannerType = ref('follow')

// Trạng thái nảy nhẹ (Pulse) khi người dùng click liên tục ở tốc độ cao
const isPulseAnimating = ref(false)
const isPulseAnimatingStar = ref(false)
const isPulseAnimatingHeart = ref(false)
let pulseTimer = null

// Trạng thái Banner & Bộ đếm vòng đời 10 giây
const thankYouBanner = ref({
    visible: false,
    icon: '💙',
    badge: 'Thank You',
    title: '',
    message: ''
})

// Khi thankYouBanner.visible === true -> Ẩn luôn thanh Menu trên cùng & thu gọn mô tả phụ của 3 thẻ
const isCardsCompact = computed(() => thankYouBanner.value.visible)

const remainingMs = ref(BANNER_LIFETIME_MS)
let countdownInterval = null
let lastClickTimestamp = 0

// Danh sách câu cảm ơn sinh động khi người dùng bấm "Support by Click"
const MANA_THANK_YOU_MESSAGES = [
    'Năng lượng đã truyền tới Blender 5! Các đỉnh Vertex và lưới Low-poly đang được dựng nhanh gấp đôi nhờ sự cổ vũ của bạn!',
    'Cảm ơn cú click đầy nhiệt huyết! Một tách cà phê tinh thần vừa được tiếp thêm vào quá trình vẽ Color Atlas 4K.',
    'Sức mạnh tinh thần +100! Những hòn đảo bay trong dự án Grand Archipelago vừa sáng bừng lên nhờ bạn!',
    'Tuyệt vời! Mỗi cú click của bạn là động lực to lớn để Cute Magic tiếp tục ra mắt thêm nhiều gói Free Starter Pack cho cộng đồng.',
    'Đã nhận tín hiệu khích lệ! Shader URP hôm nay biên dịch mượt mà 0 lỗi nhờ năng lượng tích cực từ bạn!'
]

/**
 * Kích hoạt hoặc Reset chu kỳ 10 giây (An toàn tuyệt đối khi người dùng click liên tục):
 * - Ẩn tạm thời thanh Menu trên cùng + Left-fade tiêu đề lớn (nếu chưa ẩn)
 * - Thu gọn nội dung phụ của 3 thẻ
 * - Đếm ngược đúng 10s tính từ lần click CUỐI CÙNG rồi tự đóng & mở lại Menu + nội dung phụ của 3 thẻ
 */
const startOrResetTenSecondLoop = (type) => {
    // 1. Đảm bảo khối tiêu đề lớn cũng được thu gọn để nhường trọn màn hình cho 3 thẻ & thanh cảm ơn
    if (!hasLeftFadedIntro.value) {
        hasLeftFadedIntro.value = true
    }

    // 2. Hiệu ứng nảy nhẹ tại chỗ (Không làm unmount DOM)
    clearTimeout(pulseTimer)
    isPulseAnimating.value = true

    if (type == 'Follow') {
        isPulseAnimatingStar.value = true
    } else if (type == 'LoveStore')
    {
        isPulseAnimatingHeart.value = true
    }

    pulseTimer = setTimeout(() => {
        isPulseAnimating.value = false
        isPulseAnimatingStar.value = false
        isPulseAnimatingHeart.value = false
    }, 160)

    // 3. Nếu đây là lần mở đầu tiên của chu kỳ -> Đưa khung lên sát đỉnh màn hình vì Menu đã ẩn
    const wasAlreadyVisible = thankYouBanner.value.visible
    thankYouBanner.value.visible = true

    if (!wasAlreadyVisible) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 4. Reset thời gian đếm ngược về tròn 10.000ms (10 giây)
    remainingMs.value = BANNER_LIFETIME_MS
    lastClickTimestamp = performance.now()

    if (!countdownInterval) {
        countdownInterval = setInterval(() => {
            const elapsed = performance.now() - lastClickTimestamp
            const left = Math.max(0, BANNER_LIFETIME_MS - elapsed)
            remainingMs.value = left

            if (left <= 0) {
                closeThankYouLoop()
            }
        }, 50)
    }
}

/**
 * Khép kín vòng đời: Ẩn thanh thông báo, Mở lại thanh Menu trên cùng & Mở lại mô tả phụ của 3 thẻ
 */
const closeThankYouLoop = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
    thankYouBanner.value.visible = false
    remainingMs.value = 0
}

// Xử lý khi bấm Nút 1 (Follow & Love Store)
const handleTriggerFollowSupport = () => {
    hasFollowed.value = true
    localStorage.setItem(FOLLOW_STORAGE_KEY, 'true')
    activeBannerType.value = 'follow'

    playActivityNotificationSound('LIKE_ASSET')

    thankYouBanner.value.icon = '🌟'
    thankYouBanner.value.badge = 'Companion Support'
    thankYouBanner.value.title = 'Cảm ơn bạn đã luôn quan tâm và đồng hành cùng Cute Magic!'
    thankYouBanner.value.message = 'Sự theo dõi và ủng hộ của bạn dành cho các bộ 3D Asset chính là nền tảng quý giá nhất giúp cửa hàng không ngừng phát triển. Đừng quên thả tim (❤️) cho các gói sản phẩm bạn yêu thích nhé!'


    startOrResetTenSecondLoop('Follow')

    pushActivityNotificationLog('LIKE_ASSET', {
        path: '/donate',
        assetTitle: '[Donate Page] Pledged Store Follow & Support 🌟'
    }).catch(() => {})
}

// Xử lý khi bấm Nút 2 (Spiritual Mana Boost - Support by Click, hỗ trợ bấm liên thanh)
const handleTriggerManaClick = () => {
    manaClicks.value++
    localStorage.setItem(MANA_STORAGE_KEY, String(manaClicks.value))
    activeBannerType.value = 'mana'

    playActivityNotificationSound('LIKE_ASSET')

    const msgIndex = (manaClicks.value - 1) % MANA_THANK_YOU_MESSAGES.length
    thankYouBanner.value.icon = '🔥'
    thankYouBanner.value.badge = `Mana Combo x${manaClicks.value}`
    thankYouBanner.value.title = `Cảm ơn bạn đã tiếp thêm +${manaClicks.value} Sức mạnh Tinh thần!`
    thankYouBanner.value.message = MANA_THANK_YOU_MESSAGES[msgIndex]

    startOrResetTenSecondLoop('LoveStore')

    // Chỉ đẩy log lên Firebase ở lần đầu và mỗi bội số của 10 để chống nghẽn mạng khi bấm nhanh
    if (manaClicks.value === 1 || manaClicks.value % 10 === 0) {
        pushActivityNotificationLog('LIKE_ASSET', {
            path: '/donate',
            assetTitle: `[Donate Page] Sent +${manaClicks.value} Spiritual Mana Boost 🔥`
        }).catch(() => {})
    }
}

// Khôi phục lại phần giới thiệu nếu người dùng bấm nút "ℹ️ Your support matters" trên thanh Breadcrumb
const restoreIntroHeader = () => {
    closeThankYouLoop()
    hasLeftFadedIntro.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lắng nghe sự kiện cuộn: Khi người dùng cuộn xuống lần đầu tiên -> Left-fade khối "Your support matters."
const handleScroll = () => {
    const currentY = window.scrollY
    isScrolled.value = currentY > 15

    if (currentY > 12 && !hasLeftFadedIntro.value) {
        hasLeftFadedIntro.value = true
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (countdownInterval) clearInterval(countdownInterval)
    if (pulseTimer) clearTimeout(pulseTimer)
})
</script>

<style scoped>
.banner-collapse-enter-active,
.banner-collapse-leave-active {
    transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    max-height: 260px;
}
.banner-collapse-enter-from,
.banner-collapse-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(16px);
}
</style>
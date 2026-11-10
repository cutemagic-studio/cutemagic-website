<template>
    <div class="min-h-screen pt-0 pb-24 bg-gray-50 dark:bg-[#0b0e14] transition-colors duration-300 font-sans">

        <!-- ==========================================
             1. TOP BREADCRUMB / NAVIGATION BAR
             (Auto-slides up & collapses height to 0 during the 10s thank-you loop)
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
                    <!-- Breadcrumb Path -->
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
                    <!-- Quick button to restore the intro text if it was left-faded -->
                    <button
                        v-if="hasLeftFadedIntro"
                        type="button"
                        @click="restoreIntroHeader"
                        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                        title="Show introduction again"
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
             2. MAIN DONATE CONTENT
             (Automatically reduces top padding when menu is hidden so the banner fits in viewport)
             ========================================== -->
        <div
            class="max-w-7xl mx-auto px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="isCardsCompact ? 'pt-4' : (hasLeftFadedIntro ? 'pt-8' : 'pt-14')"
        >

            <div class="max-w-5xl mx-auto">

                <!-- =========================================================
                     HERO INTRO TEXT (LEFT-FADES ON FIRST SCROLL DOWN)
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
                     3 SUPPORT CARDS (AUTO-COLLAPSES SUBTEXT FOR 10S)
                     ========================================================= -->
                <div ref="cardsSectionRef" class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    <!-- CARD 1: FOLLOW & LOVE STORE (Teal) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                        :class="thankYouBanner.visible && activeBannerType === 'follow'
                            ? 'border-[#29abe0] ring-4 ring-[#29abe0]/20'
                            : 'border-gray-100 dark:border-gray-800'"
                    >
                        <div>
                            <!-- Top Color Strip -->
                            <div
                                class="bg-[#a6e6e2] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/15 text-slate-900 text-[10px] font-black uppercase tracking-wider transition-opacity duration-300"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    Free • Community
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Floating Star Icon -->
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

                                <!-- Sub-description: Auto-collapses for 10s when banner is active -->
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

                    <!-- CARD 2: SPIRITUAL MANA BOOST - SUPPORT BY CLICK (Green) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                        :class="thankYouBanner.visible && activeBannerType === 'mana'
                            ? 'border-[#f96854] ring-4 ring-[#f96854]/20'
                            : 'border-gray-100 dark:border-gray-800'"
                    >
                        <div>
                            <!-- Top Color Strip -->
                            <div
                                class="bg-[#a7e4a9] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/15 text-slate-900 text-[10px] font-black uppercase tracking-wider transition-opacity duration-300"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    1-Click Spirit Boost
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Floating Heart Icon -->
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

                                <!-- Sub-description: Auto-collapses for 10s when banner is active -->
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

                    <!-- CARD 3: CUSTOM DONATION VIA PAYPAL QR (Peach - Only monetary option) -->
                    <div
                        class="bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-800 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between">
                        <div>
                            <!-- Top Color Strip -->
                            <div
                                class="bg-[#f8cd9f] w-full relative overflow-hidden transition-all duration-500"
                                :class="isCardsCompact ? 'h-14' : 'h-24'"
                            >
                                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-900/20 text-amber-950 text-[10px] font-black uppercase tracking-wider transition-opacity duration-300"
                                    :class="[isCardsCompact ? 'opacity-0' : '']">
                                    QR Scan • Monetary
                                </span>
                            </div>

                            <div class="px-6 relative text-center">
                                <!-- Floating Bolt Icon -->
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

                                <!-- Sub-description: Auto-collapses in sync with the other two cards -->
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
                     3. THANK YOU BANNER (10S MAX LIFETIME - CLOSED LOOP)
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
                                    <!-- Pulsing Thank You Icon -->
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
                                                ⏳ Auto-closing in {{ Math.ceil(remainingMs / 1000) }}s
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

                                <!-- Action Buttons on the Right of Banner -->
                                <div class="flex items-center gap-2.5 shrink-0 select-none">
                                    <router-link
                                        v-if="activeBannerType === 'follow'"
                                        to="/assets"
                                        class="px-4 py-2.5 rounded-xl bg-[#29abe0] hover:bg-[#208ab5] text-white text-xs font-black shadow transition-colors whitespace-nowrap"
                                    >
                                        Explore 3D Library →
                                    </router-link>
                                    <button
                                        v-else
                                        type="button"
                                        @click="handleTriggerManaClick"
                                        class="px-4 py-2.5 rounded-xl bg-[#f96854] hover:bg-[#d85544] text-white text-xs font-black shadow transition-transform active:scale-90 cursor-pointer whitespace-nowrap"
                                    >
                                        ⚡ Boost +1 More Mana
                                    </button>

                                    <button
                                        type="button"
                                        @click="closeThankYouLoop"
                                        class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white text-xs font-black flex items-center justify-center transition-colors cursor-pointer"
                                        title="Close now & Restore menu"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <!-- 10-Second Countdown Progress Bar at the bottom of the Banner -->
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
             4. PAYPAL QR CODE POPUP MODAL (FOR CARD 3)
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
const BANNER_LIFETIME_MS = 10000 // Max display duration: 10 seconds (10,000ms)

const isScrolled = ref(false)
const hasLeftFadedIntro = ref(false)
const showPaypalQrModal = ref(false)
const cardsSectionRef = ref(null)

const hasFollowed = ref(localStorage.getItem(FOLLOW_STORAGE_KEY) === 'true')
const manaClicks = ref(Number(localStorage.getItem(MANA_STORAGE_KEY) || 0))
const activeBannerType = ref('follow')

// Pulse animation states for rapid clicking
const isPulseAnimating = ref(false)
const isPulseAnimatingStar = ref(false)
const isPulseAnimatingHeart = ref(false)
let pulseTimer = null

// Thank You Banner & 10-second loop state
const thankYouBanner = ref({
    visible: false,
    icon: '💙',
    badge: 'Thank You',
    title: '',
    message: ''
})

// When thankYouBanner.visible === true -> Hide top menu & collapse card sub-descriptions
const isCardsCompact = computed(() => thankYouBanner.value.visible)

const remainingMs = ref(BANNER_LIFETIME_MS)
let countdownInterval = null
let lastClickTimestamp = 0

// =========================================================================
// 55 VIVID ENGLISH THANK-YOU MESSAGES (5 ORIGINAL TRANSLATED + 50 NEW)
// =========================================================================
const MANA_THANK_YOU_MESSAGES = [
    // 1 - 5: Original 5 messages translated to English
    'Energy transmitted straight to Blender 5! Vertices and low-poly meshes are being modeled twice as fast thanks to your cheer!',
    'Thank you for that passionate click! A virtual cup of coffee has just been poured into our 4K Color Atlas painting session.',
    'Spiritual Power +100! The floating islands in our Grand Archipelago project just lit up brighter because of you!',
    'Awesome! Every click from you is a massive motivation for Cute Magic to release even more Free Starter Packs for the community.',
    'Encouragement signal received! Our URP Shaders compiled with 0 errors today thanks to your positive energy!',

    // 6 - 55: 50 new creative 3D / Game Dev thank-you messages
    'Critical Hit of Inspiration! All flipped normals in our current 3D scene just aligned themselves perfectly!',
    'Mana received! Our pivot points are now snapping to the world origin with 100% mathematical precision.',
    'Your click just cast a "Zero N-Gon" blessing over our hard-surface topology workflow!',
    'Boom! +1 Creative Stamina! Late-night sculpting sessions feel like a breeze with you cheering us on.',
    'UV islands are packing themselves with zero wasted space today—all thanks to your spiritual boost!',
    'A wave of pure indie dev spirit just swept through the studio. The next 3D prop pack is going to be legendary!',
    'Polycount optimized, silhouette sharpened, and morale maxed out! Thank you for fueling the forge!',
    'Your support just granted our 3D viewport a permanent +120 FPS smoothness buff!',
    'That click echoed through the studio like a level-up chime! We are crafting new stylized worlds for you right now.',
    'No overlapping UVs, no broken prefabs, just pure creative flow—powered by your awesome click!',
    'You just recharged our vertex-painting brush with vibrant new gradients! Thank you, fellow creator!',
    'The bevels are cleaner, the edge loops are tighter, and our coffee is hotter because of your support!',
    'Another spark added to the Cute Magic furnace! New stylized trees and cozy props are taking shape.',
    'Your spiritual mana just turned a complex 10,000-tri mesh into a clean, game-ready low-poly masterpiece!',
    'Unity prefab sync completed in 0.01 seconds! Your positive vibes are making our custom tools run faster.',
    'Thank you! Your click just unlocked a secret chest of motivation for our upcoming Monster Evolution lineup!',
    'Ambient occlusion baked to perfection! Your encouragement brings depth and warmth to everything we build.',
    'The studio creative battery is now overcharged at 200%! Let us build more unforgettable game worlds together.',
    'Every click is a high-five to our 3D artists. Thank you for keeping the indie spirit alive and thriving!',
    'Subdivision surface applied to our happiness! Your support makes every hour at the workstation worth it.',
    'Zero gimbal lock, zero crashes, 100% pure passion—thank you for sending good fortune to our pipeline!',
    'Your mana boost just summoned a gentle breeze across our stylized floating islands. Thank you for visiting!',
    'A true legend just clicked the button! May your own game projects run at 240 FPS with zero bugs!',
    'Texture seams have vanished into thin air! Your support keeps our stylized art seamless and vibrant.',
    'LOD0, LOD1, LOD2—our gratitude for you renders at maximum detail from any distance!',
    'You just fueled another round of late-night R&D for our custom Blender Python add-ons. Thank you!',
    'Lightmapping completed in record time! Your click literally brightened up our entire 3D scene.',
    'From a single cube to a whole archipelago—supporters like you make every polygon meaningful.',
    'Rigging bones aligned without a single weight-painting headache! Your click carries real magic.',
    'Draw calls reduced to 1, motivation multiplied by 1,000! Thank you for powering up Cute Magic!',
    'Your click just planted a new stylized crystal tree in our virtual world. Thank you for helping it grow!',
    'The viewport grid feels extra inspiring today knowing awesome developers like you are cheering for us.',
    'Mana surge detected! Our concept sketches are transforming into 3D blockouts at lightning speed!',
    'May your shaders never turn magenta! Thank you for sending such wonderful energy to our studio.',
    'One small click for you, one giant leap for our next modular dungeon and village expansion!',
    'Vertex colors are popping with extra saturation today—all thanks to your burst of encouragement!',
    'Your support is the best modifier in our stack. Thank you for making Cute Magic stronger every day!',
    'FBX exported cleanly on the very first try! We knew your click brought lucky developer karma!',
    'The forge is roaring! New stylized weapons, props, and environments are being hammered out as we speak.',
    'Thank you for being part of our journey! Every click reminds us why we love crafting 3D assets for you.',
    'QuadriFlow and remeshing gods are smiling upon us today because of your generous spirit boost!',
    'You just buffed our studio with "+100 Focus"! Time to polish every single asset until it shines.',
    'Whether it is 1 click or 100 clicks, your presence here means the world to an indie asset creator!',
    'Color palette locked in, silhouette perfected, and heart full of gratitude—thank you for clicking!',
    'Your mana boost just turned a blank Blender scene into a playground of new game ideas!',
    'No corporate sponsors, just passionate creators supporting each other. Thank you for standing with us!',
    'Collision meshes generated flawlessly! Your support keeps our assets rock-solid and production-ready.',
    'A golden star of motivation just dropped into our workspace. Thank you for keeping our creativity burning!',
    'Your click is the ultimate shortcut key to our happiness. Thank you for boosting Cute Magic Studio!',
    'Maximum Mana Combo achieved! You are officially a legendary patron of the Cute Magic 3D Forge!'
]

/**
 * Starts or resets the 10-second loop (100% flicker-free during rapid clicking)
 */
const startOrResetTenSecondLoop = (type) => {
    if (!hasLeftFadedIntro.value) {
        hasLeftFadedIntro.value = true
    }

    clearTimeout(pulseTimer)
    isPulseAnimating.value = true

    if (type === 'Follow') {
        isPulseAnimatingStar.value = true
    } else if (type === 'LoveStore') {
        isPulseAnimatingHeart.value = true
    }

    pulseTimer = setTimeout(() => {
        isPulseAnimating.value = false
        isPulseAnimatingStar.value = false
        isPulseAnimatingHeart.value = false
    }, 160)

    const wasAlreadyVisible = thankYouBanner.value.visible
    thankYouBanner.value.visible = true

    if (!wasAlreadyVisible) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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
 * Closes the loop: Hides thank-you banner, restores top menu & expands card sub-descriptions
 */
const closeThankYouLoop = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
    thankYouBanner.value.visible = false
    remainingMs.value = 0
}

// Card 1 Handler (Follow & Love Store)
const handleTriggerFollowSupport = () => {
    hasFollowed.value = true
    localStorage.setItem(FOLLOW_STORAGE_KEY, 'true')
    activeBannerType.value = 'follow'

    playActivityNotificationSound('LIKE_ASSET')

    thankYouBanner.value.icon = '🌟'
    thankYouBanner.value.badge = 'Companion Support'
    thankYouBanner.value.title = 'Thank you for following and standing by Cute Magic!'
    thankYouBanner.value.message = "Your ongoing attention and love for our 3D asset packs are the foundation that keeps our studio growing. Don't forget to drop a heart (❤️) on your favorite packs!"

    startOrResetTenSecondLoop('Follow')

    pushActivityNotificationLog('LIKE_ASSET', {
        path: '/donate',
        assetTitle: '[Donate Page] Pledged Store Follow & Support 🌟'
    }).catch(() => {})
}

// Card 2 Handler (Spiritual Mana Boost - Support by Click)
const handleTriggerManaClick = () => {
    manaClicks.value++
    localStorage.setItem(MANA_STORAGE_KEY, String(manaClicks.value))
    activeBannerType.value = 'mana'

    playActivityNotificationSound('LIKE_ASSET')

    const msgIndex = (manaClicks.value - 1) % MANA_THANK_YOU_MESSAGES.length
    thankYouBanner.value.icon = '🔥'
    thankYouBanner.value.badge = `Mana Combo x${manaClicks.value}`
    thankYouBanner.value.title = `Thank you for sending +${manaClicks.value} Spiritual Mana Power!`
    thankYouBanner.value.message = MANA_THANK_YOU_MESSAGES[msgIndex]

    startOrResetTenSecondLoop('LoveStore')

    if (manaClicks.value === 1 || manaClicks.value % 10 === 0) {
        pushActivityNotificationLog('LIKE_ASSET', {
            path: '/donate',
            assetTitle: `[Donate Page] Sent +${manaClicks.value} Spiritual Mana Boost 🔥`
        }).catch(() => {})
    }
}

// Restores the intro header when clicking "ℹ️ Your support matters"
const restoreIntroHeader = () => {
    closeThankYouLoop()
    hasLeftFadedIntro.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// First scroll down triggers left-fade on the intro block
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
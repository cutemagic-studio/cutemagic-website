<!-- src/components/showcase/HeroSection.vue -->
<template>
  <section id="HeroSection" class="relative w-full min-h-screen flex items-center pt-28 pb-16 lg:pt-24">

    <div class="max-w-7xl mx-auto px-6 w-full relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
        
        <!-- ======================================================= -->
        <!-- CỘT TRÁI (VĂN BẢN, NÚT BẤM & CHỈ SỐ TÍN NHIỆM)          -->
        <!-- ======================================================= -->
        <div class="w-full lg:w-[50%] text-center lg:text-left space-y-8 animate-fade-in-up">
          
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200 dark:shadow-none border-2 border-transparent dark:border-blue-500/30">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Official Asset Store Publisher
          </div>

          <h1 class="text-4xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight transition-colors">
            Elevate <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Your Game World.
            </span>
          </h1>

          <p class="text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium transition-colors">
            Explore our curated collection of professional 3D assets and UI kits. Production-ready, zero-AI, and built for excellence.
          </p>

          <!-- Cụm Nút Hành Động -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <BaseButton 
              @click="goToExploreStore"
              label="Explore Store" 
              variant="primary" 
              size="lg" 
              class="w-full sm:w-auto shadow-2xl shadow-blue-300/50 dark:shadow-blue-900/30 scale-105 cursor-pointer" 
            />
            <BaseButton 
              @click="scrollToWhy"
              label="Read More" 
              variant="outline" 
              size="lg" 
              class="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer" 
            />
          </div>

          <!-- Dải Avatar & Thống kê thực tế từ Store -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 w-fit mx-auto lg:mx-0 transition-colors">
            <div class="flex -space-x-3">
              <div 
                v-for="i in 3" 
                :key="i" 
                class="w-9 h-9 rounded-full border-2 border-[#1C1C1C] dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-sm transition-colors relative z-[1] hover:z-10 hover:-translate-y-1 duration-200 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300"
              >
                {{ i === 1 ? '🎮' : i === 2 ? '🎨' : '⚡' }}
              </div>
            </div>
            <div class="text-left">
              <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest transition-colors">
                Trusted by <span class="text-blue-600 dark:text-blue-500 font-black">2,000+</span> Developers.
              </p>
              <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                {{ storeStats.packs }} Asset Packs • {{ storeStats.models.toLocaleString() }}+ 3D Models Ready
              </p>
            </div>
          </div>

        </div>

        <!-- ======================================================= -->
        <!-- CỘT PHẢI - KHUNG A (GALLERY CÁC PACK NỔI BẬT)           -->
        <!-- ======================================================= -->
        <div class="w-full lg:w-[50%] relative group pt-6 lg:pt-0 z-10 px-2 sm:px-4">
          
          <!-- Nhúng Component Gallery Trưng bày các Pack Nổi bật (Có nút < và > ở 2 bên) -->
          <HeroFeaturedGallery />

          <!-- [GLASSMORPHISM] Thẻ nổi (Floating Card: Verified By Unity Partner) -->
          <div class="mt-4 -bottom-5 -left-2 sm:-left-6 bg-white/90 dark:bg-[#161a23]/90 backdrop-blur-xl px-4 py-3.5 rounded-2xl shadow-2xl border-2 border-[#1C1C1C] dark:border-white/15 hidden sm:flex items-center gap-3.5 animate-float transition-colors z-30 pointer-events-none">
            <div class="w-10 h-10 bg-blue-600 border-2 border-[#1C1C1C] dark:border-transparent rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase leading-none mb-1">
                Verified By
              </p>
              <p class="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight">
                Unity Partner
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetStore } from '../../stores/useAssetStore'

import BaseButton from '../base/BaseButton.vue' 
import HeroFeaturedGallery from './hero/HeroFeaturedGallery.vue'

const router = useRouter()
const assetStore = useAssetStore()

const storeStats = computed(() => assetStore.getStatistics)

// Bấm "Explore Store" -> Chuyển sang trang Thư viện Asset (/assets)
const goToExploreStore = () => {
  router.push({ path: '/assets' })
}

// Bấm "Read More" -> Cuộn mượt xuống WhyChooseUsSection
const scrollToWhy = () => {
  const section = document.getElementById('WhyChooseUsSection') || document.getElementById('why-us')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
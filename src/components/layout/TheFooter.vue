<!-- src/components/layout/TheFooter.vue -->
<template>
  <footer class="relative bg-white dark:bg-[#0b0e14] text-slate-600 dark:text-slate-400 border-t-2 border-[#1C1C1C] dark:border-slate-800/80 transition-colors duration-300 font-sans select-none overflow-hidden">
    
    <!-- Dải màu trang trí đặc trưng trên đỉnh Footer -->
    <div class="h-1 w-full bg-gradient-to-r from-[#29abe0] via-[#ff005b] to-[#ffe600]"></div>

    <!-- Ánh sáng nền trang trí nhẹ trong chế độ Dark Mode -->
    <div class="hidden dark:block absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="hidden dark:block absolute -bottom-32 right-1/4 w-96 h-96 bg-[#ff005b]/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 pt-14 pb-10 relative z-10">
      
      <!-- LƯỚI NỘI DUNG CHÍNH (12 CỘT TRÊN DESKTOP) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200 dark:border-slate-800/80">
        
        <!-- CỘT 1 (5/12): THƯƠNG HIỆU CUTE MAGIC & NHÃN CÔNG NGHỆ -->
        <div class="lg:col-span-5 space-y-5">
          <router-link to="/" class="inline-flex items-center gap-3 group cursor-pointer">
            <div class="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white border-2 border-[#1C1C1C] dark:border-slate-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span class="text-xl">✨</span>
            </div>
            <div>
              <div class="text-2xl font-black tracking-tight leading-none">
                <span class="text-[#29abe0]">Cute</span><span class="text-slate-900 dark:text-white">Magic</span>
              </div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                3D Game Asset Forge
              </p>
            </div>
          </router-link>

          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md font-medium">
            <strong class="text-slate-900 dark:text-white">Elevate Your Game World.</strong> Crafting stylized low-poly 3D models, modular floating islands, and optimized URP shaders for indie developers and studios worldwide.
          </p>

          <!-- Các nhãn thông số kỹ thuật đặc trưng -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161a23] border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              🎨 Stylized Low-Poly
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161a23] border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ⚡ Unity URP Ready
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161a23] border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              🧊 Clean Topology
            </span>
          </div>
        </div>

        <!-- CỘT 2 (2/12): ĐIỀU HƯỚNG NHANH (QUICK LINKS) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-1.5 h-3.5 rounded-full bg-[#29abe0]"></span>
            Navigation
          </h4>
          <ul class="space-y-2.5 text-sm font-bold">
            <li>
              <router-link to="/" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors inline-flex items-center gap-1.5">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/assets" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors inline-flex items-center gap-1.5">
                Asset Library
              </router-link>
            </li>
            <li>
              <router-link to="/donate" class="hover:text-[#ff005b] transition-colors inline-flex items-center gap-1.5">
                <span>Donate</span>
                <span class="px-1.5 py-0.5 rounded-md bg-[#ff005b]/10 text-[#ff005b] border border-[#ff005b]/30 text-[9px] font-black uppercase">
                  +Mana
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- CỘT 3 (2/12): HỆ THỐNG CỬA HÀNG (MARKETPLACES) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-1.5 h-3.5 rounded-full bg-[#ffe600]"></span>
            Storefronts
          </h4>
          <ul class="space-y-2.5 text-sm font-bold">
            <li>
              <router-link to="/assets" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors">
                Unity Asset Store
              </router-link>
            </li>
            <li>
              <router-link to="/assets" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors">
                Fab Marketplace
              </router-link>
            </li>
            <li>
              <router-link to="/assets" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors">
                itch.io Store
              </router-link>
            </li>
            <li>
              <router-link to="/assets" class="hover:text-[#29abe0] dark:hover:text-[#ffe600] transition-colors">
                CGTrader
              </router-link>
            </li>
          </ul>
        </div>

        <!-- CỘT 4 (3/12): HỖ TRỢ KỸ THUẬT & KẾT NỐI -->
        <div class="lg:col-span-3 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-1.5 h-3.5 rounded-full bg-[#ff005b]"></span>
            Connect &amp; Support
          </h4>

          <!-- Hộp Copy nhanh Email hỗ trợ -->
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-[#161a23] border-2 border-slate-200 dark:border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Technical Support</span>
              <span v-if="copiedEmail" class="text-[10px] font-black text-emerald-500">✓ Copied!</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                {{ supportEmail }}
              </span>
              <button
                type="button"
                @click="copySupportEmail"
                class="px-2 py-1 rounded-lg bg-slate-900 dark:bg-[#ffe600] text-white dark:text-black hover:opacity-90 text-[10px] font-black uppercase shrink-0 cursor-pointer transition-opacity"
                title="Copy Support Email"
              >
                Copy
              </button>
            </div>
          </div>

          <!-- Cụm nút Mạng xã hội + Nút Ủng hộ Tinh thần -->
          <div class="flex items-center justify-between gap-2 pt-1">
            <div class="flex items-center gap-2">
              <!-- Facebook -->
              <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#161a23] border-2 border-slate-200 dark:border-slate-800 hover:border-[#29abe0] dark:hover:border-[#29abe0] text-slate-700 dark:text-slate-300 hover:text-[#29abe0] flex items-center justify-center font-black text-xs transition-all hover:-translate-y-0.5">
                FB
              </a>
              <!-- X / Twitter -->
              <a href="#" target="_blank" rel="noopener noreferrer" title="X (Twitter)"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#161a23] border-2 border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-black text-xs transition-all hover:-translate-y-0.5">
                X
              </a>
              <!-- YouTube -->
              <a href="#" target="_blank" rel="noopener noreferrer" title="YouTube Showcase"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#161a23] border-2 border-slate-200 dark:border-slate-800 hover:border-[#ff005b] dark:hover:border-[#ff005b] text-slate-700 dark:text-slate-300 hover:text-[#ff005b] flex items-center justify-center font-black text-xs transition-all hover:-translate-y-0.5">
                YT
              </a>
              <!-- GitHub -->
              <a href="#" target="_blank" rel="noopener noreferrer" title="GitHub"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#161a23] border-2 border-slate-200 dark:border-slate-800 hover:border-[#ffe600] dark:hover:border-[#ffe600] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-[#ffe600] flex items-center justify-center font-black text-xs transition-all hover:-translate-y-0.5">
                GH
              </a>

              <!-- Giữ nguyên các link test ẩn của dự án -->
              <!-- <a href="https://cutemagic-studio.github.io/cutemagic-website/favicon.svg" download>Tải Favicon</a> -->
              <!-- https://github.com/vantan-15081998/cmg_asset_drive/blob/main/test/env_123456/pack_01_test/pack_01_test.zip -->
              <!-- <a href="https://vantan-15081998.github.io/cmg_asset_drive/test/env_123456/pack_01_test/pack_01_test.zip" download>Tải Favicon</a> -->
            </div>

            <router-link
              to="/donate"
              class="px-3 py-2 rounded-xl bg-[#ffe600] hover:bg-[#f5dc00] text-black border-2 border-[#1C1C1C] text-[11px] font-black uppercase tracking-wider shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              🔥 Boost Mana
            </router-link>
          </div>
        </div>

      </div>

      <!-- THANH BẢN QUYỀN & TRẠNG THÁI DƯỚI CÙNG -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>&copy; {{ currentYear }} <strong class="text-slate-700 dark:text-slate-300">CuteMagic Studio</strong>. All rights reserved.</span>
        </div>

        <div class="flex items-center gap-4 text-[11px]">
          <router-link to="/assets" class="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            Free Starter Packs
          </router-link>
          <span>•</span>
          <router-link to="/donate" class="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            Support Us
          </router-link>
          <span>•</span>
          <span class="text-slate-400 dark:text-slate-600">Powered by Vue 3 &amp; Vite</span>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
const supportEmail = 'cutemagic15081998@gmail.com'
const copiedEmail = ref(false)

const copySupportEmail = () => {
  navigator.clipboard.writeText(supportEmail)
  copiedEmail.value = true
  setTimeout(() => {
    copiedEmail.value = false
  }, 2000)
}
</script>
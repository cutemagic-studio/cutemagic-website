<template>
  <section class="relative w-full min-h-screen flex items-center pt-28 pb-12 lg:pt-20">

    <div class="max-w-7xl mx-auto px-6 w-full relative z-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
        
        <!-- CỘT TRÁI (VĂN BẢN & NÚT BẤM) -->
        <div class="w-full md:w-[55%] text-center md:text-left space-y-8 animate-fade-in-up">
          
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

          <p class="text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium transition-colors">
            Explore our curated collection of professional 3D assets and UI kits. Production-ready, zero-AI, and built for excellence.
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            
            <BaseButton 
              label="Explore Store" 
              variant="primary" 
              size="lg" 
              class="w-full sm:w-auto shadow-2xl shadow-blue-300/50 dark:shadow-blue-900/30 scale-105" 
            />
            <BaseButton 
              @click="scrollToWhy"
              label="Read More" 
              variant="outline" 
              size="lg" 
              class="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" 
            />
          </div>

          <div class="flex items-center justify-center md:justify-start gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 w-fit mx-auto md:mx-0 transition-colors">
            <div class="flex -space-x-3">
              <!-- [ĐÃ CẬP NHẬT] Đổi viền avatar thành đen 2px cho đồng bộ phong cách stroke cứng cáp -->
              <div v-for="i in 3" :key="i" class="w-9 h-9 rounded-full border-2 border-[#1C1C1C] dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-sm transition-colors relative z-[1] hover:z-10 hover:-translate-y-1 duration-200"></div>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest transition-colors">
              Trusted by <span class="text-blue-600 dark:text-blue-500">2,000+</span> Developers.
            </p>
          </div>
        </div>

        <!-- CỘT PHẢI (MOCKUP TRÌNH DUYỆT & ẢNH) -->
        <div class="w-full md:w-[45%] relative group pt-10 md:pt-0 z-10">
          
          <div class="absolute -inset-10 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 -z-10"></div>

          <!-- [GLASSMORPHISM] Cửa sổ trình duyệt -->
          <div class="relative bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border-2 border-[#1C1C1C] dark:border-white/10 overflow-hidden transform md:rotate-3 group-hover:rotate-0 transition-all duration-700">
            
            <!-- Thanh Tab Trình Duyệt -->
            <!-- Dùng viền dưới border-b-2 để tách biệt thanh tab và hình ảnh -->
            <div class="h-10 bg-white/40 dark:bg-black/20 border-b-2 border-[#1C1C1C] dark:border-white/10 flex items-center px-5 gap-2 transition-colors">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400 border border-[#1C1C1C]/20 dark:border-transparent"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-[#1C1C1C]/20 dark:border-transparent"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-400 border border-[#1C1C1C]/20 dark:border-transparent"></div>
              </div>
              <div class="ml-4 h-5 w-full max-w-[200px] bg-slate-200/50 dark:bg-slate-800/50 rounded-full flex items-center px-3 border border-slate-300/50 dark:border-slate-700/50 transition-colors">
                <div class="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full mr-2"></div>
                <div class="w-20 h-1.5 bg-slate-400/50 dark:bg-slate-500/50 rounded-full"></div>
              </div>
            </div>

            <!-- Khung Ảnh (Ảnh Store Preview) -->
            <div class="aspect-[4/3] bg-slate-100 dark:bg-black overflow-hidden relative">
              <img 
                :src="bannerUrl" 
                alt="Store Interface Preview"
                class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <!-- Thanh trạng thái phía dưới -->
            <div class="p-4 bg-white/50 dark:bg-black/20 border-t-2 border-[#1C1C1C] dark:border-white/10 flex justify-between items-center transition-colors">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter transition-colors">Store Live Now</span>
              </div>
              <span class="text-[10px] font-black text-blue-600 dark:text-blue-500 transition-colors">PUBLISHER ID: #9902</span>
            </div>
          </div>

          <!-- [GLASSMORPHISM] Thẻ nổi (Floating Card) -->
          <div class="absolute -bottom-6 -left-6 lg:-left-12 bg-white/80 dark:bg-[#161a23]/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl dark:shadow-none border-2 border-[#1C1C1C] dark:border-white/10 hidden sm:flex items-center gap-4 animate-float transition-colors">
            
            <div class="w-12 h-12 bg-blue-600 border-2 border-[#1C1C1C] dark:border-transparent rounded-xl flex items-center justify-center shadow-lg dark:shadow-none group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase leading-none transition-colors mb-1">Verified By</p>
              <p class="text-base font-black text-slate-900 dark:text-white transition-colors leading-none tracking-tight">Unity Partner</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
// 1. Import BaseButton (Nhớ thay đổi đường dẫn cho đúng với cấu trúc thư mục của bạn)
import BaseButton from '../base/BaseButton.vue' 

// 2. Khai báo hàm scrollToWhy nếu chưa có
const scrollToWhy = () => {
  const section = document.getElementById('why-us') // hoặc id component tương ứng
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
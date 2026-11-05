<template>
  <section id="ContactSection" class="py-12 pb-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-5xl mx-auto p-12 lg:p-16 text-center relative overflow-hidden transition-all duration-300
                  bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl">
        
        <!-- Hiệu ứng ánh sáng hắt góc bên trong thẻ -->
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <!-- Tiêu đề -->
          <h2 class="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
            Ready to Elevate Your Project?
          </h2>
          
          <!-- Mô tả -->
          <p class="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Join <span class="font-bold text-blue-600 dark:text-blue-400">2,000+</span> developers using our assets to accelerate their creative workflow.
          </p>
          
          <!-- Cụm Nút bấm -->
          <div class="flex flex-col sm:flex-row justify-center gap-5">
            
            <!-- Nút 1: Chuyển sang nền Tối (Light) / Trắng (Dark), khi hover thành Xanh dương -->
            <button 
              class="w-full sm:w-72 px-8 py-4 font-black rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1 cursor-pointer
                    bg-slate-900 text-white border-2 border-slate-900 
                    dark:bg-white dark:text-slate-900 dark:border-white
                    hover:bg-blue-600 hover:border-blue-600 hover:text-white
                    dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:hover:text-white"
              @click="window.open('LINK_STORE_CUA_BAN', '_blank')"
            >
              Browse Global Store
            </button>
            
            <!-- Nút 2: Nền kính trong suốt, khi hover thành Vàng/Amber -->
            <button 
              class="w-full sm:w-72 px-8 py-4 font-black rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1 cursor-pointer
                    bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white border-2 border-[#1C1C1C] dark:border-slate-600 
                    hover:bg-[#FFD700] hover:border-[#FFD700] hover:text-[#1C1C1C] 
                    dark:hover:bg-amber-400 dark:hover:border-amber-400 dark:hover:text-slate-900"
            >
              Join Official Discord
            </button>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Nếu bạn muốn dùng BaseButton sau này thì vẫn có thể import
import BaseButton from '../base/BaseButton.vue'
</script>

<style scoped>
/* Đồng bộ letter-spacing cho font-black */
h2 {
  letter-spacing: -0.04em;
}
</style>
<script setup>
import BaseButton from '../base/BaseButton.vue'

// Bạn có thể thay đổi link ảnh Shop của bạn tại đây
const shopImage = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000"

const scrollToWhy = () => {
  const element = document.getElementById('why-choose-us');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

</script>

<template>
  <section class="relative w-full h-screen min-h-[650px] flex items-center bg-white overflow-hidden pt-16 lg:pt-0">
    
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_30%,#eff6ff_0%,transparent_50%)]"></div>
      <div class="absolute -top-24 -right-24 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      <div class="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 w-full">
      <div class="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
        
        <div class="w-full md:w-[55%] text-center md:text-left space-y-8 animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Official Asset Store Publisher
          </div>

          <h1 class="text-4xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Elevate <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Your Game World.
            </span>
          </h1>

          <p class="text-base lg:text-lg text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            Explore our curated collection of professional 3D assets and UI kits. Production-ready, zero-AI, and built for excellence.
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <BaseButton 
              label="Explore Store" 
              variant="primary" 
              size="lg" 
              class="w-full sm:w-auto shadow-2xl shadow-blue-300/50 scale-105" 
            />
            <BaseButton 
            @click="scrollToWhy"
              label="Read More" 
              variant="outline" 
              size="lg" 
              class="w-full sm:w-auto" 
            />
          </div>

          <div class="flex items-center justify-center md:justify-start gap-4 pt-8 border-t border-gray-100 w-fit mx-auto md:mx-0">
            <div class="flex -space-x-3">
              <div v-for="i in 3" :key="i" class="w-9 h-9 rounded-full border-2 border-white bg-gray-200 shadow-sm"></div>
            </div>
            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              Trusted by <span class="text-blue-600">2,000+</span> Developers worldwide.
            </p>
          </div>
        </div>

        <div class="w-full md:w-[45%] relative group pt-10 md:pt-0">
          <div class="absolute -inset-10 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"></div>

          <div class="relative bg-white rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform md:rotate-3 group-hover:rotate-0 transition-all duration-700">
            
            <div class="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-5 gap-2">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              <div class="ml-4 h-5 w-full max-w-[200px] bg-gray-200/50 rounded-full flex items-center px-3">
                <div class="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                <div class="w-20 h-1.5 bg-gray-300/50 rounded-full"></div>
              </div>
            </div>

            <div class="aspect-[4/3] bg-gray-50 overflow-hidden relative">
              <img 
                :src="shopImage" 
                alt="Store Interface Preview"
                class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div class="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="p-4 bg-white flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Store Live Now</span>
              </div>
              <span class="text-[10px] font-black text-blue-600">PUBLISHER ID: #9902</span>
            </div>
          </div>

          <div class="absolute -bottom-6 -left-6 lg:-left-12 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 hidden sm:flex items-center gap-4 animate-float">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-gray-400 font-black uppercase leading-none">Verified By</p>
              <p class="text-base font-black text-gray-900">Unity Partner</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hiệu ứng xuất hiện mượt mà khi load trang */
.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hiệu ứng trôi nổi cho Badge */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Tinh chỉnh Responsive cho màn hình cực nhỏ */
@media (max-height: 700px) {
  section {
    height: auto;
    padding: 100px 0;
  }
}
</style>
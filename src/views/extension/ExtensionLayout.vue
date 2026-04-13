<template>
  <div class="h-screen flex bg-[#0b0e14] font-sans text-slate-300 overflow-hidden">
    
    <!-- <aside class="w-64 bg-[#11141b] border-r border-slate-800 p-6 flex flex-col h-full shrink-0 z-20">
      
      <div class="mb-10 px-2">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
          <h1 class="text-lg font-black text-white tracking-tight">CuteMagic</h1>
        </div>
        <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">ChromaForge Pro</p>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        
        <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Hệ thống</div>
        
        <router-link 
          to="/" 
          class="group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 mb-6 border border-transparent hover:border-slate-700/50"
        >
          <span class="text-lg transition-transform group-hover:scale-110">🏠</span>
          <span>Home</span>
        </router-link>

        <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Công cụ thiết kế</div>

        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="activeTab = tab" 
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200',
            activeTab.id === tab.id
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          ]"
        >
          <span class="text-lg">{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </nav>

      <div class="mt-auto pt-6 border-t border-slate-800/50">
        <div class="flex items-center gap-3 px-2">
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
            AD
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Administrator</p>
            <p class="text-xs font-black text-slate-200 truncate">Cute Magic</p>
          </div>
        </div>
      </div>
    </aside> -->

    <main class="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#0b0e14]">
      <!-- <div class="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12 min-h-full"> -->
        <div class="w-full mx-auto min-h-full">
        
        <transition name="fade-slide" mode="out-in">
          <component :is="activeTab.component" />
        </transition>
        
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
// Import component Palette Generator của bạn
import PaletteColorGenerator from './palette_color_generator/PaletteColorGenerator.vue'

// Danh sách các Tab (Có thể mở rộng thêm các công cụ khác sau này)
const tabs = [
  { 
    id: 'PaletteColorGenerator', 
    name: 'Palette Color', 
    icon: '🎨', 
    component: markRaw(PaletteColorGenerator) 
  },
]

// Tab mặc định
const activeTab = ref(tabs[0])
</script>

<style scoped>
/* Tùy chỉnh thanh cuộn để tiệp màu với Dark Mode */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Hiệu ứng chuyển cảnh giữa các tab mượt mà */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive: Thu nhỏ sidebar trên màn hình Laptop nhỏ hoặc Tablet */
@media (max-width: 1024px) {
  aside {
    width: 80px;
    padding: 1.5rem 0.75rem;
  }
  /* Ẩn các nhãn chữ, chỉ giữ lại Icon */
  aside h1, 
  aside p, 
  aside nav div, 
  aside span:last-child, 
  aside .truncate {
    display: none;
  }
  aside .px-2, aside nav a, aside nav button {
    justify-content: center;
  }
  aside nav button, aside nav a {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
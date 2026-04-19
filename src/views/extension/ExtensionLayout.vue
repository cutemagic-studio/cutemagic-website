<template>
  <div class="h-screen flex flex-col bg-[#0b0e14] font-sans text-slate-300 overflow-hidden">
    
    <header class="flex-shrink-0 bg-[#11141b] border-b border-slate-800 px-6 py-3">
      <div class="flex items-center gap-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all',
            activeTab.id === tab.id 
              ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/50' 
              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>
    </header>

    <main class="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#0b0e14]">
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
import PaletteColorGenerator from './palette_color_generator/PaletteColorGenerator.vue'
import PaletteExporter from './palette_color_generator/PaletteExporter.vue'

const tabs = [
  {
    id: 'PaletteColorGenerator',
    name: 'Palette Generator', // Đã sửa tên cho gọn
    icon: '🎨',
    component: markRaw(PaletteColorGenerator)
  },
  {
    id: 'PaletteExporter',
    name: 'Texture Exporter',
    icon: '🖼️',
    component: markRaw(PaletteExporter)
  },
]

const activeTab = ref(tabs[0])
</script>

<style scoped>
/* Các style của bạn giữ nguyên */
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
</style>
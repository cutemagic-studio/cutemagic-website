<!-- src/components/admin/tabs/user_tracker/components/VisitorDetailModal.vue -->
<template>
  <div 
    v-if="visitor" 
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" 
    @click.self="$emit('close')"
  >
    <div
    :class="[theme.ui.adminRoundedContainer]"
     class="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6">
      
      <!-- Modal Header -->
      <div class="flex items-start justify-between border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <img 
            v-if="visitor.flag" 
            :src="visitor.flag" 
            class="w-8 h-6 rounded border border-slate-200 object-cover" 
            referrerpolicy="no-referrer"
          />
          <div>
            <h3 class="text-lg font-black text-[#CFCFCF]">Hồ sơ IP: {{ visitor.ip }}</h3>
            <p class="text-xs font-bold text-slate-400">
              {{ visitor.city }}, {{ visitor.country }} • Mạng: {{ visitor.isp }}
            </p>
          </div>
        </div>
        <button 
          type="button"
          @click="$emit('close')" 
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 font-black text-sm cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Tóm tắt nhanh trong Modal -->
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-slate-50 p-3 rounded-2xl">
          <p class="text-[10px] font-black uppercase text-slate-400">Tổng số trang đã vào</p>
          <p class="text-xl font-black text-slate-800">{{ visitor.totalPageViews || 1 }}</p>
        </div>
        <div class="bg-indigo-50 p-3 rounded-2xl">
          <p class="text-[10px] font-black uppercase text-indigo-400">Asset Pack đã xem</p>
          <p class="text-xl font-black text-indigo-600">{{ visitor.uniqueAssetsViewedCount || 0 }}</p>
        </div>
        <div class="bg-emerald-50 p-3 rounded-2xl">
          <p class="text-[10px] font-black uppercase text-emerald-500">Download (Nay / Tổng)</p>
          <p class="text-xl font-black text-emerald-600">
            {{ downloadsToday }} / {{ visitor.totalDownloads || 0 }}
          </p>
        </div>
      </div>

      <!-- Danh sách các Asset Pack người này đã xem -->
      <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
          📦 Các Asset Pack đã xem ({{ (visitor.viewedAssets || []).length }})
        </h4>
        <div v-if="visitor.viewedAssets?.length" class="flex flex-wrap gap-2">
          <span 
            v-for="pack in visitor.viewedAssets" 
            :key="pack" 
            :class="[theme.ui.adminRoundedContainer]"
            class="px-3 py-1.5"
          >
            {{ pack }}
          </span>
        </div>
        <p v-else class="text-xs text-slate-400 italic">Chưa mở xem chi tiết Asset Pack nào.</p>
      </div>

      <!-- Danh sách các Asset Pack người này đã tải xuống -->
      <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
          ⬇️ Các Asset Pack đã Download ({{ (visitor.downloadedAssets || []).length }})
        </h4>
        <div v-if="visitor.downloadedAssets?.length" class="flex flex-wrap gap-2">
          <span 
            v-for="dl in visitor.downloadedAssets" 
            :key="dl" 
            class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
          >
            {{ dl }}
          </span>
        </div>
        <p v-else class="text-xs text-slate-400 italic">Chưa thực hiện lượt tải xuống nào.</p>
      </div>

      <!-- Danh sách các Đường dẫn URL người này đã đi qua -->
      <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
          🧭 Các trang đã truy cập ({{ (visitor.visitedPages || []).length }})
        </h4>
        <div class="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
          <div 
            v-for="(page, idx) in visitor.visitedPages" 
            :key="idx" 
            class="flex items-center gap-2"
          >
            <span class="text-slate-500">{{ idx + 1 }}.</span>
            <span class="text-emerald-400">{{ page }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

const props = defineProps({
  visitor: { type: Object, default: null },
  todayKey: { type: String, default: '' }
})

defineEmits(['close'])

const downloadsToday = computed(() => {
  if (!props.visitor?.downloadsByDate || !props.todayKey) return 0
  return props.visitor.downloadsByDate[props.todayKey] || 0
})
</script>
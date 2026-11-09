<!-- src/components/admin/tabs/user_tracker/components/VisitorFilterBar.vue -->
<template>
  <div :class="[theme.ui.adminRoundedContainer, 'space-y-4']">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <!-- Chuyển đổi giữa Hồ sơ IP duy nhất và Luồng sự kiện -->
      <div class="flex bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          @click="$emit('update:viewMode', 'visitors')"
          :class="viewMode === 'visitors' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          class="px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
        >
          👤 Hồ sơ Người dùng Duy nhất ({{ visitorsCount }})
        </button>
        <button 
          @click="$emit('update:viewMode', 'events')"
          :class="viewMode === 'events' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          class="px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
        >
          ⚡ Luồng Sự kiện Chi tiết ({{ eventsCount }})
        </button>
      </div>

      <!-- Bộ lọc sắp xếp nhanh cho bảng Visitors -->
      <div v-if="viewMode === 'visitors'" class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-400">Ưu tiên xếp theo:</span>
        <select 
          :value="sortBy" 
          @change="$emit('update:sortBy', $event.target.value)"
          class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none"
        >
          <option value="lastActive">Mới truy cập gần nhất</option>
          <option value="downloadsToday">Download nhiều nhất hôm nay</option>
          <option value="totalDownloads">Tổng Download cao nhất</option>
          <option value="assetViews">Xem nhiều Asset Pack nhất</option>
        </select>
      </div>
    </div>

    <!-- Ô tìm kiếm & Lọc Quốc gia / Nhà mạng -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div class="md:col-span-2 relative">
        <input 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text" 
          placeholder="Tìm theo Địa chỉ IP, Thành phố, Trang truy cập hoặc Tên Pack..." 
          class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <span class="absolute right-4 top-2.5 opacity-30">🔍</span>
      </div>

      <select 
        :value="filterCountry" 
        @change="$emit('update:filterCountry', $event.target.value)"
        class="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
      >
        <option value="">🌍 Tất cả Quốc gia ({{ uniqueCountries.length }})</option>
        <option v-for="c in uniqueCountries" :key="c" :value="c">{{ c }}</option>
      </select>

      <select 
        :value="filterISP" 
        @change="$emit('update:filterISP', $event.target.value)"
        class="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
      >
        <option value="">📡 Tất cả Nhà mạng ({{ uniqueISPs.length }})</option>
        <option v-for="i in uniqueISPs" :key="i" :value="i">{{ i }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

defineProps({
  viewMode: { type: String, default: 'visitors' },
  visitorsCount: { type: Number, default: 0 },
  eventsCount: { type: Number, default: 0 },
  sortBy: { type: String, default: 'lastActive' },
  searchQuery: { type: String, default: '' },
  filterCountry: { type: String, default: '' },
  filterISP: { type: String, default: '' },
  uniqueCountries: { type: Array, default: () => [] },
  uniqueISPs: { type: Array, default: () => [] }
})

defineEmits([
  'update:viewMode',
  'update:sortBy',
  'update:searchQuery',
  'update:filterCountry',
  'update:filterISP'
])
</script>
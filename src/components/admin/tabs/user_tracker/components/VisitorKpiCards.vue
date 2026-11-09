<!-- src/components/admin/tabs/user_tracker/components/VisitorKpiCards.vue -->
<template>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div :class="[theme.ui.adminRoundedContainer]">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Visitors (IP)</p>
      <p class="text-2xl font-black text-blue-600 mt-1">{{ uniqueVisitorsCount }}</p>
      <p class="text-[11px] text-slate-400 font-medium mt-1">Trong 30 ngày qua</p>
    </div>

    <div :class="[theme.ui.adminRoundedContainer]">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Truy cập Hôm nay</p>
      <p class="text-2xl font-black text-emerald-500 mt-1">{{ activeTodayCount }}</p>
      <p class="text-[11px] text-slate-400 font-medium mt-1">IP hoạt động hôm nay</p>
    </div>

    <div :class="[theme.ui.adminRoundedContainer]">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lượt xem Asset Pack</p>
      <p class="text-2xl font-black text-indigo-600 mt-1">{{ totalAssetViewsAll }}</p>
      <p class="text-[11px] text-slate-400 font-medium mt-1">Tổng số lần mở Pack</p>
    </div>

    <div :class="[theme.ui.adminRoundedContainer]">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Download Hôm nay</p>
      <p class="text-2xl font-black text-amber-500 mt-1">{{ downloadsTodayAll }}</p>
      <p class="text-[11px] text-slate-400 font-medium mt-1">Ngày {{ todayKey }}</p>
    </div>

    <div :class="[theme.ui.adminRoundedContainer, 'col-span-2 md:col-span-1']">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng lượt Download</p>
      <p class="text-2xl font-black text-rose-600 mt-1">{{ totalDownloadsAll }}</p>
      <p class="text-[11px] text-slate-400 font-medium mt-1">Tất cả người dùng</p>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

defineProps({
  uniqueVisitorsCount: { type: Number, default: 0 },
  activeTodayCount: { type: Number, default: 0 },
  totalAssetViewsAll: { type: Number, default: 0 },
  downloadsTodayAll: { type: Number, default: 0 },
  totalDownloadsAll: { type: Number, default: 0 },
  todayKey: { type: String, default: '' }
})
</script>
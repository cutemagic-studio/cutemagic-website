<template>
  <div class="relative z-10 flex flex-col items-start">
    
    <!-- Bọc Pill và Label vào một flex ngang -->
    <div class="flex items-center gap-3">
      
      <!-- Pill chính (Tháng trước / Tháng này / Tháng sau) -->
      <div :class="[
             'px-6 py-2 rounded-xl font-black text-sm sm:text-base shadow-md whitespace-nowrap transition-transform hover:scale-105',
             col.pillClass
           ]">
        {{ col.title }}
      </div>

      <!-- Label Tháng/Năm (Nền mờ, chữ xám) -->
      <div class="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold tracking-wider backdrop-blur-sm">
        {{ col.dateLabel }}
      </div>
      
    </div>

    <!-- Nhãn phụ ngay dưới (Đã hoàn thành / Số pack...) -->
    <div class="mt-2 ml-3 px-2.5 py-1 rounded-xl bg-cmg-surface border border-cmg-subtle text-[11px] font-bold text-cmg-muted flex items-center gap-1.5 shadow-sm">
      <span class="w-2 h-2 rounded-full" :class="col.dotClass"></span>
      <span>{{ col.periodLabel }}</span>
      <span class="opacity-60">({{ col.items?.length || 0 }} packs)</span>
    </div>

  </div>
</template>

<script setup>
defineProps({
  // Nhận toàn bộ object "col" từ vòng lặp v-for của component cha truyền xuống
  col: {
    type: Object,
    required: true
  }
})
</script>
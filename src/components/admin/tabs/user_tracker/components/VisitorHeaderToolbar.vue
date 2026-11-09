<!-- src/components/admin/tabs/user_tracker/components/VisitorHeaderToolbar.vue -->
<template>
  <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col lg:flex-row lg:items-center justify-between gap-4']">
    <div>
      <div class="flex items-center gap-2.5">
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
        <h1 :class="[theme.ui.assetCardTitle]">Phân tích Hành vi Người dùng</h1>
      </div>
      <p class="text-xs text-slate-500 font-medium mt-1">
        Định danh duy nhất theo Địa chỉ IP • Lưu trữ tối ưu trong chu kỳ 30 ngày gần nhất
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Nút Sao lưu dữ liệu hành vi ra file .js -->
      <button 
        @click="$emit('backup')"
        :disabled="isExporting"
        class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
        title="Tải toàn bộ dữ liệu IP và lịch sử hành vi về máy tính dưới dạng file .js"
      >
        <span>⬇️</span>
        <span>{{ isExporting ? 'Đang đóng gói...' : 'Sao lưu Hành vi (.js)' }}</span>
      </button>

      <!-- Nút Xóa dữ liệu cũ > 30 ngày -->
      <button 
        @click="$emit('cleanup')"
        :disabled="isCleaning"
        class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer disabled:opacity-50"
        :class="expiredCount > 0 
          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white shadow-sm' 
          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'"
      >
        <span>🧹</span>
        <span v-if="isCleaning">Đang dọn dẹp...</span>
        <span v-else>
          Dọn data &gt; 30 ngày 
          <strong v-if="expiredCount > 0" class="ml-1 px-1.5 py-0.5 bg-rose-600 text-white rounded-md text-[10px]">
            {{ expiredCount }}
          </strong>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

defineProps({
  expiredCount: { type: Number, default: 0 },
  isCleaning: { type: Boolean, default: false },
  isExporting: { type: Boolean, default: false }
})

defineEmits(['cleanup', 'backup'])
</script>
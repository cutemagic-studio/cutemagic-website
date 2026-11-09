<!-- src/components/admin/common/ToastContainer.vue -->
<template>
  <div class="fixed top-5 right-5 z-[120] flex flex-col gap-3 max-w-sm w-full pointer-events-none font-sans">
    <transition-group name="toast-slide">
      <div
        v-for="item in notifyStore.toasts"
        :key="item.id"
        class="pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 shadow-xl transition-all"
        :class="getStyle(item.type).border"
      >
        <!-- Icon trạng thái -->
        <div 
          class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 font-black"
          :class="getStyle(item.type).iconBg"
        >
          {{ getStyle(item.type).icon }}
        </div>

        <!-- Nội dung thông báo -->
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-black text-slate-900 leading-snug">
            {{ item.title }}
          </h4>
          <p v-if="item.message" class="text-[11px] font-medium text-slate-500 mt-0.5 leading-relaxed break-words">
            {{ item.message }}
          </p>
        </div>

        <!-- Nút đóng nhanh -->
        <button
          @click="notifyStore.removeToast(item.id)"
          class="text-slate-400 hover:text-slate-700 text-xs font-black px-1.5 py-0.5 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../../../stores/useNotificationStore'

const notifyStore = useNotificationStore()

const getStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        border: 'border-emerald-500/80 shadow-emerald-500/10',
        iconBg: 'bg-emerald-50 text-emerald-600',
        icon: '✅'
      }
    case 'error':
      return {
        border: 'border-rose-500/80 shadow-rose-500/10',
        iconBg: 'bg-rose-50 text-rose-600',
        icon: '❌'
      }
    case 'warning':
      return {
        border: 'border-amber-500/80 shadow-amber-500/10',
        iconBg: 'bg-amber-50 text-amber-600',
        icon: '⚠️'
      }
    default:
      return {
        border: 'border-blue-500/80 shadow-blue-500/10',
        iconBg: 'bg-blue-50 text-blue-600',
        icon: '💡'
      }
  }
}
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
</style>
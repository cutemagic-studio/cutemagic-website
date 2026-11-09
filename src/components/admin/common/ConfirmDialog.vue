<!-- src/components/admin/common/ConfirmDialog.vue -->
<template>
  <transition name="modal-bounce">
    <div 
      v-if="dialog.show" 
      class="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none"
      @click.self="notifyStore.handleConfirmChoice(false)"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        <!-- Thanh màu cảnh báo trên đỉnh -->
        <div class="absolute top-0 left-0 right-0 h-1.5" :class="variantClasses.topBar"></div>

        <div class="flex items-start gap-4 mt-2">
          <!-- Icon theo mức độ -->
          <div 
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border"
            :class="variantClasses.iconBox"
          >
            {{ dialog.icon || variantClasses.defaultIcon }}
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-base font-black text-slate-900 tracking-tight">
              {{ dialog.title }}
            </h3>
            <p class="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed whitespace-pre-line">
              {{ dialog.message }}
            </p>

            <!-- Hộp nhấn mạnh tên Pack / Tên File / Số lượng bản ghi -->
            <div 
              v-if="dialog.highlightText" 
              class="mt-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono font-black text-slate-800 break-words"
            >
              {{ dialog.highlightText }}
            </div>
          </div>
        </div>

        <!-- Cụm nút bấm -->
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button 
            type="button"
            @click="notifyStore.handleConfirmChoice(false)"
            class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-black transition-all cursor-pointer"
          >
            {{ dialog.cancelText }}
          </button>

          <button 
            type="button"
            @click="notifyStore.handleConfirmChoice(true)"
            class="px-5 py-2.5 rounded-xl text-white text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            :class="variantClasses.confirmBtn"
          >
            {{ dialog.confirmText }}
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '../../../stores/useNotificationStore'

const notifyStore = useNotificationStore()
const dialog = computed(() => notifyStore.confirmState)

const variantClasses = computed(() => {
  if (dialog.value.variant === 'warning') {
    return {
      topBar: 'bg-amber-500',
      iconBox: 'bg-amber-50 border-amber-200 text-amber-600',
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
      defaultIcon: '⚠️'
    }
  }
  if (dialog.value.variant === 'info') {
    return {
      topBar: 'bg-blue-600',
      iconBox: 'bg-blue-50 border-blue-200 text-blue-600',
      confirmBtn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25',
      defaultIcon: 'ℹ️'
    }
  }
  // Mặc định: 'danger' (Màu đỏ cảnh báo xóa / ghi đè)
  return {
    topBar: 'bg-rose-600',
    iconBox: 'bg-rose-50 border-rose-200 text-rose-600',
    confirmBtn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25',
    defaultIcon: '🗑️'
  }
})
</script> 

<style scoped>
.modal-bounce-enter-active,
.modal-bounce-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-bounce-enter-from,
.modal-bounce-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
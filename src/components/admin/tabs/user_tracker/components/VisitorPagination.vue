<!-- src/components/admin/tabs/user_tracker/components/VisitorPagination.vue -->
<template>
  <div class="p-4 bg-white rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-[11px] font-black uppercase text-slate-400 tracking-widest">
      Hiển thị {{ totalItems > 0 ? startIndex + 1 : 0 }}–{{ endIndex }} trên tổng {{ totalItems }} bản ghi
    </p>
    <div class="flex items-center gap-1.5">
      <button 
        @click="$emit('update:currentPage', 1)" 
        :disabled="currentPage === 1" 
        class="px-3 py-1.5 rounded-xl border text-xs font-black disabled:opacity-30 cursor-pointer"
      >
        «
      </button>
      <button 
        @click="$emit('update:currentPage', currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="px-3 py-1.5 rounded-xl border text-xs font-black disabled:opacity-30 cursor-pointer"
      >
        Trước
      </button>
      <span class="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-black">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button 
        @click="$emit('update:currentPage', currentPage + 1)" 
        :disabled="currentPage === totalPages" 
        class="px-3 py-1.5 rounded-xl border text-xs font-black disabled:opacity-30 cursor-pointer"
      >
        Sau
      </button>
      <button 
        @click="$emit('update:currentPage', totalPages)" 
        :disabled="currentPage === totalPages" 
        class="px-3 py-1.5 rounded-xl border text-xs font-black disabled:opacity-30 cursor-pointer"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  startIndex: { type: Number, default: 0 },
  endIndex: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 }
})

defineEmits(['update:currentPage'])
</script>
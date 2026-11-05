<template>
  
  <div @click="goToDetail"
   class="flex flex-col items-start transition-transform duration-200 group-hover:translate-x-2">  <!-- bg-[#1C1C1C]">  -->
    <!-- bg-transparent -->
    
    <!-- TẦNG 1: Thanh chính chứa Icon trạng thái + Tên Pack -->
    <div :class="[
           'inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2 text-left shadow-sm transition-all duration-200 max-w-full',
           col.itemBgClass
         ]">
      
      <!-- Icon Check / Status (Tăng size lên w-5 h-5 và thêm bóng đổ) -->
      <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm"
            :class="col.iconBgClass">
        <template v-if="col.id === 'prev'">✓</template>
        <template v-else-if="col.id === 'current'">⚡</template>
        <template v-else>★</template>
      </span>

      <!-- Tên Pack (Khóa chặt màu Đen xám cho Light Mode và Trắng cho Dark Mode) -->
      <span class="font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate pr-2">
        {{ item.title }}
      </span>
    </div>

    <!-- TẦNG 2: Nhãn phụ nhỏ nằm lùi vào -->
    <!-- Dùng nền Trắng/Xám đậm đặc khối thay vì bg-surface mờ nhạt -->
    <div class="mt-1.5 ml-4 px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shadow-sm transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-500">
      
      <!-- Icon lịch nhỏ -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      
      <span>{{ item.subText }}</span>
    </div>

  </div>
</template>

<script setup>

import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  col: {
    type: Object,
    required: true
  }
})

const goToDetail = () => {
  if (props.item && props.item.id) {
    router.push({ name: 'AssetDetailView', params: { id: props.item.id } })
  } else {
    console.log(props.item)
  }
}
</script>
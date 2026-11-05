<template>
  <div class="relative ml-2 sm:ml-6 pt-6 w-full">
    
    <!-- 1. TRỤC CHÍNH BÊN TRÁI -->
    <!-- Kéo dài thành h-6 (24px) để đâm xuyên qua xà ngang (16px) và chạm khít đỉnh Grid (24px) -->
    <div v-if="col.items.length > 0" 
         class="absolute left-0 top-0 border-l-2 border-slate-400 dark:border-slate-600 h-6">
    </div>

    <!-- 2. HỆ THỐNG XÀ NGANG & CẦU NỐI BÊN PHẢI (Chỉ hiện khi có 2 cột) -->
    <div v-if="rightItems.length > 0" class="hidden md:block">
      
      <!-- Thanh xà vắt ngang (Được đẩy lên cao ở vị trí top-4 = 16px) -->
      <div class="absolute left-0 top-4 w-[calc(50%+16px)] border-t-2 border-slate-400 dark:border-slate-600"></div>

      <!-- Cầu nối thả rơi bên Phải (Right Drop Bridge) -->
      <!-- Bắt đầu từ thanh xà ngang (top-4) và rơi xuống 8px (h-2) để khớp đúng vào đỉnh cột phải -->
      <div class="absolute left-[calc(50%+16px)] top-4 h-2 border-l-2 border-slate-400 dark:border-slate-600"></div>
      
    </div>

    <!-- 3. KHỐI DANH SÁCH PACK (Bắt đầu từ pt-6 = 24px) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0 w-full relative">
      
      <!-- ==========================================
           CỘT TRÁI
           ========================================== -->
      <div class="relative flex flex-col w-full">
        <div v-for="(item, itemIndex) in leftItems" :key="'left-'+item.id" 
             class="relative pl-6 pb-4 last:pb-0 group cursor-pointer">
             
          <!-- TRỤC DỌC TRÁI (Bắt đầu từ top-0 của Grid) -->
          <div class="absolute left-0 top-0 border-l-2 border-slate-400 dark:border-slate-600 transition-all duration-200 group-hover:border-blue-500 group-hover:border-l-[4px]"
               :class="(itemIndex === leftItems.length - 1 && (!isDesktop || rightItems.length === 0)) ? 'h-[18px]' : 'h-full'">
          </div>
          
          <!-- NHÁNH RẼ NGANG VÀO ITEM (─) -->
          <div class="absolute left-0 top-[18px] w-6 border-t-2 border-slate-400 dark:border-slate-600 transition-all duration-200 group-hover:border-blue-500 group-hover:border-t-[4px]"></div>
          
          <RoadmapNode :item="item" :col="col" />
        </div>
      </div>

      <!-- ==========================================
           CỘT PHẢI
           ========================================== -->
      <div v-if="rightItems.length > 0" class="relative flex flex-col w-full mt-4 md:mt-0">
        
        <div v-for="(item, itemIndex) in rightItems" :key="'right-'+item.id" 
             class="relative pl-6 pb-4 last:pb-0 group cursor-pointer">
             
          <!-- TRỤC DỌC PHẢI -->
          <!-- Điểm bắt đầu (top-0 của khối này) sẽ ngậm vừa khít với đoạn Cầu nối 8px bên trên thả xuống -->
          <div class="absolute left-0 top-0 border-l-2 border-slate-400 dark:border-slate-600 transition-all duration-200 group-hover:border-blue-500 group-hover:border-l-[4px]"
               :class="itemIndex === rightItems.length - 1 ? 'h-[18px]' : 'h-full'">
          </div>
          
          <!-- NHÁNH RẼ NGANG VÀO ITEM (─) -->
          <div class="absolute left-0 top-[18px] w-6 border-t-2 border-slate-400 dark:border-slate-600 transition-all duration-200 group-hover:border-blue-500 group-hover:border-t-[4px]"></div>
          
          <RoadmapNode :item="item" :col="col" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import RoadmapNode from './RoadmapNode.vue'

const props = defineProps({
  col: { type: Object, required: true }
})

const isDesktop = ref(false)
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768 
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const leftItems = computed(() => {
  if (!props.col.items) return []
  if (!isDesktop.value) return props.col.items 
  
  const mid = Math.ceil(props.col.items.length / 2)
  return props.col.items.slice(0, mid)
})

const rightItems = computed(() => {
  if (!props.col.items || !isDesktop.value) return []
  
  const mid = Math.ceil(props.col.items.length / 2)
  return props.col.items.slice(mid)
})
</script>
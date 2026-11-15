<!-- src/components/admin/tabs/ref_library/LocalRefLibraryManager.vue -->
<template>
  <div class="h-full w-full select-none font-sans overflow-hidden">
    <!-- BỐ CỤC 2 CỘT CỐ ĐỊNH TOÀN MÀN HÌNH -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-stretch">

      <!-- VÙNG SỐ 1 (MÀU VÀNG): CỘT TRÁI CỐ ĐỊNH 100% CHIỀU CAO MÀN HÌNH -->
      <div class="lg:col-span-4 h-full min-h-0 flex flex-col overflow-hidden">
        <RefCategoryTreeSidebar class="h-full" />
      </div>

      <!-- CỘT PHẢI (8/12): ĐỈNH CỐ ĐỊNH (VÙNG SỐ 2 MÀU ĐỎ) + LƯỚI ẢNH CUỘN ĐỘC LẬP -->
      <div class="lg:col-span-8 h-full min-h-0 flex flex-col gap-3.5 overflow-hidden">
        <!-- VÙNG SỐ 2 (MÀU ĐỎ): Cố định trên đỉnh cột phải & Hỗ trợ Collapse -->
        <RefHeaderToolbar class="shrink-0" />

        <!-- VÙNG LƯỚI ẢNH: Chỉ cuộn độc lập bên trong khu vực này -->
        <div class="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          <RefImageGridSection />
        </div>
      </div>

    </div>

    <!-- 3. Các Hộp thoại Modal chuyên biệt -->
    <RefCategoryModal />
    <RefRenameFileModal />
    <RefLightboxModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRefLibraryStore } from '../../../../stores/useRefLibraryStore'

import RefHeaderToolbar from './components/RefHeaderToolbar.vue'
import RefCategoryTreeSidebar from './components/RefCategoryTreeSidebar.vue'
import RefImageGridSection from './components/RefImageGridSection.vue'
import RefCategoryModal from './components/RefCategoryModal.vue'
import RefRenameFileModal from './components/RefRenameFileModal.vue'
import RefLightboxModal from './components/RefLightboxModal.vue'

const store = useRefLibraryStore()

onMounted(() => {
  store.loadLibraryFromDisk()
})
</script>
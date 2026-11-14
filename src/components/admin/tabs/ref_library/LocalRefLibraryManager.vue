<!-- src/components/admin/tabs/ref_library/LocalRefLibraryManager.vue -->
<template>
  <div class="space-y-5 select-none font-sans">
    <!-- 1. Thanh Header: Đường dẫn Windows & Backup / Rollback -->
    <RefHeaderToolbar />

    <!-- 2. Bố cục chính: Cột trái (Cây Category) & Cột phải (Lưới Ảnh) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <RefCategoryTreeSidebar class="lg:col-span-4" />
      <RefImageGridSection class="lg:col-span-8" />
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
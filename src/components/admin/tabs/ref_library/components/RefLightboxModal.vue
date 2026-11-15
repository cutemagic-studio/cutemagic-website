<!-- src/components/admin/tabs/ref_library/components/RefLightboxModal.vue -->
<template>
  <div
    v-if="store.previewingItem"
    class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
    @click.self="store.previewingItem = null"
  >
    <div class="bg-slate-900 border-2 border-[#8470FF] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col">
      
      <!-- THANH HEADER: Đường dẫn, Số thứ tự Slide & Các nút thao tác nhanh -->
      <div class="px-5 py-3.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <!-- Bộ đếm vị trí ảnh trong Slide -->
            <span
              v-if="totalSlides > 0"
              class="px-2 py-0.5 rounded-md bg-[#ffe600] text-slate-950 text-[11px] font-mono font-black shrink-0"
            >
              {{ currentSlideIndex + 1 }} / {{ totalSlides }}
            </span>
            <p class="text-[11px] font-mono text-sky-400 truncate" :title="store.previewingItem.windowsPath">
              💻 {{ store.previewingItem.windowsPath }}
            </p>
          </div>
          <h4 class="text-sm font-mono font-black truncate mt-0.5">
            {{ store.previewingItem.fileName }}
          </h4>
        </div>

        <!-- Cụm nút mở Folder, Đổi tên & Đóng -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="store.previewingItem.windowsPath"
            type="button"
            @click="store.handleOpenInFolder(store.previewingItem)"
            class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Mở thư mục chứa ảnh này trên Windows Explorer"
          >
            <span>📂</span>
            <span class="hidden sm:inline">Mở trong Folder</span>
          </button>

          <button
            v-if="!store.previewingItem.deleted_at"
            type="button"
            @click="openRenameFromLightbox"
            class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>✏️</span>
            <span class="hidden sm:inline">Đổi tên</span>
          </button>

          <button
            type="button"
            @click="store.previewingItem = null"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center cursor-pointer transition-colors"
            title="Đóng (Phím Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- KHUNG CHÍNH HIỂN THỊ ẢNH + 2 NÚT PREVIOUS / NEXT NỔI HAI BÊN -->
      <div class="relative p-4 sm:p-6 flex items-center justify-center min-h-[55vh] max-h-[76vh] bg-slate-900">
        
        <!-- Nút PREVIOUS (Bên trái) -->
        <button
          v-if="totalSlides > 1"
          type="button"
          @click.stop="goToPrevSlide"
          class="absolute left-3 sm:left-5 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 hover:bg-[#ffe600] text-white hover:text-slate-950 border-2 border-white/20 hover:border-slate-950 flex items-center justify-center text-lg font-black shadow-xl transition-all cursor-pointer active:scale-95"
          title="Ảnh trước (Phím mũi tên Trái ←)"
        >
          ❮
        </button>

        <!-- Ảnh đang xem -->
        <img
          :key="store.previewingItem.key"
          :src="store.getImageStreamUrl(store.previewingItem)"
          :alt="store.previewingItem.fileName"
          class="max-h-[70vh] max-w-full w-auto object-contain rounded-xl shadow-2xl select-none"
        />

        <!-- Nút NEXT (Bên phải) -->
        <button
          v-if="totalSlides > 1"
          type="button"
          @click.stop="goToNextSlide"
          class="absolute right-3 sm:right-5 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 hover:bg-[#ffe600] text-white hover:text-slate-950 border-2 border-white/20 hover:border-slate-950 flex items-center justify-center text-lg font-black shadow-xl transition-all cursor-pointer active:scale-95"
          title="Ảnh tiếp theo (Phím mũi tên Phải →)"
        >
          ❯
        </button>
      </div>

      <!-- THANH FOOTER: Nhãn Category & Điều hướng Previous / Next phụ trợ -->
      <div class="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold">
            {{ store.getCategoryLabel(store.previewingItem.categoryId) }}
          </span>
          <span class="text-[11px] font-mono text-slate-400">
            Mẹo: Dùng phím <strong>←</strong> / <strong>→</strong> trên bàn phím để chuyển ảnh nhanh
          </span>
        </div>

        <div v-if="totalSlides > 1" class="flex items-center gap-2">
          <button
            type="button"
            @click="goToPrevSlide"
            class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black cursor-pointer transition-colors"
          >
            ‹ Previous
          </button>
          <button
            type="button"
            @click="goToNextSlide"
            class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black cursor-pointer transition-colors"
          >
            Next ›
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'

const store = useRefLibraryStore()

const totalSlides = computed(() => store.filteredImages.length)

const currentSlideIndex = computed(() => {
  if (!store.previewingItem) return -1
  return store.filteredImages.findIndex(img => img.key === store.previewingItem.key)
})

// Đồng bộ trang hiện tại (Pagination) theo vị trí của bức ảnh đang xem trên Slide
const syncPageWithSlideIndex = (targetIdx) => {
  if (targetIdx < 0) return
  const targetPage = Math.floor(targetIdx / store.itemsPerPage) + 1
  if (targetPage !== store.currentPage) {
    store.goToPage(targetPage)
  }
}

const goToPrevSlide = () => {
  if (totalSlides.value <= 1 || currentSlideIndex.value === -1) return
  const nextIdx = (currentSlideIndex.value - 1 + totalSlides.value) % totalSlides.value
  store.previewingItem = store.filteredImages[nextIdx]
  syncPageWithSlideIndex(nextIdx)
}

const goToNextSlide = () => {
  if (totalSlides.value <= 1 || currentSlideIndex.value === -1) return
  const nextIdx = (currentSlideIndex.value + 1) % totalSlides.value
  store.previewingItem = store.filteredImages[nextIdx]
  syncPageWithSlideIndex(nextIdx)
}

const openRenameFromLightbox = () => {
  const current = store.previewingItem
  store.previewingItem = null
  store.renamingItem = current
}

// Bắt sự kiện phím mũi tên Trái / Phải / Esc khi đang mở Lightbox
const handleKeydown = (e) => {
  if (!store.previewingItem) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    goToPrevSlide()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    goToNextSlide()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    store.previewingItem = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
<!-- src/components/admin/tabs/ref_library/components/RefLightboxModal.vue -->
<template>
  <div
    v-if="store.previewingItem"
    class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="store.previewingItem = null"
  >
    <div class="bg-slate-900 border-2 border-[#8470FF] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
      <div class="px-5 py-3 bg-slate-950 text-white flex items-center justify-between">
        <div class="truncate pr-4">
          <p class="text-[10px] font-mono text-sky-400">
            {{ store.previewingItem.windowsPath }}
          </p>
          <h4 class="text-sm font-mono font-black truncate">{{ store.previewingItem.fileName }}</h4>
        </div>
        <button
          type="button"
          @click="store.previewingItem = null"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 text-white text-xs font-black cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div class="p-4 flex items-center justify-center max-h-[80vh] bg-slate-900">
        <img
          :src="store.getImageStreamUrl(store.previewingItem)"
          class="max-h-[75vh] w-auto object-contain rounded-xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
const store = useRefLibraryStore()
</script>
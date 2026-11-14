<!-- src/components/admin/tabs/ref_library/components/RefRenameFileModal.vue -->
<template>
  <div
    v-if="store.renamingItem"
    class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl border-2 border-[#8470FF] max-w-md w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-amber-600">
            Đổi tên File trực tiếp trên Ổ đĩa Windows
          </span>
          <h3 class="text-base font-black text-slate-900">✏️ Đổi tên File hình ảnh</h3>
        </div>
        <button
          type="button"
          @click="store.renamingItem = null"
          class="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-xs font-black cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
        <img
          v-if="store.getImageStreamUrl(store.renamingItem)"
          :src="store.getImageStreamUrl(store.renamingItem)"
          class="w-14 h-14 rounded-xl object-cover border"
        />
        <div class="text-xs overflow-hidden">
          <p class="text-[10px] font-bold text-slate-400 uppercase">Đường dẫn hiện tại:</p>
          <p class="font-mono font-black text-slate-700 break-all text-[11px]">{{ store.renamingItem.windowsPath }}</p>
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
          Chèn nhanh Prefix chuẩn Cute Magic:
        </label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="prefix in ['Ref_', 'Env_', 'Prop_', 'VEG_', 'WAL_', 'FLR_', 'FRT_']"
            :key="prefix"
            type="button"
            @click="applyPrefix(prefix)"
            class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-[11px] font-mono font-black text-slate-700 cursor-pointer"
          >
            + {{ prefix }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-black uppercase text-slate-600 mb-1">
          Tên file mới (Giữ nguyên đuôi {{ renameExt }}):
        </label>
        <div class="flex items-center gap-1.5">
          <input
            ref="renameInputRef"
            v-model="renameBaseName"
            @keyup.enter="onSubmitRename"
            type="text"
            class="flex-1 border-2 border-[#8470FF] rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-slate-900 focus:outline-none"
          />
          <span class="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono font-black text-slate-500">
            {{ renameExt }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          @click="store.renamingItem = null"
          class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-600 cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          @click="onSubmitRename"
          class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg cursor-pointer"
        >
          💾 Tiếp tục &amp; Xác nhận Đổi tên
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
import { useNotificationStore } from '../../../../../stores/useNotificationStore'

const store = useRefLibraryStore()
const notify = useNotificationStore()

const renameBaseName = ref('')
const renameExt = ref('')
const renameInputRef = ref(null)

watch(
  () => store.renamingItem,
  (item) => {
    if (item) {
      const dotIdx = item.fileName.lastIndexOf('.')
      renameBaseName.value = dotIdx > 0 ? item.fileName.slice(0, dotIdx) : item.fileName
      renameExt.value = dotIdx > 0 ? item.fileName.slice(dotIdx) : ''
      nextTick(() => {
        renameInputRef.value?.focus()
        renameInputRef.value?.select()
      })
    }
  }
)

const applyPrefix = (prefix) => {
  if (!renameBaseName.value.startsWith(prefix)) {
    renameBaseName.value = `${prefix}${renameBaseName.value}`
  }
}

const onSubmitRename = async () => {
  if (!store.renamingItem) return
  const cleanBase = renameBaseName.value.trim().replace(/[\\/:*?"<>|]/g, '_')
  if (!cleanBase) {
    notify.warning('Tên không hợp lệ', 'Vui lòng nhập tên file mới!')
    return
  }
  const finalNewName = `${cleanBase}${renameExt.value}`
  if (finalNewName === store.renamingItem.fileName) {
    store.renamingItem = null
    return
  }
  await store.confirmRenameFileOnWindows(store.renamingItem, finalNewName)
}
</script>
<!-- src/components/admin/tabs/ref_library/components/RefHeaderToolbar.vue -->
<template>
  <div class="bg-white rounded-3xl border-2 border-[#8470FF] p-5 shadow-md space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-slate-900 text-[#ffe600] flex items-center justify-center text-2xl shadow">
          🗂️
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-black uppercase tracking-widest text-blue-600">
              Windows Physical Reference Vault
            </span>
            <span
              class="px-2 py-0.5 rounded-md text-[10px] font-mono font-black border"
              :class="store.isLocalViteServer
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-sky-50 text-sky-700 border-sky-300'"
            >
              {{ store.isLocalViteServer
                ? `✓ Local Disk Sync: src/data/ref_library.json (${store.libraryData.updatedAt || 'Mới'})`
                : `☁️ GitHub Pages Mode (Đồng bộ Browser & Folder Windows)` }}
            </span>
          </div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            Tổng cộng: {{ store.activeItemsList.length }} ảnh đang hoạt động • {{ store.trashedItemsList.length }} ảnh trong thùng rác
          </h2>
        </div>
      </div>

      <!-- Cụm nút Backup, Rollback & Xuất JSON -->
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="store.backupMeta" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
          <span class="font-black">🛡️ Backup:</span>
          <span class="font-mono ml-1">{{ store.backupMeta.updatedAt }}</span>
        </div>

        <button
          type="button"
          @click="store.handleManualBackup"
          class="px-3.5 py-2 rounded-xl border-2 border-[#8470FF] bg-white hover:bg-blue-50 text-slate-800 text-xs font-black cursor-pointer transition-colors"
        >
          🛡️ Sao lưu Backup
        </button>

        <button
          type="button"
          :disabled="!store.backupMeta"
          @click="store.handleRollbackBackup"
          class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-black shadow cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <span>⏪</span>
          <span>Back lại Version trước</span>
        </button>

        <button
          v-if="!store.isLocalViteServer"
          type="button"
          @click="store.exportJsonFile"
          class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-[#ffe600] text-xs font-black cursor-pointer"
          title="Tải file ref_library.json đã cập nhật về máy"
        >
          ⬇️ Tải JSON
        </button>
      </div>
    </div>

    <!-- Dòng Nhập / Chọn Đường dẫn Folder Vật lý trên Windows -->
    <div class="pt-3 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
      <div class="lg:col-span-5">
        <input
          v-model="store.folderPathInput"
          type="text"
          placeholder="VD: D:\Assets_Tham_Khao\9af17b4bfe54bb33"
          class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
        />
      </div>

      <div class="lg:col-span-3">
        <select
          v-model="store.importTargetCategoryId"
          class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black text-slate-700 bg-slate-50"
        >
          <option value="__AUTO_FOLDER__">✨ Tự tạo/gán Category theo tên Folder</option>
          <option value="">❓ Để ở mục Chưa phân loại</option>
          <option v-for="node in store.flattenedCategoryTree" :key="node.id" :value="node.id">
            {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
          </option>
        </select>
      </div>

      <div class="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          :disabled="store.isScanning"
          @click="store.handlePickWindowsFolderDialog"
          class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow cursor-pointer flex items-center gap-1.5"
        >
          <span>📂</span>
          <span>{{ store.isScanning ? 'Đang mở hộp thoại...' : 'Chọn Folder trên Windows' }}</span>
        </button>

        <button
          type="button"
          :disabled="!store.folderPathInput.trim() || store.isScanning"
          @click="store.handleScanTypedFolderPath"
          class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black cursor-pointer transition-colors"
        >
          ↻ Quét Đường dẫn này
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
const store = useRefLibraryStore()
</script>
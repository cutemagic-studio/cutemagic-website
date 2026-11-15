<!-- src/components/admin/tabs/ref_library/components/RefHeaderToolbar.vue -->
<template>
  <div class="bg-white rounded-3xl border-2 border-[#8470FF] px-4 py-3 shadow-md transition-all duration-200">
    
    <!-- =================================================================== -->
    <!-- HÀNG ĐỈNH LUÔN HIỂN THỊ (CHỨA NÚT COLLAPSE Ở GÓC PHẢI VÙNG ĐỎ)      -->
    <!-- =================================================================== -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-slate-900 text-[#ffe600] flex items-center justify-center text-lg shadow shrink-0">
          🗂️
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] font-black uppercase tracking-wider text-blue-600">
              Windows Vault • Firebase
            </span>
            <span
              class="px-1.5 py-0.5 rounded text-[9px] font-mono font-black border truncate"
              :class="store.isFirebaseSynced
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'"
            >
              {{ store.isSavingFirebase
                ? '⏳ Đang lưu...'
                : (store.isFirebaseSynced
                    ? `🔥 Live (${store.libraryData.updatedAt || 'Mới'})`
                    : '⏳ Kết nối...')
              }}
            </span>
          </div>
          <h2 class="text-xs sm:text-sm font-black text-slate-900 truncate">
            Hoạt động: <span class="text-blue-600 font-mono">{{ store.activeItemsList.length }}</span> ảnh • Thùng rác: <span class="text-rose-600 font-mono">{{ store.trashedItemsList.length }}</span>
          </h2>
        </div>
      </div>

      <!-- Cụm nút thao tác nhanh + Nút Tam Giác Collapse/Expand ở góc phải -->
      <div class="flex flex-wrap items-center gap-1.5 shrink-0">
        <!-- Khi đang thu gọn: hiện luôn nút Chọn Folder & Backup nhỏ gọn trên 1 hàng -->
        <template v-if="isHeaderCollapsed">
          <button
            type="button"
            :disabled="store.isScanning"
            @click="store.handlePickWindowsFolderDialog"
            class="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black cursor-pointer flex items-center gap-1"
            title="Chọn Folder trên Windows"
          >
            <span>📂</span>
            <span class="hidden sm:inline">Chọn Folder</span>
          </button>

          <button
            v-if="store.isLocalViteServer && store.folderPathInput.trim()"
            type="button"
            :disabled="store.isScanning"
            @click="store.handleScanTypedFolderPath"
            class="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-black cursor-pointer"
            title="Quét lại đường dẫn hiện tại"
          >
            ↻ Quét
          </button>
        </template>

        <button
          type="button"
          @click="store.handleManualBackup"
          class="px-2.5 py-1.5 rounded-xl border-2 border-[#8470FF] bg-white hover:bg-blue-50 text-slate-800 text-[11px] font-black cursor-pointer transition-colors"
          title="Sao lưu trạng thái hiện tại lên Firebase Backup"
        >
          🛡️ Backup
        </button>

        <button
          type="button"
          :disabled="!store.backupMeta"
          @click="store.handleRollbackBackup"
          class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-[11px] font-black shadow cursor-pointer transition-colors flex items-center gap-1"
          :title="store.backupMeta ? `Khôi phục bản lưu lúc: ${store.backupMeta.updatedAt} (${store.backupMeta.backupReason})` : 'Chưa có bản Backup'"
        >
          <span>⏪</span>
          <span class="hidden md:inline">Back Version</span>
        </button>

        <button
          type="button"
          @click="store.exportJsonFile"
          class="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-[#ffe600] text-[11px] font-black cursor-pointer"
          title="Xuất bản chụp dữ liệu Firebase hiện tại ra file .json"
        >
          ⬇️ JSON
        </button>

        <!-- NÚT TAM GIÁC THU GỌN / MỞ RỘNG KHUNG SỐ 2 (Đúng vị trí góc phải bạn vẽ) -->
        <button
          type="button"
          @click="toggleHeaderCollapse"
          class="px-2.5 py-1.5 rounded-xl border-2 font-black text-[11px] flex items-center gap-1 cursor-pointer transition-all"
          :class="isHeaderCollapsed
            ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'"
          :title="isHeaderCollapsed ? 'Mở rộng khung Đường dẫn Windows & Thông tin Backup' : 'Thu gọn khung này để mở rộng lưới ảnh'"
        >
          <span>{{ isHeaderCollapsed ? '▼ Mở rộng' : '▲ Thu gọn' }}</span>
        </button>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- PHẦN MỞ RỘNG: CHI TIẾT BACKUP & NHẬP ĐƯỜNG DẪN WINDOWS             -->
    <!-- =================================================================== -->
    <div v-show="!isHeaderCollapsed" class="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2.5">
      <!-- Thông tin bản Backup gần nhất -->
      <div v-if="store.backupMeta" class="px-3 py-1 rounded-xl bg-amber-50/90 border border-amber-200 text-[10px] text-amber-900 flex items-center justify-between gap-2">
        <div class="truncate">
          <span class="font-black">🛡️ Firebase Backup:</span>
          <span class="font-mono ml-1">{{ store.backupMeta.updatedAt }}</span>
          <span class="opacity-75 ml-1">({{ store.backupMeta.backupReason }})</span>
        </div>
      </div>

      <!-- Dòng Nhập / Chọn Đường dẫn Folder Vật lý trên Windows -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-2 items-center">
        <div class="xl:col-span-5">
          <input
            v-model="store.folderPathInput"
            type="text"
            placeholder="VD: G:\DanhSachHonDao"
            class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div class="xl:col-span-3">
          <select
            v-model="store.importTargetCategoryId"
            class="w-full border-2 border-[#8470FF] rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-700 bg-slate-50"
          >
            <option value="__AUTO_FOLDER__">✨ Tự tạo/gán theo tên Folder</option>
            <option value="">❓ Để ở Chưa phân loại</option>
            <option v-for="node in store.virtualCategoryTree" :key="node.id" :value="node.id">
              {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
            </option>
          </select>
        </div>

        <div class="xl:col-span-4 flex flex-wrap items-center justify-end gap-1.5">
          <button
            v-if="!store.isLocalViteServer && store.savedBrowserDirHandle"
            type="button"
            @click="store.reconnectSavedBrowserFolder"
            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow cursor-pointer flex items-center gap-1"
          >
            <span>🔄</span>
            <span>Mở lại "{{ store.savedBrowserDirHandle.name }}"</span>
          </button>

          <button
            type="button"
            :disabled="store.isScanning"
            @click="store.handlePickWindowsFolderDialog"
            class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow cursor-pointer flex items-center gap-1"
          >
            <span>📂</span>
            <span>{{ store.isScanning ? 'Đang mở...' : 'Chọn Folder Windows' }}</span>
          </button>

          <button
            v-if="store.isLocalViteServer"
            type="button"
            :disabled="!store.folderPathInput.trim() || store.isScanning"
            @click="store.handleScanTypedFolderPath"
            class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black cursor-pointer transition-colors"
          >
            ↻ Quét Đường dẫn
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'

const store = useRefLibraryStore()

const HEADER_COLLAPSED_KEY = 'cmg_ref_header_toolbar_collapsed_v1'
const isHeaderCollapsed = ref(localStorage.getItem(HEADER_COLLAPSED_KEY) === 'true')

const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value
  localStorage.setItem(HEADER_COLLAPSED_KEY, isHeaderCollapsed.value ? 'true' : 'false')
}
</script>
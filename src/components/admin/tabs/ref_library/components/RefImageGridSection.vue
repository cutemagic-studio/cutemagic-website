<!-- src/components/admin/tabs/ref_library/components/RefImageGridSection.vue -->
<template>
  <div class="space-y-4">
    <!-- Thanh công cụ Tìm kiếm & Thao tác hàng loạt -->
    <div class="bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-1 min-w-[220px]">
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="🔍 Tìm theo tên file hoặc đường dẫn Windows (VD: D:\, Prop_, .webp)..."
          class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-600"
        />
        <button
          v-if="store.searchQuery"
          type="button"
          @click="store.searchQuery = ''"
          class="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-500 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="store.toggleSelectAllVisible"
          class="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-700 cursor-pointer"
        >
          {{ store.selectedKeys.length === store.filteredImages.length && store.filteredImages.length > 0 ? 'Bỏ chọn tất cả' : `Chọn tất cả (${store.filteredImages.length})` }}
        </button>

        <template v-if="store.selectedKeys.length > 0">
          <select
            v-model="store.batchTargetCatId"
            class="border-2 border-blue-600 rounded-xl px-3 py-2 text-xs font-black text-blue-700 bg-blue-50/50"
          >
            <option value="">-- Chuyển {{ store.selectedKeys.length }} ảnh sang Category --</option>
            <option v-for="node in store.flattenedCategoryTree" :key="node.id" :value="node.id">
              {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
            </option>
            <option value="__CLEAR__">❓ Bỏ phân loại (Uncategorized)</option>
          </select>

          <button
            type="button"
            @click="store.handleBatchAssignCategory"
            class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shadow"
          >
            Gán Category ({{ store.selectedKeys.length }})
          </button>

          <button
            v-if="store.selectedFilter !== 'TRASH_ITEMS'"
            type="button"
            @click="store.handleBatchSoftDeleteItems"
            class="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer shadow"
          >
            🗑️ Xóa mềm ({{ store.selectedKeys.length }})
          </button>
        </template>
      </div>
    </div>

    <!-- Lưới hiển thị Ảnh -->
    <div
      v-if="store.filteredImages.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div
        v-for="img in store.filteredImages"
        :key="img.key"
        class="group bg-white rounded-2xl border-2 transition-all overflow-hidden flex flex-col shadow-xs hover:shadow-xl"
        :class="store.selectedKeys.includes(img.key) ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-[#8470FF]'"
      >
        <div class="relative aspect-square bg-slate-100 overflow-hidden">
          <img
            v-if="store.getImageStreamUrl(img)"
            :src="store.getImageStreamUrl(img)"
            :alt="img.fileName"
            loading="lazy"
            @click="store.previewingItem = img"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
            <span class="text-2xl mb-1">📂</span>
            <span class="text-[11px] font-bold">
              Bấm nút <strong>"Chọn Folder trên Windows"</strong> ở thanh trên cùng để kết nối hiển thị ảnh từ ổ cứng.
            </span>
          </div>

          <!-- Checkbox chọn nhiều -->
          <label
            class="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg bg-white/90 border border-slate-300 flex items-center justify-center cursor-pointer shadow"
            @click.stop
          >
            <input
              type="checkbox"
              :value="img.key"
              v-model="store.selectedKeys"
              class="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </label>

          <!-- Nút Đánh dấu sao -->
          <button
            type="button"
            @click.stop="store.handleToggleFavorite(img)"
            class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/75 hover:bg-slate-900 text-xs flex items-center justify-center cursor-pointer"
          >
            <span>{{ img.isFavorite ? '⭐' : '☆' }}</span>
          </button>

          <!-- Nhãn Category hiện tại -->
          <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
            <span class="px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold truncate">
              {{ store.getCategoryLabel(img.categoryId) }}
            </span>
          </div>
        </div>

        <!-- Chi tiết Đường dẫn Windows & Nút thao tác -->
        <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
          <div class="space-y-1">
            <div class="flex items-start justify-between gap-1.5">
              <p class="text-xs font-mono font-black text-slate-900 break-all leading-snug" :title="img.fileName">
                {{ img.fileName }}
              </p>
              <button
                v-if="!img.deleted_at"
                type="button"
                @click="store.renamingItem = img"
                class="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-300 text-amber-900 text-[10px] font-black cursor-pointer"
              >
                ✏️ Đổi tên
              </button>
            </div>

            <p
              class="text-[10px] font-mono text-blue-700 bg-blue-50/70 px-2 py-1 rounded border border-blue-100 break-all leading-tight"
              :title="img.windowsPath"
            >
              💻 {{ img.windowsPath || 'Chưa gắn đường dẫn ổ đĩa' }}
            </p>

            <div class="text-[9px] font-mono text-slate-400 flex flex-wrap justify-between gap-1 pt-0.5">
              <span>Tạo: {{ img.created_at || '—' }}</span>
              <span>Sửa: {{ img.updated_at || '—' }}</span>
            </div>
            <div v-if="img.deleted_at" class="text-[10px] font-mono font-bold text-rose-600">
              🗑️ Xóa mềm lúc: {{ img.deleted_at }}
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <template v-if="!img.deleted_at">
              <select
                :value="img.categoryId || ''"
                @change="store.handleSingleCategoryChange(img, $event.target.value, $event)"
                class="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] font-bold bg-slate-50 hover:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">❓ Chưa phân loại</option>
                <option v-for="node in store.flattenedCategoryTree" :key="node.id" :value="node.id">
                  {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
                </option>
              </select>

              <button
                type="button"
                @click="store.handleSoftDeleteSingleItem(img)"
                class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-black cursor-pointer transition-colors"
              >
                🗑️
              </button>
            </template>

            <template v-else>
              <button
                type="button"
                @click="store.handleRestoreSingleItem(img)"
                class="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black cursor-pointer"
              >
                ♻️ Khôi phục ảnh
              </button>
              <button
                type="button"
                @click="store.handlePermanentDeleteSingleItem(img)"
                class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black cursor-pointer"
              >
                Xóa hẳn khỏi JSON
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Trạng thái trống -->
    <div
      v-else
      class="bg-white rounded-3xl border-2 border-dashed border-[#8470FF] p-12 text-center space-y-3"
    >
      <div class="text-4xl">🗂️</div>
      <h3 class="text-sm font-black text-slate-800">
        Chưa có ảnh nào trong mục đang chọn
      </h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Hãy bấm nút <strong>"📂 Chọn Folder trên Windows"</strong> ở thanh trên cùng hoặc chọn một Category khác ở cột bên trái.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
const store = useRefLibraryStore()
</script>
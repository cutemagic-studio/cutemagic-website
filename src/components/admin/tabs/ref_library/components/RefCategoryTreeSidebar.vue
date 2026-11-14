<!-- src/components/admin/tabs/ref_library/components/RefCategoryTreeSidebar.vue -->
<template>
  <aside class="bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
          🌳 Cây Category (Cha - Con)
        </h3>
        <p class="text-[10px] font-bold text-slate-400">
          Sắp xếp theo độ ưu tiên (sortOrder)
        </p>
      </div>

      <button
        type="button"
        @click="store.openCreateCategoryModal(null)"
        class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black shadow cursor-pointer"
      >
        + Tạo Category
      </button>
    </div>

    <!-- Bộ lọc tổng quát -->
    <div class="space-y-1">
      <button
        type="button"
        @click="store.selectedFilter = 'ALL'"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
        :class="store.selectedFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
      >
        <span>📁 Tất cả ảnh hoạt động</span>
        <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">{{ store.activeItemsList.length }}</span>
      </button>

      <button
        type="button"
        @click="store.selectedFilter = 'FAVORITES'"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
        :class="store.selectedFilter === 'FAVORITES' ? 'bg-[#ff005b] text-white' : 'text-slate-600 hover:bg-pink-50'"
      >
        <span>⭐ Ảnh Đánh dấu quan trọng</span>
        <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ store.favoriteItemsCount }}</span>
      </button>

      <button
        type="button"
        @click="store.selectedFilter = 'UNCATEGORIZED'"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
        :class="store.selectedFilter === 'UNCATEGORIZED' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-amber-50'"
      >
        <span>❓ Chưa phân loại</span>
        <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ store.uncategorizedItemsCount }}</span>
      </button>

      <button
        type="button"
        @click="store.selectedFilter = 'TRASH_ITEMS'"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
        :class="store.selectedFilter === 'TRASH_ITEMS' ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'"
      >
        <span>🗑️ Thùng rác Ảnh (Xóa mềm)</span>
        <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ store.trashedItemsList.length }}</span>
      </button>
    </div>

    <!-- Tùy chọn bao gồm cả ảnh của Category con -->
    <div class="px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
      <label class="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer">
        <input type="checkbox" v-model="store.includeSubcategoriesInView" class="w-3.5 h-3.5 accent-blue-600" />
        <span>Gồm cả ảnh của Category con</span>
      </label>
      <button
        type="button"
        @click="store.showTrashedCategories = !store.showTrashedCategories"
        class="text-[10px] font-black underline cursor-pointer"
        :class="store.showTrashedCategories ? 'text-rose-600' : 'text-slate-400'"
      >
        {{ store.showTrashedCategories ? 'Ẩn Cat đã xóa' : `Cat đã xóa (${store.trashedCategoriesList.length})` }}
      </button>
    </div>

    <!-- Danh sách Cây Category Cha - Con -->
    <div class="border-t border-slate-100 pt-3 space-y-1 max-h-[430px] overflow-y-auto pr-1">
      <div
        v-for="node in store.flattenedCategoryTree"
        :key="node.id"
        class="group flex items-center justify-between rounded-xl py-2 pr-2 text-xs font-bold transition-all cursor-pointer border"
        :class="[
          store.selectedFilter === node.id
            ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
            : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:border-slate-200'
        ]"
        :style="{ paddingLeft: `${node.depth * 18 + 10}px` }"
        @click="store.selectedFilter = node.id"
      >
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <span v-if="node.depth > 0" class="text-[10px] font-mono opacity-60">└─</span>
          <span class="shrink-0">{{ node.icon || '📌' }}</span>
          <span class="truncate" :title="`${node.name} (Ưu tiên: #${node.sortOrder})`">
            {{ node.name }}
          </span>
          <span
            class="text-[9px] font-mono px-1 rounded opacity-70"
            :class="store.selectedFilter === node.id ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-500'"
          >
            #{{ node.sortOrder }}
          </span>
        </div>

        <div class="flex items-center gap-1 shrink-0 ml-1" @click.stop>
          <span
            class="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black"
            :class="store.selectedFilter === node.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'"
          >
            {{ store.countImagesForCategoryNode(node.id) }}
          </span>

          <div class="hidden group-hover:flex items-center gap-0.5">
            <button
              type="button"
              @click="store.handleMoveCategoryOrder(node, -1)"
              class="w-5 h-5 rounded bg-slate-200/80 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer"
              title="Tăng mức ưu tiên (Đẩy lên)"
            >
              ▲
            </button>
            <button
              type="button"
              @click="store.handleMoveCategoryOrder(node, 1)"
              class="w-5 h-5 rounded bg-slate-200/80 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer"
              title="Giảm mức ưu tiên (Đẩy xuống)"
            >
              ▼
            </button>
            <button
              type="button"
              @click="store.openCreateCategoryModal(node.id)"
              class="w-5 h-5 rounded bg-emerald-500/20 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
              title="Thêm Category con trực thuộc mục này"
            >
              +
            </button>
            <button
              type="button"
              @click="store.openEditCategoryModal(node)"
              class="w-5 h-5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-900 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
              title="Chỉnh sửa Category"
            >
              ✏️
            </button>
            <button
              type="button"
              @click="store.handleSoftDeleteCategory(node)"
              class="w-5 h-5 rounded bg-rose-500/20 hover:bg-rose-600 text-rose-700 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
              title="Xóa mềm Category này"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách Category đã Xóa mềm -->
    <div v-if="store.showTrashedCategories" class="border-t border-rose-200 pt-3 space-y-1.5">
      <p class="text-[10px] font-black uppercase text-rose-600">
        🗑️ Category đã xóa mềm ({{ store.trashedCategoriesList.length }})
      </p>
      <div
        v-for="tCat in store.trashedCategoriesList"
        :key="tCat.id"
        class="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs"
      >
        <div class="truncate">
          <span class="font-bold text-rose-900">{{ tCat.icon }} {{ tCat.name }}</span>
          <span class="block text-[9px] font-mono text-rose-500">Xóa lúc: {{ tCat.deleted_at }}</span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            @click="store.handleRestoreCategory(tCat)"
            class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
          >
            Khôi phục
          </button>
          <button
            type="button"
            @click="store.handlePermanentDeleteCategory(tCat)"
            class="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black cursor-pointer"
            title="Xóa vĩnh viễn khỏi JSON"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
const store = useRefLibraryStore()
</script>
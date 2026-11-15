<!-- src/components/admin/tabs/ref_library/components/RefCategoryTreeSidebar.vue -->
<template>
    <!-- Sửa dòng thẻ <aside> mở đầu trong RefCategoryTreeSidebar.vue thành: -->
    <aside class="bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md space-y-2.5 flex flex-col h-full min-h-0 overflow-hidden">
    <!-- <aside class="bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md space-y-2.5 flex flex-col lg:sticky lg:-top-6 lg:h-[calc(100vh-1rem)] z-10"> -->
    
    <!-- =================================================================== -->
    <!-- ĐỈNH SIDEBAR: Tiêu đề + Nút Thu gọn Khung số 1 + Nút Tạo Category   --> 
    <!-- =================================================================== -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0 gap-2">
      <div class="min-w-0">
        <div class="flex items-center gap-1.5">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
            🌳 Cây Category
          </h3>
          <!-- Nút Bật/Tắt Thu gọn Khung số 1 -->
          <button
            type="button"
            @click="toggleTopPanel"
            class="px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 shrink-0"
            :class="isTopPanelCollapsed
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
            :title="isTopPanelCollapsed ? 'Mở rộng khung bộ lọc tổng quát' : 'Thu gọn khung bộ lọc để mở rộng tối đa Cây Category'"
          >
            <span>{{ isTopPanelCollapsed ? '▼ Mở lọc' : '▲ Thu gọn' }}</span>
          </button>
        </div>
        <p class="text-[10px] font-bold text-slate-400 mt-0.5">
          ✨ Bảng Ảo ({{ store.activeVirtualCategoriesList.length }}) • 💻 Bảng Thật ({{ store.activePhysicalCategoriesList.length }})
        </p>
      </div>

      <button
        type="button"
        @click="store.openCreateCategoryModal(null)"
        class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black shadow cursor-pointer shrink-0"
      >
        + Tạo Category
      </button>
    </div>

    <!-- =================================================================== -->
    <!-- KHI KHUNG SỐ 1 ĐANG THU GỌN: HIỆN THANH MINI-BAR 1 DÒNG SIÊU GỌN    -->
    <!-- =================================================================== -->
    <div
      v-if="isTopPanelCollapsed"
      class="px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-1 shrink-0 text-[10px] font-black"
    >
      <div class="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          @click="store.selectedFilter = 'ALL'"
          class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
          :class="store.selectedFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'"
          title="Tất cả ảnh hoạt động"
        >
          📁 {{ store.activeItemsList.length }}
        </button>

        <button
          type="button"
          @click="store.selectedFilter = 'FAVORITES'"
          class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
          :class="store.selectedFilter === 'FAVORITES' ? 'bg-[#ff005b] text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-pink-50'"
          title="Ảnh Đánh dấu quan trọng"
        >
          ⭐ {{ store.favoriteItemsCount }}
        </button>

        <button
          type="button"
          @click="store.selectedFilter = 'UNCATEGORIZED'"
          @dragover.prevent="store.handleDragOverCategory('UNCATEGORIZED', $event)"
          @dragleave="store.handleDragLeaveCategory('UNCATEGORIZED')"
          @drop.prevent="store.handleDropToCategory('UNCATEGORIZED')"
          class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
          :class="store.selectedFilter === 'UNCATEGORIZED' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'"
          title="Chưa phân loại (Category Ảo)"
        >
          ❓ {{ store.uncategorizedItemsCount }}
        </button>

        <button
          type="button"
          @click="store.selectedFilter = 'TRASH_ITEMS'"
          class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
          :class="store.selectedFilter === 'TRASH_ITEMS' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'"
          title="Thùng rác Ảnh (Xóa mềm)"
        >
          🗑️ {{ store.trashedItemsList.length }}
        </button>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button
          type="button"
          @click="store.expandAllCategories"
          class="px-1.5 py-1 rounded bg-white hover:bg-blue-50 text-slate-600 border border-slate-200 cursor-pointer"
          title="Mở rộng toàn bộ các nhánh con"
        >
          ▼
        </button>
        <button
          type="button"
          @click="store.collapseAllCategories"
          class="px-1.5 py-1 rounded bg-white hover:bg-blue-50 text-slate-600 border border-slate-200 cursor-pointer"
          title="Thu gọn toàn bộ các nhánh cha"
        >
          ◀
        </button>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- KHUNG SỐ 1 ĐẦY ĐỦ (HIỂN THỊ KHI CHƯA THU GỌN)                       -->
    <!-- =================================================================== -->
    <div v-show="!isTopPanelCollapsed" class="space-y-2.5 shrink-0">
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
          @dragover.prevent="store.handleDragOverCategory('UNCATEGORIZED', $event)"
          @dragleave="store.handleDragLeaveCategory('UNCATEGORIZED')"
          @drop.prevent="store.handleDropToCategory('UNCATEGORIZED')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border"
          :class="[
            store.dragOverCategoryId === 'UNCATEGORIZED'
              ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-400 scale-[1.01]'
              : (store.selectedFilter === 'UNCATEGORIZED'
                  ? 'bg-amber-500 text-slate-950 border-transparent'
                  : 'text-slate-600 border-transparent hover:bg-amber-50')
          ]"
        >
          <span>❓ Chưa phân loại (Category Ảo)</span>
          <span v-if="store.dragOverCategoryId === 'UNCATEGORIZED'" class="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-mono">
            📥 Thả để gỡ Cat Ảo
          </span>
          <span v-else class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ store.uncategorizedItemsCount }}</span>
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

      <!-- Thanh điều khiển Gồm Category con + Thu gọn / Mở rộng tất cả -->
      <div class="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
        <div class="flex items-center justify-between">
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

        <div class="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10px]">
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-black border border-indigo-200">✨ Bảng Ảo</span>
            <span class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-black border border-amber-300">💻 Bảng Thật 🔒</span>
          </div>
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="store.expandAllCategories"
              class="px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 font-black cursor-pointer"
            >
              ▼ Mở hết
            </button>
            <button
              type="button"
              @click="store.collapseAllCategories"
              class="px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 font-black cursor-pointer"
            >
              ◀ Thu gọn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nút Refresh nổi bật khi người dùng đang chọn 1 Category Thật trên ổ đĩa -->
    <div
      v-if="store.selectedPhysicalCategoryNode"
      class="p-2 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-2 shrink-0"
    >
      <div class="min-w-0">
        <span class="text-[9px] font-black uppercase tracking-wider text-amber-700 block">
          💻 Đang chọn Folder Thật (Chỉ đọc)
        </span>
        <p class="text-xs font-black text-slate-900 truncate">
          {{ store.selectedPhysicalCategoryNode.name }}
        </p>
      </div>
      <button
        type="button"
        :disabled="store.isScanning"
        @click="store.handleRefreshPhysicalCategory(store.selectedPhysicalCategoryNode)"
        class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-black shadow flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
        title="Quét lại thư mục này trên ổ đĩa Windows và đồng bộ sang các Category Ảo"
      >
        <span :class="{ 'animate-spin': store.isScanning }">🔄</span>
        <span>Refresh</span>
      </button>
    </div>

    <!-- Thông báo hướng dẫn nhanh khi người dùng đang nắm kéo ảnh -->
    <div
      v-if="store.draggingImageKeys?.length > 0"
      class="px-3 py-1.5 rounded-xl bg-emerald-50 border-2 border-dashed border-emerald-500 text-emerald-900 text-[11px] font-black flex items-center justify-between animate-pulse shrink-0"
    >
      <span>✋ Đang kéo {{ store.draggingImageKeys.length }} ảnh</span>
      <span class="text-[10px] text-emerald-700">Thả vào Category ✨ Ảo bên dưới</span>
    </div>

    <!-- =================================================================== -->
    <!-- DANH SÁCH CÂY CATEGORY: TÔ MÀU THEO NHÁNH GỐC (CON ĂN THEO MÀU CHA) -->
    <!-- =================================================================== -->
    <div class="border-t border-slate-100 pt-2 space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
      <div
        v-for="node in store.visibleCategoryTree"
        :key="node.id"
        @dragover.prevent="store.handleDragOverCategory(node, $event)"
        @dragleave="store.handleDragLeaveCategory(node.id)"
        @drop.prevent="store.handleDropToCategory(node)"
        class="group flex items-center justify-between rounded-xl py-2 pr-2 text-xs font-bold transition-all border"
        :class="[
          // Tạo khoảng cách nhỏ tách biệt giữa các Nhánh Cha Gốc (depth === 0)
          node.depth === 0 ? 'mt-2 first:mt-0' : '',
          getNodeVisualClasses(node)
        ]"
        :style="getNodeInlineStyle(node)"
        @click="store.selectedFilter = node.id"
      >
        <!-- Bên trái: Nhánh + Icon + Tên + Nhãn phân biệt -->
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <span
            v-if="node.depth > 0"
            class="text-[10px] font-mono font-black opacity-75"
          >
            └─
          </span>
          <span class="shrink-0">{{ node.isPhysicalFolder ? (node.hasChildren ? '📂' : '📁') : (node.icon || '📌') }}</span>
          <span
            class="truncate"
            :class="node.depth === 0 ? 'font-black' : 'font-bold'"
            :title="node.isPhysicalFolder
              ? `[Bảng Thật: cmg_ref_physical - Chỉ đọc] ${node.windowsFolderPath || node.name}`
              : `[Bảng Ảo: cmg_ref_virtual] ${node.name} (Ưu tiên: #${node.sortOrder})`"
          >
            {{ node.name }}
          </span>

          <span
            v-if="node.isPhysicalFolder"
            class="text-[9px] font-mono font-black px-1.5 py-0.2 rounded shrink-0 flex items-center gap-0.5"
            :class="store.selectedFilter === node.id
              ? 'bg-white/15 text-[#ffe600]'
              : 'bg-white/80 text-amber-900 border border-amber-300/80'"
            title="Folder thật trên ổ đĩa Windows (Chỉ đọc - Bấm 🔄 để làm mới từ ổ đĩa)"
          >
            💻🔒
          </span>
          <span
            v-else
            class="text-[9px] font-mono px-1 rounded shrink-0"
            :class="store.selectedFilter === node.id || store.dragOverCategoryId === node.id
              ? 'bg-black/20 text-white'
              : 'bg-white/80 text-indigo-800 border border-indigo-200/70'"
            title="Category Ảo (Hỗ trợ nhận ảnh kéo thả)"
          >
            ✨#{{ node.sortOrder }}
          </span>
        </div>

        <!-- Bên phải: Nút Collapse + Số lượng ảnh + Nút Refresh HOẶC Nút CRUD -->
        <div class="flex items-center gap-1 shrink-0 ml-1" @click.stop>
          <span
            v-if="store.dragOverCategoryId === node.id"
            class="px-1.5 py-0.5 rounded text-[9px] font-mono font-black"
            :class="node.isPhysicalFolder ? 'bg-rose-600 text-white' : 'bg-black/25 text-white'"
          >
            {{ node.isPhysicalFolder ? '🚫 Chỉ đọc' : `📥 Thả ${store.draggingImageKeys.length} ảnh` }}
          </span>

          <template v-else>
            <!-- Nút Tam giác Collapse / Expand -->
            <button
              v-if="node.hasChildren"
              type="button"
              @click.stop="store.toggleCategoryCollapse(node.id)"
              class="px-1.5 h-5 rounded-md text-[10px] font-black flex items-center gap-0.5 transition-all cursor-pointer border"
              :class="store.selectedFilter === node.id
                ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                : (node.isCollapsed
                    ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                    : 'bg-white/90 text-blue-700 border-blue-300 hover:bg-blue-50')"
              :title="node.isCollapsed ? `Mở rộng ${node.childrenCount} mục con` : `Thu gọn ${node.childrenCount} mục con`"
            >
              <span class="leading-none">{{ node.isCollapsed ? '◀' : '▼' }}</span>
              <span v-if="node.isCollapsed" class="text-[9px] font-mono">{{ node.childrenCount }}</span>
            </button>

            <!-- Số lượng ảnh -->
            <span
              class="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black"
              :class="store.selectedFilter === node.id
                ? 'bg-white/20 text-white'
                : 'bg-white/85 text-slate-800 border border-black/10'"
            >
              {{ store.countImagesForCategoryNode(node.id) }}
            </span>

            <!-- NẾU LÀ CATEGORY THẬT TRÊN Ổ ĐĨA: CHỈ HIỆN NÚT 🔄 REFRESH DATA -->
            <button
              v-if="node.isPhysicalFolder"
              type="button"
              :disabled="store.isScanning"
              @click.stop="store.handleRefreshPhysicalCategory(node)"
              class="w-5 h-5 rounded text-[10px] font-black flex items-center justify-center transition-all cursor-pointer"
              :class="store.selectedFilter === node.id
                ? 'bg-emerald-500 text-white shadow'
                : 'opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300'"
              :title="`🔄 Làm mới (Refresh) thư mục '${node.name}' từ ổ đĩa Windows & đồng bộ sang Category Ảo`"
            >
              🔄
            </button>

            <!-- NẾU LÀ CATEGORY ẢO: HIỆN CÁC NÚT THAO TÁC (▲ ▼ + ✏️ 🗑️) -->
            <div v-else class="hidden group-hover:flex items-center gap-0.5">
              <button
                type="button"
                @click="store.handleMoveCategoryOrder(node, -1)"
                class="w-5 h-5 rounded bg-white/90 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer border border-slate-300"
                title="Tăng mức ưu tiên (Đẩy lên)"
              >
                ▲
              </button>
              <button
                type="button"
                @click="store.handleMoveCategoryOrder(node, 1)"
                class="w-5 h-5 rounded bg-white/90 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer border border-slate-300"
                title="Giảm mức ưu tiên (Đẩy xuống)"
              >
                ▼
              </button>
              <button
                type="button"
                @click="store.openCreateCategoryModal(node.id)"
                class="w-5 h-5 rounded bg-white/90 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer border border-emerald-300"
                title="Thêm Category Ảo con trực thuộc mục này"
              >
                +
              </button>
              <button
                type="button"
                @click="store.openEditCategoryModal(node)"
                class="w-5 h-5 rounded bg-white/90 hover:bg-amber-500 text-amber-900 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer border border-amber-300"
                title="Chỉnh sửa Category Ảo"
              >
                ✏️
              </button>
              <button
                type="button"
                @click="store.handleSoftDeleteCategory(node)"
                class="w-5 h-5 rounded bg-white/90 hover:bg-rose-600 text-rose-700 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer border border-rose-300"
                title="Xóa mềm Category Ảo này"
              >
                🗑️
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Danh sách Category Ảo đã Xóa mềm -->
    <div v-if="store.showTrashedCategories" class="border-t border-rose-200 pt-3 space-y-1.5 max-h-40 overflow-y-auto shrink-0">
      <p class="text-[10px] font-black uppercase text-rose-600">
        🗑️ Category Ảo đã xóa mềm ({{ store.trashedCategoriesList.length }})
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
            title="Xóa vĩnh viễn khỏi Firebase"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'

const store = useRefLibraryStore()

// 1. Trạng thái Thu gọn / Mở rộng Khung số 1 (Lưu vào LocalStorage)
const TOP_PANEL_COLLAPSED_KEY = 'cmg_ref_sidebar_top_collapsed_v1'
const isTopPanelCollapsed = ref(localStorage.getItem(TOP_PANEL_COLLAPSED_KEY) === 'true')

const toggleTopPanel = () => {
  isTopPanelCollapsed.value = !isTopPanelCollapsed.value
  localStorage.setItem(TOP_PANEL_COLLAPSED_KEY, isTopPanelCollapsed.value ? 'true' : 'false')
}

// 2. Bảng 10 tông màu Nhánh Gốc (Root-Branch Palettes):
// Mỗi nhánh cha (depth = 0) mang 1 màu, toàn bộ nhánh con/cháu (depth > 0) ăn theo đúng tông màu của cha đó
const BRANCH_PALETTES = [
  {
    // 0: Cam Coral (Giống Vùng số 2)
    accentHex: '#f97316',
    rootClass: 'bg-orange-100/90 border-orange-300 text-orange-950 hover:bg-orange-200/80',
    childClass: 'bg-orange-50/80 border-orange-200/90 text-orange-900 hover:bg-orange-100/80'
  },
  {
    // 1: Vàng Amber (Giống Vùng số 3)
    accentHex: '#eab308',
    rootClass: 'bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-200/80',
    childClass: 'bg-amber-50/80 border-amber-200/90 text-amber-900 hover:bg-amber-100/80'
  },
  {
    // 2: Xanh Ngọc Lục Bảo (Emerald)
    accentHex: '#10b981',
    rootClass: 'bg-emerald-100/85 border-emerald-300 text-emerald-950 hover:bg-emerald-200/75',
    childClass: 'bg-emerald-50/75 border-emerald-200/90 text-emerald-900 hover:bg-emerald-100/75'
  },
  {
    // 3: Xanh Da Trời (Sky)
    accentHex: '#0ea5e9',
    rootClass: 'bg-sky-100/85 border-sky-300 text-sky-950 hover:bg-sky-200/75',
    childClass: 'bg-sky-50/75 border-sky-200/90 text-sky-900 hover:bg-sky-100/75'
  },
  {
    // 4: Tím Violet
    accentHex: '#8b5cf6',
    rootClass: 'bg-violet-100/85 border-violet-300 text-violet-950 hover:bg-violet-200/75',
    childClass: 'bg-violet-50/75 border-violet-200/90 text-violet-900 hover:bg-violet-100/75'
  },
  {
    // 5: Hồng Rose
    accentHex: '#f43f5e',
    rootClass: 'bg-rose-100/85 border-rose-300 text-rose-950 hover:bg-rose-200/75',
    childClass: 'bg-rose-50/75 border-rose-200/90 text-rose-900 hover:bg-rose-100/75'
  },
  {
    // 6: Xanh Cổ Vịt (Teal)
    accentHex: '#14b8a6',
    rootClass: 'bg-teal-100/85 border-teal-300 text-teal-950 hover:bg-teal-200/75',
    childClass: 'bg-teal-50/75 border-teal-200/90 text-teal-900 hover:bg-teal-100/75'
  },
  {
    // 7: Xanh Lá Mạ (Lime)
    accentHex: '#84cc16',
    rootClass: 'bg-lime-100/85 border-lime-300 text-lime-950 hover:bg-lime-200/75',
    childClass: 'bg-lime-50/75 border-lime-200/90 text-lime-900 hover:bg-lime-100/75'
  },
  {
    // 8: Tím Hồng (Fuchsia)
    accentHex: '#d946ef',
    rootClass: 'bg-fuchsia-100/85 border-fuchsia-300 text-fuchsia-950 hover:bg-fuchsia-200/75',
    childClass: 'bg-fuchsia-50/75 border-fuchsia-200/90 text-fuchsia-900 hover:bg-fuchsia-100/75'
  },
  {
    // 9: Xanh Chàm (Indigo)
    accentHex: '#6366f1',
    rootClass: 'bg-indigo-100/85 border-indigo-300 text-indigo-950 hover:bg-indigo-200/75',
    childClass: 'bg-indigo-50/75 border-indigo-200/90 text-indigo-900 hover:bg-indigo-100/75'
  }
]

const getPaletteForNode = (node) => {
  const idx = Math.abs(Number(node.branchIndex ?? 0)) % BRANCH_PALETTES.length
  return BRANCH_PALETTES[idx]
}

// Trả về class màu nền/viền cho từng mục Category (Hỗ trợ Drag-over, Selected & Màu nhánh Cha-Con)
const getNodeVisualClasses = (node) => {
  // 1. Khi đang kéo ảnh rê đè lên mục này
  if (store.dragOverCategoryId === node.id) {
    return node.isPhysicalFolder
      ? 'bg-rose-50 text-rose-700 border-2 border-dashed border-rose-500 cursor-not-allowed opacity-80'
      : 'bg-emerald-500 text-white border-2 border-emerald-600 ring-2 ring-emerald-300 scale-[1.01] shadow-md cursor-copy'
  }

  // 2. Khi mục này đang được bấm chọn (Active)
  if (store.selectedFilter === node.id) {
    return node.isPhysicalFolder
      ? 'bg-slate-900 text-[#ffe600] border-slate-950 shadow-sm cursor-pointer'
      : 'bg-blue-600 text-white border-blue-700 shadow-sm cursor-pointer'
  }

  // 3. Trạng thái bình thường: Tô màu theo Nhánh Cha (Item con ăn theo đúng màu của Item cha gốc)
  const palette = getPaletteForNode(node)
  return `${node.depth === 0 ? palette.rootClass : palette.childClass} cursor-pointer`
}

// Gắn vạch chỉ thị màu nhánh ở mép trái + Thụt lề theo cấp Cha-Con
const getNodeInlineStyle = (node) => {
  const palette = getPaletteForNode(node)
  return {
    paddingLeft: `${node.depth * 16 + 10}px`,
    borderLeftWidth: '5px',
    borderLeftColor: palette.accentHex
  }
}
</script>
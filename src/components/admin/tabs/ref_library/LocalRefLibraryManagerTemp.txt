<!-- src/components/admin/tabs/ref_library/LocalRefLibraryManager.vue -->
<template>
  <div class="space-y-5 select-none font-sans">

    <!-- ======================================================================= -->
    <!-- 1. THANH QUẢN LÝ ĐƯỜNG DẪN WINDOWS & BACKUP / ROLLBACK VERSION          -->
    <!-- ======================================================================= -->
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
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
                ✓ Lưu tại: src/data/ref_library.json (Cập nhật: {{ libraryData.updatedAt || 'Mới' }})
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Tổng cộng: {{ activeItemsList.length }} ảnh đang hoạt động • {{ trashedItemsList.length }} ảnh trong thùng rác
            </h2>
          </div>
        </div>

        <!-- Cụm nút Backup & Rollback (Hoàn tác về phiên bản trước) -->
        <div class="flex flex-wrap items-center gap-2">
          <div v-if="backupMeta" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
            <span class="font-black">🛡️ Bản Backup gần nhất:</span>
            <span class="font-mono ml-1">{{ backupMeta.updatedAt }}</span>
            <span class="opacity-75 ml-1">({{ backupMeta.backupReason }})</span>
          </div>

          <button
            type="button"
            @click="handleManualBackup"
            class="px-3.5 py-2 rounded-xl border-2 border-[#8470FF] bg-white hover:bg-blue-50 text-slate-800 text-xs font-black cursor-pointer transition-colors"
            title="Tạo bản sao lưu sang ref_library_backup.json ngay lập tức"
          >
            🛡️ Sao lưu Backup
          </button>

          <button
            type="button"
            :disabled="!backupMeta"
            @click="handleRollbackBackup"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-black shadow cursor-pointer transition-colors flex items-center gap-1.5"
            title="Khôi phục lại dữ liệu từ file ref_library_backup.json"
          >
            <span>⏪</span>
            <span>Back lại Version trước</span>
          </button>
        </div>
      </div>

      <!-- Dòng Nhập / Chọn Đường dẫn Folder Vật lý trên Windows & Gán thẳng vào Category -->
      <div class="pt-3 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <div class="lg:col-span-5 flex items-center gap-2">
          <input
            v-model="folderPathInput"
            type="text"
            placeholder="VD: D:\Assets_Tham_Khao\9af17b4bfe54bb33"
            class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div class="lg:col-span-3">
          <select
            v-model="importTargetCategoryId"
            class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-black text-slate-700 bg-slate-50"
          >
            <option value="__AUTO_FOLDER__">✨ Tự tạo/gán Category theo tên Folder</option>
            <option value="">❓ Để ở mục Chưa phân loại</option>
            <option v-for="node in flattenedCategoryTree" :key="node.id" :value="node.id">
              {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
            </option>
          </select>
        </div>

        <div class="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            :disabled="isScanning"
            @click="handlePickWindowsFolderDialog"
            class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow cursor-pointer flex items-center gap-1.5"
          >
            <span>📂</span>
            <span>{{ isScanning ? 'Đang mở hộp thoại...' : 'Chọn Folder trên Windows' }}</span>
          </button>

          <button
            type="button"
            :disabled="!folderPathInput.trim() || isScanning"
            @click="handleScanTypedFolderPath"
            class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black cursor-pointer transition-colors"
          >
            ↻ Quét Đường dẫn này
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- 2. BỐ CỤC CHÍNH: CÂY CATEGORY CHA-CON (TRÁI) & LƯỚI ẢNH (PHẢI)         -->
    <!-- ======================================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- CỘT TRÁI (4/12): CÂY CATEGORY CHA - CON & QUẢN LÝ CATEGORY -->
      <aside class="lg:col-span-4 bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md space-y-4">
        
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
            @click="openCreateCategoryModal(null)"
            class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black shadow cursor-pointer"
          >
            + Tạo Category
          </button>
        </div>

        <!-- Bộ lọc tổng quát -->
        <div class="space-y-1">
          <button
            type="button"
            @click="selectedFilter = 'ALL'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
            :class="selectedFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            <span>📁 Tất cả ảnh hoạt động</span>
            <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">{{ activeItemsList.length }}</span>
          </button>

          <button
            type="button"
            @click="selectedFilter = 'FAVORITES'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
            :class="selectedFilter === 'FAVORITES' ? 'bg-[#ff005b] text-white' : 'text-slate-600 hover:bg-pink-50'"
          >
            <span>⭐ Ảnh Đánh dấu quan trọng</span>
            <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ favoriteItemsCount }}</span>
          </button>

          <button
            type="button"
            @click="selectedFilter = 'UNCATEGORIZED'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
            :class="selectedFilter === 'UNCATEGORIZED' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-amber-50'"
          >
            <span>❓ Chưa phân loại</span>
            <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ uncategorizedItemsCount }}</span>
          </button>

          <button
            type="button"
            @click="selectedFilter = 'TRASH_ITEMS'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
            :class="selectedFilter === 'TRASH_ITEMS' ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'"
          >
            <span>🗑️ Thùng rác Ảnh (Xóa mềm)</span>
            <span class="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-mono">{{ trashedItemsList.length }}</span>
          </button>
        </div>

        <!-- Tùy chọn bao gồm cả ảnh của Category con khi bấm vào Category cha -->
        <div class="px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <label class="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer">
            <input type="checkbox" v-model="includeSubcategoriesInView" class="w-3.5 h-3.5 accent-blue-600" />
            <span>Gồm cả ảnh của Category con</span>
          </label>
          <button
            type="button"
            @click="showTrashedCategories = !showTrashedCategories"
            class="text-[10px] font-black underline cursor-pointer"
            :class="showTrashedCategories ? 'text-rose-600' : 'text-slate-400'"
          >
            {{ showTrashedCategories ? 'Ẩn Cat đã xóa' : `Cat đã xóa (${trashedCategoriesCount})` }}
          </button>
        </div>

        <!-- DANH SÁCH CÂY CATEGORY CHA - CON -->
        <div class="border-t border-slate-100 pt-3 space-y-1 max-h-[430px] overflow-y-auto pr-1">
          <div
            v-for="node in flattenedCategoryTree"
            :key="node.id"
            class="group flex items-center justify-between rounded-xl py-2 pr-2 text-xs font-bold transition-all cursor-pointer border"
            :class="[
              selectedFilter === node.id
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:border-slate-200'
            ]"
            :style="{ paddingLeft: `${node.depth * 18 + 10}px` }"
            @click="selectedFilter = node.id"
          >
            <!-- Nhánh cây + Icon + Tên Category -->
            <div class="flex items-center gap-1.5 min-w-0 flex-1">
              <span v-if="node.depth > 0" class="text-[10px] font-mono opacity-60">└─</span>
              <span class="shrink-0">{{ node.icon || '📌' }}</span>
              <span class="truncate" :title="`${node.name} (Ưu tiên: #${node.sortOrder})`">
                {{ node.name }}
              </span>
              <span
                class="text-[9px] font-mono px-1 rounded opacity-70"
                :class="selectedFilter === node.id ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-500'"
              >
                #{{ node.sortOrder }}
              </span>
            </div>

            <!-- Cụm nút thao tác nhanh trên từng nút Cây Category -->
            <div class="flex items-center gap-1 shrink-0 ml-1" @click.stop>
              <!-- Đếm số lượng ảnh -->
              <span
                class="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black"
                :class="selectedFilter === node.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'"
              >
                {{ countImagesForCategoryNode(node.id) }}
              </span>

              <!-- Nút Tăng/Giảm thứ tự ưu tiên (Chỉ hiện khi di chuột) -->
              <div class="hidden group-hover:flex items-center gap-0.5">
                <button
                  type="button"
                  @click="handleMoveCategoryOrder(node, -1)"
                  class="w-5 h-5 rounded bg-slate-200/80 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer"
                  title="Tăng mức ưu tiên (Đẩy lên)"
                >
                  ▲
                </button>
                <button
                  type="button"
                  @click="handleMoveCategoryOrder(node, 1)"
                  class="w-5 h-5 rounded bg-slate-200/80 hover:bg-slate-900 text-slate-700 hover:text-white text-[9px] font-black flex items-center justify-center cursor-pointer"
                  title="Giảm mức ưu tiên (Đẩy xuống)"
                >
                  ▼
                </button>
                <button
                  type="button"
                  @click="openCreateCategoryModal(node.id)"
                  class="w-5 h-5 rounded bg-emerald-500/20 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
                  title="Thêm Category con trực thuộc mục này"
                >
                  +
                </button>
                <button
                  type="button"
                  @click="openEditCategoryModal(node)"
                  class="w-5 h-5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-900 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
                  title="Chỉnh sửa Category (Tên, Cha-Con, Độ ưu tiên)"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  @click="handleSoftDeleteCategory(node)"
                  class="w-5 h-5 rounded bg-rose-500/20 hover:bg-rose-600 text-rose-700 hover:text-white text-[10px] font-black flex items-center justify-center cursor-pointer"
                  title="Xóa mềm Category này"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Danh sách Category đã Xóa mềm (Khi bật xem thùng rác Category) -->
        <div v-if="showTrashedCategories" class="border-t border-rose-200 pt-3 space-y-1.5">
          <p class="text-[10px] font-black uppercase text-rose-600">
            🗑️ Category đã xóa mềm ({{ trashedCategoriesList.length }})
          </p>
          <div
            v-for="tCat in trashedCategoriesList"
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
                @click="handleRestoreCategory(tCat)"
                class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
              >
                Khôi phục
              </button>
              <button
                type="button"
                @click="handlePermanentDeleteCategory(tCat)"
                class="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black cursor-pointer"
                title="Xóa vĩnh viễn khỏi JSON"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

      </aside>

      <!-- CỘT PHẢI (8/12): THANH LỌC, THAO TÁC HÀNG LOẠT & LƯỚI ẢNH VẬT LÝ -->
      <div class="lg:col-span-8 space-y-4">

        <!-- Thanh công cụ Tìm kiếm & Thao tác hàng loạt -->
        <div class="bg-white rounded-3xl border-2 border-[#8470FF] p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1 min-w-[220px]">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Tìm theo tên file hoặc đường dẫn Windows (VD: D:\, Prop_, .webp)..."
              class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-600"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-500 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="toggleSelectAllVisible"
              class="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-700 cursor-pointer"
            >
              {{ selectedKeys.length === filteredImages.length && filteredImages.length > 0 ? 'Bỏ chọn tất cả' : `Chọn tất cả (${filteredImages.length})` }}
            </button>

            <template v-if="selectedKeys.length > 0">
              <select
                v-model="batchTargetCatId"
                class="border-2 border-blue-600 rounded-xl px-3 py-2 text-xs font-black text-blue-700 bg-blue-50/50"
              >
                <option value="">-- Chuyển {{ selectedKeys.length }} ảnh sang Category --</option>
                <option v-for="node in flattenedCategoryTree" :key="node.id" :value="node.id">
                  {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
                </option>
                <option value="__CLEAR__">❓ Bỏ phân loại (Uncategorized)</option>
              </select>

              <button
                type="button"
                @click="handleBatchAssignCategory"
                class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shadow"
              >
                Gán Category ({{ selectedKeys.length }})
              </button>

              <button
                v-if="selectedFilter !== 'TRASH_ITEMS'"
                type="button"
                @click="handleBatchSoftDeleteItems"
                class="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer shadow"
              >
                🗑️ Xóa mềm ({{ selectedKeys.length }})
              </button>
            </template>
          </div>
        </div>

        <!-- LƯỚI HIỂN THỊ ẢNH TRỰC TIẾP TỪ ĐƯỜNG DẪN VẬT LÝ WINDOWS -->
        <div
          v-if="filteredImages.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <div
            v-for="img in filteredImages"
            :key="img.key"
            class="group bg-white rounded-2xl border-2 transition-all overflow-hidden flex flex-col shadow-xs hover:shadow-xl"
            :class="selectedKeys.includes(img.key) ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-[#8470FF]'"
          >
            <!-- Khung Ảnh -->
            <div class="relative aspect-square bg-slate-100 overflow-hidden">
              <img
                v-if="img.windowsPath"
                :src="getImageStreamUrl(img)"
                :alt="img.fileName"
                loading="lazy"
                @click="previewingItem = img"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
                <span class="text-2xl mb-1">⚠️</span>
                <span class="text-[11px] font-bold">Bản ghi cũ chưa có đường dẫn vật lý. Hãy bấm "Quét Đường dẫn" để cập nhật!</span>
              </div>

              <!-- Checkbox chọn nhiều -->
              <label
                class="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg bg-white/90 border border-slate-300 flex items-center justify-center cursor-pointer shadow"
                @click.stop
              >
                <input
                  type="checkbox"
                  :value="img.key"
                  v-model="selectedKeys"
                  class="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </label>

              <!-- Nút Đánh dấu sao (Có ConfirmDialog) -->
              <button
                type="button"
                @click.stop="handleToggleFavorite(img)"
                class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/75 hover:bg-slate-900 text-xs flex items-center justify-center cursor-pointer"
                :title="img.isFavorite ? 'Bỏ đánh dấu sao' : 'Đánh dấu quan trọng'"
              >
                <span>{{ img.isFavorite ? '⭐' : '☆' }}</span>
              </button>

              <!-- Nhãn Category hiện tại trên góc đáy ảnh -->
              <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                <span class="px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold truncate">
                  {{ getCategoryLabel(img.categoryId) }}
                </span>
              </div>
            </div>

            <!-- Chi tiết Đường dẫn Vật lý Windows, Timestamps & Nút thao tác -->
            <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
              <div class="space-y-1">
                <div class="flex items-start justify-between gap-1.5">
                  <p class="text-xs font-mono font-black text-slate-900 break-all leading-snug" :title="img.fileName">
                    {{ img.fileName }}
                  </p>
                  <button
                    v-if="!img.deleted_at && img.windowsPath"
                    type="button"
                    @click="openRenameModal(img)"
                    class="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-300 text-amber-900 text-[10px] font-black cursor-pointer"
                    title="Đổi tên file trực tiếp trên ổ đĩa Windows"
                  >
                    ✏️ Đổi tên
                  </button>
                </div>

                <!-- Đường dẫn vật lý trên ổ đĩa Windows -->
                <p
                  class="text-[10px] font-mono text-blue-700 bg-blue-50/70 px-2 py-1 rounded border border-blue-100 break-all leading-tight"
                  :title="img.windowsPath"
                >
                  💻 {{ img.windowsPath || 'Chưa gắn đường dẫn ổ đĩa' }}
                </p>

                <!-- Timestamps created_at / updated_at / deleted_at -->
                <div class="text-[9px] font-mono text-slate-400 flex flex-wrap justify-between gap-1 pt-0.5">
                  <span>Tạo: {{ img.created_at || '—' }}</span>
                  <span>Sửa: {{ img.updated_at || '—' }}</span>
                </div>
                <div v-if="img.deleted_at" class="text-[10px] font-mono font-bold text-rose-600">
                  🗑️ Xóa mềm lúc: {{ img.deleted_at }}
                </div>
              </div>

              <!-- Đổi Category hoặc Khôi phục từ Thùng rác -->
              <div class="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                <template v-if="!img.deleted_at">
                  <select
                    :value="img.categoryId || ''"
                    @change="handleSingleCategoryChange(img, $event.target.value, $event)"
                    class="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] font-bold bg-slate-50 hover:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">❓ Chưa phân loại</option>
                    <option v-for="node in flattenedCategoryTree" :key="node.id" :value="node.id">
                      {{ '—'.repeat(node.depth) }} {{ node.icon }} {{ node.name }}
                    </option>
                  </select>

                  <button
                    type="button"
                    @click="handleSoftDeleteSingleItem(img)"
                    class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-black cursor-pointer transition-colors"
                    title="Đưa ảnh này vào Thùng rác (Xóa mềm trong JSON, không xóa file trên Windows)"
                  >
                    🗑️
                  </button>
                </template>

                <template v-else>
                  <button
                    type="button"
                    @click="handleRestoreSingleItem(img)"
                    class="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black cursor-pointer"
                  >
                    ♻️ Khôi phục ảnh
                  </button>
                  <button
                    type="button"
                    @click="handlePermanentDeleteSingleItem(img)"
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
    </div>

    <!-- ======================================================================= -->
    <!-- 3. MODAL TẠO / CẬP NHẬT CATEGORY (TÊN, THỨ TỰ ƯU TIÊN, QUAN HỆ CHA-CON)-->
    <!-- ======================================================================= -->
    <div
      v-if="categoryModal.show"
      class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl border-2 border-[#8470FF] max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-blue-600">
              Quản lý Cây Danh Mục Ảo
            </span>
            <h3 class="text-base font-black text-slate-900">
              {{ categoryModal.isEdit ? `Chỉnh sửa Category: ${categoryModal.form.name}` : 'Tạo Category Ảo Mới' }}
            </h3>
          </div>
          <button
            type="button"
            @click="categoryModal.show = false"
            class="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3.5">
          <div class="grid grid-cols-4 gap-3">
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Biểu tượng</label>
              <input
                v-model="categoryModal.form.icon"
                type="text"
                maxlength="4"
                class="w-full border-2 border-[#8470FF] rounded-xl px-2 py-2 text-center text-base"
              />
            </div>
            <div class="col-span-3">
              <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Tên Category *</label>
              <input
                v-model="categoryModal.form.name"
                type="text"
                placeholder="VD: Floating Islands..."
                class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <!-- Chọn Category Cha (Parent Category) -->
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
              🌳 Thuộc Category Cha (Quan hệ Cha - Con)
            </label>
            <select
              v-model="categoryModal.form.parentId"
              class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option :value="null">🌟 Category Gốc (Root - Không có cha)</option>
              <option
                v-for="opt in availableParentCategoryOptions"
                :key="opt.id"
                :value="opt.id"
              >
                {{ '—'.repeat(opt.depth) }} {{ opt.icon }} {{ opt.name }}
              </option>
            </select>
          </div>

          <!-- Thứ tự ưu tiên (sortOrder) -->
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
              🔢 Thứ tự ưu tiên hiển thị (Số nhỏ xếp trên)
            </label>
            <input
              v-model.number="categoryModal.form.sortOrder"
              type="number"
              min="1"
              class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-mono font-black text-blue-600"
            />
          </div>

          <div v-if="categoryModal.isEdit" class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-500 space-y-0.5">
            <div>ID: <strong>{{ categoryModal.form.id }}</strong></div>
            <div>created_at: <strong>{{ categoryModal.form.created_at }}</strong></div>
            <div>updated_at: <strong>{{ categoryModal.form.updated_at }}</strong></div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="categoryModal.show = false"
            class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            @click="handleSubmitCategoryModal"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg cursor-pointer"
          >
            💾 {{ categoryModal.isEdit ? 'Lưu cập nhật Category' : 'Tạo Category mới' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- 4. MODAL ĐỔI TÊN FILE TRÊN Ổ CỨNG WINDOWS                               -->
    <!-- ======================================================================= -->
    <div
      v-if="renamingItem"
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
            @click="renamingItem = null"
            class="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
          <img :src="getImageStreamUrl(renamingItem)" class="w-14 h-14 rounded-xl object-cover border" />
          <div class="text-xs overflow-hidden">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Đường dẫn hiện tại:</p>
            <p class="font-mono font-black text-slate-700 break-all text-[11px]">{{ renamingItem.windowsPath }}</p>
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
              @click="applyPrefixToRename(prefix)"
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
              @keyup.enter="handleConfirmRenameOnWindows"
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
            @click="renamingItem = null"
            class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-600 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            @click="handleConfirmRenameOnWindows"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg cursor-pointer"
          >
            💾 Tiếp tục &amp; Xác nhận Đổi tên
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- 5. LIGHTBOX PHÓNG TO ẢNH                                                -->
    <!-- ======================================================================= -->
    <div
      v-if="previewingItem"
      class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="previewingItem = null"
    >
      <div class="bg-slate-900 border-2 border-[#8470FF] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
        <div class="px-5 py-3 bg-slate-950 text-white flex items-center justify-between">
          <div class="truncate pr-4">
            <p class="text-[10px] font-mono text-sky-400">
              {{ previewingItem.windowsPath }}
            </p>
            <h4 class="text-sm font-mono font-black truncate">{{ previewingItem.fileName }}</h4>
          </div>
          <button
            type="button"
            @click="previewingItem = null"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 text-white text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div class="p-4 flex items-center justify-center max-h-[80vh] bg-slate-900">
          <img :src="getImageStreamUrl(previewingItem)" class="max-h-[75vh] w-auto object-contain rounded-xl" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useNotificationStore } from '../../../../stores/useNotificationStore'

const notify = useNotificationStore()

// Tự động gắn base '/cutemagic-website' của Vite để không bao giờ bị lỗi Unexpected token 'T'
const API_BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/__ref_library`

// State chính của Thư viện JSON
const libraryData = ref({
  version: 2,
  lastFolderPath: '',
  updatedAt: '',
  categories: [],
  items: {}
})
const backupMeta = ref(null)

// Đường dẫn folder Windows & Trạng thái quét
const folderPathInput = ref('')
const importTargetCategoryId = ref('__AUTO_FOLDER__')
const isScanning = ref(false)

// Bộ lọc & Chọn hàng loạt
const selectedFilter = ref('ALL')
const includeSubcategoriesInView = ref(true)
const showTrashedCategories = ref(false)
const searchQuery = ref('')
const selectedKeys = ref([])
const batchTargetCatId = ref('')

// Modal Thêm/Sửa Category (Hỗ trợ Cây Cha - Con & Thứ tự ưu tiên)
const categoryModal = ref({
  show: false,
  isEdit: false,
  form: {
    id: '',
    name: '',
    icon: '📌',
    parentId: null,
    sortOrder: 1,
    created_at: '',
    updated_at: '',
    deleted_at: null
  }
})

// Modal Đổi tên file trên Windows & Lightbox
const renamingItem = ref(null)
const renameBaseName = ref('')
const renameExt = ref('')
const renameInputRef = ref(null)
const previewingItem = ref(null)

const getNowStr = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// const getImageStreamUrl = (img) => {
//   if (!img?.windowsPath) return ''
//   return `/__ref_library/image?path=${encodeURIComponent(img.windowsPath)}&v=${encodeURIComponent(img.updated_at || '')}`
// }
const getImageStreamUrl = (img) => {
  if (!img?.windowsPath) return ''
  return `${API_BASE}/image?path=${encodeURIComponent(img.windowsPath)}&v=${encodeURIComponent(img.updated_at || '')}`
}

// ============================================================================
// 1. NẠP & LƯU DỮ LIỆU QUA VITE MIDDLEWARE (KHÔNG BỊ HMR RELOAD MẤT ẢNH)
// ============================================================================
const loadLibraryFromDisk = async () => {
  try {
    const res = await fetch(`${API_BASE}/load`)
    const json = await res.json()
    if (json.ok && json.data) {
      const raw = json.data
      const now = getNowStr()

      // Chuẩn hóa các Category cũ (Bổ sung parentId, sortOrder, created_at, updated_at, deleted_at nếu thiếu)
      raw.categories = (raw.categories || []).map((cat, idx) => ({
        id: cat.id,
        name: cat.name || 'Unnamed',
        icon: cat.icon || '📌',
        parentId: cat.parentId || null,
        sortOrder: Number(cat.sortOrder ?? (idx + 1)),
        created_at: cat.created_at || now,
        updated_at: cat.updated_at || now,
        deleted_at: cat.deleted_at || null
      }))

      // Chuẩn hóa các Item ảnh trong JSON
      const normalizedItems = {}
      Object.entries(raw.items || {}).forEach(([key, val]) => {
        const isWinPath = /^[a-zA-Z]:\\/.test(key) || /^[a-zA-Z]:\//.test(key)
        const fileName = val.fileName || (isWinPath ? key.split(/[\\/]/).pop() : key)
        normalizedItems[key] = {
          key,
          fileName,
          windowsPath: val.windowsPath || (isWinPath ? key : ''),
          folderPath: val.folderPath || '',
          categoryId: val.categoryId || '',
          isFavorite: Boolean(val.isFavorite),
          created_at: val.created_at || now,
          updated_at: val.updated_at || now,
          deleted_at: val.deleted_at || null
        }
      })
      raw.items = normalizedItems

      libraryData.value = raw
      backupMeta.value = json.backupMeta || null
      if (raw.lastFolderPath && !folderPathInput.value) {
        folderPathInput.value = raw.lastFolderPath
      }
    }
  } catch (err) {
    notify.error('Lỗi đọc file ref_library.json', err.message)
  }
}

const saveLibraryToDisk = async (reason = 'Cập nhật thư viện ảnh tham khảo') => {
  try {
    const res = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason,
        data: libraryData.value
      })
    })
    const json = await res.json()
    if (json.ok) {
      libraryData.value.updatedAt = json.data.updatedAt
      backupMeta.value = json.backupMeta
      return true
    }
    throw new Error(json.error || 'Không thể lưu file JSON')
  } catch (err) {
    notify.error('Lỗi lưu JSON', err.message)
    return false
  }
}

// ============================================================================
// 2. XÂY DỰNG CÂY CATEGORY CHA - CON (TREE HIERARCHY & PRIORITY ORDER)
// ============================================================================
const activeCategoriesList = computed(() =>
  (libraryData.value.categories || [])
    .filter(c => !c.deleted_at)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
)

const trashedCategoriesList = computed(() =>
  (libraryData.value.categories || []).filter(c => Boolean(c.deleted_at))
)

const trashedCategoriesCount = computed(() => trashedCategoriesList.value.length)

// Trải phẳng cây Cha-Con theo đệ quy kèm thuộc tính `depth` để hiển thị thụt lề
const flattenedCategoryTree = computed(() => {
  const list = activeCategoriesList.value
  const validIds = new Set(list.map(c => c.id))
  const result = []
  const visited = new Set()

  const walk = (parentId = null, depth = 0) => {
    const children = list
      .filter(c => {
        const effectiveParent = (c.parentId && validIds.has(c.parentId) && c.parentId !== c.id) ? c.parentId : null
        return effectiveParent === parentId
      })
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

    for (const child of children) {
      if (visited.has(child.id)) continue
      visited.add(child.id)
      result.push({ ...child, depth })
      walk(child.id, depth + 1)
    }
  }

  walk(null, 0)
  return result
})

// Lấy tất cả ID con cháu của 1 Category (Phục vụ lọc bao gồm Category con & chống vòng lặp cha-con)
const getDescendantCategoryIds = (rootCatId) => {
  const descendants = new Set([rootCatId])
  let added = true
  while (added) {
    added = false
    for (const cat of activeCategoriesList.value) {
      if (cat.parentId && descendants.has(cat.parentId) && !descendants.has(cat.id)) {
        descendants.add(cat.id)
        added = true
      }
    }
  }
  return descendants
}

const availableParentCategoryOptions = computed(() => {
  if (!categoryModal.value.isEdit) return flattenedCategoryTree.value
  const forbiddenIds = getDescendantCategoryIds(categoryModal.value.form.id)
  return flattenedCategoryTree.value.filter(node => !forbiddenIds.has(node.id))
})

const getCategoryLabel = (catId) => {
  if (!catId) return '❓ Chưa phân loại'
  const found = (libraryData.value.categories || []).find(c => c.id === catId)
  return found ? `${found.icon || '📌'} ${found.name}` : '❓ Chưa phân loại'
}

// ============================================================================
// 3. DANH SÁCH ITEM ẢNH & BỘ ĐẾM THEO CÂY CATEGORY
// ============================================================================
const allItemsArray = computed(() =>
  Object.entries(libraryData.value.items || {}).map(([key, val]) => ({
    ...val,
    key
  }))
)

const activeItemsList = computed(() => allItemsArray.value.filter(i => !i.deleted_at))
const trashedItemsList = computed(() => allItemsArray.value.filter(i => Boolean(i.deleted_at)))
const favoriteItemsCount = computed(() => activeItemsList.value.filter(i => i.isFavorite).length)
const uncategorizedItemsCount = computed(() => activeItemsList.value.filter(i => !i.categoryId).length)

const countImagesForCategoryNode = (catId) => {
  if (includeSubcategoriesInView.value) {
    const allowedSet = getDescendantCategoryIds(catId)
    return activeItemsList.value.filter(i => allowedSet.has(i.categoryId)).length
  }
  return activeItemsList.value.filter(i => i.categoryId === catId).length
}

const filteredImages = computed(() => {
  let list = selectedFilter.value === 'TRASH_ITEMS'
    ? [...trashedItemsList.value]
    : [...activeItemsList.value]

  if (selectedFilter.value === 'FAVORITES') {
    list = list.filter(i => i.isFavorite)
  } else if (selectedFilter.value === 'UNCATEGORIZED') {
    list = list.filter(i => !i.categoryId)
  } else if (!['ALL', 'TRASH_ITEMS'].includes(selectedFilter.value)) {
    if (includeSubcategoriesInView.value) {
      const allowedSet = getDescendantCategoryIds(selectedFilter.value)
      list = list.filter(i => allowedSet.has(i.categoryId))
    } else {
      list = list.filter(i => i.categoryId === selectedFilter.value)
    }
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(i =>
      (i.fileName || '').toLowerCase().includes(q) ||
      (i.windowsPath || '').toLowerCase().includes(q)
    )
  }

  return list.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || '', undefined, { numeric: true }))
})

// ============================================================================
// 4. QUÉT FOLDER WINDOWS & LƯU ĐƯỜNG DẪN VẬT LÝ VÀO JSON (CÓ CONFIRM DIALOG)
// ============================================================================
const integrateScannedFilesIntoJson = async (folderPath, folderName, files) => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận nạp đường dẫn vật lý từ Windows?',
    message: `Hệ thống tìm thấy ${files.length} file hình ảnh trong thư mục Windows. Bạn có muốn đồng bộ đường dẫn vật lý của chúng vào ref_library.json không?`,
    highlightText: `${folderPath} (${files.length} ảnh)`,
    confirmText: 'Đồng ý Nạp & Lưu JSON',
    cancelText: 'Hủy bỏ',
    variant: 'info',
    icon: '📂'
  })
  if (!confirmed) return

  const now = getNowStr()
  let targetCatId = importTargetCategoryId.value

  // Nếu chọn tự động tạo/gán Category theo tên Folder
  if (targetCatId === '__AUTO_FOLDER__') {
    const existingCat = activeCategoriesList.value.find(
      c => c.name.toLowerCase() === folderName.toLowerCase()
    )
    if (existingCat) {
      targetCatId = existingCat.id
    } else {
      targetCatId = `cat_${folderName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString().slice(-3)}`
      const maxOrder = activeCategoriesList.value.reduce((m, c) => Math.max(m, Number(c.sortOrder || 0)), 0)
      libraryData.value.categories.push({
        id: targetCatId,
        name: folderName,
        icon: '📌',
        parentId: null,
        sortOrder: maxOrder + 1,
        created_at: now,
        updated_at: now,
        deleted_at: null
      })
    }
  }

  // Đồng bộ từng file với khóa chính là đường dẫn vật lý `windowsPath`
  files.forEach(fileObj => {
    const winKey = fileObj.windowsPath
    const legacyRecord = libraryData.value.items[fileObj.fileName]
    const existingRecord = libraryData.value.items[winKey] || legacyRecord

    libraryData.value.items[winKey] = {
      key: winKey,
      fileName: fileObj.fileName,
      windowsPath: fileObj.windowsPath,
      folderPath: fileObj.folderPath,
      categoryId: existingRecord?.categoryId || targetCatId || '',
      isFavorite: Boolean(existingRecord?.isFavorite),
      created_at: existingRecord?.created_at || now,
      updated_at: now,
      deleted_at: existingRecord?.deleted_at || null
    }

    // Xóa khóa ngắn kiểu cũ (VD: "1.webp") sau khi đã nâng cấp lên đường dẫn vật lý đầy đủ
    if (legacyRecord && winKey !== fileObj.fileName) {
      delete libraryData.value.items[fileObj.fileName]
    }
  })

  libraryData.value.lastFolderPath = folderPath
  folderPathInput.value = folderPath
  if (targetCatId) selectedFilter.value = targetCatId

  await saveLibraryToDisk(`Quét thư mục Windows: ${folderName} (${files.length} ảnh)`)
  notify.success('Đã nạp thành công!', `Đã lưu đường dẫn vật lý của ${files.length} ảnh vào ref_library.json.`)
}

const handlePickWindowsFolderDialog = async () => {
  isScanning.value = true
  try {
    const res = await fetch(`${API_BASE}/pick_windows_folder`)
    const json = await res.json()
    if (json.ok && json.files) {
      await integrateScannedFilesIntoJson(json.folderPath, json.folderName, json.files)
    }
  } catch (err) {
    notify.error('Không thể mở hộp thoại Windows', err.message)
  } finally {
    isScanning.value = false
  }
}

const handleScanTypedFolderPath = async () => {
  if (!folderPathInput.value.trim()) return
  isScanning.value = true
  try {
    const res = await fetch(`${API_BASE}/scan_folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderPath: folderPathInput.value.trim() })
    })
    const json = await res.json()
    if (!json.ok) {
      notify.error('Đường dẫn không tồn tại', json.error)
      return
    }
    await integrateScannedFilesIntoJson(json.folderPath, json.folderName, json.files)
  } catch (err) {
    notify.error('Lỗi quét thư mục', err.message)
  } finally {
    isScanning.value = false
  }
}

// ============================================================================
// 5. CRUD CÂY CATEGORY CHA - CON (CÓ CONFIRM DIALOG CHO MỌI THAO TÁC)
// ============================================================================
const openCreateCategoryModal = (defaultParentId = null) => {
  const maxOrder = activeCategoriesList.value.reduce((m, c) => Math.max(m, Number(c.sortOrder || 0)), 0)
  categoryModal.value = {
    show: true,
    isEdit: false,
    form: {
      id: '',
      name: '',
      icon: '📌',
      parentId: defaultParentId,
      sortOrder: maxOrder + 1,
      created_at: '',
      updated_at: '',
      deleted_at: null
    }
  }
}

const openEditCategoryModal = (catNode) => {
  categoryModal.value = {
    show: true,
    isEdit: true,
    form: {
      id: catNode.id,
      name: catNode.name,
      icon: catNode.icon || '📌',
      parentId: catNode.parentId || null,
      sortOrder: Number(catNode.sortOrder || 1),
      created_at: catNode.created_at,
      updated_at: catNode.updated_at,
      deleted_at: catNode.deleted_at || null
    }
  }
}

const handleSubmitCategoryModal = async () => {
  const f = categoryModal.value.form
  if (!f.name.trim()) {
    notify.warning('Thiếu tên Category', 'Vui lòng nhập tên Category!')
    return
  }

  const confirmed = await notify.confirm({
    title: categoryModal.value.isEdit ? 'Xác nhận cập nhật Category?' : 'Xác nhận tạo Category mới?',
    message: categoryModal.value.isEdit
      ? 'Thông tin tên, biểu tượng, thứ tự ưu tiên và mối quan hệ Cha - Con của Category này sẽ được cập nhật vào ref_library.json.'
      : 'Category mới sẽ được thêm vào cây thư mục trong ref_library.json.',
    highlightText: `${f.icon} ${f.name.trim()} (Ưu tiên: #${f.sortOrder})`,
    confirmText: categoryModal.value.isEdit ? 'Đồng ý Cập nhật' : 'Đồng ý Tạo mới',
    cancelText: 'Quay lại',
    variant: 'info',
    icon: '🏷️'
  })
  if (!confirmed) return

  const now = getNowStr()
  if (categoryModal.value.isEdit) {
    const idx = libraryData.value.categories.findIndex(c => c.id === f.id)
    if (idx !== -1) {
      libraryData.value.categories[idx] = {
        ...libraryData.value.categories[idx],
        name: f.name.trim(),
        icon: f.icon.trim() || '📌',
        parentId: f.parentId || null,
        sortOrder: Number(f.sortOrder || 1),
        updated_at: now
      }
    }
  } else {
    const newId = `cat_${f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString().slice(-3)}`
    libraryData.value.categories.push({
      id: newId,
      name: f.name.trim(),
      icon: f.icon.trim() || '📌',
      parentId: f.parentId || null,
      sortOrder: Number(f.sortOrder || 1),
      created_at: now,
      updated_at: now,
      deleted_at: null
    })
  }

  categoryModal.value.show = false
  await saveLibraryToDisk(categoryModal.value.isEdit ? `Cập nhật Category: ${f.name}` : `Tạo Category: ${f.name}`)
  notify.success('Hoàn tất!', 'Đã lưu cấu trúc Cây Category vào ref_library.json.')
}

const handleMoveCategoryOrder = async (node, direction) => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận thay đổi thứ tự ưu tiên Category?',
    message: `Bạn muốn dịch chuyển thứ tự ưu tiên của Category "${node.name}" ${direction < 0 ? 'lên trên' : 'xuống dưới'}?`,
    highlightText: `${node.icon} ${node.name} (Hiện tại: #${node.sortOrder})`,
    confirmText: 'Đồng ý Đổi thứ tự',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '🔢'
  })
  if (!confirmed) return

  const siblings = activeCategoriesList.value
    .filter(c => (c.parentId || null) === (node.parentId || null))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

  const currentIdx = siblings.findIndex(s => s.id === node.id)
  const targetIdx = currentIdx + direction
  if (currentIdx === -1 || targetIdx < 0 || targetIdx >= siblings.length) return

  const now = getNowStr()
  const currentCat = libraryData.value.categories.find(c => c.id === siblings[currentIdx].id)
  const swapCat = libraryData.value.categories.find(c => c.id === siblings[targetIdx].id)

  if (currentCat && swapCat) {
    const tempOrder = currentCat.sortOrder
    currentCat.sortOrder = swapCat.sortOrder
    swapCat.sortOrder = tempOrder === swapCat.sortOrder ? tempOrder + direction : tempOrder
    currentCat.updated_at = now
    swapCat.updated_at = now
    await saveLibraryToDisk(`Đổi thứ tự ưu tiên Category: ${node.name}`)
  }
}

const handleSoftDeleteCategory = async (node) => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận xóa mềm (Soft Delete) Category?',
    message: 'Category này sẽ được đánh dấu deleted_at và chuyển vào mục đã xóa. Các Category con (nếu có) sẽ được nâng lên cấp cha. Ảnh trên ổ đĩa Windows hoàn toàn không bị ảnh hưởng.',
    highlightText: `${node.icon} ${node.name}`,
    confirmText: 'Xóa mềm Category',
    cancelText: 'Hủy bỏ',
    variant: 'warning',
    icon: '🗑️'
  })
  if (!confirmed) return

  const now = getNowStr()
  const target = libraryData.value.categories.find(c => c.id === node.id)
  if (target) {
    target.deleted_at = now
    target.updated_at = now
    // Chuyển các category con trực tiếp lên cấp cha của category bị xóa
    libraryData.value.categories.forEach(c => {
      if (c.parentId === node.id) {
        c.parentId = target.parentId || null
        c.updated_at = now
      }
    })
    if (selectedFilter.value === node.id) selectedFilter.value = 'ALL'
    await saveLibraryToDisk(`Xóa mềm Category: ${node.name}`)
    notify.info('Đã xóa mềm Category', `Category "${node.name}" đã được chuyển vào danh sách đã xóa.`)
  }
}

const handleRestoreCategory = async (tCat) => {
  const confirmed = await notify.confirm({
    title: 'Khôi phục Category đã xóa mềm?',
    message: 'Category này sẽ được xóa cờ deleted_at và hiển thị trở lại trên Cây danh mục.',
    highlightText: `${tCat.icon} ${tCat.name}`,
    confirmText: 'Khôi phục ngay',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '♻️'
  })
  if (!confirmed) return

  tCat.deleted_at = null
  tCat.updated_at = getNowStr()
  await saveLibraryToDisk(`Khôi phục Category: ${tCat.name}`)
  notify.success('Đã khôi phục!', `Category "${tCat.name}" đã hoạt động trở lại.`)
}

const handlePermanentDeleteCategory = async (tCat) => {
  const confirmed = await notify.confirm({
    title: 'Xóa vĩnh viễn Category khỏi JSON?',
    message: 'Category này sẽ bị xóa hẳn khỏi file ref_library.json và các ảnh thuộc về nó sẽ chuyển sang Chưa phân loại.',
    highlightText: `${tCat.icon} ${tCat.name}`,
    confirmText: 'Xóa Vĩnh Viễn',
    cancelText: 'Hủy',
    variant: 'danger',
    icon: '⚠️'
  })
  if (!confirmed) return

  libraryData.value.categories = libraryData.value.categories.filter(c => c.id !== tCat.id)
  Object.values(libraryData.value.items).forEach(item => {
    if (item.categoryId === tCat.id) item.categoryId = ''
  })
  await saveLibraryToDisk(`Xóa vĩnh viễn Category: ${tCat.name}`)
}

// ============================================================================
// 6. THAO TÁC TRÊN ITEM ẢNH & ĐỔI TÊN TRÊN WINDOWS (CÓ CONFIRM DIALOG)
// ============================================================================
const handleToggleFavorite = async (img) => {
  const nextState = !img.isFavorite
  const confirmed = await notify.confirm({
    title: nextState ? 'Đánh dấu ảnh quan trọng (Favorite)?' : 'Bỏ đánh dấu sao cho ảnh này?',
    message: 'Trạng thái đánh dấu sao và thời gian updated_at sẽ được lưu vào ref_library.json.',
    highlightText: img.fileName,
    confirmText: 'Đồng ý',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '⭐'
  })
  if (!confirmed) return

  const record = libraryData.value.items[img.key]
  if (record) {
    record.isFavorite = nextState
    record.updated_at = getNowStr()
    await saveLibraryToDisk(`Đổi trạng thái Favorite: ${img.fileName}`)
  }
}

const handleSingleCategoryChange = async (img, newCatId, event) => {
  const oldCatId = img.categoryId || ''
  const targetLabel = getCategoryLabel(newCatId)
  const confirmed = await notify.confirm({
    title: 'Xác nhận chuyển Category cho ảnh?',
    message: `Bạn có muốn chuyển ảnh này sang mục "${targetLabel}" không?`,
    highlightText: `${img.fileName} → ${targetLabel}`,
    confirmText: 'Đồng ý Chuyển',
    cancelText: 'Giữ nguyên',
    variant: 'info',
    icon: '🏷️'
  })
  if (!confirmed) {
    if (event?.target) event.target.value = oldCatId
    return
  }

  const record = libraryData.value.items[img.key]
  if (record) {
    record.categoryId = newCatId
    record.updated_at = getNowStr()
    await saveLibraryToDisk(`Chuyển Category ảnh: ${img.fileName}`)
    notify.success('Đã cập nhật!', `Đã chuyển "${img.fileName}" sang ${targetLabel}.`)
  }
}

const toggleSelectAllVisible = () => {
  if (selectedKeys.value.length === filteredImages.value.length) {
    selectedKeys.value = []
  } else {
    selectedKeys.value = filteredImages.value.map(i => i.key)
  }
}

const handleBatchAssignCategory = async () => {
  if (!batchTargetCatId.value || !selectedKeys.value.length) return
  const finalCatId = batchTargetCatId.value === '__CLEAR__' ? '' : batchTargetCatId.value
  const targetLabel = getCategoryLabel(finalCatId)

  const confirmed = await notify.confirm({
    title: 'Xác nhận gán Category hàng loạt?',
    message: `Toàn bộ ${selectedKeys.value.length} ảnh đang chọn sẽ được cập nhật sang "${targetLabel}".`,
    highlightText: `${selectedKeys.value.length} ảnh → ${targetLabel}`,
    confirmText: 'Áp dụng ngay',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '📦'
  })
  if (!confirmed) return

  const now = getNowStr()
  selectedKeys.value.forEach(k => {
    if (libraryData.value.items[k]) {
      libraryData.value.items[k].categoryId = finalCatId
      libraryData.value.items[k].updated_at = now
    }
  })
  selectedKeys.value = []
  batchTargetCatId.value = ''
  await saveLibraryToDisk(`Gán Category hàng loạt sang ${targetLabel}`)
  notify.success('Hoàn tất!', 'Đã phân loại hàng loạt và lưu vào ref_library.json.')
}

const handleSoftDeleteSingleItem = async (img) => {
  const confirmed = await notify.confirm({
    title: 'Xóa mềm (Soft Delete) bản ghi ảnh này?',
    message: 'Ảnh sẽ được gắn mốc thời gian deleted_at và ẩn vào Thùng rác trong JSON. File gốc trên ổ đĩa Windows được giữ nguyên 100%.',
    highlightText: img.windowsPath || img.fileName,
    confirmText: 'Đưa vào Thùng rác',
    cancelText: 'Hủy',
    variant: 'warning',
    icon: '🗑️'
  })
  if (!confirmed) return

  const now = getNowStr()
  if (libraryData.value.items[img.key]) {
    libraryData.value.items[img.key].deleted_at = now
    libraryData.value.items[img.key].updated_at = now
    await saveLibraryToDisk(`Xóa mềm ảnh: ${img.fileName}`)
    notify.info('Đã đưa vào Thùng rác', `Đã xóa mềm "${img.fileName}".`)
  }
}

const handleBatchSoftDeleteItems = async () => {
  if (!selectedKeys.value.length) return
  const confirmed = await notify.confirm({
    title: 'Xóa mềm hàng loạt ảnh đã chọn?',
    message: `Đánh dấu deleted_at cho ${selectedKeys.value.length} ảnh và chuyển vào Thùng rác (Không xóa file trên Windows).`,
    highlightText: `${selectedKeys.value.length} ảnh được chọn`,
    confirmText: 'Xóa mềm tất cả',
    cancelText: 'Hủy',
    variant: 'warning',
    icon: '🗑️'
  })
  if (!confirmed) return

  const now = getNowStr()
  selectedKeys.value.forEach(k => {
    if (libraryData.value.items[k]) {
      libraryData.value.items[k].deleted_at = now
      libraryData.value.items[k].updated_at = now
    }
  })
  selectedKeys.value = []
  await saveLibraryToDisk('Xóa mềm hàng loạt ảnh')
}

const handleRestoreSingleItem = async (img) => {
  const confirmed = await notify.confirm({
    title: 'Khôi phục ảnh từ Thùng rác?',
    message: 'Xóa cờ deleted_at và đưa ảnh hiển thị trở lại trong Category của nó.',
    highlightText: img.fileName,
    confirmText: 'Khôi phục ngay',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '♻️'
  })
  if (!confirmed) return

  if (libraryData.value.items[img.key]) {
    libraryData.value.items[img.key].deleted_at = null
    libraryData.value.items[img.key].updated_at = getNowStr()
    await saveLibraryToDisk(`Khôi phục ảnh: ${img.fileName}`)
    notify.success('Đã khôi phục!', `"${img.fileName}" đã hoạt động trở lại.`)
  }
}

const handlePermanentDeleteSingleItem = async (img) => {
  const confirmed = await notify.confirm({
    title: 'Xóa vĩnh viễn bản ghi này khỏi file JSON?',
    message: 'Bản ghi sẽ bị xóa khỏi ref_library.json (File ảnh thật trên ổ đĩa Windows vẫn giữ nguyên).',
    highlightText: img.windowsPath || img.fileName,
    confirmText: 'Xóa khỏi JSON',
    cancelText: 'Hủy',
    variant: 'danger',
    icon: '⚠️'
  })
  if (!confirmed) return

  delete libraryData.value.items[img.key]
  await saveLibraryToDisk(`Xóa vĩnh viễn bản ghi ảnh: ${img.fileName}`)
}

// Đổi tên file thật trên ổ cứng Windows
const openRenameModal = (img) => {
  renamingItem.value = img
  const dotIdx = img.fileName.lastIndexOf('.')
  renameBaseName.value = dotIdx > 0 ? img.fileName.slice(0, dotIdx) : img.fileName
  renameExt.value = dotIdx > 0 ? img.fileName.slice(dotIdx) : ''
  nextTick(() => {
    renameInputRef.value?.focus()
    renameInputRef.value?.select()
  })
}

const applyPrefixToRename = (prefix) => {
  if (!renameBaseName.value.startsWith(prefix)) {
    renameBaseName.value = `${prefix}${renameBaseName.value}`
  }
}

const handleConfirmRenameOnWindows = async () => {
  if (!renamingItem.value) return
  const cleanBase = renameBaseName.value.trim().replace(/[\\/:*?"<>|]/g, '_')
  if (!cleanBase) {
    notify.warning('Tên không hợp lệ', 'Vui lòng nhập tên file mới!')
    return
  }

  const finalNewName = `${cleanBase}${renameExt.value}`
  const item = renamingItem.value
  if (finalNewName === item.fileName) {
    renamingItem.value = null
    return
  }

  const confirmed = await notify.confirm({
    title: 'Xác nhận đổi tên file thật trên ổ đĩa Windows?',
    message: 'File trên ổ cứng Windows sẽ được đổi tên trực tiếp, đồng thời đường dẫn vật lý trong ref_library.json sẽ được cập nhật đồng bộ.',
    highlightText: `${item.fileName}  ➔  ${finalNewName}`,
    confirmText: 'Đồng ý Đổi tên trên Windows',
    cancelText: 'Hủy bỏ',
    variant: 'warning',
    icon: '✏️'
  })
  if (!confirmed) return

  try {
    const res = await fetch(`${API_BASE}/rename_file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldWindowsPath: item.windowsPath,
        newFileName: finalNewName
      })
    })
    const json = await res.json()
    if (!json.ok) {
      notify.error('Không thể đổi tên file', json.error)
      return
    }

    const now = getNowStr()
    const oldRecord = libraryData.value.items[item.key] || {}
    delete libraryData.value.items[item.key]

    libraryData.value.items[json.newWindowsPath] = {
      ...oldRecord,
      key: json.newWindowsPath,
      fileName: json.newFileName,
      windowsPath: json.newWindowsPath,
      folderPath: json.folderPath,
      updated_at: now
    }

    renamingItem.value = null
    await saveLibraryToDisk(`Đổi tên file Windows: ${item.fileName} -> ${finalNewName}`)
    notify.success('Đổi tên thành công!', `Đã đổi thành "${finalNewName}" trên ổ đĩa Windows.`)
  } catch (err) {
    notify.error('Lỗi đổi tên file', err.message)
  }
}

// ============================================================================
// 7. BACKUP THỦ CÔNG & ROLLBACK VỀ VERSION TRƯỚC (CÓ CONFIRM DIALOG)
// ============================================================================
const handleManualBackup = async () => {
  const confirmed = await notify.confirm({
    title: 'Tạo bản sao lưu sang ref_library_backup.json?',
    message: 'Toàn bộ trạng thái hiện tại của ref_library.json sẽ được sao chép sang file dự phòng ref_library_backup.json.',
    highlightText: `${activeItemsList.length} ảnh & ${activeCategoriesList.value.length} Category`,
    confirmText: 'Sao lưu ngay',
    cancelText: 'Hủy',
    variant: 'info',
    icon: '🛡️'
  })
  if (!confirmed) return

  const res = await fetch(`${API_BASE}/backup_now`, { method: 'POST' })
  const json = await res.json()
  if (json.ok) {
    backupMeta.value = json.backupMeta
    notify.success('Đã tạo bản Backup!', 'File ref_library_backup.json đã được cập nhật mới nhất.')
  }
}

const handleRollbackBackup = async () => {
  if (!backupMeta.value) return
  const confirmed = await notify.confirm({
    title: 'Khôi phục (Rollback) về phiên bản trước đó?',
    message: 'Dữ liệu từ file ref_library_backup.json sẽ được khôi phục đè lên ref_library.json hiện tại.',
    highlightText: `Bản lưu lúc: ${backupMeta.value.updatedAt} (${backupMeta.value.backupReason})`,
    confirmText: '⏪ Đồng ý Khôi phục Version trước',
    cancelText: 'Hủy bỏ',
    variant: 'warning',
    icon: '⏪'
  })
  if (!confirmed) return

  const res = await fetch(`${API_BASE}/restore_backup`, { method: 'POST' })
  const json = await res.json()
  if (json.ok) {
    await loadLibraryFromDisk()
    notify.success('Đã khôi phục thành công!', 'Thư viện đã quay về phiên bản Backup trước đó.')
  } else {
    notify.error('Lỗi khôi phục Backup', json.error)
  }
}

onMounted(() => {
  loadLibraryFromDisk()
})
</script>
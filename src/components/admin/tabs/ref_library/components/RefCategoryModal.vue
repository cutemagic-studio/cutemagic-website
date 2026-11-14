<!-- src/components/admin/tabs/ref_library/components/RefCategoryModal.vue -->
<template>
  <div
    v-if="store.categoryModal.show"
    class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl border-2 border-[#8470FF] max-w-md w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600">
            Quản lý Cây Danh Mục Ảo
          </span>
          <h3 class="text-base font-black text-slate-900">
            {{ store.categoryModal.isEdit ? `Chỉnh sửa Category: ${store.categoryModal.form.name}` : 'Tạo Category Ảo Mới' }}
          </h3>
        </div>
        <button
          type="button"
          @click="store.categoryModal.show = false"
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
              v-model="store.categoryModal.form.icon"
              type="text"
              maxlength="4"
              class="w-full border-2 border-[#8470FF] rounded-xl px-2 py-2 text-center text-base"
            />
          </div>
          <div class="col-span-3">
            <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">Tên Category *</label>
            <input
              v-model="store.categoryModal.form.name"
              type="text"
              placeholder="VD: Floating Islands..."
              class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
            🌳 Thuộc Category Cha (Quan hệ Cha - Con)
          </label>
          <select
            v-model="store.categoryModal.form.parentId"
            class="w-full border-2 border-[#8470FF] rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option :value="null">🌟 Category Gốc (Root - Không có cha)</option>
            <option
              v-for="opt in store.availableParentCategoryOptions"
              :key="opt.id"
              :value="opt.id"
            >
              {{ '—'.repeat(opt.depth) }} {{ opt.icon }} {{ opt.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase text-slate-500 mb-1">
            🔢 Thứ tự ưu tiên hiển thị (Số nhỏ xếp trên)
          </label>
          <input
            v-model.number="store.categoryModal.form.sortOrder"
            type="number"
            min="1"
            class="w-full border-2 border-[#8470FF] rounded-xl px-3.5 py-2 text-xs font-mono font-black text-blue-600"
          />
        </div>

        <div v-if="store.categoryModal.isEdit" class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-500 space-y-0.5">
          <div>ID: <strong>{{ store.categoryModal.form.id }}</strong></div>
          <div>created_at: <strong>{{ store.categoryModal.form.created_at }}</strong></div>
          <div>updated_at: <strong>{{ store.categoryModal.form.updated_at }}</strong></div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          @click="store.categoryModal.show = false"
          class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          @click="store.handleSubmitCategoryModal"
          class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg cursor-pointer"
        >
          💾 {{ store.categoryModal.isEdit ? 'Lưu cập nhật Category' : 'Tạo Category mới' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRefLibraryStore } from '../../../../../stores/useRefLibraryStore'
const store = useRefLibraryStore()
</script>
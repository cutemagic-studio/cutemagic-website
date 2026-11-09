<!-- src/components/admin/tabs/asset_manager/components/AssetHeaderToolbar.vue -->
<template>
    <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col xl:flex-row xl:items-center justify-between gap-4']">
        <div>
            <div class="flex flex-wrap items-center gap-2.5">
                <span class="w-3 h-3 rounded-full"
                    :class="isFirebaseSynced ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
                <h1 :class="[theme.ui.assetCardTitle]">Quản lý Kho CmgAssetModel</h1>
                <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-200">
                    Pool ID 6 Số: Đã dùng {{ idPoolStats.usedCount }}/{{ idPoolStats.totalPool }}
                </span>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-1">
                Định danh chuẩn 6 chữ số • Mã ID khả dụng tiếp theo:
                <code class="text-blue-600 font-mono font-black">#{{ idPoolStats.nextAvailableId || 'Auto' }}</code>
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
            <!-- Input chọn file ẩn dùng cho nút Khôi phục (Restore) -->
            <input ref="restoreFileInputRef" type="file" accept=".js,.json" class="hidden" @change="onFileSelected" />

            <!-- Nút 1: Tải file Backup Asset Pack (.js) về máy tính -->
            <button @click="$emit('backup')" :disabled="isBackingUp"
                class="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                title="Tải toàn bộ dữ liệu Asset Pack từ Firebase về máy tính dưới dạng file .js">
                <span>⬇️</span>
                <span>{{ isBackingUp ? 'Đang xuất file...' : 'Sao lưu Asset (.js)' }}</span>
            </button>

            <!-- Nút 2: Khôi phục (Import) từ file Backup .js / .json lên Firebase -->
            <button @click="triggerFilePicker" :disabled="isSaving"
                class="px-3.5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                title="Khôi phục dữ liệu lên Firebase từ file .js hoặc .json đã sao lưu">
                <span>⬆️</span>
                <span>Khôi phục File</span>
            </button>

            <!-- Nút 3: Đồng bộ 30 gói mẫu gốc (Chuẩn hóa sang ID 6 số) -->
            <button @click="$emit('seed')" :disabled="isSaving"
                class="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
                title="Đẩy 30 gói mẫu gốc lên Firebase với mã ID 6 chữ số">
                ☁️ Reset 30 Pack gốc
            </button>

            <!-- Nút 4: Thêm Asset Pack Mới (Tự cấp ID 6 chữ số) -->
            <button @click="$emit('create')"
                class="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer">
                <span>＋</span> Thêm Pack Mới
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()
const restoreFileInputRef = ref(null)

defineProps({
    isFirebaseSynced: { type: Boolean, default: false },
    idPoolStats: {
        type: Object,
        default: () => ({ usedCount: 0, totalPool: 100, nextAvailableId: null })
    },
    isBackingUp: { type: Boolean, default: false },
    isSaving: { type: Boolean, default: false }
})

const emit = defineEmits(['backup', 'restore-file', 'seed', 'create'])

const triggerFilePicker = () => {
    restoreFileInputRef.value?.click()
}

const onFileSelected = (event) => {
    const file = event.target.files?.[0]
    if (file) {
        emit('restore-file', file)
    }
    // Reset lại input để có thể chọn lại cùng 1 file nếu cần
    event.target.value = ''
}
</script>
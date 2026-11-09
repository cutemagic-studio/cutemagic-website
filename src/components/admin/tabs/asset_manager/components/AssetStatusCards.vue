<!-- src/components/admin/tabs/asset_manager/components/AssetStatusCards.vue -->
<template>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- 1. Tổng số Pack đang hoạt động -->
        <div @click="$emit('update:statusFilter', 'all')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Tổng số Pack</p>
            <p class="text-2xl font-black text-slate-900 mt-1">{{ totalCount }}</p>
        </div>

        <!-- 2. Đang Giảm giá -->
        <div @click="$emit('update:statusFilter', 'discount')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'discount' ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Đang Giảm giá</p>
            <p class="text-2xl font-black text-rose-600 mt-1">{{ countByStatus.discount || 0 }}</p>
        </div>

        <!-- 3. Miễn phí (Free) -->
        <div @click="$emit('update:statusFilter', 'free')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'free' ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Miễn phí (Free)</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">{{ countByStatus.free || 0 }}</p>
        </div>

        <!-- 4. Coming Soon (Tính động theo ngày dự kiến) -->
        <div @click="$emit('update:statusFilter', 'upcoming')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'upcoming' ? 'border-amber-500 ring-2 ring-amber-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Coming Soon</p>
            <p class="text-2xl font-black text-amber-500 mt-1">{{ countByStatus.upcoming || 0 }}</p>
        </div>

        <!-- 5. Trên Roadmap -->
        <div @click="$emit('update:statusFilter', 'roadmap')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'roadmap' ? 'border-indigo-500 ring-2 ring-indigo-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Trên Roadmap</p>
            <p class="text-2xl font-black text-indigo-600 mt-1">{{ countByStatus.roadmap || 0 }}</p>
        </div>

        <!-- 6. [THÊM MỚI]: Đã xóa mềm (Soft Delete - deleted_at) -->
        <div @click="$emit('update:statusFilter', 'deleted')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'deleted' ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-500/20' : 'border-slate-100'">
            <div class="flex items-center justify-between">
                <p class="text-[14px] font-bold text-left text-[#363636]">🗑️ Đã xóa mềm</p>
                <span v-if="countByStatus.deleted > 0" class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <p class="text-2xl font-black text-slate-700 mt-1">{{ countByStatus.deleted || 0 }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    statusFilter: { type: String, default: 'all' },
    totalCount: { type: Number, default: 0 },
    countByStatus: {
        type: Object,
        default: () => ({ discount: 0, free: 0, upcoming: 0, roadmap: 0, deleted: 0 })
    }
})

defineEmits(['update:statusFilter'])
</script>
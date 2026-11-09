<!-- src/components/admin/tabs/asset_manager/components/AssetStatusCards.vue -->
<template>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div @click="$emit('update:statusFilter', 'all')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Tổng số Pack</p>
            <p class="text-2xl font-black text-slate-900 mt-1">{{ totalCount }}</p>
        </div>

        <div @click="$emit('update:statusFilter', 'discount')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'discount' ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Đang Giảm giá</p>
            <p class="text-2xl font-black text-rose-600 mt-1">{{ countByStatus.discount }}</p>
        </div>

        <div @click="$emit('update:statusFilter', 'free')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'free' ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Miễn phí (Free)</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">{{ countByStatus.free }}</p>
        </div>

        <div @click="$emit('update:statusFilter', 'upcoming')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="statusFilter === 'upcoming' ? 'border-amber-500 ring-2 ring-amber-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Coming Soon</p>
            <p class="text-2xl font-black text-amber-500 mt-1">{{ countByStatus.upcoming }}</p>
        </div>

        <div @click="$emit('update:statusFilter', 'roadmap')"
            class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all col-span-2 md:col-span-1"
            :class="statusFilter === 'roadmap' ? 'border-indigo-500 ring-2 ring-indigo-500/15' : 'border-slate-100'">
            <p class="text-[14px] font-bold text-left text-[#363636]">Trên Roadmap</p>
            <p class="text-2xl font-black text-indigo-600 mt-1">{{ countByStatus.roadmap }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    statusFilter: { type: String, default: 'all' },
    totalCount: { type: Number, default: 0 },
    countByStatus: {
        type: Object,
        default: () => ({ discount: 0, free: 0, upcoming: 0, roadmap: 0 })
    }
})

defineEmits(['update:statusFilter'])
</script>
<!-- src/components/admin/tabs/asset_manager/components/AssetFilterBar.vue -->
<template>
    <div :class="[theme.ui.adminRoundedContainer, 'grid grid-cols-1 md:grid-cols-4 gap-3']">
        <div class="md:col-span-2 relative">
            <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text"
                placeholder="Tìm theo ID, Tên Asset Pack, Slug hoặc Tag..."
                class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            <span class="absolute right-4 top-2.5 opacity-30">🔍</span>
        </div>

        <select :value="categoryFilter" @change="$emit('update:categoryFilter', $event.target.value)"
            class="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none">
            <option value="all">📁 Tất cả Danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }} ({{ cat.id }})
            </option>
        </select>

        <select :value="sortOrder" @change="$emit('update:sortOrder', $event.target.value)"
            class="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none">
            <option value="id_asc">🔢 Xếp theo ID (Tăng dần)</option>
            <option value="id_desc">🔢 Xếp theo ID (Mới nhất)</option>
            <option value="updated_desc">🕒 Mới cập nhật gần nhất</option>
            <option value="price_desc">💲 Giá: Cao đến Thấp</option>
            <option value="likes_desc">❤️ Nhiều lượt Like nhất</option>
        </select>
    </div>
</template>

<script setup>
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

defineProps({
    searchQuery: { type: String, default: '' },
    categoryFilter: { type: String, default: 'all' },
    sortOrder: { type: String, default: 'id_asc' },
    categories: { type: Array, default: () => [] }
})

defineEmits(['update:searchQuery', 'update:categoryFilter', 'update:sortOrder'])
</script>
<!-- src/components/admin/tabs/asset_manager/components/AssetTable.vue -->
<template>
    <div :class="[theme.ui.adminRoundedContainer, 'overflow-hidden']">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-[#1e1e1e] rounded-xl border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th class="p-4">ID &amp; Asset Pack</th>
                        <th class="p-4">Danh mục &amp; Models</th>
                        <th class="p-4">Giá &amp; Khuyến mãi</th>
                        <th class="p-4 text-center">Huy hiệu (Click bật/tắt)</th>
                        <th class="p-4">Cập nhật &amp; Roadmap</th>
                        <th class="p-4 text-right">Thao tác</th>
                    </tr>
                </thead>

                <tbody v-if="assets.length > 0">
                    <tr v-for="item in assets" :key="item.id"
                        class="border-b border-slate-50 hover:bg-[#4F4F4F] transition-all">
                        <!-- Cột 1: Ảnh Cover, ID, Title & Slug -->
                        <td class="p-4">
                            <div class="flex items-center gap-3.5 max-w-xs">
                                <div
                                    class="w-16 h-16 border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:border-[#1E90FF] dark:hover:border-[#1E90FF] bg-[#FFFFFF] dark:bg-[#1e1e1e] hover:bg-[#FFFFFF] dark:hover:bg-[#1e1e1e] rounded-md overflow-hidden shrink-0 relative"
                                    >
                                    <img v-if="item.media?.cover" :src="item.media.cover"
                                        class="w-full h-full object-cover" />
                                    <span
                                        class="absolute top-1 left-1 px-1.5 py-0.2 bg-slate-900/80 text-white rounded text-[9px] font-black">
                                        #{{ item.id }} 
                                    </span>
                                </div>
                                <div class="min-w-0">
                                    <p :class="[theme.ui.assetCardTitle, 'truncate text-left',]"
                                      :title="item.title">
                                        {{ item.title }}
                                    </p>
                                    <p class="text-[10px] font-mono text-slate-400 truncate text-left">
                                        {{ item.slug }}
                                    </p>
                                    <div class="w-45 h-6 rounded-md bg-[#CFCFCF] flex items-center justify-between px-2 mt-1 text-[12px] font-bold text-[#363636]">
                                        <span>❤️ {{ item.metrics?.likes || 0 }}</span>
                                        <span>👀 {{ item.metrics?.views || 0 }}</span> 
                                        <span>⬇️ {{ item.metrics?.downloads || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Cột 2: Category & Số lượng Models -->
                        <td class="p-4">
                            <span
                                class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                                {{ item.categoryId }}
                            </span>
                            <p class="text-xs font-black text-slate-700 mt-1.5">
                                {{ item.techSpecs?.modelCount || 0 }} Models
                            </p>
                            <p class="text-[10px] font-bold text-slate-400">
                                {{ item.techSpecs?.polycount }}
                            </p>
                        </td>

                        <!-- Cột 3: Giá bán & Khuyến mãi -->
                        <td class="p-4">
                            <div v-if="item.isFree">
                                <span
                                    class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black uppercase">
                                    FREE
                                </span>
                            </div>
                            <div v-else>
                                <div class="flex items-baseline gap-1.5">
                                    <span :class="[theme.ui.assetCardNumber]">
                                        ${{ Number(item.pricing?.price || 0).toFixed(2) }}
                                    </span>
                                    <span v-if="item.hasDiscount" class="text-xs text-slate-400 line-through font-bold">
                                        ${{ item.pricing.originalPrice }}
                                    </span>
                                </div>
                                <div v-if="item.hasDiscount" class="flex items-center gap-1 mt-1">
                                    <span
                                        class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 text-[10px] font-black">
                                        -{{ item.pricing.discount }}%
                                    </span>
                                    <span v-if="item.pricing.discountEndsIn"
                                        class="text-[10px] font-bold text-rose-500">
                                        ({{ item.pricing.discountEndsIn }})
                                    </span>
                                </div>
                            </div>
                        </td>

                        <!-- Cột 4: Bật/Tắt nhanh 3 Cờ Flags -->
                        <td class="p-4 text-center">
                            <div class="inline-flex items-center gap-1.5">
                                <button @click="$emit('toggle-flag', item.id, 'isFeatured')"
                                    :class="item.flags?.isFeatured ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-300 border-slate-200'"
                                    class="px-2 py-1 rounded-lg border-3 text-[10px] font-black transition-all cursor-pointer"
                                    title="Bật/Tắt Nổi bật (Featured)">
                                    ⭐ Featured
                                </button>
                                <button @click="$emit('toggle-flag', item.id, 'isExclusive')"
                                    :class="item.flags?.isExclusive ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-slate-50 text-slate-300 border-slate-200'"
                                    class="px-2 py-1 rounded-lg border-3 text-[10px] font-black transition-all cursor-pointer"
                                    title="Bật/Tắt Độc quyền (Exclusive)">
                                    💎 Excl
                                </button>
                                <button @click="$emit('toggle-flag', item.id, 'isLaunchEdition')"
                                    :class="item.flags?.isLaunchEdition ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-300 border-slate-200'"
                                    class="px-2 py-1 rounded-lg border-3 text-[10px] font-black transition-all cursor-pointer"
                                    title="Bật/Tắt Phiên bản Ra mắt (Launch Edition)">
                                    🚀 Launch
                                </button>
                            </div>
                        </td>

                        <!-- Cột 5: Ngày cập nhật & Nút "Cập nhật Hôm nay" 1-Click -->
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <div>
                                    <p class="text-xs font-black text-[#1E90FF]">
                                        Update: <span class="text-[#00EE76]">{{ item.dates?.latestUpdate ||
                                            item.dates?.initialRelease || 'N/A' }}</span>
                                    </p>
                                    <p v-if="item.dates?.availableIn" class="text-[10px] font-black text-amber-600">
                                        ⏳ Sắp ra: {{ item.dates.availableIn }}
                                    </p>
                                    <p v-else-if="item.roadmap?.status" class="text-[10px] font-bold text-[#ffe600]">
                                        🗺️ Roadmap: {{ item.roadmap.status.toUpperCase() }} ({{ item.roadmap.progress
                                        }}%)
                                    </p>
                                </div>

                                <!-- Nút 1-Click đặt ngày cập nhật là Hôm nay -->
                                <button @click="$emit('touch-today', item)"
                                    class="px-2 py-3 rounded-lg border-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-black transition-colors cursor-pointer shrink-0"
                                    title="Đặt ngày cập nhật gần nhất (latestUpdate) thành Hôm nay">
                                    🔄 Nay
                                </button>
                            </div>
                        </td>

                        <!-- Cột 6: Sửa / Nhân bản / Xóa -->
                        <td class="p-4 text-right">
                            <div class="inline-flex items-center gap-1.5">
                                <button @click="$emit('edit', item)"
                                    class="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 border-2 text-white text-xs font-black transition-colors cursor-pointer">
                                    ✏️ Sửa
                                </button>
                                <button @click="$emit('clone', item)"
                                    class="p-4 rounded-xl bg-slate-100 hover:bg-indigo-100 border-2 text-slate-600 hover:text-indigo-700 text-xs font-black transition-colors cursor-pointer"
                                    title="Nhân bản Pack này">
                                    📋
                                </button>
                                <button @click="$emit('delete', item)"
                                    class="p-4 rounded-xl bg-rose-50 hover:bg-rose-600 border-2 text-rose-600 hover:text-white text-xs font-black transition-colors cursor-pointer"
                                    title="Xóa Pack">
                                    🗑️
                                </button>
                            </div>
                        </td>

                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="6" class="p-16 text-center text-slate-400 font-bold">
                            Không tìm thấy Asset Pack nào khớp với bộ lọc hiện tại.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { useThemeStore } from '../../../../../stores/useThemeStore.js'

const theme = useThemeStore()

defineProps({
    assets: {
        type: Array,
        default: () => []
    }
})

defineEmits([
    'toggle-flag',
    'touch-today',
    'edit',
    'clone',
    'delete'
])
</script>
<!-- src/components/admin/tabs/user_tracker/components/VisitorEventStreamTable.vue -->
<template>
  <div :class="[theme.ui.adminRoundedContainer, 'overflow-hidden']">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr 
          class="bg-[#1e1e1e] rounded-xl border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th class="p-4">Hành động</th>
            <th class="p-4">Người thực hiện (IP &amp; Quốc gia)</th>
            <th class="p-4">Trang / Asset Pack tương tác</th>
            <th class="p-4 text-right">Thời gian</th>
          </tr>
        </thead>

        <tbody v-if="items.length > 0">
          <tr 
            v-for="ev in items" 
            :key="ev.id" 
            class="border-b border-slate-50 hover:bg-[#4F4F4F] transition-colors"
          >
            <td class="p-4">
              <span 
                v-if="ev.actionType === 'DOWNLOAD_ASSET'" 
                class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase"
              >
                ⬇️ Tải xuống Pack
              </span>
              <span 
                v-else-if="ev.actionType === 'VIEW_ASSET'" 
                class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase"
              >
                👁️ Xem chi tiết Pack
              </span>
              <span 
                v-else 
                class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase"
              >
                🌐 Chuyển trang
              </span>
            </td>

            <td class="p-4">
              <div class="flex items-center gap-2">
                <img 
                  v-if="ev.flag" 
                  :src="ev.flag" 
                  class="w-8 h-6 object-cover rounded shadow-sm border-2 border-slate-200" 
                  referrerpolicy="no-referrer" 
                />
                <code class="text-xs font-mono font-bold text-[#00BFFF]">{{ ev.ip }}</code>
                <span class="text-xs text-[#CFCFCF]">({{ ev.city }}, {{ ev.country }})</span>
              </div>
            </td>

            <td class="p-4">
              <p v-if="ev.assetTitle" class="text-xs font-black text-blue-600">
                📦 {{ ev.assetTitle }}
              </p>
              <p class="text-[12px] font-bold text-[#FF6347]">{{ ev.path }}</p>
            </td>

            <td class="p-4 text-right">
              <p class="text-xs font-black text-[#7FFF00]">{{ formatTimeAgo(ev.timestamp) }}</p>
              <p class="text-[10px] text-slate-400 font-bold">{{ formatExactTime(ev.timestamp) }}</p>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="4" class="p-16 text-center text-slate-400 font-bold">
              Chưa có sự kiện nào khớp với bộ lọc...
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
  items: { type: Array, default: () => [] }
})

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A'
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Vừa xong'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

const formatExactTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
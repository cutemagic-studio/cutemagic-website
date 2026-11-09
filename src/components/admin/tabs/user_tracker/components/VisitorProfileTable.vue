<!-- src/components/admin/tabs/user_tracker/components/VisitorProfileTable.vue -->
<template>
  <div :class="[theme.ui.adminRoundedContainer, 'overflow-hidden']">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
           class="bg-[#1e1e1e] rounded-xl border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th class="p-4">Người dùng (IP &amp; Vị trí)</th>
            <th class="p-4">Thiết bị &amp; Mạng</th>
            <th class="p-4 text-center">Trang đã vào</th>
            <th class="p-4 text-center">Pack đã xem</th>
            <th class="p-4 text-center">Download (Hôm nay / Tổng)</th>
            <th class="p-4 text-right">Hoạt động cuối</th>
            <th class="p-4 text-right">Hành trình</th>
          </tr>
        </thead>

        <tbody v-if="items.length > 0">
          <tr 
            v-for="v in items" 
            :key="v.visitorKey" 
            class="border-b border-slate-50 hover:bg-[#4F4F4F] transition-all"
          >
            <!-- Cột 1: Quốc gia, Thành phố & IP -->
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-20 p-r-2 flex items-center">
                    <img 
                  v-if="v.flag" 
                  :src="v.flag" 
                  class="w-8 h-6 object-cover rounded shadow-sm border-2 border-slate-200" 
                  referrerpolicy="no-referrer" 
                />
                </div>
                <div>
                  <div class="grid-col-1 items-center gap-1.5">
                    <span :class="[theme.ui.assetCardTitle]">{{ v.country || 'Unknown' }}</span>
                    <span class="text-[11px] text-slate-400 font-semibold">• {{ v.city }}</span>
                  </div>
                  <code class="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                    {{ v.ip }}
                  </code>
                </div>
              </div>
            </td>

            <!-- Cột 2: Thiết bị & Nhà mạng -->
            <td class="p-4">
              <span 
                :class="getISPStyle(v.isp)" 
                class="px-2 py-0.5 rounded-md text-[10px] font-black border uppercase inline-block mb-1"
              >
                {{ v.isp || 'N/A' }}
              </span>
              <p class="text-[12px] font-bold text-[#CFCFCF]">
                {{ v.device === 'Mobile' ? '📱 Mobile' : '💻 Desktop' }} • {{ v.browser }}
              </p>
            </td>

            <!-- Cột 3: Số trang đã truy cập -->
            <td class="p-4 text-center">
              <span :class="[theme.ui.assetCardNumber, 'text-md']">{{ v.totalPageViews || 1 }}</span>
              
              <p class="text-[12px] font-bold text-[#FF6347] truncate max-w-[140px] mx-auto" :title="v.lastPath">
                <span class="text-[12px] font-bold text-[#CFCFCF] truncate max-w-[140px] mx-auto" :title="v.lastPath">
                Đang ở:
                </span>
              {{ v.lastPath || '/' }}
              </p>
            </td>

            <!-- Cột 4: Số Asset Pack đã xem -->
            <td class="p-4 text-center">
              <div class="w-35 h-12 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs">
                <span class="text-[12px] text-[#1e5aff]">📦 {{ v.uniqueAssetsViewedCount || 0 }} packs</span>
                <span class="text-[12px] opacity-70">({{ v.totalAssetViews || 0 }} lượt)</span>
              </div>
            </td>

            <!-- Cột 5: Download Hôm nay / Tổng Download -->
            <td class="p-4 text-center">
              <div 
                class="w-40 h-12 flex items-center gap-2 px-3 py-1 rounded-xl border"
                :class="(v.totalDownloads || 0) > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'"
              >
                <div class="text-left">
                  <span class="text-xs font-black text-[#363636]">Hôm nay: {{ getVisitorDownloadsToday(v) }}</span>
                  <span class="text-xs font-black">|</span>
                  <span class="text-xs font-black text-[#FF4040]">Tổng: {{ v.totalDownloads || 0 }}</span>
                </div>
              </div>
            </td>

            <!-- Cột 6: Thời gian truy cập -->
            <td class="p-4 text-right">
              <p class="text-xs font-black text-[#7FFF00]">{{ formatTimeAgo(v.lastActive) }}</p>
              <p class="text-[10px] font-bold text-slate-400">{{ formatExactTime(v.lastActive) }}</p>
            </td>

            <!-- Cột 7: Nút mở Modal xem chi tiết các trang & pack họ đã bấm -->
            <td class="p-2 text-right">
              <button 
                @click="$emit('select-visitor', v)"
                :class="[theme.ui.buttonRoundedBorderGreen, 'text-md']"
              >
                Chi tiết
              </button>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="7" class="p-16 text-center text-slate-400 font-bold">
              Chưa có dữ liệu người dùng khớp với bộ lọc...
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

const props = defineProps({
  items: { type: Array, default: () => [] },
  todayKey: { type: String, default: '' }
})

defineEmits(['select-visitor'])

const getVisitorDownloadsToday = (visitor) => {
  if (!visitor?.downloadsByDate || !props.todayKey) return 0
  return visitor.downloadsByDate[props.todayKey] || 0
}

const getISPStyle = (isp) => {
  if (!isp) return 'bg-slate-50 text-slate-400 border-slate-100'
  const name = isp.toLowerCase()
  if (name.includes('viettel')) return 'bg-red-50 text-red-600 border-red-200'
  if (name.includes('fpt')) return 'bg-orange-50 text-orange-600 border-orange-200'
  if (name.includes('vnpt')) return 'bg-blue-50 text-blue-600 border-blue-200'
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

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
<!-- src/components/admin/tabs/activity_notifications/IpActivityDetailView.vue -->
<template>
  <div class="space-y-6 font-sans text-slate-900">

    <!-- 1. Thanh điều hướng Quay lại & Tiêu đề Hồ sơ IP -->
    <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col sm:flex-row sm:items-center justify-between gap-4']">
      <div class="flex items-center gap-4">
        <button
          type="button"
          @click="$emit('back')"
          class="px-4 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-blue-600 text-white text-xs font-black flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>←</span> Quay lại Danh sách
        </button>

        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <img
              v-if="profile?.flag"
              :src="profile.flag"
              class="w-6 h-4 object-cover rounded-xs border border-slate-300"
              referrerpolicy="no-referrer"
            />
            <h3 class="text-lg font-black text-[#1E90FF] font-mono tracking-tight">
              {{ profile?.ip || ipKey }}
            </h3>
            <span class="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
              {{ profile?.location || 'Unknown Location' }}
            </span>
          </div>
          <p class="text-xs font-bold text-slate-400 mt-0.5">
            ISP: <strong class="text-slate-600">{{ profile?.isp || 'N/A' }}</strong> •
            Thiết bị: <strong class="text-slate-600">{{ profile?.device }} ({{ profile?.browser }})</strong>
          </p>
        </div>
      </div>

      <div class="text-right text-xs font-bold text-slate-400">
        <p>Hoạt động gần nhất: <strong class="text-[#00EE76]">{{ formatDateTime(profile?.lastActive) }}</strong></p>
        <p class="mt-0.5">Ghi nhận lần đầu: <strong class="text-slate-600">{{ formatDateTime(profile?.firstSeen) }}</strong></p>
      </div>
    </div>

    <!-- 2. Bốn Thẻ Thống kê Hành vi của riêng IP này -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div @click="actionFilter = 'ALL'"
        class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="actionFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-100'">
        <p class="text-[13px] font-bold text-[#363636]">Tổng Hoạt động</p>
        <p class="text-2xl font-black text-slate-900 mt-1">{{ ipLogs.length }}</p>
        <p class="text-[11px] font-bold text-slate-400 mt-0.5">🌐 {{ profile?.pageVisitsCount || 0 }} lượt vào trang</p>
      </div>

      <div @click="actionFilter = 'VIEW_ASSET'"
        class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="actionFilter === 'VIEW_ASSET' ? 'border-indigo-500 ring-2 ring-indigo-500/15' : 'border-slate-100'">
        <p class="text-[13px] font-bold text-[#363636]">📦 Xem Asset Pack</p>
        <p class="text-2xl font-black text-indigo-600 mt-1">{{ profile?.assetViewsCount || 0 }}</p>
        <p class="text-[11px] font-bold text-slate-400 mt-0.5">Click để lọc lượt xem</p>
      </div>

      <div @click="actionFilter = 'LIKE_ASSET'"
        class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="actionFilter === 'LIKE_ASSET' ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-100'">
        <p class="text-[13px] font-bold text-[#363636]">❤️ Yêu thích Pack</p>
        <p class="text-2xl font-black text-rose-600 mt-1">{{ profile?.likesCount || 0 }}</p>
        <p class="text-[11px] font-bold text-slate-400 mt-0.5">Click để lọc lượt thả tim</p>
      </div>

      <div @click="actionFilter = 'DOWNLOAD_ASSET'"
        class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="actionFilter === 'DOWNLOAD_ASSET' ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-100'">
        <p class="text-[13px] font-bold text-[#363636]">⬇️ Tải xuống Pack</p>
        <p class="text-2xl font-black text-emerald-600 mt-1">{{ profile?.downloadsCount || 0 }}</p>
        <p class="text-[11px] font-bold text-slate-400 mt-0.5">Click để lọc lượt tải</p>
      </div>
    </div>

    <!-- 3. Thanh tìm kiếm nhanh trong lịch sử của IP -->
    <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col sm:flex-row sm:items-center justify-between gap-3']">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="btn in filterButtons"
          :key="btn.id"
          type="button"
          @click="actionFilter = btn.id"
          class="px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer"
          :class="actionFilter === btn.id ? 'bg-[#1e1e1e] text-[#ffe600] border-[#1e1e1e]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'"
        >
          {{ btn.label }}
        </button>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm đường dẫn trang hoặc tên Asset Pack..."
        class="w-full sm:w-72 px-3.5 py-2 rounded-xl border-2 border-[#8470FF] bg-white text-xs font-bold text-slate-800 focus:outline-none"
      />
    </div>

    <!-- 4. Bảng Dòng Thời Gian Hoạt Động Chi Tiết Của Tài Khoản IP -->
    <div :class="[theme.ui.adminRoundedContainer, 'overflow-hidden']">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#1e1e1e] text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <th class="p-4">Thời gian</th>
              <th class="p-4">Loại Hành động</th>
              <th class="p-4">Chi tiết Trang / Asset Pack</th>
              <th class="p-4">Thiết bị &amp; Trình duyệt</th>
            </tr>
          </thead>

          <tbody v-if="filteredIpLogs.length > 0">
            <tr
              v-for="log in filteredIpLogs"
              :key="log.id"
              class="border-b border-slate-100 hover:bg-[#4F4F4F] transition-colors"
            >
              <td class="p-4 whitespace-nowrap">
                <p class="text-xs font-black text-[#00EE76] font-mono">{{ formatTimeOnly(log.timestamp) }}</p>
                <p class="text-[10px] font-bold text-slate-400">{{ formatDateOnly(log.timestamp) }}</p>
              </td>

              <td class="p-4 whitespace-nowrap">
                <span
                  v-if="log.actionType === 'DOWNLOAD_ASSET'"
                  class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black"
                >
                  ⬇️ Tải xuống Pack
                </span>
                <span
                  v-else-if="log.actionType === 'LIKE_ASSET'"
                  class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-black"
                >
                  ❤️ Yêu thích Pack
                </span>
                <span
                  v-else-if="log.actionType === 'VIEW_ASSET'"
                  class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[11px] font-black"
                >
                  📦 Xem chi tiết Pack
                </span>
                <span
                  v-else
                  class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-black"
                >
                  🌐 Truy cập trang
                </span>
              </td>

              <td class="p-4">
                <div v-if="log.assetTitle || log.assetId" class="space-y-0.5">
                  <p class="text-xs font-black text-[#ffe600]">
                    {{ log.assetTitle || 'Asset Pack' }}
                    <span v-if="log.assetId" class="text-[10px] font-mono text-slate-300 ml-1">(#{{ log.assetId }})</span>
                  </p>
                  <p class="text-[11px] font-mono text-slate-400">URL: {{ log.path }}</p>
                </div>
                <div v-else>
                  <code class="px-2 py-1 rounded bg-[#1e1e1e] text-[#00EE76] text-xs font-mono font-bold">
                    {{ log.path }}
                  </code>
                </div>
              </td>

              <td class="p-4 text-xs font-bold text-slate-400 whitespace-nowrap">
                {{ log.device }} • {{ log.browser }}
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="4" class="p-12 text-center text-slate-400 font-bold text-xs">
                Không có hoạt động nào khớp với bộ lọc hiện tại.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useActivityNotificationStore } from '../../../../stores/useActivityNotificationStore'
import { useThemeStore } from '../../../../stores/useThemeStore.js'

const props = defineProps({
  ipKey: { type: String, required: true }
})

defineEmits(['back'])

const theme = useThemeStore()
const activityStore = useActivityNotificationStore()

const actionFilter = ref('ALL')
const searchQuery = ref('')

const filterButtons = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PAGE_VISIT', label: '🌐 Truy cập trang' },
  { id: 'VIEW_ASSET', label: '📦 Xem Pack' },
  { id: 'LIKE_ASSET', label: '❤️ Yêu thích' },
  { id: 'DOWNLOAD_ASSET', label: '⬇️ Tải xuống' }
]

const ipLogs = computed(() => activityStore.getLogsByIp(props.ipKey))
const profile = computed(() => activityStore.getIpSummaryProfile(props.ipKey))

const filteredIpLogs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return ipLogs.value.filter(item => {
    const matchType = actionFilter.value === 'ALL' || item.actionType === actionFilter.value
    const matchQuery = !q ||
      (item.path || '').toLowerCase().includes(q) ||
      (item.assetTitle || '').toLowerCase().includes(q) ||
      String(item.assetId || '').includes(q)
    return matchType && matchQuery
  })
})

const formatDateTime = (ts) => {
  if (!ts) return 'N/A'
  return new Date(ts).toLocaleString('vi-VN')
}

const formatTimeOnly = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatDateOnly = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('vi-VN')
}
</script>
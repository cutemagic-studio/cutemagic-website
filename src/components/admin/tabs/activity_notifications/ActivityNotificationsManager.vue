<!-- src/components/admin/tabs/activity_notifications/ActivityNotificationsManager.vue -->
<template>
  <div class="space-y-6 font-sans text-slate-900">

    <!-- ========================================================= -->
    <!-- CHẾ ĐỘ 1: XEM CHI TIẾT LỊCH SỬ HOẠT ĐỘNG CỦA 1 ĐỊA CHỈ IP -->
    <!-- ========================================================= -->
    <IpActivityDetailView
      v-if="activityStore.selectedIpKey"
      :ip-key="activityStore.selectedIpKey"
      @back="activityStore.closeIpDetailPage()"
    />

    <!-- ========================================================= -->
    <!-- CHẾ ĐỘ 2: TRANG DANH SÁCH THÔNG BÁO HOẠT ĐỘNG TỔNG HỢP     -->
    <!-- ========================================================= -->
    <template v-else>

      <!-- 1. Thanh Cấu hình Giới hạn Bản ghi (Quota 10.000) & Công cụ Test -->
      <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col lg:flex-row lg:items-center justify-between gap-4']">
        <div class="space-y-1.5 flex-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-[#00EE76] border border-[#00EE76]/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00EE76] animate-ping"></span>
              Realtime Stream Active
            </span>
            <h3 :class="[theme.ui.assetCardTitle, 'text-left']">
              Bộ Đệm Nhật Ký Thông Báo: {{ activityStore.totalLogsCount.toLocaleString() }} / {{ activityStore.maxRecordsLimit.toLocaleString() }} bản ghi
            </h3>
          </div>

          <!-- Thanh phần trăm dung lượng bảng thông báo -->
          <div class="w-full max-w-md h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-500"
              :style="{ width: `${activityStore.quotaUsagePercent}%` }"
            ></div>
          </div>
          <p class="text-[11px] font-bold text-slate-400">
            Khi vượt quá giới hạn tối đa, hệ thống tự động xóa các bản ghi cũ nhất để thay bằng bản ghi mới nhất.
          </p>
        </div>

        <!-- Cụm chỉnh giới hạn tối đa (VD: 10000) & Nút bắn thử Toast -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#8470FF]">
            <span class="text-[11px] font-black text-slate-500 uppercase">Giới hạn:</span>
            <input
              v-model.number="limitInput"
              type="number"
              min="100"
              step="500"
              class="w-24 text-xs font-mono font-black text-blue-600 focus:outline-none"
            />
            <button
              type="button"
              @click="handleUpdateMaxLimit"
              class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black cursor-pointer"
            >
              Lưu
            </button>
          </div>

          <!-- Nút mô phỏng 2 thông báo đến cùng lúc để kiểm tra Queue & Highlight -->
          <button
            type="button"
            @click="handleSimulateNotifications"
            class="px-3.5 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-indigo-600 text-[#ffe600] hover:text-white border-2 border-[#ffe600] text-xs font-black transition-all cursor-pointer"
            title="Tạo thử thông báo giả lập để kiểm tra Hàng đợi (Queue), Âm thanh và Click Highlight"
          >
            ⚡ Test Thông báo
          </button>

          <button
            type="button"
            @click="handleClearAllLogs"
            class="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border-2 border-rose-200 text-xs font-black transition-all cursor-pointer"
          >
            🗑️ Xóa toàn bộ
          </button>
        </div>
      </div>

      <!-- 2. Năm Thẻ Lọc Nhanh Theo Loại Hoạt Động -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div @click="selectActionFilter('ALL')"
          class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
          :class="actionFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-100'">
          <p class="text-[13px] font-bold text-left text-[#363636]">Tất cả Thông báo</p>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ activityStore.totalLogsCount }}</p>
        </div>

        <div @click="selectActionFilter('PAGE_VISIT')"
          class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
          :class="actionFilter === 'PAGE_VISIT' ? 'border-amber-500 ring-2 ring-amber-500/15' : 'border-slate-100'">
          <p class="text-[13px] font-bold text-left text-[#363636]">🌐 Truy cập Trang</p>
          <p class="text-2xl font-black text-amber-500 mt-1">{{ countByAction.PAGE_VISIT }}</p>
        </div>

        <div @click="selectActionFilter('VIEW_ASSET')"
          class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
          :class="actionFilter === 'VIEW_ASSET' ? 'border-indigo-500 ring-2 ring-indigo-500/15' : 'border-slate-100'">
          <p class="text-[13px] font-bold text-left text-[#363636]">📦 Xem Asset Pack</p>
          <p class="text-2xl font-black text-indigo-600 mt-1">{{ countByAction.VIEW_ASSET }}</p>
        </div>

        <div @click="selectActionFilter('LIKE_ASSET')"
          class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all"
          :class="actionFilter === 'LIKE_ASSET' ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-100'">
          <p class="text-[13px] font-bold text-left text-[#363636]">❤️ Yêu thích Pack</p>
          <p class="text-2xl font-black text-rose-600 mt-1">{{ countByAction.LIKE_ASSET }}</p>
        </div>

        <div @click="selectActionFilter('DOWNLOAD_ASSET')"
          class="bg-white p-4 rounded-xl border-2 cursor-pointer transition-all col-span-2 md:col-span-1"
          :class="actionFilter === 'DOWNLOAD_ASSET' ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-100'">
          <p class="text-[13px] font-bold text-left text-[#363636]">⬇️ Tải xuống Pack</p>
          <p class="text-2xl font-black text-emerald-600 mt-1">{{ countByAction.DOWNLOAD_ASSET }}</p>
        </div>
      </div>

      <!-- 3. Thanh Tìm kiếm IP / Vị trí / Tên Pack & Nút tắt Highlight -->
      <div :class="[theme.ui.adminRoundedContainer, 'flex flex-col sm:flex-row sm:items-center justify-between gap-4']">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo địa chỉ IP, Thành phố, Quốc gia, Đường dẫn hoặc Tên Asset Pack..."
            class="w-full px-4 py-2.5 rounded-xl border-2 border-[#8470FF] bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="activityStore.highlightedLogId"
            type="button"
            @click="activityStore.clearHighlight()"
            class="px-3.5 py-2 rounded-xl bg-[#ffe600] text-[#1e1e1e] text-xs font-black border-2 border-[#1e1e1e] cursor-pointer"
          >
            ✨ Bỏ đánh dấu Highlight
          </button>

          <span class="text-xs font-black text-slate-400">
            Hiển thị {{ paginatedLogs.length }} / {{ filteredLogs.length }} kết quả
          </span>
        </div>
      </div>

      <!-- 4. Bảng Danh Sách Thông Báo Hoạt Động (Hỗ trợ Highlight & Click mở trang IP) -->
      <div :class="[theme.ui.adminRoundedContainer, 'overflow-hidden']">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#1e1e1e] text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th class="p-4">Thời gian</th>
                <th class="p-4">Tài khoản IP &amp; Vị trí Địa lý</th>
                <th class="p-4">Hoạt động tiêu biểu</th>
                <th class="p-4">Đích đến (Trang / Asset Pack)</th>
                <th class="p-4 text-right">Hồ sơ IP</th>
              </tr>
            </thead>

            <tbody v-if="paginatedLogs.length > 0">
              <tr
                v-for="item in paginatedLogs"
                :key="item.id"
                :id="`activity-row-${item.id}`"
                class="border-b border-slate-100 transition-all duration-300"
                :class="activityStore.highlightedLogId === item.id
                  ? 'bg-[#ffe600]/25 ring-3 ring-[#ffe600] shadow-lg'
                  : 'hover:bg-[#4F4F4F]'"
              >
                <!-- Cột 1: Thời gian -->
                <td class="p-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      v-if="activityStore.highlightedLogId === item.id"
                      class="px-2 py-0.5 rounded bg-[#ffe600] text-[#1e1e1e] text-[9px] font-black uppercase animate-bounce"
                    >
                      🎯 Vừa chọn
                    </span>
                    <div>
                      <p class="text-xs font-black text-[#00EE76] font-mono">{{ formatTime(item.timestamp) }}</p>
                      <p class="text-[10px] font-bold text-slate-400">{{ formatDate(item.timestamp) }}</p>
                    </div>
                  </div>
                </td>

                <!-- Cột 2: Địa chỉ IP & Địa lý ngắn gọn (Click mở trang chi tiết IP) -->
                <td class="p-4">
                  <div
                    @click="activityStore.openIpDetailPage(item.ip)"
                    class="inline-flex items-center gap-2.5 cursor-pointer group"
                    title="Click để xem toàn bộ lịch sử hoạt động của IP này"
                  >
                    <img
                      v-if="item.flag"
                      :src="item.flag"
                      class="w-5 h-3.5 object-cover rounded-xs border border-slate-300 shrink-0"
                      referrerpolicy="no-referrer"
                    />
                    <div>
                      <p class="text-xs font-mono font-black text-[#1E90FF] group-hover:underline">
                        {{ item.ip }}
                      </p>
                      <p class="text-[11px] font-bold text-slate-400">
                        {{ item.location }} • <span class="text-slate-500">{{ item.device }}</span>
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Cột 3: Loại Hoạt động -->
                <td class="p-4 whitespace-nowrap">
                  <span
                    v-if="item.actionType === 'DOWNLOAD_ASSET'"
                    class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black"
                  >
                    ⬇️ Vừa tải xuống Pack
                  </span>
                  <span
                    v-else-if="item.actionType === 'LIKE_ASSET'"
                    class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-black"
                  >
                    ❤️ Vừa yêu thích Pack
                  </span>
                  <span
                    v-else-if="item.actionType === 'VIEW_ASSET'"
                    class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[11px] font-black"
                  >
                    📦 Vừa mở xem Pack
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-black"
                  >
                    🌐 Vừa truy cập trang
                  </span>
                </td>

                <!-- Cột 4: Chi tiết Trang hoặc Asset Pack -->
                <td class="p-4">
                  <div v-if="item.assetTitle || item.assetId" class="space-y-0.5">
                    <p class="text-xs font-black text-[#ffe600]">
                      {{ item.assetTitle }}
                      <span v-if="item.assetId" class="text-[10px] font-mono text-slate-400 ml-1">(#{{ item.assetId }})</span>
                    </p>
                    <p class="text-[10px] font-mono text-slate-400">{{ item.path }}</p>
                  </div>
                  <div v-else>
                    <code class="px-2 py-1 rounded bg-[#1e1e1e] text-[#00EE76] text-xs font-mono font-bold">
                      {{ item.path }}
                    </code>
                  </div>
                </td>

                <!-- Cột 5: Nút mở trang Chi tiết Hoạt động của IP -->
                <td class="p-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    @click="activityStore.openIpDetailPage(item.ip)"
                    class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-black border-2 border-slate-700 transition-colors cursor-pointer"
                  >
                    🔍 Chi tiết IP →
                  </button>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="5" class="p-16 text-center text-slate-400 font-bold">
                  Chưa có thông báo hoạt động nào khớp với bộ lọc.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang gọn gàng -->
        <div v-if="totalPages > 1" class="p-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black disabled:opacity-40 cursor-pointer"
            >
              ← Trước
            </button>
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black disabled:opacity-40 cursor-pointer"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useActivityNotificationStore } from '../../../../stores/useActivityNotificationStore'
import { useNotificationStore } from '../../../../stores/useNotificationStore'
import { useThemeStore } from '../../../../stores/useThemeStore.js'
import { pushActivityNotificationLog } from '../../../../services/activityLogService'

import IpActivityDetailView from './IpActivityDetailView.vue'

const theme = useThemeStore()
const activityStore = useActivityNotificationStore()
const notify = useNotificationStore()

const actionFilter = ref('ALL')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 25
const limitInput = ref(activityStore.maxRecordsLimit || 10000)

onMounted(() => {
  activityStore.initRealtimeActivityStream()
  limitInput.value = activityStore.maxRecordsLimit
})

watch(() => activityStore.maxRecordsLimit, (newVal) => {
  limitInput.value = newVal
})

// Đếm số lượng theo từng loại hành động
const countByAction = computed(() => {
  const counts = { PAGE_VISIT: 0, VIEW_ASSET: 0, LIKE_ASSET: 0, DOWNLOAD_ASSET: 0 }
  activityStore.logs.forEach(item => {
    if (counts[item.actionType] !== undefined) {
      counts[item.actionType]++
    } else {
      counts.PAGE_VISIT++
    }
  })
  return counts
})

const selectActionFilter = (type) => {
  actionFilter.value = type
  currentPage.value = 1
}

// Lọc danh sách thông báo
const filteredLogs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return activityStore.logs.filter(item => {
    const matchAction = actionFilter.value === 'ALL' || item.actionType === actionFilter.value
    const matchQuery = !q ||
      (item.ip || '').toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q) ||
      (item.path || '').toLowerCase().includes(q) ||
      (item.assetTitle || '').toLowerCase().includes(q) ||
      String(item.assetId || '').includes(q)
    return matchAction && matchQuery
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage) || 1)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredLogs.value.slice(start, start + itemsPerPage)
})

// =========================================================================
// TỰ ĐỘNG LẬT TRANG & CUỘN TỚI DÒNG ĐƯỢC HIGHLIGHT KHI CLICK TỪ TOAST
// =========================================================================
watch(
  () => activityStore.highlightedLogId,
  async (targetId) => {
    if (!targetId) return

    // Bỏ bộ lọc nếu bản ghi nằm ngoài bộ lọc hiện tại
    const idxInFiltered = filteredLogs.value.findIndex(i => i.id === targetId)
    if (idxInFiltered === -1) {
      actionFilter.value = 'ALL'
      searchQuery.value = ''
    }

    await nextTick()
    const finalIndex = filteredLogs.value.findIndex(i => i.id === targetId)
    if (finalIndex !== -1) {
      currentPage.value = Math.floor(finalIndex / itemsPerPage) + 1
    }

    await nextTick()
    const rowEl = document.getElementById(`activity-row-${targetId}`)
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  },
  { immediate: true }
)

// Cập nhật giới hạn số lượng bản ghi tối đa (Mặc định 10.000)
const handleUpdateMaxLimit = async () => {
  const confirmed = await notify.confirm({
    title: 'Cập nhật giới hạn lưu trữ thông báo?',
    message: `Hệ thống sẽ giới hạn bảng thông báo ở mức tối đa ${limitInput.value.toLocaleString()} bản ghi. Nếu hiện tại vượt quá con số này, các bản ghi cũ nhất sẽ được dọn dẹp tự động.`,
    highlightText: `Max Quota: ${limitInput.value.toLocaleString()} records`,
    confirmText: 'Lưu cấu hình',
    variant: 'info',
    icon: '⚙️'
  })

  if (!confirmed) return

  const res = await activityStore.setMaxRecordsConfig(limitInput.value)
  notify.success(
    'Đã lưu cấu hình giới hạn!',
    `Giới hạn mới: ${activityStore.maxRecordsLimit.toLocaleString()} bản ghi (Đã dọn ${res.deleted || 0} bản ghi cũ).`
  )
}

// Bắn thử 2 thông báo liên tiếp để kiểm tra Hàng đợi (Queue), Âm thanh & Click Highlight 
const handleSimulateNotifications = async () => {
  await pushActivityNotificationLog('LIKE_ASSET', {
    path: '/assets/102401',
    assetId: 102401,
    assetTitle: 'Stylized Lowpoly Tree Pack'
  })

  await pushActivityNotificationLog('DOWNLOAD_ASSET', {
    path: '/assets/108920',
    assetId: 108920,
    assetTitle: 'Cute Magic Cube Animals'
  })
}

const handleClearAllLogs = async () => {
  const confirmed = await notify.confirm({
    title: 'Xóa toàn bộ nhật ký thông báo?',
    message: 'Thao tác này sẽ làm trống bảng analytics/activity_logs trên Firebase.',
    highlightText: `${activityStore.totalLogsCount} bản ghi thông báo`,
    confirmText: 'Xóa toàn bộ',
    variant: 'danger',
    icon: '🗑️'
  })

  if (!confirmed) return

  await activityStore.clearAllActivityLogs()
  notify.success('Đã làm sạch bảng thông báo', 'Toàn bộ lịch sử thông báo đã được xóa.')
}

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatDate = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('vi-VN')
}
</script>
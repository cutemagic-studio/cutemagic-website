<!-- src/components/admin/tabs/user_tracker/VisitorLogs.vue -->
<template>
  <div class="space-y-6 font-sans text-slate-900">
    
    <!-- 1. Header & Cụm nút Sao lưu (.js) / Dọn dẹp 30 ngày -->
    <VisitorHeaderToolbar
      :expired-count="expiredCount"
      :is-cleaning="isCleaning"
      :is-exporting="isExportingAnalytics"
      @backup="handleDownloadAnalyticsBackup"
      @cleanup="handleCleanupOldData"
    />

    <!-- 2. Năm Thẻ KPI Thống kê Quan trọng -->
    <VisitorKpiCards
      :unique-visitors-count="visitorsList.length"
      :active-today-count="activeTodayCount"
      :total-asset-views-all="totalAssetViewsAll"
      :downloads-today-all="downloadsTodayAll"
      :total-downloads-all="totalDownloadsAll"
      :today-key="todayKey"
    />

    <!-- 3. Thanh Chuyển Chế độ Xem (Visitors / Events) & Bộ lọc -->
    <VisitorFilterBar
      v-model:view-mode="viewMode"
      v-model:sort-by="sortBy"
      v-model:search-query="searchQuery"
      v-model:filter-country="filterCountry"
      v-model:filter-i-s-p="filterISP"
      :visitors-count="visitorsList.length"
      :events-count="eventsList.length"
      :unique-countries="uniqueCountries"
      :unique-i-s-ps="uniqueISPs"
    />

    <!-- 4A. Bảng 1: Hồ sơ Người dùng Duy nhất theo IP -->
    <VisitorProfileTable
      v-if="viewMode === 'visitors'"
      :items="paginatedItems"
      :today-key="todayKey"
      @select-visitor="selectedVisitor = $event"
    />

    <!-- 4B. Bảng 2: Luồng Sự kiện Chi tiết (Event Stream) -->
    <VisitorEventStreamTable
      v-else
      :items="paginatedItems"
    />

    <!-- 5. Thanh Phân trang Dùng chung -->
    <VisitorPagination
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :start-index="startIndex"
      :end-index="endIndex"
      :total-items="activeFilteredList.length"
    />

    <!-- 6. Modal Chi tiết Hành trình của 1 Địa chỉ IP -->
    <VisitorDetailModal
      :visitor="selectedVisitor"
      :today-key="todayKey"
      @close="selectedVisitor = null"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue } from 'firebase/database'
import { getTodayKey, purgeOldAnalyticsData } from '../../../../services/trackerService'
import { downloadAnalyticsBackupJS } from '../../../../services/backupService'

// Import 7 Component Con
import VisitorHeaderToolbar from './components/VisitorHeaderToolbar.vue'
import VisitorKpiCards from './components/VisitorKpiCards.vue'
import VisitorFilterBar from './components/VisitorFilterBar.vue'
import VisitorProfileTable from './components/VisitorProfileTable.vue'
import VisitorEventStreamTable from './components/VisitorEventStreamTable.vue'
import VisitorPagination from './components/VisitorPagination.vue'
import VisitorDetailModal from './components/VisitorDetailModal.vue'

import { useNotificationStore } from '../../../../stores/useNotificationStore'

const notify = useNotificationStore()

const visitorsList = ref([])
const eventsList = ref([])
const viewMode = ref('visitors') // 'visitors' | 'events'
const selectedVisitor = ref(null)
const isCleaning = ref(false)
const isExportingAnalytics = ref(false)

// Bộ lọc & Phân trang
const searchQuery = ref('')
const filterCountry = ref('')
const filterISP = ref('')
const sortBy = ref('lastActive')
const currentPage = ref(1)
const itemsPerPage = 10

const todayKey = getTodayKey()
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

onMounted(() => {
  // 1. Lắng nghe bảng Hồ sơ Người dùng Duy nhất (Theo IP)
  onValue(dbRef(db, 'analytics/visitors'), (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      visitorsList.value = []
      return
    }
    visitorsList.value = Object.keys(data).map(key => ({
      visitorKey: key,
      ...data[key]
    }))
  })

  // 2. Lắng nghe bảng Sự kiện chi tiết (Sắp xếp mới nhất lên đầu)
  onValue(dbRef(db, 'analytics/events'), (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      eventsList.value = []
      return
    }
    eventsList.value = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  })
})

const getVisitorDownloadsToday = (visitor) => {
  if (!visitor?.downloadsByDate) return 0
  return visitor.downloadsByDate[todayKey] || 0
}

// ==========================================
// CÁC CHỈ SỐ THỐNG KÊ TỔNG QUAN (KPIs)
// ==========================================
const activeTodayCount = computed(() => {
  const todayStr = new Date().toDateString()
  return visitorsList.value.filter(v => new Date(v.lastActive).toDateString() === todayStr).length
})

const totalAssetViewsAll = computed(() => {
  return visitorsList.value.reduce((sum, v) => sum + (v.totalAssetViews || 0), 0)
})

const downloadsTodayAll = computed(() => {
  return visitorsList.value.reduce((sum, v) => sum + getVisitorDownloadsToday(v), 0)
})

const totalDownloadsAll = computed(() => {
  return visitorsList.value.reduce((sum, v) => sum + (v.totalDownloads || 0), 0)
})

const expiredCount = computed(() => {
  const cutoff = Date.now() - THIRTY_DAYS_MS
  const oldVisitors = visitorsList.value.filter(v => (v.lastActive || 0) < cutoff).length
  const oldEvents = eventsList.value.filter(e => (e.timestamp || 0) < cutoff).length
  return oldVisitors + oldEvents
})

// ==========================================
// SAO LƯU (.JS) & DỌN DẸP DỮ LIỆU > 30 NGÀY
// ==========================================
const handleDownloadAnalyticsBackup = async () => {
  isExportingAnalytics.value = true
  const result = await downloadAnalyticsBackupJS()
  isExportingAnalytics.value = false

  if (!result.success) {
    alert('Lỗi khi sao lưu dữ liệu hành vi: ' + result.error)
  }
}

const handleCleanupOldData = async () => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận dọn dẹp dữ liệu quá hạn?',
    message: 'Hệ thống sẽ xóa toàn bộ hồ sơ IP và nhật ký sự kiện không hoạt động cũ hơn 30 ngày để giải phóng dung lượng Firebase.',
    highlightText: 'TTL Cleanup (> 30 Days)',
    confirmText: 'Dọn dẹp ngay',
    variant: 'warning',
    icon: '🧹' 
  })

  if (!confirmed) return

  isCleaning.value = true
  const result = await purgeOldAnalyticsData(30)
  isCleaning.value = false

  if (result.success) {
    notify.success(
      'Dọn dẹp dữ liệu thành công!',
      `Đã xóa ${result.deletedVisitorsCount} hồ sơ IP và ${result.deletedEventsCount} nhật ký sự kiện quá hạn.`
    )
  } else {
    notify.error('Lỗi khi dọn dẹp', result.error)
  }
}

// ==========================================
// LỌC, SẮP XẾP & PHÂN TRANG
// ==========================================
const uniqueCountries = computed(() => [...new Set(visitorsList.value.map(v => v.country).filter(Boolean))].sort())
const uniqueISPs = computed(() => [...new Set(visitorsList.value.map(v => v.isp).filter(Boolean))].sort())

const filteredVisitors = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return visitorsList.value
    .filter(v => {
      const matchSearch = !q || 
        (v.ip || '').toLowerCase().includes(q) ||
        (v.city || '').toLowerCase().includes(q) ||
        (v.visitedPages || []).some(p => p.toLowerCase().includes(q)) ||
        (v.viewedAssets || []).some(a => a.toLowerCase().includes(q))
      const matchCountry = !filterCountry.value || v.country === filterCountry.value
      const matchISP = !filterISP.value || v.isp === filterISP.value
      return matchSearch && matchCountry && matchISP
    })
    .sort((a, b) => {
      if (sortBy.value === 'downloadsToday') return getVisitorDownloadsToday(b) - getVisitorDownloadsToday(a)
      if (sortBy.value === 'totalDownloads') return (b.totalDownloads || 0) - (a.totalDownloads || 0)
      if (sortBy.value === 'assetViews') return (b.uniqueAssetsViewedCount || 0) - (a.uniqueAssetsViewedCount || 0)
      return (b.lastActive || 0) - (a.lastActive || 0)
    })
})

const filteredEvents = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return eventsList.value.filter(e => {
    const matchSearch = !q ||
      (e.ip || '').toLowerCase().includes(q) ||
      (e.path || '').toLowerCase().includes(q) ||
      (e.assetTitle || '').toLowerCase().includes(q)
    const matchCountry = !filterCountry.value || e.country === filterCountry.value
    const matchISP = !filterISP.value || e.isp === filterISP.value
    return matchSearch && matchCountry && matchISP
  })
})

const activeFilteredList = computed(() => viewMode.value === 'visitors' ? filteredVisitors.value : filteredEvents.value)
const totalPages = computed(() => Math.ceil(activeFilteredList.value.length / itemsPerPage) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, activeFilteredList.value.length))
const paginatedItems = computed(() => activeFilteredList.value.slice(startIndex.value, startIndex.value + itemsPerPage))

// Tự động đưa về trang 1 khi thay đổi bộ lọc hoặc chuyển chế độ xem
watch([searchQuery, filterCountry, filterISP, sortBy, viewMode], () => {
  currentPage.value = 1
})
</script>
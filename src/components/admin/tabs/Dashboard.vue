<!-- src/components/admin/tabs/Dashboard.vue -->
<template>
  <div class="space-y-8 font-sans text-slate-900">

    <!-- ======================================================= -->
    <!-- PHẦN 1: 4 THẺ KPI TỔNG HỢP (FIREBASE + PINIA STORE)     -->
    <!-- ======================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- KPI 1: Người dùng duy nhất (IP) -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div class="flex items-center justify-between">
          <span :class="[theme.ui.assetCardTitle, 'text-left']">
            Unique Visitors (30d)</span>
          <span class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">👥</span>
        </div>
        <div class="my-3">
          <p :class="[theme.ui.assetCardNumber, 'text-3xl text-left']">{{ visitors.length }}</p>
          <p class="text-xs font-bold text-emerald-600 mt-1">
            +{{ activeTodayCount }} IP hoạt động hôm nay
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Tổng trang đã xem:</span>
          <span class="text-slate-700 font-black">{{ totalPageViews }} trang</span>
        </div>
      </div>

      <!-- KPI 2: Lượt xem Asset Pack thực tế -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div class="flex items-center justify-between">
          <span :class="[theme.ui.assetCardTitle, 'text-left']">Lượt xem Asset Pack</span>
          <span class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">👁️</span>
        </div>
        <div class="my-3">
          <p :class="[theme.ui.assetCardNumber, 'text-3xl text-left']">{{ totalAssetViews }}</p>
          <p class="text-xs font-bold text-slate-500 mt-1">
            Trung bình {{ avgPacksPerVisitor }} packs / người
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Tỷ lệ quan tâm Pack:</span>
          <span class="text-indigo-600 font-black">{{ engagementRate }}% khách</span>
        </div>
      </div>

      <!-- KPI 3: Lượt Download (Hôm nay & Tổng) -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div class="flex items-center justify-between">
          <span :class="[theme.ui.assetCardTitle, 'text-left']">Lượt Tải xuống (30d)</span>
          <span class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">⬇️</span>
        </div>
        <div class="my-3">
          <div class="flex items-baseline gap-2">
            <p :class="[theme.ui.assetCardNumber, 'text-3xl text-left']">{{ totalDownloads }}</p>
            <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black">
              +{{ downloadsToday }} hôm nay
            </span>
          </div>
          <p class="text-xs font-bold text-slate-500 mt-1">
            Từ {{ freePacksCount }} gói Free &amp; Starter Packs
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Tỷ lệ chuyển đổi tải:</span>
          <span class="text-emerald-600 font-black">{{ downloadConversionRate }}%</span>
        </div>
      </div>

      <!-- KPI 4: Quy mô Kho CmgAssetModel -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div class="flex items-center justify-between">
          <span :class="[theme.ui.assetCardTitle, 'text-left']">Kho Asset Pack</span>
          <span class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">📦</span>
        </div>
        <div class="my-3">
          <p :class="[theme.ui.assetCardNumber, 'text-3xl text-left']">{{ assetStore.assets.length }} Packs</p>
          <p class="text-xs font-bold text-amber-600 mt-1">
            {{ storeStats.models.toLocaleString() }} 3D Models tổng cộng
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Đang giảm giá / Sắp ra:</span>
          <span class="text-slate-700 font-black">{{ discountedPacksCount }} Sale • {{ upcomingPacksCount }} Soon</span>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- PHẦN 2: BIỂU ĐỒ HOẠT ĐỘNG 7 NGÀY & TOP QUỐC GIA         -->
    <!-- ======================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Biểu đồ 7 ngày gần nhất (Chiếm 2 cột) --> 
      <div :class="[ theme.ui.adminRoundedContainer, 'lg:col-span-2']">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 :class="[theme.ui.assetCardTitle, 'text-left']">Lưu lượng Tương tác &amp; Download (7 ngày qua)</h3>
            <p class="text-xs text-slate-400 font-medium">Thống kê từ nhật ký sự kiện thực tế trên Firebase</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-bold">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span> Lượt truy cập &amp; Xem</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span> Lượt Download</span>
          </div>
        </div>

        <!-- Khu vực vẽ cột biểu đồ -->
        <div class="grid grid-cols-7 gap-3 items-end h-52 pt-6 px-2 border-b border-slate-100">
          <div v-for="day in last7DaysStats" :key="day.dateKey" class="flex flex-col items-center h-full justify-end group">
            <!-- Số liệu hiển thị trên đỉnh cột -->
            <div class="text-[10px] font-black text-slate-500 mb-1.5 opacity-80 group-hover:opacity-100">
              {{ day.views }}<span v-if="day.downloads > 0" class="text-emerald-600"> / {{ day.downloads }}↓</span>
            </div>

            <!-- Cặp cột Views & Downloads -->
            <div class="w-full max-w-[44px] flex items-end justify-center gap-1 h-36 bg-slate-50 rounded-t-xl p-1">
              <div 
                class="w-1/2 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-300"
                :style="{ height: day.viewHeight + '%' }"
                :title="`Lượt xem ngày ${day.label}: ${day.views}`"
              ></div>
              <div 
                class="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
                :style="{ height: day.downloadHeight + '%' }"
                :title="`Lượt tải ngày ${day.label}: ${day.downloads}`"
              ></div>
            </div>
          </div>
        </div>

        <!-- Nhãn ngày bên dưới -->
        <div class="grid grid-cols-7 gap-3 pt-3 text-center">
          <div v-for="day in last7DaysStats" :key="day.dateKey + '_lbl'">
            <p class="text-xs font-black" :class="day.isToday ? 'text-blue-600' : 'text-slate-600'">{{ day.label }}</p>
            <p class="text-[10px] font-bold text-slate-400">{{ day.subLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Bảng xếp hạng Top Quốc gia truy cập (Chiếm 1 cột) -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 :class="[theme.ui.assetCardTitle, 'text-left']">Top Quốc gia Truy cập</h3>
              <p class="text-xs text-slate-400 font-medium">Tính theo số lượng IP duy nhất</p>
            </div>
            <span class="text-xl">🌍</span>
          </div>

          <div v-if="topCountries.length > 0" class="space-y-4">
            <div v-for="item in topCountries" :key="item.country" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 font-black text-slate-700">
                  <img v-if="item.flag" :src="item.flag" class="w-5 h-3.5 object-cover rounded-xs border border-slate-200" referrerpolicy="no-referrer" />
                  <span>{{ item.country }}</span>
                </div>
                <span class="font-black text-slate-900">{{ item.count }} IP <span class="text-slate-400 font-bold">({{ item.percent }}%)</span></span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full transition-all duration-500" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else class="py-12 text-center text-xs font-bold text-slate-400 italic">
            Đang thu thập dữ liệu vị trí địa lý...
          </div>
        </div>

        <!-- Thống kê nhanh Thiết bị (Desktop vs Mobile) -->
        <div class="pt-5 mt-6 border-t border-slate-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Tỷ lệ Thiết bị người dùng</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
              <span class="text-xs font-bold text-slate-600">💻 Desktop</span>
              <span class="text-sm font-black text-slate-900">{{ deviceStats.desktopPercent }}%</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
              <span class="text-xs font-bold text-slate-600">📱 Mobile</span>
              <span class="text-sm font-black text-slate-900">{{ deviceStats.mobilePercent }}%</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- PHẦN 3: TOP ASSET ĐƯỢC XEM NHIỀU & HOẠT ĐỘNG GẦN ĐÂY    -->
    <!-- ======================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Bảng 1: Top Asset Pack được người dùng quan tâm nhất -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 :class="[theme.ui.assetCardTitle, 'text-left']">🔥 Asset Pack được quan tâm nhất</h3>
            <p class="text-xs text-slate-400 font-medium">Xếp hạng theo hành vi Xem &amp; Download thực tế</p>
          </div>
        </div>

        <div v-if="topInteractedAssets.length > 0" class="space-y-3">
          <div 
            v-for="(pack, index) in topInteractedAssets" 
            :key="pack.name"
            class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/50 transition-colors border border-slate-100"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span 
                class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                :class="index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'"
              >
                #{{ index + 1 }}
              </span>
              <p class="text-xs font-black text-[#1e1e1e] truncate">{{ pack.name }}</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-black">
                👁️ {{ pack.views }}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-black">
                ⬇️ {{ pack.downloads }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="py-12 text-center text-xs font-bold text-slate-400 italic">
          Chưa có lượt mở xem hoặc tải Asset Pack nào được ghi nhận.
        </div>
      </div>

      <!-- Bảng 2: 6 Hoạt động vừa diễn ra tức thì -->
      <div :class="[theme.ui.adminRoundedContainer]">
        <div>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 :class="[theme.ui.assetCardTitle, 'text-left']">⚡ Hoạt động Vừa diễn ra</h3>
              <p class="text-xs text-slate-400 font-medium">6 sự kiện mới nhất trên toàn trang web</p>
            </div>
            <button 
              @click="$emit('switch-tab', 'logs')"
              class="text-xs font-black text-blue-600 hover:underline cursor-pointer"
            >
              Xem tất cả →
            </button>
          </div>

          <div v-if="recentEvents.length > 0" class="space-y-3">
            <div 
              v-for="ev in recentEvents" 
              :key="ev.id"
              class="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span v-if="ev.actionType === 'DOWNLOAD_ASSET'" class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm shrink-0">⬇️</span>
                <span v-else-if="ev.actionType === 'VIEW_ASSET'" class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm shrink-0">📦</span>
                <span v-else class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm shrink-0">🌐</span>

                <div class="min-w-0">
                  <p class="text-xs font-black text-[#7FFF00] truncate">
                    <span v-if="ev.actionType === 'DOWNLOAD_ASSET'">Tải xuống: {{ ev.assetTitle }}</span>
                    <span v-else-if="ev.actionType === 'VIEW_ASSET'">Xem Pack: {{ ev.assetTitle }}</span>
                    <span v-else class="text-[12px] font-bold text-[#FF6347] truncate max-w-[140px] mx-auto">
                      <span class="text-[12px] font-bold text-[#CFCFCF] truncate max-w-[140px] mx-auto">
                        Truy cập trang: 
                      </span>
                      
                      {{ ev.path }}</span>
                  </p>
                  <p class="text-[11px] font-bold text-slate-400">
                    IP: {{ ev.ip }} • {{ ev.city }}, {{ ev.country }}
                  </p>
                </div>
              </div>

              <span class="text-[11px] font-black text-slate-400 shrink-0 ml-2">
                {{ formatShortTimeAgo(ev.timestamp) }}
              </span>
            </div>
          </div>
          <div v-else class="py-12 text-center text-xs font-bold text-slate-400 italic">
            Chưa có sự kiện nào được ghi nhận.
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../../firebase'
import { ref as dbRef, onValue } from 'firebase/database'
import { useAssetStore } from '../../../stores/useAssetStore'
import { getTodayKey } from '../../../services/trackerService'

import { useThemeStore } from '../../../stores/useThemeStore.js'
const theme = useThemeStore()

defineEmits(['switch-tab'])

const assetStore = useAssetStore()
const visitors = ref([])
const events = ref([])
const todayKey = getTodayKey()

onMounted(() => {
  onValue(dbRef(db, 'analytics/visitors'), (snap) => {
    const data = snap.val()
    visitors.value = data ? Object.values(data) : []
  })

  onValue(dbRef(db, 'analytics/events'), (snap) => {
    const data = snap.val()
    if (!data) {
      events.value = []
      return
    }
    events.value = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  })
})

// ==========================================
// 1. THỐNG KÊ TỪ KHO PINIA (CmgAssetModel)
// ==========================================
const storeStats = computed(() => assetStore.getStatistics)
const freePacksCount = computed(() => assetStore.assets.filter(a => a.isFree).length)
const discountedPacksCount = computed(() => assetStore.assets.filter(a => a.hasDiscount).length)
const upcomingPacksCount = computed(() => assetStore.upcomingAssets.length)

// ==========================================
// 2. THỐNG KÊ HÀNH VI TỪ FIREBASE
// ==========================================
const activeTodayCount = computed(() => {
  const todayStr = new Date().toDateString()
  return visitors.value.filter(v => new Date(v.lastActive).toDateString() === todayStr).length
})

const totalPageViews = computed(() => visitors.value.reduce((s, v) => s + (v.totalPageViews || 1), 0))
const totalAssetViews = computed(() => visitors.value.reduce((s, v) => s + (v.totalAssetViews || 0), 0))
const totalDownloads = computed(() => visitors.value.reduce((s, v) => s + (v.totalDownloads || 0), 0))

const downloadsToday = computed(() => {
  return visitors.value.reduce((s, v) => s + (v.downloadsByDate?.[todayKey] || 0), 0)
})

const avgPacksPerVisitor = computed(() => {
  if (!visitors.value.length) return 0
  return (totalAssetViews.value / visitors.value.length).toFixed(1)
})

const engagementRate = computed(() => {
  if (!visitors.value.length) return 0
  const engaged = visitors.value.filter(v => (v.uniqueAssetsViewedCount || 0) > 0).length
  return Math.round((engaged / visitors.value.length) * 100)
})

const downloadConversionRate = computed(() => {
  if (!visitors.value.length) return 0
  const downloaders = visitors.value.filter(v => (v.totalDownloads || 0) > 0).length
  return Math.round((downloaders / visitors.value.length) * 100)
})

// ==========================================
// 3. BIỂU ĐỒ 7 NGÀY GẦN NHẤT
// ==========================================
const last7DaysStats = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateKey = `${yyyy}-${mm}-${dd}`
    const dayStr = d.toDateString()

    // Đếm sự kiện trong ngày đó
    const dayEvents = events.value.filter(e => new Date(e.timestamp).toDateString() === dayStr)
    const views = dayEvents.filter(e => e.actionType === 'PAGE_VIEW' || e.actionType === 'VIEW_ASSET').length
    const downloads = dayEvents.filter(e => e.actionType === 'DOWNLOAD_ASSET').length

    days.push({
      dateKey,
      label: i === 0 ? 'Hôm nay' : `${dd}/${mm}`,
      subLabel: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      isToday: i === 0,
      views,
      downloads
    })
  }

  const maxVal = Math.max(...days.map(d => Math.max(d.views, d.downloads)), 5)
  return days.map(d => ({
    ...d,
    viewHeight: Math.max(Math.round((d.views / maxVal) * 100), d.views > 0 ? 12 : 4),
    downloadHeight: Math.max(Math.round((d.downloads / maxVal) * 100), d.downloads > 0 ? 12 : 4)
  }))
})

// ==========================================
// 4. TOP QUỐC GIA & THIẾT BỊ
// ==========================================
const topCountries = computed(() => {
  if (!visitors.value.length) return []
  const map = new Map()
  visitors.value.forEach(v => {
    const c = v.country || 'Unknown'
    if (!map.has(c)) map.set(c, { country: c, flag: v.flag || '', count: 0 })
    map.get(c).count++
  })
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({
      ...item,
      percent: Math.round((item.count / visitors.value.length) * 100)
    }))
})

const deviceStats = computed(() => {
  const total = visitors.value.length
  if (!total) return { desktopPercent: 100, mobilePercent: 0 }
  const mobile = visitors.value.filter(v => v.device === 'Mobile').length
  const mobilePercent = Math.round((mobile / total) * 100)
  return {
    desktopPercent: 100 - mobilePercent,
    mobilePercent
  }
})

// ==========================================
// 5. TOP ASSET PACK ĐƯỢC TƯƠNG TÁC NHIỀU NHẤT
// ==========================================
const topInteractedAssets = computed(() => {
  const packMap = new Map()

  events.value.forEach(ev => {
    if (!ev.assetTitle) return
    const key = ev.assetTitle
    if (!packMap.has(key)) {
      packMap.set(key, { name: key, views: 0, downloads: 0 })
    }
    if (ev.actionType === 'VIEW_ASSET') packMap.get(key).views++
    if (ev.actionType === 'DOWNLOAD_ASSET') packMap.get(key).downloads++
  })

  return Array.from(packMap.values())
    .sort((a, b) => (b.views + b.downloads * 2) - (a.views + a.downloads * 2))
    .slice(0, 6)
})

const recentEvents = computed(() => events.value.slice(0, 6))

const formatShortTimeAgo = (ts) => {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 60000) return 'Vừa xong'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}p trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h trước`
  return `${Math.floor(hours / 24)} ngày`
}
</script>
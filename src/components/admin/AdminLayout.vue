<!-- src/components/admin/AdminLayout.vue -->
<template>
  <!-- ========================================================= -->
  <!-- TRƯỜNG HỢP 1: CHƯA XÁC THỰC -> HIỆN MÀN HÌNH KHÓA BẢO MẬT -->
  <!-- ========================================================= -->
  <div v-if="!isAuthenticated" class="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative z-10">
      <div class="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
        🔐
      </div>

      <div class="text-center mb-8">
        <span class="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
          Restricted Area
        </span>
        <h1 class="text-2xl font-black text-white tracking-tight mt-3">CuteMagic Admin Gate</h1>
        <p class="text-xs text-slate-400 font-medium mt-1">
          Vui lòng xác thực mã PIN quản trị viên để mở khóa hệ thống.
        </p>
      </div>

      <form @submit.prevent="handleUnlock" class="space-y-5">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Mật khẩu Quản trị (Admin Passcode)
          </label>
          <div class="relative">
            <input 
              ref="passwordInputRef"
              v-model="passwordInput"
              :type="showPassword ? 'text' : 'password'"
              :disabled="lockoutRemaining > 0 || isVerifying"
              placeholder="••••••••"
              autocomplete="off"
              class="w-full bg-slate-950 border rounded-2xl px-4 py-3.5 text-sm font-black text-white tracking-widest placeholder:tracking-normal focus:outline-none transition-all"
              :class="errorMsg ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-3.5 text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {{ showPassword ? 'Ẩn' : 'Hiện' }}
            </button>
          </div>

          <p v-if="lockoutRemaining > 0" class="text-xs font-bold text-amber-400 mt-2.5 flex items-center gap-1.5">
            <span>⏳</span> Nhập sai quá nhiều lần. Vui lòng thử lại sau {{ lockoutRemaining }}s.
          </p>
          <p v-else-if="errorMsg" class="text-xs font-bold text-rose-400 mt-2.5 flex items-center gap-1.5">
            <span>⚠️</span> {{ errorMsg }}
          </p>
        </div>

        <button 
          type="submit"
          :disabled="lockoutRemaining > 0 || isVerifying || !passwordInput"
          class="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
        >
          {{ isVerifying ? 'Đang xác thực SHA-256...' : 'Mở khóa Hệ thống →' }}
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <router-link to="/" class="font-bold text-slate-400 hover:text-white transition-colors">
          ← Quay về Trang chủ
        </router-link>
        <span class="text-[10px] font-bold text-slate-600 uppercase">SHA-256 Protected</span>
      </div>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- TRƯỜNG HỢP 2: ĐÃ XÁC THỰC -> HIỆN GIAO DIỆN ADMIN ĐẦY ĐỦ  -->
  <!-- ========================================================= -->
  <div v-else class="h-screen flex bg-transparent font-sans text-slate-900 overflow-hidden">

    <!-- ======================================================= -->
    <!-- SIDEBAR TRÁI (HỖ TRỢ THU GỌN CHỈ HIỂN THỊ ICON)         -->
    <!-- ======================================================= -->
    <aside 
      :class="[
        'bg-[#1e1e1e] border-r-2 border-slate-200/80 flex flex-col h-full shrink-0 shadow-sm z-20 transition-all duration-300 relative',
        isSidebarCollapsed ? 'w-20 p-3' : 'w-68 p-6'
      ]"
    >
      <!-- Nút Thu gọn / Mở rộng Sidebar nằm trên cạnh phải Sidebar -->
      <button
        type="button"
        @click="toggleSidebar"
        class="absolute -right-3.5 top-7 w-7 h-7 rounded-full bg-[#ffe600] hover:bg-blue-600 text-[#1e1e1e] hover:text-white border-2 border-[#1e1e1e] flex items-center justify-center text-xs font-black shadow-md cursor-pointer transition-all z-30"
        :title="isSidebarCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar (Chỉ hiện Icon)'"
      >
        {{ isSidebarCollapsed ? '❯' : '❮' }}
      </button>

      <!-- Logo & Tên Hệ Thống -->
      <div 
        class="mb-8 flex items-center transition-all"
        :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-2 gap-3'"
      >
        <div 
          @click="toggleSidebar"
          class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 shrink-0 cursor-pointer"
          title="CuteMagic Admin OS"
        >
          CM
        </div>
        <div v-if="!isSidebarCollapsed" class="min-w-0 overflow-hidden">
          <h1 class="text-lg font-black text-white tracking-tight leading-none truncate">CuteMagic</h1>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest truncate">Admin OS v2.0</p>
          </div>
        </div>
      </div>

      <p v-if="!isSidebarCollapsed" class="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        Quản trị hệ thống
      </p>

      <!-- Danh sách Menu Tabs (Khi thu gọn chỉ hiện Icon) -->
      <nav class="flex-1 space-y-2 overflow-y-auto pr-0.5 custom-scrollbar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="activeTab = tab" 
          :title="isSidebarCollapsed ? `${tab.name} (${tab.badge || ''})` : ''"
          :class="[
            theme.ui.buttonRoundedBorderOrange,
            'w-full flex items-center relative transition-all',
            isSidebarCollapsed ? 'justify-center !px-0 !py-3' : 'justify-between',
            activeTab.id === tab.id
              ? 'dark:bg-[#ffe600] bg-[#ffe600] shadow-lg shadow-[#1e1e1e] !text-[#363636] !border-[#1e1e1e]'
              : ''
          ]"
        >
          <div class="flex items-center" :class="isSidebarCollapsed ? 'justify-center' : 'gap-3'">
            <span class="text-lg leading-none">{{ tab.icon }}</span>
            <span v-if="!isSidebarCollapsed" :class="[activeTab.id === tab.id ? 'font-bold' : '']">
              {{ tab.name }}
            </span>
          </div>

          <!-- Badge khi Sidebar mở rộng -->
          <span 
            v-if="!isSidebarCollapsed && tab.badge" 
            :class="activeTab.id === tab.id ? 'bg-white/20 text-[#363636]' : 'bg-blue-50 text-blue-600'"
            class="px-2 py-0.5 rounded-lg text-[10px] font-black border-2 border-[#1e1e1e]"
          >
            {{ tab.id === 'activity_notifications' ? activityStore.totalLogsCount : tab.badge }}
          </span>

          <!-- Chấm tròn báo hiệu khi Sidebar đang thu gọn -->
          <span
            v-if="isSidebarCollapsed && tab.id === 'activity_notifications' && activityStore.totalLogsCount > 0"
            class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#00EE76] border border-[#1e1e1e]"
          ></span>
        </button>
      </nav>

      <!-- Thông tin Admin & Nút Khóa máy (Tự động gọn lại khi thu nhỏ Sidebar) -->
      <div class="mt-auto pt-4 border-t border-slate-800 space-y-3">
        <div v-if="!isSidebarCollapsed" class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-black uppercase text-slate-400">Database Engine</span>
            <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">Firebase RTDB</span>
          </div>
          <p class="text-[11px] font-bold text-slate-600">
            Activity Logs: {{ activityStore.totalLogsCount }} / {{ activityStore.maxRecordsLimit }}
          </p>
        </div>

        <div 
          class="flex items-center"
          :class="isSidebarCollapsed ? 'justify-center' : 'justify-between px-1'"
        >
          <div v-if="!isSidebarCollapsed">
            <p class="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
              <span>●</span> Đã xác thực
            </p>
            <p class="text-xs font-black text-white">Admin Cute Magic</p>
          </div>
          <button 
            @click="handleLockAdmin" 
            title="Khóa trang Admin (Đăng xuất)"
            :class="[
              'rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-black text-xs cursor-pointer',
              isSidebarCollapsed ? 'w-11 h-11 p-0' : 'px-3 py-2'
            ]"
          >
            <span>🔒</span>
            <span v-if="!isSidebarCollapsed">Khóa</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- ======================================================= -->
    <!-- NỘI DUNG CHÍNH BÊN PHẢI (TỰ ĐỘNG MỞ RỘNG KHI THU SIDEBAR)-->
    <!-- ======================================================= -->
    <main class="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative transition-all duration-300">
      <div 
        :class="[
          'mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80 transition-all duration-300',
          isSidebarCollapsed ? 'max-w-[1650px]' : 'max-w-7xl'
        ]"
      >
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-[#00EE76] mb-1">
            <span>Admin Control Panel</span>
            <span>/</span>
            <span>{{ activeTab.name }}</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-black text-[#ECECEC] tracking-tight">{{ activeTab.name }}</h2>
          <p class="text-slate-400 text-xs font-medium mt-0.5">{{ activeTab.subtitle }}</p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <!-- Nút Bật/Tắt Âm thanh Thông báo Real-time -->
          <button
            type="button"
            @click="activityStore.toggleSoundMute()"
            class="px-3.5 py-2.5 rounded-2xl border-2 text-xs font-black transition-all flex items-center gap-2 cursor-pointer"
            :class="activityStore.soundMuted 
              ? 'bg-[#1e1e1e] text-slate-400 border-slate-700 hover:border-slate-500' 
              : 'bg-[#1e1e1e] text-[#ffe600] border-[#ffe600] shadow-sm'"
            title="Bật / Tắt âm thanh khi có thông báo hoạt động mới"
          >
            <span>{{ activityStore.soundMuted ? '🔇 Tắt tiếng' : '🔊 Chuông Live' }}</span>
          </button>

          <router-link 
            to="/assets"
            class="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 text-xs font-black transition-all shadow-sm"
          >
            Mở Asset Library
          </router-link>
          <router-link 
            to="/"
            class="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black transition-all shadow-sm"
          >
            Quay lại Trang chủ
          </router-link>
        </div>
      </div>

      <div 
        :class="[
          'mx-auto pb-12 transition-all duration-300',
          isSidebarCollapsed ? 'max-w-[1650px]' : 'max-w-7xl'
        ]"
      >
        <transition name="fade" mode="out-in">
          <component :is="activeTab.component" @switch-tab="handleSwitchTab" />
        </transition>
      </div>
    </main>

    <!-- Nhúng Hộp thoại xác nhận, Toast CRUD và Live Activity Toast Real-time -->
    <ConfirmDialog />
    <ToastContainer />
    <LiveActivityToast />
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted, nextTick } from 'vue'
import DashboardTab from './tabs/Dashboard.vue'
import VisitorLogsTab from './tabs/user_tracker/VisitorLogs.vue'
import AssetManagerTab from './tabs/asset_manager/AssetManager.vue'
import ActivityNotificationsTab from './tabs/activity_notifications/ActivityNotificationsManager.vue'
import HeroShowcaseTab from './tabs/hero_showcase/HeroShowcaseManager.vue'

import { isAdminAuthenticated, verifyAdminPassword, logoutAdmin } from '../../utils/adminAuth'
import { useActivityNotificationStore } from '../../stores/useActivityNotificationStore'
import { useThemeStore } from '../../stores/useThemeStore.js'

import ConfirmDialog from './common/ConfirmDialog.vue'
import ToastContainer from './common/ToastContainer.vue'
import LiveActivityToast from './common/LiveActivityToast.vue'

const theme = useThemeStore()
const activityStore = useActivityNotificationStore()

// --- TRẠNG THÁI THU GỌN SIDEBAR (LƯU VÀO LOCALSTORAGE) ---
const SIDEBAR_COLLAPSED_KEY = 'cmg_admin_sidebar_collapsed'
const isSidebarCollapsed = ref(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true')

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isSidebarCollapsed.value ? 'true' : 'false')
}

// --- TRẠNG THÁI XÁC THỰC BẢO MẬT ---
const isAuthenticated = ref(isAdminAuthenticated())
const passwordInput = ref('')
const showPassword = ref(false)
const isVerifying = ref(false)
const errorMsg = ref('')
const failedAttempts = ref(0)
const lockoutRemaining = ref(0)
const passwordInputRef = ref(null)

// --- DANH SÁCH CÁC TAB QUẢN TRỊ ---
const tabs = [
  { 
    id: 'dashboard', 
    name: 'Tổng quan', 
    subtitle: 'Báo cáo tổng hợp kho tài nguyên 3D & Lưu lượng người dùng thời gian thực.',
    icon: '📊', 
    badge: 'Live',
    component: markRaw(DashboardTab) 
  },
  { 
    id: 'activity_notifications', 
    name: 'Nhật ký Thông báo', 
    subtitle: 'Luồng thông báo hoạt động tiêu biểu thời gian thực, hàng đợi sự kiện & giới hạn 10.000 bản ghi.',
    icon: '🔔', 
    badge: '10K',
    component: markRaw(ActivityNotificationsTab) 
  },
  { 
    id: 'logs', 
    name: 'Hành vi Người dùng', 
    subtitle: 'Theo dõi hành trình theo IP duy nhất, lượt xem Asset Pack và lượt tải xuống.',
    icon: '🌐', 
    badge: '30d',
    component: markRaw(VisitorLogsTab) 
  },
  { 
    id: 'assets', 
    name: 'Quản lý Asset Pack', 
    subtitle: 'Thêm, sửa, xóa mềm, khôi phục bản ghi song song và đồng bộ CmgAssetModel với Firebase.',
    icon: '📦', 
    badge: 'CMS',
    component: markRaw(AssetManagerTab) 
  },
  
  { 
    id: 'hero_showcase', 
    name: 'Hero Showcase', 
    subtitle: 'Quản lý tham số mảng ID các Asset Pack nổi bật và thứ tự trình chiếu tại Hero Section.',
    icon: '🌟', 
    badge: 'Hero',
    component: markRaw(HeroShowcaseTab) 
  },
] 

const activeTab = ref(tabs[0])

const handleSwitchTab = (tabId) => {
  const target = tabs.find(t => t.id === tabId)
  if (target) activeTab.value = target
}

onMounted(() => {
  // Đăng ký hàm chuyển tab để khi click vào LiveActivityToast sẽ nhảy thẳng sang tab 'activity_notifications'
  activityStore.registerTabSwitcher(handleSwitchTab)

  if (!isAuthenticated.value) {
    nextTick(() => {
      passwordInputRef.value?.focus()
    })
  } else {
    activityStore.initRealtimeActivityStream()
  }
})

// Xử lý khi bấm nút Mở khóa
const handleUnlock = async () => {
  if (lockoutRemaining.value > 0 || !passwordInput.value) return

  isVerifying.value = true
  errorMsg.value = ''

  const isValid = await verifyAdminPassword(passwordInput.value)
  isVerifying.value = false

  if (isValid) {
    isAuthenticated.value = true
    passwordInput.value = ''
    failedAttempts.value = 0
    activityStore.initRealtimeActivityStream()
  } else {
    failedAttempts.value++
    passwordInput.value = ''
    
    if (failedAttempts.value >= 5) {
      lockoutRemaining.value = 30
      const timer = setInterval(() => {
        lockoutRemaining.value--
        if (lockoutRemaining.value <= 0) {
          clearInterval(timer)
          failedAttempts.value = 0
          errorMsg.value = ''
        }
      }, 1000)
    } else {
      errorMsg.value = `Mật khẩu không chính xác! (Còn ${5 - failedAttempts.value} lần thử)`
    }
  }
}

const handleLockAdmin = () => {
  logoutAdmin()
  isAuthenticated.value = false
  nextTick(() => {
    passwordInputRef.value?.focus()
  })
}
</script>
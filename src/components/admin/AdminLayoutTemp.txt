<!-- src/components/admin/AdminLayout.vue -->
<template>
  <!-- ========================================================= -->
  <!-- TRƯỜNG HỢP 1: CHƯA XÁC THỰC -> HIỆN MÀN HÌNH KHÓA BẢO MẬT -->
  <!-- ========================================================= -->
  <div v-if="!isAuthenticated" class="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
    <!-- Hiệu ứng ánh sáng nền -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative z-10">
      <!-- Icon Khiên bảo mật -->
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

          <!-- Thông báo lỗi hoặc đếm ngược khóa tạm thời -->
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

    <!-- SIDEBAR TRÁI -->
    <aside class="w-68 bg-[#1e1e1e] border-r-2 border-slate-200/80 p-6 flex flex-col h-full shrink-0 shadow-sm z-10">
      <div class="mb-8 px-2 flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
          CM
        </div>
        <div>
          <h1 class="text-lg font-black text-slate-900 tracking-tight leading-none">CuteMagic</h1>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Admin OS v2.0</p>
          </div>
        </div>
      </div>

      <p class="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quản trị hệ thống</p>
      <nav class="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="activeTab = tab" 
          :class="[
            // 'w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer',
            theme.ui.buttonRoundedBorderOrange, 'w-full flex items-center justify-between',
            activeTab.id === tab.id
              ? 'dark:bg-[#ffe600] shadow-lg shadow-[#1e1e1e] !text-[#363636] !border-[#1e1e1e]'
              : ''
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="text-base">{{ tab.icon }}</span>
            <span :class="[activeTab.id === tab.id ? 'font-bold' : '']">{{ tab.name }}</span>
          </div>
          <span 
            v-if="tab.badge" 
            :class="activeTab.id === tab.id ? 'bg-white/20 text-[#363636]' : 'bg-blue-50 text-blue-600'"
            class="px-2 py-0.5 rounded-lg text-[10px] font-black border-2 border-[#1e1e1e]"
          >
            {{ tab.badge }}
          </span>
        </button>
      </nav>

      <!-- Thông tin Admin & Nút Khóa máy (Đăng xuất) -->
      <div class="mt-auto pt-5 border-t border-slate-100 space-y-4">
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-black uppercase text-slate-400">Database Engine</span>
            <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">Firebase RTDB</span>
          </div>
          <p class="text-[11px] font-bold text-slate-600">Chu kỳ lưu: Tự động 30 ngày</p>
        </div>

        <div class="flex items-center justify-between px-1">
          <div>
            <p class="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
              <span>●</span> Đã xác thực
            </p>
            <p class="text-xs font-black text-slate-800">Admin Cute Magic</p>
          </div>
          <button 
            @click="handleLockAdmin" 
            title="Khóa trang Admin (Đăng xuất)"
            class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center gap-1.5 transition-colors font-black text-xs cursor-pointer"
          >
            <span>🔒</span> Khóa
          </button>
        </div>
      </div>
    </aside>

    <!-- NỘI DUNG CHÍNH BÊN PHẢI -->
    <main class="flex-1 h-full overflow-y-auto p-6 lg:p-10 relative">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-[#00EE76] mb-1">
            <span>Admin Control Panel</span>
            <span>/</span>
            <span>{{ activeTab.name }}</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-black text-[#ECECEC] tracking-tight">{{ activeTab.name }}</h2>
          <p class="text-slate-500 text-xs font-medium mt-0.5">{{ activeTab.subtitle }}</p>
        </div>

        <div class="flex items-center gap-3">
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

      <div class="max-w-7xl mx-auto pb-12">
        <transition name="fade" mode="out-in">
          <component :is="activeTab.component" @switch-tab="handleSwitchTab" />
        </transition>
      </div>
    </main>


    <!-- Nhúng Hộp thoại xác nhận và Khung Toast nổi dùng chung toàn Admin -->
    <ConfirmDialog />
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted, nextTick } from 'vue'
import DashboardTab from './tabs/Dashboard.vue'
// import ContentManager from './tabs/user_vote/ContentManager.vue'
import VisitorLogsTab from './tabs/user_tracker/VisitorLogs.vue'
import AssetManagerTab from './tabs/asset_manager/AssetManager.vue'
import { isAdminAuthenticated, verifyAdminPassword, logoutAdmin } from '../../utils/adminAuth'

import ConfirmDialog from './common/ConfirmDialog.vue'
import ToastContainer from './common/ToastContainer.vue'

import { useThemeStore } from '../../stores/useThemeStore.js'
const theme = useThemeStore()

// --- TRẠNG THÁI XÁC THỰC BẢO MẬT ---
const isAuthenticated = ref(isAdminAuthenticated())
const passwordInput = ref('')
const showPassword = ref(false)
const isVerifying = ref(false)
const errorMsg = ref('')
const failedAttempts = ref(0)
const lockoutRemaining = ref(0)
const passwordInputRef = ref(null)

onMounted(() => {
  if (!isAuthenticated.value) {
    nextTick(() => {
      passwordInputRef.value?.focus()
    })
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
  } else {
    failedAttempts.value++
    passwordInput.value = ''
    
    // Nếu nhập sai 5 lần liên tiếp -> Khóa ô nhập 30 giây chống dò mật khẩu
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

// Xử lý khi bấm nút "Khóa" ở góc dưới Sidebar
const handleLockAdmin = () => {
  logoutAdmin()
  isAuthenticated.value = false
  nextTick(() => {
    passwordInputRef.value?.focus()
  })
}

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
    subtitle: 'Thêm, sửa, xóa, bật khuyến mãi và đồng bộ CmgAssetModel trực tiếp với Firebase.',
    icon: '📦', 
    badge: 'CMS',
    component: markRaw(AssetManagerTab) 
  },

//   { 
//     id: 'vote', 
//     name: 'Quản lý Bình chọn (Vote)', 
//     subtitle: 'Quản lý danh sách bình chọn ý tưởng Asset Pack mới từ cộng đồng.',
//     icon: '🗳️', 
//     component: markRaw(ContentManager) 
//   }
]

const activeTab = ref(tabs[0])

const handleSwitchTab = (tabId) => {
  const target = tabs.find(t => t.id === tabId)
  if (target) activeTab.value = target
}
</script>
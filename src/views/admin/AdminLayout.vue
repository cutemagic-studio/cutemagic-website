<template>
    <div class="h-screen flex bg-slate-50 font-sans text-slate-900 overflow-hidden">

        <aside class="w-64 bg-white border-r border-slate-200 p-6 flex flex-col h-full shrink-0">
            <div class="mb-10 px-2">
                <h1 class="text-xl font-black text-blue-600 tracking-tight">CuteMagic Admin</h1>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Control Panel v1.0</p>
            </div>

            <nav class="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab" :class="[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all',
                    activeTab.id === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100'
                ]">
                    <span class="text-lg">{{ tab.icon }}</span>
                    {{ tab.name }}
                </button>

            </nav>

            <div class="mt-auto pt-6 border-t border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Đang đăng nhập</p>
                <p class="text-xs font-black text-slate-700">Admin Cute Magic</p>
            </div>
        </aside>

        <main class="flex-1 h-full overflow-y-auto p-10 relative">
            <router-link to="/"
                class="absolute top-10 right-10 text-slate-400 hover:text-blue-600 text-xs font-bold transition-colors">
                ← Quay lại trang chủ
            </router-link>

            <header class="mb-8">
                <h2 class="text-3xl font-black">{{ activeTab.name }}</h2>
                <p class="text-slate-500 text-sm font-medium">Hệ thống quản trị thời gian thực.</p>
            </header>

            <div class="max-w-6xl">
                <transition name="fade" mode="out-in">
                    <component :is="activeTab.component" />
                </transition>
            </div>
        </main>

    </div>
</template>



<script setup>
import { ref, markRaw } from 'vue'
// Import các Tab (Chúng ta sẽ tạo file ở Bước 2)
import DashboardTab from './tabs/Dashboard.vue'

import ContentManager from './tabs/user_vote/ContentManager.vue'

import VisitorLogsTab from './tabs/user_tracker/VisitorLogs.vue'



// Danh sách các Tab
const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊', component: markRaw(DashboardTab) },
    { id: 'vote', name: 'Quản lý Vote', icon: '🗳️', component: markRaw(ContentManager) },
    {
        id: 'logs', // ID để nhận diện
        name: 'Lịch sử truy cập',
        icon: '🌐',
        component: markRaw(VisitorLogsTab) // 2. Đưa Component vào danh sách
    },
]

const activeTab = ref(tabs[0]) // Mặc định mở Tab Tổng quan
</script>

<style scoped>
/* Làm thanh cuộn đẹp hơn cho Main Content */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
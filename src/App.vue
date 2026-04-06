<template>
  <div class="min-h-screen flex flex-col font-sans antialiased text-gray-900">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <TrafficTracker />
    <UserTracker />

    <div class="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none">
      <div
        class="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-2xl shadow-2xl pointer-events-auto">
        <div class="flex items-center justify-between gap-4">

          <div class="flex items-center gap-3">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p class="text-xs md:text-sm text-slate-300 font-medium">
              <span class="text-white font-bold">CuteMagic Beta:</span>
              Work in progress. Some features may be unavailable.
            </p>
          </div>

          <button class="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TrafficTracker from './components/utils/TrafficTracker.vue'
import UserTracker from './views/admin/tabs/user_tracker/UserTracker.vue' // Import vào đây
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
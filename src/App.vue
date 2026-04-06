<template>
  <div class="min-h-screen flex flex-col font-sans antialiased text-gray-900">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <TrafficTracker />
    <UserTracker />
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
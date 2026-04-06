<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight italic">Content Manager</h1>
      <p class="text-sm text-slate-500 font-medium">Điều hướng nội dung và tương tác người dùng</p>
    </div>

    <div class="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl mb-8 w-fit">
      <button @click="activeSubTab = 'voting'" :class="[
        'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
        activeSubTab === 'voting' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      ]">
        🎯 Quản lý đợt Vote
      </button>
      <button @click="activeSubTab = 'suggestions'" :class="[
        'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
        activeSubTab === 'suggestions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      ]">
        💡 Ý tưởng & Đề xuất
      </button>
      <button @click="activeSubTab = 'community'" :class="[
        'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
        activeSubTab === 'community' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      ]">
        👥 Cộng đồng & Lượt Vote
      </button>
    </div>

    <transition name="fade-slide" mode="out-in">
      <div :key="activeSubTab">

        <div v-if="activeSubTab === 'voting'" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div class="xl:col-span-2">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-tighter">Cấu hình danh sách Vote</h3>
            </div>
            <VoteCampaignManager />
          </div>

          <div class="xl:col-span-1">
            <div class="mb-4">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-tighter">Bảng xếp hạng thực tế</h3>
            </div>
            <VoteManager />
          </div>
        </div>

        <div v-else-if="activeSubTab === 'suggestions'">
          <div class="mb-4">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-tighter">Hòm thư góp ý</h3>
          </div>
          <SuggestionManager />
        </div>

        <div v-else-if="activeSubTab === 'community'">
          <UserActivityManager />
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Import đúng đường dẫn các component con của bạn
import VoteCampaignManager from './VoteCampaignManager.vue'
import VoteManager from './VoteManager.vue'
import SuggestionManager from './SuggestionManager.vue'
import UserActivityManager from './UserActivityManager.vue'

const activeSubTab = ref('voting') // Mặc định mở tab Vote
</script>

<style scoped>
/* Hiệu ứng chuyển tab mượt mà */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
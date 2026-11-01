<template>
  <!-- [ĐÃ CẬP NHẬT]: Nền tối, hiệu ứng ánh sáng nền (Glassmorphism) -->
  <section id="roadmap" class="py-24">

    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col gap-12">

        <!-- Khối tiêu đề trên cùng -->
        <div class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-2xl transition-colors relative overflow-hidden">
          <!-- Ánh sáng glow mờ ở góc khối tiêu đề -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6 relative z-10">
            Release Roadmap
          </h3>
          <div class="h-1.5 w-12 bg-blue-500 mb-6 relative z-10"></div>
          <p class="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-2xl relative z-10">
            We continuously evolve based on community feedback to build the ultimate asset ecosystem.
          </p>
        </div>

        <!-- Khối Timeline -->
        <!-- [ĐÃ CẬP NHẬT]: dark:before:via-slate-700 để đường kẻ dọc mượt mà trong Dark mode -->
        <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-gray-300 dark:before:via-slate-700 before:to-transparent">
          
          <div v-for="(item, index) in roadmap" :key="index" class="relative pl-12 group">
            
            <!-- Chấm tròn trên dòng thời gian -->
            <!-- [ĐÃ CẬP NHẬT]: dark:border-[#0b0e14] để viền chấm tiệp màu với nền trang web -->
            <div :class="[
              'absolute left-0 w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#0b0e14] shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110', 
              item.status === 'In Progress' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'
            ]">
              <div class="w-2 h-2 bg-white dark:bg-gray-200 rounded-full"></div>
            </div>

            <!-- Khối Nội dung thẻ (Card) -->
            <!-- [ĐÃ CẬP NHẬT]: Thêm hiệu ứng Glassmorphism, viền border-[#1C1C1C], Hover nhấc lên -->
            <div class="bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 md:p-8 rounded-3xl transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-blue-500/20 dark:group-hover:border-gray-500/50">
              
              <div class="flex justify-between items-center mb-4">
                <span class="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">{{ item.month }}</span>
                <BaseBadge 
                  :label="item.status"
                  :type="item.status === 'In Progress' ? 'new' : 'pro'" 
                />
              </div>
              
              <h4 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{{ item.title }}</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ item.desc }}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseBadge from '../base/BaseBadge.vue'
import BaseButton from '../base/BaseButton.vue'

// Dữ liệu lộ trình sản xuất
const roadmap = [
    { month: 'May 2026', title: 'Pack name', status: 'In Progress', desc: '_' },
    { month: 'June 2026', title: 'Pack name', status: 'Planned', desc: '_' },
    { month: 'July 2026', title: 'Pack name', status: 'Planned', desc: '_' }
]

// Lưu ý: Nếu trong project của bạn chưa định nghĩa mảng voteItems thì hàm này có thể gây lỗi,
// hãy đảm bảo bạn đã import hoặc khai báo biến voteItems nếu dùng đến nó.
const handleVote = (id) => {
    const item = voteItems.value.find(i => i.id === id)
    if (item && !item.voted) {
        item.votes++
        item.voted = true
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

h3 {
  letter-spacing: -0.05em;
}
</style>


<template>
  <section id="roadmap" class="py-16 md:py-24 bg-slate-50 scroll-mt-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col gap-10">

        <div class="bg-slate-900 rounded-[2rem] p-8 md:p-14 text-white shadow-xl">
          <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
            Release Roadmap
          </h3>
          <div class="h-1.5 w-12 bg-blue-500 mb-8"></div>
          <p class="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
            We continuously evolve based on community feedback to build the ultimate asset ecosystem.
          </p>
        </div>

        <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-gray-300 before:to-transparent">
          
          <div v-for="(item, index) in roadmap" :key="index" class="relative pl-12 group">
            
            <div :class="[
              'absolute left-0 w-10 h-10 rounded-full border-4 border-slate-50 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110', 
              item.status === 'In Progress' ? 'bg-blue-600' : 'bg-gray-300'
            ]">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div class="flex justify-between items-center mb-3">
                <span class="text-blue-600 font-black text-xs uppercase tracking-widest">{{ item.month }}</span>
                <BaseBadge 
                  :label="item.status"
                  :type="item.status === 'In Progress' ? 'new' : 'pro'" 
                />
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">{{ item.title }}</h4>
              <p class="text-gray-600 text-sm leading-relaxed">{{ item.desc }}</p>
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

/* Ép font-black cho tiêu đề để giống style WhyChooseUs */
h3 {
  letter-spacing: -0.05em;
}
</style>
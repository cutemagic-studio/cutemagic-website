<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xs font-black uppercase text-slate-400 tracking-widest">Bảng xếp hạng Vote</h3>
      <span class="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">Real-time</span>
    </div>

    <div class="space-y-5">
      <div v-for="(item, index) in sortedVotes" :key="item.id" class="group">
        <div class="flex justify-between items-end mb-2">
          <div class="flex items-center gap-3">
            <div :class="getRankClass(index)" class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm">
              {{ index + 1 }}
            </div>
            <span class="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">
              {{ item.title }}
            </span>
          </div>
          <span class="text-xs font-black text-slate-900">{{ item.votes }} <span class="text-[10px] text-slate-400 font-medium">lượt</span></span>
        </div>

        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-1000 ease-out rounded-full"
            :class="getBarColor(index)"
            :style="{ width: calculatePercent(item.votes) + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="sortedVotes.length === 0" class="py-10 text-center">
        <p class="text-xs text-slate-400 italic font-medium">Chưa có dữ liệu bình chọn...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue } from 'firebase/database'

const voteItems = ref([])

onMounted(() => {
  // Lấy dữ liệu từ assets_vote (nơi lưu tổng số vote)
  onValue(dbRef(db, 'assets_vote'), (snapshot) => {
    const data = snapshot.val()
    if (data) {
      voteItems.value = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }))
    }
  })
})

// Sắp xếp giảm dần theo lượt vote
const sortedVotes = computed(() => {
  return [...voteItems.value].sort((a, b) => (b.votes || 0) - (a.votes || 0))
})

// Tính % dựa trên mục có vote cao nhất (để thanh bar không bị quá ngắn)
const calculatePercent = (votes) => {
  if (sortedVotes.value.length === 0) return 0
  const max = sortedVotes.value[0].votes || 1
  return (votes / max) * 100
}

// Style cho số thứ tự (Vàng - Bạc - Đồng)
const getRankClass = (index) => {
  if (index === 0) return 'bg-amber-100 text-amber-600 border border-amber-200'
  if (index === 1) return 'bg-slate-100 text-slate-500 border border-slate-200'
  if (index === 2) return 'bg-orange-100 text-orange-600 border border-orange-200'
  return 'bg-white text-slate-400 border border-slate-100'
}

// Màu sắc thanh Bar
const getBarColor = (index) => {
  if (index === 0) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
  return 'bg-slate-300'
}
</script>
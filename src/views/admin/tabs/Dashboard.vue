

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">👁️</div>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Lượt xem</p>
      <h3 class="text-3xl font-black">{{ stats.total_views }}</h3>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 text-xl">👤</div>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Người dùng thật</p>
      <h3 class="text-3xl font-black">{{ stats.unique_visitors }}</h3>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-xl">🔥</div>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Tổng lượt vote</p>
      <h3 class="text-3xl font-black">{{ totalVotes }}</h3>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-xl">📩</div>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Đề xuất ý tưởng</p>
      <h3 class="text-3xl font-black">{{ suggestionCount }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../../firebase'
import { ref as dbRef, onValue } from 'firebase/database'

const stats = ref({ total_views: 0, unique_visitors: 0 })
const totalVotes = ref(0)
const suggestionCount = ref(0)

onMounted(() => {
  // Lấy view
  onValue(dbRef(db, 'site_stats'), (snapshot) => {
    if (snapshot.exists()) stats.value = snapshot.val()
  })

  // Tính tổng vote từ các asset
  onValue(dbRef(db, 'assets_vote'), (snapshot) => {
    let count = 0
    snapshot.forEach((child) => {
      count += (child.val().votes || 0)
    })
    totalVotes.value = count
  })

  // Đếm số đề xuất
  onValue(dbRef(db, 'user_suggestions'), (snapshot) => {
    suggestionCount.value = snapshot.size // size là hàm có sẵn của Firebase snapshot
  })
})
</script>
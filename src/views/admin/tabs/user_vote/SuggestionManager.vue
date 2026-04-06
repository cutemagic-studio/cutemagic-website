<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng đề xuất</p>
        <p class="text-2xl font-black text-slate-800">{{ suggestions.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p class="text-[10px] font-black text-amber-400 uppercase mb-1">Đang chờ duyệt</p>
        <p class="text-2xl font-black text-slate-800">{{ pendingCount }}</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-end">
        <button @click="deleteAllApproved" 
                class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase border border-red-100 px-4 py-2 rounded-xl transition-all hover:bg-red-50">
          Dọn dẹp rác
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <transition-group name="list">
        <div v-for="sug in suggestions" :key="sug.id" 
             class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between">
          
          <div>
            <div class="flex justify-between items-start mb-4">
              <span :class="sug.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'" 
                    class="text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest">
                {{ sug.status === 'approved' ? '✓ Đã duyệt' : '● Chờ xử lý' }}
              </span>
              <span class="text-[10px] font-bold text-slate-300 italic">{{ formatTime(sug.timestamp) }}</span>
            </div>

            <p class="text-slate-700 font-bold leading-relaxed mb-6 italic text-sm">
              "{{ sug.content }}"
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
                <div class="flex items-center gap-3">
                    <img :src="sug.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(sug.displayName)}&background=random&color=fff`" 
                         class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" 
                         referrerpolicy="no-referrer" />
                    <div>
                        <p class="text-[11px] font-black text-slate-800 leading-none mb-1">{{ sug.displayName }}</p>
                        <div class="flex items-center gap-1">
                            <img v-if="sug.flag" :src="sug.flag" class="w-3 shadow-xs" />
                            <p class="text-[9px] text-slate-400 font-bold uppercase">{{ sug.country || 'Unknown' }}</p>
                        </div>
                    </div>
                </div>
                <p class="text-[9px] font-bold text-slate-300">{{ sug.email }}</p>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div class="flex gap-2">
                <button v-if="sug.status === 'pending'" @click="approve(sug.id)"
                        class="bg-emerald-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-100">
                  Duyệt ngay
                </button>
                <button @click="moveToVote(sug)"
                        class="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  Đưa vào Vote
                </button>
              </div>
              
              <button @click="removeSug(sug.id)" class="text-slate-300 hover:text-red-500 transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="suggestions.length === 0" class="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
      <p class="text-slate-400 font-bold italic text-sm">Hòm thư đang trống trơn... "Hehe"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue, remove, update, push } from 'firebase/database'

const suggestions = ref([])

onMounted(() => {
  onValue(dbRef(db, 'user_suggestions'), (snapshot) => {
    const data = snapshot.val()
    if (data) {
      suggestions.value = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).reverse() // Hiện cái mới nhất lên đầu
    } else {
      suggestions.value = []
    }
  })
})

const pendingCount = computed(() => suggestions.value.filter(s => s.status === 'pending').length)

const approve = (id) => update(dbRef(db, `user_suggestions/${id}`), { status: 'approved' })

const removeSug = (id) => confirm('Xóa đề xuất này?') && remove(dbRef(db, `user_suggestions/${id}`))

// Tuyệt chiêu: Chuyển ý tưởng thành mục Vote chính thức
const moveToVote = async (sug) => {
  if (confirm(`Bạn muốn đưa "${sug.content}" vào danh sách bình chọn chính thức?`)) {
    // 1. Đẩy vào assets_vote
    await push(dbRef(db, 'assets_vote'), {
      title: sug.content,
      votes: 0,
      status: 'active'
    })
    // 2. Xóa khỏi hòm thư đề xuất cho gọn
    await remove(dbRef(db, `user_suggestions/${sug.id}`))
    alert('Đã chuyển thành công! Kiểm tra tab Vote nhé.')
  }
}

const formatTime = (ts) => {
  if (!ts) return ''
  const date = new Date(ts)
  return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()+1}`
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }
</style>
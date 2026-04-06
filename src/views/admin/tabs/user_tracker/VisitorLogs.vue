<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
    <div class="mb-8">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Lịch sử truy cập</h1>
          <p class="text-sm text-slate-500 font-medium">Phân tích dữ liệu người dùng thời gian thực</p>
        </div>
        <div class="flex gap-2">
          <div class="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-right">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng lượt</p>
            <p class="text-xl font-black text-blue-600">{{ allLogs.length }}</p>
          </div>
          <div class="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-right">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hôm nay</p>
            <p class="text-xl font-black text-emerald-500">{{ logsToday }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div class="md:col-span-2 relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm IP hoặc Thành phố..." 
            class="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
          <span class="absolute right-4 top-3.5 opacity-20">🔍</span>
        </div>
        
        <select 
          v-model="filterCountry"
          class="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="">Tất cả Quốc gia</option>
          <option v-for="c in uniqueCountries" :key="c" :value="c">{{ c }}</option>
        </select>

        <select 
          v-model="filterISP"
          class="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="">Tất cả Nhà mạng</option>
          <option v-for="i in uniqueISPs" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100 text-slate-400">
              <th class="p-5 text-[10px] font-black uppercase tracking-widest">Quốc gia</th>
              <th class="p-5 text-[10px] font-black uppercase tracking-widest">Vị trí & IP</th>
              <th class="p-5 text-[10px] font-black uppercase tracking-widest">Nhà mạng</th>
              <th class="p-5 text-[10px] font-black uppercase tracking-widest text-right">Thời gian</th>
            </tr>
          </thead>
          
          <tbody v-if="paginatedLogs.length > 0">
            <tr v-for="log in paginatedLogs" :key="log.id" class="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-all group">
              <td class="p-5">
                <div class="flex items-center gap-3">
                  <img :src="log.flag" class="w-6 h-4 object-cover rounded-sm border border-slate-100 shadow-sm" v-if="log.flag" referrerpolicy="no-referrer"/>
                  <span class="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{{ log.country }}</span>
                </div>
              </td>
              <td class="p-5">
                <p class="text-sm font-black text-slate-800 leading-tight">{{ log.city }}</p>
                <code class="text-[10px] text-slate-400 font-mono tracking-tighter">{{ log.ip }}</code>
              </td>
              <td class="p-5">
                <span :class="getISPStyle(log.isp)" class="px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tight inline-block">
                  {{ log.isp || 'N/A' }}
                </span>
              </td>
              <td class="p-5 text-right text-slate-500">
                <p class="text-xs font-black text-slate-700">{{ formatTime(log.timestamp) }}</p>
                <p class="text-[10px] font-bold opacity-60">{{ new Date(log.timestamp).toLocaleTimeString('vi-VN') }}</p>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="p-20 text-center text-slate-400 font-bold italic">Không tìm thấy dữ liệu phù hợp...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-[11px] font-black uppercase text-slate-400 tracking-widest">
          Hiển thị {{ startIndex + 1 }}-{{ endIndex }} / {{ filteredLogs.length }} kết quả
        </p>
        
        <div class="flex items-center gap-1.5">
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all text-xs"
          > « </button>
          
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-4 py-2 text-[11px] font-black uppercase rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all"
          > Trước </button>
          
          <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black text-blue-600">
            {{ currentPage }} / {{ totalPages }}
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-[11px] font-black uppercase rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all"
          > Sau </button>

          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all text-xs"
          > » </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue } from 'firebase/database'

const allLogs = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Filters & Search
const searchQuery = ref('')
const filterCountry = ref('')
const filterISP = ref('')

onMounted(() => {
  const logsPath = dbRef(db, 'access_logs')
  onValue(logsPath, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      allLogs.value = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).sort((a, b) => b.timestamp - a.timestamp)
    }
  })
})

// Thống kê truy cập hôm nay
const logsToday = computed(() => {
  const today = new Date().toDateString()
  return allLogs.value.filter(log => new Date(log.timestamp).toDateString() === today).length
})

// Lấy danh sách duy nhất cho bộ lọc (Unique values)
const uniqueCountries = computed(() => [...new Set(allLogs.value.map(l => l.country))].sort())
const uniqueISPs = computed(() => [...new Set(allLogs.value.map(l => l.isp))].filter(Boolean).sort())

// Xử lý logic lọc & tìm kiếm
const filteredLogs = computed(() => {
  return allLogs.value.filter(log => {
    const s = searchQuery.value.toLowerCase()
    const matchesSearch = log.ip.includes(s) || log.city.toLowerCase().includes(s)
    const matchesCountry = filterCountry.value === '' || log.country === filterCountry.value
    const matchesISP = filterISP.value === '' || log.isp === filterISP.value
    return matchesSearch && matchesCountry && matchesISP
  })
})

// Logic Phân trang dựa trên danh sách ĐÃ LỌC
const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredLogs.value.length))

const paginatedLogs = computed(() => {
  return filteredLogs.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

// Reset trang về 1 khi lọc
watch([searchQuery, filterCountry, filterISP], () => {
  currentPage.value = 1
})

const getISPStyle = (isp) => {
  if (!isp) return 'bg-slate-50 text-slate-400 border-slate-100'
  const name = isp.toLowerCase()
  if (name.includes('viettel')) return 'bg-red-50 text-red-600 border-red-100'
  if (name.includes('fpt')) return 'bg-orange-50 text-orange-600 border-orange-100'
  if (name.includes('vnpt')) return 'bg-blue-50 text-blue-600 border-blue-100'
  return 'bg-slate-50 text-slate-500 border-slate-100'
}

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Vừa xong'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return new Date(timestamp).toLocaleDateString('vi-VN')
}
</script>
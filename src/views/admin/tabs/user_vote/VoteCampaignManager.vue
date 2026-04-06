<template>
  <div class="p-6 bg-white rounded-[2rem] shadow-xl border border-slate-100">
    <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
      <span class="text-2xl">📢</span> Thiết lập đợt Vote
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
      <input 
        v-model="newItemTitle" 
        type="text" 
        placeholder="Tên Pack mới (vd: Cyberpunk City)" 
        class="md:col-span-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
      />
      <button 
        @click="addNewItem"
        class="bg-blue-600 text-white font-black text-xs uppercase py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
      >
        Thêm vào danh sách
      </button>
    </div>

    <div class="overflow-hidden border border-slate-100 rounded-2xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400">
            <th class="p-4">Tên Pack</th>
            <th class="p-4 text-center">Lượt Vote hiện tại</th>
            <th class="p-4">Trạng thái</th>
            <th class="p-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assetVotes" :key="item.id" class="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td class="p-4">
              <input 
                v-if="editingId === item.id" 
                v-model="item.title" 
                @blur="updateItem(item)"
                class="text-sm font-black text-slate-700 border-b border-blue-500 outline-none bg-transparent"
              />
              <p v-else class="text-sm font-black text-slate-700">{{ item.title }}</p>
            </td>
            <td class="p-4 text-center">
              <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                {{ item.votes || 0 }}
              </span>
            </td>
            <td class="p-4">
              <button 
                @click="toggleStatus(item)"
                :class="[
                  'text-[10px] font-black uppercase px-2 py-1 rounded-md border',
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                ]"
              >
                {{ item.status === 'active' ? 'Đang mở' : 'Đã đóng' }}
              </button>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="editingId = item.id" class="text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold">Sửa</button>
              <button @click="resetVoteCount(item.id)" class="text-amber-500 hover:text-amber-700 text-xs font-bold">Reset</button>
              <button @click="deleteItem(item.id)" class="text-red-400 hover:text-red-600 text-xs font-bold">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue, set, push, remove, update } from 'firebase/database'

const assetVotes = ref([])
const newItemTitle = ref('')
const editingId = ref(null)

onMounted(() => {
  onValue(dbRef(db, 'assets_vote'), (snapshot) => {
    const data = snapshot.val()
    if (data) {
      assetVotes.value = Object.keys(data).map(key => ({ id: key, ...data[key] }))
    } else {
      assetVotes.value = []
    }
  })
})

const addNewItem = async () => {
  if (!newItemTitle.value.trim()) return
  await push(dbRef(db, 'assets_vote'), {
    title: newItemTitle.value,
    votes: 0,
    status: 'active'
  })
  newItemTitle.value = ''
}

const updateItem = async (item) => {
  editingId.value = null
  await update(dbRef(db, `assets_vote/${item.id}`), { title: item.title })
}

const toggleStatus = async (item) => {
  const newStatus = item.status === 'active' ? 'closed' : 'active'
  await update(dbRef(db, `assets_vote/${item.id}`), { status: newStatus })
}

const resetVoteCount = async (id) => {
  if (confirm('Đặt lại số lượt vote về 0?')) {
    await update(dbRef(db, `assets_vote/${id}`), { votes: 0 })
  }
}

const deleteItem = async (id) => {
  if (confirm('Xóa vĩnh viễn mục này?')) {
    await remove(dbRef(db, `assets_vote/${id}`))
  }
}
</script>
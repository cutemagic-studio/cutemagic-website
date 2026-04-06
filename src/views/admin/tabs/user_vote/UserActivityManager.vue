<template>
    <div class="space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Nhật ký hoạt động cộng đồng
                    </h3>
                    <label class="flex items-center gap-2 mt-2 cursor-pointer group">
                        <input type="checkbox" v-model="showHidden"
                            class="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-0">
                        <span class="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                            Hiện cả các bản ghi đã ẩn
                        </span>
                    </label>
                </div>
                <span class="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">
                    Đang hiển thị {{ filteredActivities.length }} tương tác
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr class="text-[10px] font-black uppercase text-slate-400">
                            <th class="pb-4 pl-4">Người dùng</th>
                            <th class="pb-4">Quốc gia</th>
                            <th class="pb-4">Hành động</th>
                            <th class="pb-4">Nội dung / Asset</th>
                            <th class="pb-4 text-center">Thời gian</th>
                            <th class="pb-4 text-right pr-4">Quản lý</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="act in filteredActivities" :key="act.id"
                            :class="['transition-colors', act.isHidden ? 'opacity-40 grayscale-[0.8]' : 'hover:bg-slate-50/80']">

                            <td class="py-4 pl-4">
                                <div class="flex items-center gap-3">
                                    <img :src="act.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(act.displayName)}&background=random&color=fff&font-size=0.33&bold=true`"
                                        class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover flex-shrink-0"
                                        referrerpolicy="no-referrer" />
                                    <div>
                                        <p class="text-xs font-black text-slate-800 leading-none mb-1">{{
                                            act.displayName }}</p>
                                        <p class="text-[10px] text-slate-400 font-medium leading-none">{{ act.email }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td class="py-4">
                                <div class="flex items-center gap-2">
                                    <img v-if="act.flag" :src="act.flag" class="w-4 shadow-xs rounded-sm" />
                                    <span class="text-[10px] font-bold text-slate-600 uppercase">{{ act.country || 'N/A'
                                        }}</span>
                                </div>
                            </td>

                            <td class="py-4">
                                <span
                                    :class="act.type === 'vote' ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50'"
                                    class="text-[9px] font-black uppercase px-2 py-1 rounded-md">
                                    {{ act.type === 'vote' ? '🗳️ VOTE' : '💡 ĐỀ XUẤT' }}
                                </span>
                            </td>

                            <td class="py-4">
                                <p class="text-xs font-bold text-slate-600 max-w-[180px] truncate" :title="act.content">
                                    {{ act.content }}
                                </p>
                            </td>

                            <td class="py-4 text-center">
                                <span class="text-[10px] font-bold text-slate-400 tabular-nums">
                                    {{ formatTime(act.timestamp) }}
                                </span>
                            </td>

                            <td class="py-4 text-right pr-4">
                                <button @click="toggleVisibility(act.id, act.type, act.isHidden)" :class="[
                                    'inline-flex items-center justify-center gap-2 text-[9px] font-black px-3 py-2 rounded-xl transition-all active:scale-95 min-w-[90px]',
                                    act.isHidden ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600'
                                ]">
                                    <component :is="act.isHidden ? EyeIcon : EyeOffIcon"
                                        class="w-3.5 h-3.5 flex-shrink-0" />
                                    <span class="leading-none uppercase tracking-tighter">
                                        {{ act.isHidden ? 'Hiện lại' : 'Ẩn đi' }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import { db } from '../../../../firebase'
import { ref as dbRef, onValue, update } from 'firebase/database'

// Icon đơn giản bằng SVG
const EyeIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, [h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })])
const EyeOffIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, [h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.146 5.147m13.708 13.708l-4.736-4.736M21 12a9.958 9.958 0 01-1.558 3.027m-4.242-4.242L19.854 5.146' })])

const activities = ref([])
const showHidden = ref(false)

onMounted(() => {
    const votesRef = dbRef(db, 'user_votes')
    const sugsRef = dbRef(db, 'user_suggestions')

    onValue(votesRef, (vSnap) => {
        onValue(sugsRef, (sSnap) => {
            const allData = []
            const vData = vSnap.val() || {}
            const sData = sSnap.val() || {}

            Object.entries(vData).forEach(([id, val]) => {
                allData.push({ id, type: 'vote', content: val.assetTitle, ...val })
            })
            Object.entries(sData).forEach(([id, val]) => {
                allData.push({ id, type: 'suggest', content: val.content, ...val })
            })

            activities.value = allData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        })
    })
})

const filteredActivities = computed(() => {
    return showHidden.value ? activities.value : activities.value.filter(act => !act.isHidden)
})

const toggleVisibility = async (id, type, currentStatus) => {
    try {
        const path = type === 'vote' ? 'user_votes' : 'user_suggestions'
        await update(dbRef(db, `${path}/${id}`), { isHidden: !currentStatus })
    } catch (e) { console.error(e) }
}

const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    // Format thành: 14:05 - 06/04 cho gọn
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}`
}
</script>
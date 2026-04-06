<template>
    <section id="vote" class="py-24 bg-[fcfdfe] scroll-mt-24">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white shadow-xl">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        What Should We Build Next?
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-8"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                        Vote for your favorite concepts or submit your own. We prioritize development based on community demand.
                    </p>
                </div>

                <div
                    class="bg-white rounded-3xl p-8 lg:p-10 border border-slate-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">

                    <div v-if="!user" class="py-10 text-center">
                        <div class="mb-6 inline-flex p-4 bg-blue-50 rounded-full text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h4 class="text-xl font-black text-slate-900 mb-2 italic">Who's voting?</h4>
                        <p class="text-slate-500 text-sm font-medium mb-8">Sign in with Google to cast your vote and contribute new ideas.</p>

                        <button @click="login"
                            class="flex items-center gap-3 mx-auto px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-blue-600 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                class="w-5" referrerpolicy="no-referrer" />
                            Continue with Google
                        </button>
                    </div>

                    <div v-else>
                        <div class="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                            <img :src="user.photoURL"
                                class="w-10 h-10 rounded-full border-2 border-blue-100 shadow-sm object-cover"
                                referrerpolicy="no-referrer" />
                            <div>
                                <p
                                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Welcome back,</p>
                                <p class="text-sm font-black text-slate-800 leading-none">{{ user.displayName }}</p>
                            </div>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="item in activeVoteItems" :key="item.id"
                                class="flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300"
                                :class="isVoted(item.id) ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-blue-100'">
                                <div>
                                    <h4 class="font-black text-slate-900 text-sm lg:text-base">{{ item.title }}</h4>
                                    <p class="text-xs text-slate-500 font-medium">{{ item.votes || 0 }} votes
                                    </p>
                                </div>

                                <button @click="handleVote(item.id)" :disabled="isVoted(item.id)" :class="[
                                    'px-5 py-2 rounded-xl font-black text-xs transition-all duration-300',
                                    isVoted(item.id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                                ]">
                                    {{ isVoted(item.id) ? 'Voted' : 'Vote Now' }}
                                </button>
                            </div>
                        </div>

                        <div class="pt-8 border-t border-slate-100">
                            <h4 class="font-black text-slate-900 mb-4 text-xs uppercase tracking-widest">
                                Submit a Suggestion
                            </h4>
                            <div class="relative">
                                <input v-model="newSuggestion" type="text" placeholder="Ví dụ: Sci-Fi Lab Interior..."
                                    class="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm pr-28"
                                    @keyup.enter="submitSuggestion" />
                                <button @click="submitSuggestion" :disabled="isSending" :class="[
                                    'absolute right-2 top-2 bottom-2 px-4 font-black text-xs rounded-xl transition-all',
                                    isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-700'
                                ]">
                                    {{ isSending ? '...' : 'Submit' }}
                                </button>
                            </div>

                            <transition name="fade">
                                <p v-if="isSubmitted"
                                    class="mt-4 text-emerald-600 text-xs font-black flex items-center gap-2">
                                    <span>✓</span> Thanks {{ user.displayName.split(' ').pop() }}! Your suggestion has been recorded.
                                </p>
                            </transition>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db, auth } from '../../firebase' // Nhớ export auth từ firebase.js nhé
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { ref as dbRef, onValue, update, increment, push, serverTimestamp } from 'firebase/database'

import { useVisitorStore } from '../../stores/visitor'
const visitorStore = useVisitorStore() // Khởi tạo store

const voteItems = ref([])
const votedIds = ref(new Set())
const newSuggestion = ref('')
const isSubmitted = ref(false)
const isSending = ref(false)
const user = ref(null)

onMounted(() => {
    // 1. Lấy danh sách hiển thị các Pack (Luôn luôn lấy dù có login hay chưa)
    onValue(dbRef(db, 'assets_vote'), (snapshot) => {
        const data = snapshot.val()
        if (data) {
            voteItems.value = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }))
        }
    })

    // 2. Lấy dữ liệu tạm từ LocalStorage (Để UI hiện "Đã vote" nhanh nhất có thể)
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('voted_')) {
            votedIds.value.add(key.replace('voted_', ''))
        }
    })

    // 3. Theo dõi trạng thái đăng nhập và Lấy dữ liệu "chuẩn" từ Server
    onAuthStateChanged(auth, (newUser) => {
        user.value = newUser

        if (newUser) {
            // Khi User login thành công, ta check xem trong Database họ đã vote gì chưa
            // Bảng này là votes_by_user/[uid] mà chúng ta vừa bàn
            onValue(dbRef(db, `votes_by_user/${newUser.uid}`), (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    // Nếu có dữ liệu trên server, ta nạp vào Set để khóa nút Vote
                    Object.keys(data).forEach(id => {
                        votedIds.value.add(id)
                        // Đồng thời đồng bộ ngược lại LocalStorage cho đồng nhất
                        localStorage.setItem(`voted_${id}`, 'true')
                    })
                }
            })
        }
    })
})

const login = async () => {
    try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
    } catch (error) {
        console.error("Đăng nhập thất bại:", error)
    }
}

const activeVoteItems = computed(() => {
    return voteItems.value.filter(item => item.status === 'active')
});

const isVoted = (id) => votedIds.value.has(id)

const handleVote = async (id) => {
    if (!user.value || votedIds.value.has(id)) return

    // 1. Khóa tạm thời ở UI
    votedIds.value.add(id)

    try {
        // HÀNH ĐỘNG 1: Tăng tổng số vote (để hiện bảng xếp hạng nhanh)
        await update(dbRef(db, `assets_vote/${id}`), {
            votes: increment(1)
        })

        // HÀNH ĐỘNG 2: Lưu chi tiết để Admin biết AI đã vote (Bảng 1)
        await push(dbRef(db, 'user_votes'), {
            assetId: id,
            assetTitle: voteItems.value.find(i => i.id === id)?.title,
            uid: user.value.uid,
            displayName: user.value.displayName,
            email: user.value.email,
            photoURL: user.value.photoURL,
            country: visitorStore.metadata?.country || 'Unknown',
            flag: visitorStore.metadata?.flag || 'Unknown',
            timestamp: serverTimestamp()
        })

        // HÀNH ĐỘNG 3: Ghi danh tính vào "Sổ hộ khẩu" chống vote lại (Bảng 2)
        await update(dbRef(db, `votes_by_user/${user.value.uid}`), {
            [id]: true
        })

    } catch (error) {
        console.error("Lỗi hệ thống:", error)
        votedIds.value.delete(id) // Mở khóa nếu lỗi
    }
}

const submitSuggestion = async () => {
    if (!user.value || !newSuggestion.value.trim() || isSending.value) return

    isSending.value = true

    try {
        await push(dbRef(db, 'user_suggestions'), {
            content: newSuggestion.value,
            uid: user.value.uid,
            email: user.value.email,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            country: visitorStore.metadata?.country || 'Unknown',
            flag: visitorStore.metadata?.flag || 'Unknown',
            status: 'pending',
            timestamp: serverTimestamp()
        })

        isSubmitted.value = true
        newSuggestion.value = ''
        setTimeout(() => { isSubmitted.value = false }, 3000)
    } catch (error) {
        alert("Lỗi khi gửi đề xuất!")
    } finally {
        isSending.value = false
    }
}
</script>

<style scoped>
h3,
h4 {
    letter-spacing: -0.04em;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<!-- <script setup>
import { ref } from 'vue'

const voteItems = ref([
  { id: 1, title: 'Sci-Fi Lab Interior', votes: 128, voted: false },
  { id: 2, title: 'Forest Animals Pack', votes: 85, voted: false },
  { id: 3, title: 'Medieval Village', votes: 210, voted: false }
])

const newSuggestion = ref('')
const isSubmitted = ref(false)

const handleVote = (id) => {
  const item = voteItems.value.find(i => i.id === id)
  if (item && !item.voted) {
    item.votes++
    item.voted = true
  }
}

const submitSuggestion = () => {
  if (newSuggestion.value.trim()) {
    isSubmitted.value = true
    newSuggestion.value = ''
    setTimeout(() => { isSubmitted.value = false }, 3000)
  }
}
</script>

<template>
  <section id="vote" class="py-24 bg-[fcfdfe]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        
        <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white shadow-xl">
          <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
            Bạn muốn Pack <br class="hidden lg:block" /> gì tiếp theo?
          </h3>
          <div class="h-1 w-12 bg-blue-500 mb-8"></div>
          <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
            Bình chọn cho các ý tưởng sẵn có hoặc gửi đề xuất của riêng bạn. Chúng tôi sẽ ưu tiên sản xuất các Pack được cộng đồng yêu thích nhất.
          </p>
        </div>

        <div class="bg-white rounded-3xl p-8 lg:p-10 border border-slate-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
          <div class="space-y-4 mb-10">
            <div 
              v-for="item in voteItems" :key="item.id"
              class="flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300"
              :class="item.voted ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-blue-100'"
            >
              <div>
                <h4 class="font-black font-bold text-slate-900 text-sm lg:text-base">{{ item.title }}</h4>
                <p class="text-xs text-slate-500 font-medium">{{ item.votes }} lượt bình chọn</p>
              </div>
              <button 
                @click="handleVote(item.id)"
                :disabled="item.voted"
                :class="['px-5 py-2 rounded-xl font-black text-xs transition-all duration-300', item.voted ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white']"
              >
                {{ item.voted ? 'Đã vote' : 'Vote' }}
              </button>
            </div>
          </div>

          <div class="pt-8 border-t border-slate-100">
            <h4 class="font-black text-slate-900 mb-4 text-xs uppercase tracking-widest">Tự đề xuất ý tưởng</h4>
            <div class="relative">
              <input 
                v-model="newSuggestion"
                type="text" 
                placeholder="Ví dụ: Sci-Fi Lab Interior..."
                class="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm pr-28"
                @keyup.enter="submitSuggestion"
              />
              <button 
                @click="submitSuggestion"
                class="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-blue-700 transition-colors"
              >
                Gửi ngay
              </button>
            </div>
            
            <transition name="fade">
              <p v-if="isSubmitted" class="mt-4 text-emerald-600 text-xs font-black flex items-center gap-2">
                <span>✓</span> Cảm ơn! Ý tưởng của bạn đã được ghi nhận.
              </p>
            </transition>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
h3, h4 { letter-spacing: -0.04em; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style> -->

<template>
    <section id="vote" class="py-24 bg-[#fcfdfe] scroll-mt-24">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white shadow-xl">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        Bạn muốn Pack <br class="hidden lg:block" /> gì tiếp theo?
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-8"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                        Bình chọn cho các ý tưởng sẵn có hoặc gửi đề xuất của riêng bạn. Chúng tôi sẽ ưu tiên sản xuất
                        các Pack được cộng đồng yêu thích nhất.
                    </p>
                </div>

                <div
                    class="bg-white rounded-3xl p-8 lg:p-10 border border-slate-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
                    <div class="space-y-4 mb-10">
                        <div v-for="item in voteItems" :key="item.id"
                            class="flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300"
                            :class="isVoted(item.id) ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-blue-100'">
                            <div>
                                <h4 class="font-black text-slate-900 text-sm lg:text-base">{{ item.title }}</h4>
                                <p class="text-xs text-slate-500 font-medium">{{ item.votes }} lượt bình chọn</p>
                            </div>

                            <button @click="handleVote(item.id)" :disabled="isVoted(item.id)" :class="[
                                'px-5 py-2 rounded-xl font-black text-xs transition-all duration-300',
                                isVoted(item.id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                            ]">
                                {{ isVoted(item.id) ? 'Đã vote' : 'Vote' }}
                            </button>
                        </div>
                    </div>

                    <div class="pt-8 border-t border-slate-100">
                        <h4 class="font-black text-slate-900 mb-4 text-xs uppercase tracking-widest">Tự đề xuất ý tưởng
                        </h4>
                        <div class="relative">
                            <input v-model="newSuggestion" type="text" placeholder="Ví dụ: Sci-Fi Lab Interior..."
                                class="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all text-sm pr-28"
                                @keyup.enter="submitSuggestion" />
                            <button @click="submitSuggestion"
                                :disabled="isSending"
                                class="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-blue-700 transition-colors">
                                {{ isSending ? 'Đang gửi...' : 'Gửi ngay' }}
                            </button>
                        </div>

                        <transition name="fade">
                            <p v-if="isSubmitted"
                                class="mt-4 text-emerald-600 text-xs font-black flex items-center gap-2">
                                <span>✓</span> Cảm ơn! Ý tưởng của bạn đã được ghi nhận.
                            </p>
                        </transition>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../../firebase'
import { ref as dbRef, onValue, update, increment, push } from 'firebase/database'

// --- KHAI BÁO BIẾN ---
const voteItems = ref([]) // Chứa danh sách Asset từ Firebase (Tên, số vote)
const votedIds = ref(new Set()) // Chứa ID những cái bạn ĐÃ BẤM (Dùng Set để không trùng lặp và tìm cực nhanh)

const newSuggestion = ref('') // Nội dung ô nhập đề xuất mới
const isSubmitted = ref(false) // Trạng thái hiện thông báo "Cảm ơn" sau khi gửi

// --- KHI TRANG WEB VỪA MỞ LÊN (onMounted) ---
onMounted(() => {
    // 1. Quét sạch LocalStorage xem trước đó bạn đã vote những gì chưa
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('voted_')) {
            const id = key.replace('voted_', '') // Lấy lại cái ID (ví dụ '01', '02')
            votedIds.value.add(id) // Bỏ vào Set để khóa nút ngay từ lúc load trang
        }
    })

    // 2. Kết nối "đường ống" tới Firebase
    const assetsRef = dbRef(db, 'assets_vote')
    onValue(assetsRef, (snapshot) => {
        const data = snapshot.val() // Lấy dữ liệu thô từ Firebase
        if (data) {
            // Chuyển dữ liệu từ dạng Object {01: {...}} sang dạng Mảng [{id: '01', ...}] để Vue vẽ giao diện
            voteItems.value = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }))
        }
    })
})

// --- HÀM XỬ LÝ KHI NHẤN NÚT VOTE ---
const handleVote = async (id) => {
    // BƯỚC CHẶN 1: Nếu ID này đã nằm trong Set "Đã vote" thì nghỉ, không chạy tiếp
    if (votedIds.value.has(id)) return

    // BƯỚC KHÓA UI (Quan trọng nhất): 
    votedIds.value.add(id) // Thêm ngay vào Set để Vue cập nhật giao diện (Nút đổi màu, Disabled)
    localStorage.setItem(`voted_${id}`, 'true') // Ghi nhớ vào trình duyệt để F5 không bị mất

    // BƯỚC GỬI LÊN MÂY (Firebase):
    const itemRef = dbRef(db, `assets_vote/${id}`)
    try {
        // Lệnh này bảo Firebase: "Tìm đúng cái ID này và tăng con số 'votes' lên 1 đơn vị"
        await update(itemRef, { votes: increment(1) })
    } catch (error) {
        // PHÒNG HỜ: Nếu mất mạng hoặc lỗi, phải mở khóa lại cho người dùng
        votedIds.value.delete(id)
        localStorage.removeItem(`voted_${id}`)
        console.error("Lỗi rồi bạn ơi:", error)
    }
}

// --- HÀM TIỆN ÍCH CHO GIAO DIỆN ---
// Hàm này giúp Template kiểm tra xem một Item có ID X đã bị vote chưa
const isVoted = (id) => votedIds.value.has(id)

// --- HÀM GỬI ĐỀ XUẤT MỚI ---
const submitSuggestion = async () => {
  // Kiểm tra nếu ô nhập không trống
  if (newSuggestion.value.trim()) {
    const suggestionsRef = dbRef(db, 'user_suggestions') // Trỏ tới hòm thư trên Firebase
    
    try {
      // Dùng push để mỗi lời nhắn là một mục riêng biệt, không đè lên nhau
      await push(suggestionsRef, {
        content: newSuggestion.value,
        timestamp: Date.now() // Lưu giờ gửi để bạn biết cái nào mới nhất
      })

      // HIỆU ỨNG THÀNH CÔNG
      isSubmitted.value = true // Hiện dòng "Cảm ơn..."
      newSuggestion.value = '' // Xóa sạch ô nhập để họ nhập cái khác
      
      // 3 giây sau tự ẩn thông báo thành công đi cho đẹp
      setTimeout(() => { isSubmitted.value = false }, 3000)
      
    } catch (error) {
      alert("Gửi không thành công, bạn kiểm tra lại mạng nhé!")
      console.error("Lỗi Firebase:", error)
    }
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
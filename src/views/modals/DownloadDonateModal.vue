<template>
    <Teleport to="body">
        <Transition name="fade">
            <!-- Lớp nền tối mờ phủ toàn màn hình -->
            <div v-if="isOpen" 
                class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-4"
                @click.self="closeModal">
                
                <!-- Nút Tắt (X) ở góc trên bên phải -->
                <button @click="closeModal" class="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Nội dung chính giữa màn hình -->
                <div class="max-w-4xl text-center flex flex-col items-center gap-8 animate-slide-up">
                    
                    <!-- Tiêu đề lớn -->
                    <h2 class="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Consider a donation
                    </h2>
                    
                    <!-- Đoạn văn bản mô tả -->
                    <p class="text-base md:text-xl text-gray-300 leading-relaxed max-w-3xl">
                        The game assets you're about to download are available for free, thanks to the generosity of our amazing community. If you'd like to support and help keep them free for everyone, consider making a small donation!
                    </p>

                    <div class="flex flex-col items-center gap-6 mt-4">
                        <!-- Nút Donate (Sử dụng gradient tím/xanh nổi bật) -->
                        <button @click="handleDonate"
                            class="px-12 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-lg tracking-wide transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer">
                            Donate
                        </button>

                        <!-- Dòng chữ Continue (Màu vàng/cam) -->
                        <button @click="handleContinue"
                            class="text-amber-500 hover:text-amber-400 font-bold text-lg tracking-wide transition-colors cursor-pointer mt-2">
                            Continue without donating...
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    downloadUrl: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['close'])
const router = useRouter()

// Đóng modal
const closeModal = () => {
    emit('close')
}

// Khi bấm Donate -> Chuyển hướng sang trang Donate
const handleDonate = () => {
    closeModal()
    router.push('/donate')
}

// Khi bấm Continue -> Bắt đầu tải file và đóng modal
const handleContinue = () => {
    if (props.downloadUrl && props.downloadUrl.trim() !== '') {
        window.open(props.downloadUrl, '_blank')
    }
    closeModal()
}
</script>

<style scoped>
/* Hiệu ứng mờ dần (Fade) cho Modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hiệu ứng trượt nhẹ lên cho nội dung */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
    animation: slideUp 0.4s ease-out forwards;
}
</style>
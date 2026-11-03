<template>
    <button @click="goToDonate"
        class="relative px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 cursor-pointer
               /* Hiệu ứng kính mờ (Nền trong suốt + Blur) */
               bg-blue-500/10 dark:bg-blue-500/20 
               backdrop-blur-md 
               
               /* Viền màu xanh phát sáng nhẹ */
               border border-blue-500/40 dark:border-blue-400/50
               
               /* Màu chữ tương phản */
               text-blue-700 dark:text-blue-300
               
               /* Đổ bóng phát quang (Glow effect) */
               shadow-[0_0_15px_rgba(37,99,235,0.15)] dark:shadow-[0_0_20px_rgba(96,165,250,0.25)]
               
               /* Hiệu ứng khi di chuột (Hover) */
               hover:bg-blue-500/20 dark:hover:bg-blue-400/30
               hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] dark:hover:shadow-[0_0_25px_rgba(96,165,250,0.4)]
               hover:-translate-y-0.5">
        Donate
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDonate = () => {
    // Điều hướng tới trang Donate (thay đổi '/donate' theo đúng route trong dự án của bạn)
    router.push('/donate')
}
</script>
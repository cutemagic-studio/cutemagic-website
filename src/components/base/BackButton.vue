<template>
    <button @click="handleNavigation" :class="[theme.ui.buttonRoundedBorderBlue]" title="Back">
        <!-- <button @click="handleNavigation"
        class="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#32CD32] dark:hover:bg-[#32CD32] dark:bg-slate-800 dark:text-gray-300 dark:hover:text-white  transition-colors cursor-pointer shadow-sm group" -->

        <!-- Icon Arrow Left -->
        <svg xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none"
            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>

    </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../stores/useThemeStore'

// Khai báo Prop 'to' để nhận đường dẫn ép buộc
const props = defineProps({
    to: {
        type: String,
        default: null // Nếu không truyền, mặc định là null
    }
})

const router = useRouter()
const theme = useThemeStore()

const handleNavigation = () => {
    // Nếu có truyền đường dẫn (ví dụ: to="/"), ép buộc chuyển hướng tới đó
    if (props.to) {
        router.push(props.to)
    }
    // Nếu không truyền, quay lại trang trước đó trong lịch sử trình duyệt
    else {
        router.back()
    }
}
</script>
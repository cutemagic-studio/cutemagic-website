<template>
    <!-- Khối div mờ bọc ngoài giá tiền với logic đổi màu -->
    <div :class="[
        'inline-flex items-center backdrop-blur-sm border shadow-sm transition-colors',
        containerSizeClass,
        isFree 
            ? 'bg-green-50/80 dark:bg-green-900/20 border-green-300 dark:border-green-500/50' 
            : 'bg-blue-50/80 dark:bg-black/40 border-blue-200 dark:border-[#ff005b]/50'
    ]">
        <span :class="[
            'font-black tracking-wide',
            textSizeClass,
            isFree 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-blue-600 dark:text-[#ff005b]'
        ]">
            <!-- Gọi hàm getter format giá đã viết sẵn trong Model -->
            {{ asset?.displayPrice }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    asset: {
        type: Object,
        required: true
    },
    // Truyền 'md' cho trang Detail, 'sm' cho thẻ Card
    size: {
        type: String,
        default: 'md'
    }
})

// Kiểm tra xem asset có miễn phí không
const isFree = computed(() => props.asset?.price === 0)

// Xử lý kích thước padding & bo góc dựa trên prop `size`
const containerSizeClass = computed(() => {
    return props.size === 'sm' 
        ? 'px-3 py-1 rounded-md' 
        : 'px-4 py-1.5 rounded-lg'
})

// Xử lý kích thước chữ dựa trên prop `size`
const textSizeClass = computed(() => {
    return props.size === 'sm' 
        ? 'text-base sm:text-lg' 
        : 'text-xl'
})
</script>
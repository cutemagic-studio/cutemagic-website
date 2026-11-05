<template>
    <div class="flex flex-col gap-4 w-full h-full">

        <!-- Khung ảnh chính -->
        <div
            class="relative w-full aspect-[16/10] bg-slate-100 dark:bg-[#111] rounded-xl overflow-hidden group shadow-lg border-2 border-[#1C1C1C] dark:border-transparent">
            <img :src="images[currentIdx]" alt="Asset Preview"
                class="w-full h-full object-cover transition-opacity duration-300">

            <!-- Mũi tên TRÁI -->
            <button @click="prevImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 transition-colors rounded-full p-2 z-10 cursor-pointer opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Mũi tên PHẢI -->
            <button @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 transition-colors rounded-full p-2 z-10 cursor-pointer opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <!-- Nút Fullscreen -->
            <button @click="emit('openFullscreen', currentIdx)"
                class="absolute bottom-5 left-5 p-3 bg-black/40 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md cursor-pointer border border-white/20 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            </button>
        </div>

        <!-- HÀNG THUMBNAIL BÊN DƯỚI -->
        <!-- HÀNG THUMBNAIL BÊN DƯỚI -->
        <div class="relative w-full group/thumb mt-1">
            
            <!-- Nút cuộn trái -->
            <button @click="scrollThumbLeft"
                class="absolute left-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-[#1e5aff] dark:hover:bg-[#ff005b] text-white px-0.5 transition-all opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center cursor-pointer rounded-l-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Danh sách ảnh con -->
            <div ref="thumbContainer" class="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory">
                <button v-for="(img, index) in images" :key="index" @click="currentIdx = index"
                    class="relative shrink-0 aspect-[16/10] rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer snap-start
                           /* Mobile: Hiện đúng 4 tấm (Trừ đi 3 khoảng gap 8px) */
                           w-[calc((100%-24px)/4)] 
                           /* Tablet/Desktop: Hiện đúng 5 tấm (Trừ đi 4 khoảng gap 8px) */
                           sm:w-[calc((100%-32px)/5)]"
                    :class="currentIdx === index ? 'border-[#1E90FF] dark:border-[#ff005b] opacity-100' : 'border-[#1e1e1e] opacity-50 hover:opacity-100'">
                    <img :src="img" class="w-full h-full object-cover">
                </button>
            </div>

            <!-- Nút cuộn phải -->
            <button @click="scrollThumbRight"
                class="absolute right-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-[#1e5aff] dark:hover:bg-[#ff005b] text-white px-0.5 transition-all opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center cursor-pointer rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['openFullscreen'])

const currentIdx = ref(0)
const thumbContainer = ref(null)

// Reset index khi mảng ảnh thay đổi (ví dụ khi load asset khác)
watch(() => props.images, () => {
    currentIdx.value = 0
    scrollToThumb(0)
})

// Chuyển ảnh chính
const prevImage = () => {
    if (props.images.length === 0) return
    currentIdx.value = (currentIdx.value - 1 + props.images.length) % props.images.length
    scrollToThumb(currentIdx.value)
}

const nextImage = () => {
    if (props.images.length === 0) return
    currentIdx.value = (currentIdx.value + 1) % props.images.length
    scrollToThumb(currentIdx.value)
}

// Xử lý cuộn cho Thumbnail
// Logic cuộn chính xác không bị cắt xén
const scrollThumbLeft = () => {
    if (!thumbContainer.value) return
    // Lấy chiều rộng thực tế của 1 tấm ảnh + 8px (của gap-2)
    const itemWidth = thumbContainer.value.children[0].offsetWidth + 8
    
    // Cuộn sang trái 2 tấm
    thumbContainer.value.scrollBy({ left: -(itemWidth * 2), behavior: 'smooth' })
}

const scrollThumbRight = () => {
    if (!thumbContainer.value) return
    const itemWidth = thumbContainer.value.children[0].offsetWidth + 8
    
    // Cuộn sang phải 2 tấm
    thumbContainer.value.scrollBy({ left: (itemWidth * 2), behavior: 'smooth' })
}

// Tự động cuộn thumbnail đang chọn vào vùng hiển thị
const scrollToThumb = async (index) => {
    await nextTick()
    if (!thumbContainer.value) return

    const thumbBtn = thumbContainer.value.children[index]
    if (!thumbBtn) return

    const containerWidth = thumbContainer.value.clientWidth
    const scrollLeft = thumbContainer.value.scrollLeft
    const btnLeft = thumbBtn.offsetLeft
    const btnWidth = thumbBtn.clientWidth

    // Nếu thumbnail nằm ngoài vùng bên trái hoặc bên phải thì cuộn tới nó
    if (btnLeft < scrollLeft || (btnLeft + btnWidth) > (scrollLeft + containerWidth)) {
        thumbContainer.value.scrollTo({
            left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
            behavior: 'smooth'
        })
    }
}

// Bắt sự kiện phím mũi tên để chuyển ảnh (Tùy chọn)
onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'ArrowRight') nextImage()
    })
})
</script>

<style scoped>
/* Ẩn scrollbar mặc định nhưng vẫn giữ tính năng scroll */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

</style>
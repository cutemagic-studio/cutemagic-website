<!-- <template>
    <div class="flex items-center gap-2">
        
        <button 
            @click="goToPrev"
            :disabled="!prevAssetId"
            class="p-2.5 rounded-xl transition-all duration-300 group"
            :class="prevAssetId 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 dark:hover:text-white cursor-pointer shadow-sm' 
                : 'bg-transparent text-gray-300 dark:text-slate-700 cursor-not-allowed'"
            title="Previous Asset">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-5 w-5 transition-transform duration-300"
                 :class="prevAssetId ? 'group-hover:-translate-x-0.5' : ''" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        
        <router-link to="/assets"
            class="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Back to Grid">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        </router-link>

        
        <button 
            @click="goToNext"
            :disabled="!nextAssetId"
            class="p-2.5 rounded-xl transition-all duration-300 group"
            :class="nextAssetId 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 dark:hover:text-white cursor-pointer shadow-sm' 
                : 'bg-transparent text-gray-300 dark:text-slate-700 cursor-not-allowed'"
            title="Next Asset">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-5 w-5 transition-transform duration-300"
                 :class="nextAssetId ? 'group-hover:translate-x-0.5' : ''" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template> -->

<template>
    <div class="flex items-center gap-2">
        <!-- NÚT PREVIOUS (Lùi) -->
        <button 
            @click="goToPrev"
            :disabled="!prevAssetId"
            class="p-2.5 rounded-xl transition-all duration-300 group"
            :class="prevAssetId 
                ? 'border-2 bg-gray-100 text-gray-700 hover:bg-[#FFA500] hover:text-white dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-[#FFA500] dark:hover:text-white cursor-pointer shadow-sm' 
                : 'border-2 bg-transparent text-gray-300 dark:text-slate-700 cursor-not-allowed'"
            title="Previous Asset">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-5 w-5 transition-transform duration-300"
                 :class="prevAssetId ? 'group-hover:-translate-x-0.5' : ''" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <!-- NÚT GRID (Về trang danh sách) -->
        <router-link to="/assets"
            class="border-2 p-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm bg-gray-100 text-gray-700 hover:bg-[#FFA500] hover:text-white dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-[#FFA500] dark:hover:text-white"
            title="Back to Grid">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        </router-link>

        <!-- NÚT NEXT (Tiến) -->
        <button 
            @click="goToNext"
            :disabled="!nextAssetId"
            class="p-2.5 rounded-xl transition-all duration-300 group"
            :class="nextAssetId 
                ? 'border-2 bg-gray-100 text-gray-700 hover:bg-[#FFA500] hover:text-white dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-[#FFA500] dark:hover:text-white cursor-pointer shadow-sm' 
                : 'border-2 bg-transparent text-gray-300 dark:text-slate-700 cursor-not-allowed'"
            title="Next Asset">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-5 w-5 transition-transform duration-300"
                 :class="nextAssetId ? 'group-hover:translate-x-0.5' : ''" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAssetStore } from '../../../../../stores/useAssetStore' // Đảm bảo đường dẫn đúng

const props = defineProps({
    currentAssetId: {
        type: Number,
        required: true
    }
})

const router = useRouter()
const assetStore = useAssetStore()
const { assets } = storeToRefs(assetStore)

// Tìm vị trí Index của sản phẩm hiện tại trong mảng
const currentIndex = computed(() => {
    if (!assets.value) return -1
    return assets.value.findIndex(a => a.id === props.currentAssetId)
})

// Xác định ID của sản phẩm trước đó (nếu có)
const prevAssetId = computed(() => {
    if (currentIndex.value > 0) {
        return assets.value[currentIndex.value - 1].id
    }
    return null // Null nghĩa là đang ở sản phẩm đầu tiên -> Disable nút
})

// Xác định ID của sản phẩm tiếp theo (nếu có)
const nextAssetId = computed(() => {
    if (currentIndex.value !== -1 && currentIndex.value < assets.value.length - 1) {
        return assets.value[currentIndex.value + 1].id
    }
    return null // Null nghĩa là đang ở sản phẩm cuối cùng -> Disable nút
})

// Hàm điều hướng
const goToPrev = () => {
    if (prevAssetId.value) {
        // Thay đổi URL để load sản phẩm mới (Có thể sửa lại định dạng path tùy route của bạn)
        router.push(`/assets/${prevAssetId.value}`) 
    }
}

const goToNext = () => {
    if (nextAssetId.value) {
        router.push(`/assets/${nextAssetId.value}`)
    }
}
</script>
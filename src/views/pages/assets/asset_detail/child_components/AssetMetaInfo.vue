<template>
    <div class="premium-glass-panel dashed-boundary bg-slate-50/80 dark:bg-[#11141b]/80 backdrop-blur-md rounded-xl p-4 sm:p-5 mb-6">
    <!-- <div class="bg-slate-50/60 dark:bg-[#11141b]/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-xl p-4 sm:p-5 mb-6 shadow-sm"> -->
        <ul class="flex flex-col gap-3.5">
            
            <!-- 1. Lượt xem (Views) -->
            <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div class="w-5 h-5 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span>
                    <strong class="text-slate-900 dark:text-slate-200 font-bold">{{ displayViews }} views</strong> in the past week
                </span>
            </li>

            <!-- 2. Ngày ra mắt lần đầu (Initial Release) -->
            <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div class="w-5 h-5 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <!-- Icon Calendar -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <span>
                    Initial release: <strong class="text-slate-900 dark:text-slate-200 font-bold">{{ displayInitialDate }}</strong>
                </span>
            </li>

            <!-- 3. Ngày cập nhật gần nhất (Latest Release/Update) -->
            <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div class="w-5 h-5 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <!-- Icon Refresh/Update -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </div>
                <span>
                    Latest update: <strong class="text-slate-900 dark:text-slate-200 font-bold">{{ displayLatestDate }}</strong>
                </span>
            </li>

            <!-- 4. Bản quyền (License Type) -->
            <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div class="w-5 h-5 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <span>
                    License type: <strong class="text-slate-900 dark:text-slate-200 font-bold">{{ displayLicense }}</strong>
                </span>
            </li>

            <!-- 5. Dung lượng (File Size) -->
            <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div class="w-5 h-5 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75C20.25 20.153 16.556 22 12 22s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                </div>
                <span>
                    File size: <strong class="text-slate-900 dark:text-slate-200 font-bold">{{ displayFileSize }}</strong>
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    asset: {
        type: Object,
        required: true
    }
})

// Format ngày tháng chuẩn hóa (VD: Nov 01, 2026)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

const displayInitialDate = computed(() => formatDate(props.asset?.initialReleaseDate))
const displayLatestDate = computed(() => formatDate(props.asset?.latestReleaseDate))

const displayViews = computed(() => {
    if (props.asset?.views) return props.asset.views.toLocaleString()
    return '1,425' // Dữ liệu mồi nếu db chưa có views
})

const displayLicense = computed(() => props.asset?.download?.license || 'Standard Commercial')
const displayFileSize = computed(() => props.asset?.download?.fileSize || 'Varies by Package')
</script>

<style scoped>
/* =======================================================
   ĐỊNH NGHĨA CLASS ĐƯỜNG VIỀN CAO CẤP (GLASSMORPHISM BORDER) 
   ======================================================= */
.premium-glass-panel {
    /* Mặc định cho Light Mode */
    border: 2px solid #363636;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

/* Áp dụng khi website ở Dark Mode (sử dụng Tailwind :global) */
:global(.dark) .premium-glass-panel {
    /* 1. Đường viền ngoài cùng cực mỏng màu trắng mờ (như trong ảnh) */
    border: 2px solid rgba(255, 255, 255, 0.08);
    
    /* 2. Hiệu ứng 3D: 
          - inset ... rgba(255, 255, 255, 0.05): Tạo ánh sáng hắt nhẹ viền trong phía trên đỉnh khối.
          - 0 8px 20px rgba(0, 0, 0, 0.5): Bóng đổ sâu phía dưới để nhấc bổng khối lên khỏi nền đen.
    */
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05),
                0 8px 20px rgba(0, 0, 0, 0.5);
}

/* =======================================================
   2. ĐỊNH NGHĨA ĐƯỜNG VIỀN NÉT ĐỨT (DASHED BOUNDARY)
   ======================================================= */
.dashed-boundary {
    /* Đặt relative để lớp viền bám theo kích thước của khối này */
    position: relative;
}

.dashed-boundary::before {
    content: '';
    position: absolute;
    /* Đẩy viền ra ngoài khối 6px ở cả 4 cạnh để giống nét vẽ bao quanh */
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    
    /* Đường nét đứt màu xanh (blue-500 của Tailwind) */
    border: 2px dashed rgba(59, 130, 246, 0.8); 
    
    /* Bo góc to hơn khối bên trong một chút để đường viền ôm mượt mà */
    border-radius: 1.25rem; 
    
    /* Tránh việc đường viền cản trở người dùng bôi đen chữ hay click chuột */
    pointer-events: none; 
}

/* Tùy chỉnh màu nét đứt khi ở Dark Mode cho dịu mắt hơn */
:global(.dark) .dashed-boundary::before {
    border: 2px dashed rgba(59, 130, 246, 0.5); 
}
</style>
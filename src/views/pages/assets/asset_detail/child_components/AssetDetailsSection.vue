<!-- src/views/pages/assets/asset_detail/child_components/AssetDetailsSection.vue -->
<template>
    <div class="mt-16 mb-16 px-4 sm:px-0">

        <div
            class="premium-glass-panel dashed-boundary bg-slate-50/80 dark:bg-[#11141b]/80 backdrop-blur-md rounded-xl p-4 sm:p-5 mb-6">

            <!-- ==========================================
                 GIAO DIỆN ACCORDION (CHỈ HIỂN THỊ TRÊN MOBILE/TABLET)
                 ========================================== -->
            <div class="lg:hidden flex flex-col gap-6">

                <!-- Tab: Description -->
                <div class="transition-all duration-300">
                    <button @click="isDescOpen = !isDescOpen"
                        class="w-full flex justify-between items-center rounded-xl py-4 px-4 
                        bg-[#FFFFF0] hover:bg-[#32CD32]
                        dark:bg-slate-800 dark:hover:bg-[#32CD32] 
                        border-1 border-[#555555] dark:border-slate-800/50 hover:text-[#363636] transition-colors cursor-pointer group outline-none">
                        <span
                            class="text-lg font-bold text-slate-900 dark:text-white tracking-wide group-hover:text-[#1C1C1C] dark:group-hover:text-[#1C1C1C]">Description</span>
                        <svg :class="{ 'rotate-180': isDescOpen }"
                            class="w-5 h-5 text-slate-500 group-hover:text-[#1C1C1C] dark:group-hover:text-[#1C1C1C] transition-transform duration-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Nội dung Description & Features trên Mobile -->
                    <div v-show="isDescOpen"
                        class="mt-2 ml-6 p-5 sm:p-6 bg-slate-100/50 dark:bg-white/5 rounded-2xl border-1 border-[#555555] dark:border-slate-800/50">
                        <div class="text-[15px] text-slate-700 dark:text-gray-300 leading-relaxed space-y-4">
                            
                            <!-- [CẬP NHẬT RICH TEXT]: Hiển thị Description bằng v-html -->
                            <div
                                v-if="formattedDescription"
                                class="cmg-rich-content"
                                v-html="formattedDescription"
                            ></div>

                            <!-- [CẬP NHẬT RICH TEXT]: Hiển thị Features / Technical Details bằng v-html -->
                            <template v-if="formattedFeatures">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                                    Features &amp; Technical Details
                                </h3>
                                <div
                                    class="cmg-rich-content"
                                    v-html="formattedFeatures"
                                ></div>
                            </template>

                            <!-- Phần FAQ -->
                            <template v-if="asset?.faqs?.length">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">FAQ</h3>
                                <div v-for="(faq, idx) in asset.faqs" :key="'m-faq' + idx" class="mb-4">
                                    <h4 class="font-bold text-slate-900 dark:text-white">{{ faq.question }}</h4>
                                    <p class="pt-1 text-sm">{{ faq.answer }}</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Tab: Reviews -->
                <div class="transition-all duration-300">
                    <button @click="isReviewsOpen = !isReviewsOpen"
                        class="w-full flex justify-between items-center rounded-xl py-4 px-4 bg-[#FFFFF0] hover:bg-[#32CD32] dark:bg-slate-800 dark:hover:bg-[#32CD32] border-1 border-[#555555] dark:border-slate-800/50 hover:text-[#363636] transition-colors cursor-pointer group outline-none">
                        <span
                            class="text-lg font-bold text-slate-900 dark:text-white tracking-wide group-hover:text-[#1C1C1C] dark:group-hover:text-[#1C1C1C]">Reviews</span>
                        <svg :class="{ 'rotate-180': isReviewsOpen }"
                            class="w-5 h-5 text-slate-500 group-hover:text-[#1C1C1C] dark:group-hover:text-[#1C1C1C] transition-transform duration-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div v-show="isReviewsOpen"
                        class="mt-2 ml-6 p-8 text-center text-slate-500 bg-slate-100/50 dark:bg-white/5 rounded-2xl border-1 border-[#555555] dark:border-slate-800/50">
                        No reviews yet. Be the first to review this asset!
                    </div>
                </div>
            </div>

            <!-- ==========================================
                 GIAO DIỆN TABS (CHỈ HIỂN THỊ TRÊN LAPTOP/DESKTOP)
                 ========================================== -->
            <div class="hidden lg:block">

                <!-- Dải Nút Tabs thiết kế đồng bộ với Header -->
                <div class="flex justify-center gap-4 pb-8 border-b border-slate-200/50 dark:border-gray-800/50">

                    <!-- Nút Tab: Description -->
                    <button @click="activeTab = 'description'"
                        class="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 outline-none cursor-pointer border-2"
                        :class="activeTab === 'description'
                            ? 'bg-blue-600 border-[#363636] text-white shadow-sm shadow-blue-500/10 scale-105'
                            : 'bg-transparent border-[#363636] text-slate-500 hover:bg-slate-200/50 dark:text-gray-400 dark:hover:bg-slate-800/50 dark:hover:text-white'">
                        Description
                    </button>

                    <!-- Nút Tab: Reviews -->
                    <button @click="activeTab = 'reviews'"
                        class="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 outline-none cursor-pointer border-2"
                        :class="activeTab === 'reviews'
                            ? 'bg-blue-600 border-[#363636] text-white shadow-sm shadow-blue-500/10 scale-105'
                            : 'bg-transparent border-[#363636] text-slate-500 hover:bg-slate-200/50 dark:text-gray-400 dark:hover:bg-slate-800/50 dark:hover:text-white'">
                        Reviews (0)
                    </button>

                </div>

                <!-- Nội dung Tabs -->
                <div class="pt-8 min-h-[250px]">

                    <!-- Tab: Description -->
                    <div v-if="activeTab === 'description'"
                        class="text-[15px] text-slate-700 dark:text-gray-300 leading-relaxed w-full space-y-6 animate-fade-in">

                        <!-- [CẬP NHẬT RICH TEXT]: Mô tả chi tiết (Description) -->
                        <div
                            v-if="formattedDescription"
                            class="cmg-rich-content"
                            v-html="formattedDescription"
                        ></div>

                        <!-- [CẬP NHẬT RICH TEXT]: Danh sách tính năng & Chi tiết kỹ thuật (Features / Technical Details) -->
                        <template v-if="formattedFeatures">
                            <h3
                                class="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6 flex items-center gap-2">
                                <span class="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
                                Features &amp; Technical Details
                            </h3>

                            <div
                                class="cmg-rich-content bg-white/30 dark:bg-white/5 p-6 rounded-2xl"
                                v-html="formattedFeatures"
                            ></div>
                        </template>

                        <!-- Phần FAQ -->
                        <template v-if="asset?.faqs?.length">
                            <h3
                                class="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6 flex items-center gap-2">
                                <span class="w-2 h-6 bg-orange-400 rounded-full inline-block"></span>
                                FAQ
                            </h3>
                            <div class="space-y-4">
                                <div v-for="(faq, idx) in asset.faqs" :key="'faq' + idx"
                                    class="bg-white/30 dark:bg-white/5 p-5 rounded-xl">
                                    <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ faq.question }}</h4>
                                    <p class="pt-2 text-slate-600 dark:text-gray-400">{{ faq.answer }}</p>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Tab: Reviews -->
                    <div v-if="activeTab === 'reviews'" class="text-slate-500 py-12 text-center w-full animate-fade-in">
                        <div class="text-4xl mb-4 opacity-50">⭐</div>
                        No reviews yet. Be the first to review this asset!
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    asset: {
        type: Object,
        required: true
    }
})

const isDescOpen = ref(true)
const isReviewsOpen = ref(false)
const activeTab = ref('description')

/**
 * Chuẩn hóa nội dung Description:
 * - Nếu là mã HTML từ RichTextEditor -> Hiển thị nguyên bản
 * - Nếu là mảng text thuần cũ -> Tự động bọc từng đoạn vào thẻ <p>
 */
const formattedDescription = computed(() => {
    const raw = props.asset?.content?.fullDescription ?? props.asset?.fullDescription
    if (!raw) return ''
    if (typeof raw === 'string') return raw.trim()
    if (Array.isArray(raw)) {
        const cleaned = raw.map(item => String(item || '').trim()).filter(Boolean)
        if (!cleaned.length) return ''
        // Nếu phần tử đầu tiên đã chứa thẻ HTML từ RichTextEditor
        if (cleaned.length === 1 && /<[a-z][\s\S]*>/i.test(cleaned[0])) {
            return cleaned[0]
        }
        return cleaned.map(para => `<p>${para}</p>`).join('')
    }
    return ''
})

/**
 * Chuẩn hóa nội dung Features / Technical Details:
 * - Nếu là mã HTML từ RichTextEditor -> Hiển thị nguyên bản
 * - Nếu là mảng gạch đầu dòng cũ -> Tự động tạo danh sách <ul><li>
 */
const formattedFeatures = computed(() => {
    const raw = props.asset?.content?.features ?? props.asset?.features
    if (!raw) return ''
    if (typeof raw === 'string') return raw.trim()
    if (Array.isArray(raw)) {
        const cleaned = raw.map(item => String(item || '').trim()).filter(Boolean)
        if (!cleaned.length) return ''
        // Nếu đã được soạn bằng RichTextEditor (chứa các thẻ khối như <p>, <ul>, <ol>, <div>, <br>)
        if (cleaned.length === 1 && /<(p|ul|ol|div|h[1-6]|br|span|strong|b)[\s\S]*>/i.test(cleaned[0])) {
            return cleaned[0]
        }
        // Dữ liệu mảng cũ: bọc vào danh sách <ul><li>
        return `<ul>${cleaned.map(feat => `<li>${feat}</li>`).join('')}</ul>`
    }
    return ''
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* =======================================================
   ĐỊNH NGHĨA CLASS ĐƯỜNG VIỀN CAO CẤP (GLASSMORPHISM BORDER) 
   ======================================================= */
.premium-glass-panel {
    border: 2px solid #363636;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

:global(.dark) .premium-glass-panel {
    border: 2px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05),
        0 8px 20px rgba(0, 0, 0, 0.5);
}

/* =======================================================
   STYLE CHUẨN CHO NỘI DUNG RICH TEXT (DESCRIPTION & FEATURES)
   ======================================================= */
:deep(.cmg-rich-content p) {
    margin-bottom: 0.75rem;
    line-height: 1.75;
}

:deep(.cmg-rich-content p:last-child) {
    margin-bottom: 0;
}

:deep(.cmg-rich-content ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem 0;
}

:deep(.cmg-rich-content ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem 0;
}

:deep(.cmg-rich-content li) {
    margin-bottom: 0.45rem;
    line-height: 1.7;
}

:deep(.cmg-rich-content li::marker) {
    color: #3b82f6;
}

:deep(.cmg-rich-content strong),
:deep(.cmg-rich-content b) {
    font-weight: 800;
    color: #0f172a;
}

:global(.dark) :deep(.cmg-rich-content strong),
:global(.dark) :deep(.cmg-rich-content b) {
    color: #ffffff;
}

/* Đảm bảo các vùng chữ được tô nền Highlight luôn bo góc đẹp và rõ chữ trên cả nền Tối & Sáng */
:deep(.cmg-rich-content span[style*="background-color"]:not([style*="transparent"]):not([style*="rgba(0, 0, 0, 0)"])),
:deep(.cmg-rich-content font[style*="background-color"]:not([style*="transparent"]):not([style*="rgba(0, 0, 0, 0)"])) {
    color: #1c1c1c !important;
    padding: 0.1rem 0.4rem;
    border-radius: 0.35rem;
    font-weight: 700;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
</style>
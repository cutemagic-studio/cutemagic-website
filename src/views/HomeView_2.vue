<template>
    <div class="min-h-screen font-sans antialiased bg-[#0b0e14]">

        <div v-if="isDashboardMode" class="h-screen flex overflow-hidden">
            <aside class="w-64 bg-[#11141b] border-r border-slate-800 p-6 flex flex-col h-full shrink-0 z-20">
                <div class="mb-10 px-2">
                    <div class="flex items-center gap-2 mb-1">
                        <div class="w-6 h-6 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
                        <h1 class="text-lg font-black text-white tracking-tight">CuteMagic</h1>
                    </div>
                    <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Control Panel</p>
                </div>

                <nav class="space-y-1 mb-8">
                    <button @click="isDashboardMode = false"
                        class="group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-4">
                        <span class="text-lg">🏠</span>
                        <span>Home</span>
                    </button>

                    <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Tools</div>

                    <button v-for="tab in dashboardTabs" :key="tab.id" @click="activeDashboardTab = tab" :class="[
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all mb-1',
                        activeDashboardTab.id === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800'
                    ]">
                        <span class="text-lg">{{ tab.icon }}</span>
                        <span>{{ tab.name }}</span>
                    </button>
                </nav>

                <div class="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                    <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-4">Color Presets
                    </div>

                    <div class="space-y-2">
                        <div v-for="(group, gIdx) in colorGroups" :key="gIdx"
                            class="border border-slate-800/50 rounded-xl overflow-hidden bg-[#161a23]/30">
                            <button @click="toggleGroup(gIdx)"
                                class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{{
                                    group.name }}</span>
                                <span class="text-[9px] text-slate-600 transition-transform duration-300"
                                    :class="openGroup === gIdx ? 'rotate-180' : ''">▼</span>
                            </button>

                            <div v-show="openGroup === gIdx"
                                class="p-2 grid grid-cols-4 gap-1.5 bg-[#0b0e14]/50 border-t border-slate-800/50">
                                <!-- <button v-for="color in group.colors" :key="color" @click="quickSelectColor(color)"
                                    class="h-7 rounded-md border border-white/5 hover:scale-110 transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] active:scale-95"
                                    :style="{ backgroundColor: color }" :title="color"></button> -->
                                <button v-for="color in group.colors" :key="color" @click="quickSelectColor(color)"
                                    class="cursor-pointer h-7 rounded-md border border-white/5 hover:scale-110 active:scale-95 transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] relative group/item"
                                    :style="{ backgroundColor: color }" :title="`Click to copy & use ${color}`">
                                    <span
                                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-3 w-3 text-white mix-blend-difference" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                    </span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main class="flex-1 h-full overflow-y-auto bg-[#0b0e14] custom-scrollbar">
                <!-- <div class="max-w-[1400px] mx-auto p-6 md:p-10">w-full -->
                <div class="w-full mx-auto">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="activeDashboardTab.component" />
                    </transition>
                </div>
            </main>
        </div>

        <div v-else class="flex flex-col text-gray-900 bg-white">
            <TheHeader @open-admin="isDashboardMode = true" />

            <main class="flex-grow">
                <HeroSection id="hero-section" />
                <WhyChooseUs id="why-choose-us" />
                <AssetGallery id="gallery" />
                <AssetSpecs id="specs" />
                <ProductionRoadmap id="roadmap" />
                <AssetVote />
                <QuickList />
                <Testimonials />
                <FaqAccordion />
                <ContactSection />
            </main>

            <TheFooter />
            <TrafficTracker />

            <button @click="openHelper"
                class="group fixed bottom-6 right-6 h-14 w-14 hover:w-44 cursor-pointer bg-[#1C1C1C] text-white rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-500 ease-in-out z-50 overflow-hidden border border-white/20">
                <div
                    class="flex items-center justify-center w-14 h-14 shrink-0 transition-transform duration-500 group-hover:scale-110">
                    <span class="text-2xl">🧰</span>
                </div>

                <span
                    class="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold tracking-wide opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pr-6 transition-all duration-500 ease-in-out">
                    TOOLS
                </span>
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue'

// --- TRANG LANDING PAGE COMPONENTS ---
import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
import HeroSection from '../components/showcase/HeroSection.vue'
import WhyChooseUs from '../components/showcase/WhyChooseUs.vue'
import AssetGallery from '../components/showcase/AssetGallery.vue'
import AssetSpecs from '../components/showcase/AssetSpecs.vue'
import ProductionRoadmap from '../components/showcase/ProductionRoadmap.vue'
import AssetVote from '../components/showcase/AssetVote.vue'
import QuickList from '../components/showcase/QuickList.vue'
import FaqAccordion from '../components/showcase/FaqAccordion.vue'
import Testimonials from '../components/showcase/Testimonials.vue'
import ContactSection from '../components/showcase/ContactSection.vue'
import TrafficTracker from '../components/utils/TrafficTracker.vue'

// --- ADMIN/TOOLS COMPONENTS ---
import PaletteColorGenerator from '../views/extension/ExtensionLayout.vue'
// Giả sử bạn đã có component này, nếu chưa hãy tạo file trắng để tránh lỗi
import CuteMagicExtension from '../views/extension/CuteMagicExtension.vue'

// Trạng thái hiển thị: false = Landing Page, true = Dashboard
const isDashboardMode = ref(false)

const dashboardTabs = [
    {
        id: 'PaletteColorGenerator',
        name: 'Palette Color',
        icon: '🎨',
        component: markRaw(PaletteColorGenerator)
    },
    {
        id: 'CuteMagicExtension',
        name: 'Helper Extension',
        icon: '🚀',
        component: markRaw(CuteMagicExtension)
    }
]

const activeDashboardTab = ref(dashboardTabs[0])

// Hàm mở nhanh trang Helper từ Landing Page
const openHelper = () => {
    activeDashboardTab.value = dashboardTabs.find(t => t.id === 'PaletteColorGenerator')
    isDashboardMode.value = true
}

// ... các import hiện tại ...

// --- DỮ LIỆU BẢNG MÀU MINI ---
const colorGroups = [
    {
        // 
        name: "# 1",
        colors: ["#8B0016", "#B2001F", "#C50023", "#DF0029", "#E54646", "#EE7C6B", "#F5A89A", "#FCDAD5"]
    },
    {
        name: "# 2",
        colors: ["#8E1E20", "#B6292B", "#C82E31", "#E33539", "#EB7153", "#F19373", "#F6B297", "#FCD9C4"]
    },
    {
        name: "# 3",
        colors: ["#945305", "#BD6B09", "#D0770B", "#EC870E", "#F09C42", "#F5B16D", "#FACE9C", "#FDE2CA"]
    },
    {
        name: "# 4",
        colors: ["#976D00", "#C18C00", "#D59B00", "#F1AF00", "#F3C246", "#F9CC76", "#FCE0A6", "#FEEBD0"]
    },
    {
        name: "# 5",
        colors: ["#9C9900", "#C7C300", "#DCD800", "#F9F400", "#FCF54C", "#FEF889", "#FFFAB3", "#FFFBD1"]
    },
    {
        name: "# 6",
        colors: ["#367517", "#489620", "#50A625", "#5BBD2B", "#83C75D", "#AFD788", "#C8E2B1", "#E6F1D8"]
    },
    {
        name: "# 7",
        colors: ["#006241", "#007F54", "#008C5E", "#00A06B", "#00AE72", "#67BF7F", "#98D0B9", "#C9E4D6"]
    },
    {
        name: "# 8",
        colors: ["#00676B", "#008489", "#009298", "#00A6AD", "#00B2BF", "#6EC3C9", "#99D1D3", "#CAE5E8"]
    },
    {
        name: "# 9",
        colors: ["#103667", "#184785", "#1B4F93", "#205AA7", "#426EB4", "#7388C1", "#94AAD6", "#BFCAE6"]
    },
    {
        name: "# 10",
        colors: ["#211551", "#2D1E69", "#322275", "#3A2885", "#511F90", "#635BA2", "#8273B0", "#A095C4"]
    },
    {
        name: "# 11",
        colors: ["#38044B", "#490761", "#52096C", "#5D0C7B", "#79378B", "#8C63A4", "#AA87B8", "#C9B5D4"]
    },
    {
        name: "# 12",
        colors: ["#64004B", "#780062", "#8F006D", "#A2007C", "#AF4A92", "#C57CAC", "#D2A6C7", "#E8D3E3"]
    },
    {
        name: "# 13",
        colors: ["#ECECEC", "#D7D7D7", "#C2C2C2", "#B7B7B7", "#A0A0A0", "#898989", "#707070", "#555555", "#363636", "#000000"]
    }
]

const openGroup = ref(0) // Mặc định mở nhóm đầu tiên

const toggleGroup = (index) => {
    openGroup.value = openGroup.value === index ? -1 : index
}

/**
 * Logic quan trọng: Đồng bộ màu về Palette Generator
 * Nếu đang ở tab khác, nó sẽ tự động chuyển về tab Palette và áp dụng màu
 */
const quickSelectColor = async (color) => {
    // 1. Thực hiện copy mã màu vào Clipboard
    try {
        await navigator.clipboard.writeText(color);
        // Bạn có thể thêm một thông báo nhỏ (toast) ở đây nếu muốn
        console.log(`Copied: ${color}`);
    } catch (err) {
        console.error('Không thể copy màu: ', err);
    }
};
</script>

<style scoped>
/* Scrollbar cho Dashboard
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
} */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #334155;
}

/* Chuyển cảnh mượt */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
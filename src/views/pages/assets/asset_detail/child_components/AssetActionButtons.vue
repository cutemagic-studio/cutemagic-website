<template>
    <!-- mt-auto giúp đẩy toàn bộ cụm nút này xuống đáy của Cột Phải -->
    <div class="flex flex-col w-full mt-auto pt-4">
        
        <!-- ==========================================
             NHÁNH 1: ASSET FREE CÓ LINK TẢI
             ========================================== -->
        <template v-if="asset?.isDownloadable">
            <div class="relative w-full">
                <!-- Nhãn Độc Quyền -->
                <div v-if="asset.isExclusive" 
                     class="absolute -top-3 -right-2 bg-[#3C3C3C] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md border border-[#1C1C1C] z-10 animate-bounce-slow flex items-center gap-1">
                    ⭐ <span class="text-white">Web Exclusive</span>
                </div>

                <!-- <button @click="openLink(asset.download.url)"
                    class="w-full bg-[#1ab04a] hover:bg-[#15963f] text-white font-black py-4 px-6 rounded-xl uppercase text-sm tracking-widest transition-all cursor-pointer shadow-lg shadow-green-500/20 border-2 border-[#1C1C1C] dark:border-[#1ab04a]/50 flex flex-col items-center group relative overflow-hidden">
                    <span class="group-hover:-translate-y-0.5 transition-transform relative z-10">Download for Free</span>
                    
                    <div class="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </button> -->
                <button @click="isDonateModalOpen = true"
                    class="w-full bg-[#32CD32] hover:bg-[#00FF00] text-white font-black py-4 px-6 rounded-xl uppercase text-sm tracking-widest transition-all cursor-pointer shadow-lg shadow-green-500/20 border-2 border-[#1C1C1C] dark:border-[#1ab04a]/50 flex flex-col items-center group relative overflow-hidden">
                    <span class="group-hover:-translate-y-0.5 transition-transform relative z-10">Download for Free</span>
                    
                    <div class="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </button>
            </div>
            
            <!-- Danh sách Store phụ (Dàn ngang flex, nhỏ nhắn ở dưới) -->
            <!-- Vẫn áp dụng logic làm mờ/disable nếu không có link -->
            <div v-if="!asset.isExclusive" class="min-h-[88px] flex flex-col justify-end w-full">
                <div class="w-full flex items-center gap-4 mb-4 mt-2">
                    <div class="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Hoặc ủng hộ trên</span>
                    <div class="h-px bg-slate-200 dark:bg-slate-700/50 flex-1"></div>
                </div>
                
                <div class="flex items-center gap-2 w-full">
                    <button v-for="store in storeConfigs" :key="'free-'+store.key" 
                        @click="hasLink(store.key) ? openLink(asset.links[store.key]) : null"
                        class="flex-1 h-10 border-2 rounded-lg flex items-center justify-center transition-all group overflow-hidden"
                        :class="hasLink(store.key) 
                            ? `bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md text-slate-600 dark:text-slate-300 ${store.hoverColor}` 
                            : 'bg-slate-50 dark:bg-transparent border-slate-100 dark:border-slate-800/50 opacity-40 cursor-not-allowed grayscale text-slate-400 dark:text-slate-600'"
                        :title="store.label">
                        <div class="w-4 h-4" v-html="store.icon"></div>
                    </button>
                </div>
            </div>
            <div v-else class="min-h-[88px] flex flex-col justify-end w-full"></div>

        </template>
        
        <!-- ==========================================
             NHÁNH 2: ASSET TRẢ PHÍ (GRID LƯỚI 6 NÚT)
             ========================================== -->
        <template v-else>
            <!-- Grid 2 cột, giảm khoảng cách (gap-2) để nút sát nhau hơn -->
            <div class="grid grid-cols-2 gap-2 w-full">
                
                <!-- Render LUÔN CẢ 6 NÚT. Nếu không có link thì Disable -->
                <button 
                    v-for="store in storeConfigs" 
                    :key="store.key"
                    @click="hasLink(store.key) ? openLink(asset.links[store.key]) : null"
                    class="w-full h-14 rounded-xl flex items-center justify-center gap-3 transition-all group border-2 relative overflow-hidden"
                    :class="hasLink(store.key)
                        ? `bg-white dark:bg-[#161a23] border-[#1e1e1e] dark:border-slate-700 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md text-slate-700 dark:text-slate-300 ${store.hoverColor}`
                        : 'bg-slate-50 dark:bg-[#11141b] border-slate-100 dark:border-slate-800/50 opacity-40 cursor-not-allowed grayscale text-slate-400 dark:text-slate-600'"
                >
                    <!-- SVG Icon -->
                    <div class="w-5 h-5 flex-shrink-0" v-html="store.icon"></div>

                    <!-- Layout chữ kiểu Badge: Mua tại \n Tên Sàn -->
                    <div class="flex flex-col items-start leading-none text-left">
                        <!-- Chữ BUY ON -->
                        <span class="text-[8px] font-bold uppercase tracking-widest opacity-60 mb-0.5" v-if="hasLink(store.key)">Buy on</span>
                        <span class="text-[8px] font-bold uppercase tracking-widest opacity-60 mb-0.5" v-else>N/A</span>
                        
                        <!-- Tên Sàn -->
                        <span class="font-black text-[13px] group-hover:scale-105 transition-transform origin-left">{{ store.label }}</span>
                    </div>
                </button>
                
            </div>
        </template>
        
        <DownloadDonateModal 
            :is-open="isDonateModalOpen" 
            :download-url="asset?.download?.url || ''"
            @close="isDonateModalOpen = false" 
        />

    </div>
</template>

<script setup>

import { ref } from 'vue'
import { computed } from 'vue'
import { useAssetStore } from '../../../../../stores/useAssetStore.js'

import DownloadDonateModal from '../../../../modals/DownloadDonateModal.vue'

const props = defineProps({
    asset: {
        type: Object,
        required: true
    }
})

// State quản lý việc đóng mở Modal Donate
const isDonateModalOpen = ref(false)

// Kiểm tra xem asset có link của sàn tương ứng không
const hasLink = (key) => {
    return props.asset?.links && props.asset.links[key] && props.asset.links[key].trim() !== ''
}

const assetStore = useAssetStore()
const isLiked = computed(() => assetStore.isFavorite(props.asset?.id))

// Cấu hình 6 Store kèm Icon SVG vẽ bằng path cơ bản
const storeConfigs = [
    { 
        key: 'unity', 
        label: 'Unity', 
        hoverColor: 'hover:border-blue-600 hover:text-blue-600 dark:hover:border-white dark:hover:text-white',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>' 
    },
    { 
        key: 'itch', 
        label: 'Itch.io', 
        hoverColor: 'hover:border-[#ff005b] hover:text-[#ff005b] dark:hover:border-[#ff005b] dark:hover:text-[#ff005b]',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="17" cy="12" r="1"></circle><circle cx="14" cy="12" r="1"></circle><path d="M6 12h4m-2-2v4"></path></svg>'
    },
    { 
        key: 'fab', 
        label: 'Fab', 
        hoverColor: 'hover:border-purple-500 hover:text-purple-500 dark:hover:border-purple-400 dark:hover:text-purple-400',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
    },
    { 
        key: 'cgtrader', 
        label: 'CG Trader', 
        hoverColor: 'hover:border-red-500 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21.54 15H17l-5-8.66L7 15H2.46l9.54-16.52L21.54 15z"></path></svg>'
    },
    { 
        key: 'unreal', 
        label: 'Unreal', 
        hoverColor: 'hover:border-blue-400 hover:text-blue-400 dark:hover:border-blue-300 dark:hover:text-blue-300',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 8v6a4 4 0 0 0 8 0V8"></path></svg>'
    },
    { 
        key: 'artstation', 
        label: 'ArtStation', 
        hoverColor: 'hover:border-blue-500 hover:text-blue-500 dark:hover:border-[#13aff0] dark:hover:text-[#13aff0]',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3L2 20h20L12 3z"></path><path d="M12 12l4 7"></path></svg>'
    }
]

const openLink = (url) => {
    if (url && url.trim() !== '') {
        window.open(url, '_blank')
    }
}
</script>

<style scoped>
@keyframes shine {
    100% { left: 200%; }
}
.animate-shine {
    animation: shine 1.5s ease-in-out;
}
.animate-bounce-slow {
    animation: bounce 3s infinite;
}
</style>
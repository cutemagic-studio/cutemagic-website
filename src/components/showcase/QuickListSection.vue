<template>
  <section id="QuickListSection" class="py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">

        <!-- Lặp qua 3 cột: New Releases, Top Rated, Coming Soon -->
        <div v-for="col in collections" :key="col.title" class="space-y-6">
          
          <!-- KHỐI TIÊU ĐỀ CỘT -->
          <div class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between group cursor-pointer shadow-xl transition-colors relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <h3 class="text-white text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors relative z-10">
              {{ col.title }}
            </h3>
            <span class="font-bold text-white group-hover:translate-x-1 transition-transform relative z-10">❯</span>
          </div>

          <!-- DANH SÁCH ITEMS TRONG TỪNG CỘT -->
          <div class="space-y-4">
            <!-- Xử lý nếu chưa có data -->
            <div v-if="!col.items || col.items.length === 0" class="text-center py-4 text-sm text-gray-500">
              Chưa có dữ liệu...
            </div>

            <!-- NHÚNG COMPONENT ASSET QUICK LIST CARD -->
            <template v-else>
              <AssetQuickListCard 
                v-for="item in col.items" 
                :key="item.id" 
                :asset="item" 
                :variant="col.id" 
              />
            </template>
            
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// 1. Nhớ import component bạn vừa tạo (Sửa lại đường dẫn tương đối cho khớp với cấu trúc thư mục của bạn)
import AssetQuickListCard from './asset_quick_list/AssetQuickListCard.vue' 

import { useAssetStore } from '../../stores/useAssetStore' 

const assetStore = useAssetStore()

// Dùng computed để nhóm dữ liệu từ store thành 3 cột. 
const collections = computed(() => [
  {
    id: 'new', // id này sẽ được truyền thẳng vào prop "variant"
    title: 'New Releases',
    items: assetStore.newAssets?.slice(0, 3) || []
  },
  {
    id: 'top',
    title: 'Top Rated',
    items: assetStore.topAssets?.slice(0, 3) || [] 
  },
  {
    id: 'upcoming',
    title: 'Coming Soon',
    items: assetStore.upcomingAssets?.slice(0, 3) || [] 
  }
])
</script>
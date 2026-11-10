<template>
  <section id="QuickListSection" class="py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">

        <!-- Lặp qua 3 cột: New Releases, Top Rated, Coming Soon -->
        <div v-for="col in collections" :key="col.id" class="space-y-6">
          
          <!-- KHỐI TIÊU ĐỀ CỘT (Bấm vào chuyển sang trang Asset Library với bộ lọc tương ứng) -->
          <router-link 
            :to="col.route"
            class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between group cursor-pointer shadow-xl transition-colors relative overflow-hidden block"
          >
            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div class="flex items-center gap-2.5 relative z-10">
              <h3 class="text-white text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors">
                {{ col.title }}
              </h3>
              <!-- Chấm xanh báo hiệu đã đồng bộ Real-time với Firebase -->
              <span 
                v-if="isFirebaseSynced" 
                class="w-2 h-2 rounded-full bg-emerald-400/80" 
                title="Live synced with Firebase"
              ></span>
            </div>
            <span class="font-bold text-white group-hover:translate-x-1 transition-transform relative z-10">❯</span>
          </router-link>

          <!-- DANH SÁCH ITEMS TRONG TỪNG CỘT --> 
          <div class="space-y-4">
            <!-- Xử lý nếu chưa có data -->
            <div v-if="!col.items || col.items.length === 0" class="text-center py-4 text-sm text-gray-500">
              {{ isLoadingFirebase ? 'Loading data...' : 'No data available...' }}
            </div>

            <!-- NHÚNG COMPONENT ASSET QUICK LIST CARD -->
            <template v-else>
              <AssetQuickListCard 
                v-for="item in col.items" 
                :key="`${col.id}_${item.id}_${item.releaseDate}_${item.pricing?.price ?? item.price}_${item.metrics?.likes ?? item.likes}_${item.dates?.availableIn}`" 
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
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Nhớ kiểm tra lại đường dẫn tương đối cho khớp với cấu trúc thư mục của bạn
import AssetQuickListCard from './AssetQuickListCard.vue' 
import { useAssetStore } from '../../../stores/useAssetStore.js' 

const assetStore = useAssetStore()

// 1. Dùng storeToRefs để đảm bảo tính Reactive tuyệt đối khi Firebase cập nhật mảng assets
const { 
  newAssets, 
  topAssets, 
  upcomingAssets, 
  isFirebaseSynced, 
  isLoadingFirebase 
} = storeToRefs(assetStore)

// 2. Tự động kích hoạt đồng bộ Firebase ngay khi компонент được gắn lên Trang chủ
onMounted(() => {
  assetStore.initFirebaseAssetsSync()
})

// 3. Nhóm dữ liệu từ Store thành 3 cột (Tự động sắp xếp lại khi Admin chỉnh sửa trên Firebase)
const collections = computed(() => [
  {
    id: 'new', // Truyền vào prop "variant"
    title: 'New Releases',
    route: { path: '/assets', query: { sort: 'newest' } },
    items: (newAssets.value || []).slice(0, 3)
  },
  {
    id: 'top',
    title: 'Top Rated',
    route: { path: '/assets', query: { sort: 'popular' } },
    items: (topAssets.value || []).slice(0, 3)
  },
  {
    id: 'upcoming',
    title: 'Coming Soon',
    route: { path: '/assets' },
    items: (upcomingAssets.value || []).slice(0, 3)
  }
])
</script>
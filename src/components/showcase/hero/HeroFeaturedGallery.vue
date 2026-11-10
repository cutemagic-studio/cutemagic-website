<!-- src/components/showcase/hero/HeroFeaturedGallery.vue -->
<template>
  <div 
    class="relative w-full max-w-2xl mx-auto select-none group/hero"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- Ánh sáng Hào quang (Ambient Glow) phía sau Khung A -->
    <div class="absolute -inset-3 bg-gradient-to-tr from-blue-600/30 via-[#8470FF]/25 to-[#00EE76]/20 rounded-3xl blur-2xl opacity-80 group-hover/hero:opacity-100 transition-opacity pointer-events-none"></div>

    <!-- ================================================================= -->
    <!-- NÚT CHUYỂN TRÁI (❮) & PHẢI (❯) NẰM Ở 2 BÊN CẠNH KHUNG A           -->
    <!-- ================================================================= -->
    <button
      v-if="featuredPacks.length > 1"
      type="button"
      @click="prevPack"
      class="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#161a23]/95 hover:bg-[#ffe600] text-white hover:text-black border-2 border-slate-700 hover:border-black shadow-2xl flex items-center justify-center text-lg font-black transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
      title="Xem Pack nổi bật trước đó"
    >
      ❮
    </button>

    <button
      v-if="featuredPacks.length > 1"
      type="button"
      @click="nextPack"
      class="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#161a23]/95 hover:bg-[#ffe600] text-white hover:text-black border-2 border-slate-700 hover:border-black shadow-2xl flex items-center justify-center text-lg font-black transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
      title="Xem Pack nổi bật tiếp theo"
    >
      ❯
    </button>

    <!-- ================================================================= -->
    <!-- KHUNG CỬA SỔ TRÌNH DUYỆT (VỊ TRÍ A - NGHIÊNG NHẸ & PHẲNG KHI HOVER)-->
    <!-- ================================================================= -->
    <div 
      class="relative bg-[#131722] border-2 border-slate-700/90 group-hover/hero:border-[#8470FF] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-500 lg:-rotate-2 lg:group-hover/hero:rotate-0"
    >
      <!-- 1. Thanh Tiêu Đề Cửa Sổ (macOS Traffic Lights + Thanh URL Động + Bộ đếm Slide) -->
      <div class="px-4 py-3 bg-[#1a1f2e] border-b border-slate-800 flex items-center justify-between gap-3">
        <!-- 3 Chấm Đỏ - Vàng - Xanh -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
        </div>

        <!-- Thanh Địa chỉ Động hiển thị Slug & ID 6 chữ số của Pack đang chiếu -->
        <div 
          @click="goToPackDetail(currentPack)"
          class="flex-1 max-w-md bg-[#0f131d] border border-slate-800 hover:border-blue-500/50 rounded-full px-3.5 py-1 flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 cursor-pointer transition-colors truncate"
        >
          <div class="flex items-center gap-1.5 truncate">
            <span class="w-2 h-2 rounded-full bg-[#00EE76]"></span>
            <span class="text-slate-500">cutemagic.store/</span>
            <span class="text-[#ffe600] font-bold truncate">{{ currentPack?.slug || 'featured-pack' }}</span>
          </div>
          <span v-if="currentPack?.id" class="text-[10px] text-blue-400 font-black shrink-0">
            #{{ currentPack.id }}
          </span>
        </div>

        <!-- Bộ đếm vị trí Pack (VD: 01 / 05) -->
        <div class="px-2.5 py-0.5 rounded-lg bg-slate-800 text-[11px] font-mono font-black text-white shrink-0">
          {{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(featuredPacks.length).padStart(2, '0') }}
        </div>
      </div>

      <!-- Thanh tiến trình tự động chuyển Slide (Auto-play bar) -->
      <div class="w-full h-1 bg-slate-900 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-[#ffe600] transition-all duration-100"
          :style="{ width: `${autoPlayProgress}%` }"
        ></div>
      </div>

      <!-- 2. VÙNG TRƯNG BÀY HÌNH ẢNH & THÔNG TIN PACK NỔI BẬT -->
      <div v-if="currentPack" class="relative h-[360px] sm:h-[410px] bg-slate-950 overflow-hidden">
        
        <!-- Ảnh chính (Cover hoặc ảnh được chọn từ mini-gallery) -->
        <transition name="slide-fade" mode="out-in">
          <img
            :key="activePreviewImage"
            :src="activePreviewImage"
            :alt="currentPack.title"
            @click="goToPackDetail(currentPack)"
            class="w-full h-full object-cover object-center transition-transform duration-700 group-hover/hero:scale-105 cursor-pointer"
          />
        </transition>

        <!-- Lớp phủ Gradient tối dần về phía đáy để chữ luôn sắc nét -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/45 to-transparent pointer-events-none"></div>

        <!-- CỤM HUY HIỆU GÓC TRÊN TRÁI (FEATURED / EXCLUSIVE / LAUNCH) -->
        <div class="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
          <span class="px-2.5 py-1 rounded-xl bg-[#ffe600] text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
            ⭐ Featured Flagship
          </span>
          <span 
            v-if="currentPack.flags?.isExclusive"
            class="px-2.5 py-1 rounded-xl bg-purple-600/95 text-white text-[10px] font-black uppercase tracking-wider shadow-lg"
          >
            💎 Exclusive
          </span>
          <span 
            v-if="currentPack.flags?.isLaunchEdition"
            class="px-2.5 py-1 rounded-xl bg-blue-600/95 text-white text-[10px] font-black uppercase tracking-wider shadow-lg"
          >
            🚀 Launch Edition
          </span>
        </div>

        <!-- HUY HIỆU TỔNG SỐ 3D MODELS GÓC TRÊN PHẢI -->
        <div class="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
          <span class="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[#00EE76] text-xs font-black shadow-lg">
            📦 {{ currentPack.techSpecs?.modelCount || currentPack.modelCount || 0 }} Models
          </span>
        </div>

        <!-- Dải ảnh thu nhỏ (Mini Gallery Thumbnails) bên phải cho phép đổi góc nhìn ngay tại Khung A -->
        <div 
          v-if="packGalleryList.length > 1"
          class="absolute right-3.5 top-16 flex flex-col gap-2 z-20"
        >
          <button
            v-for="(imgUrl, gIdx) in packGalleryList.slice(0, 4)"
            :key="gIdx"
            type="button"
            @click.stop="selectedSubImageIdx = gIdx"
            class="w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-md"
            :class="selectedSubImageIdx === gIdx ? 'border-[#ffe600] scale-105 ring-2 ring-[#ffe600]/40' : 'border-white/30 opacity-70 hover:opacity-100'"
          >
            <img :src="imgUrl" class="w-full h-full object-cover" />
          </button>
        </div>

        <!-- =============================================================== -->
        <!-- THẺ THÔNG TIN CHI TIẾT PACK NẰM Ở ĐÁY KHUNG A                   -->
        <!-- =============================================================== -->
        <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-20">
          <div class="bg-[#141824]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl">
            
            <!-- Hàng 1: Danh mục + Thông số kỹ thuật + Tương tác -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                  {{ currentPack.categoryId }}
                </span>
                <span class="text-[11px] font-bold text-slate-400">
                  {{ currentPack.techSpecs?.polycount || 'Low Poly' }} • {{ currentPack.techSpecs?.renderPipeline || 'URP / Blender 5' }}
                </span>
              </div>

              <!-- Chỉ số Like & Download thực tế từ Firebase -->
              <div class="flex items-center gap-2.5 text-xs font-black">
                <button 
                  type="button"
                  @click.stop="assetStore.toggleFavorite(currentPack.id)"
                  class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  :class="assetStore.isFavorite(currentPack.id) ? 'text-[#ff005b]' : 'text-slate-300'"
                >
                  <span>❤️</span>
                  <span>{{ currentPack.metrics?.likes || 0 }}</span>
                </button>
                <span class="text-emerald-400 flex items-center gap-1">
                  ⬇️ {{ currentPack.metrics?.downloads || 0 }}
                </span>
              </div>
            </div>

            <!-- Hàng 2: Tên Pack & Mô tả ngắn -->
            <h3 
              @click="goToPackDetail(currentPack)"
              class="text-lg sm:text-xl font-black text-white hover:text-[#ffe600] transition-colors truncate cursor-pointer"
            >
              {{ currentPack.title }}
            </h3>
            <p class="text-xs text-slate-300 line-clamp-1 mt-0.5 font-medium">
              {{ currentPack.content?.shortDescription || 'Bộ tài nguyên 3D Low-poly Stylized tối ưu hóa sẵn sàng cho Unity & Blender.' }}
            </p>

            <!-- Hàng 3: Giá bán / Khuyến mãi & Nút mở trang Chi tiết -->
            <div class="mt-3.5 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-3">
              <!-- Khối Giá -->
              <div class="flex items-center gap-2">
                <span 
                  v-if="currentPack.isFree" 
                  class="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase"
                >
                  🎁 FREE DOWNLOAD
                </span>
                <template v-else>
                  <span class="text-xl font-black text-[#00EE76]">
                    ${{ Number(currentPack.pricing?.price || 0).toFixed(2) }}
                  </span>
                  <span 
                    v-if="currentPack.pricing?.originalPrice" 
                    class="text-xs text-slate-400 line-through font-bold"
                  >
                    ${{ currentPack.pricing.originalPrice }}
                  </span>
                  <span 
                    v-if="currentPack.pricing?.discount" 
                    class="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black"
                  >
                    -{{ currentPack.pricing.discount }}%
                  </span>
                </template>
              </div>

              <!-- Nút hành động chính -->
              <button
                type="button"
                @click="goToPackDetail(currentPack)"
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-[#ffe600] text-white hover:text-black text-xs font-black transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Khám phá Pack</span>
                <span>→</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      <!-- 3. Thanh Chấm Tròn Chuyển Nhanh Các Pack Nổi Bật Ở Đáy Cửa Sổ -->
      <div class="px-4 py-2.5 bg-[#161b28] border-t border-slate-800 flex items-center justify-between">
        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
          🌟 Featured Showcase ({{ featuredPacks.length }} Packs)
        </span>

        <div class="flex items-center gap-1.5">
          <button
            v-for="(pack, idx) in featuredPacks"
            :key="pack.id"
            type="button"
            @click="selectPackIndex(idx)"
            class="h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="currentIndex === idx ? 'w-7 bg-[#ffe600]' : 'w-2 bg-slate-600 hover:bg-slate-400'"
            :title="pack.title"
          ></button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetStore } from '../../../stores/useAssetStore'

const router = useRouter()
const assetStore = useAssetStore()

const currentIndex = ref(0)
const selectedSubImageIdx = ref(0)
const autoPlayProgress = ref(0)
const isPaused = ref(false)

// Lấy danh sách các Pack có bật cờ ⭐ isFeatured trên Firebase (Nếu chưa bật cái nào thì lấy 5 Pack mới nhất)
// const featuredPacks = computed(() => {
//   const list = (assetStore.assets || []).filter(a => a.flags?.isFeatured && !a.isDeleted)
//   if (list.length > 0) return list.slice(0, 8)
//   return (assetStore.newAssets || []).slice(0, 5)
// })
const featuredPacks = computed(() => assetStore.heroFeaturedAssets || [])

const currentPack = computed(() => {
  if (!featuredPacks.value.length) return null
  const safeIdx = currentIndex.value % featuredPacks.value.length
  return featuredPacks.value[safeIdx]
})

// Gom ảnh Cover và Gallery của Pack hiện tại để người dùng có thể bấm xem thử các góc ảnh ngay tại Hero
const packGalleryList = computed(() => {
  if (!currentPack.value) return []
  const cover = currentPack.value.media?.cover
  const gallery = Array.isArray(currentPack.value.media?.gallery) ? currentPack.value.media.gallery : []
  return Array.from(new Set([cover, ...gallery].filter(Boolean)))
})

const activePreviewImage = computed(() => {
  return packGalleryList.value[selectedSubImageIdx.value] || currentPack.value?.media?.cover || ''
})

// Reset về ảnh bìa đầu tiên mỗi khi chuyển sang Pack khác
watch(currentIndex, () => {
  selectedSubImageIdx.value = 0
  autoPlayProgress.value = 0
})

const nextPack = () => {
  if (featuredPacks.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % featuredPacks.value.length
}

const prevPack = () => {
  if (featuredPacks.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + featuredPacks.value.length) % featuredPacks.value.length
}

const selectPackIndex = (idx) => {
  currentIndex.value = idx
}

const goToPackDetail = (pack) => {
  if (!pack?.id) return
  router.push({ name: 'AssetDetailView', params: { id: pack.id } })
}

// Bộ đếm tự động chuyển Pack sau mỗi 6 giây (Tạm dừng khi người dùng rê chuột vào Khung A)
let timer = null
const startAutoPlay = () => {
  clearInterval(timer)
  timer = setInterval(() => {
    if (isPaused.value || featuredPacks.value.length <= 1) return
    autoPlayProgress.value += 2
    if (autoPlayProgress.value >= 100) {
      autoPlayProgress.value = 0
      nextPack()
    }
  }, 120) // 120ms * 50 bước = 6 giây
}

const pauseAutoPlay = () => { isPaused.value = true }
const resumeAutoPlay = () => { isPaused.value = false }

onMounted(() => {
  assetStore.initFirebaseAssetsSync()
  startAutoPlay()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.03);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
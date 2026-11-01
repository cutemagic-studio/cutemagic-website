<template>
  <div class="min-h-screen bg-white">
    <nav class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
      <button @click="$router.back()" class="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-widest">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại bộ sưu tập
      </button>
    </nav>

    <main class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
      
      <div class="lg:col-span-7 space-y-8">
        <div class="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-100 border border-slate-100 group">
          <img :src="asset.img" class="w-full aspect-[16/10] object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-yellow-400 text-slate-900 py-3 text-center font-black uppercase text-xs tracking-[0.2em]">
            Low Poly 3D Asset Pack
          </div>
        </div>

        <div class="prose prose-slate max-w-none">
          <h2 class="text-2xl font-black text-slate-800 mb-4">Chi tiết bộ tài nguyên</h2>
          <p class="text-slate-500 font-medium leading-relaxed text-lg italic">
            "{{ asset.description }}"
          </p>
          <div class="grid grid-cols-2 gap-4 mt-8">
             <div v-for="f in asset.features" :key="f" class="flex items-center gap-2 text-sm font-bold text-slate-600">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                {{ f }}
             </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="sticky top-10 space-y-6">
          <div class="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
            <BaseBadge :label="asset.tag" :type="asset.tagType" class="mb-6 inline-block" />
            
            <h1 class="text-4xl font-black leading-tight mb-2 tracking-tighter">{{ asset.title }}</h1>
            <p class="text-blue-400 font-black text-sm uppercase tracking-[0.3em] mb-10">{{ asset.category }}</p>

            <div class="space-y-4 mb-10">
              <div class="flex justify-between items-center py-4 border-b border-white/5">
                <span class="text-slate-500 text-[10px] font-black uppercase">Phiên bản Unity</span>
                <span class="text-sm font-bold">2022.3+ (LTS)</span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-white/5">
                <span class="text-slate-500 text-[10px] font-black uppercase">Định dạng file</span>
                <span class="text-sm font-bold">.unitypackage / .fbx</span>
              </div>
            </div>

            <a :href="asset.storeUrl" target="_blank" 
               class="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-sm transition-all shadow-xl shadow-blue-900/40 active:scale-95">
              <span>Xem trên Asset Store</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l7-7m-7 7H3" />
              </svg>
            </a>
            
            <p class="text-center text-[9px] text-slate-500 font-bold uppercase mt-6 tracking-widest leading-relaxed">
              Tương thích hoàn toàn với URP & HDRP
            </p>
          </div>

          <div class="bg-blue-50 rounded-[2rem] p-6 border border-blue-100 flex items-center gap-4">
             <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">?</div>
             <div>
                <p class="text-xs font-black text-blue-900 uppercase">Bạn có câu hỏi?</p>
                <p class="text-[10px] font-bold text-blue-600">Gửi đề xuất hoặc ý tưởng cho chúng tôi</p>
             </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const assetId = route.params.id // Lấy ID từ URL

// const asset = ref(null)
const loading = ref(true)

const qty = ref(1)

// Giả lập dữ liệu Asset (Trong thực tế sẽ fetch từ Firebase qua ID)
const asset = ref({
  title: 'Low Poly Sci-Fi Military Base',
  price: '49,99',
  shortDesc: 'Low Poly Sci-Fi Military Resource Base',
  longTitle: 'Create an expansive, explorable sci-fi military base and resource colony on an alien planet with this massive modular pack!',
  description: 'This pack includes hundreds of prefabs designed for easy drag-and-drop use and fully optimized for performance. With futuristic infrastructure, alien vegetation, and built-in logic for seamless connections, you can build your own living planet base fast and efficiently.',
  images: [
    'https://example.com/base-1.jpg',
    'https://example.com/base-2.jpg',
    'https://example.com/base-3.jpg'
  ],
  features: [
    'Hundreds of modular prefabs',
    'Custom alien flora and terrain textures',
    'Low polygon count for mobile optimization',
    'Built-in logic for door animations'
  ],
  optimized: [
    'Universal RP - Unity 2022.3+ (default)',
    'Standard RP - Unity 2022.3+',
    'High-Definition RP - Unity 2022.3+',
    'FBX files included'
  ]
})

const mainImage = ref(asset.value.images[0])

const related = ref([
  { id: 1, title: 'Low Poly Cartoon House Interiors', price: '9,99', image: 'https://example.com/house.jpg' },
  { id: 2, title: 'Low Poly Farm Pack Lite', price: '0,00', image: 'https://example.com/farm.jpg' },
  { id: 3, title: 'Low Poly Nature Pack vol.2', price: '9,99', image: 'https://example.com/nature.jpg' }
])

onMounted(async () => {
  // Trong thực tế, bạn sẽ fetch dữ liệu từ Firebase hoặc API tại đây
  // Ví dụ: const data = await getAssetById(assetId)
  
  // Giả lập tìm kiếm dữ liệu (Demo)
  console.log("Đang xem asset có ID:", assetId)
  
  // Ở đây bạn gán dữ liệu tìm được vào biến asset để hiển thị
  // asset.value = data
  loading.value = false
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
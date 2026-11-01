<template>
  <section class="py-24">

    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div v-for="col in collections" :key="col.title" class="space-y-6">
          
          <!-- KHỐI TIÊU ĐỀ CỘT -->
          <div class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between group cursor-pointer shadow-xl transition-colors relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <h3 class="text-white text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors relative z-10">
              {{ col.title }}
            </h3>
            <span class="font-bold text-white group-hover:translate-x-1 transition-transform relative z-10">❯</span>
          </div>

          <!-- DANH SÁCH ITEMS -->
          <div class="space-y-4">
            <div v-for="item in col.items" :key="item.name"
              class="group p-3 rounded-2xl bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:border-blue-500/40 transition-all duration-200 flex items-center gap-4 cursor-pointer">

              <!-- Ảnh sản phẩm -->
              <div class="w-20 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-[#1C1C1C] dark:border-slate-700 rounded-xl overflow-hidden shrink-0 shadow-inner">
                <img :src="item.image"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <!-- Nội dung sản phẩm -->
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <h4 class="font-black text-base truncate text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5 tracking-tight">
                  {{ item.name }}
                </h4>

                <div v-if="item.tag"
                  class="mb-2 inline-flex items-center w-max px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded uppercase tracking-wider">
                  👑 {{ item.tag }}
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                  <span v-if="item.discount" class="bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-black">
                    {{ item.discount }}
                  </span>
                  
                  <span v-if="item.oldPrice" class="text-xs font-medium text-slate-400 dark:text-slate-500 line-through">
                    {{ item.oldPrice }}
                  </span>
                  
                  <span v-if="item.price" class="text-sm font-black text-slate-900 dark:text-white">
                    {{ item.price }}
                  </span>
                  
                  <span v-if="item.date" class="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
                    Available {{ item.date }}
                  </span>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import bannerUrl from '../../assets/banner.webp'

const collections = [
  {
    title: 'New Releases',
    items: [
      { name: 'Pack name', price: '_ $', tag: 'Launch Edition', image: bannerUrl },
      { name: 'Pack name', price: '_ $', oldPrice: '100 $', discount: '-40%', image: bannerUrl },
      // ... thêm data
    ]
  },
  {
    title: 'Top Rated',
    items: [
      { name: 'Pack name', price: '_ $', image: bannerUrl },
      { name: 'Pack name', price: '_ $', discount: '-75%', image: bannerUrl },
    ]
  },
  {
    title: 'Coming Soon',
    items: [
      { name: 'Pack name', date: '20/05/26', image: bannerUrl },
      { name: 'Pack name', date: '10/05/26', image: bannerUrl },
    ]
  }
]
</script>
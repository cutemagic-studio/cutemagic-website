<template>
  <section class="py-24 bg-white text-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div v-for="col in collections" :key="col.title" class="space-y-6">
          <div class="h-10 flex items-center justify-between group cursor-pointer bg-[#1C1C1C]">
            <h3 class="ml-2 text-white text-xl font-black text-black tracking-tight group-hover:text-[#00BFFF] transition-colors">
              {{ col.title }}
            </h3>
            <span class="mr-2 font-bold text-white group-hover:translate-x-1 transition-transform">❯</span>
          </div>

          <div class="space-y-4">
            <div v-for="item in col.items" :key="item.name"
              class="bg-white/5 border border-slate-300 flex items-center gap-4 p-2 rounded-xl hover:bg-[#FFD700] transition-all cursor-pointer group">

              <div class="w-16 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0 shadow-lg">
                <img :src="item.image"
                  class="w-18 h-22 object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm truncate text-[#00BFFF] group-hover:text-[#1C1C1C] transition-colors">
                  {{ item.name }}
                </h4>

                <div v-if="item.tag"
                  class="mt-1 inline-block px-2 py-0.5 bg-slate-700 text-[10px] font-black rounded uppercase">
                  👑 {{ item.tag }}
                </div>

                <div class="mt-1 flex items-center gap-2">
                  <span v-if="item.discount" class="bg-blue-600 px-1.5 py-0.5 rounded text-[10px] font-black">
                    {{ item.discount }}
                  </span>
                  <span v-if="item.price" class="text-sm font-medium text-[#1C1C1C]">
                    {{ item.price }}
                  </span>
                  <span v-if="item.date" class="text-xs text-slate-500 italic">
                    Có sẵn vào {{ item.date }}
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

let defaultImageSource = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400";

const collections = [
  {
    title: 'Mới phát hành',
    items: [
      { name: 'Spin Park', price: '52.000 đ', tag: 'Chạy lần đầu', image: defaultImageSource },
      { name: 'Synthwave Burnout', price: '18.600 đ', oldPrice: '31.000 đ', discount: '-40%', image: defaultImageSource },
      // ... thêm data
    ]
  },
  {
    title: 'Đánh giá cao nhất',
    items: [
      { name: 'Jurassic World Evolution 3', price: '980.000 đ', image: defaultImageSource },
      { name: 'Fallout 2', price: '56.250 đ', discount: '-75%', image: defaultImageSource },
    ]
  },
  {
    title: 'Sắp ra mắt',
    items: [
      { name: 'Fortune Seller', date: '06/04/26', image: defaultImageSource },
      { name: 'Legends of Elumia', date: '08/04/26', image: defaultImageSource },
    ]
  }
]
</script>
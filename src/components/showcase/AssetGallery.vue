<template>
    <section id="gallery" class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">

                <div
                    class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        Bộ sưu tập Asset
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-6"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                        Khám phá thư viện tài nguyên đa dạng, được thiết kế tỉ mỉ cho mọi nhu cầu
                        dự án của bạn.
                    </p>
                </div>
                <!-- 
                <div class="bg-slate-900 rounded-[2rem] p-8 md:p-14 text-white shadow-xl">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        Bộ sưu tập Asset
                    </h3>
                    <div class="h-1.5 w-12 bg-blue-500 mb-8"></div>
                    <p class="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                        Khám phá thư viện tài nguyên đa dạng, được thiết kế tỉ mỉ cho mọi nhu cầu
                        dự án của bạn.
                    </p> -->
                <!-- </div> -->

                <!-- <div class="max-w-xl bg-blue-500">
                    <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Bộ sưu tập Asset</h2>
                    <p class="text-gray-600">Khám phá thư viện tài nguyên đa dạng, được thiết kế tỉ mỉ cho mọi nhu cầu
                        dự án của bạn.</p>
                </div> -->

                <div class="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'
                    ]">
                        {{ cat }}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="asset in assets" :key="asset.id"
                    class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                    <div class="aspect-[4/3] overflow-hidden">
                        <img :src="asset.img" :alt="asset.title"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>

                    <div class="absolute top-4 left-4 z-10">
                        <BaseBadge :label="asset.tag" :type="asset.tagType" />
                    </div>

                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span class="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">{{ asset.category
                            }}</span>
                        <h3 class="text-white text-xl font-bold">{{ asset.title }}</h3>
                        <button
                            class="mt-4 w-full py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseBadge from '../base/BaseBadge.vue' // Import Badge component

const selectedCategory = ref('All')
const categories = ['All', 'UI Kit', '3D Model', 'Templates']

const assets = [
    {
        id: 1,
        title: 'Modern Dashboard',
        category: 'UI Kit',
        tag: 'New Release',
        tagType: 'new',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 2,
        title: 'Abstract 3D Shape',
        category: '3D Model',
        tag: 'Free',
        tagType: 'free',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 3,
        title: 'Landing Page v1',
        category: 'Templates',
        tag: 'Hot',
        tagType: 'hot',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 4,
        title: 'Mobile App Mockup',
        category: 'UI Kit',
        tag: 'Pro',
        tagType: 'pro',
        img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 5,
        title: 'Character Rig',
        category: '3D Model',
        img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 6,
        title: 'E-commerce Theme',
        category: 'Templates',
        img: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=400'
    },
]
</script>
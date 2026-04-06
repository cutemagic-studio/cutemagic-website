<template>
    <section id="gallery" class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">

                <div
                    class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl">
                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        AssetGallery
                    </h3>
                    <div class="h-1 w-12 bg-blue-500 mb-6"></div>
                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                        A professional asset library, built for every project and every developer.
                    </p>
                </div>

                <!-- <div class="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'
                    ]">
                        {{ cat }}
                    </button>
                </div> -->
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="asset in assets" :key="asset.id"
                    class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-gray-500">
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
                        <!-- <button @click="goToDetail(asset.id)" -->
                        <button
                            class="mt-4 w-full py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // Import router
import BaseBadge from '../base/BaseBadge.vue'

import city01_Url from '../../assets/asset_gallery/city_1.png'
import city02_Url from '../../assets/asset_gallery/city_2.png'
import farm01_Url from '../../assets/asset_gallery/farm_1.png'
import house01_Url from '../../assets/asset_gallery/house_1.png'
import nature01_Url from '../../assets/asset_gallery/nature_1.png'
import park01_Url from '../../assets/asset_gallery/park_1.png'
import park02_Url from '../../assets/asset_gallery/park_2.png'
import prop01_Url from '../../assets/asset_gallery/prop_1.png'
import township01_Url from '../../assets/asset_gallery/township_1.png'
import tree01_Url from '../../assets/asset_gallery/tree_1.png'

const router = useRouter() // Khởi tạo router
const selectedCategory = ref('All')
const categories = ['All', 'UI Kit', '3D Model', 'Templates']

const assets = [
    {
        id: 1,
        title: 'City',
        category: '3D Model',
        tag: 'New Release',
        tagType: 'new',
        img: city01_Url
    },
    {
        id: 2,
        title: 'Farm',
        category: '3D Model',
        tag: 'Free',
        tagType: 'free',
        img: farm01_Url
    },
    {
        id: 3,
        title: 'Nature',
        category: '3D Model',
        tag: 'Hot',
        tagType: 'hot',
        img: nature01_Url
    },
    {
        id: 4,
        title: 'Park',
        category: '3D Model',
        tag: 'Pro',
        tagType: 'pro',
        img: park01_Url
    },
    {
        id: 5,
        title: 'Township',
        category: '3D Model',
        tag: 'Coming soon',
        tagType: 'coming_soon',
        img: township01_Url
    },
    {
        id: 6,
        title: 'Tree',
        category: '3D Model',
        tag: 'Coming soon',
        tagType: 'coming_soon',
        img: tree01_Url
    },
]

// Logic lọc sản phẩm theo category
const filteredAssets = computed(() => {
  if (selectedCategory.value === 'All') return assets
  return assets.filter(a => a.category === selectedCategory.value)
})

// Hàm chuyển hướng sang trang chi tiết
const goToDetail = (id) => {
  router.push({ name: 'AssetDetail', params: { id: id } })
}
</script>
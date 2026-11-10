<!-- src/views/HomeView.vue -->
<template>
    <div class="min-h-screen font-sans antialiased flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
        
        <TheHeader />

        <main class="flex-grow">
            <!-- <div id="HeroSection"><HeroSection /></div>
            <div id="RecentlyViewedSection"><RecentlyViewedSection /></div>
            <div id="WhyChooseUsSection"><WhyChooseUsSection /></div>
            <div id="AssetLibrarySection"><AssetLibrarySection /></div>
            <div id="AssetSpecSection"><AssetSpecSection /></div>
            <div id="ProductionRoadmapSection"><ProductionRoadmapSection /></div>
            <div id="QuickListSection"><QuickListSection /></div>
            <div id="TestimonialSection"><TestimonialSection /></div>
            <div id="FaqAccordionSection"><FaqAccordionSection /></div>
            <div id="FavoriteAssetsSection"><FavoriteAssetsSection /></div>
            <div id="ContactSection"><ContactSection /></div> -->

            <div><HeroSection /></div>
            <div><RecentlyViewedSection /></div>
            <div><WhyChooseUsSection /></div>
            <div><AssetLibrarySection /></div>
            <div><AssetSpecSection /></div>
            <div><ProductionRoadmapSection /></div>
            <div><QuickListSection /></div>
            <div><TestimonialSection /></div>
            <div><FaqAccordionSection /></div>
            <div><FavoriteAssetsSection /></div>
            <div><ContactSection /></div>
        </main>

        <TheFooter />

        <!-- Thanh Gallery Điều Hướng Section Cố Định Dưới Đáy Màn Hình -->
        <BottomSectionDock />

    </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { saveHomeScrollPosition, restoreHomeScrollPosition } from '../utils/scrollMemory'

import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
import BottomSectionDock from '../components/layout/BottomSectionDock.vue'

import HeroSection from '../components/showcase/HeroSection.vue'
import WhyChooseUsSection from '../components/showcase/WhyChooseUsSection.vue'
import AssetLibrarySection from '../components/showcase/asset_gallery/AssetLibrarySection.vue'
import AssetSpecSection from '../components/showcase/asset_spec/AssetSpecSection.vue'
import ProductionRoadmapSection from '../components/showcase/asset_road_map/ProductionRoadmapSection.vue'
import QuickListSection from '../components/showcase/asset_quick_list/QuickListSection.vue'
import FaqAccordionSection from '../components/showcase/FaqAccordionSection.vue'
import TestimonialSection from '../components/showcase/TestimonialSection.vue'
import ContactSection from '../components/showcase/ContactSection.vue'
import RecentlyViewedSection from '../components/showcase/asset_recently_viewed/RecentlyViewedSection.vue'
import FavoriteAssetsSection from '../components/showcase/favourite_asset/FavoriteAssetsSection.vue'

// 1. Trước khi rời HomeView (ví dụ bấm vào 1 Asset Card để sang trang Chi tiết):
// Lưu chính xác khoảng cách tương đối từ mắt người dùng tới đỉnh của Section hiện tại (VD: AssetLibrarySection)
onBeforeRouteLeave((to, _from, next) => {
    const clickedId = to.params?.id || null
    saveHomeScrollPosition(clickedId)
    next()
})

// 2. Khi quay trở lại HomeView: Khôi phục ngay về đúng vị trí trong Section đó
onMounted(async () => {
    console.log('onMounted')
    await nextTick()
    restoreHomeScrollPosition()
})
</script>
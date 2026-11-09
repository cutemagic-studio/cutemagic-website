<template>
    
    <div class="min-h-screen font-sans antialiased flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
        
        <TheHeader />

        <main class="flex-grow">
            <HeroSection/>
            <RecentlyViewedSection/>
            <WhyChooseUsSection/>
            <AssetLibrarySection/>
            <AssetSpecSection/>
            <ProductionRoadmapSection/>
            <QuickListSection/>
            <TestimonialSection />
            <FaqAccordionSection />

            <FavoriteAssetsSection />
            <ContactSection />
        </main>

        <TheFooter />
        <!-- <TrafficTracker /> --> 

    </div>
</template>

<script setup>
// --- TRANG LANDING PAGE COMPONENTS ---
import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
import HeroSection from '../components/showcase/HeroSection.vue'
import WhyChooseUsSection from '../components/showcase/WhyChooseUsSection.vue'
import AssetLibrarySection from '../components/showcase/asset_gallery/AssetLibrarySection.vue'
import AssetSpecSection from '../components/showcase/asset_spec/AssetSpecSection.vue'
import ProductionRoadmapSection from '../components/showcase/asset_road_map/ProductionRoadmapSection.vue'

import QuickListSection from '../components/showcase/asset_quick_list/QuickListSection.vue'
import FaqAccordionSection from '../components/showcase/FaqAccordionSection.vue'
import TestimonialSection from '../components/showcase/TestimonialSection.vue'
import ContactSection from '../components/showcase/ContactSection.vue'
import TrafficTracker from '../components/utils/TrafficTracker.vue'

import RecentlyViewedSection from '../components/showcase/asset_recently_viewed/RecentlyViewedSection.vue'
import FavoriteAssetsSection from '../components/showcase/favourite_asset/FavoriteAssetsSection.vue'

</script>
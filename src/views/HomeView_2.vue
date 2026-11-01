<template>
    
    <div class="min-h-screen font-sans antialiased flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
        
        <TheHeader />

        <main class="flex-grow">
            <HeroSection id="hero-section" />
            <WhyChooseUs id="why-choose-us" />
            <AssetGallery id="gallery" />
            <AssetSpecs id="specs" />
            <ProductionRoadmap id="roadmap" />
            <AssetVote />
            <QuickList />
            <Testimonials />
            <FaqAccordion />
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
import WhyChooseUs from '../components/showcase/WhyChooseUs.vue'
import AssetGallery from '../components/showcase/asset_gallery/AssetGallery.vue'
import AssetSpecs from '../components/showcase/asset_spec/AssetSpecs.vue'
import ProductionRoadmap from '../components/showcase/ProductionRoadmap.vue'
import AssetVote from '../components/showcase/asset_vote/AssetVote.vue'
import QuickList from '../components/showcase/QuickList.vue'
import FaqAccordion from '../components/showcase/FaqAccordion.vue'
import Testimonials from '../components/showcase/Testimonials.vue'
import ContactSection from '../components/showcase/ContactSection.vue'
import TrafficTracker from '../components/utils/TrafficTracker.vue'
</script>
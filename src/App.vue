<!-- <template>
  <Header />

  <main>
    <router-view />
  </main>

  <Footer />
</template> -->

<template>
  <div class="min-h-screen flex flex-col font-sans antialiased text-gray-900">
    <TheHeader />

    <main class="flex-grow">
      <HeroSection />

      <!-- <FeatureGrid id="features" /> -->
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

    <TrafficTracker />
  </div>
</template>

<script setup>
// import Header from './components/Header.vue'
// import Footer from './components/Footer.vue'

// 1. Import các thành phần Layout
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'

// 2. Import các thành phần Showcase
import HeroSection from './components/showcase/HeroSection.vue'
import WhyChooseUs from './components/showcase/WhyChooseUs.vue'
import FeatureGrid from './components/showcase/FeatureGrid.vue'
import AssetGallery from './components/showcase/AssetGallery.vue'

import AssetSpecs from './components/showcase/AssetSpecs.vue'

import ProductionRoadmap from './components/showcase/ProductionRoadmap.vue'
import AssetVote from './components/showcase/AssetVote.vue'

import QuickList from './components/showcase/QuickList.vue'

import FaqAccordion from './components/showcase/FaqAccordion.vue'
import Testimonials from './components/showcase/Testimonials.vue'
import ContactSection from './components/showcase/ContactSection.vue'

// Import component tracker
import TrafficTracker from './components/utils/TrafficTracker.vue'

</script>

<style></style>
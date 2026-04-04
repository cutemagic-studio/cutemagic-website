<template>
  <Header />

  <main class="container">
    <router-view />
  </main>

  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
.container {
  padding: 20px;
}
</style>
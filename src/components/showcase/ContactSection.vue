

<template>
  <section class="py-20 px-6">
    <div class="max-w-5xl mx-auto bg-white rounded-[2rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <h2 class="text-[#1C1C1C] text-3xl lg:text-5xl font-black mb-6">Ready to Elevate Your Project?</h2>
        <p class="text-[#3C3C3C] text-lg mb-10 max-w-2xl mx-auto">
          Join 2,000+ developers using our assets to accelerate their creative workflow.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button class="w-80 px-8 py-4 bg-white text-[#3C3C3C] border border-[#3C3C3C] font-bold rounded-xl hover:text-[#1C1C1C] hover:bg-[#00BFFF] transition-colors shadow-lg"
            @click="window.open('LINK_STORE_CUA_BAN', '_blank')"
          >
            Browse Global Store
          </button>
          <button class="w-80 px-8 py-4 bg-white text-[#3C3C3C] border border-[#3C3C3C] font-bold rounded-xl hover:text-[#1C1C1C] hover:bg-[#FFD700] transition-colors shadow-lg">
            Join Official Discord
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseButton from '../base/BaseButton.vue'
</script>
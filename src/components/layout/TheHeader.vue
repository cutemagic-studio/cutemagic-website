<template>
    <header :class="[
        'fixed top-0 w-full z-50 transition-all duration-500 px-6',
        isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-6'
    ]">
        <div class="max-w-7xl mx-auto flex justify-between items-center">

            <div class="flex items-center gap-2 group cursor-pointer">
                <div
                    class="w-12 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                    CMC
                </div>
                <div
                    class="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                    Cute<span class="text-gray-900">Magic</span>
                </div>
            </div>

            <nav class="hidden md:flex space-x-10 font-bold">
                <a href="#why-choose-us" :class="[isScrolled ? 'text-gray-700' : 'text-gray-800']"
                    class="hover:text-blue-600 transition relative group text-sm">
                    Why choose us
                    <span
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>

                <a href="#gallery" :class="[isScrolled ? 'text-gray-700' : 'text-gray-800']"
                    class="hover:text-blue-600 transition relative group text-sm">
                    Asset Library
                    <span
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>

                <a href="#specs" :class="[isScrolled ? 'text-gray-700' : 'text-gray-800']"
                    class="hover:text-blue-600 transition relative group text-sm">
                    Technical Specs
                    <span
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>

                <a href="#roadmap" :class="[isScrolled ? 'text-gray-700' : 'text-gray-800']"
                    class="hover:text-blue-600 transition relative group text-sm">
                    Production Roadmap
                    <span
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
            </nav>

            <div class="flex items-center gap-4">
                <button @click="goToStore"
                    class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95">
                    Explore Store
                </button>

                <router-link to="/cutemagic-admin"
                    class="inline-block mt-4 text-[10px] text-slate-200 hover:text-blue-400 transition-colors">
                    Admin
                </router-link>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

// Logic xử lý đổi trạng thái khi cuộn chuột
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// Hàm tiện ích để mở link Store
const goToStore = () => {
    window.open('LINK_STORE_CUA_BAN', '_blank')
}
</script>

<style scoped>
/* Hiệu ứng mượt mà khi đổi màu chữ và padding */
header {
    will-change: transform, background-color, padding;
}

/* Đảm bảo text tương phản tốt trên nền ảnh Hero */
a {
    text-rendering: optimizeLegibility;
}
</style>
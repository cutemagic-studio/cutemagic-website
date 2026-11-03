<template>
    <!-- Thay thẻ <a> bằng <router-link> và trỏ về trang chủ "/" -->
    <router-link to="/" class="block outline-none" title="Về trang chủ">
        <div class="flex items-center gap-2 group cursor-pointer">

            <!-- Logo Icon (Đã chỉnh kích thước lên w-11 h-11 đúng như ghi chú) -->
            <div class="w-10 h-10 overflow-hidden bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-md border-2 border-[#1C1C1C] dark:border-white/10 rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-300">
                <img :src="logoUrl" alt="CuteMagic Logo"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>

            <!-- Tên thương hiệu -->
            <div class="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tighter">
                Cute<span class="text-gray-900 dark:text-white transition-colors">Magic</span>
            </div>
            
        </div>
    </router-link>
</template>

<script setup>
// Bạn cập nhật lại đường dẫn import logo này cho đúng với cấu trúc thư mục thực tế nhé
import logoUrl from '../../assets/logo.png' 
</script>
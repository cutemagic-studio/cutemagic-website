<template>
    <button @click="toggleTheme" 
        class="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm group">
        
        <!-- Icon Mặt trời (hiện khi đang ở Dark Mode) -->
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM6.166 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.06 1.06l1.59 1.591zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.06-1.06l-1.59-1.591z" />
        </svg>
        
        <!-- Icon Mặt trăng (hiện khi đang ở Light Mode) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    </button>
</template>

<script setup>
// Cập nhật lại đường dẫn tới composable useTheme của bạn cho chính xác
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
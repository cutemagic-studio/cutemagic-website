import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // 👈 THIẾU DÒNG NÀY

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // 👈 thêm dòng này
  ],
  base: '/cutemagic-website/', // 👈 tên repo của bạn
  build: {
    outDir: 'docs'
  },
})

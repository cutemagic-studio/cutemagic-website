<template>
  <section id="faq" class="py-24">

    <div class="max-w-7xl mx-auto px-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        <!-- Cột Tiêu đề bên trái (Sticky) -->
        <div class="md:sticky md:top-32 transition-all duration-500">
          <div class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-3xl p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden transition-colors">
            
            <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6 relative z-10">
              Frequently Asked Questions
            </h3>
            <div class="h-1.5 w-12 bg-blue-500 mb-8 relative z-10"></div>
            <p class="text-slate-300 text-sm lg:text-base font-medium leading-relaxed relative z-10">
              Need help? Our team is here to ensure you have the best experience with our assets.
            </p>
            
            <!-- Vầng sáng glow ở góc khối đen -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <!-- Cột Danh sách FAQ bên phải -->
        <div class="flex flex-col gap-5">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            
            :class="[
              'group rounded-3xl backdrop-blur-xl border-2 transition-all duration-300 shadow-lg dark:shadow-none hover:-translate-y-1',
              activeIndex === index 
                ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500' 
                : 'bg-white/70 dark:bg-[#161a23]/60 border-[#1C1C1C] dark:border-white/10 shadow-slate-200/50 hover:shadow-xl hover:border-blue-500 dark:hover:border-gray-500/50'
            ]"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full p-6 lg:p-8 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
            >
              <span :class="[
                'text-base lg:text-lg font-black transition-colors duration-300 tracking-tight',
                activeIndex === index ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
              ]">
                {{ faq.question }}
              </span>
              
              <!-- Nút mũi tên đóng/mở -->
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0',
                activeIndex === index 
                  ? 'bg-blue-600 border-blue-600 text-white rotate-180' 
                  : 'bg-slate-50 dark:bg-slate-800 border-[#1C1C1C] dark:border-slate-600 text-slate-500 dark:text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500'
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <!-- Nội dung câu trả lời -->
            <div 
              class="grid transition-all duration-500 ease-in-out"
              :class="activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <div class="px-6 lg:px-8 pb-8 text-slate-600 dark:text-slate-400 text-sm lg:text-base leading-relaxed border-t border-slate-200 dark:border-slate-700/50 pt-4">
                  {{ faq.answer }}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const faqs = [
  {
    question: 'Can I use these assets for commercial projects?',
    answer: 'Absolutely. Once purchased, you have a lifetime license for both personal and commercial use.'
  },
  {
    question: 'Can I use these assets for commercial projects?',
    answer: 'Absolutely. Once purchased, you have a lifetime license for both personal and commercial use.'
  },
  {
    question: 'Can I use these assets for commercial projects?',
    answer: 'Absolutely. Once purchased, you have a lifetime license for both personal and commercial use.'
  }
]

const activeIndex = ref(0)

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
h3 {
  letter-spacing: -0.04em;
}
/* Fix lỗi font-weight bị mỏng trên một số trình duyệt */
.font-black {
  -webkit-font-smoothing: antialiased;
}
</style>
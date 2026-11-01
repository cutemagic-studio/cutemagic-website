<template>
    <section class="py-24">

        <div class="max-w-7xl mx-auto px-6">
            
            <!-- Khối Tiêu đề -->
            <div class="bg-slate-900 dark:bg-[#161a23] border-2 border-transparent dark:border-slate-800 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-2xl transition-colors relative overflow-hidden mb-8 md:mb-12">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6 relative z-10">
                    What Developers Are Saying
                </h3>
                <div class="h-1 w-12 bg-blue-500 mb-6 relative z-10"></div>
                <p class="text-slate-300 text-sm lg:text-base font-medium leading-relaxed relative z-10">
                    Trusted by creators worldwide for seamless integration and top-tier optimization.
                </p>
            </div>

            <!-- Khối Review (Glassmorphism + Viền đậm) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div v-for="rev in reviews" :key="rev.name"
                    class="group p-8 rounded-3xl bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:border-amber-500/40 transition-all duration-200 flex flex-col">
                    
                    <div class="flex text-amber-400 dark:text-amber-500 mb-5 text-lg drop-shadow-sm">
                        <span v-for="i in rev.stars" :key="i">★</span>
                    </div>
                    
                    <!-- Dùng flex-1 để đẩy khối Avatar xuống đáy nếu text ngắn dài khác nhau -->
                    <p class="text-slate-600 dark:text-slate-400 italic mb-8 flex-1 leading-relaxed text-sm md:text-base">
                        "{{ rev.text }}"
                    </p>
                    
                    <div class="flex items-center gap-4">
                        <!-- Avatar được thêm viền đậm cho đồng bộ style -->
                        <div class="w-12 h-12 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border-2 border-[#1C1C1C] dark:border-slate-600 flex items-center justify-center font-black text-amber-600 dark:text-amber-400 shadow-inner shrink-0 group-hover:rotate-12 transition-transform">
                            {{ rev.name.charAt(0) }}
                        </div>
                        <div>
                            <h4 class="font-black text-slate-900 dark:text-white tracking-tight">{{ rev.name }}</h4>
                            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ rev.role }}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const reviews = [
    { name: 'Alex Rivera', role: 'Game Developer', text: "The low-poly models are incredibly well-optimized. My game's frame rate stayed rock-solid even on older mobile devices. Truly production-ready!", stars: 5 },
    { name: 'Sarah Chen', role: 'Technical Artist', text: "Well-organized naming conventions and clean folder structure. Makes asset management a breeze.", stars: 5 },
    { name: 'Marcus Todd', role: 'Indie Studio Owner', text: "Clean assets, production-ready, and easy to customize. Saved me dozens of hours on environment blocking.", stars: 5 }
]
</script>

<style scoped>
h3, h4 {
    letter-spacing: -0.04em;
}
</style>
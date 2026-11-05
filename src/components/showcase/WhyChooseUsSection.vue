<template>

    <section id="WhyChooseUsSection" class="py-12">

        <div class="max-w-7xl mx-auto px-6">

            <div class="dashed-boundary bg-transparent rounded-[2.5rem]">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">

                    <!-- Khối tiêu đề bên trái -->
                    <div
                        class="bg-slate-900 dark:bg-[#161a23] border border-transparent dark:border-slate-800 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-2xl transition-colors relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

                        <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6 relative z-10">
                            Why Choose CuteMagic?
                        </h3>
                        <div class="h-1 w-12 bg-blue-500 mb-6 relative z-10"></div>
                        <p class="text-slate-300 text-sm lg:text-base font-medium leading-relaxed relative z-10">
                            Stunning Low Poly. 100% Artist-Crafted. Best Rates. Production Ready.
                        </p>
                    </div>

                    <!-- Khối to bên phải (Stunning Low Poly) -->
                    <!-- [ĐÃ CẬP NHẬT] Hiệu ứng Glass, viền đen 2px (#1C1C1C) và Hover -->
                    <div
                        class="group p-10 lg:p-14 rounded-3xl bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-center">

                        <!-- [ĐÃ CẬP NHẬT] Icon nằm ngang với Tiêu đề -->
                        <div class="flex items-center gap-5 mb-5">
                            <div
                                class="shrink-0 w-14 h-14 bg-amber-100/80 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                                🧊
                            </div>
                            <h4
                                class="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                Stunning Low Poly
                            </h4>
                        </div>

                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
                            Beautifully crafted models optimized for any project.
                        </p>
                    </div>
                </div>

                <!-- 3 Khối nhỏ bên dưới -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="(item, index) in subReasons" :key="index"
                        class="group p-8 rounded-3xl bg-white/70 dark:bg-[#161a23]/60 backdrop-blur-xl border-2 border-[#1C1C1C] dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:border-gray-500/50 transition-all duration-200">

                        <!-- [ĐÃ CẬP NHẬT] Icon nằm ngang với Tiêu đề -->
                        <div class="flex items-center gap-4 mb-4">
                            <div
                                :class="[item.color, 'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg text-white group-hover:rotate-12 transition-transform']">
                                {{ item.icon }}
                            </div>
                            <h4
                                class="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {{ item.title }}
                            </h4>
                        </div>

                        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {{ item.desc }}
                        </p>
                    </div>
                </div>

            </div>

        </div>

    </section>
</template>

<script setup>
const subReasons = [
    {
        title: '100% Artist-Crafted. Zero AI.',
        desc: 'Hand-made by senior experts. No AI-generated content. Guaranteed.',
        icon: '🎨',
        color: 'bg-indigo-600'
    },
    {
        title: 'Best Price Guarantee',
        desc: 'Premium quality at the most competitive rates in the global market.',
        icon: '💎',
        color: 'bg-emerald-500'
    },
    {
        title: 'Production Ready',
        desc: 'Fully optimized for seamless integration into any game engine.',
        icon: '🚀',
        color: 'bg-blue-600'
    }
]
</script>

<style scoped>
/* Đồng bộ letter-spacing hẹp cho font chữ mạnh mẽ */
h3,
h4 {
    letter-spacing: -0.04em;
}
</style>
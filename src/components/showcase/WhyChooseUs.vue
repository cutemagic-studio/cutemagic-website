<template>

    <section id="why-us" class="py-24 bg-[fcfdfe]">

        <div class="max-w-7xl mx-auto px-6">



            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">



                <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl">

                    <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">

                        Tại sao chọn <br class="hidden lg:block" /> chúng tôi?

                    </h3>

                    <div class="h-1 w-12 bg-blue-500 mb-6"></div>

                    <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">

                        Giải pháp tối ưu giúp bạn hiện thực hóa ý tưởng Game nhanh gấp 3 lần với quy trình chuyên
                        nghiệp.

                    </p>

                </div>


                <div
                    class="group p-10 lg:p-14 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col justify-center">

                    <div
                        class="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">

                        ⚡

                    </div>

                    <h4 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Tối ưu hóa tuyệt đối</h4>

                    <p class="text-slate-500 leading-relaxed text-sm lg:text-base">

                        Mọi Asset đều đạt chuẩn 60 FPS, đảm bảo dự án vận hành mượt mà trên mọi nền tảng phần cứng từ
                        Mobile đến PC.

                    </p>

                </div>

            </div>


            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div v-for="(item, index) in subReasons" :key="index"
                    class="group p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">

                    <div
                        :class="[item.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg mb-8 text-white group-hover:rotate-12 transition-transform']">

                        {{ item.icon }}

                    </div>

                    <h4 class="text-xl font-black text-slate-900 mb-3 tracking-tight">{{ item.title }}</h4>

                    <p class="text-slate-500 text-sm leading-relaxed">

                        {{ item.desc }}

                    </p>

                </div>

            </div>


        </div>

    </section>

</template>


<script setup>

const subReasons = [

    {

        title: 'Hệ sinh thái đồng nhất',

        desc: 'Asset cùng tỉ lệ và bảng màu, giúp bạn mix-match hoàn hảo mọi bối cảnh.',

        icon: '🎨',

        color: 'bg-indigo-600'

    },

    {

        title: 'Cập nhật trọn đời',

        desc: 'Mua một lần, nhận mọi bản cập nhật mới mà không tốn thêm phí.',

        icon: '🔄',

        color: 'bg-emerald-500'

    },

    {

        title: 'Hỗ trợ 24/7',

        desc: 'Đồng hành cùng dự án qua Discord và Email bất cứ lúc nào bạn cần.',

        icon: '🛠️',

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
<template>
    <section class="py-24 bg-[fcfdfe]">
        <div class="max-w-7xl mx-auto px-6">
            <!-- <h2 class="text-3xl font-bold text-center mb-16 text-gray-900">Khách hàng nói gì về chúng tôi?</h2> -->
            <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl mb-6">
                <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                    Khách hàng nói gì về chúng tôi?
                </h3>
                <div class="h-1 w-12 bg-blue-500 mb-6"></div>
                <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
                    Được tối ưu hóa hoàn toàn cho hiệu suất Mobile và PC. Sẵn sàng để đưa vào dự án của bạn ngay lập
                    tức.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="rev in reviews" :key="rev.name"
                    class="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                    <div class="flex text-amber-400 mb-4">
                        <span v-for="i in rev.stars" :key="i">★</span>
                    </div>
                    <p class="text-gray-600 italic mb-6">"{{ rev.text }}"</p>
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                            {{ rev.name.charAt(0) }}
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-sm">{{ rev.name }}</h4>
                            <p class="text-xs text-gray-500">{{ rev.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const reviews = [
    { name: 'Alex Rivera', role: 'Game Developer', text: 'Asset tuyệt vời! Code rất sạch và dễ tùy biến. Tiết kiệm cho tôi hàng tuần làm việc.', stars: 5 },
    { name: 'Sarah Chen', role: 'Technical Artist', text: 'Texture 4K cực kỳ chi tiết, tối ưu hóa rất tốt cho mobile. Rất đáng đồng tiền bát gạo.', stars: 5 },
    { name: 'Marcus Todd', role: 'Indie Studio Owner', text: 'Hỗ trợ kỹ thuật rất nhanh và nhiệt tình. Sẽ còn ủng hộ các sản phẩm tiếp theo.', stars: 5 }
]
</script>
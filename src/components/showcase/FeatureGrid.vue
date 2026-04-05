
<template>
  <section id="features" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Tại sao nên chọn Asset của chúng tôi?</h2>
        <p class="text-gray-600">Chúng tôi tập trung vào chất lượng code và trải nghiệm người dùng cuối cùng.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(item, index) in features" 
          :key="index"
          class="p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
        >
          <div class="text-4xl mb-6 inline-block group-hover:scale-110 transition-transform">
            {{ item.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ item.title }}</h3>
          <p class="text-gray-600 leading-relaxed text-sm">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: 'Hiệu năng tối ưu',
    desc: 'Được tối ưu hóa hoàn toàn cho Vite, giúp dự án của bạn load nhanh như chớp.',
    icon: '⚡'
  },
  {
    title: 'Dễ dàng tùy chỉnh',
    desc: 'Cấu trúc Component rõ ràng, giúp bạn thay đổi giao diện chỉ trong vài giây.',
    icon: '🎨'
  },
  {
    title: 'Tài liệu đầy đủ',
    desc: 'Hướng dẫn chi tiết từ A-Z, phù hợp cho cả người mới bắt đầu.',
    icon: '📚'
  }
]
</script>
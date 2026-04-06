<script setup>
const specs = [
  { label: 'Phiên bản', value: '2.0.4', icon: '📦', color: 'bg-blue-600' },
  { label: 'Textures', value: '4K PBR', icon: '🖼️', color: 'bg-emerald-500' },
  { label: 'LODs', value: '4 Cấp độ', icon: '📉', color: 'bg-amber-500' },
//   { label: 'Rigging', value: 'Humanoid', icon: '🦴', color: 'bg-rose-500' },
//   { label: 'Dung lượng', value: '1.2 GB', icon: '💾', color: 'bg-violet-600' }
]
</script>

<template>
  <section id="specs" class="py-24 bg-[fcfdfe]">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        <div class="bg-slate-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col justify-center shadow-xl">
          <h3 class="text-3xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
            Technical Specs
          </h3>
          <div class="h-1 w-12 bg-blue-500 mb-6"></div>
          <p class="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">
            Fully optimized for Mobile and PC performance. Production-ready for immediate integration.
          </p>
        </div>

        <div class="group p-10 lg:p-14 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col justify-center">
          <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
            📐
          </div>
          <h4 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Standard Polycount</h4>
          <p class="text-slate-500 leading-relaxed text-sm lg:text-base">
            Trung bình 25k Tris mỗi mô hình, đảm bảo độ chi tiết cực cao mà vẫn giữ được hiệu năng mượt mà.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="(item, index) in specs" 
          :key="index"
          class="group p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
        >
          <div :class="[item.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg mb-8 text-white group-hover:rotate-12 transition-transform']">
            {{ item.icon }}
          </div>
          <h4 class="text-xl font-black text-slate-900 mb-3 tracking-tight">{{ item.label }}</h4>
          <p class="text-slate-500 text-sm leading-relaxed">
            {{ item.value }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Đồng bộ letter-spacing hẹp cho font chữ mạnh mẽ */
h3, h4 {
  letter-spacing: -0.04em;
}
</style>


<template>
  <section id="pricing" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Giấy phép & Sở hữu</h2>
        <p class="text-gray-600">Chọn loại giấy phép phù hợp với quy mô dự án của bạn trên Store.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="item in licenses" :key="item.name"
          :class="[
            'p-8 rounded-3xl border transition-all duration-500',
            item.isPopular 
              ? 'border-blue-600 shadow-xl shadow-blue-100 ring-1 ring-blue-600' 
              : 'border-gray-100 bg-gray-50/50'
          ]"
        >
          <div class="mb-8">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ item.name }}</h3>
              <span v-if="item.isPopular" class="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md uppercase font-black">Best Value</span>
            </div>
            
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-black text-gray-900">{{ item.price === 'Custom' ? '' : '$' }}{{ item.price }}</span>
              <span v-if="item.price !== 'Custom'" class="text-gray-500 font-medium">/một lần duy nhất</span>
            </div>
            <p class="mt-4 text-sm text-gray-600 leading-relaxed">{{ item.description }}</p>
          </div>

          <ul class="space-y-4 mb-10">
            <li v-for="feat in item.features" :key="feat" class="flex items-start gap-3 text-sm text-gray-700">
              <div class="mt-1 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg class="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </div>
              {{ feat }}
            </li>
          </ul>

          <BaseButton 
            :label="item.price === 'Custom' ? 'Liên hệ' : 'Mua trên Store'" 
            :variant="item.isPopular ? 'primary' : 'outline'" 
            class="w-full justify-center py-4 text-lg"
            @click="window.open('LINK_STORE_CUA_BAN', '_blank')"
          />
        </div>
      </div>
      
      <p class="mt-12 text-center text-sm text-gray-400 italic">
        * Tất cả giao dịch được bảo mật và thực hiện trực tiếp thông qua nền tảng Asset Store chính thức.
      </p>
    </div>
  </section>
</template>

<script setup>
import BaseButton from '../base/BaseButton.vue'

const licenses = [
  {
    name: 'Standard License',
    price: '29',
    description: 'Dành cho cá nhân hoặc Freelancer làm dự án đơn lẻ.',
    features: ['Sử dụng cho 01 dự án', 'Bao gồm file gốc', 'Cập nhật trọn đời', 'Hỗ trợ qua Email'],
    isPopular: false
  },
  {
    name: 'Extended License',
    price: '89',
    description: 'Dành cho Agency và Studio sản xuất thương mại.',
    features: ['Không giới hạn dự án', 'Quyền chỉnh sửa & phân phối', 'Hỗ trợ ưu tiên 1-1', 'Bao gồm toàn bộ Add-ons', 'Tương thích mọi nền tảng'],
    isPopular: true
  },
  {
    name: 'Team / Enterprise',
    price: 'Custom',
    description: 'Tùy chỉnh riêng cho các doanh nghiệp lớn.',
    features: ['Cấp phép theo số lượng nhân sự', 'Đào tạo sử dụng trực tiếp', 'Hợp đồng bảo mật riêng', 'Tùy chỉnh asset theo yêu cầu'],
    isPopular: false
  }
]
</script>
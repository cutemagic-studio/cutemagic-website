<template>
  <section id="ProductionRoadmapSection" class="py-12 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 relative">

      <!-- TIÊU ĐỀ SECTION -->
      <fieldset
        class="border-2 border-gray-600 dark:border-gray-600/80 rounded-xl p-6 pb-18 relative transition-all duration-300">

        <!-- LEGEND: Phần tiêu đề cắt ngang đường viền -->
        <legend class="px-4 ml-4">
          <div class="flex items-center gap-3">
            <h2
              class="text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-200 tracking-tight flex items-center gap-2">
              Development Roadmap
            </h2>
            
          </div>
        </legend>
        <p class="text-sm text-cmg-muted ml-4">
          Monthly release and update schedule for 3D asset packs.
        </p>
        <!-- <div class="mb-12">
        <h2 class="text-2xl sm:text-3xl font-black text-gray-700 dark:text-gray-200 tracking-tight">
          Development Roadmap
        </h2>
        <p class="text-sm text-cmg-muted mt-1">
          Lộ trình phát hành và cập nhật các gói tài nguyên 3D theo từng tháng.
        </p>
      </div> -->
      

      <!-- SƠ ĐỒ CÂY ROADMAP -->
      <!-- Đã xóa nút "Lộ Trình" và flex-row. Giữ lại relative để làm mốc cho đường nét đứt -->
      <div class="relative w-full mt-4">

        <!-- ==============================================================
             TRỤC THỜI GIAN NÉT ĐỨT CÓ HIỆU ỨNG CHẢY MÀU (THAY THẾ NÚT LỘ TRÌNH)
             ============================================================== -->
        <!-- Đường base mờ (Màu xám mặc định) -->
        <div
          class="absolute left-4 sm:left-[38px] top-6 bottom-[-40px] w-0 border-l-[3px] border-dashed border-slate-300 dark:border-slate-700 z-0">
        </div>

        <!-- Đường hiệu ứng chạy màu (Tạo cảm giác dòng chảy năng lượng) -->
        <div
          class="absolute left-4 sm:left-[38px] top-6 w-0 border-l-[3px] border-dashed border-emerald-500 z-10 animate-flow-down">
        </div>

        <!-- DANH SÁCH CÁC THÁNG (Xếp dọc) -->
        <!-- Đặt gap-y-16 để khoảng cách giữa các tháng đủ rộng cho đường nét đứt thể hiện -->
        <div class="grid grid-cols-1 gap-y-16 w-full relative z-20">

          <!-- Lặp qua từng tháng -->
          <div v-for="(col, index) in roadmapColumns" :key="col.id" class="relative flex flex-col">

            <!-- Cụm Node trên trục thời gian -->
            <div
              class="absolute left-3 sm:left-[34px] top-[14px] w-[11px] h-[11px] flex items-center justify-center z-20">

              <!-- LỚP 1: Viền chớp sáng to nhỏ bao bên ngoài (Chỉ bật cho 'Tháng này') -->
              <div v-if="col.id === 'current'" class="absolute w-full h-full rounded-full bg-emerald-500 animate-halo">
              </div>

              <!-- LỚP 2: Chấm lõi chính (Luôn hiển thị 100%, không bị mờ) -->
              <div class="relative w-full h-full rounded-full ring-4 ring-cmg-background" :class="col.dotClass">
              </div>

            </div>

            <!-- Khối nội dung chính (Tiêu đề cột + Danh sách) được đẩy sang phải 20px (pl-5) so với trục -->
            <div class="pl-10 sm:pl-[64px] flex flex-col w-full">

              <!-- COMPONENT TIÊU ĐỀ CỘT -->
              <RoadmapColumnHeader :col="col" />

              <!-- COMPONENT DANH SÁCH PACK -->
              <!-- Thêm pt-2 để tách danh sách ra xa tiêu đề một chút -->
              <div class="pt-2 pl-2">
                <RoadmapColumnList :col="col" />
              </div>

            </div>

          </div>

        </div>

      </div>
      </fieldset>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAssetStore } from '../../../stores/useAssetStore.js'

import RoadmapColumnHeader from './RoadmapColumnHeader.vue'
import RoadmapColumnList from './RoadmapColumnList.vue'

const assetStore = useAssetStore()

const roadmapColumns = computed(() => {
  // Lấy toàn bộ danh sách asset từ store
  const allAssets = assetStore.assets || []

  return [
    {
      id: 'prev',
      title: 'Previous Month',
      dateLabel: getMonthLabel(-1), // Tự động sinh ra "10/2026" nếu đang ở tháng 11
      periodLabel: 'Completed',
      pillClass: 'bg-lime-500 shadow-lime-500/25 text-white',
      dotClass: 'bg-lime-500',
      // Đồng bộ màu Icon với màu cột
      iconBgClass: 'bg-lime-500 text-white',
      // Nền trắng/đen đặc, viền xám mặc định, hover lên viền xanh cốm
      itemBgClass: 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-500 hover:shadow-lg hover:shadow-lime-500/10',
      // items: [
      //   { id: 101, title: 'Stylized Lowpoly Tree Pack', subText: '120 Models • Đã lên kệ' },
      //   { id: 102, title: 'Cute Magic – Cube Animals', subText: '50 Models • Đã lên kệ' },
      //   { id: 103, title: 'Cozy Interior Furniture Pack', subText: '20 Rooms • Đã lên kệ' },
      //   { id: 104, title: 'Fantasy Village Props', subText: '85 Models • Đã lên kệ' },
      //   { id: 105, title: 'Fantasy Village Props', subText: '85 Models • Đã lên kệ' },
      //   { id: 106, title: 'Fantasy Village Props', subText: '85 Models • Đã lên kệ' }
      // ]

      // TỰ ĐỘNG LỌC: Chỉ lấy các asset có roadmap.status là 'prev'
      items: allAssets.filter(asset => asset.roadmap?.status === 'prev')
    },
    {
      id: 'current',
      title: 'Current Month',
      dateLabel: getMonthLabel(0), // Tự động sinh ra "11/2026"
      periodLabel: 'In Progress',
      pillClass: 'bg-emerald-500 shadow-emerald-500/25 text-white',
      dotClass: 'bg-emerald-500',
      iconBgClass: 'bg-emerald-500 text-white',
      // Cột hiện tại ưu ái cho viền màu ngọc lục bảo ngay từ đầu để luôn nổi bật
      itemBgClass: 'bg-white dark:bg-[#1e1e1e] border-emerald-400 dark:border-emerald-600/60 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20',
      // items: [
      //   { id: 201, title: 'Grand Archipelago – Island Dioramas', subText: 'Tiến độ: 85% • Đang tối ưu LOD' },
      //   { id: 202, title: 'Stylized Monster Limbs & Bosses', subText: 'Tiến độ: 60% • Đang Rigging' },
      //   { id: 203, title: 'Magical Crystal & Cave Props', subText: 'Tiến độ: 40% • Đang Texturing' },
      //   { id: 204, title: 'Lowpoly Farming Crops Update', subText: 'Tiến độ: 90% • Kiểm thử Unity URP' }
      // ]

      // TỰ ĐỘNG LỌC: Chỉ lấy các asset có roadmap.status là 'current'
      items: allAssets.filter(asset => asset.roadmap?.status === 'current')
    },
    {
      id: 'next',
      title: 'Next Month',
      dateLabel: getMonthLabel(1), // Tự động sinh ra "12/2026"
      periodLabel: 'Planned',
      pillClass: 'bg-amber-400 shadow-amber-400/25 text-slate-900',
      dotClass: 'bg-amber-400',
      iconBgClass: 'bg-amber-400 text-slate-900',
      // Nền trắng/đen đặc, viền xám mặc định, hover lên viền vàng cam
      itemBgClass: 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/10',
      // items: [
      //   { id: 301, title: 'Floating Sky Castle Modular Pack', subText: 'Dự kiến: Đầu tháng sau' },
      //   { id: 302, title: 'Stylized Medieval Weapons', subText: 'Dự kiến: Giữa tháng sau' },
      //   { id: 303, title: 'Cute Dungeon Traps & Chests', subText: 'Dự kiến: Cuối tháng sau' },
      //   { id: 304, title: 'Seasonal Weather VFX Shaders', subText: 'Đang lên Concept' }
      // ]

      // TỰ ĐỘNG LỌC: Chỉ lấy các asset có roadmap.status là 'next'
      items: allAssets.filter(asset => asset.roadmap?.status === 'next')
    }
  ]
})

const goToDetail = (item) => {
  console.log('Xem chi tiết lộ trình:', item.title)
}

// Hàm hỗ trợ tự động tính Tháng/Năm (offset: -1 là tháng trước, 0 là tháng này, 1 là tháng sau)
const getMonthLabel = (offset) => {
  const date = new Date()
  date.setMonth(date.getMonth() + offset) // Cộng trừ số tháng
  const month = String(date.getMonth() + 1).padStart(2, '0') // Đảm bảo luôn có 2 chữ số (09, 10...)
  const year = date.getFullYear()
  return `${month}/${year}`
}
</script>

<style scoped>
/* Hiệu ứng dòng chảy ánh sáng chạy từ trên xuống dưới cho đường nét đứt */
.animate-flow-down {
  animation: flowDown 3s ease-in-out infinite;
  /* Đặt chiều cao ban đầu là 100% để phủ màu, dùng clip-path để giấu bớt và tạo hiệu ứng quét */
  height: 100%;
}

@keyframes flowDown {
  0% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }

  50% {
    clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
  }

  100% {
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  }
}

/* Hiệu ứng viền chớp sáng to nhỏ (Halo Breathing) */
.animate-halo {
  animation: halo 2s ease-in-out infinite;
}

@keyframes halo {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }

  50% {
    transform: scale(2.5);
    /* Phình to ra 2.5 lần */
    opacity: 0.1;
    /* Mờ dần đi khi phình to để tạo cảm giác lan tỏa */
  }
}
</style>
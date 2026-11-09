<!-- src/components/admin/common/LiveActivityToast.vue -->
<template>
  <div class="fixed bottom-6 right-6 z-[115] flex flex-col gap-3 max-w-sm w-full pointer-events-none font-sans select-none">
    
    <!-- Hiển thị chỉ báo Hàng đợi (Queue) nếu có nhiều thông báo trùng thời điểm đang chờ -->
    <transition name="fade">
      <div 
        v-if="activityStore.notificationQueue.length > 0"
        class="pointer-events-auto self-end px-3 py-1 rounded-full bg-[#1e1e1e] border-2 border-[#ffe600] text-[#ffe600] text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
      >
        <span class="w-2 h-2 rounded-full bg-[#ffe600] animate-ping"></span>
        <span>Đang chờ hiển thị: +{{ activityStore.notificationQueue.length }} thông báo</span>
      </div>
    </transition>

    <!-- Danh sách Toast hiển thị tuần tự -->
    <transition-group name="live-toast">
      <div
        v-for="item in activityStore.activeLiveToasts"
        :key="item.id"
        @click="activityStore.handleToastClick(item)"
        class="pointer-events-auto group relative bg-[#1e1e1e] text-white rounded-2xl p-4 border-2 shadow-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 overflow-hidden"
        :class="getActionStyle(item.actionType).borderClass"
        title="Click để mở danh sách và làm nổi bật (Highlight) hoạt động này"
      >
        <!-- Thanh ánh sáng chạy dọc bên trái -->
        <div class="absolute top-0 left-0 bottom-0 w-1.5" :class="getActionStyle(item.actionType).barClass"></div>

        <!-- Header nhỏ của Toast: Nhãn Live + Giờ + Nút Âm thanh / Đóng -->
        <div class="flex items-center justify-between gap-2 mb-2 pl-2">
          <div class="flex items-center gap-2">
            <span 
              class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
              :class="getActionStyle(item.actionType).badgeClass"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {{ getActionStyle(item.actionType).label }}
            </span>
            <span class="text-[10px] font-mono font-bold text-slate-400">
              {{ formatTime(item.timestamp) }}
            </span>
          </div>

          <div class="flex items-center gap-1" @click.stop>
            <!-- Nút Bật/Tắt âm thanh thông báo nhanh -->
            <button
              type="button"
              @click="activityStore.toggleSoundMute()"
              class="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-xs transition-colors cursor-pointer"
              :title="activityStore.soundMuted ? 'Đang tắt âm thanh (Click để bật)' : 'Đang bật âm thanh (Click để tắt)'"
            >
              {{ activityStore.soundMuted ? '🔇' : '🔊' }}
            </button>
            <!-- Nút Đóng Toast -->
            <button
              type="button"
              @click="activityStore.dismissLiveToast(item.id)"
              class="w-6 h-6 rounded-lg bg-white/5 hover:bg-rose-500/80 text-slate-400 hover:text-white flex items-center justify-center text-xs font-black transition-colors cursor-pointer"
              title="Đóng thông báo này"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Nội dung chính: IP + Vị trí địa lý + Hành động -->
        <div class="flex items-start gap-3 pl-2">
          <!-- Icon lớn đại diện hành động -->
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
            :class="getActionStyle(item.actionType).iconBoxClass"
          >
            {{ getActionStyle(item.actionType).icon }}
          </div>

          <div class="flex-1 min-w-0">
            <!-- Dòng 1: Địa chỉ IP & Quốc gia -->
            <div class="flex items-center gap-1.5 text-xs font-black text-[#ECECEC] truncate">
              <img 
                v-if="item.flag" 
                :src="item.flag" 
                class="w-4 h-3 object-cover rounded-xs border border-slate-600 shrink-0" 
                referrerpolicy="no-referrer" 
              />
              <span class="font-mono text-[#ffe600]">{{ item.ip }}</span>
              <span class="text-slate-400 font-bold truncate">({{ item.location }})</span>
            </div>

            <!-- Dòng 2: Mô tả chi tiết hành động -->
            <p class="text-xs font-bold mt-1 leading-snug break-words" :class="getActionStyle(item.actionType).textClass">
              <template v-if="item.actionType === 'LIKE_ASSET'">
                Vừa yêu thích gói <strong class="text-white underline">{{ item.assetTitle || `#${item.assetId}` }}</strong>
              </template>
              <template v-else-if="item.actionType === 'DOWNLOAD_ASSET'">
                Vừa tải xuống gói <strong class="text-white underline">{{ item.assetTitle || `#${item.assetId}` }}</strong>
              </template>
              <template v-else-if="item.actionType === 'VIEW_ASSET'">
                Vừa mở xem gói <strong class="text-white">{{ item.assetTitle || `#${item.assetId}` }}</strong>
              </template>
              <template v-else>
                Vừa truy cập trang <code class="px-1.5 py-0.5 rounded bg-black/40 text-[#00EE76] font-mono text-[11px]">{{ item.path }}</code>
              </template>
            </p>

            <!-- Dòng 3: Gợi ý Click -->
            <p class="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{{ item.device }} • {{ item.browser }}</span>
              <span class="text-[#1E90FF] group-hover:translate-x-0.5 transition-transform">
                Xem &amp; Highlight →
              </span>
            </p>
          </div>
        </div>

      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useActivityNotificationStore } from '../../../stores/useActivityNotificationStore'

const activityStore = useActivityNotificationStore()

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getActionStyle = (type) => {
  switch (type) {
    case 'DOWNLOAD_ASSET':
      return {
        label: 'New Download',
        icon: '⬇️',
        borderClass: 'border-[#00EE76]',
        barClass: 'bg-[#00EE76]',
        badgeClass: 'bg-[#00EE76]/15 text-[#00EE76] border border-[#00EE76]/30',
        iconBoxClass: 'bg-[#00EE76]/10 border-[#00EE76]/30 text-[#00EE76]',
        textClass: 'text-[#00EE76]'
      }
    case 'LIKE_ASSET':
      return {
        label: 'New Favorite',
        icon: '❤️',
        borderClass: 'border-[#ff005b]',
        barClass: 'bg-[#ff005b]',
        badgeClass: 'bg-[#ff005b]/15 text-[#ff005b] border border-[#ff005b]/30',
        iconBoxClass: 'bg-[#ff005b]/10 border-[#ff005b]/30 text-[#ff005b]',
        textClass: 'text-pink-400'
      }
    case 'VIEW_ASSET':
      return {
        label: 'Asset View',
        icon: '📦',
        borderClass: 'border-[#1E90FF]',
        barClass: 'bg-[#1E90FF]',
        badgeClass: 'bg-[#1E90FF]/15 text-[#1E90FF] border border-[#1E90FF]/30',
        iconBoxClass: 'bg-[#1E90FF]/10 border-[#1E90FF]/30 text-[#1E90FF]',
        textClass: 'text-sky-300'
      }
    default:
      return {
        label: 'Page Visit',
        icon: '🌐',
        borderClass: 'border-[#ffe600]',
        barClass: 'bg-[#ffe600]',
        badgeClass: 'bg-[#ffe600]/15 text-[#ffe600] border border-[#ffe600]/30',
        iconBoxClass: 'bg-[#ffe600]/10 border-[#ffe600]/30 text-[#ffe600]',
        textClass: 'text-slate-200'
      }
  }
}
</script>

<style scoped>
.live-toast-enter-active,
.live-toast-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.live-toast-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.92);
}
.live-toast-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.9);
}
</style>
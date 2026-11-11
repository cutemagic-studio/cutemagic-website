<!-- src/components/donate/PaypalQrModal.vue -->
<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans"
      @click.self="$emit('close')"
    >
      <div class="relative bg-white dark:bg-[#161a23] border-2 border-[#1C1C1C] dark:border-[#8470FF] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up">
        
        <!-- Header của Popup -->
        <div class="px-6 py-4 bg-[#00457c] text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-lg">⚡</span>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-sky-300">Official Monetary Support</p>
              <h3 class="text-base font-black leading-tight">Donate via PayPal QR Code</h3>
            </div>
          </div>

          <button
            type="button"
            @click="$emit('close')"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Nội dung chính chứa Mã QR -->
        <div class="p-6 text-center space-y-5">
          <p class="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
            Open the <strong>PayPal</strong> app or your phone's <strong>Camera</strong> and scan the QR code below to support the creation of new 3D asset packs at <strong>Cute Magic</strong>.
          </p>

          <!-- Khung hiển thị ảnh QR PayPal --> 
          <div class="relative mx-auto w-60 h-60 p-4 rounded-3xl bg-white border-4 border-[#00457c] shadow-xl flex items-center justify-center group">
            <!-- BẠN CÓ THỂ THAY ĐƯỜNG DẪN ẢNH QR PAYPAL CỦA BẠN VÀO PROP qrImageUrl -->
            <img
              :src="qrImageUrl"
              alt="Cute Magic PayPal QR Code"
              class="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <span class="absolute -bottom-3 px-3 py-0.5 rounded-full bg-[#ffe600] text-black border-2 border-[#1C1C1C] text-[10px] font-black uppercase tracking-wider shadow">
              Scan to Support
            </span>
          </div>

          <!-- Thông tin tài khoản nhận -->
          <!-- <div class="bg-gray-100 dark:bg-[#0f131d] p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-1">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">PayPal Account / Email</p>
            <div class="flex items-center justify-center gap-2">
              <code class="text-xs sm:text-sm font-mono font-black text-[#00457c] dark:text-[#ffe600]">
                {{ paypalEmail }}
              </code>
              <button
                type="button"
                @click="copyPaypalEmail"
                class="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black cursor-pointer transition-colors"
              >
                {{ copied ? '✓ Copied' : 'Copy' }}
              </button>
            </div>
          </div> -->

          <!-- Nút mở link trực tiếp hoặc đóng --> 
          <div class="flex items-center gap-3 pt-1">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-700 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Window
            </button>
            <a
              v-if="paypalLink"
              :href="paypalLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 py-3 rounded-xl bg-[#00457c] hover:bg-[#003159] text-white text-xs font-black shadow-lg transition-colors text-center"
            >
              Open PayPal Page ➜
            </a>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import qrCodeImg from '../../assets/qr/qr-code.png'

const props = defineProps({
  show: { type: Boolean, default: false },
  paypalEmail: { type: String, default: 'cutemagic15081998@gmail.com' },
  paypalLink: { type: String, default: 'https://www.paypal.com/' },
  // Tự động tạo mã QR sắc nét từ đường dẫn PayPal (Hoặc bạn truyền đường dẫn ảnh QR trong máy vào đây)
  qrImageUrl: {
    type: String,
    default: qrCodeImg
  }
})

defineEmits(['close'])

const copied = ref(false)

const copyPaypalEmail = () => {
  navigator.clipboard.writeText(props.paypalEmail)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
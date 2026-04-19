<template>
  <div class="min-h-screen bg-[#0b0e14] text-slate-300 font-sans selection:bg-[#14b8a6]/30">
    <nav class="border-b border-slate-800 bg-[#11141b]/80 backdrop-blur-md relative">
      <div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg shadow-lg shadow-[#14b8a6]/20" 
               style="background: linear-gradient(to top right, #2dd4bf, #3b82f6);">
          </div>
          <h1 class="font-bold text-white tracking-tight text-lg">
            ChromaForge <span class="text-[#14b8a6] text-[10px] uppercase ml-1 px-1.5 py-0.5 border border-[#14b8a6]/30 rounded">Pro</span>
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <button @click="exportCSS" 
            class="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-[#1e293b] px-4 py-2 rounded-lg border border-slate-700">
            EXPORT CSS
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-[1440px] mx-auto p-6 grid grid-cols-12 gap-8">
      <aside class="col-span-12 lg:col-span-3 space-y-6">
        <section class="bg-[#11141b] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Configuration</h3>

          <div class="space-y-3 mb-8">
            <label class="text-sm font-semibold text-slate-300">Base Color</label>
            <div class="flex items-center gap-1.5 p-1 bg-[#0b0e14] rounded-xl border border-slate-700 focus-within:border-[#14b8a6] transition-all overflow-hidden">
              
              <input v-model="hexInput" @keyup.enter="update" @blur="update" type="text"
                class="bg-transparent border-none w-0 flex-1 px-2 py-1.5 font-mono text-xs text-white outline-none min-w-[70px]"
                placeholder="#02C69A" />

              <button @click="pasteColor" 
                class="flex-shrink-0 px-2 py-1 text-[9px] font-black bg-[#1e293b] text-slate-400 rounded-md hover:bg-slate-700 hover:text-white transition-all active:scale-90 border border-slate-700 uppercase tracking-tighter">
                Paste
              </button>

              <div class="flex-shrink-0 relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                <input v-model="hexInput" @input="update" type="color"
                  class="absolute -inset-2 w-[150%] h-[150%] cursor-pointer bg-transparent" />
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="(val, key) in sliderDefinitions" :key="key" class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="text-sm text-slate-400">{{ val.label }}</label>
                <span class="text-xs font-mono text-[#14b8a6] bg-[#14b8a6]/10 px-2 py-0.5 rounded">
                  {{ config[key] }}{{ val.unit }}
                </span>
              </div>
              <input v-model.number="config[key]" @input="update" type="range" :min="val.min" :max="val.max" :step="val.step"
                class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                style="accent-color: #14b8a6;" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-8">
            <button @click="resetConfig" 
              class="py-3 bg-[#1e293b] hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95">
              RESET
            </button>
            <button @click="update" 
              class="py-3 bg-[#14b8a6] hover:bg-[#2dd4bf] text-[#0b0e14] text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[#14b8a6]/20">
              GENERATE
            </button>
          </div>
        </section>

        <div class="p-5 border border-blue-500/20 rounded-2xl" style="background-color: rgba(59, 130, 246, 0.05);">
          <p class="text-[13px] text-blue-400 leading-relaxed">
            <span class="font-bold">Auto-Save:</span> Màu sắc và cấu hình của bạn được lưu tự động vào Pinia Store.
          </p>
        </div>
      </aside>

      <section class="col-span-12 lg:col-span-9 space-y-6">
        <div class="bg-[#11141b] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="flex flex-col sm:flex-row h-[480px]">
            <div v-for="(color, index) in palette" :key="index" @click="copy(color)"
              class="group relative flex-1 flex flex-col items-center justify-between py-10 transition-all duration-500 hover:flex-[2.5] cursor-pointer"
              :style="{ backgroundColor: color }">
              
              <div class="opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                <span class="text-[10px] font-bold px-2 py-1 rounded bg-black/10 backdrop-blur-sm" 
                      :class="isLight(color) ? 'text-black' : 'text-white'">
                  {{ (index + 1) * 100 }}
                </span>
              </div>

              <div class="flex flex-col items-center gap-3">
                <div class="hidden group-hover:flex w-10 h-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="isLight(color) ? 'text-black' : 'text-white'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </div>
                <span class="font-mono font-black text-sm tracking-wider" :class="isLight(color) ? 'text-black' : 'text-white'">
                  {{ color }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#11141b] border border-slate-800 rounded-2xl overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-[#161a23] text-slate-500 uppercase text-[10px] tracking-widest">
              <tr>
                <th class="px-6 py-4 font-bold">Weight</th>
                <th class="px-6 py-4 font-bold">Hex Code</th>
                <th class="px-6 py-4 font-bold">Contrast</th>
                <th class="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="(color, index) in palette" :key="index" class="hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-4 font-mono text-[#14b8a6]">{{ (index + 1) * 100 }}</td>
                <td class="px-6 py-4 font-mono text-white">{{ color }}</td>
                <td class="px-6 py-4">
                  <span :class="isLight(color) ? 'text-orange-400' : 'text-green-400'">
                    {{ isLight(color) ? 'Light' : 'Dark' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button @click="copy(color)" class="cursor-pointer text-xs font-bold hover:text-[#14b8a6] transition-colors uppercase">Copy</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <Transition name="toast">
      <div v-if="copied" class="fixed bottom-10 right-10 bg-[#14b8a6] text-[#0b0e14] px-6 py-3 rounded-2xl font-bold shadow-2xl z-[100] flex items-center gap-3">
        <span>✅</span> {{ copied }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useColorStore } from '../../../stores/colorStore'; 
import { generateCustomPalette, isLight, generateCssVariables } from "../../../utils/colorHelper";

const colorStore = useColorStore();

// Khởi tạo từ Pinia Store
const hexInput = ref(colorStore.hex);
const palette = ref([]);
const copied = ref("");

const config = reactive({
  step: 0.1,
  saturationScale: 1.0,
  count: 9
});

const sliderDefinitions = {
  step: { label: "Lightness Interval", min: 0.05, max: 0.2, step: 0.01, unit: "" },
  saturationScale: { label: "Saturation Scale", min: 0.1, max: 2, step: 0.1, unit: "x" },
  count: { label: "Color Steps", min: 5, max: 11, step: 2, unit: " swatches" }
};

// Cập nhật và lưu vào Store
const update = () => {
  let val = hexInput.value.trim();
  if (val) {
    // Chuẩn hóa HEX
    val = '#' + val.replace(/#/g, '').toUpperCase();
    hexInput.value = val;
    
    // Kiểm tra định dạng trước khi tạo palette và lưu store
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(val)) {
      colorStore.setHex(val); // Lưu vào Pinia & LocalStorage
      palette.value = generateCustomPalette(val, config);
    }
  }
};

// Theo dõi biến hex trong store nếu có thay đổi từ bên ngoài (ví dụ tab khác)
watch(() => colorStore.hex, (newHex) => {
  if (newHex !== hexInput.value) {
    hexInput.value = newHex;
    update();
  }
});

const resetConfig = () => {
  config.step = 0.1;
  config.saturationScale = 1.0;
  config.count = 9;
  update();
};

const copy = (color) => {
  if (!navigator.clipboard) return;
  const upperColor = color.toUpperCase();
  navigator.clipboard.writeText(upperColor);
  copied.value = `Copied ${upperColor}`;
  setTimeout(() => (copied.value = ""), 2000);
};

const exportCSS = () => {
  const css = generateCssVariables(palette.value);
  navigator.clipboard.writeText(css);
  copied.value = "CSS Variables Copied!";
  setTimeout(() => (copied.value = ""), 2000);
};

const pasteColor = async () => {
  try {
    const text = await navigator.clipboard.readText();
    const hexRegex = /^#?([0-9A-F]{3}){1,2}$/i;
    if (hexRegex.test(text.trim())) {
      const validHex = text.trim().startsWith('#') ? text.trim() : `#${text.trim()}`;
      hexInput.value = validHex.toUpperCase();
      update(); // Gọi update để lưu vào store
    }
  } catch (err) {
    alert("Vui lòng cấp quyền truy cập Clipboard.");
  }
};

onMounted(() => {
  update();
});
</script>

<style scoped>
/* Giữ nguyên các hiệu ứng Toast và Scrollbar của bạn */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from { transform: translateY(100px) scale(0.8); opacity: 0; }
.toast-leave-to { transform: translateY(20px) scale(0.8); opacity: 0; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0b0e14; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #14b8a6; }
</style>
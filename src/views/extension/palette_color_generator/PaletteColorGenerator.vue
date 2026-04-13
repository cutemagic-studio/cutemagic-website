
<template>
  <div class="min-h-screen bg-[#0b0e14] text-slate-300 font-sans selection:bg-teal-500/30">
<nav class="border-b border-slate-800 bg-[#11141b]/80 backdrop-blur-md relative">
  <div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-lg shadow-lg shadow-teal-500/20"></div>
      <h1 class="font-bold text-white tracking-tight text-lg">
        ChromaForge <span class="text-teal-500 text-[10px] uppercase ml-1 px-1.5 py-0.5 border border-teal-500/30 rounded">Pro</span>
      </h1>
    </div>
    <div class="flex items-center gap-4">
      <button @click="exportCSS" class="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
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
            <div class="flex gap-2 p-1.5 bg-[#0b0e14] rounded-xl border border-slate-700 focus-within:border-teal-500 transition-all">
              <input 
                v-model="hexInput" 
                @keyup.enter="update"
                @blur="update"
                type="text" 
                class="bg-transparent border-none flex-1 px-3 py-1.5 font-mono text-white outline-none" 
                placeholder="#02c69a"
              />
              <input v-model="hexInput" @input="update" type="color" class="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent" />
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="(val, key) in sliderDefinitions" :key="key" class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="text-sm text-slate-400">{{ val.label }}</label>
                <span class="text-xs font-mono text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">{{ config[key] }}{{ val.unit }}</span>
              </div>
              <input v-model.number="config[key]" @input="update" type="range" :min="val.min" :max="val.max" :step="val.step" class="w-full accent-teal-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          <button @click="update" class="w-full mt-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-[#0b0e14] font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-teal-500/20">
            GENERATE PALETTE
          </button>
        </section>

        <div class="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
          <p class="text-[13px] text-blue-400 leading-relaxed">
            <span class="font-bold">Pro Tip:</span> Sử dụng phím Enter sau khi nhập mã màu để cập nhật nhanh dải màu.
          </p>
        </div>
      </aside>

      <section class="col-span-12 lg:col-span-9 space-y-6">
        <div class="bg-[#11141b] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="flex flex-col sm:flex-row h-[480px]">
            <div
              v-for="(color, index) in palette"
              :key="index"
              @click="copy(color)"
              class="group relative flex-1 flex flex-col items-center justify-between py-10 transition-all duration-500 hover:flex-[2.5] cursor-pointer"
              :style="{ backgroundColor: color }"
            >
              <div class="opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                <span class="text-[10px] font-bold px-2 py-1 rounded bg-black/10 backdrop-blur-sm" :class="isLight(color) ? 'text-black' : 'text-white'">
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
                <td class="px-6 py-4 font-mono text-teal-500">{{ (index + 1) * 100 }}</td>
                <td class="px-6 py-4 font-mono text-white">{{ color }}</td>
                <td class="px-6 py-4">
                  <span :class="isLight(color) ? 'text-orange-400' : 'text-green-400'">
                    {{ isLight(color) ? 'Light' : 'Dark' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button @click="copy(color)" class="text-xs font-bold hover:text-teal-400 transition-colors uppercase">Copy</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <Transition name="toast">
      <div v-if="copied" class="fixed bottom-10 right-10 bg-teal-500 text-[#0b0e14] px-6 py-3 rounded-2xl font-bold shadow-2xl z-[100] flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Copied {{ copied }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { generateCustomPalette, isLight, generateCssVariables } from "../../../utils/colorHelper";

const hexInput = ref("#02c69a");
const palette = ref([]);
const copied = ref("");

const config = reactive({
  step: 0.12,
  saturationScale: 1.0,
  count: 9 
});

const sliderDefinitions = {
  step: { label: "Lightness Interval", min: 0.05, max: 0.2, step: 0.01, unit: "" },
  saturationScale: { label: "Saturation Scale", min: 0.1, max: 2, step: 0.1, unit: "x" },
  count: { label: "Color Steps", min: 5, max: 11, step: 2, unit: " swatches" }
};

const update = () => {
  let val = hexInput.value.trim();
  
  // Tự động thêm # nếu thiếu
  if (val && !val.startsWith('#')) {
    val = '#' + val;
    hexInput.value = val;
  }
  
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(val)) {
    palette.value = generateCustomPalette(val, config);
  }
};

const copy = (color) => {
  navigator.clipboard.writeText(color);
  copied.value = color;
  setTimeout(() => (copied.value = ""), 2000);
};

const exportCSS = () => {
  const css = generateCssVariables(palette.value);
  navigator.clipboard.writeText(css);
  alert("CSS Variables đã được copy vào clipboard!");
};

onMounted(update);
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { transform: translateY(100px) scale(0.8); opacity: 0; }
.toast-leave-to { transform: translateY(20px) scale(0.8); opacity: 0; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0b0e14; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #2dd4bf; }
</style>
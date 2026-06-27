<template>
  <div class="p-6 space-y-4">
    <!-- HEADER -->
    <div class="flex justify-between items-end flex-wrap gap-4">
      <div>
        <h2 class="text-xl font-black text-white uppercase">
          Color Texture Exporter
        </h2>
        <p class="text-sm text-gray-400">
          <!-- 2048x2048 | 16x14 grid | Safe export -->
          2048x2048 | 30x24 grid | Safe export
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Zoom -->
        <input type="range" min="0.2" max="1" step="0.01" v-model="previewScale" />

        <!-- CLEAR -->
        <button @click="clearGrid" class="px-4 py-2 font-bold rounded-lg bg-red-500 text-white">
          🧹 CLEAR
        </button>

        <!-- EXPORT -->
        <!-- <button @click="generateSamplerateSamplePalette" class="px-4 py-2 font-bold rounded-lg"
          style="background:#14b8a6;color:#0b0e14;">
          Generate
        </button> -->

        <!-- EXPORT -->
        <button @click="exportToPNG" class="px-4 py-2 font-bold rounded-lg" style="background:#14b8a6;color:#0b0e14;">
          💾 EXPORT 2K
        </button>

      </div>
    </div>

    <!-- VIEWPORT -->
    <!-- <div class="flex justify-center overflow-auto border rounded-xl" style="background:#0b0e14; border-color:#1e293b;"> -->
    <div class="flex justify-center overflow-auto">
      <!-- SCALE WRAPPER -->
      <div class="origin-top" :style="{ transform: `scale(${previewScale})` }">

        <!-- EXPORT REGION -->
        <div ref="exportRegion" class="grid" :style="exportGridStyle">
          <div v-for="(color, index) in colorGrid" :key="index" @click="handleCellClick(index)"
            class="w-full h-full flex items-center justify-center cursor-pointer" :style="cellStyle(color)">
            <span class="data-html2canvas-ignore"
              style="font-size:10px;color:rgba(255,255,255,0.2);font-family:monospace;">
              {{ index + 1 }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import html2canvas from "html2canvas";
import { useTextureStore } from "../../../stores/textureStore";

const store = useTextureStore();

// const COLS = 16;
// const ROWS = 14;
const COLS = 30;
const ROWS = 24;

const defaultColor = "#1A1A1A";
const exportRegion = ref(null);

// Pinia state
const colorGrid = computed(() => store.grid);

// Zoom preview
const previewScale = ref(1);

// Grid gap
const gridGap = ref(0);

// Auto fit preview
const updateScale = () => {
  const padding = 40;
  // const padding = 10;
  const availableWidth = window.innerWidth - padding;
  previewScale.value = Math.min(1, availableWidth / 1024);
};

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScale);
});

// Grid style (QUAN TRỌNG)
const exportGridStyle = computed(() => ({
  // width: "1024px",
  // height: "1024px",
  width: "2048px",
  height: "2048px",
  background: "#000",
  // gap: `${gridGap.value}px`,
  gap: `0px`,
  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
  imageRendering: "pixelated"
}));

// Cell style
// const cellStyle = (color) => ({
//   backgroundColor: color || defaultColor
// });
// Cập nhật hàm cellStyle
const cellStyle = (data) => {
  // Nếu data là mảng, tạo CSS gradient
  if (Array.isArray(data) && data.length >= 2) {
    return {
      background: `linear-gradient(180deg, ${data[0]}, ${data[1]}) no-repeat`,

      //
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      border: 'none',
      display: 'block'
    };
  } else if (Array.isArray(data) && data.length == 1) {
    return {
      background: `linear-gradient(180deg, ${data[0]}, ${data[0]}) no-repeat`,

      //
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      border: 'none',
      display: 'block'
    };
  }

  // Nếu data là string (màu đơn), trả về màu thường
  return {
    background: null
  };
};

// Click cell
const handleCellClick = async (index) => {
  const current = colorGrid.value[index];

  if (current) {
    if (confirm(`Xóa màu ${current}?`)) {
      store.setCell(index, null);
    }
    return;
  }

  try {
    const text = await navigator.clipboard.readText();
    const hexRegex = /^#?([0-9A-F]{3}){1,2}$/i;

    if (hexRegex.test(text.trim())) {
      const hex = text.trim().startsWith("#")
        ? text.trim()
        : "#" + text.trim();

      store.setCell(index, [hex.toUpperCase()]);
    } else {
      alert("Clipboard không phải HEX hợp lệ!");
    }
  } catch {
    alert("Cần cấp quyền Clipboard!");
  }
};

const handleCellhandleCellParse = async (index, colors) => {

  try {

    const hexRegex = /^#?([0-9A-F]{3}){1,2}$/i;

    if (Array.isArray(colors)) {
      if (colors.length == 2) {
        // const [color1, color2] = colors;
        let color1 = colors[0];
        let color2 = colors[1];

        if (hexRegex.test(color1.trim()) && hexRegex.test(color1.trim())) {

          const hexColor1 = color1.trim().startsWith("#")
            ? color1.trim()
            : "#" + color1.trim();

          const hexColor2 = color2.trim().startsWith("#")
            ? color2.trim()
            : "#" + color2.trim();

          store.setCell(index, [hexColor1.toUpperCase(), hexColor2.toUpperCase()]);

        } else {
          alert("Clipboard không phải HEX hợp lệ!");
        }

      } else if (colors.length == 1) {
        let color1 = colors[0];

        if (hexRegex.test(color1.trim())) {

          const hexColor1 = color1.trim().startsWith("#")
            ? color1.trim()
            : "#" + color1.trim();

          store.setCell(index, [hexColor1.toUpperCase()]);

        } else {
          alert("Clipboard không phải HEX hợp lệ!");
        }
      }
    }

  } catch {
    alert("Cần cấp quyền Clipboard!");
  }
};

// CLEAR
const clearGrid = () => {
  if (confirm("Xóa toàn bộ bảng màu?")) {
    store.clearGrid();
  }
};

// EXPORT (luôn 2048x2048)
const exportToPNG = async () => {
  if (!exportRegion.value) return;

  try {
    const clone = exportRegion.value.cloneNode(true);

    clone.style.transform = "none";
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      backgroundColor: "#000",
      scale: 2, // 👈 1024 * 2 = 2048
      useCORS: true,
      allowTaint: true,
      logging: false,

      // foreignObjectRendering: true,

      ignoreElements: (el) =>
        el.classList.contains("data-html2canvas-ignore"),

      onclone: (doc) => {
        doc.querySelectorAll("*").forEach((el) => {
          const style = getComputedStyle(el);

          if (style.color.includes("oklch")) el.style.color = "#fff";
          if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#000";
          if (style.borderColor.includes("oklch")) el.style.borderColor = "#333";
          if (style.boxShadow.includes("oklch")) el.style.boxShadow = "none";

          if (style.backgroundRepeat.includes("oklch")) el.style.backgroundRepeat = "no-repeat";
          if (style.border.includes("oklch")) el.style.border = "none";

        });
      }
    });

    document.body.removeChild(clone);

    const link = document.createElement("a");
    link.download = `ColorMap_2048_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    console.log("✅ Export 2048x2048 thành công");
  } catch (err) {
    console.error("❌ Export lỗi:", err);
  }
};

const generateSamplerateSamplePalette = () => {
  const myGridData = generateSampleGrid();
  console.log(JSON.stringify(myGridData, null, 2));

  processGridData(colorGridFinal);
};

/**
 * Hàm duyệt qua grid để lấy thông tin chi tiết từng ô
 * @param {Array} gridData - Mảng 720 phần tử (tương đương 24 hàng x 30 cột)
 */
const processGridData = (gridData) => {
  console.log(`gridData Lenght ${gridData.length}`);

  let indexTo720 = 0;

  for (let index = 0; index < gridData.length; index++) {

    let cellData = gridData[index];
    console.log(`CellData ${cellData}`);

    indexTo720 = index;

    if (!cellData) {
      handleCellhandleCellParse(indexTo720, ["#FFFFFF"]);
    } else {
      handleCellhandleCellParse(indexTo720, cellData);
    }
  }
};



const generateSampleGrid = () => {

  const grid = Array(COLS * ROWS).fill(null);

  // Ví dụ: Điền một vài ô mẫu ở các vị trí khác nhau
  grid[0] = ["#FFFFFF"]; // Ô đầu tiên: Màu đơn
  grid[1] = ["#FF5733", "#33FF57"]; // Ô thứ 2: Gradient từ trên xuống dưới

  // Ví dụ: Điền một hàng gradient liên tiếp (Hàng 1, index 30-59)
  for (let i = 30; i < 60; i++) {
    grid[i] = ["#3357FF", "#F1C40F"];
  }

  // Ví dụ: Điền một vài ô ngẫu nhiên
  grid[719] = ["#FFFFFF"]; // Ô cuối cùng

  return grid;
};

const colorGridFinal = [
  ["#F3F2F3"], ["#C0BFC1"], ["#A0A0A0"], ["#85838E"], ["#72719D"], ["#646464"], ["#756487"], ["#7A80AB"], ["#A0C1E3"], ["#B8E5EC"],
  ["#F4FBF9"], ["#FEFCF6"], ["#F3E0D3"], ["#DDAAAA"], ["#A992AA"], ["#8E7A98"], ["#C2887F"], ["#D6BEB1"], ["#FCFAF7"], ["#F3EEE2"],
  ["#E8EDCE"], ["#C5D8B9"], ["#95B5B4"], ["#889787"], ["#BBAD88"], ["#E1E1D0"], ["#FDF8F7"], ["#F6E6F4"], ["#9D95A3"], ["#ffffff"],

  ["#DFDEDF"], ["#ACAAAD"], ["#8C8C8C"], ["#706F7A"], ["#5F5D87"], ["#505050"], ["#605370"], ["#62699A"], ["#81ACDA"], ["#98D9E3"],
  ["#D6F0E9"], ["#FCF8E9"], ["#EACAB3"], ["#D18C8E"], ["#977B98"], ["#7A6683"], ["#B56F63"], ["#C8A796"], ["#FAF6F2"], ["#ECE3D0"],
  ["#DAE2B0"], ["#AFC99E"], ["#7DA4A3"], ["#738472"], ["#AC9C6E"], ["#D1D1B7"], ["#FDF8F7"], ["#EBC9E7"], ["#897F90"], ["#587175"],

  ["#CAC9CB"], ["#979699"], ["#777777"], ["#5D5B64"], ["#4E4D6F"], ["#3B3B3B"], ["#4C4158"], ["#525881"], ["#6198D0"], ["#78CEDB"],
  ["#B8E6D9"], ["#F7ECC5"], ["#E1B393"], ["#C66F71"], ["#836784"], ["#64546C"], ["#A2594D"], ["#BA917C"], ["#F0E0D4"], ["#E5D8BD"],
  ["#CDD792"], ["#9ABB84"], ["#669291"], ["#606E5F"], ["#998858"], ["#C1C19E"], ["#F7E3E1"], ["#E0ABD9"], ["#756B7B"], ["#3d4b52"],

  ["#B6B4B7"], ["#838185"], ["#636363"], ["#49484F"], ["#3D3C57"], ["#272727"], ["#383041"], ["#424768"], ["#4283C7"], ["#58C2D2"],
  ["#9ADBC9"], ["#F2E0A1"], ["#D89D73"], ["#BA5254"], ["#6C556D"], ["#4F4255"], ["#864A40"], ["#AC7A61"], ["#E5CBB6"], ["#DECDAB"],
  ["#BFCC74"], ["#84AC6A"], ["#557A79"], ["#4D584C"], ["#7F7149"], ["#B1B185"], ["#EEC6C1"], ["#D58DCC"], ["#605865"], ["#263239"],

  ["#A29FA3"], ["#6F6D70"], ["#4F4F4F"], ["#35353A"], ["#2C2B3F"], ["#131313"], ["#241F2A"], ["#32364F"], ["#336FAD"], ["#38B6C9"],
  ["#7CD0B9"], ["#EDD47D"], ["#CF8753"], ["#A24143"], ["#554356"], ["#3A303E"], ["#6A3B33"], ["#96664F"], ["#DAB698"], ["#D6C299"],
  ["#B1C156"], ["#6F9855"], ["#446261"], ["#3A4239"], ["#655A3A"], ["#A1A16C"], ["#E5A9A1"], ["#CA6FBF"], ["#4B454F"], ["#1c222c"],

  ["#8D8A8F"], ["#5A595C"], ["#3A3A3A"], ["#222124"], ["#1B1B27"], ["#0E0E0E"], ["#100D12"], ["#222536"], ["#2A5B8D"], ["#2E9AAA"],
  ["#5EC6A9"], ["#E8C859"], ["#C37136"], ["#853537"], ["#3F313F"], ["#241E27"], ["#4F2C26"], ["#7B5441"], ["#D0A07A"], ["#CFB787"],
  ["#9EAE40"], ["#5C7E46"], ["#334A49"], ["#272C26"], ["#4B432B"], ["#8B8B59"], ["#DC8B81"], ["#BF51B1"], ["#373239"], ["#181b24"],

  ["#79767B"], ["#464547"], ["#262626"], ["#0E0E0F"], ["#0F0E1F"], ["#050505"], ["#050406"], ["#12141D"], ["#21466E"], ["#257D8A"],
  ["#42B998"], ["#E3BD35"], ["#A35E2D"], ["#682A2B"], ["#281F28"], ["#1A151C"], ["#331C18"], ["#604232"], ["#C58B5C"], ["#C8AC75"],
  ["#839135"], ["#496438"], ["#233231"], ["#141613"], ["#312C1C"], ["#727249"], ["#D46E61"], ["#A93E9C"], ["#221F24"], ["#12121a"],

  ///

  ["#B7B3B9"], ["#B6B4B8"], ["#C9C9C9"], ["#ACAAB9"], ["#9492CD"], ["#C0C0C0"], ["#D1C4DF"], ["#9DA5D9"], ["#70B6FF"], ["#91F1FF"],
  ["#79FCD8"], ["#FFE794"], ["#FF964C"], ["#F57D7F"], ["#D4B9D5"], ["#B99EC5"], ["#EFAEA3"], ["#E5AB8E"], ["#FDC89F"], ["#F5CE80"],
  ["#F0FCAA"], ["#B6E399"], ["#BCDFDE"], ["#AFC2AE"], ["#E7D8AD"], ["#E4E4B8"], ["#FFB9B0"], ["#FDCBF7"], ["#C6BCCD"], ["#f1e0cd"],
  ["#847D88"], ["#837F87"], ["#969696"], ["#76738A"], ["#524FAA"], ["#8D8D8D"], ["#9D81BC"], ["#5361BD"], ["#0A82FF"], ["#2BE3FF"],
  ["#16F9BA"], ["#FFD12E"], ["#E55F00"], ["#EE1E22"], ["#AC7AAE"], ["#8A5F9E"], ["#E0614C"], ["#D26E3B"], ["#FA903B"], ["#EEAA21"],
  ["#DEF848"], ["#7DCD49"], ["#77BEBC"], ["#769773"], ["#CFB25F"], ["#C7C76F"], ["#FF5E4A"], ["#F969E7"], ["#9582A1"], ["#ffa49a"],
  ["#514C53"], ["#504D53"], ["#636363"], ["#464553"], ["#312F64"], ["#5A5A5A"], ["#6A4B8C"], ["#2F397B"], ["#0050A3"], ["#00AAC4"],
  ["#04A578"], ["#C79B00"], ["#7F3500"], ["#9A0C0E"], ["#774979"], ["#52395F"], ["#A9311D"], ["#874220"], ["#CA5D05"], ["#9D6D0C"],
  ["#B4D208"], ["#4D8A26"], ["#428D8B"], ["#485E46"], ["#9A7E2E"], ["#96963A"], ["#E31900"], ["#F20AD5"], ["#62526C"], ["#da3467"],

  ///

  ["#181f39"], ["#263a5f"], ["#3c5e8b"], ["#508fba"], ["#73bed3"], ["#a5dddc"], ["#19342d"], ["#26562e"], ["#478232"], ["#75a843"],
  ["#a8ca59"], ["#d0da91"], ["#4c2b32"], ["#7a4841"], ["#ad7657"], ["#c09372"], ["#d7b494"], ["#e7d4b3"], ["#321b25"], ["#5b2b2a"],
  ["#84492b"], ["#ba742a"], ["#d4963f"], ["#d9b669"], ["#9c2e2e"], ["#c55339"], ["#d0803b"], ["#e78d5b"], ["#c66f5e"], ["#c23847"],

  ["#1d1d39"], ["#402751"], ["#402751"], ["#a33e8c"], ["#c65197"], ["#df84a5"], ["#3f4328"], ["#5e7032"], ["#94ad38"], ["#c2d650"],
  ["#eff37b"], ["#e2e5ac"], ["#191f2d"], ["#282e3c"], ["#343f41"], ["#4e6659"], ["#749a71"], ["#a6c67d"], ["#1d314a"], ["#2f4c6c"],
  ["#3e80a3"], ["#63c4cb"], ["#9be5d6"], ["#e5eff0"], ["#ece8c2"], ["#6db7c2"], ["#5f80b3"], ["#627057"], ["#8ca24f"], ["#d2cb3d"],

  ["#0a0a14"], ["#10141f"], ["#151d28"], ["#202e37"], ["#394a51"], ["#567276"], ["#819795"], ["#a9b5b3"], ["#c6cfcc"], ["#ebede8"],
  ["#2b4a78"], ["#3875a1"], ["#53a5df"], ["#abd6f6"], ["#f1ffff"], ["#19232c"], ["#1a303d"], ["#164555"], ["#0e5f74"], ["#0a758d"],
  ["#2f8383"], ["#4c9278"], ["#79a56a"], ["#adb957"], ["#dece3a"], ["#fbda01"], ["#ffeb54"], ["#fff280"], ["#fef7a7"], ["#fffbce"],

  ["#131313"], ["#1b1b1b"], ["#272727"], ["#3d3d3d"], ["#5d5d5d"], ["#1c121b"], ["#391f22"], ["#5d2c28"], ["#8a4937"], ["#bf6f4a"],
  ["#423934"], ["#5a4d44"], ["#786755"], ["#a08663"], ["#c8b08c"], ["#451d42"], ["#611e4a"], ["#811f4e"], ["#ad2f45"], ["#df523e"],
  ["#e67839"], ["#fe9166"], ["#ea564a"], ["#e53b44"], ["#b3202a"], ["#df3e22"], ["#fa6a0a"], ["#f9a31a"], ["#ffd541"], ["#fffc3f"],

  ///

  ["#213e40"], ["#2d5d44"], ["#43884c"], ["#8fde64"], ["#ceff77"], ["#2c533e"], ["#267a41"], ["#269f38"], ["#5dc141"], ["#9bdb4f"],
  ["#1e4d4e"], ["#21333f"], ["#3b9750"], ["#5ec655"], ["#99e766"], ["#5f3a60"], ["#876672"], ["#b7a39d"], ["#ece8c2"], ["#6db7c3"],
  ["#5e80b2"], ["#627057"], ["#8da24e"], ["#d2cb3e"], ["#f7d554"], ["#e8bf92"], ["#e78c5b"], ["#c66f5e"], ["#c33846"], ["#933942"],

  ["#ede4da"], ["#bfb8b4"], ["#918d8d"], ["#636167"], ["#353540"], ["#a94949"], ["#ca5954"], ["#e56f4b"], ["#e39347"], ["#eeb551"],
  ["#e8c65b"], ["#bda351"], ["#8b9150"], ["#557d55"], ["#446350"], ["#3e554c"], ["#8bb0ad"], ["#769fa6"], ["#668da9"], ["#5c699f"],
  ["#5a5888"], ["#7c6da2"], ["#947a9d"], ["#d4c2b6"], ["#bdaa97"], ["#86735b"], ["#7e674c"], ["#735b42"], ["#604b3d"], ["#4d3f38"],

  ["#73172d"], ["#b4202a"], ["#df3e23"], ["#fa6a0a"], ["#f9a31b"], ["#ffd541"], ["#fffc40"], ["#d6f264"], ["#9cdb43"], ["#59c135"],
  ["#14a02e"], ["#1a7a3e"], ["#24523b"], ["#143464"], ["#285cc4"], ["#249fde"], ["#20d6c7"], ["#a6fcdb"], ["#fef3c0"], ["#fad6b8"],
  ["#f5a097"], ["#e86a73"], ["#bc4a9b"], ["#793a80"], ["#403353"], ["#242234"], ["#322b28"], ["#71413b"], ["#bb7547"], ["#dba463"],

  ///
  /// Gradients 
  ///

  ["#f7bcbd", "#fdf8f9"], ["#789f49", "#bee474"], ["#b48149", "#d3a45d"], ["#e9eba7", "#c0d568"], ["#e4eda8", "#8cd9f9"],
  ["#65a1fa", "#8bd6fc"], ["#fdf3bd", "#fce99d"], ["#f2693c", "#fdf5bb"], ["#f4693b", "#cb4826"], ["#78c2dc", "#5ad4a1"],
  ["#fbb962", "#d85536"], ["#c8ee86", "#5ad7a3"], ["#3f501e", "#5e7d40"], ["#cdd8b4", "#e7eca2"], ["#f9d889", "#c75b34"],
  ["#f17b62", "#ab6848"], ["#3f576a", "#4c4a4e"], ["#c4f6f7", "#f7fef7"], ["#6a4a97", "#9b74da"], ["#567cb3", "#6685ce"],
  ["#afa9e2", "#7967cc"], ["#b3aae2", "#eeb491"], ["#edb86f", "#f3b298"], ["#c1caf8", "#9fb0f4"], ["#50b2e7", "#c3c7f9"],
  ["#50b2e7", "#3594c0"], ["#cf8e79", "#ca5582"], ["#70a3ec", "#379ece"], ["#a683e4", "#cb5985"], ["#2c1b4c", "#5c4276"],


  ["#5a6bf9", "#55fcfd"], ["#a94899", "#fb5588"], ["#686c9a", "#6f6a96"], ["#88eba2", "#5c958f"], ["#64e0fb", "#61c7fc"],
  ["#7cb498", "#cabc6b"], ["#dbc4d6", "#b5ebfe"], ["#fdfbb1", "#feffd9"], ["#538fa7", "#64b1c3"], ["#89e0bc", "#4661a6"],
  ["#f1b94f", "#fcfe95"], ["#9e8c85", "#faceae"], ["#a582ab", "#83698d"], ["#74aebc", "#fc85aa"], ["#4e465c", "#bc4245"],
  ["#255a4d", "#239491"], ["#6e677e", "#c3b3cc"], ["#78bc79", "#cd6561"], ["#ecdb64", "#ee4d51"], ["#53a460", "#71f1c1"],
  ["#97936d", "#939671"], ["#e486c8", "#905b5f"], ["#ec7969", "#ed8d63"], ["#ae7b94", "#707ac2"], ["#c8dbc8", "#fbc6ba"],
  ["#b2b0f6", "#dddcf8"], ["#a66c58", "#bf7564"], ["#d788ab", "#a1844a"], ["#5e85e3", "#9b96f4"], ["#8a989a", "#b4d5f0"],


  ["#276157", "#246a52"], ["#2c3c3b", "#72a0b5"], ["#767251", "#9cbe76"], ["#328eaa", "#4ebefd"], ["#7b00a0", "#4b0f65"],
  ["#49166a", "#68c6fd"], ["#68127f", "#a70067"], ["#1f2251", "#0a0926"], ["#6631ab", "#4d4099"], ["#5e3963", "#6b265d"],
  ["#233b76", "#4269c8"], ["#944f2b", "#fad662"], ["#35150e", "#732d1e"], ["#783e32", "#504139"], ["#29363a", "#5a9ea5"],
  ["#4e796c", "#287eae"], ["#939393", "#fafcfb"], ["#5c2531", "#632c45"], ["#3c2f2f", "#b18174"], ["#565776", "#947ab3"],
  ["#a04432", "#ec784e"], ["#3d9927", "#356420"], ["#3b6623", "#e9936e"], ["#347822", "#299f56"], ["#4e4722", "#23240b"],
  ["#7aa944", "#929d42"], ["#446140", "#2d653e"], ["#6f5325", "#be924b"], ["#386d8e", "#617cf0"], ["#122c32", "#2c5f69"],


  ["#c3a270", "#93aa6c"], ["#523f4e", "#393239"], ["#2a2c20", "#796a59"], ["#ccf0b7", "#acec91"], ["#d7a928", "#c09227"],
  ["#b9713f", "#b26435"], ["#70721d", "#f4e542"], ["#502e13", "#b05e20"], ["#f6dd35", "#331e2c"], ["#fad9af", "#ba815d"],
  ["#fae23d", "#1d4990"], ["#874d29", "#fbd88c"], ["#90753f", "#8d7843"], ["#576f5a", "#bdb99a"], ["#ba3834", "#392619"],
  ["#3b74a1", "#e0bed7"], ["#d798c1", "#ede0e9"], ["#c4b482", "#a38473"], ["#7791be", "#7c6ea1"], ["#3f5147", "#343934"],
  ["#22202b", "#5d6c78"], ["#dcb6e6", "#bd87e3"], ["#304bc8", "#2f4bb3"], ["#4d82b1", "#3c78ab"], ["#142a4d", "#2657a6"],
  ["#2c25e6", "#1f3323"], ["#b1d1f6", "#6392b3"], ["#2d25e8", "#834a20"], ["#315a82", "#96b1f2"], ["#465b8b", "#455a8a"],


  ["#68584e", "#423a34"], ["#e6d6e3", "#5a6875"], ["#e77f51", "#f9bb8a"], ["#a99c62", "#afa463"], ["#c4d0d0", "#f4feff"],
  ["#becbc2", "#e8c8bd"], ["#2c794c", "#98fce3"], ["#a5c0a1", "#eac781"], ["#8c8a64", "#b6c364"], ["#1e5826", "#5d8d5a"],
  ["#69fece", "#fafde9"], ["#caf645", "#2b5013"], ["#f9be53", "#f68139"], ["#fcfed3", "#91b7a6"], ["#3b6d8a", "#3e6e89"],
  ["#faca8e", "#fbfed9"], ["#d78851", "#f77cca"], ["#454e54", "#677272"], ["#516267", "#333d45"], ["#dae4dc", "#706859"],
  ["#59afdc", "#90c0ec"], ["#6172a7", "#5f69a7"], ["#cfc7c5", "#fcf3f2"], ["#c8c3ca", "#bad8e0"], ["#712a51", "#ed8fa0"],
  ["#b9a0be", "#8aa9e7"], ["#6b6c8a", "#7769bd"], ["#4d1f4f", "#8a5885"], ["#f2638f", "#f1e9f9"], ["#5b85f1", "#479eed"],


  ["#c2b7da", "#a49fe1"], ["#8facf5", "#4b98b6"], ["#66c7d9", "#477494"], ["#695240", "#4f4f48"], ["#1a4f38", "#1f1d13"],
  ["#90ad88", "#7d9475"], ["#b68578", "#94f3d5"], ["#565e4b", "#4fb8b3"], ["#7a7f6a", "#c0c9b6"], ["#b57bb4", "#6ec0c5"],
  ["#87593f", "#875b41"], ["#376874", "#2e5f69"], ["#3b2d27", "#985754"], ["#754f5c", "#a15633"], ["#929292", "#fafeff"],
  ["#6b566a", "#9da0bd"], ["#3bb3b7", "#21323b"], ["#99623f", "#c1e0c9"], ["#9ed5b2", "#e3eee5"], ["#8994bd", "#7998a6"],
  ["#d9d8fa", "#b1929f"], ["#88553a", "#855641"], ["#91b4ef", "#d7d6fc"], ["#579bcc", "#8bf3b7"], ["#504644", "#6f6562"],
  ["#d0cdc7", "#fbf8f3"], ["#be9479", "#c59b80"], ["#e08e5d", "#f6bd9d"], ["#e0ddd8", "#6f6258"], ["#6a5a52", "#433a38"],


  ["#070707", "#0a0a0a"], ["#131313", "#161616"], ["#222222", "#272727"], ["#191919", "#1a1a1a"], ["#404040", "#2f2f2f"],
  ["#3c3c3c", "#333333"], ["#4c4c4c", "#1c1c1c"], ["#535353", "#676767"], ["#222222", "#3b3b3b"], ["#494949", "#606060"],
  ["#696969", "#757575"], ["#3b3b3b", "#868686"], ["#898886", "#8e8e8e"], ["#979998", "#b9b9ba"], ["#7b7b7d", "#808080"],
  ["#838481", "#a9aaaa"], ["#c9c8ca", "#5c5c5c"], ["#595959", "#3b3b3b"], ["#524b46", "#787370"], ["#dc8c5e", "#e5a37a"],
  ["#f6cbb1", "#fefbf6"], ["#fdf9f6", "#b8a99a"], ["#f9bd98", "#f19058"], ["#f9cdb1", "#603724"], ["#c1afa4", "#fdfaf5"],
  ["#583a2a", "#917662"], ["#968578", "#e3ac87"], ["#c1afa4", "#f6c0a1"], ["#7f563b", "#fdd3bc"], ["#c8c6c1", "#e2ccbe"]
];

</script>
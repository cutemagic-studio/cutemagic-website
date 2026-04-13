/**
 * CHROMAFORGE UTILS - colorHelper.js
 * Thư viện xử lý màu sắc chuyên nghiệp cho Palette Generator
 */

// 1. CHUYỂN ĐỔI CƠ BẢN (CONVERTERS)

export function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// RGB [0-255] -> HSL [0-1]
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 1); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

// HSL [0-1] -> RGB [0-255]
export function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

// 2. LOGIC BỔ TRỢ (HELPERS)

export function isLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Sử dụng công thức HSP (Highly Sensitive Perceptual) để tính độ sáng mắt người cảm nhận
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

/**
 * Hòa trộn 2 màu theo tỷ lệ (weight từ 0-1)
 * Giống hàm mix() của Sass
 */
function mix(color1, color2, weight) {
  const p = weight;
  const w = p * 2 - 1;
  const a = 0; 
  
  const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
  const w2 = 1 - w1;

  return {
    r: color1.r * w1 + color2.r * w2,
    g: color1.g * w1 + color2.g * w2,
    b: color1.b * w1 + color2.b * w2
  };
}

// 3. THUẬT TOÁN TẠO DẢI MÀU (GENERATORS)

/**
 * Thuật toán 1: Tints & Shades (Hòa trộn trắng đen)
 * Đảm bảo màu sắc giữ đúng gốc, không bị lệch tông
 */
export function generateTintsAndShades(hex) {
  const color = hexToRgb(hex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  return [
    rgbToHex(mix(white, color, 0.9).r, mix(white, color, 0.9).g, mix(white, color, 0.9).b),
    rgbToHex(mix(white, color, 0.6).r, mix(white, color, 0.6).g, mix(white, color, 0.6).b),
    rgbToHex(mix(white, color, 0.3).r, mix(white, color, 0.3).g, mix(white, color, 0.3).b),
    hex.toUpperCase().startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`,
    rgbToHex(mix(black, color, 0.3).r, mix(black, color, 0.3).g, mix(black, color, 0.3).b),
    rgbToHex(mix(black, color, 0.6).r, mix(black, color, 0.6).g, mix(black, color, 0.6).b),
    rgbToHex(mix(black, color, 0.8).r, mix(black, color, 0.8).g, mix(black, color, 0.8).b),
  ];
}

/**
 * Thuật toán 2: Custom HSL Palette (Dùng cho Slider)
 * Cho phép điều chỉnh sâu độ tươi và khoảng cách độ sáng
 */
export function generateCustomPalette(hex, config) {
  const { r, g, b } = hexToRgb(hex);
  const baseHsl = rgbToHsl(r, g, b);
  const { step, saturationScale, count } = config;
  
  const palette = [];
  const middleIndex = Math.floor(count / 2);

  for (let i = 0; i < count; i++) {
    const diff = i - middleIndex;
    
    // Tính toán độ sáng (Lightness)
    let newL = baseHsl.l - (diff * step);
    newL = Math.min(0.98, Math.max(0.02, newL));

    // Tính toán độ bão hòa (Saturation)
    let newS = baseHsl.s * saturationScale;
    newS = Math.min(1, Math.max(0, newS));

    const rgb = hslToRgb(baseHsl.h, newS, newL);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  // Đảo ngược mảng để Sáng -> Tối
  return palette.reverse();
}

/**
 * Xuất biến CSS cho Developer
 */
export function generateCssVariables(palette) {
  return palette.map((color, i) => {
    const weight = (i + 1) * 100;
    return `--color-primary-${weight}: ${color};`;
  }).join('\n');
}
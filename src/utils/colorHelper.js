/**
 * CHROMAFORGE UTILS - colorHelper.js
 * Thư viện xử lý màu sắc chuyên nghiệp cho Palette Generator
 */

// --- 1. CONVERTERS (Chuyển đổi hệ màu) ---

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

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break; // Đã sửa lỗi màu vàng
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

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

// --- 2. HELPERS (Logic bổ trợ) ---

export function isLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Công thức HSP (Highly Sensitive Perceptual) cho độ sáng thực tế
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

function mix(color1, color2, weight) {
  return {
    r: color1.r * (1 - weight) + color2.r * weight,
    g: color1.g * (1 - weight) + color2.g * weight,
    b: color1.b * (1 - weight) + color2.b * weight
  };
}

// --- 3. GENERATORS (Thuật toán tạo dải màu) ---

/**
 * Thuật toán Center-Anchor: Giữ màu gốc ở giữa, tỏa đều ra 2 bên
 */
export function generateCustomPalette(hex, config) {
  const { r, g, b } = hexToRgb(hex);
  const baseHsl = rgbToHsl(r, g, b);
  const { step, saturationScale, count } = config;
  
  const palette = [];
  const middleIndex = Math.floor(count / 2);

  for (let i = 0; i < count; i++) {
    const distance = i - middleIndex;
    
    // Tính toán Lightness dựa trên điểm neo trung tâm
    let newL = baseHsl.l - (distance * step); 
    newL = Math.min(0.98, Math.max(0.02, newL));

    // Tính toán Saturation linh hoạt
    let newS = baseHsl.s * saturationScale;
    newS = Math.min(1, Math.max(0, newS));

    const rgb = hslToRgb(baseHsl.h, newS, newL);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  return palette;
}

/**
 * Thuật toán Tints & Shades: Hòa trộn trắng/đen truyền thống
 */
export function generateTintsAndShades(hex) {
  const color = hexToRgb(hex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const safeHex = hex.toUpperCase().startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;

  return [
    rgbToHex(mix(white, color, 0.9).r, mix(white, color, 0.9).g, mix(white, color, 0.9).b),
    rgbToHex(mix(white, color, 0.6).r, mix(white, color, 0.6).g, mix(white, color, 0.6).b),
    rgbToHex(mix(white, color, 0.3).r, mix(white, color, 0.3).g, mix(white, color, 0.3).b),
    safeHex,
    rgbToHex(mix(black, color, 0.3).r, mix(black, color, 0.3).g, mix(black, color, 0.3).b),
    rgbToHex(mix(black, color, 0.6).r, mix(black, color, 0.6).g, mix(black, color, 0.6).b),
    rgbToHex(mix(black, color, 0.8).r, mix(black, color, 0.8).g, mix(black, color, 0.8).b),
  ];
}

/**
 * Xuất biến CSS
 */
export function generateCssVariables(palette) {
  return palette.map((color, i) => {
    const weight = (i + 1) * 100;
    return `--color-primary-${weight}: ${color};`;
  }).join('\n');
}
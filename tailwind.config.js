// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: 'class',
//   content: [
//     "./index.html",
//     "./src/**/*.{vue,js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // [CẬP NHẬT MỚI]: Ép Tailwind luôn biên dịch mọi class thuộc về theme CMG
  safelist: [
    {
      pattern: /(bg|text|border|rounded|p|m|gap|duration|shadow)-cmg-/,
      variants: ['hover', 'focus', 'active', 'dark'],
    }
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 1. MÀU SẮC TỪ PINIA
      colors: {
        cmg: {
          body: 'var(--cmg-bg-body)',
          surface: 'var(--cmg-bg-surface)',
          card: 'var(--cmg-bg-card)',
          elevated: 'var(--cmg-bg-elevated)',
          
          title: 'var(--cmg-text-title)',
          'label-color': 'var(--cmg-text-label)',
          'content-color': 'var(--cmg-text-content)',
          muted: 'var(--cmg-text-muted)',

          btn: 'var(--cmg-btn-bg)',
          'btn-text': 'var(--cmg-btn-text)',
          'btn-border': 'var(--cmg-btn-border)',
          'btn-hover': 'var(--cmg-btn-hover-bg)',
          'btn-hover-text': 'var(--cmg-btn-hover-text)',
          'btn-hover-border': 'var(--cmg-btn-hover-border)',
          'btn-active': 'var(--cmg-btn-active-bg)',
          'btn-active-text': 'var(--cmg-btn-active-text)',
          'btn-active-border': 'var(--cmg-btn-active-border)',

          subtle: 'var(--cmg-border-subtle)',
          strong: 'var(--cmg-border-strong)',
        }
      },

      // 2. FONT SIZE TỪ PINIA
      fontSize: {
        'cmg-hero': 'var(--cmg-fs-hero)',
        'cmg-section': 'var(--cmg-fs-section)',
        'cmg-card': 'var(--cmg-fs-card)',
        'cmg-label': 'var(--cmg-fs-label)',
        'cmg-content': 'var(--cmg-fs-content)',
        'cmg-small': 'var(--cmg-fs-small)',
      },

      // 3. PADDING / MARGIN / GAP TỪ PINIA
      spacing: {
        'cmg-container-x': 'var(--cmg-sp-container-x)',
        'cmg-section-y': 'var(--cmg-sp-section-y)',
        'cmg-panel': 'var(--cmg-sp-panel)',
        'cmg-card': 'var(--cmg-sp-card)',
        'cmg-grid-gap': 'var(--cmg-sp-grid-gap)',
      },

      // 4. BO GÓC TỪ PINIA
      borderRadius: {
        'cmg-panel': 'var(--cmg-radius-panel)',
        'cmg-btn': 'var(--cmg-radius-btn)',
      },

      // 5. THỜI GIAN HOẠT ẢNH TỪ PINIA
      transitionDuration: {
        'cmg-fast': 'var(--cmg-dur-fast)',
        'cmg-normal': 'var(--cmg-dur-normal)',
        'cmg-slow': 'var(--cmg-dur-slow)',
        'cmg-zoom': 'var(--cmg-dur-zoom)',
      }
    },
  },
  plugins: [],
}
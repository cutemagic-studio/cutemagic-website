// src/stores/useThemeStore.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// Cấu hình mặc định (Có thể tách ra file JSON hoặc gọi từ API sau này)
const defaultThemes = {
    dark: {
        backgrounds: {
            body: '#0b0e14',
            surface: '#161a23',
            card: '#1e1e1e',
            elevated: '#1e293b',
        },
        typography: {
            titleColor: '#ffffff',
            labelColor: '#9ca3af',
            contentColor: '#d1d5db',
            mutedColor: '#6b7280',
        },
        buttons: {
            bg: '#1e293b',
            text: '#d1d5db',
            border: '#334155',
            hoverBg: '#32CD32',
            hoverText: '#ffffff',
            hoverBorder: '#32CD32',
            activeBg: '#2563eb',
            activeText: '#ffffff',
            activeBorder: '#2563eb',
        },
        borders: {
            subtle: 'rgba(255, 255, 255, 0.08)',
            strong: '#334155',
            dashed: 'rgba(59, 130, 246, 0.5)',
        }
    },
    light: {
        backgrounds: {
            body: '#f8fafc',
            surface: '#ffffff',
            card: '#ffffff',
            elevated: '#f1f5f9',
        },
        typography: {
            titleColor: '#0f172a',
            labelColor: '#475569',
            contentColor: '#334155',
            mutedColor: '#94a3b8',
        },
        buttons: {
            bg: '#f3f4f6',
            text: '#374151',
            border: '#e5e7eb',
            hoverBg: '#32CD32',
            hoverText: '#ffffff',
            hoverBorder: '#32CD32',
            activeBg: '#2563eb',
            activeText: '#ffffff',
            activeBorder: '#2563eb',
        },
        borders: {
            subtle: '#e2e8f0',
            strong: '#cbd5e1',
            dashed: 'rgba(59, 130, 246, 0.8)',
        }
    }
}

export const useThemeStore = defineStore('theme', () => {
    // ====================================================
    // 1. STATE: TRẠNG THÁI CHẾ ĐỘ & BẢNG MÀU
    // ====================================================
    const mode = ref(localStorage.getItem('cmg_theme_mode') || 'dark')
    
    // Lấy bảng màu theo mode hiện tại (cho phép chỉnh sửa sâu từng thuộc tính)
    const palette = ref(JSON.parse(JSON.stringify(defaultThemes[mode.value])))

    // ====================================================
    // 2. STATE: KÍCH THƯỚC CHỮ (FONT SIZES)
    // ====================================================
    const fontSizes = ref({
        heroTitle: '2.25rem',   // 36px (Tiêu đề trang lớn như "Asset Library")
        sectionTitle: '1.25rem',// 20px (Tiêu đề khu vực)
        cardTitle: '1rem',      // 16px (Tên pack trong Card)
        label: '0.6875rem',     // 11px (Các chữ TÌM KIẾM, DANH MỤC, LỌC THEO GIÁ)
        content: '0.875rem',    // 14px (Nội dung văn bản, nút bấm, mô tả)
        small: '0.75rem',       // 12px (Chú thích nhỏ, tag)
    })

    // ====================================================
    // 3. STATE: KHOẢNG CÁCH BỐ CỤC (PADDING, MARGIN, GAP, RADIUS)
    // ====================================================
    const spacing = ref({
        containerPaddingX: '1.5rem', // 24px (px-6)
        sectionMarginY: '2.5rem',    // 40px (mb-10)
        panelPadding: '1rem',        // 16px (p-4 cho các khối Sidebar, Toolbar)
        cardPadding: '1rem',         // 16px (p-4 cho phần text của AssetCard)
        gridGap: '1.5rem',           // 24px (gap-6 giữa các AssetCard)
        panelRadius: '1rem',         // 16px (rounded-2xl)
        buttonRadius: '0.75rem',     // 12px (rounded-xl)
    })

    // ====================================================
    // 4. STATE: THỜI GIAN HOẠT ẢNH (ANIMATION DURATIONS)
    // ====================================================
    const animations = ref({
        fast: '200ms',      // Đổi màu chữ/nền nhẹ
        normal: '300ms',    // Hover nút bấm, đóng/mở Mega Menu, chuyển tab
        slow: '500ms',      // Chuyển đổi layout Grid 3 cột <-> 4 cột
        imageZoom: '700ms', // Hiệu ứng phóng to ảnh Thumbnail khi hover card
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    })

    // ====================================================
    // 5. GETTERS: CÁC PRESET CLASS DÙNG NHANH TRONG TEMPLATE
    // ====================================================
    // Giúp gom các class lặp đi lặp lại thành 1 biến duy nhất
    const ui = computed(() => ({
        // Style chuẩn cho nút công cụ (Back, Grid 3/4, Mở bộ lọc...)
        actionBtn: 'bg-cmg-btn text-cmg-btn-text border border-cmg-btn-border hover:bg-cmg-btn-hover hover:text-cmg-btn-hover-text hover:border-cmg-btn-hover-border rounded-cmg-btn transition-all duration-cmg-normal cursor-pointer',
        actionBtnActive: 'bg-cmg-btn-active text-cmg-btn-active-text border border-cmg-btn-active-border rounded-cmg-btn shadow-md transition-all duration-cmg-normal cursor-pointer',
        // Style chuẩn cho các hộp Panel (Sidebar box, Toolbar)
        panelBox: 'bg-cmg-surface p-cmg-panel rounded-cmg-panel border border-cmg-subtle shadow-sm transition-colors duration-cmg-normal',
        // Style chuẩn cho Typography
        pageTitle: 'text-cmg-hero font-black text-cmg-title tracking-tight',
        boxLabel: 'text-cmg-label font-bold text-cmg-label-color uppercase tracking-wider',
        bodyText: 'text-cmg-content text-cmg-content-color',

        // bg-[#ECECEC] dark:bg-[#1e1e1e] hover:bg-[#32CD32] dark:hover:bg-[#32CD32]
        // text-[#F5FFFA] dark:text-[#F5FFFA] hover:text-[#32CD32] dark:hover:text-[#32CD32]
        // buttonRoundedBorder: 'p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#32CD32] dark:hover:bg-[#32CD32] dark:bg-slate-800 dark:text-gray-300 dark:hover:text-white  transition-colors cursor-pointer shadow-sm group',

        buttonRoundedBorderBlue: 'border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:border-[#1E90FF] dark:hover:border-[#1E90FF] bg-[#FFFFFF] dark:bg-[#1e1e1e] hover:bg-[#FFFFFF] dark:hover:bg-[#1e1e1e] p-2.5 rounded-xl text-[#1e1e1e] dark:text-[#ECECEC] hover:text-[#1E90FF] dark:hover:text-[#1E90FF] transition-colors cursor-pointer shadow-sm group',
        buttonRoundedBorderGreen: 'border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:border-[#00EE76] dark:hover:border-[#00EE76] bg-[#FFFFFF] dark:bg-[#1e1e1e] hover:bg-[#FFFFFF] dark:hover:bg-[#1e1e1e] p-2.5 rounded-xl text-[#1e1e1e] dark:text-[#ECECEC] hover:text-[#00EE76] dark:hover:text-[#00EE76] transition-colors cursor-pointer shadow-sm group',
        buttonRoundedBorderOrange: 'border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:border-[#ffe600] dark:hover:border-[#ffe600] bg-[#FFFFFF] dark:bg-[#1e1e1e] hover:bg-[#FFFFFF] dark:hover:bg-[#1e1e1e] p-2.5 rounded-xl text-[#1e1e1e] dark:text-[#ECECEC] hover:text-[#ffe600] dark:hover:text-[#ffe600] transition-colors cursor-pointer shadow-sm group',


        buttonSolidRoundedBorder: 'border-2 border-[#CFCFCF] hover:border-[#4F4F4F] dark:hover:border-[#ECECEC] bg-[#ECECEC] dark:bg-[#1e1e1e] hover:bg-[#32CD32] dark:hover:bg-[#32CD32] p-2.5 rounded-xl text-[#1e1e1e] dark:text-[#ECECEC] hover:text-[#1e1e1e] dark:hover:text-[#ECECEC] transition-colors cursor-pointer shadow-sm group',

        // ====================================================
        // ASSET CARD
        // #ECECEC #CFCFCF #4F4F4F #1e1e1e 
        // #00FF7F #00EE76
        // #00BFFF #1E90FF #1e5aff
        // #ffe600
        // #E33539 #FF4040 
        // #FF6347
        // #8470FF
        // ====================================================
        assetCard: 'flex flex-col bg-white dark:bg-[#1e1e1e] rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-200 w-full h-full border-2 border-[#363636] dark:border-gray-700 hover:border-[#00BFFF] dark:hover:border-[#FFD700] group/card',
        assetCardTitle: 'text-[#CFCFCF] dark:text-[#ECECEC] text-sm sm:text-base font-bold text-center leading-tight line-clamp-2 hover:text-[#ffe600] dark:hover:text-[#00FF7F] transition-colors',
        assetCardNumber: 'text-[#00FF7F] dark:text-[#00FF7F] font-bold text-center leading-tight line-clamp-2 hover:text-[#ffe600] dark:hover:text-[#00FF7F] transition-colors',
        assetCardRecentlyViewed: 'flex flex-row items-center bg-white dark:bg-[#1e1e1e] rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-200 w-full h-[150px] border-2 border-[#363636] dark:border-gray-700 hover:border-[#00BFFF] dark:hover:border-[#00FF7F] group/card',
        assetCardTitleRecentlyViewed: 'text-[#363636] dark:text-[#ECECEC] hover:text-[#1E90FF] dark:hover:text-[#00EE76] text-sm sm:text-base font-bold text-left leading-tight line-clamp-2 transition-colors',
    
        assetCardQuickList: 'flex flex-row items-center bg-white dark:bg-[#1e1e1e] rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-200 w-full h-[150px] border-2 border-[#363636] dark:border-gray-700 hover:border-[#00BFFF] dark:hover:border-[#00FF7F] group/card',
        assetCardTitleQuickList: 'text-[#363636] dark:text-[#ECECEC] hover:text-[#1E90FF] dark:hover:text-[#00EE76] text-sm sm:text-base font-bold text-left leading-tight line-clamp-2 transition-colors',

        assetCardFavourite: 'flex flex-row items-center bg-white dark:bg-[#1e1e1e] rounded-xl cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-200 w-full h-[150px] border-2 border-[#363636] dark:border-gray-700 hover:border-[#E33539] dark:hover:border-[#E33539] group/card',
        assetCardTitleFavourite: 'text-[#363636] dark:text-[#ECECEC] hover:text-[#FF4040] dark:hover:text-[#FF4040] text-sm sm:text-base font-bold text-left leading-tight line-clamp-2 transition-colors',
    
        
        megamenuRouterLink: 'flex items-center gap-2 px-3 py-2.5 -mx-3 text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-[#ff005b] hover:bg-blue-50/50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200',
        megamenuResRouterLink: 'flex items-center gap-2 px-3 py-2.5 -mx-3 text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-[#00ff88] hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 rounded-xl transition-all duration-200',
        
        // text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1 relative z-10
        megamenuTitleHeader: 'text-[#363636] dark:text-[#ECECEC] hover:text-[#1E90FF] dark:hover:text-[#00EE76] text-xs font-black uppercase tracking-widest mb-4 relative z-10',
    

        //
        adminRoundedContainer: 'border-2 border-[#1e1e1e] dark:border-[#CFCFCF] hover:border-[#1E90FF] dark:hover:border-[#1E90FF] bg-[#FFFFFF] dark:bg-[#1e1e1e] hover:bg-[#FFFFFF] dark:hover:bg-[#1e1e1e] p-2.5 rounded-xl text-[#1e1e1e] dark:text-[#ECECEC] hover:text-[#1E90FF] dark:hover:text-[#1E90FF] transition-colors cursor-pointer shadow-sm group p-6 rounded-xl shadow-sm flex flex-col justify-between',
    }))

    // ====================================================
    // 6. ACTIONS: ĐỒNG BỘ XUỐNG DOM & THAY ĐỔI THEME
    // ====================================================
    const syncToDOM = () => {
        const root = document.documentElement

        // Đồng bộ class .dark cho Tailwind
        if (mode.value === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // 1. Bơm biến Màu Nền
        root.style.setProperty('--cmg-bg-body', palette.value.backgrounds.body)
        root.style.setProperty('--cmg-bg-surface', palette.value.backgrounds.surface)
        root.style.setProperty('--cmg-bg-card', palette.value.backgrounds.card)
        root.style.setProperty('--cmg-bg-elevated', palette.value.backgrounds.elevated)

        // 2. Bơm biến Màu Chữ
        root.style.setProperty('--cmg-text-title', palette.value.typography.titleColor)
        root.style.setProperty('--cmg-text-label', palette.value.typography.labelColor)
        root.style.setProperty('--cmg-text-content', palette.value.typography.contentColor)
        root.style.setProperty('--cmg-text-muted', palette.value.typography.mutedColor)

        // 3. Bơm biến Nút Bấm (Normal / Hover / Active / Border)
        root.style.setProperty('--cmg-btn-bg', palette.value.buttons.bg)
        root.style.setProperty('--cmg-btn-text', palette.value.buttons.text)
        root.style.setProperty('--cmg-btn-border', palette.value.buttons.border)
        root.style.setProperty('--cmg-btn-hover-bg', palette.value.buttons.hoverBg)
        root.style.setProperty('--cmg-btn-hover-text', palette.value.buttons.hoverText)
        root.style.setProperty('--cmg-btn-hover-border', palette.value.buttons.hoverBorder)
        root.style.setProperty('--cmg-btn-active-bg', palette.value.buttons.activeBg)
        root.style.setProperty('--cmg-btn-active-text', palette.value.buttons.activeText)
        root.style.setProperty('--cmg-btn-active-border', palette.value.buttons.activeBorder)

        // 4. Bơm biến Viền
        root.style.setProperty('--cmg-border-subtle', palette.value.borders.subtle)
        root.style.setProperty('--cmg-border-strong', palette.value.borders.strong)
        root.style.setProperty('--cmg-border-dashed', palette.value.borders.dashed)



        // 5. Bơm biến Font Size
        root.style.setProperty('--cmg-fs-hero', fontSizes.value.heroTitle)
        root.style.setProperty('--cmg-fs-section', fontSizes.value.sectionTitle)
        root.style.setProperty('--cmg-fs-card', fontSizes.value.cardTitle)
        root.style.setProperty('--cmg-fs-label', fontSizes.value.label)
        root.style.setProperty('--cmg-fs-content', fontSizes.value.content)
        root.style.setProperty('--cmg-fs-small', fontSizes.value.small)

        // 6. Bơm biến Spacing & Radius
        root.style.setProperty('--cmg-sp-container-x', spacing.value.containerPaddingX)
        root.style.setProperty('--cmg-sp-section-y', spacing.value.sectionMarginY)
        root.style.setProperty('--cmg-sp-panel', spacing.value.panelPadding)
        root.style.setProperty('--cmg-sp-card', spacing.value.cardPadding)
        root.style.setProperty('--cmg-sp-grid-gap', spacing.value.gridGap)
        root.style.setProperty('--cmg-radius-panel', spacing.value.panelRadius)
        root.style.setProperty('--cmg-radius-btn', spacing.value.buttonRadius)

        // 7. Bơm biến Animation Duration
        root.style.setProperty('--cmg-dur-fast', animations.value.fast)
        root.style.setProperty('--cmg-dur-normal', animations.value.normal)
        root.style.setProperty('--cmg-dur-slow', animations.value.slow)
        root.style.setProperty('--cmg-dur-zoom', animations.value.imageZoom)
    }

    // Chuyển đổi qua lại giữa Light và Dark mode
    const toggleMode = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark'
        palette.value = JSON.parse(JSON.stringify(defaultThemes[mode.value]))
        localStorage.setItem('cmg_theme_mode', mode.value)
    }

    // Tùy chỉnh nhanh 1 thông số bất kỳ (Ví dụ dùng trong bảng Setting)
    const updateCustomConfig = (category, key, value) => {
        if (category === 'spacing') spacing.value[key] = value
        if (category === 'fontSizes') fontSizes.value[key] = value
        if (category === 'animations') animations.value[key] = value
    }

    // Tự động lắng nghe mọi thay đổi sâu bên trong Store để cập nhật giao diện ngay lập tức
    watch([mode, palette, fontSizes, spacing, animations], () => {
        syncToDOM()
    }, { deep: true, immediate: true })

    return {
        mode,
        palette,
        fontSizes,
        spacing,
        animations,
        ui,
        toggleMode,
        updateCustomConfig,
        syncToDOM
    }
})
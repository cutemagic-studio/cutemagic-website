import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import HomeView_2 from '../views/HomeView_2.vue'



// import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminLayout from '../components/admin/AdminLayout.vue'

import ExtensionLayout from '../views/extension/ExtensionLayout.vue'

import AssetLibraryView from '../views/pages/assets/asset_gallery/AssetLibraryView.vue'

import AssetDetailView from '../views/pages/assets/asset_detail/AssetDetailView.vue'

import DonateView from '../views/pages/donate/DonateView.vue'

const routes = [
    {
        path: '/', // Chỉ cần '/' vì đã có base ở dưới rồi
        name: 'home',
        // component: HomeView
        component: HomeView_2
    },
    
    {
        path: '/cutemagic-admin', // Khi chạy nó sẽ là /cutemagic-website/cutemagic-admin
        name: 'admin',
        component: AdminLayout
    },
    {
        path: '/cutemagic-extension',
        name: 'extension',
        component: ExtensionLayout
    },

    {
      path: '/assets', 
      name: 'AssetLibrary',
      component: AssetLibraryView // Gắn component vào đây
    },

    { 
        path: '/assets/:id', 
        name: 'AssetDetailView',
        component: AssetDetailView,
        props: true // Cho phép truyền ID vào component như một prop
    },

    {
        path: '/donate',
        name: 'Donate',
        component: DonateView
    }
]

const router = createRouter({
    // Base này giúp khi bạn deploy lên GitHub Pages hoặc thư mục con nó không bị lỗi /// createWebHashHistory
    history: createWebHistory('/cutemagic-website/'),
    // history: createWebHashHistory('/cutemagic-website/'),
    routes,

    // BỔ SUNG ĐOẠN NÀY ĐỂ LUÔN CUỘN LÊN ĐẦU KHI ĐỔI TRANG
    // scrollBehavior(to, from, savedPosition) {
    //     // Nếu người dùng bấm nút Back/Forward trên trình duyệt, giữ nguyên vị trí cũ
    //     if (savedPosition) {
    //         return savedPosition
    //     } 
    //     // Còn lại, luôn cuộn lên tọa độ trên cùng (top: 0) một cách mượt mà
    //     return { top: 0, behavior: 'smooth' }
    // }

    scrollBehavior(to, from, savedPosition) {
    // 1. Nếu có hash neo (VD: #WhyChooseUsSection)
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // 2. Nếu người dùng quay về trang chủ ('/') từ trang Chi tiết Asset hoặc bấm nút Back của trình duyệt:
    // Nhường quyền cho restoreHomeScrollPosition() trong HomeView xử lý để không bị lệch do RecentlyViewedSection!
    if (to.path === '/' && (savedPosition || from.name === 'AssetDetailView' || from.path.startsWith('/assets/'))) {
      return false
    }

    // 3. Nếu bấm nút Back/Forward ở các trang khác
    if (savedPosition) {
      return savedPosition
    } 

    // 4. Mở trang mới (VD: Bấm vào xem chi tiết AssetDetailView) -> Luôn cuộn lên đầu trang
    return { top: 0, behavior: 'instant' }
  }
})

export default router
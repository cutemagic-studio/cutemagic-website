import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

import AssetDetail from '../components/showcase/asset_gallery/AssetDetail.vue'

import AdminLayout from '../views/admin/AdminLayout.vue'

import ExtensionLayout from '../views/extension/ExtensionLayout.vue'

const routes = [
    {
        path: '/', // Chỉ cần '/' vì đã có base ở dưới rồi
        name: 'home',
        component: HomeView
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
        path: '/asset/:id', 
        name: 'AssetDetail',
        component: AssetDetail,
        props: true // Cho phép truyền ID vào component như một prop
    }
]

const router = createRouter({
    // Base này giúp khi bạn deploy lên GitHub Pages hoặc thư mục con nó không bị lỗi
    history: createWebHistory('/cutemagic-website/'), 
    routes
})

export default router
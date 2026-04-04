import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Assets from '../views/Assets.vue'
import Blog from '../views/Blog.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/assets', component: Assets },
  { path: '/blog', component: Blog }
]

const router = createRouter({
  history: createWebHistory('/cutemagic-website/'), // 👈 QUAN TRỌNG
  routes
})

export default router
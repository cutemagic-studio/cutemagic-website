<!-- src/components/admin/tabs/user_tracker/UserTracker.vue -->
<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useVisitorStore } from '../../../../stores/visitor'
import { useAssetStore } from '../../../../stores/useAssetStore'
import { auth } from '../../../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { fetchVisitorMetadata, trackUserBehavior } from '../../../../services/trackerService'

const route = useRoute()
const visitorStore = useVisitorStore()
const assetStore = useAssetStore()

onMounted(async () => {
  // [THÊM DÒNG NÀY]: Tự động đồng bộ kho Asset từ Firebase cho toàn bộ trang User
  assetStore.initFirebaseAssetsSync()

  // 1. Đồng bộ trạng thái đăng nhập Firebase Auth
  onAuthStateChanged(auth, (user) => {
    visitorStore.setUser(user)
  })

  // 2. Khởi tạo Metadata IP và lưu vào Pinia Store
  const meta = await fetchVisitorMetadata()
  if (meta) {
    visitorStore.setMetadata(meta)
  }

  // 3. Ghi nhận trang đầu tiên khi vừa mở web
  handleRouteTracking(route)
})

// 4. Tự động theo dõi mỗi khi người dùng chuyển trang trên web
watch(
  () => route.fullPath,
  () => {
    handleRouteTracking(route)
  }
)

const handleRouteTracking = (currentRoute) => {
  const path = currentRoute.fullPath || window.location.pathname

  // Bỏ qua không ghi log nếu đường dẫn là trang Admin
  if (path.includes('cutemagic-admin')) return

  // Kiểm tra xem người dùng có đang vào trang Chi tiết Asset không (VD: /assets/:slug hoặc /asset/:id)
  const slugOrId = currentRoute.params?.slug || currentRoute.params?.id
  if (slugOrId) {
    const asset = assetStore.getAssetBySlug(slugOrId) || assetStore.getAssetById(slugOrId)
    if (asset) {
      trackUserBehavior('VIEW_ASSET', {
        path,
        assetId: asset.id,
        assetTitle: asset.title,
        user: visitorStore.user
      })
      return
    }
  }

  // Nếu là các trang bình thường (Home, Library, Roadmap...)
  trackUserBehavior('PAGE_VIEW', {
    path,
    user: visitorStore.user
  })
}
</script>

<template>
  <div style="display: none;" aria-hidden="true"></div>
</template>
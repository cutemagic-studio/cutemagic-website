<!-- src/components/admin/tabs/asset_manager/AssetManager.vue -->
<template>
  <div class="space-y-6 font-sans text-slate-900">

    <!-- 1. Header & Thanh công cụ Backup / Restore / Tạo mới -->
    <AssetHeaderToolbar
      :is-firebase-synced="assetStore.isFirebaseSynced"
      :id-pool-stats="assetStore.idPoolStats"
      :is-backing-up="isBackingUp"
      :is-saving="isSaving"
      @backup="handleDownloadAssetBackup"
      @restore-file="handleRestoreFileChange"
      @seed="handleSeedDatabase"
      @create="openCreateModal"
    />

    <!-- 2. Năm Thẻ Tóm tắt Trạng thái Kho Asset -->
    <AssetStatusCards
      v-model:status-filter="statusFilter"
      :total-count="assetStore.assets.length"
      :count-by-status="countByStatus"
    />

    <!-- 3. Thanh Tìm kiếm, Lọc Danh mục & Sắp xếp -->
    <AssetFilterBar
      v-model:search-query="searchQuery"
      v-model:category-filter="categoryFilter"
      v-model:sort-order="sortOrder"
      :categories="categoriesWithoutAll"
    />

    <!-- 4. Bảng Danh sách Asset Pack & Thao tác Nhanh -->
    <AssetTable
      :assets="filteredAssets"
      @toggle-flag="handleQuickToggleFlag"
      @touch-today="handleTouchToday"
      @edit="openEditModal"
      @clone="handleCloneAsset"
      @delete="handleDeleteAsset"
    />

    <!-- 5. Modal Biên tập 6-Tab CmgAssetModel -->
    <AssetEditorModal
      :show="isModalOpen"
      :is-edit-mode="isEditMode"
      :initial-data="editingAssetData"
      :categories="categoriesWithoutAll"
      :available-pool-ids="assetStore.availablePoolIds"
      :is-saving="isSaving"
      @close="isModalOpen = false"
      @save="handleSaveAsset"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAssetStore, getTodayDateString } from '../../../../stores/useAssetStore'
import { useNotificationStore } from '../../../../stores/useNotificationStore'
import { CmgAssetModel } from '../../../../models/cmg/Cmg_AssetModel'
import { getNextUnusedAssetId } from '../../../../data/assets/cmg/cmg_id_pool'
import { downloadAssetsBackupJS, restoreAssetsFromFile } from '../../../../services/backupService'

// Import 5 Component Con
import AssetHeaderToolbar from './components/AssetHeaderToolbar.vue'
import AssetStatusCards from './components/AssetStatusCards.vue'
import AssetFilterBar from './components/AssetFilterBar.vue'
import AssetTable from './components/AssetTable.vue'
import AssetEditorModal from './components/AssetEditorModal.vue'

const assetStore = useAssetStore()
const notify = useNotificationStore()

onMounted(() => {
  assetStore.initFirebaseAssetsSync()
})

// --- TRẠNG THÁI LỌC & SẮP XẾP ---
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const sortOrder = ref('id_asc')

// --- TRẠNG THÁI XỬ LÝ & MODAL ---
const isBackingUp = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)
const editingAssetData = ref({})

const categoriesWithoutAll = computed(() => assetStore.categories.filter(c => c.id !== 'all'))

const countByStatus = computed(() => ({
  discount: assetStore.assets.filter(a => a.hasDiscount).length,
  free: assetStore.assets.filter(a => a.isFree).length,
  upcoming: assetStore.upcomingAssets.length,
  roadmap: assetStore.roadmapAssets.length
}))

const filteredAssets = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return [...assetStore.assets]
    .filter(item => {
      const matchSearch = !q ||
        String(item.id).includes(q) ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.slug || '').toLowerCase().includes(q) ||
        (item.tags || []).some(t => t.toLowerCase().includes(q))

      const matchCategory = categoryFilter.value === 'all' || item.categoryId === categoryFilter.value

      let matchStatus = true
      if (statusFilter.value === 'discount') matchStatus = item.hasDiscount
      else if (statusFilter.value === 'free') matchStatus = item.isFree
      else if (statusFilter.value === 'upcoming') matchStatus = Boolean(item.dates?.availableIn) || item.roadmap?.status === 'next'
      else if (statusFilter.value === 'roadmap') matchStatus = item.isInRoadmap

      return matchSearch && matchCategory && matchStatus
    })
    .sort((a, b) => {
      if (sortOrder.value === 'id_desc') return Number(b.id) - Number(a.id)
      if (sortOrder.value === 'updated_desc') return new Date(b.releaseDate) - new Date(a.releaseDate)
      if (sortOrder.value === 'price_desc') return (b.pricing?.price || 0) - (a.pricing?.price || 0)
      if (sortOrder.value === 'likes_desc') return (b.metrics?.likes || 0) - (a.metrics?.likes || 0)
      return Number(a.id) - Number(b.id)
    })
})

// --- CÁC HÀM ĐIỀU PHỐI MODAL & THAO TÁC CRUD ---
const openCreateModal = () => {
  isEditMode.value = false
  const today = getTodayDateString()
  const nextFree6DigitId = getNextUnusedAssetId(assetStore.assets)

  const blank = new CmgAssetModel({
    id: nextFree6DigitId,
    categoryId: 'characters',
    dates: { initialRelease: today, latestUpdate: today, availableIn: '' },
    techSpecs: { packCount: 1, modelCount: 20 }
  })

  editingAssetData.value = JSON.parse(JSON.stringify(blank))
  isModalOpen.value = true
}

const openEditModal = (asset) => {
  isEditMode.value = true
  editingAssetData.value = JSON.parse(JSON.stringify(asset))
  isModalOpen.value = true
}

const handleSaveAsset = async (payload) => {
  isSaving.value = true
  try {
    const savedModel = await assetStore.saveAssetToFirebase(payload)
    isModalOpen.value = false

    notify.success(
      isEditMode.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!',
      `Đã lưu gói "${savedModel.title}" (ID: #${savedModel.id}) lên Firebase.`
    )
  } catch (err) {
    notify.error('Lỗi khi lưu Asset Pack', err.message)
  } finally {
    isSaving.value = false
  }
}

const handleQuickToggleFlag = async (id, flagKey) => {
  try {
    await assetStore.quickToggleAssetFlag(id, flagKey)
    notify.info('Đã cập nhật huy hiệu', `Đã thay đổi cờ "${flagKey}" cho Pack #${id}.`, 2000)
  } catch (err) {
    notify.error('Lỗi cập nhật cờ', err.message)
  }
}

const handleTouchToday = async (item) => {
  try {
    await assetStore.touchAssetLatestUpdate(item.id)
    notify.success('Đã làm mới ngày cập nhật!', `Pack "#${item.id} - ${item.title}" đã được đặt ngày cập nhật là hôm nay.`)
  } catch (err) {
    notify.error('Lỗi cập nhật ngày', err.message)
  }
}

const handleCloneAsset = async (item) => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận nhân bản Asset Pack',
    message: 'Hệ thống sẽ tạo một bản sao hoàn toàn mới dựa trên thông số của gói này.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: 'Đồng ý Nhân bản',
    variant: 'info',
    icon: '📋'
  })

  if (!confirmed) return

  try {
    const cloned = JSON.parse(JSON.stringify(item))
    cloned.id = null // Tự động cấp ID 6 số mới từ Pool
    cloned.title = `${item.title} (Copy)`
    cloned.slug = `${item.slug}-copy`
    const newPack = await assetStore.saveAssetToFirebase(cloned)
    notify.success('Nhân bản thành công!', `Đã tạo gói mới "#${newPack.id} - ${newPack.title}".`)
  } catch (err) {
    notify.error('Lỗi khi nhân bản', err.message)
  }
}

const handleDeleteAsset = async (item) => {
  const confirmed = await notify.confirm({
    title: 'CẢNH BÁO: Xóa vĩnh viễn Asset Pack?',
    message: 'Thao tác này sẽ xóa sạch gói tài nguyên này khỏi Firebase Realtime Database và không thể khôi phục.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: 'Xóa vĩnh viễn',
    variant: 'danger',
    icon: '🗑️'
  })

  if (!confirmed) return

  try {
    await assetStore.deleteAssetFromFirebase(item.id)
    notify.success('Đã xóa Asset Pack', `Đã gỡ bỏ gói #${item.id} khỏi hệ thống.`)
  } catch (err) {
    notify.error('Lỗi khi xóa', err.message)
  }
}

const handleSeedDatabase = async () => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận ghi đè dữ liệu gốc?',
    message: 'Thao tác này sẽ đồng bộ lại toàn bộ 30 gói asset mẫu chuẩn 6 chữ số từ file JS lên Firebase.',
    highlightText: 'Ghi đè nhánh cmg_assets',
    confirmText: 'Đồng ý Ghi đè',
    variant: 'warning',
    icon: '☁️'
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    await assetStore.seedMockAssetsToFirebase()
    notify.success('Đồng bộ thành công!', 'Đã nạp thành công 30 Asset Pack mẫu chuẩn lên Firebase.')
  } catch (err) {
    notify.error('Lỗi đồng bộ', err.message)
  } finally {
    isSaving.value = false
  }
}

const handleDownloadAssetBackup = async () => {
  isBackingUp.value = true
  const res = await downloadAssetsBackupJS(assetStore.assets)
  isBackingUp.value = false

  if (res.success) {
    notify.success('Sao lưu thành công!', `Đã tải xuống file sao lưu chứa ${assetStore.assets.length} Asset Packs.`)
  } else {
    notify.error('Lỗi khi xuất file sao lưu', res.error)
  }
}

const handleRestoreFileChange = async (file) => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận khôi phục từ file?',
    message: `Dữ liệu trong file "${file.name}" sẽ được nạp trực tiếp lên Firebase.`,
    highlightText: file.name,
    confirmText: 'Tiến hành Khôi phục',
    variant: 'info',
    icon: '⬆️'
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    const result = await restoreAssetsFromFile(file)
    notify.success('Khôi phục dữ liệu thành công!', `Đã nạp ${result.count} Asset Packs lên Firebase từ file sao lưu.`)
  } catch (err) {
    notify.error('Lỗi khôi phục file', err.message)
  } finally {
    isSaving.value = false
  }
}
</script>
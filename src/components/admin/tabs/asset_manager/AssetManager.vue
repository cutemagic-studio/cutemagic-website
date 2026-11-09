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

    <!-- 2. Sáu Thẻ Tóm tắt Trạng thái Kho Asset (Có thẻ Đã xóa mềm deleted_at) -->
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

    <!-- 4. Bảng Danh sách Asset Pack & Thao tác Nhanh (Hỗ trợ Parallel Backup & Soft Delete) -->
    <AssetTable
      :assets="filteredAssets"
      :backup-map="assetStore.backupMap"
      :is-trash-view="statusFilter === 'deleted'"
      @toggle-flag="handleQuickToggleFlag"
      @touch-today="handleTouchToday"
      @edit="openEditModal"
      @clone="handleCloneAsset"
      @delete="handleDeleteAsset"
      @restore-backup="handleRestoreParallelBackup"
      @restore-deleted="handleRestoreSoftDeleted"
      @hard-delete="handleHardDeleteAsset"
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
  roadmap: assetStore.roadmapAssets.length,
  deleted: (assetStore.deletedAssets || []).length
}))

const filteredAssets = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()

  // Nếu đang chọn thẻ "Đã xóa mềm" -> Lấy từ mảng deletedAssets, ngược lại lấy từ mảng assets đang hoạt động
  const sourceList = statusFilter.value === 'deleted'
    ? [...(assetStore.deletedAssets || [])]
    : [...(assetStore.assets || [])]

  return sourceList
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
      else if (statusFilter.value === 'upcoming') matchStatus = Boolean(item.availableIn) || item.roadmap?.status === 'next'
      else if (statusFilter.value === 'roadmap') matchStatus = item.isInRoadmap
      else if (statusFilter.value === 'deleted') matchStatus = item.isDeleted

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
  const allKnown = assetStore.allAssetsIncludingDeleted || assetStore.assets
  const nextFree6DigitId = getNextUnusedAssetId(allKnown)

  const blank = new CmgAssetModel({
    id: nextFree6DigitId,
    categoryId: 'characters',
    dates: {
      created_at: today,
      recordCreatedDate: today,
      initialRelease: today,
      latestUpdate: today
    },
    roadmap: {
      status: null,
      progress: 0,
      estimatedDelivery: today,
      note: ''
    },
    techSpecs: { packCount: 1, modelCount: 20 }
  })

  editingAssetData.value = blank.toPlainObject()
  isModalOpen.value = true
}

const openEditModal = (asset) => {
  isEditMode.value = true
  const plain = typeof asset.toPlainObject === 'function'
    ? asset.toPlainObject()
    : JSON.parse(JSON.stringify(asset))
  editingAssetData.value = plain
  isModalOpen.value = true
}

const handleSaveAsset = async (payload) => {
  isSaving.value = true
  try {
    const savedModel = await assetStore.saveAssetToFirebase(payload)
    isModalOpen.value = false

    notify.success(
      isEditMode.value ? 'Cập nhật & Lưu Backup thành công!' : 'Tạo mới & Khởi tạo Backup thành công!',
      `Đã lưu gói "${savedModel.title}" (#${savedModel.id}) và đồng bộ bản ghi song song.`
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
    message: 'Hệ thống sẽ tạo một bản sao mới kèm bản ghi backup song song dựa trên thông số của gói này.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: 'Đồng ý Nhân bản',
    variant: 'info',
    icon: '📋'
  })

  if (!confirmed) return

  try {
    const cloned = typeof item.toPlainObject === 'function'
      ? item.toPlainObject()
      : JSON.parse(JSON.stringify(item))
    cloned.id = null // Tự động cấp ID 6 số mới từ Pool
    cloned.title = `${item.title} (Copy)`
    cloned.slug = `${item.slug}-copy`
    const newPack = await assetStore.saveAssetToFirebase(cloned)
    notify.success('Nhân bản thành công!', `Đã tạo gói mới "#${newPack.id} - ${newPack.title}".`)
  } catch (err) {
    notify.error('Lỗi khi nhân bản', err.message)
  }
}

// --- XÓA MỀM (SOFT DELETE - deleted_at) ---
const handleDeleteAsset = async (item) => {
  const confirmed = await notify.confirm({
    title: 'Đánh dấu xóa mềm (Soft Delete) Asset Pack?',
    message: 'Gói này sẽ được gắn dấu thời gian "deleted_at", ẩn khỏi trang người dùng và chuyển vào mục "Đã xóa mềm". Bạn có thể khôi phục lại bất cứ lúc nào.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: 'Chuyển vào Đã xóa mềm',
    variant: 'warning',
    icon: '🗑️'
  })

  if (!confirmed) return

  try {
    await assetStore.softDeleteAsset(item.id)
    notify.warning('Đã đánh dấu xóa mềm', `Gói "#${item.id} - ${item.title}" đã được chuyển vào mục Đã xóa mềm.`)
  } catch (err) {
    notify.error('Lỗi khi xóa mềm', err.message)
  }
}

// --- KHÔI PHỤC TRẠNG THÁI TỒN TẠI (GỠ BỎ deleted_at) ---
const handleRestoreSoftDeleted = async (item) => {
  const confirmed = await notify.confirm({
    title: 'Khôi phục trạng thái tồn tại?',
    message: 'Hệ thống sẽ gỡ bỏ dấu "deleted_at" và đưa Asset Pack này hiển thị trở lại trên cửa hàng.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: '♻️ Khôi phục ngay',
    variant: 'info',
    icon: '♻️'
  })

  if (!confirmed) return

  try {
    await assetStore.restoreSoftDeletedAsset(item.id)
    notify.success('Khôi phục thành công!', `Gói "#${item.id} - ${item.title}" đã hoạt động trở lại.`)
  } catch (err) {
    notify.error('Lỗi khi khôi phục', err.message)
  }
}

// --- KHÔI PHỤC DỮ LIỆU GẦN NHẤT TỪ BẢN GHI SONG SONG (PARALLEL BACKUP) ---
const handleRestoreParallelBackup = async (item) => {
  const backupInfo = assetStore.getParallelBackup(item.id)
  const backupTime = backupInfo?._backupMeta?.backedUpAt || 'Gần nhất'

  const confirmed = await notify.confirm({
    title: 'Khôi phục dữ liệu từ Bản ghi song song?',
    message: `Hệ thống sẽ lấy dữ liệu từ bản ghi backup song song (Lưu lúc: ${backupTime}) để khôi phục cho Asset Pack này.`,
    highlightText: `#${item.id} - ${backupInfo?.title || item.title}`,
    confirmText: '⏪ Khôi phục bản gần nhất',
    variant: 'warning',
    icon: '⏪'
  })

  if (!confirmed) return

  try {
    const restored = await assetStore.restoreAssetFromParallelBackup(item.id)
    notify.success(
      'Đã khôi phục từ Bản ghi song song!',
      `Gói "#${restored.id} - ${restored.title}" đã quay về trạng thái lưu lúc ${backupTime}.`
    )
  } catch (err) {
    notify.error('Lỗi khôi phục bản ghi song song', err.message)
  }
}

// --- XÓA VĨNH VIỄN (HARD DELETE TRONG THÙNG RÁC) ---
const handleHardDeleteAsset = async (item) => {
  const confirmed = await notify.confirm({
    title: 'CẢNH BÁO: Xóa vĩnh viễn khỏi Database?',
    message: 'Thao tác này sẽ xóa sạch cả bản ghi chính lẫn bản ghi backup song song trên Firebase và KHÔNG THỂ khôi phục.',
    highlightText: `#${item.id} - ${item.title}`,
    confirmText: '🔥 Xóa vĩnh viễn',
    variant: 'danger',
    icon: '🔥'
  })

  if (!confirmed) return

  try {
    await assetStore.hardDeleteAssetPermanently(item.id)
    notify.success('Đã xóa vĩnh viễn', `Đã gỡ bỏ hoàn toàn gói #${item.id} khỏi Firebase.`)
  } catch (err) {
    notify.error('Lỗi khi xóa vĩnh viễn', err.message)
  }
}

const handleSeedDatabase = async () => {
  const confirmed = await notify.confirm({
    title: 'Xác nhận ghi đè dữ liệu gốc?',
    message: 'Thao tác này sẽ đồng bộ lại toàn bộ 30 gói asset mẫu chuẩn 6 chữ số lên cả nhánh chính và nhánh bản ghi song song trên Firebase.',
    highlightText: 'Ghi đè cmg_assets & cmg_assets_backup',
    confirmText: 'Đồng ý Ghi đè',
    variant: 'warning',
    icon: '☁️'
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    await assetStore.seedMockAssetsToFirebase()
    notify.success('Đồng bộ thành công!', 'Đã nạp 30 Asset Pack mẫu cùng 30 bản ghi backup song song lên Firebase.')
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
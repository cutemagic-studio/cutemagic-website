<!-- src/components/admin/tabs/hero_showcase/HeroShowcaseManager.vue -->
<template>
  <div class="space-y-6 font-sans text-slate-900">

    <!-- ========================================================= -->
    <!-- 1. THANH HIỂN THỊ THAM SỐ MẢNG ID CẤU HÌNH & NÚT LƯU      -->
    <!-- ========================================================= -->
    <div :class="[theme.ui.adminRoundedContainer, 'space-y-4']">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-[#ffe600] text-[#1e1e1e] text-[10px] font-black uppercase">
              Firebase Array Config
            </span>
            <h3 :class="[theme.ui.assetCardTitle, 'text-left']">
              Tham số Mảng ID Hiển thị tại Hero Section ({{ workingIds.length }} Packs)
            </h3>
          </div>
          <p class="text-xs text-slate-400 font-medium mt-1">
            Lưu tại nhánh <code class="text-[#00EE76] font-mono">cmg_config/hero_featured_ids</code>. Thứ tự ID trong mảng quyết định thứ tự xuất hiện trên khung Gallery Hero.
          </p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            @click="syncFromFeaturedFlags"
            class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#ffe600] border-2 border-slate-600 text-xs font-black transition-all cursor-pointer"
            title="Lấy nhanh toàn bộ ID của các Pack đang bật cờ ⭐ Featured"
          >
            ⭐ Nạp từ cờ Featured
          </button>

          <button
            type="button"
            :disabled="isSaving"
            @click="handleSaveArrayToFirebase"
            class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {{ isSaving ? 'Đang lưu...' : '💾 Lưu Mảng Cấu Hình Lên Firebase' }}
          </button>
        </div>
      </div>

      <!-- Khung hiển thị trực tiếp mảng JSON [ID_1, ID_2, ...] & Nhập nhanh -->
      <div class="bg-[#131722] border-2 border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto">
          <span class="text-xs font-mono font-bold text-slate-400 shrink-0">heroFeaturedIds =</span>
          <code class="text-xs sm:text-sm font-mono font-black text-[#00EE76] break-all">
            [{{ workingIds.join(', ') }}]
          </code>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="copyArrayJson"
            class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-black cursor-pointer"
          >
            📋 Copy JSON
          </button>
          <button
            v-if="workingIds.length > 0"
            type="button"
            @click="clearAllIds"
            class="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-black cursor-pointer"
          >
            ✕ Làm trống
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 2. DANH SÁCH PACK ĐANG TRƯNG BÀY Ở HERO (SẮP XẾP THỨ TỰ)   -->
    <!-- ========================================================= -->
    <div :class="[theme.ui.adminRoundedContainer]">
      <div class="flex items-center justify-between mb-4">
        <h3 :class="[theme.ui.assetCardTitle, 'text-left']">
          🌟 Thứ tự Trình chiếu trên Khung A - Hero Section (Kéo hoặc bấm ◀ ▶ để đổi vị trí)
        </h3>
        <span class="text-xs font-bold text-slate-400">
          Slide #01 sẽ hiển thị đầu tiên khi khách vào trang chủ
        </span>
      </div>

      <div v-if="selectedHeroModels.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(pack, index) in selectedHeroModels"
          :key="pack.id"
          class="relative bg-[#1e1e1e] border-2 border-[#8470FF] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
        >
          <!-- Ảnh bìa & Huy hiệu vị trí Slide -->
          <div class="relative h-36 bg-slate-900 overflow-hidden">
            <img :src="pack.media?.cover" :alt="pack.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent"></div>

            <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#ffe600] text-black font-mono text-xs font-black shadow">
              Slide #{{ String(index + 1).padStart(2, '0') }}
            </span>

            <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-900/90 text-[#00EE76] font-mono text-[11px] font-black border border-slate-700">
              ID: #{{ pack.id }}
            </span>
          </div>

          <!-- Thông tin Pack -->
          <div class="p-3.5 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-black uppercase text-blue-400">{{ pack.categoryId }}</span>
              <h4 class="text-sm font-black text-white truncate mt-0.5" :title="pack.title">
                {{ pack.title }}
              </h4>
              <p class="text-[11px] font-bold text-slate-400 mt-1">
                📦 {{ pack.techSpecs?.modelCount || 0 }} Models • 💲{{ pack.displayPrice }}
              </p>
            </div>

            <!-- Thanh nút Đổi vị trí (◀ / ▶) & Gỡ khỏi mảng -->
            <div class="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-1.5">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :disabled="index === 0"
                  @click="moveItem(index, -1)"
                  class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#ffe600] text-white hover:text-black disabled:opacity-25 text-xs font-black cursor-pointer"
                  title="Đẩy lên trước"
                >
                  ◀
                </button>
                <button
                  type="button"
                  :disabled="index === selectedHeroModels.length - 1"
                  @click="moveItem(index, 1)"
                  class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#ffe600] text-white hover:text-black disabled:opacity-25 text-xs font-black cursor-pointer"
                  title="Lùi ra sau"
                >
                  ▶
                </button>
              </div>

              <button
                type="button"
                @click="removeIdFromHero(pack.id)"
                class="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white text-[11px] font-black transition-colors cursor-pointer"
              >
                ✕ Gỡ bỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-10 text-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 text-xs font-bold">
        Mảng <code class="text-[#ffe600]">heroFeaturedIds</code> đang trống. Hãy bấm nút <strong class="text-white">"➕ Thêm vào Hero"</strong> ở danh sách bên dưới để chọn các Asset Pack xuất hiện tại Hero Section!
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 3. KHO TẤT CẢ ASSET PACK ĐỂ CHỌN ĐƯA VÀO MẢNG HERO         -->
    <!-- ========================================================= -->
    <div :class="[theme.ui.adminRoundedContainer, 'space-y-4']">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 :class="[theme.ui.assetCardTitle, 'text-left']">
          📦 Chọn Asset Pack từ Kho để đưa vào Mảng Hero
        </h3>

        <div class="flex items-center gap-2.5">
          <select
            v-model="categoryFilter"
            class="px-3 py-2 rounded-xl border-2 border-[#8470FF] bg-white text-xs font-black text-slate-800"
          >
            <option value="all">Tất cả danh mục</option>
            <option v-for="cat in categoriesWithoutAll" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo ID 6 số hoặc Tên Pack..."
            class="w-full sm:w-64 px-3.5 py-2 rounded-xl border-2 border-[#8470FF] bg-white text-xs font-bold text-slate-900"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#1e1e1e] text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <th class="p-3.5">Mã ID &amp; Asset Pack</th>
              <th class="p-3.5">Danh mục &amp; Models</th>
              <th class="p-3.5">Giá bán</th>
              <th class="p-3.5 text-center">Trạng thái trên Hero</th>
              <th class="p-3.5 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in filteredCatalog"
              :key="item.id"
              class="border-b border-slate-100 hover:bg-[#4F4F4F] transition-colors"
            >
              <td class="p-3.5">
                <div class="flex items-center gap-3">
                  <img :src="item.media?.cover" class="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0" />
                  <div>
                    <div class="flex items-center gap-1.5">
                      <code class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-black">
                        #{{ item.id }}
                      </code>
                      <span v-if="item.flags?.isFeatured" class="text-xs" title="Đang bật cờ Featured">⭐</span>
                    </div>
                    <p :class="[theme.ui.assetCardTitle, 'text-left text-xs mt-0.5']">{{ item.title }}</p>
                  </div>
                </div>
              </td>

              <td class="p-3.5 text-xs font-bold text-slate-400">
                <span class="uppercase text-[#ffe600]">{{ item.categoryId }}</span> • {{ item.techSpecs?.modelCount || 0 }} Models
              </td>

              <td class="p-3.5 text-xs font-black text-[#00EE76]">
                {{ item.displayPrice }}
              </td>

              <td class="p-3.5 text-center">
                <span
                  v-if="isIdInHero(item.id)"
                  class="px-2.5 py-1 rounded-lg bg-[#ffe600] text-black text-[10px] font-black uppercase"
                >
                  ✓ Slide #{{ workingIds.indexOf(Number(item.id)) + 1 }}
                </span>
                <span v-else class="text-[11px] font-bold text-slate-400">
                  Chưa chọn
                </span>
              </td>

              <td class="p-3.5 text-right">
                <button
                  v-if="!isIdInHero(item.id)"
                  type="button"
                  @click="addIdToHero(item.id)"
                  class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-[#00EE76] text-white hover:text-black text-xs font-black transition-colors cursor-pointer"
                >
                  ➕ Thêm vào Hero
                </button>
                <button
                  v-else
                  type="button"
                  @click="removeIdFromHero(item.id)"
                  class="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-black transition-colors cursor-pointer"
                >
                  ✕ Gỡ khỏi Hero
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAssetStore } from '../../../../stores/useAssetStore'
import { useNotificationStore } from '../../../../stores/useNotificationStore'
import { useThemeStore } from '../../../../stores/useThemeStore.js'

const assetStore = useAssetStore()
const notify = useNotificationStore()
const theme = useThemeStore()

const workingIds = ref([])
const searchQuery = ref('')
const categoryFilter = ref('all')
const isSaving = ref(false)

onMounted(() => {
  assetStore.initFirebaseAssetsSync()
  workingIds.value = [...(assetStore.heroFeaturedIds || [])]
})

watch(
  () => assetStore.heroFeaturedIds,
  (newIds) => {
    if (Array.isArray(newIds)) {
      workingIds.value = [...newIds]
    }
  },
  { immediate: true }
)

const categoriesWithoutAll = computed(() => assetStore.categories.filter(c => c.id !== 'all'))

// Ánh xạ mảng ID sang đối tượng CmgAssetModel theo đúng thứ tự
const selectedHeroModels = computed(() => {
  const map = new Map((assetStore.assets || []).map(a => [Number(a.id), a]))
  return workingIds.value.map(id => map.get(Number(id))).filter(Boolean)
})

const filteredCatalog = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return (assetStore.assets || []).filter(item => {
    const matchCat = categoryFilter.value === 'all' || item.categoryId === categoryFilter.value
    const matchQ = !q ||
      String(item.id).includes(q) ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.slug || '').toLowerCase().includes(q)
    return matchCat && matchQ
  })
})

const isIdInHero = (id) => workingIds.value.includes(Number(id))

const addIdToHero = (id) => {
  const numId = Number(id)
  if (!workingIds.value.includes(numId)) {
    workingIds.value.push(numId)
  }
}

const removeIdFromHero = (id) => {
  const numId = Number(id)
  workingIds.value = workingIds.value.filter(item => item !== numId)
}

const moveItem = (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= workingIds.value.length) return
  const arr = [...workingIds.value]
  const temp = arr[index]
  arr[index] = arr[targetIndex]
  arr[targetIndex] = temp
  workingIds.value = arr
}

const syncFromFeaturedFlags = () => {
  const flaggedIds = (assetStore.assets || [])
    .filter(a => a.flags?.isFeatured)
    .map(a => Number(a.id))

  if (flaggedIds.length === 0) {
    notify.warning('Chưa có Pack gắn cờ ⭐', 'Hiện không có Pack nào đang bật cờ Featured.')
    return
  }
  workingIds.value = Array.from(new Set([...workingIds.value, ...flaggedIds]))
  notify.info('Đã nạp ID từ cờ Featured', `Đã gom ${workingIds.value.length} mã ID vào mảng dự kiến. Bấm Lưu để áp dụng!`)
}

const clearAllIds = () => {
  workingIds.value = []
}

const copyArrayJson = () => {
  navigator.clipboard.writeText(JSON.stringify(workingIds.value))
  notify.info('Đã sao chép mảng JSON!', `[${workingIds.value.join(', ')}]`, 2000)
}

const handleSaveArrayToFirebase = async () => {
  const confirmed = await notify.confirm({
    title: 'Lưu mảng ID hiển thị cho Hero Section?',
    message: 'Danh sách và thứ tự các Asset Pack trong mảng này sẽ được cập nhật trực tiếp lên khung Gallery ở Hero Section ngoài Trang chủ.',
    highlightText: `heroFeaturedIds: [${workingIds.value.join(', ')}]`,
    confirmText: '💾 Lưu cấu hình',
    variant: 'info',
    icon: '🌟'
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    await assetStore.saveHeroFeaturedIdsToFirebase(workingIds.value)
    notify.success(
      'Cập nhật Hero Showcase thành công!',
      `Đã lưu mảng ${workingIds.value.length} mã ID lên Firebase.`
    )
  } catch (err) {
    notify.error('Lỗi lưu cấu hình Hero', err.message)
  } finally {
    isSaving.value = false
  }
}
</script>
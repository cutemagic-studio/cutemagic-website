// src/stores/ref_library/refCategoryTreeLogic.js
import { ref, computed } from 'vue'
import { getNowStr } from './refLibraryHelpers'

const COLLAPSED_STORAGE_KEY = 'cmg_ref_tree_collapsed_ids_v1'

export function createRefCategoryTreeModule({
  physicalData,
  virtualData,
  selectedFilter,
  categoryModal,
  notify,
  saveVirtualToFirebase,
  savePhysicalToFirebase
}) {
  const loadInitialCollapsed = () => {
    try {
      const raw = localStorage.getItem(COLLAPSED_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const collapsedCategoryIds = ref(loadInitialCollapsed())

  const persistCollapsedState = () => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify(collapsedCategoryIds.value))
  }

  const isCategoryCollapsed = (catId) => collapsedCategoryIds.value.includes(catId)

  const toggleCategoryCollapse = (catId) => {
    const idx = collapsedCategoryIds.value.indexOf(catId)
    if (idx !== -1) {
      collapsedCategoryIds.value.splice(idx, 1)
    } else {
      collapsedCategoryIds.value.push(catId)
    }
    persistCollapsedState()
  }

  // Lấy danh sách Category Ảo và Category Thật chưa bị xóa (Và cha của chúng cũng chưa bị xóa) 
  const filterTrulyActiveCategories = (rawList) => {
    const nonDeleted = (rawList || []).filter(c => !c.deleted_at)
    const nonDeletedMap = new Map(nonDeleted.map(c => [c.id, c]))

    // Đảm bảo nếu 1 Category cha đã bị xóa thì các Category con của nó cũng không còn được tính là Active
    const isAncestorActive = (cat) => {
      const visited = new Set([cat.id])
      let currentParentId = cat.parentId
      while (currentParentId) {
        if (visited.has(currentParentId)) return false
        visited.add(currentParentId)
        const parentObj = nonDeletedMap.get(currentParentId)
        if (!parentObj) return false
        currentParentId = parentObj.parentId
      }
      return true
    }

    return nonDeleted
      .filter(isAncestorActive)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
  }

  const activeVirtualCategoriesList = computed(() =>
    filterTrulyActiveCategories(virtualData.value.categories)
  )

  const activePhysicalCategoriesList = computed(() =>
    filterTrulyActiveCategories(physicalData.value.categories)
  )

  // Gộp chung để hiển thị trên Cây Sidebar (Category Ảo xếp trên, Folder Thật trên Windows xếp dưới)
  const activeCategoriesList = computed(() => [
    ...activeVirtualCategoriesList.value,
    ...activePhysicalCategoriesList.value
  ])

  const trashedCategoriesList = computed(() =>
    (virtualData.value.categories || []).filter(c => Boolean(c.deleted_at))
  )

// Xây dựng cây Cha - Con kèm trạng thái Collapse và mã màu nhánh gốc (branchIndex)
  const flattenedCategoryTree = computed(() => {
    const list = activeCategoriesList.value
    const validIds = new Set(list.map(c => c.id))
    const result = []
    const visited = new Set()
    let rootBranchCounter = 0

    const walk = (parentId = null, depth = 0, hiddenByAncestor = false, inheritedBranchIndex = 0, inheritedRootId = null) => {
      const children = list
        .filter(c => {
          const effectiveParent = (c.parentId && validIds.has(c.parentId) && c.parentId !== c.id) ? c.parentId : null
          return effectiveParent === parentId
        })
        .sort((a, b) => {
          // Ưu tiên nhóm Category Ảo lên trước nhóm Folder Thật ở cấp gốc
          if (Boolean(a.isPhysicalFolder) !== Boolean(b.isPhysicalFolder)) {
            return a.isPhysicalFolder ? 1 : -1
          }
          return Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
        })

      for (const child of children) {
        if (visited.has(child.id)) continue
        visited.add(child.id)

        // Nếu là Category Gốc (depth === 0) -> Cấp một mã màu nhánh mới; nếu là Con/Cháu -> Ăn theo màu của Cha gốc
        const currentBranchIndex = depth === 0 ? rootBranchCounter++ : inheritedBranchIndex
        const currentRootId = depth === 0 ? child.id : inheritedRootId

        const directChildren = list.filter(c => c.parentId === child.id)
        const isCollapsed = collapsedCategoryIds.value.includes(child.id)

        result.push({
          ...child,
          depth,
          rootId: currentRootId,
          branchIndex: currentBranchIndex,
          hasChildren: directChildren.length > 0,
          childrenCount: directChildren.length,
          isCollapsed,
          isHiddenByCollapse: hiddenByAncestor
        })

        walk(child.id, depth + 1, hiddenByAncestor || isCollapsed, currentBranchIndex, currentRootId)
      }
    }

    walk(null, 0, false, 0, null)
    return result
  })

  const visibleCategoryTree = computed(() =>
    flattenedCategoryTree.value.filter(node => !node.isHiddenByCollapse)
  )

  const virtualCategoryTree = computed(() =>
    flattenedCategoryTree.value.filter(node => !node.isPhysicalFolder)
  )

  const collapseAllCategories = () => {
    const parentIds = flattenedCategoryTree.value
      .filter(n => n.hasChildren)
      .map(n => n.id)
    collapsedCategoryIds.value = Array.from(new Set(parentIds))
    persistCollapsedState()
  }

  const expandAllCategories = () => {
    collapsedCategoryIds.value = []
    persistCollapsedState()
  }

  // Lấy toàn bộ ID con cháu (Mặc định chỉ lấy các Category đang Active, không lấy Category đã xóa)
  const getDescendantCategoryIds = (rootCatId, includeTrashed = false) => {
    const sourceList = includeTrashed
      ? [...(virtualData.value.categories || []), ...(physicalData.value.categories || [])]
      : activeCategoriesList.value

    const validRoot = sourceList.find(c => c.id === rootCatId)
    if (!validRoot && !includeTrashed) {
      return new Set()
    }

    const descendants = new Set([rootCatId])
    let added = true
    while (added) {
      added = false
      for (const cat of sourceList) {
        if (cat.parentId && descendants.has(cat.parentId) && !descendants.has(cat.id)) {
          descendants.add(cat.id)
          added = true
        }
      }
    }
    return descendants
  }

  const availableParentCategoryOptions = computed(() => {
    const virtualNodes = virtualCategoryTree.value
    if (!categoryModal.value.isEdit) return virtualNodes
    const forbiddenIds = getDescendantCategoryIds(categoryModal.value.form.id)
    return virtualNodes.filter(node => !forbiddenIds.has(node.id))
  })

  // Chỉ hiển thị tên của Category Ảo nếu Category Ảo đó chưa bị xóa
  const getCategoryLabel = (catId) => {
    if (!catId) return '❓ Chưa phân loại Category ảo'
    const found = activeVirtualCategoriesList.value.find(c => c.id === catId)
    if (!found) return '❓ Chưa phân loại Category ảo'
    return `${found.icon || '📌'} ${found.name}`
  }

  const findCategoryNodeById = (catId) => {
    if (!catId) return null
    return activeCategoriesList.value.find(c => c.id === catId) || null
  }

  // ==========================================================================
  // CHỈ CHO PHÉP CRUD TRÊN BẢNG CATEGORY ẢO (`cmg_ref_virtual`)
  // ==========================================================================
  const guardVirtualCategoryOnly = (catNode) => {
    if (catNode?.isPhysicalFolder) {
      notify.warning(
        'Thư mục Windows Chỉ Đọc (Read-Only)',
        `Mục "${catNode.name}" thuộc bảng Folder Thật trên ổ đĩa Windows nên không thể chỉnh sửa hoặc xóa. Bạn chỉ có thể bấm nút 🔄 Refresh để cập nhật từ ổ đĩa!`
      )
      return false
    }
    return true
  }

  const openCreateCategoryModal = (defaultParentId = null) => {
    if (defaultParentId) {
      const parentNode = virtualData.value.categories.find(c => c.id === defaultParentId)
      if (!parentNode || !guardVirtualCategoryOnly(parentNode)) return
    }

    const maxOrder = activeVirtualCategoriesList.value.reduce(
      (m, c) => Math.max(m, Number(c.sortOrder || 0)),
      0
    )

    categoryModal.value = {
      show: true,
      isEdit: false,
      form: {
        id: '',
        name: '',
        icon: '📌',
        parentId: defaultParentId,
        sortOrder: maxOrder + 1,
        isPhysicalFolder: false,
        created_at: '',
        updated_at: '',
        deleted_at: null
      }
    }
  }

  const openEditCategoryModal = (catNode) => {
    if (!guardVirtualCategoryOnly(catNode)) return

    categoryModal.value = {
      show: true,
      isEdit: true,
      form: {
        id: catNode.id,
        name: catNode.name,
        icon: catNode.icon || '📌',
        parentId: catNode.parentId || null,
        sortOrder: Number(catNode.sortOrder || 1),
        isPhysicalFolder: false,
        created_at: catNode.created_at,
        updated_at: catNode.updated_at,
        deleted_at: catNode.deleted_at || null
      }
    }
  }

  const handleSubmitCategoryModal = async () => {
    const f = categoryModal.value.form
    if (!f.name.trim()) {
      notify.warning('Thiếu tên Category', 'Vui lòng nhập tên Category ảo!')
      return
    }

    const confirmed = await notify.confirm({
      title: categoryModal.value.isEdit ? 'Xác nhận cập nhật Category Ảo?' : 'Xác nhận tạo Category Ảo mới?',
      message: categoryModal.value.isEdit
        ? 'Thông tin Category Ảo này sẽ được lưu vào bảng cmg_ref_virtual trên Firebase.'
        : 'Category Ảo mới sẽ được thêm vào bảng cmg_ref_virtual trên Firebase.',
      highlightText: `${f.icon} ${f.name.trim()} (Ưu tiên: #${f.sortOrder})`,
      confirmText: categoryModal.value.isEdit ? 'Đồng ý Cập nhật' : 'Đồng ý Tạo mới',
      cancelText: 'Quay lại',
      variant: 'info',
      icon: '🏷️'
    })
    if (!confirmed) return

    const now = getNowStr()
    if (categoryModal.value.isEdit) {
      const idx = virtualData.value.categories.findIndex(c => c.id === f.id)
      if (idx !== -1) {
        virtualData.value.categories[idx] = {
          ...virtualData.value.categories[idx],
          name: f.name.trim(),
          icon: f.icon.trim() || '📌',
          parentId: f.parentId || null,
          sortOrder: Number(f.sortOrder || 1),
          isPhysicalFolder: false,
          updated_at: now
        }
      }
    } else {
      const newId = `cat_${f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now().toString().slice(-3)}`
      virtualData.value.categories.push({
        id: newId,
        name: f.name.trim(),
        icon: f.icon.trim() || '📌',
        parentId: f.parentId || null,
        sortOrder: Number(f.sortOrder || 1),
        isPhysicalFolder: false,
        windowsFolderPath: '',
        created_at: now,
        updated_at: now,
        deleted_at: null
      })
    }

    categoryModal.value.show = false
    await saveVirtualToFirebase(
      categoryModal.value.isEdit ? `Cập nhật Category ảo: ${f.name}` : `Tạo Category ảo: ${f.name}`
    )
    notify.success('Đã lưu vào Bảng Ảo!', 'Cấu trúc Cây Category Ảo đã được cập nhật.')
  }

  const handleMoveCategoryOrder = async (node, direction) => {
    if (!guardVirtualCategoryOnly(node)) return

    const confirmed = await notify.confirm({
      title: 'Xác nhận thay đổi thứ tự ưu tiên Category Ảo?',
      message: `Bạn muốn dịch chuyển thứ tự ưu tiên của Category Ảo "${node.name}" ${direction < 0 ? 'lên trên' : 'xuống dưới'}?`,
      highlightText: `${node.icon} ${node.name} (Hiện tại: #${node.sortOrder})`,
      confirmText: 'Đồng ý Đổi thứ tự',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '🔢'
    })
    if (!confirmed) return

    const siblings = activeVirtualCategoriesList.value
      .filter(c => (c.parentId || null) === (node.parentId || null))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

    const currentIdx = siblings.findIndex(s => s.id === node.id)
    const targetIdx = currentIdx + direction
    if (currentIdx === -1 || targetIdx < 0 || targetIdx >= siblings.length) return

    const now = getNowStr()
    const currentCat = virtualData.value.categories.find(c => c.id === siblings[currentIdx].id)
    const swapCat = virtualData.value.categories.find(c => c.id === siblings[targetIdx].id)

    if (currentCat && swapCat) {
      const tempOrder = currentCat.sortOrder
      currentCat.sortOrder = swapCat.sortOrder
      swapCat.sortOrder = tempOrder === swapCat.sortOrder ? tempOrder + direction : tempOrder
      currentCat.updated_at = now
      swapCat.updated_at = now
      await saveVirtualToFirebase(`Đổi thứ tự ưu tiên Category ảo: ${node.name}`)
    }
  }

  const handleSoftDeleteCategory = async (node) => {
    if (!guardVirtualCategoryOnly(node)) return

    const descendantSet = getDescendantCategoryIds(node.id, false)
    const childCount = descendantSet.size - 1

    const confirmed = await notify.confirm({
      title: 'Xác nhận xóa mềm (Soft Delete) nhánh Category Ảo?',
      message: childCount > 0
        ? `Category Ảo "${node.name}" và toàn bộ ${childCount} Category Ảo con bên trong sẽ cùng được đánh dấu deleted_at và không còn được tính vào bộ đếm.`
        : 'Category Ảo này sẽ được đánh dấu deleted_at trong bảng cmg_ref_virtual và không còn tính vào bộ đếm.',
      highlightText: childCount > 0
        ? `${node.icon} ${node.name} (+ ${childCount} Category con)`
        : `${node.icon} ${node.name}`,
      confirmText: childCount > 0 ? `Xóa mềm cả ${descendantSet.size} Category` : 'Xóa mềm Category',
      cancelText: 'Hủy bỏ',
      variant: 'warning',
      icon: '🗑️'
    })
    if (!confirmed) return

    const now = getNowStr()
    virtualData.value.categories.forEach(c => {
      if (descendantSet.has(c.id)) {
        c.deleted_at = now
        c.updated_at = now
      }
    })

    if (descendantSet.has(selectedFilter.value)) {
      selectedFilter.value = 'ALL'
    }

    await saveVirtualToFirebase(`Xóa mềm nhánh Category ảo: ${node.name}`)
    notify.info('Đã xóa mềm Category Ảo', `Đã chuyển "${node.name}" vào danh sách đã xóa.`)
  }

  const handleRestoreCategory = async (tCat) => {
    if (!guardVirtualCategoryOnly(tCat)) return
    const descendantSet = getDescendantCategoryIds(tCat.id, true)

    const confirmed = await notify.confirm({
      title: 'Khôi phục nhánh Category Ảo đã xóa mềm?',
      message: 'Nhánh Category Ảo này sẽ được xóa cờ deleted_at và hiển thị trở lại.',
      highlightText: `${tCat.icon} ${tCat.name}`,
      confirmText: 'Khôi phục ngay',
      cancelText: 'Hủy',
      variant: 'info',
      icon: '♻️'
    })
    if (!confirmed) return

    const now = getNowStr()
    virtualData.value.categories.forEach(c => {
      if (descendantSet.has(c.id)) {
        c.deleted_at = null
        c.updated_at = now
      }
    })

    await saveVirtualToFirebase(`Khôi phục nhánh Category ảo: ${tCat.name}`)
    notify.success('Đã khôi phục!', `Category Ảo "${tCat.name}" đã hoạt động trở lại.`)
  }

  const handlePermanentDeleteCategory = async (tCat) => {
    if (!guardVirtualCategoryOnly(tCat)) return
    const descendantSet = getDescendantCategoryIds(tCat.id, true)

    const confirmed = await notify.confirm({
      title: 'Xóa vĩnh viễn nhánh Category Ảo khỏi Firebase?',
      message: 'Nhánh Category Ảo này sẽ bị xóa hẳn khỏi bảng cmg_ref_virtual và các ảnh thuộc về nó sẽ chuyển sang Chưa phân loại.',
      highlightText: `${tCat.icon} ${tCat.name}`,
      confirmText: 'Xóa Vĩnh Viễn',
      cancelText: 'Hủy',
      variant: 'danger',
      icon: '⚠️'
    })
    if (!confirmed) return

    virtualData.value.categories = virtualData.value.categories.filter(c => !descendantSet.has(c.id))
    Object.values(virtualData.value.items).forEach(item => {
      if (descendantSet.has(item.categoryId)) {
        item.categoryId = ''
      }
    })

    await saveVirtualToFirebase(`Xóa vĩnh viễn Category ảo: ${tCat.name}`)
  }

  // Xóa vĩnh viễn bản ghi Folder Thật khỏi Database (Không đụng đến file gốc trên máy tính)
  const handleDeletePhysicalFolderRecord = async (node) => {
    if (!node?.isPhysicalFolder) return

    const descendantSet = getDescendantCategoryIds(node.id, true)
    const childCount = descendantSet.size - 1

    const confirmed = await notify.confirm({
      title: 'Xác nhận xóa bản ghi Folder Thật khỏi Database?',
      message: childCount > 0
        ? `Thư mục "${node.name}" và ${childCount} thư mục con sẽ bị xóa khỏi cơ sở dữ liệu trên Firebase. Các file ảnh gốc trên ổ đĩa Windows được giữ nguyên 100% không bị ảnh hưởng.`
        : `Thư mục "${node.name}" sẽ bị xóa khỏi cơ sở dữ liệu trên Firebase. File ảnh gốc trên ổ đĩa Windows được giữ nguyên 100%.`,
      highlightText: `${node.icon || '📂'} ${node.name} (Chỉ xóa bản ghi Database)`,
      confirmText: 'Đồng ý Xóa khỏi Database',
      cancelText: 'Hủy',
      variant: 'danger',
      icon: '🗑️'
    })
    if (!confirmed) return

    // 1. Xóa các Category Thật trong nhánh khỏi mảng `physicalData.categories`
    physicalData.value.categories = (physicalData.value.categories || []).filter(
      c => !descendantSet.has(c.id)
    )

    // 2. Gỡ liên kết `physicalCategoryId` của các ảnh thuộc nhánh này
    Object.values(physicalData.value.items || {}).forEach(item => {
      if (descendantSet.has(item.physicalCategoryId)) {
        item.physicalCategoryId = ''
      }
    })

    if (descendantSet.has(selectedFilter.value)) {
      selectedFilter.value = 'ALL'
    }

    // GỌI HÀM LƯU BẢNG THẬT LÊN FIREBASE
    await savePhysicalToFirebase(`Xóa bản ghi Folder Thật: ${node.name}`)
    notify.success('Đã xóa khỏi Database!', `Đã gỡ bỏ bản ghi "${node.name}" (File gốc trên Windows vẫn an toàn).`)
  }

  return {
    collapsedCategoryIds,
    isCategoryCollapsed,
    toggleCategoryCollapse,
    collapseAllCategories,
    expandAllCategories,
    activeVirtualCategoriesList,
    activePhysicalCategoriesList,
    activeCategoriesList,
    trashedCategoriesList,
    flattenedCategoryTree,
    visibleCategoryTree,
    virtualCategoryTree,
    availableParentCategoryOptions,
    getDescendantCategoryIds,
    getCategoryLabel,
    findCategoryNodeById,
    openCreateCategoryModal,
    openEditCategoryModal,
    handleSubmitCategoryModal,
    handleMoveCategoryOrder,
    handleSoftDeleteCategory,
    handleRestoreCategory,
    handlePermanentDeleteCategory,
    handleDeletePhysicalFolderRecord
  }
}
// src/services/draftService.js

const ASSET_DRAFT_STORAGE_KEY = 'cmg_new_asset_pack_draft_v1'

/**
 * 1. Lưu bản nháp Asset Pack mới xuống LocalStorage ngay khi mở Modal hoặc khi đang gõ
 */
export const saveAssetDraftToLocal = (draftPayload) => {
  try {
    const dataToSave = {
      savedAt: Date.now(),
      formData: draftPayload.formData,
      tagsTextInput: draftPayload.tagsTextInput || '',
      fullDescriptionText: draftPayload.fullDescriptionText || '',
      featuresText: draftPayload.featuresText || '',
      galleryText: draftPayload.galleryText || '',
      activeModalTab: draftPayload.activeModalTab || 'identity'
    }
    localStorage.setItem(ASSET_DRAFT_STORAGE_KEY, JSON.stringify(dataToSave))
    return dataToSave
  } catch (error) {
    console.warn('[DraftService] Không thể lưu bản nháp xuống LocalStorage:', error)
    return null
  }
}

/**
 * 2. Kiểm tra và đọc bản nháp đang tồn tại trong LocalStorage (nếu có)
 */
export const loadAssetDraftFromLocal = () => {
  try {
    const raw = localStorage.getItem(ASSET_DRAFT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.formData) return null
    return parsed
  } catch (error) {
    console.warn('[DraftService] Lỗi đọc bản nháp từ LocalStorage:', error)
    return null
  }
}

/**
 * 3. Xóa bản nháp khỏi LocalStorage (Gọi khi đã Lưu thành công lên Firebase hoặc khi bấm Hủy bản nháp)
 */
export const clearAssetDraftFromLocal = () => {
  try {
    localStorage.removeItem(ASSET_DRAFT_STORAGE_KEY)
  } catch (error) {
    console.warn('[DraftService] Lỗi xóa bản nháp:', error)
  }
}
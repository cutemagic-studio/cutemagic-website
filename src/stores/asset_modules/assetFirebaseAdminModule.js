// src/stores/asset_modules/assetFirebaseAdminModule.js
import { db } from '../../firebase'
import { ref as dbRef, onValue, set, update, remove, get } from 'firebase/database'

import { mockAssets } from '../../data/assets/cmg/cmg_assets'
import { CmgAssetModel } from '../../models/cmg/Cmg_AssetModel'
import {
  CMG_ASSET_ID_POOL,
  getNextUnusedAssetId,
  getAvailableAssetIds,
  getIdPoolStats
} from '../../data/assets/cmg/cmg_id_pool'

import {
  FIREBASE_ASSETS_PATH,
  FIREBASE_ASSETS_BACKUP_PATH,
  getTodayDateString,
  getNowDateTimeString,
  saveFirebaseCacheToLocal
} from './assetHelpers'

// ==========================================
// 1. GETTERS QUẢN LÝ POOL ID, BACKUP & THÙNG RÁC
// ==========================================
export const firebaseAdminGetters = {
  // Gom cả Pack đang hoạt động và Pack đang nằm trong Thùng rác để bảo vệ ID 6 chữ số không bị cấp trùng
  allAssetsIncludingDeleted: (state) => [
    ...(state.assets || []),
    ...(state.deletedAssets || [])
  ],

  // Thống kê kho 100 mã ID 6 chữ số (Tính trên toàn bộ bản ghi tồn tại + xóa mềm)
  idPoolStats: (state) => getIdPoolStats([
    ...(state.assets || []),
    ...(state.deletedAssets || [])
  ]),

  // Danh sách các mã ID 6 chữ số thực sự còn trống
  availablePoolIds: (state) => getAvailableAssetIds([
    ...(state.assets || []),
    ...(state.deletedAssets || [])
  ]),

  // Số lượng bản ghi đang nằm trong Thùng rác (Soft Deleted)
  deletedCount: (state) => (state.deletedAssets || []).length,

  // Kiểm tra xem 1 Asset Pack có bản ghi song song (Backup) hay không
  hasParallelBackup: (state) => {
    return (assetId) => Boolean(state.backupMap && state.backupMap[Number(assetId)])
  },

  // Lấy thông tin chi tiết bản ghi song song của 1 Asset Pack
  getParallelBackup: (state) => {
    return (assetId) => state.backupMap?.[Number(assetId)] || null
  }
}

// ==========================================
// 2. ACTIONS ĐỒNG BỘ FIREBASE, PARALLEL BACKUP & SOFT DELETE
// ==========================================
export const firebaseAdminActions = {
  /**
   * Lắng nghe thời gian thực cả 2 nhánh:
   * 1. 'cmg_assets' (Tách tự động thành assets đang hoạt động & deletedAssets đã xóa mềm)
   * 2. 'cmg_assets_backup' (Lưu vào backupMap để sẵn sàng khôi phục tức thì)
   */
  initFirebaseAssetsSync() {
    if (this.isFirebaseSynced || this.isLoadingFirebase) return
    this.isLoadingFirebase = true

    const assetsRef = dbRef(db, FIREBASE_ASSETS_PATH)
    const backupsRef = dbRef(db, FIREBASE_ASSETS_BACKUP_PATH)

    // 1. Lắng nghe nhánh Bản ghi song song (Parallel Backup)
    onValue(backupsRef, (snap) => {
      const bData = snap.val() || {}
      const map = {}
      Object.values(bData).forEach((item) => {
        if (item && item.id) {
          map[Number(item.id)] = item
        }
      })
      this.backupMap = map
    })

    // 2. Lắng nghe nhánh Dữ liệu chính thức (cmg_assets)
    onValue(
      assetsRef,
      async (snapshot) => {
        const data = snapshot.val()

        if (!data) {
          await this.seedMockAssetsToFirebase()
          this.isLoadingFirebase = false
          this.isFirebaseSynced = true
          return
        }

        const allRawItems = Object.values(data)
          .filter(Boolean)
          .sort((a, b) => Number(a.id) - Number(b.id))

        const activeModels = []
        const softDeletedModels = []
        const activeRawForCache = []

        allRawItems.forEach((rawItem) => {
          const model = new CmgAssetModel(rawItem)
          if (model.isDeleted) {
            softDeletedModels.push(model)
          } else {
            activeModels.push(model)
            activeRawForCache.push(rawItem)
          }
        })

        this.assets = activeModels
        this.deletedAssets = softDeletedModels
        this.isFirebaseSynced = true
        this.isLoadingFirebase = false

        // Chỉ lưu các Pack đang hoạt động vào Cache LocalStorage cho phía User
        saveFirebaseCacheToLocal(activeRawForCache)
      },
      (error) => {
        console.error('[AssetStore] Lỗi kết nối Firebase:', error)
        this.isLoadingFirebase = false
      }
    )
  },

  /**
   * Khởi tạo 30 gói mẫu chuẩn 6 chữ số lên cả nhánh chính VÀ nhánh bản ghi song song
   */
  async seedMockAssetsToFirebase() {
    const mainPayload = {}
    const backupPayload = {}
    const nowTime = getNowDateTimeString()

    mockAssets.forEach((item, index) => {
      const rawCopy = JSON.parse(JSON.stringify(item))

      if (!rawCopy.id || Number(rawCopy.id) < 100000) {
        rawCopy.id = CMG_ASSET_ID_POOL[index] || (100000 + index)
      }

      const model = new CmgAssetModel(rawCopy)
      const plain = model.toPlainObject()

      mainPayload[`pack_${model.id}`] = plain
      backupPayload[`pack_${model.id}`] = {
        ...JSON.parse(JSON.stringify(plain)),
        _backupMeta: {
          backedUpAt: nowTime,
          reason: 'initial_seed'
        }
      }
    })

    await Promise.all([
      set(dbRef(db, FIREBASE_ASSETS_PATH), mainPayload),
      set(dbRef(db, FIREBASE_ASSETS_BACKUP_PATH), backupPayload)
    ])
  },

  /**
   * THÊM MỚI HOẶC CẬP NHẬT ASSET PACK (TỰ ĐỘNG GHI BẢN GHI SONG SONG):
   * - Nếu Cập nhật: Sao lưu dữ liệu HIỆN TẠI của bản ghi chính sang 'cmg_assets_backup/pack_ID' trước khi lưu đè.
   * - Nếu Tạo mới: Lưu đồng thời dữ liệu ban đầu vào cả 'cmg_assets/pack_ID' và 'cmg_assets_backup/pack_ID'.
   */
  async saveAssetToFirebase(assetData) {
    const allKnownAssets = [...(this.assets || []), ...(this.deletedAssets || [])]

    if (!assetData.id || Number(assetData.id) < 100000) {
      assetData.id = getNextUnusedAssetId(allKnownAssets)
    }

    const numericId = Number(assetData.id)
    const nowTime = getNowDateTimeString()

    // Kiểm tra xem bản ghi này đã tồn tại trên hệ thống chưa
    const existingModel = allKnownAssets.find(a => Number(a.id) === numericId)

    // Chuẩn hóa dữ liệu mới qua CmgAssetModel (tự động loại bỏ availableIn cứng)
    const newModel = new CmgAssetModel(assetData)
    const newPlainData = newModel.toPlainObject()

    if (existingModel) {
      // [TRƯỜNG HỢP CẬP NHẬT]: Lưu trạng thái HIỆN TẠI (trước khi sửa) sang Bản ghi song song
      const currentPlainBeforeUpdate = typeof existingModel.toPlainObject === 'function'
        ? existingModel.toPlainObject()
        : new CmgAssetModel(existingModel).toPlainObject()

      const parallelBackupRecord = {
        ...currentPlainBeforeUpdate,
        _backupMeta: {
          backedUpAt: nowTime,
          reason: 'before_update'
        }
      }

      await Promise.all([
        set(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`), parallelBackupRecord),
        set(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`), newPlainData)
      ])
    } else {
      // [TRƯỜNG HỢP TẠO MỚI]: Tạo luôn bản ghi song song với cùng dữ liệu ban đầu
      const initialBackupRecord = {
        ...JSON.parse(JSON.stringify(newPlainData)),
        _backupMeta: {
          backedUpAt: nowTime,
          reason: 'initial_create'
        }
      }

      await Promise.all([
        set(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`), newPlainData),
        set(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`), initialBackupRecord)
      ])
    }

    return newModel
  },

  /**
   * KHÔI PHỤC DỮ LIỆU GẦN NHẤT TỪ BẢN GHI SONG SONG (ROLLBACK 1 PACK):
   * Lấy dữ liệu từ 'cmg_assets_backup/pack_ID' đè ngược lại 'cmg_assets/pack_ID'.
   * Đồng thời lưu trạng thái trước khi rollback vào lại nhánh backup để có thể đảo chiều nếu cần.
   */
  async restoreAssetFromParallelBackup(assetId) {
    const numericId = Number(assetId)
    if (!numericId) throw new Error('Mã ID không hợp lệ!')

    // Đọc bản ghi song song từ state hoặc trực tiếp từ Firebase
    let backupData = this.backupMap?.[numericId]
    if (!backupData) {
      const snap = await get(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`))
      if (snap.exists()) backupData = snap.val()
    }

    if (!backupData) {
      throw new Error(`Không tìm thấy bản ghi backup song song cho Pack #${numericId}!`)
    }

    // Dọn bỏ _backupMeta và đảm bảo bản ghi được kích hoạt lại (deleted_at = null)
    const cleanRestoreCopy = JSON.parse(JSON.stringify(backupData))
    delete cleanRestoreCopy._backupMeta
    cleanRestoreCopy.deleted_at = null
    if (cleanRestoreCopy.dates) cleanRestoreCopy.dates.deleted_at = null

    const restoredModel = new CmgAssetModel(cleanRestoreCopy)
    const restoredPlain = restoredModel.toPlainObject()

    // Lưu trạng thái hiện tại vào backup trước khi hoàn tác (an toàn 2 chiều)
    const allKnownAssets = [...(this.assets || []), ...(this.deletedAssets || [])]
    const currentItem = allKnownAssets.find(a => Number(a.id) === numericId)

    const tasks = [
      set(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`), restoredPlain)
    ]

    if (currentItem) {
      const currentPlain = currentItem.toPlainObject()
      tasks.push(
        set(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`), {
          ...currentPlain,
          _backupMeta: {
            backedUpAt: getNowDateTimeString(),
            reason: 'swapped_on_restore'
          }
        })
      )
    }

    await Promise.all(tasks)
    return restoredModel
  },

  /**
   * TÍNH NĂNG SOFT DELETE (ĐÁNH DẤU XÓA MỀM BẰNG CỘT deleted_at):
   * Không xóa vật lý khỏi Firebase mà đánh dấu ngày giờ vào deleted_at,
   * đồng thời cập nhật bản ghi song song trước khi đưa vào Thùng rác.
   */
  async softDeleteAsset(assetId) {
    const numericId = Number(assetId)
    if (!numericId) return

    const target = this.assets.find(a => Number(a.id) === numericId)
    const deletedTimestamp = getNowDateTimeString()

    // Lưu trạng thái còn sống vào bản ghi song song trước khi đánh dấu deleted_at
    if (target) {
      const plainBeforeDelete = target.toPlainObject()
      await set(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`), {
        ...plainBeforeDelete,
        _backupMeta: {
          backedUpAt: deletedTimestamp,
          reason: 'before_soft_delete'
        }
      })
    }

    await Promise.all([
      update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`), {
        deleted_at: deletedTimestamp
      }),
      update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/dates`), {
        deleted_at: deletedTimestamp
      })
    ])
  },

  // Giữ tên hàm deleteAssetFromFirebase trỏ vào softDeleteAsset để an toàn tuyệt đối 
  async deleteAssetFromFirebase(assetId) {
    return await this.softDeleteAsset(assetId)
  },

  /**
   * KHÔI PHỤC TRẠNG THÁI TỒN TẠI (GỠ BỎ CỘT deleted_at = null)
   */
  async restoreSoftDeletedAsset(assetId) {
    const numericId = Number(assetId)
    if (!numericId) return

    await Promise.all([
      update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`), {
        deleted_at: null
      }),
      update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/dates`), {
        deleted_at: null
      })
    ])
  },

  /**
   * XÓA VĨNH VIỄN (HARD DELETE - Chỉ dùng khi dọn sạch khỏi Thùng rác)
   */
  async hardDeleteAssetPermanently(assetId) {
    const numericId = Number(assetId)
    if (!numericId) return
    await Promise.all([
      remove(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}`)),
      remove(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`))
    ])
  },

  /**
   * 1-Click đánh dấu Pack "Vừa được cập nhật hôm nay" (Có lưu bản ghi song song trước khi đổi ngày)
   */
  async touchAssetLatestUpdate(assetId, customDate = null) {
    const numericId = Number(assetId)
    const dateStr = customDate || getTodayDateString()
    const target = this.assets.find(a => Number(a.id) === numericId)

    if (target) {
      await set(dbRef(db, `${FIREBASE_ASSETS_BACKUP_PATH}/pack_${numericId}`), {
        ...target.toPlainObject(),
        _backupMeta: {
          backedUpAt: getNowDateTimeString(),
          reason: 'before_touch_today'
        }
      })
    }

    await update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${numericId}/dates`), {
      latestUpdate: dateStr
    })
  },

  /**
   * Bật/Tắt nhanh các cờ (isFeatured, isExclusive, isLaunchEdition) ngay trên bảng Admin
   */
  async quickToggleAssetFlag(assetId, flagKey) {
    const target = this.getAssetById ? this.getAssetById(assetId) : null
    if (!target) return
    const newValue = !Boolean(target.flags?.[flagKey])
    await update(dbRef(db, `${FIREBASE_ASSETS_PATH}/pack_${Number(assetId)}/flags`), {
      [flagKey]: newValue
    })
  }
}
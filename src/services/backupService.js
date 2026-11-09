// src/services/backupService.js
import { db } from '../firebase'
import { ref as dbRef, get, set } from 'firebase/database'
import { CmgAssetModel } from '../models/cmg/Cmg_AssetModel'

// Helper: Lấy chuỗi ngày giờ hiện tại để đặt tên file (VD: 2026-11-06_09-15)
const getTimestampForFilename = () => {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}_${hh}-${min}`
}

// Helper: Kích hoạt trình duyệt tải file xuống máy tính
const triggerBrowserDownload = (content, filename, mimeType = 'text/javascript;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * ============================================================================
 * 1. SAO LƯU DỮ LIỆU ASSET PACKS RA FILE JS (.js)
 * Tạo ra file JS chuẩn cú pháp ES Module, có thể thay thế trực tiếp cho cmg_assets.js
 * ============================================================================
 */
export const downloadAssetsBackupJS = async (fallbackAssets = []) => {
  try {
    // Ưu tiên lấy dữ liệu mới nhất trực tiếp từ nhánh 'cmg_assets' trên Firebase
    const snapshot = await get(dbRef(db, 'cmg_assets'))
    let rawList = []

    if (snapshot.exists()) {
      rawList = Object.values(snapshot.val()).filter(Boolean)
    } else {
      rawList = fallbackAssets
    }

    // Chuẩn hóa qua CmgAssetModel và sắp xếp theo ID 6 chữ số tăng dần
    const cleanArray = rawList
      .map(item => {
        const model = item instanceof CmgAssetModel ? item : new CmgAssetModel(item)
        return typeof model.toPlainObject === 'function' 
          ? model.toPlainObject() 
          : JSON.parse(JSON.stringify(model))
      })
      .sort((a, b) => Number(a.id) - Number(b.id))

    const timestampStr = getTimestampForFilename()
    const formattedJson = JSON.stringify(cleanArray, null, 4)

    // Đóng gói thành file .js hoàn chỉnh, sẵn sàng dùng choทั้ง Frontend và Laravel Seeder
    const jsFileContent = `/**
 * CUTE MAGIC 3D - ASSET PACKS BACKUP FILE
 * Ngày sao lưu: ${new Date().toLocaleString('vi-VN')}
 * Tổng số Asset Packs: ${cleanArray.length}
 * Hướng dẫn: Bạn có thể dùng nội dung này thay thế trực tiếp cho src/data/assets/cmg/cmg_assets.js
 */

import { CmgAssetModel } from '../../../models/CmgAssetModel'

export const rawBackupAssets = ${formattedJson}

export const mockAssets = rawBackupAssets.map(item => new CmgAssetModel(item))

export default mockAssets
`

    const filename = `cmg_assets_backup_${timestampStr}.js`
    triggerBrowserDownload(jsFileContent, filename)

    return { success: true, count: cleanArray.length, filename }
  } catch (error) {
    console.error('[BackupService] Lỗi khi sao lưu Asset Packs:', error)
    return { success: false, error: error.message }
  }
}

/**
 * ============================================================================
 * 2. SAO LƯU DỮ LIỆU HÀNH VI NGƯỜI DÙNG RA FILE JS (.js)
 * Bao gồm toàn bộ Hồ sơ IP duy nhất (visitors) và Nhật ký sự kiện (events)
 * ============================================================================
 */
export const downloadAnalyticsBackupJS = async () => {
  try {
    const [visitorsSnap, eventsSnap] = await Promise.all([
      get(dbRef(db, 'analytics/visitors')),
      get(dbRef(db, 'analytics/events'))
    ])

    const visitorsObj = visitorsSnap.exists() ? visitorsSnap.val() : {}
    const eventsObj = eventsSnap.exists() ? eventsSnap.val() : {}

    const visitorsList = Object.values(visitorsObj)
    const eventsList = Object.keys(eventsObj).map(key => ({
      eventId: key,
      ...eventsObj[key]
    })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    // Tính toán nhanh các chỉ số tổng kết để ghi vào đầu file backup
    const totalDownloads = visitorsList.reduce((sum, v) => sum + (v.totalDownloads || 0), 0)
    const totalAssetViews = visitorsList.reduce((sum, v) => sum + (v.totalAssetViews || 0), 0)

    const backupPayload = {
      exportedAt: new Date().toISOString(),
      exportedAtLocal: new Date().toLocaleString('vi-VN'),
      summary: {
        uniqueVisitorsCount: visitorsList.length,
        totalEventsCount: eventsList.length,
        totalAssetViews,
        totalDownloads
      },
      visitors: visitorsObj,
      events: eventsList
    }

    const timestampStr = getTimestampForFilename()
    const formattedJson = JSON.stringify(backupPayload, null, 2)

    const jsFileContent = `/**
 * CUTE MAGIC 3D - USER ANALYTICS & BEHAVIOR BACKUP
 * Ngày sao lưu: ${backupPayload.exportedAtLocal}
 * Số lượng IP duy nhất (Unique Visitors): ${visitorsList.length}
 * Tổng số sự kiện hành vi (Events): ${eventsList.length}
 * Tổng lượt xem Pack: ${totalAssetViews} | Tổng lượt Download: ${totalDownloads}
 */

export const cmgAnalyticsBackup = ${formattedJson}

export default cmgAnalyticsBackup
`

    const filename = `cmg_user_analytics_backup_${timestampStr}.js`
    triggerBrowserDownload(jsFileContent, filename)

    return { 
      success: true, 
      visitorsCount: visitorsList.length, 
      eventsCount: eventsList.length, 
      filename 
    }
  } catch (error) {
    console.error('[BackupService] Lỗi khi sao lưu Analytics:', error)
    return { success: false, error: error.message }
  }
}

/**
 * ============================================================================
 * 3. KHÔI PHỤC (RESTORE) DỮ LIỆU ASSET PACK TỪ FILE BACKUP LÊN FIREBASE
 * Đọc file .js hoặc .json vừa tải về và đẩy ngược lại lên nhánh 'cmg_assets'
 * ============================================================================
 */
export const restoreAssetsFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const text = event.target.result
        let parsedArray = []

        // Nếu là file .json thuần
        if (file.name.endsWith('.json')) {
          parsedArray = JSON.parse(text)
        } else {
          // Nếu là file .js do hệ thống xuất ra -> Trích xuất mảng JSON nằm trong biến rawBackupAssets
          const match = text.match(/export\s+const\s+rawBackupAssets\s*=\s*(\[[\s\S]*?\])\s*(?:export|$)/)
          if (match && match[1]) {
            parsedArray = JSON.parse(match[1])
          } else {
            throw new Error('Định dạng file .js không hợp lệ hoặc không tìm thấy mảng rawBackupAssets.')
          }
        }

        if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
          throw new Error('File sao lưu không chứa danh sách Asset Pack nào.')
        }

        // Đẩy toàn bộ danh sách lên Firebase nhánh cmg_assets
        const payload = {}
        parsedArray.forEach(item => {
          const model = new CmgAssetModel(item)
          const plain = typeof model.toPlainObject === 'function' 
            ? model.toPlainObject() 
            : JSON.parse(JSON.stringify(model))
          payload[`pack_${model.id}`] = plain
        })

        await set(dbRef(db, 'cmg_assets'), payload)
        resolve({ success: true, count: parsedArray.length })
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(new Error('Không thể đọc file từ máy tính.'))
    reader.readAsText(file)
  })
}
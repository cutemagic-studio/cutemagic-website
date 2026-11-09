// src/services/activityLogService.js
import { db } from '../firebase'
import { ref as dbRef, push, set, get, update } from 'firebase/database'

// =========================================================
// CẤU HÌNH GIỚI HẠN BẢN GHI TỐI ĐA TRONG BẢNG ACTIVITY LOGS
// =========================================================
export const ACTIVITY_LOG_CONFIG = {
  FIREBASE_PATH: 'analytics/activity_logs',
  CONFIG_PATH: 'analytics/config/max_activity_logs',
  DEFAULT_MAX_RECORDS: 10000 // Giới hạn mặc định: 10.000 bản ghi
}

// Bộ nhớ đệm thông tin IP & Địa lý ngắn gọn của phiên hiện tại để không phải gọi lại API nhiều lần
let cachedGeoProfile = null

export const setCachedVisitorGeoProfile = (profile) => {
  if (profile && profile.ip) {
    cachedGeoProfile = profile
  }
}

export const getCachedVisitorGeoProfile = () => cachedGeoProfile

/**
 * Tạo bản ghi hoạt động tiêu biểu mới và kiểm tra giới hạn 10.000 bản ghi
 * @param {'PAGE_VISIT' | 'VIEW_ASSET' | 'LIKE_ASSET' | 'DOWNLOAD_ASSET'} actionType
 * @param {Object} payload - { path, assetId, assetTitle, geoProfile }
 */
export const pushActivityNotificationLog = async (actionType, payload = {}) => {
  try {
    const geo = payload.geoProfile || cachedGeoProfile || {}
    const ip = geo.ip || 'Unknown IP'
    const visitorKey = ip.replace(/[\.\:]/g, '_')

    const now = Date.now()
    const logsRef = dbRef(db, ACTIVITY_LOG_CONFIG.FIREBASE_PATH)
    const newLogRef = push(logsRef)

    const shortLocation = [geo.city, geo.country].filter(Boolean).join(', ') || 'Unknown Location'

    const logRecord = {
      id: newLogRef.key,
      visitorKey,
      ip,
      location: shortLocation,
      city: geo.city || 'Unknown',
      country: geo.country || 'Unknown',
      countryCode: geo.countryCode || '',
      flag: geo.flag || '',
      isp: geo.isp || 'N/A',
      device: geo.device || 'Desktop',
      browser: geo.browser || 'Browser',
      actionType, // 'PAGE_VISIT' | 'VIEW_ASSET' | 'LIKE_ASSET' | 'DOWNLOAD_ASSET'
      path: payload.path || window.location.pathname,
      assetId: payload.assetId ? Number(payload.assetId) : null,
      assetTitle: payload.assetTitle || '',
      timestamp: now
    }

    await set(newLogRef, logRecord)

    // Chạy kiểm tra & cắt gọn các bản ghi cũ nhất nếu vượt quá giới hạn (Chạy bất đồng bộ không làm chậm UI)
    enforceActivityLogQuota().catch(() => {})

    return logRecord
  } catch (err) {
    console.warn('[ActivityLogService] Không thể ghi nhật ký hoạt động:', err)
    return null
  }
}

/**
 * Kiểm tra tổng số bản ghi trong bảng 'analytics/activity_logs'.
 * Nếu vượt quá maxLimit (VD: 10.000), tự động xóa các bản ghi cũ nhất để nhường chỗ cho bản ghi mới.
 */
export const enforceActivityLogQuota = async (customLimit = null) => {
  try {
    let maxLimit = customLimit
    if (!maxLimit) {
      const limitSnap = await get(dbRef(db, ACTIVITY_LOG_CONFIG.CONFIG_PATH))
      maxLimit = limitSnap.exists() ? Number(limitSnap.val()) : ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS
    }

    if (!maxLimit || maxLimit < 100) maxLimit = ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS

    const logsRef = dbRef(db, ACTIVITY_LOG_CONFIG.FIREBASE_PATH)
    const snapshot = await get(logsRef)
    if (!snapshot.exists()) return { total: 0, deleted: 0 }

    const data = snapshot.val()
    const allKeys = Object.keys(data)
    const totalCount = allKeys.length

    if (totalCount <= maxLimit) {
      return { total: totalCount, deleted: 0 }
    }

    // Sắp xếp từ cũ nhất đến mới nhất theo timestamp (hoặc theo thứ tự push key của Firebase)
    const sortedOldestFirst = allKeys.sort((keyA, keyB) => {
      const timeA = data[keyA]?.timestamp || 0
      const timeB = data[keyB]?.timestamp || 0
      return timeA - timeB
    })

    const excessCount = totalCount - maxLimit
    const keysToDelete = sortedOldestFirst.slice(0, excessCount)

    // Tạo map xóa hàng loạt chỉ trong 1 request duy nhất
    const deleteUpdates = {}
    keysToDelete.forEach((k) => {
      deleteUpdates[k] = null
    })

    await update(logsRef, deleteUpdates)
    return { total: maxLimit, deleted: keysToDelete.length }
  } catch (error) {
    console.warn('[ActivityLogService] Lỗi khi dọn dẹp giới hạn bản ghi:', error)
    return { total: 0, deleted: 0 }
  }
}

/**
 * Cho phép Admin thay đổi cấu hình giới hạn tối đa (Mặc định 10.000 bản ghi)
 */
export const updateMaxActivityLogsLimit = async (newLimit) => {
  const validLimit = Math.max(100, Number(newLimit) || ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS)
  await set(dbRef(db, ACTIVITY_LOG_CONFIG.CONFIG_PATH), validLimit)
  return await enforceActivityLogQuota(validLimit)
}
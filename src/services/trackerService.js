// src/services/trackerService.js
import { db } from '../firebase'
import { 
  ref as dbRef, 
  get, 
  set, 
  update, 
  push, 
  remove,
  query,
  orderByChild,
  endAt
} from 'firebase/database'

// Thêm vào đầu file src/services/trackerService.js:
import { pushActivityNotificationLog, setCachedVisitorGeoProfile } from './activityLogService'

const METADATA_STORAGE_KEY = 'cmg_visitor_meta_v2'
const ABSTRACT_API_KEY = '03d032102980424980c8dfcd3030c09f'

// Helper: Lấy chuỗi ngày hiện tại chuẩn YYYY-MM-DD để đếm Download trong ngày
export const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper: Chuyển IP thành Firebase Key hợp lệ (Firebase cấm dấu '.' và ':')
export const ipToVisitorKey = (ip = '0.0.0.0') => {
  return 'ip_' + ip.replace(/[\.\:]/g, '_')
}

// Helper: Nhận diện Trình duyệt & Thiết bị
const getDeviceInfo = () => {
  const ua = navigator.userAgent
  let browser = 'Other'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'

  const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop'
  return { browser, device }
}

/**
 * 1. LẤY HOẶC KHỞI TẠO METADATA TỪ IP (Có Cache LocalStorage tránh hết quota API)
 */
// 1. Trong hàm fetchVisitorMetadata() của src/services/trackerService.js:
export const fetchVisitorMetadata = async () => {
  try {
    const cached = localStorage.getItem(METADATA_STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed?.ip && parsed?.visitorKey) {
        // Nạp luôn vào bộ nhớ đệm cho Activity Log
        setCachedVisitorGeoProfile(parsed)
        return parsed
      }
    }
  } catch (e) {
    console.warn('[Tracker] Lỗi đọc cache IP:', e)
  }

  try {
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}`)
    const data = await response.json()

    if (data && data.ip_address) {
      const { browser, device } = getDeviceInfo()
      const meta = {
        visitorKey: ipToVisitorKey(data.ip_address),
        ip: data.ip_address,
        city: data.location?.city || 'Unknown',
        country: data.location?.country || 'Unknown',
        countryCode: data.location?.country_code || '',
        flag: data.flag?.png || '',
        isp: data.asn?.name || 'Unknown ISP',
        browser,
        device
      }
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(meta))
      setCachedVisitorGeoProfile(meta)
      return meta
    }
  } catch (error) {
    console.error('[Tracker] Không thể lấy IP từ AbstractAPI:', error)
  }

  const fallbackId = localStorage.getItem('cmg_fallback_id') || ('guest_' + Math.random().toString(36).substring(2, 10))
  localStorage.setItem('cmg_fallback_id', fallbackId)
  const { browser, device } = getDeviceInfo()
  const fallbackMeta = {
    visitorKey: fallbackId,
    ip: 'Hidden (AdBlock)',
    city: 'Unknown',
    country: 'Unknown',
    countryCode: '',
    flag: '',
    isp: 'N/A',
    browser,
    device
  }
  setCachedVisitorGeoProfile(fallbackMeta)
  return fallbackMeta
}

/**
 * 2. GHI NHẬN HÀNH VI TRUNG TÂM (Gọi khi: Chuyển trang, Xem Pack, Tải Pack)
 * @param {'PAGE_VIEW' | 'VIEW_ASSET' | 'DOWNLOAD_ASSET'} actionType 
 * @param {Object} payload { path, assetId, assetTitle, user }
 */
export const trackUserBehavior = async (actionType, payload = {}) => {
  try {
    const meta = await fetchVisitorMetadata()
    if (!meta?.visitorKey) return

    const now = Date.now()
    const todayKey = getTodayKey()
    const visitorPath = dbRef(db, `analytics/visitors/${meta.visitorKey}`)

    // Đọc hồ sơ hiện tại của IP này trên Firebase
    const snapshot = await get(visitorPath)
    const existing = snapshot.exists() ? snapshot.val() : null

    // Khởi tạo hoặc cập nhật các mảng/bộ đếm
    const visitedPages = new Set(existing?.visitedPages || [])
    if (payload.path) visitedPages.add(payload.path)

    const viewedAssets = new Set(existing?.viewedAssets || [])
    let totalAssetViews = existing?.totalAssetViews || 0
    if (actionType === 'VIEW_ASSET' && payload.assetId) {
      viewedAssets.add(`${payload.assetId}: ${payload.assetTitle || 'Asset'}`)
      totalAssetViews++
    }

    const downloadsByDate = existing?.downloadsByDate || {}
    let totalDownloads = existing?.totalDownloads || 0
    const downloadedAssets = new Set(existing?.downloadedAssets || [])

    if (actionType === 'DOWNLOAD_ASSET' && payload.assetId) {
      downloadsByDate[todayKey] = (downloadsByDate[todayKey] || 0) + 1
      totalDownloads++
      downloadedAssets.add(`${payload.assetId}: ${payload.assetTitle || 'Asset'}`)
    }

    // Cập nhật Hồ sơ Duy nhất của IP này
    const updatedProfile = {
      ...meta,
      uid: payload.user?.uid || existing?.uid || 'guest',
      displayName: payload.user?.displayName || existing?.displayName || 'Guest',
      email: payload.user?.email || existing?.email || 'N/A',
      
      firstSeen: existing?.firstSeen || now,
      lastActive: now,
      
      totalPageViews: (existing?.totalPageViews || 0) + (actionType === 'PAGE_VIEW' ? 1 : 0),
      visitedPages: Array.from(visitedPages).slice(-30), // Giữ tối đa 30 đường dẫn gần nhất
      
      totalAssetViews,
      uniqueAssetsViewedCount: viewedAssets.size,
      viewedAssets: Array.from(viewedAssets),
      
      totalDownloads,
      downloadsByDate, // Object lưu theo ngày, VD: { "2026-11-05": 2 }
      downloadedAssets: Array.from(downloadedAssets),
      
      lastPath: payload.path || existing?.lastPath || '/'
    }

    await set(visitorPath, updatedProfile)

    // Ghi thêm vào bảng Sự kiện chi tiết (Dòng thời gian)
    const eventsRef = dbRef(db, 'analytics/events')
    await push(eventsRef, {
      visitorKey: meta.visitorKey,
      ip: meta.ip,
      country: meta.country,
      city: meta.city,
      flag: meta.flag,
      isp: meta.isp,
      device: meta.device,
      browser: meta.browser,
      actionType, // 'PAGE_VIEW' | 'VIEW_ASSET' | 'DOWNLOAD_ASSET'
      path: payload.path || window.location.pathname,
      assetId: payload.assetId || null,
      assetTitle: payload.assetTitle || null,
      timestamp: now
    })

    // Đảm bảo đồng bộ hồ sơ địa lý từ biến 'meta'
    setCachedVisitorGeoProfile(meta)

    // Đẩy bản ghi vào bảng Nhật ký Hoạt động Tiêu biểu (Tự động giới hạn 10.000 bản ghi)
    await pushActivityNotificationLog(
      actionType === 'PAGE_VIEW' ? 'PAGE_VISIT' : actionType,
      {
        path: payload.path || window.location.pathname,
        assetId: payload.assetId || null,
        assetTitle: payload.assetTitle || '',
        geoProfile: meta
      }
    )

  } catch (error) {
    console.error('[Tracker] Lỗi ghi nhận hành vi:', error)
  }
}

/**
 * 3. CHỨC NĂNG DỌN DẸP DATA QUÁ 30 NGÀY (TTL CLEANUP)
 * Xóa toàn bộ Visitors không hoạt động quá 30 ngày & Events cũ hơn 30 ngày
 */
export const purgeOldAnalyticsData = async (daysToKeep = 30) => {
  const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
  let deletedVisitorsCount = 0
  let deletedEventsCount = 0

  try {
    // 1. Dọn dẹp bảng Visitors (Xóa các IP có lastActive < cutoffTime)
    const visitorsRef = dbRef(db, 'analytics/visitors')
    const vSnap = await get(visitorsRef)
    if (vSnap.exists()) {
      const visitors = vSnap.val()
      const updates = {}
      for (const [key, val] of Object.entries(visitors)) {
        if ((val.lastActive || 0) < cutoffTime) {
          updates[key] = null // Gán null trong update() của Firebase sẽ xóa node đó
          deletedVisitorsCount++
        }
      }
      if (deletedVisitorsCount > 0) {
        await update(visitorsRef, updates)
      }
    }

    // 2. Dọn dẹp bảng Events (Xóa các log sự kiện có timestamp < cutoffTime)
    const eventsRef = dbRef(db, 'analytics/events')
    const eSnap = await get(eventsRef)
    if (eSnap.exists()) {
      const events = eSnap.val()
      const eventUpdates = {}
      for (const [key, val] of Object.entries(events)) {
        if ((val.timestamp || 0) < cutoffTime) {
          eventUpdates[key] = null
          deletedEventsCount++
        }
      }
      if (deletedEventsCount > 0) {
        await update(eventsRef, eventUpdates)
      }
    }

    return {
      success: true,
      deletedVisitorsCount,
      deletedEventsCount
    }
  } catch (error) {
    console.error('[Tracker] Lỗi khi dọn dẹp dữ liệu cũ:', error)
    return { success: false, error: error.message }
  }
}
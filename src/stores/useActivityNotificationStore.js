// src/stores/useActivityNotificationStore.js
import { defineStore } from 'pinia'
import { db } from '../firebase'
import { ref as dbRef, onValue, remove } from 'firebase/database'
import {
  ACTIVITY_LOG_CONFIG,
  updateMaxActivityLogsLimit,
  enforceActivityLogQuota
} from '../services/activityLogService'
import {
  playActivityNotificationSound,
  isNotificationSoundMuted,
  setNotificationSoundMuted
} from '../services/soundService'

const QUEUE_STEP_DELAY_MS = 1400 // Khoảng cách hiển thị lần lượt giữa 2 thông báo trùng thời điểm
const TOAST_VISIBLE_DURATION_MS = 5000 // Thời gian hiển thị mỗi Toast trước khi tự đóng

export const useActivityNotificationStore = defineStore('activityNotificationStore', {
  state: () => ({
    // 1. Danh sách toàn bộ bản ghi hoạt động (mới nhất xếp đầu)
    logs: [],
    maxRecordsLimit: ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS,
    isListening: false,
    sessionStartTime: Date.now(),
    knownLogIds: new Set(),

    // 2. Hệ thống Hàng đợi (Queue) hiển thị Toast tuần tự
    notificationQueue: [],
    activeLiveToasts: [], // Tối đa hiển thị 2 toast cùng lúc trên màn hình, đẩy tuần tự
    isProcessingQueue: false,
    soundMuted: isNotificationSoundMuted(),

    // 3. Trạng thái Điều hướng, Highlight & Xem chi tiết IP
    highlightedLogId: null,
    selectedIpKey: null, // Khi khác null -> Mở trang Chi tiết Hoạt động của tài khoản IP đó
    requestSwitchTabCallback: null // Callback để báo cho Admin Dashboard chuyển sang tab Thông báo
  }),

  getters: {
    totalLogsCount: (state) => state.logs.length,

    quotaUsagePercent: (state) => {
      if (!state.maxRecordsLimit) return 0
      return Math.min(100, Math.round((state.logs.length / state.maxRecordsLimit) * 100))
    },

    // Lấy danh sách hoạt động của riêng 1 địa chỉ IP (Dùng cho trang Chi tiết IP)
    getLogsByIp: (state) => {
      return (ipOrVisitorKey) => {
        if (!ipOrVisitorKey) return []
        return state.logs.filter(
          item => item.ip === ipOrVisitorKey || item.visitorKey === ipOrVisitorKey
        )
      }
    },

    // Tổng hợp hồ sơ tóm tắt của 1 IP từ danh sách hoạt động
    getIpSummaryProfile: (state) => {
      return (ipOrVisitorKey) => {
        const list = state.logs.filter(
          item => item.ip === ipOrVisitorKey || item.visitorKey === ipOrVisitorKey
        )
        if (list.length === 0) return null

        const latest = list[0]
        const first = list[list.length - 1]

        return {
          ip: latest.ip,
          visitorKey: latest.visitorKey,
          location: latest.location,
          city: latest.city,
          country: latest.country,
          flag: latest.flag,
          isp: latest.isp,
          device: latest.device,
          browser: latest.browser,
          lastActive: latest.timestamp,
          firstSeen: first.timestamp,
          totalEvents: list.length,
          pageVisitsCount: list.filter(i => i.actionType === 'PAGE_VISIT').length,
          assetViewsCount: list.filter(i => i.actionType === 'VIEW_ASSET').length,
          likesCount: list.filter(i => i.actionType === 'LIKE_ASSET').length,
          downloadsCount: list.filter(i => i.actionType === 'DOWNLOAD_ASSET').length
        }
      }
    }
  },

  actions: {
    /**
     * Đăng ký hàm chuyển tab của trang Admin Cha (để khi click vào Toast sẽ tự mở tab Thông báo)
     */
    registerTabSwitcher(callbackFn) {
      this.requestSwitchTabCallback = callbackFn
    },

    /**
     * Khởi tạo lắng nghe thời gian thực nhánh 'analytics/activity_logs'
     */
    initRealtimeActivityStream() {
      if (this.isListening) return
      this.isListening = true
      this.sessionStartTime = Date.now()

      // 1. Lắng nghe cấu hình giới hạn tối đa (Mặc định 10.000)
      onValue(dbRef(db, ACTIVITY_LOG_CONFIG.CONFIG_PATH), (snap) => {
        if (snap.exists()) {
          this.maxRecordsLimit = Number(snap.val()) || ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS
        }
      })

      // 2. Lắng nghe bảng dữ liệu hoạt động
      const logsRef = dbRef(db, ACTIVITY_LOG_CONFIG.FIREBASE_PATH)
      let isFirstInitialLoad = true

      onValue(logsRef, (snapshot) => {
        const data = snapshot.val()
        if (!data) {
          this.logs = []
          this.knownLogIds.clear()
          isFirstInitialLoad = false
          return
        }

        const list = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

        if (isFirstInitialLoad) {
          // Lần tải đầu tiên: Ghi nhận các ID đã có để không bắn Toast hàng loạt
          list.forEach(item => this.knownLogIds.add(item.id))
          isFirstInitialLoad = false
        } else {
          // Các lần cập nhật Real-time tiếp theo: Tìm các bản ghi mới vừa xuất hiện
          const newIncomingLogs = list
            .filter(item => !this.knownLogIds.has(item.id) && (item.timestamp || 0) >= this.sessionStartTime - 5000)
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)) // Xếp theo thứ tự thời gian để đưa vào Queue

          newIncomingLogs.forEach((newItem) => {
            this.knownLogIds.add(newItem.id)
            this.enqueueLiveNotification(newItem)
          })
        }

        this.logs = list
      })
    },

    // =========================================================
    // CƠ CHẾ HÀNG ĐỢI (SEQUENTIAL QUEUE) KHI TRÙNG THỜI GIAN
    // =========================================================
    enqueueLiveNotification(logItem) {
      this.notificationQueue.push(logItem)
      if (!this.isProcessingQueue) {
        this.processNextInQueue()
      }
    },

    processNextInQueue() {
      if (this.notificationQueue.length === 0) {
        this.isProcessingQueue = false
        return
      }

      this.isProcessingQueue = true
      const nextItem = this.notificationQueue.shift()

      // Đưa vào danh sách Toast đang hiển thị (Giữ tối đa 2 Toast trên màn hình để gọn gàng)
      if (this.activeLiveToasts.length >= 2) {
        this.activeLiveToasts.shift()
      }
      this.activeLiveToasts.push(nextItem)

      // Phát âm thanh thông báo nhẹ nhàng tương ứng với loại hành động
      playActivityNotificationSound(nextItem.actionType)

      // Tự động ẩn Toast này sau 5 giây
      setTimeout(() => {
        this.dismissLiveToast(nextItem.id)
      }, TOAST_VISIBLE_DURATION_MS)

      // Đợi 1.4 giây rồi mới hiển thị tiếp thông báo tiếp theo trong hàng đợi
      setTimeout(() => {
        this.processNextInQueue()
      }, QUEUE_STEP_DELAY_MS)
    },

    dismissLiveToast(logId) {
      const idx = this.activeLiveToasts.findIndex(t => t.id === logId)
      if (idx !== -1) {
        this.activeLiveToasts.splice(idx, 1)
      }
    },

    toggleSoundMute() {
      this.soundMuted = !this.soundMuted
      setNotificationSoundMuted(this.soundMuted)
      if (!this.soundMuted) {
        playActivityNotificationSound('LIKE_ASSET') // Phát thử âm thanh khi bật lại
      }
    },

    // =========================================================
    // CLICK VÀO TOAST -> MỞ TRANG DANH SÁCH & HIGHLIGHT ITEM
    // =========================================================
    handleToastClick(logItem) {
      if (!logItem?.id) return

      // 1. Đóng trang chi tiết IP (nếu đang mở) để hiện danh sách tổng
      this.selectedIpKey = null

      // 2. Gán ID cần Highlight
      this.highlightedLogId = logItem.id

      // 3. Gọi callback để Admin chuyển sang tab 'activity_notifications'
      if (typeof this.requestSwitchTabCallback === 'function') {
        this.requestSwitchTabCallback('activity_notifications')
      }

      // 4. Đóng cái Toast vừa được click
      this.dismissLiveToast(logItem.id)
    },

    clearHighlight() {
      this.highlightedLogId = null
    },

    openIpDetailPage(ipOrVisitorKey) {
      this.selectedIpKey = ipOrVisitorKey
    },

    closeIpDetailPage() {
      this.selectedIpKey = null
    },

    // =========================================================
    // QUẢN TRỊ GIỚI HẠN BẢN GHI (10.000 LOGS) & XÓA DỮ LIỆU
    // =========================================================
    async setMaxRecordsConfig(newLimit) {
      this.maxRecordsLimit = Math.max(100, Number(newLimit) || ACTIVITY_LOG_CONFIG.DEFAULT_MAX_RECORDS)
      return await updateMaxActivityLogsLimit(this.maxRecordsLimit)
    },

    async triggerManualQuotaCleanup() {
      return await enforceActivityLogQuota(this.maxRecordsLimit)
    },

    async clearAllActivityLogs() {
      await remove(dbRef(db, ACTIVITY_LOG_CONFIG.FIREBASE_PATH))
    }
  }
})
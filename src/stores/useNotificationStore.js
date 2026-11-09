// src/stores/useNotificationStore.js
import { defineStore } from 'pinia'

let toastIdCounter = 0

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    // 1. Danh sách các thông báo (Toast) đang hiển thị ở góc màn hình
    toasts: [],

    // 2. Trạng thái của Hộp thoại Xác nhận (ConfirmDialog)
    confirmState: {
      show: false,
      title: 'Xác nhận thao tác',
      message: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
      highlightText: '',
      confirmText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      variant: 'danger', // 'danger' (Đỏ) | 'warning' (Vàng cam) | 'info' (Xanh)
      icon: '',
      resolvePromise: null
    }
  }),

  actions: {
    // ====================================================
    // NHÓM 1: HIỂN THỊ THÔNG BÁO (TOAST NOTIFICATIONS)
    // ====================================================
    addToast({ type = 'success', title = '', message = '', duration = 4000 }) {
      const id = ++toastIdCounter
      this.toasts.push({ id, type, title, message })

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, duration)
      }
      return id
    },

    removeToast(id) {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx !== -1) {
        this.toasts.splice(idx, 1)
      }
    },

    // 4 Hàm gọi nhanh theo ngữ cảnh
    success(title, message = '', duration = 3500) {
      return this.addToast({ type: 'success', title, message, duration })
    },

    error(title, message = '', duration = 5000) {
      return this.addToast({ type: 'error', title, message, duration })
    },

    warning(title, message = '', duration = 4000) {
      return this.addToast({ type: 'warning', title, message, duration })
    },

    info(title, message = '', duration = 3500) {
      return this.addToast({ type: 'info', title, message, duration })
    },

    // ====================================================
    // NHÓM 2: HỘP THOẠI XÁC NHẬN DẠNG PROMISE (ASYNC/AWAIT)
    // ====================================================
    /**
     * Mở hộp thoại xác nhận và chờ người dùng bấm nút.
     * @returns {Promise<Boolean>} Trả về true nếu bấm Xác nhận, false nếu bấm Hủy
     */
    confirm(options = {}) {
      return new Promise((resolve) => {
        this.confirmState = {
          show: true,
          title: options.title || 'Xác nhận thao tác quan trọng',
          message: options.message || 'Hành động này sẽ thay đổi dữ liệu trên hệ thống. Bạn có muốn tiếp tục?',
          highlightText: options.highlightText || '',
          confirmText: options.confirmText || 'Đồng ý thực hiện',
          cancelText: options.cancelText || 'Hủy bỏ',
          variant: options.variant || 'danger', // 'danger' | 'warning' | 'info'
          icon: options.icon || '',
          resolvePromise: resolve
        }
      })
    },

    handleConfirmChoice(isConfirmed) {
      if (typeof this.confirmState.resolvePromise === 'function') {
        this.confirmState.resolvePromise(isConfirmed)
      }
      this.confirmState.show = false
      this.confirmState.resolvePromise = null
    }
  }
})
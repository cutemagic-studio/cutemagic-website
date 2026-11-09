// // src/stores/visitor.js
// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export const useVisitorStore = defineStore('visitor', () => {
//   // State: Dữ liệu gốc
//   const metadata = ref(JSON.parse(localStorage.getItem('visitor_metadata')) || null)
//   const user = ref(null)

//   // Hàm cập nhật Metadata (sau khi gọi API)
//   const setMetadata = (data) => {
//     metadata.value = data
//     localStorage.setItem('visitor_metadata', JSON.stringify(data))
//   }

//   // Hàm cập nhật User (sau khi Auth)
//   const setUser = (userData) => {
//     user.value = userData
//   }

//   return { metadata, user, setMetadata, setUser }
// })

// src/stores/visitor.js
import { defineStore } from 'pinia'

const METADATA_STORAGE_KEY = 'cmg_visitor_meta_v2'

const loadCachedMeta = () => {
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export const useVisitorStore = defineStore('visitor', {
  state: () => ({
    user: null, // Thông tin Firebase Auth (nếu có đăng nhập)
    metadata: loadCachedMeta() // Thông tin IP, Quốc gia, ISP, Thiết bị
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.user && state.user.uid),
    visitorIp: (state) => state.metadata?.ip || 'Unknown',
    visitorCountry: (state) => state.metadata?.country || 'Unknown'
  },

  actions: {
    setUser(userData) {
      if (!userData) {
        this.user = null
        return
      }
      this.user = {
        uid: userData.uid,
        email: userData.email || 'N/A',
        displayName: userData.displayName || 'Guest',
        photoURL: userData.photoURL || ''
      }
    },

    setMetadata(metaData) {
      this.metadata = metaData
      try {
        localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metaData))
      } catch (e) {
        console.warn('[VisitorStore] Không thể lưu cache metadata:', e)
      }
    }
  }
})
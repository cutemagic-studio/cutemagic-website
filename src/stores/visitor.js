// src/stores/visitor.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVisitorStore = defineStore('visitor', () => {
  // State: Dữ liệu gốc
  const metadata = ref(JSON.parse(localStorage.getItem('visitor_metadata')) || null)
  const user = ref(null)

  // Hàm cập nhật Metadata (sau khi gọi API)
  const setMetadata = (data) => {
    metadata.value = data
    localStorage.setItem('visitor_metadata', JSON.stringify(data))
  }

  // Hàm cập nhật User (sau khi Auth)
  const setUser = (userData) => {
    user.value = userData
  }

  return { metadata, user, setMetadata, setUser }
})
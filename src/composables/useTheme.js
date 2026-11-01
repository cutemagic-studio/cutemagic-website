import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  onMounted(() => {
    // Kiểm tra xem khách hàng đã từng chọn theme nào chưa
    const savedTheme = localStorage.getItem('theme')
    // Kiểm tra hệ điều hành của khách hàng (Windows/Mac) có đang dùng Dark Mode không
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  })

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, toggleTheme }
}
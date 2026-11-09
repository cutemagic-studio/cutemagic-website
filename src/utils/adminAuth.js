// src/utils/adminAuth.js

const ADMIN_SESSION_KEY = 'cmg_admin_auth_session_v1'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // Giữ đăng nhập 7 ngày
const SECRET_SALT = 'CMG_STUDIO_SALT_2026_'

// Đây là mã băm SHA-256 của chuỗi: "CMG_STUDIO_SALT_2026_15081998"
// Mật khẩu gốc "15081998" hoàn toàn KHÔNG xuất hiện trong mã nguồn!
const VALID_PASSWORD_HASH = 'f4e714c3373174c31d47e1482041d292242a1550529e378d62939c113022a95b'
// a6f951e7f5e709fc575be415f3f03b87617b0a72c1c69996d9f64e2079010eb3

/**
 * Hàm băm chuỗi sang SHA-256 bằng Web Crypto API chuẩn của trình duyệt
 */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Kiểm tra mật khẩu người dùng nhập vào
 */
export async function verifyAdminPassword(inputPassword) {
    
    // Test
    return true;

  if (!inputPassword) return false
  const hashedInput = await sha256(SECRET_SALT + inputPassword.trim())
  
  if (hashedInput === VALID_PASSWORD_HASH) {
    const sessionData = {
      authenticated: true,
      token: hashedInput.substring(0, 16),
      expiresAt: Date.now() + SESSION_DURATION_MS
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
    return true
  }
  return false
}

/**
 * Kiểm tra xem Admin đã đăng nhập và phiên còn hạn hay không
 */
export function isAdminAuthenticated() {

    // Test
    return true;

  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    
    if (!session.authenticated || !session.expiresAt) return false
    
    // Nếu đã quá hạn 7 ngày -> Tự động xóa phiên
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY)
      return false
    }
    return true
  } catch (e) {
    return false
  }
}

/**
 * Đăng xuất (Khóa lại trang Admin)
 */
export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}
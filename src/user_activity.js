import { db } from './firebase'
import { ref as dbRef, push, serverTimestamp } from 'firebase/database'

export const saveActivity = async (user, action, details = {}) => {
  const logRef = dbRef(db, 'user_activity_logs')
  
  const logData = {
    // Thông tin người dùng (linh hoạt giữa Guest và User)
    uid: user?.uid || 'guest',
    displayName: user?.displayName || 'Khách ẩn danh',
    email: user?.email || 'N/A',
    photoURL: user?.photoURL || '',
    
    // Thông tin hành động
    action: action, 
    details: details,
    path: window.location.pathname, // Họ đang ở trang nào
    
    // Thời gian
    timestamp: serverTimestamp()
  }

  try {
    await push(logRef, logData)
  } catch (error) {
    console.error("Không thể lưu log:", error)
  }
}
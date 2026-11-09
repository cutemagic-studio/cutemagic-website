// src/services/soundService.js

const SOUND_MUTE_KEY = 'cmg_admin_notification_muted'
let audioCtx = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export const isNotificationSoundMuted = () => {
  try {
    return localStorage.getItem(SOUND_MUTE_KEY) === 'true'
  } catch {
    return false
  }
}

export const setNotificationSoundMuted = (muted) => {
  try {
    localStorage.setItem(SOUND_MUTE_KEY, muted ? 'true' : 'false')
  } catch {}
}

/**
 * Phát âm thanh thông báo nhẹ nhàng theo loại hành động:
 * - 'LIKE_ASSET' / 'DOWNLOAD_ASSET': Âm thanh 2 nốt cao trong trẻo (Chime)
 * - 'PAGE_VISIT' / 'VIEW_ASSET': Âm thanh 1 nốt trầm nhẹ (Soft Pop)
 */
export const playActivityNotificationSound = (actionType = 'PAGE_VISIT') => {
  if (isNotificationSoundMuted()) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (actionType === 'DOWNLOAD_ASSET' || actionType === 'LIKE_ASSET') {
      // Âm sắc 2 nốt vui tươi cho sự kiện quan trọng (Like / Download)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // Nốt D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12) // Nốt A5

      gainNode.gain.setValueAtTime(0.001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.start(now)
      osc.stop(now + 0.36)
    } else {
      // Âm sắc nhẹ nhàng cho sự kiện Truy cập trang / Xem Pack
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now) // Nốt A4
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.08) // Nốt C5

      gainNode.gain.setValueAtTime(0.001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.start(now)
      osc.stop(now + 0.22)
    }
  } catch (e) {
    // Trình duyệt chặn autoplay khi người dùng chưa click vào trang
  }
}
<script setup>
import { onMounted } from 'vue'
import { useVisitorStore } from '../../../../stores/visitor' // Kiểm tra lại đường dẫn cho đúng nhé
import { db, auth } from '../../../../firebase'
import { ref as dbRef, push, serverTimestamp } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'

// Khởi tạo store
const visitorStore = useVisitorStore()

onMounted(async () => {
    // 1. Theo dõi trạng thái đăng nhập và cập nhật Pinia liên tục
    onAuthStateChanged(auth, (user) => {
        visitorStore.setUser(user)
    })

    // 2. Kiểm tra Metadata trong Store (đã tự lấy từ LocalStorage khi khởi tạo store)
    if (!visitorStore.metadata) {
        const BASE_URL = 'https://ip-intelligence.abstractapi.com/v1/'
        const API_KEY = '03d032102980424980c8dfcd3030c09f'

        try {
            const response = await fetch(`${BASE_URL}?api_key=${API_KEY}`)
            const data = await response.json()

            if (data && data.ip_address) {
                const newMetadata = {
                    ip: data.ip_address,
                    city: data.location?.city ?? 'Unknown',
                    country: data.location?.country ?? 'Unknown',
                    continent: data.location?.continent ?? 'Unknown',
                    flag: data.flag?.png ?? '',
                    isp: data.asn?.name ?? 'N/A',
                }
                // Cập nhật vào Pinia (hàm này đã có logic lưu vào LocalStorage bên trong store)
                visitorStore.setMetadata(newMetadata)
            }
        } catch (error) {
            console.error("AbstractAPI Error:", error)
        }
    }

    // 3. Ghi log truy cập (Access Log)
    // Đợi một chút để đảm bảo metadata đã sẵn sàng
    if (visitorStore.metadata) {
        const ua = navigator.userAgent
        const browser = ua.includes("Chrome") ? "Chrome" : 
                        (ua.includes("Safari") && !ua.includes("Chrome") ? "Safari" : 
                        (ua.includes("Firefox") ? "Firefox" : "Other"))
        
        const device = /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop"

        // Ghi lên Firebase
        await push(dbRef(db, 'access_logs'), {
            ...visitorStore.metadata,
            browser,
            device,
            uid: visitorStore.user?.uid || 'guest',
            email: visitorStore.user?.email || 'N/A',
            displayName: visitorStore.user?.displayName || 'Guest',
            timestamp: serverTimestamp(),
        })
    }

    console.log(visitorStore.user);
})
</script>

<template>
    <div style="display: none;"></div>
</template>
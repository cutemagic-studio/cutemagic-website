<script setup>
import { onMounted } from 'vue'
import { db } from '../../firebase'
import { ref as dbRef, update, increment } from 'firebase/database'

onMounted(() => {
  // 1. Trỏ tới nhánh stats
  const statsRef = dbRef(db, 'site_stats')

  // 2. Tăng tổng lượt view (Mỗi lần F5 là +1)
  update(statsRef, {
    total_views: increment(1)
  }).catch(err => console.error("Lỗi đếm View:", err))

  // 3. Logic đếm người dùng duy nhất (Unique Visitor)
  // Kiểm tra xem trình duyệt này đã từng vào web chưa
  const hasVisited = localStorage.getItem('has_visited_before')

  if (!hasVisited) {
    // Nếu chưa từng vào, tăng số người truy cập duy nhất
    update(statsRef, {
      unique_visitors: increment(1)
    }).then(() => {
      // Đánh dấu đã vào để lần sau F5 không tăng số này nữa
      localStorage.setItem('has_visited_before', 'true')
    })
  }
})
</script>

<template>
  <div v-if="false"></div>
</template>
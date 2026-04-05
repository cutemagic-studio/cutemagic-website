import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // Lấy thông tin này từ Firebase Console của bạn
  apiKey: "AIzaSyBAhqniilUEjXNfzCfr_byalFu8N9gbEbM",
  authDomain: "myassetstorecutemagic.firebaseapp.com",
  databaseURL: "https://myassetstorecutemagic-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myassetstorecutemagic",
  storageBucket: "myassetstorecutemagic.firebasestorage.app",
  messagingSenderId: "506206123293",
  appId: "1:506206123293:web:019f172e7d694475d59df4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
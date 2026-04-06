// src/composables/useAuth.js
import { ref } from 'vue'
import { auth } from './firebase'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)

onAuthStateChanged(auth, (newUser) => {
  user.value = newUser
})

export function useAuth() {
  const login = () => signInWithPopup(auth, new GoogleAuthProvider())
  const logout = () => signOut(auth)
  
  return { user, login, logout }
}
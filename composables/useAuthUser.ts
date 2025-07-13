// composables/useAuthUser.ts
import { ref } from 'vue'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'

const currentUser = ref<User | null>(null)
const authInitialized = ref(false)

export function useAuth() {
  if (process.client && !authInitialized.value) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      authInitialized.value = true
    })
  }

  return {
    currentUser,
    authInitialized
  }
}

// middleware/auth.ts
import { useAuth } from '~/composables/useAuthUser'

export default defineNuxtRouteMiddleware(async () => {
  const { currentUser, authInitialized } = useAuth()

  while (!authInitialized.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (!currentUser.value) {
    return navigateTo('/login')
  }
})

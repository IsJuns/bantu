// middleware/guest.ts
import { useAuth } from '~/composables/useAuthUser'

export default defineNuxtRouteMiddleware(async () => {
  const { currentUser, authInitialized } = useAuth()

  while (!authInitialized.value) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  if (currentUser.value) {
    return navigateTo('/dashboard')
  }
})

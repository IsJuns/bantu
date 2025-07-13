<script setup lang="ts">
import { useAuth } from '~/composables/useAuthUser'
import { useRouter } from 'vue-router'

const router = useRouter()
const { currentUser, authInitialized } = useAuth()

watchEffect(() => {
  if (!authInitialized.value) return

  if (currentUser.value) {
    router.replace('/dashboard')
  } else {
    router.replace('/login')
  }
})
</script>
<template>
  <!-- Redirect halaman tidak menampilkan apa-apa -->
</template>

<template>
  <div class="bg-muted flex min-h-screen items-center justify-center p-6">
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'

definePageMeta({
  layout: 'false'
})
</script>
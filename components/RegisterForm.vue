<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  error.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    success.value = 'Registrasi berhasil. Silakan login.'
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8 w-full">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Buat Akun</h1>
              <p class="text-muted-foreground text-balance">
                Silakan daftar untuk mulai menggunakan aplikasi
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-3">
              <Label for="password">Password</Label>
              <Input id="password" type="password" v-model="password" required />
            </div>
            <Button class="w-full" @click.prevent="handleRegister">Register</Button>

            <div v-if="error" class="text-sm text-red-500 text-center">{{ error }}</div>
            <div v-if="success" class="text-sm text-green-500 text-center">{{ success }}</div>

            <div class="text-center text-sm">
              Sudah punya akun?
              <button @click="router.push('/login')" class="underline underline-offset-4 text-blue-500">
                Login
              </button>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="/assets/image/gamarlogin.jfif"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
    <div class="text-muted-foreground text-center text-xs">
      Dengan mendaftar, kamu menyetujui <a href="#" class="underline">Terms</a> dan <a href="#" class="underline">Privacy Policy</a>.
    </div>
  </div>
</template>

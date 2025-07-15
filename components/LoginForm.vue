<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase' // Pastikan ini mengarah ke inisialisasi Firebase yang benar

const router = useRouter()
const emit = defineEmits(['toggle']) // Jika ini digunakan untuk toggle antara login/register di parent
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false) // Tambahkan state loading

async function handleLogin() {
  error.value = ''
  isLoading.value = true // Set loading true saat mulai login
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/') // ✅ Arahkan ke dashboard jika sukses
  } catch (err: any) {
    console.error("Login Error:", err); // Log error lengkap untuk debugging
    // Tampilkan pesan error yang lebih user-friendly
    if (err.code === 'auth/invalid-email') {
      error.value = 'Email tidak valid.'
    } else if (err.code === 'auth/user-disabled') {
      error.value = 'Akun ini telah dinonaktifkan.'
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      error.value = 'Email atau password salah.'
    } else if (err.code === 'auth/network-request-failed') {
      error.value = 'Kesalahan jaringan. Periksa koneksi internet Anda.'
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Terlalu banyak percobaan login gagal. Coba lagi nanti.'
    } else if (err.code === 'auth/api-key-not-valid') {
      error.value = 'Kesalahan konfigurasi aplikasi. Silakan hubungi administrator.'
    }
    else {
      error.value = 'Terjadi kesalahan saat login. Silakan coba lagi.'
    }
  } finally {
    isLoading.value = false // Set loading false setelah selesai (berhasil/gagal)
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8" @submit.prevent="handleLogin">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                Selamat Datang
              </h1>
              <p class="text-muted-foreground text-balance">
                Login ke akun Input Data Warga Anda
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Lupa password?
                </a>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Memuat...' : 'Login' }}
            </Button>
            <!-- Tampilkan pesan error -->
            <div v-if="error" class="text-sm text-red-500 text-center">{{ error }}</div>

            <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                Atau lanjutkan dengan
              </span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <!-- Menggunakan placeholder.svg untuk ikon -->
              <Button variant="outline" type="button" class="w-full">
                <img src="/assets/icon/apple.svg" alt="Login with Apple" class="h-4 w-4" />
                <span class="sr-only">Login with Apple</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <img src="/assets/icon/google.svg" alt="Login with Google" class="h-4 w-4" />
                <span class="sr-only">Login with Google</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <img src="/assets/icon/meta.svg" alt="Login with Meta" class="h-4 w-4" />
                <span class="sr-only">Login with Meta</span>
              </Button>
            </div>
            <div class="text-center text-sm">
              Belum punya akun?
              <button @click="router.push('/register')" class="underline underline-offset-4 text-blue-500">
                Daftar
              </button>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <!-- Menggunakan placeholder.svg untuk gambar -->
          <img
            src="/assets/image/gamarlogin.jfif"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          >
        </div>
      </CardContent>
    </Card>
    <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      Dengan mengklik lanjutkan, Anda menyetujui <a href="#">Ketentuan Layanan</a>
      dan <a href="#">Kebijakan Privasi</a> kami.
    </div>
  </div>
</template>

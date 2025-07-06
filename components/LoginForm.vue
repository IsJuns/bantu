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
import { auth } from '@/lib/firebase'

const router = useRouter()
const emit = defineEmits(['toggle'])
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/') // ✅ Arahkan ke dashboard jika sukses
  } catch (err: any) {
    error.value = err.message // ❌ Tampilkan error kalau gagal
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form form class="p-6 md:p-8" @submit.prevent="handleLogin">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                Selamat Datang
              </h1>
              <p class="text-muted-foreground text-balance">
                Login to your Input Data Warga account
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
                  Forgot your password?
                </a>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <Button type="submit" class="w-full">
              Login
            </Button>
            <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <Button variant="outline" type="button" class="w-full">
                <img 
                  src="assets/icon/apple.svg" 
                  alt="Image" 
                  class="h-4 w-4" />
                <span class="sr-only">Login with Apple</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <img 
                  src="assets/icon/google.svg" 
                  alt="Image" 
                  class="h-4 w-4" />
                <span class="sr-only">Login with Google</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <img 
                  src="assets/icon/meta.svg" 
                  alt="Image" 
                  class="h-4 w-4" />
                <span class="sr-only">Login with Meta</span>
              </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <button @click="router.push('/register')" class="underline underline-offset-4 text-blue-500">
              Sign up
              </button>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="/assets/image/gamarlogin.jfif"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          >
        </div>
      </CardContent>
    </Card>
    <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our <a href="#">Terms of Service</a>
      and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>

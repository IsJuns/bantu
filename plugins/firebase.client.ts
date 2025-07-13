// plugins/firebase.client.ts
import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "API_KEY_KAMU",
    authDomain: "AUTH_DOMAIN_KAMU",
    projectId: "PROJECT_ID_KAMU",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MSG_SENDER_ID",
    appId: "APP_ID"
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
  const auth = getAuth(app)

  // Inject ke Nuxt
  return {
    provide: {
      firebase: {
        app,
        auth
      }
    }
  }
})

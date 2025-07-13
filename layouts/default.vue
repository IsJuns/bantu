<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const hideLayoutOn = ['/login', '/register']

// 🧠 Gunakan computed agar tetap reaktif
const isHidden = computed(() => hideLayoutOn.includes(route.path))
</script>

<template>
  <!-- Jika halaman termasuk dalam hideLayoutOn (login, register), tampilkan tanpa layout -->
  <div v-if="isHidden">
    <slot />
  </div>

  <!-- Selain itu, tampilkan layout lengkap -->
  <SidebarProvider v-else>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b">
        <div class="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">Building</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>

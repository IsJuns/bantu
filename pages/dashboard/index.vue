<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '~/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useRouter } from 'vue-router'
import PieChart from '@/components/PieChart.vue'

const router = useRouter()

const totalWarga = ref(0)
const layak = ref(0)
const pertimbangan = ref(0)
const tidakLayak = ref(0)
const topWarga = ref<any[]>([])

const fetchDashboardData = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'data_warga'))

    type Warga = {
      id: string
      nama: string
      nik: string
      penghasilan: number
      jumlah_tanggungan: number
      kondisi_tempat_tinggal: string
      status_pekerjaan: string
      skorKelayakan?: number
    }

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Warga[]

    totalWarga.value = data.length
    layak.value = data.filter(w => (w.skorKelayakan ?? 0) >= 0.7).length
    pertimbangan.value = data.filter(w => (w.skorKelayakan ?? 0) >= 0.4 && (w.skorKelayakan ?? 0) < 0.7).length
    tidakLayak.value = data.filter(w => (w.skorKelayakan ?? 0) < 0.4).length

    topWarga.value = [...data]
      .filter(w => typeof w.skorKelayakan === 'number')
      .sort((a, b) => (b.skorKelayakan ?? 0) - (a.skorKelayakan ?? 0))
      .slice(0, 5)
  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err)
    // Optional: tampilkan pesan error ke user
  }
}

onMounted(fetchDashboardData)
</script>

<template>
  <Card class="p-6">
    <CardHeader>
      <CardTitle class="text-xl">Dashboard</CardTitle>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Ringkasan Stat -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card class="text-center p-4">
          <p class="text-sm text-muted-foreground">Total Warga</p>
          <h3 class="text-2xl font-bold">{{ totalWarga }}</h3>
        </Card>
        <Card class="text-center p-4">
          <p class="text-sm text-muted-foreground">Layak</p>
          <h3 class="text-2xl font-bold text-green-500">{{ layak }}</h3>
        </Card>
        <Card class="text-center p-4">
          <p class="text-sm text-muted-foreground">Pertimbangan</p>
          <h3 class="text-2xl font-bold text-yellow-500">{{ pertimbangan }}</h3>
        </Card>
        <Card class="text-center p-4">
          <p class="text-sm text-muted-foreground">Tidak Layak</p>
          <h3 class="text-2xl font-bold text-red-500">{{ tidakLayak }}</h3>
        </Card>
      </div>

      <!-- Grid Bawah: Chart & Top 5 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="p-4">
          <CardTitle class="mb-4">Distribusi Kelayakan</CardTitle>
          <PieChart
            v-if="totalWarga > 0"
            :labels="['Layak', 'Pertimbangan', 'Tidak Layak']"
            :data="[layak, pertimbangan, tidakLayak]"
          />
        </Card>

        <Card class="p-4">
          <CardTitle class="mb-4">Top 5 Skor Kelayakan</CardTitle>
          <div class="overflow-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="text-left py-2">Nama</th>
                  <th class="text-left py-2">NIK</th>
                  <th class="text-left py-2">Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="w in topWarga" :key="w.id">
                  <td class="py-1">{{ w.nama }}</td>
                  <td class="py-1">{{ w.nik }}</td>
                  <td class="py-1 font-medium">{{ w.skorKelayakan?.toFixed(3) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </CardContent>
  </Card>
</template>


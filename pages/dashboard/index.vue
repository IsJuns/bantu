<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { db } from '~/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useRouter } from 'vue-router'
import PieChart from '@/components/PieChart.vue'
import LineChart from '@/components/LineChart.vue'

const router = useRouter()

const chartMode = ref<'RT' | 'RW'>('RT')
const averageLabels = ref<string[]>([])
const averageData = ref<number[]>([])

const totalWarga = ref(0)
const layak = ref(0)
const pertimbangan = ref(0)
const tidakLayak = ref(0)
const allWarga = ref<any[]>([]) // ✅ Simpan semua data di sini

// Fetch data hanya sekali
const fetchDashboardData = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'data_warga'))

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as {
      id: string
      nama: string
      nik: string
      penghasilan: number
      jumlah_tanggungan: number
      kondisi_tempat_tinggal: string
      status_pekerjaan: string
      skorKelayakan?: number
      rt?: number
      rw?: number
    }[]

    allWarga.value = data

    totalWarga.value = data.length
    layak.value = data.filter(w => (w.skorKelayakan ?? 0) >= 0.7).length
    pertimbangan.value = data.filter(w => (w.skorKelayakan ?? 0) >= 0.4 && (w.skorKelayakan ?? 0) < 0.7).length
    tidakLayak.value = data.filter(w => (w.skorKelayakan ?? 0) < 0.4).length

    hitungRataRataChart(chartMode.value)
  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err)
  }
}

// Hitung rata-rata skor berdasarkan RT atau RW
const hitungRataRataChart = (mode: 'RT' | 'RW') => {
  const grup: Record<number, number[]> = {}
  
  for (const w of allWarga.value) {
    if (typeof w.skorKelayakan !== 'number') continue

    const key = parseInt(mode === 'RT' ? w.rt : w.rw)
    if (isNaN(key)) continue


    if (!grup[key]) grup[key] = []
    grup[key].push(w.skorKelayakan)
  }
  console.log('⏳ Grup:', grup)
  
  averageLabels.value = Object.keys(grup).map(k => `${mode} ${k}`)
  averageData.value = Object.values(grup).map(list => {
    const total = list.reduce((a, b) => a + b, 0)
    return parseFloat((total / list.length).toFixed(3))
  })
  console.log('✅ Label Final:', averageLabels.value)
  console.log('✅ Data Final:', averageData.value)


}

// ⏱ Update chart jika mode berubah, tanpa ambil data ulang
watch(chartMode, (mode) => {
  hitungRataRataChart(mode)
})

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
            v-if="[layak, pertimbangan, tidakLayak].every(v => typeof v === 'number')"
            :labels="['Layak', 'Pertimbangan', 'Tidak Layak']"
            :data="[layak, pertimbangan, tidakLayak]"
          />
        </Card>
        <Card class="p-4">
          <CardTitle class="mb-2">Skor Rata-Rata per {{ chartMode }}</CardTitle>
          <div class="flex justify-end mb-4">
            <select v-model="chartMode" class="border px-2 py-1 rounded text-sm">
              <option value="RT">Per RT</option>
              <option value="RW">Per RW</option>
            </select>
          </div>
          <LineChart :labels="averageLabels" :data="averageData" />
        </Card>
      </div>
    </CardContent>
  </Card>
</template>


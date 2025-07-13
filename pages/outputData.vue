<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '~/lib/firebase'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'
import { ref as vueRef, reactive } from 'vue'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

definePageMeta({
  title: 'Output Data Warga'
})

const router = useRouter()
// Modal state
const showEditModal = vueRef(false)
const selectedWarga = reactive<any>({
  id: '',
  nama: '',
  nik: '',
  penghasilan: 0,
  jumlah_tanggungan: 0,
  kondisi_tempat_tinggal: '',
  status_pekerjaan: '',
})

// Buka modal dengan data
const editWarga = (warga: any) => {
  Object.assign(selectedWarga, warga)
  showEditModal.value = true
}
// Simpan hasil edit ke Firestore
const simpanPerubahan = async () => {
  if (!selectedWarga.id) return

  try {
    const wargaRef = doc(db, 'data_warga', selectedWarga.id)
    await updateDoc(wargaRef, {
      nama: selectedWarga.nama,
      nik: selectedWarga.nik,
      penghasilan: selectedWarga.penghasilan,
      jumlah_tanggungan: selectedWarga.jumlah_tanggungan,
      kondisi_tempat_tinggal: selectedWarga.kondisi_tempat_tinggal,
      status_pekerjaan: selectedWarga.status_pekerjaan,
    })

    showEditModal.value = false
    await fetchData() // Refresh data di tabel
    alert('✅ Data berhasil diperbarui!')
  } catch (error) {
    alert('❌ Gagal memperbarui data: ' + error)
  }
}

const dataWarga = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref<'nama' | 'skor'>('skor')

const fetchData = async () => {
  isLoading.value = true
  const querySnapshot = await getDocs(collection(db, 'data_warga'))
  dataWarga.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  isLoading.value = false
}

// Dummy logika SMART (sementara)
const hitungSMART = () => {
  dataWarga.value = dataWarga.value.map(w => ({
    ...w,
    skorKelayakan: parseFloat((Math.random()).toFixed(3)) // akan diganti metode SMART
  }))
}

// computed untuk pencarian + sorting
const filteredWarga = computed(() => {
  const filtered = dataWarga.value.filter(w =>
    w.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  if (sortBy.value === 'skor') {
    return [...filtered].sort((a, b) => (b.skorKelayakan || 0) - (a.skorKelayakan || 0))
  } else {
    return [...filtered].sort((a, b) => a.nama.localeCompare(b.nama))
  }
})

onMounted(fetchData)
</script>

<template>
  <Card class="p-6">
    <CardHeader>
      <CardTitle class="text-xl">Output Data Warga</CardTitle>
    </CardHeader>

    <CardContent>
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4">
          <h2 class="text-lg font-semibold mb-4">Edit Data Warga</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Nama</label>
              <Input v-model="selectedWarga.nama" />
            </div>

            <div>
              <label class="block text-sm font-medium">NIK</label>
              <Input v-model="selectedWarga.nik" />
            </div>

            <div>
              <label class="block text-sm font-medium">Penghasilan</label>
              <Input v-model.number="selectedWarga.penghasilan" type="number" />
            </div>

            <div>
              <label class="block text-sm font-medium">Tanggungan</label>
              <Input v-model.number="selectedWarga.jumlah_tanggungan" type="number" />
            </div>

            <div>
              <label class="block text-sm font-medium">Kondisi Tempat Tinggal</label>
              <Input v-model="selectedWarga.kondisi_tempat_tinggal" />
            </div>

            <div>
              <label class="block text-sm font-medium">Status Pekerjaan</label>
              <Input v-model="selectedWarga.status_pekerjaan" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" @click="showEditModal = false">
              Batal
            </Button>
            <Button variant="default" @click="simpanPerubahan">Simpan</Button>
          </div>
  </div>
</div>
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <div class="flex gap-2 items-center w-full md:w-auto">
          <Input v-model="searchQuery" placeholder="Cari nama..." class="w-full md:w-[250px]" />
        </div>
        <div class="flex gap-2">
          <Button @click="sortBy = 'skor'" :variant="sortBy === 'skor' ? 'default' : 'outline'">Urutkan Skor</Button>
          <Button @click="sortBy = 'nama'" :variant="sortBy === 'nama' ? 'default' : 'outline'">Urutkan Nama</Button>
          <Button @click="hitungSMART" :disabled="isLoading">
            {{ isLoading ? 'Memuat...' : 'Hitung SMART' }}
          </Button>
        </div>
      </div>

      <div class="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-auto">
        <Table>
<TableHeader>
  <TableRow>
    <TableHead>Nama</TableHead>
    <TableHead>NIK</TableHead>
    <TableHead>Penghasilan</TableHead>
    <TableHead>Tanggungan</TableHead>
    <TableHead>Kondisi</TableHead>
    <TableHead>Pekerjaan</TableHead>
    <TableHead>Skor Kelayakan</TableHead>
    <TableHead></TableHead> <!-- Kolom Aksi baru -->
  </TableRow>
</TableHeader>

<TableBody>
  <TableRow v-for="(warga, index) in filteredWarga" :key="index">
    <TableCell>{{ warga.nama }}</TableCell>
    <TableCell>{{ warga.nik }}</TableCell>
    <TableCell>Rp{{ warga.penghasilan.toLocaleString() }}</TableCell>
    <TableCell>{{ warga.jumlah_tanggungan }}</TableCell>
    <TableCell>{{ warga.kondisi_tempat_tinggal }}</TableCell>
    <TableCell>{{ warga.status_pekerjaan }}</TableCell>
    <TableCell>
      <span v-if="warga.skorKelayakan">
        {{ warga.skorKelayakan }}
      </span>
      <span v-else class="text-muted-foreground">-</span>
    </TableCell>
    <TableCell>
      <!-- Tombol Edit -->
      <Button variant="outline" size="sm" @click="editWarga(warga)">
        Edit
      </Button>
    </TableCell>
  </TableRow>
</TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>

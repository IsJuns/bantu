<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Output Data Warga</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
      <!-- Search and Action Buttons -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <div class="flex gap-2 items-center w-full md:w-auto">
          <Input v-model="searchQuery" placeholder="Cari nama..." class="w-full md:w-[250px]" />
        </div>
        <div class="flex flex-wrap gap-2">
          <Button @click="sortBy = 'skor'" :variant="sortBy === 'skor' ? 'default' : 'outline'">Urutkan Skor</Button>
          <Button @click="sortBy = 'nama'" :variant="sortBy === 'nama' ? 'default' : 'outline'">Urutkan Nama</Button>
          <Button @click="hitungSMART" :disabled="isLoading">
            {{ isLoading ? 'Memuat...' : 'Hitung SMART' }}
          </Button>
          <Button variant="outline" @click="exportToExcel">Export ke Excel</Button>
          <Button variant="outline" @click="exportToPDF">Export ke PDF</Button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <Table class="min-w-full divide-y divide-gray-200">
          <TableHeader class="bg-gray-50">
            <TableRow>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghasilan</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggungan</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RW</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor Kelayakan</TableHead>
              <TableHead class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="bg-white divide-y divide-gray-200">
            <TableRow v-for="warga in filteredWarga" :key="warga.id">
              <TableCell class="px-3 py-2 text-sm font-medium text-gray-900">{{ warga.nama }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.nik }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ formatCurrency(warga.penghasilan) }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.jumlah_tanggungan }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.rt }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.rw }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.kondisi_tempat_tinggal }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-gray-500">{{ warga.status_pekerjaan }}</TableCell>
              <TableCell class="px-3 py-2 text-sm text-center">
                <span
                  v-if="warga.skorKelayakan !== undefined"
                  :class="getScoreClass(warga.skorKelayakan)"
                  class="px-2 py-1 rounded-md text-xs font-medium"
                >
                  {{ warga.skorKelayakan.toFixed(3) }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell class="px-3 py-2 text-right text-sm font-medium whitespace-nowrap">
                <Button variant="ghost" size="sm" class="text-blue-600 hover:text-blue-900" @click="editWarga(warga)">Edit</Button>
                <Button variant="ghost" size="sm" class="text-red-600 hover:text-red-900" @click="deleteWarga(warga)">Hapus</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Edit Modal -->
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
            <label class="block text-sm font-medium">RT</label>
            <Input v-model="selectedWarga.rt" />
          </div>
          <div>
            <label class="block text-sm font-medium">RW</label>
            <Input v-model="selectedWarga.rw" />
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '~/lib/firebase'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

// Import dinamis untuk jspdf dan file-saver
let jsPDF: any
let autoTable: any
let saveAs: any

definePageMeta({
  title: 'Output Data Warga'
})

const router = useRouter()

// Modal state
const showEditModal = ref(false)
const selectedWarga = reactive<any>({
  id: '',
  nama: '',
  nik: '',
  penghasilan: 0,
  jumlah_tanggungan: 0,
  kondisi_tempat_tinggal: '',
  status_pekerjaan: '',
  rt: '',
  rw: ''
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
      rt: selectedWarga.rt,
      rw: selectedWarga.rw
    })
    showEditModal.value = false
    await fetchData() // Refresh data di tabel
    alert('✅ Data berhasil diperbarui!')
  } catch (error) {
    alert('❌ Gagal memperbarui data: ' + error)
  }
}

// Fungsi untuk menghapus data warga
const deleteWarga = async (warga: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data ${warga.nama} (NIK: ${warga.nik})?`)) {
    try {
      await deleteDoc(doc(db, 'data_warga', warga.id))
      await fetchData() // Refresh data di tabel setelah penghapusan
      alert('✅ Data berhasil dihapus!')
    } catch (error) {
      alert('❌ Gagal menghapus data: ' + error)
    }
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
const hitungSMART = async () => {
  isLoading.value = true; // Set loading state
  // 1. Normalisasi nilai numerik
  const penghasilanList = dataWarga.value.map(w => w.penghasilan)
  const tanggunganList = dataWarga.value.map(w => w.jumlah_tanggungan)

  // Handle case where lists might be empty to prevent Math.max/min errors
  const maxPenghasilan = penghasilanList.length > 0 ? Math.max(...penghasilanList) : 1
  const minPenghasilan = penghasilanList.length > 0 ? Math.min(...penghasilanList) : 0
  const maxTanggungan = tanggunganList.length > 0 ? Math.max(...tanggunganList) : 1
  const minTanggungan = tanggunganList.length > 0 ? Math.min(...tanggunganList) : 0

  // 2. Hitung skor tiap warga
  for (const w of dataWarga.value) {
    const normPenghasilan = (maxPenghasilan - w.penghasilan) / (maxPenghasilan - minPenghasilan || 1)
    const normTanggungan = (w.jumlah_tanggungan - minTanggungan) / (maxTanggungan - minTanggungan || 1)
    const skorKondisi = getSkorKondisi(w.kondisi_tempat_tinggal)
    const skorPekerjaan = getSkorPekerjaan(w.status_pekerjaan)

    const normKondisi = (3 - skorKondisi) / 2
    const normPekerjaan = (skorPekerjaan - 1) / 2

    const skor = parseFloat((
      normPenghasilan * 0.4 +
      normTanggungan * 0.2 +
      normKondisi * 0.2 +
      normPekerjaan * 0.2
    ).toFixed(3))

    const wargaRef = doc(db, 'data_warga', w.id)
    await updateDoc(wargaRef, { skorKelayakan: skor })
    w.skorKelayakan = skor
  }
  isLoading.value = false;
  alert('✅ Perhitungan SMART berhasil & skor tersimpan!')
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

const getSkorKondisi = (val: string) => {
  switch (val) {
    case 'Menumpang': return 1
    case 'Kontrak': return 2
    case 'Milik Sendiri': return 3
    default: return 3
  }
}

const getSkorPekerjaan = (val: string) => {
  switch (val) {
    case 'Tidak Bekerja': return 1
    case 'Pelajar/Mahasiswa': return 2
    case 'Bekerja': return 3
    default: return 3
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const getScoreClass = (score?: number) => {
  if (score === undefined) return 'bg-gray-100 text-gray-800';
  if (score >= 0.7) return 'bg-green-100 text-green-800';
  if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

// Export ke Excel
const exportToExcel = async () => {
  if (process.client) {
    const fileSaver = await import('file-saver')
    saveAs = fileSaver.saveAs
    const wsData = dataWarga.value.map((w: any) => ({
      Nama: w.nama,
      NIK: w.nik,
      Penghasilan: w.penghasilan,
      Tanggungan: w.jumlah_tanggungan,
      'Kondisi Tempat Tinggal': w.kondisi_tempat_tinggal,
      'Status Pekerjaan': w.status_pekerjaan,
      'Skor Kelayakan': w.skorKelayakan ?? '-',
    }))
    const worksheet = XLSX.utils.json_to_sheet(wsData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'data-warga.xlsx')
  }
}

// Export ke PDF
const exportToPDF = async () => {
  if (process.client) {
    const jspdfModule = await import('jspdf')
    jsPDF = jspdfModule.default
    const autoTableModule = await import('jspdf-autotable')
    autoTable = autoTableModule.default

    const doc = new jsPDF()
    doc.text('Data Warga & Skor Kelayakan', 14, 15)
    autoTable(doc, {
      head: [['Nama', 'NIK', 'Penghasilan', 'Tanggungan', 'Kondisi', 'Pekerjaan', 'Skor']],
      body: dataWarga.value.map((w: any) => [
        w.nama,
        w.nik,
        `Rp${w.penghasilan.toLocaleString()}`,
        w.jumlah_tanggungan,
        w.kondisi_tempat_tinggal,
        w.status_pekerjaan,
        w.skorKelayakan ?? '-'
      ]),
      startY: 20,
    })
    doc.save('data-warga.pdf')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '~/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

// 💡 State form
const nama = ref('')
const nik = ref('')
const penghasilan = ref('')
const jumlahTanggungan = ref('')
const kondisiTempatTinggal = ref('')
const statusPekerjaan = ref('')
const rt = ref('')
const rw = ref('')

// Meta
definePageMeta({
  title: 'Input Data Warga'
})

// ✅ Validasi + Simpan ke Firestore
const submitForm = async () => {
  // 🔍 Validasi input kosong
  if (
    !nama.value ||
    !nik.value ||
    penghasilan.value === '' || isNaN(parseFloat(penghasilan.value)) ||
    jumlahTanggungan.value === '' || isNaN(parseInt(jumlahTanggungan.value)) ||
    !kondisiTempatTinggal.value ||
    !statusPekerjaan.value ||
    !rt.value || !rw.value
    
  ) {
    alert('⚠️ Harap lengkapi semua data!')
    return
  }

  try {
    await addDoc(collection(db, 'data_warga'), {
      nama: nama.value,
      nik: nik.value,
      penghasilan: parseFloat(penghasilan.value),
      jumlah_tanggungan: parseInt(jumlahTanggungan.value),
      kondisi_tempat_tinggal: kondisiTempatTinggal.value,
      status_pekerjaan: statusPekerjaan.value,
      rt: parseInt(rt.value),
      rw: parseInt(rw.value),
      timestamp: new Date()
    })

    alert('✅ Data berhasil disimpan!')

    // 🔄 Reset form
    nama.value = ''
    nik.value = ''
    penghasilan.value = ''
    jumlahTanggungan.value = ''
    kondisiTempatTinggal.value = ''
    statusPekerjaan.value = ''
    rt.value = ''
    rw.value = ''

  } catch (e) {
    alert('❌ Gagal menyimpan: ' + e)
  }
}
</script>

<template>
  <card class="p-6">
    <h2 class="text-xl font-bold mb-4">Form Input Data Warga</h2>

    <!-- 🔷 Nama -->
    <div class="space-y-2">
      <Label>Nama</Label>
      <Input v-model="nama" placeholder="Masukkan nama" />
    </div>

    <!-- 🔷 NIK -->
    <div class="space-y-2">
      <Label>NIK</Label>
      <Input v-model="nik" placeholder="Masukkan NIK" />
    </div>

    <!-- 🔷 Penghasilan -->
    <div class="space-y-2">
      <Label>Penghasilan</Label>
      <Input v-model="penghasilan" type="number" placeholder="Masukkan penghasilan (angka)" />
    </div>

    <!-- 🔷 Tanggungan -->
    <div class="space-y-2">
      <Label>Jumlah Tanggungan</Label>
      <Input v-model="jumlahTanggungan" type="number" placeholder="Masukkan jumlah tanggungan" />
    </div>

    <!-- 🔷 RT -->
    <div class="space-y-2">
      <Label>RT</Label>
      <Input v-model="rt" type="number" placeholder="Masukkan RT : 00" />
    </div>

    <!-- 🔷 RW -->
    <div class="space-y-2">
      <Label>RW</Label>
      <Input v-model="rw" type="number" placeholder="Masukkan RW : 00" />
    </div>

    <!-- 🔷 Kondisi Tempat Tinggal -->
    <div class="space-y-2">
      <Label>Kondisi Tempat Tinggal</Label>
      <Select v-model="kondisiTempatTinggal">
        <SelectTrigger>
          <SelectValue placeholder="Pilih kondisi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Milik Sendiri">Milik Sendiri</SelectItem>
          <SelectItem value="Kontrak">Kontrak</SelectItem>
          <SelectItem value="Menumpang">Menumpang</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 🔷 Status Pekerjaan -->
    <div class="space-y-2">
      <Label>Status Pekerjaan</Label>
      <Select v-model="statusPekerjaan">
        <SelectTrigger>
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Bekerja">Bekerja</SelectItem>
          <SelectItem value="Tidak Bekerja">Tidak Bekerja</SelectItem>
          <SelectItem value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 🔘 Tombol Simpan -->
    <Button class="w-full mt-4" @click="submitForm">Simpan</Button>
  </card>
</template>

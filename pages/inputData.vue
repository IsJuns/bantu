<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '~/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const nama = ref('')
const nik = ref('')
const penghasilan = ref('')
const jumlahTanggungan = ref('')
const kondisiTempatTinggal = ref('')
const statusPekerjaan = ref('')
definePageMeta({
  title: 'Input Data Warga'
})

const submitForm = async () => {
  try {
    await addDoc(collection(db, 'data_warga'), {
      nama: nama.value,
      nik: nik.value,
      penghasilan: parseFloat(penghasilan.value),
      jumlah_tanggungan: parseInt(jumlahTanggungan.value),
      kondisi_tempat_tinggal: kondisiTempatTinggal.value,
      status_pekerjaan: statusPekerjaan.value,
      timestamp: new Date(),
    })
    alert('Data berhasil disimpan!')
    nama.value = ''
    nik.value = ''
    penghasilan.value = ''
    jumlahTanggungan.value = ''
    kondisiTempatTinggal.value = ''
    statusPekerjaan.value = ''
  } catch (e) {
    alert('Gagal menyimpan: ' + e)
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
    <h2 class="text-xl font-bold mb-4">Form Input Data Warga</h2>

    <div class="space-y-2">
      <Label>Nama</Label>
      <Input v-model="nama" placeholder="Masukkan nama" />
    </div>

    <div class="space-y-2">
      <Label>NIK</Label>
      <Input v-model="nik" placeholder="Masukkan NIK" />
    </div>

    <div class="space-y-2">
      <Label>Penghasilan</Label>
      <Input v-model="penghasilan" placeholder="Masukkan penghasilan" />
    </div>

    <div class="space-y-2">
      <Label>Jumlah Tanggungan</Label>
      <Input v-model="jumlahTanggungan" placeholder="Masukkan jumlah tanggungan" />
    </div>

    <div class="space-y-2">
      <Label>Kondisi Tempat Tinggal</Label>
      <Select v-model="kondisiTempatTinggal">
        <SelectTrigger><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Milik Sendiri">Milik Sendiri</SelectItem>
          <SelectItem value="Kontrak">Kontrak</SelectItem>
          <SelectItem value="Menumpang">Menumpang</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="space-y-2">
      <Label>Status Pekerjaan</Label>
      <Select v-model="statusPekerjaan">
        <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Bekerja">Bekerja</SelectItem>
          <SelectItem value="Tidak Bekerja">Tidak Bekerja</SelectItem>
          <SelectItem value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button class="w-full mt-4" @click="submitForm">Simpan</Button>
  </div>
</template>

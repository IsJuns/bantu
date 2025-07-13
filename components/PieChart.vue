<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  labels: string[]
  data: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: 'Distribusi Kelayakan',
    data: props.data,
    backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
    borderWidth: 1
  }]
}))

const options = computed(() => ({
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}))
</script>

<template>
  <Pie :data="chartData" :options="options" />
</template>

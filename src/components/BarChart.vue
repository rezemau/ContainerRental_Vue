<script setup>
import 'chart.js/auto';
import { Bar } from 'vue-chartjs';

defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
    }),
  },
});
</script>

<template>
  <div class="bar-wrapper">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.bar-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
}
</style>

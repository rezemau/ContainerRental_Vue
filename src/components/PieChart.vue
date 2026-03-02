<script setup>
import 'chart.js/auto';
import { Pie } from 'vue-chartjs';

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
  <div class="pie-wrapper">
    <Pie :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.pie-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
}
</style>

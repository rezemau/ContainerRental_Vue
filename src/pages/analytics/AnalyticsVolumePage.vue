<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { analyticsService } from '../../services/analytics';
import BarChart from '../../components/BarChart.vue';

const { t } = useI18n();
const series = ref([]);
const error = ref('');

const chartData = computed(() => ({
  labels: series.value.map((item) => item.mes),
  datasets: [
    {
      label: t('ANALYTICS.RENTALS'),
      data: series.value.map((item) => item.quantidadeLocacoes ?? 0),
      backgroundColor: '#38bdf8',
    },
    {
      label: t('ANALYTICS.REVENUE'),
      data: series.value.map((item) => item.receitaTotal ?? 0),
      backgroundColor: '#818cf8',
    },
  ],
}));

async function load() {
  try {
    const data = await analyticsService.getVolume();
    series.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar volume mensal.';
  }
}

onMounted(load);
</script>

<template>
  <div class="card">
    <h3>{{ t('ANALYTICS.MONTHLY') }}</h3>
    <BarChart v-if="series.length" :chart-data="chartData" />
    <p v-else class="empty">Sem dados.</p>
  </div>

  <div v-if="series.length" class="card">
    <table class="table">
      <thead>
        <tr>
          <th>{{ t('ANALYTICS.MONTH') }}</th>
          <th>{{ t('ANALYTICS.RENTALS') }}</th>
          <th>{{ t('ANALYTICS.REVENUE') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in series" :key="item.mes">
          <td>{{ item.mes }}</td>
          <td>{{ item.quantidadeLocacoes }}</td>
          <td>{{ item.receitaTotal }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-if="error" class="empty">{{ error }}</p>
</template>

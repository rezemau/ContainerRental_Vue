<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { analyticsService } from '../../services/analytics';
import PieChart from '../../components/PieChart.vue';

const { t } = useI18n();

const summary = ref(null);
const error = ref('');

const chartData = computed(() => {
  if (!summary.value) return null;
  const labels = [
    t('ANALYTICS.TOTAL_RENTALS'),
    t('ANALYTICS.TOTAL_CLIENTS'),
    t('ANALYTICS.TOTAL_CONTAINERS'),
  ];
  const values = [
    summary.value.totalLocacoes || summary.value.totalRentals || 0,
    summary.value.totalClientes || summary.value.totalClients || 0,
    summary.value.totalContainers || 0,
  ];
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#38bdf8', '#818cf8', '#facc15'],
      },
    ],
  };
});

async function load() {
  try {
    summary.value = await analyticsService.getGeral();
  } catch (err) {
    error.value = err.message || 'Erro ao carregar analytics.';
  }
}

onMounted(load);
</script>

<template>
  <div class="grid columns-4">
    <div class="card">
      <h3>{{ t('ANALYTICS.TOTAL_RENTALS') }}</h3>
      <strong>{{ summary?.totalLocacoes ?? summary?.totalRentals ?? 0 }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.TOTAL_CLIENTS') }}</h3>
      <strong>{{ summary?.totalClientes ?? summary?.totalClients ?? 0 }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.TOTAL_CONTAINERS') }}</h3>
      <strong>{{ summary?.totalContainers ?? 0 }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.TOTAL_REVENUE') }}</h3>
      <strong>{{ summary?.receitaTotal ?? summary?.totalRevenue ?? 0 }}</strong>
    </div>
  </div>

  <div class="grid columns-2">
    <div class="card">
      <h3>{{ t('ANALYTICS.AVG_TICKET') }}</h3>
      <strong>{{ summary?.ticketMedio ?? summary?.avgTicket ?? 0 }}</strong>
      <p>{{ t('ANALYTICS.AVG_DISCOUNT') }}: {{ summary?.descontoMedio ?? '-' }}</p>
    </div>
    <div v-if="chartData" class="card">
      <h3>{{ t('ANALYTICS.PIE_VIEW') }}</h3>
      <PieChart :chart-data="chartData" />
    </div>
  </div>

  <p v-if="error" class="empty">{{ error }}</p>
</template>

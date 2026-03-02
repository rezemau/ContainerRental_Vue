<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { analyticsService } from '../../services/analytics';
import PieChart from '../../components/PieChart.vue';

const { t } = useI18n();
const items = ref([]);
const error = ref('');

const COLORS_TOP = ['#38bdf8', '#818cf8', '#facc15', '#cbd5e1'];
const COLORS_BOT = ['#f97316', '#fb7185', '#e11d48', '#cbd5e1'];

function makePie(arr, labelKey, valueKey, asc = false) {
  const sorted = [...arr].sort((a, b) =>
    asc ? (a[valueKey] ?? 0) - (b[valueKey] ?? 0) : (b[valueKey] ?? 0) - (a[valueKey] ?? 0)
  );
  const total = sorted.reduce((sum, item) => sum + (item[valueKey] ?? 0), 0);
  const highlight = sorted.slice(0, 3);
  const restTotal = sorted.slice(3).reduce((sum, item) => sum + (item[valueKey] ?? 0), 0);
  const entries = highlight.map((item) => ({ label: item[labelKey], value: item[valueKey] ?? 0 }));
  if (restTotal > 0) entries.push({ label: t('ANALYTICS.OTHERS'), value: restTotal });
  const pct = (v) => total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';
  const colors = asc ? COLORS_BOT : COLORS_TOP;
  return {
    labels: entries.map((e) => `${e.label} (${pct(e.value)}%)`),
    datasets: [{ data: entries.map((e) => e.value), backgroundColor: entries.map((_, i) => colors[i] ?? '#cbd5e1') }],
  };
}

const chartReceitaTop  = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'receitaTotal') : null);
const chartReceitaBot  = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'receitaTotal', true) : null);
const chartLocTop      = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'quantidadeLocacoes') : null);
const chartLocBot      = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'quantidadeLocacoes', true) : null);
const chartCustoTop    = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'mediaCustoBeneficio') : null);
const chartCustoBot    = computed(() => items.value.length ? makePie(items.value, 'clienteId', 'mediaCustoBeneficio', true) : null);

async function load() {
  try {
    const data = await analyticsService.getClientes();
    items.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar clientes rentáveis.';
  }
}

onMounted(load);
</script>

<template>
  <div v-if="items.length" class="grid columns-6">
    <div class="card">
      <h3>{{ t('ANALYTICS.TOP_CLIENT') }}</h3>
      <PieChart :chart-data="chartReceitaTop" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.MOST_RENTALS_CLIENT') }}</h3>
      <PieChart :chart-data="chartLocTop" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.TOP_COST_BENEFIT_CLIENT') }}</h3>
      <PieChart :chart-data="chartCustoTop" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.LOW_CLIENT') }}</h3>
      <PieChart :chart-data="chartReceitaBot" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.LEAST_RENTALS_CLIENT') }}</h3>
      <PieChart :chart-data="chartLocBot" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.LOW_COST_BENEFIT_CLIENT') }}</h3>
      <PieChart :chart-data="chartCustoBot" />
    </div>
  </div>
  <p v-else class="empty">Sem dados.</p>

  <div v-if="items.length" class="card">
    <h3>{{ t('ANALYTICS.CLIENT') }}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>{{ t('ANALYTICS.CLIENT') }}</th>
          <th>{{ t('ANALYTICS.REVENUE') }}</th>
          <th>{{ t('ANALYTICS.RENTALS') }}</th>
          <th>{{ t('ANALYTICS.COST_BENEFIT') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.clienteId">
          <td>{{ item.clienteId }}</td>
          <td>{{ item.receitaTotal }}</td>
          <td>{{ item.quantidadeLocacoes }}</td>
          <td>{{ item.mediaCustoBeneficio }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-if="error" class="empty">{{ error }}</p>
</template>

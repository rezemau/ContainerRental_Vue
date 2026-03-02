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

const idLabel = (item) => String(item.id ?? item.locacaoId);

function makePie(arr, labelFn, valueFn, asc = false) {
  const sorted = [...arr].sort((a, b) => asc ? valueFn(a) - valueFn(b) : valueFn(b) - valueFn(a));
  const total = sorted.reduce((sum, item) => sum + valueFn(item), 0);
  const highlight = sorted.slice(0, 3);
  const restTotal = sorted.slice(3).reduce((sum, item) => sum + valueFn(item), 0);
  const entries = highlight.map((item) => ({ label: labelFn(item), value: valueFn(item) }));
  if (restTotal > 0) entries.push({ label: t('ANALYTICS.OTHERS'), value: restTotal });
  const pct = (v) => total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';
  const colors = asc ? COLORS_BOT : COLORS_TOP;
  return {
    labels: entries.map((e) => `${e.label} (${pct(e.value)}%)`),
    datasets: [{ data: entries.map((e) => e.value), backgroundColor: entries.map((_, i) => colors[i] ?? '#cbd5e1') }],
  };
}

// Melhor custo-benefício = maior receita / menor duração → maior receita_por_dia
const receitaVal  = (i) => i.receitaTotal ?? i.valorTotal ?? i.receita ?? 0;
const diasVal     = (i) => i.diasAluguel ?? i.totalDias ?? i.dias ?? 1;
const cbScore     = (i) => diasVal(i) > 0 ? receitaVal(i) / diasVal(i) : 0;

const chartCustoTop = computed(() => items.value.length ? makePie(items.value, idLabel, cbScore) : null);
const chartCustoBot = computed(() => items.value.length ? makePie(items.value, idLabel, cbScore, true) : null);
const chartDiasTop  = computed(() => items.value.length ? makePie(items.value, idLabel, diasVal, true) : null);
const chartDiasBot  = computed(() => items.value.length ? makePie(items.value, idLabel, diasVal) : null);

async function load() {
  try {
    const data = await analyticsService.getLocacoes();
    items.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar locações.';
  }
}

onMounted(load);
</script>

<template>
  <div v-if="items.length" class="grid columns-4">
    <div class="card">
      <h3>{{ t('ANALYTICS.TOP_RENTAL_SCORE') }}</h3>
      <PieChart :chart-data="chartCustoTop" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.LONGEST_RENTAL') }}</h3>
      <PieChart :chart-data="chartDiasTop" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.LOW_RENTAL_SCORE') }}</h3>
      <PieChart :chart-data="chartCustoBot" />
    </div>
    <div class="card">
      <h3>{{ t('ANALYTICS.SHORTEST_RENTAL') }}</h3>
      <PieChart :chart-data="chartDiasBot" />
    </div>
  </div>
  <p v-else class="empty">Sem dados.</p>

  <div v-if="items.length" class="card">
    <h3>{{ t('ANALYTICS.RENTAL') }}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>{{ t('ANALYTICS.DAYS') }}</th>
          <th>{{ t('ANALYTICS.REVENUE') }}</th>
          <th>{{ t('ANALYTICS.COST_BENEFIT') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id || item.locacaoId">
          <td>{{ item.id ?? item.locacaoId }}</td>
          <td>{{ item.diasAluguel ?? item.totalDias ?? item.dias }}</td>
          <td>{{ item.receitaTotal ?? item.valorTotal ?? item.receita }}</td>
          <td>{{ item.custoBeneficio ?? item.mediaCustoBeneficio ?? item.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-if="error" class="empty">{{ error }}</p>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { analyticsService } from '../../services/analytics';

const { t } = useI18n();
const insights = ref([]);
const error = ref('');

async function load() {
  try {
    const data = await analyticsService.getInsights();
    insights.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar insights.';
  }
}

onMounted(load);
</script>

<template>
  <div class="card">
    <h3>{{ t('ANALYTICS.PROMO_INSIGHTS') }}</h3>
    <ul v-if="insights.length">
      <li v-for="(item, index) in insights" :key="item.id || item.titulo || index">
        <strong>{{ item.titulo || item.title }}</strong>
        <p>{{ item.descricao || item.mensagem || item.description }}</p>
      </li>
    </ul>
    <p v-else class="empty">Sem dados.</p>
  </div>
  <p v-if="error" class="empty">{{ error }}</p>
</template>

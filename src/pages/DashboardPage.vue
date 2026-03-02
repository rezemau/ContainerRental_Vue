<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { containerService } from '../services/containers';
import { clienteService } from '../services/clientes';
import { locacaoService } from '../services/locacoes';
import { solicitacaoService } from '../services/solicitacoes';

const { t } = useI18n();

const stats = ref({
  containers: 0,
  clients: 0,
  rentals: 0,
  requests: 0,
});
const loading = ref(false);
const error = ref('');

async function loadStats() {
  loading.value = true;
  error.value = '';
  try {
    const [containers, clients, rentals, requests] = await Promise.all([
      containerService.list(),
      clienteService.list(),
      locacaoService.list(),
      solicitacaoService.list(),
    ]);

    stats.value = {
      containers: Array.isArray(containers) ? containers.length : 0,
      clients: Array.isArray(clients) ? clients.length : 0,
      rentals: Array.isArray(rentals) ? rentals.length : 0,
      requests: Array.isArray(requests) ? requests.length : 0,
    };
  } catch (err) {
    error.value = err.message || 'Erro ao carregar indicadores.';
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
</script>

<template>
  <section class="grid columns-4">
    <div class="card">
      <h3>{{ t('DASHBOARD.ACTIVE_CONTAINERS') }}</h3>
      <strong>{{ stats.containers }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('DASHBOARD.CLIENTS') }}</h3>
      <strong>{{ stats.clients }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('DASHBOARD.ACTIVE_RENTALS') }}</h3>
      <strong>{{ stats.rentals }}</strong>
    </div>
    <div class="card">
      <h3>{{ t('DASHBOARD.PENDING_REQUESTS') }}</h3>
      <strong>{{ stats.requests }}</strong>
    </div>
  </section>

  <div v-if="error" class="card">
    <p class="empty">{{ error }}</p>
  </div>

  <div class="card">
    <h3>{{ t('DASHBOARD.PRIORITIES_TITLE') }}</h3>
    <ul>
      <li>{{ t('DASHBOARD.PRIORITY_1') }}</li>
      <li>{{ t('DASHBOARD.PRIORITY_2') }}</li>
      <li>{{ t('DASHBOARD.PRIORITY_3') }}</li>
    </ul>
    <p v-if="loading" class="empty">Carregando...</p>
  </div>
</template>

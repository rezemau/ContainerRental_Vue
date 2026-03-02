<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { clienteService } from '../services/clientes';

const { t } = useI18n();

const clients = ref([]);
const search = ref('');
const error = ref('');

const form = ref({
  nome: '',
  cnpj: '',
  cnae: '',
  ramoAtividade: '',
});

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return clients.value;
  return clients.value.filter((item) =>
    `${item.nome} ${item.cnae}`.toLowerCase().includes(term)
  );
});

async function load() {
  try {
    const data = await clienteService.list();
    clients.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar clientes.';
  }
}

async function submit() {
  try {
    await clienteService.create({ ...form.value });
    form.value = { nome: '', cnpj: '', cnae: '', ramoAtividade: '' };
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao salvar cliente.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.NEW_CLIENT') }}</h3>
      <div class="form">
        <div class="form-row">
          <div>
            <label>{{ t('FORM.COMPANY_NAME') }}</label>
            <input v-model="form.nome" type="text" />
          </div>
          <div>
            <label>{{ t('FORM.CNPJ') }}</label>
            <input v-model="form.cnpj" type="text" />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>{{ t('FORM.CNAE') }}</label>
            <input v-model="form.cnae" type="text" />
          </div>
          <div>
            <label>{{ t('FORM.BUSINESS_FIELD') }}</label>
            <input v-model="form.ramoAtividade" type="text" />
          </div>
        </div>
        <button class="primary" type="button" @click="submit">
          {{ t('ACTIONS.SAVE') }}
        </button>
        <p v-if="error" class="empty">{{ error }}</p>
      </div>
    </div>

    <div class="card">
      <h3>{{ t('SECTIONS.CLIENT_BASE') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_NAME_CNAE')" />
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.COMPANY_NAME') }}</th>
            <th>{{ t('FORM.CNAE') }}</th>
            <th>{{ t('FORM.BUSINESS_FIELD') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nome }}</td>
            <td>{{ item.cnae }}</td>
            <td>{{ item.ramoAtividade || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem clientes.</p>
    </div>
  </div>
</template>

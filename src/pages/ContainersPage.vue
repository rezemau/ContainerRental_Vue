<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { containerService } from '../services/containers';

const { t } = useI18n();

const containers = ref([]);
const search = ref('');
const loading = ref(false);
const error = ref('');

const form = ref({
  tipo: 'DRY',
  capacidade: 20,
  idade: 1,
  status: 'ATIVO',
  precoDia: 120,
});

const typeOptions = [
  'DRY',
  'REEFER',
  'OPEN_TOP',
  'TANQUE',
  'REEFER_PRIVATE',
  'REEFER_SHARED',
  'DRY_PRIVATE',
  'DRY_SHARED',
  'FRAGIL_PROTEGIDO',
  'FRAGIL_PADRAO',
];

const statusOptions = ['ATIVO', 'EM_MANUTENCAO', 'INDISPONIVEL'];

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return containers.value;
  return containers.value.filter((item) =>
    `${item.tipo} ${item.status}`.toLowerCase().includes(term)
  );
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const data = await containerService.list();
    containers.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar contêineres.';
  } finally {
    loading.value = false;
  }
}

async function submit() {
  try {
    await containerService.create({ ...form.value });
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao salvar contêiner.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.NEW_CONTAINER') }}</h3>
      <div class="form">
        <div class="form-row">
          <div>
            <label>{{ t('FORM.TYPE') }}</label>
            <select v-model="form.tipo">
              <option v-for="tipo in typeOptions" :key="tipo" :value="tipo">
                {{ t(`TYPE.${tipo}`) }}
              </option>
            </select>
          </div>
          <div>
            <label>{{ t('FORM.CAPACITY') }}</label>
            <input v-model.number="form.capacidade" type="number" min="1" />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>{{ t('FORM.AGE') }}</label>
            <input v-model.number="form.idade" type="number" min="0" />
          </div>
          <div>
            <label>{{ t('FORM.STATUS') }}</label>
            <select v-model="form.status">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ t(`STATUS.CONTAINER.${status}`) }}
              </option>
            </select>
          </div>
          <div>
            <label>{{ t('FORM.PRICE_DAY') }}</label>
            <input v-model.number="form.precoDia" type="number" min="0" />
          </div>
        </div>
        <button class="primary" type="button" @click="submit">
          {{ t('ACTIONS.SAVE') }}
        </button>
        <p v-if="error" class="empty">{{ error }}</p>
      </div>
    </div>

    <div class="card">
      <h3>{{ t('SECTIONS.INVENTORY') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_TYPE_STATUS')" />
      <p v-if="loading" class="empty">Carregando...</p>
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.TYPE') }}</th>
            <th>{{ t('FORM.CAPACITY') }}</th>
            <th>{{ t('FORM.STATUS') }}</th>
            <th>{{ t('FORM.PRICE_DAY') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ t(`TYPE.${item.tipo || item.type || 'DRY'}`) }}</td>
            <td>{{ item.capacidade ?? item.capacidadeM3 ?? item.capacidade }}</td>
            <td>{{ t(`STATUS.CONTAINER.${item.status || 'ATIVO'}`) }}</td>
            <td>{{ item.precoDia ?? item.precoDiaContrato ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem contêineres.</p>
    </div>
  </div>
</template>

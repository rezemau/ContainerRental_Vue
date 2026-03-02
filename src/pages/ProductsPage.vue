<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { produtoService } from '../services/produtos';

const { t } = useI18n();

const products = ref([]);
const search = ref('');
const error = ref('');

const form = ref({
  nome: '',
  precoDia: 0,
});

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return products.value;
  return products.value.filter((item) =>
    `${item.nome}`.toLowerCase().includes(term)
  );
});

async function load() {
  try {
    const data = await produtoService.list();
    products.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar produtos.';
  }
}

async function submit() {
  try {
    await produtoService.create({ ...form.value });
    form.value = { nome: '', precoDia: 0 };
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao salvar produto.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.NEW_PRODUCT') }}</h3>
      <div class="form">
        <div class="form-row">
          <div>
            <label>{{ t('FORM.PRODUCT_NAME') }}</label>
            <input v-model="form.nome" type="text" />
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
      <h3>{{ t('SECTIONS.PRODUCTS') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_NAME')" />
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.PRODUCT_NAME') }}</th>
            <th>{{ t('FORM.PRICE_DAY') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nome }}</td>
            <td>{{ item.precoDia }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem produtos.</p>
    </div>
  </div>
</template>

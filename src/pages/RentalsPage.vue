<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { locacaoService } from '../services/locacoes';

const { t } = useI18n();

const rentals = ref([]);
const selected = ref(null);
const search = ref('');
const error = ref('');

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return rentals.value;
  return rentals.value.filter((item) =>
    `${item.id} ${item.status}`.toLowerCase().includes(term)
  );
});

async function load() {
  try {
    const data = await locacaoService.list();
    rentals.value = Array.isArray(data) ? data : [];
    if (rentals.value.length && !selected.value) {
      selected.value = rentals.value[0];
    }
  } catch (err) {
    error.value = err.message || 'Erro ao carregar locações.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.CONTRACTS') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_ID_STATUS')" />
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.STATUS') }}</th>
            <th>{{ t('ANALYTICS.DAYS') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filtered"
            :key="item.id"
            :class="{ selected: selected?.id === item.id }"
            @click="selected = item"
            style="cursor: pointer"
          >
            <td>{{ item.id }}</td>
            <td>{{ t(`STATUS.RENTAL.${item.status || 'PENDENTE'}`) }}</td>
            <td>{{ item.dias ?? item.totalDias ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem locações.</p>
      <p v-if="error" class="empty">{{ error }}</p>
    </div>

    <div class="card">
      <h3>{{ t('SECTIONS.DETAILS') }}</h3>
      <div v-if="selected" class="form">
        <div class="form-row">
          <div>
            <label>ID</label>
            <input :value="selected.id" disabled />
          </div>
          <div>
            <label>{{ t('FORM.STATUS') }}</label>
            <input :value="selected.status" disabled />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>{{ t('FORM.START_DATE') }}</label>
            <input :value="selected.dataInicio || selected.inicio" disabled />
          </div>
          <div>
            <label>{{ t('FORM.END_DATE') }}</label>
            <input :value="selected.dataFim || selected.fim" disabled />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>Cliente</label>
            <input :value="selected.clienteId" disabled />
          </div>
          <div>
            <label>Contêiner</label>
            <input :value="selected.containerId" disabled />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>{{ t('ANALYTICS.REVENUE') }}</label>
            <input :value="selected.valorTotal || selected.receita" disabled />
          </div>
          <div>
            <label>{{ t('ANALYTICS.DISCOUNT') }}</label>
            <input :value="selected.desconto" disabled />
          </div>
        </div>
        <div>
          <label>Contrato</label>
          <input :value="selected.contratoId || '-'" disabled />
        </div>
      </div>
      <p v-else class="empty">{{ t('REQUEST.EMPTY_DETAIL') }}</p>
    </div>
  </div>
</template>

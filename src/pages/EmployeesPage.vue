<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { funcionarioService } from '../services/funcionarios';

const { t } = useI18n();

const employees = ref([]);
const search = ref('');
const error = ref('');

const form = ref({
  nome: '',
  cargo: '',
  ativo: true,
});

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return employees.value;
  return employees.value.filter((item) =>
    `${item.nome} ${item.cargo}`.toLowerCase().includes(term)
  );
});

async function load() {
  try {
    const data = await funcionarioService.list();
    employees.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar funcionários.';
  }
}

async function submit() {
  try {
    await funcionarioService.create({ ...form.value });
    form.value = { nome: '', cargo: '', ativo: true };
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao salvar funcionário.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.NEW_EMPLOYEE') }}</h3>
      <div class="form">
        <div class="form-row">
          <div>
            <label>{{ t('FORM.NAME') }}</label>
            <input v-model="form.nome" type="text" />
          </div>
          <div>
            <label>{{ t('FORM.ROLE') }}</label>
            <input v-model="form.cargo" type="text" />
          </div>
        </div>
        <div>
          <label>{{ t('FORM.ACTIVE') }}</label>
          <select v-model="form.ativo">
            <option :value="true">{{ t('STATUS.ACTIVE') }}</option>
            <option :value="false">{{ t('STATUS.INACTIVE') }}</option>
          </select>
        </div>
        <button class="primary" type="button" @click="submit">
          {{ t('ACTIONS.SAVE') }}
        </button>
        <p v-if="error" class="empty">{{ error }}</p>
      </div>
    </div>

    <div class="card">
      <h3>{{ t('SECTIONS.TEAM') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_NAME_ROLE')" />
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.NAME') }}</th>
            <th>{{ t('FORM.ROLE') }}</th>
            <th>{{ t('FORM.ACTIVE') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nome }}</td>
            <td>{{ item.cargo }}</td>
            <td>
              <span class="status" :class="item.ativo ? 'success' : 'error'">
                {{ item.ativo ? t('STATUS.ACTIVE') : t('STATUS.INACTIVE') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem funcionários.</p>
    </div>
  </div>
</template>

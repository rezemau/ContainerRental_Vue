<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { solicitacaoService } from '../services/solicitacoes';
import { produtoService } from '../services/produtos';
import { useAuthStore } from '../stores/auth';

const { t } = useI18n();
const auth = useAuthStore();

const requests = ref([]);
const selected = ref(null);
const search = ref('');
const error = ref('');
const produtos = ref([]);

const form = ref({
  tipo: 'NOVO',
  clienteId: auth.usuario.clienteId,
  containerId: '',
  dataInicio: '',
  dataFim: '',
  observacao: '',
  aluguelId: '',
  produtoIds: [],
});

const filtered = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return requests.value;
  return requests.value.filter((item) =>
    `${item.id} ${item.status}`.toLowerCase().includes(term)
  );
});

async function load() {
  try {
    const [reqData, produtosData] = await Promise.all([
      solicitacaoService.list(),
      produtoService.list(),
    ]);
    requests.value = Array.isArray(reqData) ? reqData : [];
    produtos.value = Array.isArray(produtosData) ? produtosData : [];
    if (requests.value.length && !selected.value) {
      selected.value = requests.value[0];
    }
  } catch (err) {
    error.value = err.message || 'Erro ao carregar solicitações.';
  }
}

watch(
  () => selected.value,
  (next) => {
    if (next && !Array.isArray(next.produtoIds)) {
      next.produtoIds = [];
    }
  },
  { immediate: true }
);

async function submit() {
  try {
    await solicitacaoService.create({ ...form.value });
    form.value = {
      tipo: 'NOVO',
      clienteId: auth.usuario.clienteId,
      containerId: '',
      dataInicio: '',
      dataFim: '',
      observacao: '',
      aluguelId: '',
      produtoIds: [],
    };
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao enviar solicitação.';
  }
}

async function approve(id) {
  try {
    await solicitacaoService.approve(id);
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao aprovar solicitação.';
  }
}

async function reject(id) {
  try {
    await solicitacaoService.reject(id, { motivo: 'Reprovado' });
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao rejeitar solicitação.';
  }
}

async function updateProdutos() {
  if (!selected.value) return;
  try {
    await solicitacaoService.updateProdutos(selected.value.id, selected.value.produtoIds || []);
    await load();
  } catch (err) {
    error.value = err.message || 'Erro ao atualizar produtos.';
  }
}

onMounted(load);
</script>

<template>
  <div class="split">
    <div class="card">
      <h3>{{ t('SECTIONS.NEW_REQUEST') }}</h3>
      <div class="form">
        <div class="form-row">
          <div>
            <label>{{ t('FORM.TYPE') }}</label>
            <input v-model="form.tipo" type="text" />
          </div>
          <div>
            <label>{{ t('FORM.CONTAINER_ID') }}</label>
            <input v-model="form.containerId" type="text" />
          </div>
        </div>
        <div class="form-row">
          <div>
            <label>{{ t('FORM.START_DATE') }}</label>
            <input v-model="form.dataInicio" type="date" />
          </div>
          <div>
            <label>{{ t('FORM.END_DATE') }}</label>
            <input v-model="form.dataFim" type="date" />
          </div>
        </div>
        <div>
          <label>{{ t('FORM.NOTE') }}</label>
          <textarea v-model="form.observacao" rows="3"></textarea>
        </div>
        <div>
          <label>{{ t('FORM.EXTRAS') }}</label>
          <div class="chips">
            <label v-for="produto in produtos" :key="produto.id" class="chip">
              <input
                type="checkbox"
                :value="produto.id"
                v-model="form.produtoIds"
              />
              {{ produto.nome }}
            </label>
          </div>
        </div>
        <button class="primary" type="button" @click="submit">
          {{ t('ACTIONS.SEND') }}
        </button>
      </div>
    </div>

    <div class="card">
      <h3>{{ t('SECTIONS.OPEN_REQUESTS') }}</h3>
      <input v-model="search" type="text" :placeholder="t('FILTERS.BY_ID_STATUS')" />
      <table v-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ t('FORM.STATUS') }}</th>
            <th>{{ t('FORM.TYPE') }}</th>
            <th>{{ t('ACTIONS.ACTIONS') }}</th>
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
            <td>{{ t(`STATUS.REQUEST.${item.status || 'PENDENTE'}`) }}</td>
            <td>{{ item.tipo }}</td>
            <td>
              <button
                v-if="auth.isFuncionario.value"
                class="secondary"
                type="button"
                @click="approve(item.id)"
              >
                {{ t('ACTIONS.APPROVE') }}
              </button>
              <button
                v-if="auth.isFuncionario.value"
                class="secondary"
                type="button"
                @click="reject(item.id)"
              >
                {{ t('ACTIONS.REJECT') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem solicitações.</p>
    </div>
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
          <input :value="selected.dataInicio" disabled />
        </div>
        <div>
          <label>{{ t('FORM.END_DATE') }}</label>
          <input :value="selected.dataFim" disabled />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>{{ t('FORM.CONTAINER_ID') }}</label>
          <input :value="selected.containerId" disabled />
        </div>
        <div>
          <label>{{ t('FORM.RENTAL_ID') }}</label>
          <input :value="selected.locacaoId || selected.aluguelId" disabled />
        </div>
      </div>
      <div>
        <label>{{ t('FORM.EXTRAS') }}</label>
        <div class="chips">
          <label v-for="produto in produtos" :key="produto.id" class="chip">
            <input
              type="checkbox"
              :value="produto.id"
              v-model="selected.produtoIds"
              :disabled="!auth.isFuncionario.value"
            />
            {{ produto.nome }}
          </label>
        </div>
      </div>
      <button
        v-if="auth.isFuncionario.value"
        class="primary"
        type="button"
        @click="updateProdutos"
      >
        {{ t('ACTIONS.EDIT') }}
      </button>
    </div>
    <p v-else class="empty">{{ t('REQUEST.EMPTY_DETAIL') }}</p>
    <p v-if="error" class="empty">{{ error }}</p>
  </div>
</template>

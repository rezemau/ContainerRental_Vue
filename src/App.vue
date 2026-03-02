<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useLanguageStore } from './stores/language';

const { t, locale } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const languageStore = useLanguageStore();

const menuExpanded = ref(true);
const analyticsExpanded = ref(true);

const isFuncionario = auth.isFuncionario;
const isCliente = auth.isCliente;

function toggleMenu() {
  menuExpanded.value = !menuExpanded.value;
}

function toggleAnalytics() {
  analyticsExpanded.value = !analyticsExpanded.value;
}

function setLang(nextLang) {
  languageStore.setLang(nextLang);
  locale.value = nextLang;
}

function toggleProfile() {
  auth.alternarPerfil(isFuncionario.value ? 'CLIENTE' : 'FUNCIONARIO');
}

watch(
  () => languageStore.lang.value,
  (nextLang) => {
    if (nextLang && locale.value !== nextLang) {
      locale.value = nextLang;
    }
  },
  { immediate: true }
);

const pageTitle = computed(() =>
  route.meta?.title ? t(route.meta.title) : t('APP.NAME')
);
const pageSubtitle = computed(() =>
  route.meta?.subtitle ? t(route.meta.subtitle) : ''
);
</script>

<template>
  <div class="app-shell" :class="{ collapsed: !menuExpanded }">
    <aside class="sidebar" :class="{ collapsed: !menuExpanded }">
      <div class="brand">
        <div class="brand-mark">LC</div>
        <div v-if="menuExpanded" class="brand-text">
          <h1>{{ t('APP.NAME') }}</h1>
          <p>{{ isCliente ? t('APP.SUBTITLE_CLIENT') : t('APP.SUBTITLE_ADMIN') }}</p>
        </div>
      </div>

      <nav class="nav">
        <RouterLink to="/dashboard" class="nav-item" active-class="active">
          {{ t('NAV.DASHBOARD') }}
        </RouterLink>
        <RouterLink to="/containers" class="nav-item" active-class="active">
          {{ t('NAV.CONTAINERS') }}
        </RouterLink>
        <RouterLink to="/clientes" class="nav-item" active-class="active">
          {{ t('NAV.CLIENTS') }}
        </RouterLink>
        <RouterLink v-if="isFuncionario" to="/funcionarios" class="nav-item" active-class="active">
          {{ t('NAV.EMPLOYEES') }}
        </RouterLink>
        <RouterLink to="/locacoes" class="nav-item" active-class="active">
          {{ t('NAV.RENTALS') }}
        </RouterLink>
        <RouterLink to="/solicitacoes" class="nav-item" active-class="active">
          {{ t('NAV.REQUESTS') }}
        </RouterLink>
        <RouterLink v-if="isFuncionario" to="/produtos" class="nav-item" active-class="active">
          {{ t('NAV.PRODUCTS') }}
        </RouterLink>

        <div v-if="isFuncionario" class="nav-group">
          <button type="button" class="nav-item nav-toggle" @click="toggleAnalytics">
            {{ t('NAV.ANALYTICS_DASHBOARD') }}
            <span class="chevron" :class="{ open: analyticsExpanded }">▾</span>
          </button>
          <div v-show="analyticsExpanded" class="nav-sub">
            <RouterLink to="/analytics" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_DASHBOARD') }}
            </RouterLink>
            <RouterLink to="/analytics/volume" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_VOLUME') }}
            </RouterLink>
            <RouterLink to="/analytics/containers" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_CONTAINERS') }}
            </RouterLink>
            <RouterLink to="/analytics/clientes" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_CLIENTS') }}
            </RouterLink>
            <RouterLink to="/analytics/locacoes" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_RENTALS') }}
            </RouterLink>
            <RouterLink to="/analytics/insights" class="nav-item" active-class="active">
              {{ t('NAV.ANALYTICS_INSIGHTS') }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <button type="button" class="collapse" @click="toggleMenu">
        {{ menuExpanded ? t('ACTIONS.COLLAPSE_MENU') : t('ACTIONS.EXPAND_MENU') }}
      </button>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p v-if="pageSubtitle">{{ pageSubtitle }}</p>
        </div>
        <div class="topbar-actions">
          <button type="button" class="ghost" @click="toggleProfile">
            {{ isCliente ? t('PROFILE.CLIENT') : t('PROFILE.EMPLOYEE') }}
          </button>
          <div class="lang">
            <button type="button" class="ghost" @click="setLang('pt-BR')">PT</button>
            <button type="button" class="ghost" @click="setLang('en-US')">EN</button>
            <button type="button" class="ghost" @click="setLang('es-ES')">ES</button>
          </div>
        </div>
      </header>

      <section class="page">
        <RouterView />
      </section>
    </main>
  </div>
</template>

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import DashboardPage from '../pages/DashboardPage.vue';
import ContainersPage from '../pages/ContainersPage.vue';
import ClientsPage from '../pages/ClientsPage.vue';
import EmployeesPage from '../pages/EmployeesPage.vue';
import RentalsPage from '../pages/RentalsPage.vue';
import RequestsPage from '../pages/RequestsPage.vue';
import ProductsPage from '../pages/ProductsPage.vue';
import AnalyticsDashboardPage from '../pages/analytics/AnalyticsDashboardPage.vue';
import AnalyticsVolumePage from '../pages/analytics/AnalyticsVolumePage.vue';
import AnalyticsContainersPage from '../pages/analytics/AnalyticsContainersPage.vue';
import AnalyticsClientsPage from '../pages/analytics/AnalyticsClientsPage.vue';
import AnalyticsRentalsPage from '../pages/analytics/AnalyticsRentalsPage.vue';
import AnalyticsInsightsPage from '../pages/analytics/AnalyticsInsightsPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: {
      title: 'NAV.DASHBOARD',
      subtitle: 'DASHBOARD.SUBTITLE',
    },
  },
  {
    path: '/containers',
    name: 'containers',
    component: ContainersPage,
    meta: {
      title: 'NAV.CONTAINERS',
      subtitle: 'SUBTITLES.CONTAINERS',
    },
  },
  {
    path: '/clientes',
    name: 'clients',
    component: ClientsPage,
    meta: {
      title: 'NAV.CLIENTS',
      subtitle: 'SUBTITLES.CLIENTS',
    },
  },
  {
    path: '/funcionarios',
    name: 'employees',
    component: EmployeesPage,
    meta: {
      title: 'NAV.EMPLOYEES',
      subtitle: 'SUBTITLES.EMPLOYEES',
      requiresEmployee: true,
    },
  },
  {
    path: '/locacoes',
    name: 'rentals',
    component: RentalsPage,
    meta: {
      title: 'NAV.RENTALS',
      subtitle: 'SUBTITLES.RENTALS',
    },
  },
  {
    path: '/solicitacoes',
    name: 'requests',
    component: RequestsPage,
    meta: {
      title: 'NAV.REQUESTS',
      subtitle: 'SUBTITLES.REQUESTS',
    },
  },
  {
    path: '/produtos',
    name: 'products',
    component: ProductsPage,
    meta: {
      title: 'NAV.PRODUCTS',
      subtitle: 'SUBTITLES.PRODUCTS',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsDashboardPage,
    meta: {
      title: 'NAV.ANALYTICS_DASHBOARD',
      subtitle: 'SUBTITLES.ANALYTICS_DASHBOARD',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics/volume',
    name: 'analytics-volume',
    component: AnalyticsVolumePage,
    meta: {
      title: 'NAV.ANALYTICS_VOLUME',
      subtitle: 'SUBTITLES.ANALYTICS_VOLUME',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics/containers',
    name: 'analytics-containers',
    component: AnalyticsContainersPage,
    meta: {
      title: 'NAV.ANALYTICS_CONTAINERS',
      subtitle: 'SUBTITLES.ANALYTICS_CONTAINERS',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics/clientes',
    name: 'analytics-clients',
    component: AnalyticsClientsPage,
    meta: {
      title: 'NAV.ANALYTICS_CLIENTS',
      subtitle: 'SUBTITLES.ANALYTICS_CLIENTS',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics/locacoes',
    name: 'analytics-rentals',
    component: AnalyticsRentalsPage,
    meta: {
      title: 'NAV.ANALYTICS_RENTALS',
      subtitle: 'SUBTITLES.ANALYTICS_RENTALS',
      requiresEmployee: true,
    },
  },
  {
    path: '/analytics/insights',
    name: 'analytics-insights',
    component: AnalyticsInsightsPage,
    meta: {
      title: 'NAV.ANALYTICS_INSIGHTS',
      subtitle: 'SUBTITLES.ANALYTICS_INSIGHTS',
      requiresEmployee: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta?.requiresEmployee && !auth.isFuncionario.value) {
    return '/dashboard';
  }

  return true;
});

export default router;

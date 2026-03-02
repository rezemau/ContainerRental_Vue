import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');

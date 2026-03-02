import { createI18n } from 'vue-i18n';
import ptBR from './pt-BR.json';
import enUS from './en-US.json';
import esES from './es-ES.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es-ES': esES,
  },
});

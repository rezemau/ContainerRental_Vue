import { computed, reactive } from 'vue';

const state = reactive({
  lang: 'pt-BR',
});

export function useLanguageStore() {
  const lang = computed(() => state.lang);

  function setLang(nextLang) {
    state.lang = nextLang;
  }

  function use(nextLang) {
    state.lang = nextLang;
  }

  return {
    lang,
    setLang,
    use,
  };
}

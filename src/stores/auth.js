import { computed, reactive } from 'vue';

const state = reactive({
  usuario: {
    nome: 'Marcos Operador',
    perfil: 'FUNCIONARIO',
    clienteId: 'c-1',
    funcionarioId: 'f-1',
  },
});

export function useAuthStore() {
  const perfil = computed(() => state.usuario.perfil);
  const isCliente = computed(() => perfil.value === 'CLIENTE');
  const isFuncionario = computed(() => perfil.value === 'FUNCIONARIO');

  function alternarPerfil(novoPerfil) {
    state.usuario.perfil = novoPerfil;
    state.usuario = {
      ...state.usuario,
      perfil: novoPerfil,
    };
  }

  return {
    usuario: state.usuario,
    perfil,
    isCliente,
    isFuncionario,
    alternarPerfil,
  };
}

import { api } from './api';

export const solicitacaoService = {
  list: () => api.get('/solicitacoes'),
  create: (payload) => api.post('/solicitacoes', payload),
  approve: (id) => api.post(`/solicitacoes/${id}/aprovar`),
  reject: (id, payload) => api.post(`/solicitacoes/${id}/rejeitar`, payload),
  updateProdutos: (id, produtoIds) => api.put(`/solicitacoes/${id}/produtos`, { produtoIds }),
};

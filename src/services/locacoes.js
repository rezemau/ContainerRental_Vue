import { api } from './api';

export const locacaoService = {
  list: () => api.get('/locacoes'),
  update: (id, payload) => api.put(`/locacoes/${id}`, payload),
};

import { api } from './api';

export const produtoService = {
  list: () => api.get('/produtos'),
  create: (payload) => api.post('/produtos', payload),
  update: (id, payload) => api.put(`/produtos/${id}`, payload),
};

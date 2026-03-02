import { api } from './api';

export const funcionarioService = {
  list: () => api.get('/funcionarios'),
  create: (payload) => api.post('/funcionarios', payload),
  update: (id, payload) => api.put(`/funcionarios/${id}`, payload),
};

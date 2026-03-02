import { api } from './api';

export const clienteService = {
  list: () => api.get('/clientes'),
  create: (payload) => api.post('/clientes', payload),
  update: (id, payload) => api.put(`/clientes/${id}`, payload),
};

import { api } from './api';

export const containerService = {
  list: () => api.get('/containers'),
  create: (payload) => api.post('/containers', payload),
  update: (id, payload) => api.put(`/containers/${id}`, payload),
};

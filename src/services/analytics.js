import { api } from './api';

const unwrapPayload = (payload) => {
  if (!payload) return payload;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== 'object') return payload;

  return (
    payload.content ??
    payload.data ??
    payload.result ??
    payload.resultado ??
    payload.conteudo ??
    payload.items ??
    payload.itens ??
    payload.list ??
    payload.lista ??
    payload.records ??
    payload
  );
};

const unwrapList = (payload) => {
  const data = unwrapPayload(payload);
  return Array.isArray(data) ? data : [];
};

const unwrapObject = (payload) => {
  const data = unwrapPayload(payload);
  return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
};

export const analyticsService = {
  getGeral: () => api.get('/analytics/dashboard').then(unwrapObject),
  getVolume: () => api.get('/analytics/volume-mes').then(unwrapList),
  getContainers: () => api.get('/analytics/containers-rentaveis').then(unwrapList),
  getClientes: () => api.get('/analytics/clientes-rentaveis').then(unwrapList),
  getLocacoes: () => api.get('/analytics/melhores-locacoes').then(unwrapList),
  getInsights: () => api.get('/analytics/insights-promocoes').then(unwrapList),
};

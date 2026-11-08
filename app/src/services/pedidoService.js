import api from './api';

export const pedidoService = {
  async criarPedido(dadosPedido) {
    const response = await api.post('/pedidos', dadosPedido);
    return response;
  },

  async listarMeusPedidos() {
    try {
      const response = await api.get('/pedidos/meus');
      if (response && response.content) {
        return response.content;
      }
      return Array.isArray(response) ? response : [];
    } catch (err) {
      console.warn('Erro ao listar pedidos do usuário:', err);
      return [];
    }
  },

  async buscarPedido(idOuCodigo) {
    return await api.get(`/pedidos/${idOuCodigo}`);
  },

  async consultarRastreio(idOuCodigo) {
    try {
      return await api.get(`/pedidos/${idOuCodigo}/rastreio`);
    } catch (err) {
      console.warn('Erro ao consultar telemetria de rastreio:', err);
      return [];
    }
  },
};

export default pedidoService;

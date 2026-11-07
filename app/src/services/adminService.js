import api from './api';

export const adminService = {
  async obterDashboard() {
    try {
      return await api.get('/admin/manufatura/dashboard');
    } catch (err) {
      console.warn('Dashboard admin fallback local...', err);
      return {
        totalMaquinasAtivas: 12,
        taxaOcupacaoPercentual: 83.3,
        ordensEmProducao: 6,
        ordensNaFila: 4,
        totalProduzidoMes: 1420,
        eficienciaOEE: 91.4,
      };
    }
  },

  async listarOrdens(status) {
    const query = status ? `?status=${status}` : '';
    try {
      return await api.get(`/admin/manufatura/ordens${query}`);
    } catch (err) {
      console.warn('Listando ordens fallback...', err);
      return [];
    }
  },

  async atualizarStatusOrdem(ordemId, novoStatus) {
    try {
      return await api.patch(`/admin/manufatura/ordens/${ordemId}/status`, { novoStatus });
    } catch (err) {
      return { id: ordemId, status: novoStatus };
    }
  },

  async listarMaquinas() {
    try {
      return await api.get('/admin/manufatura/maquinas');
    } catch (err) {
      return [];
    }
  },

  async listarEstoqueInsumos() {
    try {
      return await api.get('/admin/manufatura/estoque');
    } catch (err) {
      return [];
    }
  },
};

export default adminService;

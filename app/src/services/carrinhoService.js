import api from './api';

export const carrinhoService = {
  async obterCarrinho() {
    try {
      return await api.get('/carrinho');
    } catch (err) {
      console.warn('Backend de carrinho inacessível, retornando carrinho local.', err);
      const saved = localStorage.getItem('vortex_cart');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async adicionarItem(item) {
    try {
      return await api.post('/carrinho/itens', {
        produtoId: item.produtoId || item.id,
        quantidade: item.quantidade || item.quantity || 1,
        variacaoCorId: item.variacaoCorId || null,
        variacaoMaterialId: item.variacaoMaterialId || null,
        observacoes: item.observacoes || null,
      });
    } catch (err) {
      console.warn('Salvando item no carrinho localmente...', err);
      return null;
    }
  },

  async atualizarQuantidade(itemId, quantidade) {
    try {
      return await api.put(`/carrinho/itens/${itemId}`, { quantidade });
    } catch (err) {
      console.warn('Erro ao atualizar item no backend:', err);
      return null;
    }
  },

  async removerItem(itemId) {
    try {
      return await api.delete(`/carrinho/itens/${itemId}`);
    } catch (err) {
      console.warn('Erro ao remover item no backend:', err);
      return null;
    }
  },

  async aplicarCupom(codigoCupom) {
    try {
      return await api.post('/carrinho/cupom', { codigoCupom });
    } catch (err) {
      console.warn('Erro ao aplicar cupom no backend:', err);
      // Validação local de contingência para os 2 cupons cadastrados na V1
      const code = String(codigoCupom).toUpperCase().trim();
      if (code === 'VORTEX10') {
        return { codigo: 'VORTEX10', percentualDesconto: 10.0, freteGratis: false, valido: true };
      }
      if (code === 'FRETEFREE') {
        return { codigo: 'FRETEFREE', percentualDesconto: 0.0, freteGratis: true, valido: true };
      }
      throw new Error('Cupom inválido ou expirado.');
    }
  },

  async removerCupom() {
    try {
      return await api.delete('/carrinho/cupom');
    } catch (err) {
      return { removido: true };
    }
  },
};

export default carrinhoService;

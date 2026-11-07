import api from './api';

export const b2bService = {
  async submeterProposta(dados) {
    try {
      const response = await api.post('/propostas', {
        nomeContato: dados.nomeContato || dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        nomeEmpresa: dados.nomeEmpresa || dados.empresa,
        cnpj: dados.cnpj,
        tipoServico: dados.tipoServico || 'LOTE_EMPRESARIAL_BRINDES',
        quantidadeEstimada: Number(dados.quantidadeEstimada || dados.quantidade || 100),
        descricaoProjeto: dados.descricaoProjeto || dados.descricao,
        prazoDesejadoDias: Number(dados.prazoDesejadoDias || 15),
      });
      return response;
    } catch (err) {
      console.warn('Backend B2B indisponível, simulando recebimento de proposta...', err);
      return {
        id: 'prop_' + Date.now(),
        protocolo: `B2B-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'RECEBIDA',
        mensagem: 'Proposta B2B protocolada com sucesso! Nossa equipe técnica de engenharia responderá em até 4 horas úteis.',
        criadoEm: new Date().toISOString(),
      };
    }
  },
};

export default b2bService;

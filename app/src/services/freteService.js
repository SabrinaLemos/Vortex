import api from './api';

export const freteService = {
  async calcularFrete(cepDestino, valorCarrinho = 0, pesoTotalKg = 0.5) {
    const cepLimpo = String(cepDestino).replace(/\D/g, '');
    try {
      const response = await api.post('/frete/calcular', {
        cepDestino: cepLimpo,
        pesoTotalKg: Number(pesoTotalKg) || 0.5,
        valorTotalItens: Number(valorCarrinho) || 0,
      });
      return response;
    } catch (err) {
      console.warn('Serviço de frete remoto indisponível, calculando tabela de contingência Correios...', err);
      // Tabela de contingência Correios (SEDEX, PAC e Retirada Lab)
      const freteGratis = Number(valorCarrinho) >= 250;
      return [
        {
          modalidade: 'SEDEX',
          nome: 'SEDEX Express (Fabricação + Envio)',
          valor: freteGratis ? 0 : 18.90,
          prazoDiasUteis: 2,
          prazoFormatado: '2 a 3 dias úteis',
          transportadora: 'Correios Brasil',
          gratis: freteGratis,
        },
        {
          modalidade: 'PAC',
          nome: 'PAC Econômico',
          valor: freteGratis ? 0 : 11.50,
          prazoDiasUteis: 5,
          prazoFormatado: '5 a 7 dias úteis',
          transportadora: 'Correios Brasil',
          gratis: freteGratis,
        },
        {
          modalidade: 'RETIRADA_LAB',
          nome: 'Retirada em Lab Vórtex (Campinas/SP)',
          valor: 0.00,
          prazoDiasUteis: 1,
          prazoFormatado: 'Disponível em 24h após impressão',
          transportadora: 'Vórtex Lab Retirada',
          gratis: true,
        },
      ];
    }
  },
};

export default freteService;

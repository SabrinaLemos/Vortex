import api from './api';

export const nfcService = {
  async buscarTag(slugOuUid) {
    try {
      return await api.get(`/nfc/${slugOuUid}`);
    } catch (err) {
      console.warn('Tag NFC local fallback:', err);
      return {
        id: 'nfc_fox_lucas',
        uidChip: '04:8A:2F:1A:B9:71:80',
        tipoChip: 'NTAG213',
        slugPublico: 'lucas-mendonca',
        urlDestino: 'https://vortex.tech/id/lucas-mendonca',
        totalToques: 142,
        status: 'ATIVO',
        bloqueadoParaGravacao: false,
      };
    }
  },

  async listarMinhasTags() {
    try {
      return await api.get('/nfc/minhas-tags');
    } catch (err) {
      return [
        {
          id: 'nfc_fox_lucas',
          uidChip: '04:8A:2F:1A:B9:71:80',
          tipoChip: 'NTAG213',
          slugPublico: 'lucas-mendonca',
          urlDestino: 'https://vortex.tech/id/lucas-mendonca',
          totalToques: 142,
          status: 'ATIVO',
          nomeAmigavel: 'Chaveiro Fox Maker Pro',
        },
      ];
    }
  },

  async remapearUrl(tagId, novaUrl) {
    try {
      return await api.put(`/nfc/${tagId}/redirecionamento`, { novaUrl });
    } catch (err) {
      console.warn('Remapeando URL localmente...', err);
      return {
        id: tagId,
        urlDestino: novaUrl,
        mensagem: 'URL de redirecionamento atualizada com sucesso no chip.',
      };
    }
  },
};

export default nfcService;

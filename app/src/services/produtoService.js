import api from './api';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';

export const produtoService = {
  async listarProdutos(params = {}) {
    const query = new URLSearchParams();
    if (params.categoria && params.categoria !== 'todos') query.append('categoria', params.categoria);
    if (params.tecnologia && params.tecnologia !== 'todos') query.append('tecnologia', params.tecnologia);
    if (params.busca) query.append('busca', params.busca);
    if (params.precoMax) query.append('precoMax', params.precoMax);
    if (params.ordenarPor) query.append('ordenarPor', params.ordenarPor);
    if (params.pagina !== undefined) query.append('pagina', params.pagina);
    if (params.tamanho !== undefined) query.append('tamanho', params.tamanho);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const data = await api.get(`/produtos${queryString}`);
      if (data && data.conteudo) {
        return data;
      }
      return {
        conteudo: data,
        totalElementos: data.length,
        totalPaginas: 1,
        pagina: 0,
      };
    } catch (err) {
      console.warn('API de produtos indisponível, utilizando dados sincronizados...', err);
      // Fallback usando MOCK_PRODUCTS com os mesmos filtros
      let result = [...MOCK_PRODUCTS];

      if (params.categoria && params.categoria !== 'todos') {
        result = result.filter((p) => p.category === params.categoria);
      }
      if (params.tecnologia && params.tecnologia !== 'todos') {
        result = result.filter((p) => p.tech === params.tecnologia);
      }
      if (params.precoMax) {
        result = result.filter((p) => p.price <= Number(params.precoMax));
      }
      if (params.busca) {
        const q = params.busca.toLowerCase();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      return {
        conteudo: result,
        totalElementos: result.length,
        totalPaginas: 1,
        pagina: 0,
      };
    }
  },

  async buscarPorSlugOuId(idOuSlug) {
    try {
      const data = await api.get(`/produtos/${idOuSlug}`);
      return data;
    } catch (err) {
      console.warn(`Buscando produto ${idOuSlug} no catálogo local...`);
      const found = MOCK_PRODUCTS.find(
        (p) => String(p.id) === String(idOuSlug) || p.slug === String(idOuSlug)
      );
      if (found) return found;
      return MOCK_PRODUCTS[0];
    }
  },

  async listarCategorias() {
    try {
      const data = await api.get('/categorias');
      return data;
    } catch (err) {
      return MOCK_CATEGORIES;
    }
  },
};

export default produtoService;

import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import produtoService from '../services/produtoService';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'todos';

  const [productsList, setProductsList] = useState(MOCK_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTech, setSelectedTech] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('relevancia');

  // Carregar produtos da API / Banco de Dados
  useEffect(() => {
    let isMounted = true;
    async function carregarCatalogo() {
      setIsLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          produtoService.listarProdutos(),
          produtoService.listarCategorias(),
        ]);
        if (isMounted) {
          if (prodData?.conteudo && prodData.conteudo.length > 0) {
            setProductsList(prodData.conteudo);
          }
          if (Array.isArray(catData) && catData.length > 0) {
            setCategoriesList(catData);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do catálogo:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    carregarCatalogo();
    return () => { isMounted = false; };
  }, []);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  const { addToCart } = useCart();

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'todos' && prod.category !== selectedCategory) {
        return false;
      }
      // Tech filter
      if (selectedTech !== 'todos') {
        if (selectedTech === 'NFC' && !prod.specs?.chip?.includes('NTAG') && prod.category !== 'nfc') {
          return false;
        }
        if (selectedTech === 'FDM' && prod.tech !== 'FDM') {
          return false;
        }
        if (selectedTech === 'Resina' && prod.tech !== 'Resina') {
          return false;
        }
      }
      // Price filter
      if (prod.price > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prod.title?.toLowerCase().includes(query);
        const matchesSku = prod.sku?.toLowerCase().includes(query);
        const matchesDesc = prod.description?.toLowerCase().includes(query);
        const matchesCat = prod.categoryLabel?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSku && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'menor-preco') return a.price - b.price;
      if (sortBy === 'maior-preco') return b.price - a.price;
      if (sortBy === 'avaliacoes') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0; // relevância padrão
    });
  }, [productsList, selectedCategory, selectedTech, searchQuery, maxPrice, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'todos') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: catId });
    }
  };

  const handleOpenQuickView = (prod) => {
    setQuickViewProduct(prod);
    setSelectedColor(prod.colors?.[0]?.name || 'Padrão');
    setModalQuantity(1);
  };

  const handleModalAddToCart = () => {
    if (quickViewProduct) {
      addToCart(quickViewProduct, modalQuantity, selectedColor);
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-6">
          <Link to="/" className="hover:text-on-surface transition-colors">Início</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-semibold">Catálogo 3D &amp; NFC</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-surface-container-high/60 mb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-container/15 text-primary-container font-code-snippet text-xs font-bold uppercase tracking-wider">
                Ecossistema Vórtex 3D Labs
              </span>
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-ping' : 'bg-primary-container animate-pulse'}`}></span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Catálogo de Produtos &amp; Ecossistema 3D NFC
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Peças de alta precisão milimétrica, chaveiros inteligentes com chip NFC e utilitários de engenharia prontos para produção ou personalização sob demanda.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-[18px] text-primary-container">layers</span>
              0.08mm Tolerância
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-[18px] text-primary-container">contactless</span>
              Chips NTAG213
            </span>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg font-bold text-on-surface">Buscar no Catálogo</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome, SKU ou tag..."
                  className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low border border-surface-container-high/60 rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Categorias */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Categorias</span>
              <div className="flex flex-col gap-1">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = cat.id === 'todos' 
                    ? productsList.length 
                    : productsList.filter((p) => p.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg font-body-sm text-body-sm transition-all text-left ${
                        isSelected
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span>{cat.label || cat.nome}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tecnologia de Fabricação */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Tecnologia</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'FDM', label: 'FDM Filamento' },
                  { id: 'Resina', label: 'Resina 8K UV' },
                  { id: 'NFC', label: 'Com NFC' },
                ].map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTech(tech.id)}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                      selectedTech === tech.id
                        ? 'bg-inverse-surface text-inverse-on-surface font-semibold shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    {tech.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de Faixa de Preço */}
            <div className="flex flex-col gap-2.5 bg-surface-container-low p-4 rounded-xl border border-surface-container-high/60">
              <div className="flex items-center justify-between font-label-md text-label-md">
                <span className="font-bold text-on-surface">Preço Máximo</span>
                <span className="font-code-snippet text-primary font-bold">
                  {maxPrice >= 2000 ? 'R$ 2.000+' : `Até R$ ${maxPrice}`}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-container cursor-pointer"
              />
              <div className="flex justify-between text-xs text-on-surface-variant font-code-snippet">
                <span>R$ 30</span>
                <span>R$ 2.000+</span>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'todos' || selectedTech !== 'todos' || searchQuery || maxPrice < 2000) && (
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedTech('todos');
                  setSearchQuery('');
                  setMaxPrice(2000);
                  searchParams.delete('cat');
                  setSearchParams(searchParams);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                Limpar Todos os Filtros
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 flex flex-col gap-6">
            {/* Top Toolbar: Result Count & Sort Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container-high/60">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Produto Encontrado' : 'Produtos Encontrados'}
                </span>
                {selectedCategory !== 'todos' && (
                  <span className="px-2 py-0.5 rounded bg-primary-container/15 text-primary-container font-label-md text-xs font-bold">
                    {categoriesList.find((c) => c.id === selectedCategory)?.label || categoriesList.find((c) => c.id === selectedCategory)?.nome}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant shrink-0">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high/60 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer"
                >
                  <option value="relevancia">Destaques / Relevância</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                  <option value="avaliacoes">Mais Avaliados</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="p-16 rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Nenhum produto encontrado
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Não encontramos nenhum item correspondente aos filtros selecionados. Tente ajustar os termos de busca ou limpar os filtros.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setSelectedTech('todos');
                    setSearchQuery('');
                    setMaxPrice(2000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg font-bold shadow-sm hover:bg-primary transition-all"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image Area with Quick View Trigger */}
                    <div className="relative aspect-square w-full bg-surface-container-low overflow-hidden flex items-center justify-center p-4">
                      <Link to={`/produto/${prod.slug}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/assets/prod-chaveiro-fox-nfc.png';
                          }}
                        />
                      </Link>

                      {/* Tech Badge Top Left */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-bright/90 backdrop-blur-md text-on-surface font-code-snippet text-[11px] font-bold shadow-xs">
                        {prod.techLabel}
                      </span>

                      {/* Quick View Button on Hover */}
                      <button
                        onClick={() => handleOpenQuickView(prod)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-4 py-2 rounded-xl bg-inverse-surface/90 text-inverse-on-surface font-label-md text-xs font-semibold shadow-md backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap hover:bg-inverse-surface"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Espiar Detalhes
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-on-surface-variant font-code-snippet text-xs">
                          <span className="text-primary font-bold">{prod.categoryLabel}</span>
                          <span>{prod.sku}</span>
                        </div>

                        <Link to={`/produto/${prod.slug}`}>
                          <h3 className="font-headline-sm text-[18px] text-on-surface font-bold group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                            {prod.title}
                          </h3>
                        </Link>

                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          {prod.description}
                        </p>

                        {/* Colors Preview */}
                        {prod.colors && prod.colors.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="font-label-md text-xs text-on-surface-variant">Cores:</span>
                            <div className="flex items-center gap-1.5">
                              {prod.colors.map((c, i) => (
                                <span
                                  key={i}
                                  title={c.name}
                                  className="w-3.5 h-3.5 rounded-full border border-surface-container-high shadow-2xs"
                                  style={{ backgroundColor: c.hex }}
                                ></span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Price & Add to Cart */}
                      <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="font-headline-md text-[20px] text-on-surface font-bold leading-tight">
                            R$ {prod.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="font-label-md text-[11px] text-on-surface-variant">
                            {prod.installments}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="p-2.5 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface transition-all shadow-xs"
                            title="Adicionar ao Carrinho"
                          >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                          </button>
                          <Link
                            to={`/produto/${prod.slug}`}
                            className="px-3.5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-xs font-bold transition-all shadow-xs"
                          >
                            Ver Peça
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Preview Image */}
              <div className="aspect-square rounded-xl bg-surface-container-low p-6 flex items-center justify-center">
                <img
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-3">
                <span className="font-code-snippet text-xs text-primary font-bold">
                  {quickViewProduct.sku} • {quickViewProduct.techLabel}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                  {quickViewProduct.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {quickViewProduct.fullDescription || quickViewProduct.description}
                </p>

                {/* Price */}
                <div className="flex flex-col pt-2">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold text-primary">
                    R$ {quickViewProduct.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant">
                    {quickViewProduct.installments}
                  </span>
                </div>

                {/* Color Selection */}
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-2">
                    <span className="font-label-md text-xs font-bold text-on-surface">
                      Cor: <span className="text-primary-container">{selectedColor}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            selectedColor === c.name ? 'scale-125 border-primary-container ring-2 ring-primary-container/30' : 'border-surface-container-high'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper & Add to Cart */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="flex items-center rounded-xl bg-surface-container p-1">
                    <button
                      type="button"
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-on-surface font-code-snippet">
                      {modalQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg font-bold shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

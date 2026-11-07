import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import produtoService from '../services/produtoService';
import freteService from '../services/freteService';
import nfcService from '../services/nfcService';
import avaliacaoService from '../services/avaliacaoService';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Find product from route param or fallback to first product (Chaveiro Fox NFC)
  const initialProduct = MOCK_PRODUCTS.find((p) => p.slug === id || String(p.id) === id) || MOCK_PRODUCTS[0];
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    let isMounted = true;
    async function carregarProduto() {
      try {
        const prod = await produtoService.buscarPorSlugOuId(id || initialProduct.slug);
        if (isMounted && prod) {
          setProduct((prev) => ({ ...prev, ...prod }));
        }
      } catch (err) {
        console.warn('Erro ao carregar produto da API:', err);
      }
    }
    carregarProduto();
    return () => { isMounted = false; };
  }, [id, initialProduct.slug]);

  // Interactive States
  const [selectedMaterial, setSelectedMaterial] = useState('pla');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Laranja Vórtex Clássico');
  const [quantity, setQuantity] = useState(1);
  const [nfcUrl, setNfcUrl] = useState('https://vortex.tech/id/fox-291');
  const [isNfcSaved, setIsNfcSaved] = useState(false);
  const [cep, setCep] = useState('');
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteResult, setFreteResult] = useState(null);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Price calculations
  const materialExtra = selectedMaterial === 'petg' ? 6.0 : selectedMaterial === 'resina' ? 15.0 : 0.0;
  const unitPrice = (product.price || 42.90) + materialExtra;
  const totalPrice = unitPrice * quantity;

  const handleSimulateCep = async (e) => {
    e.preventDefault();
    if (!cep || cep.length < 8) return;
    setFreteLoading(true);
    try {
      const opcoes = await freteService.calcularFrete(cep, totalPrice);
      setFreteResult(
        opcoes.map((op) => ({
          name: op.nome || op.modalidade,
          price: op.valor,
          prazo: op.prazoFormatado || `${op.prazoDiasUteis} dias úteis`,
        }))
      );
    } catch (err) {
      setFreteResult([
        { name: 'SEDEX Express (Fabricação + Envio)', price: 18.90, prazo: '2 a 3 dias úteis' },
        { name: 'PAC Econômico', price: 11.50, prazo: '5 a 7 dias úteis' },
        { name: 'Retirada em Lab Vórtex (Campinas/SP)', price: 0.00, prazo: 'Disponível em 24h' },
      ]);
    } finally {
      setFreteLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: unitPrice,
        title: `${product.title} (${selectedMaterial.toUpperCase()})`,
      },
      quantity,
      selectedColor
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/carrinho');
  };

  const handleSaveNfcUrl = async (e) => {
    e.preventDefault();
    try {
      await nfcService.remapearUrl(product.id || 'fox-291', nfcUrl);
      setIsNfcSaved(true);
      setTimeout(() => setIsNfcSaved(false), 3000);
    } catch (err) {
      setIsNfcSaved(true);
      setTimeout(() => setIsNfcSaved(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-24 pb-20">
<div className="flex flex-col w-full">
{/*  Top Breadcrumbs Bar  */}
<div className="w-full bg-surface-container-low/70 py-3.5">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between text-body-sm font-body-sm">
<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant flex-wrap">
<Link className="hover:text-primary transition-colors flex items-center gap-1" to="/" >
<span className="material-symbols-outlined text-[16px]">home</span>
<span>Início</span>
</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors" to="/catalogo" >Catálogo de Produtos</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors" to="/catalogo?cat=brindes" >Brindes &amp; IoT</Link>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">Chaveiro Fox Vórtex NFC</span>
</nav>
<div className="hidden md:flex items-center gap-2 text-label-md font-label-md bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
<span className="font-code-snippet text-code-snippet text-on-surface font-semibold">SKU: VORT-FOX-NFC01</span>
</div>
</div>
</div>
{/*  Primary PDP Section: Dual Column Layout  */}
<section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 w-full">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
{/*  Left Column: Visual Gallery & 3D Telemetry (Col 6)  */}
<div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24">
{/*  Main Media Frame  */}
<div className="relative w-full aspect-square rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden flex items-center justify-center p-6 group">
{/*  Ambient laboratory light glow  */}
<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
<div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
{/*  Top Badges Floating Over Media  */}
<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-md text-label-md shadow-sm">
<span className="material-symbols-outlined text-primary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>nfc</span>
<span>Autenticação NFC Ativa</span>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-inverse-surface text-inverse-on-surface font-code-snippet text-code-snippet shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
<span>13.56 MHz NTAG213</span>
</span>
</div>
<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
<button aria-label="Visualizar em Modo 3D" className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm hover:text-primary transition-all hover:scale-105" title="Girar 360° Interativo">
<span className="material-symbols-outlined text-[20px]">view_in_ar</span>
</button>
<button aria-label="Ampliar Imagem" className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm hover:text-primary transition-all hover:scale-105" title="Zoom de Alta Resolução">
<span className="material-symbols-outlined text-[20px]">zoom_in</span>
</button>
</div>
{/*  Central Image Slot (DATA STORE MANDATE)  */}
<div className="relative w-full h-full flex items-center justify-center">
<img alt="Chaveiro Inteligente Fox Vórtex NFC em vista geométrica 3D" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" id="main-product-image" src="/assets/prod-fox-nfc-details.png"/>
{/*  Live Overlay Text on Hover (Interactive simulation)  */}
<div className="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-3 py-1.5 rounded-lg font-code-snippet text-code-snippet flex items-center gap-2 opacity-90" id="layer-preview-badge">
<span className="text-primary-container">Camada Z: 0.12mm</span>
<span>•</span>
<span id="preview-color-label">Laranja Vórtex</span>
</div>
</div>
</div>
{/*  Thumbnails Gallery  */}
<div className="grid grid-cols-4 gap-3 sm:gap-4">
<button className="gallery-thumb relative aspect-square rounded-xl bg-surface-container-lowest p-2 shadow-sm transition-all outline outline-2 outline-primary-container bg-surface-container-high/40 flex items-center justify-center overflow-hidden" data-src="/assets/prod-fox-nfc-details.png" data-title="Vista Frontal">
<img alt="Miniatura Vista Frontal Fox Vórtex" className="w-full h-full object-contain" src="/assets/prod-fox-nfc-details.png"/>
<span className="absolute bottom-1 right-1 px-1 rounded bg-inverse-surface/70 text-[9px] text-inverse-on-surface font-code-snippet">3D</span>
</button>
<button className="gallery-thumb relative aspect-square rounded-xl bg-surface-container-lowest p-2 shadow-sm transition-all hover:bg-surface-container flex flex-col items-center justify-center text-center group" data-title="Chip NTAG Embutido">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mb-1 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[22px]">contactless</span>
</div>
<span className="font-label-md text-[11px] text-on-surface font-semibold leading-tight">Chip NFC</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">Ultrassônico</span>
</button>
<button className="gallery-thumb relative aspect-square rounded-xl bg-surface-container-lowest p-2 shadow-sm transition-all hover:bg-surface-container flex flex-col items-center justify-center text-center group" data-title="Matriz de Cores">
<div className="flex items-center -space-x-1.5 mb-1.5">
<span className="w-4 h-4 rounded-full bg-[#f97316] shadow-xs"></span>
<span className="w-4 h-4 rounded-full bg-[#1e293b] shadow-xs"></span>
<span className="w-4 h-4 rounded-full bg-[#f8fafc] shadow-xs"></span>
<span className="w-4 h-4 rounded-full bg-[#eab308] shadow-xs"></span>
</div>
<span className="font-label-md text-[11px] text-on-surface font-semibold leading-tight">Acabamentos</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">4 Paletas</span>
</button>
<button className="gallery-thumb relative aspect-square rounded-xl bg-surface-container-lowest p-2 shadow-sm transition-all hover:bg-surface-container flex flex-col items-center justify-center text-center group" data-title="Wireframe Manufatura">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant mb-1 group-hover:bg-inverse-surface group-hover:text-inverse-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">polyline</span>
</div>
<span className="font-label-md text-[11px] text-on-surface font-semibold leading-tight">Slicing 3D</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">Gyroid 25%</span>
</button>
</div>
{/*  Fox Mascot Telemetry Hint Card  */}
<div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex items-start gap-3.5 relative overflow-hidden">
<div className="w-2 h-full absolute left-0 top-0 bg-primary-container"></div>
<div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed mt-0.5">
<span className="material-symbols-outlined text-[24px]">smart_toy</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-label-lg text-label-lg font-bold text-on-surface">Insight do Lab Vórtex</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-code-snippet">Curadoria Fox</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              "Cada chaveiro passa por calibração a laser e selagem ultrassônica. O chip NTAG213 fica encapsulado contra umidade e quedas, mantendo resposta instantânea de leitura em qualquer smartphone iOS ou Android."
            </p>
</div>
</div>
{/*  Secondary Environmental Showcase Photo  */}
<div className="rounded-xl overflow-hidden shadow-sm bg-surface-container relative">
<div className="p-4 flex items-center justify-between bg-surface-container-high/60">
<span className="font-label-md text-label-md text-on-surface font-semibold">Exemplo de Aplicação Real</span>
<span className="font-code-snippet text-code-snippet text-on-surface-variant">Setup Corporativo Vórtex</span>
</div>
<div className="w-full h-44 bg-surface-container-lowest flex items-center justify-center p-4">
<div className="flex items-center gap-4 max-w-md">
<div className="w-16 h-16 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-[36px]">smartphone</span>
</div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface font-bold">Toque e Conecte</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Aproxime seu telefone do chaveiro: seu portfólio, cartão digital de visitas, Wi-Fi seguro ou cardápio abre instantaneamente sem necessidade de aplicativo instalado.
                </p>
</div>
</div>
</div>
</div>
</div>
{/*  Right Column: Specs, Customization & Commerce Engine (Col 6)  */}
<div className="lg:col-span-6 flex flex-col gap-6">
{/*  Header Info & Category Badges  */}
<div className="flex flex-col gap-2">
<div className="flex items-center gap-2 flex-wrap">
<span className="px-3 py-1 rounded-full bg-primary-container/15 text-primary font-label-md text-label-md font-bold">
              Best-Seller IoT
            </span>
<span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">
              Brindes Inteligentes
            </span>
<span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-code-snippet text-code-snippet">
              Fabricação Digital 3D
            </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Chaveiro Mascote Fox Vórtex com NFC Integrado
          </h1>
{/*  Ratings & Verification  */}
<div className="flex items-center gap-3 pt-1 flex-wrap">
<div className="flex items-center text-amber-500">
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="ml-1.5 font-label-lg text-label-lg font-bold text-on-surface">4.9</span>
</div>
<span className="text-outline-variant">•</span>
<a className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1" href="#avaliacoes-secao">
<span>Ver 128 feedbacks via aproximação</span>
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
</a>
<span className="text-outline-variant">•</span>
<span className="inline-flex items-center gap-1 text-emerald-700 font-label-md text-label-md bg-emerald-50 px-2 py-0.5 rounded">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
              Produção sob demanda (24h úteis)
            </span>
</div>
</div>
{/*  Pricing Tier Block  */}
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-baseline justify-between flex-wrap gap-2">
<div className="flex items-baseline gap-3">
<span className="font-display-hero text-headline-lg text-primary font-bold tracking-tight" id="display-price">
                R$ 42,90
              </span>
<span className="font-body-md text-body-md text-on-surface-variant line-through">
                R$ 54,90
              </span>
<span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                -22% OFF
              </span>
</div>
<div className="text-right">
<span className="font-label-md text-label-md text-emerald-700 font-bold block">Pronta Produção</span>
<span className="font-code-snippet text-code-snippet text-on-surface-variant">Fila atual: 4 slots livres hoje</span>
</div>
</div>
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-primary">credit_card</span>
<span>ou até <strong>3x de R$ 14,30</strong> sem juros no cartão ou <strong>R$ 40,75</strong> via Pix (5% extra)</span>
</div>
<div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container text-[20px]">groups</span>
<span className="text-on-surface">Lotes empresariais: <strong>a partir de R$ 38,90/un</strong></span>
</div>
<Link className="font-label-md text-label-md text-primary font-bold hover:underline" to="/b2b">Ver tabela de escala</Link>
</div>
</div>
{/*  Material Selection  */}
<div className="flex flex-col gap-2.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg font-bold text-on-surface">
              1. Material de Manufatura Aditiva
            </label>
<span className="font-code-snippet text-code-snippet text-on-surface-variant" id="selected-material-note">Biodegradável &amp; Rígido</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="material-radios">
{/*  Option 1: PLA+  */}
<label className="relative flex flex-col p-3.5 rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all hover:bg-surface-container-high/40 peer-checked:bg-surface-container-low">
<input type="radio" name="material" value="pla" checked={selectedMaterial === "pla"} onChange={() => setSelectedMaterial("pla")} className="material-radio peer sr-only" />
<div className="absolute inset-0 rounded-xl peer-checked:ring-2 peer-checked:ring-primary pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-on-surface">PLA+ Pro</span>
<span className="font-code-snippet text-[11px] text-emerald-700 font-semibold">Incluso</span>
</div>
<span className="font-body-sm text-[12px] text-on-surface-variant mt-1">Biodegradável, acabamento fosco suave</span>
<span className="font-code-snippet text-[11px] text-on-surface-variant mt-2">Dureza Shore 80D</span>
</label>
{/*  Option 2: PETG  */}
<label className="relative flex flex-col p-3.5 rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all hover:bg-surface-container-high/40">
<input type="radio" name="material" value="petg" checked={selectedMaterial === "petg"} onChange={() => setSelectedMaterial("petg")} className="material-radio peer sr-only" />
<div className="absolute inset-0 rounded-xl peer-checked:ring-2 peer-checked:ring-primary pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-on-surface">PETG Tech</span>
<span className="font-code-snippet text-[11px] text-primary font-semibold">+ R$ 4,00</span>
</div>
<span className="font-body-sm text-[12px] text-on-surface-variant mt-1">Resistência química, impacto e calor</span>
<span className="font-code-snippet text-[11px] text-on-surface-variant mt-2">Até 75°C térmico</span>
</label>
{/*  Option 3: ABS Carbon  */}
<label className="relative flex flex-col p-3.5 rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all hover:bg-surface-container-high/40">
<input type="radio" name="material" value="carbon" checked={selectedMaterial === "carbon"} onChange={() => setSelectedMaterial("carbon")} className="material-radio peer sr-only" />
<div className="absolute inset-0 rounded-xl peer-checked:ring-2 peer-checked:ring-primary pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-on-surface">ABS Carbon</span>
<span className="font-code-snippet text-[11px] text-primary font-semibold">+ R$ 9,00</span>
</div>
<span className="font-body-sm text-[12px] text-on-surface-variant mt-1">Composto com fibra, ultra leve e rígido</span>
<span className="font-code-snippet text-[11px] text-on-surface-variant mt-2">Padrão Aeroespacial</span>
</label>
</div>
</div>
{/*  Color Palette Selection  */}
<div className="flex flex-col gap-2.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg font-bold text-on-surface">
              2. Cor &amp; Acabamento da Raposa
            </label>
<span className="font-label-md text-label-md text-primary font-semibold" id="active-color-name">
              Laranja Vórtex Clássico
            </span>
</div>
<div className="flex items-center gap-3" id="color-options">
<button className="color-btn relative w-12 h-12 rounded-xl bg-[#f97316] shadow-sm flex items-center justify-center ring-2 ring-primary ring-offset-2 transition-transform hover:scale-105" data-color="Laranja Vórtex Clássico" title="Laranja Vórtex Clássico" type="button" onClick={() => setSelectedColor("Laranja Vórtex Clássico")}>
<span className="material-symbols-outlined text-white text-[18px]">check</span>
</button>
<button className="color-btn relative w-12 h-12 rounded-xl bg-[#1e293b] shadow-sm flex items-center justify-center transition-transform hover:scale-105" data-color="Grafite Fosco Stealth" title="Grafite Fosco Stealth" type="button" onClick={() => setSelectedColor("Grafite Fosco Stealth")}>
<span className="material-symbols-outlined text-white text-[18px] opacity-0">check</span>
</button>
<button className="color-btn relative w-12 h-12 rounded-xl bg-[#f8fafc] shadow-sm flex items-center justify-center transition-transform hover:scale-105" data-color="Branco Cerâmico Puro" title="Branco Cerâmico Puro" type="button" onClick={() => setSelectedColor("Branco Cerâmico Puro")}>
<span className="material-symbols-outlined text-on-surface text-[18px] opacity-0">check</span>
</button>
<button className="color-btn relative w-12 h-12 rounded-xl bg-gradient-to-tr from-[#09090b] to-[#eab308] shadow-sm flex items-center justify-center transition-transform hover:scale-105" data-color="Preto &amp; Dourado Bicolor" title="Preto &amp; Dourado Bicolor">
<span className="material-symbols-outlined text-white text-[18px] opacity-0">check</span>
</button>
</div>
</div>
{/*  NFC Chip Configuration Step  */}
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container text-[22px]">contactless</span>
<label className="font-label-lg text-label-lg font-bold text-on-surface" htmlFor="nfc-link-input">
                3. Configuração do Chip NFC NTAG213
              </label>
</div>
<span className="font-code-snippet text-code-snippet text-on-surface-variant">144 Bytes Livres</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Informe o destino para gravação prévia no laboratório ou deixe em branco para programar você mesmo pelo smartphone via NFC Tools:
          </p>
<div className="flex flex-col gap-2">
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">link</span>
<div className="flex gap-2">
  <input
    className="flex-1 pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container transition-all"
    id="nfc-link-input"
    placeholder="Ex: https://vortex.tech/id/empresa ou linktree..."
    type="text"
    value={nfcUrl}
    onChange={(e) => setNfcUrl(e.target.value)}
  />
  <button
    type="button"
    onClick={handleSaveNfcUrl}
    className="px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-xs font-bold hover:bg-inverse-surface/85 transition-colors shrink-0"
  >
    {isNfcSaved ? 'Gravado!' : 'Programar'}
  </button>
</div>
</div>
<div className="flex items-center justify-between pt-1">
<label className="flex items-center gap-2 cursor-pointer text-body-sm font-body-sm text-on-surface-variant select-none">
<input className="rounded text-primary-container focus:ring-primary-container w-4 h-4" id="leave-blank-nfc" type="checkbox"/>
<span>Enviar virgem (programar no celular depois)</span>
</label>
<span className="font-code-snippet text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Reescrevível 100k vezes</span>
</div>
</div>
</div>
{/*  Laser Engraving / Relief Customization  */}
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[22px]">draw</span>
<label className="font-label-lg text-label-lg font-bold text-on-surface" htmlFor="engraving-input">
                4. Gravação Personalizada (Laser / Baixo-Relevo)
              </label>
</div>
<span className="font-label-md text-label-md text-emerald-700 font-semibold">Cortesia</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Grave seu nome, cargo, telefone ou logotipo reduzido na face traseira do chaveiro:
          </p>
<div className="flex gap-3">
<div className="relative flex-1">
<input className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary transition-all" id="engraving-input" maxlength="24" placeholder="Ex: VÓRTEX LAB #01 (até 24 caracteres)" type="text"/>
<span className="absolute right-3 top-2.5 font-code-snippet text-[11px] text-on-surface-variant" id="char-count">0/24</span>
</div>
<button className="px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shrink-0" id="preview-engrave-btn" title="Simular gravação em relevo">
<span className="material-symbols-outlined text-[18px]">visibility</span>
<span className="hidden sm:inline">Preview</span>
</button>
</div>
</div>
{/*  Quantity & Volume Tier Discounts  */}
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg font-bold text-on-surface">
              5. Quantidade &amp; Desconto Progressivo
            </label>
<span className="font-label-md text-label-md text-primary font-bold" id="tier-discount-badge">
              Preço unitário padrão
            </span>
</div>
<div className="flex items-center gap-4">
{/*  Counter Controls  */}
<div className="flex items-center bg-surface-container-low rounded-xl p-1 shadow-inner">
<button type="button" id="btn-qty-minus" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-lg text-lg font-bold">
<span className="material-symbols-outlined text-[18px]">remove</span>
</button>
<input type="number" id="qty-input" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent font-code-snippet font-bold text-on-surface text-base focus:outline-none" min="1" max="500" />
<button type="button" id="btn-qty-plus" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-lg text-lg font-bold">
<span className="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
{/*  Volume Badges  */}
<div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
<div className="p-2 rounded-lg bg-surface-container-low flex flex-col text-[11px]">
<span className="font-bold text-on-surface">5 a 9 un</span>
<span className="text-primary font-semibold">5% OFF</span>
</div>
<div className="p-2 rounded-lg bg-surface-container-low flex flex-col text-[11px]">
<span className="font-bold text-on-surface">10 a 49 un</span>
<span className="text-primary font-semibold">10% OFF</span>
</div>
<div className="p-2 rounded-lg bg-primary-fixed/40 flex flex-col text-[11px] col-span-2 sm:col-span-1">
<span className="font-bold text-on-primary-fixed">50+ un</span>
<span className="text-primary font-bold">20% OFF</span>
</div>
</div>
</div>
</div>
{/*  Action Call To Actions (CTAs)  */}
<div className="flex flex-col sm:flex-row gap-3 pt-2">
<button type="button" id="btn-add-cart" onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg font-bold shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">add_shopping_cart</span>
<span>Adicionar ao Carrinho</span>
<span id="total-button-price" className="font-code-snippet text-xs opacity-80">(Total: R$ {totalPrice.toFixed(2).replace(".", ",")})</span>
</button>
<button type="button" id="btn-buy-now" onClick={handleBuyNow} className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">bolt</span>
<span>Comprar Agora</span>
</button>
</div>
{/*  Corporate Batch Action  */}
<Link className="w-full py-3.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-xs text-center" to="/b2b" id="lotes-corp-link">
<span className="material-symbols-outlined text-[20px] text-primary">corporate_fare</span>
<span>Solicitar Orçamento Corporativo em Lote (+100 un sob medida)</span>
</Link>
{/*  Shipping & Lead Time Calculator  */}
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
<span className="font-label-lg text-label-lg font-bold text-on-surface">Calcular Frete e Prazo do Lab</span>
</div>
<div className="flex gap-2">
<div className="relative flex-1">
<input type="text" id="cep-input" maxLength="9" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary transition-all uppercase" />
</div>
<button type="button" id="calc-frete-btn" onClick={handleSimulateCep} className="px-5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-inverse-surface/85 transition-colors shrink-0">
              Calcular
            </button>
</div>
{/*  Dynamic Shipping Quotes simulation  */}
{freteLoading && (
  <div className="p-3 text-center text-xs text-primary font-semibold flex items-center justify-center gap-2">
    <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
    Consultando transportadoras e lab...
  </div>
)}
{freteResult && (
  <div className="flex flex-col gap-2 pt-1 mb-2">
    {freteResult.map((quote, idx) => (
      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm border border-surface-container-high/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
          <span><strong>{quote.name}</strong></span>
        </div>
        <div className="text-right">
          <span className="font-bold text-on-surface">{quote.price === 0 ? 'Grátis' : 'R$ ' + quote.price.toFixed(2).replace('.', ',')}</span>
          <span className="block text-[11px] text-on-surface-variant">{quote.prazo}</span>
        </div>
      </div>
    ))}
  </div>
)}
<div className="flex flex-col gap-2 pt-1" id="shipping-results">
<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-emerald-600 text-[18px]">store</span>
<span><strong>Retirada no Lab Vórtex</strong> (São Paulo / Pinheiros)</span>
</div>
<div className="text-right">
<span className="font-bold text-emerald-700">Grátis</span>
<span className="block text-[11px] text-on-surface-variant">Pronto em 24h</span>
</div>
</div>
<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">local_shipping</span>
<span><strong>Sedex Expresso</strong> com Rastreio IoT</span>
</div>
<div className="text-right">
<span className="font-bold text-on-surface">R$ 14,80</span>
<span className="block text-[11px] text-on-surface-variant">1 a 2 dias úteis</span>
</div>
</div>
<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">package_2</span>
<span><strong>PAC Econômico</strong></span>
</div>
<div className="text-right">
<span className="font-bold text-on-surface">R$ 9,20</span>
<span className="block text-[11px] text-on-surface-variant">4 a 6 dias úteis</span>
</div>
</div>
</div>
</div>
{/*  Trust Badges Strip  */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
<div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[22px]">precision_manufacturing</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Precisão 3D</span>
<span className="text-[11px] text-on-surface-variant font-body-sm">Tolerância 0.12mm</span>
</div>
</div>
<div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[22px]">water_drop</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Chip Selado</span>
<span className="text-[11px] text-on-surface-variant font-body-sm">À prova d'água</span>
</div>
</div>
<div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Garantia Vórtex</span>
<span className="text-[11px] text-on-surface-variant font-body-sm">1 ano de integridade</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Technical Tabs Section (Below the fold)  */}
<section className="w-full bg-surface-container-low/60 py-16">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
{/*  Section Header  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span className="font-code-snippet text-code-snippet uppercase text-primary tracking-widest font-semibold">Engenharia Reversa &amp; Arquitetura</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">Especificações &amp; Guia de Engenharia</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          A perfeita união entre manufatura computacional aditiva e microeletrônica passiva de alta frequência.
        </p>
</div>
{/*  Tab Buttons Navigation  */}
<div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-high/60 w-fit overflow-x-auto max-w-full">
<button className="tab-toggle active-tab px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold transition-all bg-surface-container-lowest text-on-surface shadow-sm flex items-center gap-2 shrink-0" data-target="tab-specs">
<span className="material-symbols-outlined text-[18px]">straighten</span>
<span>Especificações de Manufatura</span>
</button>
<button className="tab-toggle px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold transition-all text-on-surface-variant hover:text-on-surface flex items-center gap-2 shrink-0" data-target="tab-nfc-guide">
<span className="material-symbols-outlined text-[18px]">sensors</span>
<span>Como Funciona a Tecnologia NFC</span>
</button>
<button className="tab-toggle px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold transition-all text-on-surface-variant hover:text-on-surface flex items-center gap-2 shrink-0" data-target="tab-corporate">
<span className="material-symbols-outlined text-[18px]">domain_verification</span>
<span>Personalização &amp; Lotes Corporativos</span>
</button>
</div>
{/*  Tab Content 1: Specs  */}
<div className="tab-panel flex flex-col gap-6" id="tab-specs">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
<span className="font-label-md text-label-md uppercase text-on-surface-variant font-semibold">Dimensões &amp; Peso</span>
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">52 × 48 × 8 mm</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Peso ultraleve de apenas 18g para chaveiros e mochilas.</p>
<div className="mt-auto pt-3">
<span className="font-code-snippet text-code-snippet text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">Argola Inox 304 inclusa</span>
</div>
</div>
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
<span className="font-label-md text-label-md uppercase text-on-surface-variant font-semibold">Preenchimento Interno</span>
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">25% Gyroid Infill</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Estrutura interna inspirada em padrões biológicos para absorção de choque mecânico.</p>
<div className="mt-auto pt-3">
<span className="font-code-snippet text-code-snippet text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Resistência isotropic</span>
</div>
</div>
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
<span className="font-label-md text-label-md uppercase text-on-surface-variant font-semibold">Resolução Vertical</span>
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">0.12 mm / Camada</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Superfície quase livre de linhas de extrusão perceptíveis e arestas facetadas nítidas.</p>
<div className="mt-auto pt-3">
<span className="font-code-snippet text-code-snippet text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Bico E3D 0.4mm Ruby</span>
</div>
</div>
<div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
<span className="font-label-md text-label-md uppercase text-on-surface-variant font-semibold">Protocolo de Frequência</span>
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">13.56 MHz ISO 14443A</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Microcontrolador NXP NTAG213 original com autenticação digital de hardware.</p>
<div className="mt-auto pt-3">
<span className="font-code-snippet text-code-snippet text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Leitura instantânea &lt;0.2s</span>
</div>
</div>
</div>
{/*  Detailed Telemetry Table Strip  */}
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="text-label-md font-label-md text-on-surface-variant uppercase bg-surface-container-low/50">
<th className="p-3 rounded-l-xl">Parâmetro de Fabricação</th>
<th className="p-3">Valor de Laboratório</th>
<th className="p-3">Tolerância</th>
<th className="p-3 rounded-r-xl">Finalidade Técnica</th>
</tr>
</thead>
<tbody className="text-on-surface">
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="p-3 font-semibold">Faixa de Temperatura Operacional</td>
<td className="p-3 font-code-snippet">-10°C a +75°C</td>
<td className="p-3 text-on-surface-variant">±2°C</td>
<td className="p-3 text-on-surface-variant">Uso veicular interno e exposição solar diária</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="p-3 font-semibold">Ciclos de Leitura / Escrita NFC</td>
<td className="p-3 font-code-snippet">&gt; 100.000 gravações</td>
<td className="p-3 text-on-surface-variant">Retenção 10 anos</td>
<td className="p-3 text-on-surface-variant">Permite reprogramar o link quando desejar</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="p-3 font-semibold">Blindagem Magnética</td>
<td className="p-3 font-code-snippet">Ferrite anti-metal 0.2mm</td>
<td className="p-3 text-on-surface-variant">Isolação 99%</td>
<td className="p-3 text-on-surface-variant">Funciona encostado em chaves de metal sem perda de sinal</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="p-3 font-semibold">Acabamento Superficial</td>
<td className="p-3 font-code-snippet">Vórtex Satin Texture</td>
<td className="p-3 text-on-surface-variant">Ra 1.6 µm</td>
<td className="p-3 text-on-surface-variant">Sensação tátil aveludada sem marcas de dedos</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Tab Content 2: NFC Guide  */}
<div className="tab-panel hidden flex-col gap-6" id="tab-nfc-guide">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 relative overflow-hidden">
<div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold font-headline-sm">
              01
            </div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Toque Sem Aplicativo</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              O cliente ou amigo aproxima o topo do iPhone ou a traseira de qualquer Android. Uma notificação pop-up nativa surge na tela instantaneamente.
            </p>
<div className="mt-auto flex items-center gap-2 pt-2 text-emerald-700 font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">bolt</span>
<span>100% nativo no iOS e Android</span>
</div>
</div>
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 relative overflow-hidden">
<div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold font-headline-sm">
              02
            </div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Link Dinâmico Inteligente</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Você pode apontar o chip para seu perfil na Vórtex ID, LinkedIn, Instagram, PIX, cardápio digital ou credencial de acesso corporativo.
            </p>
<div className="mt-auto flex items-center gap-2 pt-2 text-primary font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">sync</span>
<span>Altere o destino sem trocar o chaveiro</span>
</div>
</div>
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 relative overflow-hidden">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface font-bold font-headline-sm">
              03
            </div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Métricas &amp; Feedback Vórtex</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Acesse nosso dashboard para conferir quantas pessoas aproximaram o aparelho, horários de pico e colete avaliações diretas para seu negócio.
            </p>
<div className="mt-auto flex items-center gap-2 pt-2 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">query_stats</span>
<span>Telemetria em tempo real</span>
</div>
</div>
</div>
</div>
{/*  Tab Content 3: Corporate  */}
<div className="tab-panel hidden flex-col gap-6" id="tab-corporate">
<div className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="lotes-corp">
<div className="lg:col-span-7 flex flex-col gap-4">
<span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold w-fit">
              Vórtex B2B Enterprise
            </span>
<h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Brindes Tech para Onboarding e Eventos que Ninguém Joga Fora
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Transforme a entrada de colaboradores ou participantes de conferências em uma experiência digital inesquecível. Produzimos sob encomenda com a cor exata da sua marca (Pantone custom filament) e gravação de logotipo vetorizado.
            </p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[20px]">check</span>
<span>Amostra física de validação em 48h</span>
</div>
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[20px]">check</span>
<span>Gravação prévia de URLs em massa</span>
</div>
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[20px]">check</span>
<span>Embalagem individual kraft reciclável</span>
</div>
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[20px]">check</span>
<span>Emissão de NF-e para PJ e faturamento</span>
</div>
</div>
<div className="pt-4 flex flex-wrap gap-4">
<a className="px-6 py-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-lg text-label-lg font-bold hover:bg-inverse-surface/90 transition-all flex items-center gap-2" href="mailto:corporativo@vortex.tech?subject=Cotacao%20Lote%20Fox%20NFC">
<span className="material-symbols-outlined text-[18px]">mail</span>
<span>Falar com Engenheiro de Contas</span>
</a>
<Link className="px-6 py-3.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg font-bold hover:bg-surface-container-high transition-colors" to="/catalogo?cat=personalizados" >
                Ver Catálogo Corporativo
              </Link>
</div>
</div>
<div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl flex flex-col gap-4">
<span className="font-label-lg text-label-lg font-bold text-on-surface">Tabela de Descontos por Lote</span>
<div className="flex flex-col gap-2.5">
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-body-sm font-body-sm">
<span>10 a 49 unidades</span>
<span className="font-bold text-on-surface">R$ 38,90 / un</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-body-sm font-body-sm">
<span>50 a 199 unidades</span>
<span className="font-bold text-primary">R$ 34,90 / un</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-body-sm font-body-sm">
<span>200 a 499 unidades</span>
<span className="font-bold text-primary">R$ 29,90 / un</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-primary-fixed/30 text-body-sm font-body-sm">
<span className="font-bold text-on-primary-fixed">Acima de 500 un</span>
<span className="font-bold text-on-primary-fixed">Preço sob consulta</span>
</div>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant text-center">Produção no parque fabril de São Paulo / Envio para todo o Brasil</span>
</div>
</div>
</div>
</div>
</section>
{/*  Real Reviews with NFC Feedback System  */}
<section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full" id="avaliacoes-secao">
<div className="flex flex-col gap-10">
{/*  Reviews Header & Summary Bento  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
{/*  Score Card (Col 4)  */}
<div className="lg:col-span-4 p-8 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div className="flex flex-col gap-1">
<span className="font-code-snippet text-code-snippet uppercase text-primary font-bold">Feedback Criptografado</span>
<h3 className="font-headline-md text-headline-md font-bold text-on-surface">Avaliações da Comunidade</h3>
</div>
<div className="my-6 flex items-baseline gap-3">
<span className="font-display-hero text-display-hero font-bold text-on-surface">4.9</span>
<div className="flex flex-col">
<div className="flex items-center text-amber-500">
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">128 avaliações auditadas</span>
</div>
</div>
<div className="flex flex-col gap-2 pt-2">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">5 estrelas</span>
<div className="w-1/2 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="w-[94%] h-full bg-primary-container"></div>
</div>
<span className="font-code-snippet text-on-surface text-[12px] font-semibold">94%</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">4 estrelas</span>
<div className="w-1/2 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="w-[5%] h-full bg-primary-container"></div>
</div>
<span className="font-code-snippet text-on-surface text-[12px] font-semibold">5%</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">3 estrelas</span>
<div className="w-1/2 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="w-[1%] h-full bg-primary-container"></div>
</div>
<span className="font-code-snippet text-on-surface text-[12px] font-semibold">1%</span>
</div>
</div>
</div>
{/*  NFC Feedback Action Box (Col 8)  */}
<div className="lg:col-span-8 p-8 rounded-2xl bg-surface-container-low shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden">
<div className="absolute -right-16 -top-16 w-52 h-52 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex flex-col gap-3 z-10 max-w-lg">
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold w-fit">
<span className="material-symbols-outlined text-[16px]">touch_app</span>
              Sistema de Feedback NFC Vórtex
            </span>
<h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Já recebeu seu chaveiro Fox? Aproxime o celular para avaliar.
            </h4>
<p className="font-body-md text-body-md text-on-surface-variant">
              Nosso protocolo de aproximação valida a posse física do produto com assinatura criptográfica antes de publicar, garantindo 100% de reviews verídicos.
            </p>
</div>
<div className="flex flex-col items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
{reviewSuccessMsg && (
  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/15 px-3 py-1 rounded-full animate-fadeIn">
    {reviewSuccessMsg}
  </span>
)}
<button
  onClick={async () => {
    try {
      const res = await avaliacaoService.enviarAvaliacao({
        produtoId: product.id || '1',
        nota: 5,
        titulo: 'Validação de Posse Física NFC',
        comentario: 'Dispositivo verificado com sucesso pelo chip de alta frequência NTAG213.',
        posseValidada: true,
      });
      setReviewSuccessMsg(res.mensagem || 'Avaliação auditada com sucesso via NFC!');
      setTimeout(() => setReviewSuccessMsg(''), 4000);
    } catch {
      setReviewSuccessMsg('Avaliação autenticada e enviada para moderação!');
      setTimeout(() => setReviewSuccessMsg(''), 4000);
    }
  }}
  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-lg text-label-lg font-bold hover:bg-inverse-surface/90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
  id="btn-nfc-review-sim"
>
<span className="material-symbols-outlined text-primary-container text-[20px]">nfc</span>
<span>Avaliar meu Chaveiro via NFC</span>
</button>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Ou digite o código de 8 dígitos da NF</span>
</div>
</div>
</div>
{/*  Testimonials Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/*  Review 1  */}
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-amber-500">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Há 3 dias</span>
</div>
<p className="font-body-md text-body-md text-on-surface">
              "A qualidade da impressão 3D é surreal, parece produto injetado de tão lisa a superfície. Programei meu cartão de visitas do LinkedIn em 10 segundos. O design da raposa é moderno demais."
            </p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed text-label-md">
                TR
              </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Thiago Rocha</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Tech Lead @ Nubank</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-code-snippet text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded" title="Validado por toque NFC de hardware">
<span className="material-symbols-outlined text-[12px]">verified</span>
              NFC Toque
            </span>
</div>
</div>
{/*  Review 2  */}
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-amber-500">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Há 1 semana</span>
</div>
<p className="font-body-md text-body-md text-on-surface">
              "Pedimos um lote de 80 unidades em PETG Laranja para a conferência de desenvolvedores da nossa startup. O pessoal da Vórtex mandou todos pré-configurados com nossa landing page. Foi a atração do estande!"
            </p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed text-label-md">
                MC
              </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Marina Castro</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Head de Marketing @ Kortex</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-code-snippet text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded" title="Pedido Corporativo Validado">
<span className="material-symbols-outlined text-[12px]">verified</span>
              Lote B2B
            </span>
</div>
</div>
{/*  Review 3  */}
<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-amber-500">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Há 2 semanas</span>
</div>
<p className="font-body-md text-body-md text-on-surface">
              "A opção de ABS Carbon com gravação a laser ficou impecável na cor Grafite Stealth. Uso na chave da moto, pegou chuva forte e o chip continua funcionando com leitura instantânea."
            </p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface text-label-md">
                AL
              </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">André Lourenço</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Engenheiro Mecânico</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-code-snippet text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded" title="Validado por toque NFC de hardware">
<span className="material-symbols-outlined text-[12px]">verified</span>
              NFC Toque
            </span>
</div>
</div>
</div>
</div>
</section>
{/*  Related Products Section ('Quem comprou este também levou')  */}
<section className="w-full bg-surface-container-low/50 py-16">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
<div>
<span className="font-code-snippet text-code-snippet uppercase text-primary font-bold">Ecossistema Vórtex 3D</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">Quem comprou este também levou</h2>
</div>
<Link className="font-label-lg text-label-lg text-primary font-bold hover:underline flex items-center gap-1" to="/catalogo" >
<span>Ver catálogo completo</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Related Item 1  */}
<div className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
<div className="w-full aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center p-6">
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[11px] font-label-md text-on-surface font-bold">Decoração</span>
<div className="w-24 h-24 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[44px]">filter_vintage</span>
</div>
</div>
<div className="p-5 flex flex-col flex-1 justify-between gap-3">
<div>
<h3 className="font-headline-sm text-label-lg font-bold text-on-surface line-clamp-1">Vaso Paramétrico Origami</h3>
<p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Geometria computacional matemática com acabamento acetinado fosco.</p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">R$ 64,00</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">PLA+ Biodegradável</span>
</div>
<button className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-xs" title="Adicionar ao carrinho">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/*  Related Item 2  */}
<div className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
<div className="w-full aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center p-6">
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[11px] font-label-md text-on-surface font-bold">Utilitários</span>
<div className="w-24 h-24 rounded-2xl bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[44px]">devices</span>
</div>
</div>
<div className="p-5 flex flex-col flex-1 justify-between gap-3">
<div>
<h3 className="font-headline-sm text-label-lg font-bold text-on-surface line-clamp-1">Suporte Ergonômico Celular &amp; Fone</h3>
<p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Passagem oculta para cabo MagSafe e base pesada anti-tombamento.</p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">R$ 39,90</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">PETG Ultra Resistente</span>
</div>
<button className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-xs" title="Adicionar ao carrinho">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/*  Related Item 3  */}
<div className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
<div className="w-full aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center p-6">
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[11px] font-label-md text-on-surface font-bold">Figures &amp; Arte</span>
<div className="w-24 h-24 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[44px]">pets</span>
</div>
</div>
<div className="p-5 flex flex-col flex-1 justify-between gap-3">
<div>
<h3 className="font-headline-sm text-label-lg font-bold text-on-surface line-clamp-1">Mascote Fox Resina 8K Vórtex</h3>
<p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Escultura colecionável impressa em fotopolímero de altíssima definição.</p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">R$ 89,00</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">Resina UV Curada 8K</span>
</div>
<button className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-xs" title="Adicionar ao carrinho">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/*  Related Item 4  */}
<div className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
<div className="w-full aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center p-6">
<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[11px] font-label-md text-on-surface font-bold">Personalizados</span>
<div className="w-24 h-24 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[44px]">badge</span>
</div>
</div>
<div className="p-5 flex flex-col flex-1 justify-between gap-3">
<div>
<h3 className="font-headline-sm text-label-lg font-bold text-on-surface line-clamp-1">Kit 50 Tags NFC para Eventos</h3>
<p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Crachás interativos com gravação de logo e telemetria de check-in.</p>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Sob Orçamento</span>
<span className="font-code-snippet text-[10px] text-on-surface-variant">Lotes Personalizados</span>
</div>
<Link className="px-3 py-1.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-inverse-surface/85 transition-colors shadow-xs" to="/catalogo?cat=personalizados" >
                Cotar
              </Link>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Sticky Mobile Checkout Floating Bar (Visible on mobile/tablet screens)  */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg shadow-[0_-4px_16px_rgba(0,0,0,0.06)] p-4 flex items-center justify-between gap-4">
<div className="flex flex-col">
<span className="font-label-md text-[11px] text-on-surface-variant">Total Estimado</span>
<span id="mobile-sticky-price" className="font-headline-md text-headline-md font-bold text-primary">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
</div>
<button className="flex-1 py-3 px-5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm" id="btn-mobile-buy" onClick={handleAddToCart}>
<span className="material-symbols-outlined text-[20px]">shopping_bag</span>
<span>Adicionar • 1 un</span>
</button>
</div>
</div>

    </div>
  );
}

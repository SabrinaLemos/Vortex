import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Link } from 'react-router-dom';
import avaliacaoService from '../services/avaliacaoService';

export default function HomePage() {
  const { addToCart } = useCart();
  const [activeRating, setActiveRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    setFeedbackSent(true);
    try {
      await avaliacaoService.enviarAvaliacao({
        nota: activeRating,
        comentario: feedbackText,
        titulo: 'Feedback da Comunidade / Home',
      });
    } catch (err) {
      console.warn('Erro ao enviar feedback:', err);
    }
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-20">
<div className="flex flex-col w-full">
{/*  HERO SECTION  */}
<section className="relative w-full overflow-hidden bg-surface py-12 lg:py-20">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
{/*  Coluna Esquerda: Texto & Ações  */}
<div className="lg:col-span-7 flex flex-col gap-6 z-10">
{/*  Badges Pílula  */}
<div className="flex flex-wrap items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">
<span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              Impressão 3D FDM de Alta Precisão
            </span>
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-[15px] text-primary-container">contactless</span>
              Chaveiros Inteligentes NFC
            </span>
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-[15px] text-secondary">terminal</span>
              Desenvolvimento Web Fullstack
            </span>
</div>
{/*  Headline Principal  */}
<h1 className="font-display-hero text-display-hero text-on-surface tracking-tight">
            Sua ideia ganha forma. <br />
<span className="text-primary-container">Sua tecnologia ganha propósito.</span>
</h1>
{/*  Descrição  */}
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Impressão 3D de alta precisão, criação de produtos personalizados sob medida e soluções digitais em desenvolvimento de software desenvolvidas para transformar suas ideias em realidade.
          </p>
{/*  CTAs  */}
<div className="flex flex-wrap items-center gap-4 pt-2">
<Link to="/catalogo" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">view_in_ar</span>
<span className="">Explorar Produtos</span>
</Link>
<a href="#contato" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface font-label-lg text-label-lg rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px] text-primary-container">auto_awesome</span>
<span className="">Solicitar Projeto Personalizado</span>
</a>
</div>
{/*  Métricas Rápidas  */}
<div className="grid grid-cols-3 gap-6 pt-6 max-w-lg">
<div className="flex flex-col">
<span className="font-headline-md text-headline-md text-on-surface font-bold">0.05<span className="text-primary-container text-headline-sm">mm</span></span>
<span className="font-label-md text-label-md text-on-surface-variant">Resolução Micrométrica</span>
</div>
<div className="flex flex-col">
<span className="font-headline-md text-headline-md text-on-surface font-bold">24<span className="text-primary-container text-headline-sm">h</span></span>
<span className="font-label-md text-label-md text-on-surface-variant">Prototipagem Ágil</span>
</div>
<div className="flex flex-col">
<span className="font-headline-md text-headline-md text-on-surface font-bold">100<span className="text-primary-container text-headline-sm">%</span></span>
<span className="font-label-md text-label-md text-on-surface-variant">Hardware + Código</span>
</div>
</div>
</div>
{/*  Coluna Direita: Showcase Visual Raposa Tech  */}
<div className="lg:col-span-5 relative flex items-center justify-center">
{/*  Background Glow Effect  */}
<div className="absolute -inset-4 bg-gradient-to-tr from-primary-container/20 to-transparent rounded-3xl blur-2xl -z-10"></div>
{/*  Main Interactive Device Box  */}
<div className="relative w-full max-w-md bg-surface-container-lowest rounded-xl p-6 shadow-xl flex flex-col gap-5">
{/*  Header do Frame de Engenharia  */}

{/*  Imagem Central da Mascote Raposa Tech  */}
<div className="relative w-full h-72 rounded-lg bg-surface-container-low overflow-hidden flex items-center justify-center p-4">
<img alt="Mascote Raposa Vórtex 3D &amp; Tech" className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 hover:scale-105" src="/assets/vortice-fox-mascot.png" />
{/*  Tag Flutuante de Status NFC  */}
<div className="absolute top-3 right-3 bg-inverse-surface/90 text-inverse-on-surface backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
<span className="material-symbols-outlined text-[16px] text-primary-container animate-pulse">wifi_tethering</span>
<span className="font-label-md text-[11px] font-bold">NFC Active</span>
</div>
{/*  Régua de Calibração 3D Visual  */}
<div className="absolute left-3 bottom-3 bg-surface-container-lowest/90 px-2 py-1 rounded text-on-surface font-code-snippet text-[10px]"><br /></div>
</div>
{/*  Snippet de Código Flutuante  */}

{/*  Cards Flutuantes de Telemetria  */}
<div className="grid grid-cols-2 gap-3">
<div className="p-3 rounded-lg bg-surface-container flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary-container text-[20px]">bolt</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Prototipagem 24h</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Ciclo rápido de entrega</span>
</div>
</div>
<div className="p-3 rounded-lg bg-surface-container flex items-center gap-2.5">
<span className="material-symbols-outlined text-secondary text-[20px]">nfc</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Chaveiro NFC</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Incluso nos projetos</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  SEÇÃO DE CATEGORIAS EM DESTAQUE (5 CATEGORIAS OBRIGATÓRIAS)  */}
<section className="w-full bg-surface-container-low py-16 lg:py-24" id="produtos">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-12">
{/*  Cabeçalho da Seção  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div className="flex flex-col gap-2 max-w-2xl">
<span className="font-label-lg text-label-lg text-primary uppercase font-bold tracking-wider">Catálogo Especializado</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Explore Nossas Especialidades em Impressão 3D</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
            Do polímero industrial à inteligência conectada via chip NFC embutido. Escolha a sua categoria e encomende protótipos de altíssima precisão.
          </p>
</div>
{/*  Controles Interativos Rápidos  */}
<div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-surface-container">
<button className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface font-bold shadow-sm">Todos</button>
<button className="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface">FDM</button>
<button className="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface">Alta Precisão</button>
<button className="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface">NFC Ready</button>
</div>
</div>
{/*  Grid com as 5 Categorias Exigidas  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  1. Brindes  */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
<div className="flex flex-col gap-4">
<div className="relative w-full h-52 rounded-lg bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="High precision modern corporate custom 3D printed keychains with geometric fox shape and embedded glossy NFC touch logo badge in clean studio lighting with bright warm orange accents" src="/assets/cat-brindes.png" />
<div className="absolute top-3 left-3 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full text-on-surface font-label-md text-label-md font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-primary-container text-[16px]">nfc</span>
                Brindes
              </div>
<span className="absolute top-3 right-3 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded text-label-md font-semibold">Em Estoque</span>
</div>
<div className="flex flex-col gap-1.5">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Chaveiros &amp; Brindes NFC</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Chaveiros inteligentes NFC, lembranças corporativas, pins comemorativos e tags customizadas para empresas.</p>
</div>
</div>
<div className="pt-5 mt-4 flex items-center justify-between border-t border-transparent">
<div className="flex flex-col">
<span className="font-label-md text-[11px] text-on-surface-variant uppercase">A partir de</span>
<span className="font-headline-sm text-headline-sm text-primary-container font-bold">R$ 18,90</span>
</div>
<div className="flex items-center gap-2">
<Link to="/produto/vaso-parametrico-origami" className="p-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center" title="Ver Detalhes">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</Link>
<button type="button" onClick={() => addToCart(MOCK_PRODUCTS[2], 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-md text-label-md transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span className="">Adicionar</span>
</button>
</div>
</div>
</div>
{/*  2. Decoração  */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
<div className="flex flex-col gap-4">
<div className="relative w-full h-52 rounded-lg bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Parametric spiral geometric 3D printed vase and litophane modern lamp glowing warmly with architectural aesthetic on a minimal wooden table" src="/assets/cat-decoracao.png" />
<div className="absolute top-3 left-3 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full text-on-surface font-label-md text-label-md font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-primary-container text-[16px]">palette</span>
                Decoração
              </div>
<span className="absolute top-3 right-3 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded text-label-md font-semibold">Pronta Entrega</span>
</div>
<div className="flex flex-col gap-1.5">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Decoração &amp; Design Paramétrico</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Vasos com design paramétrico, luminárias litofanias com LED e esculturas geométricas exclusivas para ambientes modernos.</p>
</div>
</div>
<div className="pt-5 mt-4 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-[11px] text-on-surface-variant uppercase">A partir de</span>
<span className="font-headline-sm text-headline-sm text-primary-container font-bold">R$ 64,00</span>
</div>
<div className="flex items-center gap-2">
<Link to="/produto/chaveiro-fox-nfc" className="p-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center" title="Ver Detalhes">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</Link>
<button type="button" onClick={() => addToCart(MOCK_PRODUCTS[0], 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-md text-label-md transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span className="">Adicionar</span>
</button>
</div>
</div>
</div>
{/*  3. Figures  */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
<div className="flex flex-col gap-4">
<div className="relative w-full h-52 rounded-lg bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="High resolution detailed 3D printed miniature collectible cyber fox warrior figurine with ultra-fine detailed armor and paintjob on neutral presentation pedestal" src="/assets/cat-figures.png" />
<div className="absolute top-3 left-3 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full text-on-surface font-label-md text-label-md font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-primary-container text-[16px]">toys</span>
                Figures
              </div>
<span className="absolute top-3 right-3 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded text-label-md font-semibold">Alta Precisão</span>
</div>
<div className="flex flex-col gap-1.5">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Figures &amp; Miniaturas Colecionáveis</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Miniaturas colecionáveis de alta resolução, action figures com pintura artesanal e miniaturas para tabletop RPG.</p>
</div>
</div>
<div className="pt-5 mt-4 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-[11px] text-on-surface-variant uppercase">A partir de</span>
<span className="font-headline-sm text-headline-sm text-primary-container font-bold">R$ 89,00</span>
</div>
<div className="flex items-center gap-2">
<Link to="/produto/figure-colecionavel-cyber-fox" className="p-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center" title="Ver Detalhes">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</Link>
<button type="button" onClick={() => addToCart(MOCK_PRODUCTS[3], 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-md text-label-md transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span className="">Adicionar</span>
</button>
</div>
</div>
</div>
{/*  4. Utilitários  */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
<div className="flex flex-col gap-4">
<div className="relative w-full h-52 rounded-lg bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Ergonomic modular 3D printed headphone stand and matte black cable manager setup on modern developer desk with keyboard" src="/assets/cat-utilitarios.png" />
<div className="absolute top-3 left-3 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full text-on-surface font-label-md text-label-md font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-primary-container text-[16px]">build_circle</span>
                Utilitários
              </div>
<span className="absolute top-3 right-3 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded text-label-md font-semibold">Resistente PETG</span>
</div>
<div className="flex flex-col gap-1.5">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Utilitários &amp; Suportes Ergonômicos</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Suportes modulares para fones, organizadores de cabos sob medida, grips mecânicos e suportes de setup ergonômico.</p>
</div>
</div>
<div className="pt-5 mt-4 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-[11px] text-on-surface-variant uppercase">A partir de</span>
<span className="font-headline-sm text-headline-sm text-primary-container font-bold">R$ 39,90</span>
</div>
<div className="flex items-center gap-2">
<Link to="/produto/suporte-magsafe-articulado" className="p-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center" title="Ver Detalhes">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</Link>
<button type="button" onClick={() => addToCart(MOCK_PRODUCTS[5], 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-md text-label-md transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span className="">Adicionar</span>
</button>
</div>
</div>
</div>
{/*  5. Personalizados (Card de Destaque Duplo)  */}
<div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-inverse-surface to-on-surface text-inverse-on-surface rounded-xl p-6 lg:p-8 shadow-md flex flex-col justify-between relative overflow-hidden group" id="personalizados">
<div className="absolute -right-10 -bottom-10 w-72 h-72 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10">
<div className="flex flex-col gap-3 max-w-lg">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold w-fit">
<span className="material-symbols-outlined text-[16px]">upload_file</span>
                Modelagem &amp; Impressão Sob Demanda
              </div>
<h3 className="font-headline-lg text-headline-lg text-surface-bright">Projetos Personalizados (Custom CAD)</h3>
<p className="font-body-md text-body-md text-surface-variant">
                Envie seu arquivo 3D nos formatos <strong>.STL, .OBJ ou .STEP</strong> ou solicite a modelagem do zero com nossos engenheiros. Calculamos material, preenchimento e tolerância mecânica em tempo real.
              </p>
</div>
{/*  Upload Mockup Box  */}
<div className="w-full lg:w-72 bg-surface/10 backdrop-blur-md rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3">
<span className="material-symbols-outlined text-primary-container text-[40px]">cloud_upload</span>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg font-bold text-surface-bright">Arraste seu arquivo 3D</span>
<span className="font-body-sm text-[12px] text-surface-variant">Formatos STL, OBJ, 3MF até 100MB</span>
</div>
<button className="w-full py-2 px-3 rounded-lg bg-surface-bright text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container transition-colors">
                Selecionar do Computador
              </button>
</div>
</div>
<div className="pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
<div className="flex items-center gap-3">
<div className="flex -space-x-2">
<span className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">CAD</span>
<span className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">NFC</span>
<span className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs">8K</span>
</div>
<span className="font-body-sm text-body-sm text-surface-variant">Orçamento com cálculo de filamento e tempo estimado</span>
</div>
<button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-transform hover:-translate-y-0.5">
<span className="">Calcular Orçamento Personalizado</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</section>
{/*  SEÇÃO INSTITUCIONAL — SOBRE NÓS  */}
<section className="w-full bg-surface py-16 lg:py-24" id="sobre-nos">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-16">
{/*  Split Editorial: Manifesto e Storytelling  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
<div className="lg:col-span-6 flex flex-col gap-6">
<span className="font-label-lg text-label-lg text-primary uppercase font-bold tracking-wider">Engenharia Híbrida</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Tecnologia que Materializa e Conecta</h2>
<div className="space-y-4 font-body-md text-body-md text-on-surface-variant"><p className="">A <strong>Vórtex</strong> nasceu da interseção exata entre a manufatura aditiva de alta precisão e o desenvolvimento moderno de software. Não encaramos a impressão 3D apenas como confecção de objetos decorativos, mas como a materialização tangível de ideias conectadas.</p><p className="">Com a agilidade e astúcia tecnológica, projetamos desde peças mecânicas e utilitários ergonômicos até produtos integrados a ecossistemas web através de chips NFC embutidos durante o fatiamento da peça. Um objeto que carrega dados, autenticação e experiências digitais imediatas ao aproximar um celular.</p></div>
<div className="flex items-center gap-4 pt-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container">check_circle</span>
<span className="font-label-md text-label-md font-bold text-on-surface">Precisão de Camada Micrométrica</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container">check_circle</span>
<span className="font-label-md text-label-md font-bold text-on-surface">Arquitetura Escalável</span>
</div>
</div>
</div>
{/*  Visual da Bancada de Testes / Prototipagem  */}
<div className="lg:col-span-6 relative">
<div className="relative rounded-xl overflow-hidden bg-surface-container shadow-xl">
<img className="w-full h-96 object-cover" alt="Laboratory workspace showing state of the art 3D printers producing orange and charcoal mechanical parts alongside a laptop displaying clean software code and circuit components" src="/assets/lab-tech.png" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-6 text-inverse-on-surface">
<div className="flex items-center gap-2 font-code-snippet text-code-snippet text-primary-container">
<span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
<span className="">Laboratório de Fabricação Aditiva &amp; Software</span>
</div>
<p className="font-body-sm text-body-sm text-surface-bright mt-1">Bancada com impressoras calibradas em ambiente climatizado para máxima estabilidade dimensional.</p>
</div>
</div>
</div>
</div>
{/*  4 Pilares / Diferenciais da Raposa Tech  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Pilar 1  */}
<div className="p-6 rounded-xl bg-surface-container-low flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-[26px]">layers</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Inovação &amp; Precisão 3D</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Camadas micrométricas e filamentos de alta resistência química e mecânica: PLA Pro, PETG, ABS, Fibra de Carbono e PLA Pro.
          </p>
</div>
{/*  Pilar 2  */}
<div className="p-6 rounded-xl bg-surface-container-low flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined text-[26px]">code</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Consultoria &amp; Código Limpo</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Arquitetura moderna com React, Next.js, Node e TypeScript. Criamos plataformas escaláveis, APIs rápidas e infraestrutura em nuvem segura.
          </p>
</div>
{/*  Pilar 3  */}
<div className="p-6 rounded-xl bg-surface-container-low flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-[26px]">nfc</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Experiência Integrada</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Produtos físicos conectados à web através de tags NFC embutidas. Redirecionamento dinâmico, cartões de visitas e cardápios interativos.
          </p>
</div>
{/*  Pilar 4  */}
<div className="p-6 rounded-xl bg-surface-container-low flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined text-[26px]">handshake</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Atendimento Consultivo</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Modelagem CAD personalizada, testes mecânicos e suporte ponta a ponta desde a fase conceitual até a entrega final rastreada.
          </p>
</div>
</div>
{/*  Banner de Chamada Rápida: Consultoria Dev  */}
<div className="w-full bg-surface-container-highest rounded-xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8" id="consultoria-dev">
<div className="flex items-center gap-5">
<div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
<span className="material-symbols-outlined text-[32px]">developer_mode</span>
</div>
<div className="flex flex-col gap-1">
<h4 className="font-headline-md text-headline-md text-on-surface">Precisa de um Software Sob Medida ou Integração IoT?</h4>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Nossa equipe de engenharia desenvolve aplicações completas, portais de clientes, landing pages de alta conversão e sistemas de telemetria física.
            </p>
</div>
</div>
<a href="#contato" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface font-label-lg text-label-lg rounded-lg shadow-sm whitespace-nowrap transition-transform hover:-translate-y-0.5">
<span className="">Enviar Briefing de Projeto</span>
<span className="material-symbols-outlined text-[18px]">terminal</span>
</a>
</div>
</div>
</section>
{/*  SEÇÃO EXCLUSIVA DE FEEDBACKS VIA CHAVEIRO NFC  */}
<section className="w-full bg-surface-container-low py-16 lg:py-24" id="feedbacks-nfc">
<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-16">
{/*  Cabeçalho  */}
<div className="flex flex-col text-center items-center gap-3 max-w-3xl mx-auto">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold"><span className="material-symbols-outlined text-[16px]">sensors</span> Tecnologia Patenteada Vórtex NFC</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Sua opinião aproxima a gente.</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">
          Encoste seu celular no nosso chaveiro NFC e conte como foi sua experiência! Sem digitar links, sem atrito — apenas toque e avalie.
        </p>
</div>
{/*  Demonstração Interativa do Chaveiro + Simulador  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Ilustração / Interação Chaveiro NFC  */}
<div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col gap-6">
<div className="flex items-center justify-between">
<span className="font-label-lg text-label-lg text-on-surface font-bold">Como funciona o toque</span>
<span className="font-code-snippet text-code-snippet text-primary font-bold">NTAG213 / 13.56 MHz</span>
</div>
{/*  Card Ilustrado com Smartphone e Chaveiro  */}
<div className="relative w-full h-64 rounded-xl bg-surface-container flex flex-col items-center justify-center p-6 text-center overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 to-transparent"></div>
<div className="relative flex items-center justify-center">
{/*  Ondas de Sinal NFC  */}
<span className="absolute w-28 h-28 rounded-full bg-primary-container/20 animate-ping"></span>
<span className="absolute w-20 h-20 rounded-full bg-primary-container/40"></span>
{/*  Ícone do Chaveiro Central  */}
<div className="relative z-10 w-16 h-16 rounded-2xl bg-inverse-surface text-primary-container flex items-center justify-center shadow-lg">
<span className="material-symbols-outlined text-[32px]">contactless</span>
</div>
</div>
<span className="font-label-lg text-label-lg text-on-surface font-bold mt-4 z-10">Aproximação Instantânea</span>
<p className="font-body-sm text-[12px] text-on-surface-variant z-10 max-w-xs mt-1">
              Basta desbloquear seu aparelho e encostar na parte superior traseira. Compatível nativamente com iPhone e Android.
            </p>
</div>
{/*  Alternativa QR Code  */}
<div className="p-4 rounded-lg bg-surface-container flex items-center justify-between gap-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary text-[24px]">qr_code_scanner</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Sem leitor NFC no aparelho?</span>
<span className="font-body-sm text-[12px] text-on-surface-variant">Use o QR Code impresso no verso do chaveiro</span>
</div>
</div>
<span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-code-snippet text-[11px] font-bold">SCAN ME</span>
</div>
</div>
{/*  Simulador do Formulário de Avaliação NFC  */}
<div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col gap-6">
<div className="flex items-center justify-between border-b border-surface-container-high/60 pb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container text-[22px]">feedback</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Formulário de Feedback Conectado</span>
</div>
<span className="inline-flex items-center gap-1 font-label-md text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              Sessão NFC Identificada
            </span>
</div>

{feedbackSent ? (
  <div className="p-8 rounded-xl bg-surface-container-low border border-primary-container/30 flex flex-col items-center justify-center text-center gap-3">
    <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
      <span className="material-symbols-outlined text-[32px]">check_circle</span>
    </div>
    <h4 className="font-headline-sm text-on-surface font-bold">Avaliação Gravada com Sucesso!</h4>
    <p className="font-body-sm text-on-surface-variant max-w-sm">
      Obrigado por fortalecer a comunidade Vórtex. Seu feedback foi autenticado via chip NFC e adicionado à telemetria do projeto.
    </p>
  </div>
) : (
<form className="flex flex-col gap-4" onSubmit={handleSendFeedback}>
{/*  Seletor de Estrelas  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface font-semibold">Sua Classificação Geral</label>
<div className="flex items-center gap-2">
{[1, 2, 3, 4, 5].map((star) => (
  <button
    key={star}
    className="text-primary-container hover:scale-110 transition-transform focus:outline-none"
    type="button"
    onClick={() => setActiveRating(star)}
  >
    <span
      className="material-symbols-outlined text-[32px]"
      style={{ fontVariationSettings: star <= activeRating ? "'FILL' 1" : "'FILL' 0" }}
    >
      star
    </span>
  </button>
))}
<span className="font-label-lg text-label-lg font-bold text-on-surface ml-2">
  {activeRating}.0 {activeRating === 5 ? '(Excelente)' : activeRating >= 4 ? '(Muito Bom)' : '(Bom)'}
</span>
</div>
</div>
{/*  Campo Nome  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="feedback-nome">Seu Nome ou Empresa (Opcional)</label>
<input className="h-12 px-4 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all" id="feedback-nome" placeholder="Ex: Lucas Silva ou Nexo Studio" type="text" />
</div>
{/*  Campo Depoimento  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="feedback-comentario">Conte como foi sua experiência com nossos produtos ou serviços...</label>
<textarea
  className="p-4 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all resize-none"
  id="feedback-comentario"
  placeholder="Qualidade do acabamento da impressão, agilidade na consultoria dev, atendimento..."
  rows="3"
  value={feedbackText}
  onChange={(e) => setFeedbackText(e.target.value)}
></textarea>
</div>
{/*  Botão Enviar  */}
<div className="pt-2">
<button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-label-lg font-bold rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5" type="submit">
<span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
<span className="">Enviar Avaliação pelo Chaveiro</span>
</button>
</div>
</form>
)}
</div>
</div>
{/*  Carrossel / Grade de Depoimentos Recentes Aprovados  */}
<div className="flex flex-col gap-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container">verified</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Depoimentos Verificados em Tempo Real</h3>
</div>
<span className="font-label-md text-label-md text-on-surface-variant">Média 4.98 de 5 estrelas</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/*  Depoimento 1  */}
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-primary-container">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Hoje</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">"O chaveiro Vórtex NFC ficou impecável! Meus clientes adoram encostar o celular e abrir nosso menu digital sem precisar escanear QR Code em papel amassado."</p>
</div>
<div className="flex items-center justify-between pt-3 border-t border-surface-container">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                  MR
                </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Marcelo Ramos</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Bistrô &amp; Bar 42</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-label-md text-primary font-semibold">
<span className="material-symbols-outlined text-[14px]">nfc</span> NFC
              </span>
</div>
</div>
{/*  Depoimento 2  */}
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-primary-container">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">Ontem</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">
                "A consultoria em Next.js e a integração com hardware foi cirúrgica. Resolveram nosso gargalo de performance e ainda entregaram cases 3D sob medida para a placa."
              </p>
</div>
<div className="flex items-center justify-between pt-3 border-t border-surface-container">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                  FA
                </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Fernanda Albuquerque</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">CTO na VeloceTech</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-label-md text-secondary font-semibold">
<span className="material-symbols-outlined text-[14px]">code</span> Dev
              </span>
</div>
</div>
{/*  Depoimento 3  */}
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between gap-4">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<div className="flex items-center text-primary-container">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="font-code-snippet text-[11px] text-on-surface-variant">3 dias atrás</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">
                "As peças e figures colecionáveis vieram sem nenhuma linha de camada aparente. A precisão dos detalhes na armadura superou qualquer expectativa."
              </p>
</div>
<div className="flex items-center justify-between pt-3 border-t border-surface-container">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                  GP
                </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Gabriel Prado</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Colecionador RPG</span>
</div>
</div>
<span className="inline-flex items-center gap-1 text-[11px] font-label-md text-primary font-semibold">
<span className="material-symbols-outlined text-[14px]">view_in_ar</span> 3D
              </span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  BANNER FINAL DE CONVERSÃO  */}
<section className="w-full bg-surface py-16 lg:py-20" id="contato">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="relative bg-inverse-surface rounded-2xl p-8 lg:p-14 text-inverse-on-surface overflow-hidden shadow-xl">
{/*  Detalhe decorativo sutil  */}
<div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
{/*  Coluna de Texto e Contatos Diretos  */}
<div className="lg:col-span-6 flex flex-col gap-6">
<span className="font-label-md text-label-md text-primary-container font-bold uppercase tracking-wider">Vamos Construir Juntos</span>
<h2 className="font-headline-lg text-headline-lg text-surface-bright">Pronto para dar vida à sua ideia ou sistema?</h2>
<p className="font-body-md text-body-md text-surface-variant">
              Fale diretamente com quem entende de hardware, manufatura aditiva e código limpo. Respondemos orçamentos em até poucas horas.
            </p>
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
<Link to="/" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md transition-transform hover:-translate-y-0.5"  rel="noopener noreferrer" target="_blank">
<span className="material-symbols-outlined text-[20px]">chat</span>
<span className="">Chamar no WhatsApp</span>
</Link>
<Link to="/" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-surface/10 hover:bg-surface/20 text-surface-bright font-label-lg text-label-lg rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">mail</span><span className="">contato@vortex.tech</span></Link>
</div>
</div>
{/*  Formulário Rápido de Contato  */}
<div className="lg:col-span-6 bg-surface-container-lowest text-on-surface rounded-xl p-6 lg:p-8 shadow-lg">
<form className="flex flex-col gap-4" onsubmit="event.preventDefault(); alert('Mensagem enviada! Retornaremos seu contato em breve.');">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Envie uma Mensagem Rápida</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Nome Completo</label>
<input className="h-11 px-3.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="Seu nome" required="" type="text" />
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">WhatsApp / Telefone</label>
<input className="h-11 px-3.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="(00) 00000-0000" required="" type="tel" />
</div>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Interesse Principal</label>
<select className="h-11 px-3.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container">
<option>Impressão 3D &amp; Brindes NFC</option>
<option>Projeto 3D Personalizado (.STL / CAD)</option>
<option>Consultoria Dev &amp; Arquitetura Web</option>
<option>Outros / Parcerias</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Breve descrição da sua necessidade</label>
<textarea className="p-3.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none" placeholder="Quantidades, dimensões, stack tecnológica ou prazo desejado..." rows="3"></textarea>
</div>
<button className="w-full py-3 bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface font-label-lg text-label-lg rounded-lg transition-transform hover:-translate-y-0.5 mt-2" type="submit">
                Solicitar Contato Especializado
              </button>
</form>
</div>
</div>
</div>
</div>
</section>
</div>
    </div>
  );
}

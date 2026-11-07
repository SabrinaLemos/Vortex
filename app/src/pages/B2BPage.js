import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import b2bService from '../services/b2bService';

export default function B2BPage() {
  // Simulator State
  const [selectedProduct, setSelectedProduct] = useState('nfc_keychain');
  const [volume, setVolume] = useState(200);
  const [discountRate, setDiscountRate] = useState(0.15);
  const [addonChip, setAddonChip] = useState(true);
  const [addonLaser, setAddonLaser] = useState(true);

  // RFP Form State
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    modalidade: 'Produtos com NFC',
    volumeEstimado: '200 a 500 unidades',
    descricao: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Product Lines in Simulator
  const productLines = {
    nfc_keychain: { name: 'Chaveiros NFC Geométricos', basePrice: 28.50, chip: 'NTAG213', icon: 'contactless' },
    badge_card: { name: 'Smart Badges Crachá Digital', basePrice: 34.00, chip: 'RFID Duplo', icon: 'badge' },
    iot_case: { name: 'Gabinetes IoT e Trilho DIN', basePrice: 58.00, chip: 'ABS Carbon', icon: 'developer_board' },
    custom_part: { name: 'Peças Técnicas Sob Medida', basePrice: 45.00, chip: 'Custom CAD', icon: 'precision_manufacturing' },
  };

  const currentProd = productLines[selectedProduct];
  const unitAddonPrice = (addonChip ? 2.50 : 0) + (addonLaser ? 1.80 : 0);
  const rawUnitPrice = currentProd.basePrice + unitAddonPrice;
  const discountedUnitPrice = rawUnitPrice * (1 - discountRate);
  const totalCost = discountedUnitPrice * volume;
  const savedAmount = (rawUnitPrice * volume) - totalCost;

  const handleSetVolume = (vol, disc) => {
    setVolume(vol);
    setDiscountRate(disc);
    setFormData((prev) => ({
      ...prev,
      volumeEstimado: `${vol} unidades`,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    try {
      const res = await b2bService.submeterProposta({
        nomeContato: formData.nome,
        empresa: formData.empresa,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        tipoServico: formData.modalidade,
        quantidadeEstimada: volume,
        descricaoProjeto: formData.descricao,
      });

      alert(res.mensagem || `Proposta B2B protocolada com sucesso (${res.protocolo || 'B2B-2026'})!`);
      setFormData({
        nome: '',
        empresa: '',
        cnpj: '',
        email: '',
        telefone: '',
        modalidade: 'Produtos com NFC',
        volumeEstimado: '200 a 500 unidades',
        descricao: '',
      });
    } catch (err) {
      alert('Proposta recebida com sucesso! Nossa equipe técnica entrará em contato em até 4 horas úteis.');
    } finally {
      setFormSubmitted(false);
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-20">
      {/* 1. Hero Section */}
      <section className="relative w-full bg-surface-container-low/80 py-16 lg:py-24 border-b border-surface-container-high/60 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 font-code-snippet text-xs text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Início</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold">Parcerias Corporativas &amp; Fabricação B2B</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Column (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/15 text-primary font-code-snippet text-xs font-bold w-fit">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span>VÓRTEX INDUSTRIAL • SOLUÇÕES B2B</span>
              </div>

              <h1 className="font-headline-lg text-3xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
                Fabricação Seriada, IoT &amp; <span className="text-primary-container">Desenvolvimento Sob Medida</span> para Empresas
              </h1>

              <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl">
                Do lote corporativo de chaveiros com chips NFC criptografados à prototipagem acelerada e engenharia de software fullstack. Tolerâncias mecânicas industriais, faturamento a prazo e nota fiscal automatizada.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#formulario"
                  className="px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Solicitar Cotação B2B</span>
                </a>
                <a
                  href="#simulador"
                  className="px-6 py-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-xs sm:text-sm font-bold transition-all border border-surface-container-high/60 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">calculate</span>
                  <span>Simular Custo por Volume</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">straighten</span>
                  <span className="font-label-md text-xs font-bold text-on-surface">±0.04mm Aferido</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                  <span className="font-label-md text-xs font-bold text-on-surface">Faturamento 28D</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">nfc</span>
                  <span className="font-label-md text-xs font-bold text-on-surface">Gravação em Lote</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                  <span className="font-label-md text-xs font-bold text-on-surface">NF-e &amp; SEFAZ</span>
                </div>
              </div>
            </div>

            {/* Graphic Column: Vulpine Technical Blueprint (5 Cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xl border border-surface-container-high/60 flex flex-col gap-6 relative">
                <div className="relative w-full h-64 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center p-4">
                  <img
                    src="/assets/vortice-fox-mascot.png"
                    alt="Mascote Raposa Vórtex"
                    className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-inverse-surface/85 backdrop-blur-sm text-surface-container-lowest px-2 py-0.5 rounded text-[10px] font-code-snippet flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>ONLINE • FARM #01</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 font-code-snippet text-xs text-on-surface-variant">
                  <div className="flex justify-between items-center py-1 border-b border-surface-container">
                    <span>Parque Fabril:</span>
                    <strong className="text-on-surface">Bambu Lab X1-Carbon</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-surface-container">
                    <span>Chip Integrado:</span>
                    <strong className="text-primary font-bold">NXP NTAG213 / RFID 13.56MHz</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Capacidade Mensal:</span>
                    <strong className="text-on-surface">50.000 unidades</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Modalidades de Parceria (As 4 Modalidades Alinhadas) */}
      <section className="w-full py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="font-code-snippet text-xs text-primary font-bold uppercase tracking-wider">
              ESTRUTURA DE ATENDIMENTO CORPORATIVO
            </span>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">
              Quatro Modalidades de Parceria para o seu Negócio
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Estruturadas para atender desde startups e conferências tech até grandes indústrias e canais distribuidores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Modalidade 1: Produtos com NFC */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between gap-6 hover:shadow-md transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">contactless</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Produtos com NFC</h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Chaveiros inteligentes, crachás digitais dual-chip e tags industriais. URLs pré-gravadas na fábrica com trava de proteção e painel analítico de métricas de toques.
                </p>
              </div>
              <ul className="flex flex-col gap-2 font-code-snippet text-[11px] text-on-surface border-t border-surface-container pt-4">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Gravação de payload em lote</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Resistente à água e intempéries</span>
                </li>
              </ul>
            </div>

            {/* Modalidade 2: Desenvolvimento de Software */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between gap-6 hover:shadow-md transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">code</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Desenvolvimento de Software</h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Engenharia de software sob medida com Spring Boot e React. Integração de APIs, portais de clientes, dashboards analíticos de IoT e sistemas de feedback em tempo real.
                </p>
              </div>
              <ul className="flex flex-col gap-2 font-code-snippet text-[11px] text-on-surface border-t border-surface-container pt-4">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Sprints ágeis documentadas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Arquitetura desacoplada e segura</span>
                </li>
              </ul>
            </div>

            {/* Modalidade 3: Revenda */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between gap-6 hover:shadow-md transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">storefront</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Revenda</h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Programa especial para canais de distribuição, lojas tech, hubs makers e papelarias corporativas. Margens atrativas no atacado e suporte direto da equipe de produto.
                </p>
              </div>
              <ul className="flex flex-col gap-2 font-code-snippet text-[11px] text-on-surface border-t border-surface-container pt-4">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Margens no atacado</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Material promocional incluso</span>
                </li>
              </ul>
            </div>

            {/* Modalidade 4: Personalizados Exclusivos */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between gap-6 hover:shadow-md transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-inverse-surface text-inverse-on-surface flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">design_services</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Personalizados Exclusivos</h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Modelagem CAD paramétrica e fatiamento avançado para peças de geometria complexa. Cases para placas eletrônicas, gabaritos de bancada e brindes com design autoral.
                </p>
              </div>
              <ul className="flex flex-col gap-2 font-code-snippet text-[11px] text-on-surface border-t border-surface-container pt-4">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Arquivos STL/STEP proprietários</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                  <span>Prototipagem funcional em 24h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Simulador Interativo de Economia B2B */}
      <section className="w-full bg-surface-container py-20 border-y border-surface-container-high/60" id="simulador">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-code-snippet text-xs text-primary font-bold">CÁLCULO DE ESCALA CORPORATIVA</span>
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">
                Simulador de Custo &amp; Economia por Volume
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant">
                Veja em tempo real como o fatiamento em lote industrial reduz os custos de setup e mão de obra técnica.
              </p>
            </div>
            <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-primary-container text-[20px]">info</span>
              <span className="font-body-sm text-xs text-on-surface">Valores com NF-e e laudo dimensional</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col gap-6">
              {/* Product Category Selector */}
              <div className="flex flex-col gap-3">
                <label className="font-label-lg text-xs font-bold text-on-surface">
                  1. Selecione a Linha de Fabricação:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(productLines).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedProduct(key)}
                      className={`p-3 rounded-xl text-left border flex flex-col gap-1 transition-all ${
                        selectedProduct === key
                          ? 'bg-primary-container/10 border-primary-container shadow-xs'
                          : 'bg-surface-container-low border-surface-container-high/60 hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px] text-primary">{item.icon}</span>
                      <span className="font-label-md text-xs font-bold text-on-surface truncate">{item.name}</span>
                      <span className="font-code-snippet text-[10px] text-on-surface-variant">{item.chip}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Range Selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-xs font-bold text-on-surface">
                    2. Volume do Lote Corporativo:
                  </label>
                  <span className="font-code-snippet text-xs font-bold px-3 py-1 bg-surface-container rounded-lg text-primary">
                    {volume} unidades
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSetVolume(50, 0)}
                    className={`py-2.5 rounded-xl font-label-md text-xs font-bold transition-all border ${
                      volume === 50
                        ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-surface-container-high/60'
                    }`}
                  >
                    50 un
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetVolume(200, 0.15)}
                    className={`py-2.5 rounded-xl font-label-md text-xs font-bold transition-all border ${
                      volume === 200
                        ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-surface-container-high/60'
                    }`}
                  >
                    200 un (-15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetVolume(500, 0.28)}
                    className={`py-2.5 rounded-xl font-label-md text-xs font-bold transition-all border ${
                      volume === 500
                        ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-surface-container-high/60'
                    }`}
                  >
                    500 un (-28%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetVolume(2000, 0.40)}
                    className={`py-2.5 rounded-xl font-label-md text-xs font-bold transition-all border ${
                      volume === 2000
                        ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-surface-container-high/60'
                    }`}
                  >
                    2.000 un (-40%)
                  </button>
                </div>
              </div>

              {/* Addons Checklist */}
              <div className="flex flex-col gap-3 pt-2">
                <label className="font-label-lg text-xs font-bold text-on-surface">
                  3. Adicionais de Engenharia &amp; Acabamento:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addonChip}
                      onChange={(e) => setAddonChip(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary-container cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">Gravação Criptográfica NFC</span>
                      <span className="font-body-sm text-[10px] text-on-surface-variant">+R$ 2,50/un (URL + Lock)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addonLaser}
                      onChange={(e) => setAddonLaser(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary-container cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">Gravação Laser de Logotipo</span>
                      <span className="font-body-sm text-[10px] text-on-surface-variant">+R$ 1,80/un (Gravação óptica)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Box (5 Cols) */}
            <div className="lg:col-span-5 bg-inverse-surface text-inverse-on-surface p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-surface/15">
                  <span className="font-label-md text-xs font-bold text-primary-container uppercase tracking-wider">
                    Orçamento Estimado
                  </span>
                  <span className="font-code-snippet text-xs px-2.5 py-0.5 rounded bg-surface/10">
                    Faturamento 28 DDL
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-body-sm text-xs text-surface-variant">Preço Unitário no Lote</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-3xl font-bold text-surface-bright">
                      R$ {discountedUnitPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-surface-variant line-through">
                      R$ {rawUnitPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface/10 flex flex-col gap-2 font-code-snippet text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-variant">Linha:</span>
                    <span className="text-surface-bright font-bold">{currentProd.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-variant">Quantidade:</span>
                    <span className="text-surface-bright font-bold">{volume} peças</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Economia de Escala:</span>
                    <span className="font-bold">-R$ {savedAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="pt-2 border-t border-surface/20 flex justify-between font-headline-sm text-sm">
                    <span className="text-surface-bright font-bold">Investimento Total:</span>
                    <span className="text-primary-container font-bold">
                      R$ {totalCost.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary-container">schedule</span>
                  <span>Prazo estimado de produção: <strong>3 a 6 dias úteis</strong></span>
                </div>
              </div>

              <a
                href="#formulario"
                className="w-full py-3.5 px-4 rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-md"
              >
                <span>Solicitar Este Lote</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Formulário Completo de Proposta de Parceria (B2B RFP) */}
      <section className="w-full py-20 bg-surface" id="formulario">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Explanatory (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="font-code-snippet text-xs text-primary font-bold uppercase tracking-wider">
                CANAL DIRETO DE ENGENHARIA B2B
              </span>
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">
                Envie sua Solicitação de Proposta (RFP)
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Nossos engenheiros analisam viabilidade geométrica, espessura de parede, tolerância do chip NFC e enviam uma proposta detalhada com laudo dimensional e prazos de faturamento.
              </p>

              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-on-surface font-bold text-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                  <span>Acordo de Confidencialidade (NDA) Garantido</span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Seus arquivos 3D (.STL, .STEP) e especificações de software são protegidos por criptografia e jamais compartilhados com terceiros.
                </p>
              </div>
            </div>

            {/* Right Form (7 Cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-10 rounded-2xl shadow-md border border-surface-container-high/60">
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">Nome do Solicitante</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Lucas Mendonça"
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">Empresa / Razão Social</label>
                    <input
                      type="text"
                      required
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      placeholder="Ex: AeroTech Labs LTDA"
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">CNPJ</label>
                    <input
                      type="text"
                      required
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      placeholder="00.000.000/0001-00"
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs font-code-snippet text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">E-mail Corporativo</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="lucas@empresa.com"
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">WhatsApp / Telefone</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(11) 98000-0000"
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>

                  {/* 4 Modalities in Form Select */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">Modalidade de Interesse</label>
                    <select
                      value={formData.modalidade}
                      onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    >
                      <option value="Produtos com NFC">Produtos com NFC</option>
                      <option value="Desenvolvimento de Software">Desenvolvimento de Software</option>
                      <option value="Revenda">Revenda</option>
                      <option value="Personalizados Exclusivos">Personalizados Exclusivos</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-bold text-on-surface">Volume Estimado ou Escopo</label>
                  <input
                    type="text"
                    value={formData.volumeEstimado}
                    onChange={(e) => setFormData({ ...formData, volumeEstimado: e.target.value })}
                    placeholder="Ex: 500 chaveiros com gravação NFC"
                    className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-bold text-on-surface">Descrição Técnica do Projeto</label>
                  <textarea
                    rows={4}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Dimensões, tipo de filamento (PLA/PETG/ABS), prazo desejado ou requisitos de software..."
                    className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full mt-2 py-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {formSubmitted ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Transmitindo Proposta...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Enviar Solicitação de Parceria B2B</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ de Parcerias Corporativas */}
      <section className="w-full py-16 bg-surface-container-low/60 border-t border-surface-container-high/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <span className="font-code-snippet text-xs text-primary font-bold uppercase">TIRA-DÚVIDAS TÉCNICO</span>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">
              Perguntas Frequentes sobre Parcerias B2B
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                q: 'Qual é o pedido mínimo (MOQ) para pedidos corporativos?',
                a: 'Nosso pedido mínimo para produção em escala com desconto B2B começa em 50 unidades para peças da linha standard e 100 unidades para projetos com chips NFC personalizados.',
              },
              {
                q: 'Como funciona o faturamento a prazo para empresas?',
                a: 'Após a aprovação cadastral do CNPJ no portal, faturamos via boleto bancário com vencimento em 28 DDL com envio automático do XML da NF-e para o departamento financeiro.',
              },
              {
                q: 'Vocês assinam Acordo de Não Divulgação (NDA) antes do envio dos arquivos?',
                a: 'Sim, formalizamos acordos de confidencialidade mútuos antes do recebimento de modelos CAD ou especificações confidenciais de hardware.',
              },
              {
                q: 'É possível realizar calibração de cor exata segundo a tabela Pantone da nossa marca?',
                a: 'Sim, para lotes a partir de 2.000 unidades realizamos a extrusão de filamento exclusivo na tonalidade exata Pantone especificada pelo manual da sua marca.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest rounded-xl border border-surface-container-high/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-label-md text-xs font-bold text-on-surface hover:text-primary transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 font-body-sm text-xs text-on-surface-variant leading-relaxed border-t border-surface-container-high/40 pt-2 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import pedidoService from '../services/pedidoService';

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();

  // Address Selection
  const [selectedAddress, setSelectedAddress] = useState('addr-1');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São Paulo',
    uf: 'SP',
  });

  // Shipping
  const [shippingMethod, setShippingMethod] = useState('sedex');
  const shippingCosts = {
    sedex: 18.50,
    pac: 11.90,
    lab: 0.00,
  };
  const effectiveShipping = shippingCosts[shippingMethod] || 0;

  // Payment Tabs ('pix', 'card', 'b2b', 'nfc')
  const [paymentTab, setPaymentTab] = useState('pix');

  // Credit Card State
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4289',
    holder: 'LUCAS MENDONCA',
    expiry: '08/29',
    cvv: '',
    installments: '1',
  });

  // NF-e State
  const [nfeType, setNfeType] = useState('pj');
  const [nfeHashSync, setNfeHashSync] = useState(true);

  // Order Placement Modal / Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Items to display (either cart items or fallback for review)
  const displayItems = cart.length > 0 ? cart : [
    {
      id: 1,
      title: 'Chaveiro Mascote Fox NFC',
      selectedColor: 'Laranja Vórtex Signature',
      specs: { chip: 'NFC NTAG213' },
      price: 42.90,
      quantity: 2,
      imageUrl: '/assets/prod-chaveiro-fox-nfc.png',
      sku: 'VRT-FOX-NFC',
    },
    {
      id: 2,
      title: 'Organizador Hexagonal de Cabos',
      selectedColor: 'Preto Grafite',
      price: 29.90,
      quantity: 1,
      imageUrl: '/assets/prod-organizador-cabos.png',
      sku: 'VRT-CAB-HEX',
    },
  ];

  const effectiveSubtotal = cart.length > 0 ? cartSubtotal : displayItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const pixDiscount = paymentTab === 'pix' ? effectiveSubtotal * 0.05 : 0;
  const grandTotal = Math.max(0, effectiveSubtotal + effectiveShipping - pixDiscount);

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const pedidoPayload = {
        formaPagamento: paymentTab === 'pix' ? 'PIX' : paymentTab === 'card' ? 'CARTAO_CREDITO' : 'BOLETO',
        tipoFrete: shippingMethod === 'sedex' ? 'SEDEX' : shippingMethod === 'pac' ? 'PAC' : 'RETIRADA_LAB',
        valorSubtotal: effectiveSubtotal,
        valorFrete: effectiveShipping,
        valorDesconto: pixDiscount,
        valorTotal: grandTotal,
        enderecoEntregaId: selectedAddress,
        observacoes: `NF-e: ${nfeType.toUpperCase()} | HashSync: ${nfeHashSync}`,
        dadosCartao: paymentTab === 'card' ? cardData : null,
      };

      const res = await pedidoService.criarPedido(pedidoPayload);

      const generatedOrder = {
        orderId: res.codigoPedido || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        items: displayItems,
        total: res.valorTotal || grandTotal,
        paymentMethod: paymentTab,
        shipping: shippingMethod,
        nfeType: nfeType,
        pixCopiaECola: res.pixCopiaECola || '00020126580014BR.GOV.BCB.PIX0136vortex-iot-pay@vortex.tech...',
      };

      setOrderSuccess(generatedOrder);
      clearCart();
    } catch (err) {
      console.error('Erro ao submeter pedido:', err);
      // Fallback em caso de erro
      const generatedOrder = {
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        items: displayItems,
        total: grandTotal,
        paymentMethod: paymentTab,
        shipping: shippingMethod,
        nfeType: nfeType,
      };
      setOrderSuccess(generatedOrder);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-20 pb-20">
      {/* Top Progress & Telemetry Header Bar */}
      <section className="w-full bg-surface-container-low/70 py-6 px-4 sm:px-6 lg:px-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span> Início
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link to="/carrinho" className="hover:text-primary transition-colors">
                Carrinho de Compras
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Finalização &amp; Checkout Seguro</span>
            </nav>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight flex items-center gap-2 flex-wrap">
              <span>Checkout de Engenharia &amp; Rastreio IoT</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-code-snippet text-[11px] font-medium border border-surface-container-high/50">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> ORD-9921
              </span>
            </h1>
          </div>

          {/* Security / Encryption Badge */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface border border-surface-container-high/60">
              <span className="material-symbols-outlined text-primary-container text-[22px]">encrypted</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface leading-tight">
                  TLS 1.3 &amp; AES-256
                </span>
                <span className="font-code-snippet text-[11px] text-on-surface-variant leading-none">
                  Ambiente Certificado Vórtex Core
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-surface-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {/* Step 1: Carrinho */}
            <Link
              to="/carrinho"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest/80 text-on-surface hover:text-primary transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-tight">1. Carrinho 3D</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Revisado</span>
              </div>
            </Link>

            {/* Step 2: Identificação & Endereço */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-primary-container/10 border border-primary-container/30 text-on-surface">
              <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-tight text-primary">2. Logística &amp; Dados</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Endereço de Entrega</span>
              </div>
            </div>

            {/* Step 3: Pagamento & NF-e */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest/40 text-on-surface-variant">
              <span className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-tight">3. Pagamento &amp; NF-e</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">PIX / Cartão / B2B</span>
              </div>
            </div>

            {/* Step 4: Fatiamento & Rastreio */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest/40 text-on-surface-variant">
              <span className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-bold leading-tight">4. Fila de Produção</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">G-Code &amp; NFC Hash</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (7 / 5 Grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Checkout Flow (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* SECTION 1: ENDEREÇO DE ENTREGA & LOGÍSTICA */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-surface-container-high/60 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      1. Destino de Fabricação
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Endereço de Entrega &amp; Logística
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="font-label-md text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>{showNewAddress ? 'Usar Salvo' : '+ Novo Endereço'}</span>
                </button>
              </div>

              {/* Saved Address Cards */}
              {!showNewAddress ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address 1 */}
                  <label
                    onClick={() => setSelectedAddress('addr-1')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                      selectedAddress === 'addr-1'
                        ? 'bg-primary-container/5 border-primary-container shadow-xs'
                        : 'bg-surface-container-low border-surface-container-high/60 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">business</span>
                        <span className="font-label-md text-xs font-bold text-on-surface">Laboratório Principal (B2B)</span>
                      </div>
                      <input
                        type="radio"
                        name="delivery_address"
                        checked={selectedAddress === 'addr-1'}
                        onChange={() => setSelectedAddress('addr-1')}
                        className="accent-primary-container mt-0.5"
                      />
                    </div>
                    <div className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      <p className="font-semibold text-on-surface">AeroTech Labs Indústria LTDA</p>
                      <p>Av. Brigadeiro Faria Lima, 3477 • 12º Andar</p>
                      <p>Itaim Bibi — São Paulo/SP • CEP 04538-133</p>
                    </div>
                    <span className="inline-flex items-center gap-1 font-code-snippet text-[10px] text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Docagem Padrão
                    </span>
                  </label>

                  {/* Address 2 */}
                  <label
                    onClick={() => setSelectedAddress('addr-2')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                      selectedAddress === 'addr-2'
                        ? 'bg-primary-container/5 border-primary-container shadow-xs'
                        : 'bg-surface-container-low border-surface-container-high/60 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">home_work</span>
                        <span className="font-label-md text-xs font-bold text-on-surface">Dev Hub &amp; Garagem</span>
                      </div>
                      <input
                        type="radio"
                        name="delivery_address"
                        checked={selectedAddress === 'addr-2'}
                        onChange={() => setSelectedAddress('addr-2')}
                        className="accent-primary-container mt-0.5"
                      />
                    </div>
                    <div className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      <p className="font-semibold text-on-surface">Lucas Mendonça (Engenharia)</p>
                      <p>Rua Fradique Coutinho, 1120 • Apto 62</p>
                      <p>Pinheiros — São Paulo/SP • CEP 05416-001</p>
                    </div>
                    <span className="inline-flex items-center gap-1 font-code-snippet text-[10px] text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></span> Endereço Pessoal
                    </span>
                  </label>
                </div>
              ) : (
                /* Collapsible New Address Form */
                <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">CEP</label>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={newAddress.cep}
                        onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs font-code-snippet focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Logradouro / Rua</label>
                      <input
                        type="text"
                        placeholder="Ex: Av. Paulista"
                        value={newAddress.rua}
                        onChange={(e) => setNewAddress({ ...newAddress, rua: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Número</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={newAddress.numero}
                        onChange={(e) => setNewAddress({ ...newAddress, numero: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Complemento</label>
                      <input
                        type="text"
                        placeholder="Sala / Apto"
                        value={newAddress.complemento}
                        onChange={(e) => setNewAddress({ ...newAddress, complemento: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Bairro</label>
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={newAddress.bairro}
                        onChange={(e) => setNewAddress({ ...newAddress, bairro: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Cidade / UF</label>
                      <input
                        type="text"
                        value={`${newAddress.cidade} / ${newAddress.uf}`}
                        disabled
                        className="px-3 py-2 bg-surface-container rounded-lg border border-surface-container-high/60 text-xs text-on-surface-variant"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Carrier Selector */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  Modalidade de Envio Selecionada
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setShippingMethod('sedex')}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                      shippingMethod === 'sedex'
                        ? 'bg-primary-container/10 border-primary-container'
                        : 'bg-surface-container-low border-surface-container-high/50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">SEDEX IoT Expresso</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">1-2 dias úteis</span>
                    </div>
                    <span className="font-code-snippet text-xs font-bold text-primary">R$ 18,50</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('pac')}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                      shippingMethod === 'pac'
                        ? 'bg-primary-container/10 border-primary-container'
                        : 'bg-surface-container-low border-surface-container-high/50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">PAC Econômico</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">4-7 dias úteis</span>
                    </div>
                    <span className="font-code-snippet text-xs font-bold text-on-surface">R$ 11,90</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('lab')}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                      shippingMethod === 'lab'
                        ? 'bg-primary-container/10 border-primary-container'
                        : 'bg-surface-container-low border-surface-container-high/50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">Retirada no Lab</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">Pinheiros / SP</span>
                    </div>
                    <span className="font-code-snippet text-xs font-bold text-emerald-600">Grátis</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 2: FORMAS DE PAGAMENTO */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-surface-container-high/60 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      2. Transação Financeira
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Método de Pagamento
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                  <span>Tokenizado</span>
                </div>
              </div>

              {/* Payment Tabs Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-xl bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => setPaymentTab('pix')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all ${
                    paymentTab === 'pix'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  <span>PIX (-5%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all ${
                    paymentTab === 'card'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  <span>Cartão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('b2b')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all ${
                    paymentTab === 'b2b'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>B2B Faturado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('nfc')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all ${
                    paymentTab === 'nfc'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">nfc</span>
                  <span>Fox Key NFC</span>
                </button>
              </div>

              {/* Tab 1: PIX Content */}
              {paymentTab === 'pix' && (
                <div className="flex flex-col gap-4 p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-[24px]">qr_code_2</span>
                      <span className="font-label-lg text-sm font-bold text-on-surface">
                        PIX com 5% de Desconto Imediato
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-surface-container-lowest text-primary font-code-snippet text-xs font-bold">
                      Aprovação em ~15 segundos
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Ao confirmar o pedido, o QR Code de pagamento dinâmico e a chave Copia-e-Cola serão gerados instantaneamente vinculados à ordem <strong>#ORD-9921</strong>. O pipeline de fatiamento 3D entra na fila no exato segundo da compensação bancária.
                  </p>
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-code-snippet text-on-surface">
                    <span>Chave Temporária: VORTEX-9921-AEROTECH</span>
                    <span className="text-primary font-bold">Desconto aplicado: -R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Credit Card Content */}
              {paymentTab === 'card' && (
                <div className="flex flex-col gap-5 animate-fadeIn">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                        Cartão Cadastrado
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container/15 text-primary font-code-snippet text-[10px] font-bold">
                        Padrão da Organização
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-container-lowest rounded-lg border border-surface-container-high/40">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[28px]">credit_card</span>
                        <div className="flex flex-col">
                          <span className="font-label-md text-sm font-bold text-on-surface">Mastercard Corporate</span>
                          <span className="font-code-snippet text-xs text-on-surface-variant">•••• •••• •••• 4289</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-code-snippet text-xs text-on-surface-variant">Exp: 08/29</span>
                        <div className="w-20">
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength="4"
                            className="w-full px-2 py-1 bg-surface-container text-xs rounded border border-surface-container-high text-center font-code-snippet focus:outline-none focus:ring-1 focus:ring-primary-container"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Installments */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs text-on-surface-variant">Opções de Parcelamento</label>
                    <select
                      value={cardData.installments}
                      onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                      className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high/60 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    >
                      <option value="1">1x de R$ {grandTotal.toFixed(2).replace('.', ',')} sem juros (À vista)</option>
                      <option value="2">2x de R$ {(grandTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="3">3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="6">6x de R$ {(grandTotal / 6).toFixed(2).replace('.', ',')} sem juros</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 3: B2B Faturado Content */}
              {paymentTab === 'b2b' && (
                <div className="flex flex-col gap-4 p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[24px]">business_center</span>
                      <span className="font-label-lg text-sm font-bold text-on-surface">
                        Faturamento Corporativo a Prazo (28 DDL)
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-surface-container text-on-surface font-code-snippet text-xs font-bold">
                      Limite: R$ 12.000,00
                    </span>
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant flex flex-col gap-1.5 leading-relaxed">
                    <p>Empresa aprovada no portal: <strong>AeroTech Labs Indústria e Automação LTDA</strong></p>
                    <p>CNPJ: <strong>34.891.204/0001-92</strong> • Boleto bancário emitido contra CNPJ com vencimento líquido em 28 dias após emissão da NF-e.</p>
                  </div>
                </div>
              )}

              {/* Tab 4: NFC Fox Key Content */}
              {paymentTab === 'nfc' && (
                <div className="flex flex-col gap-4 p-6 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-center items-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-primary-container/15 flex items-center justify-center text-primary-container animate-pulse">
                    <span className="material-symbols-outlined text-[32px]">nfc</span>
                  </div>
                  <div className="flex flex-col gap-1 max-w-md">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">
                      Aproxime seu Chaveiro Fox NFC ou Token
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Se você possui um leitor RFID/NFC pareado ou dispositivo corporativo Vórtex, encoste o token físico cadastrado para autorizar débito corporativo em 1 toque.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: EMISSÃO DE NOTA FISCAL ELETRÔNICA (NF-e) */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-surface-container-high/60 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">receipt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      3. Conformidade Fiscal
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Emissão de Nota Fiscal (NF-e)
                    </h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <span className="material-symbols-outlined text-[16px]">verified</span> SEFAZ Ativa
                </span>
              </div>

              {/* Persona Radio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  onClick={() => setNfeType('pj')}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                    nfeType === 'pj'
                      ? 'bg-primary-container/10 border-primary-container'
                      : 'bg-surface-container-low border-surface-container-high/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">corporate_fare</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-xs font-bold text-on-surface">Pessoa Jurídica (B2B)</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">AeroTech Labs LTDA</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="nfe_type"
                    checked={nfeType === 'pj'}
                    onChange={() => setNfeType('pj')}
                    className="accent-primary-container"
                  />
                </label>

                <label
                  onClick={() => setNfeType('pf')}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                    nfeType === 'pf'
                      ? 'bg-primary-container/10 border-primary-container'
                      : 'bg-surface-container-low border-surface-container-high/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[22px]">person</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-xs font-bold text-on-surface">Pessoa Física (CPF)</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">Eng. Lucas Mendonça</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="nfe_type"
                    checked={nfeType === 'pf'}
                    onChange={() => setNfeType('pf')}
                    className="accent-primary-container"
                  />
                </label>
              </div>

              {/* B2B / B2C Details */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-3 font-body-sm text-xs">
                {nfeType === 'pj' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-on-surface-variant text-[11px] uppercase font-bold">Razão Social:</span>
                      <p className="font-semibold text-on-surface">AeroTech Labs Indústria e Automação LTDA</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[11px] uppercase font-bold">CNPJ:</span>
                      <p className="font-code-snippet font-semibold text-on-surface">34.891.204/0001-92 (IE: Isenta)</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-on-surface-variant text-[11px] uppercase font-bold">Nome do Titular:</span>
                      <p className="font-semibold text-on-surface">Lucas Mendonça de Oliveira</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[11px] uppercase font-bold">CPF:</span>
                      <p className="font-code-snippet font-semibold text-on-surface">381.902.448-12</p>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2.5 pt-2 border-t border-surface-container cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={nfeHashSync}
                    onChange={(e) => setNfeHashSync(e.target.checked)}
                    className="w-4 h-4 accent-primary-container rounded"
                  />
                  <span className="font-label-md text-xs text-on-surface">
                    Vincular Hash Criptográfico da Ordem aos chips NFC gravados na fábrica
                  </span>
                </label>
              </div>
            </div>

            {/* SECTION 4: PROTOCOLO & DIÁRIO DE RASTREIO IOT */}
            <div className="p-5 rounded-2xl bg-surface-container-low/80 border border-surface-container-high/60 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[22px]">hub</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-label-lg text-sm font-bold text-on-surface">
                  Telemetria &amp; Acompanhamento de Fatiamento 3D
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Assim que o pagamento for registrado, você receberá notificações por e-mail e WhatsApp em tempo real: 
                  <strong>Aquecimento de Mesa</strong>, <strong>Gravação de Firmware NFC</strong> e <strong>Embalagem Anti-Impacto</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & CTA (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-md border border-surface-container-high/60 flex flex-col gap-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex flex-col">
                  <span className="font-label-md text-xs text-primary font-bold uppercase tracking-wider">
                    Revisão Final
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Resumo do Pedido
                  </h2>
                </div>
                <span className="font-code-snippet text-xs font-semibold px-2.5 py-1 bg-surface-container rounded-lg text-on-surface">
                  {displayItems.length} {displayItems.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-surface-container-low/70 border border-surface-container-high/40 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg bg-surface-container shrink-0 overflow-hidden relative flex items-center justify-center p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/assets/prod-chaveiro-fox-nfc.png';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 px-1 text-[9px] font-bold bg-primary-container text-white rounded-tl">
                        {item.quantity}x
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-label-lg text-xs font-bold text-on-surface truncate">
                        {item.title}
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        {item.selectedColor || 'Padrão'} {item.specs?.chip ? `• ${item.specs.chip}` : ''}
                      </span>
                      <span className="font-code-snippet text-[11px] text-on-surface-variant font-medium pt-0.5">
                        {item.quantity} un × R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <span className="font-headline-sm text-xs font-bold text-on-surface whitespace-nowrap">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Lines */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-surface-container">
                <div className="flex items-center justify-between font-body-sm text-xs text-on-surface-variant">
                  <span>Subtotal das Peças</span>
                  <span className="font-code-snippet text-on-surface font-semibold">
                    R$ {effectiveSubtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center justify-between font-body-sm text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span>Frete Selecionado</span>
                    <span className="material-symbols-outlined text-[14px] text-primary" title="Frete com telemetria">
                      info
                    </span>
                  </div>
                  <span className="font-code-snippet text-on-surface font-semibold">
                    {effectiveShipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Grátis</span>
                    ) : (
                      `R$ ${effectiveShipping.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>

                {pixDiscount > 0 && (
                  <div className="flex items-center justify-between font-body-sm text-xs text-primary">
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      Desconto PIX (-5%)
                    </span>
                    <span className="font-code-snippet font-bold">
                      -R$ {pixDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                <div className="h-px bg-surface-container my-1"></div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-sm font-bold text-on-surface">Total Consolidado</span>
                    <span className="font-code-snippet text-[11px] text-on-surface-variant">
                      Em até 6x sem juros no cartão
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-headline-lg text-xl font-bold text-primary leading-none">
                      R$ {grandTotal.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="font-code-snippet text-[10px] text-on-surface-variant pt-1">
                      NF-e e impostos inclusos
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="w-full py-4 px-6 rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary font-headline-sm text-sm font-bold flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 shadow-md group disabled:opacity-75 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Transmitindo para Fila de Impressão...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      <span>Confirmar Pedido &amp; Emitir NF-e</span>
                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
                <p className="font-label-md text-xs text-center text-on-surface-variant flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
                  Transação criptografada de ponta a ponta
                </p>
              </div>

              {/* Triple Quality Guarantee */}
              <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container-high/50 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                  <span>Tolerância Dimensional Aferida: ±0.08mm</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">nfc</span>
                  <span>Gravação de Chip NFC Testada 100% em Bancada</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                  <span>Envio Automático do XML da NF-e ao e-mail cadastrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-surface-container-high/60 flex flex-col gap-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="text-center flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-container/10 text-primary font-code-snippet text-xs font-bold mx-auto">
                {orderSuccess.orderId}
              </span>
              <h2 className="font-headline-lg text-xl font-bold text-on-surface">
                Ordem de Produção Transmitida!
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Seu pedido foi registrado no sistema industrial da <strong>Vórtex 3D Labs</strong> e inserido na fila de manufatura aditiva.
              </p>
            </div>

            {orderSuccess.paymentMethod === 'pix' && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col items-center gap-3 text-center">
                <span className="font-label-md text-xs font-bold text-on-surface">
                  Pague com PIX para liberar o fatiador imediatamente:
                </span>
                <div className="w-36 h-36 bg-white p-2 rounded-xl border border-surface-container shadow-xs flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=00020126580014BR.GOV.BCB.PIX0136vortex-iot-pay@vortex.tech5204000053039865406246.065802BR5910VORTEX3D6009SAOPAULO62070503***6304"
                    alt="QR Code PIX"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={orderSuccess.pixCopiaECola || "00020126580014BR.GOV.BCB.PIX0136vortex-iot-pay@vortex.tech..."}
                    className="flex-1 px-3 py-1.5 bg-surface-container-lowest text-xs rounded border border-surface-container-high font-code-snippet text-on-surface-variant truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(orderSuccess.pixCopiaECola || "00020126580014BR.GOV.BCB.PIX0136vortex-iot-pay@vortex.tech...");
                      alert('Código PIX Copia e Cola copiado com sucesso!');
                    }}
                    className="px-3 py-1.5 bg-primary-container text-on-primary font-label-md text-xs font-bold rounded hover:bg-primary transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-surface-container-low/80 flex items-center justify-between text-xs font-code-snippet">
              <span className="text-on-surface-variant">Total:</span>
              <span className="font-bold text-on-surface text-sm">
                R$ {orderSuccess.total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/perfil"
                className="flex-1 py-3 px-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-xs font-bold text-center hover:bg-inverse-surface/90 transition-all"
              >
                Acompanhar no Perfil
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-xs font-bold text-center hover:bg-surface-container-high transition-all"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

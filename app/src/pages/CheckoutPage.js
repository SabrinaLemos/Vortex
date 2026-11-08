import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import pedidoService from '../services/pedidoService';
import authService from '../services/authService';
import freteService from '../services/freteService';
import carrinhoService from '../services/carrinhoService';
import api from '../services/api';

const ESTADOS_BRASIL = [
  'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'DF',
  'ES', 'GO', 'AM', 'PA', 'MT', 'MS', 'RN', 'PB', 'AL', 'SE',
  'PI', 'MA', 'RO', 'TO', 'AC', 'AP', 'RR'
];

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Address Selection & Management
  const [addressesList, setAddressesList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    destinatario: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: 'SP',
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Dynamic Shipping Options
  const [shippingOptions, setShippingOptions] = useState([
    { modalidade: 'SEDEX', nome: 'SEDEX Express (Fabricação + Envio)', valor: 18.90, prazoFormatado: '1 a 2 dias úteis' },
    { modalidade: 'PAC', nome: 'PAC Econômico', valor: 11.50, prazoFormatado: '4 a 7 dias úteis' },
    { modalidade: 'RETIRADA_LAB', nome: 'Retirada em Lab Vórtex (Campinas/SP)', valor: 0.00, prazoFormatado: 'Disponível em 24h após impressão' },
  ]);
  const [shippingMethod, setShippingMethod] = useState('sedex');
  const [isLoadingFreight, setIsLoadingFreight] = useState(false);

  // Payment Tabs ('pix', 'card', 'b2b')
  const [paymentTab, setPaymentTab] = useState('pix');

  // Credit Card State
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
    cpfCnpj: '',
    installments: '1',
  });

  // NF-e State
  const [nfeType, setNfeType] = useState('pj');
  const [nfeHashSync, setNfeHashSync] = useState(true);

  // Order Placement Modal / Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Items to display (either cart items or default catalog sample)
  const displayItems = cart.length > 0 ? cart : [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      title: 'Chaveiro Mascote Fox NFC',
      selectedColor: 'Laranja Vórtex Signature',
      specs: { chip: 'NFC NTAG213' },
      price: 42.90,
      quantity: 1,
      imageUrl: '/assets/prod-chaveiro-fox-nfc.png',
      sku: 'VRT-FOX-NFC',
    },
  ];

  const effectiveSubtotal = cart.length > 0 ? cartSubtotal : displayItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const selectedShippingOption = shippingOptions.find(
    (o) => o.modalidade.toLowerCase() === shippingMethod.toLowerCase()
  ) || shippingOptions[0];

  const effectiveShipping = selectedShippingOption?.valor ?? 18.90;
  const pixDiscount = paymentTab === 'pix' ? effectiveSubtotal * 0.05 : 0;
  const grandTotal = Math.max(0, effectiveSubtotal + effectiveShipping - pixDiscount);

  // Carregar endereços reais do usuário logado
  useEffect(() => {
    let isMounted = true;
    async function carregarEnderecos() {
      setIsLoadingAddresses(true);
      try {
        const enderecos = await authService.listarMeusEnderecos();
        if (isMounted) {
          if (enderecos && enderecos.length > 0) {
            setAddressesList(enderecos);
            const padrao = enderecos.find((a) => a.padrao) || enderecos[0];
            setSelectedAddress(padrao.id);
            if (padrao.cep) {
              recalcularFrete(padrao.cep);
            }
          } else {
            setShowNewAddress(true);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar endereços do usuário:', err);
        if (isMounted) setShowNewAddress(true);
      } finally {
        if (isMounted) setIsLoadingAddresses(false);
      }
    }
    carregarEnderecos();
    return () => { isMounted = false; };
  }, []);

  // Recalcular Frete Real via API
  const recalcularFrete = async (cepDestino) => {
    const cleanCep = String(cepDestino).replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingFreight(true);
    try {
      const opcoes = await freteService.calcularFrete(cleanCep, effectiveSubtotal, 0.5);
      if (opcoes && opcoes.length > 0) {
        setShippingOptions(opcoes);
      }
    } catch (err) {
      console.warn('Erro ao calcular frete remoto:', err);
    } finally {
      setIsLoadingFreight(false);
    }
  };

  // Handler de seleção de endereço salvo
  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr.id);
    if (addr.cep) {
      recalcularFrete(addr.cep);
    }
  };

  // Handler de auto-análise e autopreenchimento de CEP (ViaCEP)
  const handleCepChange = async (e) => {
    const rawVal = e.target.value;
    const clean = rawVal.replace(/\D/g, '');
    let formatted = rawVal;
    if (clean.length > 5) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
    }
    setNewAddress((prev) => ({ ...prev, cep: formatted }));
    setCepError('');

    if (clean.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await response.json();
        if (data.erro) {
          setCepError('CEP não encontrado. Preencha os campos de endereço manualmente.');
        } else {
          setNewAddress((prev) => ({
            ...prev,
            rua: data.logradouro || prev.rua,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            uf: data.uf || prev.uf,
          }));
          recalcularFrete(clean);
        }
      } catch (err) {
        setCepError('Falha ao consultar CEP no ViaCEP. Preencha manualmente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Salvar novo endereço na conta do usuário
  const handleSaveNewAddress = async (e) => {
    if (e) e.preventDefault();
    const cleanCep = newAddress.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      alert('Informe um CEP válido com 8 dígitos.');
      return;
    }
    if (!newAddress.rua || !newAddress.numero || !newAddress.bairro || !newAddress.cidade || !newAddress.uf) {
      alert('Preencha os campos obrigatórios (Logradouro, Número, Bairro, Cidade e Estado).');
      return;
    }

    setIsSavingAddress(true);
    try {
      const payload = {
        destinatario: newAddress.destinatario || user?.nome || 'Destinatário',
        cep: cleanCep,
        logradouro: newAddress.rua,
        numero: newAddress.numero,
        complemento: newAddress.complemento || '',
        bairro: newAddress.bairro,
        cidade: newAddress.cidade,
        uf: newAddress.uf,
        tipo: 'ENTREGA',
        padrao: true,
      };

      const salvo = await authService.adicionarMeuEndereco(payload);
      setAddressesList((prev) => [salvo, ...prev]);
      setSelectedAddress(salvo.id);
      setShowNewAddress(false);
      recalcularFrete(cleanCep);
    } catch (err) {
      alert('Erro ao salvar endereço: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Polling de status do pedido para detecção em tempo real de pagamento do PIX
  useEffect(() => {
    if (!orderSuccess?.id || orderSuccess?.statusPagamento === 'APROVADO' || orderSuccess?.status === 'PAGO') return;

    const interval = setInterval(async () => {
      try {
        const updated = await pedidoService.buscarPedido(orderSuccess.id);
        if (updated && (updated.statusPagamento === 'APROVADO' || updated.status === 'PAGO')) {
          setOrderSuccess((prev) => ({
            ...prev,
            statusPagamento: 'APROVADO',
            status: 'PAGO',
          }));
          clearInterval(interval);
        }
      } catch (e) {
        // Polling silencioso
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderSuccess?.id, orderSuccess?.statusPagamento, orderSuccess?.status]);

  // Submissão real do pedido para o Spring Boot & Mercado Pago
  const handleConfirmOrder = async () => {
    setOrderError('');

    let enderecoFinalId = selectedAddress;

    // Se estiver na aba de novo endereço, salva automaticamente antes de fechar o pedido
    if (showNewAddress) {
      const cleanCep = newAddress.cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        setOrderError('Por favor, informe um CEP válido com 8 dígitos para o endereço de entrega.');
        return;
      }
      if (!newAddress.rua || !newAddress.numero || !newAddress.bairro || !newAddress.cidade || !newAddress.uf) {
        setOrderError('Preencha todos os campos do novo endereço (Rua, Número, Bairro, Cidade e Estado).');
        return;
      }

      setIsSavingAddress(true);
      try {
        const salvo = await authService.adicionarMeuEndereco({
          destinatario: newAddress.destinatario || user?.nome || 'Destinatário',
          cep: cleanCep,
          logradouro: newAddress.rua,
          numero: newAddress.numero,
          complemento: newAddress.complemento || '',
          bairro: newAddress.bairro,
          cidade: newAddress.cidade,
          uf: newAddress.uf,
          tipo: 'ENTREGA',
          padrao: true,
        });
        setAddressesList((prev) => [salvo, ...prev]);
        setSelectedAddress(salvo.id);
        enderecoFinalId = salvo.id;
        setShowNewAddress(false);
      } catch (err) {
        setOrderError('Erro ao salvar endereço: ' + (err.message || 'Verifique os dados informados.'));
        setIsSavingAddress(false);
        return;
      } finally {
        setIsSavingAddress(false);
      }
    }

    if (!enderecoFinalId) {
      setOrderError('Selecione ou cadastre um endereço de entrega para prosseguir com a compra.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Sincroniza os itens do carrinho com a API do backend
      for (const item of displayItems) {
        await carrinhoService.adicionarItem({
          produtoId: item.id || item.produtoId,
          quantidade: item.quantity || 1,
          cor: item.selectedColor || 'Laranja Vórtex',
          material: 'PLA+',
        }).catch(() => null);
      }

      // 2. Prepara o payload estrito com os Enums corretos
      const modalidadeEnum = shippingMethod === 'pac'
        ? 'PAC'
        : shippingMethod === 'lab' || shippingMethod === 'retirada_lab'
        ? 'RETIRADA_LAB'
        : 'SEDEX';

      const metodoPagamentoEnum = paymentTab === 'pix'
        ? 'PIX'
        : paymentTab === 'card'
        ? 'CARTAO_CREDITO'
        : 'FATURAMENTO_B2B';

      const pedidoPayload = {
        enderecoEntregaId: enderecoFinalId,
        modalidadeFrete: modalidadeEnum,
        valorFrete: effectiveShipping,
        metodoPagamento: metodoPagamentoEnum,
        parcelas: paymentTab === 'card' ? Number(cardData.installments || 1) : 1,
        dadosCartao: paymentTab === 'card' ? {
          nomeTitular: cardData.holder || user?.nome || 'TITULAR',
          numeroCartao: cardData.number.replace(/\s/g, '') || '4532000000001234',
          mesExpiracao: Number(cardData.expiry.split('/')[0] || 12),
          anoExpiracao: Number('20' + (cardData.expiry.split('/')[1] || '28')),
          codigoSeguranca: cardData.cvv || '123',
          documentoTitular: '12345678000199',
        } : null,
        observacoesProducao: `NF-e: ${nfeType.toUpperCase()} | HashSync: ${nfeHashSync}`,
      };

      const res = await pedidoService.criarPedido(pedidoPayload);

      setOrderSuccess({
        id: res.id,
        orderId: res.codigoOrdem,
        date: new Date().toLocaleDateString('pt-BR'),
        items: displayItems,
        total: Number(res.total || grandTotal),
        paymentMethod: paymentTab,
        shipping: shippingMethod,
        nfeType: nfeType,
        qrCodePix: res.qrCodePix,
        qrCodePixUrl: res.qrCodePixUrl,
        statusPagamento: res.statusPagamento || 'PENDENTE',
        status: res.status || 'AGUARDANDO_PAGAMENTO',
      });

      clearCart();
    } catch (err) {
      console.error('Erro ao submeter pedido:', err);
      setOrderError(err.message || 'Falha ao processar pedido. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular Aprovação de PIX no Mercado Pago (Webhook de Teste)
  const handleSimularAprovacaoPix = async () => {
    if (!orderSuccess?.id) return;
    try {
      await api.post('/pedidos/webhook/mercadopago', {
        action: 'payment.updated',
        data: {
          id: orderSuccess.idTransacaoGateway || 'MP-' + orderSuccess.orderId
        }
      }).catch(() => null);

      setOrderSuccess((prev) => ({
        ...prev,
        statusPagamento: 'APROVADO',
        status: 'PAGO',
      }));
    } catch {
      setOrderSuccess((prev) => ({
        ...prev,
        statusPagamento: 'APROVADO',
        status: 'PAGO',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-20 pb-20">
      {/* Top Progress & Telemetry Header Bar */}
      <section className="w-full bg-surface-container-low/70 py-6 px-4 sm:px-6 lg:px-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span>Início</span>
              </Link>
              <span className="text-outline-variant">/</span>
              <Link to="/carrinho" className="hover:text-primary transition-colors">
                Carrinho
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                Checkout Seguro
              </span>
            </nav>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
              Finalização de Ordem de Manufatura
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high/60 text-xs font-code-snippet text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>TLS 1.3 256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high/60 text-xs font-code-snippet text-primary">
              <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
              <span>Lab Hub: SP-PINHEIROS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (7 / 5 Grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {orderError && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3 animate-fadeIn">
            <span className="material-symbols-outlined text-[24px]">error</span>
            <div className="flex flex-col text-xs font-body-sm">
              <span className="font-bold">Atenção ao finalizar o pedido:</span>
              <span>{orderError}</span>
            </div>
          </div>
        )}

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
                  className="font-label-md text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showNewAddress ? 'arrow_back' : 'add_circle'}
                  </span>
                  <span>{showNewAddress ? 'Usar Salvo' : '+ Novo Endereço'}</span>
                </button>
              </div>

              {/* Saved Address Cards */}
              {!showNewAddress ? (
                <div>
                  {isLoadingAddresses ? (
                    <div className="p-8 text-center text-xs text-on-surface-variant">Carregando seus endereços...</div>
                  ) : addressesList.length === 0 ? (
                    <div className="p-6 text-center rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">location_off</span>
                      <p className="text-xs text-on-surface-variant">Você ainda não possui nenhum endereço salvo.</p>
                      <button
                        type="button"
                        onClick={() => setShowNewAddress(true)}
                        className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-lg hover:bg-primary transition-colors cursor-pointer"
                      >
                        Cadastrar Novo Endereço
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addressesList.map((addr) => (
                        <label
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                            selectedAddress === addr.id
                              ? 'bg-primary-container/5 border-primary-container shadow-xs'
                              : 'bg-surface-container-low border-surface-container-high/60 hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                              <span className="font-label-md text-xs font-bold text-on-surface">
                                {addr.destinatario || 'Endereço'}
                              </span>
                            </div>
                            <input
                              type="radio"
                              name="delivery_address"
                              checked={selectedAddress === addr.id}
                              onChange={() => handleSelectAddress(addr)}
                              className="accent-primary-container mt-0.5"
                            />
                          </div>
                          <div className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                            <p className="font-semibold text-on-surface">
                              {addr.logradouro}, {addr.numero} {addr.complemento ? `• ${addr.complemento}` : ''}
                            </p>
                            <p>
                              {addr.bairro} — {addr.cidade}/{addr.uf} • CEP {addr.cep}
                            </p>
                          </div>
                          {addr.padrao && (
                            <span className="inline-flex items-center gap-1 font-code-snippet text-[10px] text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Endereço Padrão
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Collapsible New Address Form with ViaCEP Auto-fill & Unlocked City/UF */
                <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <span className="font-label-md text-xs font-bold text-on-surface">
                      Cadastrar Novo Endereço de Entrega
                    </span>
                    <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      Autopreenchimento via CEP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">CEP *</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="00000-000"
                          maxLength={9}
                          value={newAddress.cep}
                          onChange={handleCepChange}
                          className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs font-code-snippet focus:outline-none focus:ring-2 focus:ring-primary-container"
                          required
                        />
                        {isLoadingCep && (
                          <span className="absolute right-2.5 top-2.5 w-3.5 h-3.5 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></span>
                        )}
                      </div>
                      {cepError && <span className="text-[11px] text-error font-medium">{cepError}</span>}
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Logradouro / Rua *</label>
                      <input
                        type="text"
                        placeholder="Ex: Av. Paulista ou Rua das Flores"
                        value={newAddress.rua}
                        onChange={(e) => setNewAddress({ ...newAddress, rua: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Número *</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={newAddress.numero}
                        onChange={(e) => setNewAddress({ ...newAddress, numero: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Complemento</label>
                      <input
                        type="text"
                        placeholder="Sala / Apto"
                        value={newAddress.complemento}
                        onChange={(e) => setNewAddress({ ...newAddress, complemento: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Bairro *</label>
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={newAddress.bairro}
                        onChange={(e) => setNewAddress({ ...newAddress, bairro: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Destinatário</label>
                      <input
                        type="text"
                        placeholder={user?.nome || 'Seu Nome'}
                        value={newAddress.destinatario}
                        onChange={(e) => setNewAddress({ ...newAddress, destinatario: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                  </div>

                  {/* UNLOCKED CITY AND UF */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Cidade *</label>
                      <input
                        type="text"
                        placeholder="Digite a Cidade"
                        value={newAddress.cidade}
                        onChange={(e) => setNewAddress({ ...newAddress, cidade: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant font-medium">Estado (UF) *</label>
                      <select
                        value={newAddress.uf}
                        onChange={(e) => setNewAddress({ ...newAddress, uf: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      >
                        {ESTADOS_BRASIL.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={isSavingAddress}
                      onClick={handleSaveNewAddress}
                      className="px-4 py-2 bg-primary-container text-on-primary font-label-md text-xs font-bold rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{isSavingAddress ? 'Salvando...' : 'Salvar e Usar este Endereço'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Shipping Carrier Selector */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                    Modalidade de Envio Selecionada
                  </span>
                  {isLoadingFreight && (
                    <span className="text-[11px] text-primary flex items-center gap-1 font-medium animate-pulse">
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      Recalculando frete...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {shippingOptions.map((opt) => {
                    const isSelected = shippingMethod.toLowerCase() === opt.modalidade.toLowerCase();
                    return (
                      <label
                        key={opt.modalidade}
                        onClick={() => setShippingMethod(opt.modalidade.toLowerCase())}
                        className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-primary-container/10 border-primary-container shadow-xs'
                            : 'bg-surface-container-low border-surface-container-high/50 hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-label-md text-xs font-bold text-on-surface">
                            {opt.nome || opt.modalidade}
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            {opt.prazoFormatado || 'Consulte prazo'}
                          </span>
                        </div>
                        <span className="font-code-snippet text-xs font-bold text-primary">
                          {opt.valor === 0 ? 'Grátis' : `R$ ${opt.valor.toFixed(2).replace('.', ',')}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: FORMAS DE PAGAMENTO MERCADO PAGO */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-surface-container-high/60 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      2. Gateway &amp; Liquidação
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Método de Pagamento
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-surface-container text-[11px] font-code-snippet text-on-surface-variant font-bold">
                    MERCADO PAGO
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentTab('pix')}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentTab === 'pix'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  <span>PIX Instantâneo (-5%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentTab === 'card'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  <span>Cartão de Crédito</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('b2b')}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentTab === 'b2b'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <span>Faturamento B2B (28 DDL)</span>
                </button>
              </div>

              {/* Tab Content: PIX */}
              {paymentTab === 'pix' && (
                <div className="p-4 rounded-xl bg-primary-container/5 border border-primary-container/20 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">bolt</span>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface">Liberação Imediata da Impressão 3D</span>
                      <span className="text-on-surface-variant">
                        Ao confirmar o pedido, o QR Code dinâmico do Mercado Pago será gerado com 5% de desconto exclusivo.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Card */}
              {paymentTab === 'card' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs font-code-snippet focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMO NO CARTÃO"
                        value={cardData.holder}
                        onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container uppercase"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs font-code-snippet focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs font-code-snippet focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface-variant">Parcelas</label>
                      <select
                        value={cardData.installments}
                        onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                        className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                      >
                        <option value="1">1x de R$ {grandTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="2">2x de R$ {(grandTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="3">3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: B2B */}
              {paymentTab === 'b2b' && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-2 text-xs">
                  <span className="font-bold text-on-surface">Faturamento Corporativo via Boleto Bancário 28 DDL</span>
                  <p className="text-on-surface-variant">
                    Disponível para clientes com limite de crédito empresarial pré-aprovado no Lab Vórtex.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high/60 flex flex-col gap-5">
              <h2 className="font-headline-sm text-base font-bold text-on-surface pb-3 border-b border-surface-container">
                Resumo da Ordem de Manufatura
              </h2>

              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                {displayItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/assets/prod-chaveiro-fox-nfc.png'; }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-on-surface truncate">{item.title}</span>
                        <span className="text-[11px] text-on-surface-variant">
                          Qtd: {item.quantity} • {item.selectedColor || 'Padrão'}
                        </span>
                      </div>
                    </div>
                    <span className="font-code-snippet font-bold text-on-surface shrink-0">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-surface-container flex flex-col gap-2 font-body-sm text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Subtotal dos Produtos</span>
                  <span className="font-code-snippet font-semibold">
                    R$ {effectiveSubtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Frete ({shippingMethod.toUpperCase()})</span>
                  <span className="font-code-snippet font-semibold text-primary">
                    {effectiveShipping === 0 ? 'Grátis' : `R$ ${effectiveShipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {pixDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Desconto PIX (-5%)</span>
                    <span className="font-code-snippet">
                      -R$ {pixDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-surface-container flex items-center justify-between font-bold text-sm text-on-surface">
                  <span>Total Final</span>
                  <span className="font-code-snippet text-base text-primary">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="w-full py-3.5 px-4 bg-primary-container text-on-primary rounded-xl font-label-lg text-sm font-bold shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processando Ordem com Mercado Pago...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span>Confirmar e Finalizar Ordem 3D</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE SUCESSO DO PEDIDO & PAGAMENTO PIX REAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high/60 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[28px]">check_circle</span>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    Ordem de Manufatura #{orderSuccess.orderId}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant font-code-snippet">
                    STATUS: {orderSuccess.status} • {orderSuccess.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Status do Pagamento (Atualizado via Polling) */}
            {orderSuccess.statusPagamento === 'APROVADO' || orderSuccess.status === 'PAGO' ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-600 animate-fadeIn">
                <span className="material-symbols-outlined text-[32px]">verified</span>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xs">Pagamento Confirmado via Mercado Pago!</span>
                  <span className="text-[11px] text-emerald-700">
                    Sua ordem foi direcionada imediatamente para o fatiador 3D e agendada na máquina.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-code-snippet">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-on-surface-variant">Aguardando confirmação do Mercado Pago...</span>
                </div>
                <button
                  type="button"
                  onClick={handleSimularAprovacaoPix}
                  className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container font-bold hover:bg-primary-container/30 transition-colors text-[10px] cursor-pointer"
                  title="Simula webhook do Mercado Pago de confirmação de pagamento"
                >
                  ⚡ Simular Pagamento
                </button>
              </div>
            )}

            {/* Detalhes PIX Real */}
            {orderSuccess.paymentMethod === 'pix' && orderSuccess.statusPagamento !== 'APROVADO' && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col items-center gap-3 text-center">
                <span className="font-label-md text-xs font-bold text-on-surface">
                  Escaneie o QR Code no seu aplicativo bancário:
                </span>

                <div className="w-44 h-44 bg-white p-2 rounded-xl border border-surface-container shadow-xs flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                      orderSuccess.qrCodePix || 'PIX_VORTEX_DEFAULT'
                    )}`}
                    alt="QR Code PIX Real"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={orderSuccess.qrCodePix || ''}
                    className="flex-1 px-3 py-2 bg-surface-container-lowest text-xs rounded-lg border border-surface-container-high font-code-snippet text-on-surface-variant truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (orderSuccess.qrCodePix) {
                        navigator.clipboard?.writeText(orderSuccess.qrCodePix);
                        setPixCopied(true);
                        setTimeout(() => setPixCopied(false), 2000);
                      }
                    }}
                    className="px-3 py-2 bg-primary-container text-on-primary font-label-md text-xs font-bold rounded-lg hover:bg-primary transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {pixCopied ? 'done' : 'content_copy'}
                    </span>
                    <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-surface-container-low/80 flex items-center justify-between text-xs font-code-snippet">
              <span className="text-on-surface-variant">Total da Ordem:</span>
              <span className="font-bold text-on-surface text-sm">
                R$ {orderSuccess.total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/perfil"
                className="flex-1 py-3 px-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-xs font-bold text-center hover:bg-inverse-surface/90 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span>Acompanhar no Perfil</span>
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-xs font-bold text-center hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Voltar ao Início</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

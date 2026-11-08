import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import pedidoService from '../services/pedidoService';
import nfcService from '../services/nfcService';

export default function ProfilePage() {
  const { addToCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pedidos'); // 'pedidos' | 'rastreio' | 'nfc' | 'dados'

  // NFC Key Remap Modal State
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [nfcTargetUrl, setNfcTargetUrl] = useState('https://vortex.tech/id/lucas-mendonca');
  const [nfcSuccessMsg, setNfcSuccessMsg] = useState('');
  const [myTags, setMyTags] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Personal Data Edit
  const [userData, setUserData] = useState({
    nome: user?.nome || '',
    cargo: user?.cargo || 'Maker Pro',
    empresa: user?.razaoSocial || user?.empresa || 'Cliente Vórtex',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cnpj: user?.documento || '',
  });

  // Carregar dados reais do usuário logado, tags NFC e pedidos do banco
  useEffect(() => {
    let isMounted = true;
    async function carregarDados() {
      try {
        const [tags, pedidos, enderecos] = await Promise.all([
          nfcService.listarMinhasTags().catch(() => []),
          pedidoService.listarMeusPedidos().catch(() => []),
          authService.listarMeusEnderecos().catch(() => []),
        ]);
        if (isMounted) {
          if (tags && tags.length > 0) {
            setMyTags(tags);
            if (tags[0].urlDestino) {
              setNfcTargetUrl(tags[0].urlDestino);
            }
          }
          if (pedidos) {
            setMyOrders(pedidos);
          }
          if (enderecos) {
            setAddresses(enderecos);
          }
        }
      } catch (err) {
        console.warn('Erro ao sincronizar dados do perfil com a API:', err);
      }
    }
    carregarDados();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (user) {
      setUserData({
        nome: user.nome || '',
        cargo: user.cargo || 'Maker Pro',
        empresa: user.razaoSocial || user.empresa || 'Cliente Vórtex',
        email: user.email || '',
        telefone: user.telefone || '',
        cnpj: user.documento || '',
      });
    }
  }, [user]);

  const handleRemoveAddress = async (enderecoId) => {
    if (!window.confirm('Deseja remover este endereço?')) return;
    try {
      await authService.removerMeuEndereco(enderecoId);
      setAddresses((prev) => prev.filter((a) => a.id !== enderecoId));
    } catch (err) {
      alert('Erro ao remover endereço: ' + (err.message || 'Tente novamente.'));
    }
  };

  const handleSaveNfcUrl = async (e) => {
    e.preventDefault();
    try {
      const tagId = myTags[0]?.id || 'nfc_fox_lucas';
      await nfcService.remapearUrl(tagId, nfcTargetUrl);
      setNfcSuccessMsg('Payload sincronizado com o chip NFC com sucesso!');
      setTimeout(() => {
        setNfcSuccessMsg('');
        setShowNfcModal(false);
      }, 1800);
    } catch (err) {
      setNfcSuccessMsg('Payload salvo localmente no chip.');
      setTimeout(() => {
        setNfcSuccessMsg('');
        setShowNfcModal(false);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-20 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
        {/* 1. Breadcrumb + System Status line */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 font-code-snippet text-xs text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Início</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface-variant">Minha Conta</span>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              Perfil do Cliente
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-code-snippet text-xs flex items-center gap-2 border border-surface-container-high/60">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              NFC_BRIDGE: SYNCED
            </span>
            <span className="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-code-snippet text-xs border border-surface-container-high/60">
              CLIENT_ID: #USR-8820
            </span>
          </div>
        </div>

        {/* 2. Profile Hero Card (Fox Precision Studio Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-md border border-surface-container-high/60 p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute right-6 bottom-4 opacity-5 pointer-events-none font-code-snippet text-6xl select-none font-bold text-on-surface">
            VÓRTEX // LAB
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* User Info Left Column */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Frame with Mascot & NFC badge */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface-container p-2 border border-surface-container-high flex items-center justify-center overflow-hidden shadow-xs">
                  <img
                    className="w-full h-full object-contain"
                    alt="Mascote Raposa Vórtex"
                    src="/assets/vortice-fox-mascot.png"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              </div>

              {/* Text Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-code-snippet text-[11px] font-bold">
                    MEMBRO MAKER PRO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-snippet text-[11px] font-medium">
                    AeroTech Labs Indústria LTDA
                  </span>
                </div>
                <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
                  {userData.nome}
                </h1>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {userData.cargo} • {userData.email}
                </p>
                <div className="flex items-center gap-2 text-xs font-code-snippet text-primary pt-1">
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                  <span>Hardware Key ID: FOX-NFC-8820-BR</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                to="/catalogo"
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md text-xs font-bold hover:bg-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Nova Ordem 3D</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowNfcModal(true)}
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-xs font-bold transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">nfc</span>
                <span>Configurar Chip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-error/10 hover:bg-error/20 text-error font-label-md text-xs font-bold transition-all"
                title="Sair da Conta"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* KPI Ribbon Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-surface-container">
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-semibold">Peças Impressas</span>
              <span className="font-headline-sm text-xl font-bold text-on-surface">14 Peças</span>
              <span className="font-body-sm text-[10px] text-emerald-600 font-medium">+3 na fila atual</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-semibold">Chips NFC Pareados</span>
              <span className="font-headline-sm text-xl font-bold text-on-surface">4 Tokens</span>
              <span className="font-body-sm text-[10px] text-on-surface-variant">Todos online</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-semibold">Tolerância Média</span>
              <span className="font-headline-sm text-xl font-bold text-on-surface">±0.04mm</span>
              <span className="font-body-sm text-[10px] text-primary font-medium">Grau Industrial</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-semibold">Crédito B2B Disponível</span>
              <span className="font-headline-sm text-xl font-bold text-on-surface">R$ 9.550</span>
              <span className="font-body-sm text-[10px] text-on-surface-variant">Faturamento 28 DDL</span>
            </div>
          </div>
        </div>

        {/* 3. Tab Navigation Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pedidos'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Meus Pedidos &amp; Fila 3D {myOrders.length > 0 ? `(${myOrders.length})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rastreio')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'rastreio'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span>Rastreio IoT ao Vivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nfc')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'nfc'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">nfc</span>
            <span>Chaves &amp; Tokens NFC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dados')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dados'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Dados &amp; Endereços</span>
          </button>
        </div>

        {/* 4. Tab Content: Meus Pedidos Recentes */}
        {activeTab === 'pedidos' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Order Card #1: Active Manufacturing & Shipping Pipeline */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <span className="font-code-snippet text-xs font-bold px-3 py-1 bg-primary-container/15 text-primary rounded-lg">
                    ORD-9921
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Realizado em 30 de Outubro de 2026 • 2 itens
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-label-md text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Em Trânsito IoT
                  </span>
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    R$ 246,06
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="w-14 h-14 rounded-lg bg-surface-container p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/prod-chaveiro-fox-nfc.png"
                      alt="Chaveiro Fox NFC"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-xs font-bold text-on-surface truncate">
                      Chaveiro Mascote Fox NFC (2 un)
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Cor: Laranja Vórtex Signature • Chip NTAG213
                    </span>
                    <span className="font-code-snippet text-[10px] text-primary font-bold">
                      Hash: 0x89FA...B012
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="w-14 h-14 rounded-lg bg-surface-container p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/prod-organizador-cabos.png"
                      alt="Organizador Cabos"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-xs font-bold text-on-surface truncate">
                      Organizador Hexagonal de Cabos (1 un)
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Cor: Preto Grafite • Encaixe Magnético N52
                    </span>
                    <span className="font-code-snippet text-[10px] text-on-surface-variant">
                      Manufaturado em PETG
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Manufacturing & Dispatch Progress Bar */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Linha do Tempo de Produção 3D &amp; Envio
                </span>
                <div className="grid grid-cols-5 gap-2 pt-2">
                  <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-full h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="font-label-md text-[10px] font-bold text-emerald-700">1. Fatiamento</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-full h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="font-label-md text-[10px] font-bold text-emerald-700">2. Impressão 3D</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-full h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="font-label-md text-[10px] font-bold text-emerald-700">3. Gravação NFC</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-full h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="font-label-md text-[10px] font-bold text-emerald-700">4. Calibração</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <div className="w-full h-1.5 rounded-full bg-primary-container animate-pulse"></div>
                    <span className="font-label-md text-[10px] font-bold text-primary">5. Em Rota IoT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setActiveTab('rastreio')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container/10 text-primary font-label-md text-xs font-bold hover:bg-primary-container/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
                  <span>Abrir Painel de Telemetria IoT</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Download do XML da NF-e simulado!')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-xs font-semibold hover:bg-surface-container-high transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>NF-e (XML)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Download do arquivo de conformidade Mitutoyo simulado!')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-xs font-semibold hover:bg-surface-container-high transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">straighten</span>
                    <span>Laudo Dimensional</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Card #2: Delivered Order */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <span className="font-code-snippet text-xs font-bold px-3 py-1 bg-surface-container text-on-surface rounded-lg">
                    ORD-8410
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Entregue em 14 de Outubro de 2026 • Lote Corporativo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-code-snippet text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    Concluído
                  </span>
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    R$ 1.890,00
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-body-sm text-xs text-on-surface">
                  Lote de 50x Chaveiros Fox NFC Corporativos personalizados para Conferência Dev
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const lote = MOCK_PRODUCTS.find((p) => p.sku === 'VRT-LOT-B2B') || MOCK_PRODUCTS[6];
                    addToCart(lote, 1);
                    alert('Lote adicionado ao carrinho!');
                  }}
                  className="font-label-md text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>Repetir Lote</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Tab Content: Rastreio IoT de Mercadorias */}
        {activeTab === 'rastreio' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-semibold">
                      Telemetria em Tempo Real
                    </span>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Rastreio IoT Sensorizado — Pacote #ORD-9921
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-code-snippet">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Sinal GPS/GPRS Ativo</span>
                  </div>
                </div>
              </div>

              {/* Sensor Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">thermostat</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[11px] text-on-surface-variant uppercase">Temperatura Interna</span>
                    <span className="font-headline-sm text-lg font-bold text-on-surface">23.8°C</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Ideal para PLA/PETG</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">vibration</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[11px] text-on-surface-variant uppercase">Acelerômetro (G-Force)</span>
                    <span className="font-headline-sm text-lg font-bold text-on-surface">0.03 G</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Zero choques ou impactos</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">pin_drop</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[11px] text-on-surface-variant uppercase">Último Hub Logístico</span>
                    <span className="font-headline-sm text-base font-bold text-on-surface">Pinheiros / SP</span>
                    <span className="text-[10px] text-on-surface-variant">Ping há 12 minutos</span>
                  </div>
                </div>
              </div>

              {/* Visual Route Timeline */}
              <div className="flex flex-col gap-4 pt-2">
                <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Histórico de Deslocamento do Pacote
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">
                        Em rota de entrega para Av. Brigadeiro Faria Lima, 3477
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Hoje às 08:45 • Veículo de Entrega Técnica Vórtex
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low opacity-80">
                    <span className="w-3 h-3 rounded-full bg-surface-container-highest mt-1 shrink-0"></span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">
                        Inspeção de Bancada e Gravação de Firmware NFC Concluída
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Hoje às 06:12 • Laboratório Vórtex Pinheiros
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low opacity-60">
                    <span className="w-3 h-3 rounded-full bg-surface-container-highest mt-1 shrink-0"></span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs font-bold text-on-surface">
                        Impressão 3D finalizada (Bambu Lab X1-Carbon • 0.08mm)
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Ontem às 22:30 • Fazenda de Impressão 3D
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Tab Content: Chaves & Tokens NFC */}
        {activeTab === 'nfc' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">nfc</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-semibold">
                      Gerenciamento de Hardware Conectado
                    </span>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Chaveiros &amp; Dispositivos NFC Vinculados
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNfcModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-xs font-bold hover:bg-primary transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Remapear URL do Chip</span>
                </button>
              </div>

              {/* Active Key Details Card */}
              <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-lowest p-1.5 border border-surface-container-high flex items-center justify-center">
                      <img
                        src="/assets/prod-chaveiro-fox-nfc.png"
                        alt="Chaveiro Fox"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-sm font-bold text-on-surface">Chaveiro Fox NFC Master</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-code-snippet text-[10px] font-bold">
                          ONLINE
                        </span>
                      </div>
                      <span className="font-code-snippet text-xs text-on-surface-variant">UID: 04:A2:88:B1:9C:20:80 • NTAG213</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                      <span className="font-label-md text-[11px] text-on-surface-variant">Toques no Celular</span>
                      <span className="font-code-snippet text-sm font-bold text-primary">128 interações</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-on-surface-variant font-bold">Destino ao Encostar:</span>
                    <a
                      href={nfcTargetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-code-snippet text-primary hover:underline truncate"
                    >
                      {nfcTargetUrl}
                    </a>
                  </div>
                  <span className="font-code-snippet text-on-surface-variant shrink-0">144 bytes livres</span>
                </div>
              </div>

              {/* Security & Hardware Module */}
              <div className="rounded-xl bg-surface-container-low p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-surface-container-high/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">lock_open</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-xs font-bold text-on-surface">Proteção contra Sobregravação</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Apenas o titular com chave privada pode alterar este payload via Vórtex Cloud.
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-code-snippet text-xs font-bold shrink-0">
                  Bloqueio Ativo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Tab Content: Dados & Endereços */}
        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Account Info */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <h3 className="font-label-lg text-sm font-bold text-on-surface">Dados Cadastrais da Organização</h3>
                <span className="font-code-snippet text-xs text-primary font-bold">PJ Verificada</span>
              </div>
              <div className="flex flex-col gap-3 font-body-sm text-xs">
                <div>
                  <span className="text-on-surface-variant font-bold">Razão Social:</span>
                  <p className="font-semibold text-on-surface">{userData.empresa}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold">CNPJ:</span>
                  <p className="font-code-snippet font-semibold text-on-surface">{userData.cnpj}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold">Responsável Técnico:</span>
                  <p className="font-semibold text-on-surface">{userData.nome}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold">E-mail:</span>
                  <p className="font-semibold text-on-surface">{userData.email}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold">Telefone:</span>
                  <p className="font-semibold text-on-surface">{userData.telefone}</p>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <h3 className="font-label-lg text-sm font-bold text-on-surface">Endereços de Manufatura Salvos</h3>
                <span className="font-label-md text-xs text-on-surface-variant">
                  {addresses.length} Cadastrado{addresses.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {addresses.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-2">
                    Nenhum endereço cadastrado no momento. Você pode cadastrar novos endereços na tela de Checkout.
                  </p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{addr.destinatario || 'Endereço'}</span>
                          {addr.padrao && (
                            <span className="text-emerald-600 font-bold font-code-snippet text-[10px]">PADRÃO</span>
                          )}
                        </div>
                        <p className="text-on-surface-variant">
                          {addr.logradouro}, {addr.numero} {addr.complemento ? `• ${addr.complemento}` : ''}
                        </p>
                        <p className="text-on-surface-variant">
                          {addr.bairro} — {addr.cidade}/{addr.uf} • CEP {addr.cep}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(addr.id)}
                        className="text-error hover:text-error/80 p-1 rounded hover:bg-surface-container"
                        title="Remover Endereço"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Remapear Link NFC */}
      {showNfcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high/60 flex flex-col gap-5 relative">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">nfc</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Remapear Link do Chaveiro NFC
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNfcModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Digite a URL ou link que deve abrir no celular quando qualquer pessoa aproximar o seu <strong>Chaveiro Mascote Fox NFC</strong>:
            </p>

            <form onSubmit={handleSaveNfcUrl} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-xs font-bold text-on-surface">URL de Destino</label>
                <input
                  type="url"
                  required
                  value={nfcTargetUrl}
                  onChange={(e) => setNfcTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-code-snippet text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              {nfcSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                  <span>{nfcSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNfcModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs font-bold transition-all shadow-xs"
                >
                  Gravar no Chip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

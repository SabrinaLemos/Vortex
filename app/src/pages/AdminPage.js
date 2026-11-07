import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';

const INITIAL_ORDERS = [
  {
    id: 'VTX-9821',
    client: 'TechCon 2025 SP',
    clientCategory: 'B2B Corporativo • Evento',
    product: 'Chaveiro Fox NFC Geométrico',
    spec: 'PLA+ Laranja + Logo Laser',
    qty: '120 un',
    nfcType: 'NTAG213 Criptografado',
    status: 'Gravação NFC Concluída',
    statusColor: 'bg-primary-container/15 text-primary',
    uid: '04:8A:2F:1A:B9:71:80',
    payloadUrl: 'https://vortex3d.dev/id/tc25-x40',
    lockBit: 'Password Protected (0xDEADBEEF)',
    shipping: 'Coleta Agendada • Sedex 10 (Amanhã até as 10:00)',
    nozzle: '0.4mm Hardened',
    filament: 'PLA+ Laranja Vórtex'
  },
  {
    id: 'VTX-9820',
    client: 'Studio Lumina Arquitetura',
    clientCategory: 'Design de Interiores',
    product: 'Vasos Paramétricos Origami (32cm)',
    spec: 'PLA+ Bege Areia • Modo Vaso 0.8mm',
    qty: '5 un',
    nfcType: 'Sem chip NFC',
    status: 'Na Fila de Fatiamento',
    statusColor: 'bg-surface-container text-on-surface',
    uid: 'N/A (Peça Mecânica / Decorativa)',
    payloadUrl: 'N/A',
    lockBit: 'Sem chip de dados',
    shipping: 'Transportadora Privada Agendada',
    nozzle: '0.8mm CHT High-Flow',
    filament: 'PLA+ Areia Vórtex'
  },
  {
    id: 'VTX-9819',
    client: 'Eduardo Silveira',
    clientCategory: 'E-commerce Vórtex Shop',
    product: 'Chaveiro Mascote Fox Individual',
    spec: 'Laranja Vórtex + NTAG213 Gravada',
    qty: '1 un',
    nfcType: 'NFC: vCard customizado',
    status: 'Em Trânsito (SS19283BR)',
    statusColor: 'bg-secondary-container text-on-secondary-container',
    uid: '04:B2:3C:99:A1:42:71',
    payloadUrl: 'https://vortex3d.dev/id/eduardo-silveira',
    lockBit: 'Read-Only (Lock Bytes Set)',
    shipping: 'Rastreio Correios: SS192839182BR',
    nozzle: '0.4mm Hardened',
    filament: 'PLA+ Laranja Vórtex'
  },
  {
    id: 'VTX-9818',
    client: 'Fintech Kortex',
    clientCategory: 'B2B Hardware & Dev',
    product: 'Crachás 3D RFID/NFC Dual-Chip',
    spec: 'PETG Fosco + PWA Redirect',
    qty: '50 un',
    nfcType: '100% gravado & testado',
    status: 'Inspeção QA Aprovada',
    statusColor: 'bg-surface-container-high text-on-surface',
    uid: '04:EE:12:88:9C:31:05',
    payloadUrl: 'https://vortex3d.dev/id/kortex-badge-batch',
    lockBit: 'Crypto Auth AES-128',
    shipping: 'Sedex Hoje • Aguardando Emissão NF-e',
    nozzle: '0.4mm Brass',
    filament: 'PETG Fosco Dark Graphite'
  }
];

export default function AdminPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('dashboard-geral');
  const [dateFilter, setDateFilter] = useState('Hoje');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Timer Mock Tick (5s down to 1s)
  const [liveSeconds, setLiveSeconds] = useState(5);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => (prev > 1 ? prev - 1 : 5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Data State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sincronização com o Backend / Banco de Dados
  useEffect(() => {
    let isMounted = true;
    async function carregarDadosFabril() {
      try {
        const ordensBackend = await adminService.listarOrdens();
        if (isMounted && Array.isArray(ordensBackend) && ordensBackend.length > 0) {
          // Normalizar para a estrutura da tabela administrativa
          const normalizadas = ordensBackend.map((o) => ({
            id: o.codigoOrdem || o.id,
            client: o.clienteNome || 'Cliente Corporativo',
            clientCategory: o.categoria || 'Produção Aditiva',
            product: o.produtoTitulo || 'Item Customizado Vórtex',
            spec: o.especificacao || 'FDM / SLA',
            qty: `${o.quantidade} un`,
            nfcType: o.tipoChipNfc || 'N/A',
            status: o.statusFormatado || o.status,
            statusColor: o.status === 'CONCLUIDA' ? 'bg-primary-container/15 text-primary' : 'bg-surface-container text-on-surface',
            uid: o.uidChip || 'N/A',
            payloadUrl: o.urlRedirecionamento || 'N/A',
            lockBit: 'Read-Only Cryptoseal',
            shipping: o.codigoRastreio ? `Rastreio: ${o.codigoRastreio}` : 'Lab Vórtex',
            nozzle: o.bicoExtrusor || '0.4mm',
            filament: o.material || 'PLA+'
          }));
          setOrders(normalizadas);
        }
      } catch (err) {
        console.warn('Backend fabril indisponível, mantendo dados de contingência.', err);
      }
    }
    carregarDadosFabril();
    return () => { isMounted = false; };
  }, []);

  // G-Code Modal State
  const [gcodeModalOpen, setGcodeModalOpen] = useState(false);
  const [gcodeDetails, setGcodeDetails] = useState({ printer: '', file: '' });

  // New Order Modal State
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newServiceType, setNewServiceType] = useState('Chaveiro NFC Lote');
  const [newPrinter, setNewPrinter] = useState('Bambu X1-Carbon #01');
  const [newNfcPayload, setNewNfcPayload] = useState('https://vortex3d.dev/id/');

  // Printer State (Pausing simulation)
  const [printerState, setPrinterState] = useState({
    p1Paused: false,
    p2Paused: false,
    p3Cleaned: false,
    filamentAlertRequested: false
  });

  // NFC Hardware Studio State (Interactive simulation)
  const [nfcStudio, setNfcStudio] = useState({
    uid: '04:8A:2F:1A:B9:71:80',
    url: 'https://vortex3d.dev/id/fox-key-demo',
    lockType: 'password',
    status: 'idle', // 'idle' | 'reading' | 'writing' | 'success'
    lastResult: null
  });

  // API Config State
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [revealedKey, setRevealedKey] = useState(false);

  // Toast notification state
  const [adminToast, setAdminToast] = useState(null);
  const showToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Filter orders by search query
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(query) ||
      o.client.toLowerCase().includes(query) ||
      o.product.toLowerCase().includes(query) ||
      o.nfcType.toLowerCase().includes(query)
    );
  });

  // Handlers
  const openOrderDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeOrderDrawer = () => {
    setDrawerOpen(false);
  };

  const openGcode = (printer, file) => {
    setGcodeDetails({ printer, file });
    setGcodeModalOpen(true);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newClient.trim()) return;

    const newId = `VTX-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = {
      id: newId,
      client: newClient,
      clientCategory: 'Nova O.S. • Produção',
      product: newServiceType,
      spec: `Célula: ${newPrinter}`,
      qty: '10 un',
      nfcType: newNfcPayload ? 'NTAG213 Configurado' : 'Sem chip NFC',
      status: 'Em Fila de Produção',
      statusColor: 'bg-primary-container/15 text-primary',
      uid: '04:' + Math.random().toString(16).substr(2, 2).toUpperCase() + ':AA:BB:CC:DD',
      payloadUrl: newNfcPayload || 'https://vortex3d.dev/id/' + newId.toLowerCase(),
      lockBit: 'Senha Padrão (0x00000000)',
      shipping: 'Em fabricação inicial',
      nozzle: '0.4mm Hardened',
      filament: 'PLA+ Laranja Vórtex'
    };

    setOrders([created, ...orders]);
    setNewClient('');
    setNewOrderModalOpen(false);
    showToast(`Ordem #${newId} criada e despachada para ${newPrinter}!`);
  };

  const handleAuditNfc = () => {
    showToast(`Checksum SHA-256 e assinatura ECDSA do chip ${selectedOrder?.id} validados com sucesso!`);
  };

  // NFC Studio Read simulation
  const handleNfcRead = () => {
    setNfcStudio((prev) => ({ ...prev, status: 'reading' }));
    setTimeout(() => {
      const randomUid = '04:' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':');
      setNfcStudio((prev) => ({
        ...prev,
        uid: randomUid,
        status: 'success',
        lastResult: `Tag NTAG213 detectada (UID: ${randomUid}). Memória: 144 bytes livres.`
      }));
      showToast('Tag NFC lida com sucesso pelo sensor ACR122U!');
    }, 900);
  };

  // NFC Studio Write simulation
  const handleNfcWrite = (e) => {
    e.preventDefault();
    setNfcStudio((prev) => ({ ...prev, status: 'writing' }));
    setTimeout(() => {
      setNfcStudio((prev) => ({
        ...prev,
        status: 'success',
        lastResult: `Gravado com sucesso: "${prev.url}". Lock: ${prev.lockType.toUpperCase()}. Assinatura ECDSA OK.`
      }));
      showToast('Payload NFC gravado e verificado no chip NTAG213!');
    }, 1100);
  };

  // API Ping simulation
  const handleApiPing = () => {
    setApiTesting(true);
    setTimeout(() => {
      setApiTesting(false);
      setApiTestResult({
        status: 200,
        latency: '11ms',
        klipper: 'Connected (Moonraker v0.8.0)',
        sefaz: 'Auth Valid (Cert A1)',
        webnfc: 'Ready (Broker MQTT OK)'
      });
      showToast('Cluster Moonraker & APIs responderam em 11ms (Status 200 OK)!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-sm selection:bg-primary-container selection:text-on-tertiary">
      {/* ================= FIXED TOP HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
        <div className="h-16 w-full px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Lab Operational Badge */}
          <div className="flex items-center gap-4 min-w-fit">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-on-surface-variant"
              title="Menu Lateral"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                alt="Vórtex Logo"
                className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
                src="/assets/vortice-fox-mascot.png"
                onError={(e) => {
                  e.target.src = process.env.PUBLIC_URL + '/assets/vortex-fox-mascot.png';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-[18px] text-on-surface tracking-tight leading-none font-bold">
                  VÓR<span className="text-primary-container">TEX</span>
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant font-mono tracking-wider">
                  LABS &amp; DEV ARCHITECTURE
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full ml-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-label-md text-xs text-on-surface font-medium">
                Lab Operacional // 4 Máquinas Ativas
              </span>
            </div>
          </div>

          {/* Quick Search & Location Selector */}
          <div className="flex-1 max-w-xl hidden md:flex items-center gap-3">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="Buscar pedidos, SKUs de filamento, firmware ou jobs..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low rounded-lg shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">domain</span>
              <select className="bg-transparent font-label-md text-label-md text-on-surface-variant focus:outline-none cursor-pointer pr-1">
                <option>Lab Matriz • SP Alpha</option>
                <option>Hub Fab • Curitiba</option>
                <option>Farm Dev • Remoto</option>
              </select>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Site Navigation Links */}
            <div className="hidden xl:flex items-center gap-2 pr-2 border-r border-surface-container text-xs font-semibold text-on-surface-variant">
              <Link to="/" className="px-2 py-1 rounded hover:text-on-surface hover:bg-surface-container transition-colors">Início</Link>
              <Link to="/catalogo" className="px-2 py-1 rounded hover:text-on-surface hover:bg-surface-container transition-colors">Produtos</Link>
              <Link to="/personalizados" className="px-2 py-1 rounded text-primary hover:text-primary-container hover:bg-surface-container transition-colors font-bold">Personalizados</Link>
              <Link to="/b2b" className="px-2 py-1 rounded hover:text-on-surface hover:bg-surface-container transition-colors">Consultoria Dev</Link>
            </div>

            {/* Storefront Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              title="Voltar à Loja Virtual"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="hidden sm:inline">Loja</span>
            </Link>

            {/* New OS Button */}
            <button
              onClick={() => setNewOrderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-container text-on-tertiary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-opacity"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Nova OS</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => showToast('Nenhum erro crítico de extrusão ou conexão detectado nos últimos 60 minutos.')}
              aria-label="Notificações"
              className="relative p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-1 border-l border-surface-container">
              <div className="hidden text-right lg:flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">
                  Eng. Chefe
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                  MASTER ADMIN
                </span>
              </div>
              <Link
                to="/perfil"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Perfil Master"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex pt-16">
        {/* ================= FIXED / COLLAPSIBLE SIDEBAR ================= */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 bg-surface-container-low z-40 flex flex-col justify-between py-6 px-3 shadow-[0_1px_8px_rgba(0,0,0,0.02)] border-r border-surface-container transition-transform duration-300 lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="px-3">
              <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-mono font-semibold">
                Núcleo Industrial
              </span>
            </div>

            <nav className="flex flex-col gap-1">
              {[
                { id: 'dashboard-geral', icon: 'space_dashboard', label: 'Dashboard Geral' },
                { id: 'fila-de-impressao-3d', icon: 'view_in_ar', label: 'Fila de Impressão 3D' },
                { id: 'gravacao-nfc-e-lotes', icon: 'nfc', label: 'Gravação NFC & Lotes' },
                { id: 'consultoria-dev', icon: 'terminal', label: 'Consultoria Dev' },
                { id: 'gestao-de-estoque-e-filamentos', icon: 'inventory_2', label: 'Gestão de Estoque' },
                { id: 'configuracoes-de-api', icon: 'api', label: 'Configurações de API' }
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-tertiary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined mr-3 text-[20px]">{item.icon}</span>
                    <span className="font-label-lg text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Cluster Status Footer Box */}
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-surface-container rounded-lg border border-surface-container-high">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-surface-variant font-mono">
                  OctoPrint Cluster
                </span>
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              </div>
              <p className="font-code-snippet text-xs text-on-surface mt-1 font-semibold">
                Node 04: 98.4% Temp OK
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container">
              <span className="text-[10px] font-mono uppercase text-on-surface-variant px-1 font-semibold">
                Navegação da Loja
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">home</span>
                  <span>Início</span>
                </Link>
                <Link
                  to="/catalogo"
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">storefront</span>
                  <span>Produtos</span>
                </Link>
                <Link
                  to="/personalizados"
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">layers</span>
                  <span>Custom CAD</span>
                </Link>
                <Link
                  to="/b2b"
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">business</span>
                  <span>B2B Dev</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-30 lg:hidden"
          />
        )}

        {/* ================= MAIN CONTENT: DEDICATED FULL VIEWS ================= */}
        <main className="flex-1 lg:pl-64 w-full bg-surface py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* ================= TOP HERO SECTION (CONTEXTUAL BY ACTIVE TAB) ================= */}
          <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-2xl shadow-sm border border-surface-container">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary text-label-md font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse mr-1.5"></span>
                  LAB PINHEIROS • SP-01
                </span>
                <span className="font-label-md text-xs text-on-surface-variant font-mono">
                  {activeTab === 'dashboard-geral' && 'CLI: v2.4.9 | KLIPPER CLUSTER OK'}
                  {activeTab === 'fila-de-impressao-3d' && 'OCTOPRINT // 4 NODES SYNCHRONIZED'}
                  {activeTab === 'gravacao-nfc-e-lotes' && 'HARDWARE WRITER // ACR122U USB-NFC'}
                  {activeTab === 'consultoria-dev' && 'RUST DAEMON & MOONRAKER API v1.2'}
                  {activeTab === 'gestao-de-estoque-e-filamentos' && 'ESTOQUE FÍSICO // 18 CARRETÉIS'}
                  {activeTab === 'configuracoes-de-api' && 'GATEWAY DE API // CLUSTER SSL SECURE'}
                </span>
              </div>
              <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-bold">
                {activeTab === 'dashboard-geral' && 'Painel de Telemetria • Olá, Vinícius'}
                {activeTab === 'fila-de-impressao-3d' && 'Fila de Impressão 3D & Farm Klipper'}
                {activeTab === 'gravacao-nfc-e-lotes' && 'Gravação Criptográfica NFC & Lotes'}
                {activeTab === 'consultoria-dev' && 'Pipeline Dev & Consultoria de Software'}
                {activeTab === 'gestao-de-estoque-e-filamentos' && 'Gestão de Estoque & Matéria-Prima'}
                {activeTab === 'configuracoes-de-api' && 'Configurações de API & Webhooks'}
              </h1>
              <p className="font-body-sm text-sm text-on-surface-variant">
                {activeTab === 'dashboard-geral' && 'Operação integrada: 4 células de manufatura aditiva ativas e 3 clusters de software sincronizados.'}
                {activeTab === 'fila-de-impressao-3d' && 'Monitoramento individual de bicos, mesas aquecidas, fatiamentos OrcaSlicer e paradas para inserção de chip.'}
                {activeTab === 'gravacao-nfc-e-lotes' && 'Ferramenta de encoder por aproximação, leitor de UID NTAG213, injeção de URLs seguras e hash ECDSA.'}
                {activeTab === 'consultoria-dev' && 'Acompanhamento de sprints corporativas, microserviços em Rust/Go, SLA de cloud e repositórios GitHub.'}
                {activeTab === 'gestao-de-estoque-e-filamentos' && 'Controle de peso remanescente, umidade em estufa e reposição rápida com a 3D Fila SP.'}
                {activeTab === 'configuracoes-de-api' && 'Gerenciamento de credenciais de produção, Webhooks de checkout, certificados SEFAZ e handshake de telemetria.'}
              </p>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center bg-surface-container rounded-lg p-1">
                {['Hoje', '7 Dias', 'Este Mês'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateFilter(range)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      dateFilter === range
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Live Timer Counter */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-xs border border-surface-container">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                <span className="font-label-md text-xs font-mono text-on-surface font-semibold">
                  LIVE {liveSeconds}s
                </span>
              </div>

              {/* Action Button */}
              {activeTab === 'configuracoes-de-api' ? (
                <button
                  onClick={handleApiPing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:opacity-90 text-on-tertiary rounded-lg font-label-lg text-xs font-semibold transition-all shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Testar Handshake API</span>
                </button>
              ) : (
                <button
                  onClick={() => setNewOrderModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:opacity-90 text-on-tertiary rounded-lg font-label-lg text-xs font-semibold transition-all shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Criar Nova O.S.</span>
                </button>
              )}
            </div>
          </section>

          {/* =========================================================================
              VIEW 1: DASHBOARD GERAL (Visão Executiva Completa)
          ========================================================================== */}
          {activeTab === 'dashboard-geral' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 5 KPI Metric Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-mono tracking-wider">
                      Receita Mensal
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-primary-container/15 text-primary font-semibold">
                      +18.4%
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="font-headline-md text-2xl text-on-surface font-bold">
                      R$ 48.750<span className="text-sm font-normal text-on-surface-variant">,00</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                      <span>Hardware / NFC: 62%</span>
                      <span>Dev: 38%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden flex">
                      <div className="bg-primary-container h-full" style={{ width: '62%' }}></div>
                      <div className="bg-secondary h-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
                    <span>Meta est. atingida (94%)</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-mono tracking-wider">
                      Ocupação Farm 3D
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-primary-container/15 text-primary font-semibold">
                      87% Taxa
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="font-headline-md text-2xl text-on-surface font-bold">14 Peças</div>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      4 de 4 impressoras operando
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
                    </div>
                    <span className="font-label-md text-xs text-on-surface-variant font-mono">
                      1 em pós-cura UV
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-mono tracking-wider">
                      Tags NFC NTAG213
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-surface-container text-on-surface-variant">
                      99.98% QA
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="font-headline-md text-2xl text-on-surface font-bold">
                      1.280 <span className="text-xs font-normal text-on-surface-variant">tags</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      0.02% erro de gravação
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">nfc</span>
                    <span>Assinatura ECDSA ativa</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-mono tracking-wider">
                      Engenharia Dev
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-secondary/15 text-secondary font-semibold">
                      Sprint 04
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="font-headline-md text-2xl text-on-surface font-bold">
                      94h <span className="text-xs font-normal text-on-surface-variant">faturadas</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      3 clientes corporativos
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
                    <span>Burn rate 100% nominal</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className="font-label-md text-xs text-on-surface-variant uppercase font-mono tracking-wider">
                      Ticket Médio
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">sell</span>
                  </div>
                  <div className="my-3">
                    <div className="font-headline-md text-2xl text-on-surface font-bold">
                      R$ 184<span className="text-sm font-normal text-on-surface-variant">,50</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      B2B Corporativo (Lotes)
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono">
                    <span>Varejo: R$ 68,00</span>
                    <span className="text-primary font-semibold">324 pedidos</span>
                  </div>
                </div>
              </section>

              {/* Grid: Active Farm Overview + Filament Stock Overview */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[26px]">
                        precision_manufacturing
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-xl text-on-surface font-bold">
                          Telemetria Klipper &amp; OctoPrint
                        </h2>
                        <p className="font-body-sm text-xs text-on-surface-variant">
                          Monitoramento de bico, mesa e taxa de extrusão por célula
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('fila-de-impressao-3d')}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Abrir Farm Completa</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bambu */}
                    <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-label-md text-xs font-mono text-on-surface-variant">NODE #01</span>
                          <h3 className="font-label-lg text-base text-on-surface font-bold">Bambu Lab X1-Carbon</h3>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-semibold">
                          74% Imprimindo
                        </span>
                      </div>
                      <p className="text-xs text-on-surface font-medium truncate">Lote 40x Chaveiro Fox NFC</p>
                      <div className="w-full bg-surface-container-high rounded-full h-2 mt-3 overflow-hidden">
                        <div className="bg-primary-container h-full" style={{ width: '74%' }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mt-3">
                        <span>Extrusor: 215°C</span>
                        <span className="text-primary font-bold">~42 min restam</span>
                      </div>
                    </div>

                    {/* Voron */}
                    <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-label-md text-xs font-mono text-on-surface-variant">NODE #02</span>
                          <h3 className="font-label-lg text-base text-on-surface font-bold">Voron 2.4 (350mm³)</h3>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-semibold">
                          41% Imprimindo
                        </span>
                      </div>
                      <p className="text-xs text-on-surface font-medium truncate">Case Protetor Raspberry Pi IoT Gateway</p>
                      <div className="w-full bg-surface-container-high rounded-full h-2 mt-3 overflow-hidden">
                        <div className="bg-primary-container h-full" style={{ width: '41%' }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mt-3">
                        <span>Extrusor: 255°C</span>
                        <span className="text-primary font-bold">~2h 15m restam</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Quick Card */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">inventory_2</span>
                        <h2 className="font-headline-sm text-xl text-on-surface font-bold">Estoque de Filamentos</h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('gestao-de-estoque-e-filamentos')}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Gerenciar
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-4">18 carretéis ativos • Consumo 24h: 1.84 kg</p>

                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>PLA+ Laranja Vórtex</span>
                          <span>2.1 kg (3 carretéis)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary-container h-full" style={{ width: '32%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>ABS Carbon Fiber</span>
                          <span>4.8 kg (5 carretéis)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>PETG Fosco Cinza</span>
                          <span>3.5 kg (4 carretéis)</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className="bg-on-surface-variant h-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Fornecedor: 3D Fila SP</span>
                    <span className="text-primary font-bold">Entrega 24h</span>
                  </div>
                </div>
              </section>

              {/* Fila de Produção Table Overview */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">view_timeline</span>
                    <h2 className="font-headline-sm text-xl text-on-surface font-bold">
                      Fila de Produção &amp; Gravação NFC
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('gravacao-nfc-e-lotes')}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Ver Lotes NFC &amp; Encoder</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-mono text-xs uppercase">
                        <th className="py-2.5 px-3 rounded-l-lg">ID Pedido</th>
                        <th className="py-2.5 px-3">Cliente</th>
                        <th className="py-2.5 px-3">Produto</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 rounded-r-lg text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-xs">
                      {filteredOrders.slice(0, 4).map((o) => (
                        <tr key={o.id} className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-3 font-mono font-bold text-primary">#{o.id}</td>
                          <td className="py-3 px-3 font-semibold text-on-surface">{o.client}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{o.product}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${o.statusColor}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => openOrderDrawer(o)}
                              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold"
                            >
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: FILA DE IMPRESSÃO 3D (Tela Dedicada)
          ========================================================================== */}
          {activeTab === 'fila-de-impressao-3d' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Contextual Metric Cards for 3D Printing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Ocupação da Farm</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">4 / 4 Células</div>
                  <span className="text-[11px] text-primary font-semibold">100% de ocupação nominal</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Jobs em Execução</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">14 Peças</div>
                  <span className="text-[11px] text-on-surface-variant font-mono">2 FDM, 1 Pós-Cura, 1 Standby</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Taxa de Sucesso Z</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">99.1%</div>
                  <span className="text-[11px] text-secondary font-semibold">Mesh leveling 36 pontos</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Tempo Médio Job</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">2h 45m</div>
                  <span className="text-[11px] text-on-surface-variant">Velocidade média: 240mm/s</span>
                </div>
              </div>

              {/* 4 Interactive Printer Cards with full controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Printer 1: Bambu X1C */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container"></div>
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant">NODE #01 • FDM CORE-XY</span>
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">Bambu Lab X1-Carbon</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-bold">
                        {printerState.p1Paused ? 'PAUSADO' : 'IMPRIMINDO (74%)'}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl mb-4">
                      <p className="font-semibold text-sm text-on-surface">Lote 40x Chaveiro Fox NFC Geométrico</p>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        PLA+ Laranja Vórtex • 0.16mm High-Speed • Bocal 0.4mm
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                        <span>Camadas: 342 / 460</span>
                        <span>Tempo restante: ~42 min</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                        <div className="bg-primary-container h-full" style={{ width: '74%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">EXTRUSOR</span>
                        <span className="font-bold text-on-surface">215°C / 220°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">MESA</span>
                        <span className="font-bold text-on-surface">60°C / 60°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">VENTOINHA</span>
                        <span className="font-bold text-primary">100% (Part Cooling)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-container">
                    <button
                      onClick={() => openGcode('Bambu X1-C #01', 'VORTEX_FOX_BATCH40_NFC.gcode')}
                      className="px-3 py-1.5 text-xs font-semibold bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface transition-colors"
                      type="button"
                    >
                      Inspecionar G-Code
                    </button>
                    <button
                      onClick={() => {
                        setPrinterState((prev) => ({ ...prev, p1Paused: !prev.p1Paused }));
                        showToast(printerState.p1Paused ? 'Bambu X1-C retomada!' : 'Bambu X1-C pausada.');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary-container text-on-tertiary rounded-lg hover:opacity-90 transition-opacity"
                      type="button"
                    >
                      {printerState.p1Paused ? 'Retomar Job' : 'Pausar Extrusão'}
                    </button>
                  </div>
                </div>

                {/* Printer 2: Voron 2.4 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary"></div>
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant">NODE #02 • ENCLOSED HEATED</span>
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">Voron 2.4 (350mm³)</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-bold">
                        {printerState.p2Paused ? 'PAUSADO' : 'IMPRIMINDO (41%)'}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl mb-4">
                      <p className="font-semibold text-sm text-on-surface">Case Protetor Raspberry Pi IoT Gateway</p>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        ABS Carbon Fibra Preto • 0.20mm Rígido • Câmara 50°C
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                        <span>Camadas: 180 / 440</span>
                        <span>Tempo restante: ~2h 15m</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                        <div className="bg-primary-container h-full" style={{ width: '41%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">EXTRUSOR</span>
                        <span className="font-bold text-on-surface">255°C / 255°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">CÂMARA</span>
                        <span className="font-bold text-on-surface">50°C / 50°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">VELOCIDADE</span>
                        <span className="font-bold text-secondary">300 mm/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-container">
                    <button
                      onClick={() => openGcode('Voron 2.4 #02', 'RPI_IOT_CASE_ABS_CF.gcode')}
                      className="px-3 py-1.5 text-xs font-semibold bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface transition-colors"
                      type="button"
                    >
                      Inspecionar G-Code
                    </button>
                    <button
                      onClick={() => {
                        setPrinterState((prev) => ({ ...prev, p2Paused: !prev.p2Paused }));
                        showToast(printerState.p2Paused ? 'Voron 2.4 retomada!' : 'Voron 2.4 pausada.');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary-container text-on-tertiary rounded-lg hover:opacity-90 transition-opacity"
                      type="button"
                    >
                      {printerState.p2Paused ? 'Retomar Job' : 'Pausar Extrusão'}
                    </button>
                  </div>
                </div>

                {/* Printer 3: Prusa MK4 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container"></div>
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant">NODE #03 • INPUT SHAPING</span>
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">Original Prusa MK4</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-surface-container-high text-on-surface font-bold">
                        {printerState.p3Cleaned ? 'STANDBY / CALIBRADA' : 'FASE FINAL (92%)'}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl mb-4">
                      <p className="font-semibold text-sm text-on-surface">Suporte Magnético MagSafe Articulado</p>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        PETG Fosco Cinza • 0.15mm • Nextruder Load Cell
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                        <span>Camadas: {printerState.p3Cleaned ? '554 / 554' : '510 / 554'}</span>
                        <span>{printerState.p3Cleaned ? 'Concluído' : '~8 min restam'}</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary-container h-full"
                          style={{ width: printerState.p3Cleaned ? '100%' : '92%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">EXTRUSOR</span>
                        <span className="font-bold text-on-surface">235°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">MESA</span>
                        <span className="font-bold text-on-surface">80°C</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">MESH VARIANCE</span>
                        <span className="font-bold text-primary">0.012mm</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-container">
                    <button
                      onClick={() => showToast('Prusa MK4: Calibração de malha OK, sensor Nextruder aferido.')}
                      className="px-3 py-1.5 text-xs font-semibold bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface transition-colors"
                      type="button"
                    >
                      Aferir Nivelamento
                    </button>
                    <button
                      onClick={() => {
                        setPrinterState((prev) => ({ ...prev, p3Cleaned: true }));
                        showToast('Cama magnética liberada e pronta para o próximo job.');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary-container text-on-tertiary rounded-lg hover:opacity-90 transition-opacity"
                      type="button"
                    >
                      Liberar Cama
                    </button>
                  </div>
                </div>

                {/* Printer 4: Elegoo Saturn */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary-fixed-dim"></div>
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant">NODE #04 • SLA / DLP 8K</span>
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">Elegoo Saturn 8K Resina</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-secondary-container text-on-secondary-container font-bold">
                        PÓS-CURA UV (100%)
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl mb-4">
                      <p className="font-semibold text-sm text-on-surface">Miniatura Mascote Fox Colecionável</p>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        Resina UV Alta Precisão HD • 0.05mm • Lavagem Concluída
                      </p>
                    </div>

                    <div className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">water_voc</span>
                        <div>
                          <span className="text-xs font-bold block">Lavagem em Álcool Isopropílico OK</span>
                          <span className="text-[11px] text-on-surface-variant">Pronta para selagem do chip NFC</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">TANQUE RESINA</span>
                        <span className="font-bold text-on-surface">320ml livre</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">TEMPO DE CURA</span>
                        <span className="font-bold text-on-surface">12m 00s concluídos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-container">
                    <button
                      onClick={() => setActiveTab('gravacao-nfc-e-lotes')}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary-container text-on-tertiary rounded-lg hover:opacity-90 transition-opacity"
                      type="button"
                    >
                      Gravar Tag NFC da Peça
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: GRAVAÇÃO NFC & LOTES (Tela Dedicada)
          ========================================================================== */}
          {activeTab === 'gravacao-nfc-e-lotes' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Contextual Metric Cards for NFC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Chips NTAG213 Gravados</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">1.840 un</div>
                  <span className="text-[11px] text-primary font-semibold">100% integridade MD5 verificada</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Hardware de Gravação</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">ACR122U USB</div>
                  <span className="text-[11px] text-secondary font-semibold">WebNFC Broker Conectado</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Assinatura de Segurança</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">ECDSA P-256</div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Anti-spoofing ativo</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Taxa de Erro de Escrita</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">0.02%</div>
                  <span className="text-[11px] text-on-surface-variant">1 re-gravação em 5.000 tags</span>
                </div>
              </div>

              {/* NFC Hardware Encoder Studio (Interactive Tool) */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">contactless</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-xl text-on-surface font-bold">
                        Estúdio de Gravação &amp; Leitura NFC por Aproximação
                      </h2>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Interface direta com a leitora USB ACR122U / WebNFC API para injeção de payload criptografado.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-bold">
                    CANAL ABERTO • 13.56 MHz
                  </span>
                </div>

                <form onSubmit={handleNfcWrite} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-on-surface block mb-1">
                          Tag UID (Leitura de Hardware)
                        </label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                            value={nfcStudio.uid}
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={handleNfcRead}
                            disabled={nfcStudio.status === 'reading'}
                            className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-xs font-semibold rounded-lg text-on-surface transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">sensors</span>
                            <span>{nfcStudio.status === 'reading' ? 'Lendo...' : 'Ler Chip'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-on-surface block mb-1">
                          Tipo de Proteção / Lock Bit
                        </label>
                        <select
                          className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                          value={nfcStudio.lockType}
                          onChange={(e) => setNfcStudio({ ...nfcStudio, lockType: e.target.value })}
                        >
                          <option value="password">Password Protected (0xDEADBEEF)</option>
                          <option value="readonly">Read-Only (Trava Física Definitiva)</option>
                          <option value="aes">Token Criptográfico AES-128 Dinâmico</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-on-surface block mb-1">
                        Payload URL / vCard / Web App Redirection
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container font-mono"
                        placeholder="https://vortex3d.dev/id/..."
                        type="url"
                        required
                        value={nfcStudio.url}
                        onChange={(e) => setNfcStudio({ ...nfcStudio, url: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-on-surface-variant font-mono">
                        NDEF Record: 1 URI • Tamanho estimado: 48 bytes (Max: 144 bytes)
                      </span>
                      <button
                        type="submit"
                        disabled={nfcStudio.status === 'writing'}
                        className="px-5 py-2.5 bg-primary-container text-on-tertiary rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                        <span>{nfcStudio.status === 'writing' ? 'Gravando no Chip...' : 'Gravar no Chip NFC'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Encoder Visual Feedback */}
                  <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-on-surface-variant uppercase font-semibold">
                        Status do Encoder ACR122U
                      </span>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center border border-surface-container">
                          <span className={`material-symbols-outlined text-[28px] ${nfcStudio.status === 'writing' ? 'text-primary-container animate-spin' : 'text-primary'}`}>
                            nfc
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">
                            {nfcStudio.status === 'writing' && 'Escrevendo na memória...'}
                            {nfcStudio.status === 'reading' && 'Buscando campo RF...'}
                            {nfcStudio.status !== 'writing' && nfcStudio.status !== 'reading' && 'Pronto para Gravação'}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            Antena sintonizada a 106 kbps
                          </span>
                        </div>
                      </div>

                      {nfcStudio.lastResult && (
                        <div className="mt-4 p-2.5 bg-surface-container-lowest rounded-lg font-mono text-[11px] text-on-surface border border-surface-container leading-relaxed">
                          {nfcStudio.lastResult}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant font-mono">
                      <span>Certificação: ISO/IEC 14443 Type A</span>
                      <span className="text-primary font-bold">QA 100%</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Dedicated NFC Orders Table */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      Ordens de Fabricação com Chips NFC Ativos
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Rastreio de Tag UID, status de injeção de vCard e lote de entrega.
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Arquivo CSV com todos os UIDs e Hashes baixado!')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold flex items-center gap-1.5 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Exportar Hashes</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-mono text-xs uppercase">
                        <th className="py-2.5 px-3 rounded-l-lg">Pedido</th>
                        <th className="py-2.5 px-3">Cliente</th>
                        <th className="py-2.5 px-3">Tag UID</th>
                        <th className="py-2.5 px-3">Payload URL</th>
                        <th className="py-2.5 px-3">Lock Bit</th>
                        <th className="py-2.5 px-3 rounded-r-lg text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-xs">
                      {filteredOrders.filter((o) => o.nfcType.toLowerCase().includes('nfc') || o.nfcType.toLowerCase().includes('ntag')).map((o) => (
                        <tr key={o.id} className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-3 font-mono font-bold text-primary">#{o.id}</td>
                          <td className="py-3 px-3 font-semibold text-on-surface">{o.client}</td>
                          <td className="py-3 px-3 font-mono text-on-surface">{o.uid}</td>
                          <td className="py-3 px-3 font-mono text-primary truncate max-w-[200px]">{o.payloadUrl}</td>
                          <td className="py-3 px-3 font-mono text-on-surface-variant">{o.lockBit}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => openOrderDrawer(o)}
                              className="px-2.5 py-1 bg-primary-container text-on-tertiary rounded text-xs font-semibold hover:opacity-90"
                            >
                              Auditar Chip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: CONSULTORIA DEV (Tela Dedicada)
          ========================================================================== */}
          {activeTab === 'consultoria-dev' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Contextual Metric Cards for Software Dev */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Horas Faturadas (Mês)</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">94h / 120h</div>
                  <span className="text-[11px] text-primary font-semibold">Sprint 04 em andamento</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">SLA Microserviços</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">99.98%</div>
                  <span className="text-[11px] text-secondary font-semibold">Cloudflare Workers + Go</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Vazão de Requisições</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">4.2k req/min</div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Pico de 12.8k na Black Friday</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Clientes Corporativos</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">3 Contratos</div>
                  <span className="text-[11px] text-on-surface-variant">Kortex ID, Studio Lumina, TechCon</span>
                </div>
              </div>

              {/* Projects Detailed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-secondary/15 text-secondary font-bold">
                        PWA CLIENT
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">Sprint 3/4</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Kortex ID WebApp</h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      Aplicação web progressiva para leitura e gravação de vCard via WebNFC API sem necessidade de aplicativo nativo na App Store.
                    </p>

                    <div className="mt-4 p-3 bg-surface-container-low rounded-xl font-mono text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Framework:</span>
                        <span className="font-semibold text-on-surface">Next.js 14 + Tailwind</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Runtime:</span>
                        <span className="font-semibold text-on-surface">Cloudflare Edge</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Latência:</span>
                        <span className="font-semibold text-primary">18ms (Global CDN)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-container">
                    <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                      <span>Progresso da Sprint</span>
                      <span className="font-bold text-secondary">82%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-secondary h-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary-container/15 text-primary font-bold">
                        CORE SLICER API
                      </span>
                      <span className="text-xs font-mono text-primary font-bold">99.98% SLA</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Vórtex Slicer Cloud</h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      Microsserviço em Go com motor OrcaSlicer headless para cálculo instantâneo de tempo de impressão e gramatura no checkout.
                    </p>

                    <div className="mt-4 p-3 bg-surface-container-low rounded-xl font-mono text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Linguagem:</span>
                        <span className="font-semibold text-on-surface">Go 1.22 + C++ Engine</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Workers:</span>
                        <span className="font-semibold text-on-surface">8 Pods Kubernetes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Vazão:</span>
                        <span className="font-semibold text-primary">4.2k req/min</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-container">
                    <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                      <span>Testes de Carga &amp; Stress</span>
                      <span className="font-bold text-primary">95%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-primary-container h-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-surface-container-high text-on-surface font-bold">
                        RUST DAEMON
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">v1.2.0</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">Telemetry Daemon</h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      Agente embarcado em Raspberry Pi nas impressoras, enviando telemetria em tempo real via WebSockets para o cluster Klipper.
                    </p>

                    <div className="mt-4 p-3 bg-surface-container-low rounded-xl font-mono text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Binário:</span>
                        <span className="font-semibold text-on-surface">Rust (Cross-ARM64)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Consumo RAM:</span>
                        <span className="font-semibold text-on-surface">8.4 MB / Raspberry Pi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Latência:</span>
                        <span className="font-semibold text-primary">12ms MQTT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-container">
                    <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1">
                      <span>Disponibilidade dos Nós</span>
                      <span className="font-bold text-on-surface">100%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-on-surface h-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Repos & CI/CD Pipeline Section */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[24px]">terminal</span>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      Repositórios de Código &amp; Deploys Contínuos
                    </h3>
                  </div>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Abrir GitHub Organization</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">vortex3d/slicer-cloud-core</span>
                      <span className="text-on-surface-variant text-[11px]">commit #8f92a1: Add filament density lookup cache</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      BUILD PASSING ✓
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">vortex3d/pwa-nfc-keyring</span>
                      <span className="text-on-surface-variant text-[11px]">commit #d401e2: WebNFC NDEF writer cross-browser polyfill</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      BUILD PASSING ✓
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">vortex3d/moonraker-telemetry-daemon</span>
                      <span className="text-on-surface-variant text-[11px]">commit #109fa7: Fix sensorless homing telemetry spike</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      DEPLOYED PROD ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: GESTÃO DE ESTOQUE (Tela Dedicada)
          ========================================================================== */}
          {activeTab === 'gestao-de-estoque-e-filamentos' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Contextual Metric Cards for Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Total em Estoque</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">18 Carretéis</div>
                  <span className="text-[11px] text-primary font-semibold">14.8 kg de filamento + resina</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Consumo Diário Estimado</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">1.84 kg / dia</div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Autonomia de 8 dias</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Alertas Críticos</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-tertiary">1 Carretel</div>
                  <span className="text-[11px] text-tertiary font-bold">PLA+ Laranja abaixo de 300g</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Fornecedor Homologado</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">3D Fila SP</div>
                  <span className="text-[11px] text-secondary font-semibold">Entrega expressa em 24h</span>
                </div>
              </div>

              {/* Critical Alert Banner */}
              <div className="bg-surface-container-high p-6 rounded-2xl border border-surface-container relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-tertiary-container text-[32px] shrink-0">
                      warning
                    </span>
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                        Alerta de Estoque: Reposição Imediata de Filamento
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        O carretel <strong className="text-on-surface">PLA+ Laranja Vórtex (#01-ORANGE)</strong> possui apenas <strong className="text-tertiary font-mono">280g restantes</strong>, insuficiente para concluir os próximos lotes de chaveiros NFC.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPrinterState((prev) => ({ ...prev, filamentAlertRequested: true }));
                      showToast('Pedido de reposição de 2x carretéis PLA+ Laranja enviado ao fornecedor!');
                    }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                      printerState.filamentAlertRequested
                        ? 'bg-primary-container text-on-tertiary'
                        : 'bg-primary text-on-primary hover:opacity-95'
                    }`}
                  >
                    {printerState.filamentAlertRequested ? 'Pedido de Reposição Enviado ✓' : 'Solicitar Carretel Reserva (3D Fila)'}
                  </button>
                </div>
              </div>

              {/* Detailed Inventory Table */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Inventário de Matérias-Primas do Laboratório
                  </h3>
                  <button
                    onClick={() => showToast('Contagem de estoque atualizada com balança inteligente!')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">scale</span>
                    <span>Sincronizar Balanças</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-mono text-xs uppercase">
                        <th className="py-2.5 px-3 rounded-l-lg">Material &amp; SKU</th>
                        <th className="py-2.5 px-3">Cor / Acabamento</th>
                        <th className="py-2.5 px-3">Diâmetro</th>
                        <th className="py-2.5 px-3">Carretéis</th>
                        <th className="py-2.5 px-3">Peso Total</th>
                        <th className="py-2.5 px-3">Nível</th>
                        <th className="py-2.5 px-3 rounded-r-lg text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-xs">
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-3 font-semibold text-on-surface">PLA+ Vórtex High-Speed</td>
                        <td className="py-3 px-3 font-mono text-primary font-bold">Laranja Vórtex</td>
                        <td className="py-3 px-3 font-mono">1.75 mm</td>
                        <td className="py-3 px-3 font-mono">3 unidades</td>
                        <td className="py-3 px-3 font-mono font-bold text-tertiary">2.1 kg (280g ativo)</td>
                        <td className="py-3 px-3 w-36">
                          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-tertiary h-full" style={{ width: '32%' }}></div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Carretel PLA+ Laranja requisitado!')}
                            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-on-surface"
                          >
                            Pedir Mais
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-3 font-semibold text-on-surface">ABS Carbon Fiber Rígido</td>
                        <td className="py-3 px-3 font-mono text-on-surface">Preto Grafite Carbon</td>
                        <td className="py-3 px-3 font-mono">1.75 mm</td>
                        <td className="py-3 px-3 font-mono">5 unidades</td>
                        <td className="py-3 px-3 font-mono font-bold text-on-surface">4.8 kg</td>
                        <td className="py-3 px-3 w-36">
                          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-secondary h-full" style={{ width: '78%' }}></div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Estoque de ABS-CF em nível seguro.')}
                            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-on-surface"
                          >
                            Estável
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-3 font-semibold text-on-surface">PETG Fosco Técnico</td>
                        <td className="py-3 px-3 font-mono text-on-surface-variant">Cinza Areia Fosco</td>
                        <td className="py-3 px-3 font-mono">1.75 mm</td>
                        <td className="py-3 px-3 font-mono">4 unidades</td>
                        <td className="py-3 px-3 font-mono font-bold text-on-surface">3.5 kg</td>
                        <td className="py-3 px-3 w-36">
                          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-on-surface-variant h-full" style={{ width: '60%' }}></div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Estoque de PETG em nível seguro.')}
                            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-on-surface"
                          >
                            Estável
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-3 font-semibold text-on-surface">Resina UV 8K Standard</td>
                        <td className="py-3 px-3 font-mono text-secondary">Cinza Escultura HD</td>
                        <td className="py-3 px-3 font-mono">405 nm</td>
                        <td className="py-3 px-3 font-mono">6 garrafas</td>
                        <td className="py-3 px-3 font-mono font-bold text-on-surface">2.4 Litros</td>
                        <td className="py-3 px-3 w-36">
                          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-primary-container h-full" style={{ width: '85%' }}></div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Estoque de Resina 8K em nível seguro.')}
                            className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold text-on-surface"
                          >
                            Estável
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: CONFIGURAÇÕES DE API (Tela Dedicada)
          ========================================================================== */}
          {activeTab === 'configuracoes-de-api' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Contextual Metric Cards for API */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Gateway de API</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-primary">Operacional</div>
                  <span className="text-[11px] text-primary font-semibold">Latência média: 11ms</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Taxa de Erro HTTP</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">0.001%</div>
                  <span className="text-[11px] text-secondary font-semibold">99.98% de chamadas 200 OK</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Webhooks Ativos</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">4 Endpoints</div>
                  <span className="text-[11px] text-on-surface-variant font-mono">SEFAZ, Checkout, Moonraker</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="text-xs text-on-surface-variant font-mono uppercase">Chaves em Produção</span>
                  <div className="font-headline-md text-2xl font-bold mt-1 text-on-surface">3 Tokens</div>
                  <span className="text-[11px] text-on-surface-variant">Rotação programada em 45 dias</span>
                </div>
              </div>

              {/* Handshake & Ping Simulator Box */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">network_check</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                        Handshake &amp; Diagnóstico de Sensores Moonraker
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Envie um pacote ping de telemetria aos nós locais e valide os certificados de autenticação.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleApiPing}
                    disabled={apiTesting}
                    className="px-4 py-2 bg-primary-container text-on-tertiary rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${apiTesting ? 'animate-spin' : ''}`}>
                      refresh
                    </span>
                    <span>{apiTesting ? 'Testando Conexão...' : 'Executar Teste de Ping'}</span>
                  </button>
                </div>

                {apiTestResult && (
                  <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs animate-fadeIn">
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">STATUS HTTP</span>
                      <span className="font-bold text-primary">200 OK (Handshake Válido)</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">MOONRAKER KLIPPER</span>
                      <span className="font-bold text-on-surface">{apiTestResult.klipper}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">CERTIFICADO SEFAZ</span>
                      <span className="font-bold text-on-surface">{apiTestResult.sefaz}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">LATÊNCIA IDA E VOLTA</span>
                      <span className="font-bold text-primary">{apiTestResult.latency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* API Keys Management */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Chaves de Autenticação de Produção
                  </h3>
                  <button
                    onClick={() => setRevealedKey(!revealedKey)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {revealedKey ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>{revealedKey ? 'Ocultar Chaves' : 'Revelar Chaves'}</span>
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-surface-container">
                    <div>
                      <span className="font-bold text-on-surface block">MOONRAKER_CLUSTER_API_KEY</span>
                      <span className="text-on-surface-variant text-[11px]">
                        Utilizada pelos Daemons locais nas Raspberry Pi para envio de telemetria
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-container-lowest rounded border border-surface-container text-primary font-bold">
                        {revealedKey ? 'vtx_live_klipper_88a7192bcfa0' : 'vtx_live_••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('vtx_live_klipper_88a7192bcfa0');
                          showToast('Chave Moonraker copiada!');
                        }}
                        className="p-1.5 hover:bg-surface-container rounded"
                        title="Copiar"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-surface-container">
                    <div>
                      <span className="font-bold text-on-surface block">WEBNFC_AUTHENTICATION_SECRET</span>
                      <span className="text-on-surface-variant text-[11px]">
                        Assinatura ECDSA P-256 para gravação de vCard e lock bytes seguros
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-container-lowest rounded border border-surface-container text-secondary font-bold">
                        {revealedKey ? 'vtx_nfc_sec_key_41b988f01c22' : 'vtx_nfc_••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('vtx_nfc_sec_key_41b988f01c22');
                          showToast('Chave WebNFC copiada!');
                        }}
                        className="p-1.5 hover:bg-surface-container rounded"
                        title="Copiar"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-surface-container">
                    <div>
                      <span className="font-bold text-on-surface block">SEFAZ_NFE_A1_CERT_TOKEN</span>
                      <span className="text-on-surface-variant text-[11px]">
                        Transmissão instantânea de Nota Fiscal eletrônica modelo 55
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-surface-container-lowest rounded border border-surface-container text-on-surface font-bold">
                        {revealedKey ? 'sefaz_cert_a1_sp_099182aa' : 'sefaz_••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('sefaz_cert_a1_sp_099182aa');
                          showToast('Token SEFAZ copiado!');
                        }}
                        className="p-1.5 hover:bg-surface-container rounded"
                        title="Copiar"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhooks Endpoints */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Webhooks &amp; Rotas de Notificação
                  </h3>
                  <button
                    onClick={() => showToast('Novo endpoint de webhook adicionado com sucesso!')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Novo Webhook</span>
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">POST /api/v1/orders/webhook</span>
                      <span className="text-on-surface-variant text-[11px]">Disparo de status de produção para o e-commerce Vórtex</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      200 OK • ATIVO
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">POST /api/v1/telemetry/sensors</span>
                      <span className="text-on-surface-variant text-[11px]">Ingestão de termopares e acelerômetros das 4 impressoras</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      200 OK • ATIVO
                    </span>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">GET /api/v1/nfc/resolve/:uid</span>
                      <span className="text-on-surface-variant text-[11px]">Redirecionamento dinâmico de tags NFC escaneadas por clientes</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-bold">
                      200 OK • ATIVO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= INDUSTRIAL FOOTER ================= */}
      <footer className="w-full bg-surface-container-low py-3 border-t border-surface-container z-20">
        <div className="w-full px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant font-mono text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-on-surface">VÓRTEX INDUSTRIAL FABRICATION OS v2.4</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">UPTIME: 99.98%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span>Klipper Core v0.12 Sync Estável</span>
          </div>
        </div>
      </footer>

      {/* ================= ORDER DETAILS SLIDE-OVER DRAWER ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity"
            onClick={closeOrderDrawer}
          />
          <div className="relative w-full max-w-lg bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto animate-slideLeft border-l border-surface-container">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">assignment</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      #{selectedOrder?.id}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant font-medium">
                      {selectedOrder?.client} • {selectedOrder?.clientCategory}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                  onClick={closeOrderDrawer}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-4 mt-6">
                <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
                  <span className="font-label-md text-[11px] text-on-surface-variant font-mono uppercase block mb-1 font-semibold">
                    Item em Fabricação
                  </span>
                  <p className="font-label-lg text-sm font-bold text-on-surface">
                    {selectedOrder?.product}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{selectedOrder?.spec}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-on-surface-variant pt-2 border-t border-surface-container">
                    <span>Bocal: {selectedOrder?.nozzle}</span>
                    <span>•</span>
                    <span>Filamento: {selectedOrder?.filament}</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl space-y-2.5 border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-[11px] text-on-surface-variant font-mono uppercase font-semibold">
                      Dados Criptográficos NFC
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary-container/15 text-primary font-bold">
                      AES-128 READY
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container">
                    <span className="text-on-surface-variant">Tag UID:</span>
                    <span className="text-on-surface font-semibold">{selectedOrder?.uid}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container">
                    <span className="text-on-surface-variant">Payload URL:</span>
                    <span className="text-primary truncate max-w-[220px] font-semibold">
                      {selectedOrder?.payloadUrl}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container">
                    <span className="text-on-surface-variant">Lock Bit:</span>
                    <span className="text-on-surface font-semibold">{selectedOrder?.lockBit}</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
                  <span className="font-label-md text-[11px] text-on-surface-variant font-mono uppercase block mb-1 font-semibold">
                    Rastreio Logístico &amp; Expedição
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                    <span className="font-body-sm text-xs font-bold text-on-surface">
                      {selectedOrder?.shipping}
                    </span>
                  </div>
                  <p className="font-label-md text-[11px] text-on-surface-variant mt-1">
                    Embalagem com berço antiestático ESD e selagem a vácuo.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-surface-container mt-6">
              <button
                className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-xs font-semibold transition-colors"
                onClick={closeOrderDrawer}
                type="button"
              >
                Fechar
              </button>
              <button
                onClick={handleAuditNfc}
                className="flex-1 py-2.5 bg-primary-container text-on-tertiary rounded-lg font-label-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                type="button"
              >
                Auditar Chip NFC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= G-CODE PREVIEW MODAL ================= */}
      {gcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs"
            onClick={() => setGcodeModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full p-6 z-10 border border-surface-container animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Visualizador: {gcodeDetails.printer}
                </h3>
                <p className="font-label-md text-xs font-mono text-on-surface-variant mt-0.5">
                  {gcodeDetails.file}
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                onClick={() => setGcodeModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="my-4 bg-inverse-surface text-inverse-on-surface p-4 rounded-xl font-code-snippet text-xs overflow-x-auto max-h-64 space-y-1 font-mono">
              <p className="text-outline-variant">; Gerado por Vórtex Slicer Cloud v2.4 (OrcaSlicer Engine)</p>
              <p className="text-outline-variant">; Temperatura do Nozzle: 220C | Bed: 60C</p>
              <p>M140 S60 ; set bed temp</p>
              <p>M104 S220 ; set extruder temp</p>
              <p>M190 S60 ; wait for bed temp</p>
              <p>M109 S220 ; wait for extruder temp</p>
              <p>G28 ; home all axes with sensorless homing</p>
              <p>G29 ; mesh bed leveling tilt compensation</p>
              <p>G1 Z0.2 F3000 ; move to layer height</p>
              <p className="text-primary-container">G1 X120.45 Y110.22 E1.4502 F2400 ; start perimeter</p>
              <p className="text-primary-container">G1 X124.80 Y110.22 E2.1205 ; inner shell</p>
              <p className="text-primary-container">G1 X130.15 Y118.60 E3.9011 ; fox origami jaw angle</p>
              <p className="text-secondary-fixed-dim">M106 S255 ; part cooling fan 100%</p>
              <p>; LAYER: 342 / 460 [NFC CAVITY INSERT POINT]</p>
              <p className="text-tertiary-fixed-dim">M600 ; PAUSE FOR NFC CHIP EMBEDDING EMBED</p>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono">
              <span>Camadas: 460 • Tempo est.: 1h 48m</span>
              <span>Filamento: 48.2g (16.2m)</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-container mt-4">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('G28\nG29\nM104 S220\nM140 S60');
                  showToast('Trecho G-Code copiado para a área de transferência!');
                }}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-xs font-semibold transition-colors"
                type="button"
              >
                Copiar G-Code
              </button>
              <button
                onClick={() => setGcodeModalOpen(false)}
                className="px-4 py-2 bg-primary-container text-on-tertiary rounded-lg font-label-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                type="button"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE NEW ORDER MODAL ================= */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs"
            onClick={() => setNewOrderModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 border border-surface-container animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Criar Nova Ordem de Serviço
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Despache jobs de manufatura e gravação diretamente para o cluster.
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                onClick={() => setNewOrderModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 mt-4">
              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  Cliente / Empresa
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                  placeholder="Ex: Studio Tech Design, Acme Corp..."
                  required
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                    Tipo de Serviço
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                  >
                    <option>Chaveiro NFC Lote</option>
                    <option>Impressão 3D Técnica</option>
                    <option>Consultoria Dev / API</option>
                    <option>Prototipagem em Resina</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                    Célula / Impressora
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                    value={newPrinter}
                    onChange={(e) => setNewPrinter(e.target.value)}
                  >
                    <option>Bambu X1-Carbon #01</option>
                    <option>Voron 2.4 #02</option>
                    <option>Prusa MK4 #03</option>
                    <option>Elegoo Saturn 8K #04</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  Payload NFC (URL / vCard)
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                  placeholder="https://vortex3d.dev/id/..."
                  type="url"
                  value={newNfcPayload}
                  onChange={(e) => setNewNfcPayload(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-xs font-semibold transition-colors"
                  onClick={() => setNewOrderModalOpen(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-primary-container text-on-tertiary rounded-lg font-label-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                  type="submit"
                >
                  Criar O.S. no Cluster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary-container text-[20px]">
            check_circle
          </span>
          <span className="font-label-md text-xs font-semibold">{adminToast}</span>
        </div>
      )}
    </div>
  );
}

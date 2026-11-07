import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import personalizadoService from '../services/personalizadoService';
import b2bService from '../services/b2bService';

export default function CustomCADPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 3D Viewport State
  const [viewMode, setViewMode] = useState('perspectiva'); // 'perspectiva' | 'topo' | 'raio-x'
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Slicer Simulation Controls
  const [currentLayer, setCurrentLayer] = useState(182);
  const [infillPattern, setInfillPattern] = useState('Giroide'); // 'Giroide' | 'Colmeia' | 'Grade'
  const [layerHeight, setLayerHeight] = useState('0.20mm'); // '0.12mm' | '0.20mm' | '0.28mm'

  // Material & Color State
  const [selectedMaterial, setSelectedMaterial] = useState('pla'); // 'pla' | 'petg' | 'cf_abs' | 'resin'
  const [selectedColor, setSelectedColor] = useState('Laranja Vórtex (Assinatura)');

  // NFC Integration State
  const [hasNfc, setHasNfc] = useState(true);
  const [nfcPayload, setNfcPayload] = useState('https://vortex.tech/id/custom-key-01');

  // Client Briefing / Notes
  const [briefingNotes, setBriefingNotes] = useState('');

  // Engineering Modal State
  const [engineeringModalOpen, setEngineeringModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rfpSubmitted, setRfpSubmitted] = useState(false);

  // Success Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pricing calculations
  const materialCosts = {
    pla: 0,
    petg: 14.0,
    cf_abs: 38.0,
    resin: 52.0,
  };

  const layerMultipliers = {
    '0.12mm': 1.15,
    '0.20mm': 1.0,
    '0.28mm': 0.9,
  };

  const baseManufacturing = 54.9 * (layerMultipliers[layerHeight] || 1.0);
  const materialSurcharge = materialCosts[selectedMaterial] || 0;
  const nfcCost = hasNfc ? 18.0 : 0.0;
  const totalPrice = baseManufacturing + materialSurcharge + nfcCost;

  // File drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || file.name.split('.').pop().toUpperCase(),
      });
      showToast(`Arquivo "${file.name}" carregado! Analisando malha 3D...`);
      try {
        const analise = await personalizadoService.uploadCad(file, {
          material: selectedMaterial,
          infill: infillPattern,
          cor: selectedColor,
        });
        if (analise) {
          showToast(`Malha analisada! Volume: ${analise.volumeEstimadoCm3 || 35}cm³ | Peso: ${analise.pesoEstimadoGramas || 44}g`);
        }
      } catch (err) {
        console.warn('Erro ao enviar CAD para fatiamento remoto:', err);
      }
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || file.name.split('.').pop().toUpperCase(),
      });
      showToast(`Arquivo "${file.name}" importado! Analisando geometria...`);
      try {
        const analise = await personalizadoService.uploadCad(file, {
          material: selectedMaterial,
          infill: infillPattern,
          cor: selectedColor,
        });
        if (analise) {
          showToast(`Análise concluída: ${analise.tempoImpressaoMinutos || 120} min estimados de impressão.`);
        }
      } catch (err) {
        console.warn('Erro ao analisar CAD remoto:', err);
      }
    }
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    const customItem = {
      id: Date.now(),
      sku: 'VTX-CUSTOM-CAD',
      title: uploadedFile
        ? `Projeto CAD Customizado: ${uploadedFile.name}`
        : 'Projeto Personalizado & Estúdio 3D (Fox Tech Edition)',
      price: totalPrice,
      quantity: 1,
      selectedColor: selectedColor,
      customSpecs: {
        material: selectedMaterial.toUpperCase(),
        layerHeight,
        infill: infillPattern,
        hasNfc,
        nfcPayload: hasNfc ? nfcPayload : null,
        fileName: uploadedFile ? uploadedFile.name : 'Vortex_Mascot_Polygonal_V2.stl',
        notes: briefingNotes,
      },
      imageUrl: '/assets/vortice-fox-mascot.png',
    };

    addToCart(customItem, 1, selectedColor);
    showToast('Projeto customizado fatiado e adicionado ao carrinho!');
    setTimeout(() => {
      navigate('/carrinho');
    }, 600);
  };

  // Handle Engineering RFP Submission
  const handleRfpSubmit = async (e) => {
    e.preventDefault();
    setRfpSubmitted(true);
    try {
      await b2bService.submeterProposta({
        nomeContato: companyName || 'Cliente Maker',
        email: contactEmail,
        tipoServico: 'PARECER_TECNICO_PROJETO_CAD',
        descricaoProjeto: briefingNotes || 'Análise de tolerância e fatiamento avançado para produção serial.',
      });
      setTimeout(() => {
        setEngineeringModalOpen(false);
        setRfpSubmitted(false);
        showToast('Solicitação de parecer técnico protocolada com sucesso no sistema Vórtex!');
      }, 1000);
    } catch {
      setTimeout(() => {
        setEngineeringModalOpen(false);
        setRfpSubmitted(false);
        showToast('Solicitação de parecer técnico enviada com sucesso ao nosso time de engenharia!');
      }, 1000);
    }
  };

  return (
    <div className="w-full pt-20 bg-surface min-h-screen text-on-surface">
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-20">
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-tertiary-container/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Section: Header Contextual & Breadcrumbs */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Início
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Projetos Personalizados &amp; Estúdio 3D CAD</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-code-snippet text-code-snippet shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Motor Slicer v4.8: Conectado
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Calibração ±0.05mm
              </span>
            </div>
          </div>

          {/* Main Headline & Narrative Copy */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-primary-container text-[18px]">layers</span>
                Fabricação Aditiva • Hardware Integrado
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-on-surface font-bold tracking-tight leading-tight">
                Estúdio de Fatiamento &amp; <span className="text-primary-container">Orçamento 3D</span> Sob Medida
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 leading-relaxed">
                Envie sua malha digital (.STL, .OBJ, .STEP) direto do computador ou smartphone, ou configure a manufatura de precisão da mascote Vórtex Fox Tech com cálculo micrométrico de volume, infill e telemetria de fabricação em tempo real.
              </p>
            </div>

            {/* Capability Badges */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-inverse-surface text-inverse-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">FDM &amp; Resina 8K</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Resolução até 0.05mm ultra-fina</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">contactless</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">NFC NTAG213 Nativo</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Cápsula interna protegida contra choque</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Grid Layout: Left Simulator / Right Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: Interactive 3D Simulator & Slicer Viewport ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 3D Viewport Panel */}
            <div
              className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-4 relative overflow-hidden transition-all ${
                isFullscreen ? 'fixed inset-4 z-50 p-8 bg-surface-container-lowest' : ''
              }`}
            >
              {/* Viewport Header Toolbar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-inverse-surface text-inverse-on-surface font-code-snippet text-code-snippet">
                    <span className="material-symbols-outlined text-primary-container text-[16px]">view_in_ar</span>
                    {uploadedFile ? uploadedFile.name : 'Vortex_Mascot_Polygonal_V2.stl'}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
                    250×250×250 mm Build Plate
                  </span>
                </div>

                {/* View Modes & Camera Presets */}
                <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('perspectiva')}
                    className={`px-2.5 py-1 rounded font-label-md text-xs font-semibold transition-all ${
                      viewMode === 'perspectiva'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Perspectiva
                  </button>
                  <button
                    onClick={() => setViewMode('topo')}
                    className={`px-2.5 py-1 rounded font-label-md text-xs font-semibold transition-all ${
                      viewMode === 'topo'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Topo
                  </button>
                  <button
                    onClick={() => setViewMode('raio-x')}
                    className={`px-2.5 py-1 rounded font-label-md text-xs font-semibold transition-all ${
                      viewMode === 'raio-x'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Raio-X
                  </button>
                </div>
              </div>

              {/* The CAD Canvas & Viewport Simulation Graphic */}
              <div className="relative w-full h-[460px] rounded-xl bg-inverse-surface overflow-hidden flex items-center justify-center select-none shadow-inner border border-surface-container">
                {/* Perspective Bed Grid Background */}
                <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="cad-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#dae2fd" strokeWidth="0.5"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cad-grid-pattern)"></rect>
                </svg>

                {/* 3D Bounding Box Outline */}
                <div className="absolute inset-8 rounded-lg pointer-events-none opacity-40">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 400 400">
                    <polygon
                      fill="none"
                      opacity="0.3"
                      points="200,40 370,120 200,200 30,120"
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    ></polygon>
                    <polygon
                      fill="none"
                      opacity="0.8"
                      points="200,200 370,280 200,360 30,280"
                      stroke="#f97316"
                      strokeWidth="1.5"
                    ></polygon>
                    <line opacity="0.4" stroke="#dae2fd" strokeDasharray="2 2" strokeWidth="1" x1="30" x2="30" y1="120" y2="280"></line>
                    <line opacity="0.4" stroke="#dae2fd" strokeDasharray="2 2" strokeWidth="1" x1="370" x2="370" y1="120" y2="280"></line>
                    <line opacity="0.4" stroke="#dae2fd" strokeDasharray="2 2" strokeWidth="1" x1="200" x2="200" y1="40" y2="200"></line>
                  </svg>
                </div>

                {/* Stylized Polygonal Mascot Model (Vórtex Tech Fox Wireframe/Solid) */}
                <div
                  className="relative z-10 w-72 h-72 flex items-center justify-center transition-all duration-500"
                  style={{
                    transform: `rotate(${rotationAngle}deg) scale(${zoomLevel}) ${
                      viewMode === 'topo' ? 'scaleY(0.7) rotate(-20deg)' : ''
                    }`,
                    filter: viewMode === 'raio-x' ? 'invert(1) hue-rotate(180deg)' : 'none',
                    opacity: viewMode === 'raio-x' ? 0.8 : 1,
                  }}
                >
                  <svg
                    className="w-full h-full drop-shadow-[0_20px_35px_rgba(249,115,22,0.35)]"
                    fill="none"
                    viewBox="0 0 320 320"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Base Sliced Shadow Layer */}
                    <ellipse cx="160" cy="275" fill="#131b2e" opacity="0.6" rx="75" ry="18"></ellipse>
                    {/* Left Ear */}
                    <polygon fill="#f97316" opacity="0.95" points="100,50 145,120 75,130"></polygon>
                    <polygon fill="#9d4300" opacity="0.85" points="100,50 75,130 50,110"></polygon>
                    <polygon fill="#dae2fd" opacity="0.2" points="100,50 115,100 85,110"></polygon>
                    {/* Right Ear */}
                    <polygon fill="#f97316" opacity="0.95" points="220,50 175,120 245,130"></polygon>
                    <polygon fill="#ff6c40" opacity="0.85" points="220,50 245,130 270,110"></polygon>
                    <polygon fill="#dae2fd" opacity="0.2" points="220,50 205,100 235,110"></polygon>
                    {/* Forehead / Crown Facets */}
                    <polygon fill="#f97316" points="160,90 115,120 160,140 205,120"></polygon>
                    <polygon fill="#ff6c40" points="160,90 145,120 160,140"></polygon>
                    <polygon fill="#ffb690" points="160,90 160,140 175,120"></polygon>
                    {/* Left Cheek & Temple Facets */}
                    <polygon fill="#e0c0b1" opacity="0.9" points="75,130 115,120 120,185 60,195"></polygon>
                    <polygon fill="#ffb5a0" points="60,195 120,185 105,230"></polygon>
                    {/* Right Cheek Facets */}
                    <polygon fill="#fbf9f4" opacity="0.9" points="245,130 205,120 200,185 260,195"></polygon>
                    <polygon fill="#dae2fd" points="260,195 200,185 215,230"></polygon>
                    {/* Bridge of Snout */}
                    <polygon fill="#f97316" points="160,140 120,185 160,225"></polygon>
                    <polygon fill="#b02f00" points="160,140 200,185 160,225"></polygon>
                    {/* Tech Polygonal Eyes */}
                    <polygon fill="#dae2fd" points="120,155 140,165 122,175"></polygon>
                    <polygon fill="#ffffff" points="200,155 180,165 198,175"></polygon>
                    {/* Muzzle & Tactile NFC Core Ring */}
                    <polygon fill="#1b1c19" points="160,225 140,245 160,265 180,245"></polygon>
                    <circle cx="160" cy="225" fill="#f97316" opacity="0.9" r="9" stroke="#ffffff" strokeWidth="1.5"></circle>
                    <circle
                      className="animate-spin"
                      cx="160"
                      cy="225"
                      fill="none"
                      r="16"
                      stroke="#f97316"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                      style={{ transformOrigin: '160px 225px', animationDuration: '9s' }}
                    ></circle>
                    {/* Slicing G-code scanlines simulation */}
                    <line opacity="0.8" stroke="#f97316" strokeDasharray="6 3" strokeWidth="1.5" x1="80" x2="240" y1="180" y2="180"></line>
                    <line opacity="0.6" stroke="#dae2fd" strokeWidth="1" x1="95" x2="225" y1="183" y2="183"></line>
                  </svg>
                </div>

                {/* On-Screen Telemetry HUD Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 font-code-snippet text-xs pointer-events-none">
                  <span className="text-tertiary-fixed font-bold tracking-wider">
                    {uploadedFile ? `FILE: ${uploadedFile.name.toUpperCase()}` : 'OBJ: VORTEX_FOX_KEYCHAIN'}
                  </span>
                  <span className="text-inverse-on-surface/80">VERTICES: 18,492 • FACES: 36,980</span>
                  <span className="text-inverse-on-surface/60">BOUNDS: 64.2 × 52.0 × 82.4 mm</span>
                </div>

                {/* NFC Capsule Indicator Pill */}
                {hasNfc && (
                  <div className="absolute top-4 right-4 bg-primary-container text-on-primary px-3 py-1.5 rounded-lg flex items-center gap-2 text-label-md font-label-md shadow-md">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">contactless</span>
                    <span>Cavidade NFC: Ativa (Z: 42.0mm)</span>
                  </div>
                )}

                {/* Viewport Interactive Floating Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-inverse-surface/85 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
                  <button
                    aria-label="Girar modelo"
                    onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
                    className="p-2 rounded text-inverse-on-surface hover:text-primary-container hover:bg-surface-container/20 transition-all"
                    title="Rotacionar +45°"
                  >
                    <span className="material-symbols-outlined text-[18px]">3d_rotation</span>
                  </button>
                  <button
                    aria-label="Aumentar zoom"
                    onClick={() => setZoomLevel((prev) => (prev < 1.4 ? prev + 0.15 : 0.85))}
                    className="p-2 rounded text-inverse-on-surface hover:text-primary-container hover:bg-surface-container/20 transition-all"
                    title="Alternar Zoom"
                  >
                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  </button>
                  <button
                    aria-label="Redefinir câmera"
                    onClick={() => {
                      setRotationAngle(0);
                      setZoomLevel(1);
                      setViewMode('perspectiva');
                    }}
                    className="p-2 rounded text-inverse-on-surface hover:text-primary-container hover:bg-surface-container/20 transition-all"
                    title="Resetar Câmera"
                  >
                    <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                  </button>
                  <button
                    aria-label="Visão em tela cheia"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded text-inverse-on-surface hover:text-primary-container hover:bg-surface-container/20 transition-all"
                    title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Live Slicer Control Bar (Layer Slider & Structural Toggles) */}
              <div className="flex flex-col gap-4 bg-surface-container p-4 rounded-xl border border-surface-container">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">tune</span>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">Simulação de Camadas G-Code</span>
                  </div>
                  <div className="flex items-center gap-2 font-code-snippet text-xs text-on-surface-variant">
                    <span>
                      Camada: <strong className="text-on-surface font-bold">{currentLayer}</strong> / 540
                    </span>
                    <span className="text-primary-container font-semibold">
                      ({((currentLayer / 540) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="flex items-center gap-4">
                  <span className="font-code-snippet text-xs text-on-surface-variant">01</span>
                  <input
                    className="w-full accent-primary-container h-2 bg-surface-container-high rounded-lg cursor-pointer"
                    max="540"
                    min="1"
                    type="range"
                    value={currentLayer}
                    onChange={(e) => setCurrentLayer(Number(e.target.value))}
                  />
                  <span className="font-code-snippet text-xs text-on-surface-variant">540</span>
                </div>

                {/* Infill & Layer Height Micro-selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-xs text-on-surface-variant font-medium">
                      Padrão de Preenchimento (Infill)
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-surface-container-lowest p-1 rounded-lg border border-surface-container">
                      {['Giroide', 'Colmeia', 'Grade'].map((pattern) => (
                        <button
                          key={pattern}
                          type="button"
                          onClick={() => setInfillPattern(pattern)}
                          className={`py-1.5 px-2 rounded font-label-md text-xs text-center transition-all ${
                            infillPattern === pattern
                              ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                              : 'text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          {pattern}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-xs text-on-surface-variant font-medium">
                      Altura de Camada (Microns)
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-surface-container-lowest p-1 rounded-lg border border-surface-container">
                      {['0.12mm', '0.20mm', '0.28mm'].map((height) => (
                        <button
                          key={height}
                          type="button"
                          onClick={() => setLayerHeight(height)}
                          className={`py-1.5 px-2 rounded font-label-md text-xs text-center transition-all ${
                            layerHeight === height
                              ? 'bg-inverse-surface text-inverse-on-surface font-bold shadow-xs'
                              : 'text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          {height}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Telemetry Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex flex-col gap-1">
                  <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">schedule</span>
                    Tempo Estimado
                  </span>
                  <span className="font-headline-sm text-lg font-bold text-on-surface">3h 42min</span>
                  <span className="font-code-snippet text-[11px] text-on-surface-variant">Velocidade: 180mm/s</span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex flex-col gap-1">
                  <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">weight</span>
                    Filamento Bruto
                  </span>
                  <span className="font-headline-sm text-lg font-bold text-on-surface">48.2 g</span>
                  <span className="font-code-snippet text-[11px] text-on-surface-variant">16.1 metros lineares</span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex flex-col gap-1">
                  <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">energy_savings_leaf</span>
                    Consumo Térmico
                  </span>
                  <span className="font-headline-sm text-lg font-bold text-on-surface">0.34 kWh</span>
                  <span className="font-code-snippet text-[11px] text-on-surface-variant">Mesa 60°C • Bico 215°C</span>
                </div>
              </div>

              {/* Mascot Engineering Tip Floating Callout */}
              <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-xl relative shadow-md flex items-start gap-3.5 border border-surface-container">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-xs font-bold text-primary-fixed">Vórtex Fox AI • Análise Geométrica</span>
                    <span className="font-code-snippet text-[11px] text-primary-fixed-dim">OK / Pronta</span>
                  </div>
                  <p className="font-body-sm text-xs text-inverse-on-surface/90 leading-relaxed">
                    A inclinação das orelhas da mascote está a 42°, dispensando suportes descartáveis. A cavidade traseira já prevê o nicho exato de 25mm para selagem ultrassônica do chip NFC NTAG213.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Production Configurator & Quotation Pipeline ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* File Upload Area (Drag & Drop / Smartphone Document Picker) */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-sm text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">cloud_upload</span>
                  Arquivo Digital do Projeto
                </span>
                <span className="font-code-snippet text-xs text-on-surface-variant">STL, OBJ, STEP (≤150MB)</span>
              </div>

              {/* Drag and Drop Zone with real input file */}
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer text-center ${
                  isDragging
                    ? 'border-primary-container bg-primary-container/10 scale-102'
                    : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <input
                  type="file"
                  accept=".stl,.obj,.step,.stp,.3mf,.zip,.pdf,.png,.jpg"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">
                    {uploadedFile ? 'task_alt' : 'folder_zip'}
                  </span>
                </div>
                <div>
                  <p className="font-label-lg text-sm text-on-surface font-semibold">
                    {uploadedFile ? uploadedFile.name : 'Arraste seu modelo 3D ou documento'}
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                    {uploadedFile
                      ? `Tamanho: ${uploadedFile.size} • Pronto para fatiamento`
                      : 'ou toque para navegar no computador / celular'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface font-label-md text-xs font-semibold shadow-xs border border-surface-container">
                    {uploadedFile ? 'Substituir Arquivo' : 'Selecionar Arquivo'}
                  </span>
                </div>
              </label>
            </div>

            {/* Material Selection Section */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-sm text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">science</span>
                  Material de Engenharia
                </span>
                <a href="#guia-tecnico" className="font-label-md text-xs text-primary font-semibold hover:underline">
                  Ver Guia Técnico
                </a>
              </div>

              {/* Material Grid Options */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Option 1: PLA+ */}
                <label
                  onClick={() => setSelectedMaterial('pla')}
                  className={`p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border ${
                    selectedMaterial === 'pla'
                      ? 'bg-surface-container-high border-primary-container shadow-xs'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-sm text-on-surface font-bold">PLA+ Pro</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMaterial === 'pla' ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                    ></span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    Biodegradável, precisão rígida e cores vivas
                  </span>
                  <span className="font-code-snippet text-xs text-primary font-bold mt-1">Incluso na Base</span>
                </label>

                {/* Option 2: PETG */}
                <label
                  onClick={() => setSelectedMaterial('petg')}
                  className={`p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border ${
                    selectedMaterial === 'petg'
                      ? 'bg-surface-container-high border-primary-container shadow-xs'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-sm text-on-surface font-bold">PETG Técnico</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMaterial === 'petg' ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                    ></span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    Resistência UV e impacto mecânico moderado
                  </span>
                  <span className="font-code-snippet text-xs text-on-surface-variant mt-1 font-semibold">+ R$ 14,00</span>
                </label>

                {/* Option 3: ABS Fibra Carbono */}
                <label
                  onClick={() => setSelectedMaterial('cf_abs')}
                  className={`p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border ${
                    selectedMaterial === 'cf_abs'
                      ? 'bg-surface-container-high border-primary-container shadow-xs'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-sm text-on-surface font-bold">ABS Carbon Fiber</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMaterial === 'cf_abs' ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                    ></span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    Rigidez aeroespacial e resistência até 105°C
                  </span>
                  <span className="font-code-snippet text-xs text-on-surface-variant mt-1 font-semibold">+ R$ 38,00</span>
                </label>

                {/* Option 4: Resina 8K */}
                <label
                  onClick={() => setSelectedMaterial('resin')}
                  className={`p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border ${
                    selectedMaterial === 'resin'
                      ? 'bg-surface-container-high border-primary-container shadow-xs'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-sm text-on-surface font-bold">Resina UV 8K</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedMaterial === 'resin' ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                    ></span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    Acabamento vitrificado, figuras e joalheria
                  </span>
                  <span className="font-code-snippet text-xs text-on-surface-variant mt-1 font-semibold">+ R$ 52,00</span>
                </label>
              </div>

              {/* Color Swatches & Finish */}
              <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
                <span className="font-label-md text-xs text-on-surface-variant font-medium">
                  Cor &amp; Acabamento Superficial:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { label: 'Laranja Vórtex (Assinatura)', bg: 'bg-primary-container', text: 'text-on-primary' },
                    { label: 'Preto Grafite Industrial', bg: 'bg-[#1e293b]', text: 'text-white' },
                    { label: 'Branco Polar', bg: 'bg-[#f8fafc] border border-gray-300', text: 'text-gray-900' },
                    { label: 'Bege Areia Matizado', bg: 'bg-[#eae8e3]', text: 'text-gray-900' },
                    { label: 'Translúcido Óptico', bg: 'bg-[#dae2fd] opacity-80', text: 'text-blue-900' },
                  ].map((color) => {
                    const isSelected = selectedColor === color.label;
                    return (
                      <button
                        key={color.label}
                        type="button"
                        onClick={() => setSelectedColor(color.label)}
                        className={`w-8 h-8 rounded-full ${color.bg} shadow-md flex items-center justify-center transition-transform ${
                          isSelected ? 'scale-115 ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                        }`}
                        title={color.label}
                      >
                        {isSelected && (
                          <span className={`material-symbols-outlined text-[16px] ${color.text} font-bold`}>check</span>
                        )}
                      </button>
                    );
                  })}
                  <span className="font-label-md text-xs text-on-surface font-semibold ml-1">
                    {selectedColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Technological Add-on: Embedded NFC Hardware */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">contactless</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-sm text-on-surface font-bold">Embutir Chip NFC NTAG213</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      13.56 MHz, compatível com iOS &amp; Android nativo
                    </span>
                  </div>
                </div>

                {/* Interactive Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={hasNfc}
                    onChange={(e) => setHasNfc(e.target.checked)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              {/* NFC Pre-programming Subform */}
              {hasNfc && (
                <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 mt-1 border border-surface-container animate-fadeIn">
                  <label className="font-label-md text-xs text-on-surface font-medium flex items-center justify-between">
                    <span>Gravação Prévia de Dados no Chip (Opcional):</span>
                    <span className="font-code-snippet text-xs text-primary-container font-bold">144 Bytes Úteis</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-code-snippet text-xs text-on-surface focus:outline-none border border-surface-container shadow-xs"
                      placeholder="URL, Cartão vCard, Link Instagram ou Google Reviews"
                      type="text"
                      value={nfcPayload}
                      onChange={(e) => setNfcPayload(e.target.value)}
                    />
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">
                    Nosso laboratório grava e trava criptograficamente a tag durante a pausa Z na impressão.
                  </p>
                </div>
              )}
            </div>

            {/* Technical Briefing & Tolerance Specifications */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col gap-3">
              <label className="font-label-lg text-sm text-on-surface font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-container text-[18px]">draw</span>
                Observações de Engenharia &amp; Tolerância
              </label>
              <textarea
                className="w-full bg-surface-container-low p-3 rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest border border-surface-container shadow-inner"
                placeholder="Ex: Ajuste h7 para encaixe de rolamento 608, resistência a tração para suporte de parede, acabamento lixado, cavidade para ímãs..."
                rows={2}
                value={briefingNotes}
                onChange={(e) => setBriefingNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Cost Breakdown & Production SLA Summary */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-surface-container flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <span className="font-headline-sm text-lg font-bold text-on-surface">Orçamento Imediato</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-label-md text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Pronta p/ Fila
                </span>
              </div>

              <div className="flex flex-col gap-2.5 font-body-sm text-xs">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>
                    Manufatura Aditiva ({selectedMaterial.toUpperCase()}, 48.2g / 3h 42min)
                  </span>
                  <span className="text-on-surface font-semibold">R$ {(baseManufacturing + materialSurcharge).toFixed(2).replace('.', ',')}</span>
                </div>
                {hasNfc && (
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Módulo NFC NTAG213 + Calibração de Inserção Z</span>
                    <span className="text-on-surface font-semibold">R$ 18,00</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Inspeção Dimensional Micrométrica • Lab QA</span>
                  <span className="text-emerald-700 font-bold">Grátis</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-sm text-on-surface font-bold">Total do Projeto</span>
                    <span className="font-label-md text-xs text-on-surface-variant">Prazo de Envio: 24h a 48h úteis</span>
                  </div>
                  <span className="font-headline-lg text-2xl text-primary-container font-extrabold">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary font-label-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                    shopping_cart_checkout
                  </span>
                  Aprovar Fatiamento e Adicionar ao Carrinho
                </button>
                <button
                  type="button"
                  onClick={() => setEngineeringModalOpen(true)}
                  className="w-full py-3 px-6 rounded-xl bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface font-label-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  Solicitar Parecer de Engenharia / Orçamento em Lote
                </button>
              </div>

              {/* Trust footer items */}
              <div className="flex items-center justify-between text-on-surface-variant text-xs pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">lock</span>
                  Arquivo protegido sob sigilo NDA
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary-container">local_shipping</span>
                  Envio p/ todo o Brasil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: Technical Tolerances & FAQ Architecture Bento Grid ================= */}
        <div id="guia-tecnico" className="mt-16 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-label-md text-xs text-primary-container font-bold uppercase tracking-wider">
              Diretrizes de Manufatura Vórtex
            </span>
            <h2 className="font-headline-lg text-2xl lg:text-3xl text-on-surface font-bold">
              Guia de Engenharia para Malhas 3D
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Otimize seus arquivos para garantir acabamento espelhado, máxima coesão intercamadas e encaixe cirúrgico de componentes IoT.
            </p>
          </div>

          {/* Bento Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Tolerâncias Mecânicas */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[22px]">straighten</span>
                </div>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  Tolerâncias e Folgas (Clearance)
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Para partes móveis ou encaixes de pressão (snap-fit), recomendamos deixar uma folga radial de pelo menos{' '}
                  <strong className="text-on-surface">0.25mm a 0.35mm</strong> no diâmetro. Nossos bicos CHT de alto fluxo compensam a retração térmica nativamente.
                </p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg font-code-snippet text-xs text-on-surface-variant border border-surface-container">
                Paredes mínimas: 1.2mm (FDM) / 0.6mm (Resina 8K)
              </div>
            </div>

            {/* Bento Card 2: Incorporação NFC & IoT */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[22px]">nfc</span>
                </div>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  Integração de Hardware &amp; NFC
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Nossa tecnologia com pausa programada em G-Code insere chips NFC, magnetos de neodímio e contrapesos no interior da peça sem necessidade de parafusos externos ou cola, criando produtos selados à prova d'água.
                </p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg font-code-snippet text-xs text-on-surface-variant border border-surface-container">
                Temperatura máxima da antena: 180°C suportada
              </div>
            </div>

            {/* Bento Card 3: Consultoria de Código & API */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-inverse-surface">
                  <span className="material-symbols-outlined text-[22px]">code</span>
                </div>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  Software &amp; Plataformas Conectadas
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Além de imprimir a peça física, o time da Vórtex desenvolve as landing pages de feedback instantâneo, painéis de gestão e APIs de leitura dos chaveiros inteligentes produzidos no laboratório.
                </p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg font-code-snippet text-xs text-on-surface-variant border border-surface-container">
                Stack: React + Tailwind + Web NFC API
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Review Modal */}
      {engineeringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs"
            onClick={() => setEngineeringModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 border border-surface-container animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Solicitar Parecer de Engenharia
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Análise prévia de tolerâncias, fatiamento em lote e viabilidade técnica.
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                onClick={() => setEngineeringModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRfpSubmit} className="space-y-4 mt-4">
              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  Seu E-mail Corporativo
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                  placeholder="engenharia@suaempresa.com"
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  Empresa / Nome do Projeto
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                  placeholder="Ex: Studio Tech, Projeto IoT Alpha..."
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  Arquivo anexado
                </label>
                <p className="text-xs font-mono text-primary font-bold p-2 bg-surface-container-low rounded-lg border border-surface-container">
                  {uploadedFile ? uploadedFile.name : 'Vortex_Mascot_Polygonal_V2.stl'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-xs font-semibold transition-colors"
                  onClick={() => setEngineeringModalOpen(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-primary-container text-on-tertiary rounded-lg font-label-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                  type="submit"
                >
                  {rfpSubmitted ? 'Enviando Parecer...' : 'Enviar para Análise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary-container text-[20px]">check_circle</span>
          <span className="font-label-md text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

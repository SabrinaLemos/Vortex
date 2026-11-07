export const MOCK_CATEGORIES = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'nfc', label: 'Dispositivos & Tags NFC' },
  { id: 'brindes', label: 'Brindes & Lotes B2B' },
  { id: 'decoracao', label: 'Decoração & Design' },
  { id: 'figures', label: 'Figures & Colecionáveis' },
  { id: 'utilitarios', label: 'Utilitários & Desk Setup' },
  { id: 'hardware', label: 'Cases & Hardware IoT' },
  { id: 'materiais', label: 'Filamentos & Insumos' },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    sku: 'VRT-FOX-NFC',
    slug: 'chaveiro-fox-nfc',
    title: 'Chaveiro Mascote Fox Vórtex com NFC NTAG213 Integrado',
    category: 'nfc',
    categoryLabel: 'Chaveiro Inteligente',
    tech: 'FDM',
    techLabel: 'FDM · 0.12mm',
    price: 42.90,
    installments: 'ou 3x de R$ 14,30',
    description: 'Infill Giroidal 25%, PLA+ Laranja Vórtex / PETG Fosco Cinza, Chip encapsulado e à prova d’água.',
    fullDescription: 'O emblemático chaveiro da Raposa Vórtex possui chip NFC NTAG213 de alta frequência integrado internamente durante o processo de fatiamento e pausa programada de impressão. Totalmente vedado, resistente à água e compatível com iOS e Android sem necessidade de aplicativo.',
    specs: {
      layerHeight: '0.12mm',
      infill: '25% Giroidal',
      chip: 'NTAG213 (144 bytes regravável)',
      material: 'PLA+ / PETG Industrial',
      weight: '18g',
      dimensions: '45 x 38 x 8 mm'
    },
    colors: [
      { name: 'Laranja Vórtex', hex: '#f97316' },
      { name: 'Grafite Stealth', hex: '#1e293b' },
      { name: 'Branco Cálcio', hex: '#f8fafc' }
    ],
    imageUrl: '/assets/prod-chaveiro-fox-nfc.png',
    rating: 5.0,
    reviewsCount: 38,
    inStock: true,
    isFeatured: true
  },
  {
    id: 2,
    sku: 'VRT-CRD-B2B',
    slug: 'cracha-smart-nfc-b2b',
    title: 'Crachá Inteligente 3D Dual-Chip NFC/RFID para Empresas',
    category: 'brindes',
    categoryLabel: 'Smart Badges',
    tech: 'FDM',
    techLabel: 'PETG · RFID Catraca',
    price: 34.90,
    installments: 'Lote a partir de R$ 26,00',
    description: 'PETG Fosco de alta tenacidade, gravação laser em baixo-relevo com nome e QR code de contingência.',
    fullDescription: 'Crachá e cartão corporativo ultrafino impresso em PETG de grau engenharia com dois chips: NFC para compartilhamento de cartão de visitas digital e RFID 125kHz/Mifare 13.56MHz para liberação de catracas e portas corporativas.',
    specs: {
      layerHeight: '0.16mm',
      infill: '100% Sólido',
      chip: 'Dual NTAG215 + RFID 125kHz',
      material: 'PETG Carbon Touch',
      weight: '12g',
      dimensions: '85.6 x 54 x 2.2 mm'
    },
    colors: [
      { name: 'Grafite Stealth', hex: '#1e293b' },
      { name: 'Azul Industrial', hex: '#1e3a8a' }
    ],
    imageUrl: '/assets/prod-cracha-smart-nfc.png',
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
    isFeatured: false
  },
  {
    id: 3,
    sku: 'VRT-VAS-ORI',
    slug: 'vaso-parametrico-origami',
    title: 'Vaso Paramétrico Origami Geométrico Voronoi',
    category: 'decoracao',
    categoryLabel: 'Decoração & Design',
    tech: 'FDM',
    techLabel: 'Spiral Vase Mode',
    price: 64.00,
    installments: 'ou 2x de R$ 32,00',
    description: 'Algoritmo Voronoi com transição matemática suave, impermeabilizado internamente com resina epóxi.',
    fullDescription: 'Peça arquitetônica gerada através de parametrização matemática algorítmica. O padrão facetado refrata a luz ambiente criando sombras dinâmicas. Selado internamente para comportar água e arranjos florais naturais.',
    specs: {
      layerHeight: '0.20mm',
      infill: 'Modo Espiral Contínuo (0.8mm wall)',
      chip: 'Opcional sob encomenda',
      material: 'PLA Fosco Cerâmico',
      weight: '145g',
      dimensions: '110 x 110 x 210 mm'
    },
    colors: [
      { name: 'Marfim Cerâmico', hex: '#fdfbf7' },
      { name: 'Terracota', hex: '#c2410c' }
    ],
    imageUrl: '/assets/prod-vaso-origami.png',
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    isFeatured: true
  },
  {
    id: 4,
    sku: 'VRT-FIG-CYB',
    slug: 'figure-colecionavel-cyber-fox',
    title: 'Miniatura Colecionável Cyber Fox em Resina UV 8K',
    category: 'figures',
    categoryLabel: 'Figures & Colecionáveis',
    tech: 'Resina',
    techLabel: 'Resina 8K · 0.05mm',
    price: 89.00,
    installments: 'ou 3x de R$ 29,66',
    description: 'Fotopolímero rígido cinza espacial, base com nicho interno oculto para tag NFC e acabamento ultrassônico pós-cura.',
    fullDescription: 'Escultura de precisão extrema impressa em resina fotopolimerizável 8K com resolução de 22 micra no eixo XY. Apresenta detalhes nítidos de armadura mecha futurista da mascote Raposa, com nicho magnético na base.',
    specs: {
      layerHeight: '0.03mm (30 micra)',
      infill: '100% Sólido Cured',
      chip: 'Tag NFC Base Inclusa',
      material: 'Resina Tough 8K Cinza Espacial',
      weight: '90g',
      dimensions: '65 x 55 x 115 mm'
    },
    colors: [
      { name: 'Cinza Espacial', hex: '#475569' },
      { name: 'Branco Primer', hex: '#e2e8f0' }
    ],
    imageUrl: '/assets/prod-figure-cyber-fox.png',
    rating: 5.0,
    reviewsCount: 42,
    inStock: true,
    isFeatured: true
  },
  {
    id: 5,
    sku: 'VRT-RPI-DIN',
    slug: 'case-raspberry-pi-industrial',
    title: 'Case Protetor Raspberry Pi 4 / 5 IoT Industrial com Trilho DIN',
    category: 'hardware',
    categoryLabel: 'Hardware & IoT',
    tech: 'FDM',
    techLabel: '105°C Resiste · DIN TS35',
    price: 58.00,
    installments: 'ou 2x de R$ 29,00',
    description: 'Furação ativa para ventoinha 30mm, fendas passivas de exaustão e trilho DIN padrão TS35 para quadro elétrico.',
    fullDescription: 'Case industrial robusto fabricado em PETG aditivado com fibra de carbono para alta resistência mecânica e térmica contínua até 80°C. Possui engate rápido em trilhos DIN padrão TS35 e recortes precisos para todos os conectores do SBC.',
    specs: {
      layerHeight: '0.20mm',
      infill: '40% Tri-Hexagonal',
      chip: 'NFC identificador de IP/MAC',
      material: 'PETG Carbon Fiber Black',
      weight: '65g',
      dimensions: '95 x 65 x 38 mm'
    },
    colors: [
      { name: 'Preto Carbono', hex: '#0f172a' }
    ],
    imageUrl: '/assets/prod-case-raspberry-pi.png',
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    isFeatured: false
  },
  {
    id: 6,
    sku: 'VRT-MGS-STD',
    slug: 'suporte-magsafe-articulado',
    title: 'Suporte Ergonômico MagSafe Articulado para Mesa & Monitor',
    category: 'utilitarios',
    categoryLabel: 'Utilitários & Desk',
    tech: 'FDM',
    techLabel: 'Ângulo 60° Ótico',
    price: 39.90,
    installments: 'ou 2x de R$ 19,95',
    description: 'Passagem interna oculta para cabo USB-C, insertos metálicos em latão rosqueados a quente e pés em TPU antiderrapante.',
    fullDescription: 'Docking station minimalista com alojamento de precisão para carregadores sem fio magnéticos MagSafe/Qi2. O ângulo de inclinação de 60 graus foi calculado para permitir desbloqueio por FaceID imediato enquanto você programa ou trabalha.',
    specs: {
      layerHeight: '0.16mm',
      infill: '35% Gyroid',
      chip: 'Sem chip',
      material: 'PLA Pro Matte + Pés TPU 95A',
      weight: '110g',
      dimensions: '75 x 85 x 110 mm'
    },
    colors: [
      { name: 'Grafite Stealth', hex: '#1e293b' },
      { name: 'Laranja Vórtex', hex: '#f97316' },
      { name: 'Branco Giz', hex: '#f8fafc' }
    ],
    imageUrl: '/assets/prod-suporte-magsafe.png',
    rating: 4.7,
    reviewsCount: 56,
    inStock: true,
    isFeatured: false
  },
  {
    id: 7,
    sku: 'VRT-LOT-050',
    slug: 'kit-50x-tags-fox-nfc-b2b',
    title: 'Kit 50x Tags Chaveiro Fox NFC para Eventos & Conferências',
    category: 'brindes',
    categoryLabel: 'Lotes Corporativos B2B',
    tech: 'FDM',
    techLabel: 'R$ 33,60 / unidade',
    price: 1680.00,
    installments: 'ou 6x de R$ 280,00 sem juros',
    description: 'Cores corporativas sob medida, URLs pré-gravadas em lote e acesso ao dashboard analítico de cliques da Vórtex.',
    fullDescription: 'Pacote promocional para empresas, conferências de tecnologia e equipes ágeis. Cada chaveiro é individualmente testado, embalado e pré-programado com links de redes sociais, landing page corporativa ou sistema de credenciamento.',
    specs: {
      layerHeight: '0.16mm',
      infill: '25% Giroidal',
      chip: '50x NTAG213 integrados',
      material: 'PLA+ Cores Personalizáveis',
      weight: '900g total',
      dimensions: 'Caixa 250 x 200 x 100 mm'
    },
    colors: [
      { name: 'Mix Personalizado', hex: '#f97316' }
    ],
    imageUrl: '/assets/prod-lote-chaveiros-b2b.png',
    rating: 5.0,
    reviewsCount: 12,
    inStock: true,
    isFeatured: true
  },
  {
    id: 8,
    sku: 'VRT-CAB-HEX',
    slug: 'organizador-cabos-modular-hexagonal',
    title: 'Organizador de Cabos Modular Hexagonal Magnético (Kit 5 Peças)',
    category: 'utilitarios',
    categoryLabel: 'Utilitários & Desk',
    tech: 'FDM',
    techLabel: 'Imãs de Neodímio N52',
    price: 29.90,
    installments: 'Envio imediato',
    description: 'Conexão magnética instantânea, canaletes de cabos até 6mm e base fixadora com fita de alta fixação 3M VHB.',
    fullDescription: 'Módulos hexagonais que se agrupam magneticamente na lateral ou superfície da sua mesa de trabalho. Mantém cabos USB, HDMI e alimentação devidamente ancorados e prontos para uso.',
    specs: {
      layerHeight: '0.16mm',
      infill: '30% Grid',
      chip: 'Sem chip',
      material: 'PETG Acabamento Cetim',
      weight: '45g',
      dimensions: '30 x 30 x 15 mm (cada)'
    },
    colors: [
      { name: 'Preto Matte', hex: '#0f172a' },
      { name: 'Laranja Vórtex', hex: '#f97316' }
    ],
    imageUrl: '/assets/prod-organizador-cabos.png',
    rating: 4.8,
    reviewsCount: 67,
    inStock: true,
    isFeatured: false
  },
  {
    id: 9,
    sku: 'VRT-FIL-PLA',
    slug: 'carretel-filamento-pla-laranja-signature',
    title: 'Carretel Filamento PLA+ Laranja Vórtex Signature (1kg / 1.75mm)',
    category: 'materiais',
    categoryLabel: 'Insumos 3D',
    tech: 'FDM',
    techLabel: 'Tolerância ±0.02mm',
    price: 98.00,
    installments: 'Estoque: 14 unidades',
    description: 'Carretel em papelão biodegradável, secagem a vácuo grau industrial com dessecante ativo e controle laser de diâmetro.',
    fullDescription: 'O mesmo filamento premium utilizado nas peças de produção oficial da Vórtex. Tom de laranja vibrante exclusivo, baixa retração térmica e excelente adesão entre camadas para impressoras de alta velocidade (até 500mm/s).',
    specs: {
      diameter: '1.75mm (±0.02mm)',
      printTemp: '200°C - 225°C',
      bedTemp: '50°C - 60°C',
      spool: 'Papelão Reciclado 100% Celulose',
      netWeight: '1.0 kg'
    },
    colors: [
      { name: 'Laranja Vórtex Signature', hex: '#f97316' }
    ],
    imageUrl: '/assets/prod-filamento-pla.png',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    isFeatured: false
  }
];

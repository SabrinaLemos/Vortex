-- ==============================================================================
-- V2__popular_dados_completos.sql
-- Carga inicial de dados realistas no banco de dados do ecossistema Vórtex
-- Substitui qualquer dependência de mocks hardcoded no frontend
-- ==============================================================================

-- 1. USUÁRIOS
-- Senha hash bcrypt para 'vortex123': $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
-- Senha hash bcrypt para 'admin123':  $2a$10$wT0l8oI8Z3D/fLpS7h22dOpCq0Vtw7hE9V6jE7x2.G6N7y9bN6fUq
INSERT INTO usuarios (
    id, nome, email, senha_hash, telefone, tipo_conta, documento, razao_social, perfil_acesso, ativo, email_verificado, token_nfc_auth, limite_credito_b2b
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'Eng. Chefe Vórtex',
    'admin@vortex.tech',
    '$2a$10$wT0l8oI8Z3D/fLpS7h22dOpCq0Vtw7hE9V6jE7x2.G6N7y9bN6fUq',
    '(11) 99999-0000',
    'PJ',
    '12345678000199',
    'Vórtex 3D Labs & Dev LTDA',
    'ADMIN',
    TRUE,
    TRUE,
    'FOX-ADMIN-MASTER-KEY',
    50000.00
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Lucas Mendonça de Oliveira',
    'lucas.mendonca@aerotechlabs.com.br',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    '(11) 98412-0091',
    'PJ',
    '34891204000192',
    'AeroTech Labs Indústria LTDA',
    'CLIENTE',
    TRUE,
    TRUE,
    'FOX-NFC-8820-BR',
    9550.00
)
ON CONFLICT (id) DO NOTHING;

-- 2. ENDEREÇOS DO USUÁRIO LUCAS
INSERT INTO enderecos_usuario (
    id, usuario_id, destinatario, cep, logradouro, numero, complemento, bairro, cidade, uf, tipo, padrao
) VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'AeroTech Labs - A/C Lucas Mendonça',
    '04538133',
    'Av. Brigadeiro Faria Lima',
    '3477',
    '10º andar - Sala 102',
    'Itaim Bibi',
    'São Paulo',
    'SP',
    'ENTREGA',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUTOS DO CATÁLOGO (OBTENDO IDS DAS CATEGORIAS)
-- 3.1 Chaveiro Mascote Fox NFC
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'VRT-FOX-NFC',
    'chaveiro-fox-nfc',
    (SELECT id FROM categorias_produto WHERE slug = 'nfc'),
    'Chaveiro Mascote Fox Vórtex com NFC NTAG213 Integrado',
    'Smart Keychain Industrial de Alta Resolução',
    'Infill Giroidal 25%, PLA+ Laranja Vórtex / PETG Fosco Cinza, Chip encapsulado e à prova d’água.',
    'O emblemático chaveiro da Raposa Vórtex possui chip NFC NTAG213 de alta frequência integrado internamente durante o processo de fatiamento e pausa programada de impressão. Totalmente vedado, resistente à água e compatível com iOS e Android sem necessidade de aplicativo.',
    42.90,
    'ou 3x de R$ 14,30',
    'FDM',
    'FDM · 0.12mm',
    'Chaveiro Inteligente',
    TRUE,
    'NTAG213 (144 bytes)',
    '±0.08mm',
    '25% Giroide',
    '0.12mm',
    18.00,
    '45 x 38 x 8 mm',
    '/assets/prod-chaveiro-fox-nfc.png',
    TRUE,
    TRUE,
    5.00,
    38
) ON CONFLICT (id) DO NOTHING;

-- 3.2 Crachá B2B Dual Chip
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000002',
    'VRT-CRD-B2B',
    'cracha-smart-nfc-b2b',
    (SELECT id FROM categorias_produto WHERE slug = 'brindes'),
    'Crachá Inteligente 3D Dual-Chip NFC/RFID para Empresas',
    'Smart Badges Corporativos de Grau Engenharia',
    'PETG Fosco de alta tenacidade, gravação laser em baixo-relevo com nome e QR code de contingência.',
    'Crachá e cartão corporativo ultrafino impresso em PETG de grau engenharia com dois chips: NFC para compartilhamento de cartão de visitas digital e RFID 125kHz para catracas e portas corporativas.',
    34.90,
    'Lote a partir de R$ 26,00',
    'FDM',
    'PETG · RFID Catraca',
    'Smart Badges',
    TRUE,
    'Dual NTAG215 + RFID 125kHz',
    '±0.05mm',
    '100% Sólido',
    '0.16mm',
    12.00,
    '85.6 x 54 x 2.2 mm',
    '/assets/prod-cracha-smart-nfc.png',
    TRUE,
    FALSE,
    4.90,
    19
) ON CONFLICT (id) DO NOTHING;

-- 3.3 Vaso Paramétrico Origami
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000003',
    'VRT-VAS-ORI',
    'vaso-parametrico-origami',
    (SELECT id FROM categorias_produto WHERE slug = 'decoracao'),
    'Vaso Paramétrico Origami Geométrico Voronoi',
    'Design Algorítmico Computacional',
    'Algoritmo Voronoi com transição matemática suave, impermeabilizado internamente com resina epóxi.',
    'Peça arquitetônica gerada através de parametrização matemática algorítmica. O padrão facetado refrata a luz ambiente criando sombras dinâmicas. Selado internamente para comportar água e arranjos florais naturais.',
    64.00,
    'ou 2x de R$ 32,00',
    'FDM',
    'Spiral Vase Mode',
    'Decoração & Design',
    FALSE,
    NULL,
    '±0.15mm',
    'Modo Espiral Contínuo',
    '0.20mm',
    145.00,
    '110 x 110 x 210 mm',
    '/assets/prod-vaso-origami.png',
    TRUE,
    TRUE,
    4.80,
    24
) ON CONFLICT (id) DO NOTHING;

-- 3.4 Miniatura Cyber Fox Resina 8K
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000004',
    'VRT-FIG-CYB',
    'figure-colecionavel-cyber-fox',
    (SELECT id FROM categorias_produto WHERE slug = 'figures'),
    'Miniatura Colecionável Cyber Fox em Resina UV 8K',
    'Edição de Colecionador com Precisão de 22 Micra',
    'Fotopolímero rígido cinza espacial, base com nicho interno oculto para tag NFC e acabamento ultrassônico pós-cura.',
    'Escultura de precisão extrema impressa em resina fotopolimerizável 8K com resolução de 22 micra no eixo XY. Apresenta detalhes nítidos de armadura mecha futurista da mascote Raposa, com nicho magnético na base.',
    89.00,
    'ou 3x de R$ 29,66',
    'RESINA',
    'Resina 8K · 0.05mm',
    'Figures & Colecionáveis',
    TRUE,
    'NTAG213 Base',
    '±0.02mm',
    '100% Sólido Cured',
    '0.03mm',
    90.00,
    '65 x 55 x 115 mm',
    '/assets/prod-figure-cyber-fox.png',
    TRUE,
    TRUE,
    5.00,
    42
) ON CONFLICT (id) DO NOTHING;

-- 3.5 Case Raspberry Pi Industrial DIN
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000005',
    'VRT-RPI-DIN',
    'case-raspberry-pi-industrial',
    (SELECT id FROM categorias_produto WHERE slug = 'hardware'),
    'Case Protetor Raspberry Pi 4 / 5 IoT Industrial com Trilho DIN',
    'Gabinete Mecânico PETG Carbon Fiber',
    'Furação ativa para ventoinha 30mm, fendas passivas de exaustão e trilho DIN padrão TS35 para quadro elétrico.',
    'Case industrial robusto fabricado em PETG aditivado com fibra de carbono para alta resistência mecânica e térmica contínua até 80°C. Possui engate rápido em trilhos DIN padrão TS35 e recortes precisos para conectores.',
    58.00,
    'ou 2x de R$ 29,00',
    'FDM',
    '105°C Resiste · DIN TS35',
    'Hardware & IoT',
    FALSE,
    NULL,
    '±0.06mm',
    '40% Tri-Hexagonal',
    '0.20mm',
    65.00,
    '95 x 65 x 38 mm',
    '/assets/prod-case-raspberry-pi.png',
    TRUE,
    FALSE,
    4.90,
    31
) ON CONFLICT (id) DO NOTHING;

-- 3.6 Suporte MagSafe Articulado
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000006',
    'VRT-MGS-STD',
    'suporte-magsafe-articulado',
    (SELECT id FROM categorias_produto WHERE slug = 'utilitarios'),
    'Suporte Ergonômico MagSafe Articulado para Mesa & Monitor',
    'Docking Station de Precisão com Ângulo Ótico de 60°',
    'Passagem interna oculta para cabo USB-C, insertos metálicos em latão rosqueados a quente e pés em TPU antiderrapante.',
    'Docking station minimalista com alojamento de precisão para carregadores sem fio magnéticos MagSafe/Qi2. O ângulo de inclinação de 60 graus foi calculado para permitir desbloqueio por FaceID imediato enquanto você trabalha.',
    39.90,
    'ou 2x de R$ 19,95',
    'FDM',
    'Ângulo 60° Ótico',
    'Utilitários & Desk',
    FALSE,
    NULL,
    '±0.08mm',
    '35% Giroide',
    '0.16mm',
    110.00,
    '75 x 85 x 110 mm',
    '/assets/prod-suporte-magsafe.png',
    TRUE,
    FALSE,
    4.70,
    56
) ON CONFLICT (id) DO NOTHING;

-- 3.7 Kit 50x Tags Chaveiro Fox NFC B2B
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000007',
    'VRT-LOT-050',
    'kit-50x-tags-fox-nfc-b2b',
    (SELECT id FROM categorias_produto WHERE slug = 'brindes'),
    'Kit 50x Tags Chaveiro Fox NFC para Eventos & Conferências',
    'Lote Corporativo sob Medida para Onboarding',
    'Cores corporativas sob medida, URLs pré-gravadas em lote e acesso ao dashboard analítico de cliques da Vórtex.',
    'Pacote promocional para empresas, conferências de tecnologia e equipes ágeis. Cada chaveiro é individualmente testado, embalado e pré-programado com links de redes sociais ou credenciamento.',
    1680.00,
    'ou 6x de R$ 280,00 sem juros',
    'FDM',
    'R$ 33,60 / unidade',
    'Lotes Corporativos B2B',
    TRUE,
    '50x NTAG213 Integrados',
    '±0.08mm',
    '25% Giroide',
    '0.16mm',
    900.00,
    'Caixa 250 x 200 x 100 mm',
    '/assets/prod-lote-chaveiros-b2b.png',
    TRUE,
    TRUE,
    5.00,
    12
) ON CONFLICT (id) DO NOTHING;

-- 3.8 Organizador Modular Hexagonal de Cabos
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000008',
    'VRT-CAB-HEX',
    'organizador-cabos-modular-hexagonal',
    (SELECT id FROM categorias_produto WHERE slug = 'utilitarios'),
    'Organizador de Cabos Modular Hexagonal Magnético (Kit 5 Peças)',
    'Gestão Modular com Conexão por Ímãs Neodímio N52',
    'Conexão magnética instantânea, canaletes de cabos até 6mm e base fixadora com fita de alta fixação 3M VHB.',
    'Módulos hexagonais que se agrupam magneticamente na lateral ou superfície da sua mesa de trabalho. Mantém cabos USB, HDMI e alimentação devidamente ancorados e prontos para uso.',
    29.90,
    'Envio imediato',
    'FDM',
    'Ímãs de Neodímio N52',
    'Utilitários & Desk',
    FALSE,
    NULL,
    '±0.08mm',
    '30% Grade',
    '0.16mm',
    45.00,
    '30 x 30 x 15 mm (cada)',
    '/assets/prod-organizador-cabos.png',
    TRUE,
    FALSE,
    4.80,
    67
) ON CONFLICT (id) DO NOTHING;

-- 3.9 Carretel Filamento PLA+ Laranja Signature
INSERT INTO produtos (
    id, sku, slug, categoria_id, titulo, subtitulo, descricao_curta, descricao_completa,
    preco_base, parcelamento_texto, tecnologia_fabricacao, rotulo_tecnologia, rotulo_categoria,
    possui_nfc, chip_nfc_padrao, tolerancia_milimetrica, infill_padrao, altura_camada_padrao,
    peso_gramas, dimensoes, imagem_principal_url, em_estoque, destaque, nota_media, total_avaliacoes
) VALUES (
    'c0000000-0000-0000-0000-000000000009',
    'VRT-FIL-PLA',
    'carretel-filamento-pla-laranja-signature',
    (SELECT id FROM categorias_produto WHERE slug = 'materiais'),
    'Carretel Filamento PLA+ Laranja Vórtex Signature (1kg / 1.75mm)',
    'Insumo de Alta Velocidade (até 500mm/s) com Controle Laser',
    'Carretel em papelão biodegradável, secagem a vácuo grau industrial com dessecante ativo e controle laser de diâmetro.',
    'O mesmo filamento premium utilizado nas peças de produção oficial da Vórtex. Tom de laranja vibrante exclusivo, baixa retração térmica e excelente adesão entre camadas para impressoras de alta velocidade.',
    98.00,
    'Estoque: 14 unidades',
    'FDM',
    'Tolerância ±0.02mm',
    'Insumos 3D',
    FALSE,
    NULL,
    '±0.02mm',
    'Carretel Sólido',
    '1.75mm',
    1000.00,
    'Carretel 200 x 65 mm',
    '/assets/prod-filamento-pla.png',
    TRUE,
    FALSE,
    4.90,
    88
) ON CONFLICT (id) DO NOTHING;

-- 4. VARIAÇÕES DE CORES
INSERT INTO produtos_variacoes_cor (produto_id, nome_cor, codigo_hex, ativo) VALUES
('c0000000-0000-0000-0000-000000000001', 'Laranja Vórtex', '#f97316', TRUE),
('c0000000-0000-0000-0000-000000000001', 'Grafite Stealth', '#1e293b', TRUE),
('c0000000-0000-0000-0000-000000000001', 'Branco Cálcio', '#f8fafc', TRUE),

('c0000000-0000-0000-0000-000000000002', 'Grafite Stealth', '#1e293b', TRUE),
('c0000000-0000-0000-0000-000000000002', 'Azul Industrial', '#1e3a8a', TRUE),

('c0000000-0000-0000-0000-000000000003', 'Marfim Cerâmico', '#fdfbf7', TRUE),
('c0000000-0000-0000-0000-000000000003', 'Terracota', '#c2410c', TRUE),

('c0000000-0000-0000-0000-000000000004', 'Cinza Espacial', '#475569', TRUE),
('c0000000-0000-0000-0000-000000000004', 'Branco Primer', '#e2e8f0', TRUE),

('c0000000-0000-0000-0000-000000000006', 'Grafite Stealth', '#1e293b', TRUE),
('c0000000-0000-0000-0000-000000000006', 'Laranja Vórtex', '#f97316', TRUE),

('c0000000-0000-0000-0000-000000000008', 'Preto Matte', '#0f172a', TRUE),
('c0000000-0000-0000-0000-000000000008', 'Laranja Vórtex', '#f97316', TRUE);

-- 5. VARIAÇÕES DE MATERIAIS
INSERT INTO produtos_variacoes_material (produto_id, chave_material, nome_exibicao, acrescimo_preco, descricao_tecnica, ativo) VALUES
('c0000000-0000-0000-0000-000000000001', 'PLA', 'PLA Pro Matte', 0.00, 'Acabamento acetinado, biodegradável e alta rigidez', TRUE),
('c0000000-0000-0000-0000-000000000001', 'PETG', 'PETG Industrial', 6.00, 'Resistente a impactos mecânicos e raios UV externos', TRUE),
('c0000000-0000-0000-0000-000000000001', 'ABS_CARBON', 'ABS Carbon Fiber', 9.00, 'Composto com fibra de carbono, ultra leve e térmico até 105°C', TRUE),

('c0000000-0000-0000-0000-000000000006', 'PLA', 'PLA Pro Matte', 0.00, 'Padrão estético para mesa de trabalho', TRUE),
('c0000000-0000-0000-0000-000000000006', 'PETG', 'PETG Industrial', 8.00, 'Grau de engenharia reforçado', TRUE);

-- 6. TAGS NFC REAIS
INSERT INTO tags_nfc (
    id, uid, usuario_titular_id, tipo_chip, apelido, slug_redirecionamento, url_destino, lock_bit_status, contagem_toques, ultimo_toque_em, ativo
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    '04:A2:88:B1:9C:20:80',
    'a0000000-0000-0000-0000-000000000002',
    'NTAG213',
    'Chaveiro Fox NFC Master',
    'lucas-mendonca',
    'https://vortex.tech/id/lucas-mendonca',
    'PROTEGIDO_SENHA',
    128,
    CURRENT_TIMESTAMP - INTERVAL '12 minutes',
    TRUE
),
(
    'd0000000-0000-0000-0000-000000000002',
    '04:8A:2F:1A:B9:71:80',
    'a0000000-0000-0000-0000-000000000001',
    'NTAG213',
    'Tag Demo TechCon 2025',
    'tc25-x40',
    'https://vortex3d.dev/id/tc25-x40',
    'PROTEGIDO_SENHA',
    42,
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 7. PEDIDO REAL COM TELEMETRIA IOT (ORD-9921)
INSERT INTO pedidos (
    id, codigo_ordem, usuario_id, endereco_entrega_id, status, subtotal, desconto, valor_frete, total,
    metodo_pagamento, parcelas, id_transacao_gateway, status_pagamento, modalidade_frete, prazo_estimado_entrega,
    observacoes_producao, chave_acesso_nfe
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'ORD-9921',
    'a0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'EM_TRANSITO',
    231.26,
    0.00,
    14.80,
    246.06,
    'PIX',
    1,
    'MP-PIX-992100418',
    'APROVADO',
    'SEDEX',
    '1 a 2 dias úteis',
    'Gravar NFC com URL https://vortex.tech/id/lucas-mendonca e laser baixo relevo "AeroTech Labs"',
    '35261034891204000192550010000099211002341234'
) ON CONFLICT (id) DO NOTHING;

-- Itens do pedido ORD-9921
INSERT INTO itens_pedido (
    id, pedido_id, produto_id, titulo_snapshot, sku_snapshot, material, cor, payload_nfc, gravacao_laser, quantidade, preco_unitario, preco_total
) VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Chaveiro Mascote Fox NFC',
    'VRT-FOX-NFC',
    'PLA+',
    'Laranja Vórtex Signature',
    'https://vortex.tech/id/lucas-mendonca',
    'AeroTech Labs',
    2,
    42.90,
    85.80
),
(
    'f0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000008',
    'Organizador de Cabos Hexagonal Magnético',
    'VRT-CAB-HEX',
    'PETG Cetim',
    'Preto Matte',
    NULL,
    NULL,
    1,
    29.90,
    29.90
) ON CONFLICT (id) DO NOTHING;

-- Telemetria IoT do pacote ORD-9921
INSERT INTO telemetria_rastreio (
    id, pedido_id, codigo_rastreio, temperatura_celsius, acelerometro_g_force, bateria_dispositivo_percentual, latitude, longitude, ultimo_hub, descricao_evento, registrado_em
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'SS192839182BR',
    23.8,
    0.03,
    94,
    -23.5673891,
    -46.6892401,
    'Hub Pinheiros / SP',
    'Em rota de entrega técnica para Av. Brigadeiro Faria Lima, 3477',
    CURRENT_TIMESTAMP - INTERVAL '15 minutes'
),
(
    '10000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'SS192839182BR',
    22.4,
    0.01,
    98,
    -23.5592812,
    -46.6912389,
    'Laboratório Vórtex Pinheiros',
    'Inspeção de Bancada e Gravação de Firmware NFC Concluída',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    '10000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'SS192839182BR',
    24.1,
    0.00,
    100,
    -23.5505199,
    -46.6333094,
    'Fazenda de Impressão 3D',
    'Impressão 3D finalizada (Bambu Lab X1-Carbon • 0.08mm)',
    CURRENT_TIMESTAMP - INTERVAL '6 hours'
) ON CONFLICT (id) DO NOTHING;

-- 8. MÁQUINAS DE IMPRESSÃO 3D
INSERT INTO maquinas_impressao (
    id, nome_identificador, tecnologia, status, temperatura_bico_celsius, temperatura_mesa_celsius, nozzle_diametro, camada_atual, total_camadas, tempo_restante_minutos, ativo
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    'Bambu X1-Carbon #01',
    'FDM',
    'IMPRIMINDO',
    220.0,
    60.0,
    '0.4mm Hardened',
    182,
    450,
    48,
    TRUE
),
(
    '20000000-0000-0000-0000-000000000002',
    'Voron 2.4 #02',
    'FDM',
    'OCIOSA',
    24.0,
    24.0,
    '0.4mm CHT',
    0,
    0,
    0,
    TRUE
),
(
    '20000000-0000-0000-0000-000000000003',
    'Elegoo Saturn 4 Ultra #03',
    'RESINA_MSLA',
    'OCIOSA',
    0.0,
    30.0,
    'Resina UV 8K',
    0,
    0,
    0,
    TRUE
),
(
    '20000000-0000-0000-0000-000000000004',
    'Bambu P1S #04',
    'FDM',
    'IMPRIMINDO',
    240.0,
    75.0,
    '0.4mm Brass',
    68,
    210,
    82,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 9. ORDENS DE PRODUÇÃO (O.S.) NO PAINEL ADMIN
INSERT INTO ordens_producao (
    id, codigo_os, maquina_id, cliente_descricao, produto_descricao, quantidade_planejada, quantidade_produzida,
    status, material_utilizado, peso_filamento_estimado_gramas
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    'VTX-9821',
    '20000000-0000-0000-0000-000000000001',
    'TechCon 2025 SP',
    'Chaveiro Fox NFC Geométrico',
    120,
    120,
    'GRAVACAO_NFC',
    'PLA+ Laranja Vórtex',
    2160.00
),
(
    '30000000-0000-0000-0000-000000000002',
    'VTX-9820',
    '20000000-0000-0000-0000-000000000002',
    'Studio Lumina Arquitetura',
    'Vasos Paramétricos Origami (32cm)',
    5,
    0,
    'FILA_FATIAMENTO',
    'PLA+ Bege Areia',
    725.00
),
(
    '30000000-0000-0000-0000-000000000003',
    'VTX-9819',
    NULL,
    'Eduardo Silveira',
    'Chaveiro Mascote Fox Individual',
    1,
    1,
    'CONCLUIDA',
    'PLA+ Laranja Vórtex',
    18.00
),
(
    '30000000-0000-0000-0000-000000000004',
    'VTX-9818',
    '20000000-0000-0000-0000-000000000004',
    'Fintech Kortex',
    'Crachás 3D RFID/NFC Dual-Chip',
    50,
    50,
    'INSPECAO_QA',
    'PETG Fosco Dark Graphite',
    600.00
) ON CONFLICT (id) DO NOTHING;

-- 10. ESTOQUE DE INSUMOS & FILAMENTOS
INSERT INTO estoque_insumos (
    id, sku, nome, categoria_insumo, cor, peso_liquido_gramas_total, quantidade_unidades, estoque_minimo_alerta, fornecedor, ativo
) VALUES
(
    '40000000-0000-0000-0000-000000000001',
    'INS-PLA-ORG',
    'Carretel Filamento PLA+ Laranja Signature',
    'FILAMENTO_PLA',
    'Laranja Vórtex Signature',
    14000.00,
    NULL,
    3000.00,
    'Vórtex Insumos Brasil',
    TRUE
),
(
    '40000000-0000-0000-0000-000000000002',
    'INS-PETG-GRA',
    'Carretel Filamento PETG Industrial Grafite',
    'FILAMENTO_PETG',
    'Grafite Stealth',
    8500.00,
    NULL,
    2000.00,
    'Polímeros Engenharia SP',
    TRUE
),
(
    '40000000-0000-0000-0000-000000000003',
    'INS-ABS-CFB',
    'Carretel ABS Carbon Fiber Black',
    'FILAMENTO_CARBON',
    'Preto Carbono',
    1200.00,
    NULL,
    2000.00,
    'AeroTech Composites',
    TRUE
),
(
    '40000000-0000-0000-0000-000000000004',
    'INS-CHP-N213',
    'Chips NFC NTAG213 Circulares 25mm Vedados',
    'CHIP_NFC',
    NULL,
    NULL,
    450,
    100.00,
    'NXP Semiconductors',
    TRUE
),
(
    '40000000-0000-0000-0000-000000000005',
    'INS-CHP-DUAL',
    'Chips Duplos NTAG215 + RFID 125kHz',
    'CHIP_NFC',
    NULL,
    NULL,
    120,
    50.00,
    'SmartCard Hardware',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 11. AVALIAÇÕES / FEEDBACKS REAIS COM NFC
INSERT INTO avaliacoes_produto (
    id, produto_id, usuario_id, tag_nfc_id, nome_autor, organizacao, nota, comentario, metodo_validacao, posse_validada, aprovado_moderacao, destaque_home
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    NULL,
    'd0000000-0000-0000-0000-000000000001',
    'Marcelo Ramos',
    'Bistrô & Bar 42',
    5,
    'O chaveiro Vórtex NFC ficou impecável! Meus clientes adoram encostar o celular e abrir nosso menu digital sem precisar escanear QR Code em papel amassado.',
    'CHIP_NFC',
    TRUE,
    TRUE,
    TRUE
),
(
    '50000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000005',
    NULL,
    NULL,
    'Fernanda Albuquerque',
    'CTO na VeloceTech',
    5,
    'A consultoria em Next.js e a integração com hardware foi cirúrgica. Resolveram nosso gargalo de performance e ainda entregaram cases 3D sob medida para a placa.',
    'COMPRA_VERIFICADA',
    TRUE,
    TRUE,
    TRUE
),
(
    '50000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000004',
    NULL,
    NULL,
    'Gabriel Prado',
    'Colecionador RPG',
    5,
    'As peças e figures colecionáveis vieram sem nenhuma linha de camada aparente. A precisão dos detalhes na armadura superou qualquer expectativa.',
    'COMPRA_VERIFICADA',
    TRUE,
    TRUE,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 12. PROPOSTA CORPORATIVA B2B DE EXEMPLO
INSERT INTO propostas_b2b (
    id, codigo_proposta, nome_responsavel, empresa, cnpj, email, telefone, modalidade, volume_estimado, descricao_projeto, inclui_chip_nfc, inclui_gravacao_laser, status, valor_total_estimado, prazo_dias_estimado, engenheiro_responsavel
) VALUES
(
    '60000000-0000-0000-0000-000000000001',
    'B2B-2026-088',
    'Camila Rocha',
    'Fintech Lumina Pagamentos SA',
    '45192837000109',
    'camila.rocha@lumina.com.br',
    '(11) 97722-1133',
    'Produtos com NFC',
    '200 a 500 unidades',
    'Produção seriada de chaveiros corporativos com chip NTAG213 integrados com a cor roxo neon da marca para convenção anual.',
    TRUE,
    TRUE,
    'EM_ANALISE_ENGENHARIA',
    9800.00,
    10,
    'Eng. Chefe Vórtex'
) ON CONFLICT (id) DO NOTHING;

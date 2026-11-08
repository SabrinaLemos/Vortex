-- ==============================================================================
-- V1__criar_estrutura_inicial.sql
-- Ecossistema Vórtex 3D Labs & Dev
-- Padrão PostgreSQL com UUID v4 e TIMESTAMPTZ (Instant UTC)
-- ==============================================================================

-- 1. Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255),
    telefone VARCHAR(25),
    tipo_conta VARCHAR(20) NOT NULL DEFAULT 'PF', -- 'PF' ou 'PJ'
    documento VARCHAR(30) UNIQUE, -- CPF ou CNPJ
    razao_social VARCHAR(150),
    perfil_acesso VARCHAR(25) NOT NULL DEFAULT 'CLIENTE', -- 'CLIENTE', 'ADMIN', 'OPERADOR_LAB'
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    provedor_oauth VARCHAR(30) DEFAULT 'LOCAL', -- 'LOCAL', 'GOOGLE', 'GITHUB'
    id_oauth VARCHAR(100),
    token_nfc_auth VARCHAR(120) UNIQUE, -- Token de chave NFC associado ao usuário
    limite_credito_b2b NUMERIC(12, 2) DEFAULT 0.00,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela: enderecos_usuario
CREATE TABLE IF NOT EXISTS enderecos_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario VARCHAR(120) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'ENTREGA', -- 'ENTREGA', 'FATURAMENTO', 'PRINCIPAL'
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela: categorias_produto
CREATE TABLE IF NOT EXISTS categorias_produto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(80) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    ordem_exibicao INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    categoria_id UUID NOT NULL REFERENCES categorias_produto(id),
    titulo VARCHAR(200) NOT NULL,
    subtitulo VARCHAR(255),
    descricao_curta TEXT NOT NULL,
    descricao_completa TEXT NOT NULL,
    preco_base NUMERIC(10, 2) NOT NULL,
    parcelamento_texto VARCHAR(60),
    tecnologia_fabricacao VARCHAR(30) NOT NULL DEFAULT 'FDM', -- 'FDM', 'RESINA', 'SLS', 'HIBRIDO'
    rotulo_tecnologia VARCHAR(60), -- Ex: 'FDM · 0.12mm'
    rotulo_categoria VARCHAR(60), -- Ex: 'Chaveiro Inteligente'
    possui_nfc BOOLEAN NOT NULL DEFAULT FALSE,
    chip_nfc_padrao VARCHAR(50), -- 'NTAG213', 'NTAG215', 'DUAL_RFID'
    tolerancia_milimetrica VARCHAR(20) DEFAULT '±0.08mm',
    infill_padrao VARCHAR(40) DEFAULT '25% Giroide',
    altura_camada_padrao VARCHAR(20) DEFAULT '0.12mm',
    peso_gramas NUMERIC(8, 2),
    dimensoes VARCHAR(60), -- Ex: '45 x 38 x 8 mm'
    imagem_principal_url VARCHAR(255) NOT NULL,
    galeria_imagens_urls JSONB DEFAULT '[]'::jsonb,
    especificacoes_tecnicas JSONB DEFAULT '{}'::jsonb,
    em_estoque BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    nota_media NUMERIC(3, 2) DEFAULT 5.00,
    total_avaliacoes INTEGER DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela: produtos_variacoes_material
CREATE TABLE IF NOT EXISTS produtos_variacoes_material (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    chave_material VARCHAR(30) NOT NULL, -- 'PLA', 'PETG', 'ABS_CARBON', 'RESINA'
    nome_exibicao VARCHAR(60) NOT NULL,
    acrescimo_preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    descricao_tecnica VARCHAR(200),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. Tabela: produtos_variacoes_cor
CREATE TABLE IF NOT EXISTS produtos_variacoes_cor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    nome_cor VARCHAR(60) NOT NULL,
    codigo_hex VARCHAR(10) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. Tabela: tags_nfc
CREATE TABLE IF NOT EXISTS tags_nfc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid VARCHAR(40) NOT NULL UNIQUE, -- Identificador de Hardware (ex: 04:8A:2F:1A:B9:71:80)
    usuario_titular_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    tipo_chip VARCHAR(30) NOT NULL DEFAULT 'NTAG213', -- 'NTAG213', 'NTAG215', 'NTAG216', 'MIFARE'
    apelido VARCHAR(100),
    slug_redirecionamento VARCHAR(100) UNIQUE, -- Rota curta pública (ex: /id/lucas-mendonca)
    url_destino VARCHAR(500) NOT NULL,
    lock_bit_status VARCHAR(30) NOT NULL DEFAULT 'PROTEGIDO_SENHA', -- 'ABERTO', 'PROTEGIDO_SENHA', 'READ_ONLY'
    chave_assinatura_ecdsa VARCHAR(255),
    contagem_toques INTEGER NOT NULL DEFAULT 0,
    ultimo_toque_em TIMESTAMPTZ,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela: historico_toques_nfc
CREATE TABLE IF NOT EXISTS historico_toques_nfc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_nfc_id UUID NOT NULL REFERENCES tags_nfc(id) ON DELETE CASCADE,
    ip_origem VARCHAR(45),
    user_agent TEXT,
    pais VARCHAR(50),
    cidade VARCHAR(100),
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabela: avaliacoes_produto
CREATE TABLE IF NOT EXISTS avaliacoes_produto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    tag_nfc_id UUID REFERENCES tags_nfc(id) ON DELETE SET NULL, -- Validação de posse física via chip
    nome_autor VARCHAR(100) NOT NULL,
    organizacao VARCHAR(100),
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    metodo_validacao VARCHAR(30) NOT NULL DEFAULT 'CHIP_NFC', -- 'CHIP_NFC', 'CODIGO_NFE', 'COMPRA_VERIFICADA'
    posse_validada BOOLEAN NOT NULL DEFAULT TRUE,
    aprovado_moderacao BOOLEAN NOT NULL DEFAULT TRUE,
    destaque_home BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabela: cupons_desconto
CREATE TABLE IF NOT EXISTS cupons_desconto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(40) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL, -- 'PERCENTUAL', 'VALOR_FIXO', 'FRETE_GRATIS'
    valor NUMERIC(10, 2) NOT NULL,
    valor_minimo_pedido NUMERIC(10, 2) DEFAULT 0.00,
    limite_usos INTEGER,
    total_utilizado INTEGER DEFAULT 0,
    valido_ate TIMESTAMPTZ,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabela: carrinhos
CREATE TABLE IF NOT EXISTS carrinhos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    token_sessao VARCHAR(120), -- Para carrinho anônimo antes do login
    cupom_id UUID REFERENCES cupons_desconto(id),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tabela: itens_carrinho
CREATE TABLE IF NOT EXISTS itens_carrinho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrinho_id UUID NOT NULL REFERENCES carrinhos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    material_selecionado VARCHAR(40),
    cor_selecionada VARCHAR(40),
    payload_nfc VARCHAR(255),
    gravacao_laser VARCHAR(50),
    arquivo_cad_id UUID,
    preco_unitario_momento NUMERIC(10, 2) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tabela: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_ordem VARCHAR(30) NOT NULL UNIQUE, -- Ex: ORD-9921
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    endereco_entrega_id UUID REFERENCES enderecos_usuario(id),
    cupom_id UUID REFERENCES cupons_desconto(id),
    status VARCHAR(30) NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
    -- 'AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_FATIAMENTO', 'EM_IMPRESSAO', 
    -- 'GRAVACAO_NFC', 'EMBALADO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO'
    subtotal NUMERIC(10, 2) NOT NULL,
    desconto NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    valor_frete NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(30) NOT NULL, -- 'PIX', 'CARTAO_CREDITO', 'FATURAMENTO_B2B', 'NFC_WALLET'
    parcelas INTEGER DEFAULT 1,
    id_transacao_gateway VARCHAR(100),
    status_pagamento VARCHAR(30) DEFAULT 'PENDENTE',
    qr_code_pix TEXT,
    qr_code_pix_url TEXT,
    modalidade_frete VARCHAR(40) NOT NULL, -- 'SEDEX', 'PAC', 'RETIRADA_LAB'
    prazo_estimado_entrega VARCHAR(50),
    observacoes_producao TEXT,
    chave_acesso_nfe VARCHAR(50),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Tabela: itens_pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id),
    titulo_snapshot VARCHAR(200) NOT NULL,
    sku_snapshot VARCHAR(50) NOT NULL,
    material VARCHAR(40) NOT NULL,
    cor VARCHAR(40) NOT NULL,
    payload_nfc VARCHAR(255),
    gravacao_laser VARCHAR(50),
    arquivo_cad_id UUID,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10, 2) NOT NULL,
    preco_total NUMERIC(10, 2) NOT NULL
);

-- 15. Tabela: telemetria_rastreio
CREATE TABLE IF NOT EXISTS telemetria_rastreio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    codigo_rastreio VARCHAR(50) NOT NULL,
    temperatura_celsius NUMERIC(4, 1),
    acelerometro_g_force NUMERIC(4, 2),
    bateria_dispositivo_percentual INTEGER,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    ultimo_hub VARCHAR(120),
    descricao_evento VARCHAR(255) NOT NULL,
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Tabela: arquivos_projeto_cad
CREATE TABLE IF NOT EXISTS arquivos_projeto_cad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    nome_arquivo_original VARCHAR(255) NOT NULL,
    tamanho_bytes BIGINT NOT NULL,
    extensao VARCHAR(10) NOT NULL, -- 'STL', 'STEP', 'OBJ', '3MF'
    storage_path VARCHAR(500) NOT NULL, -- Caminho no Storage local
    storage_provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL',
    volume_cm3 NUMERIC(8, 2),
    dimensoes_bounding_box VARCHAR(60), -- Ex: '120x80x60mm'
    altura_camada_solicitada VARCHAR(20) DEFAULT '0.20mm',
    infill_solicitado VARCHAR(30) DEFAULT 'Giroide',
    material_solicitado VARCHAR(30) DEFAULT 'PLA',
    cor_solicitada VARCHAR(40),
    possui_chip_nfc BOOLEAN DEFAULT FALSE,
    payload_nfc VARCHAR(255),
    briefing_cliente TEXT,
    orcamento_estimado NUMERIC(10, 2),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Tabela: propostas_b2b
CREATE TABLE IF NOT EXISTS propostas_b2b (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    codigo_proposta VARCHAR(30) NOT NULL UNIQUE, -- Ex: B2B-2026-081
    nome_responsavel VARCHAR(120) NOT NULL,
    empresa VARCHAR(150) NOT NULL,
    cnpj VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    modalidade VARCHAR(50) NOT NULL, -- 'PRODUTOS_NFC', 'PECASE_CAD', 'CONSULTORIA_DEV'
    volume_estimado VARCHAR(50) NOT NULL,
    descricao_projeto TEXT NOT NULL,
    inclui_chip_nfc BOOLEAN NOT NULL DEFAULT FALSE,
    inclui_gravacao_laser BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'RECEBIDA',
    -- 'RECEBIDA', 'EM_ANALISE_ENGENHARIA', 'PROPOSTA_ENVIADA', 'APROVADA', 'REJEITADA'
    valor_total_estimado NUMERIC(12, 2),
    prazo_dias_estimado INTEGER,
    engenheiro_responsavel VARCHAR(100),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Tabela: maquinas_impressao
CREATE TABLE IF NOT EXISTS maquinas_impressao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_identificador VARCHAR(80) NOT NULL UNIQUE, -- 'Bambu X1-Carbon #01', 'Voron 2.4 #02'
    tecnologia VARCHAR(30) NOT NULL, -- 'FDM', 'RESINA_MSLA'
    status VARCHAR(30) NOT NULL DEFAULT 'OCIOSA', -- 'IMPRIMINDO', 'OCIOSA', 'PAUSADA', 'MANUTENCAO'
    temperatura_bico_celsius NUMERIC(5, 1),
    temperatura_mesa_celsius NUMERIC(5, 1),
    nozzle_diametro VARCHAR(30) DEFAULT '0.4mm',
    camada_atual INTEGER DEFAULT 0,
    total_camadas INTEGER DEFAULT 0,
    tempo_restante_minutos INTEGER DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 19. Tabela: ordens_producao
CREATE TABLE IF NOT EXISTS ordens_producao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_os VARCHAR(30) NOT NULL UNIQUE, -- Ex: VTX-9821
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    item_pedido_id UUID REFERENCES itens_pedido(id) ON DELETE SET NULL,
    maquina_id UUID REFERENCES maquinas_impressao(id) ON DELETE SET NULL,
    cliente_descricao VARCHAR(150) NOT NULL,
    produto_descricao VARCHAR(150) NOT NULL,
    quantidade_planejada INTEGER NOT NULL,
    quantidade_produzida INTEGER NOT NULL DEFAULT 0,
    arquivo_gcode_path VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'FILA_FATIAMENTO',
    -- 'FILA_FATIAMENTO', 'EM_IMPRESSAO', 'PAUSA_INSERCAO_CHIP', 
    -- 'GRAVACAO_NFC', 'INSPECAO_QA', 'CONCLUIDA'
    material_utilizado VARCHAR(60),
    peso_filamento_estimado_gramas NUMERIC(8, 2),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. Tabela: estoque_insumos
CREATE TABLE IF NOT EXISTS estoque_insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    categoria_insumo VARCHAR(40) NOT NULL, -- 'FILAMENTO_PLA', 'FILAMENTO_PETG', 'CHIP_NFC', 'RESINA'
    cor VARCHAR(40),
    peso_liquido_gramas_total NUMERIC(10, 2),
    quantidade_unidades INTEGER, -- Para chips NFC e argolas inox
    estoque_minimo_alerta NUMERIC(10, 2) NOT NULL,
    fornecedor VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE E PESQUISA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_documento ON usuarios(documento);
CREATE INDEX IF NOT EXISTS idx_enderecos_usuario_id ON enderecos_usuario(usuario_id);

CREATE INDEX IF NOT EXISTS idx_produtos_sku ON produtos(sku);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo_destaque ON produtos(destaque, em_estoque);

CREATE INDEX IF NOT EXISTS idx_tags_nfc_uid ON tags_nfc(uid);
CREATE INDEX IF NOT EXISTS idx_tags_nfc_slug ON tags_nfc(slug_redirecionamento);
CREATE INDEX IF NOT EXISTS idx_tags_nfc_usuario ON tags_nfc(usuario_titular_id);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_produto_id ON avaliacoes_produto(produto_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_codigo ON pedidos(codigo_ordem);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_telemetria_pedido ON telemetria_rastreio(pedido_id);

CREATE INDEX IF NOT EXISTS idx_propostas_codigo ON propostas_b2b(codigo_proposta);
CREATE INDEX IF NOT EXISTS idx_ordens_producao_os ON ordens_producao(codigo_os);
CREATE INDEX IF NOT EXISTS idx_ordens_producao_maquina ON ordens_producao(maquina_id);
CREATE INDEX IF NOT EXISTS idx_estoque_insumos_sku ON estoque_insumos(sku);

-- ==============================================================================
-- SEEDS INICIAIS: CATEGORIAS OFICIAIS DO ECOSSISTEMA VÓRTEX
-- ==============================================================================
INSERT INTO categorias_produto (slug, nome, descricao, icone, ordem_exibicao) VALUES
('nfc', 'Dispositivos & Tags NFC', 'Chaveiros, crachás e tags inteligentes com chip NFC embutido', 'contactless', 1),
('brindes', 'Brindes & Lotes B2B', 'Lotes corporativos personalizados para onboarding e conferências', 'corporate_fare', 2),
('decoracao', 'Decoração & Design', 'Peças arquitetônicas, vasos paramétricos e luminárias', 'palette', 3),
('figures', 'Figures & Colecionáveis', 'Esculturas ultra detalhadas em Resina 8K e miniaturas de alta precisão', 'view_in_ar', 4),
('utilitarios', 'Utilitários & Desk Setup', 'Suportes MagSafe, organizadores de cabos e docks de trabalho', 'desktop_windows', 5),
('hardware', 'Cases & Hardware IoT', 'Gabinetes para Raspberry Pi, trilhos DIN e invólucros industriais', 'developer_board', 6),
('materiais', 'Filamentos & Insumos', 'Carretéis PLA+, PETG industrial e insumos de alta velocidade', 'layers', 7)
ON CONFLICT (slug) DO NOTHING;

-- Cupons iniciais do frontend
INSERT INTO cupons_desconto (codigo, tipo, valor, valor_minimo_pedido, ativo) VALUES
('VORTEX10', 'PERCENTUAL', 10.00, 50.00, TRUE),
('FRETEFREE', 'FRETE_GRATIS', 100.00, 100.00, TRUE)
ON CONFLICT (codigo) DO NOTHING;

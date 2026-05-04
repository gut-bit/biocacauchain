-- Gutcacau DB — Full schema migration (additive / idempotent)
-- Adds: producer_properties, producer_compliance, market_prices,
--       enriches producers with tipo/nomeFantasia,
--       enriches lot_negotiations with new columns,
--       enriches lots with checklist_itens jsonb,
--       converts text timestamps to TIMESTAMPTZ where applicable.

-- ── Enable uuid extension (idempotent) ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. producers: add missing columns ───────────────────────────────────────
ALTER TABLE producers
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS nome_fantasia TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ── 2. lots: add checklist_itens ─────────────────────────────────────────────
ALTER TABLE lots
  ADD COLUMN IF NOT EXISTS checklist_itens JSONB;

-- ── 3. lot_negotiations: add new commercial fields ───────────────────────────
ALTER TABLE lot_negotiations
  ADD COLUMN IF NOT EXISTS justificativa TEXT,
  ADD COLUMN IF NOT EXISTS condicoes_pagamento TEXT,
  ADD COLUMN IF NOT EXISTS validade_dias INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS obs_internas TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ── 4. producer_properties ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS producer_properties (
  id               VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id      VARCHAR NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  area_total       NUMERIC(10, 2),
  area_cacau       NUMERIC(10, 2),
  bioma            TEXT,
  sistema_producao TEXT,
  num_car          TEXT,
  coord_lat        NUMERIC(10, 7),
  coord_lon        NUMERIC(10, 7),
  updated_at       TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_producer_properties_producer_id ON producer_properties(producer_id);

-- ── 5. producer_compliance ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS producer_compliance (
  id                    VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id           VARCHAR NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  car_regularizado      BOOLEAN NOT NULL DEFAULT FALSE,
  sem_trabalho_infantil BOOLEAN NOT NULL DEFAULT FALSE,
  sem_desmatamento      BOOLEAN NOT NULL DEFAULT FALSE,
  emitir_nf             BOOLEAN NOT NULL DEFAULT FALSE,
  certificacoes         JSONB DEFAULT '[]',
  compliance_score      INTEGER NOT NULL DEFAULT 0,
  updated_at            TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_producer_compliance_producer_id ON producer_compliance(producer_id);

-- ── 6. market_prices ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
  id                    VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo                  TEXT NOT NULL,
  descricao             TEXT NOT NULL,
  preco_medio_r_kg      NUMERIC(10, 2) NOT NULL,
  variacao_dia          NUMERIC(6, 2) NOT NULL DEFAULT 0,
  unidade               TEXT NOT NULL DEFAULT 'R$/kg',
  premium_qualidade     NUMERIC(5, 2) NOT NULL DEFAULT 15,
  desconto_logistica    NUMERIC(5, 2) NOT NULL DEFAULT 5,
  fator_socio_ambiental NUMERIC(5, 2) NOT NULL DEFAULT 5,
  notas                 TEXT,
  atualizado_por        TEXT NOT NULL DEFAULT 'Qualitheo',
  vigente               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_market_prices_tipo    ON market_prices(tipo);
CREATE INDEX IF NOT EXISTS idx_market_prices_vigente ON market_prices(vigente);

-- ── 7. Performance indexes (idempotent) ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_producers_cpf_cnpj   ON producers(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_lots_producer_id     ON lots(producer_id);
CREATE INDEX IF NOT EXISTS idx_lots_status          ON lots(status);
CREATE INDEX IF NOT EXISTS idx_lot_events_lot_id    ON lot_events(lot_id);
CREATE INDEX IF NOT EXISTS idx_lot_neg_lot_id       ON lot_negotiations(lot_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ── 8. Seed default market prices (skip if already exist) ────────────────────
INSERT INTO market_prices (tipo, descricao, preco_medio_r_kg, premium_qualidade, desconto_logistica, fator_socio_ambiental, notas, atualizado_por, vigente)
SELECT 'molhado_baba', 'Cacau Molhado em Baba', 4.20, 15, 5, 5, 'Preços de referência — safra 2026', 'Qualitheo', TRUE
WHERE NOT EXISTS (SELECT 1 FROM market_prices WHERE tipo = 'molhado_baba' AND vigente = TRUE);

INSERT INTO market_prices (tipo, descricao, preco_medio_r_kg, premium_qualidade, desconto_logistica, fator_socio_ambiental, notas, atualizado_por, vigente)
SELECT 'fermentado_seco', 'Cacau Fermentado e Seco', 9.80, 15, 5, 5, 'Preços de referência — safra 2026', 'Qualitheo', TRUE
WHERE NOT EXISTS (SELECT 1 FROM market_prices WHERE tipo = 'fermentado_seco' AND vigente = TRUE);

INSERT INTO market_prices (tipo, descricao, preco_medio_r_kg, premium_qualidade, desconto_logistica, fator_socio_ambiental, notas, atualizado_por, vigente)
SELECT 'amendoa_seca', 'Amêndoa Seca (beneficiada)', 13.50, 15, 5, 5, 'Preços de referência — safra 2026', 'Qualitheo', TRUE
WHERE NOT EXISTS (SELECT 1 FROM market_prices WHERE tipo = 'amendoa_seca' AND vigente = TRUE);

-- ── 9. brands and products: add missin ativo column ──────────────────────────
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

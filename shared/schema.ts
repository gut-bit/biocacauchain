import { sql } from "drizzle-orm";
import {
  pgTable, text, varchar, numeric, jsonb, boolean, timestamp, integer, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("producer"), // producer | qualitheo | admin
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ── Brands ───────────────────────────────────────────────────────────────────
export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  tipo: text("tipo").notNull(), // b2b_ingredientes | cerimonial | parceiro
  descricaoCurta: text("descricao_curta"),
  logoUrl: text("logo_url"),
  siteUrl: text("site_url"),
  ativo: boolean("ativo").notNull().default(true),
});
export type Brand = typeof brands.$inferSelect;

// ── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  tipoProduto: text("tipo_produto").notNull(),
  linha: text("linha").notNull(),
  descricao: text("descricao"),
  especificacoesTecnicas: jsonb("especificacoes_tecnicas").$type<Record<string, any>>(),
  usoPrincipal: text("uso_principal"),
  unidadeBase: text("unidade_base").notNull(),
  imagens: jsonb("imagens").$type<string[]>(),
  ativo: boolean("ativo").notNull().default(true),
}, (t) => [
  index("idx_products_brand_id").on(t.brandId),
]);
export type Product = typeof products.$inferSelect;

// ── Price lists ───────────────────────────────────────────────────────────────
export const priceLists = pgTable("price_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  tipoCliente: text("tipo_cliente").notNull(),
  moeda: text("moeda").notNull().default("BRL"),
});
export type PriceList = typeof priceLists.$inferSelect;

// ── Product prices ────────────────────────────────────────────────────────────
export const productPrices = pgTable("product_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  priceListId: varchar("price_list_id").notNull().references(() => priceLists.id),
  precoUnitario: numeric("preco_unitario", { precision: 12, scale: 2 }).notNull(),
  moeda: text("moeda").notNull().default("BRL"),
  moq: numeric("moq", { precision: 12, scale: 2 }).notNull(),
  descontosPorVolume: jsonb("descontos_por_volume").$type<Record<string, number>>(),
}, (t) => [
  index("idx_product_prices_product_id").on(t.productId),
  uniqueIndex("idx_product_prices_unique").on(t.productId, t.priceListId),
]);
export type ProductPrice = typeof productPrices.$inferSelect;

// ── Customers ─────────────────────────────────────────────────────────────────
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  tipo: text("tipo").notNull(),
  empresaNome: text("empresa_nome"),
  cnpjCpf: text("cnpj_cpf"),
  endereco: jsonb("endereco").$type<Record<string, any>>(),
  listaPrecoPadraoId: varchar("lista_preco_padrao_id").references(() => priceLists.id),
  interesses: jsonb("interesses").$type<string[]>(),
});
export type Customer = typeof customers.$inferSelect;

// ── Orders ────────────────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  tipo: text("tipo").notNull(),
  status: text("status").notNull().default("rascunho"),
  totalBruto: numeric("total_bruto", { precision: 14, scale: 2 }).notNull().default("0"),
  descontos: numeric("descontos", { precision: 14, scale: 2 }).notNull().default("0"),
  totalLiquido: numeric("total_liquido", { precision: 14, scale: 2 }).notNull().default("0"),
  moeda: text("moeda").notNull().default("BRL"),
  canal: text("canal").notNull().default("site"),
  condicoesPagamento: text("condicoes_pagamento"),
  observacoes: text("observacoes"),
  referenciaCliente: text("referencia_cliente"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_orders_customer_id").on(t.customerId),
  index("idx_orders_status").on(t.status),
]);
export type Order = typeof orders.$inferSelect;

// ── Order items ───────────────────────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantidade: numeric("quantidade", { precision: 14, scale: 3 }).notNull(),
  precoUnitario: numeric("preco_unitario", { precision: 14, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
}, (t) => [
  index("idx_order_items_order_id").on(t.orderId),
]);
export type OrderItem = typeof orderItems.$inferSelect;

// ── Producers ─────────────────────────────────────────────────────────────────
export const producers = pgTable("producers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  tipo: text("tipo").default("individual"), // individual | empresa | cooperativa
  nome: text("nome").notNull(),
  nomeFantasia: text("nome_fantasia"),
  fazendaNome: text("fazenda_nome"),
  cpfCnpj: text("cpf_cnpj").notNull(),
  municipio: text("municipio").notNull(),
  estado: text("estado").notNull(),
  contatoEmail: text("contato_email"),
  contatoTelefone: text("contato_telefone"),
  documentos: jsonb("documentos").$type<Record<string, any>>(),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_producers_cpf_cnpj").on(t.cpfCnpj),
]);
export type Producer = typeof producers.$inferSelect;

// ── Producer properties ───────────────────────────────────────────────────────
export const producerProperties = pgTable("producer_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  producerId: varchar("producer_id").notNull().references(() => producers.id, { onDelete: "cascade" }),
  areaTotal: numeric("area_total", { precision: 10, scale: 2 }),
  areaCacau: numeric("area_cacau", { precision: 10, scale: 2 }),
  bioma: text("bioma"),
  sistemaProducao: text("sistema_producao"),
  numCAR: text("num_car"),
  coordLat: numeric("coord_lat", { precision: 10, scale: 7 }),
  coordLon: numeric("coord_lon", { precision: 10, scale: 7 }),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  uniqueIndex("idx_producer_properties_producer_id").on(t.producerId),
]);
export type ProducerProperty = typeof producerProperties.$inferSelect;

// ── Producer compliance ───────────────────────────────────────────────────────
export const producerCompliance = pgTable("producer_compliance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  producerId: varchar("producer_id").notNull().references(() => producers.id, { onDelete: "cascade" }),
  carRegularizado: boolean("car_regularizado").notNull().default(false),
  semTrabalhoInfantil: boolean("sem_trabalho_infantil").notNull().default(false),
  semDesmatamento: boolean("sem_desmatamento").notNull().default(false),
  emitirNF: boolean("emitir_nf").notNull().default(false),
  certificacoes: jsonb("certificacoes").$type<string[]>().default([]),
  complianceScore: integer("compliance_score").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  uniqueIndex("idx_producer_compliance_producer_id").on(t.producerId),
]);
export type ProducerCompliance = typeof producerCompliance.$inferSelect;

// ── Lots ──────────────────────────────────────────────────────────────────────
export const lots = pgTable("lots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  producerId: varchar("producer_id").notNull().references(() => producers.id),
  tipo: text("tipo").notNull(),
  safra: text("safra").notNull(),
  pesoKg: numeric("peso_kg", { precision: 14, scale: 3 }).notNull(),
  origemTalhao: text("origem_talhao"),
  scoreQualidade: numeric("score_qualidade", { precision: 5, scale: 2 }),
  indiceFidelidade: numeric("indice_fidelidade", { precision: 4, scale: 2 }),
  checklistItens: jsonb("checklist_itens").$type<Record<string, number>>(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_lots_producer_id").on(t.producerId),
  index("idx_lots_status").on(t.status),
]);
export type Lot = typeof lots.$inferSelect;

// ── Lot events ────────────────────────────────────────────────────────────────
export const lotEvents = pgTable("lot_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lotId: varchar("lot_id").notNull().references(() => lots.id),
  tipoEvento: text("tipo_evento").notNull(),
  dataEvento: timestamp("data_evento").defaultNow(),
  detalhes: jsonb("detalhes").$type<Record<string, any>>(),
}, (t) => [
  index("idx_lot_events_lot_id").on(t.lotId),
]);
export type LotEvent = typeof lotEvents.$inferSelect;

// ── Pricing models ────────────────────────────────────────────────────────────
export const pricingModels = pgTable("pricing_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modalidade: text("modalidade").notNull(),
  precoRefMercadoUsdTon: numeric("preco_ref_mercado_usd_ton", { precision: 14, scale: 2 }).notNull(),
  fxUsdBrl: numeric("fx_usd_brl", { precision: 10, scale: 4 }).notNull(),
  precoRefSecoBrutoRKg: numeric("preco_ref_seco_bruto_r_kg", { precision: 12, scale: 4 }).notNull(),
  fatorConversaoBabaParaSeco: numeric("fator_conversao_baba_para_seco", { precision: 4, scale: 2 }).notNull(),
  custoProcessamentoRKgSeco: numeric("custo_processamento_r_kg_seco", { precision: 12, scale: 4 }).notNull(),
  margemQualitheoPct: numeric("margem_qualitheo_pct", { precision: 5, scale: 4 }).notNull(),
  bonusQualidadePctMin: numeric("bonus_qualidade_pct_min", { precision: 5, scale: 4 }).notNull(),
  bonusQualidadePctMax: numeric("bonus_qualidade_pct_max", { precision: 5, scale: 4 }).notNull(),
  bonusFidelidadePctMax: numeric("bonus_fidelidade_pct_max", { precision: 5, scale: 4 }).notNull(),
  ativo: boolean("ativo").notNull().default(true),
});
export type PricingModel = typeof pricingModels.$inferSelect;

// ── Lot negotiations ──────────────────────────────────────────────────────────
export const lotNegotiations = pgTable("lot_negotiations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lotId: varchar("lot_id").notNull().references(() => lots.id),
  precoOferecidoRKg: numeric("preco_oferecido_r_kg", { precision: 12, scale: 2 }).notNull(),
  precoSugeridoRKg: numeric("preco_sugerido_r_kg", { precision: 12, scale: 2 }).notNull(),
  precoMinRKg: numeric("preco_min_r_kg", { precision: 12, scale: 2 }).notNull(),
  justificativa: text("justificativa"),
  condicoesPagamento: text("condicoes_pagamento"),
  validadeDias: integer("validade_dias").default(5),
  obsInternas: text("obs_internas"),
  status: text("status").notNull().default("proposta_qualitheo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_lot_negotiations_lot_id").on(t.lotId),
]);
export type LotNegotiation = typeof lotNegotiations.$inferSelect;

// ── Market prices (daily Qualitheo price board) ───────────────────────────────
export const marketPrices = pgTable("market_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipo: text("tipo").notNull(), // molhado_baba | fermentado_seco | amendoa_seca
  descricao: text("descricao").notNull(),
  precoMedioRKg: numeric("preco_medio_r_kg", { precision: 10, scale: 2 }).notNull(),
  variacaoDia: numeric("variacao_dia", { precision: 6, scale: 2 }).notNull().default("0"),
  unidade: text("unidade").notNull().default("R$/kg"),
  premiumQualidade: numeric("premium_qualidade", { precision: 5, scale: 2 }).notNull().default("15"),
  descontoLogistica: numeric("desconto_logistica", { precision: 5, scale: 2 }).notNull().default("5"),
  fatorSocioAmbiental: numeric("fator_socio_ambiental", { precision: 5, scale: 2 }).notNull().default("5"),
  notas: text("notas"),
  atualizadoPor: text("atualizado_por").notNull().default("Qualitheo"),
  vigente: boolean("vigente").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_market_prices_tipo").on(t.tipo),
  index("idx_market_prices_vigente").on(t.vigente),
]);
export type MarketPrice = typeof marketPrices.$inferSelect;

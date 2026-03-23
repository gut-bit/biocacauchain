/**
 * DrizzleStorage — Production PostgreSQL storage layer for Gutcacau.
 *
 * Domain model:
 *   Users → Customers / Producers
 *   Producers → ProducerProperties, ProducerCompliance
 *   Producers → Lots → LotEvents, LotNegotiations
 *   Brands → Products → ProductPrices, PriceLists
 *   Customers → Orders → OrderItems
 *   MarketPrices (Qualitheo daily price board)
 */

import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import {
  users, brands, products, priceLists, productPrices,
  customers, orders, orderItems, producers, producerProperties,
  producerCompliance, lots, lotEvents, pricingModels, lotNegotiations,
  marketPrices,
  type User, type InsertUser, type Brand, type Product,
  type ProductPrice, type PriceList, type Customer,
  type Order, type OrderItem, type Producer, type Lot,
  type LotEvent, type PricingModel, type LotNegotiation,
  type ProducerProperty, type ProducerCompliance, type MarketPrice,
} from "@shared/schema";

// ── Typed Error ───────────────────────────────────────────────────────────────
export class NotFoundError extends Error {
  status = 404;
  constructor(entity: string, id?: string) {
    super(id ? `${entity} not found: ${id}` : `${entity} not found`);
    this.name = "NotFoundError";
  }
}

// ── Storage interface ─────────────────────────────────────────────────────────
export interface IStorage {
  // Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Catalog
  listBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  listProducts(filter?: { brandSlug?: string }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getPriceListByName(name: string): Promise<PriceList | undefined>;
  getProductPrices(productId: string, priceListId: string): Promise<ProductPrice | undefined>;

  // Orders
  createOrder(input: { customerId: string; tipo: "b2b" | "b2c"; canal: string }): Promise<Order>;
  getDraftOrderForCustomer(customerId: string): Promise<Order | undefined>;
  getOrderById(id: string): Promise<Order | undefined>;
  upsertOrderItem(input: { orderId: string; productId: string; quantidade: number }): Promise<{ order: Order; item: OrderItem }>;
  confirmOrder(input: { orderId: string; condicoesPagamento?: string; observacoes?: string; referenciaCliente?: string }): Promise<Order>;

  // Producers
  createProducer(input: Omit<Producer, "id" | "createdAt">): Promise<Producer>;
  getProducerById(id: string): Promise<Producer | undefined>;
  getProducerByUserId(userId: string): Promise<Producer | undefined>;
  upsertProducerProperty(producerId: string, data: Partial<ProducerProperty>): Promise<ProducerProperty>;
  upsertProducerCompliance(producerId: string, data: Partial<ProducerCompliance>): Promise<ProducerCompliance>;
  getProducerProperty(producerId: string): Promise<ProducerProperty | undefined>;
  getProducerCompliance(producerId: string): Promise<ProducerCompliance | undefined>;

  // Lots
  listLots(filter?: { producerId?: string; status?: string }): Promise<Lot[]>;
  createLot(input: { producerId: string; tipo: string; safra: string; pesoKg: number; origemTalhao?: string }): Promise<Lot>;
  getLotById(id: string): Promise<Lot | undefined>;
  updateLotScoreQualidade(lotId: string, score: number, checklistItens?: Record<string, number>): Promise<Lot>;
  updateLotStatus(lotId: string, status: string): Promise<Lot>;
  getOriginationAnalytics(): Promise<any>;

  // Events
  createLotEvent(input: { lotId: string; tipoEvento: string; detalhes?: Record<string, any> }): Promise<LotEvent>;
  listLotEvents(lotId: string): Promise<LotEvent[]>;

  // Negotiations
  createLotNegotiation(input: {
    lotId: string;
    precoOferecidoRKg: number;
    precoSugeridoRKg: number;
    precoMinRKg: number;
    justificativa?: string;
    condicoesPagamento?: string;
    validadeDias?: number;
    obsInternas?: string;
  }): Promise<LotNegotiation>;
  getLatestNegotiationForLot(lotId: string): Promise<LotNegotiation | undefined>;
  updateLotNegotiationStatus(input: { negotiationId: string; status: string }): Promise<LotNegotiation>;

  // Market prices
  listMarketPrices(): Promise<MarketPrice[]>;
  upsertMarketPrice(tipo: string, data: Partial<MarketPrice>): Promise<MarketPrice>;

  // Seeds (catalog only — idempotent)
  seedBrand(brand: Brand): Promise<void>;
  seedPriceList(pl: PriceList): Promise<void>;
  seedProduct(prod: Product): Promise<void>;
  seedProductPrice(pp: ProductPrice): Promise<void>;
  seedMarketPrices(): Promise<void>;
}

// ── DrizzleStorage ────────────────────────────────────────────────────────────
export class DrizzleStorage implements IStorage {

  // ── Auth ───────────────────────────────────────────────────────────────────
  async getUser(id: string) {
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return row;
  }

  async getUserByUsername(username: string) {
    const [row] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return row;
  }

  async createUser(input: InsertUser): Promise<User> {
    const [row] = await db.insert(users).values(input).returning();
    return row;
  }

  // ── Catalog ────────────────────────────────────────────────────────────────
  async listBrands() {
    return db.select().from(brands).where(eq(brands.ativo, true)).orderBy(asc(brands.nome));
  }

  async getBrandBySlug(slug: string) {
    const [row] = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
    return row;
  }

  async listProducts(filter?: { brandSlug?: string }) {
    if (filter?.brandSlug) {
      const brand = await this.getBrandBySlug(filter.brandSlug);
      if (!brand) return [];
      return db.select().from(products)
        .where(and(eq(products.brandId, brand.id), eq(products.ativo, true)));
    }
    return db.select().from(products).where(eq(products.ativo, true));
  }

  async getProductBySlug(slug: string) {
    const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return row;
  }

  async getPriceListByName(name: string) {
    const [row] = await db.select().from(priceLists).where(eq(priceLists.nome, name)).limit(1);
    return row;
  }

  async getProductPrices(productId: string, priceListId: string) {
    const [row] = await db.select().from(productPrices)
      .where(and(eq(productPrices.productId, productId), eq(productPrices.priceListId, priceListId)))
      .limit(1);
    return row;
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  async createOrder(input: { customerId: string; tipo: "b2b" | "b2c"; canal: string }): Promise<Order> {
    const [row] = await db.insert(orders).values(input).returning();
    return row;
  }

  async getDraftOrderForCustomer(customerId: string) {
    const [row] = await db.select().from(orders)
      .where(and(eq(orders.customerId, customerId), eq(orders.status, "rascunho")))
      .limit(1);
    return row;
  }

  async getOrderById(id: string) {
    const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return row;
  }

  async upsertOrderItem(input: { orderId: string; productId: string; quantidade: number }): Promise<{ order: Order; item: OrderItem }> {
    const order = await this.getOrderById(input.orderId);
    if (!order) throw new NotFoundError("Order", input.orderId);

    const [product] = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
    if (!product) throw new NotFoundError("Product", input.productId);

    const [priceList] = await db.select().from(priceLists).where(eq(priceLists.nome, "B2B Brasil")).limit(1);
    if (!priceList) throw new NotFoundError("PriceList", "B2B Brasil");

    const [price] = await db.select().from(productPrices)
      .where(and(eq(productPrices.productId, product.id), eq(productPrices.priceListId, priceList.id)))
      .limit(1);
    if (!price) throw new NotFoundError("ProductPrice");

    const qty = input.quantidade;
    const basePrice = Number(price.precoUnitario);
    const discounts = (price.descontosPorVolume || {}) as Record<string, number>;
    let discountPct = 0;

    for (const faixa of Object.keys(discounts)) {
      if (faixa.includes("+")) {
        const min = Number(faixa.replace("+", ""));
        if (qty >= min) discountPct = Math.max(discountPct, discounts[faixa]);
      } else {
        const [minStr, maxStr] = faixa.split("-");
        if (qty >= Number(minStr) && qty <= Number(maxStr)) discountPct = Math.max(discountPct, discounts[faixa]);
      }
    }

    const precoUnitario = basePrice * (1 - discountPct);
    const subtotal = precoUnitario * qty;

    // Upsert item
    const [existing] = await db.select().from(orderItems)
      .where(and(eq(orderItems.orderId, order.id), eq(orderItems.productId, product.id)))
      .limit(1);

    let item: OrderItem;
    if (!existing) {
      const [inserted] = await db.insert(orderItems).values({
        orderId: order.id,
        productId: product.id,
        quantidade: qty.toString(),
        precoUnitario: precoUnitario.toFixed(2),
        subtotal: subtotal.toFixed(2),
      }).returning();
      item = inserted;
    } else {
      const [updated] = await db.update(orderItems)
        .set({ quantidade: qty.toString(), precoUnitario: precoUnitario.toFixed(2), subtotal: subtotal.toFixed(2) })
        .where(eq(orderItems.id, existing.id))
        .returning();
      item = updated;
    }

    // Recalculate order totals
    const allItems = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const totalBruto = allItems.reduce((acc, i) => acc + Number(i.precoUnitario) * Number(i.quantidade), 0);
    const totalLiquido = allItems.reduce((acc, i) => acc + Number(i.subtotal), 0);

    const [updatedOrder] = await db.update(orders)
      .set({
        totalBruto: totalBruto.toFixed(2),
        descontos: (totalBruto - totalLiquido).toFixed(2),
        totalLiquido: totalLiquido.toFixed(2),
      })
      .where(eq(orders.id, order.id))
      .returning();

    return { order: updatedOrder, item };
  }

  async confirmOrder(input: { orderId: string; condicoesPagamento?: string; observacoes?: string; referenciaCliente?: string }): Promise<Order> {
    const [updated] = await db.update(orders)
      .set({
        status: "confirmado",
        condicoesPagamento: input.condicoesPagamento,
        observacoes: input.observacoes,
        referenciaCliente: input.referenciaCliente,
      })
      .where(eq(orders.id, input.orderId))
      .returning();
    if (!updated) throw new NotFoundError("Order", input.orderId);
    return updated;
  }

  // ── Producers ──────────────────────────────────────────────────────────────
  async createProducer(input: Omit<Producer, "id" | "createdAt">): Promise<Producer> {
    const [row] = await db.insert(producers).values(input).returning();
    return row;
  }

  async getProducerById(id: string) {
    const [row] = await db.select().from(producers).where(eq(producers.id, id)).limit(1);
    return row;
  }

  async getProducerByUserId(userId: string) {
    const [row] = await db.select().from(producers).where(eq(producers.userId, userId)).limit(1);
    return row;
  }

  async upsertProducerProperty(producerId: string, data: Partial<ProducerProperty>): Promise<ProducerProperty> {
    const [existing] = await db.select().from(producerProperties)
      .where(eq(producerProperties.producerId, producerId)).limit(1);

    if (existing) {
      const [updated] = await db.update(producerProperties)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(producerProperties.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(producerProperties)
        .values({ producerId, ...data })
        .returning();
      return inserted;
    }
  }

  async upsertProducerCompliance(producerId: string, data: Partial<ProducerCompliance>): Promise<ProducerCompliance> {
    const score = [
      data.carRegularizado,
      data.semTrabalhoInfantil,
      data.semDesmatamento,
      data.emitirNF,
      data.certificacoes && (data.certificacoes as string[]).length > 0,
    ].filter(Boolean).length;

    const [existing] = await db.select().from(producerCompliance)
      .where(eq(producerCompliance.producerId, producerId)).limit(1);

    if (existing) {
      const [updated] = await db.update(producerCompliance)
        .set({ ...data, complianceScore: score, updatedAt: new Date() })
        .where(eq(producerCompliance.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(producerCompliance)
        .values({ producerId, ...data, complianceScore: score })
        .returning();
      return inserted;
    }
  }

  async getProducerProperty(producerId: string) {
    const [row] = await db.select().from(producerProperties)
      .where(eq(producerProperties.producerId, producerId)).limit(1);
    return row;
  }

  async getProducerCompliance(producerId: string) {
    const [row] = await db.select().from(producerCompliance)
      .where(eq(producerCompliance.producerId, producerId)).limit(1);
    return row;
  }

  // ── Lots ───────────────────────────────────────────────────────────────────
  async listLots(filter?: { producerId?: string; status?: string }) {
    const conditions = [];
    if (filter?.producerId) conditions.push(eq(lots.producerId, filter.producerId));
    if (filter?.status) conditions.push(eq(lots.status, filter.status));

    const query = conditions.length
      ? db.select().from(lots).where(and(...conditions))
      : db.select().from(lots);

    return query.orderBy(desc(lots.createdAt));
  }

  async createLot(input: { producerId: string; tipo: string; safra: string; pesoKg: number; origemTalhao?: string }): Promise<Lot> {
    const [row] = await db.insert(lots).values({
      ...input,
      pesoKg: input.pesoKg.toString(),
      status: "draft",
    }).returning();
    return row;
  }

  async getLotById(id: string) {
    const [row] = await db.select().from(lots).where(eq(lots.id, id)).limit(1);
    return row;
  }

  async updateLotScoreQualidade(lotId: string, score: number, checklistItens?: Record<string, number>): Promise<Lot> {
    const [updated] = await db.update(lots)
      .set({ scoreQualidade: score.toFixed(2), ...(checklistItens ? { checklistItens } : {}) })
      .where(eq(lots.id, lotId))
      .returning();
    if (!updated) throw new NotFoundError("Lot", lotId);
    return updated;
  }

  async updateLotStatus(lotId: string, status: string): Promise<Lot> {
    const [updated] = await db.update(lots)
      .set({ status })
      .where(eq(lots.id, lotId))
      .returning();
    if (!updated) throw new NotFoundError("Lot", lotId);
    return updated;
  }

  async getOriginationAnalytics() {
    // Analytics: Fetch all lots and group by status
    const allLots = await db.select().from(lots);
    
    // Fetch all confirmed negotiations to calculate financial commitments
    const allNegotiations = await db.select().from(lotNegotiations)
       .where(eq(lotNegotiations.status, "aceita_produtor"));

    // Also get pending proposals for "Em negociação" financial commitments
    const pendingNegotiations = await db.select().from(lotNegotiations)
       .where(eq(lotNegotiations.status, "proposta_qualitheo"));

    const analytics = {
      funnel: { draft: 0, em_negociacao: 0, comprado: 0 },
      weightKg: { draft: 0, em_negociacao: 0, comprado: 0 },
      financialR$: { em_negociacao: 0, comprado: 0 }
    };

    // Calculate funnel and weights
    for (const lot of allLots) {
      const status = lot.status as keyof typeof analytics.funnel;
      const weight = Number(lot.pesoKg) || 0;
      
      if (analytics.funnel[status] !== undefined) {
        analytics.funnel[status]++;
        analytics.weightKg[status] += weight;
      }
    }

    // Calculate financials for bought lots 
    for (const neg of allNegotiations) {
        const lot = allLots.find(l => l.id === neg.lotId);
        if (lot && lot.status === "comprado") {
           analytics.financialR$.comprado += Number(neg.precoOferecidoRKg) * Number(lot.pesoKg);
        }
    }

    // Calculate financials for lots currently in negotiation
    for (const neg of pendingNegotiations) {
         const lot = allLots.find(l => l.id === neg.lotId);
         if (lot && lot.status === "em_negociacao") {
            // Find if this is the latest negotiation for the lot
            const isLatest = pendingNegotiations
                .filter(n => n.lotId === lot.id)
                .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())[0]?.id === neg.id;
                
            if (isLatest) {
                analytics.financialR$.em_negociacao += Number(neg.precoOferecidoRKg) * Number(lot.pesoKg);
            }
         }
    }

    return analytics;
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  async createLotEvent(input: { lotId: string; tipoEvento: string; detalhes?: Record<string, any> }): Promise<LotEvent> {
    const [row] = await db.insert(lotEvents).values(input).returning();
    return row;
  }

  async listLotEvents(lotId: string): Promise<LotEvent[]> {
    return db.select().from(lotEvents)
      .where(eq(lotEvents.lotId, lotId))
      .orderBy(asc(lotEvents.dataEvento));
  }

  // ── Negotiations ───────────────────────────────────────────────────────────
  async createLotNegotiation(input: {
    lotId: string;
    precoOferecidoRKg: number;
    precoSugeridoRKg: number;
    precoMinRKg: number;
    justificativa?: string;
    condicoesPagamento?: string;
    validadeDias?: number;
    obsInternas?: string;
  }): Promise<LotNegotiation> {
    const [row] = await db.insert(lotNegotiations).values({
      lotId: input.lotId,
      precoOferecidoRKg: input.precoOferecidoRKg.toFixed(2),
      precoSugeridoRKg: input.precoSugeridoRKg.toFixed(2),
      precoMinRKg: input.precoMinRKg.toFixed(2),
      justificativa: input.justificativa,
      condicoesPagamento: input.condicoesPagamento,
      validadeDias: input.validadeDias ?? 5,
      obsInternas: input.obsInternas,
      status: "proposta_qualitheo",
    }).returning();
    return row;
  }

  async getLatestNegotiationForLot(lotId: string) {
    const [row] = await db.select().from(lotNegotiations)
      .where(eq(lotNegotiations.lotId, lotId))
      .orderBy(desc(lotNegotiations.createdAt))
      .limit(1);
    return row;
  }

  async updateLotNegotiationStatus(input: { negotiationId: string; status: string }): Promise<LotNegotiation> {
    const [updated] = await db.update(lotNegotiations)
      .set({ status: input.status, updatedAt: new Date() })
      .where(eq(lotNegotiations.id, input.negotiationId))
      .returning();
    if (!updated) throw new NotFoundError("LotNegotiation", input.negotiationId);
    return updated;
  }

  // ── Market Prices ──────────────────────────────────────────────────────────
  async listMarketPrices(): Promise<MarketPrice[]> {
    return db.select().from(marketPrices)
      .where(eq(marketPrices.vigente, true))
      .orderBy(asc(marketPrices.tipo));
  }

  async upsertMarketPrice(tipo: string, data: Partial<MarketPrice>): Promise<MarketPrice> {
    const [existing] = await db.select().from(marketPrices)
      .where(and(eq(marketPrices.tipo, tipo), eq(marketPrices.vigente, true)))
      .limit(1);

    // Build a safe update payload — only include mutable, non-generated fields
    const mutableFields = {
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.precoMedioRKg !== undefined && { precoMedioRKg: String(data.precoMedioRKg) }),
      ...(data.unidade !== undefined && { unidade: data.unidade }),
      ...(data.premiumQualidade !== undefined && { premiumQualidade: String(data.premiumQualidade) }),
      ...(data.descontoLogistica !== undefined && { descontoLogistica: String(data.descontoLogistica) }),
      ...(data.fatorSocioAmbiental !== undefined && { fatorSocioAmbiental: String(data.fatorSocioAmbiental) }),
      ...(data.notas !== undefined && { notas: data.notas }),
      ...(data.atualizadoPor !== undefined && { atualizadoPor: data.atualizadoPor }),
      ...(data.vigente !== undefined && { vigente: data.vigente }),
    };

    if (existing) {
      const previousPrice = Number(existing.precoMedioRKg);
      const newPrice = data.precoMedioRKg ? Number(data.precoMedioRKg) : previousPrice;
      const variacaoDia = previousPrice > 0
        ? Number(((newPrice - previousPrice) / previousPrice * 100).toFixed(2))
        : 0;

      const [updated] = await db.update(marketPrices)
        .set({ ...mutableFields, variacaoDia: variacaoDia.toFixed(2), createdAt: new Date() })
        .where(eq(marketPrices.id, existing.id))
        .returning();
      return updated;
    } else {
      // Insert requires the mandatory fields: tipo, descricao, precoMedioRKg
      const [inserted] = await db.insert(marketPrices).values({
        tipo,
        descricao: data.descricao ?? tipo,
        precoMedioRKg: String(data.precoMedioRKg ?? "0"),
        vigente: true,
        ...mutableFields,
      }).returning();
      return inserted;
    }
  }

  // ── Catalog Seeds (idempotent via ON CONFLICT DO NOTHING) ──────────────────
  async seedBrand(brand: Brand): Promise<void> {
    await db.insert(brands).values(brand).onConflictDoNothing({ target: brands.id });
  }

  async seedPriceList(pl: PriceList): Promise<void> {
    await db.insert(priceLists).values(pl).onConflictDoNothing({ target: priceLists.id });
  }

  async seedProduct(prod: Product): Promise<void> {
    await db.insert(products).values(prod).onConflictDoNothing({ target: products.id });
  }

  async seedProductPrice(pp: ProductPrice): Promise<void> {
    await db.insert(productPrices).values({
      ...pp,
      precoUnitario: String(pp.precoUnitario),
      moq: String(pp.moq),
    }).onConflictDoNothing({ target: productPrices.id });
  }

  async seedMarketPrices(): Promise<void> {
    const defaults = [
      { tipo: "molhado_baba", descricao: "Cacau Molhado em Baba", precoMedioRKg: "4.20", premiumQualidade: "15", descontoLogistica: "5", fatorSocioAmbiental: "5", notas: "Preços de referência — safra 2026", atualizadoPor: "Qualitheo", vigente: true },
      { tipo: "fermentado_seco", descricao: "Cacau Fermentado e Seco", precoMedioRKg: "9.80", premiumQualidade: "15", descontoLogistica: "5", fatorSocioAmbiental: "5", notas: "Preços de referência — safra 2026", atualizadoPor: "Qualitheo", vigente: true },
      { tipo: "amendoa_seca", descricao: "Amêndoa Seca (beneficiada)", precoMedioRKg: "13.50", premiumQualidade: "15", descontoLogistica: "5", fatorSocioAmbiental: "5", notas: "Preços de referência — safra 2026", atualizadoPor: "Qualitheo", vigente: true },
    ];

    for (const mp of defaults) {
      const [existing] = await db.select().from(marketPrices)
        .where(and(eq(marketPrices.tipo, mp.tipo), eq(marketPrices.vigente, true))).limit(1);
      if (!existing) {
        await db.insert(marketPrices).values(mp);
      }
    }
  }
}

export const storage = new DrizzleStorage();

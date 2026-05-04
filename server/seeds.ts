/**
 * seeds.ts — Idempotent catalog seed via DrizzleStorage.
 *
 * Uses ON CONFLICT DO NOTHING internally — safe to call on every cold start.
 * Seeds: Qualitheo brand, B2B price list, Nibs & Liquor products, market prices.
 */
import type { Brand, PriceList, Product, ProductPrice } from "@shared/schema";
import { storage } from "./storage";

const brandQualitheo: Brand = {
    id: "brand_qualitheo",
    nome: "Qualitheo Agroindustries",
    slug: "qualitheo-agroindustries",
    tipo: "b2b_ingredientes",
    descricaoCurta: "Agroindústria amazônica focada em cacau de qualidade para a indústria.",
    logoUrl: "/static/img/brands/qualitheo-logo.png",
    siteUrl: "https://qualitheo.gutcacau.com",
    ativo: true,
};

const priceListB2BBrasil: PriceList = {
    id: "pl_b2b_brasil",
    nome: "B2B Brasil",
    tipoCliente: "b2b",
    moeda: "BRL",
};

const prodNibs: Product = {
    id: "prod_nibs_10_12",
    brandId: "brand_qualitheo",
    nome: "Nibs de cacau amazônico 10–12 mm",
    slug: "nibs-cacau-amazonico-10-12",
    tipoProduto: "nibs",
    linha: "qualitheo_b2b",
    descricao: "Nibs de cacau premium da Amazônia, com perfil sensorial frutado e textura uniforme.",
    especificacoesTecnicas: {
        origem_regiao: "Transamazônica, Pará – Brasil",
        perfil_sensorial: "Frutas amarelas, castanhas, leve floral",
        umidade_max: 2.0,
        peneira: "10–12",
        fermentacao: "7 dias, caixa de madeira",
        embalagem: "Sacos de 25 kg",
    },
    usoPrincipal: "chocolate",
    unidadeBase: "kg",
    imagens: ["/static/img/products/qualitheo-nibs-10-12.jpg"],
    ativo: true,
};

const prodLiquor: Product = {
    id: "prod_liquor_qual",
    brandId: "brand_qualitheo",
    nome: "Liquor de cacau amazônico",
    slug: "liquor-cacau-amazonico",
    tipoProduto: "liquor",
    linha: "qualitheo_b2b",
    descricao: "Massa de cacau 100% originada de cacau fino da Transamazônica, fermentado e seco.",
    especificacoesTecnicas: {
        origem_regiao: "Transamazônica, Pará – Brasil",
        gordura_pct: 52,
        umidade_max: 1.5,
        embalagem: "Tabletes de 1 kg, caixas de 15 kg",
    },
    usoPrincipal: "chocolate",
    unidadeBase: "kg",
    imagens: ["/static/img/products/qualitheo-liquor.jpg"],
    ativo: true,
};

const priceNibsB2B: ProductPrice = {
    id: "price_nibs_10_12_br_b2b",
    productId: "prod_nibs_10_12",
    priceListId: "pl_b2b_brasil",
    precoUnitario: "42.50" as any,
    moeda: "BRL",
    moq: "50" as any,
    descontosPorVolume: {
        "50-199": 0.0,
        "200-499": 0.05,
        "500-999": 0.08,
        "1000+": 0.12,
    },
};

const priceLiquorB2B: ProductPrice = {
    id: "price_liquor_qual_br_b2b",
    productId: "prod_liquor_qual",
    priceListId: "pl_b2b_brasil",
    precoUnitario: "78.00" as any,
    moeda: "BRL",
    moq: "30" as any,
    descontosPorVolume: {
        "30-99": 0.0,
        "100-299": 0.04,
        "300+": 0.08,
    },
};

const brandJiboia: Brand = {
    id: "brand_jiboia",
    nome: "Jiboia Cacau",
    slug: "jiboia-cacau",
    tipo: "b2c_cerimonial",
    descricaoCurta: "Cacau cerimonial e medicinas da floresta 100% amazônico.",
    logoUrl: "/static/img/produtos/Logo horizontal 1_1764268926779.png",
    siteUrl: "https://www.jiboia.com.br",
    ativo: true,
};

const priceListCerimonial: PriceList = {
    id: "pl_cerimonial_br",
    nome: "Cerimonial Brasil",
    tipoCliente: "b2c",
    moeda: "BRL",
};

const prodBarra: Product = {
    id: "prod_jiboia_barra_100",
    brandId: "brand_jiboia",
    nome: "Barra 100% Cerimonial Grade",
    slug: "barra-100-cerimonial",
    tipoProduto: "liquor",
    linha: "jiboia_cerimonial",
    descricao: "Massa pura de cacau fino, elaborada para uso cerimonial e ritualístico com profundo respeito à floresta.",
    especificacoesTecnicas: {
        origem_regiao: "Transamazônica, Pará – Brasil",
        ingredientes: "Massa de cacau 100%",
        perfil_sensorial: "Intenso, terroso, flor de laranjeira",
        embalagem: "Barra 500g",
    },
    usoPrincipal: "cerimonial",
    unidadeBase: "un",
    imagens: ["/static/img/produtos/Imagem1_1764268614308.png"],
    ativo: true,
};

const prodKit1kg: Product = {
    id: "prod_jiboia_kit_1kg",
    brandId: "brand_jiboia",
    nome: "Kit Sabedoria da Floresta 1kg",
    slug: "kit-sabedoria-floresta-1kg",
    tipoProduto: "liquor",
    linha: "jiboia_cerimonial",
    descricao: "O conjunto completo para suas cerimônias: 1kg de cacau Jiboia, oráculo exclusivo e óleo essencial da floresta.",
    especificacoesTecnicas: {
        origem_regiao: "Transamazônica, Pará – Brasil",
        inclui: "1kg de cacau em pó/nibs, 1 Oráculo, 1 Óleo Essencial",
        embalagem: "Saco Kraft Ziplock 1kg",
    },
    usoPrincipal: "cerimonial",
    unidadeBase: "kit",
    imagens: ["/static/img/produtos/Gemini_Generated_Image_l31gphl31gphl31g_1764267587665.png"],
    ativo: true,
};

const priceBarra: ProductPrice = {
    id: "price_jiboia_barra_br",
    productId: "prod_jiboia_barra_100",
    priceListId: "pl_cerimonial_br",
    precoUnitario: "120.00" as any,
    moeda: "BRL",
    moq: "1" as any,
    descontosPorVolume: {
        "1-4": 0.0,
        "5+": 0.10,
    },
};

const priceKit1kg: ProductPrice = {
    id: "price_jiboia_kit_br",
    productId: "prod_jiboia_kit_1kg",
    priceListId: "pl_cerimonial_br",
    precoUnitario: "250.00" as any,
    moeda: "BRL",
    moq: "1" as any,
    descontosPorVolume: {
        "1-2": 0.0,
        "3+": 0.05,
    },
};

export async function seedInitialData() {
    try {
        await storage.seedBrand(brandQualitheo);
        await storage.seedBrand(brandJiboia);
        await storage.seedPriceList(priceListB2BBrasil);
        await storage.seedPriceList(priceListCerimonial);

        await storage.seedProduct(prodNibs);
        await storage.seedProduct(prodLiquor);
        await storage.seedProduct(prodBarra);
        await storage.seedProduct(prodKit1kg);

        await storage.seedProductPrice(priceNibsB2B);
        await storage.seedProductPrice(priceLiquorB2B);
        await storage.seedProductPrice(priceBarra);
        await storage.seedProductPrice(priceKit1kg);

        await storage.seedMarketPrices();
        await seedDemoLots();
        console.log("[seeds] ✅ Catalog + market prices + demo lots seeded (idempotent).");
    } catch (err: any) {
        console.error("[seeds] ❌ Seed error:", err.message);
    }
}

// ─── Demo Traceability Lots ────────────────────────────────────────────────────
async function seedDemoLots() {
    const { pool } = await import("./db");

    // Only seed if lots don't already exist
    const existing = await pool.query("SELECT id FROM lots WHERE id IN ('QT-2024-001','QT-2024-002','QT-2024-003') LIMIT 3");
    if (existing.rows.length >= 3) return;

    // Use raw pool so we can force specific IDs for demo lots
    // Lot 1 — Fully purchased (complete chain)
    await pool.query(`
        INSERT INTO lots (id, producer_id, tipo, safra, peso_kg, score_qualidade, status, created_at)
        VALUES ('QT-2024-001', 'demo_producer_1', 'cacau_amêndoa_fermentado', '2024', 850, 87.5, 'comprado', NOW() - INTERVAL '45 days')
        ON CONFLICT (id) DO NOTHING
    `);
    await pool.query(`
        INSERT INTO lots (id, producer_id, tipo, safra, peso_kg, score_qualidade, status, created_at)
        VALUES ('QT-2024-002', 'demo_producer_1', 'cacau_molhado_baba', '2024', 1200, 74.3, 'em_negociacao', NOW() - INTERVAL '10 days')
        ON CONFLICT (id) DO NOTHING
    `);
    await pool.query(`
        INSERT INTO lots (id, producer_id, tipo, safra, peso_kg, score_qualidade, status, created_at)
        VALUES ('QT-2024-003', 'demo_producer_2', 'cacau_amêndoa_seca', '2024', 640, null, 'draft', NOW() - INTERVAL '3 days')
        ON CONFLICT (id) DO NOTHING
    `);

    // Events for Lot 1 (complete chain)
    const events1 = [
        { lot: 'QT-2024-001', tipo: 'registro',           data: 'NOW() - INTERVAL \'45 days\'', det: '{"tipo":"cacau_amêndoa_fermentado","safra":"2024","pesoKg":850}' },
        { lot: 'QT-2024-001', tipo: 'fermentacao',         data: 'NOW() - INTERVAL \'42 days\'', det: '{"dias":7,"temperatura_media_c":38.5,"clone":"CCN-51+Comum"}' },
        { lot: 'QT-2024-001', tipo: 'secagem',             data: 'NOW() - INTERVAL \'35 days\'', det: '{"dias":6,"umidade_final_pct":7.2,"metodo":"estufa solar"}' },
        { lot: 'QT-2024-001', tipo: 'avaliacao',           data: 'NOW() - INTERVAL \'28 days\'', det: '{"scoreQualidade":87.5,"itens":{"selecao_frutos":9,"higiene_colheita":10,"tempo_colheita_quebra":9,"selecao_interna":8,"uniformidade_lote":9,"ausencia_corpos_estranhos":10,"condicoes_transporte":9}}' },
        { lot: 'QT-2024-001', tipo: 'proposta_qualitheo',  data: 'NOW() - INTERVAL \'25 days\'', det: '{"preco_oferecido_r_kg":28.50,"validade_dias":5}' },
        { lot: 'QT-2024-001', tipo: 'compra',              data: 'NOW() - INTERVAL \'23 days\'', det: '{"preco_final_r_kg":28.50,"nota_fiscal":"NF-2024-1042"}' },
        { lot: 'QT-2024-001', tipo: 'envio',               data: 'NOW() - INTERVAL \'18 days\'', det: '{"transportadora":"VL Logística","placa":"PQR-4521","destino":"Belém - PA"}' },
    ];

    for (const ev of events1) {
        await pool.query(
            `INSERT INTO lot_events (lot_id, tipo_evento, data_evento, detalhes) VALUES ($1,$2,${ev.data},$3) ON CONFLICT DO NOTHING`,
            [ev.lot, ev.tipo, ev.det]
        );
    }

    // Events for Lot 2 (in negotiation)
    const events2 = [
        { lot: 'QT-2024-002', tipo: 'registro',           data: 'NOW() - INTERVAL \'10 days\'', det: '{"tipo":"cacau_molhado_baba","safra":"2024","pesoKg":1200}' },
        { lot: 'QT-2024-002', tipo: 'avaliacao',           data: 'NOW() - INTERVAL \'7 days\'',  det: '{"scoreQualidade":74.3,"itens":{"selecao_frutos":7,"higiene_colheita":8,"tempo_colheita_quebra":7,"selecao_interna":7,"uniformidade_lote":8,"ausencia_corpos_estranhos":9,"condicoes_transporte":8}}' },
        { lot: 'QT-2024-002', tipo: 'proposta_qualitheo',  data: 'NOW() - INTERVAL \'4 days\'',  det: '{"preco_oferecido_r_kg":7.80,"validade_dias":5}' },
    ];

    for (const ev of events2) {
        await pool.query(
            `INSERT INTO lot_events (lot_id, tipo_evento, data_evento, detalhes) VALUES ($1,$2,${ev.data},$3) ON CONFLICT DO NOTHING`,
            [ev.lot, ev.tipo, ev.det]
        );
    }

    // Events for Lot 3 (just registered)
    await pool.query(
        `INSERT INTO lot_events (lot_id, tipo_evento, data_evento, detalhes) VALUES ('QT-2024-003','registro',NOW() - INTERVAL '3 days','{"tipo":"cacau_amêndoa_seca","safra":"2024","pesoKg":640}') ON CONFLICT DO NOTHING`
    );

    console.log("[seeds] ✅ Demo traceability lots seeded.");
}

import type { PricingModel } from "@shared/schema";

export interface PrecoInput {
    modalidade: "molhado_baba" | "seco_tipo1";
    scoreQualidade: number; // 0–100
    indiceFidelidade: number; // 0–1
    modelo: PricingModel;
}

export interface PrecoOutput {
    precoMinRKg: number;
    precoMaxRKg: number;
    precoSugeridoRKg: number;
    componentes: Record<string, any>;
}

export function calcularPreco(input: PrecoInput): PrecoOutput {
    const { modalidade, scoreQualidade, indiceFidelidade, modelo } = input;

    const precoRefSeco = Number(modelo.precoRefSecoBrutoRKg);
    const margemPct = Number(modelo.margemQualitheoPct);
    const fatorConversao = Number(modelo.fatorConversaoBabaParaSeco);
    const margemR = precoRefSeco * margemPct;
    const custoTotalSeco = precoRefSeco - margemR;
    const precoMinProdutorSeco = custoTotalSeco * 0.9;

    let precoMinBase: number;
    if (modalidade === "molhado_baba") {
        precoMinBase = precoMinProdutorSeco / fatorConversao;
    } else {
        precoMinBase = precoMinProdutorSeco;
    }

    const q = scoreQualidade;
    const bonusQualMin = Number(modelo.bonusQualidadePctMin);
    const bonusQualMax = Number(modelo.bonusQualidadePctMax);
    let bonusQualidadePct = 0;

    if (q >= 61 && q <= 80) bonusQualidadePct = bonusQualMin;
    if (q > 80) bonusQualidadePct = bonusQualMax;

    const bonusFidMax = Number(modelo.bonusFidelidadePctMax);
    const bonusFidelidadePct = indiceFidelidade * bonusFidMax;
    const bonusTotalPct = bonusQualidadePct + bonusFidelidadePct;

    const precoMinRKg = precoMinBase;
    const precoMaxRKg = precoMinBase * (1 + bonusTotalPct);
    const precoSugeridoRKg = precoMinBase * (1 + bonusTotalPct * 0.7);

    return {
        precoMinRKg,
        precoMaxRKg,
        precoSugeridoRKg,
        componentes: {
            precoRefMercadoUsdTon: Number(modelo.precoRefMercadoUsdTon),
            fxUsdBrl: Number(modelo.fxUsdBrl),
            precoRefSecoBrutoRKg: precoRefSeco,
            fatorConversaoBabaParaSeco: fatorConversao,
            precoMinProdutorSecoRKg: precoMinProdutorSeco,
            bonusQualidadePct,
            bonusFidelidadePct,
        },
    };
}

// Modelo padrão codificado (pode ser sobrescrito via DB futuramente)
export const modeloPadraoMolhado: PricingModel = {
    id: "model_molhado_default",
    modalidade: "molhado_baba",
    precoRefMercadoUsdTon: "5200" as any,
    fxUsdBrl: "5.10" as any,
    precoRefSecoBrutoRKg: "26.52" as any,
    fatorConversaoBabaParaSeco: "2.80" as any,
    custoProcessamentoRKgSeco: "3.50" as any,
    margemQualitheoPct: "0.20" as any,
    bonusQualidadePctMin: "0.05" as any,
    bonusQualidadePctMax: "0.10" as any,
    bonusFidelidadePctMax: "0.05" as any,
    ativo: true,
};

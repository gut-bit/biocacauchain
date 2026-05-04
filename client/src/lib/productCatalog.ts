/**
 * productCatalog.ts — Internal Qualitheo Product Registry
 *
 * This is the SINGLE SOURCE OF TRUTH for all products.
 * To add a product: add a new entry to CATALOG_PRODUCTS.
 * To remove a product: delete its entry.
 * Changes automatically appear on the B2B catalog page.
 */

// Asset paths are resolved at build time by Vite
import nectar from "@assets/product_nectar_branded.png";
import beans from "@assets/product_beans_branded.png";
import nibs from "@assets/product_nibs_branded.png";
import liquor from "@assets/product_liquor_branded.png";
import butter from "@assets/product_butter_branded.png";
import powder from "@assets/product_powder_branded.png";

export interface CatalogProduct {
  id: string;
  slug: string;
  nome: string;               // Portuguese name
  nameEn: string;             // English name
  tipoProduto: string;        // Used for the card badge
  linha: string;              // Product line
  descricao: string;
  usoPrincipal: string;
  image: string;
  unidadeBase: string;        // "kg" | "L" | "unidade"
  moqKg: number;              // Minimum order quantity in kg equivalent
  formats: string[];          // Available packaging formats
  specs: Record<string, string>; // Technical specs shown on card
  /** B2B indicative price — update as needed. null = "Consulte preço" */
  precoIndicativo: number | null;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod_nectar",
    slug: "nectar-cacau-congelado",
    nome: "Néctar de Cacau Congelado",
    nameEn: "Frozen Cacao Nectar",
    tipoProduto: "Néctar",
    linha: "In Natura",
    descricao:
      "Suco da polpa fresca de cacau amazônico, congelado em campo. Rico em polifenóis, vitamina C e antioxidantes. Ideal para bebidas funcionais, sobremesas gourmet e aplicações confeiteiras.",
    usoPrincipal: "Bebidas, sorvetes, bomboneria",
    image: nectar,
    unidadeBase: "L",
    moqKg: 25,
    formats: ["Tetra Pak 1L", "Galão 5L", "Galão 25L", "Tambor 200L"],
    specs: {
      brix: "≥ 14°Bx",
      pH: "3,4 – 3,8",
      conservação: "–18 °C",
    },
    precoIndicativo: 18.9,
  },
  {
    id: "prod_beans",
    slug: "amendoa-cacau-fermentada",
    nome: "Amêndoa de Cacau Fermentada",
    nameEn: "Fermented Cacao Beans",
    tipoProduto: "Amêndoa",
    linha: "Pós-Colheita",
    descricao:
      "Amêndoa de cacau fino de aroma (FCA) da Amazônia paraense, fermentada 6–7 dias em caixas de madeira e secagem solar controlada. Certificação rastreável por lote.",
    usoPrincipal: "Fabricação de chocolate fino, cobertura, recheios",
    image: beans,
    unidadeBase: "kg",
    moqKg: 60,
    formats: ["Sacos Juta 60 kg", "Palete 1 T", "Meio Container 12,5 T", "Container 25 T"],
    specs: {
      fermentação: "6–7 dias",
      umidade: "≤ 7,5%",
      granulação: "≥ 100 amêndoas/100g",
    },
    precoIndicativo: 32.0,
  },
  {
    id: "prod_nibs",
    slug: "nibs-cacau",
    nome: "Nibs de Cacau",
    nameEn: "Cacao Nibs",
    tipoProduto: "Nibs",
    linha: "Semiprocessado",
    descricao:
      "Amêndoas torradas e trituradas, sem casca. Crocantes, com sabor intenso de chocolate escuro. Aplicação direta em granola, chocolates, confeitaria artesanal e panificação premium.",
    usoPrincipal: "Granola, chocolateria, panificação, suplementos",
    image: nibs,
    unidadeBase: "kg",
    moqKg: 25,
    formats: ["Varejo 100 g – 1 kg", "Sacos 5–60 kg", "Big Bag 1 T", "Container 12,5 T / 25 T"],
    specs: {
      gordura: "50–55%",
      granulometria: "3–8 mm",
      umidade: "≤ 3%",
    },
    precoIndicativo: 45.0,
  },
  {
    id: "prod_liquor",
    slug: "liquor-cacau",
    nome: "Liquor de Cacau (Pasta)",
    nameEn: "Cacao Liquor Block",
    tipoProduto: "Liquor",
    linha: "Processado",
    descricao:
      "Pasta 100% cacau obtida pela moagem fina das amêndoas torradas. Base essencial para chocolate, coberturas e recheios. Sabor profundo com notas frutadas características da origem amazônica.",
    usoPrincipal: "Fabricação de chocolate, coberturas, ganaches",
    image: liquor,
    unidadeBase: "kg",
    moqKg: 100,
    formats: ["Blocos 12,5 kg", "Blocos 100 kg", "Blocos 500 kg", "Bloco 1 T", "Container 12,5 T / 25 T"],
    specs: {
      gordura: "52–55%",
      pH: "5,0 – 6,0",
      umidade: "≤ 2%",
    },
    precoIndicativo: 58.0,
  },
  {
    id: "prod_butter",
    slug: "manteiga-cacau",
    nome: "Manteiga de Cacau",
    nameEn: "Cacao Butter Block",
    tipoProduto: "Manteiga",
    linha: "Processado",
    descricao:
      "Gordura natural extraída por prensagem a frio das amêndoas de cacau fino. Aroma delicado de chocolate. Usada em chocolateria de alta gama, cosméticos e farmacêuticos.",
    usoPrincipal: "Chocolate premium, cosméticos, farmácia",
    image: butter,
    unidadeBase: "kg",
    moqKg: 100,
    formats: ["Blocos 12,5 kg", "Blocos 100 kg", "Blocos 500 kg", "Bloco 1 T", "Container 12,5 T / 25 T"],
    specs: {
      gordura: "≥ 99,5%",
      acidez: "≤ 1,75% (ác. oleico)",
      umidade: "≤ 0,2%",
    },
    precoIndicativo: 72.0,
  },
  {
    id: "prod_powder",
    slug: "po-cacau",
    nome: "Pó de Cacau",
    nameEn: "Cacao Powder",
    tipoProduto: "Pó",
    linha: "Processado",
    descricao:
      "Pó resultante da prensagem do liquor com extração de manteiga. Intensidade de sabor e coloração escura. Aplicável em bebidas, confeitaria, sorvetes e produtos alimentícios industriais.",
    usoPrincipal: "Bebidas, sorvetes, panificação, industria alimentícia",
    image: powder,
    unidadeBase: "kg",
    moqKg: 25,
    formats: ["Sacos 25 kg", "Sacos 60 kg", "Big Bag 1 T"],
    specs: {
      gordura: "10–12%",
      pH: "6,8 – 7,2",
      granulometria: "≤ 75 µm (99%)",
    },
    precoIndicativo: 38.0,
  },
];

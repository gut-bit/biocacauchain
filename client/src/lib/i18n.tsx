import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navbar
    'nav.origin': 'Origem',
    'nav.process': 'Processo',
    'nav.products': 'Produtos',
    'nav.impact': 'Impacto',
    'nav.contact': 'Contato',
    'nav.quote': 'Solicitar Orçamento',

    // Hero
    'hero.badge': 'Cocoa of Excellence Award Winner',
    'hero.title.1': 'Gutzeit Farms',
    'hero.title.2': '& Agroindústria Qualitheo',
    'hero.subtitle': 'Da nossa fazenda para o mundo. Unindo a tradição da Gutzeit Farms à tecnologia da Qualitheo para um cacau de excelência.',
    'hero.cta.products': 'Nossos Produtos',
    'hero.cta.factory': 'Conheça a Fazenda',

    // Infrastructure
    'infra.label': 'Infraestrutura Integrada',
    'infra.title': 'Do Campo à Indústria',
    'infra.desc': 'A Gutzeit Farms garante a qualidade na origem, enquanto a Qualitheo processa com tecnologia de ponta, estufas solares e armazéns climatizados.',
    'infra.badge.unit': 'Unidade de Beneficiamento',
    'infra.badge.drying': 'Estufas Solares',
    'infra.badge.storage': 'Armazenamento',

    // Market Thesis
    'market.label': 'Tese de Mercado',
    'market.title': 'Valorização em um Cenário Volátil',
    'market.desc': 'Com a oferta global de cacau apertada e preços historicamente elevados, o mercado exige mais do que volume: exige confiança. A volatilidade reforça o prêmio pago por qualidade consistente e rastreabilidade real.',
    'market.diff.title': 'O Diferencial Qualitheo',
    'market.diff.desc': 'Somos pioneiros na compra do fruto (pods) direto do produtor. Isso nos permite capturar valor integral: fermentação controlada, produção de nibs e extração de polpa, além de operar trading de bulk quando racional.',
    'market.policy.title': 'Política de Fornecedor',
    'market.policy.subtitle': 'Ganha-ganha orientado por eficiência.',
    'market.policy.item1': 'Preço Justo & Crédito Tokenizado',
    'market.policy.item2': 'Assistência, Insumos & Carbono',

    // Process Diagram
    'process.label': 'Fluxo Pós-Colheita',
    'process.title': 'Linha Industrial de Precisão',
    'process.desc': 'Da recepção biométrica à agregação de valor industrial. Um processo desenhado para consistência e escala.',
    'process.map.title': 'O Mapa da Qualidade',
    'process.map.desc': 'Este diagrama ilustra o fluxo completo de nossa unidade em Medicilândia. Cada etapa foi projetada para maximizar a qualidade sensorial e garantir segurança alimentar em escala.',
    'process.check1': 'Fluxo contínuo sem gargalos',
    'process.check2': 'Segregação total de lotes',
    'process.zoom': 'Ampliar Diagrama',
    'process.step1': 'Recepção & Buffer',
    'process.desc1': 'Recepção de frutos selecionados e armazenamento em buffer climatizado ("Armazém Inteligente"). Organiza o fluxo de entrada e amplia a janela de processamento em até 1 semana, garantindo que a fábrica opere sempre na capacidade ideal de ~2.500 kg/dia.',
    'process.step2': 'A Grande Segregação',
    'process.desc2': 'O coração do processo. Triagem manual rigorosa que divide o fluxo em três caminhos: Premium (Ouro), Bulk (Verde) e Descarte. Garante que apenas amêndoas perfeitas sigam para a fermentação fina.',
    'process.step3': 'Fermentação Tech',
    'process.desc3': 'Extração controlada do Néctar (Theo Gold) seguida de fermentação em cochos de madeira com monitoramento digital (pH, Brix, Temperatura). Uso de viragem hidráulica para oxigenação perfeita e repetibilidade do perfil aromático.',
    'process.step4': 'Secagem Híbrida',
    'process.desc4': 'Sistema de duas fases: 1. Fase Lenta: Estufas solares (4-6 dias) para saída gradual de ácidos voláteis. 2. Finalização Mecânica: Secadores a lenha sem fumaça para atingir a umidade exata de exportação (7%) independente do clima.',
    'process.step5': 'Qualidade & Rastreio',
    'process.desc5': 'Limpeza final por densimetria e classificação granulométrica. Análise laboratorial interna (Cut Test) para validação do lote. Emissão do QR Code de rastreabilidade total que acompanha a saca até o cliente.',
    'process.step6': 'Agregação Industrial',
    'process.desc6': 'Processamento secundário para produtos derivados. Linha de torra controlada e trituração para produção de Nibs, Líquor e Manteiga. Capacidade de escala para atender grandes contratos globais.',

    // Features
    'features.origin.title': 'Gutzeit Farms',
    'features.origin.desc': 'Nossa origem. Produzido em sistemas agroflorestais no Pará, preservando a floresta e garantindo a biodiversidade.',
    'features.industry.title': 'Indústria 4.0',
    'features.industry.desc': 'Processamento controlado com protocolos de fermentação e secagem de precisão para qualidade superior.',
    'features.global.title': 'Conexão Global',
    'features.global.desc': 'Logística integrada que conecta o produtor amazônico aos mercados mais exigentes do mundo.',

    // About Split / Traceability
    'trace.badge': 'Traceability Tech',
    'trace.title': 'Rastreabilidade Total',
    'trace.subtitle': 'Cada lote conta uma história. Do clone 24 ao produto final.',
    'trace.standard': 'O Padrão Qualitheo',
    'trace.harmony.1': 'Ciência e Natureza em',
    'trace.harmony.2': 'Sintonia',
    'trace.harmony.desc': 'Não vendemos apenas cacau; vendemos consistência. Nossa estrutura de originação e compra aplica protocolos rigorosos de pós-colheita, monitorados digitalmente.',
    'trace.list1': 'Rastreabilidade total via QR Code por lote',
    'trace.list2': 'Monitoramento biométrico da fermentação',
    'trace.list3': 'Secagem híbrida em estufas solares tech',
    'trace.list4': 'Análise sensorial em laboratório próprio',

    // Products
    'products.label': 'Portfólio de Produtos',
    'products.title': 'Soluções em Cacau',
    'products.nectar.title': 'Néctar (Mel de Cacau)',
    'products.nectar.desc': 'O "ouro líquido" extraído da polpa fresca. Acidez vibrante, notas florais e doçura natural. Ingrediente premium para bebidas e confeitaria.',
    'products.beans.title': 'Amêndoas Fermentadas',
    'products.beans.desc': 'O padrão ouro. Amêndoas classificadas (Type 1), fermentação completa e perfil aromático consistente. Disponível em sacas de 60kg.',
    'products.nibs.title': 'Nibs Torrados',
    'products.nibs.desc': 'Amêndoas descascadas e trituradas após torra precisa. Crocância perfeita e sabor intenso de chocolate puro. Ideal para inclusões.',
    'products.liquor.title': 'Líquor (Massa)',
    'products.liquor.desc': 'Cacau moído integralmente. A base pura para chocolates finos, com textura sedosa e notas complexas preservadas.',
    'products.butter.title': 'Manteiga de Cacau',
    'products.butter.desc': 'Extraída por prensagem mecânica a partir do líquor. Pura, desodorizada ou natural, essencial para a fluidez do chocolate.',
    'products.powder.title': 'Cacau em Pó',
    'products.powder.desc': 'O sólido resultante da prensagem. Rico em sabor e cor, ideal para panificação, bebidas e sorvetes.',

    // Impact
    'impact.quote': '"Garantimos a compra, garantimos o futuro."',
    'impact.badge': 'Bioeconomia Amazônica',
    'impact.title.1': 'Impacto Real',
    'impact.title.2': 'além da floresta',
    'impact.desc': 'A Qualitheo não é apenas uma agroindústria; somos um ecossistema vivo. Ao profissionalizar o produtor com assistência técnica e garantir a compra de toda a safra, criamos um ciclo virtuoso onde a floresta em pé vale mais do que derrubada.',
    'impact.stat1': 'Renda do Produtor',
    'impact.stat2': 'Rastreabilidade',

    // Quote Form
    'form.title': 'Solicite Cotação',
    'form.subtitle': 'Preencha os dados abaixo para iniciar seu atendimento comercial.',
    'form.name': 'Nome Completo',
    'form.company': 'Empresa',
    'form.product': 'Interesse Principal',
    'form.message': 'Mensagem (Opcional)',
    'form.submit': 'Enviar via WhatsApp',
    'form.disclaimer': 'Você será redirecionado para o WhatsApp da Qualitheo.',
    'form.prod.nectar': 'Néctar de Cacau',
    'form.prod.beans': 'Amêndoas Fermentadas',
    'form.prod.nibs': 'Nibs de Cacau',
    'form.prod.liquor': 'Líquor (Massa)',
    'form.prod.butter': 'Manteiga de Cacau',
    'form.prod.powder': 'Cacau em Pó',
    'form.prod.other': 'Outro / Múltiplos',

    // Partners
    'partners.title': 'Parceiros e Clientes que Confiam na Qualitheo',

    // Footer
    'footer.desc': 'Agroindústria bioeconômica que conecta a riqueza da Amazônia ao mundo com qualidade, tecnologia e transparência.',
    'footer.nav': 'Navegação',
    'footer.contact': 'Contato Direto',
    'footer.scan': 'Escaneie para contato via WhatsApp',
    'footer.rights': '© 2025 Qualitheo Agroindústria. Todos os direitos reservados.',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos',
    'footer.location': 'Amazônia, Brasil',

    // Nav links again for footer if needed specific
    'nav.blog': 'Blog',
    'nav.sustainability': 'Sustentabilidade',
  },
  en: {
    // Navbar
    'nav.origin': 'Origin',
    'nav.process': 'Process',
    'nav.products': 'Products',
    'nav.impact': 'Impact',
    'nav.contact': 'Contact',
    'nav.quote': 'Request Quote',

    // Hero
    'hero.badge': 'Cocoa of Excellence Award Winner',
    'hero.title.1': 'Gutzeit Farms',
    'hero.title.2': '& Agroindústria Qualitheo',
    'hero.subtitle': 'Da nossa fazenda para o mundo. Unindo a tradição da Gutzeit Farms à tecnologia da Qualitheo para um cacau de excelência.',
    'hero.cta.products': 'Nossos Produtos',
    'hero.cta.factory': 'Conheça a Fazenda',

    // Infrastructure
    'infra.label': 'Infraestrutura Integrada',
    'infra.title': 'Do Campo à Indústria',
    'infra.desc': 'A Gutzeit Farms garante a qualidade na origem, enquanto a Qualitheo processa com tecnologia de ponta, estufas solares e armazéns climatizados.',
    'infra.badge.unit': 'Processing Unit',
    'infra.badge.drying': 'Solar Greenhouses',
    'infra.badge.storage': 'Storage',

    // Market Thesis
    'market.label': 'Market Thesis',
    'market.title': 'Value in a Volatile Scenario',
    'market.desc': 'With tight global cocoa supply and historically high prices, the market demands more than volume: it demands trust. Volatility reinforces the premium paid for consistent quality and real traceability.',
    'market.diff.title': 'The Qualitheo Differential',
    'market.diff.desc': 'We are pioneers in purchasing pods directly from the producer. This allows us to capture full value: controlled fermentation, nib production, and pulp extraction, plus bulk trading when rational.',
    'market.policy.title': 'Supplier Policy',
    'market.policy.subtitle': 'Efficiency-driven win-win.',
    'market.policy.item1': 'Fair Price & Tokenized Credit',
    'market.policy.item2': 'Assistance, Inputs & Carbon',

    // Process Diagram
    'process.label': 'Post-Harvest Flow',
    'process.title': 'Precision Industrial Line',
    'process.desc': 'From biometric reception to industrial value aggregation. A process designed for consistency and scale.',
    'process.map.title': 'The Quality Map',
    'process.map.desc': 'This diagram illustrates the complete flow of our unit in Medicilândia. Each step is designed to maximize sensory quality and ensure food safety at scale.',
    'process.check1': 'Continuous flow without bottlenecks',
    'process.check2': 'Total lot segregation',
    'process.zoom': 'Zoom Diagram',
    'process.step1': 'Reception & Buffer',
    'process.desc1': 'Reception of selected fruits and storage in climate-controlled buffer ("Smart Warehouse"). Organizes inflow and extends processing window up to 1 week, ensuring the factory operates at ideal capacity (~2,500 kg/day).',
    'process.step2': 'The Great Segregation',
    'process.desc2': 'The heart of the process. Rigorous manual sorting splitting the flow into three paths: Premium (Gold), Bulk (Green), and Discard. Ensures only perfect beans go to fine fermentation.',
    'process.step3': 'Tech Fermentation',
    'process.desc3': 'Controlled extraction of Nectar (Theo Gold) followed by fermentation in wooden boxes with digital monitoring (pH, Brix, Temperature). Hydraulic turning for perfect oxygenation and aromatic profile repeatability.',
    'process.step4': 'Hybrid Drying',
    'process.desc4': 'Two-phase system: 1. Slow Phase: Solar greenhouses (4-6 days) for gradual volatile acid release. 2. Mechanical Finish: Smokeless wood dryers to reach exact export humidity (7%) regardless of weather.',
    'process.step5': 'Quality & Traceability',
    'process.desc5': 'Final cleaning by densimetry and size grading. Internal lab analysis (Cut Test) for lot validation. Issuance of full traceability QR Code that travels with the bag to the client.',
    'process.step6': 'Industrial Aggregation',
    'process.desc6': 'Secondary processing for derived products. Controlled roasting line and winnowing for Nibs, Liquor, and Butter production. Scalable capacity to serve large global contracts.',

    // Features
    'features.origin.title': 'Gutzeit Farms',
    'features.origin.desc': 'Our origin. Produced in agroforestry systems in Pará, preserving the forest and ensuring biodiversity.',
    'features.industry.title': 'Industry 4.0',
    'features.industry.desc': 'Controlled processing with precision fermentation and drying protocols for superior quality.',
    'features.global.title': 'Global Connection',
    'features.global.desc': 'Integrated logistics connecting the Amazonian producer to the most demanding markets in the world.',

    // About Split / Traceability
    'trace.badge': 'Traceability Tech',
    'trace.title': 'Total Traceability',
    'trace.subtitle': 'Every lot tells a story. From clone 24 to the final product.',
    'trace.standard': 'The Qualitheo Standard',
    'trace.harmony.1': 'Science and Nature in',
    'trace.harmony.2': 'Harmony',
    'trace.harmony.desc': 'We don’t just sell cocoa; we sell consistency. Our origination and purchasing structure applies rigorous post-harvest protocols, digitally monitored.',
    'trace.list1': 'Total traceability via QR Code per lot',
    'trace.list2': 'Biometric fermentation monitoring',
    'trace.list3': 'Hybrid drying in tech solar greenhouses',
    'trace.list4': 'Sensory analysis in proprietary lab',

    // Products
    'products.label': 'Product Portfolio',
    'products.title': 'Cocoa Solutions',
    'products.nectar.title': 'Nectar (Cocoa Honey)',
    'products.nectar.desc': 'The "liquid gold" extracted from fresh pulp. Vibrant acidity, floral notes, and natural sweetness. Premium ingredient for beverages and confectionery.',
    'products.beans.title': 'Fermented Beans',
    'products.beans.desc': 'The gold standard. Classified beans (Type 1), complete fermentation, and consistent aromatic profile. Available in 60kg bags.',
    'products.nibs.title': 'Roasted Nibs',
    'products.nibs.desc': 'Shelled and crushed beans after precise roasting. Perfect crunch and intense pure chocolate flavor. Ideal for inclusions.',
    'products.liquor.title': 'Liquor (Mass)',
    'products.liquor.desc': 'Whole ground cocoa. The pure base for fine chocolates, with silky texture and complex notes preserved.',
    'products.butter.title': 'Cocoa Butter',
    'products.butter.desc': 'Extracted by mechanical pressing from liquor. Pure, deodorized or natural, essential for chocolate fluidity.',
    'products.powder.title': 'Cocoa Powder',
    'products.powder.desc': 'The solid resulting from pressing. Rich in flavor and color, ideal for baking, beverages, and ice cream.',

    // Impact
    'impact.quote': '"We guarantee the purchase, we guarantee the future."',
    'impact.badge': 'Amazonian Bioeconomy',
    'impact.title.1': 'Real Impact',
    'impact.title.2': 'beyond the forest',
    'impact.desc': 'Qualitheo is not just an agroindustry; we are a living ecosystem. By professionalizing the producer with technical assistance and guaranteeing the purchase of the entire harvest, we create a virtuous cycle where the standing forest is worth more than felled.',
    'impact.stat1': 'Producer Income',
    'impact.stat2': 'Traceability',

    // Quote Form
    'form.title': 'Request Quote',
    'form.subtitle': 'Fill in the data below to start your commercial service.',
    'form.name': 'Full Name',
    'form.company': 'Company',
    'form.product': 'Main Interest',
    'form.message': 'Message (Optional)',
    'form.submit': 'Send via WhatsApp',
    'form.disclaimer': 'You will be redirected to Qualitheo\'s WhatsApp.',
    'form.prod.nectar': 'Cocoa Nectar',
    'form.prod.beans': 'Fermented Beans',
    'form.prod.nibs': 'Cocoa Nibs',
    'form.prod.liquor': 'Liquor (Mass)',
    'form.prod.butter': 'Cocoa Butter',
    'form.prod.powder': 'Cocoa Powder',
    'form.prod.other': 'Other / Multiple',

    // Partners
    'partners.title': 'Partners and Clients Trusting Qualitheo',

    // Footer
    'footer.desc': 'Bioeconomic agroindustry connecting Amazonian wealth to the world with quality, technology, and transparency.',
    'footer.nav': 'Navigation',
    'footer.contact': 'Direct Contact',
    'footer.scan': 'Scan to contact via WhatsApp',
    'footer.rights': '© 2025 Qualitheo Agroindustry. All rights reserved.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.location': 'Amazon, Brazil',

    'nav.blog': 'Blog',
    'nav.sustainability': 'Sustainability',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

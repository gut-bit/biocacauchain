import ASSETS from "./assets";

const MarketplaceSection = () => (
  <section className="py-24 bg-cocoa-950 relative z-20" id="marketplace">
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <span className="inline-block text-gold-400 font-bold uppercase tracking-widest text-xs mb-3">Plataforma Gut Cacau</span>
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Acesse o <span className="text-gold-400 italic">Marketplace</span></h2>
        <p className="text-cocoa-400 text-lg max-w-xl mx-auto">
          Originação, ingredientes B2B e cacau cerimonial — tudo em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            href: "/catalogo-b2b",
            emoji: "🏭",
            title: "Ingredientes B2B",
            subtitle: "Qualitheo",
            desc: "Nibs, liquor, manteiga e pasta para indústria. Preços por volume, MOQ e condições B2B.",
            cta: "Ver catálogo",
            color: "from-amber-900/40 to-cocoa-900",
            accent: "bg-gold-500 text-cocoa-950",
          },
          {
            href: "/loja",
            emoji: "🍃",
            title: "Loja Cerimonial",
            subtitle: "Para o consumidor",
            desc: "Cacau fino para preparo de bebida ritual, chá e culinária. Compra via WhatsApp.",
            cta: "Comprar agora",
            color: "from-green-900/40 to-cocoa-900",
            accent: "bg-green-600 text-white",
          },
          {
            href: "/portal-produtor",
            emoji: "🌾",
            title: "Portal do Produtor",
            subtitle: "Originação",
            desc: "Cadastre-se, registre lotes de cacau molhado e receba propostas de compra da Qualitheo.",
            cta: "Acessar portal",
            color: "from-blue-900/40 to-cocoa-900",
            accent: "bg-blue-600 text-white",
          },
          {
            href: "/portal-qualitheo",
            emoji: "⚙️",
            title: "Gestão Qualitheo",
            subtitle: "Uso interno",
            desc: "Avalie lotes, calcule preços com o motor Qualitheo e envie propostas aos produtores.",
            cta: "Área interna",
            color: "from-purple-900/40 to-cocoa-900",
            accent: "bg-purple-600 text-white",
          },
        ].map((card) => (
          <a key={card.href} href={card.href}
            className={`group relative bg-gradient-to-b ${card.color} border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer`}>
            <div className="text-4xl">{card.emoji}</div>
            <div>
              <p className="text-xs text-cocoa-500 uppercase tracking-widest mb-1">{card.subtitle}</p>
              <h3 className="font-display text-xl text-white mb-2">{card.title}</h3>
              <p className="text-cocoa-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
            <div className="mt-auto">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${card.accent} transition-all group-hover:gap-2.5`}>
                {card.cta} →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default MarketplaceSection;

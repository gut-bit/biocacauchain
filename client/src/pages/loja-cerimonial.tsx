import { Link } from "wouter";
import { ArrowLeft, Leaf, ExternalLink, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LojaCerimonial() {
    return (
        <div className="min-h-screen bg-cocoa-950 text-white flex flex-col">
            <header className="sticky top-0 z-50 bg-cocoa-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/">
                        <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /><span className="text-sm">Início</span>
                        </button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-400" />
                        <span className="font-display font-semibold">Loja <span className="text-green-400">Cerimonial</span></span>
                    </div>
                    <div />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto py-12">
                    <Badge className="mb-6 bg-gold-500/10 text-gold-400 border border-gold-500/20 uppercase tracking-widest px-4 py-1.5">
                        Em Breve
                    </Badge>
                    
                    <h1 className="font-display text-5xl md:text-6xl font-medium mb-6 leading-tight">
                        Nossa nova loja está <br className="hidden md:block" />
                        <span className="text-green-400 italic">em construção</span>
                    </h1>
                    
                    <p className="text-cocoa-300 text-lg md:text-xl mb-12">
                        Estamos preparando uma experiência incrível para você adquirir nosso cacau cerimonial amazônico direto da fazenda Gutzeit.
                    </p>

                    <div className="bg-cocoa-900/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <h2 className="font-display text-xl md:text-2xl mb-6 flex items-center justify-center gap-2">
                            <Store className="w-6 h-6 text-gold-400" />
                            Onde Comprar Agora
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <MarketplaceLink 
                                name="Mercado Livre" 
                                url="https://mercadolivre.com.br" 
                                color="hover:border-yellow-400 hover:text-yellow-400"
                            />
                            <MarketplaceLink 
                                name="Shopee" 
                                url="https://shopee.com.br" 
                                color="hover:border-orange-500 hover:text-orange-500"
                            />
                            <MarketplaceLink 
                                name="TikTok Store" 
                                url="https://tiktok.com" 
                                color="hover:border-blue-400 hover:text-blue-400"
                            />
                        </div>
                        <p className="text-sm text-cocoa-500 mt-6">
                            * Em breve, habilitaremos os links para as nossas lojas oficiais nestas plataformas parceiras.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MarketplaceLink({ name, url, color }: { name: string, url: string, color: string }) {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-cocoa-800/50 transition-all group ${color}`}
        >
            <span className="font-medium mb-1">{name}</span>
            <ExternalLink className="w-4 h-4 text-cocoa-400 group-hover:text-current transition-colors" />
        </a>
    );
}

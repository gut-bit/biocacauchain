import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ShieldCheck, Leaf, Target, Handshake, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PROGRAMS = [
  {
    id: "puratos-cacao-trace",
    name: "Cacao-Trace",
    sponsor: "Puratos",
    shortDesc: "Sustentabilidade de ponta a ponta focada em sabor excepcional e maior renda para o produtor.",
    color: "bg-orange-800",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/30",
    icon: <Leaf className="w-8 h-8 text-orange-400" />,
    pillars: [
      { name: "Agroforestry & No Deforestation", desc: "Práticas de agricultura sustentável preservando florestas nativas." },
      { name: "Fermentation Mastery", desc: "Acompanhamento em centros de pós-colheita para sabor perfeito." },
      { name: "Chocolate Bonus", desc: "Prêmio em dinheiro direto ao produtor por KG de chocolate vendido." },
      { name: "Child Protection", desc: "Auditorias para garantir a ausência de trabalho infantil." }
    ]
  },
  {
    id: "gutcacau-premium",
    name: "Selos Verdes Qualitheo",
    sponsor: "Gutcacau / Qualitheo",
    shortDesc: "O nosso selo interno confirmando sua conformidade com o código de conduta ESG e regularização do CAR.",
    color: "bg-green-800",
    textColor: "text-green-500",
    borderColor: "border-green-500/30",
    icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
    pillars: [
      { name: "CAR Regularizado", desc: "Comprovação legal da propriedade rural." },
      { name: "Emissão de NF", desc: "Aptidão para nota fiscal eletrônica." },
      { name: "Livre de Desmatamento", desc: "Garantia ambiental comprovada por satélite." }
    ]
  }
];

export default function CertificacaoHub() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const selected = PROGRAMS.find(p => p.id === selectedProgram);

  return (
    <div className="min-h-screen bg-cocoa-950 text-white font-sans">
      {/* Navbar Minimalista */}
      <header className="sticky top-0 z-50 bg-cocoa-900/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/originacao">
            <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Hub de Originação</span>
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gold-400" />
            <span className="font-display font-semibold text-lg">Hub de Certificação</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Painel de Programas & Certificações
          </h1>
          <p className="text-cocoa-300 text-lg">
            Nossa plataforma suporta múltiplos programas de certificação e rastreabilidade para clientes. 
            Escolha um programa parceiro para auditar e integrar suas práticas agrícolas. Posições aprovadas são exibidas no seu perfil público e valorizam o preço de saca!
          </p>
        </section>

        {!selectedProgram ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((prog) => (
              <Card 
                key={prog.id}
                className={`bg-cocoa-900 cursor-pointer hover:scale-[1.02] transition-transform duration-300 border ${prog.borderColor}`}
                onClick={() => setSelectedProgram(prog.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${prog.color}/20`}>
                      {prog.icon}
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {prog.sponsor}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-display text-white">{prog.name}</CardTitle>
                  <CardDescription className="text-cocoa-300 mt-2">
                    {prog.shortDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Detalhes do Programa <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {/* Card para Clientes - White Label */}
            <Card className="bg-cocoa-900 border-dashed border-white/20 flex flex-col justify-center items-center text-center p-8 opacity-80 hover:opacity-100 transition-opacity">
              <Handshake className="w-12 h-12 text-cocoa-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Traga o Seu Programa</h3>
              <p className="text-sm text-cocoa-400 mb-6">
                És um cliente com métricas próprias ESG? A plataforma Qualitheo aceita regras customizadas de aderência para sua rede de produtores.
              </p>
              <Button disabled variant="outline" className="border-white/10 text-cocoa-500">
                Contacte-nos
              </Button>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Visão de Detalhes do Programa */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Voltar para a lista de programas"
                title="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-cocoa-300" />
              </button>
              <div>
                <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30 mb-2">
                  Apoiado por {selected?.sponsor}
                </Badge>
                <h2 className="text-3xl font-display font-bold text-white">{selected?.name}</h2>
              </div>
            </div>

            <Card className="bg-cocoa-900 border-white/10 mb-8 overflow-hidden">
              <div className={`p-6 md:p-10 ${selected?.color}/10 relative`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  {selected?.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">Pilares e Requisitos do Programa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {selected?.pillars.map((pillar, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-black/40 p-4 rounded-xl border border-white/5">
                      <CheckCircle2 className={`w-6 h-6 shrink-0 ${selected?.textColor}`} />
                      <div>
                        <h4 className="font-bold text-white text-base">{pillar.name}</h4>
                        <p className="text-sm text-cocoa-300 leading-relaxed mt-1">{pillar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold px-8">
                Iniciar Auditoria / Submissão
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { Link } from "wouter";
import {
  ArrowRight, Leaf, ClipboardCheck, Package, SearchCheck,
  Shield, Building2, User, Lock
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import AppShell from "@/components/layout/AppShell";

export default function Originacao() {
  return (
    <AppShell light>
      <Helmet>
        <title>Originação | Compra de Cacau com Rastreabilidade | Qualitheo</title>
        <meta name="description" content="Plataforma de originação Qualitheo. Conectamos produtores de cacau da Amazônia com rastreabilidade total e preço justo." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-950 text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Leaf className="w-4 h-4 text-green-300" />
            Plataforma de Originação Qualitheo
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            Compra de cacau direto<br />
            <span className="text-green-300">do produtor com rastreabilidade</span>
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-10">
            Conectamos produtores de cacau da Amazônia com a Qualitheo — com preço justo,
            transparência total e conformidade socioambiental.
          </p>

          {/* 4 paths */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: User,
                title: "Sou Produtor",
                desc: "Cadastre-se, registre seu lote e receba propostas de compra",
                href: "/portal-produtor",
                color: "bg-amber-500 hover:bg-amber-400",
              },
              {
                icon: Shield,
                title: "Hub de Certificação",
                desc: "Selo Verde, Puratos Cocoa-Trace e programas parceiros.",
                href: "/certificacao",
                color: "bg-emerald-600 hover:bg-emerald-500",
              },
              {
                icon: Building2,
                title: "Gestão Qualitheo",
                desc: "Avalie lotes, calcule preços e envie propostas para produtores",
                href: "/portal-qualitheo",
                color: "bg-green-600 hover:bg-green-500",
              },
              {
                icon: Lock,
                title: "Acesso Restrito",
                desc: "Área exclusiva para Qualitheo Staff e Agentes IA Logísticos",
                href: "/admin-login",
                color: "bg-gray-800 hover:bg-gray-700",
              },
            ].map(({ icon: Icon, title, desc, href, color }) => (
              <Link key={href} href={href}>
                <div className={`${color} rounded-2xl p-5 text-left cursor-pointer transition-all group`}>
                  <Icon className="w-7 h-7 mb-3 text-white" />
                  <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{desc}</p>
                  <span className="flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                    Acessar <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Traceability link */}
          <div className="mt-8 flex justify-center">
            <Link href="/rastrear">
              <button className="flex items-center gap-2 text-green-200 hover:text-white transition-colors text-sm font-medium">
                <SearchCheck className="w-4 h-4" /> Rastrear lote por código público
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Como funciona</h2>
          <p className="text-gray-500 text-center mb-10">Do produtor ao contrato em 4 etapas</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "1", icon: User, title: "Cadastro", desc: "Produtor se cadastra com dados da propriedade e documentação" },
              { step: "2", icon: Package, title: "Registro do lote", desc: "Informa tipo, peso, safra e origem do cacau" },
              { step: "3", icon: ClipboardCheck, title: "Avaliação", desc: "Qualitheo valida qualidade e calcula preço justo" },
              { step: "4", icon: Shield, title: "Proposta & Compra", desc: "Proposta formal assinada, rastreabilidade registrada" },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">{step}</div>
                <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance badges */}
      <section className="py-12 px-6 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Conformidade exigida na plataforma</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🌿 CAR Regularizado",
              "🚫 Sem trabalho infantil",
              "🌳 Livre de desmatamento",
              "📋 Nota Fiscal Eletrônica",
              "🤝 Preço justo ao produtor",
              "📍 Rastreabilidade de lote",
            ].map(b => (
              <span key={b} className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-green-800 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
        <p className="text-green-200 mb-6">Cadastro gratuito • Sem compromisso • Proposta em 48h</p>
        <Link href="/portal-produtor">
          <button className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
            Cadastrar como Produtor →
          </button>
        </Link>
      </section>
    </AppShell>
  );
}

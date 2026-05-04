import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, MapPin, Leaf, ShieldCheck, Mail, Phone, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ProducerProfile {
  producer: {
    nome: string;
    nomeFantasia: string | null;
    tipo: string;
    municipio: string;
    estado: string;
    contatoEmail: string | null;
    contatoTelefone: string | null;
    ativo: boolean;
  };
  property: {
    areaTotal: string | null;
    areaCacau: string | null;
    bioma: string | null;
    sistemaProducao: string | null;
  } | null;
  compliance: {
    carRegularizado: boolean;
    semDesmatamento: boolean;
    certificacoes: Array<{ program: string, status: string, data?: unknown }> | null;
  } | null;
}

export default function PerfilProdutor() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ProducerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/producers/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cocoa-950 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full bg-white/5 rounded-2xl" />
          <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-cocoa-950 flex flex-col items-center justify-center text-white">
        <Leaf className="w-16 h-16 text-cocoa-800 mb-4" />
        <h2 className="text-2xl font-bold font-display">Perfil não encontrado</h2>
        <p className="text-cocoa-400 mt-2 text-center max-w-md">O produtor que você procura não existe ou o perfil é privado.</p>
        <Link href="/originacao">
          <button className="mt-6 px-6 py-2 bg-gold-500 text-cocoa-950 font-bold rounded-xl">Voltar ao Hub</button>
        </Link>
      </div>
    );
  }

  const p = data.producer;
  const prop = data.property;
  const comp = data.compliance;
  const displayName = p.nomeFantasia || p.nome;

  return (
    <div className="min-h-screen bg-cocoa-950 text-white font-sans pb-20">
      {/* Header Minimalista */}
      <header className="sticky top-0 z-50 bg-cocoa-900/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="container mx-auto flex items-center">
          <Link href="/originacao">
            <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-green-900 to-cocoa-900 border-b border-white/5 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      <main className="container mx-auto px-6 -mt-16 md:-mt-20 relative z-10 max-w-5xl">
        {/* Profile Info Header */}
        <div className="bg-cocoa-900 rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-xl mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-cocoa-800 rounded-full border-4 border-cocoa-950 flex flex-shrink-0 items-center justify-center text-4xl font-display text-gold-400 shadow-inner">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{displayName}</h1>
              {comp?.carRegularizado && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1 absolute top-6 right-6 md:relative md:top-auto md:right-auto">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </Badge>
              )}
            </div>
            <p className="text-cocoa-300 flex items-center gap-2 text-sm md:text-base">
              <MapPin className="w-4 h-4" /> {p.municipio}, {p.estado}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {p.contatoEmail && (
              <button className="flex justify-center items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors border border-white/10">
                <Mail className="w-4 h-4" /> Contatar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Certificações & Programas (Cacao-Trace) */}
            <section>
              <h3 className="text-xl font-display font-bold border-b border-white/10 pb-2 mb-4">Programas e Certificações Sustentáveis</h3>
              {(!comp?.certificacoes || comp.certificacoes.length === 0) ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <Award className="w-8 h-8 text-cocoa-600 mx-auto mb-2" />
                  <p className="text-cocoa-400 text-sm">Nenhum programa de rastreabilidade ou certificação associado no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comp.certificacoes.map((cert, i) => (
                    <Card key={i} className="bg-cocoa-900 border-white/10 overflow-hidden relative">
                      {cert.status === "approved" && (
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                          <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <Badge className={`${
                          cert.status === "approved" ? "bg-green-500/20 text-green-400" :
                          cert.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-white/10 text-cocoa-300"
                        } w-fit mb-2 border-none`}>
                          {cert.status.toUpperCase()}
                        </Badge>
                        <CardTitle className="text-lg font-bold text-white relative z-10">{cert.program}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-cocoa-300 relative z-10">
                          Adicionado aos registos públicos do produtor validando o compromisso socioambiental.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Raio X da Fazenda */}
            <section>
              <h3 className="text-xl font-display font-bold border-b border-white/10 pb-2 mb-4">Raio-X da Propriedade</h3>
              <div className="bg-cocoa-900 border border-white/10 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-cocoa-500 uppercase font-bold tracking-wider mb-1">Área Total</p>
                  <p className="text-lg text-white">{prop?.areaTotal ? `${prop.areaTotal} ha` : "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-cocoa-500 uppercase font-bold tracking-wider mb-1">Área Cacau</p>
                  <p className="text-lg text-white">{prop?.areaCacau ? `${prop.areaCacau} ha` : "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-cocoa-500 uppercase font-bold tracking-wider mb-1">Bioma</p>
                  <p className="text-lg text-white capitalize">{prop?.bioma || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-cocoa-500 uppercase font-bold tracking-wider mb-1">Sistema</p>
                  <p className="text-lg text-white capitalize">{prop?.sistemaProducao?.replace("_", " ") || "--"}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="bg-cocoa-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Compliance Gutcacau</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cocoa-300">CAR Regularizado</span>
                  {comp?.carRegularizado ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <span className="text-cocoa-500">—</span>}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cocoa-300">Livre de Desmatamento</span>
                  {comp?.semDesmatamento ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <span className="text-cocoa-500">—</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/providers/ContentProvider";
import ASSETS from "./assets";

const AboutSplit = () => {
  const { cb } = useContent();

  // about.bullets is stored as a JSON array string
  let bullets: string[] = [];
  try {
    const raw = cb("about.bullets", "[]");
    bullets = JSON.parse(raw);
  } catch {
    bullets = [
      "Rastreabilidade total via QR Code por lote",
      "Monitoramento biométrico da fermentação",
      "Secagem híbrida em estufas solares tech",
      "Análise sensorial em laboratório próprio",
    ];
  }

  return (
    <section className="py-0 bg-cocoa-900 border-t border-cocoa-800 overflow-hidden relative" id="processo">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none z-0">
        <img src={ASSETS.tech_wireframe} alt="Tech Wireframe Background" className="w-[800px] h-[800px] absolute -right-40 -top-40 rotate-12" />
      </div>

      <div className="flex flex-col lg:flex-row h-auto min-h-[800px] relative z-10">
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto group">
          <img
            src={ASSETS.pod_qr}
            alt="Rastreabilidade QR Code"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

          {/* Tech Overlay Badge */}
          <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-white/10 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-white p-1">
                <img src={ASSETS.qr_code} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{cb("about.traceability.badge", "Traceability Tech")}</span>
                </div>
                <h4 className="font-display text-xl mb-1">{cb("about.traceability.title", "Rastreabilidade Total")}</h4>
                <p className="text-sm text-white/80">{cb("about.traceability.desc", "Cada lote conta uma história. Do clone 24 ao produto final.")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-cocoa-900 text-cocoa-50 p-12 md:p-24 flex flex-col justify-center relative">
          {/* Subtle bean background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 opacity-10 pointer-events-none">
            <img src={ASSETS.floating_beans} alt="" />
          </div>

          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-6">
            {cb("about.label", "O Padrão Qualitheo")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            {(() => {
              const title = cb("about.title", "Ciência e Natureza em Sintonia");
              const words = title.split(" ");
              const lastWord = words.pop();
              return (
                <>
                  {words.join(" ")}{" "}
                  <span className="text-gold-400 italic">{lastWord}</span>
                </>
              );
            })()}
          </h2>
          <p className="text-cocoa-200 text-lg leading-relaxed mb-8">
            {cb("about.body", "Não vendemos apenas cacau; vendemos consistência.")}
          </p>

          <ul className="space-y-4 mb-10">
            {bullets.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-cocoa-100">
                <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="outline" className="self-start border-cocoa-700 text-cocoa-100 hover:bg-cocoa-800 hover:text-white">
              {cb("about.btn.protocols", "Protocolos Técnicos")}
            </Button>
            <Button variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-transparent p-0">
              {cb("about.btn.certs", "Ver Certificações")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSplit;

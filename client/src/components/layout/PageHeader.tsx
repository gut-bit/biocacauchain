import { Badge } from "@/components/ui/badge";

/**
 * PageHeader — Reusable hero/title band for internal pages.
 *
 * Usage:
 *   <PageHeader
 *     badge="Catálogo B2B"
 *     title={<>Ingredientes <span className="text-gold-400 italic">Qualitheo</span></>}
 *     subtitle="Cacau amazônico premium para indústria chocolateira."
 *   />
 */

interface PageHeaderProps {
  /** Small gold badge above the title (optional) */
  badge?: string;
  /** The page title — accepts JSX for rich formatting */
  title: React.ReactNode;
  /** Subtitle paragraph below the title (optional) */
  subtitle?: string;
  /** If true, uses a green gradient instead of cocoa. Default: false */
  green?: boolean;
}

export default function PageHeader({ badge, title, subtitle, green = false }: PageHeaderProps) {
  const gradient = green
    ? "from-green-800 to-green-950"
    : "from-cocoa-900 to-cocoa-950";

  const subtitleColor = green ? "text-green-100" : "text-cocoa-300";

  return (
    <section className={`py-16 px-6 bg-gradient-to-b ${gradient}`}>
      <div className="container mx-auto text-center">
        {badge && (
          <Badge className="mb-4 bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase tracking-widest text-xs">
            {badge}
          </Badge>
        )}
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4 text-white">
          {title}
        </h1>
        {subtitle && (
          <p className={`${subtitleColor} text-lg max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

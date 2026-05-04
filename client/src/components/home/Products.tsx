import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";
import ASSETS from "./assets";

const ProductBlock = ({
  title,
  subtitle,
  description,
  products,
  image,
  align = "left",
  accentColor = "gold" // gold or leaf
}: {
  title: string;
  subtitle: string;
  description: string;
  products: { name: string; desc: string; formats: string[] }[];
  image: string;
  align?: "left" | "right";
  accentColor?: "gold" | "leaf";
}) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-32 ${align === "right" ? "lg:flex-row-reverse" : ""}`}>
      <div className="w-full lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2">
        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border ${accentColor === "leaf" ? "bg-leaf-500/10 text-leaf-400 border-leaf-500/30" : "bg-gold-500/10 text-gold-400 border-gold-500/30"}`}>
          {subtitle}
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-white mb-6">{title}</h3>
        <p className="text-cocoa-300 text-lg mb-10 leading-relaxed">{description}</p>

        <div className="space-y-6">
          {products.map((product, idx) => (
            <div key={idx} className="border-l-2 border-cocoa-700 pl-6 hover:border-gold-500 transition-colors">
              <h4 className="font-display text-xl text-gold-400 mb-2">{product.name}</h4>
              <p className="text-cocoa-400 text-sm mb-4">{product.desc}</p>

              <div className="flex flex-wrap gap-2">
                {product.formats.map((fmt, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 bg-cocoa-800 text-cocoa-300 text-xs font-medium rounded border border-cocoa-700">
                    <Box className="w-3 h-3 mr-1 opacity-50" />
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-900 border-t border-cocoa-800" id="produtos">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-3 block">{t('products.label')}</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">{t('products.title')}</h2>
          <p className="text-cocoa-300 text-lg">
            Produtos de cacau fino de origem rastreada, para o mercado gourmet e industrial.
          </p>
        </div>

        {/* BLOCO 1: Néctar */}
        <ProductBlock
          align="left"
          subtitle={t('products.nectar.title')}
          title="Frozen Cacao Nectar"
          description={t('products.nectar.desc')}
          image={ASSETS.nectar}
          accentColor="leaf"
          products={[
            {
              name: t('products.nectar.title'),
              desc: t('products.nectar.desc'),
              formats: ["Tetra Pak 1L", "Galão 5L", "Galão 25L", "Tambor"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 2: Amêndoas */}
        <ProductBlock
          align="right"
          subtitle={t('products.beans.title')}
          title="Fermented Cacao Beans"
          description={t('products.beans.desc')}
          image={ASSETS.beans_container}
          products={[
            {
              name: t('products.beans.title'),
              desc: t('products.beans.desc'),
              formats: ["Sacos Juta 60kg", "Palete 1 Ton", "Meio Container (12.5T)", "Container Cheio (25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 3: Nibs */}
        <ProductBlock
          align="left"
          subtitle={t('products.nibs.title')}
          title="Cacao Nibs"
          description={t('products.nibs.desc')}
          image={ASSETS.nibs_bags}
          products={[
            {
              name: t('products.nibs.title'),
              desc: t('products.nibs.desc'),
              formats: ["Varejo (100g - 1kg)", "Sacos (5kg - 60kg)", "Big Bag 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 4: Liquor */}
        <ProductBlock
          align="right"
          subtitle={t('products.liquor.title')}
          title="Cacao Liquor Block"
          description={t('products.liquor.desc')}
          image={ASSETS.liquor_blocks}
          products={[
            {
              name: t('products.liquor.title'),
              desc: t('products.liquor.desc'),
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 5: Butter */}
        <ProductBlock
          align="left"
          subtitle={t('products.butter.title')}
          title="Cacao Butter Block"
          description={t('products.butter.desc')}
          image={ASSETS.butter_blocks}
          products={[
            {
              name: t('products.butter.title'),
              desc: t('products.butter.desc'),
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 6: Powder */}
        <ProductBlock
          align="right"
          subtitle={t('products.powder.title')}
          title="Cacao Powder"
          description={t('products.powder.desc')}
          image={ASSETS.powder_bags}
          products={[
            {
              name: t('products.powder.title'),
              desc: t('products.powder.desc'),
              formats: ["Sacos 25kg", "Sacos 60kg", "Big Bag 1 Ton"]
            }
          ]}
        />

      </div>
    </section>
  );
};

export default Products;

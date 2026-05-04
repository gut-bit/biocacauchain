import { motion } from "framer-motion";
import { Leaf, Factory, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import ASSETS from "./assets";

const Features = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-900 border-t border-cocoa-800" id="origem">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Leaf,
              title: t('features.origin.title'),
              desc: t('features.origin.desc')
            },
            {
              icon: Factory,
              title: t('features.industry.title'),
              desc: t('features.industry.desc')
            },
            {
              icon: Globe,
              title: t('features.global.title'),
              desc: t('features.global.desc')
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-start p-8 rounded-2xl bg-cocoa-800/50 border border-cocoa-700 hover:border-gold-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                <feature.icon strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl mb-3 text-white">{feature.title}</h3>
              <p className="text-cocoa-300 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

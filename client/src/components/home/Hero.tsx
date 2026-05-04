import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/providers/ContentProvider";
import ASSETS from "./assets";

const HeroSlideshow = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Slides: hero_bg first for fast LCP paint, video second, then additional images
  const slides = [
    { type: 'image' as const, src: ASSETS.hero_bg,       duration: 6000 },
    { type: 'video' as const, src: ASSETS.hero_video,    duration: 14000 },
    { type: 'image' as const, src: ASSETS.cut_test,      duration: 6000 },
    { type: 'image' as const, src: ASSETS.dense_trees,   duration: 6000 },
    { type: 'image' as const, src: ASSETS.cocoa_awards,  duration: 6000 },
  ];

  useEffect(() => {
    const advance = () =>
      setActiveIdx((prev) => (prev + 1) % slides.length);

    const timer = setTimeout(advance, slides[activeIdx].duration);
    return () => clearTimeout(timer);
  }, [activeIdx]);

  // When the video slide becomes active, restart + play the video
  useEffect(() => {
    if (!videoRef.current) return;
    if (activeIdx === 1) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {/* autoplay blocked - muted so usually fine */});
    }
  }, [activeIdx]);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${activeIdx === i ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.type === 'video' ? (
            <video
              ref={videoRef}
              src={slide.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.src}
              alt=""
              fetchPriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-500 ${
              i === activeIdx
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const { cb } = useContent();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-cocoa-950">
      {/* Parallax wrapper */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <HeroSlideshow />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-cocoa-950/80 z-10 pointer-events-none" />
      </motion.div>

      {/* Floating decorative beans — subtle, low-opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          style={{ y: useTransform(scrollY, [0, 800], [0, 160]) }}
          className="absolute top-[12%] right-[6%] w-28 md:w-40 opacity-30 blur-[1px]"
        >
          <img src={ASSETS.floating_beans} alt="" className="w-full h-auto" />
        </motion.div>
      </div>

      {/* Text content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest mb-6">
            <Award className="w-3 h-3 text-gold-400" />
            <span>{cb('hero.badge')}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.08] mb-6 drop-shadow-xl">
            {cb('hero.title.1')} <br />
            <span className="italic font-light text-gold-400">{cb('hero.title.2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md">
            {cb('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base shadow-xl shadow-gold-500/25 transition-all hover:scale-[1.03]"
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {cb('hero.cta.products')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 rounded-full px-8 h-14 text-base transition-all hover:scale-[1.03]"
              onClick={() => document.getElementById('diagrama-processo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {cb('hero.cta.factory')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

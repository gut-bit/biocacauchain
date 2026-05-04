const fs = require('fs');
const path = require('path');

const homeFile = 'client/src/pages/home.tsx';
const outDir = 'client/src/components/home';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let content = fs.readFileSync(homeFile, 'utf8');

// Function to extract a component by name using basic matching for 'const Name = ()'
function extractComponentCode(name) {
  const startRegex = new RegExp(`const ${name} =.*=>\\s*{`);
  const match = content.match(startRegex);
  if (!match) return null;
  
  const startIndex = match.index;
  let braceCount = 0;
  let endIndex = -1;
  let inCode = false;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inCode = true;
    } else if (content[i] === '}') {
      braceCount--;
    }

    if (inCode && braceCount === 0) {
      // Find the closing semicolon if it exists
      endIndex = i + 1;
      if (content[endIndex] === ';') endIndex++;
      break;
    }
  }

  if (endIndex !== -1) {
    const code = content.substring(startIndex, endIndex);
    // Remove the component from the main content
    content = content.substring(0, startIndex) + '\n\n/* EXTRACTED: ' + name + ' */\n\n' + content.substring(endIndex);
    return code;
  }
  return null;
}

// Map of components to extract
const components = {
  'Navbar': ['import { useState, useEffect } from "react";', 'import { useLanguage } from "@/lib/i18n";', 'import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";', 'import { Button } from "@/components/ui/button";', 'import { Menu } from "lucide-react";'],
  'Hero': ['import { useState, useEffect, useRef } from "react";', 'import { motion, useScroll, useTransform } from "framer-motion";', 'import { Award } from "lucide-react";', 'import { Button } from "@/components/ui/button";', 'import { useLanguage } from "@/lib/i18n";'], // Will manually merge HeroSlideshow
  'InfrastructureShowcase': ['import { useState } from "react";', 'import { useLanguage } from "@/lib/i18n";'],
  'MarketThesis': ['import { Scale, CheckCircle2 } from "lucide-react";', 'import { useLanguage } from "@/lib/i18n";'],
  'Features': ['import { motion } from "framer-motion";', 'import { Leaf, Factory, Globe } from "lucide-react";', 'import { useLanguage } from "@/lib/i18n";'],
  'ProcessDiagram': ['import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";', 'import { CheckCircle2, ZoomIn, Truck, Spline, Beaker, Sun, QrCode, Factory } from "lucide-react";', 'import { useLanguage } from "@/lib/i18n";'],
  'AboutSplit': ['import { Globe, CheckCircle2, ArrowRight } from "lucide-react";', 'import { Button } from "@/components/ui/button";'],
  'Products': ['import { motion } from "framer-motion";', 'import { Box } from "lucide-react";', 'import { Separator } from "@/components/ui/separator";', 'import { useLanguage } from "@/lib/i18n";'],
  'Impact': ['import { useState } from "react";', 'import { useLanguage } from "@/lib/i18n";', 'import { Globe, Award } from "lucide-react";', 'import { Button } from "@/components/ui/button";', 'import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";'],
  'Partners': ['import { useLanguage } from "@/lib/i18n";'],
  'Footer': ['import { Instagram, Globe, ArrowRight, Award } from "lucide-react";', 'import { useLanguage } from "@/lib/i18n";'],
  'MarketplaceSection': []
};

// We also need HeroSlideshow which Hero depends on
const heroSlideshowCode = extractComponentCode('HeroSlideshow');

// Also QuoteForm which Impact depends on
const quoteFormCode = extractComponentCode('QuoteForm');

// Also ProductBlock which Products depends on
// ProductBlock has signature: const ProductBlock = ({...}) => {
function extractProductBlock() {
  const startRegex = /const ProductBlock = \(\{[\s\S]*?\}\) => \{/;
  const match = content.match(startRegex);
  if (!match) return null;
  const startIndex = match.index;
  let braceCount = 0;
  let endIndex = -1;
  let inCode = false;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inCode = true;
    } else if (content[i] === '}') {
      braceCount--;
    }
    if (inCode && braceCount === 0) {
      endIndex = i + 1;
      if (content[endIndex] === ';') endIndex++;
      break;
    }
  }
  if (endIndex !== -1) {
    const code = content.substring(startIndex, endIndex);
    content = content.substring(0, startIndex) + '\n/* EXTRACTED: ProductBlock */\n' + content.substring(endIndex);
    return code;
  }
  return null;
}
const productBlockCode = extractProductBlock();

// The ASSETS import block is large, let's just create a shared file for them!
const assetsMatch = content.match(/import hero_bg[\s\S]*?const ASSETS = {[\s\S]*?};/);
if (assetsMatch) {
  fs.writeFileSync('client/src/components/home/assets.ts', assetsMatch[0] + '\n\nexport default ASSETS;\n');
  content = content.replace(assetsMatch[0], 'import ASSETS from "@/components/home/assets";');
}

Object.keys(components).forEach(comp => {
  let code = extractComponentCode(comp);
  if (!code) { console.log('Failed to extract', comp); return; }

  // Inject dependencies
  if (comp === 'Hero' && heroSlideshowCode) code = heroSlideshowCode + '\n\n' + code;
  if (comp === 'Impact' && quoteFormCode) code = quoteFormCode + '\n\n' + code;
  if (comp === 'Products' && productBlockCode) code = productBlockCode + '\n\n' + code;

  let fileContent = components[comp].join('\n') + '\n';
  fileContent += 'import ASSETS from "./assets";\n\n';
  fileContent += code;
  fileContent += `\n\nexport default ${comp};\n`;

  fs.writeFileSync(path.join(outDir, `${comp}.tsx`), fileContent);
  console.log(`Extracted ${comp}.tsx`);
});

// Update home.tsx
const imports = Object.keys(components).map(comp => `import ${comp} from "@/components/home/${comp}";`).join('\n');
content = content.replace(/import { useState[\s\S]*?import { useLanguage } from "@\/lib\/i18n";/, imports + '\nimport PrecosWidget from "@/components/PrecosWidget";');

fs.writeFileSync(homeFile, content);
console.log('Done rewriting home.tsx!');

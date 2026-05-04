// One-shot accessibility fix: add id/htmlFor to select elements in portal-qualitheo.tsx
import { readFileSync, writeFileSync } from "fs";

const file = "client/src/pages/portal-qualitheo.tsx";
let src = readFileSync(file, "utf8");

// Fix 1: label for "Condições de pagamento" — add htmlFor
src = src.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">Condições de pagamento</label>',
  '<label htmlFor="condicoes-pag" className="block text-sm font-medium text-gray-700 mb-1">Condições de pagamento</label>'
);

// Fix 2: matching select — add id
src = src.replace(
  /(<select\r?\n\s+value=\{condicoesPag\})/,
  '<select\n                                                id="condicoes-pag"\n                                                value={condicoesPag}'
);

// Fix 3: label for "Validade da proposta" — add htmlFor
src = src.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">Validade da proposta</label>',
  '<label htmlFor="validade-dias" className="block text-sm font-medium text-gray-700 mb-1">Validade da proposta</label>'
);

// Fix 4: matching select — add id
src = src.replace(
  /(<select\r?\n\s+value=\{validadeDias\})/,
  '<select\n                                                id="validade-dias"\n                                                value={validadeDias}'
);

writeFileSync(file, src, "utf8");
console.log("Accessibility fix applied to", file);

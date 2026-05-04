const fs = require('fs');
const filepath = 'client/src/pages/portal-qualitheo.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Add import
if (!content.includes('import { Helmet }')) {
  content = content.replace('import PrecosManager from "@/components/admin/PrecosManager";', 'import PrecosManager from "@/components/admin/PrecosManager";\nimport { Helmet } from "react-helmet-async";');
}

// 2. Add Helmet tags inside return (
const insertion = `
            <Helmet>
                <title>Portal Qualitheo | Gestão de Originação de Cacau</title>
                <meta name="description" content="Dashboard interno para gestão de lotes de cacau, auditoria de qualidade e envio de propostas comerciais a produtores parceiros." />
            </Helmet>`;

content = content.replace('<div className="min-h-screen bg-gray-50/50">', '<div className="min-h-screen bg-gray-50/50">' + insertion);

fs.writeFileSync(filepath, content);
console.log('Successfully injected Helmet!');

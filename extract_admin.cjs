const fs = require('fs');
const path = require('path');

const portalFile = 'client/src/pages/portal-qualitheo.tsx';
const outDir = 'client/src/components/admin';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let content = fs.readFileSync(portalFile, 'utf8');

// The file has well defined function blocks right at the end!
// OriginationDashboard goes from line 554 to 656
// PrecosManager goes from line 659 to 827

// Let's extract OriginationDashboard
const originationDashboardCode = content.substring(
  content.indexOf('// ─── Origination Analytics Dashboard'),
  content.indexOf('// ─── Daily Price Manager')
);

// Let's extract PrecosManager
const precosManagerCode = content.substring(
  content.indexOf('// ─── Daily Price Manager')
);

// Write OriginationDashboard.tsx
const dashboardFile = [
  'import { useState, useEffect, useCallback } from "react";',
  'import { BarChart3, RefreshCw, Package, TrendingUp } from "lucide-react";',
  '',
  originationDashboardCode.replace('function OriginationDashboard', 'export default function OriginationDashboard')
].join('\n');
fs.writeFileSync(path.join(outDir, 'OriginationDashboard.tsx'), dashboardFile);

// Write PrecosManager.tsx
const precosManagerFile = [
  'import { useState, useEffect } from "react";',
  'import { BarChart3, ChevronUp, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";',
  '',
  precosManagerCode.replace('function PrecosManager', 'export default function PrecosManager')
].join('\n');
fs.writeFileSync(path.join(outDir, 'PrecosManager.tsx'), precosManagerFile);

// Now truncate portal-qualitheo.tsx just above OriginationDashboard!
const newPortalContent = content.substring(0, content.indexOf('// ─── Origination Analytics Dashboard')) + '\n';

// We also need to add the imports at the top!
const importDashboard = 'import OriginationDashboard from "@/components/admin/OriginationDashboard";';
const importPrecos = 'import PrecosManager from "@/components/admin/PrecosManager";';

const finalPortalContent = newPortalContent.replace(
  'import {',
  `${importDashboard}\n${importPrecos}\nimport {`
);

fs.writeFileSync(portalFile, finalPortalContent);

console.log('Successfully extracted OriginationDashboard and PrecosManager!');

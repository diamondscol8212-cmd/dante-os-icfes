/**
 * Embebe SVG de /public/assets en recurso_visual para que el cliente
 * nunca dependa de un fetch HTTP que pueda 404.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = path.resolve(__dirname, '../../../public');
const cacheSvg = new Map();
const faltantesReportadas = new Set();

export function resolverRutaPublica(url) {
  if (!url || typeof url !== 'string') return null;
  const limpio = url.trim();
  if (!limpio.startsWith('/assets/') && !limpio.startsWith('assets/')) return null;
  const rel = limpio.replace(/^\//, '').replace(/\//g, path.sep);
  return path.join(PUBLIC_ROOT, rel);
}

export function leerSvgPublico(url) {
  const full = resolverRutaPublica(url);
  if (!full) return null;
  if (cacheSvg.has(full)) return cacheSvg.get(full);
  try {
    if (!fs.existsSync(full)) {
      faltantesReportadas.add(String(url));
      cacheSvg.set(full, null);
      return null;
    }
    const raw = fs.readFileSync(full, 'utf8').trim();
    const ok = raw.includes('<svg');
    cacheSvg.set(full, ok ? raw : null);
    if (!ok) faltantesReportadas.add(String(url));
    return ok ? raw : null;
  } catch (e) {
    faltantesReportadas.add(String(url));
    cacheSvg.set(full, null);
    return null;
  }
}

function svgEsquema(titulo, detalle) {
  const t = String(titulo || 'Figura').slice(0, 48);
  const d = String(detalle || '').slice(0, 90);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" role="img" aria-label="${t}">`
    + `<rect width="420" height="160" rx="10" fill="#faf8f5"/>`
    + `<rect x="1" y="1" width="418" height="158" rx="9" fill="none" stroke="#44403c"/>`
    + `<text x="24" y="36" fill="#1c1917" font-size="15" font-family="Georgia,serif">${t}</text>`
    + `<text x="24" y="68" fill="#44403c" font-size="13" font-family="Georgia,serif">${d}</text>`
    + `<rect x="24" y="90" width="160" height="40" fill="none" stroke="#0f766e" stroke-width="2"/>`
    + `<text x="36" y="116" fill="#0f766e" font-size="12">dato del enunciado</text>`
    + `</svg>`;
}

/** Esquema mínimo si el ítem exige figura/mapa/escala y no trae recurso. */
function esquemaSiFalta(item, recursoVacio) {
  if (!recursoVacio) return null;
  const enun = String(item.pregunta_texto || item.texto || item.enunciado || '');
  if (/escala\s*1\s*[:：]\s*\d|1\s*cm representa|mapa.*(escala|distancia)|escala.*(mapa|plano)/i.test(enun)) {
    return svgEsquema('Escala del mapa / plano', 'Relaciona cm del papel con la distancia real.');
  }
  if (/climograma/i.test(enun)) {
    return svgEsquema('Climograma', 'Barras de precipitación y línea de temperatura.');
  }
  if (/diagrama de caja|box\s*plot|caja y bigotes/i.test(enun)) {
    return svgEsquema('Diagrama de caja y bigotes', 'Q1, mediana y Q3 sobre la recta numérica.');
  }
  if (/rosa de los vientos/i.test(enun)) {
    return svgEsquema('Rosa de los vientos', 'Orienta los puntos cardinales N–S–E–O.');
  }
  if (/\bla figura\b|\bel mapa\b|\bla gr[aá]fica\b/i.test(enun)
      && !/figura jur[ií]dica|figura del|figura de la|tabla peri[oó]dica/i.test(enun)) {
    return svgEsquema('Recurso visual del ítem', 'Usa la figura descrita en el enunciado.');
  }
  return null;
}

/** Si el ítem apunta a un SVG en /assets y no trae recurso_visual, lo embebe. */
export function embeberGraficaItem(item) {
  if (!item || typeof item !== 'object') return item;
  const url = item.imagen_url || item.grafico_url || item.imagen || null;
  let recurso = item.recurso_visual || null;
  const recursoVacio = !recurso || !String(recurso).trim();
  if (recursoVacio && url) {
    const svg = leerSvgPublico(url);
    if (svg) recurso = svg;
  }
  if ((!recurso || !String(recurso).trim())) {
    const esquema = esquemaSiFalta(item, true);
    if (esquema) recurso = esquema;
  }
  return {
    ...item,
    imagen_url: url || item.imagen_url || null,
    recurso_visual: recurso || item.recurso_visual || null
  };
}

export function graficasFaltantes() {
  return Array.from(faltantesReportadas);
}

export function auditarRutasGraficas(urls = []) {
  const ok = [];
  const missing = [];
  urls.forEach((u) => {
    const full = resolverRutaPublica(u);
    if (full && fs.existsSync(full)) ok.push(u);
    else missing.push(u);
  });
  return { ok, missing };
}

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

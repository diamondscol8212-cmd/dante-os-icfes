const D = 1.702;
const NODOS = [-4.4444505893, -3.8118338356, -3.2423759570, -2.7161100344, -2.2198007421, -1.7451996504, -1.2862293414, -0.8380383173, -0.3964547464, 0, 0.3964547464, 0.8380383173, 1.2862293414, 1.7451996504, 2.2198007421, 2.7161100344, 3.2423759570, 3.8118338356, 4.4444505893];
const PESOS = [1.733979e-09, 3.633454e-07, 2.378036e-05, 5.867160e-04, 6.438416e-03, 3.424933e-02, 1.002476e-01, 1.691717e-01, 2.210452e-01, 2.422491e-01, 2.210452e-01, 1.691717e-01, 1.002476e-01, 3.424933e-02, 6.438416e-03, 5.867160e-04, 2.378036e-05, 3.633454e-07, 1.733979e-09];

function params(item) {
  const a = Number(item && item.a);
  const b = Number(item && item.b);
  const c = Number(item && item.c);
  return {
    a: Number.isFinite(a) && a > 0 ? a : 1,
    b: Number.isFinite(b) ? b : 0,
    c: Number.isFinite(c) ? Math.min(0.45, Math.max(0, c)) : 0.2
  };
}

function probabilidad(theta, item) {
  const p = params(item);
  const exponente = -D * p.a * (theta - p.b);
  if (exponente > 30) return p.c;
  if (exponente < -30) return 1;
  return p.c + (1 - p.c) / (1 + Math.exp(exponente));
}

export function aPuntosSaber(theta) {
  const t = Math.max(-3, Math.min(3, Number(theta) || 0));
  // Misma escala que la misión diaria: 5 * (50 + 13.8 * θ) = 250 + 69 * θ
  return Math.max(0, Math.min(500, Math.round(250 + t * 69)));
}

export function estimarHistorial(historial) {
  const items = Array.isArray(historial) ? historial : [];
  if (!items.length) return { theta: 0, sem: 1, puntos: null };
  const logs = new Array(NODOS.length).fill(0);
  let maxLog = -Infinity;
  for (let i = 0; i < NODOS.length; i++) {
    const thetaNodo = Math.sqrt(2) * NODOS[i];
    let logL = 0;
    items.forEach((item) => {
      let P = probabilidad(thetaNodo, item);
      P = Math.max(0.0001, Math.min(0.9999, P));
      logL += item && item.correcto ? Math.log(P) : Math.log(1 - P);
    });
    logs[i] = logL;
    if (logL > maxLog) maxLog = logL;
  }
  let num = 0;
  let den = 0;
  const dens = new Array(NODOS.length).fill(0);
  for (let i = 0; i < NODOS.length; i++) {
    const thetaNodo = Math.sqrt(2) * NODOS[i];
    const d = Math.exp(logs[i] - maxLog) * (PESOS[i] / Math.sqrt(Math.PI));
    dens[i] = d;
    num += thetaNodo * d;
    den += d;
  }
  const theta = den > 0 ? num / den : 0;
  let varNum = 0;
  for (let i = 0; i < NODOS.length; i++) {
    const thetaNodo = Math.sqrt(2) * NODOS[i];
    varNum += Math.pow(thetaNodo - theta, 2) * dens[i];
  }
  const sem = den > 0 ? Math.sqrt(varNum / den) : 1;
  return {
    theta: Math.round(theta * 1000) / 1000,
    sem: Math.round(sem * 1000) / 1000,
    puntos: aPuntosSaber(theta)
  };
}

// engine3PL.js - Motor Psicométrico Puro Gauss-Hermite Canónico (Dante OS v20.5.6 - Production)

const GH_RAW_NODES = [
    -4.4444505893, -3.8118338356, -3.2423759570, -2.7161100344, -2.2198007421,
    -1.7451996504, -1.2862293414, -0.8380383173, -0.3964547464, -0.0000000000,
     0.3964547464,  0.8380383173,  1.2862293414,  1.7451996504,  2.2198007421,
     2.7161100344,  3.2423759570,  3.8118338356,  4.4444505893
];

const GH_RAW_WEIGHTS = [
    1.733979e-09, 3.633454e-07, 2.378036e-05, 5.867160e-04, 6.438416e-03,
    3.424933e-02, 1.002476e-01, 1.691717e-01, 2.210452e-01, 2.422491e-01,
    2.210452e-01, 1.691717e-01, 1.002476e-01, 3.424933e-02, 6.438416e-03,
    5.867160e-04, 2.378036e-05, 3.633454e-07, 1.733979e-09
];

export const GH_NODES = Object.freeze(GH_RAW_NODES);
export const GH_WEIGHTS = Object.freeze(GH_RAW_WEIGHTS);

const Dante_OS_Constantes = {
    ESCALA_D: 1.702,
    MAESTRY_CUT_SCORE: 0.80 
};

export function calcularProbabilidad3PL(theta, a, b, c) {
    const exponente = -Dante_OS_Constantes.ESCALA_D * a * (theta - b);
    if (exponente > 30) return c;
    if (exponente < -30) return 1.0;
    return c + (1.0 - c) / (1.0 + Math.exp(exponente));
}

export function calcularInformacionFisher(theta, a, b, c) {
    const P = calcularProbabilidad3PL(theta, a, b, c);
    const Q = 1.0 - P;
    if (Q === 0 || P === 0) return 0;
    
    const numerador = Math.pow(Dante_OS_Constantes.ESCALA_D * a * (P - c), 2) * Q;
    const denominador = Math.pow(1.0 - c, 2) * P;
    return numerador / denominador;
}

export function convertThetaToIcfesSovereign(theta, length) {
    // Contracción Bayesiana de Estabilidad (Evita volatilidad extrema en los primeros nodos)
    const pesoInfo = Math.min(1.0, length / 10);
    const thetaSuavizado = theta * pesoInfo;

    // Transformación logística acotada y mapeada al comportamiento histórico país
    const puntajeClasico = 50 + (thetaSuavizado * 13.8);
    return Math.max(1, Math.min(100, Math.round(puntajeClasico)));
}

export function estimarHabilidadEAP(historialItems) {
    if (!historialItems || historialItems.length === 0) {
        return {
            theta: 0.0000, bayesianSEM: 1.0000, fisherSEM: 1.0000,
            probMaestria: 0.0000, probMaestriaFormatted: "0.00%",
            intervaloCreible: [-1.9600, 1.9600],
            puntajeIcfesReal: 50
        };
    }

    const LIKELIHOODS = new Array(GH_NODES.length).fill(0.0);
    let maxLogLikelihood = -Infinity;

    for (let i = 0; i < GH_NODES.length; i++) {
        const thetaNodo = Math.sqrt(2) * GH_NODES[i];
        let logLikelihood = 0.0;

        historialItems.forEach(item => {
            let P = calcularProbabilidad3PL(thetaNodo, item.a, item.b, item.c);
            P = Math.max(0.0001, Math.min(0.9999, P));
            if (Boolean(item.correcto)) {
                logLikelihood += Math.log(P);
            } else {
                logLikelihood += Math.log(1.0 - P);
            }
        });

        LIKELIHOODS[i] = logLikelihood;
        if (logLikelihood > maxLogLikelihood) {
            maxLogLikelihood = logLikelihood;
        }
    }

    let numeradorIntegral = 0.0;
    let denominadorIntegral = 0.0;
    const densidadesPosteriores = new Array(GH_NODES.length).fill(0.0);

    for (let i = 0; i < GH_NODES.length; i++) {
        const thetaNodo = Math.sqrt(2) * GH_NODES[i];
        const likelihoodEstabilizada = Math.exp(LIKELIHOODS[i] - maxLogLikelihood);
        const dens = likelihoodEstabilizada * (GH_WEIGHTS[i] / Math.sqrt(Math.PI));

        densidadesPosteriores[i] = dens;
        numeradorIntegral += thetaNodo * dens;
        denominadorIntegral += dens;
    }

    const thetaEstimado = denominadorIntegral > 0 ? (numeradorIntegral / denominadorIntegral) : 0.0;

    let numeradorVarianza = 0.0;
    for (let i = 0; i < GH_NODES.length; i++) {
        const thetaNodo = Math.sqrt(2) * GH_NODES[i];
        numeradorVarianza += Math.pow(thetaNodo - thetaEstimado, 2) * densidadesPosteriores[i];
    }

    const varianzaBayesiana = denominadorIntegral > 0 ? (numeradorVarianza / denominadorIntegral) : 1.0;
    const bayesianSEM = Math.sqrt(varianzaBayesiana);

    let informacionFisherAcumulada = 0.0;
    for (const item of historialItems) {
        informacionFisherAcumulada += calcularInformacionFisher(thetaEstimado, item.a, item.b, item.c);
    }
    const fisherSEM = informacionFisherAcumulada > 0 ? (1.0 / Math.sqrt(informacionFisherAcumulada)) : 1.0;

    let areaMaestria = 0.0;
    for (let i = 0; i < GH_NODES.length; i++) {
        if ((Math.sqrt(2) * GH_NODES[i]) > Dante_OS_Constantes.MAESTRY_CUT_SCORE) {
            areaMaestria += densidadesPosteriores[i];
        }
    }
    
    let probMaestriaRaw = denominadorIntegral > 0 ? (areaMaestria / denominadorIntegral) : 0.0;
    probMaestriaRaw = Math.max(0.0, Math.min(1.0, probMaestriaRaw)); 

    const probMaestriaFormatted = `${(probMaestriaRaw * 100).toFixed(2)}%`;

    let thetaMinReal = thetaEstimado - 1.96 * bayesianSEM;
    let thetaMaxReal = thetaEstimado + 1.96 * bayesianSEM;

    if (denominadorIntegral > 0) {
        const CDF = [];
        let acumulado = 0.0;
        for (let i = 0; i < GH_NODES.length; i++) {
            acumulado += densidadesPosteriores[i] / denominadorIntegral;
            CDF.push({ theta: Math.sqrt(2) * GH_NODES[i], cdf: acumulado });
        }

        const nodoMin = CDF.find(p => p.cdf >= 0.025);
        const nodoMax = CDF.find(p => p.cdf >= 0.975) || CDF[CDF.length - 1];
        if (nodoMin) thetaMinReal = nodoMin.theta;
        if (nodoMax) thetaMaxReal = nodoMax.theta;
    }

    return {
        theta: parseFloat(thetaEstimado.toFixed(4)),
        bayesianSEM: parseFloat(bayesianSEM.toFixed(4)),
        fisherSEM: parseFloat(fisherSEM.toFixed(4)),
        probMaestria: parseFloat(probMaestriaRaw.toFixed(4)), 
        probMaestriaFormatted: probMaestriaFormatted,          
        intervaloCreible: [parseFloat(thetaMinReal.toFixed(4)), parseFloat(thetaMaxReal.toFixed(4))],
        puntajeIcfesReal: convertThetaToIcfesSovereign(thetaEstimado, historialItems.length)
    };
}

export function calcularICI(declaredConfidence, isCorrect, responseTime, itemDifficulty) {
    const confianza = String(declaredConfidence || 'alta').toLowerCase().trim();
    
    // Latencia adaptativa: Se calcula el tiempo esperado según la complejidad intrínseca del ítem (b)
    // Ítems muy fáciles (b = -2.0) asumen umbral base de 10s; ítems muy complejos (b = 2.0) escalan a 26s.
    const umbralLatenciaDinamico = 18.0 + (itemDifficulty * 4.0);

    let scoreBase = 0.50;

    if (isCorrect) {
        if (confianza === 'alta') {
            // Si responde rápido con alta confianza y acierta, verificamos que no sea suerte impulsiva
            scoreBase = (responseTime < (umbralLatenciaDinamico * 0.4)) ? 0.75 : 0.95;
        } 
        if (confianza === 'baja') scoreBase = 0.30; 
    } else {
        if (confianza === 'alta') {
            // Penalización inteligente indexada por el umbral dinámico de complejidad
            scoreBase = (responseTime < umbralLatenciaDinamico) ? 0.05 : 0.15; 
        }
        if (confianza === 'baja') scoreBase = 0.60; 
    }
    return scoreBase;
}

export function calcularCRI(arrayHistoricoRespuestas) {
    if (arrayHistoricoRespuestas.length < 3) return 0.50; 
    
    const ultimasTres = arrayHistoricoRespuestas.slice(-3);
    const primeraFallo = !ultimasTres[0].isCorrect;
    const segundaRecupera = ultimasTres[1].isCorrect;
    const terceraConsolida = ultimasTres[2].isCorrect;

    if (primeraFallo && segundaRecupera && terceraConsolida) {
        const deltaTheta = ultimasTres[2].thetaSnapshot - ultimasTres[0].thetaSnapshot;
        return Math.min(1.0, Math.max(0.1, 0.70 + deltaTheta)); 
    }
    
    if (primeraFallo && !segundaRecupera) {
        return 0.20; 
    }

    return 0.50; 
}
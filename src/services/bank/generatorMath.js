// 📐 src/services/bank/generatorMath.js - Generador & Calibrador Masivo de Reactivos de Matemáticas
// Dante OS Enterprise Edition - ICFES Saber 11 (1,000 Ítems Adicionales)

import { conAyuda } from './ponerAyuda.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const CONTEXTOS_COLOMBIA = [
    { loc: 'Bogotá', entidad: 'TransMilenio', tema: 'tarifa de transporte' },
    { loc: 'Medellín', entidad: 'Metro de Medellín', tema: 'aforo de pasajeros' },
    { loc: 'Cali', entidad: 'MIO', tema: 'frecuencia de buses' },
    { loc: 'Barranquilla', entidad: 'Puerto de Barranquilla', tema: 'carga de contenedores' },
    { loc: 'Bucaramanga', entidad: 'Empresa de Calzado', tema: 'costos de producción' },
    { loc: 'Pereira', entidad: 'Comité de Cafeteros', tema: 'exportación de bultos de café' },
    { loc: 'Cartagena', entidad: 'Sector Hotelero', tema: 'ocupación estacional' },
    { loc: 'Manizales', entidad: 'Central Hidroeléctrica', tema: 'nivel de embalses' }
];

export function generarReactivosMatematicasMasivos(count = 1000) {
    const reactivos = [];

    const subdisciplinas = [
        'algebra', 'geometria', 'estadistica', 'proporcionalidad', 
        'aritmetica', 'trigonometria', 'funciones', 'probabilidad'
    ];

    for (let i = 1; i <= count; i++) {
        const sub = subdisciplinas[i % subdisciplinas.length];
        const ctx = CONTEXTOS_COLOMBIA[i % CONTEXTOS_COLOMBIA.length];
        const itemId = `item_math_gen_${String(i).padStart(4, '0')}`;

        // Dificultad variada b entre -2.5 y +2.5
        const b = Number((-2.5 + ((i * 0.005) % 5.0)).toFixed(2));
        const a = Number((1.0 + ((i * 0.003) % 1.0)).toFixed(2));
        const c = 0.20;

        let item = null;

        if (sub === 'algebra') {
            const base = 2000 + (i * 150);
            const tarifa = 100 + (i * 10);
            const kilometros = 5 + (i % 15);
            const total = base + (tarifa * kilometros);
            const deMas = kilometros + 5;
            const deMenos = Math.max(1, kilometros - 2);
            let doble = kilometros * 2;
            if (doble === kilometros || doble === deMas || doble === deMenos) doble = kilometros + 11;

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'algebra',
                texto: `En la ciudad de ${ctx.loc}, la entidad ${ctx.entidad} evalúa un sistema de cobro para el ${ctx.tema}. La tarifa inicial es de COP ${base.toLocaleString('es-CO')} y se cobra un adicional constante de COP ${tarifa.toLocaleString('es-CO')} por kilómetro. Si un usuario pagó un total de COP ${total.toLocaleString('es-CO')}, ¿cuántos kilómetros recorrió?`,
                recurso_visual: null,
                opciones: [
                    `A) ${kilometros} kilómetros`,
                    `B) ${deMas} kilómetros`,
                    `C) ${deMenos} kilómetros`,
                    `D) ${doble} kilómetros`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, resta la tarifa inicial de COP ${base.toLocaleString('es-CO')} y divide lo que queda entre el adicional de COP ${tarifa.toLocaleString('es-CO')} por kilómetro.`,
                frase: `Esa cuenta da ${kilometros} kilómetros.`,
                repaso: 'Álgebra',
                razones: {
                    [`${deMas} kilómetros`]: 'Suma 5 kilómetros que el cobro no tiene.',
                    [`${deMenos} kilómetros`]: 'Resta 2 kilómetros y la cuenta deja de cerrar.',
                    [`${doble} kilómetros`]: 'Cambia los kilómetros en vez de despejarlos.'
                }
            });
        } else if (sub === 'geometria') {
            const ancho = 4 + (i % 20);
            const largo = ancho * 2;
            const area = ancho * largo;
            const perimetro = 2 * (ancho + largo);

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'geometria',
                texto: `Un proyecto de infraestructura en ${ctx.loc} requiere un terreno rectangular con un área de ${area} m². Si el largo del terreno es exactamente el doble del ancho, ¿cuántos metros de cerramiento se requieren para cubrir todo su perímetro?`,
                recurso_visual: generateSVG(`<rect x="60" y="50" width="280" height="100" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="170" y="40" fill="%23d4af37" font-size="14">Largo = 2x</text><text x="350" y="105" fill="%23d4af37" font-size="14">x</text><text x="150" y="110" fill="%23111111" font-size="16">Área = ${area} m²</text>`),
                opciones: [
                    `A) ${perimetro / 2} metros`,
                    `B) ${perimetro} metros`,
                    `C) ${perimetro + 12} metros`,
                    `D) ${area / 2} metros`
                ],
                ok: "B", a, b, c,
                q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
                trampas: [
                    { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
                    { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, el terreno mide ${area} m² y el largo es el doble del ancho. El cerramiento es la suma de los cuatro lados.`,
                frase: `El perímetro de ese terreno es ${perimetro} metros.`,
                repaso: 'Geometría',
                razones: {
                    [`${perimetro / 2} metros`]: 'Cuenta solo la mitad de los lados.',
                    [`${perimetro + 12} metros`]: 'Suma 12 metros que el terreno no tiene.',
                    [`${area / 2} metros`]: 'Parte el área a la mitad. El cerramiento es el perímetro.'
                }
            });
        } else if (sub === 'estadistica') {
            const media = 50 + (i % 30);
            const totalEst = 100;
            const sobreMedia = 25 + (i % 20);
            const prob = ((sobreMedia / totalEst) * 100).toFixed(0);
            const mitad = (Number(prob) / 2).toFixed(0);
            const subido = (Number(prob) + 15).toFixed(0);
            let otro = '80';
            if (otro === prob || otro === mitad || otro === subido) otro = '12';

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'estadistica',
                texto: `En una muestra estadística realizada por ${ctx.entidad} en ${ctx.loc}, de un grupo de ${totalEst} personas, ${sobreMedia} registran un nivel superior al promedio regional de COP ${media}.000. Si se selecciona a una persona al azar, ¿cuál es la probabilidad porcentual de que se encuentre en dicho grupo?`,
                recurso_visual: generateSVG(`<text x="200" y="22" text-anchor="middle" fill="%23111111" font-size="13" font-weight="700">Frecuencias muestrales</text><line x1="40" y1="40" x2="40" y2="170" stroke="%23666666"/><line x1="40" y1="170" x2="360" y2="170" stroke="%23666666"/><rect x="60" y="130" width="50" height="40" fill="%233498db"/><rect x="140" y="70" width="50" height="100" fill="%232ecc71"/><rect x="220" y="40" width="50" height="130" fill="%23e74c3c"/><rect x="300" y="90" width="50" height="80" fill="%23f1c40f"/><text x="85" y="190" text-anchor="middle" fill="%23111111" font-size="12" font-weight="700">G1</text><text x="165" y="190" text-anchor="middle" fill="%23111111" font-size="12" font-weight="700">G2</text><text x="245" y="190" text-anchor="middle" fill="%23111111" font-size="12" font-weight="700">G3</text><text x="325" y="190" text-anchor="middle" fill="%23111111" font-size="12" font-weight="700">G4</text>`),
                opciones: [
                    `A) ${prob}%`,
                    `B) ${mitad}%`,
                    `C) ${subido}%`,
                    `D) ${otro}%`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En la muestra de ${ctx.loc} hay ${totalEst} personas y ${sobreMedia} están por encima del promedio. El porcentaje es ese grupo sobre el total.`,
                frase: `${sobreMedia} de ${totalEst} es ${prob}%.`,
                repaso: 'Estadística',
                razones: {
                    [`${mitad}%`]: 'Parte el porcentaje a la mitad.',
                    [`${subido}%`]: 'Suma 15 puntos que la muestra no da.',
                    [`${otro}%`]: 'Usa otro porcentaje, no el de esta muestra.'
                }
            });
        } else if (sub === 'proporcionalidad') {
            const operarios = 4 + (i % 6);
            const horasVal = 6 + (i % 4);
            const produccion = operarios * horasVal * 10;
            const nuevaProduccion = produccion * 2;
            const horasReq = horasVal * 2;

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'proporcionalidad',
                texto: `Un equipo de ${operarios} operarios en una planta industrial de ${ctx.loc} produce ${produccion} unidades en una jornada de ${horasVal} horas. Si la demanda para el ${ctx.tema} se duplica a ${nuevaProduccion} unidades manteniendo el número de operarios, ¿cuántas horas de trabajo continuadas se necesitarán?`,
                recurso_visual: null,
                opciones: [
                    `A) ${horasVal} horas`,
                    `B) ${horasReq} horas`,
                    `C) ${horasReq + 4} horas`,
                    `D) ${horasVal * 3} horas`
                ],
                ok: "B", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, ${operarios} operarios hacen ${produccion} unidades en ${horasVal} horas. Si hay que hacer el doble y las personas no cambian, las horas también se duplican.`,
                frase: `${horasVal} por 2 son ${horasReq} horas.`,
                repaso: 'Proporcionalidad',
                razones: {
                    [`${horasVal} horas`]: 'Deja las horas iguales aunque la producción se duplicó.',
                    [`${horasReq + 4} horas`]: 'Suma 4 horas que la proporción no pide.',
                    [`${horasVal * 3} horas`]: 'Triplica las horas. La producción solo se duplicó.'
                }
            });
        } else if (sub === 'aritmetica') {
            const valorOriginal = 100000 + (i * 5000);
            const valorDescuento = valorOriginal * 0.8;
            const valorFinal = valorDescuento * 1.19;

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'aritmetica',
                texto: `Un insumo tecnológico para ${ctx.entidad} en ${ctx.loc} tiene un precio inicial de COP ${valorOriginal.toLocaleString('es-CO')}. Se le aplica un descuento promocional del 20% y sobre el precio rebajado se adiciona el IVA del 19%. ¿Cuál es el costo total facturado?`,
                recurso_visual: null,
                opciones: [
                    `A) COP ${Math.round(valorFinal).toLocaleString('es-CO')}`,
                    `B) COP ${Math.round(valorOriginal * 0.99).toLocaleString('es-CO')}`,
                    `C) COP ${Math.round(valorDescuento).toLocaleString('es-CO')}`,
                    `D) COP ${Math.round(valorOriginal * 1.19).toLocaleString('es-CO')}`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, primero quita el 20% de COP ${valorOriginal.toLocaleString('es-CO')} y, sobre lo que queda, suma el 19%.`,
                frase: `Ese orden da COP ${Math.round(valorFinal).toLocaleString('es-CO')}.`,
                repaso: 'Aritmética',
                razones: {
                    [`COP ${Math.round(valorOriginal * 0.99).toLocaleString('es-CO')}`]: 'Aplica un 1% y no el 20% seguido del 19%.',
                    [`COP ${Math.round(valorDescuento).toLocaleString('es-CO')}`]: 'Se queda en el precio rebajado y no suma el IVA.',
                    [`COP ${Math.round(valorOriginal * 1.19).toLocaleString('es-CO')}`]: 'Cobra el IVA sobre el precio inicial, sin el descuento.'
                }
            });
        } else if (sub === 'trigonometria') {
            const h = 10 + (i % 30);
            const ang = 30;
            const dist = (h / Math.tan((ang * Math.PI) / 180)).toFixed(1);

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'trigonometria',
                texto: `Para la instalación de una antena de telecomunicaciones de ${h} metros de altura en ${ctx.loc}, el cable de tensión forma un ángulo de elevación de 30° con el suelo horizontal. Sabiendo que tan(30°) ≈ 0.577, ¿a qué distancia aproximada de la base de la torre se debe anclar el cable en el suelo?`,
                recurso_visual: generateSVG(`<polygon points="60,160 300,160 60,40" fill="none" stroke="%23e74c3c" stroke-width="3"/><text x="40" y="100" fill="%23111111" font-size="14">h = ${h}m</text><text x="180" y="180" fill="%23d4af37" font-size="14">d = ?</text><text x="240" y="150" fill="%232ecc71" font-size="12">30°</text>`),
                opciones: [
                    `A) ${dist} metros`,
                    `B) ${(h * 0.577).toFixed(1)} metros`,
                    `C) ${(h * 2).toFixed(1)} metros`,
                    `D) ${(h + 10).toFixed(1)} metros`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, la torre mide ${h} m y el ángulo es 30°. La distancia es la altura dividida entre tan(30°), no la altura por 0,577.`,
                frase: `${h} dividido entre 0,577 da cerca de ${dist} metros.`,
                repaso: 'Trigonometría',
                razones: {
                    [`${(h * 0.577).toFixed(1)} metros`]: 'Multiplica la altura por 0,577 en vez de dividir.',
                    [`${(h * 2).toFixed(1)} metros`]: 'Duplica la altura.',
                    [`${(h + 10).toFixed(1)} metros`]: 'Suma 10 metros a la altura.'
                }
            });
        } else if (sub === 'funciones') {
            const m = 2 + (i % 5);
            const b_val = 5 + (i % 10);
            const x_val = 4;
            const y_val = m * x_val + b_val;

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'funciones',
                texto: `El comportamiento de costos semanales f(x) en miles de pesos para ${ctx.entidad} sigue una función lineal f(x) = ${m}x + ${b_val}, donde x representa las unidades producidas. Si en una semana se producen ${x_val} unidades, ¿cuál es el costo total estimado?`,
                recurso_visual: null,
                opciones: [
                    `A) COP ${y_val}.000`,
                    `B) COP ${y_val + 10}.000`,
                    `C) COP ${m * x_val}.000`,
                    `D) COP ${b_val * x_val}.000`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc}, reemplaza x por ${x_val} en f(x) = ${m}x + ${b_val} y no olvides el término fijo.`,
                frase: `${m} por ${x_val}, más ${b_val}, es ${y_val}.`,
                repaso: 'Funciones',
                razones: {
                    [`COP ${y_val + 10}.000`]: 'Suma 10 miles que la fórmula no tiene.',
                    [`COP ${m * x_val}.000`]: 'Multiplica y olvida sumar el término fijo.',
                    [`COP ${b_val * x_val}.000`]: 'Multiplica el término fijo por x y deja fuera la pendiente.'
                }
            });
        } else {
            // probabilidad
            const bolillasRojas = 3 + (i % 5);
            const bolillasAzules = 7 + (i % 5);
            const totalBol = bolillasRojas + bolillasAzules;
            const probPct = Math.round((bolillasRojas / totalBol) * 100);

            item = {
                id: itemId,
                area: 'matematicas',
                sub: 'probabilidad',
                texto: `En una urna de control de calidad en ${ctx.loc} hay ${bolillasRojas} componentes defectuosos y ${bolillasAzules} componentes conformes. Si un inspector extrae un componente al azar, ¿cuál es la probabilidad porcentual aproximada de extraer un componente defectuoso?`,
                recurso_visual: null,
                opciones: [
                    `A) ${probPct}%`,
                    `B) ${100 - probPct}%`,
                    `C) ${probPct / 2}%`,
                    `D) 50%`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En ${ctx.loc} hay ${bolillasRojas} defectuosos y ${bolillasAzules} conformes. El porcentaje es los defectuosos sobre el total, no al revés.`,
                frase: `${bolillasRojas} de ${totalBol} es cerca de ${probPct}%.`,
                repaso: 'Probabilidad',
                razones: {
                    [`${100 - probPct}%`]: 'Cuenta los conformes, no los defectuosos.',
                    [`${probPct / 2}%`]: 'Parte el porcentaje a la mitad.',
                    '50%': 'Supone mitades iguales y la urna no está partida así.'
                }
            });
        }

        reactivos.push(item);
    }

    return reactivos;
}

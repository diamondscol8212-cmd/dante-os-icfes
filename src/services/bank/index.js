// 📦 src/services/bank/index.js - Consolidador Maestro General
import { reactivosMatematicas } from './matematicas.js';
import { reactivosLecturaCritica } from './lectura_critica.js';
import { reactivosCienciasNaturales } from './ciencias_naturales.js';
import { reactivosIngles } from './ingles.js';
import { reactivosSociales } from './sociales_ciudadanas.js';
import { reactivosApertura } from './bancoApertura.js';
export { balancearItem, balancearColeccion } from './balancer.js';
import { balancearColeccion } from './balancer.js';
import { ayudaDeSemilla } from './redactarAyudaSemilla.js';
import { embeberGraficaItem } from './embeberGraficas.js';

export const reactivosMultiExamen = [
    {
        id: "item_unal_img_01",
        area_general: "matematicas",
        target_exam: "UNAL_GENERAL",
        sub_competencia: "analisis_imagen",
        pregunta_texto: "Al aplicar una rotación tridimensional de 90° en el sentido de las agujas del reloj al patrón de referencia A, ¿cuál es la orientación resultante de la figura interna?",
        imagen_url: "/assets/unal/rotacion_01.svg",
        opciones_respuesta: ["A) La pirámide apunta hacia la izquierda con la esfera desplazada al centro", "B) La pirámide apunta hacia la derecha y la esfera queda centrada verticalmente", "C) La esfera se ubica en la cúspide de la pirámide invertida", "D) El polígono se desplaza a la esquina superior izquierda"],
        correcta: "B",
        a: 1.6,
        b: 0.4,
        c: 0.25,
        pista: "Gira la figura un cuarto de vuelta, como las manecillas, y mira hacia dónde queda la punta.",
        frase_acierto: "Ese cuarto de vuelta deja la punta hacia la derecha.",
        repaso: "Rotación de figuras",
        razonesPorTexto: {
            "La pirámide apunta hacia la izquierda con la esfera desplazada al centro": "Esa orientación sale si la vuelta es en el otro sentido.",
            "La esfera se ubica en la cúspide de la pirámide invertida": "Girar no invierte la pirámide ni sube la esfera a la punta.",
            "El polígono se desplaza a la esquina superior izquierda": "La pregunta pide la orientación de la figura, no un desplazamiento a una esquina."
        }
    },
    {
        id: "item_unal_img_02",
        area_general: "matematicas",
        target_exam: "UNAL_CARRERAS",
        carrera_objetivo: "INGENIERIA_SISTEMAS",
        sub_competencia: "analisis_imagen",
        pregunta_texto: "Observe el modelo bidimensional desplegado del sólido (dado). Al realizar el plegado tridimensional completo, determine cuál es la cara adyacente opuesta a la figura poligonal.",
        imagen_url: "/assets/unal/patron_02.svg",
        opciones_respuesta: ["A) La cara con el círculo morado de radio R", "B) La cara con la diagonal cyan de alto contraste", "C) La cara con el cuadrado verde centrado", "D) La cara con el rombo rojo en la base"],
        correcta: "A",
        a: 1.8,
        b: 0.8,
        c: 0.20,
        explicacion_detallada: "1. Identifica las caras opuestas en un desarrollo en cruz: las caras separadas por una cara intermedia quedan exactamente paralelas.\n2. Al plegar las 4 caras laterales alrededor del cuadrado base, la cara poligonal queda en oposición directa a la cara del círculo de radio R.",
        pista: "En un desarrollo, la cara de enfrente queda separada por una cara intermedia.",
        frase_acierto: "La cara de enfrente es la del círculo.",
        repaso: "Desarrollo de un sólido",
        razonesPorTexto: {
            "La cara con la diagonal cyan de alto contraste": "Esa cara queda al lado, no de frente.",
            "La cara con el cuadrado verde centrado": "Esa cara es la base del plegado, no la opuesta.",
            "La cara con el rombo rojo en la base": "El rombo no queda paralelo a la cara poligonal."
        }
    },
    {
        id: "item_unal_img_03",
        area_general: "matematicas",
        target_exam: "UNAL_GENERAL",
        sub_competencia: "analisis_imagen",
        pregunta_texto: "Al observar el plano ortogonal que combina una vista frontal cuadrada con diagonales cruzadas y una vista lateral triangular, la figura en perspectiva tridimensional corresponde a:",
        imagen_url: "/assets/unal/vistas_03.svg",
        opciones_respuesta: ["A) Pirámide recta de base cuadrada", "B) Prisma triangular apoyado en su cara oblicua", "C) Cono de revolución con truncamiento", "D) Tetraedro regular e irregular"],
        correcta: "A",
        a: 1.85,
        b: 0.65,
        c: 0.20,
        explicacion_detallada: "La proyección superior/frontal muestra la base cuadrada con las 4 aristas convergentes al vértice central. La vista de perfil confirma la elevación triangular isósceles de la pirámide.",
        pista: "Junta la vista de frente, con base cuadrada, y el perfil triangular.",
        frase_acierto: "Esas dos vistas corresponden a una pirámide de base cuadrada.",
        repaso: "Vistas de un sólido",
        razonesPorTexto: {
            "Prisma triangular apoyado en su cara oblicua": "Un prisma no cierra las aristas en un solo vértice.",
            "Cono de revolución con truncamiento": "El cono tiene base circular, no cuadrada.",
            "Tetraedro regular e irregular": "El tetraedro no muestra una base cuadrada de frente."
        }
    },
    {
        id: "item_unal_mat_01",
        area_general: "matematicas",
        target_exam: "UNAL_GENERAL",
        sub_competencia: "calculo_limites",
        pregunta_texto: "Evalúe el límite trigonométrico fundamental: $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}$",
        opciones_respuesta: ["A) 1/2", "B) 1", "C) 0", "D) Infinito"],
        correcta: "A",
        a: 1.9,
        b: 0.9,
        c: 0.15,
        explicacion_detallada: "Aplicando la Regla de L'Hôpital dos veces consecutivas: $\\lim_{x \\to 0} \\frac{\\sin x}{2x} = \\lim_{x \\to 0} \\frac{\\cos x}{2} = \\frac{1}{2}$.",
        pista: "Cuando el numerador y el denominador se acercan a cero, deriva las dos veces y vuelve a evaluar.",
        frase_acierto: "Después de derivar dos veces queda un medio.",
        repaso: "Límites trigonométricos",
        razonesPorTexto: {
            "1": "Eso saldría si solo se deriva una vez y se deja el seno sin evaluar.",
            "0": "El cero sería si el numerador se anulara más rápido de lo que dice este límite.",
            "Infinito": "El denominador también tiende a cero, así que no se dispara."
        }
    },
    {
        id: "item_docente_num_01",
        area_general: "matematicas",
        target_exam: "CONCURSO_DOCENTE",
        sub_competencia: "aptitud_numerica_docente",
        pregunta_texto: "Un rector asigna un presupuesto institucional distribuido en razón 3:5 entre infraestructura y material pedagógico. Si el monto asignado a material pedagógico excede al de infraestructura en 12.000.000 COP, ¿cuál es el presupuesto total asignado?",
        opciones_respuesta: ["A) 48.000.000 COP", "B) 60.000.000 COP", "C) 36.000.000 COP", "D) 72.000.000 COP"],
        correcta: "A",
        a: 1.4,
        b: -0.2,
        c: 0.25,
        pista: "La diferencia entre las dos partes de la razón es el excedente. Con eso sale el valor de una parte.",
        frase_acierto: "Dos partes valen el excedente, y el total son ocho partes.",
        repaso: "Razones",
        razonesPorTexto: {
            "60.000.000 COP": "Ese número toma el excedente como si fuera una sola parte.",
            "36.000.000 COP": "Eso es solo tres partes, el monto menor, no el total.",
            "72.000.000 COP": "Eso suma doce millones de más sobre el total."
        }
    },
    {
        id: "item_docente_ped_01",
        area_general: "lectura_critica",
        target_exam: "CONCURSO_DOCENTE",
        sub_competencia: "aptitud_pedagogica",
        pregunta_texto: "En una sesión formativa se detecta baja participación y desinterés hacia el pensamiento abstracto. Según el enfoque sociocultural de Vygotsky, ¿cuál es la estrategia pedagógica más adecuada del docente?",
        opciones_respuesta: ["A) Implementar andamiaje interactivo en la Zona de Desarrollo Próximo (ZDP) mediante trabajo colaborativo guiado", "B) Aplicar castigos punitivos escalonados para reforzar la disciplina en el aula", "C) Reemplazar la evaluación por actividades puramente memorísticas", "D) Suspender el currículo hasta que todos los estudiantes alcancen igual rendimiento"],
        correcta: "A",
        a: 1.7,
        b: 0.1,
        c: 0.20,
        pista: "El enfoque del enunciado pide la ayuda con la que el estudiante sí puede avanzar, no un castigo.",
        frase_acierto: "La ayuda guiada en esa zona es la estrategia que pide el caso.",
        repaso: "Enfoque sociocultural",
        razonesPorTexto: {
            "Aplicar castigos punitivos escalonados para reforzar la disciplina en el aula": "El castigo no es la ayuda con la que se avanza en lo abstracto.",
            "Reemplazar la evaluación por actividades puramente memorísticas": "Memorizar no responde al desinterés por lo abstracto.",
            "Suspender el currículo hasta que todos los estudiantes alcancen igual rendimiento": "Detener todo no es una estrategia de apoyo."
        }
    },
    {
        id: "item_saberpro_txt_01",
        area_general: "lectura_critica",
        target_exam: "SABER_PRO",
        sub_competencia: "analisis_textual",
        pregunta_texto: "En un ensayo académico sobre ética en inteligencia artificial, el autor sostiene que 'la automatización sin auditabilidad epistémica degrada el juicio profesional'. ¿Qué premisa fundamenta este argumento central?",
        opciones_respuesta: ["A) La ausencia de explicabilidad y auditoría limita la capacidad humana de juzgar y corregir sesgos algorítmicos", "B) La inteligencia artificial reemplazará por completo la conciencia humana en 5 años", "C) Los algoritmos son intrínsecamente infalibles frente al error humano", "D) La automatización prescinde de cualquier marco normativo o ético global"],
        correcta: "A",
        a: 1.5,
        b: 0.5,
        c: 0.25,
        pista: "Quédate con la premisa que explica por qué hace falta poder revisar lo que hace el sistema.",
        frase_acierto: "Sin poder revisar el sistema, no se puede corregir el juicio.",
        repaso: "Premisa de un argumento",
        razonesPorTexto: {
            "La inteligencia artificial reemplazará por completo la conciencia humana en 5 años": "El ensayo no habla de un plazo ni de reemplazar la conciencia.",
            "Los algoritmos son intrínsecamente infalibles frente al error humano": "Eso dice lo contrario: el texto habla de sesgos que hay que corregir.",
            "La automatización prescinde de cualquier marco normativo o ético global": "El texto pide auditoría, no prescindir de la norma."
        }
    }
];

const REPASO_DE_AREA = /^(inglés|ingles|lectura crítica|lectura critica|lectura|sociales y ciudadanas|sociales|matemáticas|matematicas|ciencias naturales|ciencias)$/i;
const REPASO_POR_HABILIDAD = {
    grammar_reading: 'La frase que el texto dice',
    vocabulary: 'La palabra en su contexto',
    reading_comprehension: 'Lo que el texto responde',
    literal_reading: 'Lo que está escrito',
    inferential_reading: 'Lo que se concluye del texto',
    pensamiento_social: 'La postura y su evidencia',
    interpretacion_y_analisis: 'La lectura de la fuente',
    combinatoria: 'Contar sin repetir'
};

function repasoConcreto(item) {
    const repaso = String(item.repaso || '').trim();
    if (repaso && !REPASO_DE_AREA.test(repaso)) return repaso;
    const habilidad = String(item.sub_competencia || item.sub || '').toLowerCase();
    return REPASO_POR_HABILIDAD[habilidad] || repaso;
}

export const BANCO_COMPLETO = balancearColeccion([
    ...reactivosMatematicas,
    ...reactivosLecturaCritica,
    ...reactivosCienciasNaturales,
    ...reactivosIngles,
    ...reactivosSociales,
    ...reactivosApertura,
    ...reactivosMultiExamen
].map(item => ({
    ...item,
    id: item.id,
    target_exam: String(item.target_exam || 'SABER_11').toUpperCase().trim(),
    carrera_objetivo: item.carrera_objetivo ? String(item.carrera_objetivo).toUpperCase().trim() : null,
    sub_competencia: String(item.sub_competencia || item.sub || 'general').toLowerCase().trim(),
    sub: String(item.sub_competencia || item.sub || 'general').toLowerCase().trim(),
    imagen_url: item.imagen_url || null,
    recurso_visual: item.recurso_visual || null,
    area_general: String(item.area || item.area_general).toLowerCase().trim(),
    area: String(item.area || item.area_general).toLowerCase().trim(),
    pregunta_texto: item.pregunta_texto || item.texto,
    texto: item.pregunta_texto || item.texto,
    opciones_respuesta: Array.isArray(item.opciones_respuesta) ? item.opciones_respuesta : (Array.isArray(item.opciones) ? item.opciones : [item.opciones]),
    opciones: Array.isArray(item.opciones_respuesta) ? item.opciones_respuesta : (Array.isArray(item.opciones) ? item.opciones : [item.opciones]),
    correcta: item.correcta || item.ok,
    ok: item.correcta || item.ok,
    a: item.a || item.parametro_a_discriminacion || 1.2,
    b: item.b || item.parametro_b_dificultad || 0.0,
    c: item.c || item.parametro_c_adivinacion || 0.25,
    // Fase 3: etiqueta de fuente (la selección usa pool anti-plantilla).
    fuente: String(item.id || '').includes('_gen_') ? 'gen' : 'escrito',
    calibracion_status: String(item.id || '').includes('_gen_') ? 'piloto' : 'semilla'
})).map((item) => {
    const conAyuda = (item.pista || item.razonesPorTexto) ? item : (() => {
        const ayuda = ayudaDeSemilla(item);
        if (!ayuda) return item;
        return {
            ...item,
            pista: ayuda.pista,
            frase_acierto: ayuda.frase,
            repaso: ayuda.repaso,
            razonesPorTexto: ayuda.razones
        };
    })();
    return embeberGraficaItem({ ...conAyuda, repaso: repasoConcreto(conAyuda) });
}));

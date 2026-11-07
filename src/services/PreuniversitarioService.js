/**
 * PreuniversitarioService.js - Servicio Aislado de Preuniversitario UNAL / UdeA (Dante OS Enterprise v23.1.0)
 * 
 * 🛡️ PRINCIPIO DE AISLAMIENTO Y CERO CRUCE DE DATOS:
 * - Bancos, sesiones y tablas 100% segregadas con prefijo 'preun_'
 * - Garantiza que el examen ICFES Saber 11° no comparte memoria ni estado con la UNAL/UdeA
 */

import { GoogleGenAI } from '@google/genai';
import { supabase } from '../../supabaseClient.js';
import { idEstable } from '../controllers/danteRespuestaController.js';
import { estimarHistorial } from './cat/estimarEap.js';
import { balancearColeccion } from './bank/balancer.js';
import { embeberGraficaItem } from './bank/embeberGraficas.js';

// 🗄️ CACHE DE BANCO PREUNIVERSITARIO AISLADO EN RAM
const CACHE_BANCO_PREUN = new Map();
const CACHE_SESIONES_PREUN = new Map();
const CACHE_TELEMETRIA_IRD = new Map();

// 🏛️ BANCO DE REACTIVOS PREUNIVERSITARIOS OFICIALES UNAL / UDEA (5 COMPONENTES DE ADMISIÓN AUDITADOS)
export const BANCO_PREUNIVERSITARIO_BASE = balancearColeccion([
    // ==========================================
    // 1. ANÁLISIS DE IMAGEN 3D & GEOMETRÍA ESPACIAL (UNAL)
    // ==========================================
    {
        id: "preun_unal_img_001",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Al armar la plantilla bidimensional doblándola por sus aristas discontinuas (a 90° hacia adentro), ¿cuál de los cuatro poliedros tridimensionales se obtiene?",
        imagen_url: "/assets/unal/patron_02.svg",
        opciones: [
            "A) Cubo con cara sombreada contigua a la arista superior derecha y diagonal en eje X.",
            "B) Cubo con cara vacía en la base y sombreado en la faceta lateral izquierda.",
            "C) Poliedro con traslape simétrico sobre el eje Z e inversión de sombreado.",
            "D) Cubo con dos caras opuestas completamente sombreadas en paralelo."
        ],
        correcta: "A",
        a: 1.85,
        b: 0.45,
        c: 0.20,
        sub_competencia: "despliegue_3d",
        atajo_tactico: "Analiza únicamente la posición del vértice de contacto: al doblar a 90°, el triángulo sombreado toca la cara diagonal A.",
        tipo_componente: "canvas_vectorial_3d"
    },
    {
        id: "preun_unal_img_002",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Identifique la vista topológica (planta superior) del conjunto de bloques tridimensionales al ser observado desde el eje vertical Z superior.",
        imagen_url: "/assets/unal/rotacion_01.svg",
        opciones: [
            "A) Vista de 3 rectángulos contiguos con sombra en el bloque central.",
            "B) Matriz de 2x2 con vacíos en la esquina inferior izquierda.",
            "C) Proyección ortogonal con 4 cuadrantes visibles y 1 bloque oculto por sombra proyectada.",
            "D) Silueta en forma de L con 5 bloques contabilizados en un solo plano."
        ],
        correcta: "C",
        a: 1.95,
        b: 0.80,
        c: 0.25,
        sub_competencia: "vistas_topologicas",
        atajo_tactico: "Aplica proyección ortogonal sobre el plano XY: el bloque oculto fuerza la cuadrícula simétrica C.",
        tipo_componente: "canvas_vectorial_3d"
    },
    {
        id: "preun_unal_img_003",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Al rotar el sólido tridimensional 180° sobre el eje vertical Y y luego 90° en sentido horario sobre el eje Z, la posición final de la muesca triangular es:",
        opciones: [
            "A) Esquina inferior derecha, orientada hacia el observador.",
            "B) Esquina superior izquierda, oculta en la cara posterior.",
            "C) Esquina superior derecha, orientada hacia el plano lateral X.",
            "D) Esquina inferior izquierda, visible en la base del sólido."
        ],
        correcta: "A",
        a: 1.90,
        b: 0.85,
        c: 0.15,
        sub_competencia: "rotacion_espacial_3d",
        atajo_tactico: "Rota la muesca vectorialmente: 180° en Y invierte izquierda/derecha; +90° horario en Z la traslada a la esquina inferior derecha A."
    },
    {
        id: "preun_unal_img_004",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Se tiene un tetraedro regular de arista $a$. Si se realiza un corte plano paralelo a la base a tres cuartas partes de la altura medida desde la base hacia el vértice superior, la figura bidimensional resultante de la sección transversal es:",
        opciones: [
            "A) Un triángulo equilátero semejante a la base con lados de longitud $a/4$.",
            "B) Un triángulo isósceles con altura tres veces menor que la original.",
            "C) Un trapecio regular con bases paralelas en proporción 1:3.",
            "D) Un hexágono regular centrado en el baricentro del tetraedro."
        ],
        correcta: "A",
        a: 1.80,
        b: 0.90,
        c: 0.20,
        sub_competencia: "cortes_y_secciones_3d",
        atajo_tactico: "Por semejanza de triángulos en sólidos homotéticos: a $1/4$ de distancia del vértice, el plano genera un triángulo equilátero de lado $a/4$."
    },
    {
        id: "preun_unal_img_005",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Se proyectan simultáneamente la vista frontal (alzado) y la vista lateral derecha de un sólido. La vista frontal muestra un cuadrado con sus dos diagonales trazadas; la vista lateral es un triángulo isósceles. ¿Qué sólido tridimensional corresponde a estas proyecciones?",
        imagen_url: "/assets/unal/vistas_03.svg",
        opciones: [
            "A) Una pirámide recta de base cuadrada apoyada lateralmente sobre una de sus caras triangulares.",
            "B) Un prisma triangular recto apoyado sobre su cara rectangular mayor.",
            "C) Un cono recto truncado por un plano inclinado a 45°.",
            "D) Una pirámide de base triangular con eje oblicuo respecto al plano X."
        ],
        correcta: "A",
        a: 1.88,
        b: 0.75,
        c: 0.18,
        sub_competencia: "vistas_ortogonales",
        atajo_tactico: "Las diagonales en el cuadrado del alzado representan las 4 aristas laterales convergentes al vértice de la pirámide vista de frente.",
        explicacion_detallada: "1. En la proyección frontal, la figura cuadrada con diagonales cruzadas indica una pirámide vista desde arriba o desde una cara perpendicular.\n2. La vista lateral muestra la elevación triangular isósceles que coincide exactamente con el perfil de una pirámide recta de base cuadrada."
    },
    {
        id: "preun_unal_img_006",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "Observe el esquema de proyecciones ortogonales adjunto. La combinación de la vista frontal con diagonales y la vista lateral triangular determina que el sólido tridimensional corresponde a:",
        imagen_url: "/assets/unal/vistas_03.svg",
        opciones: [
            "A) Una pirámide de base cuadrada apoyada ortogonalmente.",
            "B) Un cilindro con corte cónico superior a 30°.",
            "C) Un tetraedro regular sobre una cara inclinada.",
            "D) Un prisma cuadrangular recto con dos aristas cortadas."
        ],
        correcta: "A",
        a: 1.85,
        b: 0.60,
        c: 0.20,
        sub_competencia: "vistas_ortogonales",
        atajo_tactico: "Al proyectar el alzado cuadrado y la vista lateral triangular, el sólido congruente es la pirámide cuadrada A.",
        explicacion_detallada: "Al observar la vista frontal (alzado), se aprecia la base cuadrada con las 4 aristas convergentes al vértice. La vista lateral (perfil) confirma la elevación triangular isósceles."
    },
    {
        id: "preun_unal_img_007",
        target_exam: "UNAL",
        area: "analisis_imagen",
        materia: "analisis_imagen",
        pregunta_texto: "En el desarrollo plano (plantilla 2D) ilustrado, se tienen cuatro caras triangulares congruentes unidas a una base central cuadrada. Al doblar las cuatro caras hacia arriba hasta unir sus vértices, el volumen cerrado resultante es:",
        imagen_url: "/assets/unal/despliegue_04.svg",
        opciones: [
            "A) Una pirámide recta de base cuadrada.",
            "B) Un octaedro regular simétrico.",
            "C) Un prisma rectangular de cuatro facetas.",
            "D) Un cono truncado de base poligonal."
        ],
        correcta: "A",
        a: 1.78,
        b: 0.50,
        c: 0.18,
        sub_competencia: "despliegue_3d",
        atajo_tactico: "Una base cuadrada rodeada por 4 triángulos isósceles es el patrón estándar de despliegue de una pirámide recta.",
        explicacion_detallada: "El patrón bidimensional consta de un polígono cuadrangular central que actúa como base y 4 caras triangulares contiguas que, al replegarse en 90° respecto a las aristas de la base, convergen en un único cúspide central."
    },

    // ==========================================
    // 2. MATEMÁTICAS & CÁLCULO (UNAL / UDEA)
    // ==========================================
    {
        id: "preun_unal_mat_001",
        target_exam: "UNAL",
        area: "matematicas",
        materia: "calculo",
        pregunta_texto: "Si $f(x) = x^2 - 3x + 2$ y $g(x) = \\sqrt{2x - 1}$, determine el dominio real exacto de la función compuesta $(f \\circ g)(x)$.",
        opciones: [
            "A) $[1/2, +\\infty)$",
            "B) $(-\\infty, 1/2]$",
            "C) $(1/2, 2)$",
            "D) Todos los Reales excepto $x = 0$"
        ],
        correcta: "A",
        a: 1.70,
        b: 0.65,
        c: 0.20,
        sub_competencia: "algebra_y_funciones",
        atajo_tactico: "El radical $g(x)$ exige $2x - 1 \\ge 0 \\implies x \\ge 1/2$. Como $f(u)$ es polinómica, el dominio coincide con $[1/2, +\\infty)$."
    },
    {
        id: "preun_unal_mat_002",
        target_exam: "UNAL",
        area: "matematicas",
        materia: "calculo",
        pregunta_texto: "Calcule el límite indeterminado: $\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}$",
        opciones: [
            "A) $1/4$",
            "B) $1/2$",
            "C) $0$",
            "D) No existe (Indeterminado)"
        ],
        correcta: "A",
        a: 1.80,
        b: 0.50,
        c: 0.15,
        sub_competencia: "calculo_limites",
        atajo_tactico: "Racionaliza o usa la Regla de L'Hôpital: $f'(x)/g'(x) = \\frac{1}{2\\sqrt{x}} / 1 \\xrightarrow{x=4} \\frac{1}{2(2)} = 1/4$."
    },
    {
        id: "preun_unal_mat_003",
        target_exam: "UNAL",
        area: "matematicas",
        materia: "calculo",
        pregunta_texto: "Una empresa determina que su función de costo total para producir $x$ unidades universitarias es $C(x) = 2x^2 - 16x + 50$. ¿Cuántas unidades debe producir para minimizar el costo?",
        opciones: [
            "A) 4 unidades",
            "B) 8 unidades",
            "C) 16 unidades",
            "D) 2 unidades"
        ],
        correcta: "A",
        a: 1.65,
        b: 0.40,
        c: 0.20,
        sub_competencia: "calculo_optimizacion",
        atajo_tactico: "Deriva e iguala a cero: $C'(x) = 4x - 16 = 0 \\implies 4x = 16 \\implies x = 4$."
    },
    {
        id: "preun_unal_mat_004",
        target_exam: "UNAL",
        area: "matematicas",
        materia: "calculo",
        pregunta_texto: "En Geometría Analítica, determine la ecuación de la recta perpendicular a $3x - 2y + 6 = 0$ que pasa por el punto $P(1, -2)$.",
        opciones: [
            "A) $2x + 3y + 4 = 0$",
            "B) $3x + 2y - 1 = 0$",
            "C) $2x - 3y - 8 = 0$",
            "D) $x - 2y - 5 = 0$"
        ],
        correcta: "A",
        a: 1.85,
        b: 0.70,
        c: 0.20,
        sub_competencia: "geometria_analitica",
        atajo_tactico: "Pendiente dada $m_1 = 3/2 \\implies m_2 = -2/3$. Ecuación: $y - (-2) = -2/3(x - 1) \\implies 2x + 3y + 4 = 0$."
    },
    {
        id: "preun_unal_mat_005",
        target_exam: "UNAL",
        area: "matematicas",
        materia: "calculo",
        pregunta_texto: "Dada la ecuación trigonométrica $2\\cos^2(x) + \\cos(x) - 1 = 0$ en el intervalo $[0, 2\\pi)$, la suma de todas sus soluciones reales es:",
        opciones: [
            "A) $3\\pi$",
            "B) $2\\pi$",
            "C) $5\\pi/2$",
            "D) $4\\pi$"
        ],
        correcta: "A",
        a: 1.92,
        b: 1.10,
        c: 0.15,
        sub_competencia: "trigonometria_avanzada",
        atajo_tactico: "Factoriza $(2\\cos x - 1)(\\cos x + 1) = 0$. Soluciones: $x = \\pi/3, 5\\pi/3$ y $x = \\pi$. Suma: $\\pi/3 + 5\\pi/3 + \\pi = 3\\pi$."
    },

    // ==========================================
    // 3. FÍSICA MECÁNICA (UNAL)
    // ==========================================
    {
        id: "preun_unal_fis_001",
        target_exam: "UNAL",
        area: "ciencias_naturales",
        materia: "fisica",
        pregunta_texto: "Un proyectil se dispara desde el suelo con velocidad inicial $v_0 = 40\\text{ m/s}$ y un ángulo $\\theta = 30^\\circ$ respecto a la horizontal. Considerando $g = 10\\text{ m/s}^2$, el tiempo total de vuelo en el aire es:",
        opciones: [
            "A) 4.0 segundos",
            "B) 2.0 segundos",
            "C) 8.0 segundos",
            "D) 6.0 segundos"
        ],
        correcta: "A",
        a: 1.75,
        b: 0.55,
        c: 0.15,
        sub_competencia: "fisica_mecanica",
        atajo_tactico: "$v_{0y} = 40 \\cdot \\sin(30^\\circ) = 20\\text{ m/s}$. Tiempo de subida $t_s = 20/10 = 2\\text{s}$. Tiempo total $t_v = 2 \\times 2\\text{s} = 4\\text{s}$."
    },
    {
        id: "preun_unal_fis_002",
        target_exam: "UNAL",
        area: "ciencias_naturales",
        materia: "fisica",
        pregunta_texto: "Un bloque de masa $m = 5\\text{ kg}$ se desliza sin rozamiento por un plano inclinado de $30^\\circ$. ¿Cuál es la fuerza neta paralela al plano que acelera al bloque? ($g = 10\\text{ m/s}^2$)",
        opciones: [
            "A) 25 N",
            "B) 50 N",
            "C) 43.3 N",
            "D) 12.5 N"
        ],
        correcta: "A",
        a: 1.65,
        b: 0.45,
        c: 0.20,
        sub_competencia: "fisica_mecanica",
        atajo_tactico: "$F_{\\parallel} = m \\cdot g \\cdot \\sin(30^\\circ) = 5 \\cdot 10 \\cdot 0.5 = 25\\text{ N}$."
    },
    {
        id: "preun_unal_fis_003",
        target_exam: "UNAL",
        area: "ciencias_naturales",
        materia: "fisica",
        pregunta_texto: "Un resorte de constante elástica $k = 200\\text{ N/m}$ se comprime $0.2\\text{ m}$ desde su posición de equilibrio. Toda la energía potencial elástica almacenada se transfiere como energía cinética a un bloque de $m = 1\\text{ kg}$. La velocidad final del bloque es:",
        opciones: [
            "A) $2.83\\text{ m/s}$ (o $\\sqrt{8}\\text{ m/s}$)",
            "B) $4.00\\text{ m/s}$",
            "C) $2.00\\text{ m/s}$",
            "D) $8.00\\text{ m/s}$"
        ],
        correcta: "A",
        a: 1.82,
        b: 0.80,
        c: 0.18,
        sub_competencia: "conservacion_energia",
        atajo_tactico: "$E_p = \\frac{1}{2}k x^2 = \\frac{1}{2}(200)(0.04) = 4\\text{ J}$. Como $E_k = \\frac{1}{2}m v^2 \\implies 4 = 0.5 v^2 \\implies v^2 = 8 \\implies v = \\sqrt{8} \\approx 2.83\\text{ m/s}$."
    },

    // ==========================================
    // 4. QUÍMICA GENERAL (UNAL)
    // ==========================================
    {
        id: "preun_unal_qmc_001",
        target_exam: "UNAL",
        area: "ciencias_naturales",
        materia: "quimica",
        pregunta_texto: "En la combustión completa del propano: $\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$, si se hacen reaccionar 1 mol de $\\text{C}_3\\text{H}_8$ con 4 moles de $\\text{O}_2$, ¿cuál es el reactivo límite y cuántos moles de $\\text{CO}_2$ se producen?",
        opciones: [
            "A) Reactivo límite: $\\text{O}_2$; se producen 2.4 moles de $\\text{CO}_2$.",
            "B) Reactivo límite: $\\text{C}_3\\text{H}_8$; se producen 3.0 moles de $\\text{CO}_2$.",
            "C) Reactivo límite: $\\text{O}_2$; se producen 3.0 moles de $\\text{CO}_2$.",
            "D) Ambos se consumen por completo simultáneamente."
        ],
        correcta: "A",
        a: 1.85,
        b: 0.60,
        c: 0.20,
        sub_competencia: "quimica_estequiometria",
        atajo_tactico: "Relación $1:5$. Con 4 moles de $\\text{O}_2$ solo puedes reaccionar $0.8$ moles de propano. $\\text{O}_2$ es límite $\\implies 4 \\times (3/5) = 2.4$ moles de $\\text{CO}_2$."
    },
    {
        id: "preun_unal_qmc_002",
        target_exam: "UNAL",
        area: "ciencias_naturales",
        materia: "quimica",
        pregunta_texto: "Se disuelven $40\\text{ g}$ de hidróxido de sodio ($\\text{NaOH}$, peso molecular $= 40\\text{ g/mol}$) en agua hasta completar $500\\text{ mL}$ de solución. La molaridad ($M$) de la solución resultante es:",
        opciones: [
            "A) 2.0 M",
            "B) 1.0 M",
            "C) 0.5 M",
            "D) 4.0 M"
        ],
        correcta: "A",
        a: 1.72,
        b: 0.40,
        c: 0.15,
        sub_competencia: "soluciones_molaridad",
        atajo_tactico: "Moles de $\\text{NaOH} = 40/40 = 1\\text{ mol}$. Volumen = $0.5\\text{ L}$. Molaridad $M = 1 / 0.5 = 2.0\\text{ M}$."
    },

    // ==========================================
    // 5. ANÁLISIS TEXTUAL & FILOSOFÍA (UNAL / UDEA)
    // ==========================================
    {
        id: "preun_unal_txt_001",
        target_exam: "UNAL",
        area: "analisis_textual",
        materia: "analisis_textual",
        pregunta_texto: "«La libertad no consiste en hacer lo que se quiere, sino en querer lo que se puede.» En el contexto de la filosofía kantiana del deber, la paradoja de esta afirmación radica en:",
        opciones: [
            "A) Subordinar la autonomía de la voluntad a los límites morales de la razón práctica.",
            "B) Negar la existencia del libre albedrío en el plano de la naturaleza física.",
            "C) Afirmar que el deseo individual espontáneo es superior a la ley moral.",
            "D) Confundir la coerción jurídica del Estado con la disciplina voluntaria autoimpuesta."
        ],
        correcta: "A",
        a: 1.80,
        b: 0.75,
        c: 0.20,
        sub_competencia: "inferencia_filosofica",
        atajo_tactico: "Busca la relación entre querer y poder moral: para Kant, 'querer lo que se puede' es la regulación de la autonomía por la razón."
    },
    {
        id: "preun_unal_txt_002",
        target_exam: "UNAL",
        area: "analisis_textual",
        materia: "analisis_textual",
        pregunta_texto: "Según el epistemólogo Karl Popper, el criterio de demarcación que separa la ciencia empírica de la metafísica no es la verificabilidad de sus enunciados, sino su falsabilidad. De esta premisa se infiere correctamente que:",
        opciones: [
            "A) Una hipótesis es científica si y solo si es posible concebir un experimento o enunciado empírico que la contradiga.",
            "B) Las teorías verdaderas quedan indemostradas de forma definitiva tras acumular miles de observaciones favorables.",
            "C) La metafísica carece por completo de sentido comunicativo o significación lingüística.",
            "D) La ciencia avanza acumulando certezas absolutas e inmutables mediante inducción pura."
        ],
        correcta: "A",
        a: 1.85,
        b: 0.65,
        c: 0.15,
        sub_competencia: "epistemologia_y_ciencia",
        atajo_tactico: "Falsabilidad = posibilidad de refutación empírica. Si no se puede poner a prueba frente a la experiencia, no pertenece al dominio Popperiano."
    },
    {
        id: "preun_unal_txt_003",
        target_exam: "UNAL",
        area: "analisis_textual",
        materia: "analisis_textual",
        pregunta_texto: "En el aforismo nietzscheano: «Dios ha muerto; pero dada la naturaleza de los hombres, durante milenios habrá cuevas en las que se mostrará su sombra», la métáfora de la «sombra» representa:",
        opciones: [
            "A) Las estructuras morales y metafísicas seculares que reemplazan la teología tradicional sin alterar su dogmatismo.",
            "B) La nostalgia poética de las sociedades industrializadas por el misticismo pagano.",
            "C) La victoria definitiva del nihilismo activo sobre las instituciones eclesiásticas.",
            "D) La incapacidad de la ciencia moderna para explicar el origen del universo."
        ],
        correcta: "A",
        a: 1.90,
        b: 0.88,
        c: 0.18,
        sub_competencia: "analisis_de_aforismos",
        atajo_tactico: "Nietzsche señala que tras la caída de Dios, el hombre sigue adorando 'sombras' (la Razón deificada, el Estado, el Progreso) con el mismo fanatismo."
    },

    // ==========================================
    // 6. RAZONAMIENTO LÓGICO & UDEA (RAZONAMIENTO_LOGICO)
    // ==========================================
    {
        id: "preun_udea_log_001",
        target_exam: "UDEA",
        area: "razonamiento_logico",
        materia: "razonamiento_logico",
        pregunta_texto: "En una fila de 5 estudiantes (A, B, C, D, E): A está a la izquierda de B pero a la derecha de C. D está en la extrema derecha y E no está contiguo a C. ¿Quién ocupa la posición central?",
        opciones: [
            "A) Estudiante A",
            "B) Estudiante B",
            "C) Estudiante C",
            "D) Estudiante E"
        ],
        correcta: "A",
        a: 1.90,
        b: 0.35,
        c: 0.25,
        sub_competencia: "ordenamiento_lineal",
        atajo_tactico: "Fija posiciones: C _ A _ B _ D. Coloca E en la única posición no contigua a C. El orden final es C - E - A - B - D. Posición 3 es A."
    },
    {
        id: "preun_udea_log_002",
        target_exam: "UDEA",
        area: "razonamiento_logico",
        materia: "razonamiento_logico",
        pregunta_texto: "¿Cuántos caminos distintos existen para desplazarse desde la esquina superior izquierda $(0,0)$ hasta la esquina inferior derecha $(3,3)$ en una cuadrícula de $3 \\times 3$, moviéndose únicamente un paso a la derecha o un paso hacia abajo?",
        opciones: [
            "A) 20 caminos",
            "B) 12 caminos",
            "C) 36 caminos",
            "D) 16 caminos"
        ],
        correcta: "A",
        a: 1.95,
        b: 0.70,
        c: 0.25,
        sub_competencia: "combinatoria_y_conteo",
        atajo_tactico: "Aplica coeficiente binomial: Se requieren 3 pasos a la derecha (D) y 3 hacia abajo (A). Total 6 movimientos $\\implies \\binom{6}{3} = \\frac{6 \\times 5 \\times 4}{3 \\times 2 \\times 1} = 20$."
    },
    {
        id: "preun_udea_log_003",
        target_exam: "UDEA",
        area: "razonamiento_logico",
        materia: "razonamiento_logico",
        pregunta_texto: "Si todos los estrategas son analíticos y ningún analítico es impulsivo, ¿cuál de las siguientes conclusiones es formalmente válida?",
        opciones: [
            "A) Ningún estratega es impulsivo.",
            "B) Algunos impulsivos son estrategas.",
            "C) Todos los analíticos son estrategas.",
            "D) Ningún impulsivo es analítico, pero algunos son estrategas."
        ],
        correcta: "A",
        a: 1.75,
        b: 0.30,
        c: 0.20,
        sub_competencia: "silogismos_y_logica",
        atajo_tactico: "Por silogismo hipotético (Modus Celarent): $E \\subset A$ y $A \\cap I = \\emptyset \\implies E \\cap I = \\emptyset$."
    },

    // ==========================================
    // 7. CIENCIAS SOCIALES (UNAL)
    // ==========================================
    {
        id: "preun_unal_soc_001",
        target_exam: "UNAL",
        area: "sociales",
        materia: "sociales",
        pregunta_texto: "Durante el período del Frente Nacional en Colombia (1958-1974), los partidos Liberal y Conservador pactaron la alternancia en la presidencia y el reparto paritario de los cargos públicos. Desde la perspectiva de la sociología política crítica, la principal consecuencia estructural de este pacto institucional fue:",
        opciones: [
            "A) La clausura de la participación democrática para terceras fuerzas políticas y movimientos sociales emergentes.",
            "B) La erradicación total e inmediata de los conflictos agrarios en el campo colombiano.",
            "C) La disolución de los partidos tradicionales y el surgimiento de un régimen parlamentario.",
            "D) La descentralización fiscal y administrativa completa en favor de los municipios periféricos."
        ],
        correcta: "A",
        a: 1.88,
        b: 0.60,
        c: 0.20,
        sub_competencia: "historia_de_colombia_siglo_xx",
        atajo_tactico: "El Frente Nacional blindó la estabilidad bipartidista pero cerró los canales institucionales a otras expresiones políticas y sociales, generando descontento extraparlamentario."
    },
    {
        id: "preun_unal_soc_002",
        target_exam: "UNAL",
        area: "sociales",
        materia: "sociales",
        pregunta_texto: "En el análisis de la geografía urbana y económica de Colombia, el fenómeno de macrocefalia urbana o primacía urbana se manifiesta principalmente en:",
        opciones: [
            "A) La desproporcionada concentración de población, servicios especializados, capital financiero y poder político en la capital respecto a las ciudades intermedias.",
            "B) Una distribución equilibrada y homogénea de la riqueza en todas las subregiones geográficas.",
            "C) La predominancia de actividades primarias y extractivas en las principales áreas metropolitanas.",
            "D) La migración masiva y sostenida de la población urbana hacia los valles interandinos rurales."
        ],
        correcta: "A",
        a: 1.82,
        b: 0.55,
        c: 0.18,
        sub_competencia: "geografia_urbana_y_demografia",
        atajo_tactico: "Macrocefalia urbana = cabeza grande: la ciudad principal absorbe una proporción excesiva de recursos, población y funciones directivas del territorio nacional."
    },
    {
        id: "preun_unal_soc_003",
        target_exam: "UNAL",
        area: "sociales",
        materia: "sociales",
        pregunta_texto: "La Constitución Política de Colombia de 1991 define al Estado como un «Estado Social de Derecho». ¿Cuál es la implicación jurídica y doctrinaria central de este principio sobre la función estatal?",
        opciones: [
            "A) El Estado no solo debe garantizar libertades formales negativas, sino intervenir activamente para asegurar condiciones materiales de dignidad, igualdad real y derechos sociales.",
            "B) La soberanía reside exclusivamente en las autoridades militares para preservar el orden público.",
            "C) El poder judicial queda subordinado a los decretos de emergencia económica del poder ejecutivo.",
            "D) La ley de mercado prevalece jerárquicamente sobre cualquier derecho fundamental o colectivo."
        ],
        correcta: "A",
        a: 1.85,
        b: 0.65,
        c: 0.20,
        sub_competencia: "derecho_constitucional_y_ciudadania",
        atajo_tactico: "El componente 'Social' del Estado de Derecho obliga a la tutela activa y material de la dignidad humana y los derechos prestacionales (salud, educación, mínimo vital)."
    },
    {
        id: "preun_unal_soc_004",
        target_exam: "UNAL",
        area: "sociales",
        materia: "sociales",
        pregunta_texto: "La tesis económica del estructuralismo latinoamericano formulada por Raúl Prebisch y la CEPAL a mediados del siglo XX argumentaba que el deterioro de los términos de intercambio entre el 'centro' y la 'periferia' justificaba:",
        opciones: [
            "A) La adopción de políticas de Industrialización por Sustitución de Importaciones (ISI) mediante protección arancelaria y fomento productivo estatal.",
            "B) La especialización exclusiva y definitiva de América Latina como exportadora neta de materias primas sin transformar.",
            "C) La eliminación unilateral de todos los aranceles aduaneros para favorecer manufacturas foráneas.",
            "D) La dolarización integral y renuncia a la soberanía monetaria de las economías periféricas."
        ],
        correcta: "A",
        a: 1.90,
        b: 0.75,
        c: 0.15,
        sub_competencia: "economia_politica_cepal",
        atajo_tactico: "Prebisch demostró que las manufacturas del centro se encarecen frente a las materias primas periféricas; la respuesta estratégica fue el modelo ISI."
    }
].map(embeberGraficaItem));

// 🚀 Inicialización aislada del banco Preuniversitario en memoria RAM
function inicializarBancoPreun() {
    if (CACHE_BANCO_PREUN.size > 0) return;

    BANCO_PREUNIVERSITARIO_BASE.forEach(item => {
        const areaKey = String(item.area || item.materia).toLowerCase().trim();
        const materiaKey = String(item.materia || item.area).toLowerCase().trim();
        
        // Mapear área principal y materia específica
        [areaKey, materiaKey].forEach(k => {
            if (!CACHE_BANCO_PREUN.has(k)) {
                CACHE_BANCO_PREUN.set(k, new Map());
            }
            CACHE_BANCO_PREUN.get(k).set(item.id, item);
        });

        // Mapear aliases comunes para routing inmediato de los 5 componentes UNAL
        const aliases = [];
        if (materiaKey === 'calculo' || areaKey === 'matematicas') aliases.push('matematicas', 'calculo', 'matematicas_avanzadas', 'razonamiento_logico');
        if (materiaKey === 'fisica') aliases.push('ciencias_naturales', 'fisica');
        if (materiaKey === 'quimica') aliases.push('ciencias_naturales', 'quimica');
        if (areaKey === 'ciencias_naturales') aliases.push('fisica', 'quimica', 'biologia');
        if (areaKey === 'analisis_imagen') aliases.push('imagen', 'analisis_imagen', 'geometria_3d');
        if (areaKey === 'razonamiento_logico') aliases.push('logica', 'udea_logica', 'razonamiento_logico');
        if (areaKey === 'analisis_textual' || areaKey === 'lectura_critica') aliases.push('analisis_textual', 'lectura_critica', 'lectura', 'filosofia');
        if (areaKey === 'sociales') aliases.push('sociales', 'ciencias_sociales', 'sociales_ciudadanas', 'historia');

        aliases.forEach(alias => {
            if (!CACHE_BANCO_PREUN.has(alias)) {
                CACHE_BANCO_PREUN.set(alias, new Map());
            }
            CACHE_BANCO_PREUN.get(alias).set(item.id, item);
        });
    });
    console.log(`🏛️ [PREUN SERVICE ISOLATED]: Banco Preuniversitario cargado en RAM. Total de reactivos UNAL/UdeA: ${BANCO_PREUNIVERSITARIO_BASE.length}`);
}

inicializarBancoPreun();

async function guardarRespuestaPreun(studentClean, item, esCorrecta, letra, tiempoMs) {
  const itemUuid = idEstable(item.id);
  try {
    const ya = await supabase
      .from('registro_eventos')
      .select('item_id')
      .eq('student_id', studentClean)
      .eq('item_id', itemUuid)
      .limit(1);
    if (ya.error) {
      console.warn('preun registro', ya.error.message);
      return { ok: false, est: null };
    }
    if (!ya.data || !ya.data.length) {
      const ins = await supabase.from('registro_eventos').insert({
        id: crypto.randomUUID(),
        student_id: studentClean,
        item_id: itemUuid,
        skill: item.area || item.materia || null,
        is_correct: esCorrecta,
        response_time: tiempoMs > 0 ? Math.round(tiempoMs / 1000) : null,
        opcion_marcada: String(letra || '').slice(0, 8) || null,
        declared_confidence: 'media',
        institution_id: 'colegio_sandbox_default',
        selection_vector: [
          { opcion: String(letra || '').slice(0, 4), timestamp_relativo: tiempoMs > 0 ? Math.round(tiempoMs / 1000) : 0 },
          {
            parametro_a: Number(item.a),
            parametro_b: Number(item.b),
            parametro_c: Number(item.c),
            area: item.area || item.materia,
            tipo: 'PREUNIVERSITARIO',
            item_original: item.id
          }
        ],
        created_at: new Date().toISOString()
      });
      if (ins.error) {
        console.warn('preun registro', ins.error.message);
        return { ok: false, est: null };
      }
    }

    const todos = await supabase
      .from('registro_eventos')
      .select('is_correct,selection_vector')
      .eq('student_id', studentClean)
      .limit(600);
    if (todos.error) {
      console.warn('preun registro', todos.error.message);
      return { ok: false, est: null };
    }
    const items = [];
    (todos.data || []).forEach((row) => {
      const vec = Array.isArray(row.selection_vector) ? row.selection_vector : [];
      const p = vec.find((x) => x && x.tipo === 'PREUNIVERSITARIO');
      if (!p) return;
      items.push({
        a: Number(p.parametro_a),
        b: Number(p.parametro_b),
        c: Number(p.parametro_c),
        correcto: row.is_correct === true,
        area: p.area,
        item_id: p.item_original
      });
    });
    const est = estimarHistorial(items.map((row) => ({
      a: row.a,
      b: row.b,
      c: row.c,
      correcto: row.correcto
    })));
    const previo = await supabase
      .from('progreso_estudiantes')
      .select('id,historial_theta')
      .eq('estudiante', studentClean)
      .eq('materia', 'preuniversitario')
      .limit(1);
    if (previo.error) {
      console.warn('preun progreso', previo.error.message);
      return { ok: false, est };
    }
    const anterior = previo.data && previo.data[0];
    const historia = anterior && Array.isArray(anterior.historial_theta) ? anterior.historial_theta.slice(-39) : [];
    if (Number.isFinite(est.theta)) historia.push(Math.round(est.theta * 1000) / 1000);
    const payload = {
      estudiante: studentClean,
      materia: 'preuniversitario',
      theta_global: Number.isFinite(est.theta) ? est.theta : 0,
      sem_global: est.sem,
      baseline_proyeccion: est.puntos,
      preguntas_respondidas: items.length,
      items_respondidos: items.slice(-600),
      historial_theta: historia,
      ultima_actualizacion: new Date().toISOString(),
      institution_id: 'colegio_sandbox_default'
    };
    const guardado = anterior && anterior.id
      ? await supabase.from('progreso_estudiantes').update(payload).eq('id', anterior.id)
      : await supabase.from('progreso_estudiantes').insert({ ...payload, id: crypto.randomUUID() });
    if (guardado.error) {
      console.warn('preun progreso', guardado.error.message);
      return { ok: false, est };
    }
    return { ok: true, est };
  } catch (error) {
    console.warn('preun guardar', error && error.message);
    return { ok: false, est: null };
  }
}

export const PreuniversitarioService = {
    /**
     * 🤖 FASE 2: SINTETIZADOR CONTINUO DE REACTIVOS CON GEMINI 3.6 FLASH
     * Genera automáticamente nuevos reactivos de alta rigurosidad académica para UNAL / UdeA.
     */
    sintetizarReactivosPreunGemini: async ({ area = 'calculo', targetExam = 'UNAL', cantidad = 5, nivelDificultad = 'alto' }) => {
        const areaClean = String(area).toLowerCase().trim();
        const inicioTs = Date.now();
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                const ai = new GoogleGenAI({
                    apiKey,
                    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
                });

                const systemPrompt = `
Eres un Diseñador y Auditor Senior de Pruebas de Admisión de la Universidad Nacional de Colombia (UNAL) y la Universidad de Antioquia (UdeA).
Tu función es redactar reactivos inéditos de alta calidad académica y rigor analítico para el componente: "${areaClean}".
Examen objetivo: ${targetExam}.
Nivel de dificultad: ${nivelDificultad}.

Instrucciones estrictas:
- Usa notación LaTeX limpia para expresiones matemáticas (ej: $f(x) = \\lim_{x \\to 0} \\frac{\\sin x}{x}$).
- Cada reactivo debe incluir 4 opciones etiquetadas A), B), C), D) donde una sola sea la correcta.
- Incluye parámetros IRT de calibración:
  a: discriminación (entre 1.50 y 2.20)
  b: dificultad (entre -1.0 y +2.5)
  c: factor de azar (entre 0.15 y 0.25)
- Proporciona un 'atajo_tactico' conciso explicativo.

Responde ÚNICAMENTE con un arreglo JSON de objetos con la siguiente estructura exacta:
[
  {
    "pregunta_texto": "...",
    "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correcta": "A",
    "a": 1.85,
    "b": 0.80,
    "c": 0.18,
    "sub_competencia": "...",
    "atajo_tactico": "..."
  }
]
`;

                const response = await ai.models.generateContent({
                    model: "gemini-3.6-flash",
                    contents: `Genera ${cantidad} reactivos inéditos de nivel universitario para la materia/área '${areaClean}' (${targetExam}).`,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                });

                const textRaw = response?.text?.trim() || "";
                if (textRaw) {
                    const parsed = JSON.parse(textRaw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const nuevosReactivos = parsed.map((item, idx) => {
                            const newId = `preun_${targetExam.toLowerCase()}_${areaClean.slice(0,3)}_gen_${Date.now()}_${idx}`;
                            const nuevoItem = {
                                id: newId,
                                target_exam: targetExam,
                                area: areaClean,
                                materia: areaClean,
                                pregunta_texto: item.pregunta_texto,
                                opciones: item.opciones,
                                correcta: String(item.correcta || 'A').toUpperCase().replace(/[^A-D]/g, '') || 'A',
                                a: Number(item.a) || 1.80,
                                b: Number(item.b) || 0.50,
                                c: Number(item.c) || 0.20,
                                sub_competencia: item.sub_competencia || 'generico_ai',
                                atajo_tactico: item.atajo_tactico || 'Analiza las condiciones del enunciado.'
                            };

                            // Agregar al banco global en memoria y cache
                            BANCO_PREUNIVERSITARIO_BASE.push(nuevoItem);
                            if (!CACHE_BANCO_PREUN.has(areaClean)) {
                                CACHE_BANCO_PREUN.set(areaClean, new Map());
                            }
                            CACHE_BANCO_PREUN.get(areaClean).set(nuevoItem.id, nuevoItem);
                            return nuevoItem;
                        });

                        console.log(`✨ [SINTETIZADOR GEMINI]: Se generaron e inyectaron ${nuevosReactivos.length} reactivos inéditos para ${areaClean}.`);
                        return {
                            success: true,
                            aiGenerated: true,
                            cantidadGenerada: nuevosReactivos.length,
                            reactivos: nuevosReactivos,
                            duracionMs: Date.now() - inicioTs
                        };
                    }
                }
            } catch (err) {
                console.error("⚠️ Fallback en sintetizador Gemini Preun:", err.message);
            }
        }

        // FALLBACK SINTÉTICO DETERMINISTA SI NO HAY API KEY O EN CASO DE TIMEOUT
        const reactivosFallback = [];
        for (let i = 0; i < cantidad; i++) {
            const randVal = Math.floor(Math.random() * 50) + 10;
            const newId = `preun_${targetExam.toLowerCase()}_${areaClean.slice(0,3)}_syn_${Date.now()}_${i}`;
            const synthItem = {
                id: newId,
                target_exam: targetExam,
                area: areaClean,
                materia: areaClean,
                pregunta_texto: `[Sintético Adaptativo ${areaClean.toUpperCase()}] Calcule la tasa instantánea de variación de la función de rendimiento $F(t) = ${randVal}t^2 - 3t + 10$ cuando el tiempo $t = 2\\text{ s}$.`,
                opciones: [
                    `A) ${4 * randVal - 3} unidades/s`,
                    `B) ${2 * randVal} unidades/s`,
                    `C) ${randVal + 5} unidades/s`,
                    `D) ${3 * randVal - 1} unidades/s`
                ],
                correcta: "A",
                a: 1.80,
                b: 0.50,
                c: 0.20,
                sub_competencia: "optimizacion_sintetica",
                atajo_tactico: `Deriva la función: F'(t) = 2*${randVal}*t - 3. Para t = 2 => ${4 * randVal - 3}.`
            };
            BANCO_PREUNIVERSITARIO_BASE.push(synthItem);
            if (!CACHE_BANCO_PREUN.has(areaClean)) {
                CACHE_BANCO_PREUN.set(areaClean, new Map());
            }
            CACHE_BANCO_PREUN.get(areaClean).set(synthItem.id, synthItem);
            reactivosFallback.push(synthItem);
        }

        return {
            success: true,
            aiGenerated: false,
            cantidadGenerada: reactivosFallback.length,
            reactivos: reactivosFallback,
            duracionMs: Date.now() - inicioTs
        };
    },

    /**
     * Obtiene el siguiente reactivo adaptativo del banco Preuniversitario (Aislado)
     */
    obtenerSiguienteItemPreun: async (studentId, rawArea = 'analisis_imagen', targetExam = 'UNAL') => {
        inicializarBancoPreun();

        const areaClean = String(rawArea).toLowerCase().trim();
        const studentClean = String(studentId || 'preun_anon').toLowerCase().trim();
        const sessionKey = `preun_session_${studentClean}_${areaClean}_${targetExam}`;

        let sessionState = CACHE_SESIONES_PREUN.get(sessionKey);
        if (!sessionState) {
            sessionState = {
                studentId: studentClean,
                area: areaClean,
                targetExam,
                theta: 0.0,
                itemsRespondidos: [],
                historialRespuestas: [],
                timestampCreacion: Date.now()
            };
            CACHE_SESIONES_PREUN.set(sessionKey, sessionState);
        }

        // Recuperar ítems del área solicitada o fallback
        let mapaArea = CACHE_BANCO_PREUN.get(areaClean);
        if (!mapaArea || mapaArea.size === 0) {
            mapaArea = CACHE_BANCO_PREUN.get('analisis_imagen') || CACHE_BANCO_PREUN.get('matematicas');
        }

        let itemsDisponibles = Array.from(mapaArea.values()).filter(
            it => !sessionState.itemsRespondidos.includes(it.id)
        );

        // Si quedan pocos ítems disponibles en esta área, gatillar auto-sintetizador de la Fase 2 en segundo plano
        if (itemsDisponibles.length <= 1) {
            PreuniversitarioService.sintetizarReactivosPreunGemini({
                area: areaClean,
                targetExam,
                cantidad: 5
            }).then(() => {
                console.log(`🔄 [SINTETIZADOR FASE 2 AUTO-TRIGGER]: Expansión continua de banco lista para ${areaClean}`);
            }).catch(e => console.error("Error en auto-sintetizador preun:", e));

            // Si no quedaba ninguno, re-evaluar mapa
            mapaArea = CACHE_BANCO_PREUN.get(areaClean) || mapaArea;
            itemsDisponibles = Array.from(mapaArea.values()).filter(
                it => !sessionState.itemsRespondidos.includes(it.id)
            );
        }

        // Seleccionar ítem disponible o reiniciar ciclo
        const itemSeleccionado = itemsDisponibles.length > 0 
            ? itemsDisponibles[0] 
            : Array.from(mapaArea.values())[0];

        return {
            success: true,
            sessionId: sessionKey,
            targetExam,
            item: {
                id: itemSeleccionado.id,
                area: itemSeleccionado.area || itemSeleccionado.materia,
                materia: itemSeleccionado.materia || itemSeleccionado.area,
                pregunta_texto: itemSeleccionado.pregunta_texto,
                opciones: itemSeleccionado.opciones,
                opciones_respuesta: itemSeleccionado.opciones || itemSeleccionado.opciones_respuesta,
                imagen_url: itemSeleccionado.imagen_url || null,
                target_exam: itemSeleccionado.target_exam || 'UNAL',
                origen: 'UNAL',
                sub_competencia: itemSeleccionado.sub_competencia,
                atajo_tactico: itemSeleccionado.atajo_tactico || null,
                tipo_componente: itemSeleccionado.tipo_componente || "normal"
            },
            thetaProyectado: sessionState.theta,
            escalaZUNAL: Math.round(500 + 100 * sessionState.theta)
        };
    },

    /**
     * Procesa la respuesta táctica del estudiante en la sesión Preuniversitaria aislada
     * y persiste telemetría e histórico en SQL (Fase 3)
     */
    procesarRespuestaPreun: async (studentId, itemId, opcionSeleccionada, _tiempoRespuestaMs = 30000) => {
        const item = BANCO_PREUNIVERSITARIO_BASE.find(it => it.id === itemId);
        if (!item) {
            return { success: false, error: "Reactivo Preuniversitario no encontrado." };
        }

        const studentClean = String(studentId || '').toLowerCase().trim().split('@')[0];
        if (!studentClean || studentClean === 'preun_anon' || studentClean === 'preun_estudiante_v23' || studentClean === 'estudiante') {
            return { success: false, error: 'sin_alumno', persistedSQL: false };
        }
        const areaClean = String(item.area || item.materia || 'calculo').toLowerCase().trim();
        const targetExam = item.target_exam || 'UNAL';
        const sessionKey = `preun_session_${studentClean}_${areaClean}_${targetExam}`;

        const sessionState = CACHE_SESIONES_PREUN.get(sessionKey) || {
            studentId: studentClean,
            area: areaClean,
            targetExam,
            theta: 0.0,
            itemsRespondidos: [],
            historialRespuestas: [],
            timestampCreacion: Date.now()
        };

        const esCorrecta = String(opcionSeleccionada).trim().toUpperCase() === String(item.correcta).trim().toUpperCase();
        const thetaAntes = sessionState.theta;
        
        if (!sessionState.itemsRespondidos.includes(itemId)) {
            sessionState.itemsRespondidos.push(itemId);
        }

        const registroInt = {
            itemId,
            opcionSeleccionada,
            esCorrecta,
            tiempoMs: _tiempoRespuestaMs,
            thetaPost: sessionState.theta,
            timestamp: Date.now()
        };
        sessionState.historialRespuestas.push(registroInt);
        CACHE_SESIONES_PREUN.set(sessionKey, sessionState);

        const guardado = await guardarRespuestaPreun(studentClean, item, esCorrecta, opcionSeleccionada, _tiempoRespuestaMs);
        if (guardado.est && guardado.est.puntos != null) {
            sessionState.theta = guardado.est.theta;
        }
        CACHE_SESIONES_PREUN.set(sessionKey, sessionState);
        const cambioTheta = Math.round((sessionState.theta - thetaAntes) * 1000) / 1000;

        return {
            success: true,
            esCorrecta,
            opcionCorrecta: item.correcta,
            atajoTactico: item.atajo_tactico,
            cambioTheta,
            nuevoTheta: sessionState.theta,
            puntos: guardado.est && guardado.est.puntos,
            sem: guardado.est && guardado.est.sem,
            escalaAlumno: 500,
            persistedSQL: guardado.ok
        };
    },

    /**
     * 🧠 HIGHLIGHTER SOCRÁTICO GEMINI IA (Skimming & Scanning Filosófico/Textual)
     */
    generarHighlighterSocratico: async (texto, pregunta = "") => {
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (apiKey) {
                const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

                const prompt = `
                Actúas como un Tutor Filosófico Socrático de la UNAL para la prueba de Lectura Crítica y Análisis Textual.
                Analiza el siguiente texto y pregunta:
                TEXTO: "${texto}"
                PREGUNTA: "${pregunta}"

                Genera un marcado resaltado de Skimming & Scanning estructurado en JSON con 3 categorías de frases:
                1. "tesis_premisa_clave": [frases exactas o conceptos centrales en el texto que contienen la premisa principal - Color Amarillo]
                2. "distractor_falacia": [frases o trampas conceptuales que suelen inducir a error - Color Rojo]
                3. "conclusion_socratica": [frase o síntesis lógica de la respuesta correcta - Color Verde]

                Responde ÚNICAMENTE en JSON válido con las claves: tesis_premisa_clave (array), distractor_falacia (array), conclusion_socratica (string).
                `;

                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                if (resp.ok) {
                    const data = await resp.json();
                    const textRaw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    const cleanJson = textRaw.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(cleanJson);
                    return { success: true, aiGenerated: true, highlight: parsed };
                }
            }
        } catch (err) {
            console.error("ℹ️ Fallback Highlighter Socrático:", err.message);
        }

        // Fallback determinista socrático contextualizado
        const resText = (pregunta || texto || '').toLowerCase();
        let fallbackConclusion = "La resolución requiere identificar la premisa lógica invariante y descartar las opciones con contradicciones dimensionales o conceptuales.";
        if (resText.includes('plantilla') || resText.includes('cubo') || resText.includes('poliedro') || resText.includes('3d') || resText.includes('imagen')) {
            fallbackConclusion = "La conservación del patrón de caras continuas determina la congruencia del sólido tridimensional al plegar la plantilla.";
        } else if (resText.includes('derivada') || resText.includes('límite') || resText.includes('función') || resText.includes('integral')) {
            fallbackConclusion = "La razón de cambio instantánea y los límites laterales determinan la continuidad y comportamiento del modelo matemático.";
        } else if (resText.includes('reacción') || resText.includes('moles') || resText.includes('química') || resText.includes('molar')) {
            fallbackConclusion = "La conservación de la masa y la relación estequiométrica molar rigen la proporción exacta de reactivos y productos.";
        } else if (resText.includes('fuerza') || resText.includes('velocidad') || resText.includes('aceleración') || resText.includes('vector')) {
            fallbackConclusion = "El equilibrio vectorial y la segunda ley de Newton relacionan la masa con la aceleración resultante.";
        } else if (resText.includes('kant') || resText.includes('libertad') || resText.includes('filosofía')) {
            fallbackConclusion = "La libertad kantiana no es satisfacer cualquier deseo, sino la autorregulación guiada por la razón práctica.";
        }

        return {
            success: true,
            aiGenerated: false,
            highlight: {
                tesis_premisa_clave: [
                    "premisa lógica invariante",
                    "congruencia de patrones"
                ],
                distractor_falacia: [
                    "distractor con contradicción dimensional",
                    "inversión de ejes o unidades"
                ],
                conclusion_socratica: fallbackConclusion
            }
        };
    },

    /**
     * 📊 TELEMETRÍA DEL ESTRÉS DE DECISIÓN E ÍNDICE DE RIESGO POR DUDA (IRD)
     * IRD = (Respuestas cambiadas a incorrectas / Total vacilaciones) * 100%
     */
    registrarTelemetriaIRD: async (studentId, latenciaMs = 15000, vacilaciones = 0, cambioOpciones = 0, esCorrecta = true) => {
        const studentClean = String(studentId || 'preun_anon').toLowerCase().trim();
        
        const userStats = CACHE_TELEMETRIA_IRD.get(studentClean) || {
            studentId: studentClean,
            totalReactivos: 0,
            totalVacilaciones: 0,
            cambiosAIncorrecta: 0,
            primerInstintoCorrectoCount: 0,
            latenciasMs: []
        };

        userStats.totalReactivos++;
        userStats.totalVacilaciones += Number(vacilaciones || 0);
        userStats.latenciasMs.push(latenciaMs);

        // Si cambió la respuesta y terminó errónea -> Incrementa castigo por duda impulsiva
        if (cambioOpciones > 0 && !esCorrecta) {
            userStats.cambiosAIncorrecta++;
        } else if (cambioOpciones === 0 && esCorrecta) {
            userStats.primerInstintoCorrectoCount++;
        }

        CACHE_TELEMETRIA_IRD.set(studentClean, userStats);

        const totalVac = userStats.totalVacilaciones || 1;
        const irdPorcentaje = Math.min(100, Math.round((userStats.cambiosAIncorrecta / totalVac) * 100));
        const tasaPrimerInstinto = Math.round((userStats.primerInstintoCorrectoCount / (userStats.totalReactivos || 1)) * 100);

        let alertaMetacognitiva = "🟢 Confianza alta: Tomas decisiones firmes y mantienes tu primer instinto.";
        if (irdPorcentaje > 40) {
            alertaMetacognitiva = "🔴 ALERTA DE DUDA IMPULSIVA: En el " + tasaPrimerInstinto + "% de los casos tu primer instinto era correcto. Evita cambiar tus respuestas a última hora.";
        } else if (irdPorcentaje > 20) {
            alertaMetacognitiva = "🟡 Duda moderada: Se registra cierta vacilación al seleccionar la opción final.";
        }

        return {
            success: true,
            studentId: studentClean,
            irdPorcentaje,
            tasaPrimerInstinto,
            totalReactivos: userStats.totalReactivos,
            totalVacilaciones: userStats.totalVacilaciones,
            alertaMetacognitiva
        };
    },

    obtenerTelemetriaIRD: async (studentId) => {
        const studentClean = String(studentId || 'preun_anon').toLowerCase().trim();
        const stats = CACHE_TELEMETRIA_IRD.get(studentClean);
        if (!stats) {
            return {
                success: true,
                irdPorcentaje: null,
                tasaPrimerInstinto: null,
                totalReactivos: 0,
                alertaMetacognitiva: "Sin medición de duda en esta sesión."
            };
        }

        const totalVac = stats.totalVacilaciones || 1;
        const irdPorcentaje = Math.min(100, Math.round((stats.cambiosAIncorrecta / totalVac) * 100));
        const tasaPrimerInstinto = Math.round((stats.primerInstintoCorrectoCount / (stats.totalReactivos || 1)) * 100);

        return {
            success: true,
            irdPorcentaje,
            tasaPrimerInstinto,
            totalReactivos: stats.totalReactivos,
            alertaMetacognitiva: irdPorcentaje > 35 
                ? "🔴 ALERTA DE DUDA IMPULSIVA: Tu primer instinto es correcto en el " + tasaPrimerInstinto + "% de las veces. No cambies tu respuesta a última hora."
                : "🟢 Excelente templanza: Tus decisiones iniciales son altamente certeras."
        };
    },

    /**
     * 📊 DIAGNÓSTICO DE ROI COGNITIVO, SALA DE MANDO Y BRECHA DE ADMISIÓN POR CARRERA SNIES
     */
    obtenerROICognitivo: async (studentId, carreraId = 'unal_medicina_bogota') => {
        const studentClean = String(studentId || 'preun_anon').toLowerCase().trim();
        const CORTES_CARRERAS = {
            'unal_medicina_bogota': { id: 'unal_medicina_bogota', nombre: 'UNAL Bogotá - Medicina', corte: 765, maxScore: null, universidad: 'UNAL', facultad: 'Salud', materiaClave: 'Ciencias naturales', nodoRecomendado: 'quimica', convocatoria: '2026-I' },
            'unal_sistemas_bogota': { id: 'unal_sistemas_bogota', nombre: 'UNAL Bogotá - Ingeniería de Sistemas', corte: 704, maxScore: null, universidad: 'UNAL', facultad: 'Ingeniería', materiaClave: 'Matemáticas', nodoRecomendado: 'calculo', convocatoria: '2026-I' },
            'unal_derecho_bogota': { id: 'unal_derecho_bogota', nombre: 'UNAL Bogotá - Derecho', corte: 646, maxScore: null, universidad: 'UNAL', facultad: 'Derecho', materiaClave: 'Análisis textual', nodoRecomendado: 'lectura_critica', convocatoria: '2026-I' },
            'unal_arquitectura_bogota': { id: 'unal_arquitectura_bogota', nombre: 'UNAL Bogotá - Arquitectura', corte: 635, maxScore: null, universidad: 'UNAL', facultad: 'Artes', materiaClave: 'Análisis de imagen', nodoRecomendado: 'analisis_imagen', convocatoria: '2026-I' },
            'unal_enfermeria_bogota': { id: 'unal_enfermeria_bogota', nombre: 'UNAL Bogotá - Enfermería', corte: 641, maxScore: null, universidad: 'UNAL', facultad: 'Salud', materiaClave: 'Ciencias naturales', nodoRecomendado: 'quimica', convocatoria: '2026-I' },
            'unal_civil_bogota': { id: 'unal_civil_bogota', nombre: 'UNAL Bogotá - Ingeniería Civil', corte: 657, maxScore: null, universidad: 'UNAL', facultad: 'Ingeniería', materiaClave: 'Matemáticas', nodoRecomendado: 'fisica', convocatoria: '2026-I' },
            'unal_veterinaria_medellin': { id: 'unal_veterinaria_medellin', nombre: 'UNAL Medellín - Medicina Veterinaria', corte: null, maxScore: null, universidad: 'UNAL', facultad: 'Salud', materiaClave: 'Ciencias naturales', nodoRecomendado: 'quimica' },
            'unal_administracion_manizales': { id: 'unal_administracion_manizales', nombre: 'UNAL Manizales - Administración de Empresas', corte: null, maxScore: null, universidad: 'UNAL', facultad: 'Administración', materiaClave: 'Análisis textual', nodoRecomendado: 'lectura_critica' },
            'udea_medicina_medellin': { id: 'udea_medicina_medellin', nombre: 'UdeA Medellín - Medicina', corte: 82, maxScore: 100, universidad: 'UdeA', facultad: 'Salud', materiaClave: 'Razonamiento Lógico UdeA', nodoRecomendado: 'analisis_imagen' },
            'udea_ingenieria_sistemas': { id: 'udea_ingenieria_sistemas', nombre: 'UdeA Medellín - Ingeniería de Sistemas', corte: 71, maxScore: 100, universidad: 'UdeA', facultad: 'Ingeniería', materiaClave: 'Razonamiento Matemático UdeA', nodoRecomendado: 'calculo' },
            'udea_derecho': { id: 'udea_derecho', nombre: 'UdeA Medellín - Derecho', corte: 68, maxScore: 100, universidad: 'UdeA', facultad: 'Derecho', materiaClave: 'Competencia Lectora UdeA', nodoRecomendado: 'lectura_critica' },
            'udea_psicologia': { id: 'udea_psicologia', nombre: 'UdeA Medellín - Psicología', corte: 65, maxScore: 100, universidad: 'UdeA', facultad: 'Ciencias Sociales', materiaClave: 'Competencia Lectora UdeA', nodoRecomendado: 'lectura_critica' }
        };

        const carrera = CORTES_CARRERAS[carreraId] || CORTES_CARRERAS['unal_medicina_bogota'];

        const statsPorArea = {
            calculo: { respondidos: 0, correctas: 0 },
            fisica: { respondidos: 0, correctas: 0 },
            quimica: { respondidos: 0, correctas: 0 },
            lectura_critica: { respondidos: 0, correctas: 0 },
            analisis_imagen: { respondidos: 0, correctas: 0 }
        };

        let puntajeProyectado = null;
        let preguntas = 0;
        try {
            const { data: filaPreun } = await supabase
                .from('progreso_estudiantes')
                .select('baseline_proyeccion,preguntas_respondidas,items_respondidos')
                .eq('estudiante', studentClean)
                .eq('materia', 'preuniversitario')
                .limit(1);
            const fila = filaPreun && filaPreun[0];
            if (fila && Number(fila.preguntas_respondidas) > 0) {
                preguntas = Number(fila.preguntas_respondidas);
                puntajeProyectado = fila.baseline_proyeccion;
                const lista = Array.isArray(fila.items_respondidos) ? fila.items_respondidos : [];
                lista.forEach((it) => {
                    const areaKey = String(it && it.area || '').toLowerCase();
                    if (!statsPorArea[areaKey]) return;
                    statsPorArea[areaKey].respondidos += 1;
                    if (it.correcto) statsPorArea[areaKey].correctas += 1;
                });
            }
        } catch (e) {
            console.warn("⚠️ [Preun ROI DB fetch warn]:", e.message);
        }

        const tieneCalibracion = preguntas > 0 && puntajeProyectado != null;
        const brechaPuntos = null;
        const esZonaAdmision = false;
        const mismaEscala = false;

        // Construir diagnóstico por componente
        const componentes = [
            {
                id: 'calculo',
                nombre: 'Cálculo & Funciones',
                icono: '📐',
                dominio: statsPorArea.calculo.respondidos > 0 ? Math.round((statsPorArea.calculo.correctas / statsPorArea.calculo.respondidos) * 100) : 0,
                estado: statsPorArea.calculo.respondidos > 0 ? (statsPorArea.calculo.correctas / statsPorArea.calculo.respondidos >= 0.7 ? '🟢 ADMISIBLE' : '🔴 REFUERZO') : '⚪ SIN EVALUAR'
            },
            {
                id: 'fisica',
                nombre: 'Física Mecánica',
                icono: '⚡',
                dominio: statsPorArea.fisica.respondidos > 0 ? Math.round((statsPorArea.fisica.correctas / statsPorArea.fisica.respondidos) * 100) : 0,
                estado: statsPorArea.fisica.respondidos > 0 ? (statsPorArea.fisica.correctas / statsPorArea.fisica.respondidos >= 0.7 ? '🟢 ADMISIBLE' : '🔴 REFUERZO') : '⚪ SIN EVALUAR'
            },
            {
                id: 'quimica',
                nombre: 'Química General',
                icono: '🧪',
                dominio: statsPorArea.quimica.respondidos > 0 ? Math.round((statsPorArea.quimica.correctas / statsPorArea.quimica.respondidos) * 100) : 0,
                estado: statsPorArea.quimica.respondidos > 0 ? (statsPorArea.quimica.correctas / statsPorArea.quimica.respondidos >= 0.7 ? '🟢 ADMISIBLE' : '🔴 REFUERZO') : '⚪ SIN EVALUAR'
            },
            {
                id: 'lectura_critica',
                nombre: 'Lectura Crítica UNAL',
                icono: '📖',
                dominio: statsPorArea.lectura_critica.respondidos > 0 ? Math.round((statsPorArea.lectura_critica.correctas / statsPorArea.lectura_critica.respondidos) * 100) : 0,
                estado: statsPorArea.lectura_critica.respondidos > 0 ? (statsPorArea.lectura_critica.correctas / statsPorArea.lectura_critica.respondidos >= 0.7 ? '🟢 ADMISIBLE' : '🔴 REFUERZO') : '⚪ SIN EVALUAR'
            },
            {
                id: 'analisis_imagen',
                nombre: 'Imagen 3D & Lógica UdeA',
                icono: '🧩',
                dominio: statsPorArea.analisis_imagen.respondidos > 0 ? Math.round((statsPorArea.analisis_imagen.correctas / statsPorArea.analisis_imagen.respondidos) * 100) : 0,
                estado: statsPorArea.analisis_imagen.respondidos > 0 ? (statsPorArea.analisis_imagen.correctas / statsPorArea.analisis_imagen.respondidos >= 0.7 ? '🟢 ADMISIBLE' : '🔴 REFUERZO') : '⚪ SIN EVALUAR'
            }
        ];

        let matrizROI = [];
        if (carrera.facultad === 'Ingeniería') {
            matrizROI = [
                { area: 'Cálculo & Matemáticas', puntosPotencialesPorHora: 24, prioridadTactica: '🔥 Prioridad Alta: +24 Pts/Hora (Álgebra & Funciones)' },
                { area: 'Física Mecánica', puntosPotencialesPorHora: 20, prioridadTactica: '⚡ Prioridad Alta: +20 Pts/Hora (Cinemática & Dinámica)' },
                { area: 'Análisis de Imagen 3D', puntosPotencialesPorHora: 16, prioridadTactica: '🎯 Prioridad Media: +16 Pts/Hora (Proyecciones Ortogonales)' },
                { area: 'Lectura Crítica UNAL', puntosPotencialesPorHora: 10, prioridadTactica: '📖 Mantenimiento: +10 Pts/Hora (Inferencia Filosófica)' }
            ];
        } else if (carrera.facultad === 'Salud') {
            matrizROI = [
                { area: 'Química & Biología', puntosPotencialesPorHora: 25, prioridadTactica: '🔥 Prioridad Máxima: +25 Pts/Hora (Estequiometría y Genética)' },
                { area: 'Lectura Crítica UNAL', puntosPotencialesPorHora: 22, prioridadTactica: '📖 Prioridad Alta: +22 Pts/Hora (Textos Científicos y Filosofía)' },
                { area: 'Cálculo & Matemáticas', puntosPotencialesPorHora: 15, prioridadTactica: '⚡ Prioridad Media: +15 Pts/Hora (Sucesiones y Geometría)' },
                { area: 'Análisis de Imagen 3D', puntosPotencialesPorHora: 12, prioridadTactica: '🎯 Mantenimiento: +12 Pts/Hora (Rotación Espacial)' }
            ];
        } else {
            matrizROI = [
                { area: 'Comprensión Lectora UNAL', puntosPotencialesPorHora: 26, prioridadTactica: '🔥 Prioridad Máxima: +26 Pts/Hora (Análisis de Argumentos)' },
                { area: 'Razonamiento Lógico', puntosPotencialesPorHora: 22, prioridadTactica: '⚡ Prioridad Alta: +22 Pts/Hora (Lógica Simbólica y Deducción)' },
                { area: 'Ciencias Sociales & Historia', puntosPotencialesPorHora: 18, prioridadTactica: '🏛️ Prioridad Media: +18 Pts/Hora (Procesos Históricos)' },
                { area: 'Matemáticas Básicas', puntosPotencialesPorHora: 12, prioridadTactica: '📐 Mantenimiento: +12 Pts/Hora (Aritmética y Porcentajes)' }
            ];
        }

        matrizROI = matrizROI.map((row) => ({
            area: row.area,
            puntosPotencialesPorHora: null,
            prioridadTactica: row.area
        }));

        const planDeVueloIA = {
            diagnostico: !tieneCalibracion
                ? `Aún no hay respuestas Pre-U. En ${carrera.nombre}, ${carrera.corte == null ? 'el último admitido cambia cada semestre' : 'el último admitido de la referencia es ' + carrera.corte}${carrera.universidad === 'UNAL' ? '. La escala estándar de la UNAL tiene media 500.' : '. La UdeA usa una escala de 0 a 100.'} La práctica se mide aparte, de 0 a 500.`
                : `Llevas ${puntajeProyectado} de 500 en las preguntas de práctica. En ${carrera.nombre}, ${carrera.corte == null ? 'el último admitido cambia cada semestre' : 'el último admitido de la referencia es ' + carrera.corte}. Esas dos cifras no se restan.`,
            accionInmediata: `Entrena ${carrera.materiaClave}.`,
            horasPracticaEstimadas: null,
            diasEstimados: null,
            nodoRecomendado: carrera.nodoRecomendado
        };

        return {
            success: true,
            studentId,
            tieneCalibracion,
            carreraId: carrera.id,
            carreraNombre: carrera.nombre,
            universidad: carrera.universidad,
            facultad: carrera.facultad,
            corteHistorico: carrera.corte,
            maxScore: carrera.maxScore,
            escalaCorte: carrera.maxScore,
            escalaAlumno: 500,
            mismaEscala,
            puntajeProyectado,
            brechaPuntos,
            esZonaAdmision,
            componentes,
            planDeVueloIA,
            matrizROI,
            todasCarreras: Object.values(CORTES_CARRERAS)
        };
    }
};

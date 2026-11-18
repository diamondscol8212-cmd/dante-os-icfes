/**
 * Genera scripts/contenidoTemasRefuerzo.mjs con cartillas de CONTENIDO REAL
 * (hechos/conceptos), no guías de “cómo responder el examen”.
 * Uso: node scripts/buildContenidoTemasRefuerzo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { terminosDe } from './terminosTemasRefuerzo.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {
  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };
}

function pack(intro, pasos, errores, ejemplo, practica, profundizar, meta) {
  meta = meta || {};
  return {
    intro,
    pasos,
    errores,
    ejemplo,
    practica,
    profundizar,
    terminos: Array.isArray(meta.terminos) ? meta.terminos : [],
    diagrama_svg: meta.diagrama_svg || ''
  };
}

const C = {};

C.hidrografia_colombia = pack(
  'Si la pregunta nombra el Cauca, Magdalena, Llanos u Orinoco, ubica el río en el mapa mental de cuencas: Magdalena nace en el macizo y desemboca en el Caribe; el Cauca es su afluente (se une al Magdalena, no al Amazonas). Los Llanos drenan al Orinoco; el suroriente, al Amazonas. “Afluente” = aporta a otro río; “desembocadura” = entrega al mar.',
  [
    'Marca en el mapa: ¿Caribe, Orinoco, Amazonas o Pacífico?',
    'Si dice “afluente del…”, busca el río receptor (Cauca → Magdalena).',
    'Si dice “desemboca en…”, busca el mar u océano (Magdalena → Caribe).',
    'Recuerda el macizo colombiano como nacimiento de Magdalena y Cauca.'
  ],
  [
    'Creer que el Cauca es afluente del Amazonas o del Orinoco.',
    'Decir que el Magdalena desemboca en el Pacífico.',
    'Confundir la cuenca de los Llanos (Orinoco) con la del Magdalena.'
  ],
  {
    titulo: 'Ejemplo resuelto · mismo tipo',
    enunciado: 'El río Cauca es afluente del…',
    pasos: [
      '1) Afluente = aporta agua a otro río (no “desemboca solo en el mar” como sistema principal).',
      '2) En el mapa, el Cauca baja entre cordilleras y se une al Magdalena.',
      '3) Amazonas y Orinoco son otras cuencas (suroriente / Llanos).',
      '4) Respuesta: Magdalena (juntos hacia el Caribe).'
    ],
    respuesta: 'Magdalena',
    contraste: {
      titulo: 'Contraste · cuenca correcta',
      invalido: 'Inválido: «El Cauca es afluente del Amazonas.» (otra cuenca).',
      valido: 'Válido: «El Cauca es afluente del Magdalena; juntos drenan hacia el Caribe.»'
    }
  },
  [
    q('tr_hidro_01', 'El río Cauca es afluente del:', ['A) Amazonas', 'B) Orinoco', 'C) Magdalena', 'D) Mediterráneo'], 'C',
      { A: 'El Cauca no está en la cuenca amazónica.', B: 'Los Llanos van al Orinoco; el Cauca no.', D: 'Sin conexión con el Mediterráneo.' },
      'El Cauca aporta al Magdalena.'),
    q('tr_hidro_02', 'El Magdalena nace en el macizo colombiano y desemboca en:', ['A) el océano Pacífico', 'B) el río Amazonas', 'C) el mar Caribe', 'D) el lago Titicaca'], 'C',
      { A: 'Desemboca al norte, en el Caribe.', B: 'No es afluente del Amazonas.', D: 'El Titicaca no está en su curso.' },
      'Macizo → Magdalena → Caribe.'),
    q('tr_hidro_03', 'Los Llanos Orientales hacen parte, sobre todo, de la cuenca del:', ['A) Pacífico', 'B) Caribe insular', 'C) Mediterráneo', 'D) Orinoco'], 'D',
      { A: 'Vertiente occidental distinta.', B: 'No es la cuenca continental de los Llanos.', C: 'Irrelevante aquí.' },
      'Llanos → Orinoco.'),
    q('tr_hidro_04', 'En el macizo colombiano nacen, entre otros:', ['A) solo arroyos de La Guajira', 'B) Magdalena y Cauca', 'C) únicamente ríos de San Andrés', 'D) el Amazonas en su desembocadura'], 'B',
      { A: 'La Guajira está al norte.', C: 'San Andrés es insular.', D: 'El Amazonas no “nace” allí como desembocadura.' },
      'Macizo: nacimiento de Magdalena y Cauca.')
  ],
  'Repasa el mapa de cuencas Magdalena-Cauca, Orinoco y Amazonas.'
);

C.geografia = pack(
  'Cuando el ítem cita una ciudad, puerto o paisaje, colócalo en el mapa de regiones: Caribe (Barranquilla, Cartagena), Pacífica (Buenaventura), Andina (eje cafetero, páramos), Orinoquía (Llanos) o Amazonía (suroriente, Leticia). La altitud en la Andina baja la temperatura media; no mezcles costa Caribe con costa Pacífica.',
  [
    'Identifica la pista: ciudad, río, puerto, ecosistema o “norte/suroriente”.',
    'Ubícala en una de las cinco regiones naturales.',
    'Si habla de temperatura en montaña, aplica: más altitud → más frío.',
    'Descarta opciones de otra costa o de otra región (ej. café ≠ Orinoquía).'
  ],
  [
    'Poner la Amazonía en el Caribe o el café en la Orinoquía.',
    'Confundir Buenaventura (Pacífico) con puertos caribeños.',
    'Ignorar que la altitud cambia el clima tropical.'
  ],
  {
    titulo: 'Ejemplo resuelto · mismo tipo',
    enunciado: 'Barranquilla, Cartagena y Santa Marta son ciudades de la región…',
    pasos: [
      '1) Son puertos sobre el mar Caribe (norte).',
      '2) No son Amazonía (suroriente) ni Orinoquía (Llanos).',
      '3) Tampoco Pacífico (Buenaventura está al oeste).',
      '4) Respuesta: Caribe.'
    ],
    respuesta: 'Caribe',
    contraste: {
      titulo: 'Contraste · costa correcta',
      invalido: 'Inválido: «Buenaventura es puerto del Caribe.»',
      valido: 'Válido: «Buenaventura es el gran puerto del Pacífico; Barranquilla, del Caribe.»'
    }
  },
  [
    q('tr_geo_01', 'La Amazonía colombiana se encuentra, principalmente, en el:', ['A) extremo norte Caribe', 'B) suroriente del país', 'C) archipiélago de San Andrés', 'D) eje cafetero'], 'B',
      { A: 'Norte = Caribe/Guajira.', C: 'San Andrés es Caribe insular.', D: 'Café = región Andina.' },
      'Amazonía = suroriente.'),
    q('tr_geo_02', 'A mayor altitud, en montañas tropicales, la temperatura suele:', ['A) bajar', 'B) subir siempre', 'C) igualarse al nivel del mar', 'D) depender solo del nombre del municipio'], 'A',
      { B: 'La media baja con la altura.', C: 'El gradiente térmico actúa.', D: 'La altitud es el factor físico.' },
      'Más altura → más frío.'),
    q('tr_geo_03', 'Buenaventura es el principal puerto colombiano sobre el:', ['A) océano Pacífico', 'B) mar Caribe', 'C) río Meta', 'D) lago de Tota'], 'A',
      { B: 'Los grandes del Caribe son otros.', C: 'Meta = fluvial llanero.', D: 'Lago andino.' },
      'Buenaventura = Pacífico.'),
    q('tr_geo_04', 'Un páramo es un ecosistema de:', ['A) alta montaña tropical', 'B) playa de manglar', 'C) sabana inundable baja', 'D) arrecife de coral'], 'A',
      { B: 'Manglar = costa.', C: 'Sabana = Orinoquía baja.', D: 'Coral = marino.' },
      'Páramo = alta montaña.')
  ],
  'Repasa regiones naturales, cordilleras y ecosistemas de Colombia.'
);

C.biologia = pack(
  'La biología del examen cubre estructuras y procesos: fotosíntesis (fase luminosa en tilacoides → ATP y NADPH; Calvin fija CO₂), genética de poblaciones (selección natural) y niveles de organización (célula → ecosistema).',
  [
    'Identifica el proceso (fotosíntesis, respiración, selección, homeostasis).',
    'Ubica dónde ocurre (orgánulo, tejido, población).',
    'Relaciona causa → mecanismo → efecto medible (O₂, frecuencia alélica, etc.).'
  ],
  [
    'Confundir fase luminosa con ciclo de Calvin.',
    'Creer que la selección crea mutaciones a voluntad.',
    'Mezclar respiración celular con fotosíntesis.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'En la fase luminosa de la fotosíntesis, en los tilacoides se generan principalmente…',
    pasos: [
      '1) La luz excita pigmentos en tilacoides.',
      '2) Se produce ATP y NADPH (y O₂ al fotolizar agua).',
      '3) El azúcar se forma después, en el estroma (Calvin).'
    ],
    respuesta: 'ATP y NADPH (energía reductora)',
    contraste: null
  },
  [
    q('tr_bio_01', 'La fase luminosa ocurre sobre todo en:', ['A) mitocondrias', 'B) tilacoides del cloroplasto', 'C) ribosomas libres', 'D) vacuolas'], 'B',
      { A: 'Mitocondria = respiración.', C: 'Ribosoma = proteínas.', D: 'Vacuola no hace la fase luminosa.' },
      'Tilacoides = fase luminosa.'),
    q('tr_bio_02', 'Si un pesticida elimina no resistentes y sobreviven resistentes que se reproducen, el proceso es:', ['A) selección natural', 'B) fotosíntesis', 'C) meiosis obligatoria en todos', 'D) extinción inmediata de la especie'], 'A',
      { B: 'No es metabolismo vegetal.', C: 'No explica el cambio de frecuencia.', D: 'La población no desaparece del todo.' },
      'Cambia la frecuencia del rasgo resistente.'),
    q('tr_bio_03', 'El O₂ liberado en fotosíntesis proviene principalmente de:', ['A) el CO₂', 'B) el agua', 'C) la glucosa ingerida', 'D) el nitrógeno del aire'], 'B',
      { A: 'El CO₂ aporta carbono al azúcar.', C: 'Las plantas no “ingieren” glucosa para liberar ese O₂.', D: 'N₂ no es la fuente del O₂ fotosintético.' },
      'Fotólisis del agua.'),
    q('tr_bio_04', 'Una población es:', ['A) un solo organismo', 'B) individuos de la misma especie en un área', 'C) todas las especies del planeta', 'D) solo el clima'], 'B',
      { A: 'Eso es organismo.', C: 'Eso es biosfera/comunidad amplia.', D: 'El clima es abiótico.' },
      'Población = misma especie, mismo lugar.')
  ],
  'Repasa fotosíntesis, genética de poblaciones y organización biológica.'
);

C.fisica = pack(
  'La física relaciona magnitudes: cinemática (v, a, Δx), dinámica (F = ma) y fenómenos de ondas/óptica. Las unidades y el signo de la aceleración importan tanto como la fórmula.',
  [
    'Lista datos con unidades coherentes (m/s, s, kg, N).',
    'Elige la relación (definición de a, 2ª ley, Snell, etc.).',
    'Interpreta el resultado (desaceleración = a negativa si v disminuye).'
  ],
  [
    'Usar v = d/t cuando hay aceleración no nula sin la fórmula adecuada.',
    'Olvidar que F neta / m da a.',
    'Mezclar ángulo de incidencia con índice de refracción.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Un vehículo pasa de 24 m/s a 0 en 6 s. ¿Magnitud de la desaceleración?',
    pasos: [
      '1) a = (v_f − v_i)/t = (0 − 24)/6.',
      '2) a = −4 m/s².',
      '3) Magnitud = 4 m/s².'
    ],
    respuesta: '4 m/s²',
    contraste: null
  },
  [
    q('tr_fis_01', 'De 24 m/s a 0 en 6 s, la magnitud de a es:', ['A) 4 m/s²', 'B) 144 m/s²', 'C) 0,25 m/s²', 'D) 30 m/s²'], 'A',
      { B: 'Multiplicaste 24×6.', C: 'Invertiste 6/24.', D: 'Sumaste sin dividir bien.' },
      '|Δv|/t = 24/6 = 4.'),
    q('tr_fis_02', 'F = 12 N sobre m = 2 kg (sin fricción). a =', ['A) 24 m/s²', 'B) 6 m/s²', 'C) 10 m/s²', 'D) 0,17 m/s²'], 'B',
      { A: 'Multiplicaste F·m.', C: 'Usaste g≈10 por error.', D: 'Invertiste m/F.' },
      'a = F/m = 6.'),
    q('tr_fis_03', 'Si la misma F se aplica a mayor masa, a:', ['A) aumenta', 'B) disminuye', 'C) no cambia nunca', 'D) se vuelve luz'], 'B',
      { A: 'Mayor inercia → menor a.', C: 'Sí cambia con m.', D: 'No es óptica.' },
      'a ∝ 1/m.'),
    q('tr_fis_04', 'En refracción, el índice n relaciona:', ['A) solo la masa del bloque', 'B) velocidad/ángulo de la luz en medios', 'C) únicamente el color político', 'D) la densidad poblacional'], 'B',
      { A: 'n no es masa.', C: 'Irrelevante.', D: 'No es demografía.' },
      'Óptica: n y ley de Snell.')
  ],
  'Practica cinemática, F=ma y óptica básica con unidades.'
);

C.quimica = pack(
  'La química describe composición y cambio: estequiometría, disoluciones (molaridad), tabla periódica (radio, electronegatividad) y reacciones con conservación de átomos.',
  [
    'Balancea o usa la relación molar de la reacción.',
    'Convierte gramos ↔ moles con masa molar.',
    'Lee tendencias periódicas (grupo/periodo) con la causa correcta (capas, Z efe).'
  ],
  [
    'Olvidar la masa molar al pasar de g a mol.',
    'Invertir tendencias (radio vs electronegatividad).',
    'Creer que los moles “desaparecen” sin conservación.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '40 g de NaOH en 1 L de solución. Masa molar NaOH = 40 g/mol. ¿Molaridad?',
    pasos: ['1) moles = 40/40 = 1 mol.', '2) V = 1 L.', '3) M = 1 mol/L.'],
    respuesta: '1 M',
    contraste: null
  },
  [
    q('tr_qui_01', '40 g NaOH (MM=40) en 1 L → molaridad:', ['A) 0,4 M', 'B) 1 M', 'C) 40 M', 'D) 10 M'], 'B',
      { A: 'Dividiste mal.', C: 'Usaste gramos como moles.', D: 'Factor 10 sin base.' },
      'n=1; M=1.'),
    q('tr_qui_02', 'Al bajar en un grupo, el radio atómico suele:', ['A) disminuir', 'B) aumentar', 'C) anularse', 'D) igualar al del He siempre'], 'B',
      { A: 'Al bajar hay más capas.', C: 'No se anula.', D: 'Falso.' },
      'Más niveles de energía → mayor radio.'),
    q('tr_qui_03', '2 H₂ + O₂ → 2 H₂O. Si hay 2 mol H₂ y 1 mol O₂, el agua máxima es:', ['A) 1 mol', 'B) 2 mol', 'C) 3 mol', 'D) 0 mol'], 'B',
      { A: 'Eso sería si limitara a la mitad.', C: 'No hay átomos de más.', D: 'Sí reaccionan.' },
      'Proporción exacta → 2 mol H₂O.'),
    q('tr_qui_04', 'La molaridad M es:', ['A) moles de soluto / litros de solución', 'B) litros / moles', 'C) solo gramos de solvente', 'D) presión atmosférica'], 'A',
      { B: 'Está invertido.', C: 'No define M.', D: 'No es concentración.' },
      'M = n/V.')
  ],
  'Repasa moles, molaridad y tendencias periódicas.'
);

C.historia = pack(
  'Si el ítem da una fecha (1810, 1819, 1903), colócala en la línea: 20 jul 1810 = junta/grito en Bogotá (inicio del proceso); Boyacá 1819 = victoria decisiva de la campaña libertadora; 1903 = separación de Panamá. No confundas el “grito” con la batalla, ni Panamá con la Amazonía.',
  [
    'Lee la fecha o el nombre del hecho.',
    'Ubícalo en la línea 1810 → 1819 → siglo XIX → 1903.',
    'Di si es causa, acontecimiento o consecuencia del proceso independentista.',
    'Descarta anacronismos (p. ej. Constitución de 1991 en un ítem de 1810).'
  ],
  [
    'Creer que la Independencia fue un solo día completo.',
    'Confundir Boyacá con el 20 de julio.',
    'Atribuir la pérdida de Panamá a la Amazonía.'
  ],
  {
    titulo: 'Ejemplo resuelto · mismo tipo',
    enunciado: 'La batalla de Boyacá (7 ago 1819) fue decisiva para…',
    pasos: [
      '1) 1819 ≠ 1810: no es el grito/junta.',
      '2) Boyacá cierra la campaña libertadora en la Nueva Granada.',
      '3) Consecuencia: consolidación independentista frente a España.',
      '4) Respuesta: independencia / consolidación libertadora.'
    ],
    respuesta: 'La independencia de la Nueva Granada / consolidación libertadora',
    contraste: {
      titulo: 'Contraste · fecha correcta',
      invalido: 'Inválido: «Boyacá es lo mismo que el 20 de julio de 1810.»',
      valido: 'Válido: «1810 inicia el proceso; Boyacá 1819 es la victoria decisiva.»'
    }
  },
  [
    q('tr_his_01', 'El 20 de julio de 1810 se recuerda como:', ['A) la batalla de Boyacá', 'B) el grito de independencia / junta de Bogotá', 'C) la pérdida de Panamá', 'D) la Constitución de 1991'], 'B',
      { A: 'Boyacá es 1819.', C: 'Panamá es 1903.', D: '1991 es mucho después.' },
      '1810 = junta / grito en Bogotá.'),
    q('tr_his_02', 'Boyacá (1819) fue decisiva para:', ['A) independizar la Nueva Granada en la campaña libertadora', 'B) fundar San Andrés', 'C) crear el Caribe insular', 'D) firmar la Constitución de 1991'], 'A',
      { B: 'No es el hecho.', C: 'No aplica.', D: 'Siglo XX tardío.' },
      'Victoria clave de 1819.'),
    q('tr_his_03', 'La pérdida de Panamá (1903) separó de Colombia:', ['A) la Amazonía', 'B) el istmo que hoy es Panamá', 'C) La Guajira', 'D) solo las islas del Rosario'], 'B',
      { A: 'Amazonía sigue siendo colombiana en gran parte.', C: 'Guajira no se “perdió” así.', D: 'No es el núcleo del hecho.' },
      'Se separa el istmo panameño.'),
    q('tr_his_04', 'La Independencia colombiana fue:', ['A) un solo día sin proceso', 'B) un proceso de años con juntas, guerras y campañas', 'C) solo un tratado europeo de 1492', 'D) únicamente un cambio de bandera en 1991'], 'B',
      { A: 'Hubo proceso prolongado.', C: '1492 es conquista.', D: '1991 es otra etapa.' },
      'Proceso, no un instante.')
  ],
  'Línea de tiempo: 1810, 1819, siglo XIX, 1903, siglo XX.'
);

C.constitucion = pack(
  'La Constitución Política organiza el Estado en ramas: legislativa (Congreso), ejecutiva (Presidente) y judicial (cortes/jueces), con derechos, deberes y controles. Separación de poderes evita la concentración.',
  [
    'Identifica qué rama hace la norma, la ejecuta o la juzga.',
    'Relaciona el mecanismo (tutela, voto, etc.) con el derecho o control.',
    'No mezcles funciones (el Congreso no “juzga” como corte ordinaria).'
  ],
  [
    'Asignar al Presidente la función de legislar en abstracto como Congreso.',
    'Creer que los jueces encabezan la rama ejecutiva.',
    'Confundir derecho fundamental con trámite administrativo cualquiera.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'En Colombia, el Congreso hace parte de la rama…',
    pasos: ['1) Congreso = Senado + Cámara.', '2) Su función central es legislar.', '3) Rama legislativa.'],
    respuesta: 'Legislativa',
    contraste: null
  },
  [
    q('tr_con_01', 'El Congreso integra la rama:', ['A) legislativa', 'B) ejecutiva', 'C) judicial', 'D) militar exclusiva'], 'A',
      { B: 'Ejecutiva = Presidente y gobierno.', C: 'Judicial = jueces/cortes.', D: 'No es una rama constitucional así.' },
      'Congreso = legislativa.'),
    q('tr_con_02', 'El Presidente encabeza la rama:', ['A) judicial', 'B) ejecutiva', 'C) legislativa', 'D) electoral únicamente'], 'B',
      { A: 'Judicial son cortes.', C: 'Legislativa es Congreso.', D: 'Lo electoral tiene órganos propios.' },
      'Presidente = ejecutiva.'),
    q('tr_con_03', 'Cortes y jueces integran la rama:', ['A) ejecutiva', 'B) legislativa', 'C) judicial', 'D) diplomática'], 'C',
      { A: 'No ejecutan políticas como gobierno.', B: 'No son el Congreso.', D: 'No es rama.' },
      'Judicial = administración de justicia.'),
    q('tr_con_04', 'La separación de poderes busca:', ['A) concentrar todo en una persona', 'B) repartir funciones y controlar el poder', 'C) eliminar derechos', 'D) sustituir la Constitución por decretos eternos'], 'B',
      { A: 'Es lo contrario.', C: 'La Constitución garantiza derechos.', D: 'El marco superior es la Constitución.' },
      'Frenos y contrapesos.')
  ],
  'Memoriza ramas + un ejemplo de función de cada una.'
);

C.algebra = pack(
  'El álgebra modela relaciones con variables: despejar, plantear ecuaciones lineales y traducir un enunciado (tarifa, tanque, distancia) a una igualdad que se resuelve con operaciones inversas.',
  [
    'Define la incógnita (lo que pide el enunciado).',
    'Escribe la ecuación con los datos.',
    'Despeja con operaciones inversas y verifica sustituyendo.'
  ],
  [
    'Sumar cuando tocaba multiplicar (o al revés).',
    'Despejar mal el término con la variable.',
    'Olvidar unidades o el término constante (tarifa base).'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Tarifa = 3000 + 150·km. Si el viaje cuesta 6000, ¿km?',
    pasos: ['1) 3000 + 150k = 6000.', '2) 150k = 3000.', '3) k = 20.'],
    respuesta: '20 km',
    contraste: null
  },
  [
    q('tr_alg_01', '3000 + 150k = 6000 → k =', ['A) 10', 'B) 20', 'C) 40', 'D) 2'], 'B',
      { A: 'Usaste 1500/150.', C: 'Dividiste 6000/150 sin restar base.', D: 'Mal despeje.' },
      'k=(6000-3000)/150=20.'),
    q('tr_alg_02', 'Para despejar x en 3x + 6 = 18:', ['A) x = 8', 'B) x = 4', 'C) x = 6', 'D) x = 12'], 'B',
      { A: 'Restaste mal.', C: 'Te quedaste en 3x=18.', D: 'Multiplicaste de más.' },
      '3x=12 → x=4.'),
    q('tr_alg_03', 'Si un tanque pierde agua a tasa constante, el modelo típico es:', ['A) solo una potencia sin sentido', 'B) cantidad inicial ± tasa·tiempo', 'C) únicamente el nombre del tanque', 'D) una desigualdad electoral'], 'B',
      { A: 'No es el modelo lineal básico.', C: 'No calcula.', D: 'Irrelevante.' },
      'Lineal: V = V0 − r·t.'),
    q('tr_alg_04', 'Operación inversa de multiplicar por 5 es:', ['A) sumar 5', 'B) dividir entre 5', 'C) restar 5', 'D) elevar al cuadrado'], 'B',
      { A: 'Suma no deshace producto.', C: 'Resta no deshace producto.', D: 'Potencia distinta.' },
      'Producto ↔ división.')
  ],
  'Traduce enunciado → ecuación → despeje.'
);

C.aritmetica = pack(
  'La aritmética opera cantidades con orden de operaciones (paréntesis, potencias, ×÷, +−) y sentido de las operaciones en contexto (totales, diferencias, tasas simples).',
  [
    'Respeta el orden de operaciones.',
    'Convierte unidades antes de operar si hace falta.',
    'Estima un valor razonable para detectar errores gruesos.'
  ],
  [
    'Sumar antes de multiplicar sin paréntesis que lo autoricen.',
    'Olvidar un paréntesis del enunciado.',
    'Mezclar unidades (minutos con horas).'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Calcula 3 + 4 × 2.',
    pasos: ['1) Primero 4×2=8.', '2) Luego 3+8=11.', '3) No es (3+4)×2=14.'],
    respuesta: '11',
    contraste: null
  },
  [
    q('tr_ari_01', '3 + 4 × 2 =', ['A) 14', 'B) 11', 'C) 10', 'D) 24'], 'B',
      { A: 'Sumaste antes.', C: 'Restaste mal.', D: 'Multiplicaste todo.' },
      'Producto antes que suma.'),
    q('tr_ari_02', '(3 + 4) × 2 =', ['A) 11', 'B) 14', 'C) 5', 'D) 6'], 'B',
      { A: 'Ignoraste el paréntesis.', C: 'Solo sumaste.', D: 'Solo 3×2.' },
      'Paréntesis primero.'),
    q('tr_ari_03', '120 minutos en horas son:', ['A) 2 h', 'B) 12 h', 'C) 0,12 h', 'D) 120 h'], 'A',
      { B: 'Dividiste mal.', C: 'Factor 100 erróneo.', D: 'Sin conversión.' },
      '60 min = 1 h.'),
    q('tr_ari_04', 'El orden correcto básico es:', ['A) + antes que × siempre', 'B) ×÷ antes que +− (si no hay paréntesis)', 'C) solo de derecha a izquierda al azar', 'D) ignorar paréntesis'], 'B',
      { A: 'Falso.', C: 'No es regla.', D: 'Paréntesis mandan.' },
      'PEMDAS/orden estándar.')
  ],
  'Orden de operaciones + conversiones.'
);

C.geometria = pack(
  'Cuando el problema da un rectángulo con ancho = x y largo = 3x (u otras longitudes), primero decide qué pide: perímetro (contorno) o área (superficie). Perímetro: suma de lados → P = 2(x + 3x) = 8x. Área: producto → A = x · 3x = 3x². No mezcles las dos fórmulas.',
  [
    'Lee si pregunta perímetro, área o volumen (palabras clave: contorno / cerca / superficie / pintura / capacidad).',
    'Dibuja la figura y marca cada lado (ej.: ancho x, largo 3x).',
    'Aplica solo la fórmula pedida: P = 2(L+A) o A = L·A; en triángulo rectángulo, Pitágoras si pide un lado.',
    'Simplifica (8x, 3x²…) y revisa unidades.'
  ],
  [
    'Calcular área (producto) cuando pedían perímetro (suma de lados).',
    'Usar P = L+A en vez de 2(L+A) en el rectángulo.',
    'Tratar 3x como “3 + x” en lugar de “tres veces x”.',
    'Aplicar Pitágoras a un triángulo que no es rectángulo.'
  ],
  {
    titulo: 'Ejemplo resuelto · mismo tipo',
    enunciado: 'Un rectángulo tiene ancho x y largo 3x. ¿Cuál es su perímetro?',
    pasos: [
      '1) Perímetro = contorno = 2 × (largo + ancho).',
      '2) Largo + ancho = 3x + x = 4x.',
      '3) P = 2 × 4x = 8x.',
      '4) El área sería 3x·x = 3x²: eso NO responde “perímetro”.'
    ],
    respuesta: '8x',
    contraste: {
      titulo: 'Contraste · no confundir con área',
      invalido: 'Inválido: responder 3x² (eso es el área).',
      valido: 'Válido: 8x (perímetro del rectángulo x por 3x).'
    }
  },
  [
    q('tr_geo_m_01', 'Rectángulo de ancho x y largo 3x. Su perímetro es:', ['A) 3x²', 'B) 8x', 'C) 4x', 'D) 6x'], 'B',
      { A: 'Eso es el área (x·3x).', C: 'Sumaste lados una sola vez (L+A), falta el ×2.', D: 'Solo tres lados o mal factor.' },
      'P=2(x+3x)=8x.'),
    q('tr_geo_m_02', 'Mismo rectángulo (x por 3x). Su área es:', ['A) 8x', 'B) 4x', 'C) 3x²', 'D) 3x'], 'C',
      { A: 'Eso es el perímetro.', B: 'Eso es L+A, no el área.', D: 'Falta multiplicar x·x.' },
      'A=x·3x=3x².'),
    q('tr_geo_m_03', 'Perímetro de un cuadrado de lado 4:', ['A) 8', 'B) 16', 'C) 12', 'D) 4'], 'B',
      { A: 'Solo dos lados.', C: 'Pensaste en otra figura.', D: 'Un solo lado.' },
      'P=4·4=16.'),
    q('tr_geo_m_04', 'En un triángulo rectángulo, Pitágoras relaciona:', ['A) solo los ángulos agudos entre sí', 'B) los dos catetos y la hipotenusa', 'C) únicamente el perímetro', 'D) el área con π'], 'B',
      { A: 'Pitágoras habla de lados.', C: 'Pitágoras no es la suma de lados.', D: 'π es de círculos.' },
      'a²+b²=c².')
  ],
  'Marca L y A en el dibujo; elige P=2(L+A) o A=L·A según la pregunta.'
);

C.funciones = pack(
  'Una función asigna a cada x un único y. Se representa con tabla, fórmula o gráfica; la pendiente en lineales indica el cambio de y por cada unidad de x.',
  [
    'Reconoce dominio/recorrido en el contexto.',
    'Lee en la gráfica: ¿crece, decrece, corta ejes?',
    'En y = mx + b, interpreta m y b.'
  ],
  [
    'Creer que una relación vertical es función de x.',
    'Confundir pendiente con intercepto.',
    'Leer mal un punto (x,y) en la gráfica.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'y = 2x + 1. Si x=3, y=¿?',
    pasos: ['1) Sustituye x=3.', '2) y=6+1=7.', '3) Un solo valor → es función.'],
    respuesta: '7',
    contraste: null
  },
  [
    q('tr_fun_01', 'En y=2x+1, si x=3, y=', ['A) 5', 'B) 7', 'C) 6', 'D) 1'], 'B',
      { A: '2·3−1.', C: 'Olvidaste +1.', D: 'Solo el intercepto.' },
      '2·3+1=7.'),
    q('tr_fun_02', 'La pendiente de y=2x+1 es:', ['A) 1', 'B) 2', 'C) 3', 'D) 0'], 'B',
      { A: 'Eso es b.', C: 'Suma indebida.', D: 'No es horizontal.' },
      'm=2.'),
    q('tr_fun_03', 'Una función de x no puede:', ['A) tener un y por cada x', 'B) asignar dos y distintos al mismo x', 'C) graficarse', 'D) tener intercepto'], 'B',
      { A: 'Eso sí define función.', C: 'Sí puede.', D: 'Puede tenerlo.' },
      'Un x → un solo y.'),
    q('tr_fun_04', 'Si la gráfica sube de izquierda a derecha, la función:', ['A) decrece', 'B) crece', 'C) es constante', 'D) no existe'], 'B',
      { A: 'Decrecer baja.', C: 'Constante es horizontal.', D: 'Sí existe.' },
      'Creciente.')
  ],
  'Fórmula ↔ tabla ↔ gráfica.'
);

C.estadistica = pack(
  'La estadística descriptiva resume datos: media (promedio), mediana (valor central ordenado), moda (más frecuente) y rango (máx−mín). Cada medida responde una pregunta distinta.',
  [
    'Ordena los datos si usas mediana.',
    'Elige la medida que pide el enunciado.',
    'Cuidado con valores atípicos: afectan mucho la media.'
  ],
  [
    'Calcular la media cuando pedían mediana.',
    'Olvidar ordenar para la mediana.',
    'Confundir rango con media.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Datos: 2, 4, 4, 6. Media y moda?',
    pasos: ['1) Media=(2+4+4+6)/4=4.', '2) Moda=4 (más frecuente).', '3) Mediana=(4+4)/2=4.'],
    respuesta: 'Media 4; moda 4',
    contraste: null
  },
  [
    q('tr_est_01', 'Media de 2,4,6:', ['A) 4', 'B) 6', 'C) 2', 'D) 12'], 'A',
      { B: 'Tomaste el máximo.', C: 'Mínimo.', D: 'Sumaste sin dividir.' },
      '(2+4+6)/3=4.'),
    q('tr_est_02', 'Moda de 1,2,2,3:', ['A) 1', 'B) 2', 'C) 3', 'D) 8'], 'B',
      { A: 'Aparece una vez.', C: 'Una vez.', D: 'Suma.' },
      '2 es el más frecuente.'),
    q('tr_est_03', 'Mediana de 1,3,8 (ordenados):', ['A) 1', 'B) 3', 'C) 8', 'D) 4'], 'B',
      { A: 'Extremo.', C: 'Extremo.', D: 'Media, no mediana.' },
      'Valor central=3.'),
    q('tr_est_04', 'Rango de 5 y 12:', ['A) 17', 'B) 7', 'C) 5', 'D) 12'], 'B',
      { A: 'Suma.', C: 'Mínimo.', D: 'Máximo.' },
      '12−5=7.')
  ],
  'Media / mediana / moda / rango: elige la que preguntan.'
);

C.probabilidad = pack(
  'La probabilidad clásica es casos favorables / casos posibles (espacio muestral equiprobable). Unión, intersección y complemento (1−p) evitan contar de más o de menos.',
  [
    'Define el espacio muestral.',
    'Cuenta favorables con la condición exacta.',
    'Usa complemento cuando “al menos” es más fácil al revés.'
  ],
  [
    'Confundir unión con intersección.',
    'Usar 1−p del evento equivocado.',
    'Suponer independencia cuando no la hay.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Dado justo. P(par)=?',
    pasos: ['1) Espacio={1..6}.', '2) Pares={2,4,6} → 3.', '3) P=3/6=1/2.'],
    respuesta: '1/2',
    contraste: null
  },
  [
    q('tr_pro_01', 'P(par) en dado justo:', ['A) 1/6', 'B) 1/2', 'C) 1/3', 'D) 2/3'], 'B',
      { A: 'Un solo número.', C: 'Contaste mal.', D: 'Eso es impar+… distinto.' },
      '3/6=1/2.'),
    q('tr_pro_02', 'Si P(A)=0,3, P(no A)=', ['A) 0,3', 'B) 0,7', 'C) 1,3', 'D) 0'], 'B',
      { A: 'Mismo evento.', C: 'Suma indebida.', D: 'No es imposible.' },
      'Complemento 1−0,3.'),
    q('tr_pro_03', 'Favorables/posibles requiere:', ['A) resultados igualmente posibles (clásico)', 'B) solo opiniones', 'C) ignorar el enunciado', 'D) siempre 50%'], 'A',
      { B: 'No es definición.', C: 'Hay que leer la condición.', D: 'No siempre.' },
      'Modelo clásico equiprobable.'),
    q('tr_pro_04', 'P(A o B) con excluyentes es:', ['A) P(A)·P(B)', 'B) P(A)+P(B)', 'C) P(A)−P(B)', 'D) 1'], 'B',
      { A: 'Eso es intersección independiente.', C: 'No es la unión.', D: 'Solo si es seguro.' },
      'Unión de excluyentes.')
  ],
  'Espacio muestral + conteo + complemento.'
);

C.trigonometria = pack(
  'En un triángulo rectángulo: sen = opuesto/hipotenusa, cos = adyacente/hipotenusa, tan = opuesto/adyacente. El ángulo determina qué lados usar.',
  [
    'Dibuja y marca opuesto, adyacente e hipotenusa respecto al ángulo.',
    'Elige seno, coseno o tangente.',
    'Despeja el lado pedido.'
  ],
  [
    'Invertir opuesto y adyacente.',
    'Usar hipotenusa como cateto.',
    'Aplicar razones en un triángulo no rectángulo sin ley adecuada.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'En rectángulo, opuesto=3, hipotenusa=5. sen θ=?',
    pasos: ['1) sen=op/hip.', '2) 3/5.', '3) No uses adyacente aquí.'],
    respuesta: '3/5',
    contraste: null
  },
  [
    q('tr_tri_01', 'sen θ si op=3, hip=5:', ['A) 5/3', 'B) 3/5', 'C) 3/4', 'D) 4/5'], 'B',
      { A: 'Invertiste.', C: 'Usaste otro cateto sin dato.', D: 'Eso sería un cos si adj=4.' },
      'sen=3/5.'),
    q('tr_tri_02', 'cos θ = adyacente /:', ['A) opuesto', 'B) hipotenusa', 'C) tangente', 'D) área'], 'B',
      { A: 'Eso no es cos.', C: 'Tangente es razón distinta.', D: 'No.' },
      'cos=adj/hip.'),
    q('tr_tri_03', 'tan θ =', ['A) hip/op', 'B) op/adj', 'C) adj/op al cuadrado', 'D) sen+cos'], 'B',
      { A: 'Invertido.', C: 'No.', D: 'Identidad distinta.' },
      'tan=op/adj.'),
    q('tr_tri_04', 'La hipotenusa es:', ['A) el cateto menor siempre', 'B) el lado opuesto al ángulo recto', 'C) un ángulo', 'D) el perímetro'], 'B',
      { A: 'No por tamaño solo.', C: 'Es lado.', D: 'No.' },
      'Frente al ángulo de 90°.')
  ],
  'SOH-CAH-TOA con dibujo.'
);

C.combinatoria = pack(
  'La combinatoria cuenta arreglos: permutaciones (el orden importa) y combinaciones (el orden no importa). Multiplica opciones en etapas sucesivas (principio multiplicativo).',
  [
    'Decide si el orden importa.',
    'Usa P o C (o producto de casos) según corresponda.',
    'No doble-cuentes el mismo grupo.'
  ],
  [
    'Usar combinaciones cuando el orden sí importa.',
    'Sumar cuando las etapas son sucesivas (debía multiplicar).',
    'Olvidar restricciones del enunciado.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '¿De cuántas formas elegir 2 libros de 4 si el orden no importa?',
    pasos: ['1) Combinación C(4,2).', '2) 4·3/2!=6.', '3) Si el orden importara sería 12.'],
    respuesta: '6',
    contraste: null
  },
  [
    q('tr_comb_01', 'C(4,2) =', ['A) 6', 'B) 12', 'C) 8', 'D) 2'], 'A',
      { B: 'Eso es P(4,2).', C: 'Mal cálculo.', D: 'Solo resta.' },
      'C=6.'),
    q('tr_comb_02', 'Si el orden importa en 4 para 2:', ['A) C(4,2)', 'B) P(4,2)=12', 'C) 4+2', 'D) 1'], 'B',
      { A: 'C ignora orden.', C: 'Suma indebida.', D: 'No.' },
      'Permutación.'),
    q('tr_comb_03', 'Menú: 3 sopas y 2 jugos. ¿Pares sopa+jugo?', ['A) 5', 'B) 6', 'C) 3', 'D) 2'], 'B',
      { A: 'Sumaste.', C: 'Solo sopas.', D: 'Solo jugos.' },
      '3·2=6.'),
    q('tr_comb_04', 'Combinación se usa cuando:', ['A) el orden no importa', 'B) el orden siempre importa', 'C) hay infinitos casos sin regla', 'D) solo en física'], 'A',
      { B: 'Eso es permutación.', C: 'Hay regla de conteo.', D: 'Es matemática.' },
      'Orden irrelevante → C.')
  ],
  'Orden sí/no → P o C; etapas → producto.'
);

C.calculo_limites = pack(
  'Un límite describe el valor al que se acerca una función cuando x tiende a un número (o ±∞), aunque f(a) no exista. Se simplifica algebraicamente (factorizar) para quitar indeterminaciones 0/0.',
  [
    'Sustituye el valor si f es continua allí.',
    'Si sale 0/0, factoriza/simplifica y vuelve a sustituir.',
    'Interpreta el resultado como tendencia, no solo como “f(a)”.'
  ],
  [
    'Declarar que no existe límite solo porque f(a) no está definida, sin mirar laterales.',
    'Cancelar términos indebidos.',
    'Confundir límite con derivada.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'lim x→2 (x²−4)/(x−2)',
    pasos: ['1) Sustituir da 0/0.', '2) Factoriza (x−2)(x+2)/(x−2).', '3) Para x≠2 queda x+2 → 4.'],
    respuesta: '4',
    contraste: null
  },
  [
    q('tr_lim_01', 'lim x→2 (x²−4)/(x−2) =', ['A) 0', 'B) 4', 'C) ∞', 'D) 2'], 'B',
      { A: 'Indeterminación, no el límite.', C: 'No diverge aquí.', D: 'Te quedaste a medias.' },
      'Simplifica a x+2 → 4.'),
    q('tr_lim_02', '0/0 al sustituir indica:', ['A) fin del problema', 'B) indeterminación: hay que simplificar', 'C) el límite es siempre 0', 'D) el límite es 1'], 'B',
      { A: 'Se puede resolver.', C: 'No necesariamente.', D: 'No.' },
      'Indeterminación algebraica.'),
    q('tr_lim_03', 'Si f es polinomio, lim x→a f(x) =', ['A) siempre 0', 'B) f(a)', 'C) la derivada', 'D) no existe'], 'B',
      { A: 'Falso.', C: 'Derivada es otro objeto.', D: 'Existe por continuidad.' },
      'Continuidad de polinomios.'),
    q('tr_lim_04', 'El límite describe:', ['A) solo un punto aislado sin tendencia', 'B) el valor al que se acerca f(x)', 'C) únicamente el área', 'D) la moda estadística'], 'B',
      { A: 'Es tendencia.', C: 'Integral distinta.', D: 'Otra área.' },
      'Tendencia de f(x).')
  ],
  'Sustitución → indeterminación → simplificar.'
);

C.cts = pack(
  'Ciencia, tecnología y sociedad (CTS) analiza cómo una decisión técnica (energía, agro, salud) impacta ambiente, equidad y riesgos. No basta nombrar la tecnología: hay que enlazar mecanismo e impacto.',
  [
    'Identifica la tecnología o medida propuesta.',
    'Señala el impacto ambiental/social relevante del caso.',
    'Evalúa trade-offs (beneficio vs riesgo) con evidencia del enunciado.'
  ],
  [
    'Elegir una opción que ignora el impacto descrito.',
    'Confundir correlación local con solución universal.',
    'Olvidar el contexto ecológico del sitio (páramo, mar, café…).'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Paneles solares cerca de un santuario marino para reducir impacto…',
    pasos: [
      '1) La medida busca mitigar presión ambiental.',
      '2) Debe cuidarse que la instalación no dañe el ecosistema que se quiere proteger.',
      '3) La mejor opción equilibra energía limpia y conservación.'
    ],
    respuesta: 'Mitigar impacto sin destruir el ecosistema protegido',
    contraste: null
  },
  [
    q('tr_cts_01', 'CTS conecta principalmente:', ['A) solo fórmulas sin contexto', 'B) ciencia/tecnología con impactos sociales y ambientales', 'C) únicamente fechas históricas', 'D) solo gramática'], 'B',
      { A: 'Falta el impacto.', C: 'Eso es historia.', D: 'Inglés.' },
      'Tecnología + sociedad/ambiente.'),
    q('tr_cts_02', 'Un trade-off es:', ['A) ganar todo sin costo', 'B) un equilibrio entre beneficio y costo/riesgo', 'C) un error de suma', 'D) una capital de departamento'], 'B',
      { A: 'Irreal en CTS.', C: 'No.', D: 'No.' },
      'Compromiso beneficio-riesgo.'),
    q('tr_cts_03', 'En un páramo, una intervención debe considerar sobre todo:', ['A) solo el color del panel', 'B) el agua y ecosistemas de alta montaña', 'C) el Mediterráneo', 'D) la moda estadística de otro país'], 'B',
      { A: 'Secundario.', C: 'Fuera de contexto.', D: 'Irrelevante.' },
      'Páramo = retención hídrica/frailejones.'),
    q('tr_cts_04', 'La mejor respuesta CTS suele:', ['A) negar todo impacto', 'B) articular evidencia del caso con consecuencias', 'C) copiar una definición vacía', 'D) hablar de otra región sin datos'], 'B',
      { A: 'Siempre hay efectos.', C: 'Insuficiente.', D: 'Fuera de caso.' },
      'Evidencia + impacto.')
  ],
  'Caso → tecnología → impacto → decisión informada.'
);

C.indagacion = pack(
  'La indagación científica plantea preguntas, hipótesis, variables (independiente/dependiente/controladas) y evidencia. Un buen diseño cambia una variable a la vez y mide con claridad.',
  [
    'Separa pregunta, hipótesis y variable que se manipula.',
    'Identifica qué se mide (dependiente) y qué se controla.',
    'Concluye solo lo que los datos permiten.'
  ],
  [
    'Confundir hipótesis con conclusión ya demostrada.',
    'Cambiar varias variables a la vez.',
    'Generalizar más allá de la evidencia.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Se varía la luz y se mide O₂ en plantas. ¿Variable independiente?',
    pasos: ['1) Independiente = la que el experimentador cambia.', '2) Aquí: intensidad de luz.', '3) Dependiente: tasa de O₂.'],
    respuesta: 'Intensidad de luz',
    contraste: null
  },
  [
    q('tr_ind_01', 'Variable independiente es:', ['A) la que se mide como resultado', 'B) la que se manipula', 'C) el nombre del laboratorio', 'D) siempre el tiempo político'], 'B',
      { A: 'Eso es dependiente.', C: 'No.', D: 'No.' },
      'Se manipula.'),
    q('tr_ind_02', 'Variable dependiente es:', ['A) la respuesta medida', 'B) la que se fija de antemano como causa', 'C) un distractor gramatical', 'D) la hipótesis misma'], 'A',
      { B: 'Eso es independiente/control.', C: 'No.', D: 'Hipótesis ≠ medición.' },
      'Se mide el efecto.'),
    q('tr_ind_03', 'Controlar variables significa:', ['A) ignorarlas', 'B) mantenerlas constantes para aislar el efecto', 'C) cambiarlas todas', 'D) borrar datos'], 'B',
      { A: 'Rompe el diseño.', C: 'Confunde causas.', D: 'Mala práctica.' },
      'Aislar la causa.'),
    q('tr_ind_04', 'Una hipótesis es:', ['A) una respuesta tentativa comprobable', 'B) un resultado ya publicado obligatorio', 'C) una opinión sin prueba posible', 'D) un mapa político'], 'A',
      { B: 'Aún se pone a prueba.', C: 'Debe ser comprobable.', D: 'No.' },
      'Afirmación comprobable.')
  ],
  'Pregunta → variables → evidencia → conclusión limitada.'
);

// Skill themes with substantive (not test-tip) content
C.argumentacion = pack(
  'Un argumento une premisas (razones) con una conclusión. Es válido si la conclusión se sigue; es falaz si hay un salto (pendiente resbaladiza, ad hominem, etc.).',
  [
    'Separa premisas y conclusión.',
    'Pregunta si las premisas bastan o hay salto.',
    'Nombra el tipo de fallo si lo hay.'
  ],
  [
    'Confundir premisa con conclusión.',
    'Aceptar lo que “suena bien” sin apoyo.',
    'Mezclar tipos de falacia.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '«Si permitimos celulares en clase, el colegio colapsará.»',
    pasos: [
      '1) Premisa implícita: permitir celulares.',
      '2) Conclusión: el colegio colapsa.',
      '3) Salto sin pasos intermedios → pendiente resbaladiza.',
      '4) Por eso la conclusión no se sigue: de un permiso no se deduce un desastre total.'
    ],
    respuesta: 'Pendiente resbaladiza',
    contraste: {
      titulo: 'Contraste · argumento válido (corto)',
      invalido: 'Inválido: «Si hay celulares, el colegio colapsa.»',
      valido: 'Válido: «Si el reglamento prohíbe celulares y Ana usa uno, Ana incumple el reglamento.»'
    }
  },
  [
    q('tr_arg_01', 'Premisa: «Permitimos X.» Conclusión: «Todo colapsa.» ¿Qué falla?', ['A) Pendiente resbaladiza: la conclusión no se sigue', 'B) Dato estadístico sólido', 'C) Solo una norma escolar', 'D) Definición de X'], 'A',
      { B: 'No hay evidencia numérica.', C: 'No describe norma: predice desastre.', D: 'No define: afirma consecuencias.' },
      'Salto permiso→colapso.'),
    q('tr_arg_02', '«Todo M es P» y «Todo S es M» ⇒', ['A) Ningún S es P', 'B) Todo S es P', 'C) Algún P no es S necesariamente aquí', 'D) Nada'], 'B',
      { A: 'Negación indebida.', C: 'No es lo deducido.', D: 'Sí se deduce inclusión.' },
      'Transitividad válida.'),
    q('tr_arg_03', '«No oigas su propuesta: reprobó dos materias.»', ['A) Falsa analogía', 'B) Ad hominem', 'C) Generalización con muestra', 'D) Definición circular'], 'B',
      { A: 'No compara casos.', C: 'No generaliza muestra.', D: 'No redefine.' },
      'Ataca a la persona.'),
    q('tr_arg_04', 'La conclusión de un argumento es:', ['A) la idea que se quiere que aceptes a partir de las razones', 'B) cualquier anécdota', 'C) solo el título', 'D) una pregunta sin tesis'], 'A',
      { B: 'Puede ser premisa.', C: 'Orienta, no demuestra.', D: 'No es tesis.' },
      'Conclusión = lo sostenido.')
  ],
  'Premisa → conclusión; detecta saltos.'
);

C.fracciones = pack(
  'Una fracción a/b compara una parte (numerador) con un todo en b partes iguales. Equivalentes representan la misma cantidad (1/2=2/4).',
  [
    'Para sumar/restar: iguala denominadores (mcm).',
    'Para comparar: mismo denominador o decimal.',
    '«De» suele ser multiplicación: (2/5)×40.'
  ],
  [
    'Sumar numeradores y denominadores por separado.',
    'Olvidar el denominador común.',
    'Invertir sin que lo pidan.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '1/2 + 1/3',
    pasos: ['1) mcm(2,3)=6.', '2) 3/6+2/6.', '3) 5/6.'],
    respuesta: '5/6',
    contraste: null
  },
  [
    q('tr_frac_01', '1/2+1/3=', ['A) 2/5', 'B) 5/6', 'C) 1/5', 'D) 2/6'], 'B',
      { A: 'Sumaste arriba y abajo.', C: 'Procedimiento invertido.', D: 'Incompleto.' },
      '3/6+2/6=5/6.'),
    q('tr_frac_02', '(2/5) de 40=', ['A) 20', 'B) 16', 'C) 8', 'D) 10'], 'B',
      { A: 'Usaste 1/2.', C: 'Solo 1/5.', D: '1/4.' },
      '16.'),
    q('tr_frac_03', 'Mayor: 3/4 o 5/8?', ['A) 5/8', 'B) 3/4', 'C) Iguales', 'D) No comparables'], 'B',
      { A: '5/8=0,625<0,75.', C: '3/4=6/8>5/8.', D: 'Sí se comparan.' },
      '3/4 mayor.'),
    q('tr_frac_04', 'Simplifica 8/12:', ['A) 4/6', 'B) 2/3', 'C) 8/3', 'D) 3/2'], 'B',
      { A: 'Aún simplificable.', C: 'No es simplificar.', D: 'Recíproco.' },
      'mcd=4 → 2/3.')
  ],
  'mcm, equivalencia y “de” como producto.'
);

C.proporcionalidad = pack(
  'Magnitudes directamente proporcionales crecen juntas en la misma razón. Inversas: al subir una baja la otra y el producto se conserva.',
  [
    'Clasifica: más→más (directa) o más→menos (inversa).',
    'Directa a/b=c/d; inversa a·b=c·d.',
    'Convierte unidades antes.'
  ],
  [
    'Tratar inversa como directa.',
    'Sumar en vez de usar la razón.',
    'Olvidar conversiones de tiempo.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '4 obreros · 6 días. ¿Días con 3?',
    pasos: ['1) Inversa: personas×días constante.', '2) 4×6=24.', '3) 24/3=8.'],
    respuesta: '8 días',
    contraste: null
  },
  [
    q('tr_prop_01', '4 obreros·6 días → con 3:', ['A) 4,5', 'B) 8', 'C) 12', 'D) 2'], 'B',
      { A: 'La trataste directa.', C: 'Mal producto.', D: 'Con menos gente tarda más.' },
      '24/3=8.'),
    q('tr_prop_02', '5 cuadernos=20000. ¿7?', ['A) 28000', 'B) 25000', 'C) 14000', 'D) 35000'], 'A',
      { B: 'Suma sin unitario.', C: 'Razón invertida.', D: 'De más.' },
      '4000×7.'),
    q('tr_prop_03', '120 km en 2 h → en 3 h:', ['A) 150', 'B) 180', 'C) 240', 'D) 60'], 'B',
      { A: 'Suma arbitraria.', C: 'Duplicaste 120.', D: '1 h.' },
      '60 km/h×3.'),
    q('tr_prop_04', 'Si al duplicar obreros el tiempo se reduce a la mitad (mismo trabajo), es:', ['A) directa', 'B) inversa', 'C) aleatoria', 'D) geométrica forzada'], 'B',
      { A: 'Directa crecería juntas.', C: 'Hay regla.', D: 'No aplica.' },
      'Producto constante.')
  ],
  'Regla de tres directa e inversa.'
);

function skillPack(nombre, definicion, pasos, errores, ejEnun, ejPasos, ejResp, prac) {
  return pack(definicion, pasos, errores, {
    titulo: 'Ejemplo resuelto',
    enunciado: ejEnun,
    pasos: ejPasos,
    respuesta: ejResp,
    contraste: null
  }, prac, `Profundiza en «${nombre}» con ejemplos nuevos del mismo esquema.`);
}

C.inferencia = skillPack(
  'inferencias válidas',
  'Una inferencia válida extrae algo que se sigue del texto sin inventar datos externos. Si el texto no lo sostiene, no es inferencia válida.',
  ['Localiza pistas textuales.', 'Formula lo que se sigue.', 'Descarta lo que el texto no autoriza.'],
  ['Inventar causas no dichas.', 'Confundir opinión propia con inferencia.', 'Generalizar más allá del párrafo.'],
  'Texto: «Ana salió con paraguas; la calle estaba mojada.» Inferencia razonable:',
  ['1) Hay indicios de lluvia o piso húmedo.', '2) No afirma el color del paraguas.', '3) Inferencia: probablemente llovió o llovía.'],
  'Probablemente había lluvia / piso mojado por lluvia',
  [
    q('tr_inf_01', 'Inferencia válida debe:', ['A) contradecir el texto', 'B) seguirse de pistas del texto', 'C) ignorar el texto', 'D) ser solo un rumor'], 'B',
      { A: 'Contradicción no vale.', C: 'Sin texto no hay inferencia del ítem.', D: 'Sin apoyo.' },
      'Se sigue del texto.'),
    q('tr_inf_02', '«El termómetro marca 39 °C.» Inferencia clínica básica en contexto escolar típico:', ['A) hay fiebre probable', 'B) es invierno en Europa necesariamente', 'C) el aparato está en la Luna', 'D) no significa nada'], 'A',
      { B: 'No se deduce el continente.', C: 'Absurdo.', D: 'Sí hay lectura.' },
      '39 °C sugiere fiebre.'),
    q('tr_inf_03', 'No es inferencia válida:', ['A) lo que el texto implica', 'B) un dato que el texto nunca sugiere', 'C) una conclusión con apoyo', 'D) una lectura de una pista'], 'B',
      { A: 'Sí es.', C: 'Sí es.', D: 'Sí es.' },
      'Sin apoyo = inválida.'),
    q('tr_inf_04', 'Para validar una inferencia:', ['A) citas la pista', 'B) inventas un final', 'C) cambias el tema', 'D) miras solo la opción más larga'], 'A',
      { B: 'Invención.', C: 'Fuera de foco.', D: 'Longitud ≠ verdad.' },
      'Apoyo textual.')
  ]
);

C.comprension_literal = skillPack(
  'comprensión literal',
  'La comprensión literal recupera información explícita: nombres, cifras, hechos dichos tal cual en el texto.',
  ['Subraya el dato pedido.', 'Contrasta con cada opción.', 'Elige la que reproduce el texto.'],
  ['Inferir de más.', 'Cambiar una cifra.', 'Confundir un personaje con otro.'],
  'Texto: «La reunión es a las 8 a. m. en el aula 2.» ¿Hora?',
  ['1) El texto dice 8 a. m.', '2) Lugar es otro dato.', '3) Respuesta literal: 8 a. m.'],
  '8 a. m.',
  [
    q('tr_lit_01', 'Literal significa:', ['A) inventar el final', 'B) recuperar lo dicho explícitamente', 'C) solo opinar', 'D) ignorar cifras'], 'B',
      { A: 'Eso no es literal.', C: 'Opinión ≠ literal.', D: 'Las cifras cuentan.' },
      'Dato explícito.'),
    q('tr_lit_02', 'Si el texto dice “tres días”, la respuesta literal no es:', ['A) tres días', 'B) una semana inventada', 'C) tres días de plazo', 'D) el mismo dato'], 'B',
      { A: 'Correcto literal.', C: 'Puede ser paráfrasis fiel.', D: 'Correcto.' },
      'No inventes.'),
    q('tr_lit_03', 'La clave literal está:', ['A) fuera del texto', 'B) en una oración del texto', 'C) solo en tu memoria de otra obra', 'D) en la opción más corta siempre'], 'B',
      { A: 'No.', C: 'Puede despistar.', D: 'No.' },
      'En el texto.'),
    q('tr_lit_04', 'Paráfrasis literal válida:', ['A) cambia el sentido', 'B) dice lo mismo con otras palabras fieles', 'C) agrega un final nuevo', 'D) niega el dato'], 'B',
      { A: 'Invalida.', C: 'Añadido.', D: 'Contradicción.' },
      'Mismo sentido.')
  ]
);

// ——— Inglés, lectura y sociales: contenido real (no meta-estrategia) ———
C.cloze = pack(
  'En inglés, el hueco de una oración se completa con la forma que concuerda con el sujeto y con las pistas de tiempo. Yesterday / last week → pasado simple; since / for + resultado presente → present perfect; he/she/it en presente añade -s.',
  [
    'Busca marcas de tiempo (yesterday, now, since, tomorrow).',
    'Mira el sujeto: I/you/we/they vs he/she/it.',
    'Elige el tiempo y la forma (afirmativa, negativa o interrogativa) que encajan juntos.'
  ],
  [
    'Usar present simple con yesterday.',
    'Olvidar la -s de he/she/it en presente.',
    'Elegir un infinitivo cuando la estructura pide -ing o pasado.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'She _____ to the library yesterday.',
    pasos: [
      '1) yesterday = pasado.',
      '2) Sujeto she → verbo en pasado: went (go → went).',
      '3) No uses goes (presente) ni going (sin auxiliar).'
    ],
    respuesta: 'went',
    contraste: null
  },
  [
    q('tr_cloze_01', 'They _____ soccer every Saturday.', ['A) plays', 'B) play', 'C) playing', 'D) played yesterday'], 'B',
      { A: 'plays es para he/she/it.', C: 'Falta auxiliar (are playing).', D: 'yesterday contradice every Saturday.' },
      'They + present simple = play.'),
    q('tr_cloze_02', 'He _____ here since 2020.', ['A) lives', 'B) lived', 'C) has lived', 'D) living'], 'C',
      { A: 'Presente simple no marca since.', B: 'Pasado corto no cubre desde 2020 hasta ahora.', D: 'Falta has/is.' },
      'since → present perfect: has lived.'),
    q('tr_cloze_03', 'I _____ my homework last night.', ['A) do', 'B) does', 'C) did', 'D) doing'], 'C',
      { A: 'do es presente.', B: 'does es he/she.', D: 'doing necesita auxiliar.' },
      'last night → did.'),
    q('tr_cloze_04', 'We _____ to the museum tomorrow.', ['A) go', 'B) went', 'C) are going', 'D) gone'], 'C',
      { A: 'go no marca futuro planificado.', B: 'went es pasado.', D: 'gone es participio.' },
      'tomorrow + plan → are going.')
  ],
  'Practica tiempos: past, present, present perfect y futuros con marcas de tiempo.'
);

C.grammar = pack(
  'La gramática del examen pide la estructura correcta: tiempo verbal, concordancia sujeto-verbo, orden de palabras y formas en negativo/pregunta (do/does/did, don\'t/doesn\'t).',
  [
    'Identifica si la oración es presente, pasado o perfect.',
    'Asegura que el verbo concuerde con el sujeto.',
    'En preguntas/negativos, coloca el auxiliar en el lugar correcto.'
  ],
  [
    'She go / They goes.',
    'Did she went…? (doble pasado).',
    'Poner el adverbio rompiendo el auxiliar (She doesn\'t never…).'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '_____ she finish the project last week?',
    pasos: ['1) last week = pasado.', '2) Pregunta en pasado: Did + sujeto + verbo base.', '3) Did she finish…? (no finished).'],
    respuesta: 'Did she finish…?',
    contraste: null
  },
  [
    q('tr_gr_01', 'My brother _____ English well.', ['A) speak', 'B) speaks', 'C) speaking', 'D) spoken'], 'B',
      { A: 'Falta -s con he.', C: 'Falta is/are.', D: 'Participio sin auxiliar.' },
      'he/she → speaks.'),
    q('tr_gr_02', 'They _____ not like coffee.', ['A) does', 'B) do', 'C) didn\'t never', 'D) is'], 'B',
      { A: 'does es singular.', C: 'Doble negación / mezcla.', D: 'is no niega like.' },
      'They do not / don\'t.'),
    q('tr_gr_03', '_____ you see the movie yesterday?', ['A) Do', 'B) Does', 'C) Did', 'D) Are'], 'C',
      { A: 'Do + yesterday no.', B: 'Does es he/she.', D: 'Are no forma pasado de see.' },
      'Did + verbo base.'),
    q('tr_gr_04', 'She _____ already left.', ['A) have', 'B) has', 'C) having', 'D) haded'], 'B',
      { A: 'have con I/you/we/they.', C: 'Forma -ing incompleta.', D: 'No existe haded.' },
      'She has already left.')
  ],
  'Repasa concordancia y auxiliares do/does/did/have/has.'
);

C.vocabulario = pack(
  'El vocabulario en contexto se decide por la oración completa: sinónimos, colocaciones (make a decision, take a bus) y el registro (formal/informal). No elijas la primera acepción del diccionario si no encaja.',
  [
    'Lee la oración entera y qué pedía el hueco (verbo, sustantivo, adjetivo).',
    'Descarta opciones que cambian el sentido o la colocación.',
    'Quédate con la palabra que suena natural en ese contexto.'
  ],
  [
    'Elegir un sinónimo que no colocaciona (do a decision).',
    'Ignorar el tono (muy informal en un aviso serio).',
    'Traducir palabra por palabra desde el español.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Please _____ a decision before Friday.',
    pasos: ['1) Colocación inglesa: make a decision.', '2) take/do no son la colocación estándar aquí.', '3) Respuesta: make.'],
    respuesta: 'make',
    contraste: null
  },
  [
    q('tr_voc_01', 'She _____ the bus to school.', ['A) makes', 'B) takes', 'C) does', 'D) puts'], 'B',
      { A: 'make the bus no es colocación.', C: 'do the bus no.', D: 'put the bus no.' },
      'take the bus.'),
    q('tr_voc_02', 'The movie was so _____ that I cried.', ['A) funny', 'B) moving', 'C) bored', 'D) short only'], 'B',
      { A: 'funny hace reír, no llorar.', C: 'bored describe a la persona.', D: 'short no explica el llanto.' },
      'moving = emotivo.'),
    q('tr_voc_03', 'He gave me some useful _____.', ['A) advices', 'B) advice', 'C) advise', 'D) advising'], 'B',
      { A: 'advice es incontable (sin -s).', C: 'advise es verbo.', D: 'gerundio no cabe.' },
      'advice (uncountable).'),
    q('tr_voc_04', 'We need to _____ the problem carefully.', ['A) look', 'B) watch', 'C) examine', 'D) see at'], 'C',
      { A: 'look necesita at/into.', B: 'watch es observar en el tiempo.', D: 'see at no es natural.' },
      'examine the problem.')
  ],
  'Aprende colocaciones frecuentes: make/take/do/have + sustantivo.'
);

C.dialogo = pack(
  'En un diálogo, cada turno responde al anterior: saludos, peticiones, rechazos o acuerdos. La clave está en qué acaba de decir el interlocutor y qué se espera como reacción natural.',
  [
    'Lee el último turno antes del hueco.',
    'Decide la función: aceptar, rechazar, preguntar, disculparse.',
    'Elige la réplica que encaja en tono y contenido.'
  ],
  [
    'Responder “Yes, I am” a “How are you?”.',
    'Ignorar un “Would you like…?” y hablar de otro tema.',
    'Usar un registro grosero cuando el diálogo es formal.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'A: “Could you open the window?” B: _____',
    pasos: ['1) Es una petición cortés.', '2) Respuesta natural: “Sure.” / “Of course.”', '3) No: “I am 15 years old.”'],
    respuesta: 'Sure. / Of course.',
    contraste: null
  },
  [
    q('tr_dia_01', 'A: “How are you?” B: _____', ['A) I am fine, thanks.', 'B) Yes, I am.', 'C) I am student.', 'D) Open the door.'], 'A',
      { B: 'Yes, I am responde a Are you…?', C: 'No responde al saludo.', D: 'Es una orden.' },
      'How are you → I am fine.'),
    q('tr_dia_02', 'A: “Would you like some water?” B: _____', ['A) Yes, please.', 'B) I am water.', 'C) Yesterday.', 'D) She goes.'], 'A',
      { B: 'No tiene sentido.', C: 'No responde la oferta.', D: 'Gramática ajena.' },
      'Oferta → Yes, please / No, thanks.'),
    q('tr_dia_03', 'A: “Sorry I\'m late.” B: _____', ['A) No problem.', 'B) I am late too always never.', 'C) What time is book?', 'D) Play soccer.'], 'A',
      { B: 'Malformado.', C: 'Cambia de tema.', D: 'Irrelevante.' },
      'Disculpa → No problem / That\'s OK.'),
    q('tr_dia_04', 'A: “Where is the library?” B: _____', ['A) It\'s next to the cafeteria.', 'B) I am library.', 'C) Yes, I do.', 'D) Because.'], 'A',
      { B: 'No localiza.', C: 'Responde a Do you…?', D: 'Conector suelto.' },
      'Where → lugar.')
  ],
  'Practica pares: petición/oferta/disculpa/ubicación.'
);

C.aviso = pack(
  'Los avisos e instrucciones en inglés usan imperativos (Keep quiet), modales de obligación (must, should) y prohibiciones (Do not / No + -ing). Lee la condición (place/time) antes de elegir.',
  [
    'Identifica si ordena, prohíbe o informa.',
    'Atiende el lugar o la hora del aviso.',
    'Elige la opción que cumple la instrucción, no una paráfrasis contraria.'
  ],
  [
    'Leer “No smoking” como permiso para fumar.',
    'Ignorar “after 6 p.m.”.',
    'Confundir must con might.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Sign: “Do not enter after 8 p.m.” What does it mean?',
    pasos: ['1) Do not enter = prohibición.', '2) after 8 p.m. = condición de tiempo.', '3) No se puede entrar después de las 8.'],
    respuesta: 'Entry is forbidden after 8 p.m.',
    contraste: null
  },
  [
    q('tr_av_01', '“Keep the door closed.” means:', ['A) Leave the door open', 'B) The door should stay closed', 'C) Break the door', 'D) Ignore the door'], 'B',
      { A: 'Es lo contrario.', C: 'No lo dice.', D: 'No.' },
      'Keep = mantener cerrada.'),
    q('tr_av_02', '“No food in the lab.” means:', ['A) You may eat here', 'B) Food is not allowed in the lab', 'C) Only teachers eat', 'D) Buy food now'], 'B',
      { A: 'Contradice No.', C: 'No lo limita a teachers.', D: 'No es una orden de compra.' },
      'No + noun = prohibición.'),
    q('tr_av_03', '“Please turn off your phones.” is:', ['A) a suggestion to keep phones on', 'B) a polite instruction to switch phones off', 'C) a weather report', 'D) a math problem'], 'B',
      { A: 'Off ≠ on.', C: 'No.', D: 'No.' },
      'turn off = apagar.'),
    q('tr_av_04', '“Staff only.” means:', ['A) Anyone can enter', 'B) Only workers may enter', 'C) Students must enter', 'D) Closed forever'], 'B',
      { A: 'Contradice only.', C: 'No dice students.', D: 'No afirma cierre eterno.' },
      'Staff only = solo personal.')
  ],
  'Repasa imperativos y No + -ing / No + noun.'
);

C.lectura = pack(
  'En comprensión de lectura en inglés identificas la idea principal, un detalle explícito o el propósito del autor. La respuesta correcta está apoyada por una o más oraciones del texto, no por tu opinión general.',
  [
    'Lee el texto completo una vez.',
    'Subraya la frase que responde exactamente a la pregunta.',
    'Descarta opciones que agregan datos que el texto no dice.'
  ],
  [
    'Elegir un detalle verdadero pero que no responde la pregunta.',
    'Inventar una causa que el texto no menciona.',
    'Confundir el título con la idea principal si el texto dice otra cosa.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Text: “Ana walks to school because the bus is expensive.” Why does Ana walk?',
    pasos: ['1) La pregunta pide la causa.', '2) El texto dice because the bus is expensive.', '3) No inventes “she likes exercise” si no está.'],
    respuesta: 'Because the bus is expensive',
    contraste: null
  },
  [
    q('tr_lec_01', 'Text: “The museum opens at 9.” When does it open?', ['A) At 9', 'B) At noon', 'C) At night only', 'D) Never'], 'A',
      { B: 'No está en el texto.', C: 'No.', D: 'No.' },
      'Dato literal: 9.'),
    q('tr_lec_02', 'Text: “Tom studies at night to avoid noise.” Main idea:', ['A) Tom studies at night to avoid noise', 'B) Tom hates books', 'C) Night is always silent everywhere', 'D) Tom is a teacher'], 'A',
      { B: 'No lo dice.', C: 'Generaliza de más.', D: 'No lo dice.' },
      'Idea = lo que el texto sostiene.'),
    q('tr_lec_03', 'Purpose of “Buy tickets online to save time.”', ['A) To entertain with a joke', 'B) To advise saving time by buying online', 'C) To describe a mountain', 'D) To ask a math question'], 'B',
      { A: 'No es humor.', C: 'No.', D: 'No.' },
      'Propósito = aconsejar.'),
    q('tr_lec_04', 'Text: “Only members may enter.” Who may enter?', ['A) Anyone', 'B) Members only', 'C) Children only', 'D) Tourists only'], 'B',
      { A: 'Only lo niega.', C: 'No dice children.', D: 'No dice tourists.' },
      'Only members.')
  ],
  'Practica: main idea, detail y purpose con textos cortos.'
);

C.literal_reading = pack(
  'La lectura literal en inglés recupera lo que el texto dice palabra por palabra: nombres, cifras, lugares y hechos explícitos. No infieras más de lo escrito.',
  [
    'Localiza en el texto la misma información que pide la pregunta.',
    'Copia el dato sin cambiarlo.',
    'Rechaza opciones que cambian un número o un nombre.'
  ],
  [
    'Cambiar 3 days por a week.',
    'Inferir emociones no dichas.',
    'Usar conocimiento general en vez del texto.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '“The train leaves at 6:30 a.m.” What time does it leave?',
    pasos: ['1) Dato explícito: 6:30 a.m.', '2) No inventes 7:00.', '3) Respuesta: 6:30 a.m.'],
    respuesta: '6:30 a.m.',
    contraste: null
  },
  [
    q('tr_lit_en_01', '“Luisa bought two maps.” How many maps?', ['A) One', 'B) Two', 'C) Three', 'D) None'], 'B',
      { A: 'El texto dice two.', C: 'No.', D: 'No.' },
      'two maps.'),
    q('tr_lit_en_02', '“The class starts at 7.” When?', ['A) At 7', 'B) At 8', 'C) At noon', 'D) At midnight'], 'A',
      { B: 'No está.', C: 'No.', D: 'No.' },
      'at 7.'),
    q('tr_lit_en_03', '“Pedro lives in Tunja.” Where?', ['A) Bogotá', 'B) Tunja', 'C) Miami', 'D) Not said as a city'], 'B',
      { A: 'Otro lugar.', C: 'No.', D: 'Sí lo dice: Tunja.' },
      'Tunja.'),
    q('tr_lit_en_04', '“There are 5 chairs.” How many chairs?', ['A) 4', 'B) 5', 'C) 15', 'D) 50'], 'B',
      { A: 'Mal conteo.', C: 'No.', D: 'No.' },
      '5.')
  ],
  'Busca el dato exacto en el texto.'
);

C.inferential_reading = pack(
  'La lectura inferencial en inglés concluye algo que el texto implica con pistas, sin citarlo literalmente. La inferencia válida siempre puede señalar una o dos frases de apoyo.',
  [
    'Junta las pistas del texto.',
    'Formula lo que se sigue con lógica.',
    'Descarta conclusiones que el texto no autoriza.'
  ],
  [
    'Inventar un final dramático.',
    'Confundir opinión personal con inferencia.',
    'Generalizar “always/never” sin base.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '“Maya took her umbrella. The streets were wet.” What can we infer?',
    pasos: ['1) Umbrella + wet streets → probablemente llovió o llovía.', '2) No afirma el color del paraguas.', '3) Inferencia: it was raining / had rained.'],
    respuesta: 'It was probably raining',
    contraste: null
  },
  [
    q('tr_inf_en_01', '“Sam put on a coat and gloves.” Infer:', ['A) It is likely cold outside', 'B) Sam is swimming', 'C) It is a math class', 'D) Sam sold the house'], 'A',
      { B: 'Coat/gloves ≠ swimming.', C: 'No.', D: 'No.' },
      'Abrigo + guantes → frío.'),
    q('tr_inf_en_02', '“The lights went out and people lit candles.” Infer:', ['A) There was probably a power cut', 'B) They hate candles', 'C) It was noon at the beach', 'D) They finished a marathon only'], 'A',
      { B: 'No.', C: 'No encaja.', D: 'No lo dice.' },
      'Lights out → apagón.'),
    q('tr_inf_en_03', 'A valid inference must:', ['A) Contradict the text', 'B) Be supported by clues in the text', 'C) Ignore the text', 'D) Be a random rumor'], 'B',
      { A: 'No.', C: 'No.', D: 'No.' },
      'Apoyo textual.'),
    q('tr_inf_en_04', '“Lia closed the book and smiled.” Weak inference:', ['A) She may feel satisfied', 'B) She definitely bought a car', 'C) She finished reading for now', 'D) She stopped reading that moment'], 'B',
      { A: 'Plausible.', C: 'Plausible.', D: 'Plausible.' },
      'Car is not supported.')
  ],
  'Pista + lógica = inferencia; sin pista = inválida.'
);

C.articulacion_global = pack(
  'La articulación global del texto es el hilo que une párrafos: tesis, conectores (además, sin embargo, por eso) y repetición de ideas clave. Entender el conjunto evita quedarte en una sola frase suelta.',
  [
    'Busca la tesis o idea que se sostiene a lo largo del texto.',
    'Marca conectores que suman, contrastan o concluyen.',
    'Explica cómo un párrafo prepara al siguiente.'
  ],
  [
    'Leer solo el primer renglón y generalizar.',
    'Ignorar un “sin embargo” que cambia el sentido.',
    'Confundir un ejemplo local con la tesis global.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'P1 habla de contaminación; P2 dice “Sin embargo, hay soluciones locales.” ¿Qué hace el conector?',
    pasos: ['1) Sin embargo = contraste.', '2) No niega el problema: introduce otro enfoque.', '3) Articula problema → matiz/solución.'],
    respuesta: 'Contrasta y abre el matiz de las soluciones',
    contraste: null
  },
  [
    q('tr_art_01', 'Un conector “por lo tanto” suele:', ['A) Introducir una conclusión', 'B) Negar el texto entero', 'C) Pedir comida', 'D) Cambiar de idioma'], 'A',
      { B: 'No niega todo.', C: 'No.', D: 'No.' },
      'por lo tanto = conclusión.'),
    q('tr_art_02', 'La tesis de un texto es:', ['A) La idea central que se sostiene', 'B) Cualquier fecha suelta', 'C) Solo el tipógrafo', 'D) Una pregunta sin respuesta obligatoria'], 'A',
      { B: 'Detalle.', C: 'No.', D: 'Puede abrir, no es tesis.' },
      'Tesis = idea central.'),
    q('tr_art_03', 'Si el párrafo 2 contradice al 1 con “pero”, la lectura global debe:', ['A) Ignorar el 2', 'B) Integrar el contraste', 'C) Borrar el 1', 'D) Inventar un tercer tema'], 'B',
      { A: 'Pierdes el sentido.', C: 'No.', D: 'No.' },
      'Integrar contraste.'),
    q('tr_art_04', 'Un ejemplo en medio del texto normalmente:', ['A) Ilustra la idea en curso', 'B) Cambia de asignatura solo', 'C) Anula la tesis siempre', 'D) Es la bibliografía'], 'A',
      { B: 'No.', C: 'No siempre anula.', D: 'No.' },
      'Ejemplo = apoyo.')
  ],
  'Sigue el hilo: tesis + conectores + ejemplos.'
);

C.evaluacion_critica = pack(
  'Evaluar críticamente un texto es juzgar si las razones bastan: ¿hay evidencia?, ¿hay sesgo?, ¿se exagera? No basta con entender: hay que valorar la solidez.',
  [
    'Separa afirmación y prueba.',
    'Pregunta qué falta (datos, fuentes, contraejemplos).',
    'Decide si la conclusión está justificada.'
  ],
  [
    'Aceptar una generalización con un solo caso.',
    'Confundir opinión con dato.',
    'Atacar a la persona en vez del argumento.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '“Todos odian el parque porque Ana se cayó.” ¿Qué falla?',
    pasos: ['1) De un caso (Ana) salta a “todos”.', '2) Falta evidencia de mayoría.', '3) Evaluación: generalización apresurada; la conclusión no se sostiene.'],
    respuesta: 'Generalización con un solo caso',
    contraste: null
  },
  [
    q('tr_ev_01', 'Una conclusión sólida necesita:', ['A) Pruebas suficientes', 'B) Solo un grito', 'C) Ignorar datos', 'D) Cambiar de tema'], 'A',
      { B: 'No es prueba.', C: 'Debilita.', D: 'No evalúa.' },
      'Evidencia.'),
    q('tr_ev_02', 'Un sesgo aparece cuando:', ['A) Se omiten datos que contradicen la tesis', 'B) Se citan fuentes claras', 'C) Se define un término', 'D) Se corrige un error'], 'A',
      { B: 'Eso es buen apoyo.', C: 'No es sesgo.', D: 'Eso mejora.' },
      'Omisión interesada.'),
    q('tr_ev_03', '“Lo dijo un famoso, entonces es verdad.” Fallo:', ['A) Autoridad mal usada', 'B) Definición perfecta', 'C) Dato estadístico', 'D) Silogismo válido'], 'A',
      { B: 'No.', C: 'No hay cifra.', D: 'No es silogismo.' },
      'Autoridad ≠ prueba.'),
    q('tr_ev_04', 'Para criticar un argumento debes:', ['A) Revisar razones y evidencia', 'B) Insultar al autor', 'C) Ignorar el texto', 'D) Cambiar la pregunta'], 'A',
      { B: 'Ad hominem.', C: 'No.', D: 'No.' },
      'Razones + evidencia.')
  ],
  'Afirmación vs prueba; detecta sesgos y saltos.'
);

C.dos_textos = pack(
  'Comparar dos textos es hallar acuerdos, desacuerdos y matices: qué sostiene cada uno, con qué evidencias y dónde se cruzan o se oponen.',
  [
    'Resume la tesis de A y la de B por separado.',
    'Marca un punto en común y uno en conflicto.',
    'Responde exactamente lo que pide: acuerdo, contraste o ambos.'
  ],
  [
    'Mezclar citas de A como si fueran de B.',
    'Decir que “dicen lo mismo” cuando hay contraste claro.',
    'Elegir un detalle irrelevante para ambos.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'A: “El recreo debe alargarse.” B: “El recreo está bien; hay que reforzar matemáticas.” ¿Desacuerdo?',
    pasos: ['1) A quiere más recreo.', '2) B prioriza otra cosa y no pide alargar.', '3) Desacuerdo sobre alargar el recreo.'],
    respuesta: 'Desacuerdo sobre alargar el recreo',
    contraste: null
  },
  [
    q('tr_dos_01', 'Si A y B afirman la misma causa, hay:', ['A) Acuerdo', 'B) Insulto', 'C) Silencio', 'D) Solo un título'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Misma causa = acuerdo.'),
    q('tr_dos_02', 'Para contrastar debes:', ['A) Señalar en qué difieren las tesis', 'B) Ignorar B', 'C) Copiar solo adjetivos', 'D) Inventar un tercer texto'], 'A',
      { B: 'No comparas.', C: 'Insuficiente.', D: 'No.' },
      'Diferencias de tesis.'),
    q('tr_dos_03', 'Un punto de encuentro es:', ['A) Una idea que ambos aceptan', 'B) Una fecha falsa', 'C) Un error tipográfico', 'D) La opción más larga'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Acuerdo parcial.'),
    q('tr_dos_04', 'Error típico al comparar:', ['A) Atribuir a A lo que solo dice B', 'B) Leer ambos', 'C) Anotar tesis', 'D) Buscar evidencias'], 'A',
      { B: 'Eso ayuda.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
      'No cruzar autores.')
  ],
  'Tesis A vs tesis B: acuerdo y contraste.'
);

C.textos_discontinuos = pack(
  'Tablas, avisos y gráficas se leen por estructura: título, ejes, filas/columnas y unidades. La respuesta sale de cruzar la pregunta con la celda o barra correcta.',
  [
    'Lee el título y las unidades.',
    'Ubica la fila/columna o el punto del eje que pide la pregunta.',
    'Compara valores si pide “mayor”, “menor” o “diferencia”.'
  ],
  [
    'Leer mal el eje (confundir % con cantidad).',
    'Tomar la barra vecina.',
    'Ignorar una nota al pie que cambia la lectura.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Tabla: Lun 4 préstamos, Mar 6. ¿Qué día tuvo más?',
    pasos: ['1) Compara 4 y 6.', '2) Martes es mayor.', '3) Respuesta: martes.'],
    respuesta: 'Martes',
    contraste: null
  },
  [
    q('tr_td_01', 'Si una barra llega más alto en “Andina”, esa región:', ['A) Tiene el valor mayor en esa gráfica', 'B) No existe', 'C) Siempre es la capital', 'D) Es un verbo'], 'A',
      { B: 'No.', C: 'No lo implica.', D: 'No.' },
      'Altura = valor.'),
    q('tr_td_02', 'Una escala 1:50.000 en mapa indica:', ['A) Relación papel–realidad', 'B) Población', 'C) Color político', 'D) Temperatura'], 'A',
      { B: 'No es demografía.', C: 'No.', D: 'No.' },
      'Escala = proporción.'),
    q('tr_td_03', 'Para leer una celda debes cruzar:', ['A) Fila y columna', 'B) Solo el tipógrafo', 'C) El clima', 'D) La portada del libro'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Fila × columna.'),
    q('tr_td_04', 'Si pide la diferencia entre 20 y 12:', ['A) 8', 'B) 32', 'C) 20', 'D) 12'], 'A',
      { B: 'Sumaste.', C: 'Un extremo.', D: 'Un extremo.' },
      '20−12=8.')
  ],
  'Título, ejes, celdas: cruza pregunta y dato.'
);

C.filosofia = pack(
  'En textos con ideas éticas o filosóficas identificas valores (justicia, libertad, deber), dilemas y la tesis moral que el autor sostiene o cuestiona.',
  [
    'Nombra el valor o principio en juego.',
    'Separa el caso concreto de la norma general.',
    'Elige la opción que expresa esa idea ética, no un dato lateral.'
  ],
  [
    'Reducir el texto a una anécdota sin el valor.',
    'Confundir legalidad con moralidad si el texto las distingue.',
    'Atribuir al autor una tesis opuesta.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Texto: “Mentir para salvar una vida puede ser un deber.” ¿Qué idea ética destaca?',
    pasos: ['1) Hay un conflicto verdad vs vida.', '2) El autor prioriza salvar la vida como deber.', '3) No es solo “mentir es malo” sin matices.'],
    respuesta: 'El deber de preservar la vida puede primar',
    contraste: null
  },
  [
    q('tr_fil_01', 'Un dilema ético presenta:', ['A) Dos valores en tensión', 'B) Solo una suma', 'C) Un mapa', 'D) Una conjugación'], 'A',
      { B: 'Mate.', C: 'Geo.', D: 'Gramática.' },
      'Tensión de valores.'),
    q('tr_fil_02', '“Debes tratar a otros como quieres que te traten” expresa:', ['A) Una regla de reciprocidad moral', 'B) Una fórmula química', 'C) Un horario', 'D) Una capital'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Reciprocidad.'),
    q('tr_fil_03', 'Si el texto distingue ley y justicia, no debes:', ['A) Igualarlas automáticamente', 'B) Leer la distinción', 'C) Citar el texto', 'D) Nombrar el valor'], 'A',
      { B: 'Eso ayuda.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
      'No las fusiones.'),
    q('tr_fil_04', 'La tesis moral es:', ['A) Lo que el texto sostiene sobre lo correcto/incorrecto', 'B) Solo el nombre del autor', 'C) La tipografía', 'D) Un porcentaje suelto'], 'A',
      { B: 'No basta.', C: 'No.', D: 'No.' },
      'Tesis moral.')
  ],
  'Valores, dilemas y tesis moral del texto.'
);

C.pragmatica = pack(
  'La intención comunicativa responde a para qué se dice algo: informar, pedir, ironizar, advertir o persuadir. El mismo enunciado cambia de función según la situación.',
  [
    'Mira la situación (quién habla a quién).',
    'Clasifica el acto: pregunta, orden, consejo, amenaza suave, etc.',
    'Elige la opción que nombra esa intención.'
  ],
  [
    'Leer una ironía como dato literal.',
    'Tomar una pregunta retórica como petición de dato.',
    'Ignorar el tono de un aviso.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'En una fila: “¿Trajiste el día completo?” dicho con sarcasmo por llegar tarde.',
    pasos: ['1) No pide el clima del día.', '2) Critica la tardanza.', '3) Intención: reclamo / ironía.'],
    respuesta: 'Ironía / reclamo por la tardanza',
    contraste: null
  },
  [
    q('tr_prag_01', '“¿Puedes pasarme la sal?” en la mesa suele ser:', ['A) Una petición cortés', 'B) Una definición de sal', 'C) Un mapa', 'D) Una ecuación'], 'A',
      { B: 'No define.', C: 'No.', D: 'No.' },
      'Petición.'),
    q('tr_prag_02', 'Un anuncio “No pisar el césped” pretende:', ['A) Prohibir / advertir', 'B) Contar un chiste solo', 'C) Enseñar álgebra', 'D) Pedir un autógrafo'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Advertencia.'),
    q('tr_prag_03', 'La ironía ocurre cuando:', ['A) Se dice lo contrario de lo que se quiere criticar', 'B) Se cita una fecha', 'C) Se suma 2+2', 'D) Se nombra un río'], 'A',
      { B: 'Literal.', C: 'Mate.', D: 'Geo.' },
      'Contrario + crítica.'),
    q('tr_prag_04', '“Te felicito…” dicho tras un error grave puede ser:', ['A) Sarcasmo', 'B) Una capital', 'C) Un climograma', 'D) Un mcm'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Sarcasmo.')
  ],
  '¿Para qué se dice? Informar, pedir, ironizar, advertir.'
);

C.semantica = pack(
  'El significado en contexto depende de la oración: una misma palabra puede ser literal o figurada. Elige el sentido que hace coherente el párrafo.',
  [
    'Sustituye la palabra por cada opción y mira cuál mantiene el sentido.',
    'Atiende si el uso es figurado (metáfora).',
    'Descarta acepciones que rompen la lógica del texto.'
  ],
  [
    'Elegir la acepción más común aunque no calce.',
    'Ignorar comillas o tono figurado.',
    'Traducir palabra por palabra sin contexto.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '“La noticia me dejó helado.” ¿Qué significa helado aquí?',
    pasos: ['1) No habla de temperatura corporal real necesariamente.', '2) Uso figurado: sorprendido / impactado.', '3) Sentido contextual: asombro.'],
    respuesta: 'Sorprendido / impactado',
    contraste: null
  },
  [
    q('tr_sem_01', '“Paso de tortuga” en un trámite suele significar:', ['A) Muy lento', 'B) Un animal en la oficina', 'C) Un río', 'D) Una suma'], 'A',
      { B: 'Literal indebido.', C: 'No.', D: 'No.' },
      'Figurativo: lento.'),
    q('tr_sem_02', 'En “banco de datos”, banco es:', ['A) Conjunto/repositorio', 'B) Solo una silla', 'C) Un pez', 'D) Una capital'], 'A',
      { B: 'Otra acepción.', C: 'Otra acepción.', D: 'No.' },
      'Sentido técnico.'),
    q('tr_sem_03', 'Para fijar el sentido debes:', ['A) Mirar la oración completa', 'B) Cerrar el texto', 'C) Elegir al azar', 'D) Contar letras'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Contexto oracional.'),
    q('tr_sem_04', '“Corriente” en “agua corriente” significa:', ['A) Que fluye / disponible', 'B) Opinión política', 'C) Un examen', 'D) Un ángulo'], 'A',
      { B: 'Otra acepción.', C: 'No.', D: 'No.' },
      'Agua que fluye.')
  ],
  'Misma palabra, distinto sentido: manda el contexto.'
);

C.literatura = pack(
  'Los recursos literarios (metáfora, hipérbole, narrador, personificación) producen un efecto: embellecer, exagerar, acercar emociones. Identifica el recurso y para qué sirve en el fragmento.',
  [
    'Nombra el recurso (comparación, exageración, etc.).',
    'Explica el efecto en el lector.',
    'No lo leas solo como dato histórico si el ítem pide el recurso.'
  ],
  [
    'Llamar metáfora a una estadística.',
    'Ignorar el narrador en primera persona.',
    'Confundir hipérbole con literalidad.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: '“El sol sonreía sobre el valle.” ¿Qué recurso hay?',
    pasos: ['1) El sol no sonríe de verdad.', '2) Se le atribuye acción humana → personificación.', '3) Efecto: ambientar con calidez.'],
    respuesta: 'Personificación',
    contraste: null
  },
  [
    q('tr_lit_01', '“Te lo dije mil veces” es tipicamente:', ['A) Hipérbole', 'B) Un mapa', 'C) Una fórmula', 'D) Un climograma'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Exageración.'),
    q('tr_lit_02', '“Sus ojos eran dos luceros” es:', ['A) Metáfora', 'B) Acta notarial', 'C) Tabla de datos', 'D) Norma penal'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Metáfora.'),
    q('tr_lit_03', 'Un narrador en “yo” está en:', ['A) Primera persona', 'B) Solo tercera', 'C) Silencio total', 'D) Futuro gramatical obligatorio'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Primera persona.'),
    q('tr_lit_04', 'El efecto de la hipérbole suele ser:', ['A) Enfatizar por exageración', 'B) Medir un ángulo', 'C) Calcular un %,', 'D) Nombrar un afluente'], 'A',
      { B: 'Mate.', C: 'Mate.', D: 'Geo.' },
      'Énfasis.')
  ],
  'Recurso + efecto en el fragmento.'
);

C.analisis_textual = pack(
  'Analizar un texto es ver cómo está construido: partes, cohesión, repeticiones, citas y el procedimiento del autor (definir, argumentar, narrar).',
  [
    'Identifica la función del párrafo (introducir, ejemplificar, concluir).',
    'Marca mecanismos de cohesión (pronombres, sinónimos, conectores).',
    'Di qué procedimiento usa el autor.'
  ],
  [
    'Quedarse solo en el tema sin ver la estructura.',
    'Confundir un ejemplo con la tesis.',
    'Ignorar una cita y su función.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Un párrafo define un término y el siguiente da un ejemplo. ¿Qué hace el autor?',
    pasos: ['1) Primero define.', '2) Luego ilustra.', '3) Procedimiento: definición + ejemplificación.'],
    respuesta: 'Definir y luego ejemplificar',
    contraste: null
  },
  [
    q('tr_at_01', 'Un conector “en primer lugar” organiza:', ['A) Una secuencia', 'B) Un río', 'C) Un átomo', 'D) Un ángulo'], 'A',
      { B: 'Geo.', C: 'Química.', D: 'Mate.' },
      'Orden discursivo.'),
    q('tr_at_02', 'La cohesión se logra con:', ['A) Pronombres y repeticiones controladas', 'B) Borrar nexos', 'C) Cambiar de idioma al azar', 'D) Ignorar referencias'], 'A',
      { B: 'Rompe.', C: 'Rompe.', D: 'Rompe.' },
      'Cohesión.'),
    q('tr_at_03', 'Si un párrafo solo ilustra, su función es:', ['A) Ejemplificar', 'B) Legislar', 'C) Medir', 'D) Navegar'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Ejemplo.'),
    q('tr_at_04', 'Analizar el texto pregunta:', ['A) Cómo está construido', 'B) Solo la tipografía', 'C) El clima de Londres', 'D) El mcm'], 'A',
      { B: 'No basta.', C: 'No.', D: 'No.' },
      'Construcción.')
  ],
  'Estructura, cohesión y procedimiento del autor.'
);

C.analisis_imagen = pack(
  'Leer una imagen en el examen es relacionar lo que se ve (personas, objetos, símbolos, plano) con la pregunta: qué representa y para qué se usa en el ítem.',
  [
    'Describe los elementos visibles relevantes.',
    'Conecta la imagen con el enunciado.',
    'Elige la opción que interpreta esa relación, no un detalle decorativo.'
  ],
  [
    'Inventar objetos que no están.',
    'Ignorar una leyenda o título de la figura.',
    'Leer la imagen como si no hubiera pregunta.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Una figura muestra una rosa de los vientos. ¿Para qué sirve?',
    pasos: ['1) Elementos: N, S, E, O.', '2) Función: orientar.', '3) No mide población.'],
    respuesta: 'Orientar puntos cardinales',
    contraste: null
  },
  [
    q('tr_ai_01', 'Una barra más alta en una gráfica suele indicar:', ['A) Un valor mayor', 'B) Un color sin dato', 'C) Un verbo', 'D) Una norma penal'], 'A',
      { B: 'Hay dato.', C: 'No.', D: 'No.' },
      'Altura = magnitud.'),
    q('tr_ai_02', 'Si la imagen tiene leyenda, debes:', ['A) Usarla para interpretar símbolos', 'B) Ignorarla', 'C) Borrarla', 'D) Traducirla a una ecuación siempre'], 'A',
      { B: 'Pierdes claves.', C: 'No.', D: 'No siempre.' },
      'Leyenda.'),
    q('tr_ai_03', 'Un mapa con escala sirve para:', ['A) Relacionar distancias en papel y reales', 'B) Cantar', 'C) Freír', 'D) Conjugar'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Escala.'),
    q('tr_ai_04', 'Al interpretar una imagen, lo primero es:', ['A) Ver qué pregunta el enunciado', 'B) Inventar un cuento', 'C) Cambiar de área', 'D) Contar tipografías'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Enunciado + imagen.')
  ],
  'Elementos visibles + pregunta = interpretación.'
);

C.pensamiento_social = pack(
  'Normas y convivencia: derechos, deberes y mecanismos (tutela, acción popular, deberes ciudadanos) resuelven conflictos cotidianos dentro del marco constitucional.',
  [
    'Identifica el derecho o deber en juego.',
    'Nombra el mecanismo adecuado (tutela, denuncia, diálogo, etc.).',
    'Descarta opciones que inventan sanciones inexistentes.'
  ],
  [
    'Usar tutela para un conflicto que no es de derecho fundamental.',
    'Confundir deber moral con sanción penal.',
    'Ignorar la dignidad o el debido proceso.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Una EPS niega un tratamiento urgente. ¿Qué mecanismo cabe?',
    pasos: ['1) Hay derecho a la salud en juego.', '2) Tutela protege derechos fundamentales.', '3) No es solo “quejarse en redes” como mecanismo jurídico.'],
    respuesta: 'Acción de tutela',
    contraste: null
  },
  [
    q('tr_ps_01', 'La tutela protege principalmente:', ['A) Derechos fundamentales', 'B) Recetas de cocina', 'C) Goles', 'D) Tipografías'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Derechos fundamentales.'),
    q('tr_ps_02', 'Un deber ciudadano típico es:', ['A) Respetar los derechos de otros', 'B) Ignorar la ley siempre', 'C) Falsificar documentos', 'D) Destruir pruebas'], 'A',
      { B: 'Ilegal.', C: 'Delito.', D: 'Delito.' },
      'Respeto mutuo.'),
    q('tr_ps_03', 'La convivencia pacífica implica:', ['A) Resolver conflictos sin violencia', 'B) Imponer por la fuerza', 'C) Censurar todo diálogo', 'D) Eliminar deberes'], 'A',
      { B: 'Rompe convivencia.', C: 'Rompe.', D: 'Rompe.' },
      'Diálogo / mediación.'),
    q('tr_ps_04', 'Si hay discriminación en el colegio, un camino es:', ['A) Activar rutas de atención y denuncia institucional', 'B) Callar siempre', 'C) Responder con violencia', 'D) Falsificar notas'], 'A',
      { B: 'No protege.', C: 'Agrava.', D: 'Ilegal.' },
      'Rutas institucionales.')
  ],
  'Derecho + deber + mecanismo adecuado.'
);

C.pensamiento_sistemico = pack(
  'El pensamiento sistémico mira un problema social como red: causas, actores, efectos colaterales e interdependencias. No reduce todo a una sola variable.',
  [
    'Lista actores (Estado, comunidad, empresas…).',
    'Relaciona causa → efecto → retroalimentación.',
    'Elige la opción que reconoce varias dimensiones del caso.'
  ],
  [
    'Culpar a un solo actor sin mirar el sistema.',
    'Ignorar efectos secundarios.',
    'Proponer una solución que rompe otra parte del sistema sin evaluarlo.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Más tráfico + más buses viejos + poca ciclovía. ¿Lectura sistémica?',
    pasos: ['1) Varias causas concurrentes.', '2) Soluciones parciales (solo semáforos) no bastan.', '3) Hay que coordinar transporte, ambiente y urbanismo.'],
    respuesta: 'Problema multicausal e interdependiente',
    contraste: null
  },
  [
    q('tr_psi_01', 'Un sistema social se entiende mejor si:', ['A) Miras relaciones entre partes', 'B) Ves solo un tuit', 'C) Ignoras causas', 'D) Borras datos'], 'A',
      { B: 'Insuficiente.', C: 'No.', D: 'No.' },
      'Relaciones.'),
    q('tr_psi_02', 'Un efecto colateral es:', ['A) Una consecuencia no buscada de una medida', 'B) La meta principal', 'C) Un sinónimo de tesis literaria', 'D) Un afluente'], 'A',
      { B: 'No.', C: 'No.', D: 'Geo.' },
      'No intencional.'),
    q('tr_psi_03', 'Interdependencia significa:', ['A) Que lo que hace un actor afecta a otros', 'B) Que nadie se relaciona', 'C) Que no hay causas', 'D) Que solo importa el clima de Marte'], 'A',
      { B: 'Lo contrario.', C: 'No.', D: 'No.' },
      'Afectación mutua.'),
    q('tr_psi_04', 'Una lectura no sistémica típica:', ['A) Culpar a una sola persona de un problema complejo', 'B) Mapear actores', 'C) Ver causas múltiples', 'D) Evaluar efectos'], 'A',
      { B: 'Eso es sistémico.', C: 'Eso es sistémico.', D: 'Eso es sistémico.' },
      'Reduccionismo.')
  ],
  'Actores + causas + efectos en red.'
);

C.pensamiento_critico = pack(
  'Fuentes y evidencias: quién habla, con qué datos y qué tan confiables son. Un buen juicio distingue rumor, opinión y prueba.',
  [
    'Identifica la fuente (institución, testigo, anónimo).',
    'Mira si aporta datos verificables.',
    'Valora si alcanza para la conclusión.'
  ],
  [
    'Creer algo solo porque “está en redes”.',
    'Confundir testimonio único con estadística.',
    'Descartar una fuente seria sin argumento.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Un rumor de chat vs un informe con metodología. ¿Cuál sostiene mejor una política pública?',
    pasos: ['1) El informe declara método y datos.', '2) El rumor no es verificable.', '3) Prioriza la fuente con evidencia.'],
    respuesta: 'El informe con metodología',
    contraste: null
  },
  [
    q('tr_pc_01', 'Una evidencia fuerte suele ser:', ['A) Dato contrastable', 'B) Insulto', 'C) Rumor anónimo', 'D) Amenaza'], 'A',
      { B: 'No prueba.', C: 'Débil.', D: 'No prueba.' },
      'Contrastable.'),
    q('tr_pc_02', 'Pregunta clave sobre una fuente:', ['A) ¿Quién la produce y con qué interés?', 'B) ¿Qué tipografía usa?', 'C) ¿Cuántos emojis tiene?', 'D) ¿Es larga?'], 'A',
      { B: 'Irrelevante.', C: 'Irrelevante.', D: 'No basta.' },
      'Autor e interés.'),
    q('tr_pc_03', 'Un sesgo de confirmación es:', ['A) Buscar solo lo que ya creías', 'B) Revisar contraejemplos', 'C) Citar método', 'D) Corregir errores'], 'A',
      { B: 'Eso combate el sesgo.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
      'Solo confirmar.'),
    q('tr_pc_04', 'Para sostener “aumentó el desempleo” necesitas:', ['A) Cifras y periodo de comparación', 'B) Solo un chiste', 'C) Una metáfora', 'D) Un color'], 'A',
      { B: 'No.', C: 'No basta.', D: 'No.' },
      'Datos + periodo.')
  ],
  'Fuente + dato + suficiencia.'
);

C.interpretacion = pack(
  'Leer gráficos y mapas sociales: leyenda, escala, unidades y qué comparación permite el visual (mayor/menor, tendencia, distribución).',
  [
    'Lee título, leyenda y unidades.',
    'Ubica el valor que pide la pregunta.',
    'Compara solo lo que el gráfico muestra.'
  ],
  [
    'Inventar una tendencia no dibujada.',
    'Confundir eje X con Y.',
    'Ignorar la escala.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Barras: Andina 48, Caribe 20. ¿Cuál concentra más?',
    pasos: ['1) Compara alturas/valores.', '2) 48 > 20.', '3) Andina.'],
    respuesta: 'Andina',
    contraste: null
  },
  [
    q('tr_int_01', 'La leyenda de un mapa sirve para:', ['A) Explicar símbolos y colores', 'B) Cantar el himno', 'C) Freír', 'D) Conjugar'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Símbolos.'),
    q('tr_int_02', 'Si el eje Y está en %, no leas los valores como:', ['A) Personas absolutas sin aviso', 'B) Porcentajes', 'C) Relativos', 'D) Partes de 100'], 'A',
      { B: 'Eso sí.', C: 'Eso sí.', D: 'Eso sí.' },
      'Respeta unidades.'),
    q('tr_int_03', 'Una tendencia al alza en una línea significa:', ['A) El valor crece en el tiempo mostrado', 'B) El mapa se mojó', 'C) Hay un afluente', 'D) Hay una metáfora'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Crecimiento.'),
    q('tr_int_04', 'Para decir “cuál es mayor” en barras miras:', ['A) La altura o el valor rotulado', 'B) Solo el color favorito', 'C) La tipografía', 'D) El clima'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Altura/valor.')
  ],
  'Título, leyenda, ejes, comparación.'
);

C.interpretacion_y_analisis = pack(
  'Interpretar perspectivas: cada actor tiene intereses y marcos. Analiza qué defiende, con qué argumentos y qué consecuencias tendría adoptar su posición.',
  [
    'Identifica quién habla y qué quiere.',
    'Resume su marco (económico, ambiental, de derechos…).',
    'Evalúa consecuencias de seguir esa perspectiva.'
  ],
  [
    'Atribuir a un actor la tesis del otro.',
    'Ignorar el conflicto de intereses.',
    'Elegir “la más bonita” sin analizar consecuencias.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Empresa quiere mina; comunidad teme el agua. ¿Perspectivas?',
    pasos: ['1) Empresa: interés económico/extractivo.', '2) Comunidad: interés hídrico/territorio.', '3) Análisis: tensar desarrollo vs cuidado ambiental.'],
    respuesta: 'Intereses en tensión: extractivo vs hídrico',
    contraste: null
  },
  [
    q('tr_iya_01', 'Una perspectiva es:', ['A) El punto de vista de un actor con sus intereses', 'B) Un triángulo', 'C) Un mcm', 'D) Un auxiliar did'], 'A',
      { B: 'Geo/mate.', C: 'Mate.', D: 'Inglés.' },
      'Punto de vista.'),
    q('tr_iya_02', 'Al analizar consecuencias preguntas:', ['A) Qué pasaría si se impone esa posición', 'B) Solo el color del logo', 'C) La tipografía', 'D) El clima de Marte'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Consecuencias.'),
    q('tr_iya_03', 'Un marco ambiental prioriza:', ['A) Ecosistemas y recursos', 'B) Solo el chiste', 'C) Solo la conjugación', 'D) Solo el perímetro'], 'A',
      { B: 'No.', C: 'No.', D: 'Mate.' },
      'Ambiente.'),
    q('tr_iya_04', 'Error típico:', ['A) Mezclar qué dijo cada actor', 'B) Separar intereses', 'C) Leer el caso', 'D) Nombrar consecuencias'], 'A',
      { B: 'Eso ayuda.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
      'No mezclar voces.')
  ],
  'Actor → interés → consecuencias.'
);

C.participacion = pack(
  'La participación ciudadana usa mecanismos: voto, consulta popular, cabildo, veeduría, iniciativa legislativa. Cada uno sirve para influir en lo público de forma distinta.',
  [
    'Identifica qué quiere lograr la ciudadanía (elegir, vigilar, proponer).',
    'Elige el mecanismo que corresponde.',
    'No inventes trámites que no existen en el caso.'
  ],
  [
    'Confundir veeduría con tutela.',
    'Pensar que el voto es el único mecanismo.',
    'Usar revocatoria para un cargo que no aplica.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Ciudadanos quieren vigilar un contrato de obra. ¿Mecanismo?',
    pasos: ['1) Objetivo: control/vigilancia.', '2) Veeduría ciudadana.', '3) No es exactamente el voto.'],
    respuesta: 'Veeduría',
    contraste: null
  },
  [
    q('tr_par_01', 'El voto sirve para:', ['A) Elegir representantes', 'B) Medir un ángulo', 'C) Conjugar', 'D) Nombrar un afluente'], 'A',
      { B: 'Mate.', C: 'Inglés.', D: 'Geo.' },
      'Elección.'),
    q('tr_par_02', 'Una consulta popular indaga:', ['A) La opinión ciudadana sobre un tema', 'B) Solo el clima', 'C) Solo el mcm', 'D) Solo la tipografía'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Opinión pública formal.'),
    q('tr_par_03', 'La veeduría busca:', ['A) Vigilar la gestión pública', 'B) Freír', 'C) Pintar', 'D) Nadar'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Vigilancia.'),
    q('tr_par_04', 'Participar no es solo votar; también es:', ['A) Proponer, vigilar y deliberar', 'B) Solo callar', 'C) Solo insultar', 'D) Solo ausentarse siempre'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Varios mecanismos.')
  ],
  'Voto, consulta, veeduría, iniciativa: elige el adecuado.'
);

C.competencias_ciudadanas = pack(
  'Las competencias ciudadanas unen convivir, participar y pensar lo público con respeto a los derechos. En un conflicto, la respuesta competente protege dignidad y busca salidas institucionales.',
  [
    'Reconoce el derecho vulnerado o el conflicto.',
    'Propone una acción respetuosa y legal.',
    'Evita respuestas violentas o discriminatorias.'
  ],
  [
    'Responder con agresión.',
    'Excluir a alguien por identidad.',
    'Ignorar rutas de atención existentes.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Un compañero es excluido del grupo por su acento. ¿Qué es ciudadano?',
    pasos: ['1) Hay discriminación.', '2) Acción: incluir, dialogar, reportar si persiste.', '3) No reforzar el rechazo.'],
    respuesta: 'Incluir y rechazar la discriminación',
    contraste: null
  },
  [
    q('tr_cc_01', 'Una acción ciudadana competente:', ['A) Respeta derechos y busca solución pacífica', 'B) Humilla', 'C) Agrede', 'D) Falsifica'], 'A',
      { B: 'Vulnera.', C: 'Vulnera.', D: 'Ilegal.' },
      'Respeto + pacífica.'),
    q('tr_cc_02', 'Pensar lo público implica:', ['A) Considerar el interés común', 'B) Solo el capricho propio', 'C) Ignorar a otros', 'D) Romper normas por diversión'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Interés común.'),
    q('tr_cc_03', 'Ante bullying, una ruta válida es:', ['A) Activar protocolos escolares', 'B) Guardar silencio eterno', 'C) Devolver violencia', 'D) Burlarse más'], 'A',
      { B: 'No protege.', C: 'Agrava.', D: 'Agrava.' },
      'Protocolos.'),
    q('tr_cc_04', 'La dignidad humana exige:', ['A) Trato respetuoso a toda persona', 'B) Discriminar', 'C) Excluir', 'D) Callar denuncias siempre'], 'A',
      { B: 'Lo contrario.', C: 'Lo contrario.', D: 'No siempre.' },
      'Respeto.')
  ],
  'Convivir, participar, pensar lo público con derechos.'
);

C.aptitud_numerica_docente = pack(
  'La aptitud numérica docente aplica proporciones, porcentajes y lectura de datos escolares (asistencias, notas, cupos) con sentido pedagógico: el número informa una decisión de aula.',
  [
    'Traduce el problema escolar a una operación (razón, %, promedio).',
    'Calcula con unidades coherentes.',
    'Interpreta el resultado en el contexto del aula.'
  ],
  [
    'Calcular bien pero interpretar al revés.',
    'Usar % sobre la base equivocada.',
    'Ignorar que el dato es de una muestra.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'De 40 estudiantes, 8 faltaron. ¿Qué % faltó?',
    pasos: ['1) 8/40 = 0,2.', '2) 0,2 × 100 = 20%.', '3) Faltó el 20%.'],
    respuesta: '20%',
    contraste: null
  },
  [
    q('tr_and_01', '15 de 60 es:', ['A) 25%', 'B) 15%', 'C) 40%', 'D) 50%'], 'A',
      { B: 'Confundiste cantidad con %.', C: 'Mal.', D: 'Mal.' },
      '15/60=0,25.'),
    q('tr_and_02', 'Si el promedio de 4 notas es 80 y tres suman 230, la cuarta es:', ['A) 90', 'B) 80', 'C) 70', 'D) 50'], 'A',
      { B: 'Insuficiente.', C: 'Mal despeje.', D: 'Mal.' },
      'Total 320; 320−230=90.'),
    q('tr_and_03', 'Razón 2:5 de niños a niñas en 35 alumnos → niños:', ['A) 10', 'B) 14', 'C) 20', 'D) 25'], 'A',
      { B: 'Partes mal.', C: 'Mal.', D: 'Mal.' },
      '2+5=7 partes; 35/7=5; 2×5=10.'),
    q('tr_and_04', 'Un gráfico de asistencia sirve al docente para:', ['A) Detectar patrones y decidir apoyos', 'B) Freír', 'C) Conjugar', 'D) Nombrar ríos'], 'A',
      { B: 'No.', C: 'No.', D: 'No.' },
      'Decisión pedagógica con datos.')
  ],
  ' %, razones y promedios con sentido de aula.'
);

C.aptitud_pedagogica = pack(
  'La aptitud pedagógica elige acciones de enseñanza que respetan el aprendizaje: diagnóstico, andamiaje, retroalimentación clara y clima de aula seguro.',
  [
    'Identifica la necesidad del estudiante (concepto, motivación, inclusión).',
    'Elige la estrategia que enseña, no solo que castiga.',
    'Verifica que la acción sea ética y viable en el aula.'
  ],
  [
    'Ridiculizar el error.',
    'Dar solo la respuesta sin mediar.',
    'Ignorar barreras de acceso.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Un estudiante falla fracciones. ¿Qué es más pedagógico?',
    pasos: ['1) Diagnosticar el error (p. ej. sumar denominadores).', '2) Mediar con material concreto / mcm.', '3) No limitarse a decir “mal”.'],
    respuesta: 'Mediar el error conceptual',
    contraste: null
  },
  [
    q('tr_ap_01', 'Una buena retroalimentación:', ['A) Señala el error y cómo corregirlo', 'B) Solo insulta', 'C) Es silencio total siempre', 'D) Falsifica la nota'], 'A',
      { B: 'Dañina.', C: 'No enseña.', D: 'Ilegal/antipedagógico.' },
      'Error + camino.'),
    q('tr_ap_02', 'El andamiaje consiste en:', ['A) Apoyar y retirar ayuda poco a poco', 'B) Hacer todo por el estudiante siempre', 'C) Abandonar', 'D) Castigar'], 'A',
      { B: 'Dependencia.', C: 'No.', D: 'No enseña.' },
      'Apoyo gradual.'),
    q('tr_ap_03', 'Un clima de aula seguro permite:', ['A) Equivocarse y aprender', 'B) Burlarse', 'C) Excluir', 'D) Amenazar'], 'A',
      { B: 'Inseguro.', C: 'Inseguro.', D: 'Inseguro.' },
      'Seguridad para aprender.'),
    q('tr_ap_04', 'Ante diversidad en el aula, lo pedagógico es:', ['A) Ajustar apoyos sin bajar la dignidad', 'B) Ignorar necesidades', 'C) Segregar con burla', 'D) Negar el acceso'], 'A',
      { B: 'Excluye.', C: 'Violento.', D: 'Ilegal/antipedagógico.' },
      'Inclusión con respeto.')
  ],
  'Diagnosticar, mediar, retroalimentar con respeto.'
);

// Aliases de inglés que el banco usa como id propio
C.dialogues = C.dialogo;
C.signs_notices = C.aviso;
C.lexical_cloze = C.cloze;
C.vocabulary = C.vocabulario;
C.reading_comprehension = C.lectura;
C.grammar_reading = C.grammar;

// Adjunta 3–6 términos clave a cada cartilla
Object.keys(C).forEach(function (id) {
  var packObj = C[id];
  if (!packObj || typeof packObj !== 'object') return;
  if (!Array.isArray(packObj.terminos) || !packObj.terminos.length) {
    packObj.terminos = terminosDe(id);
  }
});

const outPath = path.join(__dirname, 'contenidoTemasRefuerzo.mjs');
const body = `/** Autogenerado por buildContenidoTemasRefuerzo.mjs — cartillas de contenido real. */\n`
  + `function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {\n`
  + `  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };\n}\n`
  + `export const CONTENIDO_TEMAS = ${JSON.stringify(C, null, 2)};\n`
  + `export { q };\n`;
fs.writeFileSync(outPath, body);
console.log('OK', Object.keys(C).length, 'temas →', outPath);

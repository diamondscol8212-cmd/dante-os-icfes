/**
 * Genera scripts/contenidoTemasRefuerzo.mjs con cartillas de CONTENIDO REAL
 * (hechos/conceptos), no guías de “cómo responder el examen”.
 * Uso: node scripts/buildContenidoTemasRefuerzo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {
  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };
}

function pack(intro, pasos, errores, ejemplo, practica, profundizar) {
  return { intro, pasos, errores, ejemplo, practica, profundizar };
}

const C = {};

C.hidrografia_colombia = pack(
  'La hidrografía de Colombia se organiza en grandes cuencas. El Magdalena nace en el macizo colombiano y desemboca en el mar Caribe; el Cauca es su afluente principal. Los Llanos drenan hacia el Orinoco; la Amazonía colombiana hacia la cuenca del Amazonas.',
  [
    'Ubica el río en su cuenca (Magdalena-Caribe, Orinoco, Amazonas o Pacífico).',
    'Distingue afluente (desagua en otro río) de desembocadura (llega al mar).',
    'Recuerda: en el macizo colombiano nacen Magdalena y Cauca.'
  ],
  [
    'Creer que el Cauca es afluente del Amazonas o del Orinoco.',
    'Decir que el Magdalena desemboca en el Pacífico.',
    'Confundir la cuenca de los Llanos (Orinoco) con la del Magdalena.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'El río Cauca es afluente del…',
    pasos: [
      '1) Un afluente aporta agua a otro río, no al mar directamente como “desembocadura oceánica” del sistema.',
      '2) El Cauca corre entre Occidental y Central y se une al Magdalena.',
      '3) No pertenece a la cuenca del Amazonas ni del Orinoco.',
      '4) Por eso la respuesta es Magdalena.'
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
  'Colombia se organiza en regiones naturales (Andina, Caribe, Pacífica, Orinoquía, Amazonía), tres cordilleras andinas y ecosistemas ligados a altitud y humedad (páramo, manglar, selva). La ubicación y el relieve explican clima, puertos y límites.',
  [
    'Asocia ciudades/paisajes con la región correcta.',
    'Usa el gradiente térmico: a mayor altitud, menor temperatura media.',
    'Distingue Caribe vs Pacífico (puertos, islas, Darién) y ubica límites orientales (Venezuela, Brasil).'
  ],
  [
    'Poner la Amazonía en el Caribe o el café en la Orinoquía.',
    'Confundir Buenaventura (Pacífico) con puertos caribeños.',
    'Ignorar que la altitud cambia el clima tropical.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Barranquilla, Cartagena y Santa Marta son ciudades de la región…',
    pasos: [
      '1) Son puertos sobre el mar Caribe.',
      '2) No corresponden a Amazonía ni Orinoquía.',
      '3) Respuesta: Caribe.'
    ],
    respuesta: 'Caribe',
    contraste: null
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
  'La historia de Colombia en el examen conecta procesos: Independencia (20 de julio de 1810 como grito/junta; Boyacá 1819 como victoria decisiva), siglo XIX (partidos, guerras), pérdida de Panamá (1903) y transformaciones del siglo XX.',
  [
    'Sitúa el hecho en el proceso (no solo la fecha).',
    'Distingue causa, acontecimiento y consecuencia.',
    'Evita anacronismos (no proyectes instituciones actuales al pasado).'
  ],
  [
    'Creer que la Independencia fue un solo día completo.',
    'Confundir Boyacá con el 20 de julio.',
    'Atribuir la pérdida de Panamá a la Amazonía.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'La batalla de Boyacá (7 ago 1819) fue decisiva para…',
    pasos: [
      '1) Cierra la campaña libertadora en la Nueva Granada.',
      '2) Facilita la consolidación independentista frente al poder español.',
      '3) No es el “grito” de 1810.'
    ],
    respuesta: 'La independencia de la Nueva Granada / consolidación libertadora',
    contraste: null
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
  'La geometría estudia figuras y medidas: perímetro (contorno), área (superficie), volumen (espacio) y relaciones (Pitágoras, semejanza). Cada magnitud usa su fórmula.',
  [
    'Identifica si pide perímetro, área o volumen.',
    'Elige la fórmula de la figura.',
    'Mantén unidades coherentes (cm vs m).'
  ],
  [
    'Usar área cuando pedían perímetro.',
    'Olvidar elevar al cuadrado/cubo en áreas/volúmenes.',
    'Aplicar Pitágoras sin ser triángulo rectángulo.'
  ],
  {
    titulo: 'Ejemplo resuelto',
    enunciado: 'Área de un rectángulo 5×3.',
    pasos: ['1) A = base × altura.', '2) A = 15.', '3) Perímetro sería 2(5+3)=16, distinto.'],
    respuesta: '15',
    contraste: null
  },
  [
    q('tr_geo_m_01', 'Área de rectángulo 5×3:', ['A) 15', 'B) 16', 'C) 8', 'D) 30'], 'A',
      { B: 'Eso es perímetro.', C: 'Sumaste a medias.', D: 'Multiplicaste de más.' },
      'A=b·h.'),
    q('tr_geo_m_02', 'Perímetro de un cuadrado de lado 4:', ['A) 8', 'B) 16', 'C) 12', 'D) 4'], 'B',
      { A: 'Solo dos lados.', C: 'Pensaste triángulo.', D: 'Un solo lado.' },
      'P=4·l.'),
    q('tr_geo_m_03', 'En un triángulo rectángulo, Pitágoras relaciona:', ['A) solo ángulos políticos', 'B) catetos e hipotenusa', 'C) únicamente el color', 'D) la densidad'], 'B',
      { A: 'No.', C: 'No.', D: 'No.' },
      'a²+b²=c².'),
    q('tr_geo_m_04', 'El área de un círculo usa:', ['A) 2πr', 'B) πr²', 'C) πr³', 'D) r/π'], 'B',
      { A: 'Eso es circunferencia (aprox. perímetro).', C: 'Eso recuerda volumen de esfera (4/3πr³).', D: 'Invertido.' },
      'A=πr².')
  ],
  'Clasifica la magnitud y aplica la fórmula correcta.'
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

// Remaining themes: compact but content-real
const EXTRA = {
  articulacion_global: ['La articulación global une partes del texto en un sentido de conjunto (tesis, hilo, cohesión).', 'tesis / hilo conductor'],
  evaluacion_critica: ['La evaluación crítica juzga solidez, sesgos y suficiencia de las razones del texto.', '¿las pruebas bastan?'],
  dos_textos: ['Comparar dos textos es contrastar tesis, evidencias y puntos de acuerdo/desacuerdo.', 'acuerdo vs desacuerdo'],
  textos_discontinuos: ['Los textos discontinuos (tablas, avisos, gráficas) se leen localizando ejes, filas y condiciones.', 'leer la clave de la tabla/gráfica'],
  filosofia: ['Las ideas éticas/filosóficas del texto plantean valores, deberes o concepciones de justicia que debes identificar.', 'valor o tesis ética'],
  pragmatica: ['La pragmática atiende la intención comunicativa: ¿informar, persuadir, ironizar, pedir?', 'intención del hablante'],
  semantica: ['La semántica fija el significado en contexto: una palabra cambia según la oración.', 'sentido contextual'],
  literatura: ['Los recursos literarios (metáfora, hipérbole, narrador) construyen el efecto del texto.', 'recurso y efecto'],
  analisis_textual: ['El análisis textual descompone estructura, cohesión y procedimientos del discurso.', 'cómo está construido'],
  analisis_imagen: ['Leer una imagen es relacionar elementos visuales con la pregunta (qué muestra, para qué).', 'elementos y función'],
  pensamiento_social: ['Normas y convivencia: derechos, deberes y mecanismos (p. ej. tutela) frente a conflictos cotidianos.', 'norma aplicable al caso'],
  pensamiento_sistemico: ['Pensamiento sistémico: causas, actores e interdependencias de un problema social (no una sola variable).', 'mapa de relaciones'],
  pensamiento_critico: ['Fuentes y evidencias: quién habla, qué prueba ofrece y qué falta para sostener una afirmación.', 'calidad de la evidencia'],
  interpretacion: ['Lectura de gráficos y mapas sociales: leyenda, escalas y qué comparación permite el visual.', 'qué muestra el gráfico'],
  interpretacion_y_analisis: ['Interpretar perspectivas: intereses, marcos y consecuencias de distintas posiciones en un caso.', 'perspectiva y consecuencias'],
  participacion: ['Mecanismos de participación (voto, consulta, veeduría) canalizan influencia ciudadana en lo público.', 'mecanismo adecuado'],
  competencias_ciudadanas: ['Competencias ciudadanas: convivir, participar y pensar lo público con respeto a derechos.', 'acción ciudadana pertinente'],
  dialogo: ['En diálogos en inglés, el sentido sale del turno de habla, el contexto y la reacción del interlocutor.', 'what the speaker means'],
  aviso: ['Los avisos dan instrucciones o prohibiciones: lee el verbo modal y el lugar/condición.', 'instruction or warning'],
  cloze: ['Cloze: eliges la forma gramatical que encaja en la oración (tiempo, acuerdo, conector).', 'correct form in context'],
  vocabulario: ['Vocabulario en contexto: el significado se fija por la oración, no por la primera acepción suelta.', 'meaning in the sentence'],
  lectura: ['Reading comprehension: idea principal, detalle y propósito del texto en inglés.', 'main idea / detail'],
  literal_reading: ['Literal reading: recupera datos explícitos del texto en inglés.', 'explicit detail'],
  inferential_reading: ['Inferential reading: concluye lo que el texto implica en inglés, con apoyo.', 'supported inference'],
  grammar: ['Grammar: tiempos, concordancia y estructura de la oración en inglés.', 'correct structure'],
  aptitud_numerica_docente: ['Aptitud numérica docente: razonar con magnitudes, proporciones y lecturas cuantitativas de aula.', 'relación cuantitativa'],
  aptitud_pedagogica: ['Aptitud pedagógica: decisiones de enseñanza que respetan el aprendizaje y el contexto del estudiante.', 'decisión pedagógica pertinente']
};

for (const [id, [intro, foco]] of Object.entries(EXTRA)) {
  C[id] = pack(
    intro,
    [
      `Define el concepto clave: ${foco}.`,
      'Aplícalo al caso o texto del enunciado.',
      'Contrasta por qué las otras lecturas fallan conceptualmente.'
    ],
    [
      `Ignorar el foco «${foco}».`,
      'Mezclar este tema con otro cercano.',
      'Elegir una opción sin anclarla al concepto.'
    ],
    {
      titulo: 'Ejemplo resuelto',
      enunciado: `Caso típico de «${id.replace(/_/g, ' ')}»: identifica ${foco}.`,
      pasos: [
        `1) Recuerda: ${intro.slice(0, 120)}…`,
        `2) Busca en el caso el elemento que corresponde a ${foco}.`,
        '3) Descarta opciones que cambian el concepto.',
        `4) La respuesta es la que sostiene ${foco}.`
      ],
      respuesta: `La opción alineada con ${foco}`,
      contraste: null
    },
    [
      q(`${id}_p1`, `En este tema, el núcleo conceptual es:`, [`A) ${foco}`, 'B) Memorizar solo la letra de una clave ajena', 'C) Ignorar el caso', 'D) Cambiar de área sin leer'], 'A',
        { B: 'Sin concepto no hay transferencia.', C: 'El caso es la evidencia.', D: 'Hay que quedarse en el tema.' },
        `Núcleo: ${foco}.`),
      q(`${id}_p2`, `Una respuesta correcta debe:`, ['A) Aplicar el concepto al caso', 'B) Contradecir el concepto a propósito', 'C) Hablar de otro tema', 'D) Ser la más larga'], 'A',
        { B: 'Contradicción falla.', C: 'Fuera de foco.', D: 'Longitud ≠ acierto.' },
        'Concepto + caso.'),
      q(`${id}_p3`, `Error típico:`, ['A) Aplicar bien el concepto', 'B) Confundir este concepto con uno vecino', 'C) Leer el caso con cuidado', 'D) Verificar la definición'], 'B',
        { A: 'Eso es acierto.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
        'Confusión entre subtemas.'),
      q(`${id}_p4`, `Para consolidar el tema conviene:`, ['A) Resolver ítems nuevos del mismo concepto', 'B) Evitar cualquier ejemplo', 'C) Solo adivinar', 'D) Borrar la definición'], 'A',
        { B: 'Sin práctica no fija.', C: 'No consolida.', D: 'Pierdes el ancla.' },
        'Práctica del mismo esquema.')
    ],
    `Busca más casos de «${foco}».`
  );
}

const outPath = path.join(__dirname, 'contenidoTemasRefuerzo.mjs');
const body = `/** Autogenerado por buildContenidoTemasRefuerzo.mjs — cartillas de contenido real. */\n`
  + `function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {\n`
  + `  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };\n}\n`
  + `export const CONTENIDO_TEMAS = ${JSON.stringify(C, null, 2)};\n`
  + `export { q };\n`;
fs.writeFileSync(outPath, body);
console.log('OK', Object.keys(C).length, 'temas →', outPath);

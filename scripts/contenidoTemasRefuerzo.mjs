/** Autogenerado por buildContenidoTemasRefuerzo.mjs — cartillas de contenido real. */
function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {
  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };
}
export const CONTENIDO_TEMAS = {
  "hidrografia_colombia": {
    "intro": "La hidrografía de Colombia se organiza en grandes cuencas. El Magdalena nace en el macizo colombiano y desemboca en el mar Caribe; el Cauca es su afluente principal. Los Llanos drenan hacia el Orinoco; la Amazonía colombiana hacia la cuenca del Amazonas.",
    "pasos": [
      "Ubica el río en su cuenca (Magdalena-Caribe, Orinoco, Amazonas o Pacífico).",
      "Distingue afluente (desagua en otro río) de desembocadura (llega al mar).",
      "Recuerda: en el macizo colombiano nacen Magdalena y Cauca."
    ],
    "errores": [
      "Creer que el Cauca es afluente del Amazonas o del Orinoco.",
      "Decir que el Magdalena desemboca en el Pacífico.",
      "Confundir la cuenca de los Llanos (Orinoco) con la del Magdalena."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "El río Cauca es afluente del…",
      "pasos": [
        "1) Un afluente aporta agua a otro río, no al mar directamente como “desembocadura oceánica” del sistema.",
        "2) El Cauca corre entre Occidental y Central y se une al Magdalena.",
        "3) No pertenece a la cuenca del Amazonas ni del Orinoco.",
        "4) Por eso la respuesta es Magdalena."
      ],
      "respuesta": "Magdalena",
      "contraste": {
        "titulo": "Contraste · cuenca correcta",
        "invalido": "Inválido: «El Cauca es afluente del Amazonas.» (otra cuenca).",
        "valido": "Válido: «El Cauca es afluente del Magdalena; juntos drenan hacia el Caribe.»"
      }
    },
    "practica": [
      {
        "id": "tr_hidro_01",
        "enunciado": "El río Cauca es afluente del:",
        "opciones": [
          "A) Amazonas",
          "B) Orinoco",
          "C) Magdalena",
          "D) Mediterráneo"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "El Cauca no está en la cuenca amazónica.",
          "B": "Los Llanos van al Orinoco; el Cauca no.",
          "D": "Sin conexión con el Mediterráneo."
        },
        "explicacion_correcta": "El Cauca aporta al Magdalena."
      },
      {
        "id": "tr_hidro_02",
        "enunciado": "El Magdalena nace en el macizo colombiano y desemboca en:",
        "opciones": [
          "A) el océano Pacífico",
          "B) el río Amazonas",
          "C) el mar Caribe",
          "D) el lago Titicaca"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Desemboca al norte, en el Caribe.",
          "B": "No es afluente del Amazonas.",
          "D": "El Titicaca no está en su curso."
        },
        "explicacion_correcta": "Macizo → Magdalena → Caribe."
      },
      {
        "id": "tr_hidro_03",
        "enunciado": "Los Llanos Orientales hacen parte, sobre todo, de la cuenca del:",
        "opciones": [
          "A) Pacífico",
          "B) Caribe insular",
          "C) Mediterráneo",
          "D) Orinoco"
        ],
        "correcta": "D",
        "justificacion_incorrectas": {
          "A": "Vertiente occidental distinta.",
          "B": "No es la cuenca continental de los Llanos.",
          "C": "Irrelevante aquí."
        },
        "explicacion_correcta": "Llanos → Orinoco."
      },
      {
        "id": "tr_hidro_04",
        "enunciado": "En el macizo colombiano nacen, entre otros:",
        "opciones": [
          "A) solo arroyos de La Guajira",
          "B) Magdalena y Cauca",
          "C) únicamente ríos de San Andrés",
          "D) el Amazonas en su desembocadura"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "La Guajira está al norte.",
          "C": "San Andrés es insular.",
          "D": "El Amazonas no “nace” allí como desembocadura."
        },
        "explicacion_correcta": "Macizo: nacimiento de Magdalena y Cauca."
      }
    ],
    "profundizar": "Repasa el mapa de cuencas Magdalena-Cauca, Orinoco y Amazonas.",
    "terminos": [
      {
        "termino": "afluente",
        "definicion": "Río que desemboca en otro río (no directamente en el mar).",
        "ejemplo": "El Cauca es afluente del Magdalena."
      },
      {
        "termino": "cuenca",
        "definicion": "Territorio cuyas aguas drenan hacia un mismo río o mar.",
        "ejemplo": "Cuenca del Magdalena-Cauca."
      },
      {
        "termino": "desembocadura",
        "definicion": "Lugar donde un río entrega sus aguas al mar u otro cuerpo.",
        "ejemplo": "El Magdalena desemboca en el Caribe."
      },
      {
        "termino": "macizo colombiano",
        "definicion": "Nudo montañoso del sur donde nacen grandes ríos.",
        "ejemplo": "Allí nacen Magdalena y Cauca."
      },
      {
        "termino": "vertiente",
        "definicion": "Ladera o región que drena hacia un océano determinado.",
        "ejemplo": "Vertiente del Pacífico vs Caribe."
      }
    ],
    "diagrama_svg": ""
  },
  "geografia": {
    "intro": "Colombia se organiza en regiones naturales (Andina, Caribe, Pacífica, Orinoquía, Amazonía), tres cordilleras andinas y ecosistemas ligados a altitud y humedad (páramo, manglar, selva). La ubicación y el relieve explican clima, puertos y límites.",
    "pasos": [
      "Asocia ciudades/paisajes con la región correcta.",
      "Usa el gradiente térmico: a mayor altitud, menor temperatura media.",
      "Distingue Caribe vs Pacífico (puertos, islas, Darién) y ubica límites orientales (Venezuela, Brasil)."
    ],
    "errores": [
      "Poner la Amazonía en el Caribe o el café en la Orinoquía.",
      "Confundir Buenaventura (Pacífico) con puertos caribeños.",
      "Ignorar que la altitud cambia el clima tropical."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Barranquilla, Cartagena y Santa Marta son ciudades de la región…",
      "pasos": [
        "1) Son puertos sobre el mar Caribe.",
        "2) No corresponden a Amazonía ni Orinoquía.",
        "3) Respuesta: Caribe."
      ],
      "respuesta": "Caribe",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_geo_01",
        "enunciado": "La Amazonía colombiana se encuentra, principalmente, en el:",
        "opciones": [
          "A) extremo norte Caribe",
          "B) suroriente del país",
          "C) archipiélago de San Andrés",
          "D) eje cafetero"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Norte = Caribe/Guajira.",
          "C": "San Andrés es Caribe insular.",
          "D": "Café = región Andina."
        },
        "explicacion_correcta": "Amazonía = suroriente."
      },
      {
        "id": "tr_geo_02",
        "enunciado": "A mayor altitud, en montañas tropicales, la temperatura suele:",
        "opciones": [
          "A) bajar",
          "B) subir siempre",
          "C) igualarse al nivel del mar",
          "D) depender solo del nombre del municipio"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "La media baja con la altura.",
          "C": "El gradiente térmico actúa.",
          "D": "La altitud es el factor físico."
        },
        "explicacion_correcta": "Más altura → más frío."
      },
      {
        "id": "tr_geo_03",
        "enunciado": "Buenaventura es el principal puerto colombiano sobre el:",
        "opciones": [
          "A) océano Pacífico",
          "B) mar Caribe",
          "C) río Meta",
          "D) lago de Tota"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Los grandes del Caribe son otros.",
          "C": "Meta = fluvial llanero.",
          "D": "Lago andino."
        },
        "explicacion_correcta": "Buenaventura = Pacífico."
      },
      {
        "id": "tr_geo_04",
        "enunciado": "Un páramo es un ecosistema de:",
        "opciones": [
          "A) alta montaña tropical",
          "B) playa de manglar",
          "C) sabana inundable baja",
          "D) arrecife de coral"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Manglar = costa.",
          "C": "Sabana = Orinoquía baja.",
          "D": "Coral = marino."
        },
        "explicacion_correcta": "Páramo = alta montaña."
      }
    ],
    "profundizar": "Repasa regiones naturales, cordilleras y ecosistemas de Colombia.",
    "terminos": [
      {
        "termino": "región natural",
        "definicion": "Zona con rasgos comunes de relieve, clima y bioma.",
        "ejemplo": "Andina, Caribe, Pacífica, Orinoquía, Amazonía."
      },
      {
        "termino": "altitud",
        "definicion": "Altura sobre el nivel del mar.",
        "ejemplo": "A mayor altitud, suele bajar la temperatura."
      },
      {
        "termino": "páramo",
        "definicion": "Ecosistema de alta montaña tropical, frío y húmedo.",
        "ejemplo": "Frailejones y retención de agua."
      },
      {
        "termino": "cordillera",
        "definicion": "Cadena de montañas.",
        "ejemplo": "Colombia tiene Occidental, Central y Oriental."
      },
      {
        "termino": "manglar",
        "definicion": "Bosque costero en zonas salobres tropicales.",
        "ejemplo": "Protege costas y cría peces."
      }
    ],
    "diagrama_svg": ""
  },
  "biologia": {
    "intro": "La biología del examen cubre estructuras y procesos: fotosíntesis (fase luminosa en tilacoides → ATP y NADPH; Calvin fija CO₂), genética de poblaciones (selección natural) y niveles de organización (célula → ecosistema).",
    "pasos": [
      "Identifica el proceso (fotosíntesis, respiración, selección, homeostasis).",
      "Ubica dónde ocurre (orgánulo, tejido, población).",
      "Relaciona causa → mecanismo → efecto medible (O₂, frecuencia alélica, etc.)."
    ],
    "errores": [
      "Confundir fase luminosa con ciclo de Calvin.",
      "Creer que la selección crea mutaciones a voluntad.",
      "Mezclar respiración celular con fotosíntesis."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "En la fase luminosa de la fotosíntesis, en los tilacoides se generan principalmente…",
      "pasos": [
        "1) La luz excita pigmentos en tilacoides.",
        "2) Se produce ATP y NADPH (y O₂ al fotolizar agua).",
        "3) El azúcar se forma después, en el estroma (Calvin)."
      ],
      "respuesta": "ATP y NADPH (energía reductora)",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_bio_01",
        "enunciado": "La fase luminosa ocurre sobre todo en:",
        "opciones": [
          "A) mitocondrias",
          "B) tilacoides del cloroplasto",
          "C) ribosomas libres",
          "D) vacuolas"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Mitocondria = respiración.",
          "C": "Ribosoma = proteínas.",
          "D": "Vacuola no hace la fase luminosa."
        },
        "explicacion_correcta": "Tilacoides = fase luminosa."
      },
      {
        "id": "tr_bio_02",
        "enunciado": "Si un pesticida elimina no resistentes y sobreviven resistentes que se reproducen, el proceso es:",
        "opciones": [
          "A) selección natural",
          "B) fotosíntesis",
          "C) meiosis obligatoria en todos",
          "D) extinción inmediata de la especie"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No es metabolismo vegetal.",
          "C": "No explica el cambio de frecuencia.",
          "D": "La población no desaparece del todo."
        },
        "explicacion_correcta": "Cambia la frecuencia del rasgo resistente."
      },
      {
        "id": "tr_bio_03",
        "enunciado": "El O₂ liberado en fotosíntesis proviene principalmente de:",
        "opciones": [
          "A) el CO₂",
          "B) el agua",
          "C) la glucosa ingerida",
          "D) el nitrógeno del aire"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "El CO₂ aporta carbono al azúcar.",
          "C": "Las plantas no “ingieren” glucosa para liberar ese O₂.",
          "D": "N₂ no es la fuente del O₂ fotosintético."
        },
        "explicacion_correcta": "Fotólisis del agua."
      },
      {
        "id": "tr_bio_04",
        "enunciado": "Una población es:",
        "opciones": [
          "A) un solo organismo",
          "B) individuos de la misma especie en un área",
          "C) todas las especies del planeta",
          "D) solo el clima"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso es organismo.",
          "C": "Eso es biosfera/comunidad amplia.",
          "D": "El clima es abiótico."
        },
        "explicacion_correcta": "Población = misma especie, mismo lugar."
      }
    ],
    "profundizar": "Repasa fotosíntesis, genética de poblaciones y organización biológica.",
    "terminos": [
      {
        "termino": "fotosíntesis",
        "definicion": "Proceso de plantas que convierte luz, CO₂ y agua en glucosa y O₂.",
        "ejemplo": "Fase luminosa en tilacoides; Calvin fija CO₂."
      },
      {
        "termino": "célula",
        "definicion": "Unidad básica de los seres vivos.",
        "ejemplo": "Tiene membrana, citoplasma y material genético."
      },
      {
        "termino": "selección natural",
        "definicion": "Sobreviven y se reproducen más quienes tienen rasgos ventajosos.",
        "ejemplo": "Cambia la frecuencia de rasgos en la población."
      },
      {
        "termino": "población",
        "definicion": "Individuos de la misma especie en un lugar y tiempo.",
        "ejemplo": "No es lo mismo que comunidad."
      },
      {
        "termino": "homeostasis",
        "definicion": "Mantener el equilibrio interno del organismo.",
        "ejemplo": "Temperatura, glucosa, pH."
      }
    ],
    "diagrama_svg": ""
  },
  "fisica": {
    "intro": "La física relaciona magnitudes: cinemática (v, a, Δx), dinámica (F = ma) y fenómenos de ondas/óptica. Las unidades y el signo de la aceleración importan tanto como la fórmula.",
    "pasos": [
      "Lista datos con unidades coherentes (m/s, s, kg, N).",
      "Elige la relación (definición de a, 2ª ley, Snell, etc.).",
      "Interpreta el resultado (desaceleración = a negativa si v disminuye)."
    ],
    "errores": [
      "Usar v = d/t cuando hay aceleración no nula sin la fórmula adecuada.",
      "Olvidar que F neta / m da a.",
      "Mezclar ángulo de incidencia con índice de refracción."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Un vehículo pasa de 24 m/s a 0 en 6 s. ¿Magnitud de la desaceleración?",
      "pasos": [
        "1) a = (v_f − v_i)/t = (0 − 24)/6.",
        "2) a = −4 m/s².",
        "3) Magnitud = 4 m/s²."
      ],
      "respuesta": "4 m/s²",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_fis_01",
        "enunciado": "De 24 m/s a 0 en 6 s, la magnitud de a es:",
        "opciones": [
          "A) 4 m/s²",
          "B) 144 m/s²",
          "C) 0,25 m/s²",
          "D) 30 m/s²"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Multiplicaste 24×6.",
          "C": "Invertiste 6/24.",
          "D": "Sumaste sin dividir bien."
        },
        "explicacion_correcta": "|Δv|/t = 24/6 = 4."
      },
      {
        "id": "tr_fis_02",
        "enunciado": "F = 12 N sobre m = 2 kg (sin fricción). a =",
        "opciones": [
          "A) 24 m/s²",
          "B) 6 m/s²",
          "C) 10 m/s²",
          "D) 0,17 m/s²"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Multiplicaste F·m.",
          "C": "Usaste g≈10 por error.",
          "D": "Invertiste m/F."
        },
        "explicacion_correcta": "a = F/m = 6."
      },
      {
        "id": "tr_fis_03",
        "enunciado": "Si la misma F se aplica a mayor masa, a:",
        "opciones": [
          "A) aumenta",
          "B) disminuye",
          "C) no cambia nunca",
          "D) se vuelve luz"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Mayor inercia → menor a.",
          "C": "Sí cambia con m.",
          "D": "No es óptica."
        },
        "explicacion_correcta": "a ∝ 1/m."
      },
      {
        "id": "tr_fis_04",
        "enunciado": "En refracción, el índice n relaciona:",
        "opciones": [
          "A) solo la masa del bloque",
          "B) velocidad/ángulo de la luz en medios",
          "C) únicamente el color político",
          "D) la densidad poblacional"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "n no es masa.",
          "C": "Irrelevante.",
          "D": "No es demografía."
        },
        "explicacion_correcta": "Óptica: n y ley de Snell."
      }
    ],
    "profundizar": "Practica cinemática, F=ma y óptica básica con unidades.",
    "terminos": [
      {
        "termino": "velocidad",
        "definicion": "Cambio de posición en el tiempo (vectorial).",
        "ejemplo": "v = Δx/Δt."
      },
      {
        "termino": "aceleración",
        "definicion": "Cambio de velocidad en el tiempo.",
        "ejemplo": "a = Δv/Δt."
      },
      {
        "termino": "fuerza",
        "definicion": "Empuje o atracción que puede cambiar el movimiento (Newton).",
        "ejemplo": "F = m·a."
      },
      {
        "termino": "masa",
        "definicion": "Cantidad de materia; se opone a la aceleración.",
        "ejemplo": "A mayor m, menor a si F es fija."
      },
      {
        "termino": "energía",
        "definicion": "Capacidad de producir cambios (cinética, potencial…).",
        "ejemplo": "Se conserva en sistemas aislados."
      }
    ],
    "diagrama_svg": ""
  },
  "quimica": {
    "intro": "La química describe composición y cambio: estequiometría, disoluciones (molaridad), tabla periódica (radio, electronegatividad) y reacciones con conservación de átomos.",
    "pasos": [
      "Balancea o usa la relación molar de la reacción.",
      "Convierte gramos ↔ moles con masa molar.",
      "Lee tendencias periódicas (grupo/periodo) con la causa correcta (capas, Z efe)."
    ],
    "errores": [
      "Olvidar la masa molar al pasar de g a mol.",
      "Invertir tendencias (radio vs electronegatividad).",
      "Creer que los moles “desaparecen” sin conservación."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "40 g de NaOH en 1 L de solución. Masa molar NaOH = 40 g/mol. ¿Molaridad?",
      "pasos": [
        "1) moles = 40/40 = 1 mol.",
        "2) V = 1 L.",
        "3) M = 1 mol/L."
      ],
      "respuesta": "1 M",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_qui_01",
        "enunciado": "40 g NaOH (MM=40) en 1 L → molaridad:",
        "opciones": [
          "A) 0,4 M",
          "B) 1 M",
          "C) 40 M",
          "D) 10 M"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Dividiste mal.",
          "C": "Usaste gramos como moles.",
          "D": "Factor 10 sin base."
        },
        "explicacion_correcta": "n=1; M=1."
      },
      {
        "id": "tr_qui_02",
        "enunciado": "Al bajar en un grupo, el radio atómico suele:",
        "opciones": [
          "A) disminuir",
          "B) aumentar",
          "C) anularse",
          "D) igualar al del He siempre"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Al bajar hay más capas.",
          "C": "No se anula.",
          "D": "Falso."
        },
        "explicacion_correcta": "Más niveles de energía → mayor radio."
      },
      {
        "id": "tr_qui_03",
        "enunciado": "2 H₂ + O₂ → 2 H₂O. Si hay 2 mol H₂ y 1 mol O₂, el agua máxima es:",
        "opciones": [
          "A) 1 mol",
          "B) 2 mol",
          "C) 3 mol",
          "D) 0 mol"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso sería si limitara a la mitad.",
          "C": "No hay átomos de más.",
          "D": "Sí reaccionan."
        },
        "explicacion_correcta": "Proporción exacta → 2 mol H₂O."
      },
      {
        "id": "tr_qui_04",
        "enunciado": "La molaridad M es:",
        "opciones": [
          "A) moles de soluto / litros de solución",
          "B) litros / moles",
          "C) solo gramos de solvente",
          "D) presión atmosférica"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Está invertido.",
          "C": "No define M.",
          "D": "No es concentración."
        },
        "explicacion_correcta": "M = n/V."
      }
    ],
    "profundizar": "Repasa moles, molaridad y tendencias periódicas.",
    "terminos": [
      {
        "termino": "átomo",
        "definicion": "Unidad básica de un elemento (núcleo + electrones).",
        "ejemplo": "El carbono tiene 6 protones."
      },
      {
        "termino": "mol",
        "definicion": "Cantidad de sustancia: 6,022×10²³ entidades.",
        "ejemplo": "1 mol de H₂O ≈ 18 g."
      },
      {
        "termino": "reacción química",
        "definicion": "Transformación de sustancias en otras.",
        "ejemplo": "2H₂ + O₂ → 2H₂O."
      },
      {
        "termino": "molaridad",
        "definicion": "Concentración: moles de soluto por litro de solución.",
        "ejemplo": "M = n/V."
      },
      {
        "termino": "enlace",
        "definicion": "Fuerza que une átomos (iónico, covalente…).",
        "ejemplo": "En H₂O los enlaces son covalentes."
      }
    ],
    "diagrama_svg": ""
  },
  "historia": {
    "intro": "La historia de Colombia en el examen conecta procesos: Independencia (20 de julio de 1810 como grito/junta; Boyacá 1819 como victoria decisiva), siglo XIX (partidos, guerras), pérdida de Panamá (1903) y transformaciones del siglo XX.",
    "pasos": [
      "Sitúa el hecho en el proceso (no solo la fecha).",
      "Distingue causa, acontecimiento y consecuencia.",
      "Evita anacronismos (no proyectes instituciones actuales al pasado)."
    ],
    "errores": [
      "Creer que la Independencia fue un solo día completo.",
      "Confundir Boyacá con el 20 de julio.",
      "Atribuir la pérdida de Panamá a la Amazonía."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "La batalla de Boyacá (7 ago 1819) fue decisiva para…",
      "pasos": [
        "1) Cierra la campaña libertadora en la Nueva Granada.",
        "2) Facilita la consolidación independentista frente al poder español.",
        "3) No es el “grito” de 1810."
      ],
      "respuesta": "La independencia de la Nueva Granada / consolidación libertadora",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_his_01",
        "enunciado": "El 20 de julio de 1810 se recuerda como:",
        "opciones": [
          "A) la batalla de Boyacá",
          "B) el grito de independencia / junta de Bogotá",
          "C) la pérdida de Panamá",
          "D) la Constitución de 1991"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Boyacá es 1819.",
          "C": "Panamá es 1903.",
          "D": "1991 es mucho después."
        },
        "explicacion_correcta": "1810 = junta / grito en Bogotá."
      },
      {
        "id": "tr_his_02",
        "enunciado": "Boyacá (1819) fue decisiva para:",
        "opciones": [
          "A) independizar la Nueva Granada en la campaña libertadora",
          "B) fundar San Andrés",
          "C) crear el Caribe insular",
          "D) firmar la Constitución de 1991"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No es el hecho.",
          "C": "No aplica.",
          "D": "Siglo XX tardío."
        },
        "explicacion_correcta": "Victoria clave de 1819."
      },
      {
        "id": "tr_his_03",
        "enunciado": "La pérdida de Panamá (1903) separó de Colombia:",
        "opciones": [
          "A) la Amazonía",
          "B) el istmo que hoy es Panamá",
          "C) La Guajira",
          "D) solo las islas del Rosario"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Amazonía sigue siendo colombiana en gran parte.",
          "C": "Guajira no se “perdió” así.",
          "D": "No es el núcleo del hecho."
        },
        "explicacion_correcta": "Se separa el istmo panameño."
      },
      {
        "id": "tr_his_04",
        "enunciado": "La Independencia colombiana fue:",
        "opciones": [
          "A) un solo día sin proceso",
          "B) un proceso de años con juntas, guerras y campañas",
          "C) solo un tratado europeo de 1492",
          "D) únicamente un cambio de bandera en 1991"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Hubo proceso prolongado.",
          "C": "1492 es conquista.",
          "D": "1991 es otra etapa."
        },
        "explicacion_correcta": "Proceso, no un instante."
      }
    ],
    "profundizar": "Línea de tiempo: 1810, 1819, siglo XIX, 1903, siglo XX.",
    "terminos": [
      {
        "termino": "Independencia",
        "definicion": "Proceso de ruptura con el dominio español (siglo XIX).",
        "ejemplo": "1810: Junta de Bogotá; 1819: Boyacá."
      },
      {
        "termino": "colonia",
        "definicion": "Periodo de dominio español en América.",
        "ejemplo": "Virreinato de la Nueva Granada."
      },
      {
        "termino": "República",
        "definicion": "Forma de Estado posterior a la independencia.",
        "ejemplo": "Constituciones del siglo XIX."
      },
      {
        "termino": "proceso histórico",
        "definicion": "Cambio largo con causas y etapas, no un solo día.",
        "ejemplo": "La independencia fue un proceso."
      },
      {
        "termino": "fuente histórica",
        "definicion": "Documento o evidencia del pasado.",
        "ejemplo": "Actas, cartas, mapas de época."
      }
    ],
    "diagrama_svg": ""
  },
  "constitucion": {
    "intro": "La Constitución Política organiza el Estado en ramas: legislativa (Congreso), ejecutiva (Presidente) y judicial (cortes/jueces), con derechos, deberes y controles. Separación de poderes evita la concentración.",
    "pasos": [
      "Identifica qué rama hace la norma, la ejecuta o la juzga.",
      "Relaciona el mecanismo (tutela, voto, etc.) con el derecho o control.",
      "No mezcles funciones (el Congreso no “juzga” como corte ordinaria)."
    ],
    "errores": [
      "Asignar al Presidente la función de legislar en abstracto como Congreso.",
      "Creer que los jueces encabezan la rama ejecutiva.",
      "Confundir derecho fundamental con trámite administrativo cualquiera."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "En Colombia, el Congreso hace parte de la rama…",
      "pasos": [
        "1) Congreso = Senado + Cámara.",
        "2) Su función central es legislar.",
        "3) Rama legislativa."
      ],
      "respuesta": "Legislativa",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_con_01",
        "enunciado": "El Congreso integra la rama:",
        "opciones": [
          "A) legislativa",
          "B) ejecutiva",
          "C) judicial",
          "D) militar exclusiva"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Ejecutiva = Presidente y gobierno.",
          "C": "Judicial = jueces/cortes.",
          "D": "No es una rama constitucional así."
        },
        "explicacion_correcta": "Congreso = legislativa."
      },
      {
        "id": "tr_con_02",
        "enunciado": "El Presidente encabeza la rama:",
        "opciones": [
          "A) judicial",
          "B) ejecutiva",
          "C) legislativa",
          "D) electoral únicamente"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Judicial son cortes.",
          "C": "Legislativa es Congreso.",
          "D": "Lo electoral tiene órganos propios."
        },
        "explicacion_correcta": "Presidente = ejecutiva."
      },
      {
        "id": "tr_con_03",
        "enunciado": "Cortes y jueces integran la rama:",
        "opciones": [
          "A) ejecutiva",
          "B) legislativa",
          "C) judicial",
          "D) diplomática"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "No ejecutan políticas como gobierno.",
          "B": "No son el Congreso.",
          "D": "No es rama."
        },
        "explicacion_correcta": "Judicial = administración de justicia."
      },
      {
        "id": "tr_con_04",
        "enunciado": "La separación de poderes busca:",
        "opciones": [
          "A) concentrar todo en una persona",
          "B) repartir funciones y controlar el poder",
          "C) eliminar derechos",
          "D) sustituir la Constitución por decretos eternos"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Es lo contrario.",
          "C": "La Constitución garantiza derechos.",
          "D": "El marco superior es la Constitución."
        },
        "explicacion_correcta": "Frenos y contrapesos."
      }
    ],
    "profundizar": "Memoriza ramas + un ejemplo de función de cada una.",
    "terminos": [
      {
        "termino": "Constitución",
        "definicion": "Norma Suprema que organiza el Estado y los derechos.",
        "ejemplo": "Constitución Política de 1991."
      },
      {
        "termino": "rama legislativa",
        "definicion": "Hace las leyes: Congreso (Senado y Cámara).",
        "ejemplo": "Aprueba o reforman leyes."
      },
      {
        "termino": "rama ejecutiva",
        "definicion": "Ejecuta y administra: Presidente y gobierno.",
        "ejemplo": "Gobierna y aplica políticas."
      },
      {
        "termino": "rama judicial",
        "definicion": "Administra justicia: cortes y jueces.",
        "ejemplo": "Resuelve conflictos según la ley."
      },
      {
        "termino": "pesos y contrapesos",
        "definicion": "Control mutuo entre ramas para evitar abuso de poder.",
        "ejemplo": "El Congreso puede controlar al Ejecutivo."
      }
    ],
    "diagrama_svg": ""
  },
  "algebra": {
    "intro": "El álgebra modela relaciones con variables: despejar, plantear ecuaciones lineales y traducir un enunciado (tarifa, tanque, distancia) a una igualdad que se resuelve con operaciones inversas.",
    "pasos": [
      "Define la incógnita (lo que pide el enunciado).",
      "Escribe la ecuación con los datos.",
      "Despeja con operaciones inversas y verifica sustituyendo."
    ],
    "errores": [
      "Sumar cuando tocaba multiplicar (o al revés).",
      "Despejar mal el término con la variable.",
      "Olvidar unidades o el término constante (tarifa base)."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Tarifa = 3000 + 150·km. Si el viaje cuesta 6000, ¿km?",
      "pasos": [
        "1) 3000 + 150k = 6000.",
        "2) 150k = 3000.",
        "3) k = 20."
      ],
      "respuesta": "20 km",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_alg_01",
        "enunciado": "3000 + 150k = 6000 → k =",
        "opciones": [
          "A) 10",
          "B) 20",
          "C) 40",
          "D) 2"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Usaste 1500/150.",
          "C": "Dividiste 6000/150 sin restar base.",
          "D": "Mal despeje."
        },
        "explicacion_correcta": "k=(6000-3000)/150=20."
      },
      {
        "id": "tr_alg_02",
        "enunciado": "Para despejar x en 3x + 6 = 18:",
        "opciones": [
          "A) x = 8",
          "B) x = 4",
          "C) x = 6",
          "D) x = 12"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Restaste mal.",
          "C": "Te quedaste en 3x=18.",
          "D": "Multiplicaste de más."
        },
        "explicacion_correcta": "3x=12 → x=4."
      },
      {
        "id": "tr_alg_03",
        "enunciado": "Si un tanque pierde agua a tasa constante, el modelo típico es:",
        "opciones": [
          "A) solo una potencia sin sentido",
          "B) cantidad inicial ± tasa·tiempo",
          "C) únicamente el nombre del tanque",
          "D) una desigualdad electoral"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No es el modelo lineal básico.",
          "C": "No calcula.",
          "D": "Irrelevante."
        },
        "explicacion_correcta": "Lineal: V = V0 − r·t."
      },
      {
        "id": "tr_alg_04",
        "enunciado": "Operación inversa de multiplicar por 5 es:",
        "opciones": [
          "A) sumar 5",
          "B) dividir entre 5",
          "C) restar 5",
          "D) elevar al cuadrado"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Suma no deshace producto.",
          "C": "Resta no deshace producto.",
          "D": "Potencia distinta."
        },
        "explicacion_correcta": "Producto ↔ división."
      }
    ],
    "profundizar": "Traduce enunciado → ecuación → despeje.",
    "terminos": [
      {
        "termino": "variable",
        "definicion": "Símbolo (x, y…) que representa un número desconocido.",
        "ejemplo": "En 2x+1=7, x es la variable."
      },
      {
        "termino": "ecuación",
        "definicion": "Igualdad con una o más incógnitas que hay que despejar.",
        "ejemplo": "3x = 12 → x = 4."
      },
      {
        "termino": "coeficiente",
        "definicion": "Número que multiplica a la variable.",
        "ejemplo": "En 5x, el coeficiente es 5."
      },
      {
        "termino": "despejar",
        "definicion": "Aislar la incógnita con operaciones inversas.",
        "ejemplo": "Si x+3=10, resta 3: x=7."
      },
      {
        "termino": "término semejante",
        "definicion": "Términos con la misma parte literal.",
        "ejemplo": "3x y 5x se suman: 8x."
      }
    ],
    "diagrama_svg": ""
  },
  "aritmetica": {
    "intro": "La aritmética opera cantidades con orden de operaciones (paréntesis, potencias, ×÷, +−) y sentido de las operaciones en contexto (totales, diferencias, tasas simples).",
    "pasos": [
      "Respeta el orden de operaciones.",
      "Convierte unidades antes de operar si hace falta.",
      "Estima un valor razonable para detectar errores gruesos."
    ],
    "errores": [
      "Sumar antes de multiplicar sin paréntesis que lo autoricen.",
      "Olvidar un paréntesis del enunciado.",
      "Mezclar unidades (minutos con horas)."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Calcula 3 + 4 × 2.",
      "pasos": [
        "1) Primero 4×2=8.",
        "2) Luego 3+8=11.",
        "3) No es (3+4)×2=14."
      ],
      "respuesta": "11",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ari_01",
        "enunciado": "3 + 4 × 2 =",
        "opciones": [
          "A) 14",
          "B) 11",
          "C) 10",
          "D) 24"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Sumaste antes.",
          "C": "Restaste mal.",
          "D": "Multiplicaste todo."
        },
        "explicacion_correcta": "Producto antes que suma."
      },
      {
        "id": "tr_ari_02",
        "enunciado": "(3 + 4) × 2 =",
        "opciones": [
          "A) 11",
          "B) 14",
          "C) 5",
          "D) 6"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Ignoraste el paréntesis.",
          "C": "Solo sumaste.",
          "D": "Solo 3×2."
        },
        "explicacion_correcta": "Paréntesis primero."
      },
      {
        "id": "tr_ari_03",
        "enunciado": "120 minutos en horas son:",
        "opciones": [
          "A) 2 h",
          "B) 12 h",
          "C) 0,12 h",
          "D) 120 h"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Dividiste mal.",
          "C": "Factor 100 erróneo.",
          "D": "Sin conversión."
        },
        "explicacion_correcta": "60 min = 1 h."
      },
      {
        "id": "tr_ari_04",
        "enunciado": "El orden correcto básico es:",
        "opciones": [
          "A) + antes que × siempre",
          "B) ×÷ antes que +− (si no hay paréntesis)",
          "C) solo de derecha a izquierda al azar",
          "D) ignorar paréntesis"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Falso.",
          "C": "No es regla.",
          "D": "Paréntesis mandan."
        },
        "explicacion_correcta": "PEMDAS/orden estándar."
      }
    ],
    "profundizar": "Orden de operaciones + conversiones.",
    "terminos": [
      {
        "termino": "orden de operaciones",
        "definicion": "Regla: paréntesis → potencias → ×÷ → +−.",
        "ejemplo": "2+3×4 = 14, no 20."
      },
      {
        "termino": "múltiplo",
        "definicion": "Resultado de multiplicar un número por un entero.",
        "ejemplo": "12 es múltiplo de 3."
      },
      {
        "termino": "divisor",
        "definicion": "Número que divide exactamente a otro.",
        "ejemplo": "4 es divisor de 12."
      },
      {
        "termino": "potencia",
        "definicion": "Multiplicar una base por sí misma n veces.",
        "ejemplo": "2³ = 2×2×2 = 8."
      },
      {
        "termino": "conversión",
        "definicion": "Pasar de una unidad a otra con un factor.",
        "ejemplo": "120 min = 2 h."
      }
    ],
    "diagrama_svg": ""
  },
  "geometria": {
    "intro": "Cuando el problema da un rectángulo con ancho = x y largo = 3x (u otras longitudes), primero decide qué pide: perímetro (contorno) o área (superficie). Perímetro: suma de lados → P = 2(x + 3x) = 8x. Área: producto → A = x · 3x = 3x². No mezcles las dos fórmulas.",
    "pasos": [
      "Lee si pregunta perímetro, área o volumen (palabras clave: contorno / cerca / superficie / pintura / capacidad).",
      "Dibuja la figura y marca cada lado (ej.: ancho x, largo 3x).",
      "Aplica solo la fórmula pedida: P = 2(L+A) o A = L·A; en triángulo rectángulo, Pitágoras si pide un lado.",
      "Simplifica (8x, 3x²…) y revisa unidades."
    ],
    "errores": [
      "Calcular área (producto) cuando pedían perímetro (suma de lados).",
      "Usar P = L+A en vez de 2(L+A) en el rectángulo.",
      "Tratar 3x como “3 + x” en lugar de “tres veces x”.",
      "Aplicar Pitágoras a un triángulo que no es rectángulo."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto · mismo tipo",
      "enunciado": "Un rectángulo tiene ancho x y largo 3x. ¿Cuál es su perímetro?",
      "pasos": [
        "1) Perímetro = contorno = 2 × (largo + ancho).",
        "2) Largo + ancho = 3x + x = 4x.",
        "3) P = 2 × 4x = 8x.",
        "4) El área sería 3x·x = 3x²: eso NO responde “perímetro”."
      ],
      "respuesta": "8x",
      "contraste": {
        "titulo": "Contraste · no confundir con área",
        "invalido": "Inválido: responder 3x² (eso es el área).",
        "valido": "Válido: 8x (perímetro del rectángulo x por 3x)."
      }
    },
    "practica": [
      {
        "id": "tr_geo_m_01",
        "enunciado": "Rectángulo de ancho x y largo 3x. Su perímetro es:",
        "opciones": [
          "A) 3x²",
          "B) 8x",
          "C) 4x",
          "D) 6x"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso es el área (x·3x).",
          "C": "Sumaste lados una sola vez (L+A), falta el ×2.",
          "D": "Solo tres lados o mal factor."
        },
        "explicacion_correcta": "P=2(x+3x)=8x."
      },
      {
        "id": "tr_geo_m_02",
        "enunciado": "Mismo rectángulo (x por 3x). Su área es:",
        "opciones": [
          "A) 8x",
          "B) 4x",
          "C) 3x²",
          "D) 3x"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Eso es el perímetro.",
          "B": "Eso es L+A, no el área.",
          "D": "Falta multiplicar x·x."
        },
        "explicacion_correcta": "A=x·3x=3x²."
      },
      {
        "id": "tr_geo_m_03",
        "enunciado": "Perímetro de un cuadrado de lado 4:",
        "opciones": [
          "A) 8",
          "B) 16",
          "C) 12",
          "D) 4"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Solo dos lados.",
          "C": "Pensaste en otra figura.",
          "D": "Un solo lado."
        },
        "explicacion_correcta": "P=4·4=16."
      },
      {
        "id": "tr_geo_m_04",
        "enunciado": "En un triángulo rectángulo, Pitágoras relaciona:",
        "opciones": [
          "A) solo los ángulos agudos entre sí",
          "B) los dos catetos y la hipotenusa",
          "C) únicamente el perímetro",
          "D) el área con π"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Pitágoras habla de lados.",
          "C": "Pitágoras no es la suma de lados.",
          "D": "π es de círculos."
        },
        "explicacion_correcta": "a²+b²=c²."
      }
    ],
    "profundizar": "Marca L y A en el dibujo; elige P=2(L+A) o A=L·A según la pregunta.",
    "terminos": [
      {
        "termino": "perímetro",
        "definicion": "Medida del contorno de una figura (suma de lados).",
        "ejemplo": "Rectángulo: P = 2 × (largo + ancho)."
      },
      {
        "termino": "área",
        "definicion": "Medida de la superficie interior de una figura plana.",
        "ejemplo": "Rectángulo: A = largo × ancho."
      },
      {
        "termino": "volumen",
        "definicion": "Espacio que ocupa un cuerpo en 3D.",
        "ejemplo": "Prisma rectangular: V = largo × ancho × alto."
      },
      {
        "termino": "cateto",
        "definicion": "Cada uno de los dos lados que forman el ángulo recto en un triángulo rectángulo.",
        "ejemplo": "En un 3-4-5, los catetos son 3 y 4."
      },
      {
        "termino": "hipotenusa",
        "definicion": "Lado opuesto al ángulo de 90°; es el más largo.",
        "ejemplo": "Pitágoras: a² + b² = c² (c = hipotenusa)."
      },
      {
        "termino": "semejanza",
        "definicion": "Figuras con la misma forma (ángulos iguales) y lados proporcionales.",
        "ejemplo": "Si la razón es 2, todos los lados se duplican."
      }
    ],
    "diagrama_svg": ""
  },
  "funciones": {
    "intro": "Una función asigna a cada x un único y. Se representa con tabla, fórmula o gráfica; la pendiente en lineales indica el cambio de y por cada unidad de x.",
    "pasos": [
      "Reconoce dominio/recorrido en el contexto.",
      "Lee en la gráfica: ¿crece, decrece, corta ejes?",
      "En y = mx + b, interpreta m y b."
    ],
    "errores": [
      "Creer que una relación vertical es función de x.",
      "Confundir pendiente con intercepto.",
      "Leer mal un punto (x,y) en la gráfica."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "y = 2x + 1. Si x=3, y=¿?",
      "pasos": [
        "1) Sustituye x=3.",
        "2) y=6+1=7.",
        "3) Un solo valor → es función."
      ],
      "respuesta": "7",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_fun_01",
        "enunciado": "En y=2x+1, si x=3, y=",
        "opciones": [
          "A) 5",
          "B) 7",
          "C) 6",
          "D) 1"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "2·3−1.",
          "C": "Olvidaste +1.",
          "D": "Solo el intercepto."
        },
        "explicacion_correcta": "2·3+1=7."
      },
      {
        "id": "tr_fun_02",
        "enunciado": "La pendiente de y=2x+1 es:",
        "opciones": [
          "A) 1",
          "B) 2",
          "C) 3",
          "D) 0"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso es b.",
          "C": "Suma indebida.",
          "D": "No es horizontal."
        },
        "explicacion_correcta": "m=2."
      },
      {
        "id": "tr_fun_03",
        "enunciado": "Una función de x no puede:",
        "opciones": [
          "A) tener un y por cada x",
          "B) asignar dos y distintos al mismo x",
          "C) graficarse",
          "D) tener intercepto"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso sí define función.",
          "C": "Sí puede.",
          "D": "Puede tenerlo."
        },
        "explicacion_correcta": "Un x → un solo y."
      },
      {
        "id": "tr_fun_04",
        "enunciado": "Si la gráfica sube de izquierda a derecha, la función:",
        "opciones": [
          "A) decrece",
          "B) crece",
          "C) es constante",
          "D) no existe"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Decrecer baja.",
          "C": "Constante es horizontal.",
          "D": "Sí existe."
        },
        "explicacion_correcta": "Creciente."
      }
    ],
    "profundizar": "Fórmula ↔ tabla ↔ gráfica.",
    "terminos": [
      {
        "termino": "función",
        "definicion": "Relación que asigna a cada x un único y.",
        "ejemplo": "y = 2x+1 es función de x."
      },
      {
        "termino": "pendiente",
        "definicion": "Cambio de y por cada unidad de x (m en y=mx+b).",
        "ejemplo": "En y=2x+1, m=2."
      },
      {
        "termino": "intercepto",
        "definicion": "Valor de y cuando x=0 (b en y=mx+b).",
        "ejemplo": "En y=2x+1, b=1."
      },
      {
        "termino": "dominio",
        "definicion": "Conjunto de valores permitidos de x.",
        "ejemplo": "En √x, dominio x≥0."
      },
      {
        "termino": "recorrido",
        "definicion": "Conjunto de valores que toma y.",
        "ejemplo": "En y=x², recorrido y≥0."
      }
    ],
    "diagrama_svg": ""
  },
  "estadistica": {
    "intro": "La estadística descriptiva resume datos: media (promedio), mediana (valor central ordenado), moda (más frecuente) y rango (máx−mín). Cada medida responde una pregunta distinta.",
    "pasos": [
      "Ordena los datos si usas mediana.",
      "Elige la medida que pide el enunciado.",
      "Cuidado con valores atípicos: afectan mucho la media."
    ],
    "errores": [
      "Calcular la media cuando pedían mediana.",
      "Olvidar ordenar para la mediana.",
      "Confundir rango con media."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Datos: 2, 4, 4, 6. Media y moda?",
      "pasos": [
        "1) Media=(2+4+4+6)/4=4.",
        "2) Moda=4 (más frecuente).",
        "3) Mediana=(4+4)/2=4."
      ],
      "respuesta": "Media 4; moda 4",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_est_01",
        "enunciado": "Media de 2,4,6:",
        "opciones": [
          "A) 4",
          "B) 6",
          "C) 2",
          "D) 12"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Tomaste el máximo.",
          "C": "Mínimo.",
          "D": "Sumaste sin dividir."
        },
        "explicacion_correcta": "(2+4+6)/3=4."
      },
      {
        "id": "tr_est_02",
        "enunciado": "Moda de 1,2,2,3:",
        "opciones": [
          "A) 1",
          "B) 2",
          "C) 3",
          "D) 8"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Aparece una vez.",
          "C": "Una vez.",
          "D": "Suma."
        },
        "explicacion_correcta": "2 es el más frecuente."
      },
      {
        "id": "tr_est_03",
        "enunciado": "Mediana de 1,3,8 (ordenados):",
        "opciones": [
          "A) 1",
          "B) 3",
          "C) 8",
          "D) 4"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Extremo.",
          "C": "Extremo.",
          "D": "Media, no mediana."
        },
        "explicacion_correcta": "Valor central=3."
      },
      {
        "id": "tr_est_04",
        "enunciado": "Rango de 5 y 12:",
        "opciones": [
          "A) 17",
          "B) 7",
          "C) 5",
          "D) 12"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Suma.",
          "C": "Mínimo.",
          "D": "Máximo."
        },
        "explicacion_correcta": "12−5=7."
      }
    ],
    "profundizar": "Media / mediana / moda / rango: elige la que preguntan.",
    "terminos": [
      {
        "termino": "media",
        "definicion": "Promedio: suma de datos ÷ cantidad de datos.",
        "ejemplo": "Media de 2,4,6 = 4."
      },
      {
        "termino": "mediana",
        "definicion": "Valor central al ordenar los datos.",
        "ejemplo": "En 1,3,8 la mediana es 3."
      },
      {
        "termino": "moda",
        "definicion": "Valor que más se repite.",
        "ejemplo": "En 2,2,5 la moda es 2."
      },
      {
        "termino": "rango",
        "definicion": "Diferencia entre el mayor y el menor.",
        "ejemplo": "12−5 = 7."
      },
      {
        "termino": "frecuencia",
        "definicion": "Cuántas veces aparece un dato.",
        "ejemplo": "Si 3 sale cinco veces, f=5."
      }
    ],
    "diagrama_svg": ""
  },
  "probabilidad": {
    "intro": "La probabilidad clásica es casos favorables / casos posibles (espacio muestral equiprobable). Unión, intersección y complemento (1−p) evitan contar de más o de menos.",
    "pasos": [
      "Define el espacio muestral.",
      "Cuenta favorables con la condición exacta.",
      "Usa complemento cuando “al menos” es más fácil al revés."
    ],
    "errores": [
      "Confundir unión con intersección.",
      "Usar 1−p del evento equivocado.",
      "Suponer independencia cuando no la hay."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Dado justo. P(par)=?",
      "pasos": [
        "1) Espacio={1..6}.",
        "2) Pares={2,4,6} → 3.",
        "3) P=3/6=1/2."
      ],
      "respuesta": "1/2",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_pro_01",
        "enunciado": "P(par) en dado justo:",
        "opciones": [
          "A) 1/6",
          "B) 1/2",
          "C) 1/3",
          "D) 2/3"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Un solo número.",
          "C": "Contaste mal.",
          "D": "Eso es impar+… distinto."
        },
        "explicacion_correcta": "3/6=1/2."
      },
      {
        "id": "tr_pro_02",
        "enunciado": "Si P(A)=0,3, P(no A)=",
        "opciones": [
          "A) 0,3",
          "B) 0,7",
          "C) 1,3",
          "D) 0"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Mismo evento.",
          "C": "Suma indebida.",
          "D": "No es imposible."
        },
        "explicacion_correcta": "Complemento 1−0,3."
      },
      {
        "id": "tr_pro_03",
        "enunciado": "Favorables/posibles requiere:",
        "opciones": [
          "A) resultados igualmente posibles (clásico)",
          "B) solo opiniones",
          "C) ignorar el enunciado",
          "D) siempre 50%"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No es definición.",
          "C": "Hay que leer la condición.",
          "D": "No siempre."
        },
        "explicacion_correcta": "Modelo clásico equiprobable."
      },
      {
        "id": "tr_pro_04",
        "enunciado": "P(A o B) con excluyentes es:",
        "opciones": [
          "A) P(A)·P(B)",
          "B) P(A)+P(B)",
          "C) P(A)−P(B)",
          "D) 1"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso es intersección independiente.",
          "C": "No es la unión.",
          "D": "Solo si es seguro."
        },
        "explicacion_correcta": "Unión de excluyentes."
      }
    ],
    "profundizar": "Espacio muestral + conteo + complemento.",
    "terminos": [
      {
        "termino": "probabilidad",
        "definicion": "Medida de qué tan posible es un evento, entre 0 y 1 (o %).",
        "ejemplo": "P(cara) en moneda justa = 1/2."
      },
      {
        "termino": "espacio muestral",
        "definicion": "Todos los resultados posibles.",
        "ejemplo": "Dado: {1,2,3,4,5,6}."
      },
      {
        "termino": "evento",
        "definicion": "Subconjunto del espacio muestral.",
        "ejemplo": "Salir par: {2,4,6}."
      },
      {
        "termino": "complemento",
        "definicion": "Lo que no es el evento A (se escribe Aᶜ).",
        "ejemplo": "P(Aᶜ)=1−P(A)."
      },
      {
        "termino": "excluyentes",
        "definicion": "Eventos que no pueden ocurrir a la vez.",
        "ejemplo": "Par e impar en un dado."
      }
    ],
    "diagrama_svg": ""
  },
  "trigonometria": {
    "intro": "En un triángulo rectángulo: sen = opuesto/hipotenusa, cos = adyacente/hipotenusa, tan = opuesto/adyacente. El ángulo determina qué lados usar.",
    "pasos": [
      "Dibuja y marca opuesto, adyacente e hipotenusa respecto al ángulo.",
      "Elige seno, coseno o tangente.",
      "Despeja el lado pedido."
    ],
    "errores": [
      "Invertir opuesto y adyacente.",
      "Usar hipotenusa como cateto.",
      "Aplicar razones en un triángulo no rectángulo sin ley adecuada."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "En rectángulo, opuesto=3, hipotenusa=5. sen θ=?",
      "pasos": [
        "1) sen=op/hip.",
        "2) 3/5.",
        "3) No uses adyacente aquí."
      ],
      "respuesta": "3/5",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_tri_01",
        "enunciado": "sen θ si op=3, hip=5:",
        "opciones": [
          "A) 5/3",
          "B) 3/5",
          "C) 3/4",
          "D) 4/5"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Invertiste.",
          "C": "Usaste otro cateto sin dato.",
          "D": "Eso sería un cos si adj=4."
        },
        "explicacion_correcta": "sen=3/5."
      },
      {
        "id": "tr_tri_02",
        "enunciado": "cos θ = adyacente /:",
        "opciones": [
          "A) opuesto",
          "B) hipotenusa",
          "C) tangente",
          "D) área"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso no es cos.",
          "C": "Tangente es razón distinta.",
          "D": "No."
        },
        "explicacion_correcta": "cos=adj/hip."
      },
      {
        "id": "tr_tri_03",
        "enunciado": "tan θ =",
        "opciones": [
          "A) hip/op",
          "B) op/adj",
          "C) adj/op al cuadrado",
          "D) sen+cos"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Invertido.",
          "C": "No.",
          "D": "Identidad distinta."
        },
        "explicacion_correcta": "tan=op/adj."
      },
      {
        "id": "tr_tri_04",
        "enunciado": "La hipotenusa es:",
        "opciones": [
          "A) el cateto menor siempre",
          "B) el lado opuesto al ángulo recto",
          "C) un ángulo",
          "D) el perímetro"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No por tamaño solo.",
          "C": "Es lado.",
          "D": "No."
        },
        "explicacion_correcta": "Frente al ángulo de 90°."
      }
    ],
    "profundizar": "SOH-CAH-TOA con dibujo.",
    "terminos": [
      {
        "termino": "seno",
        "definicion": "En un triángulo rectángulo: cateto opuesto ÷ hipotenusa.",
        "ejemplo": "sen θ = op/hip."
      },
      {
        "termino": "coseno",
        "definicion": "Cateto adyacente ÷ hipotenusa.",
        "ejemplo": "cos θ = adj/hip."
      },
      {
        "termino": "tangente",
        "definicion": "Cateto opuesto ÷ cateto adyacente.",
        "ejemplo": "tan θ = op/adj."
      },
      {
        "termino": "ángulo",
        "definicion": "Abertura entre dos lados; en grados o radianes.",
        "ejemplo": "Un ángulo recto mide 90°."
      },
      {
        "termino": "razón trigonométrica",
        "definicion": "Relación entre lados según el ángulo.",
        "ejemplo": "SOH-CAH-TOA."
      }
    ],
    "diagrama_svg": ""
  },
  "combinatoria": {
    "intro": "La combinatoria cuenta arreglos: permutaciones (el orden importa) y combinaciones (el orden no importa). Multiplica opciones en etapas sucesivas (principio multiplicativo).",
    "pasos": [
      "Decide si el orden importa.",
      "Usa P o C (o producto de casos) según corresponda.",
      "No doble-cuentes el mismo grupo."
    ],
    "errores": [
      "Usar combinaciones cuando el orden sí importa.",
      "Sumar cuando las etapas son sucesivas (debía multiplicar).",
      "Olvidar restricciones del enunciado."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "¿De cuántas formas elegir 2 libros de 4 si el orden no importa?",
      "pasos": [
        "1) Combinación C(4,2).",
        "2) 4·3/2!=6.",
        "3) Si el orden importara sería 12."
      ],
      "respuesta": "6",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_comb_01",
        "enunciado": "C(4,2) =",
        "opciones": [
          "A) 6",
          "B) 12",
          "C) 8",
          "D) 2"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso es P(4,2).",
          "C": "Mal cálculo.",
          "D": "Solo resta."
        },
        "explicacion_correcta": "C=6."
      },
      {
        "id": "tr_comb_02",
        "enunciado": "Si el orden importa en 4 para 2:",
        "opciones": [
          "A) C(4,2)",
          "B) P(4,2)=12",
          "C) 4+2",
          "D) 1"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "C ignora orden.",
          "C": "Suma indebida.",
          "D": "No."
        },
        "explicacion_correcta": "Permutación."
      },
      {
        "id": "tr_comb_03",
        "enunciado": "Menú: 3 sopas y 2 jugos. ¿Pares sopa+jugo?",
        "opciones": [
          "A) 5",
          "B) 6",
          "C) 3",
          "D) 2"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Sumaste.",
          "C": "Solo sopas.",
          "D": "Solo jugos."
        },
        "explicacion_correcta": "3·2=6."
      },
      {
        "id": "tr_comb_04",
        "enunciado": "Combinación se usa cuando:",
        "opciones": [
          "A) el orden no importa",
          "B) el orden siempre importa",
          "C) hay infinitos casos sin regla",
          "D) solo en física"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso es permutación.",
          "C": "Hay regla de conteo.",
          "D": "Es matemática."
        },
        "explicacion_correcta": "Orden irrelevante → C."
      }
    ],
    "profundizar": "Orden sí/no → P o C; etapas → producto.",
    "terminos": [
      {
        "termino": "permutación",
        "definicion": "Arreglos donde el orden importa.",
        "ejemplo": "ABC ≠ ACB."
      },
      {
        "termino": "combinación",
        "definicion": "Selecciones donde el orden no importa.",
        "ejemplo": "Elegir 2 de {A,B,C}: AB=BA."
      },
      {
        "termino": "factorial",
        "definicion": "n! = n×(n−1)×…×1.",
        "ejemplo": "4! = 24."
      },
      {
        "termino": "principio multiplicativo",
        "definicion": "Si hay m y n formas, en total m×n.",
        "ejemplo": "3 camisas × 2 pantalones = 6 outfits."
      }
    ],
    "diagrama_svg": ""
  },
  "calculo_limites": {
    "intro": "Un límite describe el valor al que se acerca una función cuando x tiende a un número (o ±∞), aunque f(a) no exista. Se simplifica algebraicamente (factorizar) para quitar indeterminaciones 0/0.",
    "pasos": [
      "Sustituye el valor si f es continua allí.",
      "Si sale 0/0, factoriza/simplifica y vuelve a sustituir.",
      "Interpreta el resultado como tendencia, no solo como “f(a)”."
    ],
    "errores": [
      "Declarar que no existe límite solo porque f(a) no está definida, sin mirar laterales.",
      "Cancelar términos indebidos.",
      "Confundir límite con derivada."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "lim x→2 (x²−4)/(x−2)",
      "pasos": [
        "1) Sustituir da 0/0.",
        "2) Factoriza (x−2)(x+2)/(x−2).",
        "3) Para x≠2 queda x+2 → 4."
      ],
      "respuesta": "4",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lim_01",
        "enunciado": "lim x→2 (x²−4)/(x−2) =",
        "opciones": [
          "A) 0",
          "B) 4",
          "C) ∞",
          "D) 2"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Indeterminación, no el límite.",
          "C": "No diverge aquí.",
          "D": "Te quedaste a medias."
        },
        "explicacion_correcta": "Simplifica a x+2 → 4."
      },
      {
        "id": "tr_lim_02",
        "enunciado": "0/0 al sustituir indica:",
        "opciones": [
          "A) fin del problema",
          "B) indeterminación: hay que simplificar",
          "C) el límite es siempre 0",
          "D) el límite es 1"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Se puede resolver.",
          "C": "No necesariamente.",
          "D": "No."
        },
        "explicacion_correcta": "Indeterminación algebraica."
      },
      {
        "id": "tr_lim_03",
        "enunciado": "Si f es polinomio, lim x→a f(x) =",
        "opciones": [
          "A) siempre 0",
          "B) f(a)",
          "C) la derivada",
          "D) no existe"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Falso.",
          "C": "Derivada es otro objeto.",
          "D": "Existe por continuidad."
        },
        "explicacion_correcta": "Continuidad de polinomios."
      },
      {
        "id": "tr_lim_04",
        "enunciado": "El límite describe:",
        "opciones": [
          "A) solo un punto aislado sin tendencia",
          "B) el valor al que se acerca f(x)",
          "C) únicamente el área",
          "D) la moda estadística"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Es tendencia.",
          "C": "Integral distinta.",
          "D": "Otra área."
        },
        "explicacion_correcta": "Tendencia de f(x)."
      }
    ],
    "profundizar": "Sustitución → indeterminación → simplificar.",
    "terminos": [
      {
        "termino": "límite",
        "definicion": "Valor al que se acerca f(x) cuando x se acerca a un número.",
        "ejemplo": "lim x→2 (x+1) = 3."
      },
      {
        "termino": "indeterminación",
        "definicion": "Forma que no se resuelve directo (0/0, ∞/∞…).",
        "ejemplo": "En 0/0 hay que simplificar."
      },
      {
        "termino": "continuidad",
        "definicion": "La función no “salta” en el punto.",
        "ejemplo": "Los polinomios son continuos en ℝ."
      },
      {
        "termino": "asimíntota",
        "definicion": "Recta a la que la gráfica se acerca sin tocarla necesariamente.",
        "ejemplo": "y=1/x tiene asíntota x=0."
      }
    ],
    "diagrama_svg": ""
  },
  "cts": {
    "intro": "Ciencia, tecnología y sociedad (CTS) analiza cómo una decisión técnica (energía, agro, salud) impacta ambiente, equidad y riesgos. No basta nombrar la tecnología: hay que enlazar mecanismo e impacto.",
    "pasos": [
      "Identifica la tecnología o medida propuesta.",
      "Señala el impacto ambiental/social relevante del caso.",
      "Evalúa trade-offs (beneficio vs riesgo) con evidencia del enunciado."
    ],
    "errores": [
      "Elegir una opción que ignora el impacto descrito.",
      "Confundir correlación local con solución universal.",
      "Olvidar el contexto ecológico del sitio (páramo, mar, café…)."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Paneles solares cerca de un santuario marino para reducir impacto…",
      "pasos": [
        "1) La medida busca mitigar presión ambiental.",
        "2) Debe cuidarse que la instalación no dañe el ecosistema que se quiere proteger.",
        "3) La mejor opción equilibra energía limpia y conservación."
      ],
      "respuesta": "Mitigar impacto sin destruir el ecosistema protegido",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_cts_01",
        "enunciado": "CTS conecta principalmente:",
        "opciones": [
          "A) solo fórmulas sin contexto",
          "B) ciencia/tecnología con impactos sociales y ambientales",
          "C) únicamente fechas históricas",
          "D) solo gramática"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Falta el impacto.",
          "C": "Eso es historia.",
          "D": "Inglés."
        },
        "explicacion_correcta": "Tecnología + sociedad/ambiente."
      },
      {
        "id": "tr_cts_02",
        "enunciado": "Un trade-off es:",
        "opciones": [
          "A) ganar todo sin costo",
          "B) un equilibrio entre beneficio y costo/riesgo",
          "C) un error de suma",
          "D) una capital de departamento"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Irreal en CTS.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Compromiso beneficio-riesgo."
      },
      {
        "id": "tr_cts_03",
        "enunciado": "En un páramo, una intervención debe considerar sobre todo:",
        "opciones": [
          "A) solo el color del panel",
          "B) el agua y ecosistemas de alta montaña",
          "C) el Mediterráneo",
          "D) la moda estadística de otro país"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Secundario.",
          "C": "Fuera de contexto.",
          "D": "Irrelevante."
        },
        "explicacion_correcta": "Páramo = retención hídrica/frailejones."
      },
      {
        "id": "tr_cts_04",
        "enunciado": "La mejor respuesta CTS suele:",
        "opciones": [
          "A) negar todo impacto",
          "B) articular evidencia del caso con consecuencias",
          "C) copiar una definición vacía",
          "D) hablar de otra región sin datos"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Siempre hay efectos.",
          "C": "Insuficiente.",
          "D": "Fuera de caso."
        },
        "explicacion_correcta": "Evidencia + impacto."
      }
    ],
    "profundizar": "Caso → tecnología → impacto → decisión informada.",
    "terminos": [
      {
        "termino": "CTS",
        "definicion": "Ciencia, Tecnología y Sociedad: impactos mutuos.",
        "ejemplo": "Una presa: energía + efecto ambiental."
      },
      {
        "termino": "impacto ambiental",
        "definicion": "Efecto de una acción humana sobre el entorno.",
        "ejemplo": "Deforestación reduce biodiversidad."
      },
      {
        "termino": "riesgo-beneficio",
        "definicion": "Balancear ventajas y daños posibles.",
        "ejemplo": "Vacunas: beneficio alto, riesgo controlado."
      },
      {
        "termino": "evidencia",
        "definicion": "Datos que sostienen una afirmación científica.",
        "ejemplo": "Mediciones, experimentos, estudios."
      }
    ],
    "diagrama_svg": ""
  },
  "indagacion": {
    "intro": "La indagación científica plantea preguntas, hipótesis, variables (independiente/dependiente/controladas) y evidencia. Un buen diseño cambia una variable a la vez y mide con claridad.",
    "pasos": [
      "Separa pregunta, hipótesis y variable que se manipula.",
      "Identifica qué se mide (dependiente) y qué se controla.",
      "Concluye solo lo que los datos permiten."
    ],
    "errores": [
      "Confundir hipótesis con conclusión ya demostrada.",
      "Cambiar varias variables a la vez.",
      "Generalizar más allá de la evidencia."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Se varía la luz y se mide O₂ en plantas. ¿Variable independiente?",
      "pasos": [
        "1) Independiente = la que el experimentador cambia.",
        "2) Aquí: intensidad de luz.",
        "3) Dependiente: tasa de O₂."
      ],
      "respuesta": "Intensidad de luz",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ind_01",
        "enunciado": "Variable independiente es:",
        "opciones": [
          "A) la que se mide como resultado",
          "B) la que se manipula",
          "C) el nombre del laboratorio",
          "D) siempre el tiempo político"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso es dependiente.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Se manipula."
      },
      {
        "id": "tr_ind_02",
        "enunciado": "Variable dependiente es:",
        "opciones": [
          "A) la respuesta medida",
          "B) la que se fija de antemano como causa",
          "C) un distractor gramatical",
          "D) la hipótesis misma"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso es independiente/control.",
          "C": "No.",
          "D": "Hipótesis ≠ medición."
        },
        "explicacion_correcta": "Se mide el efecto."
      },
      {
        "id": "tr_ind_03",
        "enunciado": "Controlar variables significa:",
        "opciones": [
          "A) ignorarlas",
          "B) mantenerlas constantes para aislar el efecto",
          "C) cambiarlas todas",
          "D) borrar datos"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Rompe el diseño.",
          "C": "Confunde causas.",
          "D": "Mala práctica."
        },
        "explicacion_correcta": "Aislar la causa."
      },
      {
        "id": "tr_ind_04",
        "enunciado": "Una hipótesis es:",
        "opciones": [
          "A) una respuesta tentativa comprobable",
          "B) un resultado ya publicado obligatorio",
          "C) una opinión sin prueba posible",
          "D) un mapa político"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Aún se pone a prueba.",
          "C": "Debe ser comprobable.",
          "D": "No."
        },
        "explicacion_correcta": "Afirmación comprobable."
      }
    ],
    "profundizar": "Pregunta → variables → evidencia → conclusión limitada.",
    "terminos": [
      {
        "termino": "hipótesis",
        "definicion": "Afirmación comprobable que se pone a prueba.",
        "ejemplo": "“Si añado sal, el punto de ebullición sube.”"
      },
      {
        "termino": "variable independiente",
        "definicion": "Lo que el experimentador manipula.",
        "ejemplo": "Cantidad de fertilizante."
      },
      {
        "termino": "variable dependiente",
        "definicion": "Lo que se mide como efecto.",
        "ejemplo": "Altura de la planta."
      },
      {
        "termino": "control",
        "definicion": "Condiciones que se mantienen iguales.",
        "ejemplo": "Misma luz y agua en todos los grupos."
      },
      {
        "termino": "evidencia",
        "definicion": "Resultados que apoyan o refutan la hipótesis.",
        "ejemplo": "Tabla de mediciones."
      }
    ],
    "diagrama_svg": ""
  },
  "argumentacion": {
    "intro": "Un argumento une premisas (razones) con una conclusión. Es válido si la conclusión se sigue; es falaz si hay un salto (pendiente resbaladiza, ad hominem, etc.).",
    "pasos": [
      "Separa premisas y conclusión.",
      "Pregunta si las premisas bastan o hay salto.",
      "Nombra el tipo de fallo si lo hay."
    ],
    "errores": [
      "Confundir premisa con conclusión.",
      "Aceptar lo que “suena bien” sin apoyo.",
      "Mezclar tipos de falacia."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "«Si permitimos celulares en clase, el colegio colapsará.»",
      "pasos": [
        "1) Premisa implícita: permitir celulares.",
        "2) Conclusión: el colegio colapsa.",
        "3) Salto sin pasos intermedios → pendiente resbaladiza.",
        "4) Por eso la conclusión no se sigue: de un permiso no se deduce un desastre total."
      ],
      "respuesta": "Pendiente resbaladiza",
      "contraste": {
        "titulo": "Contraste · argumento válido (corto)",
        "invalido": "Inválido: «Si hay celulares, el colegio colapsa.»",
        "valido": "Válido: «Si el reglamento prohíbe celulares y Ana usa uno, Ana incumple el reglamento.»"
      }
    },
    "practica": [
      {
        "id": "tr_arg_01",
        "enunciado": "Premisa: «Permitimos X.» Conclusión: «Todo colapsa.» ¿Qué falla?",
        "opciones": [
          "A) Pendiente resbaladiza: la conclusión no se sigue",
          "B) Dato estadístico sólido",
          "C) Solo una norma escolar",
          "D) Definición de X"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No hay evidencia numérica.",
          "C": "No describe norma: predice desastre.",
          "D": "No define: afirma consecuencias."
        },
        "explicacion_correcta": "Salto permiso→colapso."
      },
      {
        "id": "tr_arg_02",
        "enunciado": "«Todo M es P» y «Todo S es M» ⇒",
        "opciones": [
          "A) Ningún S es P",
          "B) Todo S es P",
          "C) Algún P no es S necesariamente aquí",
          "D) Nada"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Negación indebida.",
          "C": "No es lo deducido.",
          "D": "Sí se deduce inclusión."
        },
        "explicacion_correcta": "Transitividad válida."
      },
      {
        "id": "tr_arg_03",
        "enunciado": "«No oigas su propuesta: reprobó dos materias.»",
        "opciones": [
          "A) Falsa analogía",
          "B) Ad hominem",
          "C) Generalización con muestra",
          "D) Definición circular"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No compara casos.",
          "C": "No generaliza muestra.",
          "D": "No redefine."
        },
        "explicacion_correcta": "Ataca a la persona."
      },
      {
        "id": "tr_arg_04",
        "enunciado": "La conclusión de un argumento es:",
        "opciones": [
          "A) la idea que se quiere que aceptes a partir de las razones",
          "B) cualquier anécdota",
          "C) solo el título",
          "D) una pregunta sin tesis"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Puede ser premisa.",
          "C": "Orienta, no demuestra.",
          "D": "No es tesis."
        },
        "explicacion_correcta": "Conclusión = lo sostenido."
      }
    ],
    "profundizar": "Premisa → conclusión; detecta saltos.",
    "terminos": [
      {
        "termino": "premisa",
        "definicion": "Razón o dato que sostiene la conclusión.",
        "ejemplo": "“Todos los humanos son mortales…”"
      },
      {
        "termino": "conclusión",
        "definicion": "Lo que se afirma a partir de las premisas.",
        "ejemplo": "“…Sócrates es mortal.”"
      },
      {
        "termino": "falacia",
        "definicion": "Razonamiento inválido que parece convincente.",
        "ejemplo": "Atacar a la persona (ad hominem)."
      },
      {
        "termino": "evidencia",
        "definicion": "Apoyo textual o factual de una afirmación.",
        "ejemplo": "Cita o dato del texto."
      },
      {
        "termino": "inferencia",
        "definicion": "Conclusión razonable a partir de pistas del texto.",
        "ejemplo": "No está literal, pero se deduce."
      }
    ],
    "diagrama_svg": ""
  },
  "fracciones": {
    "intro": "Una fracción a/b compara una parte (numerador) con un todo en b partes iguales. Equivalentes representan la misma cantidad (1/2=2/4).",
    "pasos": [
      "Para sumar/restar: iguala denominadores (mcm).",
      "Para comparar: mismo denominador o decimal.",
      "«De» suele ser multiplicación: (2/5)×40."
    ],
    "errores": [
      "Sumar numeradores y denominadores por separado.",
      "Olvidar el denominador común.",
      "Invertir sin que lo pidan."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "1/2 + 1/3",
      "pasos": [
        "1) mcm(2,3)=6.",
        "2) 3/6+2/6.",
        "3) 5/6."
      ],
      "respuesta": "5/6",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_frac_01",
        "enunciado": "1/2+1/3=",
        "opciones": [
          "A) 2/5",
          "B) 5/6",
          "C) 1/5",
          "D) 2/6"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Sumaste arriba y abajo.",
          "C": "Procedimiento invertido.",
          "D": "Incompleto."
        },
        "explicacion_correcta": "3/6+2/6=5/6."
      },
      {
        "id": "tr_frac_02",
        "enunciado": "(2/5) de 40=",
        "opciones": [
          "A) 20",
          "B) 16",
          "C) 8",
          "D) 10"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Usaste 1/2.",
          "C": "Solo 1/5.",
          "D": "1/4."
        },
        "explicacion_correcta": "16."
      },
      {
        "id": "tr_frac_03",
        "enunciado": "Mayor: 3/4 o 5/8?",
        "opciones": [
          "A) 5/8",
          "B) 3/4",
          "C) Iguales",
          "D) No comparables"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "5/8=0,625<0,75.",
          "C": "3/4=6/8>5/8.",
          "D": "Sí se comparan."
        },
        "explicacion_correcta": "3/4 mayor."
      },
      {
        "id": "tr_frac_04",
        "enunciado": "Simplifica 8/12:",
        "opciones": [
          "A) 4/6",
          "B) 2/3",
          "C) 8/3",
          "D) 3/2"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Aún simplificable.",
          "C": "No es simplificar.",
          "D": "Recíproco."
        },
        "explicacion_correcta": "mcd=4 → 2/3."
      }
    ],
    "profundizar": "mcm, equivalencia y “de” como producto.",
    "terminos": [
      {
        "termino": "numerador",
        "definicion": "Parte de arriba: cuántas partes se toman.",
        "ejemplo": "En 3/4, el 3 es el numerador."
      },
      {
        "termino": "denominador",
        "definicion": "Parte de abajo: en cuántas partes iguales se divide el todo.",
        "ejemplo": "En 3/4, el 4 es el denominador."
      },
      {
        "termino": "equivalente",
        "definicion": "Fracciones distintas que representan la misma cantidad.",
        "ejemplo": "1/2 = 2/4 = 3/6."
      },
      {
        "termino": "mcm",
        "definicion": "Mínimo común múltiplo: el menor múltiplo común de dos o más números.",
        "ejemplo": "Para sumar 1/4 + 1/6 se usa mcm(4,6)=12."
      },
      {
        "termino": "simplificar",
        "definicion": "Dividir numerador y denominador por el mismo factor.",
        "ejemplo": "6/8 ÷ 2/2 = 3/4."
      }
    ],
    "diagrama_svg": ""
  },
  "proporcionalidad": {
    "intro": "Magnitudes directamente proporcionales crecen juntas en la misma razón. Inversas: al subir una baja la otra y el producto se conserva.",
    "pasos": [
      "Clasifica: más→más (directa) o más→menos (inversa).",
      "Directa a/b=c/d; inversa a·b=c·d.",
      "Convierte unidades antes."
    ],
    "errores": [
      "Tratar inversa como directa.",
      "Sumar en vez de usar la razón.",
      "Olvidar conversiones de tiempo."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "4 obreros · 6 días. ¿Días con 3?",
      "pasos": [
        "1) Inversa: personas×días constante.",
        "2) 4×6=24.",
        "3) 24/3=8."
      ],
      "respuesta": "8 días",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_prop_01",
        "enunciado": "4 obreros·6 días → con 3:",
        "opciones": [
          "A) 4,5",
          "B) 8",
          "C) 12",
          "D) 2"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "La trataste directa.",
          "C": "Mal producto.",
          "D": "Con menos gente tarda más."
        },
        "explicacion_correcta": "24/3=8."
      },
      {
        "id": "tr_prop_02",
        "enunciado": "5 cuadernos=20000. ¿7?",
        "opciones": [
          "A) 28000",
          "B) 25000",
          "C) 14000",
          "D) 35000"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Suma sin unitario.",
          "C": "Razón invertida.",
          "D": "De más."
        },
        "explicacion_correcta": "4000×7."
      },
      {
        "id": "tr_prop_03",
        "enunciado": "120 km en 2 h → en 3 h:",
        "opciones": [
          "A) 150",
          "B) 180",
          "C) 240",
          "D) 60"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Suma arbitraria.",
          "C": "Duplicaste 120.",
          "D": "1 h."
        },
        "explicacion_correcta": "60 km/h×3."
      },
      {
        "id": "tr_prop_04",
        "enunciado": "Si al duplicar obreros el tiempo se reduce a la mitad (mismo trabajo), es:",
        "opciones": [
          "A) directa",
          "B) inversa",
          "C) aleatoria",
          "D) geométrica forzada"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Directa crecería juntas.",
          "C": "Hay regla.",
          "D": "No aplica."
        },
        "explicacion_correcta": "Producto constante."
      }
    ],
    "profundizar": "Regla de tres directa e inversa.",
    "terminos": [
      {
        "termino": "razón",
        "definicion": "Comparación de dos cantidades mediante una división a:b o a/b.",
        "ejemplo": "2:5 = 2/5."
      },
      {
        "termino": "proporción",
        "definicion": "Igualdad de dos razones.",
        "ejemplo": "2/3 = 4/6."
      },
      {
        "termino": "directa",
        "definicion": "Si una magnitud sube, la otra también (en la misma razón).",
        "ejemplo": "Más horas → más salario a tarifa fija."
      },
      {
        "termino": "inversa",
        "definicion": "Si una magnitud sube, la otra baja.",
        "ejemplo": "Más obreros → menos días para la misma obra."
      },
      {
        "termino": "regla de tres",
        "definicion": "Método para hallar el cuarto valor en una proporción.",
        "ejemplo": "Si 3 cuestan 12, 5 cuestan x → 3/12 = 5/x."
      }
    ],
    "diagrama_svg": ""
  },
  "inferencia": {
    "intro": "Una inferencia válida extrae algo que se sigue del texto sin inventar datos externos. Si el texto no lo sostiene, no es inferencia válida.",
    "pasos": [
      "Localiza pistas textuales.",
      "Formula lo que se sigue.",
      "Descarta lo que el texto no autoriza."
    ],
    "errores": [
      "Inventar causas no dichas.",
      "Confundir opinión propia con inferencia.",
      "Generalizar más allá del párrafo."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Texto: «Ana salió con paraguas; la calle estaba mojada.» Inferencia razonable:",
      "pasos": [
        "1) Hay indicios de lluvia o piso húmedo.",
        "2) No afirma el color del paraguas.",
        "3) Inferencia: probablemente llovió o llovía."
      ],
      "respuesta": "Probablemente había lluvia / piso mojado por lluvia",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_inf_01",
        "enunciado": "Inferencia válida debe:",
        "opciones": [
          "A) contradecir el texto",
          "B) seguirse de pistas del texto",
          "C) ignorar el texto",
          "D) ser solo un rumor"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Contradicción no vale.",
          "C": "Sin texto no hay inferencia del ítem.",
          "D": "Sin apoyo."
        },
        "explicacion_correcta": "Se sigue del texto."
      },
      {
        "id": "tr_inf_02",
        "enunciado": "«El termómetro marca 39 °C.» Inferencia clínica básica en contexto escolar típico:",
        "opciones": [
          "A) hay fiebre probable",
          "B) es invierno en Europa necesariamente",
          "C) el aparato está en la Luna",
          "D) no significa nada"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No se deduce el continente.",
          "C": "Absurdo.",
          "D": "Sí hay lectura."
        },
        "explicacion_correcta": "39 °C sugiere fiebre."
      },
      {
        "id": "tr_inf_03",
        "enunciado": "No es inferencia válida:",
        "opciones": [
          "A) lo que el texto implica",
          "B) un dato que el texto nunca sugiere",
          "C) una conclusión con apoyo",
          "D) una lectura de una pista"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Sí es.",
          "C": "Sí es.",
          "D": "Sí es."
        },
        "explicacion_correcta": "Sin apoyo = inválida."
      },
      {
        "id": "tr_inf_04",
        "enunciado": "Para validar una inferencia:",
        "opciones": [
          "A) citas la pista",
          "B) inventas un final",
          "C) cambias el tema",
          "D) miras solo la opción más larga"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Invención.",
          "C": "Fuera de foco.",
          "D": "Longitud ≠ verdad."
        },
        "explicacion_correcta": "Apoyo textual."
      }
    ],
    "profundizar": "Profundiza en «inferencias válidas» con ejemplos nuevos del mismo esquema.",
    "terminos": [
      {
        "termino": "inferencia",
        "definicion": "Sacar una conclusión no dicha literalmente, pero apoyada.",
        "ejemplo": "Si llueve y hay paraguas → probablemente saldrá."
      },
      {
        "termino": "pista textual",
        "definicion": "Detalle del texto que permite deducir.",
        "ejemplo": "“Apagó la luz y bostezó” → cansancio."
      },
      {
        "termino": "implícito",
        "definicion": "Lo que se entiende sin estar escrito palabra por palabra.",
        "ejemplo": "Tono irónico, intención."
      },
      {
        "termino": "sobrelectura",
        "definicion": "Atribuir al texto lo que no sostiene.",
        "ejemplo": "Error típico en opciones inventadas."
      }
    ],
    "diagrama_svg": ""
  },
  "comprension_literal": {
    "intro": "La comprensión literal recupera información explícita: nombres, cifras, hechos dichos tal cual en el texto.",
    "pasos": [
      "Subraya el dato pedido.",
      "Contrasta con cada opción.",
      "Elige la que reproduce el texto."
    ],
    "errores": [
      "Inferir de más.",
      "Cambiar una cifra.",
      "Confundir un personaje con otro."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Texto: «La reunión es a las 8 a. m. en el aula 2.» ¿Hora?",
      "pasos": [
        "1) El texto dice 8 a. m.",
        "2) Lugar es otro dato.",
        "3) Respuesta literal: 8 a. m."
      ],
      "respuesta": "8 a. m.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lit_01",
        "enunciado": "Literal significa:",
        "opciones": [
          "A) inventar el final",
          "B) recuperar lo dicho explícitamente",
          "C) solo opinar",
          "D) ignorar cifras"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Eso no es literal.",
          "C": "Opinión ≠ literal.",
          "D": "Las cifras cuentan."
        },
        "explicacion_correcta": "Dato explícito."
      },
      {
        "id": "tr_lit_02",
        "enunciado": "Si el texto dice “tres días”, la respuesta literal no es:",
        "opciones": [
          "A) tres días",
          "B) una semana inventada",
          "C) tres días de plazo",
          "D) el mismo dato"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Correcto literal.",
          "C": "Puede ser paráfrasis fiel.",
          "D": "Correcto."
        },
        "explicacion_correcta": "No inventes."
      },
      {
        "id": "tr_lit_03",
        "enunciado": "La clave literal está:",
        "opciones": [
          "A) fuera del texto",
          "B) en una oración del texto",
          "C) solo en tu memoria de otra obra",
          "D) en la opción más corta siempre"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No.",
          "C": "Puede despistar.",
          "D": "No."
        },
        "explicacion_correcta": "En el texto."
      },
      {
        "id": "tr_lit_04",
        "enunciado": "Paráfrasis literal válida:",
        "opciones": [
          "A) cambia el sentido",
          "B) dice lo mismo con otras palabras fieles",
          "C) agrega un final nuevo",
          "D) niega el dato"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Invalida.",
          "C": "Añadido.",
          "D": "Contradicción."
        },
        "explicacion_correcta": "Mismo sentido."
      }
    ],
    "profundizar": "Profundiza en «comprensión literal» con ejemplos nuevos del mismo esquema.",
    "terminos": [
      {
        "termino": "literal",
        "definicion": "Lo que el texto dice de forma explícita.",
        "ejemplo": "Nombres, fechas, cifras."
      },
      {
        "termino": "idea principal",
        "definicion": "Lo central que el texto comunica.",
        "ejemplo": "No un detalle secundario."
      },
      {
        "termino": "detalle",
        "definicion": "Dato específico que apoya la idea.",
        "ejemplo": "Una cifra o un ejemplo."
      },
      {
        "termino": "parafraseo",
        "definicion": "Decir lo mismo con otras palabras sin cambiar el sentido.",
        "ejemplo": "Útil para verificar comprensión."
      }
    ],
    "diagrama_svg": ""
  },
  "cloze": {
    "intro": "En inglés, el hueco de una oración se completa con la forma que concuerda con el sujeto y con las pistas de tiempo. Yesterday / last week → pasado simple; since / for + resultado presente → present perfect; he/she/it en presente añade -s.",
    "pasos": [
      "Busca marcas de tiempo (yesterday, now, since, tomorrow).",
      "Mira el sujeto: I/you/we/they vs he/she/it.",
      "Elige el tiempo y la forma (afirmativa, negativa o interrogativa) que encajan juntos."
    ],
    "errores": [
      "Usar present simple con yesterday.",
      "Olvidar la -s de he/she/it en presente.",
      "Elegir un infinitivo cuando la estructura pide -ing o pasado."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "She _____ to the library yesterday.",
      "pasos": [
        "1) yesterday = pasado.",
        "2) Sujeto she → verbo en pasado: went (go → went).",
        "3) No uses goes (presente) ni going (sin auxiliar)."
      ],
      "respuesta": "went",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_cloze_01",
        "enunciado": "They _____ soccer every Saturday.",
        "opciones": [
          "A) plays",
          "B) play",
          "C) playing",
          "D) played yesterday"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "plays es para he/she/it.",
          "C": "Falta auxiliar (are playing).",
          "D": "yesterday contradice every Saturday."
        },
        "explicacion_correcta": "They + present simple = play."
      },
      {
        "id": "tr_cloze_02",
        "enunciado": "He _____ here since 2020.",
        "opciones": [
          "A) lives",
          "B) lived",
          "C) has lived",
          "D) living"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Presente simple no marca since.",
          "B": "Pasado corto no cubre desde 2020 hasta ahora.",
          "D": "Falta has/is."
        },
        "explicacion_correcta": "since → present perfect: has lived."
      },
      {
        "id": "tr_cloze_03",
        "enunciado": "I _____ my homework last night.",
        "opciones": [
          "A) do",
          "B) does",
          "C) did",
          "D) doing"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "do es presente.",
          "B": "does es he/she.",
          "D": "doing necesita auxiliar."
        },
        "explicacion_correcta": "last night → did."
      },
      {
        "id": "tr_cloze_04",
        "enunciado": "We _____ to the museum tomorrow.",
        "opciones": [
          "A) go",
          "B) went",
          "C) are going",
          "D) gone"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "go no marca futuro planificado.",
          "B": "went es pasado.",
          "D": "gone es participio."
        },
        "explicacion_correcta": "tomorrow + plan → are going."
      }
    ],
    "profundizar": "Practica tiempos: past, present, present perfect y futuros con marcas de tiempo.",
    "terminos": [
      {
        "termino": "concordancia",
        "definicion": "El verbo debe coincidir con el sujeto (número/persona).",
        "ejemplo": "He plays / They play."
      },
      {
        "termino": "tiempo verbal",
        "definicion": "Forma del verbo según cuándo ocurre la acción.",
        "ejemplo": "Yesterday → past simple."
      },
      {
        "termino": "presente simple",
        "definicion": "Hábitos y hechos generales.",
        "ejemplo": "She works every day."
      },
      {
        "termino": "pasado simple",
        "definicion": "Acciones terminadas en el pasado.",
        "ejemplo": "They went yesterday."
      },
      {
        "termino": "auxiliar",
        "definicion": "Do/does/did ayudan en negativas y preguntas.",
        "ejemplo": "Does he live here?"
      }
    ],
    "diagrama_svg": ""
  },
  "grammar": {
    "intro": "La gramática del examen pide la estructura correcta: tiempo verbal, concordancia sujeto-verbo, orden de palabras y formas en negativo/pregunta (do/does/did, don't/doesn't).",
    "pasos": [
      "Identifica si la oración es presente, pasado o perfect.",
      "Asegura que el verbo concuerde con el sujeto.",
      "En preguntas/negativos, coloca el auxiliar en el lugar correcto."
    ],
    "errores": [
      "She go / They goes.",
      "Did she went…? (doble pasado).",
      "Poner el adverbio rompiendo el auxiliar (She doesn't never…)."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "_____ she finish the project last week?",
      "pasos": [
        "1) last week = pasado.",
        "2) Pregunta en pasado: Did + sujeto + verbo base.",
        "3) Did she finish…? (no finished)."
      ],
      "respuesta": "Did she finish…?",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_gr_01",
        "enunciado": "My brother _____ English well.",
        "opciones": [
          "A) speak",
          "B) speaks",
          "C) speaking",
          "D) spoken"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Falta -s con he.",
          "C": "Falta is/are.",
          "D": "Participio sin auxiliar."
        },
        "explicacion_correcta": "he/she → speaks."
      },
      {
        "id": "tr_gr_02",
        "enunciado": "They _____ not like coffee.",
        "opciones": [
          "A) does",
          "B) do",
          "C) didn't never",
          "D) is"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "does es singular.",
          "C": "Doble negación / mezcla.",
          "D": "is no niega like."
        },
        "explicacion_correcta": "They do not / don't."
      },
      {
        "id": "tr_gr_03",
        "enunciado": "_____ you see the movie yesterday?",
        "opciones": [
          "A) Do",
          "B) Does",
          "C) Did",
          "D) Are"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Do + yesterday no.",
          "B": "Does es he/she.",
          "D": "Are no forma pasado de see."
        },
        "explicacion_correcta": "Did + verbo base."
      },
      {
        "id": "tr_gr_04",
        "enunciado": "She _____ already left.",
        "opciones": [
          "A) have",
          "B) has",
          "C) having",
          "D) haded"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "have con I/you/we/they.",
          "C": "Forma -ing incompleta.",
          "D": "No existe haded."
        },
        "explicacion_correcta": "She has already left."
      }
    ],
    "profundizar": "Repasa concordancia y auxiliares do/does/did/have/has.",
    "terminos": [
      {
        "termino": "sujeto",
        "definicion": "Quién hace la acción.",
        "ejemplo": "My brother speaks English."
      },
      {
        "termino": "verbo",
        "definicion": "La acción o estado.",
        "ejemplo": "speaks, is, went."
      },
      {
        "termino": "artículo",
        "definicion": "a/an/the delante del sustantivo.",
        "ejemplo": "a book / the book."
      },
      {
        "termino": "preposición",
        "definicion": "Palabra de relación: in, on, at, for…",
        "ejemplo": "at night / in 2020."
      },
      {
        "termino": "conectores",
        "definicion": "Enlazan ideas: because, but, although…",
        "ejemplo": "I stayed because it rained."
      }
    ],
    "diagrama_svg": ""
  },
  "vocabulario": {
    "intro": "El vocabulario en contexto se decide por la oración completa: sinónimos, colocaciones (make a decision, take a bus) y el registro (formal/informal). No elijas la primera acepción del diccionario si no encaja.",
    "pasos": [
      "Lee la oración entera y qué pedía el hueco (verbo, sustantivo, adjetivo).",
      "Descarta opciones que cambian el sentido o la colocación.",
      "Quédate con la palabra que suena natural en ese contexto."
    ],
    "errores": [
      "Elegir un sinónimo que no colocaciona (do a decision).",
      "Ignorar el tono (muy informal en un aviso serio).",
      "Traducir palabra por palabra desde el español."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Please _____ a decision before Friday.",
      "pasos": [
        "1) Colocación inglesa: make a decision.",
        "2) take/do no son la colocación estándar aquí.",
        "3) Respuesta: make."
      ],
      "respuesta": "make",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_voc_01",
        "enunciado": "She _____ the bus to school.",
        "opciones": [
          "A) makes",
          "B) takes",
          "C) does",
          "D) puts"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "make the bus no es colocación.",
          "C": "do the bus no.",
          "D": "put the bus no."
        },
        "explicacion_correcta": "take the bus."
      },
      {
        "id": "tr_voc_02",
        "enunciado": "The movie was so _____ that I cried.",
        "opciones": [
          "A) funny",
          "B) moving",
          "C) bored",
          "D) short only"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "funny hace reír, no llorar.",
          "C": "bored describe a la persona.",
          "D": "short no explica el llanto."
        },
        "explicacion_correcta": "moving = emotivo."
      },
      {
        "id": "tr_voc_03",
        "enunciado": "He gave me some useful _____.",
        "opciones": [
          "A) advices",
          "B) advice",
          "C) advise",
          "D) advising"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "advice es incontable (sin -s).",
          "C": "advise es verbo.",
          "D": "gerundio no cabe."
        },
        "explicacion_correcta": "advice (uncountable)."
      },
      {
        "id": "tr_voc_04",
        "enunciado": "We need to _____ the problem carefully.",
        "opciones": [
          "A) look",
          "B) watch",
          "C) examine",
          "D) see at"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "look necesita at/into.",
          "B": "watch es observar en el tiempo.",
          "D": "see at no es natural."
        },
        "explicacion_correcta": "examine the problem."
      }
    ],
    "profundizar": "Aprende colocaciones frecuentes: make/take/do/have + sustantivo.",
    "terminos": [
      {
        "termino": "contexto",
        "definicion": "Palabras alrededor que revelan el sentido.",
        "ejemplo": "Bank = banco o orilla, según la frase."
      },
      {
        "termino": "sinónimo",
        "definicion": "Palabra de significado parecido.",
        "ejemplo": "big ≈ large."
      },
      {
        "termino": "colocación",
        "definicion": "Combinación natural de palabras.",
        "ejemplo": "make a decision (no *do a decision)."
      },
      {
        "termino": "falso amigo",
        "definicion": "Palabra parecida al español con otro sentido.",
        "ejemplo": "Actually ≈ en realidad (no “actualmente”)."
      }
    ],
    "diagrama_svg": ""
  },
  "dialogo": {
    "intro": "En un diálogo, cada turno responde al anterior: saludos, peticiones, rechazos o acuerdos. La clave está en qué acaba de decir el interlocutor y qué se espera como reacción natural.",
    "pasos": [
      "Lee el último turno antes del hueco.",
      "Decide la función: aceptar, rechazar, preguntar, disculparse.",
      "Elige la réplica que encaja en tono y contenido."
    ],
    "errores": [
      "Responder “Yes, I am” a “How are you?”.",
      "Ignorar un “Would you like…?” y hablar de otro tema.",
      "Usar un registro grosero cuando el diálogo es formal."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "A: “Could you open the window?” B: _____",
      "pasos": [
        "1) Es una petición cortés.",
        "2) Respuesta natural: “Sure.” / “Of course.”",
        "3) No: “I am 15 years old.”"
      ],
      "respuesta": "Sure. / Of course.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_dia_01",
        "enunciado": "A: “How are you?” B: _____",
        "opciones": [
          "A) I am fine, thanks.",
          "B) Yes, I am.",
          "C) I am student.",
          "D) Open the door."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Yes, I am responde a Are you…?",
          "C": "No responde al saludo.",
          "D": "Es una orden."
        },
        "explicacion_correcta": "How are you → I am fine."
      },
      {
        "id": "tr_dia_02",
        "enunciado": "A: “Would you like some water?” B: _____",
        "opciones": [
          "A) Yes, please.",
          "B) I am water.",
          "C) Yesterday.",
          "D) She goes."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No tiene sentido.",
          "C": "No responde la oferta.",
          "D": "Gramática ajena."
        },
        "explicacion_correcta": "Oferta → Yes, please / No, thanks."
      },
      {
        "id": "tr_dia_03",
        "enunciado": "A: “Sorry I'm late.” B: _____",
        "opciones": [
          "A) No problem.",
          "B) I am late too always never.",
          "C) What time is book?",
          "D) Play soccer."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Malformado.",
          "C": "Cambia de tema.",
          "D": "Irrelevante."
        },
        "explicacion_correcta": "Disculpa → No problem / That's OK."
      },
      {
        "id": "tr_dia_04",
        "enunciado": "A: “Where is the library?” B: _____",
        "opciones": [
          "A) It's next to the cafeteria.",
          "B) I am library.",
          "C) Yes, I do.",
          "D) Because."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No localiza.",
          "C": "Responde a Do you…?",
          "D": "Conector suelto."
        },
        "explicacion_correcta": "Where → lugar."
      }
    ],
    "profundizar": "Practica pares: petición/oferta/disculpa/ubicación.",
    "terminos": [
      {
        "termino": "turno",
        "definicion": "Cada intervención de un hablante.",
        "ejemplo": "A pregunta; B responde."
      },
      {
        "termino": "saludo",
        "definicion": "Fórmula de inicio o cierre.",
        "ejemplo": "Hi / See you later."
      },
      {
        "termino": "petición",
        "definicion": "Pedir algo con cortesía.",
        "ejemplo": "Could you help me?"
      },
      {
        "termino": "respuesta coherente",
        "definicion": "Contesta lo que se preguntó.",
        "ejemplo": "How are you? → Fine, thanks."
      }
    ],
    "diagrama_svg": ""
  },
  "aviso": {
    "intro": "Los avisos e instrucciones en inglés usan imperativos (Keep quiet), modales de obligación (must, should) y prohibiciones (Do not / No + -ing). Lee la condición (place/time) antes de elegir.",
    "pasos": [
      "Identifica si ordena, prohíbe o informa.",
      "Atiende el lugar o la hora del aviso.",
      "Elige la opción que cumple la instrucción, no una paráfrasis contraria."
    ],
    "errores": [
      "Leer “No smoking” como permiso para fumar.",
      "Ignorar “after 6 p.m.”.",
      "Confundir must con might."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Sign: “Do not enter after 8 p.m.” What does it mean?",
      "pasos": [
        "1) Do not enter = prohibición.",
        "2) after 8 p.m. = condición de tiempo.",
        "3) No se puede entrar después de las 8."
      ],
      "respuesta": "Entry is forbidden after 8 p.m.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_av_01",
        "enunciado": "“Keep the door closed.” means:",
        "opciones": [
          "A) Leave the door open",
          "B) The door should stay closed",
          "C) Break the door",
          "D) Ignore the door"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Es lo contrario.",
          "C": "No lo dice.",
          "D": "No."
        },
        "explicacion_correcta": "Keep = mantener cerrada."
      },
      {
        "id": "tr_av_02",
        "enunciado": "“No food in the lab.” means:",
        "opciones": [
          "A) You may eat here",
          "B) Food is not allowed in the lab",
          "C) Only teachers eat",
          "D) Buy food now"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Contradice No.",
          "C": "No lo limita a teachers.",
          "D": "No es una orden de compra."
        },
        "explicacion_correcta": "No + noun = prohibición."
      },
      {
        "id": "tr_av_03",
        "enunciado": "“Please turn off your phones.” is:",
        "opciones": [
          "A) a suggestion to keep phones on",
          "B) a polite instruction to switch phones off",
          "C) a weather report",
          "D) a math problem"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Off ≠ on.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "turn off = apagar."
      },
      {
        "id": "tr_av_04",
        "enunciado": "“Staff only.” means:",
        "opciones": [
          "A) Anyone can enter",
          "B) Only workers may enter",
          "C) Students must enter",
          "D) Closed forever"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Contradice only.",
          "C": "No dice students.",
          "D": "No afirma cierre eterno."
        },
        "explicacion_correcta": "Staff only = solo personal."
      }
    ],
    "profundizar": "Repasa imperativos y No + -ing / No + noun.",
    "terminos": [
      {
        "termino": "aviso",
        "definicion": "Texto breve que informa o prohíbe.",
        "ejemplo": "No smoking / Opening hours."
      },
      {
        "termino": "prohibición",
        "definicion": "Indica lo que no se puede hacer.",
        "ejemplo": "Do not enter."
      },
      {
        "termino": "horario",
        "definicion": "Cuándo abre o cierra un lugar.",
        "ejemplo": "Open 9 a.m. – 5 p.m."
      },
      {
        "termino": "destinatario",
        "definicion": "A quién va dirigido el mensaje.",
        "ejemplo": "Staff only / Visitors."
      }
    ],
    "diagrama_svg": ""
  },
  "lectura": {
    "intro": "En comprensión de lectura en inglés identificas la idea principal, un detalle explícito o el propósito del autor. La respuesta correcta está apoyada por una o más oraciones del texto, no por tu opinión general.",
    "pasos": [
      "Lee el texto completo una vez.",
      "Subraya la frase que responde exactamente a la pregunta.",
      "Descarta opciones que agregan datos que el texto no dice."
    ],
    "errores": [
      "Elegir un detalle verdadero pero que no responde la pregunta.",
      "Inventar una causa que el texto no menciona.",
      "Confundir el título con la idea principal si el texto dice otra cosa."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Text: “Ana walks to school because the bus is expensive.” Why does Ana walk?",
      "pasos": [
        "1) La pregunta pide la causa.",
        "2) El texto dice because the bus is expensive.",
        "3) No inventes “she likes exercise” si no está."
      ],
      "respuesta": "Because the bus is expensive",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lec_01",
        "enunciado": "Text: “The museum opens at 9.” When does it open?",
        "opciones": [
          "A) At 9",
          "B) At noon",
          "C) At night only",
          "D) Never"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No está en el texto.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Dato literal: 9."
      },
      {
        "id": "tr_lec_02",
        "enunciado": "Text: “Tom studies at night to avoid noise.” Main idea:",
        "opciones": [
          "A) Tom studies at night to avoid noise",
          "B) Tom hates books",
          "C) Night is always silent everywhere",
          "D) Tom is a teacher"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No lo dice.",
          "C": "Generaliza de más.",
          "D": "No lo dice."
        },
        "explicacion_correcta": "Idea = lo que el texto sostiene."
      },
      {
        "id": "tr_lec_03",
        "enunciado": "Purpose of “Buy tickets online to save time.”",
        "opciones": [
          "A) To entertain with a joke",
          "B) To advise saving time by buying online",
          "C) To describe a mountain",
          "D) To ask a math question"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No es humor.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Propósito = aconsejar."
      },
      {
        "id": "tr_lec_04",
        "enunciado": "Text: “Only members may enter.” Who may enter?",
        "opciones": [
          "A) Anyone",
          "B) Members only",
          "C) Children only",
          "D) Tourists only"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Only lo niega.",
          "C": "No dice children.",
          "D": "No dice tourists."
        },
        "explicacion_correcta": "Only members."
      }
    ],
    "profundizar": "Practica: main idea, detail y purpose con textos cortos.",
    "terminos": [
      {
        "termino": "main idea",
        "definicion": "Idea principal del texto.",
        "ejemplo": "What the text is mostly about."
      },
      {
        "termino": "detail",
        "definicion": "Dato específico en el texto.",
        "ejemplo": "A time, name or number."
      },
      {
        "termino": "purpose",
        "definicion": "Para qué se escribió el texto.",
        "ejemplo": "To inform, advise, persuade."
      },
      {
        "termino": "inference",
        "definicion": "Conclusión apoyada pero no literal.",
        "ejemplo": "Use clues, do not invent."
      }
    ],
    "diagrama_svg": ""
  },
  "literal_reading": {
    "intro": "La lectura literal en inglés recupera lo que el texto dice palabra por palabra: nombres, cifras, lugares y hechos explícitos. No infieras más de lo escrito.",
    "pasos": [
      "Localiza en el texto la misma información que pide la pregunta.",
      "Copia el dato sin cambiarlo.",
      "Rechaza opciones que cambian un número o un nombre."
    ],
    "errores": [
      "Cambiar 3 days por a week.",
      "Inferir emociones no dichas.",
      "Usar conocimiento general en vez del texto."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "“The train leaves at 6:30 a.m.” What time does it leave?",
      "pasos": [
        "1) Dato explícito: 6:30 a.m.",
        "2) No inventes 7:00.",
        "3) Respuesta: 6:30 a.m."
      ],
      "respuesta": "6:30 a.m.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lit_en_01",
        "enunciado": "“Luisa bought two maps.” How many maps?",
        "opciones": [
          "A) One",
          "B) Two",
          "C) Three",
          "D) None"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "El texto dice two.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "two maps."
      },
      {
        "id": "tr_lit_en_02",
        "enunciado": "“The class starts at 7.” When?",
        "opciones": [
          "A) At 7",
          "B) At 8",
          "C) At noon",
          "D) At midnight"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No está.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "at 7."
      },
      {
        "id": "tr_lit_en_03",
        "enunciado": "“Pedro lives in Tunja.” Where?",
        "opciones": [
          "A) Bogotá",
          "B) Tunja",
          "C) Miami",
          "D) Not said as a city"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Otro lugar.",
          "C": "No.",
          "D": "Sí lo dice: Tunja."
        },
        "explicacion_correcta": "Tunja."
      },
      {
        "id": "tr_lit_en_04",
        "enunciado": "“There are 5 chairs.” How many chairs?",
        "opciones": [
          "A) 4",
          "B) 5",
          "C) 15",
          "D) 50"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Mal conteo.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "5."
      }
    ],
    "profundizar": "Busca el dato exacto en el texto.",
    "terminos": [
      {
        "termino": "literal meaning",
        "definicion": "Exactamente lo que dice el texto.",
        "ejemplo": "No extras."
      },
      {
        "termino": "fact",
        "definicion": "Dato comprobable en el texto.",
        "ejemplo": "The train leaves at 6:30."
      },
      {
        "termino": "wh- question",
        "definicion": "Who/what/when/where/how many…",
        "ejemplo": "Busca el dato pedido."
      },
      {
        "termino": "paraphrase",
        "definicion": "Misma idea con otras palabras.",
        "ejemplo": "Debes reconocer el equivalente."
      }
    ],
    "diagrama_svg": ""
  },
  "inferential_reading": {
    "intro": "La lectura inferencial en inglés concluye algo que el texto implica con pistas, sin citarlo literalmente. La inferencia válida siempre puede señalar una o dos frases de apoyo.",
    "pasos": [
      "Junta las pistas del texto.",
      "Formula lo que se sigue con lógica.",
      "Descarta conclusiones que el texto no autoriza."
    ],
    "errores": [
      "Inventar un final dramático.",
      "Confundir opinión personal con inferencia.",
      "Generalizar “always/never” sin base."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "“Maya took her umbrella. The streets were wet.” What can we infer?",
      "pasos": [
        "1) Umbrella + wet streets → probablemente llovió o llovía.",
        "2) No afirma el color del paraguas.",
        "3) Inferencia: it was raining / had rained."
      ],
      "respuesta": "It was probably raining",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_inf_en_01",
        "enunciado": "“Sam put on a coat and gloves.” Infer:",
        "opciones": [
          "A) It is likely cold outside",
          "B) Sam is swimming",
          "C) It is a math class",
          "D) Sam sold the house"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Coat/gloves ≠ swimming.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Abrigo + guantes → frío."
      },
      {
        "id": "tr_inf_en_02",
        "enunciado": "“The lights went out and people lit candles.” Infer:",
        "opciones": [
          "A) There was probably a power cut",
          "B) They hate candles",
          "C) It was noon at the beach",
          "D) They finished a marathon only"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No encaja.",
          "D": "No lo dice."
        },
        "explicacion_correcta": "Lights out → apagón."
      },
      {
        "id": "tr_inf_en_03",
        "enunciado": "A valid inference must:",
        "opciones": [
          "A) Contradict the text",
          "B) Be supported by clues in the text",
          "C) Ignore the text",
          "D) Be a random rumor"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Apoyo textual."
      },
      {
        "id": "tr_inf_en_04",
        "enunciado": "“Lia closed the book and smiled.” Weak inference:",
        "opciones": [
          "A) She may feel satisfied",
          "B) She definitely bought a car",
          "C) She finished reading for now",
          "D) She stopped reading that moment"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Plausible.",
          "C": "Plausible.",
          "D": "Plausible."
        },
        "explicacion_correcta": "Car is not supported."
      }
    ],
    "profundizar": "Pista + lógica = inferencia; sin pista = inválida.",
    "terminos": [
      {
        "termino": "inference",
        "definicion": "Deducción con pistas del texto.",
        "ejemplo": "Not written word for word."
      },
      {
        "termino": "clue",
        "definicion": "Palabra o detalle que permite inferir.",
        "ejemplo": "“yawning” → tired."
      },
      {
        "termino": "tone",
        "definicion": "Actitud del autor (serio, irónico…).",
        "ejemplo": "Se nota en el vocabulario."
      },
      {
        "termino": "implied",
        "definicion": "Sugerido, no explícito.",
        "ejemplo": "Between the lines."
      }
    ],
    "diagrama_svg": ""
  },
  "articulacion_global": {
    "intro": "La articulación global del texto es el hilo que une párrafos: tesis, conectores (además, sin embargo, por eso) y repetición de ideas clave. Entender el conjunto evita quedarte en una sola frase suelta.",
    "pasos": [
      "Busca la tesis o idea que se sostiene a lo largo del texto.",
      "Marca conectores que suman, contrastan o concluyen.",
      "Explica cómo un párrafo prepara al siguiente."
    ],
    "errores": [
      "Leer solo el primer renglón y generalizar.",
      "Ignorar un “sin embargo” que cambia el sentido.",
      "Confundir un ejemplo local con la tesis global."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "P1 habla de contaminación; P2 dice “Sin embargo, hay soluciones locales.” ¿Qué hace el conector?",
      "pasos": [
        "1) Sin embargo = contraste.",
        "2) No niega el problema: introduce otro enfoque.",
        "3) Articula problema → matiz/solución."
      ],
      "respuesta": "Contrasta y abre el matiz de las soluciones",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_art_01",
        "enunciado": "Un conector “por lo tanto” suele:",
        "opciones": [
          "A) Introducir una conclusión",
          "B) Negar el texto entero",
          "C) Pedir comida",
          "D) Cambiar de idioma"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No niega todo.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "por lo tanto = conclusión."
      },
      {
        "id": "tr_art_02",
        "enunciado": "La tesis de un texto es:",
        "opciones": [
          "A) La idea central que se sostiene",
          "B) Cualquier fecha suelta",
          "C) Solo el tipógrafo",
          "D) Una pregunta sin respuesta obligatoria"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Detalle.",
          "C": "No.",
          "D": "Puede abrir, no es tesis."
        },
        "explicacion_correcta": "Tesis = idea central."
      },
      {
        "id": "tr_art_03",
        "enunciado": "Si el párrafo 2 contradice al 1 con “pero”, la lectura global debe:",
        "opciones": [
          "A) Ignorar el 2",
          "B) Integrar el contraste",
          "C) Borrar el 1",
          "D) Inventar un tercer tema"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Pierdes el sentido.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Integrar contraste."
      },
      {
        "id": "tr_art_04",
        "enunciado": "Un ejemplo en medio del texto normalmente:",
        "opciones": [
          "A) Ilustra la idea en curso",
          "B) Cambia de asignatura solo",
          "C) Anula la tesis siempre",
          "D) Es la bibliografía"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No siempre anula.",
          "D": "No."
        },
        "explicacion_correcta": "Ejemplo = apoyo."
      }
    ],
    "profundizar": "Sigue el hilo: tesis + conectores + ejemplos.",
    "terminos": [
      {
        "termino": "cohesión",
        "definicion": "Enlaces que unen oraciones (conectores, pronombres).",
        "ejemplo": "“Sin embargo”, “además”."
      },
      {
        "termino": "coherencia",
        "definicion": "Sentido global sin contradicciones.",
        "ejemplo": "Todas las partes apuntan al mismo tema."
      },
      {
        "termino": "hilo conductor",
        "definicion": "Tema o pregunta que organiza el texto.",
        "ejemplo": "La tesis del autor."
      },
      {
        "termino": "estructura",
        "definicion": "Orden de introducción, desarrollo y cierre.",
        "ejemplo": "Problema → argumentos → conclusión."
      }
    ],
    "diagrama_svg": ""
  },
  "evaluacion_critica": {
    "intro": "Evaluar críticamente un texto es juzgar si las razones bastan: ¿hay evidencia?, ¿hay sesgo?, ¿se exagera? No basta con entender: hay que valorar la solidez.",
    "pasos": [
      "Separa afirmación y prueba.",
      "Pregunta qué falta (datos, fuentes, contraejemplos).",
      "Decide si la conclusión está justificada."
    ],
    "errores": [
      "Aceptar una generalización con un solo caso.",
      "Confundir opinión con dato.",
      "Atacar a la persona en vez del argumento."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "“Todos odian el parque porque Ana se cayó.” ¿Qué falla?",
      "pasos": [
        "1) De un caso (Ana) salta a “todos”.",
        "2) Falta evidencia de mayoría.",
        "3) Evaluación: generalización apresurada; la conclusión no se sostiene."
      ],
      "respuesta": "Generalización con un solo caso",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ev_01",
        "enunciado": "Una conclusión sólida necesita:",
        "opciones": [
          "A) Pruebas suficientes",
          "B) Solo un grito",
          "C) Ignorar datos",
          "D) Cambiar de tema"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No es prueba.",
          "C": "Debilita.",
          "D": "No evalúa."
        },
        "explicacion_correcta": "Evidencia."
      },
      {
        "id": "tr_ev_02",
        "enunciado": "Un sesgo aparece cuando:",
        "opciones": [
          "A) Se omiten datos que contradicen la tesis",
          "B) Se citan fuentes claras",
          "C) Se define un término",
          "D) Se corrige un error"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso es buen apoyo.",
          "C": "No es sesgo.",
          "D": "Eso mejora."
        },
        "explicacion_correcta": "Omisión interesada."
      },
      {
        "id": "tr_ev_03",
        "enunciado": "“Lo dijo un famoso, entonces es verdad.” Fallo:",
        "opciones": [
          "A) Autoridad mal usada",
          "B) Definición perfecta",
          "C) Dato estadístico",
          "D) Silogismo válido"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No hay cifra.",
          "D": "No es silogismo."
        },
        "explicacion_correcta": "Autoridad ≠ prueba."
      },
      {
        "id": "tr_ev_04",
        "enunciado": "Para criticar un argumento debes:",
        "opciones": [
          "A) Revisar razones y evidencia",
          "B) Insultar al autor",
          "C) Ignorar el texto",
          "D) Cambiar la pregunta"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Ad hominem.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Razones + evidencia."
      }
    ],
    "profundizar": "Afirmación vs prueba; detecta sesgos y saltos.",
    "terminos": [
      {
        "termino": "tesis",
        "definicion": "Posición central del autor.",
        "ejemplo": "Lo que defiende el texto."
      },
      {
        "termino": "sesgo",
        "definicion": "Inclinación que distorsiona la presentación de hechos.",
        "ejemplo": "Omitir datos contrarios."
      },
      {
        "termino": "fiabilidad",
        "definicion": "Qué tan creíble es una fuente o afirmación.",
        "ejemplo": "Autor, evidencia, fecha."
      },
      {
        "termino": "contraargumento",
        "definicion": "Razón que se opone a la tesis.",
        "ejemplo": "Sirve para evaluar solidez."
      }
    ],
    "diagrama_svg": ""
  },
  "dos_textos": {
    "intro": "Comparar dos textos es hallar acuerdos, desacuerdos y matices: qué sostiene cada uno, con qué evidencias y dónde se cruzan o se oponen.",
    "pasos": [
      "Resume la tesis de A y la de B por separado.",
      "Marca un punto en común y uno en conflicto.",
      "Responde exactamente lo que pide: acuerdo, contraste o ambos."
    ],
    "errores": [
      "Mezclar citas de A como si fueran de B.",
      "Decir que “dicen lo mismo” cuando hay contraste claro.",
      "Elegir un detalle irrelevante para ambos."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "A: “El recreo debe alargarse.” B: “El recreo está bien; hay que reforzar matemáticas.” ¿Desacuerdo?",
      "pasos": [
        "1) A quiere más recreo.",
        "2) B prioriza otra cosa y no pide alargar.",
        "3) Desacuerdo sobre alargar el recreo."
      ],
      "respuesta": "Desacuerdo sobre alargar el recreo",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_dos_01",
        "enunciado": "Si A y B afirman la misma causa, hay:",
        "opciones": [
          "A) Acuerdo",
          "B) Insulto",
          "C) Silencio",
          "D) Solo un título"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Misma causa = acuerdo."
      },
      {
        "id": "tr_dos_02",
        "enunciado": "Para contrastar debes:",
        "opciones": [
          "A) Señalar en qué difieren las tesis",
          "B) Ignorar B",
          "C) Copiar solo adjetivos",
          "D) Inventar un tercer texto"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No comparas.",
          "C": "Insuficiente.",
          "D": "No."
        },
        "explicacion_correcta": "Diferencias de tesis."
      },
      {
        "id": "tr_dos_03",
        "enunciado": "Un punto de encuentro es:",
        "opciones": [
          "A) Una idea que ambos aceptan",
          "B) Una fecha falsa",
          "C) Un error tipográfico",
          "D) La opción más larga"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Acuerdo parcial."
      },
      {
        "id": "tr_dos_04",
        "enunciado": "Error típico al comparar:",
        "opciones": [
          "A) Atribuir a A lo que solo dice B",
          "B) Leer ambos",
          "C) Anotar tesis",
          "D) Buscar evidencias"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso ayuda.",
          "C": "Eso ayuda.",
          "D": "Eso ayuda."
        },
        "explicacion_correcta": "No cruzar autores."
      }
    ],
    "profundizar": "Tesis A vs tesis B: acuerdo y contraste.",
    "terminos": [
      {
        "termino": "comparar",
        "definicion": "Ver semejanzas entre dos textos.",
        "ejemplo": "Ambos hablan de agua, pero con fines distintos."
      },
      {
        "termino": "contrastar",
        "definicion": "Ver diferencias de enfoque o conclusión.",
        "ejemplo": "Uno informa; el otro persuade."
      },
      {
        "termino": "propósito",
        "definicion": "Para qué se escribió el texto.",
        "ejemplo": "Informar, opinar, instruir."
      },
      {
        "termino": "punto de vista",
        "definicion": "Ángulo desde el que se presenta el tema.",
        "ejemplo": "Técnico vs testimonial."
      }
    ],
    "diagrama_svg": ""
  },
  "textos_discontinuos": {
    "intro": "Tablas, avisos y gráficas se leen por estructura: título, ejes, filas/columnas y unidades. La respuesta sale de cruzar la pregunta con la celda o barra correcta.",
    "pasos": [
      "Lee el título y las unidades.",
      "Ubica la fila/columna o el punto del eje que pide la pregunta.",
      "Compara valores si pide “mayor”, “menor” o “diferencia”."
    ],
    "errores": [
      "Leer mal el eje (confundir % con cantidad).",
      "Tomar la barra vecina.",
      "Ignorar una nota al pie que cambia la lectura."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Tabla: Lun 4 préstamos, Mar 6. ¿Qué día tuvo más?",
      "pasos": [
        "1) Compara 4 y 6.",
        "2) Martes es mayor.",
        "3) Respuesta: martes."
      ],
      "respuesta": "Martes",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_td_01",
        "enunciado": "Si una barra llega más alto en “Andina”, esa región:",
        "opciones": [
          "A) Tiene el valor mayor en esa gráfica",
          "B) No existe",
          "C) Siempre es la capital",
          "D) Es un verbo"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No lo implica.",
          "D": "No."
        },
        "explicacion_correcta": "Altura = valor."
      },
      {
        "id": "tr_td_02",
        "enunciado": "Una escala 1:50.000 en mapa indica:",
        "opciones": [
          "A) Relación papel–realidad",
          "B) Población",
          "C) Color político",
          "D) Temperatura"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No es demografía.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Escala = proporción."
      },
      {
        "id": "tr_td_03",
        "enunciado": "Para leer una celda debes cruzar:",
        "opciones": [
          "A) Fila y columna",
          "B) Solo el tipógrafo",
          "C) El clima",
          "D) La portada del libro"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Fila × columna."
      },
      {
        "id": "tr_td_04",
        "enunciado": "Si pide la diferencia entre 20 y 12:",
        "opciones": [
          "A) 8",
          "B) 32",
          "C) 20",
          "D) 12"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Sumaste.",
          "C": "Un extremo.",
          "D": "Un extremo."
        },
        "explicacion_correcta": "20−12=8."
      }
    ],
    "profundizar": "Título, ejes, celdas: cruza pregunta y dato.",
    "terminos": [
      {
        "termino": "texto discontinuo",
        "definicion": "Información en tablas, gráficos, avisos o infografías.",
        "ejemplo": "No es un párrafo corrido."
      },
      {
        "termino": "leyenda",
        "definicion": "Explica símbolos o colores del gráfico.",
        "ejemplo": "Azul = lluvias."
      },
      {
        "termino": "eje",
        "definicion": "Línea de referencia en un gráfico (x, y).",
        "ejemplo": "Meses en el eje horizontal."
      },
      {
        "termino": "dato",
        "definicion": "Valor concreto leído del visual.",
        "ejemplo": "En 2020 la barra llega a 40."
      }
    ],
    "diagrama_svg": ""
  },
  "filosofia": {
    "intro": "En textos con ideas éticas o filosóficas identificas valores (justicia, libertad, deber), dilemas y la tesis moral que el autor sostiene o cuestiona.",
    "pasos": [
      "Nombra el valor o principio en juego.",
      "Separa el caso concreto de la norma general.",
      "Elige la opción que expresa esa idea ética, no un dato lateral."
    ],
    "errores": [
      "Reducir el texto a una anécdota sin el valor.",
      "Confundir legalidad con moralidad si el texto las distingue.",
      "Atribuir al autor una tesis opuesta."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Texto: “Mentir para salvar una vida puede ser un deber.” ¿Qué idea ética destaca?",
      "pasos": [
        "1) Hay un conflicto verdad vs vida.",
        "2) El autor prioriza salvar la vida como deber.",
        "3) No es solo “mentir es malo” sin matices."
      ],
      "respuesta": "El deber de preservar la vida puede primar",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_fil_01",
        "enunciado": "Un dilema ético presenta:",
        "opciones": [
          "A) Dos valores en tensión",
          "B) Solo una suma",
          "C) Un mapa",
          "D) Una conjugación"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Mate.",
          "C": "Geo.",
          "D": "Gramática."
        },
        "explicacion_correcta": "Tensión de valores."
      },
      {
        "id": "tr_fil_02",
        "enunciado": "“Debes tratar a otros como quieres que te traten” expresa:",
        "opciones": [
          "A) Una regla de reciprocidad moral",
          "B) Una fórmula química",
          "C) Un horario",
          "D) Una capital"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Reciprocidad."
      },
      {
        "id": "tr_fil_03",
        "enunciado": "Si el texto distingue ley y justicia, no debes:",
        "opciones": [
          "A) Igualarlas automáticamente",
          "B) Leer la distinción",
          "C) Citar el texto",
          "D) Nombrar el valor"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso ayuda.",
          "C": "Eso ayuda.",
          "D": "Eso ayuda."
        },
        "explicacion_correcta": "No las fusiones."
      },
      {
        "id": "tr_fil_04",
        "enunciado": "La tesis moral es:",
        "opciones": [
          "A) Lo que el texto sostiene sobre lo correcto/incorrecto",
          "B) Solo el nombre del autor",
          "C) La tipografía",
          "D) Un porcentaje suelto"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No basta.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Tesis moral."
      }
    ],
    "profundizar": "Valores, dilemas y tesis moral del texto.",
    "terminos": [
      {
        "termino": "argumento",
        "definicion": "Conjunto de razones que buscan justificar una tesis.",
        "ejemplo": "Premisas → conclusión."
      },
      {
        "termino": "ética",
        "definicion": "Reflexión sobre lo bueno/malo y el deber.",
        "ejemplo": "¿Qué debo hacer?"
      },
      {
        "termino": "conocimiento",
        "definicion": "Creencia justificada y verdadera (en sentido clásico).",
        "ejemplo": "No es solo opinión."
      },
      {
        "termino": "concepto",
        "definicion": "Idea general que organiza la experiencia.",
        "ejemplo": "Justicia, libertad, verdad."
      }
    ],
    "diagrama_svg": ""
  },
  "pragmatica": {
    "intro": "La intención comunicativa responde a para qué se dice algo: informar, pedir, ironizar, advertir o persuadir. El mismo enunciado cambia de función según la situación.",
    "pasos": [
      "Mira la situación (quién habla a quién).",
      "Clasifica el acto: pregunta, orden, consejo, amenaza suave, etc.",
      "Elige la opción que nombra esa intención."
    ],
    "errores": [
      "Leer una ironía como dato literal.",
      "Tomar una pregunta retórica como petición de dato.",
      "Ignorar el tono de un aviso."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "En una fila: “¿Trajiste el día completo?” dicho con sarcasmo por llegar tarde.",
      "pasos": [
        "1) No pide el clima del día.",
        "2) Critica la tardanza.",
        "3) Intención: reclamo / ironía."
      ],
      "respuesta": "Ironía / reclamo por la tardanza",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_prag_01",
        "enunciado": "“¿Puedes pasarme la sal?” en la mesa suele ser:",
        "opciones": [
          "A) Una petición cortés",
          "B) Una definición de sal",
          "C) Un mapa",
          "D) Una ecuación"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No define.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Petición."
      },
      {
        "id": "tr_prag_02",
        "enunciado": "Un anuncio “No pisar el césped” pretende:",
        "opciones": [
          "A) Prohibir / advertir",
          "B) Contar un chiste solo",
          "C) Enseñar álgebra",
          "D) Pedir un autógrafo"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Advertencia."
      },
      {
        "id": "tr_prag_03",
        "enunciado": "La ironía ocurre cuando:",
        "opciones": [
          "A) Se dice lo contrario de lo que se quiere criticar",
          "B) Se cita una fecha",
          "C) Se suma 2+2",
          "D) Se nombra un río"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Literal.",
          "C": "Mate.",
          "D": "Geo."
        },
        "explicacion_correcta": "Contrario + crítica."
      },
      {
        "id": "tr_prag_04",
        "enunciado": "“Te felicito…” dicho tras un error grave puede ser:",
        "opciones": [
          "A) Sarcasmo",
          "B) Una capital",
          "C) Un climograma",
          "D) Un mcm"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Sarcasmo."
      }
    ],
    "profundizar": "¿Para qué se dice? Informar, pedir, ironizar, advertir.",
    "terminos": [
      {
        "termino": "intención",
        "definicion": "Para qué dice algo el hablante.",
        "ejemplo": "Pedir, ironizar, informar."
      },
      {
        "termino": "contexto",
        "definicion": "Situación (quién, dónde, cuándo) que da sentido al mensaje.",
        "ejemplo": "“¡Fuego!” en teatro ≠ en incendio."
      },
      {
        "termino": "acto de habla",
        "definicion": "Acción que se hace al hablar.",
        "ejemplo": "Prometer, ordenar, preguntar."
      },
      {
        "termino": "implicatura",
        "definicion": "Lo que se sugiere sin decirlo literal.",
        "ejemplo": "“Hace frío” → cierra la ventana."
      }
    ],
    "diagrama_svg": ""
  },
  "semantica": {
    "intro": "El significado en contexto depende de la oración: una misma palabra puede ser literal o figurada. Elige el sentido que hace coherente el párrafo.",
    "pasos": [
      "Sustituye la palabra por cada opción y mira cuál mantiene el sentido.",
      "Atiende si el uso es figurado (metáfora).",
      "Descarta acepciones que rompen la lógica del texto."
    ],
    "errores": [
      "Elegir la acepción más común aunque no calce.",
      "Ignorar comillas o tono figurado.",
      "Traducir palabra por palabra sin contexto."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "“La noticia me dejó helado.” ¿Qué significa helado aquí?",
      "pasos": [
        "1) No habla de temperatura corporal real necesariamente.",
        "2) Uso figurado: sorprendido / impactado.",
        "3) Sentido contextual: asombro."
      ],
      "respuesta": "Sorprendido / impactado",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_sem_01",
        "enunciado": "“Paso de tortuga” en un trámite suele significar:",
        "opciones": [
          "A) Muy lento",
          "B) Un animal en la oficina",
          "C) Un río",
          "D) Una suma"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Literal indebido.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Figurativo: lento."
      },
      {
        "id": "tr_sem_02",
        "enunciado": "En “banco de datos”, banco es:",
        "opciones": [
          "A) Conjunto/repositorio",
          "B) Solo una silla",
          "C) Un pez",
          "D) Una capital"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Otra acepción.",
          "C": "Otra acepción.",
          "D": "No."
        },
        "explicacion_correcta": "Sentido técnico."
      },
      {
        "id": "tr_sem_03",
        "enunciado": "Para fijar el sentido debes:",
        "opciones": [
          "A) Mirar la oración completa",
          "B) Cerrar el texto",
          "C) Elegir al azar",
          "D) Contar letras"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Contexto oracional."
      },
      {
        "id": "tr_sem_04",
        "enunciado": "“Corriente” en “agua corriente” significa:",
        "opciones": [
          "A) Que fluye / disponible",
          "B) Opinión política",
          "C) Un examen",
          "D) Un ángulo"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Otra acepción.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Agua que fluye."
      }
    ],
    "profundizar": "Misma palabra, distinto sentido: manda el contexto.",
    "terminos": [
      {
        "termino": "significado",
        "definicion": "Contenido que expresa una palabra o frase.",
        "ejemplo": "Depende del uso y contexto."
      },
      {
        "termino": "sinónimo",
        "definicion": "Palabra de sentido similar.",
        "ejemplo": "Inicio ≈ comienzo."
      },
      {
        "termino": "antónimo",
        "definicion": "Palabra de sentido opuesto.",
        "ejemplo": "Frío ≠ caliente."
      },
      {
        "termino": "ambigüedad",
        "definicion": "Más de un sentido posible.",
        "ejemplo": "“Banco” (asiento / entidad)."
      }
    ],
    "diagrama_svg": ""
  },
  "literatura": {
    "intro": "Los recursos literarios (metáfora, hipérbole, narrador, personificación) producen un efecto: embellecer, exagerar, acercar emociones. Identifica el recurso y para qué sirve en el fragmento.",
    "pasos": [
      "Nombra el recurso (comparación, exageración, etc.).",
      "Explica el efecto en el lector.",
      "No lo leas solo como dato histórico si el ítem pide el recurso."
    ],
    "errores": [
      "Llamar metáfora a una estadística.",
      "Ignorar el narrador en primera persona.",
      "Confundir hipérbole con literalidad."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "“El sol sonreía sobre el valle.” ¿Qué recurso hay?",
      "pasos": [
        "1) El sol no sonríe de verdad.",
        "2) Se le atribuye acción humana → personificación.",
        "3) Efecto: ambientar con calidez."
      ],
      "respuesta": "Personificación",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lit_01",
        "enunciado": "“Te lo dije mil veces” es tipicamente:",
        "opciones": [
          "A) Hipérbole",
          "B) Un mapa",
          "C) Una fórmula",
          "D) Un climograma"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Exageración."
      },
      {
        "id": "tr_lit_02",
        "enunciado": "“Sus ojos eran dos luceros” es:",
        "opciones": [
          "A) Metáfora",
          "B) Acta notarial",
          "C) Tabla de datos",
          "D) Norma penal"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Metáfora."
      },
      {
        "id": "tr_lit_03",
        "enunciado": "Un narrador en “yo” está en:",
        "opciones": [
          "A) Primera persona",
          "B) Solo tercera",
          "C) Silencio total",
          "D) Futuro gramatical obligatorio"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Primera persona."
      },
      {
        "id": "tr_lit_04",
        "enunciado": "El efecto de la hipérbole suele ser:",
        "opciones": [
          "A) Enfatizar por exageración",
          "B) Medir un ángulo",
          "C) Calcular un %,",
          "D) Nombrar un afluente"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Mate.",
          "C": "Mate.",
          "D": "Geo."
        },
        "explicacion_correcta": "Énfasis."
      }
    ],
    "profundizar": "Recurso + efecto en el fragmento.",
    "terminos": [
      {
        "termino": "figura literaria",
        "definicion": "Recurso estético del lenguaje (metáfora, hipérbole…).",
        "ejemplo": "“Sus ojos eran estrellas.”"
      },
      {
        "termino": "narrador",
        "definicion": "Voz que cuenta la historia.",
        "ejemplo": "Primera o tercera persona."
      },
      {
        "termino": "tema",
        "definicion": "Idea central de la obra.",
        "ejemplo": "Amor, soledad, poder."
      },
      {
        "termino": "género",
        "definicion": "Categoría: lírico, narrativo, dramático.",
        "ejemplo": "Un cuento es narrativo."
      }
    ],
    "diagrama_svg": ""
  },
  "analisis_textual": {
    "intro": "Analizar un texto es ver cómo está construido: partes, cohesión, repeticiones, citas y el procedimiento del autor (definir, argumentar, narrar).",
    "pasos": [
      "Identifica la función del párrafo (introducir, ejemplificar, concluir).",
      "Marca mecanismos de cohesión (pronombres, sinónimos, conectores).",
      "Di qué procedimiento usa el autor."
    ],
    "errores": [
      "Quedarse solo en el tema sin ver la estructura.",
      "Confundir un ejemplo con la tesis.",
      "Ignorar una cita y su función."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Un párrafo define un término y el siguiente da un ejemplo. ¿Qué hace el autor?",
      "pasos": [
        "1) Primero define.",
        "2) Luego ilustra.",
        "3) Procedimiento: definición + ejemplificación."
      ],
      "respuesta": "Definir y luego ejemplificar",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_at_01",
        "enunciado": "Un conector “en primer lugar” organiza:",
        "opciones": [
          "A) Una secuencia",
          "B) Un río",
          "C) Un átomo",
          "D) Un ángulo"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Geo.",
          "C": "Química.",
          "D": "Mate."
        },
        "explicacion_correcta": "Orden discursivo."
      },
      {
        "id": "tr_at_02",
        "enunciado": "La cohesión se logra con:",
        "opciones": [
          "A) Pronombres y repeticiones controladas",
          "B) Borrar nexos",
          "C) Cambiar de idioma al azar",
          "D) Ignorar referencias"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Rompe.",
          "C": "Rompe.",
          "D": "Rompe."
        },
        "explicacion_correcta": "Cohesión."
      },
      {
        "id": "tr_at_03",
        "enunciado": "Si un párrafo solo ilustra, su función es:",
        "opciones": [
          "A) Ejemplificar",
          "B) Legislar",
          "C) Medir",
          "D) Navegar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Ejemplo."
      },
      {
        "id": "tr_at_04",
        "enunciado": "Analizar el texto pregunta:",
        "opciones": [
          "A) Cómo está construido",
          "B) Solo la tipografía",
          "C) El clima de Londres",
          "D) El mcm"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No basta.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Construcción."
      }
    ],
    "profundizar": "Estructura, cohesión y procedimiento del autor.",
    "terminos": [
      {
        "termino": "tesis",
        "definicion": "Afirmación central del texto.",
        "ejemplo": "Lo que el autor sostiene."
      },
      {
        "termino": "recurso",
        "definicion": "Estrategia (ejemplo, dato, pregunta retórica).",
        "ejemplo": "Sirve para persuadir o explicar."
      },
      {
        "termino": "tono",
        "definicion": "Actitud del texto (irónico, solemne, cercano).",
        "ejemplo": "Se nota en el vocabulario."
      },
      {
        "termino": "estructura",
        "definicion": "Partes y orden del texto.",
        "ejemplo": "Introducción → desarrollo → cierre."
      }
    ],
    "diagrama_svg": ""
  },
  "analisis_imagen": {
    "intro": "Leer una imagen en el examen es relacionar lo que se ve (personas, objetos, símbolos, plano) con la pregunta: qué representa y para qué se usa en el ítem.",
    "pasos": [
      "Describe los elementos visibles relevantes.",
      "Conecta la imagen con el enunciado.",
      "Elige la opción que interpreta esa relación, no un detalle decorativo."
    ],
    "errores": [
      "Inventar objetos que no están.",
      "Ignorar una leyenda o título de la figura.",
      "Leer la imagen como si no hubiera pregunta."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Una figura muestra una rosa de los vientos. ¿Para qué sirve?",
      "pasos": [
        "1) Elementos: N, S, E, O.",
        "2) Función: orientar.",
        "3) No mide población."
      ],
      "respuesta": "Orientar puntos cardinales",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ai_01",
        "enunciado": "Una barra más alta en una gráfica suele indicar:",
        "opciones": [
          "A) Un valor mayor",
          "B) Un color sin dato",
          "C) Un verbo",
          "D) Una norma penal"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Hay dato.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Altura = magnitud."
      },
      {
        "id": "tr_ai_02",
        "enunciado": "Si la imagen tiene leyenda, debes:",
        "opciones": [
          "A) Usarla para interpretar símbolos",
          "B) Ignorarla",
          "C) Borrarla",
          "D) Traducirla a una ecuación siempre"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Pierdes claves.",
          "C": "No.",
          "D": "No siempre."
        },
        "explicacion_correcta": "Leyenda."
      },
      {
        "id": "tr_ai_03",
        "enunciado": "Un mapa con escala sirve para:",
        "opciones": [
          "A) Relacionar distancias en papel y reales",
          "B) Cantar",
          "C) Freír",
          "D) Conjugar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Escala."
      },
      {
        "id": "tr_ai_04",
        "enunciado": "Al interpretar una imagen, lo primero es:",
        "opciones": [
          "A) Ver qué pregunta el enunciado",
          "B) Inventar un cuento",
          "C) Cambiar de área",
          "D) Contar tipografías"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Enunciado + imagen."
      }
    ],
    "profundizar": "Elementos visibles + pregunta = interpretación.",
    "terminos": [
      {
        "termino": "plano",
        "definicion": "Encuadre de la imagen (general, medio, detalle).",
        "ejemplo": "Un primer plano destaca la cara."
      },
      {
        "termino": "composición",
        "definicion": "Disposición de elementos en el cuadro.",
        "ejemplo": "Centro, diagonal, regla de tercios."
      },
      {
        "termino": "simbólico",
        "definicion": "Elemento que representa una idea.",
        "ejemplo": "Una balanza puede sugerir justicia."
      },
      {
        "termino": "pie de foto",
        "definicion": "Texto que ancla el sentido de la imagen.",
        "ejemplo": "Evita ambigüedad."
      }
    ],
    "diagrama_svg": ""
  },
  "pensamiento_social": {
    "intro": "Normas y convivencia: derechos, deberes y mecanismos (tutela, acción popular, deberes ciudadanos) resuelven conflictos cotidianos dentro del marco constitucional.",
    "pasos": [
      "Identifica el derecho o deber en juego.",
      "Nombra el mecanismo adecuado (tutela, denuncia, diálogo, etc.).",
      "Descarta opciones que inventan sanciones inexistentes."
    ],
    "errores": [
      "Usar tutela para un conflicto que no es de derecho fundamental.",
      "Confundir deber moral con sanción penal.",
      "Ignorar la dignidad o el debido proceso."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Una EPS niega un tratamiento urgente. ¿Qué mecanismo cabe?",
      "pasos": [
        "1) Hay derecho a la salud en juego.",
        "2) Tutela protege derechos fundamentales.",
        "3) No es solo “quejarse en redes” como mecanismo jurídico."
      ],
      "respuesta": "Acción de tutela",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ps_01",
        "enunciado": "La tutela protege principalmente:",
        "opciones": [
          "A) Derechos fundamentales",
          "B) Recetas de cocina",
          "C) Goles",
          "D) Tipografías"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Derechos fundamentales."
      },
      {
        "id": "tr_ps_02",
        "enunciado": "Un deber ciudadano típico es:",
        "opciones": [
          "A) Respetar los derechos de otros",
          "B) Ignorar la ley siempre",
          "C) Falsificar documentos",
          "D) Destruir pruebas"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Ilegal.",
          "C": "Delito.",
          "D": "Delito."
        },
        "explicacion_correcta": "Respeto mutuo."
      },
      {
        "id": "tr_ps_03",
        "enunciado": "La convivencia pacífica implica:",
        "opciones": [
          "A) Resolver conflictos sin violencia",
          "B) Imponer por la fuerza",
          "C) Censurar todo diálogo",
          "D) Eliminar deberes"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Rompe convivencia.",
          "C": "Rompe.",
          "D": "Rompe."
        },
        "explicacion_correcta": "Diálogo / mediación."
      },
      {
        "id": "tr_ps_04",
        "enunciado": "Si hay discriminación en el colegio, un camino es:",
        "opciones": [
          "A) Activar rutas de atención y denuncia institucional",
          "B) Callar siempre",
          "C) Responder con violencia",
          "D) Falsificar notas"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No protege.",
          "C": "Agrava.",
          "D": "Ilegal."
        },
        "explicacion_correcta": "Rutas institucionales."
      }
    ],
    "profundizar": "Derecho + deber + mecanismo adecuado.",
    "terminos": [
      {
        "termino": "actor social",
        "definicion": "Persona o grupo que interviene en un problema.",
        "ejemplo": "Estado, empresa, comunidad."
      },
      {
        "termino": "conflicto",
        "definicion": "Choque de intereses o valores.",
        "ejemplo": "Tierra, derechos, recursos."
      },
      {
        "termino": "norma",
        "definicion": "Regla que orienta la conducta colectiva.",
        "ejemplo": "Ley, costumbre, acuerdo."
      },
      {
        "termino": "ciudadanía",
        "definicion": "Condición de derechos y deberes en la comunidad política.",
        "ejemplo": "Participar y respetar la ley."
      }
    ],
    "diagrama_svg": ""
  },
  "pensamiento_sistemico": {
    "intro": "El pensamiento sistémico mira un problema social como red: causas, actores, efectos colaterales e interdependencias. No reduce todo a una sola variable.",
    "pasos": [
      "Lista actores (Estado, comunidad, empresas…).",
      "Relaciona causa → efecto → retroalimentación.",
      "Elige la opción que reconoce varias dimensiones del caso."
    ],
    "errores": [
      "Culpar a un solo actor sin mirar el sistema.",
      "Ignorar efectos secundarios.",
      "Proponer una solución que rompe otra parte del sistema sin evaluarlo."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Más tráfico + más buses viejos + poca ciclovía. ¿Lectura sistémica?",
      "pasos": [
        "1) Varias causas concurrentes.",
        "2) Soluciones parciales (solo semáforos) no bastan.",
        "3) Hay que coordinar transporte, ambiente y urbanismo."
      ],
      "respuesta": "Problema multicausal e interdependiente",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_psi_01",
        "enunciado": "Un sistema social se entiende mejor si:",
        "opciones": [
          "A) Miras relaciones entre partes",
          "B) Ves solo un tuit",
          "C) Ignoras causas",
          "D) Borras datos"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Insuficiente.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Relaciones."
      },
      {
        "id": "tr_psi_02",
        "enunciado": "Un efecto colateral es:",
        "opciones": [
          "A) Una consecuencia no buscada de una medida",
          "B) La meta principal",
          "C) Un sinónimo de tesis literaria",
          "D) Un afluente"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "Geo."
        },
        "explicacion_correcta": "No intencional."
      },
      {
        "id": "tr_psi_03",
        "enunciado": "Interdependencia significa:",
        "opciones": [
          "A) Que lo que hace un actor afecta a otros",
          "B) Que nadie se relaciona",
          "C) Que no hay causas",
          "D) Que solo importa el clima de Marte"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Lo contrario.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Afectación mutua."
      },
      {
        "id": "tr_psi_04",
        "enunciado": "Una lectura no sistémica típica:",
        "opciones": [
          "A) Culpar a una sola persona de un problema complejo",
          "B) Mapear actores",
          "C) Ver causas múltiples",
          "D) Evaluar efectos"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso es sistémico.",
          "C": "Eso es sistémico.",
          "D": "Eso es sistémico."
        },
        "explicacion_correcta": "Reduccionismo."
      }
    ],
    "profundizar": "Actores + causas + efectos en red.",
    "terminos": [
      {
        "termino": "sistema",
        "definicion": "Conjunto de partes que interactúan.",
        "ejemplo": "Escuela = estudiantes + docentes + normas."
      },
      {
        "termino": "retroalimentación",
        "definicion": "Efecto que vuelve a influir en la causa.",
        "ejemplo": "Más contaminación → más enfermedad → más gasto."
      },
      {
        "termino": "efecto cascada",
        "definicion": "Una causa produce varias consecuencias encadenadas.",
        "ejemplo": "Sequía → cosechas → precios."
      },
      {
        "termino": "interdependencia",
        "definicion": "Las partes se afectan mutuamente.",
        "ejemplo": "Economía y ambiente."
      }
    ],
    "diagrama_svg": ""
  },
  "pensamiento_critico": {
    "intro": "Fuentes y evidencias: quién habla, con qué datos y qué tan confiables son. Un buen juicio distingue rumor, opinión y prueba.",
    "pasos": [
      "Identifica la fuente (institución, testigo, anónimo).",
      "Mira si aporta datos verificables.",
      "Valora si alcanza para la conclusión."
    ],
    "errores": [
      "Creer algo solo porque “está en redes”.",
      "Confundir testimonio único con estadística.",
      "Descartar una fuente seria sin argumento."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Un rumor de chat vs un informe con metodología. ¿Cuál sostiene mejor una política pública?",
      "pasos": [
        "1) El informe declara método y datos.",
        "2) El rumor no es verificable.",
        "3) Prioriza la fuente con evidencia."
      ],
      "respuesta": "El informe con metodología",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_pc_01",
        "enunciado": "Una evidencia fuerte suele ser:",
        "opciones": [
          "A) Dato contrastable",
          "B) Insulto",
          "C) Rumor anónimo",
          "D) Amenaza"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No prueba.",
          "C": "Débil.",
          "D": "No prueba."
        },
        "explicacion_correcta": "Contrastable."
      },
      {
        "id": "tr_pc_02",
        "enunciado": "Pregunta clave sobre una fuente:",
        "opciones": [
          "A) ¿Quién la produce y con qué interés?",
          "B) ¿Qué tipografía usa?",
          "C) ¿Cuántos emojis tiene?",
          "D) ¿Es larga?"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Irrelevante.",
          "C": "Irrelevante.",
          "D": "No basta."
        },
        "explicacion_correcta": "Autor e interés."
      },
      {
        "id": "tr_pc_03",
        "enunciado": "Un sesgo de confirmación es:",
        "opciones": [
          "A) Buscar solo lo que ya creías",
          "B) Revisar contraejemplos",
          "C) Citar método",
          "D) Corregir errores"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso combate el sesgo.",
          "C": "Eso ayuda.",
          "D": "Eso ayuda."
        },
        "explicacion_correcta": "Solo confirmar."
      },
      {
        "id": "tr_pc_04",
        "enunciado": "Para sostener “aumentó el desempleo” necesitas:",
        "opciones": [
          "A) Cifras y periodo de comparación",
          "B) Solo un chiste",
          "C) Una metáfora",
          "D) Un color"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No basta.",
          "D": "No."
        },
        "explicacion_correcta": "Datos + periodo."
      }
    ],
    "profundizar": "Fuente + dato + suficiencia.",
    "terminos": [
      {
        "termino": "evidencia",
        "definicion": "Datos que sostienen un juicio.",
        "ejemplo": "Sin evidencia, hay opinión débil."
      },
      {
        "termino": "supuesto",
        "definicion": "Idea no demostrada que se da por hecha.",
        "ejemplo": "Hay que hacerlo explícito."
      },
      {
        "termino": "contraejemplo",
        "definicion": "Caso que refuta una generalización.",
        "ejemplo": "“Todos…” falla con un solo caso."
      },
      {
        "termino": "criterio",
        "definicion": "Norma para evaluar (claridad, relevancia, rigor).",
        "ejemplo": "¿La fuente es confiable?"
      }
    ],
    "diagrama_svg": ""
  },
  "interpretacion": {
    "intro": "Leer gráficos y mapas sociales: leyenda, escala, unidades y qué comparación permite el visual (mayor/menor, tendencia, distribución).",
    "pasos": [
      "Lee título, leyenda y unidades.",
      "Ubica el valor que pide la pregunta.",
      "Compara solo lo que el gráfico muestra."
    ],
    "errores": [
      "Inventar una tendencia no dibujada.",
      "Confundir eje X con Y.",
      "Ignorar la escala."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Barras: Andina 48, Caribe 20. ¿Cuál concentra más?",
      "pasos": [
        "1) Compara alturas/valores.",
        "2) 48 > 20.",
        "3) Andina."
      ],
      "respuesta": "Andina",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_int_01",
        "enunciado": "La leyenda de un mapa sirve para:",
        "opciones": [
          "A) Explicar símbolos y colores",
          "B) Cantar el himno",
          "C) Freír",
          "D) Conjugar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Símbolos."
      },
      {
        "id": "tr_int_02",
        "enunciado": "Si el eje Y está en %, no leas los valores como:",
        "opciones": [
          "A) Personas absolutas sin aviso",
          "B) Porcentajes",
          "C) Relativos",
          "D) Partes de 100"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso sí.",
          "C": "Eso sí.",
          "D": "Eso sí."
        },
        "explicacion_correcta": "Respeta unidades."
      },
      {
        "id": "tr_int_03",
        "enunciado": "Una tendencia al alza en una línea significa:",
        "opciones": [
          "A) El valor crece en el tiempo mostrado",
          "B) El mapa se mojó",
          "C) Hay un afluente",
          "D) Hay una metáfora"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Crecimiento."
      },
      {
        "id": "tr_int_04",
        "enunciado": "Para decir “cuál es mayor” en barras miras:",
        "opciones": [
          "A) La altura o el valor rotulado",
          "B) Solo el color favorito",
          "C) La tipografía",
          "D) El clima"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Altura/valor."
      }
    ],
    "profundizar": "Título, leyenda, ejes, comparación.",
    "terminos": [
      {
        "termino": "interpretar",
        "definicion": "Explicar el sentido de un dato, norma o hecho social.",
        "ejemplo": "No es solo repetir el dato."
      },
      {
        "termino": "contexto",
        "definicion": "Marco histórico o social del hecho.",
        "ejemplo": "Sin contexto se malentiende."
      },
      {
        "termino": "perspectiva",
        "definicion": "Punto de vista desde el que se mira.",
        "ejemplo": "Campesino vs empresa."
      },
      {
        "termino": "implicación",
        "definicion": "Consecuencia lógica de una lectura.",
        "ejemplo": "Si X es cierto, entonces Y."
      }
    ],
    "diagrama_svg": ""
  },
  "interpretacion_y_analisis": {
    "intro": "Interpretar perspectivas: cada actor tiene intereses y marcos. Analiza qué defiende, con qué argumentos y qué consecuencias tendría adoptar su posición.",
    "pasos": [
      "Identifica quién habla y qué quiere.",
      "Resume su marco (económico, ambiental, de derechos…).",
      "Evalúa consecuencias de seguir esa perspectiva."
    ],
    "errores": [
      "Atribuir a un actor la tesis del otro.",
      "Ignorar el conflicto de intereses.",
      "Elegir “la más bonita” sin analizar consecuencias."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Empresa quiere mina; comunidad teme el agua. ¿Perspectivas?",
      "pasos": [
        "1) Empresa: interés económico/extractivo.",
        "2) Comunidad: interés hídrico/territorio.",
        "3) Análisis: tensar desarrollo vs cuidado ambiental."
      ],
      "respuesta": "Intereses en tensión: extractivo vs hídrico",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_iya_01",
        "enunciado": "Una perspectiva es:",
        "opciones": [
          "A) El punto de vista de un actor con sus intereses",
          "B) Un triángulo",
          "C) Un mcm",
          "D) Un auxiliar did"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Geo/mate.",
          "C": "Mate.",
          "D": "Inglés."
        },
        "explicacion_correcta": "Punto de vista."
      },
      {
        "id": "tr_iya_02",
        "enunciado": "Al analizar consecuencias preguntas:",
        "opciones": [
          "A) Qué pasaría si se impone esa posición",
          "B) Solo el color del logo",
          "C) La tipografía",
          "D) El clima de Marte"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Consecuencias."
      },
      {
        "id": "tr_iya_03",
        "enunciado": "Un marco ambiental prioriza:",
        "opciones": [
          "A) Ecosistemas y recursos",
          "B) Solo el chiste",
          "C) Solo la conjugación",
          "D) Solo el perímetro"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "Mate."
        },
        "explicacion_correcta": "Ambiente."
      },
      {
        "id": "tr_iya_04",
        "enunciado": "Error típico:",
        "opciones": [
          "A) Mezclar qué dijo cada actor",
          "B) Separar intereses",
          "C) Leer el caso",
          "D) Nombrar consecuencias"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Eso ayuda.",
          "C": "Eso ayuda.",
          "D": "Eso ayuda."
        },
        "explicacion_correcta": "No mezclar voces."
      }
    ],
    "profundizar": "Actor → interés → consecuencias.",
    "terminos": [
      {
        "termino": "análisis",
        "definicion": "Descomponer un problema en partes y relaciones.",
        "ejemplo": "Causas, actores, efectos."
      },
      {
        "termino": "interpretación",
        "definicion": "Dar sentido a los datos del caso.",
        "ejemplo": "¿Qué significa esta cifra?"
      },
      {
        "termino": "variable social",
        "definicion": "Factor que cambia (ingreso, educación, región).",
        "ejemplo": "Sirve para comparar."
      },
      {
        "termino": "conclusión fundada",
        "definicion": "Juicio apoyado en evidencia del caso.",
        "ejemplo": "No en prejuicios."
      }
    ],
    "diagrama_svg": ""
  },
  "participacion": {
    "intro": "La participación ciudadana usa mecanismos: voto, consulta popular, cabildo, veeduría, iniciativa legislativa. Cada uno sirve para influir en lo público de forma distinta.",
    "pasos": [
      "Identifica qué quiere lograr la ciudadanía (elegir, vigilar, proponer).",
      "Elige el mecanismo que corresponde.",
      "No inventes trámites que no existen en el caso."
    ],
    "errores": [
      "Confundir veeduría con tutela.",
      "Pensar que el voto es el único mecanismo.",
      "Usar revocatoria para un cargo que no aplica."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Ciudadanos quieren vigilar un contrato de obra. ¿Mecanismo?",
      "pasos": [
        "1) Objetivo: control/vigilancia.",
        "2) Veeduría ciudadana.",
        "3) No es exactamente el voto."
      ],
      "respuesta": "Veeduría",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_par_01",
        "enunciado": "El voto sirve para:",
        "opciones": [
          "A) Elegir representantes",
          "B) Medir un ángulo",
          "C) Conjugar",
          "D) Nombrar un afluente"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Mate.",
          "C": "Inglés.",
          "D": "Geo."
        },
        "explicacion_correcta": "Elección."
      },
      {
        "id": "tr_par_02",
        "enunciado": "Una consulta popular indaga:",
        "opciones": [
          "A) La opinión ciudadana sobre un tema",
          "B) Solo el clima",
          "C) Solo el mcm",
          "D) Solo la tipografía"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Opinión pública formal."
      },
      {
        "id": "tr_par_03",
        "enunciado": "La veeduría busca:",
        "opciones": [
          "A) Vigilar la gestión pública",
          "B) Freír",
          "C) Pintar",
          "D) Nadar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Vigilancia."
      },
      {
        "id": "tr_par_04",
        "enunciado": "Participar no es solo votar; también es:",
        "opciones": [
          "A) Proponer, vigilar y deliberar",
          "B) Solo callar",
          "C) Solo insultar",
          "D) Solo ausentarse siempre"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Varios mecanismos."
      }
    ],
    "profundizar": "Voto, consulta, veeduría, iniciativa: elige el adecuado.",
    "terminos": [
      {
        "termino": "participación ciudadana",
        "definicion": "Intervenir en asuntos públicos de forma legítima.",
        "ejemplo": "Voto, veeduría, consulta."
      },
      {
        "termino": "mecanismo de participación",
        "definicion": "Vía institucional para influir.",
        "ejemplo": "Cabildo, referendo, tutela (en su rol)."
      },
      {
        "termino": "deber ciudadano",
        "definicion": "Obligación frente a la comunidad.",
        "ejemplo": "Respetar derechos de otros."
      },
      {
        "termino": "espacio público",
        "definicion": "Ámbito compartido de discusión y decisión.",
        "ejemplo": "No es solo una plaza física."
      }
    ],
    "diagrama_svg": ""
  },
  "competencias_ciudadanas": {
    "intro": "Las competencias ciudadanas unen convivir, participar y pensar lo público con respeto a los derechos. En un conflicto, la respuesta competente protege dignidad y busca salidas institucionales.",
    "pasos": [
      "Reconoce el derecho vulnerado o el conflicto.",
      "Propone una acción respetuosa y legal.",
      "Evita respuestas violentas o discriminatorias."
    ],
    "errores": [
      "Responder con agresión.",
      "Excluir a alguien por identidad.",
      "Ignorar rutas de atención existentes."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Un compañero es excluido del grupo por su acento. ¿Qué es ciudadano?",
      "pasos": [
        "1) Hay discriminación.",
        "2) Acción: incluir, dialogar, reportar si persiste.",
        "3) No reforzar el rechazo."
      ],
      "respuesta": "Incluir y rechazar la discriminación",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_cc_01",
        "enunciado": "Una acción ciudadana competente:",
        "opciones": [
          "A) Respeta derechos y busca solución pacífica",
          "B) Humilla",
          "C) Agrede",
          "D) Falsifica"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Vulnera.",
          "C": "Vulnera.",
          "D": "Ilegal."
        },
        "explicacion_correcta": "Respeto + pacífica."
      },
      {
        "id": "tr_cc_02",
        "enunciado": "Pensar lo público implica:",
        "opciones": [
          "A) Considerar el interés común",
          "B) Solo el capricho propio",
          "C) Ignorar a otros",
          "D) Romper normas por diversión"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Interés común."
      },
      {
        "id": "tr_cc_03",
        "enunciado": "Ante bullying, una ruta válida es:",
        "opciones": [
          "A) Activar protocolos escolares",
          "B) Guardar silencio eterno",
          "C) Devolver violencia",
          "D) Burlarse más"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No protege.",
          "C": "Agrava.",
          "D": "Agrava."
        },
        "explicacion_correcta": "Protocolos."
      },
      {
        "id": "tr_cc_04",
        "enunciado": "La dignidad humana exige:",
        "opciones": [
          "A) Trato respetuoso a toda persona",
          "B) Discriminar",
          "C) Excluir",
          "D) Callar denuncias siempre"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Lo contrario.",
          "C": "Lo contrario.",
          "D": "No siempre."
        },
        "explicacion_correcta": "Respeto."
      }
    ],
    "profundizar": "Convivir, participar, pensar lo público con derechos.",
    "terminos": [
      {
        "termino": "derecho",
        "definicion": "Facultad protegida por la norma.",
        "ejemplo": "Educación, vida, debido proceso."
      },
      {
        "termino": "deber",
        "definicion": "Obligación correlativa al derecho de otros.",
        "ejemplo": "No agredir, cumplir la ley."
      },
      {
        "termino": "conflicto",
        "definicion": "Desacuerdo que exige manejo pacífico.",
        "ejemplo": "Diálogo, mediación, justicia."
      },
      {
        "termino": "empatía",
        "definicion": "Ponerse en el lugar del otro para comprender.",
        "ejemplo": "Base del respeto."
      },
      {
        "termino": "pluralismo",
        "definicion": "Reconocer legítima diversidad de ideas.",
        "ejemplo": "Sin imponer una sola visión."
      }
    ],
    "diagrama_svg": ""
  },
  "aptitud_numerica_docente": {
    "intro": "La aptitud numérica docente aplica proporciones, porcentajes y lectura de datos escolares (asistencias, notas, cupos) con sentido pedagógico: el número informa una decisión de aula.",
    "pasos": [
      "Traduce el problema escolar a una operación (razón, %, promedio).",
      "Calcula con unidades coherentes.",
      "Interpreta el resultado en el contexto del aula."
    ],
    "errores": [
      "Calcular bien pero interpretar al revés.",
      "Usar % sobre la base equivocada.",
      "Ignorar que el dato es de una muestra."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "De 40 estudiantes, 8 faltaron. ¿Qué % faltó?",
      "pasos": [
        "1) 8/40 = 0,2.",
        "2) 0,2 × 100 = 20%.",
        "3) Faltó el 20%."
      ],
      "respuesta": "20%",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_and_01",
        "enunciado": "15 de 60 es:",
        "opciones": [
          "A) 25%",
          "B) 15%",
          "C) 40%",
          "D) 50%"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Confundiste cantidad con %.",
          "C": "Mal.",
          "D": "Mal."
        },
        "explicacion_correcta": "15/60=0,25."
      },
      {
        "id": "tr_and_02",
        "enunciado": "Si el promedio de 4 notas es 80 y tres suman 230, la cuarta es:",
        "opciones": [
          "A) 90",
          "B) 80",
          "C) 70",
          "D) 50"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Insuficiente.",
          "C": "Mal despeje.",
          "D": "Mal."
        },
        "explicacion_correcta": "Total 320; 320−230=90."
      },
      {
        "id": "tr_and_03",
        "enunciado": "Razón 2:5 de niños a niñas en 35 alumnos → niños:",
        "opciones": [
          "A) 10",
          "B) 14",
          "C) 20",
          "D) 25"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Partes mal.",
          "C": "Mal.",
          "D": "Mal."
        },
        "explicacion_correcta": "2+5=7 partes; 35/7=5; 2×5=10."
      },
      {
        "id": "tr_and_04",
        "enunciado": "Un gráfico de asistencia sirve al docente para:",
        "opciones": [
          "A) Detectar patrones y decidir apoyos",
          "B) Freír",
          "C) Conjugar",
          "D) Nombrar ríos"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Decisión pedagógica con datos."
      }
    ],
    "profundizar": " %, razones y promedios con sentido de aula.",
    "terminos": [
      {
        "termino": "porcentaje",
        "definicion": "Parte de 100.",
        "ejemplo": "15 de 60 = 25%."
      },
      {
        "termino": "promedio",
        "definicion": "Media aritmética de notas o datos.",
        "ejemplo": "Suma ÷ cantidad."
      },
      {
        "termino": "razón",
        "definicion": "Comparación a:b.",
        "ejemplo": "2:5 de niños a niñas."
      },
      {
        "termino": "lectura de gráficos",
        "definicion": "Interpretar barras, líneas o tablas para decidir.",
        "ejemplo": "Ver en qué mes bajó la asistencia."
      }
    ],
    "diagrama_svg": ""
  },
  "aptitud_pedagogica": {
    "intro": "La aptitud pedagógica elige acciones de enseñanza que respetan el aprendizaje: diagnóstico, andamiaje, retroalimentación clara y clima de aula seguro.",
    "pasos": [
      "Identifica la necesidad del estudiante (concepto, motivación, inclusión).",
      "Elige la estrategia que enseña, no solo que castiga.",
      "Verifica que la acción sea ética y viable en el aula."
    ],
    "errores": [
      "Ridiculizar el error.",
      "Dar solo la respuesta sin mediar.",
      "Ignorar barreras de acceso."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Un estudiante falla fracciones. ¿Qué es más pedagógico?",
      "pasos": [
        "1) Diagnosticar el error (p. ej. sumar denominadores).",
        "2) Mediar con material concreto / mcm.",
        "3) No limitarse a decir “mal”."
      ],
      "respuesta": "Mediar el error conceptual",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_ap_01",
        "enunciado": "Una buena retroalimentación:",
        "opciones": [
          "A) Señala el error y cómo corregirlo",
          "B) Solo insulta",
          "C) Es silencio total siempre",
          "D) Falsifica la nota"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Dañina.",
          "C": "No enseña.",
          "D": "Ilegal/antipedagógico."
        },
        "explicacion_correcta": "Error + camino."
      },
      {
        "id": "tr_ap_02",
        "enunciado": "El andamiaje consiste en:",
        "opciones": [
          "A) Apoyar y retirar ayuda poco a poco",
          "B) Hacer todo por el estudiante siempre",
          "C) Abandonar",
          "D) Castigar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Dependencia.",
          "C": "No.",
          "D": "No enseña."
        },
        "explicacion_correcta": "Apoyo gradual."
      },
      {
        "id": "tr_ap_03",
        "enunciado": "Un clima de aula seguro permite:",
        "opciones": [
          "A) Equivocarse y aprender",
          "B) Burlarse",
          "C) Excluir",
          "D) Amenazar"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Inseguro.",
          "C": "Inseguro.",
          "D": "Inseguro."
        },
        "explicacion_correcta": "Seguridad para aprender."
      },
      {
        "id": "tr_ap_04",
        "enunciado": "Ante diversidad en el aula, lo pedagógico es:",
        "opciones": [
          "A) Ajustar apoyos sin bajar la dignidad",
          "B) Ignorar necesidades",
          "C) Segregar con burla",
          "D) Negar el acceso"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Excluye.",
          "C": "Violento.",
          "D": "Ilegal/antipedagógico."
        },
        "explicacion_correcta": "Inclusión con respeto."
      }
    ],
    "profundizar": "Diagnosticar, mediar, retroalimentar con respeto.",
    "terminos": [
      {
        "termino": "andamiaje",
        "definicion": "Apoyo temporal que se retira al ganar autonomía.",
        "ejemplo": "Guía pasos y luego suelta."
      },
      {
        "termino": "retroalimentación",
        "definicion": "Información sobre el error y cómo mejorar.",
        "ejemplo": "No solo “mal”."
      },
      {
        "termino": "diagnóstico",
        "definicion": "Identificar qué no entiende el estudiante.",
        "ejemplo": "Antes de seguir adelante."
      },
      {
        "termino": "clima de aula",
        "definicion": "Ambiente emocional y de respeto para aprender.",
        "ejemplo": "Sin burla ante el error."
      }
    ],
    "diagrama_svg": ""
  },
  "dialogues": {
    "intro": "En un diálogo, cada turno responde al anterior: saludos, peticiones, rechazos o acuerdos. La clave está en qué acaba de decir el interlocutor y qué se espera como reacción natural.",
    "pasos": [
      "Lee el último turno antes del hueco.",
      "Decide la función: aceptar, rechazar, preguntar, disculparse.",
      "Elige la réplica que encaja en tono y contenido."
    ],
    "errores": [
      "Responder “Yes, I am” a “How are you?”.",
      "Ignorar un “Would you like…?” y hablar de otro tema.",
      "Usar un registro grosero cuando el diálogo es formal."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "A: “Could you open the window?” B: _____",
      "pasos": [
        "1) Es una petición cortés.",
        "2) Respuesta natural: “Sure.” / “Of course.”",
        "3) No: “I am 15 years old.”"
      ],
      "respuesta": "Sure. / Of course.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_dia_01",
        "enunciado": "A: “How are you?” B: _____",
        "opciones": [
          "A) I am fine, thanks.",
          "B) Yes, I am.",
          "C) I am student.",
          "D) Open the door."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Yes, I am responde a Are you…?",
          "C": "No responde al saludo.",
          "D": "Es una orden."
        },
        "explicacion_correcta": "How are you → I am fine."
      },
      {
        "id": "tr_dia_02",
        "enunciado": "A: “Would you like some water?” B: _____",
        "opciones": [
          "A) Yes, please.",
          "B) I am water.",
          "C) Yesterday.",
          "D) She goes."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No tiene sentido.",
          "C": "No responde la oferta.",
          "D": "Gramática ajena."
        },
        "explicacion_correcta": "Oferta → Yes, please / No, thanks."
      },
      {
        "id": "tr_dia_03",
        "enunciado": "A: “Sorry I'm late.” B: _____",
        "opciones": [
          "A) No problem.",
          "B) I am late too always never.",
          "C) What time is book?",
          "D) Play soccer."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "Malformado.",
          "C": "Cambia de tema.",
          "D": "Irrelevante."
        },
        "explicacion_correcta": "Disculpa → No problem / That's OK."
      },
      {
        "id": "tr_dia_04",
        "enunciado": "A: “Where is the library?” B: _____",
        "opciones": [
          "A) It's next to the cafeteria.",
          "B) I am library.",
          "C) Yes, I do.",
          "D) Because."
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No localiza.",
          "C": "Responde a Do you…?",
          "D": "Conector suelto."
        },
        "explicacion_correcta": "Where → lugar."
      }
    ],
    "profundizar": "Practica pares: petición/oferta/disculpa/ubicación.",
    "terminos": [
      {
        "termino": "turno",
        "definicion": "Cada intervención de un hablante.",
        "ejemplo": "A pregunta; B responde."
      },
      {
        "termino": "saludo",
        "definicion": "Fórmula de inicio o cierre.",
        "ejemplo": "Hi / See you later."
      },
      {
        "termino": "petición",
        "definicion": "Pedir algo con cortesía.",
        "ejemplo": "Could you help me?"
      },
      {
        "termino": "respuesta coherente",
        "definicion": "Contesta lo que se preguntó.",
        "ejemplo": "How are you? → Fine, thanks."
      }
    ],
    "diagrama_svg": ""
  },
  "signs_notices": {
    "intro": "Los avisos e instrucciones en inglés usan imperativos (Keep quiet), modales de obligación (must, should) y prohibiciones (Do not / No + -ing). Lee la condición (place/time) antes de elegir.",
    "pasos": [
      "Identifica si ordena, prohíbe o informa.",
      "Atiende el lugar o la hora del aviso.",
      "Elige la opción que cumple la instrucción, no una paráfrasis contraria."
    ],
    "errores": [
      "Leer “No smoking” como permiso para fumar.",
      "Ignorar “after 6 p.m.”.",
      "Confundir must con might."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Sign: “Do not enter after 8 p.m.” What does it mean?",
      "pasos": [
        "1) Do not enter = prohibición.",
        "2) after 8 p.m. = condición de tiempo.",
        "3) No se puede entrar después de las 8."
      ],
      "respuesta": "Entry is forbidden after 8 p.m.",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_av_01",
        "enunciado": "“Keep the door closed.” means:",
        "opciones": [
          "A) Leave the door open",
          "B) The door should stay closed",
          "C) Break the door",
          "D) Ignore the door"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Es lo contrario.",
          "C": "No lo dice.",
          "D": "No."
        },
        "explicacion_correcta": "Keep = mantener cerrada."
      },
      {
        "id": "tr_av_02",
        "enunciado": "“No food in the lab.” means:",
        "opciones": [
          "A) You may eat here",
          "B) Food is not allowed in the lab",
          "C) Only teachers eat",
          "D) Buy food now"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Contradice No.",
          "C": "No lo limita a teachers.",
          "D": "No es una orden de compra."
        },
        "explicacion_correcta": "No + noun = prohibición."
      },
      {
        "id": "tr_av_03",
        "enunciado": "“Please turn off your phones.” is:",
        "opciones": [
          "A) a suggestion to keep phones on",
          "B) a polite instruction to switch phones off",
          "C) a weather report",
          "D) a math problem"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Off ≠ on.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "turn off = apagar."
      },
      {
        "id": "tr_av_04",
        "enunciado": "“Staff only.” means:",
        "opciones": [
          "A) Anyone can enter",
          "B) Only workers may enter",
          "C) Students must enter",
          "D) Closed forever"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Contradice only.",
          "C": "No dice students.",
          "D": "No afirma cierre eterno."
        },
        "explicacion_correcta": "Staff only = solo personal."
      }
    ],
    "profundizar": "Repasa imperativos y No + -ing / No + noun.",
    "terminos": [
      {
        "termino": "aviso",
        "definicion": "Texto breve que informa o prohíbe.",
        "ejemplo": "No smoking / Opening hours."
      },
      {
        "termino": "prohibición",
        "definicion": "Indica lo que no se puede hacer.",
        "ejemplo": "Do not enter."
      },
      {
        "termino": "horario",
        "definicion": "Cuándo abre o cierra un lugar.",
        "ejemplo": "Open 9 a.m. – 5 p.m."
      },
      {
        "termino": "destinatario",
        "definicion": "A quién va dirigido el mensaje.",
        "ejemplo": "Staff only / Visitors."
      }
    ],
    "diagrama_svg": ""
  },
  "lexical_cloze": {
    "intro": "En inglés, el hueco de una oración se completa con la forma que concuerda con el sujeto y con las pistas de tiempo. Yesterday / last week → pasado simple; since / for + resultado presente → present perfect; he/she/it en presente añade -s.",
    "pasos": [
      "Busca marcas de tiempo (yesterday, now, since, tomorrow).",
      "Mira el sujeto: I/you/we/they vs he/she/it.",
      "Elige el tiempo y la forma (afirmativa, negativa o interrogativa) que encajan juntos."
    ],
    "errores": [
      "Usar present simple con yesterday.",
      "Olvidar la -s de he/she/it en presente.",
      "Elegir un infinitivo cuando la estructura pide -ing o pasado."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "She _____ to the library yesterday.",
      "pasos": [
        "1) yesterday = pasado.",
        "2) Sujeto she → verbo en pasado: went (go → went).",
        "3) No uses goes (presente) ni going (sin auxiliar)."
      ],
      "respuesta": "went",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_cloze_01",
        "enunciado": "They _____ soccer every Saturday.",
        "opciones": [
          "A) plays",
          "B) play",
          "C) playing",
          "D) played yesterday"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "plays es para he/she/it.",
          "C": "Falta auxiliar (are playing).",
          "D": "yesterday contradice every Saturday."
        },
        "explicacion_correcta": "They + present simple = play."
      },
      {
        "id": "tr_cloze_02",
        "enunciado": "He _____ here since 2020.",
        "opciones": [
          "A) lives",
          "B) lived",
          "C) has lived",
          "D) living"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Presente simple no marca since.",
          "B": "Pasado corto no cubre desde 2020 hasta ahora.",
          "D": "Falta has/is."
        },
        "explicacion_correcta": "since → present perfect: has lived."
      },
      {
        "id": "tr_cloze_03",
        "enunciado": "I _____ my homework last night.",
        "opciones": [
          "A) do",
          "B) does",
          "C) did",
          "D) doing"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "do es presente.",
          "B": "does es he/she.",
          "D": "doing necesita auxiliar."
        },
        "explicacion_correcta": "last night → did."
      },
      {
        "id": "tr_cloze_04",
        "enunciado": "We _____ to the museum tomorrow.",
        "opciones": [
          "A) go",
          "B) went",
          "C) are going",
          "D) gone"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "go no marca futuro planificado.",
          "B": "went es pasado.",
          "D": "gone es participio."
        },
        "explicacion_correcta": "tomorrow + plan → are going."
      }
    ],
    "profundizar": "Practica tiempos: past, present, present perfect y futuros con marcas de tiempo.",
    "terminos": [
      {
        "termino": "concordancia",
        "definicion": "El verbo debe coincidir con el sujeto (número/persona).",
        "ejemplo": "He plays / They play."
      },
      {
        "termino": "tiempo verbal",
        "definicion": "Forma del verbo según cuándo ocurre la acción.",
        "ejemplo": "Yesterday → past simple."
      },
      {
        "termino": "presente simple",
        "definicion": "Hábitos y hechos generales.",
        "ejemplo": "She works every day."
      },
      {
        "termino": "pasado simple",
        "definicion": "Acciones terminadas en el pasado.",
        "ejemplo": "They went yesterday."
      },
      {
        "termino": "auxiliar",
        "definicion": "Do/does/did ayudan en negativas y preguntas.",
        "ejemplo": "Does he live here?"
      }
    ],
    "diagrama_svg": ""
  },
  "vocabulary": {
    "intro": "El vocabulario en contexto se decide por la oración completa: sinónimos, colocaciones (make a decision, take a bus) y el registro (formal/informal). No elijas la primera acepción del diccionario si no encaja.",
    "pasos": [
      "Lee la oración entera y qué pedía el hueco (verbo, sustantivo, adjetivo).",
      "Descarta opciones que cambian el sentido o la colocación.",
      "Quédate con la palabra que suena natural en ese contexto."
    ],
    "errores": [
      "Elegir un sinónimo que no colocaciona (do a decision).",
      "Ignorar el tono (muy informal en un aviso serio).",
      "Traducir palabra por palabra desde el español."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Please _____ a decision before Friday.",
      "pasos": [
        "1) Colocación inglesa: make a decision.",
        "2) take/do no son la colocación estándar aquí.",
        "3) Respuesta: make."
      ],
      "respuesta": "make",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_voc_01",
        "enunciado": "She _____ the bus to school.",
        "opciones": [
          "A) makes",
          "B) takes",
          "C) does",
          "D) puts"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "make the bus no es colocación.",
          "C": "do the bus no.",
          "D": "put the bus no."
        },
        "explicacion_correcta": "take the bus."
      },
      {
        "id": "tr_voc_02",
        "enunciado": "The movie was so _____ that I cried.",
        "opciones": [
          "A) funny",
          "B) moving",
          "C) bored",
          "D) short only"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "funny hace reír, no llorar.",
          "C": "bored describe a la persona.",
          "D": "short no explica el llanto."
        },
        "explicacion_correcta": "moving = emotivo."
      },
      {
        "id": "tr_voc_03",
        "enunciado": "He gave me some useful _____.",
        "opciones": [
          "A) advices",
          "B) advice",
          "C) advise",
          "D) advising"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "advice es incontable (sin -s).",
          "C": "advise es verbo.",
          "D": "gerundio no cabe."
        },
        "explicacion_correcta": "advice (uncountable)."
      },
      {
        "id": "tr_voc_04",
        "enunciado": "We need to _____ the problem carefully.",
        "opciones": [
          "A) look",
          "B) watch",
          "C) examine",
          "D) see at"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "look necesita at/into.",
          "B": "watch es observar en el tiempo.",
          "D": "see at no es natural."
        },
        "explicacion_correcta": "examine the problem."
      }
    ],
    "profundizar": "Aprende colocaciones frecuentes: make/take/do/have + sustantivo.",
    "terminos": [
      {
        "termino": "contexto",
        "definicion": "Palabras alrededor que revelan el sentido.",
        "ejemplo": "Bank = banco o orilla, según la frase."
      },
      {
        "termino": "sinónimo",
        "definicion": "Palabra de significado parecido.",
        "ejemplo": "big ≈ large."
      },
      {
        "termino": "colocación",
        "definicion": "Combinación natural de palabras.",
        "ejemplo": "make a decision (no *do a decision)."
      },
      {
        "termino": "falso amigo",
        "definicion": "Palabra parecida al español con otro sentido.",
        "ejemplo": "Actually ≈ en realidad (no “actualmente”)."
      }
    ],
    "diagrama_svg": ""
  },
  "reading_comprehension": {
    "intro": "En comprensión de lectura en inglés identificas la idea principal, un detalle explícito o el propósito del autor. La respuesta correcta está apoyada por una o más oraciones del texto, no por tu opinión general.",
    "pasos": [
      "Lee el texto completo una vez.",
      "Subraya la frase que responde exactamente a la pregunta.",
      "Descarta opciones que agregan datos que el texto no dice."
    ],
    "errores": [
      "Elegir un detalle verdadero pero que no responde la pregunta.",
      "Inventar una causa que el texto no menciona.",
      "Confundir el título con la idea principal si el texto dice otra cosa."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "Text: “Ana walks to school because the bus is expensive.” Why does Ana walk?",
      "pasos": [
        "1) La pregunta pide la causa.",
        "2) El texto dice because the bus is expensive.",
        "3) No inventes “she likes exercise” si no está."
      ],
      "respuesta": "Because the bus is expensive",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_lec_01",
        "enunciado": "Text: “The museum opens at 9.” When does it open?",
        "opciones": [
          "A) At 9",
          "B) At noon",
          "C) At night only",
          "D) Never"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No está en el texto.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Dato literal: 9."
      },
      {
        "id": "tr_lec_02",
        "enunciado": "Text: “Tom studies at night to avoid noise.” Main idea:",
        "opciones": [
          "A) Tom studies at night to avoid noise",
          "B) Tom hates books",
          "C) Night is always silent everywhere",
          "D) Tom is a teacher"
        ],
        "correcta": "A",
        "justificacion_incorrectas": {
          "B": "No lo dice.",
          "C": "Generaliza de más.",
          "D": "No lo dice."
        },
        "explicacion_correcta": "Idea = lo que el texto sostiene."
      },
      {
        "id": "tr_lec_03",
        "enunciado": "Purpose of “Buy tickets online to save time.”",
        "opciones": [
          "A) To entertain with a joke",
          "B) To advise saving time by buying online",
          "C) To describe a mountain",
          "D) To ask a math question"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "No es humor.",
          "C": "No.",
          "D": "No."
        },
        "explicacion_correcta": "Propósito = aconsejar."
      },
      {
        "id": "tr_lec_04",
        "enunciado": "Text: “Only members may enter.” Who may enter?",
        "opciones": [
          "A) Anyone",
          "B) Members only",
          "C) Children only",
          "D) Tourists only"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Only lo niega.",
          "C": "No dice children.",
          "D": "No dice tourists."
        },
        "explicacion_correcta": "Only members."
      }
    ],
    "profundizar": "Practica: main idea, detail y purpose con textos cortos.",
    "terminos": [
      {
        "termino": "main idea",
        "definicion": "Idea principal del texto.",
        "ejemplo": "What the text is mostly about."
      },
      {
        "termino": "detail",
        "definicion": "Dato específico en el texto.",
        "ejemplo": "A time, name or number."
      },
      {
        "termino": "purpose",
        "definicion": "Para qué se escribió el texto.",
        "ejemplo": "To inform, advise, persuade."
      },
      {
        "termino": "inference",
        "definicion": "Conclusión apoyada pero no literal.",
        "ejemplo": "Use clues, do not invent."
      }
    ],
    "diagrama_svg": ""
  },
  "grammar_reading": {
    "intro": "La gramática del examen pide la estructura correcta: tiempo verbal, concordancia sujeto-verbo, orden de palabras y formas en negativo/pregunta (do/does/did, don't/doesn't).",
    "pasos": [
      "Identifica si la oración es presente, pasado o perfect.",
      "Asegura que el verbo concuerde con el sujeto.",
      "En preguntas/negativos, coloca el auxiliar en el lugar correcto."
    ],
    "errores": [
      "She go / They goes.",
      "Did she went…? (doble pasado).",
      "Poner el adverbio rompiendo el auxiliar (She doesn't never…)."
    ],
    "ejemplo": {
      "titulo": "Ejemplo resuelto",
      "enunciado": "_____ she finish the project last week?",
      "pasos": [
        "1) last week = pasado.",
        "2) Pregunta en pasado: Did + sujeto + verbo base.",
        "3) Did she finish…? (no finished)."
      ],
      "respuesta": "Did she finish…?",
      "contraste": null
    },
    "practica": [
      {
        "id": "tr_gr_01",
        "enunciado": "My brother _____ English well.",
        "opciones": [
          "A) speak",
          "B) speaks",
          "C) speaking",
          "D) spoken"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "Falta -s con he.",
          "C": "Falta is/are.",
          "D": "Participio sin auxiliar."
        },
        "explicacion_correcta": "he/she → speaks."
      },
      {
        "id": "tr_gr_02",
        "enunciado": "They _____ not like coffee.",
        "opciones": [
          "A) does",
          "B) do",
          "C) didn't never",
          "D) is"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "does es singular.",
          "C": "Doble negación / mezcla.",
          "D": "is no niega like."
        },
        "explicacion_correcta": "They do not / don't."
      },
      {
        "id": "tr_gr_03",
        "enunciado": "_____ you see the movie yesterday?",
        "opciones": [
          "A) Do",
          "B) Does",
          "C) Did",
          "D) Are"
        ],
        "correcta": "C",
        "justificacion_incorrectas": {
          "A": "Do + yesterday no.",
          "B": "Does es he/she.",
          "D": "Are no forma pasado de see."
        },
        "explicacion_correcta": "Did + verbo base."
      },
      {
        "id": "tr_gr_04",
        "enunciado": "She _____ already left.",
        "opciones": [
          "A) have",
          "B) has",
          "C) having",
          "D) haded"
        ],
        "correcta": "B",
        "justificacion_incorrectas": {
          "A": "have con I/you/we/they.",
          "C": "Forma -ing incompleta.",
          "D": "No existe haded."
        },
        "explicacion_correcta": "She has already left."
      }
    ],
    "profundizar": "Repasa concordancia y auxiliares do/does/did/have/has.",
    "terminos": [
      {
        "termino": "sujeto",
        "definicion": "Quién hace la acción.",
        "ejemplo": "My brother speaks English."
      },
      {
        "termino": "verbo",
        "definicion": "La acción o estado.",
        "ejemplo": "speaks, is, went."
      },
      {
        "termino": "artículo",
        "definicion": "a/an/the delante del sustantivo.",
        "ejemplo": "a book / the book."
      },
      {
        "termino": "preposición",
        "definicion": "Palabra de relación: in, on, at, for…",
        "ejemplo": "at night / in 2020."
      },
      {
        "termino": "conectores",
        "definicion": "Enlazan ideas: because, but, although…",
        "ejemplo": "I stayed because it rained."
      }
    ],
    "diagrama_svg": ""
  }
};
export { q };

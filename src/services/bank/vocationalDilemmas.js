// 📦 src/services/bank/vocationalDilemmas.js - Banco de Dilemas Vocacionales Situacionales (Dante OS v23.1)
// Mapeo Psicométrico Dual: RIASEC (Holland) + OCEAN (Big Five)

export const DILEMAS_VOCACIONALES = [
  {
    id: "dilema_voc_001",
    categoria_contexto: "Impacto Urbano y Resiliencia Energética",
    pregunta_dante: "Imagina que una ciudad entera sufre un colapso masivo en su red eléctrica y de comunicaciones. Si tuvieras los recursos y el equipo en tus manos, ¿cuál de estos desafíos preferirías liderar personalmente para solucionar la crisis?",
    opciones: [
      {
        id: "A",
        texto: "Reconectar la infraestructura física y reprogramar los subestaciones centrales para restablecer la energía de emergencia.",
        vector_riasec: { R: 35, I: 15, C: 10 },
        vector_ocean: { C: 25, O: 10 }
      },
      {
        id: "B",
        texto: "Investigar el origen matemático o cibernético de la falla para modelar un algoritmo predictivo que evite su repetición.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Coordinar los equipos de asistencia humana y gestionar la comunicación estratégica con los ciudadanos para mantener la calma.",
        vector_riasec: { S: 35, E: 20 },
        vector_ocean: { E: 25, A: 25 }
      },
      {
        id: "D",
        texto: "Diseñar un nuevo plan espacial y estético de micro-redes limpias para reconstruir un sistema urbano más sostenible.",
        vector_riasec: { A: 30, E: 15, I: 10 },
        vector_ocean: { O: 30, E: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_002",
    categoria_contexto: "Biotecnología y Genética Agrícola",
    pregunta_dante: "Una plaga inesperada amenaza con destruir el 40% de los cultivos alimentarios de la región. Ante esta emergencia biológica, ¿en qué frente de acción te sentirías más realizado trabajando?",
    opciones: [
      {
        id: "A",
        texto: "Operar maquinaria especializada de precisión para aislar los campos afectados e instalar barreras físicas bioseguras.",
        vector_riasec: { R: 35, C: 15 },
        vector_ocean: { C: 25, N: -10 }
      },
      {
        id: "B",
        texto: "Analizar muestras de ADN genómico en laboratorio para sintetizar una variedad vegetal genéticamente resistente a la plaga.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Capacitar e instruir a cientos de comunidades agricultoras locales en técnicas agroecológicas de mitigación inmediata.",
        vector_riasec: { S: 35, A: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Negociar fondos internacionales y estructurar la empresa distribuidora de la solución para escalar su comercialización ética.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_003",
    categoria_contexto: "Inteligencia Artificial y Ética Algorítmica",
    pregunta_dante: "Se está construyendo un sistema de Inteligencia Artificial que tomará decisiones automáticas en la asignación de créditos médicos vitales. ¿Cuál sería tu contribución estratégica en este proyecto?",
    opciones: [
      {
        id: "A",
        texto: "Auditar los conjuntos de datos masivos y optimizar las estructuras de las bases de datos para asegurar cero latencia y rigor técnico.",
        vector_riasec: { C: 35, I: 15 },
        vector_ocean: { C: 30, N: -15 }
      },
      {
        id: "B",
        texto: "Desarrollar el marco teórico de sesgos algorítmicos y crear experimentos empíricos para evaluar la equidad del modelo de IA.",
        vector_riasec: { I: 35, S: 15 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Defender y proteger los derechos fundamentales de los pacientes afectados garantizando que la tecnología no deshumanice la atención.",
        vector_riasec: { S: 35, A: 15 },
        vector_ocean: { A: 30, E: 10 }
      },
      {
        id: "D",
        texto: "Crear una campaña conceptual disruptiva e inmersiva para explicarle al público cómo funciona la IA y generar confianza social.",
        vector_riasec: { A: 35, E: 15 },
        vector_ocean: { O: 30, E: 20 }
      }
    ]
  },
  {
    id: "dilema_voc_004",
    categoria_contexto: "Exploración Espacial y Habitabilidad Extraterrestre",
    pregunta_dante: "Imagina que formas parte de la primera misión multinacional para establecer un asentamiento permanente en Marte. ¿Qué responsabilidad crucial asumirías con entusiasmo?",
    opciones: [
      {
        id: "A",
        texto: "Ensamblar, reparar y mantener los sistemas robóticos de soporte vital y los módulos habitacionales bajo condiciones extremas.",
        vector_riasec: { R: 35, I: 15 },
        vector_ocean: { C: 25, N: -20 }
      },
      {
        id: "B",
        texto: "Estudiar la composición geológica del suelo marciano para descubrir reservas ocultas de agua congelada y minerales raros.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Cuidar la salud mental y el bienestar emocional de la tripulación durante los largos períodos de confinamiento interplanetario.",
        vector_riasec: { S: 35, I: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Negociar los tratados gubernamentales y dirigir la estrategia comercial de extracción de recursos espacial entre corporaciones.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_005",
    categoria_contexto: "Economía Circular y Limpieza Marina",
    pregunta_dante: "Se ha aprobado un fondo global de innovación para limpiar el gran parche de plástico del Océano Pacífico. ¿En qué rol de impacto te visualizas liderando el cambio?",
    opciones: [
      {
        id: "A",
        texto: "Construir e instalar barreras flotantes autónomas con motores solares que recolecten el plástico directamente en alta mar.",
        vector_riasec: { R: 35, E: 10 },
        vector_ocean: { C: 25, O: 15 }
      },
      {
        id: "B",
        texto: "Investigar polímeros marinos y enzimas bacterianas capaces de degradar el plástico sin liberar microplásticos tóxicos.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Diseñar una marca global de productos eco-diseñados a partir del plástico reciclado que transforme la cultura del consumidor.",
        vector_riasec: { A: 35, E: 15 },
        vector_ocean: { O: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Auditar y fiscalizar las cadenas logísticas navales de las multinacionales para asegurar que cumplan normativas de vertido cero.",
        vector_riasec: { C: 35, E: 15 },
        vector_ocean: { C: 30, A: 10 }
      }
    ]
  },
  {
    id: "dilema_voc_006",
    categoria_contexto: "Neurotecnología y Dispositivos Cerebro-Computadora",
    pregunta_dante: "Un laboratorio pionero está probando un chip neuronal que devuelve la movilidad a personas con parálisis motora. ¿Dónde aportaría mayor valor tu talento?",
    opciones: [
      {
        id: "A",
        texto: "Calibrar la electrónica bio-compatible del chip microprocesador para garantizar estabilidad eléctrica de alta fidelidad.",
        vector_riasec: { R: 35, C: 15 },
        vector_ocean: { C: 30, N: -10 }
      },
      {
        id: "B",
        texto: "Decodificar las señales electromagnéticas cerebrales mediante modelos de aprendizaje profundo e ingeniería inversa de neuronas.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Acompañar a los pacientes en sus sesiones de rehabilitación neuropsicológica para ayudarlos a adaptarse a su nueva condición.",
        vector_riasec: { S: 35, A: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Liderar la startup bio-médica que buscará inversión de capital de riesgo para distribuir el tratamiento en hospitales públicos.",
        vector_riasec: { E: 35, S: 10 },
        vector_ocean: { E: 30, N: -15 }
      }
    ]
  },
  {
    id: "dilema_voc_007",
    categoria_contexto: "Justicia Social y Transparencia Pública",
    pregunta_dante: "Se busca erradicar la corrupción en la contratación pública de obras de infraestructura nacional. ¿Qué enfoque estratégico elegirías implementar?",
    opciones: [
      {
        id: "A",
        texto: "Implementar un sistema descentralizado Blockchain inmutable que registre y verifique cada transacción de dinero estatal en tiempo real.",
        vector_riasec: { C: 35, I: 15 },
        vector_ocean: { C: 30, O: 15 }
      },
      {
        id: "B",
        texto: "Lanzar una plataforma periodística de investigación participativa que conecte a líderes comunitarios con denuncias ciudadanas.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { E: 25, A: 25 }
      },
      {
        id: "C",
        texto: "Crear documentales inmersivos y campañas narrativas impactantes que expongan las consecuencias del desvío de fondos.",
        vector_riasec: { A: 35, S: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "D",
        texto: "Postularte a cargos de alta dirección pública para reformar las leyes y aplicar auditorías financieras estrictas sin concesiones.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 20 }
      }
    ]
  },
  {
    id: "dilema_voc_008",
    categoria_contexto: "Arquitectura Bioclimática y Ciudades Flotantes",
    pregunta_dante: "Ante el aumento del nivel del mar, se planea construir la primera metrópolis flotante del caribe. ¿Cuál sería tu contribución distintiva?",
    opciones: [
      {
        id: "A",
        texto: "Construir las plataformas modulares y los anclajes submarinos resistentes a huracanes de alta intensidad.",
        vector_riasec: { R: 35, I: 10 },
        vector_ocean: { C: 25, N: -15 }
      },
      {
        id: "B",
        texto: "Simular mediante dinámica de fluidos computacional el comportamiento hidrodinámico de la ciudad frente a maremotos.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Diseñar la identidad arquitectónica, las fachadas orgánicas e iluminación natural que integran la naturaleza con la vida urbana.",
        vector_riasec: { A: 35, R: 10 },
        vector_ocean: { O: 35, E: 10 }
      },
      {
        id: "D",
        texto: "Gestionar el presupuesto maestro de construcción, asegurando el cumplimiento de cronogramas y contratos de licenciamiento.",
        vector_riasec: { C: 35, E: 15 },
        vector_ocean: { C: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_009",
    categoria_contexto: "Vehículos Autónomos y Logística Global",
    pregunta_dante: "La industria de transporte de carga se está transformando totalmente mediante camiones eléctricos autónomos. ¿Qué área de liderazgo te resulta más atractiva?",
    opciones: [
      {
        id: "A",
        texto: "Programar los sensores LiDAR, radares y actuadores mecánicos para optimizar el frenado y la navegación en carretera.",
        vector_riasec: { R: 35, I: 15 },
        vector_ocean: { C: 25, O: 10 }
      },
      {
        id: "B",
        texto: "Estudiar modelos matemáticos de optimización de rutas continentales para reducir en 30% la huella de carbono de los fletes.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Desarrollar programas de reconversión laboral y capacitación técnica para conductores tradicionales hacia nuevos roles digitales.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Dirigir el consorcio de puertos y aduanas internacionales para acelerar el comercio entre continentes de forma eficiente.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_010",
    categoria_contexto: "Ciberseguridad y Operaciones de Defensa Digital",
    pregunta_dante: "Un grupo de hackers avanzados ha tomado el control de los servidores del banco central. Te convocan al equipo de respuesta de élite. ¿Cuál es tu táctica?",
    opciones: [
      {
        id: "A",
        texto: "Desmontar físicamente los enlaces comprometidos, analizar la memoria RAM del servidor y aislar la amena cibernética.",
        vector_riasec: { R: 30, C: 20 },
        vector_ocean: { C: 25, N: -20 }
      },
      {
        id: "B",
        texto: "Hacer ingeniería inversa al malintencionado virus informático para descifrar la clave criptográfica y recuperar el control de los datos.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Negociar con los actores de amenaza y coordinar la comunicación de crisis con agencias internacionales de inteligencia.",
        vector_riasec: { E: 35, S: 15 },
        vector_ocean: { E: 30, N: -15 }
      },
      {
        id: "D",
        texto: "Diseñar los nuevos protocolos normativos de seguridad que obligarán a todas las entidades bancarias a blindar sus sistemas.",
        vector_riasec: { C: 35, E: 10 },
        vector_ocean: { C: 30, A: 10 }
      }
    ]
  },
  {
    id: "dilema_voc_011",
    categoria_contexto: "Realidad Aumentada y Patrimonio Cultural",
    pregunta_dante: "Se va a reconstruir virtualmente la legendaria biblioteca de Alejandría utilizando tecnologías inmersivas de Realidad Mixta. ¿En qué aspecto te involucrarías?",
    opciones: [
      {
        id: "A",
        texto: "Investigar manuscritos antiguos y fuentes epigráficas para garantizar la precisión histórica y filológica del proyecto.",
        vector_riasec: { I: 35, A: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "B",
        texto: "Modelar en 3D la arquitectura, esculpir las texturas, la iluminación dinámica y las experiencias sensoriales virtuales.",
        vector_riasec: { A: 35, R: 10 },
        vector_ocean: { O: 35, E: 10 }
      },
      {
        id: "C",
        texto: "Desarrollar la plataforma educativa interactiva que permitirá a estudiantes vulnerables del mundo acceder gratis al conocimiento.",
        vector_riasec: { S: 35, I: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Estructurar los contratos de derechos de autor, alianzas con museos globales y el esquema de licenciamiento digital.",
        vector_riasec: { C: 35, E: 15 },
        vector_ocean: { C: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_012",
    categoria_contexto: "Salud Pública y Control Epidémico",
    pregunta_dante: "Ante la amenaza de un brote de un virus respiratorio emergente, el centro de control epidemiológico necesita un líder para una célula de respuesta rápida. ¿Qué célula eliges?",
    opciones: [
      {
        id: "A",
        texto: "Montar los laboratorios móviles de diagnóstico molecular de alta velocidad en zonas rurales de difícil acceso.",
        vector_riasec: { R: 35, S: 10 },
        vector_ocean: { C: 25, N: -15 }
      },
      {
        id: "B",
        texto: "Crear modelos epidemiológicos computacionales para predecir la tasa de contagio R0 y probar escenarios de contención.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Dirigir la estrategia comunitaria de comunicación de riesgos, combate a la desinformación y apoyo psico-emocional.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Gestionar la cadena de frío, distribución masiva de vacunas y aprovisionamiento logístico de la red de hospitales.",
        vector_riasec: { C: 35, R: 10 },
        vector_ocean: { C: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_013",
    categoria_contexto: "Fintech y Microfinanzas Populares",
    pregunta_dante: "Quieres impulsar el desarrollo económico de 50.000 pequeños comerciantes informales que no tienen acceso a bancos tradicionales. ¿Cuál es tu proyecto?",
    opciones: [
      {
        id: "A",
        texto: "Programar la arquitectura de la aplicación móvil de micro-pagos seguros con soporte para bajas velocidades de internet.",
        vector_riasec: { R: 30, I: 15 },
        vector_ocean: { C: 25, O: 10 }
      },
      {
        id: "B",
        texto: "Desarrollar un modelo econométrico no convencional para calcular el riesgo crediticio basado en hábitos de reputación local.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Impartir talleres presenciales de educación financiera, emprendimiento y ahorro comunitario en barrios populares.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Fundar la neofinanciera, levantar capital social de impacto y cerrar alianzas comerciales con grandes distribuidores.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 35, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_014",
    categoria_contexto: "Nanomateriales y Medicina de Precisión",
    pregunta_dante: "Se ha sintetizado una nano-capsula capaz de liberar fármacos únicamente dentro de células tumorales sin dañar el tejido sano. ¿En qué etapa prefieres trabajar?",
    opciones: [
      {
        id: "A",
        texto: "Operar los microscopios de fuerza atómica y reactores químicos para ensamblar con precisión la estructura física de la nano-cálpsula.",
        vector_riasec: { R: 35, I: 10 },
        vector_ocean: { C: 30, N: -10 }
      },
      {
        id: "B",
        texto: "Diseñar los experimentos in vitro e in vivo para comprender los mecanismos bioquímicos de absorción tumoral.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Acompañar a los pacientes en ensayos clínicos, asegurando el consentimiento informado y el trato digno en el proceso.",
        vector_riasec: { S: 35, I: 10 },
        vector_ocean: { A: 30, E: 10 }
      },
      {
        id: "D",
        texto: "Gestionar la patente biotecnológica internacional y liderar las negociaciones de licenciamiento con farmacéuticas.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_015",
    categoria_contexto: "Periodismo de Investigación y Fact-Checking",
    pregunta_dante: "Durante unas elecciones presidenciales, detectas una red coordinada de desinformación usando deepfakes y propaganda manipulada. ¿Cómo actúas?",
    opciones: [
      {
        id: "A",
        texto: "Utilizar herramientas forenses de procesamiento digital de imágenes para demostrar técnicamente la falsedad de los videos.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { C: 25, O: 20 }
      },
      {
        id: "B",
        texto: "Escribir reportajes narrativos profundos que develen las historias de las personas reales afectadas por la manipulación mediática.",
        vector_riasec: { A: 35, S: 15 },
        vector_ocean: { O: 35, A: 20 }
      },
      {
        id: "C",
        texto: "Organizar foros comunitarios y debates públicos para educar a los jóvenes votantes en lectura crítica de medios masivos.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Dirigir la redacción periodística, coordinar la verificación multiplataforma y asumir la vocería jurídica de la investigación.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, N: -15 }
      }
    ]
  },
  {
    id: "dilema_voc_016",
    categoria_contexto: "Energía de Fusión y Almacenamiento Cuántico",
    pregunta_dante: "Un reactor de fusión nuclear experimental está a punto de lograr la ignición con ganancia neta de energía. ¿Qué papel técnico asumirías?",
    opciones: [
      {
        id: "A",
        texto: "Supervisar los imanes superconductores y los sistemas de confinamiento magnético Tokamak en la planta física.",
        vector_riasec: { R: 35, I: 15 },
        vector_ocean: { C: 30, N: -15 }
      },
      {
        id: "B",
        texto: "Calcular las ecuaciones de física de plasma y plasmar modelos computacionales de colisión termonuclear.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Presentar el proyecto a inversores de energía limpia y liderar el despliegue comercial de la primera planta industrial.",
        vector_riasec: { E: 35, R: 10 },
        vector_ocean: { E: 30, O: 15 }
      },
      {
        id: "D",
        texto: "Establecer la estructura detallada de protocolos de seguridad ambiental, licenciamiento estatal y auditoría nuclear.",
        vector_riasec: { C: 35, I: 10 },
        vector_ocean: { C: 30, A: 10 }
      }
    ]
  },
  {
    id: "dilema_voc_017",
    categoria_contexto: "Educación Gamificada y Neuropedagogía",
    pregunta_dante: "Se busca transformar el aprendizaje de matemáticas avanzadas en escuelas rurales mediante un videojuego adaptativo. ¿Dónde aportarías tu visión?",
    opciones: [
      {
        id: "A",
        texto: "Diseñar las mecánicas de juego, el mundo fantástico, el arte de personajes y las guías emocionales de la aventura.",
        vector_riasec: { A: 35, E: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "B",
        texto: "Investigar los patrones cognitivos de aprendizaje en niños para estructurar la progresión de dificultad pedagógica.",
        vector_riasec: { I: 35, S: 15 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Trabajar mano a mano con los docentes rurales para capacitarlos e integrarlos como mentores en el uso de la herramienta.",
        vector_riasec: { S: 35, A: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Programar la lógica del motor de juego y asegurar que corra fluido en dispositivos de muy bajos recursos computacionales.",
        vector_riasec: { R: 30, C: 20 },
        vector_ocean: { C: 25, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_018",
    categoria_contexto: "Cine Digital y Narrativas Interactivas",
    pregunta_dante: "Te han asignado la dirección de una película interactiva transmedia donde el espectador decide el rumbo de la trama. ¿Qué prefieres asumir?",
    opciones: [
      {
        id: "A",
        texto: "Escribir el guión no lineal, desarrollar los diálogos complejos y definir los arcos dramáticos de los personajes.",
        vector_riasec: { A: 35, I: 10 },
        vector_ocean: { O: 35, A: 15 }
      },
      {
        id: "B",
        texto: "Dirigir a los actores en el set de rodaje y coordinar al equipo de cámaras e iluminación para capturar la visión artística.",
        vector_riasec: { E: 30, A: 20 },
        vector_ocean: { E: 30, O: 20 }
      },
      {
        id: "C",
        texto: "Programar la arquitectura de renderizado en tiempo real en motores como Unreal Engine y coordinar los VFX digitales.",
        vector_riasec: { R: 35, A: 10 },
        vector_ocean: { C: 25, O: 15 }
      },
      {
        id: "D",
        texto: "Supervisar el presupuesto de producción, la distribución en plataformas streaming y el plan financiero de retorno de inversión.",
        vector_riasec: { C: 35, E: 15 },
        vector_ocean: { C: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_019",
    categoria_contexto: "Conservación de Ecosistemas y Restauración Coralina",
    pregunta_dante: "El 50% de los arrecifes de coral de una reserva marina está sufriendo blanqueamiento irreversible. Se organiza una expedición de rescate. ¿Cuál es tu aporte?",
    opciones: [
      {
        id: "A",
        texto: "Bucear e instalar estructuras físicas de micro-fragmentación donde se fijan manualmente los nuevos corales resistentes.",
        vector_riasec: { R: 35, S: 10 },
        vector_ocean: { C: 25, N: -15 }
      },
      {
        id: "B",
        texto: "Estudiar la simiosis molecular entre el coral y sus micro-algas para descubrir cepas resistentes al estrés térmico.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Involucrar a los pescadores locales en modelos de ecoturismo sustentable que reemplacen la pesca destructiva por protección.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, E: 20 }
      },
      {
        id: "D",
        texto: "Lobbying legislativo para declarar el área como Santuario Marino protegido y gestionar la financiación de vigilancia naval.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_020",
    categoria_contexto: "Gestión de Crisis Hospitalaria y Telemedicina",
    pregunta_dante: "Un hospital universitario de alta complejidad necesita reorganizar sus servicios de emergencia para atender 3 veces más pacientes. ¿Qué liderazgo asumes?",
    opciones: [
      {
        id: "A",
        texto: "Optimizar el flujo físico de pacientes en triaje y automatizar el registro de historias clínicas electrónicas sin margen de error.",
        vector_riasec: { C: 35, R: 10 },
        vector_ocean: { C: 30, N: -15 }
      },
      {
        id: "B",
        texto: "Evaluar datos de diagnósticos previos para identificar patrones clínicos y reducir el tiempo de respuesta médica.",
        vector_riasec: { I: 35, S: 10 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Atender directamente las consultas médicas o apoyar el acompañamiento emocional de las familias en sala de espera.",
        vector_riasec: { S: 35, I: 10 },
        vector_ocean: { A: 35, E: 10 }
      },
      {
        id: "D",
        texto: "Dirigir las compras de insumos médicos críticos y liderar las negociaciones con proveedores de tecnología sanitaria.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_021",
    categoria_contexto: "Moda Sostenible y Biomateriales Textiles",
    pregunta_dante: "La industria textil tradicional es una de las más contaminantes del planeta. Se crea un laboratorio de biocouture sostenible. ¿Dónde te ubicas?",
    opciones: [
      {
        id: "A",
        texto: "Diseñar colecciones vanguardistas y conceptos visuales atractivos utilizando tejidos biológicos y tintes naturales.",
        vector_riasec: { A: 35, E: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "B",
        texto: "Investigar el cultivo de micelio de hongos y bacterias biodegradables para crear alternativas de cuero sin crueldad animal.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Configurar los telares industriales automáticos y la maquinaria de confección para procesar los nuevos biomateriales.",
        vector_riasec: { R: 35, C: 10 },
        vector_ocean: { C: 25, N: -10 }
      },
      {
        id: "D",
        texto: "Construir la estrategia de marca de lujo consciente y negociar la inclusión de la línea en las tiendas más importantes del mundo.",
        vector_riasec: { E: 35, A: 10 },
        vector_ocean: { E: 35, O: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_022",
    categoria_contexto: "Aviación Eléctrica y Movilidad Supersónica",
    pregunta_dante: "Se está probando el prototipo del primer avión comercial cero emisiones impulsado por hidrógeno líquido. ¿En qué área prefieres destacar?",
    opciones: [
      {
        id: "A",
        texto: "Supervisar la fabricación en fibra de carbono del fuselaje y el ensamblaje de la turbina hidroeléctrica de prueba.",
        vector_riasec: { R: 35, I: 10 },
        vector_ocean: { C: 30, N: -15 }
      },
      {
        id: "B",
        texto: "Desarrollar la aerodinámica computacional para minimizar el arrastre y aumentar el rendimiento energético en vuelo.",
        vector_riasec: { I: 35, R: 15 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Garantizar que los pilotos y personal de cabina dominen los protocolos de confort y seguridad pasiva para los pasajeros.",
        vector_riasec: { S: 30, E: 15 },
        vector_ocean: { A: 25, E: 20 }
      },
      {
        id: "D",
        texto: "Analizar los costos operacionales de ruta, estimar la rentabilidad del boleto y negociar la venta del avión a aerolíneas globales.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_023",
    categoria_contexto: "Psicología Organizacional y Equipos Globales",
    pregunta_dante: "Una empresa multinacional de software detecta una caída drástica en la motivación de sus 1.000 empleados remotos. ¿Cómo resuelves el problema?",
    opciones: [
      {
        id: "A",
        texto: "Diseñar dinámicas de integración humana, mentorías personalizadas y espacios de escucha empática para reconstruir la confianza.",
        vector_riasec: { S: 35, A: 10 },
        vector_ocean: { A: 35, E: 15 }
      },
      {
        id: "B",
        texto: "Analizar las métricas de carga laboral, encuestas de clima y datos de productividad para diagnosticar cuantitativamente el burnout.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Rediseñar la estructura de liderazgo, los incentivos de salario variable y los objetivos de carrera para incentivar el alto desempeño.",
        vector_riasec: { E: 35, S: 10 },
        vector_ocean: { E: 35, N: -10 }
      },
      {
        id: "D",
        texto: "Implementar herramientas de software colaborativo y estandarizar la documentación de procesos para reducir reuniones innecesarias.",
        vector_riasec: { C: 35, R: 10 },
        vector_ocean: { C: 30, A: 10 }
      }
    ]
  },
  {
    id: "dilema_voc_024",
    categoria_contexto: "Gastronomía Molecular y Alimentos de Origen Celular",
    pregunta_dante: "Se está creando la primera carne cultivada en bioreactores sin necesidad de sacrificio animal. ¿En qué frente de innovación aportarías?",
    opciones: [
      {
        id: "A",
        texto: "Investigar los medios de cultivo de células madre musculares y optimizar su diferenciación celular en el laboratorio.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "B",
        texto: "Diseñar los perfiles de sabor, textura, presentación culinaria y maridajes para chefs de restaurantes de alta cocina.",
        vector_riasec: { A: 35, E: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "C",
        texto: "Operar los bioreactores industriales de fermentación celular y controlar los parámetros físicos de temperatura y presión.",
        vector_riasec: { R: 35, C: 10 },
        vector_ocean: { C: 25, N: -10 }
      },
      {
        id: "D",
        texto: "Liderar la estrategia de posicionamiento en el mercado masivo, educando al consumidor para superar resistencias culturales.",
        vector_riasec: { E: 35, S: 10 },
        vector_ocean: { E: 30, A: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_025",
    categoria_contexto: "Marketing Ético y Comportamiento del Consumidor",
    pregunta_dante: "Una marca de tecnología sostenible quiere lanzar un teléfono modular donde cada pieza se reemplaza en lugar de comprar un equipo nuevo. ¿Tu rol?",
    opciones: [
      {
        id: "A",
        texto: "Idear la narrativa publicitaria, el concepto creativo de campaña y los contenidos visuales que inspiren orgullo ecológico.",
        vector_riasec: { A: 35, E: 15 },
        vector_ocean: { O: 35, E: 20 }
      },
      {
        id: "B",
        texto: "Analizar el comportamiento estadístico de compra de los usuarios para predecir qué módulos se desgastan primero.",
        vector_riasec: { I: 35, C: 15 },
        vector_ocean: { O: 25, C: 20 }
      },
      {
        id: "C",
        texto: "Diseñar el sistema de soporte postventa y atención al cliente para guiar paso a paso al usuario en el cambio de piezas.",
        vector_riasec: { S: 35, C: 10 },
        vector_ocean: { A: 30, E: 15 }
      },
      {
        id: "D",
        texto: "Dirigir el equipo de ventas global y asegurar las metas financieras de penetración de mercado frente a gigantes tecnológicos.",
        vector_riasec: { E: 35, C: 10 },
        vector_ocean: { E: 35, N: -15 }
      }
    ]
  },
  {
    id: "dilema_voc_026",
    categoria_contexto: "Robótica Asistencial y Cuidado de Adultos Mayores",
    pregunta_dante: "Se está desplegando una flota de robots acompañantes en residencias geriátricas. ¿Qué componente del robot te gustaría liderar?",
    opciones: [
      {
        id: "A",
        texto: "Ensamblar los servomotores de alta precisión, los brazos articulados y los chasis de aluminio liviano del robot.",
        vector_riasec: { R: 35, I: 10 },
        vector_ocean: { C: 30, N: -10 }
      },
      {
        id: "B",
        texto: "Programar la inteligencia de conversación empática y reconocimiento de emociones faciales para responder al estado de ánimo.",
        vector_riasec: { I: 35, A: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Capacitar a las familias y al personal de cuidado humano para integrar al robot como una ayuda y no como un reemplazo del afecto.",
        vector_riasec: { S: 35, E: 10 },
        vector_ocean: { A: 35, E: 10 }
      },
      {
        id: "D",
        texto: "Supervisar el cumplimiento de los estándares de protección de datos de salud y administrar el inventario de repuestos.",
        vector_riasec: { C: 35, E: 10 },
        vector_ocean: { C: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_027",
    categoria_contexto: "Privacidad Biométrica y Derechos Digitales",
    pregunta_dante: "Se propone implementar escaneo facial obligatorio para ingresar al transporte público. Se abre un debate nacional. ¿Cuál es tu postura actitudinal?",
    opciones: [
      {
        id: "A",
        texto: "Liderar la causa ciudadana por la libertad digital y redactar acciones constitucionales para proteger la privacidad personal.",
        vector_riasec: { S: 35, E: 15 },
        vector_ocean: { A: 30, O: 25 }
      },
      {
        id: "B",
        texto: "Investigar matemáticamente las tasas de falsos positivos en minorías étnicas para fundamentar técnicamente la objeción.",
        vector_riasec: { I: 35, S: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Diseñar intervenciones artísticas en espacio público y campañas de concientización con máscaras anti-reconocimiento.",
        vector_riasec: { A: 35, S: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "D",
        texto: "Redactar el estatuto normativo de gobierno de datos que defina sanciones millonarias a las empresas que filtren biométricos.",
        vector_riasec: { C: 35, E: 15 },
        vector_ocean: { C: 35, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_028",
    categoria_contexto: "Sonido Tridimensional y Acústica Inmersiva",
    pregunta_dante: "Se va a construir la sala de conciertos con la mejor acústica natural del mundo. ¿En qué fase de la creación participarías?",
    opciones: [
      {
        id: "A",
        texto: "Instalar los paneles de madera curva, reflectores físicos y difusores acústicos fabricados a medida en la sala.",
        vector_riasec: { R: 35, A: 10 },
        vector_ocean: { C: 25, N: -10 }
      },
      {
        id: "B",
        texto: "Calcular las ecuaciones de onda sonora y simular la reverberación espectral del recinto usando software especializado.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 20 }
      },
      {
        id: "C",
        texto: "Componer la pieza musical inaugural y dirigir a la orquesta sinfónica para aprovechar la riqueza tonal del recinto.",
        vector_riasec: { A: 35, S: 10 },
        vector_ocean: { O: 35, E: 15 }
      },
      {
        id: "D",
        texto: "Gestionar la cartelera internacional, la venta de abonos de temporada y las alianzas de patrocinio comercial de la sala.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  },
  {
    id: "dilema_voc_029",
    categoria_contexto: "Cadenas de Suministro Sostenibles e Infraestructura Global",
    pregunta_dante: "Una megacorporación requiere transformar su cadena de suministro para que sea 100% libre de deforestación. ¿Cuál es tu misión?",
    opciones: [
      {
        id: "A",
        texto: "Auditar de principio a fin los certificados de origen de cada materia prima y organizar las bases de datos de inventario.",
        vector_riasec: { C: 35, I: 10 },
        vector_ocean: { C: 35, N: -15 }
      },
      {
        id: "B",
        texto: "Utilizar imágenes satelitales y algoritmos de visión por computador para rastrear zonas de tala ilegal en tiempo real.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Desarrollar proyectos de pago por servicios ambientales directamente con comunidades indígenas protectoras del bosque.",
        vector_riasec: { S: 35, E: 10 },
        vector_ocean: { A: 35, E: 10 }
      },
      {
        id: "D",
        texto: "Negociar con los proveedores de materias primas la reestructuración de contratos bajo penalizaciones estrictas por incumplimiento.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, N: -10 }
      }
    ]
  },
  {
    id: "dilema_voc_030",
    categoria_contexto: "Infraestructura Hidráulica y Potabilización Avanzada",
    pregunta_dante: "Una sequía prolongada ha dejado sin agua potable a una provincia de 500.000 habitantes. ¿Cómo lideras la respuesta tecnológica?",
    opciones: [
      {
        id: "A",
        texto: "Operar las plantas desalinizadoras de osmosis inversa y reparar las tuberías maestras de distribución de agua.",
        vector_riasec: { R: 35, C: 10 },
        vector_ocean: { C: 30, N: -15 }
      },
      {
        id: "B",
        texto: "Investigar membranas de grafeno de nueva generación para reducir en 60% el consumo energético del proceso de desalinización.",
        vector_riasec: { I: 35, R: 10 },
        vector_ocean: { O: 30, C: 15 }
      },
      {
        id: "C",
        texto: "Organizar los comités comunitarios de racionamiento equitativo y distribuir suministros de agua a hospitales e infancia.",
        vector_riasec: { S: 35, E: 10 },
        vector_ocean: { A: 35, E: 15 }
      },
      {
        id: "D",
        texto: "Dirigir la empresa pública de acueducto y negociar créditos de emergencia con el Banco Interamericano de Desarrollo.",
        vector_riasec: { E: 35, C: 15 },
        vector_ocean: { E: 30, C: 15 }
      }
    ]
  }
];

/**
 * Devuelve los dilemas no respondidos previamente por el estudiante.
 * @param {Array<string>} respuestasPreviasIds - Arreglo de IDs de dilemas ya respondidos (ej. ["dilema_voc_001", "dilema_voc_002"])
 * @param {number} cantidad - Dilemas a retornar (por defecto 1 al cierre del bloque)
 * @returns {Array<Object>} Arreglo de dilemas pendientes
 */
export function obtenerDilemasPendientes(respuestasPreviasIds = [], cantidad = 1) {
  const idsRespondidos = new Set(Array.isArray(respuestasPreviasIds) ? respuestasPreviasIds : []);
  const pendientes = DILEMAS_VOCACIONALES.filter(d => !idsRespondidos.has(d.id));
  
  // Si ya respondió todos los dilemas, reiniciar ciclo sin bloquear la experiencia
  if (pendientes.length === 0) {
    return DILEMAS_VOCACIONALES.slice(0, cantidad);
  }

  return pendientes.slice(0, cantidad);
}

/**
 * Calcula el acumulado normalizado de los vectores RIASEC y OCEAN a partir del historial de dilemas respondidos.
 * @param {Array<Object>} historialRespuestasDilemas - Arreglo con formato [{ dilemaId: "dilema_voc_001", opcionSeleccionada: "A" }]
 * @returns {Object} { riasec: { R, I, A, S, E, C }, ocean: { O, C, E, A, N }, hollandCode: "IAS", totalRespondidos: number }
 */
export function calcularScoreVocacionalIncremental(historialRespuestasDilemas = []) {
  const acumuladoRiasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const acumuladoOcean = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  if (!Array.isArray(historialRespuestasDilemas) || historialRespuestasDilemas.length === 0) {
    return {
      riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
      ocean: { O: 50, C: 50, E: 50, A: 50, N: 50 },
      hollandCode: "IND",
      totalRespondidos: 0
    };
  }

  // Mapa rápido de dilemas para búsqueda eficiente
  const dilemasMap = new Map(DILEMAS_VOCACIONALES.map(d => [d.id, d]));
  let procesados = 0;

  for (const resp of historialRespuestasDilemas) {
    const dId = resp.dilemaId || resp.dilema_id || resp.id;
    const opId = (resp.opcionSeleccionada || resp.opcion_seleccionada || resp.opcion || '').toUpperCase();

    const dilema = dilemasMap.get(dId);
    if (!dilema) continue;

    const opcion = dilema.opciones.find(o => o.id === opId);
    if (!opcion) continue;

    procesados++;

    // Sumar RIASEC
    if (opcion.vector_riasec) {
      for (const [dim, val] of Object.entries(opcion.vector_riasec)) {
        if (acumuladoRiasec[dim] !== undefined) {
          acumuladoRiasec[dim] += (val || 0);
        }
      }
    }

    // Sumar OCEAN
    if (opcion.vector_ocean) {
      for (const [dim, val] of Object.entries(opcion.vector_ocean)) {
        if (acumuladoOcean[dim] !== undefined) {
          acumuladoOcean[dim] += (val || 0);
        }
      }
    }
  }

  if (procesados === 0) {
    return {
      riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
      ocean: { O: 50, C: 50, E: 50, A: 50, N: 50 },
      hollandCode: "IND",
      totalRespondidos: 0
    };
  }

  // Normalización a escala 0-100 para RIASEC
  const maxRawRiasec = Math.max(...Object.values(acumuladoRiasec), 1);
  const riasecNormalizado = {};
  for (const [dim, rawVal] of Object.entries(acumuladoRiasec)) {
    riasecNormalizado[dim] = Math.round((rawVal / maxRawRiasec) * 100);
  }

  // Obtener código Holland de las 3 letras dominantes
  const hollandCode = Object.entries(riasecNormalizado)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(pair => pair[0])
    .join('');

  // Normalización para OCEAN (base 50 con ajuste según intensidad de respuestas)
  const oceanNormalizado = {};
  for (const [dim, rawVal] of Object.entries(acumuladoOcean)) {
    // Cada dilema aporta aprox 20-30 puntos a ciertas dimensiones
    const avg = rawVal / procesados;
    // Escala donde 0 a 35 puntos promedio se mapean suavemente a 30-95 en OCEAN
    const score = Math.min(100, Math.max(10, Math.round(50 + (avg - 10) * 1.8)));
    oceanNormalizado[dim] = score;
  }

  return {
    riasec: riasecNormalizado,
    ocean: oceanNormalizado,
    hollandCode: hollandCode || "IND",
    totalRespondidos: procesados
  };
}

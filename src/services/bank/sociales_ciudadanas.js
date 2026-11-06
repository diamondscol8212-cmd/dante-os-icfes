// 🏛️ src/services/services/bank/sociales_ciudadanas.js - 50 Reactivos Calibrados ICFES Saber 11
import { generarReactivosSocialesMasivos } from './generatorSociales.js';

const generateSVG = (content) => 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">' + content + '</svg>';

const reactivosSeed = [
    { id: 'item_soc_01', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Un grupo de habitantes interpone una Acción de Tutela al considerar que un proyecto industrial vulnera su derecho fundamental a la salud y a la consulta previa comunitaria.\n\n¿Por qué la Constitución consagra la Tutela como un mecanismo preferente para este tipo de situaciones?",
        recurso_visual: null,
        opciones: [
            "A) Para garantizar la protección inmediata de los derechos fundamentales ante una amenaza o vulneración.",
            "B) Para sustituir los juicios ordinarios en todos los litigios de índole comercial y mercantil.",
            "C) Para otorgar facultades legislativas extraordinarias a la empresa encargada de la obra.",
            "D) Para obligar a los ciudadanos a renunciar a la vía judicial y acudir al arbitraje privado."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 }
    },
    // --------------------------------------------------------------------------------
    // RESPUESTAS A (12 Reactivos)
    // --------------------------------------------------------------------------------
    { id: '55555555-0000-4000-8000-000000000001', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Un ciudadano interpone una Acción de Tutela ante un juez argumentando que una entidad promotora de salud (EPS) se niega a autorizar un procedimiento quirúrgico de alta complejidad vital. Según la Constitución Política de Colombia de 1991, la actuación del juez se fundamenta prioritariamente en que:",
        recurso_visual: null,
        opciones: [
            "A) El derecho fundamental a la vida y a la salud prevalece sobre cualquier norma contable o administrativa de la EPS.",
            "B) Las EPS privadas tienen autonomía comercial absoluta regulada de manera exclusiva por el Código de Comercio.",
            "C) La tutela solo procede cuando se hayan agotado primero todas las demandas ante la jurisdicción contencioso-administrativa.",
            "D) Los recursos del sistema de salud deben reservarse únicamente para enfermedades menores previniendo sobrecostos."
        ],
        ok: "A", a: 1.65, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000002', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Un historiador analiza el periodo conocido como la 'Hegemonía Conservadora' en Colombia (1886-1930) y concluye que el modelo centralista de la Regeneración buscaba la unificación ideológica del país. ¿Cuál de las siguientes evidencias documentales respalda de forma directa esta afirmación?",
        recurso_visual: null,
        opciones: [
            "A) La firma del Concordato de 1887 que otorgó a la Iglesia católica el control sobre la educación pública y los registros civiles.",
            "B) La promulgación de la libertad absoluta de cultos y el establecimiento del matrimonio civil obligatorio en 1886.",
            "C) La disolución del ejército nacional para dar paso a milicias regionales independientes financiadas por campesinos.",
            "D) El traspaso inmediato de las rentas aduaneras directamente a los municipios más alejados del país."
        ],
        ok: "A", a: 1.50, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000003', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un candidato a la alcaldía propone prohibir las manifestaciones públicas en las vías principales del municipio argumentando que 'el derecho a la libre circulación de la mayoría está por encima de las protestas de minorías ruidosas'. Desde el marco Constitucional colombiano, este argumento presenta una falacia ideológica porque:",
        recurso_visual: null,
        opciones: [
            "A) El derecho a la protesta social es un derecho fundamental que garantiza la democracia y no puede cancelarse de manera arbitraria.",
            "B) La libre circulación de vehículos comerciales es el único derecho absoluto garantizado explícitamente en el preámbulo.",
            "C) Los alcaldes carecen de la facultad para regular cualquier aspecto de la convivencia ciudadana en su jurisdicción.",
            "D) Las minorías sociales no poseen derechos constitucionales reconocidos en el ordenamiento colombiano."
        ],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000004', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Durante el siglo XX, la doctrina de la Seguridad Nacional fue implementada en varios países de América Latina en el marco de la Guerra Fría. Esta doctrina se caracterizó principalmente por:",
        recurso_visual: null,
        opciones: [
            "A) Considerar la oposición política interna y los movimientos sociales como enemigos subversivos del Estado.",
            "B) Promover la disolución de las fuerzas armadas para sustituirlas por organismos multilaterales de paz.",
            "C) Financiar movimientos de izquierda agraria mediante subsidios gubernamentales directos sin condición alguna.",
            "D) Garantizar el voto libre y directo de las comunidades indígenas en decisiones extractivas trasnacionales."
        ],
        ok: "A", a: 1.40, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000005', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Observe el siguiente diagrama sobre la estructura de la Rama Ejecutiva del Poder Público en Colombia a nivel nacional:",
        recurso_visual: generateSVG('<rect x="120" y="20" width="160" height="35" rx="5" fill="%23eef2f7" stroke="%2338bdf8" stroke-width="2"/><text x="200" y="42" fill="%23111111" font-size="11" text-anchor="middle" font-weight="bold">Presidencia de la República</text><line x1="200" y1="55" x2="200" y2="80" stroke="%2338bdf8" stroke-width="2"/><rect x="40" y="80" width="130" height="35" rx="5" fill="%23eef2f7" stroke="%2334d399" stroke-width="1.5"/><text x="105" y="102" fill="%23111111" font-size="10" text-anchor="middle">Ministerios de Despacho</text><rect x="230" y="80" width="130" height="35" rx="5" fill="%23eef2f7" stroke="%2334d399" stroke-width="1.5"/><text x="295" y="102" fill="%23111111" font-size="10" text-anchor="middle">Deptos. Administrativos</text><line x1="105" y1="115" x2="105" y2="140" stroke="%2334d399" stroke-width="1.5"/><rect x="30" y="140" width="150" height="35" rx="5" fill="%23f8fafc" stroke="%23f59e0b" stroke-width="1.5"/><text x="105" y="162" fill="%23f59e0b" font-size="10" text-anchor="middle">Superintendencias y S.P.</text>'),
        opciones: [
            "A) La Presidencia encabeza la rama ejecutiva centralizada y de ella se adscriben ministerios y departamentos administrativos.",
            "B) Las superintendencias ejercen el control fiscal exclusivo sobre los jueces de la rama judicial.",
            "C) Los ministerios son órganos independientes constituidos por elección popular directa en circunscripción nacional.",
            "D) Los departamentos administrativos tienen la función de dictar las leyes y reformas a la Constitución."
        ],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000006', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Ante la construcción de una represa hidroeléctrica, los campesinos locales manifiestan que el proyecto destruirá sus cultivos y modos de vida. Por su parte, la empresa privada señala que la represa abastecerá de energía limpia al 20% del país. ¿Qué principio constitucional permite resolver equitativamente este conflicto de intereses?",
        recurso_visual: null,
        opciones: [
            "A) La realización de una consulta previa y concertación con indemnización y remediación para las comunidades afectadas.",
            "B) El desalojo inmediato de los campesinos por tratarse de un bien privado con rentabilidad corporativa asegurada.",
            "C) La suspensión indefinida de todo proyecto de desarrollo energético en el territorio nacional.",
            "D) La imposición de penas privativas de la libertad a los voceros comunitarios que se opongan al proyecto."
        ],
        ok: "A", a: 1.55, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000007', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El Frente Nacional (1958-1974) fue un pacto político firmado entre los partidos Liberal y Conservador en Colombia. Una de las causas históricas fundamentales que motivó la creación de este acuerdo fue:",
        recurso_visual: null,
        opciones: [
            "A) Detener el periodo cruento de 'La Violencia' bipartidista y derrocar la dictadura militar del general Gustavo Rojas Pinilla.",
            "B) Permitir el ingreso formal de partidos de izquierda e indígenas al Congreso de la República.",
            "C) Promover la privatización masiva de las empresas de telecomunicaciones y energía en el país.",
            "D) Abolir el Congreso y concentrar el poder en una Junta Patriótica compuesta únicamente por líderes religiosos."
        ],
        ok: "A", a: 1.60, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000008', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Un informe del Departamento Administrativo Nacional de Estadística (DANE) revela que la tasa de informalidad laboral en ciudades intermedias supera el 60%. ¿Cuál es una consecuencia económica directa de esta problemática en las finanzas públicas?",
        recurso_visual: null,
        opciones: [
            "A) Una reducción sustancial en la recaudación de impuestos directos e aportes al sistema de seguridad social.",
            "B) Un incremento inmediato en las reservas internacionales operadas por el Banco de la República.",
            "C) El aumento automático de los salarios mínimos legales ajustados por inflación en el sector bancario.",
            "D) La eliminación inmediata de la deuda externa mediante la venta de divisas de los trabajadores informales."
        ],
        ok: "A", a: 1.45, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000009', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "En un debate parlamentario sobre la reforma al régimen pensional, un senador afirma: 'Los jóvenes de hoy no quieren trabajar duro y por eso se quejan de la edad de jubilación'. La falacia en la afirmación del senador consiste en:",
        recurso_visual: null,
        opciones: [
            "A) Generalizar de forma ad hominem y descalificar a una población sin analizar los factores demográficos ni laborales reales.",
            "B) Utilizar un razonamiento deductivo matemáticamente irrefutable basado en proyecciones actuariales.",
            "C) Apelar exclusivamente a las normas de derecho internacional humanitario suscritas por Colombia.",
            "D) Citar estudios empíricos validados por organismos económicos internacionales multilaterales."
        ],
        ok: "A", a: 1.50, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000010', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El concepto de 'Estado Social de Derecho', consagrado en el Artículo 1 de la Constitución colombiana de 1991, implica fundamentalmente que:",
        recurso_visual: null,
        opciones: [
            "A) El Estado no solo debe velar por el cumplimiento de las leyes, sino garantizar condiciones de vida digna y equidad social.",
            "B) El gobierno asume la propiedad exclusiva de todos los medios de producción y prohíbe la propiedad privada.",
            "C) Las leyes son dictadas de manera irrevocable por los gremios económicos sin consulta a la ciudadanía.",
            "D) La fuerza pública puede actuar al margen de los tratados internacionales para mantener la seguridad urbana."
        ],
        ok: "A", a: 1.65, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000011', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Considere la siguiente gráfica simplificada sobre los resultados de participación en un plebiscito ciudadano:",
        recurso_visual: generateSVG('<text x="200" y="20" text-anchor="middle" fill="%23111111" font-size="12" font-weight="700">Participación en plebiscito</text><line x1="40" y1="36" x2="40" y2="168" stroke="%23666666"/><line x1="40" y1="168" x2="360" y2="168" stroke="%23666666"/><rect x="70" y="48" width="60" height="120" fill="%23ef4444"/><text x="100" y="42" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">50.2%</text><text x="100" y="188" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">NO</text><rect x="160" y="53" width="60" height="115" fill="%2310b981"/><text x="190" y="47" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">49.8%</text><text x="190" y="188" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">SÍ</text><rect x="250" y="28" width="60" height="140" fill="%2364748b"/><text x="280" y="22" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">62%</text><text x="280" y="188" text-anchor="middle" fill="%23111111" font-size="11" font-weight="700">Abstención</text>'),
        opciones: [
            "A) La alta abstención indica que una mayoría considerable de la población con derecho a voto no acudió a las urnas.",
            "B) La opción SÍ ganó de forma abrumadora al sumar el porcentaje de participación activa con la abstención.",
            "C) La votación demuestra un consenso unánime y sin polarización entre los sufragantes inscritos.",
            "D) El abstencionismo carece de significación estadística para evaluar la legitimidad política de la jornada."
        ],
        ok: "A", a: 1.40, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000012', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un líder comunal reclama el asfaltado de la vía principal de su barrio pero la alcaldía niega los recursos argumentando déficit presupuestal. Semanas después, la alcaldía aprueba un contrato millonario para la construcción de una fuente decorativa en la plaza central. La contradicción analítica en la gestión pública radica en que:",
        recurso_visual: null,
        opciones: [
            "A) Se priorizó el gasto estético u ornamental sobre las necesidades de movilidad y bienestar básico de la comunidad.",
            "B) El presupuesto municipal es ilimitado y la alcaldía tenía la obligación legal de realizar ambas obras.",
            "C) Las vías barriales deben ser pavimentadas únicamente con aportes voluntarios de los vecinos del sector.",
            "D) La construcción de la fuente decorativa genera ingresos tributarios inmediatos superiores al gasto de inversión."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // --------------------------------------------------------------------------------
    // RESPUESTAS B (13 Reactivos)
    // --------------------------------------------------------------------------------
    { id: '55555555-0000-4000-8000-000000000013', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La Constitución de 1991 introdujo la figura de la Acción Popular. ¿Cuál es la finalidad principal de este mecanismo constitucional?",
        recurso_visual: null,
        opciones: [
            "A) Garantizar la indemnización económica individual a víctimas de delitos comunes.",
            "B) Proteger los derechos e intereses colectivos como el medio ambiente sano y la moralidad administrativa.",
            "C) Destituir directamente al Presidente de la República sin juicio político previo en el Congreso.",
            "D) Solicitar la revisión de penas privativas de la libertad recaídas sobre líderes sindicales."
        ],
        ok: "B", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000014', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "A mediados del siglo XIX en Colombia, las reformas liberales de 1850 impulsaron la abolición de la esclavitud y la eliminación del estanco del tabaco. ¿Qué impacto económico inmediato produjeron estas medidas?",
        recurso_visual: null,
        opciones: [
            "A) La consolidación inmediata del proteccionismo económico y la prohibición de las importaciones europeas.",
            "B) El fomento del libre comercio internacional y la inserción de Colombia en el mercado agroexportador mundial.",
            "C) La estatización de todas las haciendas cafeteras y ganaderas de la región andina.",
            "D) El fortalecimiento del monopolio fiscal de la corona española sobre la exportación del oro."
        ],
        ok: "B", a: 1.55, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000015', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un grupo de ciudadanos interpone un recurso contra una ley dictada por el Congreso por considerar que vulnera el principio de igualdad entre hombres y mujeres. ¿Qué organismo del Estado colombiano es el encargado de fallar sobre la constitucionalidad de dicha ley?",
        recurso_visual: null,
        opciones: [
            "A) La Procuraduría General de la Nación.",
            "B) La Corte Constitucional.",
            "C) El Consejo Superior de la Judicatura.",
            "D) La Contraloría General de la República."
        ],
        ok: "B", a: 1.75, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000016', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Durante el siglo XIX, las guerras civiles entre liberales y conservadores en Colombia se desencadenaron principalmente por disputas sobre:",
        recurso_visual: null,
        opciones: [
            "A) La adopción del modelo parlamentario monárquico frente al modelo republicano francés.",
            "B) La ordenación territorial entre centralismo o federalismo y el papel de la Iglesia en la sociedad.",
            "C) La anexión territorial a los Estados Unidos o la integración a la Gran Colombia.",
            "D) La nacionalización de la industria automotriz y la regulación del transporte férreo."
        ],
        ok: "B", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000017', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Examine el siguiente esquema sobre las funciones de los Órganos de Control en Colombia:",
        recurso_visual: generateSVG('<rect x="30" y="40" width="160" height="120" rx="5" fill="%23eef2f7" stroke="%230289c7" stroke-width="2"/><text x="110" y="70" fill="%230289c7" font-size="12" text-anchor="middle" font-weight="bold">PROCURADURÍA</text><text x="110" y="100" fill="%23111111" font-size="10" text-anchor="middle">Sanción disciplinaria a</text><text x="110" y="118" fill="%23111111" font-size="10" text-anchor="middle">servidores públicos</text><rect x="210" y="40" width="160" height="120" rx="5" fill="%23fff7ed" stroke="%23b45309" stroke-width="2"/><text x="290" y="70" fill="%23b45309" font-size="12" text-anchor="middle" font-weight="bold">CONTRALORÍA</text><text x="290" y="100" fill="%23111111" font-size="10" text-anchor="middle">Vigilancia de los recursos</text><text x="290" y="118" fill="%23111111" font-size="10" text-anchor="middle">y del tesoro público</text>'),
        opciones: [
            "A) La Procuraduría juzga penalmente a los ciudadanos civiles en juicios ordinarios de policía.",
            "B) La Contraloría vigila el uso correcto del dinero público mientras la Procuraduría investiga faltas disciplinarias.",
            "C) Ambos órganos pertenecen a la Rama Legislativa y aprueban el presupuesto general de la nación.",
            "D) La Contraloría puede dictar condenas de cárcel sin intervención de un juez de la república."
        ],
        ok: "B", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000018', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Una comunidad indígena rechaza la fumigación aérea con glifosato en sus resguardos apelando al principio de soberanía territorial y preservación ambiental. Las autoridades de seguridad señalan que la medida es indispensable para erradicar los cultivos ilícitos. Para conciliar ambos enfoques dentro del marco Constitucional, se requiere:",
        recurso_visual: null,
        opciones: [
            "A) La intervención militar inmediata en los resguardos omitiendo la consulta previa.",
            "B) Un proceso de consulta previa libre e informada con erradicación manual concertada y sustitución voluntaria.",
            "C) La cesión definitiva de los territorios indígenas a empresas multinacionales de agroquímicos.",
            "D) La suspensión total del Código Penal en los municipios con presencia de resguardos."
        ],
        ok: "B", a: 1.65, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000019', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El fenómeno del 'Bogotazo', desencadenado tras el asesinato del líder popular Jorge Eliécer Gaitán el 9 de abril de 1948, provocó en Colombia:",
        recurso_visual: null,
        opciones: [
            "A) La pacificación inmediata del país y el inicio de la estabilidad democrática del siglo XX.",
            "B) El recrudecimiento violento del enfrentamiento bipartidista urbano y rural en todo el territorio nacional.",
            "C) La disolución de la Policía Nacional y la creación inmediata de la Guardia Indígena.",
            "D) La firma inmediata del Tratado de Paz con las guerrillas liberales del Llano bajo mediación de la ONU."
        ],
        ok: "B", a: 1.50, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000020', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Un estudio sobre desplazamiento forzado en Colombia demuestra que las regiones con mayor despojo de tierras coinciden geográficamente con zonas de expansión de monocultivos agroindustriales y minería ilegal. ¿Qué conclusión analítica se deriva directamente de esta correlación?",
        recurso_visual: null,
        opciones: [
            "A) El desplazamiento forzado ocurre exclusivamente por fenómenos climáticos extremos ajenos a actores armados.",
            "B) La violencia y el despojo han sido utilizados como mecanismos coercitivos para la apropiación ilícita de tierras productivas.",
            "C) Las víctimas de desplazamiento abandonaron sus fincas voluntariamente para emplearse en las grandes ciudades.",
            "D) La expansión agroindustrial prohíbe por definición la presencia de grupos armados al margen de la ley."
        ],
        ok: "B", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000021', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "En un colegio público, un profesor exige a sus estudiantes rezar una oración confesional específica al iniciar la clase diaria. Un estudiante manifiesta que no profesa esa religión y solicita ser eximido. El profesor responde que 'en esta aula se respeta la tradición mayoritaria del país'. ¿Es adecuada la postura del profesor?",
        recurso_visual: null,
        opciones: [
            "A) Sí, porque la libertad de cátedra autoriza al docente a imponer prácticas religiosas particulares en el aula.",
            "B) No, porque Colombia es un Estado laico que garantiza la libertad de cultos y prohíbe la imposición de dogmas religiosos en instituciones públicas.",
            "C) Sí, porque las decisiones educativas se toman strictly por mayoría simple de sufragios estudiantiles.",
            "D) No, porque las oraciones religiosas solo pueden realizarse durante las horas de recreo fuera de las aulas."
        ],
        ok: "B", a: 1.70, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000022', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El mecanismo democrático mediante el cual el Presidente de la República, con la firma de todos los ministros, consulta al pueblo sobre una decisión de trascendencia nacional se denomina:",
        recurso_visual: null,
        opciones: [
            "A) Cabildo Abierto.",
            "B) Plebiscito.",
            "C) Referendo Derogatorio.",
            "D) Revocatoria del Mandato."
        ],
        ok: "B", a: 1.55, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000023', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Durante la crisis económica mundial de 1929 (la Gran Depresión), el precio del café colombiano en los mercados internacionales sufrió una caída estrepitosa. ¿Qué estrategia económica impulsó el gobierno colombiano para amortiguar este impacto?",
        recurso_visual: null,
        opciones: [
            "A) La privatización total de las vías férreas y la sustitución del peso por el dólar estadounidense.",
            "B) El modelo de Industrialización por Sustitución de Importaciones (ISI) para producir internamente bienes manufacturados.",
            "C) La prohibición de la exportación de café y el fomento exclusivo de la minería de esmeraldas.",
            "D) La solicitud de condonación de deuda ante el Fondo Monetario Internacional que operaba desde el siglo XIX."
        ],
        ok: "B", a: 1.45, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000024', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un proyecto ley busca gravar con impuesto al valor agregado (IVA) los alimentos básicos de la canasta familiar. Los defensores afirman que 'incrementará los ingresos del Estado para infraestructura'. Los críticos señalan que 'afectará desproporcionadamente a los hogares de menores ingresos'. Desde la justicia tributaria, el argumento de los críticos se basa en que el IVA es un impuesto:",
        recurso_visual: null,
        opciones: [
            "A) Progresivo, que cobra un mayor porcentaje a quien tiene más ingresos económicos.",
            "B) Regresivo, pues absorbe una proporción mayor del ingreso en las familias de bajos recursos.",
            "C) Directo, que grava la riqueza y el patrimonio personal acumulado.",
            "D) Opcional, que solo pagan los ciudadanos que acuden voluntariamente a los comercios."
        ],
        ok: "B", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000025', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El proceso de separación de Panamá de Colombia en 1903 estuvo profundamente condicionado por intereses geopolíticos internacionales, principalmente relacionados con:",
        recurso_visual: null,
        opciones: [
            "A) La negativa británica a comerciar carbón con el puerto de Cartagena.",
            "B) El interés estratégico de Estados Unidos en controlar la construcción y operación del canal interoceánico.",
            "C) La invasión armada de tropas francesas respaldadas por la Santa Sede en el istmo.",
            "D) La alianza militar suscrita entre los líderes panameños y el imperio austrohúngaro."
        ],
        ok: "B", a: 1.50, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // --------------------------------------------------------------------------------
    // RESPUESTAS C (12 Reactivos)
    // --------------------------------------------------------------------------------
    { id: '55555555-0000-4000-8000-000000000026', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Un ciudadano descubre que sus datos personales de crédito figuran en una base de datos pública de morosos a pesar de haber saldado su deuda hace tres años. ¿Qué mecanismo constitucional específico le permite solicitar la actualización y rectificación inmediata de sus datos?",
        recurso_visual: null,
        opciones: [
            "A) La Acción de Tutela por violación del libre desarrollo de la personalidad.",
            "B) El Recurso de Reposición en vía gubernativa ante la Superintendencia de Industria y Comercio.",
            "C) La Acción de Hábeas Data consagrada en el Artículo 15 de la Constitución Política.",
            "D) El procedimiento ordinario penal por estafa procesal e injuria indirecta."
        ],
        ok: "C", a: 1.70, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000027', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "A partir de la promulgación de la Constitución Política de 1991, Colombia se definió como una república participativa y pluralista. ¿Cuál de los siguientes cambios institucionales refleja este carácter pluralista?",
        recurso_visual: null,
        opciones: [
            "A) El restablecimiento de la educación religiosa obligatoria en colegios oficiales.",
            "B) La concentración exclusiva de la representación senatorial en dos partidos tradicionales.",
            "C) El reconocimiento formal de la diversidad étnica y cultural de la nación y la asignación de curules especiales para comunidades minoritarias.",
            "D) La prohibición explícita de sindicatos y organizaciones de trabajadores independientes."
        ],
        ok: "C", a: 1.60, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000028', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un sector industrial argumenta que 'flexibilizar las leyes ambientales aumentará la inversión extranjera y creará miles de empleos'. Por su parte, organizaciones ecologistas señalan que 'dicha medida destruirá los ecosistemas estratégicos y perjudicará la salud comunitaria a largo plazo'. Este debate evidencia una tensión entre:",
        recurso_visual: null,
        opciones: [
            "A) La soberanía alimentaria y la autonomía militar territorial.",
            "B) El centralismo político administrativo y el federalismo fiscal regional.",
            "C) El crecimiento económico a corto plazo y la sostenibilidad ambiental intergeneracional.",
            "D) El proteccionismo aduanero y la libertad de cultos en zonas urbanas."
        ],
        ok: "C", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000029', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En el contexto de la historia colombiana del siglo XX, la Masacre de las Bananeras (1928) en Ciénaga, Magdalena, representó:",
        recurso_visual: null,
        opciones: [
            "A) Una rebelión armada impulsada por la corona española para recuperar sus antiguas colonias.",
            "B) La primera huelga estudiantil de carácter nacional que derrocó al régimen conservador de Miguel Abadía Méndez.",
            "C) La represión sangrienta por parte del Estado contra trabajadores de la United Fruit Company que exigían derechos laborales básicos.",
            "D) El acuerdo pacífico de negociación colectiva mediado por la Organización Internacional del Trabajo."
        ],
        ok: "C", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000030', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Examine la siguiente tabla informativa sobre la composición de la fuerza laboral en dos sectores de la economía colombiana:",
        recurso_visual: generateSVG('<text x="200" y="25" fill="%23111111" font-size="11" text-anchor="middle" font-weight="bold">Distribución Laboral por Sector</text><rect x="30" y="40" width="340" height="130" fill="%23f8fafc" stroke="%2394a3b8" stroke-width="1"/><line x1="30" y1="75" x2="370" y2="75" stroke="%23cbd5e1" stroke-width="1"/><line x1="180" y1="40" x2="180" y2="170" stroke="%23cbd5e1" stroke-width="1"/><text x="100" y="60" fill="%230289c7" font-size="10" text-anchor="middle" font-weight="700">Sector Agrario</text><text x="275" y="60" fill="%230289c7" font-size="10" text-anchor="middle" font-weight="700">Sector Servicios Urbanos</text><text x="100" y="100" fill="%23111111" font-size="9" text-anchor="middle">Alta informalidad (72%)</text><text x="275" y="100" fill="%23111111" font-size="9" text-anchor="middle">Informalidad moderada (45%)</text><text x="100" y="135" fill="%23111111" font-size="9" text-anchor="middle">Baja cobertura pensional (18%)</text><text x="275" y="135" fill="%23111111" font-size="9" text-anchor="middle">Cobertura pensional media (52%)</text>'),
        opciones: [
            "A) La informalidad laboral en el sector servicios es superior a la registrada en el sector agrario.",
            "B) El sector agrario cuenta con una protección social casi absoluta para la totalidad de sus trabajadores.",
            "C) La vulnerabilidad social y desprotección pensional afecta con mayor gravedad al campesinado del sector agrario.",
            "D) La informalidad en el sector de servicios urbanos ha alcanzado el 100% de la fuerza laboral disponible."
        ],
        ok: "C", a: 1.40, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000031', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un gobernador decreta el estado de emergencia económica en su departamento y suspende unilateralmente las sesiones de la Asamblea Departamental. Esta medida resulta inconstitucional porque:",
        recurso_visual: null,
        opciones: [
            "A) Los gobernadores tienen prohibido gestionar recursos económicos en periodos de crisis regionales.",
            "B) Solo el Congreso de la República puede declarar estados de excepción fiscal en los departamentos.",
            "C) La facultad de declarar Estados de Excepción es exclusiva del Presidente de la República y no permite disolver órganos de representación democrática.",
            "D) Las asambleas departamentales pertenecen a la rama judicial del poder público y gozan de fuero penal."
        ],
        ok: "C", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000032', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La llamada 'Guerra de los Mil Días' (1899-1902) culminó formalmente con la firma del Tratado del Neerlandia y del Wisconsin. Una de las consecuencias estructurales de esta conflagración civil fue:",
        recurso_visual: null,
        opciones: [
            "A) La victoria contundente del ejército federalista liberal sobre el conservadurismo centralista.",
            "B) El inicio inmediato de la industrialización metalúrgica intensiva en las costas colombianas.",
            "C) La devastación económica y demográfica del país, debilitando al Estado frente a la posterior pérdida de Panamá.",
            "D) La anexión inmediata de los territorios fronterizos de la cuenca amazónica a la República del Perú."
        ],
        ok: "C", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000033', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Un informe de la Organización de las Naciones Unidas (ONU) resalta que Colombia es uno de los países más vulnerables del planeta al cambio climático debido a su condición megadiversa y relieve andino. ¿Qué área geográfica presenta mayor riesgo de desertificación y desabastecimiento hídrico severo?",
        recurso_visual: null,
        opciones: [
            "A) El departamento del Chocó y la serranía del Baudó.",
            "B) El piedemonte llanero del departamento del Meta.",
            "C) La península de La Guajira y la cuenca alta del río Magdalena.",
            "D) El trapecio amazónico en límites con Brasil."
        ],
        ok: "C", a: 1.45, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000034', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Una empresa multinacional de telefonía ofrece acceso 'gratuito e ilimitado' a ciertas redes sociales, pero cobra tarifas elevadas por navegar en portales educativos o sitios de prensa independientes. ¿Por qué esta práctica vulnera el principio de Neutralidad de la Red?",
        recurso_visual: null,
        opciones: [
            "A) Porque obliga a los usuarios a contratar líneas telefónicas fijas en sus domicilios.",
            "B) Porque incrementa la velocidad de descarga general de todos los sitios web por igual.",
            "C) Porque discrimina el tráfico de datos y distorsiona el acceso libre y equitativo a la información en internet.",
            "D) Porque impide el cobro de impuestos de importación sobre dispositivos móviles inteligentes."
        ],
        ok: "C", a: 1.55, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000035', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El mecanismo de control político que permite al Congreso de la República separar de su cargo a un Ministro del Despacho mediante votación de la mayoría absoluta se denomina:",
        recurso_visual: null,
        opciones: [
            "A) Juicio de Indictment Constitucional.",
            "B) Interpelación Administrativa de Despacho.",
            "C) Moción de Censura.",
            "D) Revocatoria Judicial Directa."
        ],
        ok: "C", a: 1.65, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000036', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Durante la Guerra Fría, la creación de la Organización del Tratado del Atlántico Norte (OTAN) en 1949 por el bloque occidental provocó como respuesta político-militar por parte de la Unión Soviética y sus aliados la firma de:",
        recurso_visual: null,
        opciones: [
            "A) Los Acuerdos de Bretton Woods.",
            "B) El Plan Marshall para la reconstrucción europea.",
            "C) El Pacto de Varsovia.",
            "D) El Tratado de Versalles."
        ],
        ok: "C", a: 1.50, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000037', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un país aprueba la repatriación masiva de migrantes irregulares sin verificar previamente si sus vidas corren peligro en sus países de origen. ¿Qué principio de Derecho Internacional de los Derechos Humanos se está vulnerando manifiestamente?",
        recurso_visual: null,
        opciones: [
            "A) El principio de reciprocidad consular de divisas.",
            "B) El principio de inmunidad diplomática plena.",
            "C) El principio de no devolución (non-refoulement).",
            "D) El principio de autodeterminación económica aduanera."
        ],
        ok: "C", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // --------------------------------------------------------------------------------
    // RESPUESTAS D (13 Reactivos)
    // --------------------------------------------------------------------------------
    { id: '55555555-0000-4000-8000-000000000038', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La figura jurídica que faculta a un ciudadano detenido arbitrariamente para solicitar ante cualquier juez la verificación de la legalidad de su aprehensión dentro de las 36 horas siguientes se conoce como:",
        recurso_visual: null,
        opciones: [
            "A) Acción de Tutela Preventiva.",
            "B) Acción de Inconstitucionalidad.",
            "C) Habeas Data.",
            "D) Habeas Corpus."
        ],
        ok: "D", a: 1.75, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000039', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Durante la segunda mitad del siglo XX, la expansión del narcotráfico en Colombia alteró profundamente el sistema socioeconómico y político. ¿Cuál fue uno de sus efectos institucionales más nocivos?",
        recurso_visual: null,
        opciones: [
            "A) El fortalecimiento de las industrias textiles de exportación tradicional.",
            "B) La erradicación total del desempleo informal en las áreas metropolitanas.",
            "C) La consolidación del modelo centralista de la Regeneración de 1886.",
            "D) La penetración de dineros ilícitos en campañas políticas y la corrupción de organismos de juzgamiento."
        ],
        ok: "D", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000040', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un editorial periodístico sostiene: 'Las políticas de subsidios a Familias en Acción vuelven perezosos a los ciudadanos y destruyen la economía'. Esta postura desconoce que los programas de transferencias condicionadas buscan principalmente:",
        recurso_visual: null,
        opciones: [
            "A) Reemplazar definitivamente el mercado laboral y la contratación privada formal.",
            "B) Obligar a los beneficiarios a afiliarse a un determinado partido político en elecciones.",
            "C) Financiar viajes de turismo internacional para comunidades vulnerables.",
            "D) Romper trampas de pobreza extrema garantizando nutrición y escolaridad mínima en la niñez."
        ],
        ok: "D", a: 1.55, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000041', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El movimiento estudiantil de la 'Séptima Papeleta' en 1990 constituyó un hito histórico fundamental en Colombia porque impulsó directamente:",
        recurso_visual: null,
        opciones: [
            "A) La aprobación del Tratado de Libre Comercio con la Unión Europea.",
            "B) La reelección presidencial inmediata para el periodo de 1990 a 1998.",
            "C) La disolución de las Fuerzas Militares y la privatización de Ecopetrol.",
            "D) La convocatoria a una Asamblea Nacional Constituyente que promulgated la Constitución de 1991."
        ],
        ok: "D", a: 1.70, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000042', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Examine la siguiente gráfica conceptual sobre la evolución de la inflación e tasas de interés en un periodo de desaceleración económica:",
        recurso_visual: generateSVG('<path d="M 40 160 Q 150 40 360 140" stroke="%23ef4444" stroke-width="3" fill="none"/><text x="180" y="50" fill="%23ef4444" font-size="11" font-weight="bold">Inflación %</text><path d="M 40 140 Q 180 150 360 50" stroke="%2338bdf8" stroke-width="3" fill="none"/><text x="280" y="70" fill="%2338bdf8" font-size="11" font-weight="bold">Tasa Interés BanRep %</text><line x1="40" y1="170" x2="370" y2="170" stroke="%23f8fafc" stroke-width="1.5"/>'),
        opciones: [
            "A) La inflación baja cuando las tasas de interés se reducen a cero por ciento de forma permanente.",
            "B) El Banco de la República eleva las tasas de interés con el propósito expreso de estimular el gasto desmedido.",
            "C) Las tasas de interés y la inflación se mantienen inalterables independientemente del ciclo económico.",
            "D) El Banco de la República suele elevar las tasas de interés para desincentivar el crédito y contener la escalada inflacionaria."
        ],
        ok: "D", a: 1.50, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000043', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un funcionario ambiental aprueba la licencia de exploración minera en un área catalogada como Páramo. Al ser cuestionado, afirma que 'la zona delimitada en el mapa oficial tenía una imprecisión técnica de algunos metros'. Desde la tutela ambiental constitucional, el principio aplicable que invalida la actuación del funcionario es:",
        recurso_visual: null,
        opciones: [
            "A) El principio de favoritismo minero extractivo.",
            "B) El principio de estricta legalidad mercantil.",
            "C) El principio de libertad contractual industrial.",
            "D) El principio de precaución ambiental."
        ],
        ok: "D", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000044', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La Revolución Industrial iniciada en Gran Bretaña durante el siglo XVIII transformó la estructura social europea principalmente al dar origen a dos nuevas clases sociales antagónicas:",
        recurso_visual: null,
        opciones: [
            "A) La nobleza terrateniente y el siervo feudal sin tierras.",
            "B) El clero eclesiástico y los artesanos gremiales urbanos.",
            "C) Los monarcas absolutos y los comerciantes navieros mercantiles.",
            "D) La burguesía industrial propietaria del capital y el proletariado obrero asalariado."
        ],
        ok: "D", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000045', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "En el marco del Sistema Penal Acusatorio en Colombia, la entidad perteneciente a la Rama Judicial encargada de adelantar las investigaciones, recolectar pruebas y acusar a los presuntos responsables de delitos ante los jueces es:",
        recurso_visual: null,
        opciones: [
            "A) La Defensoría del Pueblo.",
            "B) El Ministerio de Justicia y del Derecho.",
            "C) La Policía Nacional de Colombia.",
            "D) La Fiscalía General de la Nación."
        ],
        ok: "D", a: 1.60, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000046', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un analista político sostiene que 'en un régimen democrático auténtico, la existencia de la oposición es tan indispensable como la del propio partido de gobierno'. La justificación analítica de esta tesis radica en que la oposición:",
        recurso_visual: null,
        opciones: [
            "A) Garantiza el aumento del gasto electoral en cada contienda presidencial.",
            "B) Es financiada de manera ilimitada por los organismos financieros multilaterales.",
            "C) Evita la aprobación de leyes orgánicas sobre el presupuesto general.",
            "D) Ejerce control político, fiscaliza el uso del poder e impide la derivación autoritaria del gobierno."
        ],
        ok: "D", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000047', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El concepto de 'Descentralización Administrativa' impulsado en Colombia a partir de la década de 1980 tuvo como propósito fundamental:",
        recurso_visual: null,
        opciones: [
            "A) Eliminar los alcaldes e intendentes para reemplazarlos por gobernadores designados.",
            "B) Concentrar el recaudo tributario exclusivamente en la capital de la República.",
            "C) Privatizar la prestación de todos los servicios de agua potable y saneamiento básico.",
            "D) Transferir competencias, autonomía política y recursos fiscales a los municipios y departamentos."
        ],
        ok: "D", a: 1.50, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000048', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "La Declaración Universal de los Derechos Humanos, aprobada por la Asamblea General de las Naciones Unidas en 1948, surgió históricamente como respuesta ética y política internacional ante:",
        recurso_visual: null,
        opciones: [
            "A) La caída del Imperio Otomano tras la Primera Guerra Mundial.",
            "B) El inicio de las tensiones atómicas entre la Unión Soviética y China.",
            "C) La instauración de la Unión Europea y el Euro en los mercados de divisas.",
            "D) Los horrores y atrocidades sistemáticas cometidas durante la Segunda Guerra Mundial y el Holocausto."
        ],
        ok: "D", a: 1.70, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000049', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un ciudadano interpone una demanda sosteniendo que la construcción de un aeropuerto comercial cerca de un santuario de aves vulnera el derecho al medio ambiente sano. El juez ordena la realización de un estudio de impacto ambiental antes de continuar la obra. La decisión del juez se sustenta en que:",
        recurso_visual: null,
        opciones: [
            "A) Los aeropuertos privados están exentos del cumplimiento de normas ambientales urbanas.",
            "B) La aviación comercial no genera ningún tipo de contaminación acústica ni atmosférica.",
            "C) La infraestructura aeroportuaria prima categóricamente sobre cualquier reserva natural.",
            "D) El derecho a un medio ambiente sano prevalece sobre el desarrollo de obras públicas cuando hay riesgo de daño ecológico irrestaurable."
        ],
        ok: "D", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000050', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El órgano constitucional encargado de ejercer el control fiscal de la gestión pública y vigilar el buen uso de los recursos del Estado colombiano en todos los niveles territoriales es:",
        recurso_visual: null,
        opciones: [
            "A) La Defensoría del Pueblo.",
            "B) La Superintendencia Financiera de Colombia.",
            "C) El Banco de la República.",
            "D) La Contraloría General de la República."
        ],
        ok: "D", a: 1.55, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000051', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Durante un debate sobre minería de hecho en zonas protegidas, un líder gremial sostiene: 'Si se prohíbe la extracción aurífera informal, se desatará una crisis de desempleo insostenible en el municipio'. Por su parte, un vocero ambientalista afirma: 'La contaminación por mercurio en la cuenca del río genera daños neurológicos irreversibles en las comunidades ribereñas'. Frente a este dilema socioambiental, ¿cuál es el conflicto fundamental subyacente?",
        recurso_visual: null,
        opciones: [
            "A) La tensión estructural entre la subsistencia económica local inmediata y la protección del derecho a la salud comunitaria y el medio ambiente sano.",
            "B) La disputa entre dos empresas mineras transnacionales por la concesión del subsuelo.",
            "C) La incompatibilidad de los horarios de trabajo entre mineros y pescadores artesanales.",
            "D) El desacuerdo sobre el tipo de maquinaria pesada que se debe importar del extranjero."
        ],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000052', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El Frente Nacional en Colombia (1958-1974) fue un pacto bipartidista entre el Partido Liberal y el Partido Conservador para alternarse la Presidencia de la República y repartirse equitativamente las burocracias estatales. ¿Cuál fue una de las consecuencias críticas imprevistas de este acuerdo político?",
        recurso_visual: null,
        opciones: [
            "A) El cierre de espacios de participación para terceras fuerzas políticas y el surgimiento de grupos insurgentes armados de izquierda.",
            "B) La desaparición inmediata de todas las disputas territoriales en el campo colombiano.",
            "C) La instauración de un régimen dictatorial de carácter militar indefinido.",
            "D) La sustitución de la Constitución Política por un código civil único en América Latina."
        ],
        ok: "A", a: 1.70, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000053', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "En el marco de la Revolución Industrial del siglo XIX, la migración masiva del campo a las ciudades provocó el rápido hacinamiento en barrios obreros con deficientes condiciones sanitarias. Desde una perspectiva histórica y socioeconómica, este fenómeno derivó directamente en:",
        recurso_visual: null,
        opciones: [
            "A) La articulación de movimientos sindicales y la exigencia de leyes laborales de protección a la clase trabajadora.",
            "B) El retorno voluntario del 90% de la población urbana a la agricultura de subsistencia.",
            "C) La abolición total del sistema de producción capitalista en Europa occidental.",
            "D) La prohibición permanente del trabajo fabril en las grandes metrópolis."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000054', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un gobernador departamental propone elevar el cobro del Impuesto sobre Vehículos Automotores para financiar la construcción de nuevas avenidas principales. Sin embargo, un colectivo ciudadana sostiene que esta medida es regresiva porque golpea en mayor proporción a las familias de ingresos medios y bajos. ¿Qué herramienta analítica permite evaluar objetivamente esta controversia fiscal?",
        recurso_visual: null,
        opciones: [
            "A) El análisis de la progresividad tributaria y la distribución del ingreso de los contribuyentes.",
            "B) La medición de la velocidad máxima permitida en las carreteras departamentales.",
            "C) El censo poblacional de vehículos importados de lujo únicamente.",
            "D) La revisión del calendario festivo del departamento."
        ],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000055', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "De acuerdo con el ordenamiento constitucional colombiano, la facultad conferida a las autoridades territoriales y étnicas para administrar sus propios asuntos y gobernarse por autoridades elegidas localmente se fundamenta en el principio de:",
        recurso_visual: null,
        opciones: [
            "A) Autonomía de las entidades territoriales.",
            "B) Soberanía diplomática unilateral.",
            "C) Centralismo administrativo absoluto.",
            "D) Inmunidad judicial colectiva."
        ],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000056', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El fenómeno de la 'Gran Depresión' desencadenado tras el crack bursátil de Wall Street en 1929 obligó a la mayoría de países capitalistas a reestructurar sus modelos de intervención estatal. El paradigma económico que emergió para impulsar la inversión pública y estimular el empleo se conoce como:",
        recurso_visual: null,
        opciones: [
            "A) Modelo Keynesiano (o Estado de Bienestar).",
            "B) Fisiocracia Agrícola Clásica.",
            "C) Mercantilismo Colonialista.",
            "D) Neoliberalismo de Privatizaciones de finales del siglo XX."
        ],
        ok: "A", a: 1.75, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000057', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un proyecto ley busca otorgar beneficios tributarios a empresas que contraten personas mayores de 50 años. Un detractor sostiene que esta norma discrimina injustamente a los jóvenes recién egresados. Para dirimir constitucionalmente la validez de esta medida, la Corte Constitucional recurre al criterio de:",
        recurso_visual: null,
        opciones: [
            "A) Discriminación positiva (o acciones afirmativas) para corregir inequidades históricas en el mercado laboral.",
            "B) Igualdad formal matemática estricta sin considerar el contexto social.",
            "C) Prevalencia irrestricta de la libertad de empresa privada.",
            "D) Inviolabilidad de las contrataciones verbales informales."
        ],
        ok: "A", a: 1.80, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000058', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En Colombia, la figura del 'Mecanismo de Búsqueda Urgente' es una herramienta pública de naturaleza preventiva que puede solicitarse inmediatamente ante las autoridades judiciales para:",
        recurso_visual: null,
        opciones: [
            "A) Tutelar y localizar de manera expedita a personas presuntamente víctimas de desaparición forzada.",
            "B) Rastrear el paradero de vehículos hurtados en parqueaderos públicos.",
            "C) Recuperar títulos valores y cheques extraviados en transacciones bancarias.",
            "D) Obtener copias extraviadas de escrituras notariales."
        ],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000059', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "La firma de los Acuerdos de Paz de La Habana en 2016 formalizó la creación del Sistema Integral de Verdad, Justicia, Reparación y No Repetición (SIVJRNR). Uno de sus componentes clave, encargado de investigar violaciones graves a los Derechos Humanos con enfoque sancionatorio propio, es:",
        recurso_visual: null,
        opciones: [
            "A) La Jurisdicción Especial para la Paz (JEP).",
            "B) El Consejo Nacional Electoral (CNE).",
            "C) La Sala de Casación Penal de la Corte Suprema.",
            "D) El Tribunal Administrativo de Cundinamarca."
        ],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000060', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un municipio decide declarar una zona rural como 'Área de Reserva Campesina'. Organizaciones de pequeños agricultores respaldan la medida, mientras que grandes agroindustriales la rechazan argumentando que restringe la compra masiva de tierras para monocultivos de exportación. ¿Cuál es la intencionalidad social protegida legalmente por dicha reserva?",
        recurso_visual: null,
        opciones: [
            "A) Prevenir la concentración latifundista de la tierra y fomentar la producción alimentaria campesina sustentable.",
            "B) Prohibir el paso de vías de transporte público pavimentadas.",
            "C) Obligar a los habitantes a cultivar únicamente especies exóticas no nativas.",
            "D) Expropiar sin indemnización a los pequeños propietarios tradicionales."
        ],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000061', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El concepto de 'Derechos Fundamentales de Segunda Generación' (o Derechos Económicos, Sociales y Culturales - DESC) incluye derechos colectivos orientados a garantizar condiciones dignas de subsistencia, tales como:",
        recurso_visual: null,
        opciones: [
            "A) El derecho al trabajo, la educación, la salud y la seguridad social.",
            "B) El derecho al voto y a ser elegido en cargos de representación popular.",
            "C) El derecho a la presunción de inocencia en juicios penales.",
            "D) El derecho a la libertad de culto y de conciencia."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000062', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Durante la época colonial en la Nueva Granada, la institución del 'Patronato Regio' otorgaba a los reyes de España la prerrogativa especial de:",
        recurso_visual: null,
        opciones: [
            "A) Intervenir en el nombramiento de autoridades eclesiásticas y en la administración de diezmos en los territorios de ultramar.",
            "B) Eliminar la recaudación del impuesto de alcabala a los comerciantes criollos.",
            "C) Otorgar la ciudadanía española con derecho a voto a la población indígena encomendada.",
            "D) Declarar la independencia militar de las colonias frente a la Santa Sede."
        ],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000063', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un concejal sostiene que para frenar la delincuencia juvenil es necesario rebajar la edad de imputabilidad penal a los 12 años. Por el contrario, un psicólogo social sostiene que la privación de libertad en edades tempranas aumenta la reincidencia criminal y propone programas intersectoriales de educación e inclusión. ¿Cuál es el punto irreconciliable de divergencia entre ambas posturas?",
        recurso_visual: null,
        opciones: [
            "A) La concepción sobre si la respuesta estatal prioritaria debe ser el punitivismo penal o la prevención mediante garantías sociales.",
            "B) El presupuesto exacto asignado a la uniformación de la guardia de tránsito.",
            "C) El tipo de tecnología empleada en las cámaras de televisión en circuito cerrado.",
            "D) La fecha oficial del calendario en que debe iniciar el año lectivo escolar."
        ],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000064', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La entidad encargada de velar por la efectividad de los derechos humanos y la protección del interés público mediante la representación de la sociedad civil y la personería municipal en el territorio colombiano es:",
        recurso_visual: null,
        opciones: [
            "A) El Ministerio Público (a través de la Procuraduría y la Defensoría del Pueblo).",
            "B) La Contraloría General de las Fuerzas Militares.",
            "C) La Superintendencia de Industria y Comercio.",
            "D) La Registraduría Nacional del Estado Civil."
        ],
        ok: "A", a: 1.55, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000065', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "En el siglo XX, el conflicto limítrofe entre Colombia y Perú (1932-1933) desencadenado por la toma del puerto de Leticia se resolvió diplomáticamente mediante la firma del:",
        recurso_visual: null,
        opciones: [
            "A) Protocolo de Río de Janeiro de 1934.",
            "B) Tratado Salomón-Lozano de 1922.",
            "C) Pacto de Bogotá de 1948.",
            "D) Tratado Esguerra-Bárcenas de 1928."
        ],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000066', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un análisis sociológico resalta: 'Las plataformas digitales de transporte operan en un vacío normativo donde los conductores asumen la totalidad de los costos de mantenimiento y riesgos de accidentes sin contar con vinculación laboral ni prestaciones sociales'. ¿Qué fenómeno socioeconómico describe este análisis?",
        recurso_visual: null,
        opciones: [
            "A) La precarización laboral y la flexibilización de cargas prestacionales en la economía de plataformas.",
            "B) El pleno empleo formal garantizado por el Estado de Bienestar.",
            "C) La estatización absoluta del parque automotor de servicio público.",
            "D) La desaparición completa del uso de teléfonos inteligentes en áreas urbanas."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000067', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "El principio constitucional que obliga al Estado colombiano a reconocer, proteger y valorar las diversas identidades étnicas, lingüísticas y culturales coexistentes en el territorio nacional se denomina:",
        recurso_visual: null,
        opciones: [
            "A) Diversidad étnica y cultural de la Nación.",
            "B) Homogeneidad idiomática obligatoria.",
            "C) Segregación territorial especial.",
            "D) Monoculturalismo republicano."
        ],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000068', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "En el contexto geopolítico de la segunda mitad del siglo XX, la 'Doctrina de la Seguridad Nacional' promovida por Estados Unidos en América Latina tuvo como objetivo político estratégico:",
        recurso_visual: null,
        opciones: [
            "A) Contener la expansión del comunismo y respaldar dictaduras militares frente a movimientos de izquierda.",
            "B) Promover la integración económica de los países andinos en un mercado común europeo.",
            "C) Fomentar la industrialización pesada mediante subsidios directos a la URSS.",
            "D) Unificar las Constituciones políticas de los países centroamericanos."
        ],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000069', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Una empresa multinacional adquiere miles de hectáreas en la Orinoquía colombiana para la siembra masiva de palma de aceite. La comunidad local afirma que la tala de bosque nativo destruyó las fuentes de agua tradicionales, mientras la empresa sostiene que generó 300 empleos informales de temporada. ¿Qué perspectiva sociodemográfica sintetiza la contradicción principal?",
        recurso_visual: null,
        opciones: [
            "A) La disparidad entre el beneficio económico a corto plazo para la empresa frente a la degradación ecológica y pérdida de soberanía hídrica comunitaria a largo plazo.",
            "B) El desacuerdo sobre el tipo de fertilizante químico importado por la fábrica.",
            "C) La preferencia de la comunidad por instalar centros comerciales en lugar de hectáreas agrícolas.",
            "D) La falta de señalización vial en la autopista principal."
        ],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000070', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En Colombia, la figura jurídica que autoriza a los ciudadanos a exigir ante los jueces el cumplimiento efectivo de una ley o de un acto administrativo inobservado por la autoridad pública se denomina:",
        recurso_visual: null,
        opciones: [
            "A) Acción de Cumplimiento.",
            "B) Acción Popular.",
            "C) Hábeas Corpus.",
            "D) Recurso de Reposición Tributario."
        ],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000071', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "Durante la segunda mitad del siglo XX en Colombia, el fenómeno sociopolítico de desplazamiento forzado masivo del campo hacia las principales ciudades derivó centralmente en:",
        recurso_visual: null,
        opciones: [
            "A) Un crecimiento urbano acelerado e informal con presiones sobre los servicios públicos e infraestructura.",
            "B) La mecanización inmediata e industrialización masiva de todos los predios rurales abandonados.",
            "C) La reducción completa de la brecha de desigualdad económica entre el campo y la ciudad.",
            "D) El incremento espontáneo de la producción agrícola para exportación en las periferias."
        ],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000072', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El 'Frente Nacional' (1958-1974) fue un acuerdo de alternancia del poder multipartidista en Colombia entre los partidos Liberal y Conservador. Una consecuencia crítica no deseada de este pacto fue:",
        recurso_visual: null,
        opciones: [
            "A) La exclusión institucional de terceras fuerzas políticas y el surgimiento de grupos insurgentes armados.",
            "B) La disolución definitiva del Congreso de la República y de la Corte Suprema.",
            "C) El alineamiento ideológico automático de Colombia con el bloque soviético durante la Guerra Fría.",
            "D) La prohibición constitucional de las elecciones populares presidenciales."
        ],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000073', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Ante una propuesta de construcción de una hidroeléctrica que inundará tierras sagradas indígenas, los líderes comunitarios interponen una Consulta Previa conforme al Convenio 169 de la OIT. ¿Cuál es la garantía fundamental garantizada?",
        recurso_visual: null,
        opciones: [
            "A) Participar informadamente sobre decisiones que afectan directamente su territorio e identidad cultural.",
            "B) La transferencia obligatoria del 50% de las acciones de la hidroeléctrica a nombre del cacique.",
            "C) La exoneración perpetua del pago de impuestos de IVA a nivel nacional.",
            "D) La imposición unilateral del proyecto sin importar los impactos socioculturales."
        ],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000074', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En el contexto económico global, el fenómeno conocido como 'Gentrificación' en los sectores históricos de las grandes ciudades latinoamericanas alude a:",
        recurso_visual: null,
        opciones: [
            "A) La revalorización inmobiliaria que desplaza a residentes tradicionales de bajos ingresos por habitantes de mayor poder adquisitivo.",
            "B) La construcción de vivienda de interés social subsidiada 100% por el gobierno central.",
            "C) La conversión de zonas urbanas residenciales en parques agroecológicos comunitarios.",
            "D) La migración masiva de industrias pesadas hacia los centros históricos protegidos."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000075', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "La Separación de Poderes en una democracia republicana (Ejecutivo, Legislativo y Judicial) responde al principio constitucional ideado por Montesquieu para:",
        recurso_visual: null,
        opciones: [
            "A) Evitar la concentración del poder autoritario mediante pesos y contrapesos (checks and balances).",
            "B) Agilizar la aprobación de leyes sin requerir debates parlamentos duraderos.",
            "C) Subordinar los tribunales de justicia a la voluntad del Presidente de la República.",
            "D) Permitir que los militares legislen en periodos de crisis presupuestal."
        ],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000076', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un estudio socioeconómico revela que las mujeres en un país ganan en promedio un 18% menos que los hombres realizando las mismas funciones laborales. Este problema estructural se define como:",
        recurso_visual: null,
        opciones: [
            "A) Brecha salarial de género.",
            "B) Inflexibilidad en los tipos de cambio de divisas.",
            "C) Ventaja comparativa de comercio exterior.",
            "D) Desempleo friccional estacional."
        ],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000077', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La Constitución de 1991 consagra a Colombia como un 'Estado Social de Derecho'. Esta definición implica formalmente que el Estado tiene el deber prioritario de:",
        recurso_visual: null,
        opciones: [
            "A) Garantizar condiciones materiales mínimas de vida digna y equidad mediante derechos sociales, económicos y culturales.",
            "B) Priorizar el cobro de deudas bancarias privadas por encima del gasto en salud pública.",
            "C) Permitir que las leyes sean modificadas directamente por las corporaciones transnacionales.",
            "D) Limitar el voto popular exclusivamente a ciudadanos propietarios de finca raíz."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000078', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "En el ámbito de las finanzas públicas, la inflación representa un aumento sostenido y generalizado de los precios. Un efecto adverso directo de la inflación alta no controlada es:",
        recurso_visual: null,
        opciones: [
            "A) La pérdida progresiva del poder adquisitivo de las familias con ingresos fijos o salarios mínimos.",
            "B) El fortalecimiento inmediato del valor real de los ahorros en dinero efectivo.",
            "C) La reducción automática del costo de los insumos agrícolas importados.",
            "D) El incremento espontáneo de las reservas internacionales de oro."
        ],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000079', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un proyecto minero pretende intervenir una reserva forestal protegida. Los ambientalistas protestan alegando destrucción de biomas, mientras el alcalde local argumenta generación de regalías municipales. Para conciliar ambos intereses en el marco del desarrollo sostenible, la estrategia más idónea es:",
        recurso_visual: null,
        opciones: [
            "A) Delimitar estrictamente zonas de exclusión biológica insustituibles y exigir tecnologías limpias sin comprometer el capital natural.",
            "B) Cancelar todos los impuestos a la mina a cambio de sembrar diez árboles en la plaza central.",
            "C) Permitir la excavación a cielo abierto en el 100% del ecosistema para elevar ingresos fiscales.",
            "D) Trasladar la reserva forestal a un municipio costero mediante decreto."
        ],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000080', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En el sistema político colombiano, la entidad de control autónoma encargada de vigilar la conducta oficial de los servidores públicos e imponer sanciones disciplinarias es:",
        recurso_visual: null,
        opciones: [
            "A) La Procuraduría General de la Nación.",
            "B) La Contraloría General de la República.",
            "C) La Defensoría del Pueblo.",
            "D) El Banco de la República."
        ],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000081', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El movimiento social conocido como 'Las Sufragistas' a principios del siglo XX impulsó transformaciones profundas en la democracia occidental al exigir fundamentalmente:",
        recurso_visual: null,
        opciones: [
            "A) El derecho universal al voto político y a la participación ciudadana plena de las mujeres.",
            "B) La exención permanente de impuestos prediales para las madres cabeza de familia.",
            "C) La prohibición constitucional del trabajo industrial en las fábricas textiles.",
            "D) La instauración de un régimen parlamentario monárquico."
        ],
        ok: "A", a: 1.35, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000082', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un canal regional de televisión omite sistemáticamente publicar noticias sobre acusaciones de corrupción en la gobernación, mientras transmite extensos reportajes sobre inauguraciones de parques. Este comportamiento atenta contra:",
        recurso_visual: null,
        opciones: [
            "A) El derecho de la ciudadanía a recibir información veraz, imparcial y plural.",
            "B) El principio de reserva bancaria de los funcionarios gubernamentales.",
            "C) La libertad de prensa para transmitir programas de entretenimiento infantil.",
            "D) El derecho del Gobernador a evitar cuestionamientos públicos."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000083', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En Colombia, la 'Acción Popular' es el mecanismo constitucional diseñado para la protección de:",
        recurso_visual: null,
        opciones: [
            "A) Los derechos e intereses colectivos (como el medio ambiente, la moralidad administrativa y el espacio público).",
            "B) El derecho individual a la libertad física de una persona retenida ilegalmente.",
            "C) La restitución inmediata de cuentas bancarias embargadas por deudas.",
            "D) La revocatoria directa del mandato presidencial."
        ],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000084', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "La crisis de la deuda externa en América Latina durante la década de 1980 (conocida como la 'Década Perdida') condujo en la mayoría de países de la región a la implementación de programas de ajuste estructural centrados en:",
        recurso_visual: null,
        opciones: [
            "A) La apertura económica, reducción del gasto público y privatización de empresas estatales (Consenso de Washington).",
            "B) La nacionalización completa de la banca privada y el aislamiento comercial exterior.",
            "C) La adopción del modelo de sustitución de importaciones liderado por el Estado.",
            "D) La creación de una moneda única sudamericana con respaldo en reservas de petróleo."
        ],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000085', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un grupo de ciudadanos decide realizar un bloqueo total de una autopista nacional para exigir la pavimentación de su vía comunitaria. Aunque la protesta pacífica es un derecho constitucional, el bloqueo indefinido genera un conflicto de derechos porque:",
        recurso_visual: null,
        opciones: [
            "A) Afecta desproporcionadamente la libertad de locomoción, el abastecimiento de alimentos y el acceso a servicios de salud de terceros.",
            "B) Las autopistas nacionales son propiedad exclusiva de concesiones privadas extranjeras.",
            "C) La pavimentación de vías secundarias está prohibida por el Código de Comercio.",
            "D) Los manifestantes no contaban con el carnet de afiliación a un partido político."
        ],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000086', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En el ordenamiento territorial colombiano, el Plan de Ordenamiento Territorial (POT) es la herramienta técnica y normativa mediante la cual cada municipio reglamenta:",
        recurso_visual: null,
        opciones: [
            "A) El uso del suelo, la clasificación de zonas urbanas/rurales y la ubicación de infraestructura a mediano y largo plazo.",
            "B) El valor de la tarifa del transporte masivo en horas pico.",
            "C) Las tasas de interés para créditos hipotecarios bancarios.",
            "D) La programación de fiestas patronales y eventos culturales."
        ],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000087', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El concepto de 'Soberanía Alimentaria' a diferencia de 'Seguridad Alimentaria' enfatiza prioritariamente:",
        recurso_visual: null,
        opciones: [
            "A) El derecho de los pueblos a definir sus propias políticas agrarias y alimentarias de forma sostenible con producción local.",
            "B) La importación masiva de alimentos procesados a bajo precio desde grandes potencias agrícolas.",
            "C) La prohibición total del consumo de carne de origen vacuno en comedores escolares.",
            "D) El monopolio estatal de la distribución de granos y cereales."
        ],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000088', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "En una institución educativa, el Consejo Estudiantil propone extender el horario de descanso, mientras la rectoría afirma que afectaría las horas académicas mínimas exigidas por el Ministerio. La alternativa participativa más constructiva conforme al Gobierno Escolar es:",
        recurso_visual: null,
        opciones: [
            "A) Llevar la propuesta al Consejo Directivo para debatir ajustes curriculares concertados entre docentes, estudiantes y directivos.",
            "B) Convocar a un paro indefinido con toma de las instalaciones del colegio.",
            "C) Sancionar disciplinariamente a los representantes del Consejo Estudiantil.",
            "D) Ignorar la petición argumentando que los estudiantes carecen de voz institucional."
        ],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000089', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "La figura de la 'Revocatoria del Mandato' en Colombia aplica exclusivamente para terminar de forma anticipada el periodo constitucional de:",
        recurso_visual: null,
        opciones: [
            "A) Alcaldes y Gobernadores elegidos por voto popular.",
            "B) Congresistas y Senadores de la República.",
            "C) Magistrados de las Altas Cortes de Justicia.",
            "D) Presidente de la República y Vicepresidente."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000090', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Durante la Revolución Industrial en Europa (Siglos XVIII-XIX), el surgimiento de la clase obrera urbana (proletariado) con extensas jornadas laborales dio origen histórico a:",
        recurso_visual: null,
        opciones: [
            "A) El Movimiento Obrero, los sindicatos y la consolidación del Derecho Laboral.",
            "B) El restablecimiento definitivo del feudalismo medieval en las ciudades.",
            "C) La abolición completa de la propiedad privada de las herramientas artesanales.",
            "D) La creación inmediata de la Organización Mundial del Comercio."
        ],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000091', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un estudio sociológico revela que en los barrios con menor presencia de parques públicos y centros comunitarios se registran mayores tasas de violencia juvenil. ¿Qué inferencia crítica es analíticamente más precisa?",
        recurso_visual: null,
        opciones: [
            "A) Existe una correlación espacial entre la carencia de infraestructura social comunitaria y la vulnerabilidad social de los jóvenes.",
            "B) La presencia de árboles en parques públicos causa directamente la delincuencia de adultos.",
            "C) Los jóvenes prefieren habitar zonas sin espacios recreativos ni deportivos.",
            "D) La construcción de parques elimina por sí sola la necesidad de colegios y profesores."
        ],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000092', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En Colombia, la 'Acción de Tutela' procede de manera excepcional contra sentencias judiciales únicamente cuando se configura:",
        recurso_visual: null,
        opciones: [
            "A) Una Vía de Hecho o vulneración flagrante a los derechos fundamentales y al debido proceso.",
            "B) Un simple desacuerdo con el criterio de valoración probatoria del juez.",
            "C) Un error de ortografía en la redacción de la sentencia resolutiva.",
            "D) El vencimiento de la fecha de pago de la caución de fianza."
        ],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000093', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "La denominada 'Guerra Fría' (1947-1991) se caracterizó a nivel geopolítico global por:",
        recurso_visual: null,
        opciones: [
            "A) La confrontación ideológica, económica y estratégica indirecta entre el bloque capitalista (EE.UU.) y el socialista (URSS).",
            "B) El enfrentamiento militar directo y abierto con bombas nucleares entre Washington y Moscú.",
            "C) La unificación de todos los estados del mundo bajo el mandato directo de las Naciones Unidas.",
            "D) La ausencia total de conflictos armados en Asia, África y América Latina."
        ],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000094', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un municipio costero sufre graves inundaciones periódicas por el aumento del nivel del mar. Los hoteleros sugieren construir muros de contención de concreto, mientras los biólogos recomiendan restaurar los manglares nativos. ¿Qué ventaja ecológica comparativa ofrece la solución de los biólogos?",
        recurso_visual: null,
        opciones: [
            "A) Los manglares absorben la energía de las olas de forma natural, filtran agua y sirven de criadero de especies marinas.",
            "B) La siembra de manglares elimina la necesidad de contar con policía de turismo.",
            "C) Los muros de concreto generan mayor biodiversidad de aves migratorias que los manglares.",
            "D) La restauración de manglares se realiza en menos de 24 horas sin mantenimiento."
        ],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000095', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En Colombia, la Jurisdicción Especial para la Paz (JEP) creada tras el Acuerdo de Paz de 2016 tiene como modelo sustantivo la 'Justicia Restaurativa', cuyo fin prioritario es:",
        recurso_visual: null,
        opciones: [
            "A) Satisfacer los derechos de las víctimas a la verdad, reparación y no repetición reconociendo responsabilidades.",
            "B) Aplicar penas máximas de cárcel en recintos de alta seguridad sin escuchar testimonios.",
            "C) Exonerar incondicionalmente a todos los comparecientes sin exigir aporte a la verdad.",
            "D) Otorgar indemnizaciones económicas pagadas exclusivamente por países extranjeros."
        ],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000096', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El 'Proceso de Comunidades Negras' y la posterior expedición de la Ley 70 de 1993 en Colombia significó el reconocimiento histórico constitucional de:",
        recurso_visual: null,
        opciones: [
            "A) La propiedad colectiva de la tierra para las comunidades afrocolombianas y la protección de su identidad cultural.",
            "B) La privatización de los territorios baldíos de la costa pacífica para empresas hoteleras.",
            "C) La creación de un departamento exclusivo de administración afrodescendiente en el Chocó.",
            "D) La sustitución obligatoria de lenguas nativas por el idioma inglés."
        ],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000097', area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
        texto: "Un gobernante decreta la censura previa de redes sociales durante manifestaciones públicas alegando mantener la seguridad nacional. Varias ONG internacionales afirman que la medida es desproporcionada. ¿Por qué la censura previa vulnera estándares democráticos?",
        recurso_visual: null,
        opciones: [
            "A) Porque restringe de forma arbitraria la libertad de expresión e impide el control ciudadano sobre posibles abusos de poder.",
            "B) Porque reduce las ganancias publicitarias de las plataformas digitales privadas.",
            "C) Porque obliga a los manifestantes a utilizar radios comunitarias de frecuencia corta.",
            "D) Porque las redes sociales son propiedad constitucional de los juzgados municipales."
        ],
        ok: "A", a: 1.75, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000098', area: 'sociales_ciudadanas', sub: 'pensamiento_social',
        texto: "En el derecho internacional público, el principio de 'No Intervención' consagra formalmente que:",
        recurso_visual: null,
        opciones: [
            "A) Ningún Estado tiene derecho a intervenir directa o indirectamente en los asuntos internos de otro Estado soberano.",
            "B) Las Naciones Unidas pueden disolver libremente los parlamentos de los países miembros.",
            "C) Los acuerdos comerciales bilaterales deben ser aprobados por la Corte Penal Internacional.",
            "D) Los países en desarrollo están obligados a adoptar la moneda oficial de una potencia aliada."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '55555555-0000-4000-8000-000000000099', area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "El concepto sociológico de 'Capital Social' popularizado por Robert Putnam alude principalmente a:",
        recurso_visual: null,
        opciones: [
            "A) Las redes de confianza, normas de reciprocidad y participación asociativa que facilitan la cooperación colectiva.",
            "B) La suma total del dinero depositado en los bancos centrales por parte de los ciudadanos.",
            "C) La infraestructura física de autopistas y puertos marítimos de un país.",
            "D) El valor financiero en dólares de las patentes tecnológicas registradas."
        ],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

const reactivosGen = generarReactivosSocialesMasivos(1000);
export const reactivosSociales = [...reactivosSeed, ...reactivosGen];

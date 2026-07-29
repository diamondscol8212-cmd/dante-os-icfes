// 🏛️ src/services/services/bank/sociales_ciudadanas.js - 50 Reactivos Calibrados ICFES Saber 11
const generateSVG = (content) => 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="background:%230d0f14;font-family:sans-serif;">' + content + '</svg>';

export const reactivosSociales = [
    // --------------------------------------------------------------------------------
    // RESPUESTAS A (12 Reactivos)
    // --------------------------------------------------------------------------------
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Observe el siguiente diagrama sobre la estructura de la Rama Ejecutiva del Poder Público en Colombia a nivel nacional:",
        recurso_visual: generateSVG('<rect x="120" y="20" width="160" height="35" rx="5" fill="%231a233a" stroke="%2338bdf8" stroke-width="2"/><text x="200" y="42" fill="%23f8fafc" font-size="11" text-anchor="middle" font-weight="bold">Presidencia de la República</text><line x1="200" y1="55" x2="200" y2="80" stroke="%2338bdf8" stroke-width="2"/><rect x="40" y="80" width="130" height="35" rx="5" fill="%231a233a" stroke="%2334d399" stroke-width="1.5"/><text x="105" y="102" fill="%23f8fafc" font-size="10" text-anchor="middle">Ministerios de Despacho</text><rect x="230" y="80" width="130" height="35" rx="5" fill="%231a233a" stroke="%2334d399" stroke-width="1.5"/><text x="295" y="102" fill="%23f8fafc" font-size="10" text-anchor="middle">Deptos. Administrativos</text><line x1="105" y1="115" x2="105" y2="140" stroke="%2334d399" stroke-width="1.5"/><rect x="30" y="140" width="150" height="35" rx="5" fill="%230f172a" stroke="%23f59e0b" stroke-width="1.5"/><text x="105" y="162" fill="%23f59e0b" font-size="10" text-anchor="middle">Superintendencias y S.P.</text>'),
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Considere la siguiente gráfica simplificada sobre los resultados de participación en un plebiscito ciudadano:",
        recurso_visual: generateSVG('<rect x="50" y="30" width="80" height="120" fill="%23ef4444"/><text x="90" y="25" fill="%23f8fafc" font-size="11" text-anchor="middle">Votos NO (50.2%)</text><rect x="160" y="35" width="80" height="115" fill="%2310b981"/><text x="200" y="25" fill="%23f8fafc" font-size="11" text-anchor="middle">Votos SÍ (49.8%)</text><rect x="270" y="10" width="80" height="140" fill="%2364748b"/><text x="310" y="25" fill="%23f8fafc" font-size="11" text-anchor="middle">Abstención (62%)</text>'),
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Examine el siguiente esquema sobre las funciones de los Órganos de Control en Colombia:",
        recurso_visual: generateSVG('<rect x="30" y="40" width="160" height="120" rx="5" fill="%231a1d26" stroke="%2338bdf8" stroke-width="2"/><text x="110" y="70" fill="%2338bdf8" font-size="12" text-anchor="middle" font-weight="bold">PROCURADURÍA</text><text x="110" y="100" fill="%23f8fafc" font-size="10" text-anchor="middle">Sanción disciplinaria a</text><text x="110" y="118" fill="%23f8fafc" font-size="10" text-anchor="middle">servidores públicos</text><rect x="210" y="40" width="160" height="120" rx="5" fill="%231a1d26" stroke="%23f59e0b" stroke-width="2"/><text x="290" y="70" fill="%23f59e0b" font-size="12" text-anchor="middle" font-weight="bold">CONTRALORÍA</text><text x="290" y="100" fill="%23f8fafc" font-size="10" text-anchor="middle">Vigilancia de los recursos</text><text x="290" y="118" fill="%23f8fafc" font-size="10" text-anchor="middle">y del tesoro público</text>'),
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
        texto: "Examine la siguiente tabla informativa sobre la composición de la fuerza laboral en dos sectores de la economía colombiana:",
        recurso_visual: generateSVG('<text x="200" y="25" fill="%23f8fafc" font-size="11" text-anchor="middle" font-weight="bold">Distribución Laboral por Sector</text><rect x="30" y="40" width="340" height="130" fill="%231a1d26" stroke="%23475569" stroke-width="1"/><line x1="30" y1="75" x2="370" y2="75" stroke="%23475569" stroke-width="1"/><line x1="180" y1="40" x2="180" y2="170" stroke="%23475569" stroke-width="1"/><text x="100" y="60" fill="%2338bdf8" font-size="10" text-anchor="middle">Sector Agrario</text><text x="275" y="60" fill="%2338bdf8" font-size="10" text-anchor="middle">Sector Servicios Urbanos</text><text x="100" y="100" fill="%23f8fafc" font-size="9" text-anchor="middle">Alta informalidad (72%)</text><text x="275" y="100" fill="%23f8fafc" font-size="9" text-anchor="middle">Informalidad moderada (45%)</text><text x="100" y="135" fill="%23f8fafc" font-size="9" text-anchor="middle">Baja cobertura pensional (18%)</text><text x="275" y="135" fill="%23f8fafc" font-size="9" text-anchor="middle">Cobertura pensional media (52%)</text>'),
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    {
        area: 'sociales_ciudadanas', sub: 'interpretacion_y_analisis',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_critico',
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
    {
        area: 'sociales_ciudadanas', sub: 'pensamiento_social',
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
    }
];

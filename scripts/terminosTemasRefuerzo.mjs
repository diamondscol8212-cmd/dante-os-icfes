/** Términos clave (3–6) por tema de refuerzo. Autousado por buildContenidoTemasRefuerzo.mjs */
function t(termino, definicion, ejemplo) {
  return { termino, definicion, ejemplo: ejemplo || '' };
}

export const TERMINOS_TEMAS = {
  geometria: [
    t('perímetro', 'Medida del contorno de una figura (suma de lados).', 'Rectángulo: P = 2 × (largo + ancho).'),
    t('área', 'Medida de la superficie interior de una figura plana.', 'Rectángulo: A = largo × ancho.'),
    t('volumen', 'Espacio que ocupa un cuerpo en 3D.', 'Prisma rectangular: V = largo × ancho × alto.'),
    t('cateto', 'Cada uno de los dos lados que forman el ángulo recto en un triángulo rectángulo.', 'En un 3-4-5, los catetos son 3 y 4.'),
    t('hipotenusa', 'Lado opuesto al ángulo de 90°; es el más largo.', 'Pitágoras: a² + b² = c² (c = hipotenusa).'),
    t('semejanza', 'Figuras con la misma forma (ángulos iguales) y lados proporcionales.', 'Si la razón es 2, todos los lados se duplican.')
  ],
  fracciones: [
    t('numerador', 'Parte de arriba: cuántas partes se toman.', 'En 3/4, el 3 es el numerador.'),
    t('denominador', 'Parte de abajo: en cuántas partes iguales se divide el todo.', 'En 3/4, el 4 es el denominador.'),
    t('equivalente', 'Fracciones distintas que representan la misma cantidad.', '1/2 = 2/4 = 3/6.'),
    t('mcm', 'Mínimo común múltiplo: el menor múltiplo común de dos o más números.', 'Para sumar 1/4 + 1/6 se usa mcm(4,6)=12.'),
    t('simplificar', 'Dividir numerador y denominador por el mismo factor.', '6/8 ÷ 2/2 = 3/4.')
  ],
  proporcionalidad: [
    t('razón', 'Comparación de dos cantidades mediante una división a:b o a/b.', '2:5 = 2/5.'),
    t('proporción', 'Igualdad de dos razones.', '2/3 = 4/6.'),
    t('directa', 'Si una magnitud sube, la otra también (en la misma razón).', 'Más horas → más salario a tarifa fija.'),
    t('inversa', 'Si una magnitud sube, la otra baja.', 'Más obreros → menos días para la misma obra.'),
    t('regla de tres', 'Método para hallar el cuarto valor en una proporción.', 'Si 3 cuestan 12, 5 cuestan x → 3/12 = 5/x.')
  ],
  algebra: [
    t('variable', 'Símbolo (x, y…) que representa un número desconocido.', 'En 2x+1=7, x es la variable.'),
    t('ecuación', 'Igualdad con una o más incógnitas que hay que despejar.', '3x = 12 → x = 4.'),
    t('coeficiente', 'Número que multiplica a la variable.', 'En 5x, el coeficiente es 5.'),
    t('despejar', 'Aislar la incógnita con operaciones inversas.', 'Si x+3=10, resta 3: x=7.'),
    t('término semejante', 'Términos con la misma parte literal.', '3x y 5x se suman: 8x.')
  ],
  aritmetica: [
    t('orden de operaciones', 'Regla: paréntesis → potencias → ×÷ → +−.', '2+3×4 = 14, no 20.'),
    t('múltiplo', 'Resultado de multiplicar un número por un entero.', '12 es múltiplo de 3.'),
    t('divisor', 'Número que divide exactamente a otro.', '4 es divisor de 12.'),
    t('potencia', 'Multiplicar una base por sí misma n veces.', '2³ = 2×2×2 = 8.'),
    t('conversión', 'Pasar de una unidad a otra con un factor.', '120 min = 2 h.')
  ],
  funciones: [
    t('función', 'Relación que asigna a cada x un único y.', 'y = 2x+1 es función de x.'),
    t('pendiente', 'Cambio de y por cada unidad de x (m en y=mx+b).', 'En y=2x+1, m=2.'),
    t('intercepto', 'Valor de y cuando x=0 (b en y=mx+b).', 'En y=2x+1, b=1.'),
    t('dominio', 'Conjunto de valores permitidos de x.', 'En √x, dominio x≥0.'),
    t('recorrido', 'Conjunto de valores que toma y.', 'En y=x², recorrido y≥0.')
  ],
  estadistica: [
    t('media', 'Promedio: suma de datos ÷ cantidad de datos.', 'Media de 2,4,6 = 4.'),
    t('mediana', 'Valor central al ordenar los datos.', 'En 1,3,8 la mediana es 3.'),
    t('moda', 'Valor que más se repite.', 'En 2,2,5 la moda es 2.'),
    t('rango', 'Diferencia entre el mayor y el menor.', '12−5 = 7.'),
    t('frecuencia', 'Cuántas veces aparece un dato.', 'Si 3 sale cinco veces, f=5.')
  ],
  probabilidad: [
    t('probabilidad', 'Medida de qué tan posible es un evento, entre 0 y 1 (o %).', 'P(cara) en moneda justa = 1/2.'),
    t('espacio muestral', 'Todos los resultados posibles.', 'Dado: {1,2,3,4,5,6}.'),
    t('evento', 'Subconjunto del espacio muestral.', 'Salir par: {2,4,6}.'),
    t('complemento', 'Lo que no es el evento A (se escribe Aᶜ).', 'P(Aᶜ)=1−P(A).'),
    t('excluyentes', 'Eventos que no pueden ocurrir a la vez.', 'Par e impar en un dado.')
  ],
  trigonometria: [
    t('seno', 'En un triángulo rectángulo: cateto opuesto ÷ hipotenusa.', 'sen θ = op/hip.'),
    t('coseno', 'Cateto adyacente ÷ hipotenusa.', 'cos θ = adj/hip.'),
    t('tangente', 'Cateto opuesto ÷ cateto adyacente.', 'tan θ = op/adj.'),
    t('ángulo', 'Abertura entre dos lados; en grados o radianes.', 'Un ángulo recto mide 90°.'),
    t('razón trigonométrica', 'Relación entre lados según el ángulo.', 'SOH-CAH-TOA.')
  ],
  combinatoria: [
    t('permutación', 'Arreglos donde el orden importa.', 'ABC ≠ ACB.'),
    t('combinación', 'Selecciones donde el orden no importa.', 'Elegir 2 de {A,B,C}: AB=BA.'),
    t('factorial', 'n! = n×(n−1)×…×1.', '4! = 24.'),
    t('principio multiplicativo', 'Si hay m y n formas, en total m×n.', '3 camisas × 2 pantalones = 6 outfits.')
  ],
  calculo_limites: [
    t('límite', 'Valor al que se acerca f(x) cuando x se acerca a un número.', 'lim x→2 (x+1) = 3.'),
    t('indeterminación', 'Forma que no se resuelve directo (0/0, ∞/∞…).', 'En 0/0 hay que simplificar.'),
    t('continuidad', 'La función no “salta” en el punto.', 'Los polinomios son continuos en ℝ.'),
    t('asimíntota', 'Recta a la que la gráfica se acerca sin tocarla necesariamente.', 'y=1/x tiene asíntota x=0.')
  ],
  aptitud_numerica_docente: [
    t('porcentaje', 'Parte de 100.', '15 de 60 = 25%.'),
    t('promedio', 'Media aritmética de notas o datos.', 'Suma ÷ cantidad.'),
    t('razón', 'Comparación a:b.', '2:5 de niños a niñas.'),
    t('lectura de gráficos', 'Interpretar barras, líneas o tablas para decidir.', 'Ver en qué mes bajó la asistencia.')
  ],
  hidrografia_colombia: [
    t('afluente', 'Río que desemboca en otro río (no directamente en el mar).', 'El Cauca es afluente del Magdalena.'),
    t('cuenca', 'Territorio cuyas aguas drenan hacia un mismo río o mar.', 'Cuenca del Magdalena-Cauca.'),
    t('desembocadura', 'Lugar donde un río entrega sus aguas al mar u otro cuerpo.', 'El Magdalena desemboca en el Caribe.'),
    t('macizo colombiano', 'Nudo montañoso del sur donde nacen grandes ríos.', 'Allí nacen Magdalena y Cauca.'),
    t('vertiente', 'Ladera o región que drena hacia un océano determinado.', 'Vertiente del Pacífico vs Caribe.')
  ],
  geografia: [
    t('región natural', 'Zona con rasgos comunes de relieve, clima y bioma.', 'Andina, Caribe, Pacífica, Orinoquía, Amazonía.'),
    t('altitud', 'Altura sobre el nivel del mar.', 'A mayor altitud, suele bajar la temperatura.'),
    t('páramo', 'Ecosistema de alta montaña tropical, frío y húmedo.', 'Frailejones y retención de agua.'),
    t('cordillera', 'Cadena de montañas.', 'Colombia tiene Occidental, Central y Oriental.'),
    t('manglar', 'Bosque costero en zonas salobres tropicales.', 'Protege costas y cría peces.')
  ],
  historia: [
    t('Independencia', 'Proceso de ruptura con el dominio español (siglo XIX).', '1810: Junta de Bogotá; 1819: Boyacá.'),
    t('colonia', 'Periodo de dominio español en América.', 'Virreinato de la Nueva Granada.'),
    t('República', 'Forma de Estado posterior a la independencia.', 'Constituciones del siglo XIX.'),
    t('proceso histórico', 'Cambio largo con causas y etapas, no un solo día.', 'La independencia fue un proceso.'),
    t('fuente histórica', 'Documento o evidencia del pasado.', 'Actas, cartas, mapas de época.')
  ],
  constitucion: [
    t('Constitución', 'Norma Suprema que organiza el Estado y los derechos.', 'Constitución Política de 1991.'),
    t('rama legislativa', 'Hace las leyes: Congreso (Senado y Cámara).', 'Aprueba o reforman leyes.'),
    t('rama ejecutiva', 'Ejecuta y administra: Presidente y gobierno.', 'Gobierna y aplica políticas.'),
    t('rama judicial', 'Administra justicia: cortes y jueces.', 'Resuelve conflictos según la ley.'),
    t('pesos y contrapesos', 'Control mutuo entre ramas para evitar abuso de poder.', 'El Congreso puede controlar al Ejecutivo.')
  ],
  biologia: [
    t('fotosíntesis', 'Proceso de plantas que convierte luz, CO₂ y agua en glucosa y O₂.', 'Fase luminosa en tilacoides; Calvin fija CO₂.'),
    t('célula', 'Unidad básica de los seres vivos.', 'Tiene membrana, citoplasma y material genético.'),
    t('selección natural', 'Sobreviven y se reproducen más quienes tienen rasgos ventajosos.', 'Cambia la frecuencia de rasgos en la población.'),
    t('población', 'Individuos de la misma especie en un lugar y tiempo.', 'No es lo mismo que comunidad.'),
    t('homeostasis', 'Mantener el equilibrio interno del organismo.', 'Temperatura, glucosa, pH.')
  ],
  fisica: [
    t('velocidad', 'Cambio de posición en el tiempo (vectorial).', 'v = Δx/Δt.'),
    t('aceleración', 'Cambio de velocidad en el tiempo.', 'a = Δv/Δt.'),
    t('fuerza', 'Empuje o atracción que puede cambiar el movimiento (Newton).', 'F = m·a.'),
    t('masa', 'Cantidad de materia; se opone a la aceleración.', 'A mayor m, menor a si F es fija.'),
    t('energía', 'Capacidad de producir cambios (cinética, potencial…).', 'Se conserva en sistemas aislados.')
  ],
  quimica: [
    t('átomo', 'Unidad básica de un elemento (núcleo + electrones).', 'El carbono tiene 6 protones.'),
    t('mol', 'Cantidad de sustancia: 6,022×10²³ entidades.', '1 mol de H₂O ≈ 18 g.'),
    t('reacción química', 'Transformación de sustancias en otras.', '2H₂ + O₂ → 2H₂O.'),
    t('molaridad', 'Concentración: moles de soluto por litro de solución.', 'M = n/V.'),
    t('enlace', 'Fuerza que une átomos (iónico, covalente…).', 'En H₂O los enlaces son covalentes.')
  ],
  cts: [
    t('CTS', 'Ciencia, Tecnología y Sociedad: impactos mutuos.', 'Una presa: energía + efecto ambiental.'),
    t('impacto ambiental', 'Efecto de una acción humana sobre el entorno.', 'Deforestación reduce biodiversidad.'),
    t('riesgo-beneficio', 'Balancear ventajas y daños posibles.', 'Vacunas: beneficio alto, riesgo controlado.'),
    t('evidencia', 'Datos que sostienen una afirmación científica.', 'Mediciones, experimentos, estudios.')
  ],
  indagacion: [
    t('hipótesis', 'Afirmación comprobable que se pone a prueba.', '“Si añado sal, el punto de ebullición sube.”'),
    t('variable independiente', 'Lo que el experimentador manipula.', 'Cantidad de fertilizante.'),
    t('variable dependiente', 'Lo que se mide como efecto.', 'Altura de la planta.'),
    t('control', 'Condiciones que se mantienen iguales.', 'Misma luz y agua en todos los grupos.'),
    t('evidencia', 'Resultados que apoyan o refutan la hipótesis.', 'Tabla de mediciones.')
  ],
  argumentacion: [
    t('premisa', 'Razón o dato que sostiene la conclusión.', '“Todos los humanos son mortales…”'),
    t('conclusión', 'Lo que se afirma a partir de las premisas.', '“…Sócrates es mortal.”'),
    t('falacia', 'Razonamiento inválido que parece convincente.', 'Atacar a la persona (ad hominem).'),
    t('evidencia', 'Apoyo textual o factual de una afirmación.', 'Cita o dato del texto.'),
    t('inferencia', 'Conclusión razonable a partir de pistas del texto.', 'No está literal, pero se deduce.')
  ],
  inferencia: [
    t('inferencia', 'Sacar una conclusión no dicha literalmente, pero apoyada.', 'Si llueve y hay paraguas → probablemente saldrá.'),
    t('pista textual', 'Detalle del texto que permite deducir.', '“Apagó la luz y bostezó” → cansancio.'),
    t('implícito', 'Lo que se entiende sin estar escrito palabra por palabra.', 'Tono irónico, intención.'),
    t('sobrelectura', 'Atribuir al texto lo que no sostiene.', 'Error típico en opciones inventadas.')
  ],
  comprension_literal: [
    t('literal', 'Lo que el texto dice de forma explícita.', 'Nombres, fechas, cifras.'),
    t('idea principal', 'Lo central que el texto comunica.', 'No un detalle secundario.'),
    t('detalle', 'Dato específico que apoya la idea.', 'Una cifra o un ejemplo.'),
    t('parafraseo', 'Decir lo mismo con otras palabras sin cambiar el sentido.', 'Útil para verificar comprensión.')
  ],
  articulacion_global: [
    t('cohesión', 'Enlaces que unen oraciones (conectores, pronombres).', '“Sin embargo”, “además”.'),
    t('coherencia', 'Sentido global sin contradicciones.', 'Todas las partes apuntan al mismo tema.'),
    t('hilo conductor', 'Tema o pregunta que organiza el texto.', 'La tesis del autor.'),
    t('estructura', 'Orden de introducción, desarrollo y cierre.', 'Problema → argumentos → conclusión.')
  ],
  evaluacion_critica: [
    t('tesis', 'Posición central del autor.', 'Lo que defiende el texto.'),
    t('sesgo', 'Inclinación que distorsiona la presentación de hechos.', 'Omitir datos contrarios.'),
    t('fiabilidad', 'Qué tan creíble es una fuente o afirmación.', 'Autor, evidencia, fecha.'),
    t('contraargumento', 'Razón que se opone a la tesis.', 'Sirve para evaluar solidez.')
  ],
  dos_textos: [
    t('comparar', 'Ver semejanzas entre dos textos.', 'Ambos hablan de agua, pero con fines distintos.'),
    t('contrastar', 'Ver diferencias de enfoque o conclusión.', 'Uno informa; el otro persuade.'),
    t('propósito', 'Para qué se escribió el texto.', 'Informar, opinar, instruir.'),
    t('punto de vista', 'Ángulo desde el que se presenta el tema.', 'Técnico vs testimonial.')
  ],
  textos_discontinuos: [
    t('texto discontinuo', 'Información en tablas, gráficos, avisos o infografías.', 'No es un párrafo corrido.'),
    t('leyenda', 'Explica símbolos o colores del gráfico.', 'Azul = lluvias.'),
    t('eje', 'Línea de referencia en un gráfico (x, y).', 'Meses en el eje horizontal.'),
    t('dato', 'Valor concreto leído del visual.', 'En 2020 la barra llega a 40.')
  ],
  filosofia: [
    t('argumento', 'Conjunto de razones que buscan justificar una tesis.', 'Premisas → conclusión.'),
    t('ética', 'Reflexión sobre lo bueno/malo y el deber.', '¿Qué debo hacer?'),
    t('conocimiento', 'Creencia justificada y verdadera (en sentido clásico).', 'No es solo opinión.'),
    t('concepto', 'Idea general que organiza la experiencia.', 'Justicia, libertad, verdad.')
  ],
  pragmatica: [
    t('intención', 'Para qué dice algo el hablante.', 'Pedir, ironizar, informar.'),
    t('contexto', 'Situación (quién, dónde, cuándo) que da sentido al mensaje.', '“¡Fuego!” en teatro ≠ en incendio.'),
    t('acto de habla', 'Acción que se hace al hablar.', 'Prometer, ordenar, preguntar.'),
    t('implicatura', 'Lo que se sugiere sin decirlo literal.', '“Hace frío” → cierra la ventana.')
  ],
  semantica: [
    t('significado', 'Contenido que expresa una palabra o frase.', 'Depende del uso y contexto.'),
    t('sinónimo', 'Palabra de sentido similar.', 'Inicio ≈ comienzo.'),
    t('antónimo', 'Palabra de sentido opuesto.', 'Frío ≠ caliente.'),
    t('ambigüedad', 'Más de un sentido posible.', '“Banco” (asiento / entidad).')
  ],
  literatura: [
    t('figura literaria', 'Recurso estético del lenguaje (metáfora, hipérbole…).', '“Sus ojos eran estrellas.”'),
    t('narrador', 'Voz que cuenta la historia.', 'Primera o tercera persona.'),
    t('tema', 'Idea central de la obra.', 'Amor, soledad, poder.'),
    t('género', 'Categoría: lírico, narrativo, dramático.', 'Un cuento es narrativo.')
  ],
  analisis_textual: [
    t('tesis', 'Afirmación central del texto.', 'Lo que el autor sostiene.'),
    t('recurso', 'Estrategia (ejemplo, dato, pregunta retórica).', 'Sirve para persuadir o explicar.'),
    t('tono', 'Actitud del texto (irónico, solemne, cercano).', 'Se nota en el vocabulario.'),
    t('estructura', 'Partes y orden del texto.', 'Introducción → desarrollo → cierre.')
  ],
  analisis_imagen: [
    t('plano', 'Encuadre de la imagen (general, medio, detalle).', 'Un primer plano destaca la cara.'),
    t('composición', 'Disposición de elementos en el cuadro.', 'Centro, diagonal, regla de tercios.'),
    t('simbólico', 'Elemento que representa una idea.', 'Una balanza puede sugerir justicia.'),
    t('pie de foto', 'Texto que ancla el sentido de la imagen.', 'Evita ambigüedad.')
  ],
  pensamiento_social: [
    t('actor social', 'Persona o grupo que interviene en un problema.', 'Estado, empresa, comunidad.'),
    t('conflicto', 'Choque de intereses o valores.', 'Tierra, derechos, recursos.'),
    t('norma', 'Regla que orienta la conducta colectiva.', 'Ley, costumbre, acuerdo.'),
    t('ciudadanía', 'Condición de derechos y deberes en la comunidad política.', 'Participar y respetar la ley.')
  ],
  pensamiento_sistemico: [
    t('sistema', 'Conjunto de partes que interactúan.', 'Escuela = estudiantes + docentes + normas.'),
    t('retroalimentación', 'Efecto que vuelve a influir en la causa.', 'Más contaminación → más enfermedad → más gasto.'),
    t('efecto cascada', 'Una causa produce varias consecuencias encadenadas.', 'Sequía → cosechas → precios.'),
    t('interdependencia', 'Las partes se afectan mutuamente.', 'Economía y ambiente.')
  ],
  pensamiento_critico: [
    t('evidencia', 'Datos que sostienen un juicio.', 'Sin evidencia, hay opinión débil.'),
    t('supuesto', 'Idea no demostrada que se da por hecha.', 'Hay que hacerlo explícito.'),
    t('contraejemplo', 'Caso que refuta una generalización.', '“Todos…” falla con un solo caso.'),
    t('criterio', 'Norma para evaluar (claridad, relevancia, rigor).', '¿La fuente es confiable?')
  ],
  interpretacion: [
    t('interpretar', 'Explicar el sentido de un dato, norma o hecho social.', 'No es solo repetir el dato.'),
    t('contexto', 'Marco histórico o social del hecho.', 'Sin contexto se malentiende.'),
    t('perspectiva', 'Punto de vista desde el que se mira.', 'Campesino vs empresa.'),
    t('implicación', 'Consecuencia lógica de una lectura.', 'Si X es cierto, entonces Y.')
  ],
  interpretacion_y_analisis: [
    t('análisis', 'Descomponer un problema en partes y relaciones.', 'Causas, actores, efectos.'),
    t('interpretación', 'Dar sentido a los datos del caso.', '¿Qué significa esta cifra?'),
    t('variable social', 'Factor que cambia (ingreso, educación, región).', 'Sirve para comparar.'),
    t('conclusión fundada', 'Juicio apoyado en evidencia del caso.', 'No en prejuicios.')
  ],
  participacion: [
    t('participación ciudadana', 'Intervenir en asuntos públicos de forma legítima.', 'Voto, veeduría, consulta.'),
    t('mecanismo de participación', 'Vía institucional para influir.', 'Cabildo, referendo, tutela (en su rol).'),
    t('deber ciudadano', 'Obligación frente a la comunidad.', 'Respetar derechos de otros.'),
    t('espacio público', 'Ámbito compartido de discusión y decisión.', 'No es solo una plaza física.')
  ],
  competencias_ciudadanas: [
    t('derecho', 'Facultad protegida por la norma.', 'Educación, vida, debido proceso.'),
    t('deber', 'Obligación correlativa al derecho de otros.', 'No agredir, cumplir la ley.'),
    t('conflicto', 'Desacuerdo que exige manejo pacífico.', 'Diálogo, mediación, justicia.'),
    t('empatía', 'Ponerse en el lugar del otro para comprender.', 'Base del respeto.'),
    t('pluralismo', 'Reconocer legítima diversidad de ideas.', 'Sin imponer una sola visión.')
  ],
  aptitud_pedagogica: [
    t('andamiaje', 'Apoyo temporal que se retira al ganar autonomía.', 'Guía pasos y luego suelta.'),
    t('retroalimentación', 'Información sobre el error y cómo mejorar.', 'No solo “mal”.'),
    t('diagnóstico', 'Identificar qué no entiende el estudiante.', 'Antes de seguir adelante.'),
    t('clima de aula', 'Ambiente emocional y de respeto para aprender.', 'Sin burla ante el error.')
  ],
  cloze: [
    t('concordancia', 'El verbo debe coincidir con el sujeto (número/persona).', 'He plays / They play.'),
    t('tiempo verbal', 'Forma del verbo según cuándo ocurre la acción.', 'Yesterday → past simple.'),
    t('presente simple', 'Hábitos y hechos generales.', 'She works every day.'),
    t('pasado simple', 'Acciones terminadas en el pasado.', 'They went yesterday.'),
    t('auxiliar', 'Do/does/did ayudan en negativas y preguntas.', 'Does he live here?')
  ],
  grammar: [
    t('sujeto', 'Quién hace la acción.', 'My brother speaks English.'),
    t('verbo', 'La acción o estado.', 'speaks, is, went.'),
    t('artículo', 'a/an/the delante del sustantivo.', 'a book / the book.'),
    t('preposición', 'Palabra de relación: in, on, at, for…', 'at night / in 2020.'),
    t('conectores', 'Enlazan ideas: because, but, although…', 'I stayed because it rained.')
  ],
  vocabulario: [
    t('contexto', 'Palabras alrededor que revelan el sentido.', 'Bank = banco o orilla, según la frase.'),
    t('sinónimo', 'Palabra de significado parecido.', 'big ≈ large.'),
    t('colocación', 'Combinación natural de palabras.', 'make a decision (no *do a decision).'),
    t('falso amigo', 'Palabra parecida al español con otro sentido.', 'Actually ≈ en realidad (no “actualmente”).')
  ],
  dialogo: [
    t('turno', 'Cada intervención de un hablante.', 'A pregunta; B responde.'),
    t('saludo', 'Fórmula de inicio o cierre.', 'Hi / See you later.'),
    t('petición', 'Pedir algo con cortesía.', 'Could you help me?'),
    t('respuesta coherente', 'Contesta lo que se preguntó.', 'How are you? → Fine, thanks.')
  ],
  aviso: [
    t('aviso', 'Texto breve que informa o prohíbe.', 'No smoking / Opening hours.'),
    t('prohibición', 'Indica lo que no se puede hacer.', 'Do not enter.'),
    t('horario', 'Cuándo abre o cierra un lugar.', 'Open 9 a.m. – 5 p.m.'),
    t('destinatario', 'A quién va dirigido el mensaje.', 'Staff only / Visitors.')
  ],
  lectura: [
    t('main idea', 'Idea principal del texto.', 'What the text is mostly about.'),
    t('detail', 'Dato específico en el texto.', 'A time, name or number.'),
    t('purpose', 'Para qué se escribió el texto.', 'To inform, advise, persuade.'),
    t('inference', 'Conclusión apoyada pero no literal.', 'Use clues, do not invent.')
  ],
  literal_reading: [
    t('literal meaning', 'Exactamente lo que dice el texto.', 'No extras.'),
    t('fact', 'Dato comprobable en el texto.', 'The train leaves at 6:30.'),
    t('wh- question', 'Who/what/when/where/how many…', 'Busca el dato pedido.'),
    t('paraphrase', 'Misma idea con otras palabras.', 'Debes reconocer el equivalente.')
  ],
  inferential_reading: [
    t('inference', 'Deducción con pistas del texto.', 'Not written word for word.'),
    t('clue', 'Palabra o detalle que permite inferir.', '“yawning” → tired.'),
    t('tone', 'Actitud del autor (serio, irónico…).', 'Se nota en el vocabulario.'),
    t('implied', 'Sugerido, no explícito.', 'Between the lines.')
  ]
};

// Aliases banco
TERMINOS_TEMAS.dialogues = TERMINOS_TEMAS.dialogo;
TERMINOS_TEMAS.signs_notices = TERMINOS_TEMAS.aviso;
TERMINOS_TEMAS.lexical_cloze = TERMINOS_TEMAS.cloze;
TERMINOS_TEMAS.vocabulary = TERMINOS_TEMAS.vocabulario;
TERMINOS_TEMAS.reading_comprehension = TERMINOS_TEMAS.lectura;
TERMINOS_TEMAS.grammar_reading = TERMINOS_TEMAS.grammar;

export function terminosDe(id) {
  return TERMINOS_TEMAS[id] || [];
}

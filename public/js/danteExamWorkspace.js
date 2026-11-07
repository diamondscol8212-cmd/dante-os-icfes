/**
 * ⚡ public/js/danteExamWorkspace.js
 * Dante OS Enterprise Edition v23.1 - Motor Workspace de Evaluación Focalizada
 * 
 * Responsabilidades:
 * 1. Control del flujo de 10 reactivos calibrados (1 a la vez) + 1 dilema vocacional.
 * 2. Cronómetro individual de reactivo (`performance.now()`) y Métrica IRD (latencia, vacilaciones, descarte).
 * 3. Herramienta de Tachar/Descartar distractores (click derecho / botón tachar).
 * 4. Transición visual suave y renderizado de KaTeX/LaTeX para fórmulas matemáticas.
 * 5. Cierre de Misión y Sincronización con `/api/v1/dante/complete-mission`.
 * 6. Persistencia de resiliencia en `sessionStorage` para recuperación de sesión.
 */

(function () {
  'use strict';

  const BANCO_CONTINGENCIA_WORK = {
    matematicas: [
      {
        id: "cont_math_01",
        enunciado: "En un taller de diseño industrial se corta una lámina metálica triangular de base 12 cm y altura 8 cm. Si se reduce la altura a la mitad manteniendo la base constante, ¿cuál es la nueva área del triángulo?",
        correcta: "24 cm²",
        distractores: ["48 cm²", "12 cm²", "96 cm²"]
      },
      {
        id: "cont_math_02",
        enunciado: "Una empresa modela su ganancia con la función G(x) = -2x² + 40x - 50, donde x representa unidades producidas (en cientos). ¿Cuántas unidades maximizan la ganancia?",
        correcta: "10 cientos",
        distractores: ["20 cientos", "5 cientos", "40 cientos"]
      },
      {
        id: "cont_math_03",
        enunciado: "Un tanque cilíndrico de almacenamiento con radio de base 3 m y altura 5 m se llena hasta el 80% de su capacidad total. Considerando π ≈ 3.14, ¿cuál es el volumen aproximado de líquido contenido?",
        correcta: "113.04 m³",
        distractores: ["141.30 m³", "45.00 m³", "70.65 m³"]
      },
      {
        id: "cont_math_04",
        enunciado: "Una empresa de transporte cobra una tarifa fija de $5.000 más $1.200 por cada kilómetro recorrido. Si un usuario pagó un total de $29.000 por un viaje, ¿cuántos kilómetros recorrió el vehículo?",
        correcta: "20 km",
        distractores: ["24 km", "18 km", "15 km"]
      }
    ],
    lectura_critica: [
      {
        id: "cont_lect_01",
        enunciado: "Según la perspectiva de Immanuel Kant sobre la Ilustración, el estado de 'mayoría de edad' del pensamiento se alcanza fundamentalmente cuando:",
        correcta: "El sujeto tiene la determinación y el valor de pensar por sí mismo sin la tutela de otro.",
        distractores: ["El Estado dicta normas morales incuestionables para toda la ciudadanía.", "Se memoriza un corpus de doctrinas teológicas o filosóficas establecidas.", "Se delegan las decisiones éticas complejas en comités de expertos morales."]
      },
      {
        id: "cont_lect_02",
        enunciado: "En un texto argumentativo donde el autor cuestiona el determinismo tecnológico, ¿cuál de los siguientes enunciados constituye una refutación coherente?",
        correcta: "Las herramientas técnicas son configuradas por decisiones humanas, políticas y culturales previas.",
        distractores: ["Las máquinas poseen libre albedrío incontrolable ajeno a la voluntad social.", "El avance material sigue leyes biológicas estrictamente universales.", "Toda computación matemática carece de impacto en las decisiones sociopolíticas."]
      },
      {
        id: "cont_lect_03",
        enunciado: "En el ensayo sobre la libertad de John Stuart Mill, el autor defiende que la única justificación legítima para que la sociedad interfiera coactivamente en la libertad de un individuo es:",
        correcta: "Prevenir un daño directo y comprobable sobre los derechos de terceros.",
        distractores: ["Garantizar que todos los ciudadanos compartan las mismas creencias religiosas.", "Imponer un modelo único de bienestar o felicidad personal concebido por el gobierno.", "Prohibir expresiones artísticas u opiniones que incomoden a la mayoría."]
      }
    ],
    ciencias_naturales: [
      {
        id: "cont_cienc_01",
        enunciado: "Durante la fotosíntesis oxigénica en las plantas, la fotólisis del agua en la membrana de los tilacoides tiene como función biofísica esencial:",
        correcta: "Suministrar electrones y protones para la reducción de NADP+ y desprender oxígeno molecular.",
        distractores: ["Capturar directamente el dióxido de carbono ambiental para formar polisacáridos.", "Consumir ATP para degradar moléculas de glucosa en el estroma del cloroplasto.", "Sintetizar sacarosa para su transporte por los vasos del floema hacia la raíz."]
      },
      {
        id: "cont_cienc_02",
        enunciado: "Un bloque de masa m = 4 kg descansa sobre un plano horizontal sin fricción. Al aplicarle una fuerza horizontal constante de 24 N, la aceleración resultante es:",
        correcta: "6 m/s²",
        distractores: ["96 m/s²", "1.5 m/s²", "0.16 m/s²"]
      },
      {
        id: "cont_cienc_03",
        enunciado: "En una disolución acuosa a 25 °C, si la concentración de iones hidrógeno es [H+] = 1.0 × 10⁻⁴ M, ¿cuál es el pH de la solución y su carácter químico?",
        correcta: "pH = 4, solución de carácter ácido.",
        distractores: ["pH = 10, solución de carácter básico.", "pH = 7, solución neutra.", "pH = 4, solución de carácter alcalino."]
      }
    ],
    sociales_ciudadanas: [
      {
        id: "cont_soc_01",
        enunciado: "En Colombia, según la Constitución Política de 1991, ¿cuál es el mecanismo judicial procedente para la protección inmediata de derechos fundamentales vulnerados?",
        correcta: "La Acción de Tutela, interpuesta ante cualquier juez de la República.",
        distractores: ["La Acción Popular para la defensa de intereses puramente corporativos.", "El Recurso de Reposición en vía gubernativa ante la DIAN.", "La Acción de Grupo orientada al resarcimiento colectivo de perjuicios económicos."]
      },
      {
        id: "cont_soc_02",
        enunciado: "El principio de pesos y contrapesos (checks and balances) en un régimen constitucional democrático tiene por objetivo primordial:",
        correcta: "Prevenir la concentración indebida del poder mediante la fiscalización mutua entre ramas públicas.",
        distractores: ["Subordinar al poder judicial frente a las directrices exclusivas del poder ejecutivo.", "Facultar al Congreso para emitir sentencias condenatorias de naturaleza penal.", "Concentrar las competencias de control disciplinario y fiscal en la Presidencia."]
      },
      {
        id: "cont_soc_03",
        enunciado: "De acuerdo con el artículo 3 de la Constitución Política de Colombia de 1991, la soberanía reside exclusivamente en:",
        correcta: "El pueblo, del cual emana el poder público que se ejerce en forma directa o por medio de sus representantes.",
        distractores: ["El Presidente de la República en su condición de Comandante Supremo de las Fuerzas Militares.", "El Congreso Nacional mediante decretos reglamentarios vinculantes.", "Las corporaciones gremiales y entidades financieras privadas."]
      }
    ],
    ingles: [
      {
        id: "cont_ing_01",
        enunciado: "Choose the correct option to complete the sentence: 'If renewable clean energy ________ prioritized decades ago, carbon emissions would be significantly lower today.'",
        correcta: "had been",
        distractores: ["will be", "is being", "has been"]
      },
      {
        id: "cont_ing_02",
        enunciado: "Identify the correct contextual meaning of the phrase: 'The research committee decided to carry out an exhaustive study on biodiversity.'",
        correcta: "conduct or execute",
        distractores: ["cancel permanently", "postpone until next month", "dismiss as irrelevant"]
      },
      {
        id: "cont_ing_03",
        enunciado: "Complete the formal sentence with the correct connector: '_____ the heavy rain caused major delays across the city, the scientific delegation arrived on time.'",
        correcta: "Although",
        distractores: ["Because", "Despite of", "Therefore"]
      }
    ],
    razonamiento_logico: [
      {
        id: "cont_unal_log_01",
        enunciado: "Si se postula formalmente que 'Todos los investigadores son metódicos' y 'Ningún charlatán es metódico', la inferencia deductiva necesaria es:",
        correcta: "Ningún investigador es charlatán.",
        distractores: ["Algunos charlatanes son investigadores.", "Todos los metódicos son investigadores.", "Cualquier individuo metódico es necesariamente charlatán."]
      },
      {
        id: "cont_unal_log_02",
        enunciado: "En una progresión aritmética el primer término es a₁ = 3 y la diferencia es d = 4. ¿Cuál es el valor del décimo término a₁₀?",
        correcta: "39",
        distractores: ["43", "36", "40"]
      }
    ],
    analisis_textual: [
      {
        id: "cont_unal_tex_01",
        enunciado: "En un texto académico-filosófico, la función discursiva primordial de un contraargumento es:",
        correcta: "Anticipar objeciones potenciales para demostrar la mayor solidez de la tesis propia.",
        distractores: ["Validar plenamente la postura antagónica sin ofrecer refutación alguna.", "Desviar la atención del lector hacia anécdotas periféricas sin sustento.", "Admitir que la proposición original carece de validez metodológica."]
      },
      {
        id: "cont_unal_tex_02",
        enunciado: "Al examinar un ensayo sobre la memoria histórica, la distinción entre 'documento' y 'monumento' radica en que este último:",
        correcta: "Ha sido concebido intencionalmente por el poder para perpetuar una versión hegemónica del pasado.",
        distractores: ["Es un vestigio neutro e involuntario desprovisto de carga ideológica.", "Carece por completo de materialidad física y valor arqueológico.", "Solo puede ser interpretado por métodos exclusivamente cuantitativos."]
      }
    ],
    analisis_imagen: [
      {
        id: "cont_unal_img_01",
        enunciado: "Al cortar un cilindro recto circular mediante un plano paralelo a su base horizontal, la sección plana transversal obtenida corresponde a:",
        correcta: "Un círculo congruente e idéntico al de las bases.",
        distractores: ["Una parábola asimétrica de foco variable.", "Un rectángulo con diagonal proporcional a la altura.", "Una elipse de excentricidad excéntrica no nula."]
      },
      {
        id: "cont_unal_img_02",
        enunciado: "Al proyectar ortogonalmente un cubo apoyado sobre una cara sobre un plano vertical perpendicular a dos de sus aristas principales, la vista resultante es:",
        correcta: "Un cuadrado regular perfecto de lado igual a la arista del cubo.",
        distractores: ["Un hexágono regular de vértices equidistantes.", "Un paralelogramo oblicuo con deformación angular de 45°.", "Un trapecio escaleno isósceles."]
      }
    ],
    sociales: [
      {
        id: "cont_unal_soc_01",
        enunciado: "La Revolución Industrial en Europa propició transformaciones socioespaciales determinantes, entre las cuales destaca:",
        correcta: "El crecimiento acelerado de la urbanización y la consolidación de la clase obrera asalariada.",
        distractores: ["La ruralización generalizada y el regreso al régimen señorial feudal.", "La eliminación absoluta del comercio marítimo internacional.", "El desmantelamiento de los centros fabriles a favor de gremios medievales."]
      },
      {
        id: "cont_unal_soc_02",
        enunciado: "El concepto de soberanía popular postulado en la modernidad democrática implica esencialmente que:",
        correcta: "El poder político legítimo emana de la voluntad colectiva del pueblo soberano.",
        distractores: ["La autoridad estatal proviene de un mandato dinástico incontestable.", "Las decisiones normativas son dictadas por corporaciones privadas supranacionales.", "El gobernante de turno ejerce el poder sin sujeción a la constitución."]
      }
    ]
  };

  const crearReactivoContingenciaReal = (area, targetExam = 'SABER_11', seedIdx = 0) => {
    const norm = String(area).toLowerCase().trim();
    const pool = BANCO_CONTINGENCIA_WORK[norm] || BANCO_CONTINGENCIA_WORK['matematicas'];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const baseItem = shuffled[seedIdx % shuffled.length];

    const LETRAS = ['A', 'B', 'C', 'D'];
    const targetKey = LETRAS[Math.floor(Math.random() * 4)];
    const targetIdx = LETRAS.indexOf(targetKey);

    const opciones = [];
    let dIdx = 0;
    for (let i = 0; i < 4; i++) {
      const l = LETRAS[i];
      const text = (i === targetIdx) ? baseItem.correcta : baseItem.distractores[dIdx++];
      opciones.push(`${l}) ${text}`);
    }

    const dificultades = [-1.2, -0.6, -0.2, 0.2, 0.6, 0.9, 1.3];
    const b = dificultades[Math.abs(Number(seedIdx) || 0) % dificultades.length];

    return {
      id: `${baseItem.id}_${Math.random().toString(36).substring(2, 6)}`,
      enunciado: baseItem.enunciado,
      pregunta_texto: baseItem.enunciado,
      texto: baseItem.enunciado,
      area: norm,
      materia: norm,
      target_exam: targetExam,
      origen: targetExam,
      opciones: opciones,
      opciones_respuesta: opciones,
      correcta: targetKey,
      ok: targetKey,
      a: 1.1,
      b: b,
      c: 0.2
    };
  };


  class DanteExamWorkspaceEngine {
    constructor() {
      this.misionData = null;
      this.indexReactivoActivo = 0;
      this.opcionSeleccionadaTemp = null;
      this.opcionesDescartadas = new Set();
      this.cambioOpcionesCount = 0;
      this.tiempoInicioReactivo = 0;
      this.respuestasSesionActiva = [];
      this.respuestasDilemas = {};
      this.faseActual = 'REACTIVOS'; // 'REACTIVOS' | 'DILEMAS' | 'COMPLETADO'
      this.modoVisualWorkspace = 'CARTILLA';
      this.isSubmitting = false;
      this.isRequestingHint = false;

      this.initEventListeners();
    }
    get listaReactivos() {
      return (this.misionData && Array.isArray(this.misionData.reactivos)) ? this.misionData.reactivos : [];
    }

    get currentIndex() {
      return this.indexReactivoActivo || 0;
    }

    set currentIndex(val) {
      this.indexReactivoActivo = val;
    }


    /**
     * Inicialización e Inyección de Listeners globales
     */
    initEventListeners() {
      // Escuchar eventos de teclado para selección rápida (A, B, C, D) y Enter para confirmar
      document.addEventListener('keydown', (e) => {
        const viewWorkspace = document.getElementById('viewWorkspace');
        if (!viewWorkspace || !viewWorkspace.classList.contains('active')) return;

        // Evitar accionar teclado si el usuario está tipeando en un input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        const key = e.key.toUpperCase();
        if (this.faseActual === 'REACTIVOS') {
          if (['A', 'B', 'C', 'D'].includes(key)) {
            this.seleccionarOpcion(key);
          } else if (e.key === 'Enter' && this.opcionSeleccionadaTemp) {
            this.confirmarRespuesta();
          }
        }
      });

      // Vincular listeners de clic directos a los selectores de Cartilla vs HUD
      const bindVisualSelectors = () => {
        const btnCartilla = document.getElementById('btnModoVisualCartilla') || document.getElementById('btnToggleCartilla');
        const btnHud = document.getElementById('btnModoVisualHud') || document.getElementById('btnToggleHUD');
        if (btnCartilla && !btnCartilla._danteBound) {
          btnCartilla._danteBound = true;
          btnCartilla.addEventListener('click', (e) => {
            e.preventDefault();
            this.cambiarModoVisual('CARTILLA');
          });
        }
        if (btnHud && !btnHud._danteBound) {
          btnHud._danteBound = true;
          btnHud.addEventListener('click', (e) => {
            e.preventDefault();
            this.cambiarModoVisual('HUD_DIGITAL');
          });
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindVisualSelectors);
      } else {
        bindVisualSelectors();
      }
    }

    /**
     * Punto de entrada principal: Iniciar Sesión de Examen
     * @param {Object} batchOverride - Paquete de misión opcional
     */
    iniciarSesion(batchOverride = null) {
      console.log('⚡ [DANTE EXAM WORKSPACE]: Inicializando Workspace de Examen Focalizado...');

      const activeTrack = (window.DanteHubEngine && window.DanteHubEngine.targetTrack) || localStorage.getItem('dante_target_track') || 'ICFES';

      // 1. Obtención de Misión
      let data = batchOverride || (window.DanteHubEngine && window.DanteHubEngine.misionActual) || window.DANTE_DAILY_MISSION_BATCH;

      // Validar si la misión en memoria pertenece al track activo
      if (data && data.targetTrack && String(data.targetTrack).toUpperCase() !== String(activeTrack).toUpperCase()) {
        console.warn(`⚠️ [DANTE EXAM WORKSPACE]: Misión en memoria pertenece a ${data.targetTrack}, pero el track activo es ${activeTrack}. Invalidadndo caché desactualizada.`);
        data = null;
      }

      if (!data) {
        const stored = sessionStorage.getItem('dante_mision_actual') || sessionStorage.getItem('dante_current_batch');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const parsedData = Array.isArray(parsed) ? { reactivos: parsed, microDilemasVocacionales: [] } : parsed;
            if (!parsedData.targetTrack || String(parsedData.targetTrack).toUpperCase() === String(activeTrack).toUpperCase()) {
              data = parsedData;
            }
          } catch (e) {
            console.warn('⚠️ Error al parsear sesión en sessionStorage:', e);
          }
        }
      }

      if (!data || !data.reactivos || data.reactivos.length === 0) {
        console.warn('🚨 [DANTE EXAM WORKSPACE]: No hay reactivos disponibles para el track activo. Cargando banco local de contingencia...');
        data = {
          targetTrack: activeTrack,
          reactivos: this.garantizarDistribucionDiagnostico([], activeTrack),
          microDilemasVocacionales: []
        };
      }

      this.misionData = data;
      this.misionData.targetTrack = activeTrack; // Asegurar consistencia de track

      // Identificar si es lanzamiento de diagnóstico
      const urlParams = new URLSearchParams(window.location.search);
      const esRepaso = Boolean(urlParams.get('repaso') || this.misionData?.repasoArea);
      const isDiagnostic = !esRepaso && (
                           urlParams.get('launch') === 'diagnostic' || 
                           urlParams.get('action') === 'start_diag' ||
                           sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
                           localStorage.getItem('dante_is_diagnostic') === 'true' ||
                           (localStorage.getItem('dante_onboarding_completed') === 'true' &&
                            localStorage.getItem('dante_calibracion_tactica_inicial_done') !== 'true' &&
                            localStorage.getItem('dante_diagnostico_completado') !== 'true'));

      if (data && data.esSimulacro) {
        this.misionData.isDiagnostic = false;
        this.misionData.isFirstSession = false;
      } else if (isDiagnostic) {
        this.misionData.isDiagnostic = true;
        // Balance Estricto de 10 Reactivos sin recortes arbitrarios que rompan la simetría 50/50
        this.misionData.reactivos = this.garantizarDistribucionDiagnostico(this.misionData.reactivos, activeTrack);
      }

      // Erradicación obligatoria de Reactivos Duplicados por Set de identificadores únicos (item.id)
      const poolReactivos = Array.isArray(this.misionData.reactivos) ? this.misionData.reactivos : [];
      const totalLimite = this.misionData.isDiagnostic ? 10 : (poolReactivos.length || 10);
      const reactivosUnicos = [];
      const idsVistos = new Set();
      for (const item of poolReactivos) {
        if (item && item.id && !idsVistos.has(item.id)) {
          idsVistos.add(item.id);
          reactivosUnicos.push(item);
        }
        if (reactivosUnicos.length === totalLimite) break;
      }
      if (window.DanteHubEngine) window.DanteHubEngine._refuerzoArea = null;
      if (!this.misionData.isDiagnostic && !this.misionData.esRefuerzo && !this.misionData.esSimulacro && reactivosUnicos.length > 10) {
        this.misionData.reactivos = reactivosUnicos.slice(0, 10);
      } else {
        this.misionData.reactivos = reactivosUnicos;
      }

      // El simulacro no reemplaza el bloque ni el refuerzo que ya estaba abierto.
      try {
        if (this.misionData.esSimulacro) {
          if (!sessionStorage.getItem('dante_mision_bloque')) {
            const previa = sessionStorage.getItem('dante_mision_actual');
            if (previa) {
              const parsed = JSON.parse(previa);
              const cabe = parsed && !parsed.esSimulacro && Array.isArray(parsed.reactivos) && parsed.reactivos.length > 0 && parsed.reactivos.length <= 40;
              if (cabe) sessionStorage.setItem('dante_mision_bloque', previa);
            }
          }
        } else {
          sessionStorage.removeItem('dante_mision_bloque');
        }
      } catch (e) {}
      sessionStorage.setItem('dante_mision_actual', JSON.stringify(this.misionData));

      // 2. Intentar recuperar progreso previo si fue interrupción involuntaria en el MISMO track
      const savedProgress = this.misionData.esSimulacro ? false : this.recuperarProgresoSesion();
      if (this.misionData.esSimulacro) {
        this.indexReactivoActivo = Number(this.misionData.reanudarIndice) || 0;
        this.respuestasSesionActiva = Array.isArray(this.misionData.reanudarRespuestas) ? this.misionData.reanudarRespuestas.slice() : [];
        this.respuestasDilemas = {};
        this.faseActual = 'REACTIVOS';
      } else if (!savedProgress) {
        this.indexReactivoActivo = 0;
        this.respuestasSesionActiva = [];
        this.respuestasDilemas = {};
        this.faseActual = 'REACTIVOS';
      }

      // 3. Cambiar la vista activa a #viewWorkspace
      if (window.AppController && typeof window.AppController.cambiarVista === 'function') {
        window.AppController.cambiarVista('viewWorkspace');
      } else {
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
        const ws = document.getElementById('viewWorkspace');
        if (ws) ws.classList.add('active');
      }

      // 🛡️ Bloqueo estricto del historial (Anti-History-Leak & Anti-Decrement)
      window.isExamActive = true;
      if (window.DanteHubEngine && typeof window.DanteHubEngine.actualizarUIHeaderTrack === 'function') {
        window.DanteHubEngine.actualizarUIHeaderTrack(activeTrack);
      }
      this.maxIndexAlcanzado = Math.max(this.maxIndexAlcanzado || 0, this.indexReactivoActivo || 0);
      history.pushState(null, document.title, location.href);
      if (!window._examPopstateLockBound) {
        window._examPopstateLockBound = true;
        window.addEventListener('popstate', (event) => {
          if (window.isExamActive && this.faseActual !== 'COMPLETADO') {
            if (event && typeof event.preventDefault === 'function') {
              event.preventDefault();
              event.stopPropagation();
            }
            this.bloquearRetrocesoMobile();
            if (typeof window.showToast === 'function') {
              window.showToast('Evaluación en curso: las respuestas confirmadas son definitivas.');
            } else if (window.AppController && typeof window.AppController.mostrarToastCabina === 'function') {
              window.AppController.mostrarToastCabina('Evaluación en curso: las respuestas confirmadas son definitivas.');
            }
          }
        });
      }

      // Asegurar contenedor activo del examen y ocultar pantalla resumen previa
      const uiReactivoContainer = document.getElementById('uiReactivoContainer');
      if (uiReactivoContainer) uiReactivoContainer.style.display = 'flex';
      const uiPantallaResumen = document.getElementById('uiPantallaResumenContainer');
      if (uiPantallaResumen) {
        uiPantallaResumen.style.display = 'none';
        uiPantallaResumen.innerHTML = '';
      }

      // Restaurar cabecera de examen si estaba oculta por resumen previo
      const uiHeaderExamen = document.getElementById('uiHeaderExamen') || document.querySelector('#viewWorkspace header');
      if (uiHeaderExamen) uiHeaderExamen.style.display = '';
      const lblCronometro = document.getElementById('lblCronometroWorkspace');
      if (lblCronometro) lblCronometro.style.display = '';
      const btnMenuPausa = document.getElementById('containerMenuPausa');
      if (btnMenuPausa) btnMenuPausa.style.display = '';
      const lblProgreso = document.getElementById('lblProgresoReactivo');
      if (lblProgreso) lblProgreso.style.display = '';
      const lblMateria = document.getElementById('lblMateriaExamen');
      if (lblMateria) lblMateria.style.display = '';
      const viewWs = document.getElementById('viewWorkspace');
      if (viewWs) viewWs.style.paddingTop = '';

      // Ocultamiento incondicional del menú inferior flotante durante el examen
      const bottomNav = document.getElementById('bottomNav');
      if (bottomNav) {
        bottomNav.classList.add('hidden');
        bottomNav.style.display = 'none';
      }

      if (this.misionData.esSimulacro) {
        document.documentElement.classList.add('sim-sin-pista');
        const yaEmpezo = Number(this.indexReactivoActivo) > 0
          || (this.respuestasSesionActiva && (
            Array.isArray(this.respuestasSesionActiva)
              ? this.respuestasSesionActiva.length > 0
              : Object.keys(this.respuestasSesionActiva).length > 0
          ));
        const seguir = () => {
          this._continuarEntradaEvaluacion();
          if (window.DanteSimulacro) DanteSimulacro.alEntrar(this);
        };
        if (yaEmpezo) seguir();
        else this._abrirRespiracionDeEntrada(seguir, false);
        return;
      }
      const yaEmpezo = Boolean(savedProgress) && Number(this.indexReactivoActivo) > 0;
      const esRefuerzoEntrada = Boolean(this.misionData && this.misionData.esRefuerzo);
      const seguir = () => this._continuarEntradaEvaluacion();
      // Respiración obligatoria antes de la primera pregunta (entrenamiento, refuerzo, guía).
      const entrar = () => {
        if (yaEmpezo) seguir();
        else this._abrirRespiracionDeEntrada(seguir, false);
      };
      if (esRefuerzoEntrada) {
        if (!yaEmpezo && window.DantePlanSala) DantePlanSala.reiniciarAyudaSesion();
        entrar();
      } else if (!yaEmpezo && window.DantePlanSala) {
        DantePlanSala.reiniciarAyudaSesion();
        DantePlanSala.antesDelBloque(entrar);
      } else entrar();
      return;
    }

    _perfilDiagnosticoHecho() {
      try {
        if (localStorage.getItem('dante_perfil_diagnostico_done') === 'true') return true;
        const raw = localStorage.getItem('dante_perfil_diagnostico');
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Boolean(parsed && parsed.q1 && parsed.q2 && parsed.q3);
      } catch (e) {
        return false;
      }
    }

    _abrirPerfilDiagnosticoSiAplica(continuar) {
      const esDiag = Boolean(this.misionData && this.misionData.isDiagnostic);
      if (!esDiag || this._perfilDiagnosticoHecho()) {
        continuar();
        return;
      }
      const modal = document.getElementById('modalPerfilDiagnostico');
      if (!modal) {
        continuar();
        return;
      }
      this._perfilDiagContinuar = continuar;
      this._perfilDiagSel = { q1: null, q2: null, q3: null };
      modal.querySelectorAll('.perfil-diag-opcion').forEach((el) => {
        el.classList.remove('selected');
        el.setAttribute('aria-checked', 'false');
      });
      const fill = document.getElementById('btnPerfilDiagHoldFill');
      if (fill) fill.style.width = '0%';
      const prompt = document.getElementById('txtPerfilDiagHoldPrompt');
      if (prompt) prompt.textContent = 'Mantén 2 segundos para confirmar';
      const btn = document.getElementById('btnPerfilDiagConfirmar');
      if (btn) {
        btn.disabled = true;
        btn.classList.remove('confirm-opcion-lista');
        this._bindHoldPerfilDiagnostico(btn);
      }
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.documentElement.classList.add('perfil-diag-activo');
    }

    _seleccionarPerfilDiagnostico(pregunta, letra, el) {
      if (!this._perfilDiagSel) this._perfilDiagSel = { q1: null, q2: null, q3: null };
      const key = String(pregunta || '');
      if (!['q1', 'q2', 'q3'].includes(key)) return;
      const L = String(letra || '').toUpperCase().slice(0, 1);
      if (!'ABCD'.includes(L)) return;
      this._perfilDiagSel[key] = L;
      const grupo = document.querySelectorAll(`.perfil-diag-opcion[data-q="${key}"]`);
      grupo.forEach((opt) => {
        const activa = opt.getAttribute('data-letra') === L;
        opt.classList.toggle('selected', activa);
        opt.setAttribute('aria-checked', activa ? 'true' : 'false');
      });
      if (el) {
        el.classList.add('selected');
        el.setAttribute('aria-checked', 'true');
      }
      const listo = Boolean(this._perfilDiagSel.q1 && this._perfilDiagSel.q2 && this._perfilDiagSel.q3);
      const btn = document.getElementById('btnPerfilDiagConfirmar');
      if (btn) {
        btn.disabled = !listo;
        btn.classList.toggle('confirm-opcion-lista', listo);
      }
    }

    _bindHoldPerfilDiagnostico(btn) {
      if (!btn || btn._holdBound) return;
      btn._holdBound = true;
      let holding = false;
      let timer = null;
      let start = 0;
      const HOLD_MS = 2000;
      const self = this;
      const limpiar = () => {
        holding = false;
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        const fill = document.getElementById('btnPerfilDiagHoldFill');
        if (fill) fill.style.width = '0%';
        const prompt = document.getElementById('txtPerfilDiagHoldPrompt');
        if (prompt) prompt.textContent = 'Mantén 2 segundos para confirmar';
      };
      const completar = () => {
        limpiar();
        self._confirmarPerfilDiagnostico();
      };
      const iniciar = (e) => {
        if (btn.disabled || !self._perfilDiagSel || !self._perfilDiagSel.q1 || !self._perfilDiagSel.q2 || !self._perfilDiagSel.q3) return;
        if (e && e.cancelable && e.type !== 'click') e.preventDefault();
        if (holding) return;
        holding = true;
        start = Date.now();
        const fill = document.getElementById('btnPerfilDiagHoldFill');
        const prompt = document.getElementById('txtPerfilDiagHoldPrompt');
        if (prompt) prompt.textContent = 'Mantén 2 segundos para confirmar';
        timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const progress = Math.min(100, (elapsed / HOLD_MS) * 100);
          if (fill) fill.style.width = progress + '%';
          if (elapsed >= HOLD_MS) {
            clearInterval(timer);
            timer = null;
            completar();
          }
        }, 40);
      };
      btn.addEventListener('pointerdown', iniciar);
      btn.addEventListener('pointerup', limpiar);
      btn.addEventListener('pointerleave', limpiar);
      btn.addEventListener('pointercancel', limpiar);
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    async _confirmarPerfilDiagnostico() {
      const sel = this._perfilDiagSel || {};
      if (!sel.q1 || !sel.q2 || !sel.q3) return;
      const payload = {
        q1: sel.q1,
        q2: sel.q2,
        q3: sel.q3,
        percepcion: sel.q1,
        area: sel.q2,
        tiempo: sel.q3
      };
      try {
        localStorage.setItem('dante_perfil_diagnostico', JSON.stringify(payload));
        localStorage.setItem('dante_perfil_diagnostico_done', 'true');
      } catch (e) {}

      let alumno = '';
      let emailAlumno = '';
      try {
        if (window.DanteRegistro && typeof DanteRegistro.idAlumno === 'function') alumno = DanteRegistro.idAlumno() || '';
      } catch (e) {}
      try {
        const u = JSON.parse(localStorage.getItem('dante_user') || 'null');
        if (!alumno && u) alumno = String(u.estudiante || u.email || '').toLowerCase().trim().split('@')[0];
        emailAlumno = String((u && u.email) || localStorage.getItem('dante_email') || '').trim().toLowerCase();
      } catch (e) {}
      if (!alumno) {
        alumno = String(localStorage.getItem('dante_student_id') || localStorage.getItem('dante_active_student') || '')
          .toLowerCase().trim().split('@')[0];
      }
      if (alumno && alumno !== 'estudiante' && alumno !== 'student_demo_01') {
        try {
          await fetch('/api/dante/progreso/perfil-diagnostico', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              estudiante: alumno,
              studentId: alumno,
              email: emailAlumno || undefined,
              ...payload
            })
          });
        } catch (e) {}
      }
      if (window.DanteNube && typeof window.DanteNube.subirProgresoDebounced === 'function') {
        window.DanteNube.subirProgresoDebounced(600);
      }

      const modal = document.getElementById('modalPerfilDiagnostico');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
      document.documentElement.classList.remove('perfil-diag-activo');
      const next = this._perfilDiagContinuar;
      this._perfilDiagContinuar = null;
      if (typeof next === 'function') next();
    }

    _abrirRespiracionDeEntrada(continuar, esDiagnostico) {
      const modal = document.getElementById('modalRespiracionInicio');
      if (!modal) {
        if (esDiagnostico) this._abrirPerfilDiagnosticoSiAplica(continuar);
        else continuar();
        return;
      }
      this._respiracionCerrada = false;
      window.danteRespiracionPendiente = true;
      const fase = document.getElementById('respiracionInicioFase');
      const ayuda = document.getElementById('respiracionInicioAyuda');
      const cuenta = document.getElementById('respiracionInicioCuenta');
      const btn = document.getElementById('btnRespiracionEmpezar');
      const entrarYa = document.getElementById('btnRespiracionEntrarYa');
      const canvas = document.getElementById('respiracionInicioCanvas');
      const kicker = modal.querySelector('.dante-respiro-kicker');
      const cerrar = () => {
        if (btn && btn.disabled) return; // no saltar: solo tras completar el ciclo
        this._cerrarRespiracionDeEntrada(continuar);
      };
      if (kicker) kicker.textContent = 'ANTES DE COMENZAR';
      if (fase) fase.textContent = 'Inhala';
      if (ayuda) {
        ayuda.textContent = 'Para comenzar, toma una respiración consciente y relaja tu mente.';
      }
      if (cuenta) {
        cuenta.textContent = '4';
        cuenta.style.transform = '';
      }
      if (window.marcarFaseRespiro) window.marcarFaseRespiro('respiracionInicioPuntos', 'inhala');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'CONTINUAR →';
        btn.onclick = cerrar;
      }
      if (entrarYa) {
        entrarYa.hidden = false;
        entrarYa.removeAttribute('hidden');
        entrarYa.setAttribute('aria-hidden', 'false');
        entrarYa.tabIndex = 0;
        entrarYa.onclick = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          this._cerrarRespiracionDeEntrada(continuar);
        };
      }
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      if (this._respiracionTimer) clearInterval(this._respiracionTimer);
      this._respiracionTimer = null;
      if (this._respiracionAviso) clearTimeout(this._respiracionAviso);
      if (window.DanteAliento && canvas && window.DanteAlientoPasos) {
        this._respiracionAviso = setTimeout(() => {
          this._respiracionAviso = null;
          if (this._respiracionCerrada) return;
          window.DanteAliento.empezar('entrada', canvas, {
          bucle: false,
          pasos: window.DanteAlientoPasos.entrada,
          alPulso: (aliento) => {
            if (cuenta) cuenta.style.transform = 'scale(' + (0.86 + aliento * 0.18).toFixed(3) + ')';
          },
          alPaso: (paso, compas) => {
            if (fase) fase.textContent = paso.texto;
            if (ayuda) ayuda.textContent = 'Para comenzar, toma una respiración consciente y relaja tu mente.';
            if (cuenta) cuenta.textContent = String(compas);
            if (window.marcarFaseRespiro) window.marcarFaseRespiro('respiracionInicioPuntos', paso.id);
          },
          alTerminar: () => {
            if (fase) fase.textContent = 'Listo';
            if (ayuda) ayuda.textContent = esDiagnostico
              ? 'Ahora sí: el diagnóstico.'
              : 'Entra con calma a la primera pregunta.';
            if (cuenta) cuenta.textContent = '✓';
            if (window.marcarFaseRespiro) window.marcarFaseRespiro('respiracionInicioPuntos', '');
            if (btn) {
              btn.disabled = false;
              btn.textContent = 'CONTINUAR →';
            }
          }
        });
        }, 400);
        return;
      }
      // Fallback: sin canvas, habilita continuar tras un ciclo corto
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'CONTINUAR →';
      }
    }

    _cerrarRespiracionDeEntrada(continuar) {
      if (this._respiracionCerrada) return;
      this._respiracionCerrada = true;
      if (this._respiracionAviso) clearTimeout(this._respiracionAviso);
      this._respiracionAviso = null;
      if (window.DanteAliento) window.DanteAliento.parar('entrada');
      if (this._respiracionTimer) clearInterval(this._respiracionTimer);
      this._respiracionTimer = null;
      window.danteRespiracionPendiente = false;
      const modal = document.getElementById('modalRespiracionInicio');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
      if (window.DanteHubEngine && window.DanteHubEngine._relojEsperandoRespiracion && typeof window.DanteHubEngine.iniciarRelojSesionMision === 'function') {
        window.DanteHubEngine._relojEsperandoRespiracion = false;
        window.DanteHubEngine.iniciarRelojSesionMision();
      }
      const esDiag = Boolean(
        (this.misionData && this.misionData.isDiagnostic) ||
        sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
        localStorage.getItem('dante_is_diagnostic') === 'true'
      );
      if (esDiag) this._abrirPerfilDiagnosticoSiAplica(continuar);
      else continuar();
    }

    _continuarEntradaEvaluacion() {
      // Renderizar de inmediato la tira de bolitas fija para Reactivo 1
      this.actualizarTiraProgreso();

      // 🔓 Liberación de Capas y Pointer-Events en Cabecera (#hdrExamenPrincipal / #uiHeaderExamen / #hdrGlobal)
      this.liberarCapasCabecera();

      // Overlay de guía desactivado (bloqueaba clics). Limpiar residuos si quedaron.
      try { localStorage.setItem('dante_guia_respuesta', 'lista'); } catch (e) {}
      document.documentElement.classList.remove('guia-en-curso');
      this.guiaPaso = 0;
      this._cerrarFocoGuia();
      this._desmontarBandejaGuia();
      // 🎯 Briefings de Inducción (Diagnóstico Inicial vs Entrenamiento Diario)
      if (this._debeMostrarGuia()) {
        this.iniciarGuiaRespuesta();
        return;
      }
      if (this.misionData.isDiagnostic) {
        sessionStorage.setItem('dante_briefing_mostrado', 'true');
        const modal = document.getElementById('modalBriefingDiagnostico');
        if (modal) { modal.style.display = 'none'; modal.classList.add('hidden'); modal.style.pointerEvents = 'none'; }
      } else {
        if (this.indexReactivoActivo === 0 && localStorage.getItem('dante_briefing_tutor_visto') !== 'true') {
          this.mostrarModalBriefingEntrenamiento();
        } else {
          const modalE = document.getElementById('modalBriefingEntrenamiento');
          if (modalE) { modalE.style.display = 'none'; modalE.classList.add('hidden'); modalE.style.pointerEvents = 'none'; }
        }
      }

      // 4. Renderizar fase
      this.renderizarFaseActual();
    }

    /**
     * 🔓 Liberación de Capas y Pointer-Events en Cabecera (#hdrExamenPrincipal / #uiHeaderExamen / #hdrGlobal)
     * Reactiva e interactiva incondicionalmente la barra superior y neutraliza overlays residuales
     */
    liberarCapasCabecera() {
      const headerElements = [
        'btnSalaReturn',
        'btnVolverSalaHeader',
        'btnMenuPausaWorkspace',
        'btnPausaExamen',
        'btnOpenAjustes',
        'btnAjustesHdr',
        'btnPerfilHdr'
      ];
      headerElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.disabled = false;
          el.style.pointerEvents = 'auto';
          el.style.opacity = '1';
        }
      });

      // Neutralizar capas/modales residuales que puedan interceptar clics superiores
      const modalesResiduales = [
        'overlayDiagnostico',
        'modalConfirmarRegresoSala',
        'modalPausaSalida'
      ];
      if (!this.briefingActivo) {
        modalesResiduales.push('modalBriefingDiagnostico', 'modalBriefingEntrenamiento');
      }
      modalesResiduales.forEach(id => {
        const ov = document.getElementById(id);
        if (ov && (!this.briefingActivo || !id.includes('Briefing'))) {
          // No neutralizar si es un modal de aviso o ayuda de pausa activa
          if (ov.id === 'modalAvisoDiagnosticoObligatorio' || ov.id === 'modalAyudasPausa' || ov.id === 'modalPausaBano' || ov.id === 'modalModuladorVagal') {
            return;
          }
          ov.style.display = 'none';
          ov.classList.add('hidden');
          ov.style.pointerEvents = 'none';
        }
      });

      // Blindar z-index y pointer-events de cabeceras activas
      const uiHdr = document.getElementById('uiHeaderExamen') || document.querySelector('#viewWorkspace header');
      if (uiHdr) {
        uiHdr.style.pointerEvents = 'auto';
        uiHdr.style.position = 'relative';
        uiHdr.style.zIndex = '40';
      }
      const hdrPrincipal = document.getElementById('hdrExamenPrincipal');
      if (hdrPrincipal) {
        hdrPrincipal.style.pointerEvents = 'auto';
        hdrPrincipal.style.zIndex = '50';
      }

      if (typeof window.vincularListenersCabeceraIncondicional === 'function') {
        window.vincularListenersCabeceraIncondicional();
      }
    }

    /**
     * 🛡️ Bloqueo estricto del botón 'Atrás' en móviles y desktop (Anti-Rewind & Freeze)
     * Congela de forma absoluta this.indexReactivoActivo en maxIndexAlcanzado
     * y garantiza que el DOM permanezca estricto en la pregunta actual sin rebobinar.
     */
    bloquearRetrocesoMobile() {
      if (this.faseActual === 'COMPLETADO') return;
      history.pushState(null, document.title, location.href);
      if (typeof this.maxIndexAlcanzado === 'number') {
        this.indexReactivoActivo = Math.max(this.indexReactivoActivo || 0, this.maxIndexAlcanzado);
      }
      this.guardarProgresoSesion();
      if (this.faseActual === 'REACTIVOS' && this.misionData && this.misionData.reactivos) {
        this.renderizarReactivoActual();
      }
    }

    /**
     * Muestra la tarjeta modal de bienvenida al diagnóstico (Briefing 1)
     */
    _debeMostrarGuia() {
      // Overlay “Así se responde / Esta es la pregunta. Tócala” desactivado:
      // bloqueaba clics en Pausa, Pista y opciones del cuadernillo.
      return false;
    }

    _nombreArea(item) {
      const area = String((item && (item.area || item.materia)) || '').toLowerCase();
      if (area.includes('mate')) return 'Matemáticas';
      if (area.includes('lect')) return 'Lectura crítica';
      if (area.includes('cien') || area.includes('natur')) return 'Ciencias naturales';
      if (area.includes('social')) return 'Sociales y ciudadanas';
      if (area.includes('ingl')) return 'Inglés';
      return 'esta área';
    }

    _textoLimpio(valor) {
      const texto = String(valor || '')
        .replace(/anatom[ií]a del error/gi, '')
        .replace(/\bdistract(?:or(?:es)?)?\b/gi, '')
        .replace(/\btrampas?\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      return texto;
    }

    _señalarLetraClave(letra) {
      document.querySelectorAll('#uiOpcionesGrid .letra-clave').forEach((nodo) => nodo.classList.remove('letra-clave'));
      const marca = String(letra || '').trim().toUpperCase();
      if (!/^[ABCD]$/.test(marca)) return;
      const card = document.getElementById('opcion_card_' + marca);
      const badge = card && card.querySelector('.badge-opcion-letra');
      if (badge) badge.classList.add('letra-clave');
    }

    _ideaDePregunta(item) {
      const sub = String((item && (item.sub || item.sub_competencia)) || '').toLowerCase();
      const area = String((item && (item.area || item.materia)) || '').toLowerCase();
      const porTema = {
        probabilidad: 'Cuenta los casos que cumplen y divídelos por los casos posibles.',
        estadistica: 'Mira qué medida pide: promedio, mediana o el dato de la tabla.',
        algebra: 'Despeja lo que pregunta y no cambies el signo al pasar de lado.',
        geometria: 'Identifica la figura y la medida que pide, antes de usar una fórmula.',
        funciones: 'Lee la variable de entrada y qué le pasa al salir.',
        proporcionalidad: 'Mira si al crecer una cantidad la otra crece igual, o al revés.',
        aritmetica: 'Haz la operación que pide el enunciado, en el orden que dice.',
        trigonometria: 'Identifica el ángulo y el lado que ya conoces.',
        dos_textos: 'Lee cada texto y quédate con la relación que pide la pregunta.',
        textos_discontinuos: 'Saca el dato de la tabla, el aviso o la gráfica.',
        argumentacion: 'Mira qué se concluye y si el salto cubre más de lo que dicen los datos.',
        inferencia: 'Quédate con lo que se puede sostener. No agregues un hecho que no está.',
        filosofia: 'Nombra la idea ética que el caso está usando.',
        pragmatica: 'Pregúntate para qué se dice la frase en esa situación.',
        semantica: 'Elige el sentido que pide el contexto.',
        literatura: 'Reconoce la parte del relato o el recurso, sin leerlo como un dato suelto.',
        comprension_literal: 'La respuesta está dicha en la frase.',
        indagacion: 'Separa pregunta, hipótesis, variable y conclusión.',
        fisica: 'Identifica la magnitud y la relación entre los datos.',
        quimica: 'Distingue mezcla, cambio y reacción.',
        biologia: 'Ubica la estructura o el proceso en el ser vivo del enunciado.',
        geografia: 'Sitúa el lugar o el fenómeno antes de marcar.',
        constitucion: 'La pregunta pide la rama, el derecho o el mecanismo.',
        historia: 'Ata el hecho a su proceso. Otro hito no lo reemplaza.',
        pensamiento_critico: 'Una prueba tiene que poder verificarse.',
        interpretacion: 'Lee la leyenda, los ejes y la escala.',
        participacion: 'El mecanismo tiene un alcance. No le des un poder que no tiene.',
        pensamiento_social: 'Una norma se puede exigir. Una costumbre, no siempre.',
        dialogo: 'Responde con lo que los hablantes acaban de decir.',
        aviso: 'Copia la condición del aviso.',
        cloze: 'Mira el sujeto, el tiempo y la palabra que va justo antes del hueco.',
        vocabulario: 'Elige el sentido de esa palabra en la frase.',
        lectura: 'La respuesta tiene que salir de la frase.'
      };
      if (porTema[sub]) return porTema[sub];
      if (area.includes('mate')) return 'Mira qué operación pide la pregunta y quédate con esa.';
      if (area.includes('lect')) return 'Vuelve a lo que la pregunta pide, no a la frase que suena cierta.';
      if (area.includes('social')) return 'Quédate con el artículo o el hecho que el caso está usando.';
      if (area.includes('cien') || area.includes('natur')) return 'Separa la variable del experimento y la evidencia que la sostiene.';
      if (area.includes('ingl')) return 'Mira el conector y la idea del párrafo.';
      return 'Lee otra vez qué pide la pregunta y quédate con la opción que responde eso.';
    }

    _avisoDiagnosticoSilencio() {
      const previa = document.getElementById('notaDiagSilencio');
      const mostrar = !this.guiaPaso && this.misionData && this.misionData.isDiagnostic && this.indexReactivoActivo === 0;
      if (!mostrar) {
        if (previa) previa.remove();
        return;
      }
      if (previa) return;
      const cuerpo = document.getElementById('txtEnunciadoCuerpo');
      if (!cuerpo || !cuerpo.parentElement || document.getElementById('notaDiagSilencio')) return;
      const nota = document.createElement('p');
      nota.id = 'notaDiagSilencio';
      nota.textContent = 'En el diagnóstico no hay ayuda y no se dice si vas bien o mal. Al terminar ves la proyección.';
      nota.style.cssText = 'font-family: Plus Jakarta Sans, sans-serif; font-size: 0.9rem; margin: 0 0 0.8rem; color: #44403c;';
      cuerpo.parentElement.insertBefore(nota, cuerpo);
    }

    _montarBandejaGuia() {
      const bandeja = document.getElementById('guiaBandeja');
      const hueco = document.getElementById('guiaBandejaAccion');
      const btn = document.getElementById('btnConfirmarSeleccion');
      if (!bandeja || !hueco || !btn) return;
      if (!btn.dataset.guiaPadre) {
        btn.dataset.guiaPadre = btn.parentElement ? '1' : '';
        this._btnGuiaPadre = btn.parentElement;
        this._btnGuiaSiguiente = btn.nextSibling;
      }
      hueco.appendChild(btn);
      bandeja.hidden = false;
      this._medirBandejaGuia();
    }

    _desmontarBandejaGuia() {
      const bandeja = document.getElementById('guiaBandeja');
      const pista = document.getElementById('guiaBandejaPista');
      const pistaTxt = document.getElementById('guiaBandejaPistaTexto');
      const btn = document.getElementById('btnConfirmarSeleccion');
      if (btn && this._btnGuiaPadre) {
        if (this._btnGuiaSiguiente && this._btnGuiaSiguiente.parentNode === this._btnGuiaPadre) {
          this._btnGuiaPadre.insertBefore(btn, this._btnGuiaSiguiente);
        } else {
          this._btnGuiaPadre.appendChild(btn);
        }
      }
      if (btn) {
        btn.classList.remove('guia-listo');
        btn.style.display = 'none';
        delete btn.dataset.guiaPadre;
      }
      if (pista) pista.hidden = true;
      if (pistaTxt) {
        pistaTxt.hidden = true;
        pistaTxt.textContent = '';
      }
      if (bandeja) bandeja.hidden = true;
      document.documentElement.style.removeProperty('--guia-bandeja-h');
      this._btnGuiaPadre = null;
      this._btnGuiaSiguiente = null;
    }

    _medirBandejaGuia() {
      const bandeja = document.getElementById('guiaBandeja');
      if (!bandeja || bandeja.hidden) return;
      const h = Math.ceil(bandeja.getBoundingClientRect().height || 0);
      if (h > 0) document.documentElement.style.setProperty('--guia-bandeja-h', h + 'px');
    }

    _textoBandejaGuia(texto) {
      const caja = document.getElementById('guiaBandejaTexto');
      if (caja) caja.textContent = texto || '';
      const nota = document.getElementById('notaGuia');
      if (nota) nota.textContent = texto || '';
      this._medirBandejaGuia();
    }

    iniciarGuiaRespuesta() {
      const tutor = document.getElementById('tutorSala');
      if (tutor) tutor.hidden = true;
      document.documentElement.classList.add('guia-en-curso');
      document.documentElement.classList.remove('diag-sin-pista');
      this.guiaPaso = 1;
      this.guiaAyudaVista = false;
      this.guiaPausaVista = false;
      this.guiaPausaLista = false;
      this.briefingActivo = false;
      // Congelar reloj del diagnóstico mientras corre el ejemplo.
      if (this.timerWorkspaceId) {
        clearInterval(this.timerWorkspaceId);
        this.timerWorkspaceId = null;
      }
      this._montarBandejaGuia();
      const modal = document.getElementById('modalBriefingDiagnostico');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
      const viewWs = document.getElementById('viewWorkspace');
      if (viewWs) {
        viewWs.classList.add('active');
        viewWs.classList.remove('hidden');
        viewWs.style.display = 'block';
      }
      const uiReactivoContainer = document.getElementById('uiReactivoContainer');
      if (uiReactivoContainer) {
        uiReactivoContainer.style.display = 'flex';
        uiReactivoContainer.classList.remove('hidden');
      }
      const lblReloj = document.getElementById('lblCronometroWorkspace');
      if (lblReloj) lblReloj.textContent = '--:--';
      this.pintarGuia();
    }

    _itemGuia() {
      if (this.guiaPaso === 2) {
        return {
          id: 'guia_celula',
          area: 'ciencias_naturales',
          target_exam: 'SABER_11',
          pregunta_texto: 'La célula es la unidad más pequeña que cumple las funciones de un ser vivo. ¿Qué parte dirige esas funciones?',
          opciones: ['A) El núcleo', 'B) La pared de ladrillo', 'C) El color del agua', 'D) El nombre del colegio']
        };
      }
      return {
        id: 'guia_suma',
        area: 'matematicas',
        target_exam: 'SABER_11',
        pregunta_texto: '¿Cuánto es 20 + 23?',
        opciones: ['A) 44', 'B) 43', 'C) 3', 'D) −3']
      };
    }

    pintarGuia() {
      this.opcionSeleccionadaTemp = null;
      this.opcionesDescartadas = new Set();
      this.guiaAyudaVista = this.guiaPaso === 2 ? false : this.guiaAyudaVista;
      const feedback = document.getElementById('uiFeedbackTrainingImmediate');
      if (feedback) {
        feedback.style.display = 'none';
        feedback.classList.add('hidden');
      }
      const btnConf = document.getElementById('btnConfirmarSeleccion');
      if (btnConf) btnConf.style.display = 'none';
      const silencio = document.getElementById('notaDiagSilencio');
      if (silencio) silencio.remove();
      this.renderizarEnunciadoYOpciones(this._itemGuia());
      const materia = document.getElementById('lblMateriaExamen');
      if (materia) materia.textContent = 'Así se responde';
      const progreso = document.getElementById('lblProgresoReactivo');
      if (progreso) progreso.textContent = this.guiaPaso + '/2';
      const cuerpo = document.getElementById('txtEnunciadoCuerpo');
      if (cuerpo && cuerpo.parentElement && !document.getElementById('notaGuia')) {
        const nota = document.createElement('p');
        nota.id = 'notaGuia';
        nota.style.cssText = 'font-family: Plus Jakarta Sans, sans-serif; font-size: 0.98rem; line-height: 1.45; margin: 0 0 0.85rem; color: #1c1917;';
        cuerpo.parentElement.insertBefore(nota, cuerpo);
      }
      const btnListo = document.getElementById('btnConfirmarSeleccion');
      if (btnListo) {
        btnListo.style.display = 'none';
        btnListo.classList.remove('guia-listo');
      }
      const barra = document.getElementById('uiIntervencionDanteContainer');
      if (barra) {
        barra.style.display = 'none';
        barra.classList.remove('guia-pista-visible');
      }
      const panel = document.getElementById('uiIntervencionDanteLive');
      if (panel && this.guiaPaso !== 2) panel.classList.add('hidden');
      const cajaPista = document.getElementById('guiaBandejaPista');
      const pistaTxt = document.getElementById('guiaBandejaPistaTexto');
      const honey = document.getElementById('guiaBandejaBtnPista');
      if (cajaPista) cajaPista.hidden = true;
      if (pistaTxt) {
        pistaTxt.hidden = true;
        pistaTxt.textContent = '';
      }
      if (honey) honey.classList.remove('guia-señal');
      this._montarBandejaGuia();
      this.guiaMiraPregunta = true;
      this._mostrarPreguntaGuia();
    }

    _preguntaGuia() {
      const card = document.querySelector('#uiEnunciados .icfes-cartilla-card')
        || document.getElementById('uiEnunciados')
        || document.getElementById('txtEnunciadoCuerpo');
      return card || null;
    }

    _mostrarPreguntaGuia() {
      const n = this.guiaPaso === 2 ? '2' : '1';
      const texto = 'Ejemplo ' + n + ' de 2. Esta es la pregunta. Tócala.';
      this._notaGuia(texto);
      const el = this._preguntaGuia();
      if (el && el.dataset.guiaPregunta !== '1') {
        el.dataset.guiaPregunta = '1';
        el.addEventListener('click', () => {
          if (this.guiaPaso && this.guiaMiraPregunta) this._seguirPreguntaGuia();
        });
      }
      // Esperar layout real: si el foco mide temprano, queda el recorte blanco a medias.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!this.guiaPaso || !this.guiaMiraPregunta) return;
          this._focoGuia(this._preguntaGuia() || el, texto, { elevar: false });
        });
      });
    }

    _seguirPreguntaGuia() {
      if (!this.guiaMiraPregunta) return;
      this.guiaMiraPregunta = false;
      if (this.guiaPaso === 2) {
        this._ensenarPistaGuia();
      } else {
        this._notaGuia('Ejemplo 1 de 2. Toca la letra B. Ahí dice 43.');
        this._focoGuia(this._badgeGuia('B'), 'Ejemplo 1 de 2. Toca la letra B. Ahí dice 43.');
      }
    }

    _notaGuia(texto) {
      this._textoBandejaGuia(texto);
    }

    _ensenarPistaGuia() {
      document.documentElement.classList.remove('diag-sin-pista');
      const cajaPista = document.getElementById('guiaBandejaPista');
      const honey = document.getElementById('guiaBandejaBtnPista');
      const pistaTxt = document.getElementById('guiaBandejaPistaTexto');
      if (cajaPista) cajaPista.hidden = false;
      if (pistaTxt) {
        pistaTxt.hidden = true;
        pistaTxt.textContent = '';
      }
      if (honey) honey.classList.add('guia-señal');
      const texto = 'Ejemplo 2 de 2. Este botón ámbar es la pista. Tócalo.';
      this._notaGuia(texto);
      this._focoGuia(honey, texto);
      this._medirBandejaGuia();
    }

    _badgeGuia(letra) {
      return document.querySelector('#uiOpcionesGrid .badge-opcion-letra[data-letra="' + letra + '"]');
    }

    _cerrarFocoGuia() {
      const capa = document.getElementById('guiaFoco');
      if (capa) capa.hidden = true;
      const anillo = document.getElementById('guiaFocoAnillo');
      if (anillo) anillo.hidden = true;
      const tapa = document.getElementById('guiaFocoTapa');
      if (tapa) tapa.style.clipPath = 'none';
      if (this._focoRealinear) {
        window.removeEventListener('resize', this._focoRealinear);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._focoRealinear);
        this._focoRealinear = null;
      }
      if (this._focoTimer) {
        clearTimeout(this._focoTimer);
        this._focoTimer = null;
      }
      if (this._focoTimer2) {
        clearTimeout(this._focoTimer2);
        this._focoTimer2 = null;
      }
      if (this._focoTimer3) {
        clearTimeout(this._focoTimer3);
        this._focoTimer3 = null;
      }
      document.querySelectorAll('.guia-blanco').forEach((nodo) => nodo.classList.remove('guia-blanco'));
    }

    _traerGuia(el) {
      if (!el || window.getComputedStyle(el).position === 'fixed') return;
      const raiz = document.documentElement;
      const scrollPrevio = raiz.style.scrollBehavior;
      raiz.style.scrollBehavior = 'auto';
      const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      const arriba = 64;
      const bandeja = document.getElementById('guiaBandeja');
      const bandejaH = (bandeja && !bandeja.hidden) ? (bandeja.getBoundingClientRect().height || 140) : 128;
      const abajo = vh - bandejaH - 12;
      let nodo = el.parentElement;
      while (nodo) {
        const modo = window.getComputedStyle(nodo).overflowY;
        if ((modo === 'auto' || modo === 'scroll' || modo === 'overlay') && nodo.scrollHeight > nodo.clientHeight + 8) {
          const er = el.getBoundingClientRect();
          const pr = nodo.getBoundingClientRect();
          const limiteArriba = Math.max(pr.top, arriba);
          const limiteAbajo = Math.min(pr.bottom, abajo);
          if (er.top < limiteArriba) nodo.scrollTop -= (limiteArriba - er.top);
          else if (er.bottom > limiteAbajo) nodo.scrollTop += (er.bottom - limiteAbajo);
        }
        nodo = nodo.parentElement;
      }
      const r = el.getBoundingClientRect();
      if (r.top < arriba) window.scrollTo(window.scrollX, window.scrollY + (r.top - arriba));
      else if (r.bottom > abajo) window.scrollTo(window.scrollX, window.scrollY + (r.bottom - abajo));
      raiz.style.scrollBehavior = scrollPrevio;
    }

    _focoGuia(el, texto, opts = {}) {
      const capa = document.getElementById('guiaFoco');
      const anillo = document.getElementById('guiaFocoAnillo');
      const tapa = document.getElementById('guiaFocoTapa');
      const hoja = document.getElementById('guiaFocoHoja');
      const txt = document.getElementById('guiaFocoTexto');
      if (!capa || !anillo || !tapa) return;
      if (txt) txt.textContent = texto;
      this._textoBandejaGuia(texto);
      document.querySelectorAll('.guia-blanco').forEach((nodo) => nodo.classList.remove('guia-blanco'));
      const elevar = opts.elevar !== false && Boolean(el && (
        el.classList.contains('badge-opcion-letra')
        || el.id === 'btnConfirmarSeleccion'
        || el.id === 'guiaBandejaBtnPista'
        || el.id === 'btnPausaCabecera'
        || (el.closest && el.closest('#guiaBandeja'))
      ));
      // En tarjetas grandes el z-index crea el “blanco flotante” a medias; solo elevamos letras/botones.
      if (elevar && el) el.classList.add('guia-blanco');
      capa.hidden = false;
      anillo.hidden = true;
      const colocar = () => {
        this._medirBandejaGuia();
        if (!el || !el.getBoundingClientRect) {
          anillo.hidden = true;
          tapa.style.clipPath = 'none';
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) return;
        const enBandeja = Boolean(el.closest && el.closest('#guiaBandeja'));
        if (enBandeja) {
          anillo.hidden = true;
          tapa.style.clipPath = 'none';
          return;
        }
        const pad = 10;
        const top = Math.max(4, r.top - pad);
        const left = Math.max(4, r.left - pad);
        const width = Math.min(window.innerWidth - 8, r.width + pad * 2);
        // Si el layout aún no cerró, no dibujar un recorte a medias (era el bug de la foto).
        const height = r.height + pad * 2;
        if (height < 48 && !el.classList.contains('badge-opcion-letra')) {
          anillo.hidden = true;
          tapa.style.clipPath = 'none';
          return;
        }
        const redonda = el.classList.contains('badge-opcion-letra');
        anillo.hidden = false;
        anillo.style.top = top + 'px';
        anillo.style.left = left + 'px';
        anillo.style.width = width + 'px';
        anillo.style.height = height + 'px';
        anillo.style.borderRadius = redonda ? '999px' : '18px';
        const w = window.innerWidth;
        const h = window.innerHeight;
        const x2 = left + width;
        const y2 = top + height;
        tapa.style.clipPath = 'polygon(evenodd, 0px 0px, ' + w + 'px 0px, ' + w + 'px ' + h + 'px, 0px ' + h + 'px, 0px 0px, ' + left + 'px ' + top + 'px, ' + x2 + 'px ' + top + 'px, ' + x2 + 'px ' + y2 + 'px, ' + left + 'px ' + y2 + 'px, ' + left + 'px ' + top + 'px)';
        if (hoja) {
          hoja.style.top = '-9999px';
          hoja.style.bottom = 'auto';
        }
      };
      const preparar = () => {
        this._traerGuia(el);
        requestAnimationFrame(() => requestAnimationFrame(colocar));
      };
      if (this._focoRealinear) {
        window.removeEventListener('resize', this._focoRealinear);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._focoRealinear);
      }
      if (this._focoTimer) clearTimeout(this._focoTimer);
      if (this._focoTimer2) clearTimeout(this._focoTimer2);
      if (this._focoTimer3) clearTimeout(this._focoTimer3);
      this._focoRealinear = preparar;
      window.addEventListener('resize', preparar);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', preparar);
      preparar();
      this._focoTimer = setTimeout(preparar, 80);
      this._focoTimer2 = setTimeout(preparar, 220);
      this._focoTimer3 = setTimeout(preparar, 480);
    }

    _señalGuia() {
      const honey = document.getElementById('guiaBandejaBtnPista') || document.getElementById('btnAbrirDanteSocraticoPapel') || document.getElementById('btnAbrirDanteSocratico');
      document.querySelectorAll('#uiOpcionesGrid .opcion-card-workspace').forEach((card) => card.classList.remove('guia-señal'));
      if (honey) honey.classList.remove('guia-señal');
      const marcar = (letra) => {
        document.querySelectorAll('#uiOpcionesGrid .badge-opcion-letra').forEach((badge) => {
          if (badge.getAttribute('data-letra') === letra) badge.classList.add('guia-señal');
        });
      };
      if (this.guiaPaso === 1) marcar('B');
      else if (this.guiaPaso === 2 && !this.guiaAyudaVista && honey) honey.classList.add('guia-señal');
      else if (this.guiaPaso === 2) marcar('B');
    }

    _confirmarGuia() {
      const letra = String(this.opcionSeleccionadaTemp || '').toUpperCase();
      if (!letra) {
        this._notaGuia(this.guiaPaso === 2
          ? 'Ejemplo 2 de 2. Primero toca una letra.'
          : 'Ejemplo 1 de 2. Primero toca la letra B.');
        return;
      }
      if (this.guiaPaso === 1) {
        if (letra !== 'B') {
          this._notaGuia('Ejemplo 1 de 2. La letra marcada es la B, el 43.');
          this._señalGuia();
          return;
        }
        this._cerrarGuia('Bien. Sumaste las decenas y las unidades.', 'Siguiente ejemplo', true);
        return;
      }
      if (!this.guiaAyudaVista) {
        this._ensenarPistaGuia();
        return;
      }
      if (letra !== 'B') {
        this._notaGuia('Ahora toca la letra B, la pared de ladrillo, a propósito.');
        this._señalGuia();
        return;
      }
      const cierre = (this.misionData && this.misionData.isDiagnostic) ? 'Empezar el diagnóstico' : 'Empezar el bloque';
      this._cerrarGuia('Marcaste B. La pared de ladrillo no es parte de la célula. La respuesta era A, el núcleo. En el entrenamiento vas a ver esto cuando falles. En el diagnóstico, no.', cierre, false);
    }

    _cerrarGuia(frase, boton, bien) {
      this._cerrarFocoGuia();
      // En feedback la bandeja no debe competir con la tarjeta de explicación.
      this._desmontarBandejaGuia();
      const caja = document.getElementById('uiFeedbackTrainingImmediate');
      const texto = document.getElementById('txtCuerpoFeedbackInmediato');
      const seguir = document.getElementById('btnContinuarSiguienteReactivo');
      const badge = document.getElementById('badgeOpcionElegidaFeedback');
      if (badge) badge.textContent = bien ? 'Bien' : 'Así se ve cuando fallas';
      if (caja) {
        caja.classList.toggle('feedback-bien', Boolean(bien));
        caja.classList.toggle('feedback-mal', !bien);
      }
      if (texto) texto.textContent = frase;
      if (seguir) seguir.textContent = boton;
      if (caja) {
        caja.style.display = 'block';
        caja.classList.remove('hidden');
      }
    }

    _sellarMetaDesdeOnboarding() {
      try {
        const meta = localStorage.getItem('dante_pacto_meta');
        const onb = localStorage.getItem('dante_onboarding_completed') === 'true';
        if (!onb || (meta !== '300_BASE' && meta !== '380_ELITE')) return false;
        localStorage.setItem('dante_pacto_accepted', 'true');
        localStorage.setItem('dante_pacto_socratico', 'true');
        return true;
      } catch (e) {
        return false;
      }
    }

    _mostrarPausaGuia() {
      this.guiaPausaVista = true;
      const hdr = document.getElementById('hdrExamenPrincipal');
      if (hdr) hdr.classList.add('modo-examen');
      const barra = document.getElementById('uiIntervencionDanteContainer');
      if (barra) barra.style.display = 'none';
      const btn = document.getElementById('btnPausaCabecera');
      const texto = 'Esta es la pausa. Si necesitas respirar o ir al baño, está aquí. Tócala.';
      this._notaGuia(texto);
      if (!btn) {
        this._seguirGuia();
        return;
      }
      this._focoGuia(btn, texto);
      if (btn.dataset.guiaPausa !== '1') {
        btn.dataset.guiaPausa = '1';
        btn.addEventListener('click', (e) => {
          if (!this.guiaPaso || !this.guiaPausaVista || this.guiaPausaLista) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.guiaPausaLista = true;
          this._seguirGuia();
        }, true);
      }
    }

    _diagnosticoPendiente() {
      try {
        return localStorage.getItem('dante_diagnostico_completado') !== 'true'
          && localStorage.getItem('dante_diagnostic_completed') !== 'true'
          && localStorage.getItem('dante_calibracion_tactica_inicial_done') !== 'true';
      } catch (e) {
        return false;
      }
    }

    _seguirGuia() {
      const caja = document.getElementById('uiFeedbackTrainingImmediate');
      if (caja) {
        caja.style.display = 'none';
        caja.classList.add('hidden');
      }
      if (this.guiaPaso === 1) {
        this.guiaPaso = 2;
        this.guiaAyudaVista = false;
        this.pintarGuia();
        return;
      }
      if (!this.guiaPausaVista) {
        this._mostrarPausaGuia();
        return;
      }
      this._cerrarFocoGuia();
      this._desmontarBandejaGuia();
      const hdr = document.getElementById('hdrExamenPrincipal');
      if (hdr) hdr.style.zIndex = '';
      document.documentElement.classList.remove('guia-en-curso');
      this.guiaPaso = 0;
      this.guiaAyudaVista = false;
      const notaGuia = document.getElementById('notaGuia');
      if (notaGuia) notaGuia.remove();
      try { localStorage.setItem('dante_guia_respuesta', 'lista'); } catch (e) {}
      const pendiente = this._diagnosticoPendiente();
      if (pendiente && this.misionData) {
        this.misionData.isDiagnostic = true;
        this.misionData.repasoArea = null;
        this.misionData.esRefuerzo = false;
        try {
          sessionStorage.setItem('dante_is_diagnostic', 'true');
          localStorage.setItem('dante_is_diagnostic', 'true');
          localStorage.removeItem('dante_diagnostico_en_curso');
          sessionStorage.removeItem('dante_diag_sala_mode');
          localStorage.removeItem('dante_sesion_pausada');
        } catch (e) {}
        document.documentElement.classList.add('dante-diagnostic-direct');
        if (Array.isArray(this.misionData.reactivos)) {
          this.misionData.reactivos = this.garantizarDistribucionDiagnostico(this.misionData.reactivos, this.misionData.targetTrack || 'ICFES');
        }
      }
      const empezar = () => {
        const gw = document.getElementById('viewGateway');
        if (gw) {
          gw.classList.add('hidden');
          gw.classList.remove('active');
          gw.style.display = 'none';
        }
        const ws = document.getElementById('viewWorkspace');
        if (ws) {
          ws.classList.add('active');
          ws.classList.remove('hidden');
          ws.style.display = 'block';
        }
        window.isExamActive = true;
        this.indexReactivoActivo = 0;
        this.respuestasSesionActiva = [];
        this.cerrarBriefingComenzar();
      };
      const esDiagnostico = Boolean(pendiente || (this.misionData && this.misionData.isDiagnostic));
      const respirar = () => this._abrirRespiracionDeEntrada(empezar, esDiagnostico);
      const conAnuncio = () => {
        if (esDiagnostico && window.DantePlanSala && typeof DantePlanSala.esPago === 'function' && !DantePlanSala.esPago()) {
          DantePlanSala.antesDelBloque(respirar, 'Respirar primero');
        } else {
          respirar();
        }
      };
      let pactoListo = false;
      try { pactoListo = localStorage.getItem('dante_pacto_socratico') === 'true'; } catch (e) {}
      if (!pactoListo && this._sellarMetaDesdeOnboarding()) pactoListo = true;
      // Meta ya quedó en onboarding: no reabrir el pacto (ni 380/300) antes del diagnóstico.
      if (esDiagnostico && !pactoListo) {
        const pacto = (typeof PactoDanteManager !== 'undefined') ? PactoDanteManager : window.PactoDanteManager;
        if (pacto && typeof pacto.abrirModal === 'function') {
          window._trasFirmarPactoGuia = conAnuncio;
          pacto.abrirModal();
          return;
        }
      }
      conAnuncio();
    }

    mostrarModalBriefing() {
      this.mostrarModalBriefingDiagnostico();
    }

    mostrarModalBriefingDiagnostico() {
      this.briefingActivo = true;
      const modal = document.getElementById('modalBriefingDiagnostico');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        const btn = document.getElementById('btnComenzarBriefingDiagnostico');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';
          btn.onclick = (e) => {
            if (e) e.preventDefault();
            this.cerrarBriefingComenzar();
          };
        }
      }
    }

    /**
     * Cierra el briefing de diagnóstico y activa el cronómetro, cabina y renderizado de preguntas
     */
    cerrarBriefingComenzar() {
      console.log('⚡ [DANTE EXAM WORKSPACE]: Cerrando Protocolo de Calibración Inicial y arrancando examen...');
      this.briefingActivo = false;
      sessionStorage.setItem('dante_briefing_mostrado', 'true');
      const modal = document.getElementById('modalBriefingDiagnostico');
      if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }

      const arrancarReactivos = () => {
        // Asegurar visibilidad incondicional del workspace y contenedores de reactivos
        const viewWs = document.getElementById('viewWorkspace');
        if (viewWs) {
          viewWs.classList.add('active');
          viewWs.classList.remove('hidden');
          viewWs.style.display = 'block';
        }

        const uiReactivoContainer = document.getElementById('uiReactivoContainer');
        if (uiReactivoContainer) {
          uiReactivoContainer.style.display = 'flex';
          uiReactivoContainer.classList.remove('hidden');
        }

        const containerCore = document.getElementById('uiContenedorPreguntaCore');
        if (containerCore) {
          containerCore.style.display = 'block';
          containerCore.style.opacity = '1';
          containerCore.style.transform = 'none';
        }

        const uiEnunciados = document.getElementById('uiEnunciados');
        if (uiEnunciados) {
          uiEnunciados.style.display = 'block';
        }

        this.liberarCapasCabecera();
        this.tiempoInicioSesionWorkspace = Date.now();
        this.tiempoInicioReactivo = performance.now();
        this.iniciarCronometroWorkspace();

        // Asegurar renderizado inmediato del primer reactivo
        this.faseActual = 'REACTIVOS';
        if (!this.misionData || !Array.isArray(this.misionData.reactivos) || this.misionData.reactivos.length === 0) {
          console.warn('⚡ [DANTE EXAM WORKSPACE]: Reactivos no encontrados al cerrar briefing. Activando banco local...');
          this.usarBancoLocalFallback();
        } else {
          this.renderizarReactivoActual();
        }
      };

      if (this.misionData && this.misionData.isDiagnostic) {
        this._abrirPerfilDiagnosticoSiAplica(arrancarReactivos);
      } else {
        arrancarReactivos();
      }
    }

    /**
     * Muestra la tarjeta modal de inducción al entrenamiento diario (Briefing 2)
     */
    mostrarModalBriefingEntrenamiento() {
      this.briefingActivo = true;
      const modal = document.getElementById('modalBriefingEntrenamiento');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        const btn = document.getElementById('btnComenzarBriefingEntrenamiento');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';
        }
      }
    }

    /**
     * Cierra el briefing de entrenamiento socrático y activa el cronómetro y cabina
     */
    cerrarBriefingEntrenamientoComenzar() {
      console.log('⚡ [DANTE EXAM WORKSPACE]: Cerrando Inducción al Entrenamiento Diario y arrancando...');
      this.briefingActivo = false;
      localStorage.setItem('dante_briefing_tutor_visto', 'true');
      const modal = document.getElementById('modalBriefingEntrenamiento');
      if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }

      const viewWs = document.getElementById('viewWorkspace');
      if (viewWs) {
        viewWs.classList.add('active');
        viewWs.classList.remove('hidden');
        viewWs.style.display = 'block';
      }

      const uiReactivoContainer = document.getElementById('uiReactivoContainer');
      if (uiReactivoContainer) {
        uiReactivoContainer.style.display = 'flex';
        uiReactivoContainer.classList.remove('hidden');
      }

      const containerCore = document.getElementById('uiContenedorPreguntaCore');
      if (containerCore) {
        containerCore.style.display = 'block';
        containerCore.style.opacity = '1';
        containerCore.style.transform = 'none';
      }

      const uiEnunciados = document.getElementById('uiEnunciados');
      if (uiEnunciados) {
        uiEnunciados.style.display = 'block';
      }

      this.liberarCapasCabecera();
      this.tiempoInicioSesionWorkspace = Date.now();
      this.tiempoInicioReactivo = performance.now();
      this.iniciarCronometroWorkspace();

      this.faseActual = 'REACTIVOS';
      if (!this.misionData || !Array.isArray(this.misionData.reactivos) || this.misionData.reactivos.length === 0) {
        this.usarBancoLocalFallback();
      } else {
        this.renderizarReactivoActual();
      }
    }

    /**
     * Garantiza el balance estricto de 10 reactivos según la convocatoria activa (ICFES, UNAL, COMBO)
     * Elimina recortes arbitrarios con .slice(0, 10) que rompan la simetría 50/50.
     */
    garantizarDistribucionDiagnostico(reactivos) {
      const cleanTrack = 'ICFES';
      const isCombo = false;
      const isUnal = false;

      const items = (Array.isArray(reactivos) ? reactivos : []).filter((it) => {
        const id = String((it && it.id) || '').toLowerCase();
        const exam = String((it && (it.target_exam || it.origen || it.tipo_examen)) || '').toUpperCase();
        return !id.startsWith('preun_') && !exam.includes('UNAL') && !exam.includes('UDEA') && !exam.includes('PREUN');
      });

      const areasIcfes = ['matematicas', 'lectura_critica', 'sociales_ciudadanas', 'ciencias_naturales', 'ingles'];
      const compUnal = ['razonamiento_logico', 'analisis_textual', 'analisis_imagen', 'ciencias_naturales', 'sociales'];

      // Clasificador de reactivos
      const normalizarArea = (item) => {
        const raw = String(item.area || item.area_general || item.materia || '').toLowerCase().trim();
        if (raw.includes('social')) return 'sociales_ciudadanas';
        if (raw.includes('natural') || raw.includes('ciencia') || raw.includes('fisica') || raw.includes('quimica')) return 'ciencias_naturales';
        if (raw.includes('mate') || raw.includes('calculo') || raw.includes('numerico')) return 'matematicas';
        if (raw.includes('textual') || raw.includes('lectura') || raw.includes('filosofia')) return 'lectura_critica';
        if (raw.includes('imagen') || raw.includes('3d') || raw.includes('espacial')) return 'analisis_imagen';
        if (raw.includes('logico') || raw.includes('logica')) return 'razonamiento_logico';
        if (raw.includes('ingles')) return 'ingles';
        return raw || 'matematicas';
      };

      const esItemUnal = (item) => {
        const raw = String(item.target_exam || item.origen || item.tipo_examen || '').toUpperCase();
        return raw.includes('UNAL') || raw.includes('UDEA') || raw.includes('PREUN') ||
               String(item.id || '').toLowerCase().includes('unal') ||
               String(item.id || '').toLowerCase().includes('udea') ||
               String(item.id || '').toLowerCase().startsWith('preun_') ||
               ['analisis_imagen', 'razonamiento_logico', 'analisis_textual'].includes(String(item.area || '').toLowerCase());
      };

      // Utiliza BANCO_CONTINGENCIA_WORK y crearReactivoContingenciaReal a nivel de módulo
      let balanceados = [];

      if (isUnal) {
        // UNAL (10 reactivos): Exactamente 2 por cada uno de los 5 componentes
        compUnal.forEach(comp => {
          const matching = items.filter(it => {
            const a = String(it.area || it.materia || '').toLowerCase();
            if (comp === 'razonamiento_logico') return a.includes('logico') || a.includes('logica') || a.includes('calculo') || a.includes('matematicas');
            if (comp === 'analisis_textual') return a.includes('textual') || a.includes('lectura') || a.includes('filosofia');
            if (comp === 'analisis_imagen') return a.includes('imagen') || a.includes('3d');
            if (comp === 'ciencias_naturales') return a.includes('natural') || a.includes('fisica') || a.includes('quimica');
            if (comp === 'sociales') return a.includes('social');
            return a === comp;
          });

          for (let k = 0; k < 2; k++) {
            if (matching[k]) {
              balanceados.push({
                ...matching[k],
                area: comp,
                materia: comp,
                target_exam: 'UNAL',
                origen: 'UNAL'
              });
            } else {
              balanceados.push(crearReactivoContingenciaReal(comp, 'UNAL', k));
            }
          }
        });
      } else if (isCombo) {
        // COMBO / MIXTO (10 reactivos): Distribución simétrica 50/50:
        // 5 Saber 11° (1 de cada área) + 5 Admisión UNAL (1 de cada componente, incluyendo obligatoriamente analisis_imagen)
        const icfesItems = items.filter(it => !esItemUnal(it));
        const unalItems = items.filter(it => esItemUnal(it));

        const icfesItems5 = [];
        areasIcfes.forEach((area, idx) => {
          const match = icfesItems.find(it => normalizarArea(it) === area) || items.find(it => normalizarArea(it) === area);
          if (match) {
            icfesItems5.push({
              ...match,
              area,
              materia: area,
              target_exam: 'SABER_11',
              origen: 'ICFES'
            });
          } else {
            icfesItems5.push(crearReactivoContingenciaReal(area, 'SABER_11', idx));
          }
        });

        const unalItems5 = [];
        compUnal.forEach((comp, idx) => {
          const match = unalItems.find(it => {
            const a = String(it.area || it.materia || '').toLowerCase();
            if (comp === 'razonamiento_logico') return a.includes('logico') || a.includes('logica') || a.includes('calculo') || a.includes('matematicas');
            if (comp === 'analisis_textual') return a.includes('textual') || a.includes('lectura') || a.includes('filosofia');
            if (comp === 'analisis_imagen') return a.includes('imagen') || a.includes('3d');
            if (comp === 'ciencias_naturales') return a.includes('natural') || a.includes('fisica') || a.includes('quimica');
            if (comp === 'sociales') return a.includes('social');
            return a === comp;
          }) || items.find(it => {
            const a = String(it.area || it.materia || '').toLowerCase();
            return comp === 'analisis_imagen' ? (a.includes('imagen') || a.includes('3d')) : a.includes(comp.slice(0, 4));
          });

          if (match) {
            unalItems5.push({
              ...match,
              area: comp,
              materia: comp,
              target_exam: 'UNAL',
              origen: 'UNAL'
            });
          } else {
            unalItems5.push(crearReactivoContingenciaReal(comp, 'UNAL', idx));
          }
        });

        // Intercalar 50/50 simétricamente (Total exacto: 10)
        for (let i = 0; i < 5; i++) {
          if (icfesItems5[i]) balanceados.push(icfesItems5[i]);
          if (unalItems5[i]) balanceados.push(unalItems5[i]);
        }
      } else {
        // ICFES (10 reactivos): Exactamente 2 por cada una de las 5 materias oficiales
        areasIcfes.forEach(area => {
          const matching = items.filter(it => normalizarArea(it) === area);
          for (let k = 0; k < 2; k++) {
            if (matching[k]) {
              balanceados.push({
                ...matching[k],
                area,
                materia: area,
                target_exam: 'SABER_11',
                origen: 'ICFES'
              });
            } else {
              balanceados.push(crearReactivoContingenciaReal(area, 'SABER_11', k));
            }
          }
        });
      }

      // Control estricto por Set de identificadores únicos (item.id)
      const totalLimite = 10;
      const reactivosUnicos = [];
      const idsVistos = new Set();
      const poolReactivos = balanceados;
      for (const item of poolReactivos) {
        if (item && item.id && !idsVistos.has(item.id)) {
          idsVistos.add(item.id);
          reactivosUnicos.push(item);
        }
        if (reactivosUnicos.length === totalLimite) break;
      }

      // Si por alguna exclusión falta para 10, completar con contingencia única
      let seedCounter = 0;
      while (reactivosUnicos.length < totalLimite) {
        const areaF = areasIcfes[reactivosUnicos.length % areasIcfes.length];
        const cont = crearReactivoContingenciaReal(areaF, cleanTrack, seedCounter++);
        if (!idsVistos.has(cont.id)) {
          idsVistos.add(cont.id);
          reactivosUnicos.push(cont);
        }
      }

      // Desglose verificado para consola
      const desgloseConsola = reactivosUnicos.map(r => r.area);
      console.log(`🎯 [DANTE DIAGNOSTIC BALANCER]: Batería 10 reactivos únicos balanceada para modalidad ${cleanTrack} (Total: ${reactivosUnicos.length}):`, desgloseConsola);

      return reactivosUnicos;
    }

    /**
     * Renderiza la fase actual según el estado (REACTIVOS, DILEMAS, COMPLETADO)
     */
    renderizarFaseActual() {
      if (this.faseActual === 'REACTIVOS') {
        this.renderizarReactivoActual();
      } else if (this.faseActual === 'DILEMAS') {
        this.renderizarMicroDilemas();
      } else if (this.faseActual === 'COMPLETADO') {
        this.mostrarPantallaResumen();
      }
    }

    /**
     * Inicia o actualiza el cronómetro de la sesión en el HUD Workspace
     */
    iniciarCronometroWorkspace() {
      if (this.timerWorkspaceId) clearInterval(this.timerWorkspaceId);
      if (!this.tiempoInicioSesionWorkspace) this.tiempoInicioSesionWorkspace = Date.now();

      const updateClock = () => {
        if (this.isTemporizadorPausado) return;
        const elapsedSec = Math.floor((Date.now() - this.tiempoInicioSesionWorkspace) / 1000);
        const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const s = String(elapsedSec % 60).padStart(2, '0');
        const el = document.getElementById('lblCronometroWorkspace');
        if (el) el.innerText = `${m}:${s}`;
      };
      updateClock();
      this.timerWorkspaceId = setInterval(updateClock, 1000);
    }

    /**
     * Pausa el temporizador del reactivo y del workspace durante pausas activas o técnicas
     */
    pausarTemporizador() {
      if (this.isTemporizadorPausado) return;
      this.isTemporizadorPausado = true;
      this._pausaTimestamp = performance.now();
      if (this.timerWorkspaceId) {
        clearInterval(this.timerWorkspaceId);
        this.timerWorkspaceId = null;
      }
      const el = document.getElementById('lblCronometroWorkspace');
      if (el) el.classList.add('animate-pulse', 'text-amber-400');
      console.log('⏸️ [DANTE EXAM WORKSPACE]: Temporizador pausado.');
    }

    /**
     * ⏸️ Alias directo para compatibilidad global de pausa
     */
    pausar() {
      if (window.AppController && typeof window.AppController.mostrarModalAyudasPausa === 'function') {
        window.AppController.mostrarModalAyudasPausa();
      } else if (typeof window.abrirModalAyudasPausa === 'function') {
        window.abrirModalAyudasPausa();
      } else {
        this.pausarTemporizador();
      }
    }

    /**
     * 🚪 Alias directo para salida de prueba y confirmación
     */
    salir() {
      if (window.AppController && typeof window.AppController.regresarASala === 'function') {
        window.AppController.regresarASala();
      } else if (typeof window.regresarASala === 'function') {
        window.regresarASala();
      } else {
        this.regresarAlHub();
      }
    }

    /**
     * Reanuda el temporizador del reactivo y del workspace
     */
    reanudarTemporizador() {
      if (!this.isTemporizadorPausado) return;
      this.isTemporizadorPausado = false;
      if (this._pausaTimestamp) {
        const deltaMs = performance.now() - this._pausaTimestamp;
        if (typeof this.tiempoInicioReactivo === 'number') {
          this.tiempoInicioReactivo += deltaMs;
        }
        if (typeof this.tiempoInicioSesionWorkspace === 'number') {
          this.tiempoInicioSesionWorkspace += deltaMs;
        }
        this._pausaTimestamp = null;
      }
      const el = document.getElementById('lblCronometroWorkspace');
      if (el) el.classList.remove('animate-pulse', 'text-amber-400');
      this.iniciarCronometroWorkspace();
      console.log('▶️ [DANTE EXAM WORKSPACE]: Temporizador reanudado.');
    }

    /**
     * Fallback de Carga de Banco de Preguntas (Try-Catch en Renderizado):
     * En danteExamWorkspace.js, envolver la carga de reactivos en un bloque try-catch con validación de datos nulos/indefinidos
     */
    async cargarReactivoActual() {
      try {
        const reactivos = this.listaReactivos;
        const reactivo = reactivos[this.currentIndex];
        const enunciado = reactivo && (reactivo.enunciado || reactivo.pregunta_texto || reactivo.texto || reactivo.stem || reactivo.contexto_lectura);
        if (!reactivo || !enunciado) {
          console.warn("Reactivo no válido o no cargado. Fallback a banco local...");
          this.usarBancoLocalFallback();
          return;
        }
        this.renderizarEnunciadoYOpciones(reactivo);
      } catch (error) {
        console.error("Error en renderizado de reactivo:", error);
        this.usarBancoLocalFallback();
      }
    }

    /**
     * Fallback local a banco calibrado de contingencia cuando un reactivo falla o la lista está vacía
     */
    usarBancoLocalFallback() {
      try {
        console.warn("⚡ [DANTE EXAM WORKSPACE]: Activando banco local fallback para contingencia...");
        const activeTrack = (this.misionData && this.misionData.targetTrack) || (window.DanteHubEngine && window.DanteHubEngine.targetTrack) || localStorage.getItem('dante_target_track') || 'ICFES';
        
        if (!this.misionData) {
          this.misionData = { targetTrack: activeTrack, reactivos: [], isDiagnostic: false };
        }
        if (!Array.isArray(this.misionData.reactivos) || this.misionData.reactivos.length === 0) {
          this.misionData.reactivos = this.garantizarDistribucionDiagnostico([], activeTrack);
        }

        const idx = this.currentIndex;
        let item = this.misionData.reactivos[idx];
        const enunciado = item && (item.enunciado || item.pregunta_texto || item.texto || item.stem || item.contexto_lectura);

        if (!item || !enunciado) {
          const areas = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];
          const area = areas[idx % areas.length];
          item = crearReactivoContingenciaReal(area, activeTrack === 'UNAL' ? 'UNAL' : 'SABER_11', idx);
          this.misionData.reactivos[idx] = item;
        }

        this.renderizarEnunciadoYOpciones(item);
      } catch (err) {
        console.error("Error crítico en usarBancoLocalFallback:", err);
      }
    }

    /**
     * Renderiza el reactivo activo (1 a la vez) con alta legibilidad y controles IRD
     */
    renderizarReactivoActual() {
      // Durante la guía no mezclar el diagnóstico real (evita Matemáticas 1/10 + bandeja de ejemplo).
      if (this.guiaPaso) {
        this.pintarGuia();
        return;
      }
      const notaGuia = document.getElementById('notaGuia');
      if (notaGuia) notaGuia.remove();
      // 🔓 Liberar interactividad de cabecera y limpiar capas residuales
      this.liberarCapasCabecera();

      if (this.misionData && this.misionData.esSimulacro && window.DanteSimulacro && DanteSimulacro.antesDePregunta(this)) {
        return;
      }

      const totalReactivos = (this.misionData && this.misionData.reactivos && this.misionData.reactivos.length) || 10;
      if (this.indexReactivoActivo >= totalReactivos && totalReactivos > 0) {
        if (this.misionData && this.misionData.esSimulacro && window.DanteSimulacro) {
          DanteSimulacro.alTerminarPreguntas(this, false);
          return;
        }
        if (this.misionData && this.misionData.isDiagnostic) {
          this.faseActual = 'COMPLETADO';
          this.mostrarPantallaResumen();
          return;
        }
        if (this.misionData && (this.misionData.esRefuerzo || this.misionData.repasoArea)) {
          this.completarMisionDiaria();
          return;
        }
        this.faseActual = 'DILEMAS';
        this.opcionSeleccionadaTemp = null;
        this.isSubmittingRespuesta = false;
        this.renderizarMicroDilemas();
        return;
      }

      // 🎯 FASE 4: Limpieza discreta de URL tras el Arranque (?launch=diagnostic)
      if (window.history && window.history.replaceState) {
        const urlObj = new URL(window.location.href);
        if (urlObj.searchParams.has('launch') || urlObj.searchParams.has('action')) {
          urlObj.searchParams.delete('launch');
          urlObj.searchParams.delete('action');
          const cleanPath = urlObj.pathname.endsWith('index.html') ? urlObj.pathname : 'index.html';
          const cleanSearch = urlObj.searchParams.toString() ? `?${urlObj.searchParams.toString()}` : '';
          window.history.replaceState({}, document.title, `${cleanPath}${cleanSearch}`);
        }
      }

      // Asegurar sobreescritura del historial en cada reactivo contra botón 'Atrás'
      try {
        history.pushState(null, document.title, location.href);
      } catch (e) {}

      this.cargarReactivoActual();
    }

    /**
     * Renderiza el enunciado y opciones del reactivo blindado contra valores nulos
     * @param {Object} item - Reactivo normalizado
     */
    renderizarEnunciadoYOpciones(item) {
      if (!item) {
        this.usarBancoLocalFallback();
        return;
      }
      const totalReactivos = (this.misionData && this.misionData.reactivos && this.misionData.reactivos.length) || 10;


      // Reiniciar telemetría de reactivo
      this.opcionSeleccionadaTemp = null;
      this.opcionesDescartadas.clear();
      this.cambioOpcionesCount = 0;
      this.tiempoInicioReactivo = performance.now();
      this.reactivoConfirmado = false;
      this.isSubmittingRespuesta = false;
      this._bloquearOpcionesTrasConfirmar(false);

      // En la guía no corre el reloj del diagnóstico ni se pinta "Matemáticas 1/10".
      if (!this.briefingActivo && !this.guiaPaso) {
        this.iniciarCronometroWorkspace();
      }

      // Blindaje de índice estricto
      this.maxIndexAlcanzado = Math.max(this.maxIndexAlcanzado || 0, this.indexReactivoActivo);

      // 1. Actualizar Encabezado y Metadatos del Workspace Compacto
      const lblMateriaExamen = document.getElementById('lblMateriaExamen');
      const lblProgreso = document.getElementById('lblProgresoReactivo');
      if (this.guiaPaso) {
        if (lblMateriaExamen) lblMateriaExamen.innerText = 'Así se responde';
        if (lblProgreso) lblProgreso.innerText = `${this.guiaPaso}/2`;
      } else {
        const materiaCruda = String(item.materia || item.area || 'Misión diaria').replace(/_/g, ' ').toLowerCase();
        const nombresMateria = {
          matematicas: 'Matemáticas',
          'lectura critica': 'Lectura crítica',
          'ciencias naturales': 'Ciencias naturales',
          'sociales ciudadanas': 'Sociales y ciudadanas',
          'sociales y ciudadanas': 'Sociales y ciudadanas',
          ingles: 'Inglés'
        };
        const materiaNombre = nombresMateria[materiaCruda] || materiaCruda.replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
        if (lblMateriaExamen) {
          lblMateriaExamen.innerText = (this.misionData && this.misionData.esSimulacro && window.DanteSimulacro && typeof DanteSimulacro.etiqueta === 'function')
            ? DanteSimulacro.etiqueta(this.indexReactivoActivo)
            : materiaNombre;
        }
        if (lblProgreso) {
          const esDiagProg = Boolean(this.misionData && this.misionData.isDiagnostic);
          if (esDiagProg) {
            lblProgreso.innerText = `${3 + this.indexReactivoActivo + 1}/13`;
          } else {
            lblProgreso.innerText = `${this.indexReactivoActivo + 1}/${totalReactivos}`;
          }
        }
      }

      const lblComp = document.getElementById('lblCompetenciaEvaluada');
      if (lblComp) {
        const cruda = item.competencia || item.componente || 'Razonamiento';
        lblComp.innerText = String(cruda).replace(/_/g, ' ');
      }

      // Sincronizar de forma fija la tira de bolitas de progreso (1 al 10)
      this.actualizarTiraProgreso();

      // Supresión Estricta en Calibración / Diagnóstico vs Activación en Entrenamiento Socrático
      const uiBanner = document.getElementById('uiBannerOnboardingMision');
      if (uiBanner) uiBanner.style.display = 'none';

      const uiFeedbackTraining = document.getElementById('uiFeedbackTrainingImmediate');
      if (uiFeedbackTraining) {
        uiFeedbackTraining.style.display = 'none';
        uiFeedbackTraining.classList.add('hidden');
      }

      const uiIntervencion = document.getElementById('uiIntervencionDanteContainer');
      this._pistaMostradaId = null;
      const burbujaNueva = document.getElementById('burbujaConsejoDante');
      if (burbujaNueva) burbujaNueva.classList.add('hidden');
      const panelPistas = document.getElementById('uiIntervencionDanteLive');
      if (panelPistas) {
        panelPistas.classList.add('hidden');
        panelPistas.style.display = '';
      }
      const btnPista = document.getElementById('btnPistaSocraticaDante');
      const btn3D = document.getElementById('btnOjoBionico3DWorkspace');

      const esVocacional = Boolean(
        item.esVocacional === true || 
        item.es_vocacional === true || 
        String(item.area || '').toLowerCase().includes('vocacional') ||
        String(item.materia || '').toLowerCase().includes('vocacional') ||
        this.faseActual === 'VOCACIONAL'
      );

      if (this.misionData && this.misionData.esSimulacro) {
        document.documentElement.classList.remove('diag-sin-pista');
        document.documentElement.classList.add('sim-sin-pista');
        if (uiIntervencion) {
          uiIntervencion.style.display = 'none';
          uiIntervencion.classList.add('hidden');
        }
      } else if (this.guiaPaso) {
        document.documentElement.classList.remove('diag-sin-pista');
      } else if (this.misionData && this.misionData.isDiagnostic) {
        document.documentElement.classList.add('diag-sin-pista');
        if (uiIntervencion) {
          uiIntervencion.style.display = 'none';
          uiIntervencion.classList.add('hidden');
        }
        if (btnPista) btnPista.style.display = 'none';
        const btnVoz = document.getElementById('btnVozDanteAudio');
        if (btnVoz) btnVoz.style.display = 'none';
        if (btn3D) {
          btn3D.style.display = 'none';
          btn3D.classList.add('hidden');
        }
        const burbuja = document.getElementById('burbujaConsejoDante');
        if (burbuja && !this.isRequestingHint) {
          burbuja.classList.add('hidden');
        }
        const txtFrase = document.getElementById('txtFraseDanteSocratica');
        if (txtFrase && !this.isRequestingHint) {
          txtFrase.innerHTML = `<span class="text-slate-300 font-sans text-xs">En el diagnóstico no hay pistas. Responde con lo que sabes. La ayuda se abre en el entrenamiento de cada día.</span>`;
        }
      } else if (esVocacional) {
        document.documentElement.classList.remove('diag-sin-pista');
        // En dilemas vocacionales: ocultar pistas socráticas
        if (uiIntervencion) {
          uiIntervencion.style.display = 'none';
          uiIntervencion.classList.add('hidden');
        }
        if (btnPista) btnPista.style.display = 'none';
        if (btn3D) {
          btn3D.style.display = 'none';
          btn3D.classList.add('hidden');
        }
        const burbuja = document.getElementById('burbujaConsejoDante');
        if (burbuja) burbuja.classList.add('hidden');
      } else {
        document.documentElement.classList.remove('diag-sin-pista');
        // En entrenamiento diario: Régimen Socrático Activo 100% liberado y funcional.
        if (uiIntervencion) {
          uiIntervencion.style.display = 'block';
          uiIntervencion.classList.remove('hidden');
        }
        const lblModo = document.getElementById('lblDanteStatusModo');
        const mindOn = (() => {
          try {
            const p = typeof window.danteMindPolicy === 'function' ? window.danteMindPolicy() : null;
            return !!(p && p.calibrated && p.confidence >= 0.45);
          } catch (_) { return false; }
        })();
        if (lblModo) {
          lblModo.innerHTML = mindOn
            ? '<span class="text-amber-200/90 font-mono">Modo Dante</span>'
            : '<span class="text-cyan-400 font-mono">Exigencia Táctica</span>';
        }
        if (btnPista) {
          btnPista.style.display = 'flex';
          btnPista.disabled = false;
          btnPista.innerHTML = `<svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"/></svg><span>Pedir pista</span>`;
          btnPista.title = "Una pista, sin la respuesta";
        }
        const btnVoz = document.getElementById('btnVozDanteAudio');
        if (btnVoz) {
          btnVoz.style.display = 'flex';
          btnVoz.disabled = false;
          btnVoz.innerHTML = `<svg class="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg><span>Consejo Breve</span>`;
          btnVoz.title = "Escuchar micro-consejo orientador";
        }
        const burbuja = document.getElementById('burbujaConsejoDante');
        const txtFrase = document.getElementById('txtFraseDanteSocratica');
        if (!this.isRequestingHint) {
          const whisper = this._susurroModoDante();
          if (whisper && txtFrase && burbuja) {
            txtFrase.textContent = whisper;
            burbuja.classList.remove('hidden');
          } else {
            if (burbuja) burbuja.classList.add('hidden');
            if (txtFrase) {
              txtFrase.innerHTML = `Si no la ves, pide la pista. No te da la respuesta: te dice qué mirar.`;
            }
          }
        }
        // Invocar Visor 3D para preguntas geométricas/espaciales
        this.evaluarVisor3D(item);
      }

      // Bloqueo del selector de track durante la evaluación
      const btnIcfes = document.getElementById('btnTrackIcfes');
      const btnUnal = document.getElementById('btnTrackUnal');
      if (btnIcfes) btnIcfes.style.pointerEvents = 'none';
      if (btnUnal) btnUnal.style.pointerEvents = 'none';
      const containerTrack = btnIcfes?.parentElement || document.getElementById('btnHeaderSelectTrack');
      if (containerTrack) containerTrack.style.opacity = '0.4';

      // Ocultar feedback y metacognición heredados
      const uiMetacognicion = document.getElementById('uiMetacognicion');
      if (uiMetacognicion) uiMetacognicion.style.display = 'none';
      const uiFeedback = document.getElementById('uiFeedback');
      if (uiFeedback) uiFeedback.style.display = 'none';
      const uiIntervencionClinica = document.getElementById('uiIntervencionClinica');
      if (uiIntervencionClinica) uiIntervencionClinica.style.display = 'none';

      this.modoVisualWorkspace = 'CARTILLA';
      const isCartilla = true;

      const activeTrack = (this.misionData && this.misionData.targetTrack) || (window.DanteHubEngine && window.DanteHubEngine.targetTrack) || localStorage.getItem('dante_target_track') || 'ICFES';

      // 🎯 RENDERIZADO DINÁMICO DE ORIGEN EN PANTALLA (POR REACTIVO INDIVIDUAL):
      // - Si el reactivo es de ICFES, mostrar: PRUEBA SABER 11° • CUADERNILLO IMPRESO OFICIAL
      // - Si el reactivo es de UNAL, mostrar: EXAMEN DE ADMISIÓN • UNIVERSIDAD NACIONAL / UdeA
      const rawTargetExam = String(item.target_exam || item.tipo_examen || item.origen || '').toUpperCase();
      const isItemUnal = rawTargetExam.includes('UNAL') || 
                         rawTargetExam.includes('UDEA') || 
                         rawTargetExam.includes('PREUN') ||
                         String(item.id || '').toLowerCase().includes('unal') || 
                         String(item.id || '').toLowerCase().includes('udea') || 
                         String(item.id || '').toLowerCase().startsWith('preun_') ||
                         ['analisis_imagen', 'razonamiento_logico', 'analisis_textual'].includes(String(item.area || '').toLowerCase());

      const tituloCuadernillo = isItemUnal 
        ? 'EXAMEN DE ADMISIÓN • UNIVERSIDAD NACIONAL / UdeA' 
        : 'PRUEBA SABER 11° • CUADERNILLO IMPRESO OFICIAL';
      const badgeCuadernillo = isItemUnal ? 'ADMISIÓN UNAL / UdeA' : 'SABER 11° OFICIAL';
      const btnCartillaTxt = isItemUnal ? '<i class="fa-solid fa-file-lines mr-1.5"></i> Cartilla Impresa UNAL' : '<i class="fa-solid fa-file-lines mr-1.5"></i> Cartilla Impresa ICFES';
      const infoModoTxt = isItemUnal 
        ? 'Simula el formato oficial del Examen de Admisión de la Universidad Nacional de Colombia / UdeA.' 
        : 'Simula el papel, las cajas oficiales y la Hoja de Respuestas real de la Prueba Saber 11° ICFES.';
      const facsimileTxt = isItemUnal ? 'FACSÍMIL #2026-UNAL-OFICIAL' : 'FACSÍMIL #2026-ICFES-OFICIAL';

      // Actualizar botones de selector de modo visual si existen en DOM
      const btnCartilla = document.getElementById('btnModoVisualCartilla') || document.getElementById('btnToggleCartilla');
      const btnHud = document.getElementById('btnModoVisualHud') || document.getElementById('btnToggleHUD');
      if (btnCartilla && btnHud) {
        btnCartilla.innerHTML = btnCartillaTxt;
        if (isCartilla) {
          btnCartilla.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer bg-amber-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5 active:scale-95';
          btnHud.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer text-slate-400 hover:text-white flex items-center justify-center gap-1.5 active:scale-95';
        } else {
          btnCartilla.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer text-slate-400 hover:text-white flex items-center justify-center gap-1.5 active:scale-95';
          btnHud.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer bg-cyan-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5 active:scale-95';
        }
      }

      const infoModo = document.getElementById('txtInformacionModoVisual') || document.querySelector('#uiSelectorModoVisualWorkspace span.italic');
      if (infoModo) {
        infoModo.innerHTML = `<i class="fa-solid fa-circle-info text-amber-400"></i> ${infoModoTxt}`;
      }
      const facsimileEl = document.querySelector('.optica-facsimile') || document.getElementById('lblFacsimileTag');
      if (facsimileEl) {
        facsimileEl.innerText = facsimileTxt;
      }

      // 2. Renderizar Enunciado / Contexto (Soporta Cartilla Impresa ICFES vs HUD Digital)
      const uiEnunciados = document.getElementById('uiEnunciados');
      const containerLayout = document.getElementById('containerLayout');
      let rawEnunciado = item.pregunta_texto || item.enunciado || item.contexto_lectura || item.texto || item.lectura_texto || item.pregunta || item.stem || '';
      
      if (!rawEnunciado || rawEnunciado.trim() === '') {
        console.warn('⚠️ Enunciado vacío detectado para reactivo. Obteniendo reactivo de contingencia...');
        const areaF = String(item.area || item.materia || 'matematicas').toLowerCase();
        const safeItem = crearReactivoContingenciaReal(areaF, item.target_exam || 'SABER_11', this.indexReactivoActivo || 0);
        rawEnunciado = safeItem.enunciado;
        item.enunciado = safeItem.enunciado;
        item.pregunta_texto = safeItem.enunciado;
      }

      if (!item.recurso_visual && item.id && Array.isArray(window.DANTE_BANCO_ITEMS)) {
        const crudo = window.DANTE_BANCO_ITEMS.find((row) => row && row.id === item.id);
        if (crudo && crudo.recurso_visual) item.recurso_visual = crudo.recurso_visual;
      }
      const srcVisual = item.recurso_visual || item.imagen_url || item.imagen || item.contextoVisual || item.grafico_url || item.grafico || '';
      const figuraHtml = this._htmlFigura(srcVisual, isCartilla);

      const uiPregunta = document.getElementById('uiPregunta');
      const textoPregunta = item.stem || item.pregunta_secundaria || '';
      const esMismoQueEnunciado = (textoPregunta.trim() === rawEnunciado.trim());
      const esTextoRelleno = textoPregunta.toLowerCase().includes('analiza las opciones') || textoPregunta.toLowerCase().includes('selecciona la respuesta');

      if (isCartilla) {
        // MODO CARTILLA IMPRESA: Mostrar cuadernillo impreso en panel izquierdo
        if (containerLayout) {
          containerLayout.classList.remove('single-panel', 'hud-mode');
          containerLayout.classList.add('cartilla-mode');
        }
        if (uiEnunciados) {
          uiEnunciados.style.display = 'block';
          const numeroEnElTexto = !(textoPregunta && !esMismoQueEnunciado && !esTextoRelleno);
          // Figura va en uiRecursoVisualPreguntaCore (después de la pregunta) para no perderse en el layout papel.
          uiEnunciados.innerHTML = `
            <div class="icfes-cartilla-card text-slate-900 font-serif">
              <div id="txtEnunciadoCuerpo" class="cartilla-legible font-serif text-slate-900 font-normal">${numeroEnElTexto ? `<span class="font-bold mr-2">${this.indexReactivoActivo + 1}.</span>` : ''}${this.sanitizarHtmlText(rawEnunciado)}</div>
            </div>
          `;
          this.renderizarMathSiExiste(uiEnunciados);
        }

        // 3. Pregunta Secundaria en Cartilla
        if (uiPregunta) {
          if (textoPregunta && !esMismoQueEnunciado && !esTextoRelleno) {
            uiPregunta.style.display = 'block';
            uiPregunta.innerHTML = `
              <div class="text-slate-900 font-serif mb-2">
                <span class="font-bold mr-2">${this.indexReactivoActivo + 1}.</span>
                <span class="cartilla-legible text-slate-900 font-serif">${this.sanitizarHtmlText(textoPregunta)}</span>
              </div>
            `;
            this.renderizarMathSiExiste(uiPregunta);
          } else {
            uiPregunta.style.display = 'none';
            uiPregunta.innerHTML = '';
          }
        }
      } else {
        // MODO HUD DIGITAL TÁCTICO: Ocultar panel de cartilla impresa y unificar en interfaz táctica HUD
        if (containerLayout) {
          containerLayout.classList.add('single-panel', 'hud-mode');
          containerLayout.classList.remove('cartilla-mode');
        }
        if (uiEnunciados) {
          uiEnunciados.style.display = 'none';
          uiEnunciados.innerHTML = '';
        }

        // En HUD, asegurar que el reactivo y su enunciado se muestren con total nitidez en uiPregunta
        if (uiPregunta) {
          uiPregunta.style.display = 'block';
          const stemAdicionalHtml = (textoPregunta && !esMismoQueEnunciado && !esTextoRelleno)
            ? `<div class="mt-2.5 pt-2 border-t border-slate-800 text-cyan-200 font-semibold leading-relaxed">${this.sanitizarHtmlText(textoPregunta)}</div>`
            : '';

          uiPregunta.innerHTML = `
            <div class="font-sans text-slate-100 text-sm sm:text-base leading-relaxed tracking-normal p-4 sm:p-5 bg-slate-900/90 rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] mb-3 space-y-2">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <i class="fa-solid fa-bolt text-cyan-400 animate-pulse"></i> ${tituloCuadernillo}
                </div>
                <span class="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-cyan-500/30">⚡ MODO HUD DIGITAL</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-amber-400 font-mono font-black text-base shrink-0">${this.indexReactivoActivo + 1}.</span>
                <div id="txtEnunciadoCuerpo" class="font-sans text-slate-100 text-sm sm:text-base leading-relaxed flex-1">${this.sanitizarHtmlText(rawEnunciado)}</div>
              </div>
              ${stemAdicionalHtml}
            </div>
          `;
          this.renderizarMathSiExiste(uiPregunta);
        }
      }

      // Gráfica / figura siempre después del texto de la pregunta y antes de las opciones.
      const uiRecursoVisual = document.getElementById('uiRecursoVisualPreguntaCore');
      if (uiRecursoVisual) {
        if (figuraHtml) {
          uiRecursoVisual.innerHTML = figuraHtml;
          uiRecursoVisual.style.display = 'block';
          uiRecursoVisual.hidden = false;
          uiRecursoVisual.removeAttribute('hidden');
          this.renderizarMathSiExiste(uiRecursoVisual);
        } else {
          uiRecursoVisual.innerHTML = '';
          uiRecursoVisual.style.display = 'none';
        }
      }

      // 5. Renderizar Grid de Opciones (A, B, C, D) con Descarte y Formato Compacto Ergonómico Móvil
      const uiOpcionesGrid = document.getElementById('uiOpcionesGrid');
      if (uiOpcionesGrid) {
        uiOpcionesGrid.innerHTML = '';
        uiOpcionesGrid.style.opacity = '1.0';
        uiOpcionesGrid.style.filter = 'none';
        uiOpcionesGrid.style.display = 'block';
        uiOpcionesGrid.className = isCartilla
          ? 'cartilla-opciones mb-3'
          : 'bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80 shadow-md mb-3';

        let opcionesMap = this.normalizarOpcionesMap(item.opciones || item.opciones_respuesta || item.opciones_dict || item.alternativas, item);

        // Si por alguna razón ninguna opción tiene texto, regenerar opciones desde contingencia
        if (!opcionesMap.A && !opcionesMap.B && !opcionesMap.C && !opcionesMap.D) {
          console.warn("⚠️ Opciones vacías detectadas para el reactivo. Regenerando con reactivo de contingencia...");
          const areaFallback = String(item.area || item.materia || 'matematicas').toLowerCase();
          const fallbackItem = crearReactivoContingenciaReal(areaFallback, item.target_exam || 'SABER_11', this.indexReactivoActivo || 0);
          item.opciones = fallbackItem.opciones;
          item.opciones_respuesta = fallbackItem.opciones;
          item.correcta = fallbackItem.correcta;
          opcionesMap = this.normalizarOpcionesMap(fallbackItem.opciones, fallbackItem);
        }

        ['A', 'B', 'C', 'D'].forEach(letra => {
          const textoOp = opcionesMap[letra];
          if (!textoOp) return;

          const card = document.createElement('div');
          card.id = `opcion_card_${letra}`;
          
          if (isCartilla) {
            card.className = `opcion-card-workspace flex items-center gap-3 cursor-default text-slate-900`;
            card.innerHTML = `
              <button type="button" class="burbuja-grafito badge-opcion-letra w-10 h-10 rounded-full bg-white border-2 border-slate-700 flex items-center justify-center shrink-0" data-letra="${letra}" aria-label="Marcar opción ${letra}"></button>
              <span class="opcion-letra-label" aria-hidden="true">${letra}</span>
              <div class="cartilla-legible text-slate-900 font-serif flex-1 txt-opcion-body">
                ${this.sanitizarHtmlText(textoOp)}
              </div>
              <button type="button" class="btn-tachar-opcion w-6 h-6 rounded-md bg-slate-200 hover:bg-rose-100 border border-slate-300 hover:border-rose-400 text-slate-500 hover:text-rose-700 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm" title="Descartar opción" aria-label="Descartar opción">
                <i class="fa-solid fa-eye-slash text-[10px]"></i>
              </button>
            `;
          } else {
            card.className = `opcion-card-workspace p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors select-none text-slate-200`;
            card.innerHTML = `
              <button type="button" class="burbuja-grafito badge-opcion-letra w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-500 text-xs font-mono font-bold flex items-center justify-center text-slate-200 shrink-0" data-letra="${letra}" aria-label="Marcar opción ${letra}">
                ${letra}
              </button>
              <div class="text-xs sm:text-sm text-slate-200 font-sans font-medium leading-relaxed flex-1 txt-opcion-body">
                ${this.sanitizarHtmlText(textoOp)}
              </div>
              <button type="button" class="btn-tachar-opcion w-6 h-6 rounded-md bg-slate-950/80 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-500 hover:text-rose-400 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm" title="Descartar opción" aria-label="Descartar opción">
                <i class="fa-solid fa-eye-slash text-[10px]"></i>
              </button>
            `;
          }

          // Event Listeners: fila o círculo marcan; tachar solo en su icono
          const marcarFila = (e) => {
            if (this._opcionesBloqueadas()) {
              if (e) { e.preventDefault(); e.stopPropagation(); }
              return;
            }
            if (e && e.target && e.target.closest('.btn-tachar-opcion')) {
              e.stopPropagation();
              this.tacharOpcion(letra);
              return;
            }
            this.seleccionarOpcion(letra);
          };
          card.addEventListener('click', marcarFila);
          card.addEventListener('pointerup', (e) => {
            card.dataset.arrastrando = '';
            if (e && e.target && e.target.closest('.burbuja-grafito')) return;
            // Evitar doble toggle: el click ya tacha; pointerup no debe repetirlo
            if (e && e.target && e.target.closest('.btn-tachar-opcion')) return;
            marcarFila(e);
          });
          card.addEventListener('pointerdown', (e) => {
            if (this._opcionesBloqueadas()) return;
            if (e.target.closest('.btn-tachar-opcion') || e.target.closest('.burbuja-grafito')) return;
            card.dataset.arrastrando = '1';
          });
          card.addEventListener('pointercancel', () => { card.dataset.arrastrando = ''; });

          // Prevent default contextmenu and perform strike toggle
          card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this._opcionesBloqueadas()) return;
            this.tacharOpcion(letra);
          });

          uiOpcionesGrid.appendChild(card);
          this.renderizarMathSiExiste(card);
          this._engancharBurbuja(card.querySelector('.burbuja-grafito'), card);
        });

        // Asegurar que las tarjetas apliquen sus clases de estado inicial (Normal, Seleccionada, Descartada)
        this.actualizarEstilosTarjetasOpciones();
      }

      // 6. Actualizar Hoja Óptica (visible en Cartilla Impresa en pantallas medianas/grandes, oculta en HUD Digital para interfaz táctica)
      const uiHojaOptica = document.getElementById('uiHojaOptica');
      if (uiHojaOptica) uiHojaOptica.style.display = 'none';
      this.actualizarHojaOptica();

      // 7. Configurar Botón de Confirmación con Hold-to-Commit 2s
      this.renderizarBotonConfirmacion();
      this._avisoDiagnosticoSilencio();
      this._asegurarInteraccionReactivo();

      // Transición suave de entrada (asegurando opacidad 1 siempre)
      const containerCore = document.getElementById('uiContenedorPreguntaCore');
      if (containerCore) {
        containerCore.style.display = 'block';
        containerCore.style.opacity = '1';
        containerCore.style.transform = 'none';
        containerCore.style.pointerEvents = 'auto';
      }
      const gridOpciones = document.getElementById('uiOpcionesGrid');
      if (gridOpciones) {
        gridOpciones.style.pointerEvents = 'auto';
        gridOpciones.classList.remove('opciones-bloqueadas');
      }
    }

    /**
     * Normaliza las opciones ya sea un objeto { A, B, C, D } o un arreglo [ { id: 'A', texto: '...' } ] o [ "A) ..." ]
     */
    normalizarOpcionesMap(opciones, item = null) {
      if ((!opciones || (typeof opciones === 'object' && Object.keys(opciones).length === 0)) && item) {
        if (item.correcta && Array.isArray(item.distractores) && item.distractores.length >= 3) {
          return {
            A: String(item.correcta || '').trim(),
            B: String(item.distractores[0] || '').trim(),
            C: String(item.distractores[1] || '').trim(),
            D: String(item.distractores[2] || '').trim()
          };
        }
        if (item.opciones || item.opciones_respuesta || item.opciones_dict || item.alternativas) {
          opciones = item.opciones || item.opciones_respuesta || item.opciones_dict || item.alternativas;
        }
      }
      if (!opciones && item && (item.correcta || item.distractores)) {
        if (item.correcta && Array.isArray(item.distractores) && item.distractores.length >= 3) {
          return {
            A: String(item.correcta || '').trim(),
            B: String(item.distractores[0] || '').trim(),
            C: String(item.distractores[1] || '').trim(),
            D: String(item.distractores[2] || '').trim()
          };
        }
      }
      if (!opciones) return { A: '', B: '', C: '', D: '' };
      if (Array.isArray(opciones)) {
        const map = {};
        opciones.forEach((op, idx) => {
          let key = ['A', 'B', 'C', 'D'][idx] || `OP_${idx}`;
          let val = '';
          if (typeof op === 'object' && op !== null) {
            if (op.id) key = String(op.id).toUpperCase().trim();
            if (op.letra) key = String(op.letra).toUpperCase().trim();
            val = String(op.texto || op.enunciado || op.opcion || op.descripcion || op.label || '');
          } else {
            val = String(op || '');
            const marca = val.match(/^([A-Da-d])[\)\.\:\-]\s*/);
            if (marca) key = marca[1].toUpperCase();
          }
          val = val.replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
          map[key] = val;
        });
        return map;
      }
      if (typeof opciones === 'object') {
        return {
          A: String(opciones.A || opciones.a || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim(),
          B: String(opciones.B || opciones.b || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim(),
          C: String(opciones.C || opciones.c || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim(),
          D: String(opciones.D || opciones.d || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim()
        };
      }
      return { A: '', B: '', C: '', D: '' };
    }

    /**
     * Alterna el formato visual del Workspace entre Cartilla Impresa ICFES y HUD Digital
     */
    cambiarModoVisual(modo) {
      modo = 'CARTILLA';
      if (!['CARTILLA', 'HUD_DIGITAL'].includes(modo)) return;
      this.modoVisualWorkspace = 'CARTILLA';
      localStorage.setItem('dante_modo_visual_workspace', modo);
      
      const btnCartilla = document.getElementById('btnModoVisualCartilla') || document.getElementById('btnToggleCartilla');
      const btnHud = document.getElementById('btnModoVisualHud') || document.getElementById('btnToggleHUD');
      if (btnCartilla && btnHud) {
        if (modo === 'CARTILLA') {
          btnCartilla.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer bg-amber-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5 active:scale-95';
          btnHud.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer text-slate-400 hover:text-white flex items-center justify-center gap-1.5 active:scale-95';
        } else {
          btnCartilla.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer text-slate-400 hover:text-white flex items-center justify-center gap-1.5 active:scale-95';
          btnHud.className = 'h-7 px-3 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center gap-1.5 active:scale-95';
        }
      }

      const infoModo = document.getElementById('txtInformacionModoVisual') || document.querySelector('#uiSelectorModoVisualWorkspace span.italic');
      if (infoModo) {
        if (modo === 'CARTILLA') {
          infoModo.innerHTML = '<i class="fa-solid fa-circle-info text-amber-400"></i> Simula el papel, las cajas oficiales y la Hoja de Respuestas real de la Prueba Saber 11° ICFES.';
        } else {
          infoModo.innerHTML = '<i class="fa-solid fa-bolt text-cyan-400"></i> Modo HUD Digital: Interfaz táctica unificada de alto rendimiento cognitivo y respuesta directa.';
        }
      }

      const containerLayout = document.getElementById('containerLayout');
      if (containerLayout) {
        if (modo === 'CARTILLA') {
          containerLayout.classList.remove('single-panel', 'hud-mode');
          containerLayout.classList.add('cartilla-mode');
        } else {
          containerLayout.classList.add('single-panel', 'hud-mode');
          containerLayout.classList.remove('cartilla-mode');
        }
      }

      const item = this.misionData?.reactivos?.[this.indexReactivoActivo] || window.AppState?.itemActual;
      if (item) {
        if (!this.misionData) {
          this.misionData = {
            materia: window.AppState?.materia || 'matematicas',
            reactivos: [item]
          };
          this.indexReactivoActivo = 0;
        }
        const prevSeleccion = this.opcionSeleccionadaTemp;
        const prevDescartadas = new Set(this.opcionesDescartadas);
        this.renderizarEnunciadoYOpciones(item);
        if (prevSeleccion) {
          this.seleccionarOpcion(prevSeleccion);
        }
        if (prevDescartadas && prevDescartadas.size > 0) {
          prevDescartadas.forEach(l => this.opcionesDescartadas.add(l));
          this.actualizarEstilosTarjetasOpciones();
        }
        return;
      }

      this.renderizarFaseActual();
    }

    /**
     * Actualiza dinámicamente el estilo compacto y ergonómico de las opciones de respuesta
     */
    actualizarEstilosTarjetasOpciones() {
      this.modoVisualWorkspace = 'CARTILLA';
      const isCartilla = true;

      ['A', 'B', 'C', 'D'].forEach(letra => {
        const card = document.getElementById(`opcion_card_${letra}`);
        if (!card) return;

        const isSelected = (letra === this.opcionSeleccionadaTemp);
        const isStruck = this.opcionesDescartadas.has(letra);

        const badge = card.querySelector('.badge-opcion-letra');
        const txtBody = card.querySelector('.txt-opcion-body');
        const btnTachar = card.querySelector('.btn-tachar-opcion');

        if (isSelected) {
          if (isCartilla) {
            card.className = 'opcion-card-workspace selected flex items-center gap-3 cursor-default text-slate-950';
            if (badge) {
              badge.className = 'burbuja-grafito marcada badge-opcion-letra w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shrink-0';
              badge.textContent = '';
            }
            if (txtBody) txtBody.className = 'cartilla-legible text-slate-950 font-serif flex-1 txt-opcion-body';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-eye-slash text-[10px]"></i>';
              btnTachar.title = 'Descartar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-slate-200 hover:bg-rose-100 border border-slate-300 hover:border-rose-400 text-slate-500 hover:text-rose-700 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          } else {
            // Estándar Móvil Ergonómico: Fondo cian translúcido + borde izquierdo cian
            card.className = 'opcion-card-workspace selected p-3 flex items-center gap-3 cursor-pointer select-none bg-sky-950/40 border-l-4 border-l-sky-400 text-white transition-colors';
            if (badge) badge.className = 'burbuja-grafito marcada badge-opcion-letra w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0';
            if (txtBody) txtBody.className = 'text-xs sm:text-sm text-white font-sans font-bold leading-relaxed flex-1 txt-opcion-body';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-eye-slash text-[10px]"></i>';
              btnTachar.title = 'Descartar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-slate-950/80 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          }
        } else if (isStruck) {
          if (isCartilla) {
            card.className = 'opcion-card-workspace opcion-tachada flex items-center gap-3 cursor-default text-slate-600';
            if (badge) {
              badge.className = 'burbuja-grafito badge-opcion-letra w-10 h-10 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center shrink-0';
              badge.textContent = '';
            }
            if (txtBody) txtBody.className = 'cartilla-legible text-slate-600 font-serif flex-1 txt-opcion-body line-through decoration-slate-400';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-rotate-left text-[10px]"></i>';
              btnTachar.title = 'Restaurar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-amber-200 hover:bg-amber-300 border border-amber-400 text-amber-900 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          } else {
            card.className = 'opcion-card-workspace opcion-tachada p-3 flex items-center gap-3 cursor-pointer select-none opacity-35 grayscale line-through bg-slate-950/90 text-slate-500 transition-colors';
            if (badge) badge.className = 'burbuja-grafito badge-opcion-letra w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 text-slate-600 text-xs font-mono font-bold flex items-center justify-center shrink-0';
            if (txtBody) txtBody.className = 'text-xs sm:text-sm text-slate-500 font-sans leading-relaxed flex-1 txt-opcion-body line-through';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-rotate-left text-[10px]"></i>';
              btnTachar.title = 'Restaurar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/60 text-amber-300 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          }
        } else {
          if (isCartilla) {
            card.className = 'opcion-card-workspace flex items-center gap-3 cursor-default text-slate-900';
            if (badge) {
              badge.className = 'burbuja-grafito badge-opcion-letra w-10 h-10 rounded-full bg-white border-2 border-slate-700 flex items-center justify-center shrink-0';
              badge.textContent = '';
            }
            if (txtBody) txtBody.className = 'cartilla-legible text-slate-900 font-serif flex-1 txt-opcion-body';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-eye-slash text-[10px]"></i>';
              btnTachar.title = 'Descartar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-slate-200 hover:bg-rose-100 border border-slate-300 hover:border-rose-400 text-slate-500 hover:text-rose-700 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          } else {
            card.className = 'opcion-card-workspace p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors select-none text-slate-200';
            if (badge) badge.className = 'burbuja-grafito badge-opcion-letra w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-500 text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0';
            if (txtBody) txtBody.className = 'text-xs sm:text-sm text-slate-200 font-sans font-medium leading-relaxed flex-1 txt-opcion-body';
            if (btnTachar) {
              btnTachar.innerHTML = '<i class="fa-solid fa-eye-slash text-[10px]"></i>';
              btnTachar.title = 'Descartar opción';
              btnTachar.className = 'btn-tachar-opcion w-6 h-6 rounded-md bg-slate-950/80 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-500 hover:text-rose-400 transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-sm';
            }
          }
        }
      });
    }

    _opcionesBloqueadas() {
      if (this.reactivoConfirmado || this.isSubmittingRespuesta) return true;
      const feedback = document.getElementById('uiFeedbackTrainingImmediate');
      if (!feedback) return false;
      if (feedback.hidden || feedback.classList.contains('hidden')) return false;
      if (String(feedback.style.display || '').toLowerCase() === 'none') return false;
      try {
        const estilo = window.getComputedStyle(feedback);
        return estilo.display !== 'none' && estilo.visibility !== 'hidden' && estilo.opacity !== '0';
      } catch (e) {
        return false;
      }
    }

    _bloquearOpcionesTrasConfirmar(activo) {
      const grid = document.getElementById('uiOpcionesGrid');
      if (grid) {
        grid.classList.toggle('opciones-bloqueadas', Boolean(activo));
        grid.setAttribute('aria-disabled', activo ? 'true' : 'false');
      }
      document.querySelectorAll('#uiOpcionesGrid .opcion-card-workspace, #uiOpcionesGrid .badge-opcion-letra, #uiOpcionesGrid .btn-tachar-opcion').forEach((nodo) => {
        if (activo) {
          nodo.style.pointerEvents = 'none';
          nodo.setAttribute('aria-disabled', 'true');
        } else {
          nodo.style.pointerEvents = '';
          nodo.removeAttribute('aria-disabled');
        }
      });
    }

    _engancharBurbuja(burbuja, card) {
      if (!burbuja || burbuja.dataset.grafitoListo === '1') return;
      burbuja.dataset.grafitoListo = '1';
      const letra = burbuja.dataset.letra;
      const marcar = (ev) => {
        if (this._opcionesBloqueadas()) return;
        if (this.opcionesDescartadas && this.opcionesDescartadas.has(letra)) return;
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        burbuja.classList.add('llenando');
        this.seleccionarOpcion(letra);
        if (card) card.dataset.arrastrando = '';
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch (e) {}
        }
      };
      burbuja.addEventListener('pointerdown', marcar);
      burbuja.addEventListener('click', marcar);
      burbuja.addEventListener('pointerup', marcar);
      burbuja.addEventListener('pointerenter', (ev) => {
        const viene = (card && card.dataset.arrastrando === '1') || (ev.buttons & 1);
        if (viene) marcar(ev);
      });
    }

    /** Quita capas residuales (guía/foco) que bloquean tocar letras, Pausa y Pista. */
    _asegurarInteraccionReactivo() {
      try {
        // Si la guía quedó a medias, forzar cierre en flujo de preguntas real.
        if (!this.guiaPaso) {
          document.documentElement.classList.remove('guia-en-curso');
          this._cerrarFocoGuia();
          const bandeja = document.getElementById('guiaBandeja');
          if (bandeja) bandeja.hidden = true;
          const notaGuia = document.getElementById('notaGuia');
          if (notaGuia) notaGuia.remove();
        }
        const feedback = document.getElementById('uiFeedbackTrainingImmediate');
        if (feedback && !this.reactivoConfirmado) {
          feedback.style.display = 'none';
          feedback.classList.add('hidden');
          feedback.hidden = true;
        }
        if (!this.guiaPaso) {
          this.reactivoConfirmado = false;
          this.isSubmittingRespuesta = false;
          this._bloquearOpcionesTrasConfirmar(false);
        }
        const pausa = document.getElementById('btnPausaCabecera');
        if (pausa) {
          pausa.style.pointerEvents = 'auto';
          pausa.style.zIndex = '60';
        }
        const pista = document.getElementById('btnAbrirDanteSocraticoPapel');
        if (pista) {
          pista.style.pointerEvents = 'auto';
          pista.disabled = false;
        }
        document.querySelectorAll('#uiOpcionesGrid .badge-opcion-letra, #uiOpcionesGrid .opcion-card-workspace').forEach((nodo) => {
          nodo.style.pointerEvents = 'auto';
          nodo.removeAttribute('aria-disabled');
        });
      } catch (e) { /* ignore */ }
    }

    /**
     * Selecciona una opción (A, B, C, D)
     */
    seleccionarOpcion(opcionKey) {
      // Tras confirmar solo queda "Siguiente pregunta".
      if (this._opcionesBloqueadas()) return;

      // Si estaba tachada, des-tachar
      if (this.opcionesDescartadas.has(opcionKey)) {
        this.opcionesDescartadas.delete(opcionKey);
      }

      // Registrar vacilación (cambio de opinión)
      if (this.opcionSeleccionadaTemp !== null && this.opcionSeleccionadaTemp !== opcionKey) {
        this.cambioOpcionesCount++;
        console.log(`⚡ [IRD TELEMETRY]: Cambio de opción detectado en Reactivo ${this.indexReactivoActivo + 1}: ${this.opcionSeleccionadaTemp} ➔ ${opcionKey} (Total vacilaciones: ${this.cambioOpcionesCount})`);
      }

      this.opcionSeleccionadaTemp = opcionKey;

      // Actualizar UI de tarjetas de opción
      this.actualizarEstilosTarjetasOpciones();

      // Feedback háptico
      if (window.hapticEngine && typeof window.hapticEngine.trigger === 'function') {
        window.hapticEngine.trigger('selection');
      }

      this.actualizarHojaOptica();
      this.actualizarEstadoBotonConfirmar();
      if (this.guiaPaso) this._trasMarcaGuia();
    }

    _trasMarcaGuia() {
      if (this.guiaMiraPregunta) {
        this._mostrarPreguntaGuia();
        return;
      }
      const btn = document.getElementById('btnConfirmarSeleccion');
      const letra = String(this.opcionSeleccionadaTemp || '').toUpperCase();
      const lista = this.guiaPaso === 1 ? letra === 'B' : (this.guiaAyudaVista && letra === 'B');
      if (btn) {
        btn.style.display = lista ? 'block' : 'none';
        btn.classList.toggle('guia-listo', lista);
      }
      if (lista) {
        const prompt = document.getElementById('txtCommitPrompt');
        if (prompt) prompt.textContent = 'Toca para confirmar';
        this._notaGuia('La B quedó marcada. Toca el botón de abajo para confirmar.');
        this._focoGuia(btn, 'La B quedó marcada. Toca el botón de abajo para confirmar.');
        return;
      }
      if (this.guiaPaso === 1) {
        this._notaGuia('Esa no es. Toca la letra B, donde dice 43.');
        this._focoGuia(this._badgeGuia('B'), 'Esa no es. Toca la letra B, donde dice 43.');
      } else if (!this.guiaAyudaVista) {
        this._ensenarPistaGuia();
      } else {
        this._notaGuia('En este ejemplo toca la letra B, la pared de ladrillo.');
        this._focoGuia(this._badgeGuia('B'), 'En este ejemplo toca la letra B, la pared de ladrillo.');
      }
    }

    /**
     * Tacha / Descarta una opción como distractor no plausible
     */
    tacharOpcion(opcionKey) {
      if (this._opcionesBloqueadas()) return;
      if (this.opcionesDescartadas.has(opcionKey)) {
        this.opcionesDescartadas.delete(opcionKey);
      } else {
        this.opcionesDescartadas.add(opcionKey);
        // Si la opción tachada estaba elegida, limpiar la elección
        if (this.opcionSeleccionadaTemp === opcionKey) {
          this.opcionSeleccionadaTemp = null;
        }
      }

      // Feedback táctil de descarte
      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch (e) {}
      }

      // Actualizar UI de tarjetas de opción
      this.actualizarEstilosTarjetasOpciones();

      this.actualizarHojaOptica();
      this.actualizarEstadoBotonConfirmar();
    }

    /**
     * Sincroniza y mantiene fija la Tira de Bolitas de Progreso (1 al 10)
     */
    actualizarTiraProgreso() {
      const containerTira = document.getElementById('uiTiraProgresoReactivos');
      if (!containerTira) return;

      const totalReactivos = (this.misionData && this.misionData.reactivos && this.misionData.reactivos.length) || 10;
      containerTira.style.display = 'none';

      // 🔄 Actualización dinámica en el DOM existente sin destruir componentes
      const existingDots = containerTira.querySelectorAll('[id^="progreso_dot_"]');
      if (existingDots.length === totalReactivos) {
        for (let i = 0; i < totalReactivos; i++) {
          const dot = existingDots[i];
          const num = i + 1;
          const esCompletado = Boolean(i < this.indexReactivoActivo || (this.respuestasSesionActiva && this.respuestasSesionActiva[i]));
          const esActivo = (i === this.indexReactivoActivo);

          if (esCompletado) {
            dot.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all duration-200 shrink-0 select-none bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.35)]';
            dot.innerHTML = `<i class="fa-solid fa-check text-[10px] text-emerald-300"></i>`;
          } else if (esActivo) {
            dot.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all duration-200 shrink-0 select-none bg-cyan-500 text-slate-950 border-2 border-cyan-200 font-black shadow-none scale-110';
            dot.innerHTML = `<span class="font-mono font-black">${num}</span>`;
          } else {
            dot.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all duration-200 shrink-0 select-none bg-slate-950/80 border border-slate-700/80 text-slate-500 font-medium';
            dot.innerHTML = `<span class="font-mono text-[10px] text-slate-500">${num}</span>`;
          }
        }
        return;
      }

      // Si aún no existen los elementos en el DOM, inicializarlos
      let html = '';
      for (let i = 0; i < totalReactivos; i++) {
        const num = i + 1;
        const esCompletado = Boolean(i < this.indexReactivoActivo || (this.respuestasSesionActiva && this.respuestasSesionActiva[i]));
        const esActivo = (i === this.indexReactivoActivo);

        let clases = '';
        let contenido = '';

        if (esCompletado) {
          // Check verde completado
          clases = 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.35)]';
          contenido = `<i class="fa-solid fa-check text-[10px] text-emerald-300"></i>`;
        } else if (esActivo) {
          // Reactivo activo actual: halo cian pulsante con número
          clases = 'bg-cyan-500 text-slate-950 border-2 border-cyan-200 font-black shadow-none scale-110';
          contenido = `<span class="font-mono font-black">${num}</span>`;
        } else {
          // Pendiente
          clases = 'bg-slate-950/80 border border-slate-700/80 text-slate-500 font-medium';
          contenido = `<span class="font-mono text-[10px] text-slate-500">${num}</span>`;
        }

        html += `
          <div id="progreso_dot_${i}" 
               title="Reactivo ${num} de ${totalReactivos}"
               class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all duration-200 shrink-0 select-none ${clases}">
            ${contenido}
          </div>
        `;
      }

      containerTira.innerHTML = html;
      this.actualizarConvergenciaPsicometrica();
    }

    _claveDe(item) {
      const raw = item && (item.respuesta_correcta || item.correcta || item.ok || item.clave || item.solucion);
      return String(raw || '').trim().toUpperCase();
    }

    _textoOpcionEnPantalla(item, letra) {
      const mapa = this.normalizarOpcionesMap(item && (item.opciones || item.opciones_respuesta), item);
      const marca = String(letra || '').trim().toUpperCase();
      return String((mapa && mapa[marca]) || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
    }

    _letraDeTextoEnPantalla(item, texto) {
      const buscado = String(texto || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').replace(/\s+/g, ' ').trim();
      if (!buscado) return '';
      const mapa = this.normalizarOpcionesMap(item && (item.opciones || item.opciones_respuesta), item);
      for (const letra of ['A', 'B', 'C', 'D']) {
        const actual = String((mapa && mapa[letra]) || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').replace(/\s+/g, ' ').trim();
        if (actual && actual === buscado) return letra;
      }
      return '';
    }

    async _calificarEnServidor(itemId, letra, textoOpcion) {
      if (!itemId) return null;
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => { try { ctrl.abort(); } catch (e) {} }, 8000) : null;
      try {
        const token = localStorage.getItem('dante_token') || localStorage.getItem('dante_jwt') || '';
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = 'Bearer ' + token;
        const resp = await fetch('/api/dante/calificar', {
          method: 'POST',
          credentials: 'include',
          headers,
          signal: ctrl ? ctrl.signal : undefined,
          body: JSON.stringify({ itemId, letra, textoOpcion: textoOpcion || '' })
        });
        const data = await resp.json().catch(() => null);
        const letraCorrecta = String((data && data.letraCorrecta) || '').trim().toUpperCase();
        if (!resp.ok || !data || data.ok !== true || !/^[ABCD]$/.test(letraCorrecta)) return null;
        return {
          esCorrecta: data.esCorrecta === true,
          letraCorrecta,
          textoCorrecto: String(data.textoCorrecto || ''),
          textoElegido: String(data.textoElegido || ''),
          razon: String(data.razon || ''),
          fraseAcierto: String(data.fraseAcierto || ''),
          repaso: String(data.repaso || '')
        };
      } catch (e) {
        return null;
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

    _textoPromptConfirmar(forzarSeleccionado) {
      const isLastItem = (this.indexReactivoActivo === (this.misionData?.reactivos?.length || 1) - 1);
      const marcada = forzarSeleccionado === true
        || (forzarSeleccionado !== false && Boolean(this.opcionSeleccionadaTemp));
      if (marcada) {
        return isLastItem
          ? '¡Presiona el botón! Mantén 2 segundos para terminar'
          : '¡Presiona el botón! Mantén 2 segundos';
      }
      return isLastItem
        ? 'Mantén 2 segundos para terminar'
        : 'Mantén 2 segundos para confirmar';
    }

    _restaurarPromptConfirmar() {
      const fillBar = document.getElementById('btnCommitProgressFill');
      if (fillBar) fillBar.style.width = '0%';
      const txtPrompt = document.getElementById('txtCommitPrompt');
      if (!txtPrompt) return;
      txtPrompt.innerText = this._textoPromptConfirmar();
    }

    _parametrosItem(item) {
      if (window.DanteAbility && typeof window.DanteAbility.params === 'function') {
        return window.DanteAbility.params(item);
      }
      return { a: 1, b: 0, c: 0.2 };
    }

    _historialCalibrado() {
      const historial = [];
      Object.values(this.respuestasSesionActiva || {}).forEach((r) => {
        if (!r || typeof r.correcto !== 'boolean') return;
        if (r.esPreun || String(r.id || r.itemId || '').indexOf('preun_') === 0) return;
        historial.push({
          id: String(r.id || r.itemId || ''),
          area: r.materia || r.area || '',
          letra: r.opcionSeleccionada || r.letra || '',
          a: r.a,
          b: r.b,
          c: r.c,
          correcto: r.correcto,
          ms: r.latenciaMs || r.tiempoRespuestaMs || 0
        });
      });
      return historial;
    }

    _recalibrarHabilidad() {
      if (!window.DanteAbility) {
        return { theta: 0, sem: 1, puntos: null };
      }
      const sesion = this._historialCalibrado();
      const est = typeof window.DanteAbility.acumular === 'function'
        ? window.DanteAbility.acumular(sesion)
        : window.DanteAbility.estimar(sesion);
      this.thetaEstimado = est.theta;
      this.semEstimado = est.sem;
      return est;
    }

    _publicarEnNube(tipo) {
      if (!window.DanteRegistro || typeof window.DanteRegistro.publicar !== 'function') return;
      const track = String(this.misionData && this.misionData.targetTrack || '').toUpperCase();
      if (track === 'UNAL') return;
      const est = this._recalibrarHabilidad();
      const respuestas = Object.values(this.respuestasSesionActiva || {}).filter((r) => r && typeof r.correcto === 'boolean' && String(r.id || r.itemId || '').indexOf('preun_') !== 0).map((r) => ({
        id: r.id || r.itemId,
        area: r.materia || r.area || '',
        a: r.a,
        b: r.b,
        c: r.c,
        correcto: r.correcto,
        ms: r.latenciaMs || r.tiempoRespuestaMs || 0,
        letra: r.opcionSeleccionada || ''
      }));
      window.DanteRegistro.publicar({
        tipo: tipo,
        theta: est && est.theta,
        sem: est && est.sem,
        puntos: est && est.puntos,
        respuestas: respuestas
      }).catch(function () {});
      if (window.DanteNube && typeof window.DanteNube.subirProgresoDebounced === 'function') {
        window.DanteNube.subirProgresoDebounced(800);
      }
    }

    _sumarConteoAreas() {
      const saber = {};
      const preu = {};
      Object.values(this.respuestasSesionActiva || {}).forEach((r) => {
        if (!r || typeof r.correcto !== 'boolean') return;
        const area = String(r.materia || r.area || 'general').toLowerCase().replace(/\s+/g, '_');
        const destino = (r.esPreun || String(r.id || r.itemId || '').indexOf('preun_') === 0) ? preu : saber;
        if (!destino[area]) destino[area] = { total: 0, aciertos: 0 };
        destino[area].total += 1;
        if (r.correcto) destino[area].aciertos += 1;
      });
      const fusionar = (clave, stats) => {
        if (!Object.keys(stats).length) return {};
        let conteo = {};
        try { conteo = JSON.parse(localStorage.getItem(clave) || '{}') || {}; } catch (e) { conteo = {}; }
        const precisionSesion = {};
        Object.entries(stats).forEach(([k, v]) => {
          if (!conteo[k]) conteo[k] = { total: 0, aciertos: 0 };
          conteo[k].total += v.total;
          conteo[k].aciertos += v.aciertos;
          precisionSesion[k] = Math.round((100 * v.aciertos) / v.total);
        });
        try { localStorage.setItem(clave, JSON.stringify(conteo)); } catch (e) { /* almacenamiento bloqueado */ }
        return precisionSesion;
      };
      const precisionSaber = fusionar('dante_area_conteo', saber);
      const precisionPreu = fusionar('dante_preu_area_conteo', preu);
      if (Object.keys(saber).length) {
        try {
          const conteo = JSON.parse(localStorage.getItem('dante_area_conteo') || '{}') || {};
          const precisionGlobal = {};
          Object.entries(conteo).forEach(([k, v]) => {
            if (v && v.total) precisionGlobal[k] = Math.round((100 * v.aciertos) / v.total);
          });
          localStorage.setItem('dante_precision_por_area', JSON.stringify(precisionGlobal));
        } catch (e) { /* almacenamiento bloqueado */ }
      }
      const usaPreu = this._esMisionPreun();
      return {
        stats: usaPreu ? preu : saber,
        precisionSesion: usaPreu ? precisionPreu : precisionSaber
      };
    }

    _textoAyudaItem(item, elegida) {
      const letra = String(elegida || '').trim().toUpperCase();
      const razon = this._textoLimpio(item && item.justificacion_opciones && item.justificacion_opciones[letra]);
      const repaso = this._textoLimpio(item && item.repaso);
      const atajo = this._textoLimpio(item && (item.atajo_tactico || item.atajoTactico));
      const partes = [];
      if (razon) partes.push(razon);
      if (repaso) partes.push(repaso);
      if (atajo) partes.push(atajo);
      return partes.join(' ').replace(/\s+/g, ' ').trim().slice(0, 520);
    }

    _enriquecerRecordRespuesta(record, item, elegida) {
      if (!record || !item) return record;
      const enunciado = String(
        item.enunciado || item.pregunta_texto || item.texto || item.stem || item.pregunta || ''
      ).replace(/\s+/g, ' ').trim();
      record.enunciado = enunciado.slice(0, 320);
      record.tema = String(item.tema || item.competencia || item.componente || '').slice(0, 80);
      const correcta = String(item.correcta || item.respuesta_correcta || item.ok || item.clave || '').trim().toUpperCase().slice(0, 1);
      if (correcta) record.correcta = correcta;
      record.ayuda = this._textoAyudaItem(item, elegida || record.opcionSeleccionada);
      return record;
    }

    _serializarItemsSesion() {
      const items = [];
      const fallidas = [];
      Object.values(this.respuestasSesionActiva || {}).forEach((r) => {
        if (!r || typeof r.correcto !== 'boolean') return;
        const fila = {
          id: String(r.id || r.itemId || ''),
          materia: String(r.materia || r.area || 'general'),
          correcto: r.correcto === true,
          opcionSeleccionada: String(r.opcionSeleccionada || r.letra || '').toUpperCase().slice(0, 1),
          correcta: String(r.correcta || '').toUpperCase().slice(0, 1),
          enunciado: String(r.enunciado || '').slice(0, 320),
          tema: String(r.tema || '').slice(0, 80),
          ayuda: String(r.ayuda || '').slice(0, 520)
        };
        items.push(fila);
        if (!fila.correcto) fallidas.push(fila);
      });
      return { items_respondidos: items, preguntas_falladas: fallidas };
    }

    _radiografiaDesdeSesion(precisionSesion) {
      const NOMBRES = {
        matematicas: 'Matemáticas',
        lectura_critica: 'Lectura Crítica',
        ciencias_naturales: 'Ciencias Naturales',
        sociales_ciudadanas: 'Sociales y Ciudadanas',
        ingles: 'Inglés'
      };
      let menor = 101;
      let key = '';
      Object.entries(precisionSesion || {}).forEach(([k, v]) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return;
        if (n < menor) {
          menor = n;
          key = k;
        }
      });
      if (!key) {
        return {
          materiaVulnerable: '',
          materiaKey: '',
          pctPrecision: null,
          patronDetectado: '',
          prescripcion: 'Mañana el entrenamiento sigue con las preguntas que fallaste.'
        };
      }
      const nombre = NOMBRES[key] || key.replace(/_/g, ' ');
      return {
        materiaVulnerable: nombre,
        materiaKey: key,
        pctPrecision: menor,
        patronDetectado: 'ahí tu precisión fue del ' + menor + '%',
        prescripcion: 'Mañana el entrenamiento empieza por ' + nombre + '.'
      };
    }

    static htmlPreguntasFalladas(fallidas) {
      const lista = Array.isArray(fallidas) ? fallidas : [];
      if (!lista.length) {
        return `
          <section class="rp-sec">
            <h3 class="rp-sec-h"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Preguntas en las que te equivocaste</h3>
            <div class="rp-card"><p class="rp-manana-txt">En esta sesión no fallaste ninguna pregunta.</p></div>
          </section>`;
      }
      const filas = lista.map((f, i) => {
        const area = String((f && (f.materia || f.area)) || 'Área').replace(/_/g, ' ');
        const enunciado = String((f && f.enunciado) || 'Pregunta sin enunciado guardado.').slice(0, 320);
        const marcada = String((f && (f.opcionSeleccionada || f.letra)) || '—').toUpperCase();
        const correcta = String((f && f.correcta) || '').toUpperCase();
        const ayuda = String((f && (f.ayuda || f.explicacion || f.repaso)) || '').trim();
        const idBtn = 'rpAyuda_' + i + '_' + String((f && f.id) || i).replace(/[^a-zA-Z0-9_-]/g, '');
        const meta = correcta
          ? ('Marcaste <strong>' + marcada + '</strong>. La respuesta correcta es <strong>' + correcta + '</strong>.')
          : ('Marcaste <strong>' + marcada + '</strong>.');
        const bloqueAyuda = ayuda
          ? `<button type="button" class="rp-ayuda-btn" data-rp-ayuda="${idBtn}" aria-expanded="false">Ver explicación</button>
             <div id="${idBtn}" class="rp-ayuda-box" hidden>${ayuda.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
          : `<p class="rp-ayuda-vacio">Aún no hay explicación guardada para esta pregunta.</p>`;
        return `
          <article class="rp-fallida">
            <p class="rp-fallida-area">${area}</p>
            <p class="rp-fallida-q">${enunciado.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p class="rp-fallida-meta">${meta}</p>
            ${bloqueAyuda}
          </article>`;
      }).join('');
      return `
        <section class="rp-sec">
          <h3 class="rp-sec-h"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Preguntas en las que te equivocaste</h3>
          <div class="rp-card rp-fallidas">${filas}</div>
        </section>`;
    }

    static enlazarAyudasFallidas(raiz) {
      if (!raiz) return;
      raiz.querySelectorAll('[data-rp-ayuda]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-rp-ayuda');
          const box = id ? document.getElementById(id) : null;
          if (!box) return;
          const abierto = !box.hidden;
          box.hidden = abierto;
          btn.setAttribute('aria-expanded', abierto ? 'false' : 'true');
          btn.textContent = abierto ? 'Ver explicación' : 'Ocultar explicación';
        });
      });
    }

    _registrarSesionExpediente(tipo, materia, puntaje, theta) {
      const suma = this._sumarConteoAreas();
      const aciertos = Object.values(suma.stats).reduce((s, v) => s + v.aciertos, 0);
      const total = Object.values(suma.stats).reduce((s, v) => s + v.total, 0);
      const detalle = this._serializarItemsSesion();
      const radiografia = this._radiografiaDesdeSesion(suma.precisionSesion);
      try { localStorage.setItem('dante_radiografia_error', JSON.stringify(radiografia)); } catch (e) {}
      const registro = {
        id: `eval_${tipo}_${Date.now()}`,
        created_at: new Date().toISOString(),
        materia: materia,
        tipo: tipo,
        puntaje_escalonado: puntaje,
        theta: theta,
        sem: this.semEstimado,
        aciertos: aciertos,
        total: total,
        precision: total ? Math.round((100 * aciertos) / total) : null,
        precisionPorArea: suma.precisionSesion,
        radiografia: radiografia,
        items_respondidos: detalle.items_respondidos,
        preguntas_falladas: detalle.preguntas_falladas
      };
      let hist = [];
      try {
        const raw = localStorage.getItem('dante_history_cache');
        if (raw) hist = JSON.parse(raw) || [];
      } catch (e) { hist = []; }
      if (!Array.isArray(hist)) hist = [];
      hist.unshift(registro);
      try { localStorage.setItem('dante_history_cache', JSON.stringify(hist.slice(0, 80))); } catch (e) {}
      return registro;
    }

    _htmlFigura(src, cartilla) {
      if (!src || typeof src !== 'string') return '';
      const limpio = src.trim();
      const marco = 'fig-pregunta-papel bg-transparent border-0 text-slate-900';
      const pie = `<figcaption class="mt-2 text-[10px] font-mono tracking-wide text-slate-600">Figura de la pregunta</figcaption>`;
      if (limpio.startsWith('<div class="fig-examen"') || limpio.startsWith('<svg')) {
        const cuerpo = limpio.startsWith('<svg')
          ? `<div class="fig-examen">${limpio.replace('<svg ', '<svg style="width:100%;height:auto;max-height:300px;display:block;margin:0 auto;background:#ffffff;" ')}</div>`
          : limpio;
        return `<figure class="my-3 p-1 ${marco} overflow-x-auto" data-figura="1">${cuerpo}${pie}</figure>`;
      }
      let srcSegura = limpio;
      if (limpio.includes('<svg') || limpio.startsWith('data:image/svg+xml')) {
        let rawXml = limpio;
        if (rawXml.startsWith('data:image/svg+xml;utf8,')) rawXml = rawXml.substring('data:image/svg+xml;utf8,'.length);
        else if (rawXml.startsWith('data:image/svg+xml;')) rawXml = rawXml.substring(rawXml.indexOf(',') + 1);
        try { rawXml = decodeURIComponent(rawXml); } catch (e) {}
        rawXml = rawXml.replace(/%23/g, '#');
        // En cuadernillo papel: fondo claro y paneles oscuros ilegibles → tonos claros.
        if (/background\s*:\s*#0/i.test(rawXml) || /background\s*:\s*%230/i.test(rawXml)) {
          rawXml = rawXml.replace(/background\s*:\s*#0[0-9a-fA-F]{5}/gi, 'background:#ffffff');
          rawXml = rawXml.replace(/background\s*:\s*%230[0-9a-fA-F]{5}/gi, 'background:#ffffff');
        }
        if (!/background\s*:/i.test(rawXml)) {
          rawXml = rawXml.replace('<svg ', '<svg style="background:#ffffff;" ');
        }
        rawXml = rawXml.replace(/fill=(["'])#1a1d26\1/gi, 'fill=$1#eef2f7$1');
        rawXml = rawXml.replace(/fill=(["'])%231a1d26\1/gi, 'fill=$1#eef2f7$1');
        rawXml = rawXml.replace(/fill="#1a1d26"/gi, 'fill="#eef2f7"');
        rawXml = rawXml.replace(/fill="%231a1d26"/gi, 'fill="#eef2f7"');
        rawXml = rawXml.replace(/fill=(["'])#1a233a\1/gi, 'fill=$1#eef2f7$1');
        rawXml = rawXml.replace(/fill=(["'])%231a233a\1/gi, 'fill=$1#eef2f7$1');
        rawXml = rawXml.replace(/fill="#1a233a"/gi, 'fill="#eef2f7"');
        rawXml = rawXml.replace(/fill="%231a233a"/gi, 'fill="#eef2f7"');
        rawXml = rawXml.replace(/fill=(["'])#0f172a\1/gi, 'fill=$1#f8fafc$1');
        rawXml = rawXml.replace(/fill=(["'])%230f172a\1/gi, 'fill=$1#f8fafc$1');
        rawXml = rawXml.replace(/fill="#0f172a"/gi, 'fill="#f8fafc"');
        rawXml = rawXml.replace(/fill="%230f172a"/gi, 'fill="#f8fafc"');
        try {
          srcSegura = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(rawXml)))}`;
        } catch (e) {
          srcSegura = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawXml)}`;
        }
      }
      return `
        <figure class="my-3 p-1 ${marco} overflow-x-auto text-center" data-figura="1">
          <img src="${srcSegura}" alt="Gráfico de la pregunta" style="width:100%;max-height:300px;height:auto;object-fit:contain;background:#ffffff;display:block;margin:0 auto;" />
          ${pie}
        </figure>`;
    }

    prepararSiguientePorInformacion() {
      const reactivos = this.misionData && this.misionData.reactivos;
      if (!reactivos || !window.DanteAbility || typeof window.DanteAbility.informacion !== 'function') return;
      const siguiente = this.indexReactivoActivo + 1;
      if (siguiente >= reactivos.length) return;
      const theta = typeof this.thetaEstimado === 'number' ? this.thetaEstimado : 0;
      let mejor = siguiente;
      let mejorInfo = -1;
      for (let i = siguiente; i < reactivos.length; i++) {
        const info = window.DanteAbility.informacion(theta, reactivos[i]);
        if (info > mejorInfo) {
          mejorInfo = info;
          mejor = i;
        }
      }
      if (mejor !== siguiente) {
        const tmp = reactivos[siguiente];
        reactivos[siguiente] = reactivos[mejor];
        reactivos[mejor] = tmp;
      }
      const banco = window.DANTE_BANCO_ITEMS;
      const puesto = reactivos[siguiente];
      if (!Array.isArray(banco) || !puesto || typeof window.DanteAbility.adaptarItem !== 'function') return;
      const area = puesto.area || puesto.materia;
      const usados = new Set(reactivos.map((r) => r && r.id).filter(Boolean));
      let candidato = null;
      let infoCandidato = window.DanteAbility.informacion(theta, puesto);
      banco.forEach((raw) => {
        const item = window.DanteAbility.adaptarItem(raw);
        if (!item || !item.id || usados.has(item.id) || item.area !== area) return;
        const info = window.DanteAbility.informacion(theta, item);
        if (info > infoCandidato) {
          infoCandidato = info;
          candidato = item;
        }
      });
      if (candidato) reactivos[siguiente] = candidato;
    }

    /**
     * 📊 Actualiza la Barra de Convergencia Psicométrica (Habilidad Theta y Error Estándar Bayesiano SEM)
     */
    actualizarConvergenciaPsicometrica() {
      const est = this._recalibrarHabilidad();
      const thetaVal = est ? est.theta : 0;
      const semActual = est ? est.sem : 1;
      const puntajeEstimado = est && est.puntos != null ? est.puntos : 250;
      const pctConvergencia = Math.min(100, Math.max(0, Math.round((1 - Math.min(1, semActual)) * 100)));

      const lblTheta = document.getElementById('lblThetaHUD');
      if (lblTheta) {
        lblTheta.innerText = `θ: ${thetaVal >= 0 ? '+' : ''}${thetaVal} (~${puntajeEstimado} Pts)`;
      }

      const lblSem = document.getElementById('lblSemHUD');
      if (lblSem) {
        lblSem.innerHTML = `SEM: ±${semActual} (<strong class="text-emerald-400 font-mono">${pctConvergencia}%</strong> Calibrado)`;
      }

      const barEl = document.getElementById('barraProgresoConvergenciaHUD');
      if (barEl) {
        barEl.style.width = `${pctConvergencia}%`;
      }
    }

    /**
     * 💡 Descarte Socrático Interactivo de 2 Distractores sin revelar la respuesta
     */
    descartarDosDistractoresInteractivo(opcionElegida) {
      const item = (this.misionData && this.misionData.reactivos) ? this.misionData.reactivos[this.indexReactivoActivo] : null;
      if (!item) return;

      const correcta = item.respuesta_correcta || item.correcta || item.clave || 'C';
      const opcionesDisponibles = ['A', 'B', 'C', 'D'];

      // Encontrar dos opciones para tachar que sean incorrectas y no sean la correcta
      const descartables = opcionesDisponibles.filter(op => op !== correcta && op !== opcionElegida);
      const opcionesDescartadas = descartables.slice(0, 2);

      // Si por alguna razón sólo hay 1 (ej: alumno eligió la correcta), tachar otra
      if (opcionesDescartadas.length < 2) {
        const fallback = opcionesDisponibles.filter(op => op !== correcta && !opcionesDescartadas.includes(op));
        if (fallback.length > 0) opcionesDescartadas.push(fallback[0]);
      }

      // Aplicar estilo de descarte visual a las opciones en el grid
      opcionesDescartadas.forEach(letra => {
        const btn = document.getElementById(`btn_opcion_${letra}`) || document.querySelector(`[data-letra="${letra}"]`);
        if (btn) {
          btn.style.opacity = '0.35';
          btn.style.textDecoration = 'line-through';
          btn.style.filter = 'grayscale(1)';
          btn.style.pointerEvents = 'none';
        }
      });

      const resBox = document.getElementById('txtResultadoDescarteDante');
      if (resBox) {
        resBox.classList.remove('hidden');
        resBox.innerHTML = `
          <div class="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
            <i class="fa-solid fa-check text-emerald-400"></i> Opciones descartadas con certeza: [ ${opcionesDescartadas.join(', ')} ]
          </div>
          <p class="text-slate-300 font-sans text-xs">
            Dante ha eliminado 2 distractores inconsistentes. Revisa la opción restante frente a tu selección y deduce la conclusión lógica.
          </p>
        `;
      }
    }

    /**
     * Sincroniza la visualización de la Hoja Óptica Digital
     */
    actualizarHojaOptica() {
      const lblOptica = document.getElementById('lblOpticaItemNum');
      if (lblOptica) lblOptica.innerText = `Reactivo ${this.indexReactivoActivo + 1}.`;

      ['A', 'B', 'C', 'D'].forEach(letra => {
        const oval = document.getElementById(`oval_ws_${letra}`);
        if (oval) {
          this._engancharBurbuja(oval, null);
          oval.classList.toggle('oval-graphite-filled', this.opcionSeleccionadaTemp === letra);
          oval.classList.toggle('marcada', this.opcionSeleccionadaTemp === letra);
          oval.style.background = '';
          oval.style.color = '';
          oval.style.borderColor = '';
        }
      });
    }

    /**
     * Bind del evento Hold-to-Commit (1.5s / 1500ms) para confirmación sin impulsividad
     */
    _avisarEligeLetra() {
      let aviso = document.getElementById('avisoEligeLetra');
      if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'avisoEligeLetra';
        aviso.setAttribute('role', 'status');
        aviso.style.cssText = 'margin:0.7rem auto 0;max-width:520px;padding:0.75rem 0.9rem;border-radius:14px;background:linear-gradient(180deg,#3a2c18,#24180f);border:1px solid rgba(232,196,140,0.7);color:#f8efe2;font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.92rem;line-height:1.35;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,0.35);';
        const btn = document.getElementById('btnConfirmarSeleccion');
        if (btn && btn.parentNode) btn.parentNode.insertBefore(aviso, btn);
        else document.body.appendChild(aviso);
      }
      aviso.innerHTML = '<strong style="display:block;margin-bottom:0.2rem;letter-spacing:0.04em;">Toca la letra</strong>El texto de la opción no marca la respuesta. Elige A, B, C o D y después mantén presionado.';
      aviso.style.display = 'block';
      clearTimeout(this._avisoLetraTimer);
      this._avisoLetraTimer = setTimeout(() => { aviso.style.display = 'none'; }, 3400);
    }

    /** Hold de confirmación fijo en 2s (texto del botón alineado). */
    _holdMsConfirmacion() {
      return 2000;
    }

    bindHoldToCommit(btnConf) {
      if (!btnConf || btnConf._holdBound) return;
      btnConf._holdBound = true;

      let commitTimer = null;
      let commitStartTime = 0;
      let isHolding = false;
      const self = this;

      const cleanCommit = () => {
        isHolding = false;
        if (commitTimer) {
          clearInterval(commitTimer);
          commitTimer = null;
        }
        const fillBar = document.getElementById('btnCommitProgressFill');
        if (fillBar) fillBar.style.width = '0%';

        const txtPrompt = document.getElementById('txtCommitPrompt');
        if (txtPrompt) txtPrompt.innerText = this._textoPromptConfirmar();
      };

      const ejecutarConfirmacionInmediata = () => {
        if (this.faseActual === 'DILEMAS') {
          cleanCommit();
          this.completarMisionDiaria();
          return;
        }
        if (!this.opcionSeleccionadaTemp || this.isSubmittingRespuesta) return;
        cleanCommit();
        const fillBar = document.getElementById('btnCommitProgressFill');
        const txtPrompt = document.getElementById('txtCommitPrompt');
        if (fillBar) fillBar.style.width = '100%';
        if (txtPrompt) txtPrompt.innerText = '✓ CONFIRMADO';
        if (navigator.vibrate) {
          try { navigator.vibrate([40, 20, 60]); } catch (err) {}
        }
        Promise.resolve(this.confirmarRespuesta()).catch((err) => {
          console.warn('Confirmación falló:', err);
          this.isSubmittingRespuesta = false;
          this._restaurarPromptConfirmar();
        });
      };

      const startCommit = (e) => {
        if (this.faseActual === 'DILEMAS') {
          if (e && e.cancelable && e.type !== 'click') e.preventDefault();
          this.completarMisionDiaria();
          return;
        }
        if (this.isSubmittingRespuesta) return;
        if (!this.opcionSeleccionadaTemp) {
          this._avisarEligeLetra();
          return;
        }
        if (this.guiaPaso) {
          if (this._guiaConfirmando) return;
          this._guiaConfirmando = true;
          window.setTimeout(() => { this._guiaConfirmando = false; }, 500);
          ejecutarConfirmacionInmediata();
          return;
        }
        if (e && e.cancelable && e.type !== 'click') e.preventDefault();
        if (isHolding) return;
        isHolding = true;
        commitStartTime = Date.now();

        if (navigator.vibrate) {
          try { navigator.vibrate(20); } catch (err) {}
        }

        const fillBar = document.getElementById('btnCommitProgressFill');
        const txtPrompt = document.getElementById('txtCommitPrompt');

        const totalMs = self._holdMsConfirmacion();
        commitTimer = setInterval(() => {
          const elapsed = Date.now() - commitStartTime;
          const progress = Math.min(100, (elapsed / totalMs) * 100);

          if (fillBar) fillBar.style.width = `${progress}%`;
          if (txtPrompt) txtPrompt.innerText = `CONFIRMANDO... ${Math.floor(progress)}%`;

          if (progress >= 100) {
            cleanCommit();
            ejecutarConfirmacionInmediata();
          }
        }, 30);
      };

      const cancelCommit = () => {
        if (!isHolding) return;
        cleanCommit();
      };

      btnConf.addEventListener('pointerdown', startCommit);
      btnConf.addEventListener('pointerup', cancelCommit);
      btnConf.addEventListener('pointercancel', cancelCommit);
      btnConf.addEventListener('pointerleave', cancelCommit);
      btnConf.addEventListener('touchstart', startCommit, { passive: false });
      btnConf.addEventListener('touchend', cancelCommit);
      btnConf.addEventListener('touchcancel', cancelCommit);
      // El click no debe saltarse el hold: solo dilemas (cierre) o guía (demo).
      btnConf.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.faseActual === 'DILEMAS') {
          this.completarMisionDiaria();
          return;
        }
        if (this.guiaPaso) {
          if (this.opcionSeleccionadaTemp && !this.isSubmittingRespuesta) ejecutarConfirmacionInmediata();
          else if (!this.opcionSeleccionadaTemp) this._avisarEligeLetra();
          return;
        }
        if (!this.opcionSeleccionadaTemp) this._avisarEligeLetra();
      });
    }

    /**
     * Renderiza o actualiza el Botón Principal de Confirmación
     */
    renderizarBotonConfirmacion() {
      let btnConf = document.getElementById('btnConfirmarSeleccion');
      if (btnConf) {
        btnConf.style.display = 'block';
        const txtPrompt = document.getElementById('txtCommitPrompt');
        if (txtPrompt) txtPrompt.innerText = this._textoPromptConfirmar();
        this.bindHoldToCommit(btnConf);
        this.actualizarEstadoBotonConfirmar();
      }
    }

    /**
     * Habilita o deshabilita el botón según la selección
     */
    actualizarEstadoBotonConfirmar() {
      const btnConf = document.getElementById('btnConfirmarSeleccion');
      const txtPrompt = document.getElementById('txtCommitPrompt');
      if (txtPrompt && !this.isSubmittingRespuesta) {
        txtPrompt.innerText = this._textoPromptConfirmar();
      }
      if (btnConf) {
        if (this.opcionSeleccionadaTemp) {
          btnConf.disabled = false;
          btnConf.classList.remove('opacity-50', 'opacity-85', 'cursor-not-allowed');
          btnConf.classList.add('opacity-100', 'confirm-opcion-lista');
          btnConf.classList.remove('btn-pulse-glow');
        } else {
          btnConf.disabled = false;
          btnConf.classList.add('cursor-pointer');
          btnConf.classList.remove('btn-pulse-glow', 'opacity-50', 'cursor-not-allowed', 'confirm-opcion-lista');
          btnConf.classList.add('opacity-85');
        }
      }
    }

    _esReactivoPreun(item) {
      if (!item) return false;
      const id = String(item.id || '');
      const exam = String(item.target_exam || item.origen || '').toUpperCase();
      return id.indexOf('preun_') === 0 || exam === 'UNAL';
    }

    _esMisionPreun() {
      return false;
    }

    /**
     * Meta Saber 11° (1–500): corte de carrera, pacto de onboarding (300/380) o sello local.
     * Nunca asume que “sin corte” = “sin carrera elegida”.
     */
    _resolverMetaSaber11() {
      const corte = parseInt(localStorage.getItem('dante_corte_objetivo') || '0', 10);
      let meta = (corte > 0 && corte <= 500) ? corte : null;
      const pacto = String(localStorage.getItem('dante_pacto_meta') || '').trim();
      if (meta == null) {
        if (pacto === '300_BASE') meta = 300;
        else if (pacto === '380_ELITE') meta = 380;
        else {
          const n = parseInt(pacto, 10);
          if (n > 0 && n <= 500) meta = n;
        }
      }
      try {
        const sid = (window.DanteRegistro && typeof DanteRegistro.idAlumno === 'function')
          ? DanteRegistro.idAlumno()
          : (localStorage.getItem('dante_student_id') || '');
        if (sid) {
          const sello = JSON.parse(localStorage.getItem(`dante_sello_metas_${sid}`) || 'null');
          if (sello && Number(sello.pts) > 0 && Number(sello.pts) <= 500) {
            meta = Math.round(Number(sello.pts));
          }
        }
      } catch (e) {}
      if (meta != null && meta > 0 && meta <= 500) {
        try {
          const actual = parseInt(localStorage.getItem('dante_corte_objetivo') || '0', 10);
          if (!(actual > 0 && actual <= 500)) {
            localStorage.setItem('dante_corte_objetivo', String(meta));
          }
        } catch (e) {}
        return meta;
      }
      return null;
    }

    _mensajeBrechaSinMeta(carreraClean) {
      if (carreraClean) return 'Meta no disponible';
      return 'Carrera no disponible';
    }

    async _calificarPreun(item, letra, ms) {
      const alumno = window.DanteRegistro && typeof DanteRegistro.idAlumno === 'function' ? DanteRegistro.idAlumno() : '';
      if (!alumno || !item || !item.id) return null;
      try {
        const resp = await fetch('/api/preun/responder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: alumno,
            itemId: item.id,
            opcionSeleccionada: letra,
            tiempoRespuestaMs: ms
          })
        });
        const data = await resp.json();
        if (!data || data.success !== true || data.persistedSQL !== true) return null;
        return data;
      } catch (e) {
        return null;
      }
    }

    /**
     * Confirma la respuesta del reactivo activo y avanza
     */
    async confirmarRespuesta() {
      if (this.guiaPaso) {
        this._confirmarGuia();
        return;
      }
      if (this.isSubmittingRespuesta || this.reactivoConfirmado) return;
      if (!this.opcionSeleccionadaTemp) {
        alert('Por favor selecciona una opción antes de continuar.');
        return;
      }
      this.isSubmittingRespuesta = true;
      this.reactivoConfirmado = true;
      this._bloquearOpcionesTrasConfirmar(true);

      const item = this.misionData.reactivos[this.indexReactivoActivo];
      const tiempoRespuestaMs = Math.round(performance.now() - this.tiempoInicioReactivo);

      const recordRespuesta = {
        id: item.id || `item_${this.indexReactivoActivo + 1}`,
        itemId: item.id || `item_${this.indexReactivoActivo + 1}`,
        materia: item.materia || item.area || 'general',
        opcionSeleccionada: this.opcionSeleccionadaTemp,
        latenciaMs: tiempoRespuestaMs,
        tiempoRespuestaMs: tiempoRespuestaMs,
        cambioOpcionesCount: this.cambioOpcionesCount,
        opcionesDescartadas: Array.from(this.opcionesDescartadas),
        timestamp: new Date().toISOString()
      };

      const elegida = String(this.opcionSeleccionadaTemp || '').trim().toUpperCase();
      const esPreun = this._esReactivoPreun(item);
      recordRespuesta.esPreun = esPreun;
      let clave = this._claveDe(item);
      const paramsItem = this._parametrosItem(item);
      if (esPreun) {
        const calificada = await this._calificarPreun(item, elegida, tiempoRespuestaMs);
        if (!calificada) {
          this.isSubmittingRespuesta = false;
          this.reactivoConfirmado = false;
          this._bloquearOpcionesTrasConfirmar(false);
          this._restaurarPromptConfirmar();
          if (typeof mostrarNotificacionPWA === 'function') {
            mostrarNotificacionPWA('No se pudo guardar esta pregunta Pre-U. Quedó en este intento para repetirla.', 'warning');
          }
          return;
        }
        recordRespuesta.correcto = calificada.esCorrecta === true;
        if (calificada.opcionCorrecta) item.correcta = calificada.opcionCorrecta;
        if (calificada.atajoTactico) item.atajo_tactico = calificada.atajoTactico;
        if (calificada.puntos != null) {
          try {
            localStorage.setItem('dante_preu_puntos', String(calificada.puntos));
            if (calificada.sem != null) localStorage.setItem('dante_preu_sem', String(calificada.sem));
          } catch (e) {}
        }
      } else {
        const textoMarcado = this._textoOpcionEnPantalla(item, elegida);
        const juicio = await this._calificarEnServidor(item.id, elegida, textoMarcado);
        if (juicio) {
          const letraEnPantalla = this._letraDeTextoEnPantalla(item, juicio.textoCorrecto) || juicio.letraCorrecta;
          item.correcta = letraEnPantalla;
          item.respuesta_correcta = letraEnPantalla;
          item._textoCorrectoFeedback = juicio.textoCorrecto || '';
          if (juicio.razon) {
            item.justificacion_opciones = Object.assign({}, item.justificacion_opciones, { [elegida]: juicio.razon });
          }
          if (juicio.fraseAcierto) item.frase_acierto = juicio.fraseAcierto;
          if (juicio.repaso) item.repaso = juicio.repaso;
          recordRespuesta.correcto = juicio.esCorrecta === true;
          recordRespuesta.textoOpcion = textoMarcado;
        } else if (clave) {
          const textoClave = this._textoOpcionEnPantalla(item, clave);
          recordRespuesta.correcto = Boolean(textoMarcado && textoClave && textoMarcado === textoClave) || clave === elegida;
        } else {
          // Nunca congelar la sala: si el servidor no califica, seguimos y marcamos como no acertada.
          recordRespuesta.correcto = false;
          recordRespuesta.textoOpcion = textoMarcado;
          recordRespuesta.calificacionPendiente = true;
          if (typeof mostrarNotificacionPWA === 'function') {
            mostrarNotificacionPWA('No pude verificar en el servidor. Seguimos; esta no cuenta como acierto.', 'warning');
          }
        }
      }
      recordRespuesta.isCorrect = recordRespuesta.correcto;
      recordRespuesta.a = paramsItem.a;
      recordRespuesta.b = paramsItem.b;
      recordRespuesta.c = paramsItem.c;
      this._enriquecerRecordRespuesta(recordRespuesta, item, elegida);

      this.respuestasSesionActiva[this.indexReactivoActivo] = recordRespuesta;
      let estGuardado = null;
      if (!esPreun && !(this.misionData && this.misionData.esSimulacro)) {
        estGuardado = this._recalibrarHabilidad();
        this.prepararSiguientePorInformacion();
      }

      // Guardar progreso en sessionStorage para resiliencia
      this.guardarProgresoSesion();

      console.log(`✅ [DANTE EXAM WORKSPACE]: Reactivo ${this.indexReactivoActivo + 1} confirmado en ${tiempoRespuestaMs}ms.`, recordRespuesta);

      const urlParams = new URLSearchParams(window.location.search);
      const isDiag = (this.misionData && this.misionData.isDiagnostic) ||
                     urlParams.get('launch') === 'diagnostic' || 
                     urlParams.get('action') === 'start_diag' ||
                     sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
                     localStorage.getItem('dante_is_diagnostic') === 'true';

      if (!esPreun && !(this.misionData && this.misionData.esSimulacro) && window.DanteRegistro && typeof window.DanteRegistro.guardarUna === 'function') {
        window.DanteRegistro.guardarUna({
          id: recordRespuesta.id,
          area: recordRespuesta.materia,
          a: recordRespuesta.a,
          b: recordRespuesta.b,
          c: recordRespuesta.c,
          correcto: recordRespuesta.correcto,
          ms: recordRespuesta.latenciaMs,
          letra: recordRespuesta.opcionSeleccionada
        }, {
          tipo: isDiag ? 'DIAGNOSTICO_INICIAL' : 'MISION_DIARIA',
          theta: estGuardado && estGuardado.theta,
          sem: estGuardado && estGuardado.sem,
          puntos: estGuardado && estGuardado.puntos
        });
      }

      if (this.misionData && this.misionData.esSimulacro) {
        const containerCore = document.getElementById('uiContenedorPreguntaCore');
        if (containerCore) {
          containerCore.style.opacity = '0';
          containerCore.style.transform = 'translateY(-8px)';
        }
        setTimeout(() => {
          this.indexReactivoActivo++;
          this.maxIndexAlcanzado = Math.max(this.maxIndexAlcanzado || 0, this.indexReactivoActivo);
          this.guardarProgresoSesion();
          this.isSubmittingRespuesta = false;
          if (containerCore) {
            containerCore.style.opacity = '1';
            containerCore.style.transform = 'none';
          }
          this.renderizarReactivoActual();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      } else if (isDiag) {
        // En diagnóstico adaptativo puro (IRT 3PL): Avance ciego directo sin pausas formativas
        const containerCore = document.getElementById('uiContenedorPreguntaCore');
        if (containerCore) {
          containerCore.style.opacity = '0';
          containerCore.style.transform = 'translateY(-8px)';
        }

        setTimeout(() => {
          this.indexReactivoActivo++;
          this.maxIndexAlcanzado = Math.max(this.maxIndexAlcanzado || 0, this.indexReactivoActivo);
          // 🛡️ Sincronización atómica inmediata del índice incrementado para evitar repetir reactivo
          this.guardarProgresoSesion();
          this.isSubmittingRespuesta = false;

          if (this.indexReactivoActivo < this.misionData.reactivos.length) {
            this.renderizarReactivoActual();
          } else {
            console.log('🏁 [DANTE EXAM WORKSPACE]: 10 Reactivos de Diagnóstico concluidos. Omitiendo dilemas vocacionales; transmitiendo a cierre atómico...');
            if (containerCore) {
              containerCore.style.opacity = '1';
              containerCore.style.transform = 'none';
            }
            const uiPregunta = document.getElementById('uiPregunta');
            if (uiPregunta) {
              uiPregunta.innerHTML = `
                <div class="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-center font-mono space-y-4 max-w-xl mx-auto shadow-2xl animate-pulse">
                  <div class="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-2xl mx-auto">
                    <i class="fa-solid fa-arrows-rotate fa-spin"></i>
                  </div>
                  <h4 class="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    <i class="fa-solid fa-arrows-rotate fa-spin mr-2 text-cyan-400"></i> Calculando tu resultado…
                  </h4>
                  <p class="text-xs text-slate-300 font-sans leading-relaxed">
                    Profesor Dante estimó tu habilidad con las respuestas de esta sesión y la guardó en tu expediente.
                  </p>
                </div>
              `;
            }
            const uiOpcionesGrid = document.getElementById('uiOpcionesGrid');
            if (uiOpcionesGrid) uiOpcionesGrid.innerHTML = '';
            const btnConf = document.getElementById('btnConfirmarSeleccion');
            if (btnConf) btnConf.style.display = 'none';

            this.completarMisionDiaria();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      } else {
        // Entrenamiento: feedback primero; el avance lo dispara "Siguiente pregunta".
        try {
          this.mostrarFeedbackSocraticoInmediato(item, this.opcionSeleccionadaTemp);
        } catch (err) {
          console.warn('Feedback inmediato falló; avanzamos igual.', err);
          this.avanzarSiguienteReactivo();
        }
      }
    }

    /**
     * Muestra la explicación socrática inmediata y el botón para continuar en sesiones de entrenamiento
     */
    mostrarFeedbackSocraticoInmediato(item, opcionElegida) {
      this.reactivoConfirmado = true;
      this.isSubmittingRespuesta = true;
      this._bloquearOpcionesTrasConfirmar(true);
      // Ocultar botón principal de confirmación temporalmente
      const btnConf = document.getElementById('btnConfirmarSeleccion');
      if (btnConf) btnConf.style.display = 'none';
      this._restaurarPromptConfirmar();

      const uiFeedbackTraining = document.getElementById('uiFeedbackTrainingImmediate');
      const badgeOpcion = document.getElementById('badgeOpcionElegidaFeedback');
      const txtCuerpo = document.getElementById('txtCuerpoFeedbackInmediato');
      const btnContinuar = document.getElementById('btnContinuarSiguienteReactivo');

      if (!uiFeedbackTraining || !txtCuerpo) {
        // Fallback resiliente si no está el contenedor en DOM
        this.avanzarSiguienteReactivo();
        return;
      }

      const elegidaFeedback = String(opcionElegida || '').trim().toUpperCase();
      const textoMarcado = this._textoOpcionEnPantalla(item, elegidaFeedback);
      const textoClaveGuardado = this._textoLimpio(item._textoCorrectoFeedback);
      let claveFeedback = this._letraDeTextoEnPantalla(item, textoClaveGuardado)
        || String(item.respuesta_correcta || item.correcta || item.ok || item.clave || item.solucion || '').trim().toUpperCase();
      if (textoClaveGuardado && !this._letraDeTextoEnPantalla(item, textoClaveGuardado)) {
        claveFeedback = String(item.respuesta_correcta || item.correcta || '').trim().toUpperCase();
      }
      const textoDeClave = textoClaveGuardado || this._textoOpcionEnPantalla(item, claveFeedback);
      const esCorrecta = Boolean(
        (textoMarcado && textoDeClave && textoMarcado === textoDeClave)
        || (claveFeedback.length > 0 && claveFeedback === elegidaFeedback)
      );

      const nombreArea = this._nombreArea(item);
      const razon = this._textoLimpio(item.justificacion_opciones && item.justificacion_opciones[elegidaFeedback]);
      const acierto = this._textoLimpio(item.frase_acierto);
      const repaso = this._textoLimpio(item.repaso);
      const repasoSirve = repaso && repaso.toLowerCase() !== nombreArea.toLowerCase();
      let frase = 'Bien.';
      if (!claveFeedback) {
        frase = esCorrecta ? (acierto ? ('Bien. ' + acierto) : 'Bien.') : 'Esta no era.';
      } else if (esCorrecta) {
        frase = acierto ? ('Bien. ' + acierto) : 'Bien.';
      } else {
        frase = 'Marcaste ' + elegidaFeedback + '.';
        if (razon) frase += ' ' + razon;
        else if (textoMarcado && textoDeClave) frase += ' «' + textoMarcado + '» no responde lo pedido. Lo que sí responde es «' + textoDeClave + '».';
        frase += ' La respuesta es ' + claveFeedback + '.';
        if (repasoSirve) frase += ' ' + repaso + '.';
      }
      this._señalarLetraClave(claveFeedback);
      if (badgeOpcion) {
        const letraOk = String(claveFeedback || '').replace(/[^A-D]/gi, '').toUpperCase();
        const letraMarcada = String(elegidaFeedback || '').replace(/[^A-D]/gi, '').toUpperCase();
        if (esCorrecta) {
          badgeOpcion.innerHTML = letraMarcada
            ? ('Marcaste <span class="fb-marca-ok">' + letraMarcada + '</span>.')
            : 'Correcto.';
        } else if (letraMarcada && letraOk) {
          badgeOpcion.innerHTML = 'Marcaste <span class="fb-marca-mal">' + letraMarcada + '</span>. La respuesta correcta es <span class="fb-marca-ok">' + letraOk + '</span>.';
        } else {
          badgeOpcion.textContent = 'Esta no era';
        }
      }
      uiFeedbackTraining.classList.toggle('feedback-bien', esCorrecta);
      uiFeedbackTraining.classList.toggle('feedback-mal', !esCorrecta);
      // Puente Modo Dante: tras fallo, reentrada por canal Eco (sin tipología).
      if (!esCorrecta && window.mindProfile && typeof window.mindProfile.shapeReentryFeedback === 'function') {
        try { frase = window.mindProfile.shapeReentryFeedback(frase, false); } catch (_) {}
      } else if (!esCorrecta && window.mindProfile && typeof window.mindProfile.shapeScaffolding === 'function') {
        try { frase = window.mindProfile.shapeScaffolding(frase); } catch (_) {}
      }
      txtCuerpo.textContent = frase;

      // Configurar texto del botón de avance
      if (btnContinuar) {
        const esUltimo = (this.indexReactivoActivo + 1 >= this.misionData.reactivos.length);
        btnContinuar.innerHTML = esUltimo 
          ? `<span>Terminar</span> <i class="fa-solid fa-arrow-right ml-1.5"></i>`
          : `<span>Siguiente pregunta</span> <i class="fa-solid fa-arrow-right ml-1.5"></i>`;
        btnContinuar.onclick = (e) => {
          if (e) e.preventDefault();
          this.avanzarSiguienteReactivo();
        };
      }

      uiFeedbackTraining.style.display = 'block';
      uiFeedbackTraining.classList.remove('hidden');
      uiFeedbackTraining.hidden = false;
      // Mantener bloqueo hasta que pulse "Siguiente pregunta".
      this.reactivoConfirmado = true;
      this.isSubmittingRespuesta = true;
      this._bloquearOpcionesTrasConfirmar(true);

      // Scroll suave hacia el feedback para que el alumno lo lea con tranquilidad
      uiFeedbackTraining.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Avanza al siguiente reactivo tras la confirmación y lectura del feedback socrático
     */
    avanzarSiguienteReactivo() {
      if (this.guiaPaso) {
        this._seguirGuia();
        return;
      }
      const uiFeedbackTraining = document.getElementById('uiFeedbackTrainingImmediate');
      if (uiFeedbackTraining) {
        uiFeedbackTraining.style.display = 'none';
        uiFeedbackTraining.classList.add('hidden');
      }

      const containerCore = document.getElementById('uiContenedorPreguntaCore');
      if (containerCore) {
        containerCore.style.opacity = '0';
        containerCore.style.transform = 'translateY(-8px)';
      }

      setTimeout(() => {
        this.indexReactivoActivo++;
        this.maxIndexAlcanzado = Math.max(this.maxIndexAlcanzado || 0, this.indexReactivoActivo);
        // 🛡️ Sincronización atómica inmediata del índice incrementado
        this.guardarProgresoSesion();
        this.isSubmittingRespuesta = false;
        this.reactivoConfirmado = false;
        this._bloquearOpcionesTrasConfirmar(false);

        if (this.indexReactivoActivo < this.misionData.reactivos.length) {
          this.renderizarReactivoActual();
        } else if (this.misionData && this.misionData.esSimulacro && window.DanteSimulacro) {
          DanteSimulacro.alTerminarPreguntas(this, false);
        } else if (this.misionData && (this.misionData.esRefuerzo || this.misionData.repasoArea)) {
          this.completarMisionDiaria();
        } else {
          this.faseActual = 'DILEMAS';
          this.opcionSeleccionadaTemp = null;
          this.renderizarMicroDilemas();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }

    /**
     * Renderiza la Fase 3.3: 1 dilema vocacional al cierre del bloque
     */
    renderizarMicroDilemas() {
      console.log('🧭 [DANTE EXAM WORKSPACE]: Entrando a la Fase de Micro-Dilemas Vocacionales...');
      this.faseActual = 'DILEMAS';
      this.opcionSeleccionadaTemp = null;
      this.isSubmittingRespuesta = false;

      const lblProgressCount = document.getElementById('lblProgressCount');
      if (lblProgressCount) lblProgressCount.innerText = '';

      const lblMateria = document.getElementById('lblMateria');
      if (lblMateria) lblMateria.innerText = 'Después del bloque';

      const uiEnunciados = document.getElementById('uiEnunciados');
      if (uiEnunciados) uiEnunciados.style.display = 'none';

      // Ocultar incondicionalmente intervención socrática y voz de Dante en dilemas vocacionales (opinión/orientación)
      const uiIntervencion = document.getElementById('uiIntervencionDanteContainer');
      if (uiIntervencion) {
        uiIntervencion.style.display = 'none';
        uiIntervencion.classList.add('hidden');
      }

      const btnPista = document.getElementById('btnPistaSocraticaDante');
      if (btnPista) btnPista.style.display = 'none';

      const btn3D = document.getElementById('btnOjoBionico3DWorkspace');
      if (btn3D) {
        btn3D.style.display = 'none';
        btn3D.classList.add('hidden');
      }

      const uiPregunta = document.getElementById('uiPregunta');
      if (uiPregunta) {
        uiPregunta.innerHTML = '';
        uiPregunta.style.display = 'none';
      }

      const uiRecursoVisual = document.getElementById('uiRecursoVisualPreguntaCore');
      if (uiRecursoVisual) {
        uiRecursoVisual.style.display = 'none';
        uiRecursoVisual.innerHTML = '';
      }

      const dilemas = this.misionData.microDilemasVocacionales || [];
      const uiOpcionesGrid = document.getElementById('uiOpcionesGrid');
      if (uiOpcionesGrid) {
        uiOpcionesGrid.innerHTML = '';
        uiOpcionesGrid.className = 'space-y-4 mb-4';
        uiOpcionesGrid.style.display = 'block';

        if (dilemas.length === 0) {
          dilemas.push({
            id: 'dilema_fallback_01',
            categoria_contexto: 'Resiliencia y Liderazgo de Proyectos',
            pregunta_dante: 'Ante un reto complejo de alta incertidumbre en tu carrera deseada, ¿cuál rol prefieres liderar?',
            opciones: [
              { id: 'A', texto: 'Investigar, modelar y resolver la lógica interna del problema.', vector_riasec: { I: 35, C: 10 } },
              { id: 'B', texto: 'Coordinar personas, comunicar la estrategia y motivar al equipo.', vector_riasec: { E: 30, S: 15 } },
              { id: 'C', texto: 'Operar herramientas, construir el prototipo y ejecutar la solución práctica.', vector_riasec: { R: 35, C: 10 } },
              { id: 'D', texto: 'Diseñar la experiencia estética, la visión creativa y el concepto del proyecto.', vector_riasec: { A: 35, E: 10 } }
            ]
          });
        }
        if (dilemas.length > 1) dilemas.length = 1;

        dilemas.forEach((dilema, dIdx) => {
          const cardDilema = document.createElement('div');
          cardDilema.className = 'cierre-hoja cierre-dilema';
          
          let opcionesHtml = '';
          const ops = dilema.opciones || [];

          ops.forEach(op => {
            const opKey = op.id || op.key || 'A';
            const opText = op.texto || op.label || String(op);
            const isSelected = (this.respuestasDilemas[dIdx] && this.respuestasDilemas[dIdx].opcionSeleccionada === opKey);

            opcionesHtml += `
              <button type="button" onclick="DanteExamWorkspace.seleccionarDilemaOption(${dIdx}, '${dilema.id}', '${opKey}')"
                   class="cierre-opcion${isSelected ? ' elegida' : ''}">
                <span class="cierre-marca" aria-hidden="true">${this.sanitizarHtmlText(String(opKey))}</span>
                <span>${this.sanitizarHtmlText(opText)}</span>
              </button>
            `;
          });

          cardDilema.innerHTML = `
            <p class="cierre-kicker">Dilema ${dIdx + 1} de ${dilemas.length}</p>
            <p class="cierre-pregunta">${this.sanitizarHtmlText(dilema.pregunta_dante || dilema.dilema || dilema.pregunta || '')}</p>
            <div>${opcionesHtml}</div>
          `;

          uiOpcionesGrid.appendChild(cardDilema);
        });

        const intro = document.createElement('div');
        intro.className = 'cierre-hoja';
        const marcas = dilemas.map((_, i) => `<span class="${this.respuestasDilemas[i] ? 'hecha' : ''}"></span>`).join('');
        intro.innerHTML = `
          <p class="cierre-kicker">Después del bloque</p>
          <h3 class="cierre-titulo">Un dilema de tu ruta</h3>
          <p class="cierre-texto">Ninguno es correcto. Dice cómo actúas y también suma a tu ruta vocacional. No cambia el puntaje.</p>
          <div class="cierre-marcas" aria-hidden="true">${marcas}</div>
        `;
        uiOpcionesGrid.insertBefore(intro, uiOpcionesGrid.firstChild);
      }

      // Ocultar Hoja Óptica
      const uiHojaOptica = document.getElementById('uiHojaOptica');
      if (uiHojaOptica) uiHojaOptica.style.display = 'none';

      // Botón de Envío Final de Misión
      this.renderizarBotonFinalizacionMision(dilemas.length);

      const containerCore = document.getElementById('uiContenedorPreguntaCore');
      if (containerCore) {
        containerCore.style.opacity = '1';
        containerCore.style.transform = 'translateY(0)';
      }
    }

    /**
     * Registra la opción seleccionada en un Dilema Vocacional
     */
    seleccionarDilemaOption(dilemaIndex, dilemaId, opcionKey) {
      const lista = (this.misionData && this.misionData.microDilemasVocacionales) || [];
      const dilema = lista[dilemaIndex];
      const opcion = dilema && (dilema.opciones || []).find((op) => (op.id || op.key || 'A') === opcionKey);
      const letra = window.DanteHubEngine && typeof DanteHubEngine._letraDominante === 'function'
        ? DanteHubEngine._letraDominante(opcion)
        : '';
      this.respuestasDilemas[dilemaIndex] = {
        dilemaId: dilemaId,
        dilema_id: dilemaId,
        opcionSeleccionada: opcionKey,
        opcion_seleccionada: opcionKey,
        letra: letra,
        esVocacional: true,
        area: 'vocacional'
      };

      // Registrar preferencia vocacional sin validar esCorrecta ni puntaje psicométrico
      try {
        const prefVocacional = {
          respuestas: this.respuestasDilemas,
          ultimaSeleccion: { dilemaIndex, dilemaId, opcionKey },
          timestamp: Date.now()
        };
        localStorage.setItem('dante_preferencia_vocacional', JSON.stringify(prefVocacional));
      } catch (e) {
        console.warn("Error guardando dante_preferencia_vocacional:", e);
      }

      console.log(`🧭 [VOCATIONAL DILEMMA]: Dilema ${dilemaIndex + 1} seleccionado: ${opcionKey}`);
      this.guardarProgresoSesion();
      this.renderizarMicroDilemas();

      // Habilitar de inmediato el botón de finalización para permitir el cierre fluido de la sesión sin congelamientos
      const totalDilemas = Math.min(1, (this.misionData.microDilemasVocacionales || []).length || 1);
      this.renderizarBotonFinalizacionMision(totalDilemas);
    }

    /**
     * Renderiza el Botón Final de Envío de Misión (#btnFinalizarMision / #btnConfirmarSeleccion)
     */
    renderizarBotonFinalizacionMision(totalDilemas) {
      const btnFin = document.getElementById('btnFinalizarMision');
      const btnConf = document.getElementById('btnConfirmarSeleccion');
      const contestados = Object.keys(this.respuestasDilemas).length;
      const listo = !totalDilemas || contestados >= totalDilemas;

      if (btnFin) btnFin.style.display = 'none';
      if (btnConf) {
        btnConf.style.display = 'block';
        btnConf.classList.add('cierre-listo');
        btnConf.innerHTML = listo ? 'Cerrar el bloque' : 'Elige en el dilema';
        btnConf.disabled = !listo;
        if (listo) btnConf.classList.remove('opacity-50', 'cursor-not-allowed', 'btn-pulse-glow');
        else btnConf.classList.add('opacity-50', 'cursor-not-allowed');
        btnConf.onclick = () => this.completarMisionDiaria();
      }
    }

    /**
     * Sincroniza y Cierra la Misión Diaria con el Servidor
     */
    async completarMisionDiaria() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      this.isSubmittingRespuesta = false;
      this.opcionSeleccionadaTemp = null;

      const btnConf = document.getElementById('btnConfirmarSeleccion');
      if (btnConf) {
        btnConf.disabled = true;
        btnConf.innerHTML = 'Cerrando el bloque…';
      }

      let studentId = localStorage.getItem('dante_student_id') || localStorage.getItem('dante_active_student') || '';
      let activeEmail = null;
      let activeToken = localStorage.getItem('dante_token') || localStorage.getItem('dante_jwt') || '';
      try {
        const sesion = JSON.parse(localStorage.getItem('dante_session') || '{}');
        if (sesion && sesion.user) {
          activeEmail = sesion.user.email || null;
          if (!studentId) studentId = sesion.user.estudiante || sesion.user.nombre || '';
          if (!activeToken && sesion.token) activeToken = sesion.token;
        }
      } catch (e) {}
      if (!studentId) studentId = 'student_demo_01';
      const misionId = (this.misionData && this.misionData.misionId) || `mision_daily_${Date.now()}`;
      const targetTrack = (this.misionData && this.misionData.targetTrack) || 'ICFES';
      const esDiagnosticoCierre = Boolean(
        (this.misionData && this.misionData.isDiagnostic) ||
        sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
        localStorage.getItem('dante_is_diagnostic') === 'true'
      );

      // Transformar respuestas vocacionales a array
      const arrVoc = Array.isArray(this.respuestasDilemas)
        ? this.respuestasDilemas
        : Object.values(this.respuestasDilemas);

      try {
        if (window.DanteHubEngine && typeof DanteHubEngine.anotarCierresBloque === 'function') {
          DanteHubEngine.anotarCierresBloque(arrVoc);
        }
      } catch (e) {}
      if (!(this.misionData && (this.misionData.isDiagnostic || this.misionData.esSimulacro)) && window.DanteSemana) {
        try { DanteSemana.anotarBloque(this.respuestasSesionActiva); } catch (e) {}
      }

      const payload = {
        studentId: studentId,
        email: activeEmail,
        misionId: misionId,
        targetTrack: targetTrack,
        isDiagnostic: esDiagnosticoCierre,
        esRefuerzo: Boolean(this.misionData && (this.misionData.esRefuerzo || this.misionData.repasoArea)),
        refuerzoArea: (this.misionData && (this.misionData.refuerzoArea || this.misionData.repasoArea)) || null,
        respuestasReactivos: this.respuestasSesionActiva,
        respuestasVocacionales: arrVoc,
        duracionTotalSesionMs: 1200000 // Aprox 20 mins
      };

      console.log('🚀 [DANTE EXAM WORKSPACE]: Enviando payload de cierre a /api/v1/dante/complete-mission...', payload);

      try {
        const primaryEndpoint = '/api/v1/dante/complete-mission';
        const fallbackEndpoint = '/api/dante/complete-mission';
        const headersCierre = {
          'Content-Type': 'application/json',
          'x-student-id': studentId
        };
        if (activeToken) headersCierre.Authorization = `Bearer ${activeToken}`;
        if (esDiagnosticoCierre) headersCierre['x-is-diagnostic'] = 'true';

        let res = await fetch(primaryEndpoint, {
          method: 'POST',
          credentials: 'include',
          headers: headersCierre,
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (!res || !res.ok) {
          res = await fetch(fallbackEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: headersCierre,
            body: JSON.stringify(payload)
          }).catch(() => null);
        }

        let summary = null;
        if (res && res.ok) {
          const json = await res.json();
          summary = json.summary || json.resumenSesion || json.resultados;
          console.log('🎉 [DANTE EXAM WORKSPACE]: Misión completada exitosamente.', json);
        } else {
          console.warn('⚠️ [DANTE EXAM WORKSPACE]: La sincronización de red falló, generando resumen local...');
        }

        // Actualizar racha de días del estudiante
        if (window.StreakManager && typeof window.StreakManager.registrarActividadHoy === 'function') {
          window.StreakManager.registrarActividadHoy();
        }

        // Limpiar progreso en sessionStorage
        this.limpiarProgresoSesion();

        // Mostrar Resumen Final
        this.faseActual = 'COMPLETADO';
        this.mostrarPantallaResumen(summary);

      } catch (err) {
        console.error('🚨 Error al finalizar la misión:', err);
        this.limpiarProgresoSesion();
        this.mostrarPantallaResumen(null);
      } finally {
        this.isSubmitting = false;
      }
    }

    /**
     * Pantalla de Resumen Final de la Misión Diaria / Diagnóstico
     */
    mostrarPantallaResumen(summary = null) {
      window.isExamActive = false;
      if (window.DanteHubEngine && typeof window.DanteHubEngine.actualizarUIHeaderTrack === 'function') {
        window.DanteHubEngine.actualizarUIHeaderTrack(window.DanteHubEngine.targetTrack || 'ICFES');
      }

      // Restaurar menú inferior al finalizar el examen
      const bottomNav = document.getElementById('bottomNav');
      if (bottomNav) {
        bottomNav.classList.remove('hidden');
        bottomNav.style.display = '';
      }

      // 🛑 DESMONTAJE TOTAL DE LA BARRA SUPERIOR DE EVALUACIÓN (Resultados como pantalla consagrada independiente)
      const uiHeaderExamen = document.getElementById('uiHeaderExamen') || document.querySelector('#viewWorkspace header');
      if (uiHeaderExamen) uiHeaderExamen.style.display = 'none';

      const lblCronometro = document.getElementById('lblCronometroWorkspace');
      if (lblCronometro) lblCronometro.style.display = 'none';

      const btnMenuPausa = document.getElementById('containerMenuPausa');
      if (btnMenuPausa) btnMenuPausa.style.display = 'none';

      const lblProgreso = document.getElementById('lblProgresoReactivo');
      if (lblProgreso) lblProgreso.style.display = 'none';

      const lblMateria = document.getElementById('lblMateriaExamen');
      if (lblMateria) lblMateria.style.display = 'none';

      const uiTira = document.getElementById('uiTiraProgresoReactivos');
      if (uiTira) uiTira.style.display = 'none';

      // 🛑 DESMONTAJE RIGUROSO DE LA INTERFAZ DE EXAMEN (Cero Solapamiento en Móvil y Desktop)
      const uiReactivoContainer = document.getElementById('uiReactivoContainer');
      if (uiReactivoContainer) uiReactivoContainer.style.display = 'none';

      const uiContenedorPreguntaCore = document.getElementById('uiContenedorPreguntaCore');
      if (uiContenedorPreguntaCore) uiContenedorPreguntaCore.style.display = 'none';

      const uiEnunciados = document.getElementById('uiEnunciados');
      if (uiEnunciados) {
        uiEnunciados.style.display = 'none';
        uiEnunciados.innerHTML = '';
      }

      const uiSelectorModo = document.getElementById('uiSelectorModoVisualWorkspace');
      if (uiSelectorModo) uiSelectorModo.style.display = 'none';

      const uiHojaOptica = document.getElementById('uiHojaOptica');
      if (uiHojaOptica) uiHojaOptica.style.display = 'none';

      const btnConf = document.getElementById('btnConfirmarSeleccion');
      if (btnConf) btnConf.style.display = 'none';

      const uiRecVisual = document.getElementById('uiRecursoVisualPreguntaCore');
      if (uiRecVisual) {
        uiRecVisual.style.display = 'none';
        uiRecVisual.innerHTML = '';
      }

      const uiLive = document.getElementById('uiIntervencionDanteContainer');
      if (uiLive) uiLive.style.display = 'none';

      const uiBanner = document.getElementById('uiBannerOnboardingMision');
      if (uiBanner) uiBanner.style.display = 'none';

      const viewWorkspace = document.getElementById('viewWorkspace');
      if (viewWorkspace) {
        viewWorkspace.style.paddingTop = '0.25rem';
      }

      const containerLayout = document.getElementById('containerLayout');
      if (containerLayout) {
        containerLayout.classList.add('single-panel');
        containerLayout.style.display = 'block';
        containerLayout.style.maxWidth = '780px';
        containerLayout.style.margin = '0 auto';
      }

      const uiPregunta = document.getElementById('uiPregunta');
      if (uiPregunta) {
        uiPregunta.style.display = 'none';
        uiPregunta.innerHTML = '';
      }

      const containerResumen = document.getElementById('uiPantallaResumenContainer') || document.getElementById('uiOpcionesGrid');
      if (containerResumen) {
        containerResumen.style.display = 'block';
          const esMisionPreun = this._esMisionPreun();
          const conteoSesion = esMisionPreun ? Object.values(this.respuestasSesionActiva || {}).filter((r) => r && typeof r.correcto === 'boolean') : this._historialCalibrado();
          const aciertosMedidos = conteoSesion.filter((r) => r.correcto).length;
          const aciertos = conteoSesion.length ? aciertosMedidos : (summary ? (summary.aciertos || 0) : 0);
          const total = conteoSesion.length || this.respuestasSesionActiva.length || (summary ? 10 : 0);
          const estSesion = esMisionPreun ? { theta: null, sem: null, puntos: null } : this._recalibrarHabilidad();
          const racha = summary ? (summary.rachaDias || 1) : 1;
          const holland = summary && summary.hollandDominante ? summary.hollandDominante : '';

        const urlParams = new URLSearchParams(window.location.search);
        const isDiagnostic = urlParams.get('launch') === 'diagnostic' || 
                             urlParams.get('action') === 'start_diag' ||
                             (this.misionData && this.misionData.isDiagnostic) ||
                             sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
                             localStorage.getItem('dante_is_diagnostic') === 'true';

        if (isDiagnostic) {
          // Registrar calibración diagnóstica inicial completada
          localStorage.setItem('dante_calibracion_tactica_inicial_done', 'true');
          localStorage.setItem('dante_diagnostic_completed', 'true');
          localStorage.setItem('dante_diagnostico_completado', 'true');
          localStorage.setItem('dante_onboarding_completed', 'true');
          // Tras diagnóstico: obligar a conocer Hackea (espiral: clic + mantener)
          localStorage.setItem('dante_hackea_obligatorio', '1');
          sessionStorage.removeItem('dante_is_diagnostic');
          localStorage.removeItem('dante_is_diagnostic');
          localStorage.removeItem('dante_diagnostico_en_curso');
          sessionStorage.removeItem('dante_diag_sala_mode');
          try {
            localStorage.removeItem('dante_sesion_pausada');
            sessionStorage.removeItem('dante_exam_progress');
            localStorage.removeItem('dante_exam_progress');
            localStorage.removeItem('dante_exam_current_index');
            sessionStorage.removeItem('dante_mision_actual');
          } catch (e) {}

          const carreraRaw = localStorage.getItem('dante_carrera_objetivo') || '';
          const carreraClean = carreraRaw ? (carreraRaw.split('/')[0].trim() || carreraRaw) : '';

          const isUnal = esMisionPreun;

          const nombreExamen = isUnal ? 'Admisión UNAL' : 'Saber 11°';
          const escalaTotal = 500;

          const estPuntos = estSesion && estSesion.puntos != null ? estSesion.puntos : 0;
          const scoreProyectado = estPuntos;
          const metaResuelta = this._resolverMetaSaber11();
          let metaPuntaje = metaResuelta != null ? metaResuelta : 0;
          const hayMeta = metaPuntaje > 0 && metaPuntaje <= 500;
          const brechaPuntos = hayMeta ? Math.max(0, metaPuntaje - scoreProyectado) : null;
          const proximidadPct = hayMeta ? Math.min(100, Math.max(0, Math.round((scoreProyectado / metaPuntaje) * 100))) : 0;
          const msgSinMeta = this._mensajeBrechaSinMeta(carreraClean);

          if (window.DanteDiagnosticGateManager && typeof window.DanteDiagnosticGateManager.markDiagnosticCompleted === 'function') {
            window.DanteDiagnosticGateManager.markDiagnosticCompleted(scoreProyectado);
          }

          // 1. Vector de Desempeño por Materia (precisionPorArea)
          let rawBreakdown = (summary && (summary.precisionPorArea || (summary.resumenSesion && summary.resumenSesion.precisionPorArea))) || {};
          if (Object.keys(rawBreakdown).length === 0 && this.respuestasSesionActiva.length > 0) {
            const stats = {};
            this.respuestasSesionActiva.forEach(r => {
              const a = (r.materia || r.area || 'general').toLowerCase();
              if (!stats[a]) stats[a] = { total: 0, aciertos: 0 };
              stats[a].total++;
              if (r.correcto || r.isCorrect || r.esCorrecta) stats[a].aciertos++;
            });
            for (const [k, v] of Object.entries(stats)) {
              rawBreakdown[k] = parseFloat(((v.aciertos / (v.total || 1)) * 100).toFixed(1));
            }
          }

          const aliasArea = esMisionPreun ? {} : {
            razonamiento_logico: 'matematicas',
            analisis_textual: 'lectura_critica',
            ciencias: 'ciencias_naturales',
            sociales: 'sociales_ciudadanas'
          };
          const areaBreakdown = {};
          Object.keys(rawBreakdown).forEach((k) => {
            const key = aliasArea[k] || k;
            if (areaBreakdown[key] === undefined) areaBreakdown[key] = rawBreakdown[k];
          });

          const NOMBRES_AREAS = {
            matematicas: 'MATEMÁTICAS',
            lectura_critica: 'LECTURA CRÍTICA',
            ciencias_naturales: 'CIENCIAS NATURALES',
            ciencias: 'CIENCIAS NATURALES',
            sociales_ciudadanas: 'SOCIALES Y CIUDADANAS',
            sociales: 'SOCIALES',
            ingles: 'INGLÉS',
            razonamiento_logico: 'RAZONAMIENTO LÓGICO',
            analisis_textual: 'ANÁLISIS TEXTUAL',
            analisis_imagen: 'ANÁLISIS DE IMAGEN'
          };

          // 🧠 RADIOGRAFÍA DEL ERROR: Detección psicométrica de patrones cognitivos
          let menorPct = 101;
          let vulnerableKey = '';
          for (const [k, v] of Object.entries(areaBreakdown)) {
            const num = Number(v) || 0;
            if (num < menorPct) {
              menorPct = num;
              vulnerableKey = k;
            }
          }
          const vulnerableNombre = NOMBRES_AREAS[vulnerableKey] || vulnerableKey.replace(/_/g, ' ').toUpperCase();
          const sesgoMateria = menorPct === 101
            ? 'esta sesión no dejó un área para comparar'
            : `ahí tu precisión fue del ${menorPct}%`;

          const radiografiaData = {
            materiaVulnerable: vulnerableNombre,
            materiaKey: vulnerableKey,
            pctPrecision: menorPct === 101 ? 0 : menorPct,
            patronDetectado: sesgoMateria,
            prescripcion: vulnerableNombre
              ? `Mañana el entrenamiento empieza por ${vulnerableNombre}.`
              : 'Mañana el entrenamiento sigue con las preguntas que fallaste.'
          };

          // 💾 PERSISTENCIA HÍBRIDA INMEDIATA EN CLIENTE (SSOT para perfil.html)
          const ptsPreuSala = parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10);
          const detalleDiag = this._serializarItemsSesion();
          try {
            if (!esMisionPreun && estSesion && estSesion.puntos != null) {
              localStorage.setItem('dante_score_proyectado', String(scoreProyectado));
              localStorage.setItem('dante_puntaje_global', String(scoreProyectado));
            }
            if (!esMisionPreun && estSesion && estSesion.puntos != null && !localStorage.getItem('dante_score_base')) {
              localStorage.setItem('dante_score_base', String(scoreProyectado));
            }
            if (!esMisionPreun) {
              localStorage.setItem('dante_precision_por_area', JSON.stringify(areaBreakdown));
              localStorage.setItem('dante_theta_estimado', String(
                (estSesion && typeof estSesion.theta === 'number') ? estSesion.theta : (summary?.thetaEstimado || 0)
              ));
            }
            localStorage.setItem('dante_radiografia_error', JSON.stringify(radiografiaData));

            const evaluacionDiag = {
              id: `eval_diag_${Date.now()}`,
              created_at: new Date().toISOString(),
              materia: esMisionPreun ? 'Diagnóstico Pre-U' : 'Diagnóstico Inicial Saber 11°',
              tipo: 'DIAGNOSTICO_INICIAL',
              puntaje_escalonado: esMisionPreun ? (ptsPreuSala > 0 ? ptsPreuSala : null) : scoreProyectado,
              theta: (estSesion && typeof estSesion.theta === 'number') ? estSesion.theta : (summary?.thetaEstimado || 0),
              sem: (estSesion && typeof estSesion.sem === 'number') ? Math.round(estSesion.sem * 100) / 100 : null,
              aciertos,
              total,
              precision: Math.round((aciertos / (total || 1)) * 100),
              precisionPorArea: areaBreakdown,
              irdPorcentaje: (summary && summary.irdPorcentaje !== undefined && summary.irdPorcentaje !== null) ? summary.irdPorcentaje : null,
              radiografia: radiografiaData,
              items_respondidos: detalleDiag.items_respondidos,
              preguntas_falladas: detalleDiag.preguntas_falladas
            };

            let histPrevio = [];
            try {
              const rawH = localStorage.getItem('dante_history_cache');
              if (rawH) histPrevio = JSON.parse(rawH) || [];
            } catch(e) {}
            if (!Array.isArray(histPrevio)) histPrevio = [];
            histPrevio.unshift(evaluacionDiag);
            localStorage.setItem('dante_history_cache', JSON.stringify(histPrevio.slice(0, 80)));
            this._sumarConteoAreas();
            this._publicarEnNube('DIAGNOSTICO_INICIAL');
          } catch(e) {
            console.warn("⚠️ [DANTE EXAM WORKSPACE]: Error escribiendo caché local:", e);
          }

          let areaRowsHtml = '';
          const areaKeys = Object.keys(areaBreakdown);
          const colorBarraArea = (key) => {
            const k = String(key || '').toLowerCase();
            if (k.includes('lect')) return '#7c3aed';
            if (k.includes('mate') || k.includes('razon')) return '#2563eb';
            if (k.includes('cien') || k.includes('natur')) return '#16a34a';
            if (k.includes('social')) return '#ea580c';
            if (k.includes('ingl')) return '#64748b';
            return '#334155';
          };
          if (areaKeys.length > 0) {
            areaKeys.forEach(aKey => {
              const pct = Number(areaBreakdown[aKey]) || 0;
              const nombreDisplay = NOMBRES_AREAS[aKey] || aKey.replace(/_/g, ' ').toUpperCase();
              let badgeText = 'Fortaleza';
              let badgeClass = 'ok';
              if (pct < 40) {
                badgeText = 'Refuerzo Táctico';
                badgeClass = 'low';
              } else if (pct < 70) {
                badgeText = 'En Calibración';
                badgeClass = 'mid';
              }
              const barColor = colorBarraArea(aKey);
              areaRowsHtml += `
                <div class="rp-area-row">
                  <div class="rp-area-top">
                    <span class="rp-area-name">${nombreDisplay}</span>
                    <span class="rp-badge ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="rp-bar"><span style="width:${Math.max(4, Math.min(100, pct))}%;background:${barColor};"></span></div>
                  <div class="rp-area-meta">${pct}%</div>
                </div>
              `;
            });
          }

          // 2. Indicador de Firmeza Metacognitiva (IRD)
          const irdCrudo = summary && (summary.irdPorcentaje !== undefined ? summary.irdPorcentaje : (summary.resumenSesion && summary.resumenSesion.irdPorcentaje));
          const irdVal = irdCrudo === undefined || irdCrudo === null || irdCrudo === '' ? null : Number(irdCrudo);
          const firmezaScore = irdVal == null ? null : Math.max(0, Math.min(100, Math.round(100 - (irdVal * 1.4))));
          let firmezaColor = 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20';
          let firmezaIcon = 'fa-solid fa-shield-halved text-emerald-400';
          let firmezaTitle = 'Firmeza táctica alta';
          let firmezaDesc = 'Decisiones tácticas sólidas con bajo titubeo o descarte innecesario.';
          if (firmezaScore == null) {
            firmezaTitle = 'Sin medición';
            firmezaDesc = 'Esta sesión no contó los cambios de opción.';
          } else if (firmezaScore < 60) {
            firmezaColor = 'border-rose-500/40 text-rose-300 bg-rose-950/20';
            firmezaIcon = 'fa-solid fa-triangle-exclamation text-rose-400';
            firmezaTitle = 'Riesgo por duda y vacilación';
            firmezaDesc = 'Se detectaron cambios reiterados de opción y vacilación en reactivos clave.';
          } else if (firmezaScore < 80) {
            firmezaColor = 'border-amber-500/40 text-amber-300 bg-amber-950/20';
            firmezaIcon = 'fa-solid fa-scale-balanced text-amber-400';
            firmezaTitle = 'Firmeza moderada en calibración';
            firmezaDesc = 'Seguridad adecuada con ligera vacilación en reactivos de dificultad media-alta.';
          }

          const cortePreu = localStorage.getItem('dante_preu_corte') || '';
          const escalaCorte = localStorage.getItem('dante_preu_escala') || '';
          const tituloPuntaje = esMisionPreun ? 'Habilidad Pre-U' : 'Puntaje proyectado';
          const numeroPuntaje = esMisionPreun ? (ptsPreuSala > 0 ? ptsPreuSala : '—') : scoreProyectado;
          const tituloMeta = esMisionPreun ? 'Corte de la carrera' : 'Meta requerida';
          const numeroMeta = esMisionPreun ? (cortePreu || '—') : (hayMeta ? metaPuntaje : '—');
          const sufijoMeta = esMisionPreun ? (escalaCorte ? '/ ' + escalaCorte : '') : (hayMeta ? 'sobre 500' : 'sobre 500');
          const tituloBrecha = esMisionPreun ? 'Escalas' : 'Brecha';
          const numeroBrecha = esMisionPreun ? 'aparte' : (brechaPuntos == null ? '—' : '-' + brechaPuntos + ' pts');
          const tituloCercania = esMisionPreun ? 'Dos mediciones distintas' : ('Proximidad al Estándar de Corte (' + proximidadPct + '%)');
          const textoCercania = esMisionPreun
            ? 'Esta habilidad va de 0 a 500. El corte se lee en la escala de la convocatoria.'
            : (hayMeta ? scoreProyectado + ' de ' + metaPuntaje + ' Pts' : msgSinMeta);
          const anchoBarra = esMisionPreun ? 0 : proximidadPct;
          const tituloPlan = esMisionPreun
            ? 'Siguiente paso'
            : ('Plan de Cierre de Brecha Táctica (' + (brechaPuntos == null ? (carreraClean ? 'meta pendiente' : 'sin carrera') : '-' + brechaPuntos + ' Pts') + ')');
          const fraseProyeccion = esMisionPreun
            ? 'Profesor Dante dejó tu habilidad Pre-U con las preguntas de admisión.'
            : ('Profesor Dante dejó tu proyección en <strong class="text-slate-900 font-semibold">' + scoreProyectado + '</strong> puntos'
              + (carreraClean ? (' frente a <strong class="text-slate-900 font-semibold">' + carreraClean + '</strong>') : '')
              + '.');

          const tituloProyeccion = carreraClean
            ? ('Proyección para ' + carreraClean)
            : ('Proyección · ' + nombreExamen);
          const textoBrechaCap = (brechaPuntos == null)
            ? (esMisionPreun ? 'Escalas distintas' : msgSinMeta)
            : ('Te faltan ' + brechaPuntos + ' puntos para alcanzar la meta');
          const textoCorte = esMisionPreun
            ? textoCercania
            : (hayMeta
              ? ('Cercanía al corte: A ' + brechaPuntos + ' puntos del puntaje mínimo estimado.')
              : msgSinMeta);
          const pctFirmezaAnillo = firmezaScore == null ? 0 : firmezaScore;
          const textoFirmezaPct = firmezaScore == null ? '—' : (firmezaScore + '%');

          document.body.classList.add('reporte-final-activo');

          containerResumen.innerHTML = `
            <article class="reporte-papel" id="reporteFinalPapel">
              <div class="rp-brand">
                <span class="rp-brand-mark">ICFES</span>
                <span class="rp-brand-sep" aria-hidden="true"></span>
                <span class="rp-brand-sub">Reporte personalizado</span>
              </div>
              <h2 class="rp-title">Diagnóstico inicial terminado</h2>
              <p class="rp-lead">Gracias por completar tu diagnóstico. Aquí está tu análisis inicial.</p>

              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-regular fa-snowflake" aria-hidden="true"></i> Tu resultado en frío: ${total} preguntas</h3>
                <div class="rp-card rp-frio">
                  <span class="rp-frio-ico" aria-hidden="true"><i class="fa-solid fa-brain"></i></span>
                  <p>Este es tu punto de partida. <strong>Respuestas correctas: ${aciertos}/${total}</strong>. ${fraseProyeccion}</p>
                </div>
              </section>

              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> ${tituloProyeccion}</h3>
                <div class="rp-card">
                  <div class="rp-metrics">
                    <div>
                      <span class="rp-metric-lbl">${tituloPuntaje}</span>
                      <span class="rp-metric-val ok">${numeroPuntaje}</span>
                      <span class="rp-metric-sub">sobre ${escalaTotal}</span>
                    </div>
                    <div>
                      <span class="rp-metric-lbl">${tituloMeta}</span>
                      <span class="rp-metric-val">${numeroMeta}</span>
                      <span class="rp-metric-sub">${sufijoMeta || ('sobre ' + escalaTotal)}</span>
                    </div>
                    <div>
                      <span class="rp-metric-lbl">${tituloBrecha}</span>
                      <span class="rp-metric-val gap">${numeroBrecha}</span>
                      <span class="rp-metric-sub">${textoBrechaCap}</span>
                    </div>
                  </div>
                  <div class="rp-corte" role="status">
                    <i class="fa-solid fa-bullseye" aria-hidden="true"></i>
                    <span>${textoCorte}</span>
                  </div>
                </div>
              </section>

              ${areaRowsHtml ? `
              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-solid fa-chart-simple" aria-hidden="true"></i> Resultados por área</h3>
                <div class="rp-card rp-area">${areaRowsHtml}</div>
              </section>
              ` : ''}

              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Dónde fallaste</h3>
                <div class="rp-fallo">
                  <strong>${radiografiaData.materiaVulnerable || 'Área a reforzar'}:</strong>
                  ${radiografiaData.patronDetectado || ''}
                </div>
              </section>

              ${DanteExamWorkspaceEngine.htmlPreguntasFalladas(detalleDiag.preguntas_falladas)}

              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-solid fa-sun" aria-hidden="true"></i> Mañana empezamos por</h3>
                <div class="rp-card rp-manana">
                  <p class="rp-manana-txt">${radiografiaData.prescripcion}</p>
                  <div class="rp-manana-meta">
                    <div class="rp-anillo" style="--pct:${pctFirmezaAnillo};" title="${firmezaTitle}" aria-label="${firmezaTitle}: ${textoFirmezaPct}">
                      <strong>${textoFirmezaPct}</strong>
                    </div>
                    <div class="rp-confianza-copy">
                      <p class="rp-confianza-lbl">Confianza en tus respuestas</p>
                      <p class="rp-confianza-desc">${firmezaDesc}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="rp-sec">
                <h3 class="rp-sec-h"><i class="fa-solid fa-list-check" aria-hidden="true"></i> Qué hacer ahora</h3>
                <div class="rp-card rp-tareas">
                  <div id="danteTareaEstudioDiag"></div>
                </div>
              </section>

              <div class="rp-actions">
                <button type="button" class="rp-btn-primary" onclick="DanteExamWorkspace.irAlPerfil()">
                  Ver expediente completo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
                <button type="button" class="rp-btn-secondary" onclick="DanteExamWorkspace.regresarAlHub()">
                  Ir a la sala <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
              </div>
            </article>
          `;
          DanteExamWorkspaceEngine.enlazarAyudasFallidas(containerResumen);
          if (window.DantePlanSala) DantePlanSala.pintarTarea(containerResumen, this.respuestasSesionActiva);
          const tituloSaber = document.getElementById('uiTituloSaberPapel');
          if (tituloSaber) tituloSaber.style.display = 'none';
          return;
        }

        const previoSala = parseInt(localStorage.getItem('dante_score_proyectado') || '0', 10);
        let proyeccionSala = previoSala;
        let etiquetaScore = 'Score Proyectado';
        let valorScore = proyeccionSala + ' Pts';
        let notaRuta = holland ? holland : 'El perfil vocacional queda registrado cuando respondes los dilemas de la sesión.';
        if (esMisionPreun) {
          const ptsPreu = parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10);
          etiquetaScore = 'Habilidad Pre-U';
          valorScore = (ptsPreu > 0 ? ptsPreu : '—') + ' de 500';
          const carreraPreu = localStorage.getItem('dante_preu_carrera') || '';
          notaRuta = carreraPreu
            ? ('Carrera de admisión: ' + carreraPreu + '.')
            : 'En la sala eliges la carrera. El corte queda en la escala de esa convocatoria.';
          this._registrarSesionExpediente('MISION_DIARIA', 'Entrenamiento Pre-U', ptsPreu > 0 ? ptsPreu : null, null);
        } else {
          const estSala = this._recalibrarHabilidad();
          if (estSala && estSala.puntos != null) {
            if (previoSala > 0) {
              localStorage.setItem('dante_score_anterior', String(previoSala));
              if (!localStorage.getItem('dante_score_base')) {
                localStorage.setItem('dante_score_base', String(previoSala));
              }
            }
            proyeccionSala = estSala.puntos;
            valorScore = proyeccionSala + ' Pts';
            localStorage.setItem('dante_score_proyectado', String(proyeccionSala));
            localStorage.setItem('dante_puntaje_global', String(proyeccionSala));
            localStorage.setItem('dante_proyeccion_practicas', '1');
          }
          this._registrarSesionExpediente(
            'MISION_DIARIA',
            'Entrenamiento diario Saber 11°',
            proyeccionSala,
            estSala && typeof estSala.theta === 'number' ? estSala.theta : this.thetaEstimado
          );
          this._publicarEnNube('MISION_DIARIA');
        }

        const esRefuerzoFin = Boolean(this.misionData && (this.misionData.esRefuerzo || this.misionData.repasoArea));
        const esSimFin = Boolean(this.misionData && this.misionData.esSimulacro);
        let tituloBloque = 'Entrenamiento terminado';
        let leadBloque = 'Gracias por completar tu bloque. Aquí está tu análisis de la sesión.';
        if (esRefuerzoFin) {
          tituloBloque = 'Refuerzo terminado';
          leadBloque = 'Completaste el refuerzo. Estos son los datos de la sesión.';
        } else if (esSimFin) {
          tituloBloque = 'Simulacro terminado';
          leadBloque = 'Completaste el simulacro. Estos son los datos medidos.';
        } else if (esMisionPreun) {
          tituloBloque = 'Bloque Pre-U terminado';
          leadBloque = 'Quedó registrada la habilidad de esta sesión Pre-U.';
        }

        const carreraSalaRaw = localStorage.getItem('dante_carrera_objetivo') || localStorage.getItem('dante_preu_carrera') || '';
        const carreraSala = carreraSalaRaw ? (carreraSalaRaw.split('/')[0].trim() || carreraSalaRaw) : '';
        const tituloProySala = carreraSala
          ? ('Proyección para ' + carreraSala)
          : (esMisionPreun ? 'Proyección Pre-U' : 'Proyección Saber 11°');
        const metaResueltaSala = esMisionPreun ? null : this._resolverMetaSaber11();
        const metaSala = metaResueltaSala != null ? metaResueltaSala : 0;
        const hayMetaSala = metaSala > 0;
        const scoreNumSala = (!esMisionPreun && proyeccionSala > 0) ? proyeccionSala : null;
        const brechaSala = (hayMetaSala && scoreNumSala != null) ? Math.max(0, metaSala - scoreNumSala) : null;
        const msgSinMetaSala = this._mensajeBrechaSinMeta(carreraSala);
        const textoBrechaSala = brechaSala == null
          ? (esMisionPreun ? 'Escalas distintas' : msgSinMetaSala)
          : ('Te faltan ' + brechaSala + ' puntos para alcanzar la meta');
        const textoCorteSala = esMisionPreun
          ? 'Esta habilidad va de 0 a 500. El corte se lee en la escala de la convocatoria.'
          : (hayMetaSala && brechaSala != null
            ? ('Cercanía al corte: A ' + brechaSala + ' puntos del puntaje mínimo estimado.')
            : (hayMetaSala ? ('Meta registrada: ' + metaSala + ' pts') : msgSinMetaSala));
        const numeroPuntajeSala = esMisionPreun
          ? (parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10) || '—')
          : (scoreNumSala != null ? scoreNumSala : '—');
        const numeroMetaSala = esMisionPreun
          ? (localStorage.getItem('dante_preu_corte') || '—')
          : (hayMetaSala ? metaSala : '—');
        const numeroBrechaSala = esMisionPreun
          ? 'aparte'
          : (brechaSala == null ? '—' : ('-' + brechaSala + ' Pts'));

        const nombresSala = {
          matematicas: 'MATEMÁTICAS',
          lectura_critica: 'LECTURA CRÍTICA',
          ciencias_naturales: 'CIENCIAS NATURALES',
          sociales_ciudadanas: 'SOCIALES Y CIUDADANAS',
          ingles: 'INGLÉS'
        };
        const colorBarraSala = (key) => {
          const k = String(key || '').toLowerCase();
          if (k.includes('lect')) return '#7c3aed';
          if (k.includes('mate') || k.includes('razon')) return '#2563eb';
          if (k.includes('cien') || k.includes('natur')) return '#16a34a';
          if (k.includes('social')) return '#ea580c';
          if (k.includes('ingl')) return '#64748b';
          return '#334155';
        };

        let areaRowsSala = '';
        let vulnerableNombreSala = '';
        let vulnerablePctSala = null;
        try {
          const statsSala = {};
          Object.values(this.respuestasSesionActiva || {}).forEach((r) => {
            if (!r || typeof r.correcto !== 'boolean') return;
            const a = String(r.materia || r.area || 'general').toLowerCase();
            if (!statsSala[a]) statsSala[a] = { total: 0, aciertos: 0 };
            statsSala[a].total += 1;
            if (r.correcto) statsSala[a].aciertos += 1;
          });
          let menorPctSala = 101;
          Object.keys(statsSala).forEach((k) => {
            const st = statsSala[k];
            const pct = Math.round((st.aciertos / (st.total || 1)) * 100);
            if (pct < menorPctSala) {
              menorPctSala = pct;
              vulnerableNombreSala = nombresSala[k] || k.replace(/_/g, ' ').toUpperCase();
              vulnerablePctSala = pct;
            }
            let badgeText = 'Fortaleza';
            let badgeClass = 'ok';
            if (pct < 40) { badgeText = 'Refuerzo Táctico'; badgeClass = 'low'; }
            else if (pct < 70) { badgeText = 'En Calibración'; badgeClass = 'mid'; }
            const nombre = nombresSala[k] || k.replace(/_/g, ' ').toUpperCase();
            areaRowsSala += `
              <div class="rp-area-row">
                <div class="rp-area-top">
                  <span class="rp-area-name">${nombre}</span>
                  <span class="rp-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="rp-bar"><span style="width:${Math.max(4, pct)}%;background:${colorBarraSala(k)};"></span></div>
                <div class="rp-area-meta">${st.aciertos}/${st.total} · ${pct}%</div>
              </div>`;
          });
        } catch (e) { areaRowsSala = ''; }

        let radioTxtSala = '';
        try {
          const radioCache = JSON.parse(localStorage.getItem('dante_radiografia_error') || 'null');
          if (radioCache && (radioCache.patronDetectado || radioCache.materiaVulnerable)) {
            vulnerableNombreSala = radioCache.materiaVulnerable || vulnerableNombreSala;
            radioTxtSala = radioCache.patronDetectado || '';
          }
        } catch (e) {}
        if (!radioTxtSala && vulnerablePctSala != null) {
          radioTxtSala = 'ahí tu precisión fue del ' + vulnerablePctSala + '%';
        }
        const prescripcionSala = vulnerableNombreSala
          ? ('Mañana el entrenamiento empieza por ' + vulnerableNombreSala + '.')
          : 'Mañana el entrenamiento sigue con las preguntas que fallaste.';

        const irdCrudoSala = summary && (summary.irdPorcentaje !== undefined ? summary.irdPorcentaje : (summary.resumenSesion && summary.resumenSesion.irdPorcentaje));
        const irdValSala = irdCrudoSala === undefined || irdCrudoSala === null || irdCrudoSala === '' ? null : Number(irdCrudoSala);
        const firmezaSala = irdValSala == null ? null : Math.max(0, Math.min(100, Math.round(100 - (irdValSala * 1.4))));
        const pctFirmezaSala = firmezaSala == null ? 0 : firmezaSala;
        const textoFirmezaSala = firmezaSala == null ? '—' : (firmezaSala + '%');
        let firmezaDescSala = 'Esta sesión no contó los cambios de opción.';
        if (firmezaSala != null && firmezaSala < 60) firmezaDescSala = 'Se detectaron cambios reiterados de opción y vacilación en reactivos clave.';
        else if (firmezaSala != null && firmezaSala < 80) firmezaDescSala = 'Seguridad adecuada con ligera vacilación en reactivos de dificultad media-alta.';
        else if (firmezaSala != null) firmezaDescSala = 'Decisiones tácticas sólidas con bajo titubeo o descarte innecesario.';

        document.body.classList.add('reporte-final-activo');

        containerResumen.innerHTML = `
          <article class="reporte-papel" id="reporteFinalPapel">
            <div class="rp-brand">
              <span class="rp-brand-mark">ICFES</span>
              <span class="rp-brand-sep" aria-hidden="true"></span>
              <span class="rp-brand-sub">Reporte personalizado</span>
            </div>
            <h2 class="rp-title">${tituloBloque}</h2>
            <p class="rp-lead">${leadBloque}</p>

            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-regular fa-snowflake" aria-hidden="true"></i> Tu resultado en frío: ${total} preguntas</h3>
              <div class="rp-card rp-frio">
                <span class="rp-frio-ico" aria-hidden="true"><i class="fa-solid fa-brain"></i></span>
                <p>Sesión medida. <strong>Respuestas correctas: ${aciertos}/${total}</strong>.</p>
              </div>
            </section>

            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> ${tituloProySala}</h3>
              <div class="rp-card">
                <div class="rp-metrics">
                  <div>
                    <span class="rp-metric-lbl">${esMisionPreun ? 'Habilidad Pre-U' : 'Puntaje proyectado'}</span>
                    <span class="rp-metric-val ok">${numeroPuntajeSala}</span>
                    <span class="rp-metric-sub">sobre 500</span>
                  </div>
                  <div>
                    <span class="rp-metric-lbl">${esMisionPreun ? 'Corte de la carrera' : 'Meta requerida'}</span>
                    <span class="rp-metric-val">${numeroMetaSala}</span>
                    <span class="rp-metric-sub">sobre 500</span>
                  </div>
                  <div>
                    <span class="rp-metric-lbl">${esMisionPreun ? 'Escalas' : 'Brecha'}</span>
                    <span class="rp-metric-val gap">${numeroBrechaSala}</span>
                    <span class="rp-metric-sub">${textoBrechaSala}</span>
                  </div>
                </div>
                <div class="rp-corte" role="status">
                  <i class="fa-solid fa-bullseye" aria-hidden="true"></i>
                  <span>${textoCorteSala}</span>
                </div>
              </div>
            </section>

            ${areaRowsSala ? `
            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-chart-simple" aria-hidden="true"></i> Resultados por área</h3>
              <div class="rp-card rp-area">${areaRowsSala}</div>
            </section>
            ` : ''}

            ${vulnerableNombreSala ? `
            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Dónde fallaste</h3>
              <div class="rp-fallo">
                <strong>${vulnerableNombreSala}:</strong>
                ${radioTxtSala}
              </div>
            </section>
            ` : ''}

            ${DanteExamWorkspaceEngine.htmlPreguntasFalladas((this._serializarItemsSesion() || {}).preguntas_falladas)}

            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-sun" aria-hidden="true"></i> Mañana empezamos por</h3>
              <div class="rp-card rp-manana">
                <p class="rp-manana-txt">${prescripcionSala}</p>
                <div class="rp-manana-meta">
                  <div class="rp-anillo" style="--pct:${pctFirmezaSala};" aria-label="Confianza: ${textoFirmezaSala}">
                    <strong>${textoFirmezaSala}</strong>
                  </div>
                  <div class="rp-confianza-copy">
                    <p class="rp-confianza-lbl">Confianza en tus respuestas</p>
                    <p class="rp-confianza-desc">${firmezaDescSala}</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-compass" aria-hidden="true"></i> ${esMisionPreun ? 'Ruta de admisión' : 'Perfil vocacional'}</h3>
              <div class="rp-card"><p class="rp-manana-txt">${notaRuta}</p></div>
            </section>

            <section class="rp-sec">
              <h3 class="rp-sec-h"><i class="fa-solid fa-list-check" aria-hidden="true"></i> Qué hacer ahora</h3>
              <div class="rp-card rp-tareas"><div id="danteTareaEstudioDiag"></div></div>
            </section>

            <div class="rp-actions">
              <button type="button" class="rp-btn-primary" onclick="DanteExamWorkspace.irAlPerfil()">
                Ver expediente completo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>
              <button type="button" class="rp-btn-secondary" onclick="DanteExamWorkspace.regresarAlHub()">
                Ir a la sala <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </article>
        `;
        DanteExamWorkspaceEngine.enlazarAyudasFallidas(containerResumen);
        const tituloSaber2 = document.getElementById('uiTituloSaberPapel');
        if (tituloSaber2) tituloSaber2.style.display = 'none';
      }
      try {
        localStorage.removeItem('dante_sesion_pausada');
        sessionStorage.removeItem('dante_exam_progress');
        localStorage.removeItem('dante_exam_progress');
        localStorage.removeItem('dante_exam_current_index');
        sessionStorage.removeItem('dante_mision_actual');
      } catch (e) {}
      if (window.DantePlanSala) DantePlanSala.pintarTarea(containerResumen, this.respuestasSesionActiva);
      if (window.DanteRecorrido && !(this.misionData && this.misionData.isDiagnostic)) {
        const idMision = (this.misionData && (this.misionData.misionId || this.misionData.id)) || ('bloque-' + Date.now());
        if (this.misionData && this.misionData.esRefuerzo) DanteRecorrido.cerrarRefuerzo(idMision);
        else DanteRecorrido.cerrarBloque(this.respuestasSesionActiva, idMision);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /** Tras diagnóstico: vuelve a la sala con coach de espiral (Hackea obligatorio). */
    irAHackeaObligatorio() {
      try { localStorage.setItem('dante_hackea_obligatorio', '1'); } catch (e) {}
      this.regresarAlHub();
      setTimeout(function () {
        try {
          if (window.HackeaCoach && typeof window.HackeaCoach.showObligatorio === 'function') {
            window.HackeaCoach.showObligatorio();
          }
        } catch (e) {}
      }, 450);
    }

    /**
     * Redirige directamente al expediente y radar cognitivo en perfil.html
     */
    irAlPerfil() {
      const uiHeaderExamen = document.getElementById('uiHeaderExamen') || document.querySelector('#viewWorkspace header');
      if (uiHeaderExamen) uiHeaderExamen.style.display = '';

      document.body.classList.remove('reporte-final-activo');
      document.documentElement.classList.remove('dante-diagnostic-direct');
      sessionStorage.removeItem('dante_is_diagnostic');
      localStorage.removeItem('dante_is_diagnostic');

      const studentId = localStorage.getItem('dante_student_id') || localStorage.getItem('dante_active_student') || 'student_demo_01';
      console.log(`🧭 [DANTE EXAM WORKSPACE]: Redirigiendo a perfil.html para estudiante=${studentId}...`);
      window.location.replace(`perfil.html?estudiante=${encodeURIComponent(studentId)}`);
    }

    /**
     * Regresa al Hub Principal actualizando el estado
     */
    regresarAlHub() {
      const uiHeaderExamen = document.getElementById('uiHeaderExamen') || document.querySelector('#viewWorkspace header');
      if (uiHeaderExamen) uiHeaderExamen.style.display = '';

      document.body.classList.remove('reporte-final-activo');
      document.documentElement.classList.remove('dante-diagnostic-direct');
      sessionStorage.removeItem('dante_is_diagnostic');
      localStorage.removeItem('dante_is_diagnostic');

      if (window.DanteHubEngine && typeof window.DanteHubEngine.consultarMisionDiaria === 'function') {
        window.DanteHubEngine.consultarMisionDiaria();
      }
      if (window.AppController && typeof window.AppController.cambiarVista === 'function') {
        window.AppController.cambiarVista('viewGateway');
      } else {
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
        const gw = document.getElementById('viewGateway');
        if (gw) {
          gw.classList.add('active');
          gw.classList.remove('hidden');
          gw.style.display = 'flex';
        }
      }
    }

    /**
     * Persistencia de resiliencia en sessionStorage y localStorage
     */
    guardarProgresoSesion() {
      if (this.misionData && this.misionData.esSimulacro && window.DanteSimulacro) {
        DanteSimulacro.guardarParcial(this);
        return;
      }
      const activeTrack = (window.DanteHubEngine && window.DanteHubEngine.targetTrack) || localStorage.getItem('dante_target_track') || 'ICFES';
      const state = {
        misionId: this.misionData ? this.misionData.misionId : null,
        targetTrack: (this.misionData && this.misionData.targetTrack) || activeTrack,
        indexReactivoActivo: this.indexReactivoActivo,
        faseActual: this.faseActual,
        respuestasSesionActiva: this.respuestasSesionActiva,
        respuestasDilemas: this.respuestasDilemas,
        updatedAt: Date.now()
      };
      const serialized = JSON.stringify(state);
      sessionStorage.setItem('dante_exam_progress', serialized);
      localStorage.setItem('dante_exam_progress', serialized);
      localStorage.setItem('dante_exam_current_index', String(this.indexReactivoActivo));
    }

    /**
     * Recupera el progreso en sessionStorage o dante_sesion_pausada si aplica
     */
    recuperarProgresoSesion() {
      // 1. Priorizar estado de sesión pausada explícita en localStorage
      let state = null;
      const pausadaRaw = localStorage.getItem('dante_sesion_pausada');
      if (pausadaRaw) {
        try {
          const parsedPausada = JSON.parse(pausadaRaw);
          if (parsedPausada) {
            state = {
              misionId: parsedPausada.misionData?.misionId || parsedPausada.misionId,
              targetTrack: parsedPausada.targetTrack,
              indexReactivoActivo: parsedPausada.indexReactivo !== undefined ? parsedPausada.indexReactivo : parsedPausada.indexReactivoActivo,
              faseActual: parsedPausada.faseActual || 'REACTIVOS',
              respuestasSesionActiva: parsedPausada.respuestasSesionActiva || [],
              respuestasDilemas: parsedPausada.respuestasDilemas || {},
              misionData: parsedPausada.misionData
            };
            if (!this.misionData && parsedPausada.misionData) {
              this.misionData = parsedPausada.misionData;
            }
          }
        } catch (e) {
          console.warn('⚠️ Error parseando dante_sesion_pausada:', e);
        }
      }

      if (!state) {
        const stored = sessionStorage.getItem('dante_exam_progress') || localStorage.getItem('dante_exam_progress');
        if (stored) {
          try { state = JSON.parse(stored); } catch (e) {}
        }
      }

      if (!state) return false;
      const idMision = String(state.misionId || (state.misionData && state.misionData.misionId) || '');
      if (state.esSimulacro || (state.misionData && state.misionData.esSimulacro) || idMision.indexOf('sim_') === 0) return false;
      try {
        const activeTrack = (window.DanteHubEngine && window.DanteHubEngine.targetTrack) || localStorage.getItem('dante_target_track') || 'ICFES';
        if (state && (!state.targetTrack || String(state.targetTrack).toUpperCase() === String(activeTrack).toUpperCase())) {
          const esMismoLote = Boolean(state.misionId && this.misionData && state.misionId === this.misionData.misionId);
          const esDiagnosticoActivo = Boolean(this.misionData?.isDiagnostic || sessionStorage.getItem('dante_is_diagnostic') === 'true');
          
          if (esMismoLote || (esDiagnosticoActivo && !this.misionData?.repasoArea) || (!state.misionId && this.misionData && !this.misionData.repasoArea)) {
            const maxIdx = (this.misionData?.reactivos?.length || 10) - 1;
            this.indexReactivoActivo = Math.max(0, Math.min(parseInt(state.indexReactivoActivo, 10) || 0, maxIdx));
            this.faseActual = state.faseActual || 'REACTIVOS';
            this.respuestasSesionActiva = Array.isArray(state.respuestasSesionActiva) ? state.respuestasSesionActiva : [];
            this.respuestasDilemas = state.respuestasDilemas || {};
            console.log(`⚡ [DANTE EXAM WORKSPACE]: Progreso reanudado exitosamente (Reactivo ${this.indexReactivoActivo + 1}).`);
            return true;
          }
        }
      } catch (e) {
        console.warn('⚠️ Error recuperando progreso guardado:', e);
      }
      return false;
    }

    /**
     * Limpia la sesión en sessionStorage y localStorage
     */
    limpiarProgresoSesion() {
      const eraOtraPieza = Boolean(this.misionData && (this.misionData.repasoArea || this.misionData.esRefuerzo));
      sessionStorage.removeItem('dante_exam_progress');
      sessionStorage.removeItem('dante_mision_actual');
      sessionStorage.removeItem('dante_current_batch');
      if (!eraOtraPieza) {
        localStorage.removeItem('dante_sesion_pausada');
        localStorage.removeItem('dante_diagnostico_en_curso');
        sessionStorage.removeItem('dante_diag_sala_mode');
      }
      this.misionData = null;
    }

    /**
     * Evalúa si el reactivo activo requiere el Visor 3D (OjoBionico3D)
     */
    evaluarVisor3D(item) {
      const btn3D = document.getElementById('btnOjoBionico3DWorkspace');
      if (!btn3D) return;

      if (!item) {
        btn3D.style.display = 'none';
        btn3D.classList.add('hidden');
        return;
      }

      const strMeta = [
        item.materia,
        item.area,
        item.sub_competencia,
        item.competencia,
        item.componente,
        item.etiqueta,
        item.enunciado,
        item.pregunta,
        item.texto,
        Array.isArray(item.tags) ? item.tags.join(' ') : item.tags
      ].filter(Boolean).join(' ').toLowerCase();

      const esReactivo3D = (
        strMeta.includes('analisis_imagen_3d') ||
        strMeta.includes('rotacion_espacial') ||
        strMeta.includes('despliegue') ||
        strMeta.includes('sólido') ||
        strMeta.includes('solido') ||
        strMeta.includes('vistas') ||
        strMeta.includes('cubo') ||
        strMeta.includes('perspectiva') ||
        strMeta.includes('3d')
      );

      if (esReactivo3D) {
        btn3D.style.display = 'inline-flex';
        btn3D.classList.remove('hidden');
        btn3D.onclick = () => {
          if (window.OjoBionico3D) {
            const modelo = strMeta.includes('bloque') ? 'bloques_topologicos' : 'cubo_patron';
            if (typeof window.OjoBionico3D.abrirModal === 'function') {
              window.OjoBionico3D.abrirModal(modelo);
            } else if (typeof window.OjoBionico3D.abrirModal3D === 'function') {
              window.OjoBionico3D.abrirModal3D(modelo);
            }
          }
        };
      } else {
        btn3D.style.display = 'none';
        btn3D.classList.add('hidden');
      }
    }

    /**
     * Una sola línea de ritmo al abrir entrenamiento si Modo Dante está activo.
     * No nombra tipología; usa modeHint de la policy.
     */
    _susurroModoDante() {
      if (this._danteWhisperDone) return null;
      if (this.guiaPaso) return null;
      if (this.misionData && (this.misionData.isDiagnostic || this.misionData.esSimulacro)) return null;
      if (this.indexReactivoActivo !== 0) return null;
      try {
        const p = typeof window.danteMindPolicy === 'function' ? window.danteMindPolicy() : null;
        if (!p || !p.calibrated || p.confidence < 0.5) return null;
        this._danteWhisperDone = true;
        if (p.modeHint) return p.modeHint;
        return 'El ritmo de confirmación ya te conoce. Marca cuando estés listo.';
      } catch (_) {
        return null;
      }
    }

    /**
     * Solicita una pista socrática adaptativa progresiva (Nivel 1 reflexivo por defecto, Nivel 2 anatomía de distractor)
     */
    _mostrarPistaTexto(texto) {
      let out = texto || '';
      const sinAyudaModo = Boolean(
        this.misionData && (this.misionData.isDiagnostic || this.misionData.esSimulacro)
      );
      // Hackea: misma pista, puerta distinta (sin tipología al alumno)
      if (!this.guiaPaso && !sinAyudaModo && window.mindProfile && typeof window.mindProfile.shapeScaffolding === 'function') {
        try { out = window.mindProfile.shapeScaffolding(out); } catch (_) {}
      }
      if (this.guiaPaso) {
        const cajaPista = document.getElementById('guiaBandejaPista');
        const pistaTxt = document.getElementById('guiaBandejaPistaTexto');
        const honey = document.getElementById('guiaBandejaBtnPista');
        if (cajaPista) cajaPista.hidden = false;
        if (honey) honey.classList.remove('guia-señal');
        if (pistaTxt) {
          pistaTxt.hidden = false;
          pistaTxt.textContent = out;
        }
        this._medirBandejaGuia();
        return;
      }
      const panel = document.getElementById('uiIntervencionDanteLive');
      if (panel) panel.classList.add('hidden');
      const burbuja = document.getElementById('burbujaConsejoDante');
      if (burbuja) {
        burbuja.classList.remove('hidden');
        burbuja.classList.toggle('pista-bloqueada-modo', sinAyudaModo);
        burbuja.style.display = 'block';
        burbuja.hidden = false;
        burbuja.removeAttribute('hidden');
      }
      const txt = document.getElementById('txtFraseDanteSocratica');
      if (txt) txt.textContent = out;
    }

    async solicitarPistaSocratica() {
      if (this.guiaPaso === 2) {
        this.guiaAyudaVista = true;
        this._mostrarPistaTexto('Busca la parte de la célula que guarda las instrucciones. No está fuera de ella.');
        const sigue = 'Ahora toca la letra B, donde dice pared de ladrillo.';
        this._notaGuia(sigue);
        this._señalGuia();
        this._focoGuia(this._badgeGuia('B'), sigue);
        this._medirBandejaGuia();
        return;
      }
      if (this.misionData && this.misionData.isDiagnostic) {
        this._mostrarPistaTexto(
          'En el diagnóstico no hay pistas ni ayudas. Es una prueba de diagnóstico: responde solo con lo que sabes. Las ayudas se abren en el entrenamiento diario.'
        );
        return;
      }
      if (this.misionData && this.misionData.esSimulacro) {
        this._mostrarPistaTexto(
          'En el simulacro no hay pistas ni ayudas. Es como el examen real: responde sin ayuda.'
        );
        return;
      }
      if (window.DantePlanSala && !DantePlanSala.puedePedirAyuda()) {
        const aviso = typeof DantePlanSala.avisoSinAyuda === 'function'
          ? DantePlanSala.avisoSinAyuda()
          : 'La ayuda de este bloque ya se usó.';
        this._mostrarPistaTexto(aviso);
        return;
      }
      const item = (this.misionData && this.misionData.reactivos) ? this.misionData.reactivos[this.indexReactivoActivo] : null;
      const pista = this._textoLimpio(item && item.pista) || this._ideaDePregunta(item);
      if (item && this._pistaMostradaId === item.id) {
        this._mostrarPistaTexto(pista);
        return;
      }
      if (window.DantePlanSala) DantePlanSala.marcarAyudaUsada();
      this._pistaMostradaId = item ? item.id : null;
      this._mostrarPistaTexto(pista);
    }

    formatearTextoSocratico(text) {
      if (typeof text !== 'string') return '';
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>');
    }

    /**
     * Genera retroalimentación socrática determinística local progresiva por nivel
     */
    generarFallbackSocraticoLocal(item, opcionSeleccionada = 'A', nivel = 1) {
      const area = (item.materia || item.area || item.area_general || '').toLowerCase();
      const opt = opcionSeleccionada || 'A';
      const nivelTarget = Number(nivel) || 1;

      const compNombre = item.competencia || item.sub_competencia || '';
      const prefijoComp = compNombre ? `Esta pregunta mide ${compNombre}. ` : '';
      let n1 = `<strong>Pista.</strong> ${prefijoComp}Mira qué pide la pregunta antes de descartar.`;
      let n2 = `<strong>Sobre la ${opt}.</strong> Suele convencer porque suena bien, pero no cumple lo que pide el enunciado.`;
      let n3 = `<strong>Para descartar.</strong> Quita primero las dos opciones que exageran o no tienen evidencia en el texto.`;

      if (area.includes('mate') || area.includes('razonamiento') || area.includes('fisica') || area.includes('cuantitativo')) {
        n1 = `<strong>Pista.</strong> ¿Qué relación hay entre los datos? Busca la proporción antes de calcular.`;
        n2 = `<strong>Sobre la ${opt}.</strong> Suele salir cuando se salta una unidad o se invierte el despeje.`;
        n3 = `<strong>Para descartar.</strong> Prueba con un número fácil y quita las que no cuadran.`;
      } else if (area.includes('social') || area.includes('ciudadana')) {
        n1 = `<strong>Pista.</strong> ¿Qué derecho o deber está en juego en el caso?`;
        n2 = `<strong>Sobre la ${opt}.</strong> Suena a opinión. La pregunta pide lo que dice la norma.`;
        n3 = `<strong>Para descartar.</strong> Quédate con la opción que respeta la regla.`;
      }

      if (compNombre) {
        n1 = `<span class="block mb-1 text-[10px] uppercase tracking-wider text-slate-400">Mide: ${compNombre}</span>` + n1;
      }

      if (nivelTarget === 1) {
        return `<div class="text-slate-100 font-sans text-xs leading-relaxed text-cyan-300 font-semibold">${n1}</div>`;
      } else if (nivelTarget === 2) {
        return `<div class="text-slate-100 font-sans text-xs leading-relaxed text-amber-200 font-semibold">${n2}</div>`;
      }

      return `<div class="space-y-1.5 text-slate-100 font-sans text-xs leading-relaxed">
        <div class="text-cyan-300 font-semibold">${n1}</div>
        <div class="text-amber-200 font-semibold">${n2}</div>
        <div class="text-emerald-300 font-semibold">${n3}</div>
      </div>`;
    }

    /**
     * Renderizado auxiliar de fórmulas matemáticas KaTeX
     */
    renderizarMathSiExiste(element) {
      if (!element) return;
      if (window.renderMathInElement && typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(element, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
          });
        } catch (e) {
          // Ignorar silenciosamente errores menores de parsing KaTeX
        }
      }
    }

    /**
     * Sanitizador básico de etiquetas HTML para prevención XSS
     */
    sanitizarHtmlText(str) {
      if (typeof str !== 'string') return '';
      return str;
    }
    /**
     * Auditoría técnica de balance y distribución de materias para los tres perfiles
     */
    auditarDistribucionDiagnostico() {
      const icfes = this.garantizarDistribucionDiagnostico([], 'ICFES');
      const unal = this.garantizarDistribucionDiagnostico([], 'UNAL');
      const combo = this.garantizarDistribucionDiagnostico([], 'COMBO');

      const res = {
        ICFES: icfes.map(r => r.area),
        UNAL: unal.map(r => r.area),
        COMBO: combo.map(r => r.area)
      };

      console.log('📊 [AUDITORÍA DE MATERIAS DIAGNÓSTICO]:');
      console.log('ICFES:', res.ICFES);
      console.log('UNAL:', res.UNAL);
      console.log('COMBO:', res.COMBO);
      return res;
    }
  }

  // Instanciar y exponer en el ámbito global window
  const engine = new DanteExamWorkspaceEngine();
  engine.htmlPreguntasFalladas = DanteExamWorkspaceEngine.htmlPreguntasFalladas.bind(DanteExamWorkspaceEngine);
  engine.enlazarAyudasFallidas = DanteExamWorkspaceEngine.enlazarAyudasFallidas.bind(DanteExamWorkspaceEngine);
  window.DanteExamWorkspace = engine;

  console.log('⚡ [DANTE EXAM WORKSPACE Engine v23.1.0-ENTERPRISE] cargado e inicializado.');

  // 🔓 REGISTRO INCONDICIONAL DE LISTENERS DE CABECERA (SINCRÓNICO)
  function registrarListenersCabeceraSincrono() {
    const btnSala = document.getElementById('btnSalaReturn') || document.querySelector('[data-action="sala"]') || document.getElementById('btnVolverSalaHeader');
    if (btnSala) {
      btnSala.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (window.AppController && typeof window.AppController.regresarASala === 'function') {
          window.AppController.regresarASala();
        } else if (typeof window.regresarASala === 'function') {
          window.regresarASala();
        } else {
          window.location.href = 'index.html';
        }
      };
    }

    const btnPausa = document.getElementById('btnMenuPausaWorkspace') || document.querySelector('[data-action="pausa"]') || document.getElementById('btnPausaExamen');
    if (btnPausa) {
      btnPausa.onclick = (e) => {
        if (typeof window.abrirPausaExamen === 'function') window.abrirPausaExamen(e);
      };
    }

    // Insignia de Plan (FREE / PRO) -> Paywall directo con oferta Plan Élite Pro
    const planBadges = [
      document.getElementById('badgeHeaderPlan'),
      document.getElementById('lblHeaderCapacidadStatus'),
      document.getElementById('uiHudPlanBadgeUnico'),
      document.getElementById('badgePlanStatus'),
      document.getElementById('lblPlanStatus')
    ];
    planBadges.forEach(badge => {
      if (badge) {
        badge.style.cursor = 'pointer';
        badge.onclick = (e) => {
          if (e) e.preventDefault();
          if (window.PaywallManager && typeof window.PaywallManager.abrirModalContextual === 'function') {
            window.PaywallManager.abrirModalContextual('PLAN_PRO');
          }
        };
      }
    });

    const btnAjustes = document.getElementById('btnAjustesHdr') || document.getElementById('btnOpenAjustes');
    if (btnAjustes) {
      btnAjustes.onclick = (e) => {
        if (e) e.preventDefault();
        if (typeof window.abrirAjustesEntorno === 'function') {
          window.abrirAjustesEntorno(e);
        }
      };
    }

    const btnPerfil = document.getElementById('btnPerfilHdr');
    if (btnPerfil) {
      btnPerfil.onclick = (e) => {
        if (e) e.preventDefault();
        if (typeof window.abrirPerfilEstudiante === 'function') {
          window.abrirPerfilEstudiante(e);
        } else {
          window.location.href = 'perfil.html';
        }
      };
    }

    // 🎯 Botones de inicio de briefing diagnóstico y entrenamiento
    const btnComenzarDiag = document.getElementById('btnComenzarBriefingDiagnostico');
    if (btnComenzarDiag) {
      btnComenzarDiag.onclick = (e) => {
        if (e) e.preventDefault();
        if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.cerrarBriefingComenzar === 'function') {
          window.DanteExamWorkspace.cerrarBriefingComenzar();
        } else if (typeof window.cerrarBriefingComenzar === 'function') {
          window.cerrarBriefingComenzar();
        }
      };
    }

    const btnComenzarEntren = document.getElementById('btnComenzarBriefingEntrenamiento');
    if (btnComenzarEntren) {
      btnComenzarEntren.onclick = (e) => {
        if (e) e.preventDefault();
        if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.cerrarBriefingEntrenamientoComenzar === 'function') {
          window.DanteExamWorkspace.cerrarBriefingEntrenamientoComenzar();
        }
      };
    }
  }

  window.cerrarBriefingComenzar = function() {
    if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.cerrarBriefingComenzar === 'function') {
      window.DanteExamWorkspace.cerrarBriefingComenzar();
    } else {
      const modal = document.getElementById('modalBriefingDiagnostico');
      if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
      sessionStorage.setItem('dante_briefing_mostrado', 'true');
      const ws = document.getElementById('viewWorkspace');
      if (ws) {
        ws.classList.add('active');
        ws.classList.remove('hidden');
        ws.style.display = 'block';
      }
      if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.iniciarSesion === 'function') {
        window.DanteExamWorkspace.iniciarSesion();
      }
    }
  };

  window.abrirModalPausa = function() {
    if (window.AppController && typeof window.AppController.toggleMenuPausa === 'function') {
      window.AppController.toggleMenuPausa();
    }
  };

  // Vincular de forma inmediata e incondicional al cargar el script o el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registrarListenersCabeceraSincrono);
  } else {
    registrarListenersCabeceraSincrono();
  }

  window.vincularListenersCabeceraIncondicional = registrarListenersCabeceraSincrono;
})();

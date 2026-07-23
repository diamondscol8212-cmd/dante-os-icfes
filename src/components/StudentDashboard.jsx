// src/components/StudentDashboard.jsx - Interfaz Adaptativa & Reporte Final Dante OS v21.1.0
import React, { useState, useEffect, useRef } from 'react';
import { useTwin } from '../context/TwinContext';

export const StudentDashboard = ({ studentId: propStudentId, areaInicial = 'matematicas' }) => {
  const { gemelo, sincronizarGemelo } = useTwin();

  // Contexto de Usuario / Sesión
  const [studentId, setStudentId] = useState(propStudentId || 'viviana');
  const [sessionId] = useState(`session_react_${Date.now()}`);
  const [materia, setMateria] = useState(areaInicial);
  const [institutionId] = useState('colegio_sandbox_default');

  // Estados del Motor Adaptativo (Fases: 'WORKSPACE' | 'METACOGNITION' | 'FEEDBACK' | 'DASHBOARD' | 'FINAL_REPORT')
  const [faseActual, setFaseActual] = useState('WORKSPACE');
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [historialSeleccion, setHistorialSeleccion] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Telemetría & IRT
  const [theta, setTheta] = useState(0.0);
  const [historialTheta, setHistorialTheta] = useState([0.0]);
  const [bayesianSEM, setBayesianSEM] = useState(0.5);
  const [tiempoInicioReactivo, setTiempoInicioReactivo] = useState(0);
  const [telemetriaUltima, setTelemetriaUltima] = useState({ tiempoTotal: 0, cambios: 0, certeza: '' });
  const [andamiajeForense, setAndamiajeForense] = useState(null);
  const [esSegundoIntento, setEsSegundoIntento] = useState(false);
  const [reporteFinal, setReporteFinal] = useState(null);

  // Reloj regresivo (45 min)
  const [tiempoRestante, setTiempoRestante] = useState(2700);

  useEffect(() => {
    const rawUser = localStorage.getItem('dante_user');
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u.email) setStudentId(u.email.split('@')[0].toLowerCase().trim());
      } catch (e) {}
    }
  }, []);

  // Timer
  useEffect(() => {
    if (tiempoRestante <= 0) return;
    const timer = setInterval(() => setTiempoRestante((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  // Carga Inicial del Diagnóstico
  useEffect(() => {
    iniciarExamenAdaptativo();
  }, [materia]);

  const iniciarExamenAdaptativo = async () => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('dante_token');
      const res = await fetch('/api/cat/interactuar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          sessionId,
          areaGeneral: materia,
          itemId: null,
          institution_id: institutionId
        })
      });

      const data = await res.json();
      if (data.success) {
        procesarRespuestaMotor(data);
      } else {
        throw new Error(data.error || 'Error al conectar con Dante Gateway');
      }
    } catch (err) {
      console.error(err);
      setError('Cortocircuito de conexión con la pasarela Dante OS.');
    } finally {
      setCargando(false);
    }
  };

  const procesarRespuestaMotor = (data) => {
    if (data.detenerExamen) {
      setReporteFinal(data.reporteFinal || data);
      setFaseActual('FINAL_REPORT');
      return;
    }

    const nTheta = data.thetaProgreso !== undefined ? data.thetaProgreso : (data.theta || 0.0);
    setTheta(nTheta);
    setBayesianSEM(data.bayesianSEMProgreso || data.bayesianSEM || 0.5);
    setPreguntaActual(data.item);
    setTiempoInicioReactivo(performance.now());
    setHistorialSeleccion([]);
    setOpcionSeleccionada('');
    setEsSegundoIntento(false);
    setFaseActual('WORKSPACE');
  };

  const handleSeleccionarOpcion = (letra) => {
    setOpcionSeleccionada(letra);
    setHistorialSeleccion((prev) => [...prev, { option: letra, timestamp: new Date().toISOString() }]);
  };

  const handleAbrirMetacognicion = () => {
    if (!opcionSeleccionada) return;
    setFaseActual('METACOGNITION');
  };

  const handleConfirmarMetacognicion = async (nivelCerteza) => {
    setCargando(true);
    const duracionSegundos = parseFloat(((performance.now() - tiempoInicioReactivo) / 1000).toFixed(2));
    
    setTelemetriaUltima({
      tiempoTotal: duracionSegundos,
      cambios: Math.max(0, historialSeleccion.length - 1),
      certeza: nivelCerteza
    });

    try {
      const token = localStorage.getItem('dante_token');
      const payload = {
        studentId,
        sessionId,
        itemId: String(preguntaActual.id),
        areaGeneral: materia,
        responseTime: duracionSegundos,
        declaredConfidence: nivelCerteza,
        selectionVector: historialSeleccion,
        institution_id: institutionId
      };

      const res = await fetch('/api/cat/interactuar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setHistorialTheta((prev) => [...prev, data.thetaProgreso !== undefined ? data.thetaProgreso : theta]);

      if (data.detenerExamen) {
        setReporteFinal(data.reporteFinal || data);
        setFaseActual('FINAL_REPORT');
        return;
      }

      // Pista o Andamiaje Pedagogico
      if (!data.interaccionCorrecta) {
        setAndamiajeForense(data.andamiajeForense);
        if (!esSegundoIntento) {
          setEsSegundoIntento(true);
          setFaseActual('FEEDBACK_RETRY');
          setCargando(false);
          return;
        }
      }

      if (data.interaccionCorrecta) {
        setFaseActual('DASHBOARD');
        setAndamiajeForense(null);
      } else {
        setFaseActual('FEEDBACK');
      }

      // Sincronizar Gemelo Digital
      if (sincronizarGemelo) sincronizarGemelo(studentId);
    } catch (err) {
      alert('Error en transmisión: ' + err.message);
      setFaseActual('WORKSPACE');
    } finally {
      setCargando(false);
    }
  };

  const formatearTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (cargando && !preguntaActual && faseActual !== 'FINAL_REPORT') {
    return <div style={styles.centerContainer}>📡 Sincronizando modelo psicométrico con Dante OS...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>🚨 {error}</div>;
  }

  const tieneRecursoVisual = Boolean(preguntaActual?.recurso_visual || preguntaActual?.imagen_url);

  return (
    <div style={styles.dashboardCard}>
      {/* HEADER GLOBAL */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>DANTE OS // SUITE ADAPTATIVA</h2>
          <p style={styles.subtitle}>ESTUDIANTE: {studentId.toUpperCase()} | MÓDULO: {materia.toUpperCase()}</p>
        </div>
        <div style={styles.timerBadge}>⏱️ {formatearTiempo(tiempoRestante)}</div>
      </header>

      {/* 🟢 VISTA 1: CUADERNILLO DE PREGUNTA (WORKSPACE) */}
      {(faseActual === 'WORKSPACE' || faseActual === 'METACOGNITION' || faseActual === 'FEEDBACK_RETRY' || faseActual === 'FEEDBACK') && preguntaActual && (
        <div style={styles.workspaceGrid(tieneRecursoVisual)}>
          
          {/* Panel Izquierdo: Gráfico/Estímulo Contextual */}
          {tieneRecursoVisual && (
            <div style={styles.visualCard}>
              <span style={styles.sectionTag}>ESTÍMULO VISUAL / TABLA</span>
              {preguntaActual.recurso_visual && preguntaActual.recurso_visual.startsWith('data:image/svg+xml') ? (
                <img src={preguntaActual.recurso_visual} alt="Recurso SVG" style={styles.visualImg} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: preguntaActual.recurso_visual || preguntaActual.imagen_url }} />
              )}
            </div>
          )}

          {/* Panel Derecho: Pregunta y Opciones */}
          <div style={styles.questionCard}>
            <div style={styles.subTag}>SUBCOMPETENCIA: {preguntaActual.sub_competencia || 'GENERAL'}</div>
            <p style={styles.preguntaTexto}>{preguntaActual.pregunta_texto || preguntaActual.texto}</p>

            <div style={styles.opcionesStack}>
              {(preguntaActual.opciones_respuesta || preguntaActual.opciones || []).map((opc, idx) => {
                const letra = ['A', 'B', 'C', 'D'][idx];
                const estaSeleccionada = opcionSeleccionada === letra;

                return (
                  <button
                    key={idx}
                    disabled={faseActual !== 'WORKSPACE'}
                    onClick={() => handleSeleccionarOpcion(letra)}
                    style={{
                      ...styles.opcionBtn,
                      ...(estaSeleccionada ? styles.opcionBtnSelected : {})
                    }}
                  >
                    <span style={styles.opcionBadge}>{letra}</span>
                    <span style={{ flex: 1 }}>{opc}</span>
                  </button>
                );
              })}
            </div>

            {/* Acciones por Fase */}
            {faseActual === 'WORKSPACE' && (
              <div style={styles.accionesRow}>
                <button
                  disabled={!opcionSeleccionada}
                  onClick={handleAbrirMetacognicion}
                  style={{ ...styles.btnGold, ...(!opcionSeleccionada ? styles.btnDisabled : {}) }}
                >
                  Confirmar Elección ➔
                </button>
              </div>
            )}

            {/* Fase Metacognitiva */}
            {faseActual === 'METACOGNITION' && (
              <div style={styles.metaBox}>
                <p style={styles.metaTitle}>¿Qué tan seguro estás de tu proceso de resolución?</p>
                <div style={styles.metaGrid}>
                  <button style={styles.btnMeta} onClick={() => handleConfirmarMetacognicion('alta')}>Certeza Absoluta</button>
                  <button style={styles.btnMeta} onClick={() => handleConfirmarMetacognicion('media')}>Dudoso</button>
                  <button style={styles.btnMeta} onClick={() => handleConfirmarMetacognicion('baja')}>Adiviné</button>
                </div>
              </div>
            )}

            {/* Pista de Segundo Intento */}
            {faseActual === 'FEEDBACK_RETRY' && (
              <div style={styles.retryBox}>
                <div style={styles.retryHeader}>🔍 SEGUNDO INTENTO ACTIVADO</div>
                <p style={styles.retryTxt}>La opción seleccionada contiene una inconsistencia. Revisa la lógica sugerida:</p>
                <div style={styles.pistaCaja}>
                  💡 {andamiajeForense?.remediacionSugerida || 'Analiza de nuevo los conectores o variables.'}
                </div>
                <button style={styles.btnGold} onClick={() => setFaseActual('WORKSPACE')}>
                  🔄 Intentar de Nuevo
                </button>
              </div>
            )}

            {/* Feedback Definitivo */}
            {faseActual === 'FEEDBACK' && (
              <div style={styles.feedbackBox}>
                <div style={styles.feedbackHeader}>Análisis de Desviación Cognitiva</div>
                <p style={{ color: '#ef4444', fontSize: '13px', margin: '5px 0' }}>
                  <strong>Sesgo Detectado:</strong> {andamiajeForense?.errorDetonado || 'Inconsistencia de Proceso'}
                </p>
                <p style={{ color: '#d4d4d8', fontSize: '13px' }}>
                  <strong>Remediación:</strong> {andamiajeForense?.remediacionSugerida || 'Aplica escaneo analítico.'}
                </p>
                <button style={{ ...styles.btnGold, marginTop: '15px' }} onClick={() => setFaseActual('DASHBOARD')}>
                  Continuar a Métricas ➡️
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🟡 VISTA 2: DASHBOARD INTERMEDIO DE TRANSICIÓN */}
      {faseActual === 'DASHBOARD' && (
        <div style={styles.metricsContainer}>
          <h3 style={styles.metricsTitle}>MÉTRICAS LONGITUDINALES (DANTE OS)</h3>
          <p style={styles.metricsSubtitle}>Modelado Conductual y Trayectoria de Habilidad</p>

          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Tiempo Reactivo</span>
              <strong style={styles.kpiVal}>{telemetriaUltima.tiempoTotal}s</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Vacilación Real</span>
              <strong style={styles.kpiVal}>{telemetriaUltima.cambios} cambios</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Certeza Declarada</span>
              <strong style={{ ...styles.kpiVal, color: '#fbbf24' }}>{telemetriaUltima.certeza.toUpperCase()}</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Habilidad Latente (θ)</span>
              <strong style={{ ...styles.kpiVal, color: '#38bdf8' }}>{theta.toFixed(4)}</strong>
            </div>
          </div>

          <div style={styles.accionesRow}>
            <button style={styles.btnGold} onClick={iniciarExamenAdaptativo}>
              Siguiente Reactivo Adaptativo ➡️
            </button>
          </div>
        </div>
      )}

      {/* 🔴 VISTA 3: REPORTE FINAL DE CLAUSURA DEL PRIMER DIAGNÓSTICO */}
      {faseActual === 'FINAL_REPORT' && (
        <div style={styles.finalReportContainer}>
          <h2 style={styles.reportTitle}>Perfil de Adaptación Humana</h2>
          <p style={styles.reportSub}>Códice del ADN Cognitivo Vivo // Trazabilidad Diagnóstica Final</p>

          <div style={styles.bannerAlert}>
            ⚡ <strong>EVALUACIÓN ADAPTATIVA COMPLETADA (CAT):</strong> El motor psicométrico de Dante OS ha alcanzado la precisión estadística requerida (SEM &lt; 0.40).
          </div>

          <div style={styles.kpiGrid}>
            <div style={styles.kpiCardHighlight}>
              <span style={styles.kpiLabel}>PUNTACIÓN ICFES ESTIMADA</span>
              <strong style={styles.kpiValBig}>
                {reporteFinal?.escalonamiento_pais?.puntaje_icfes_area || Math.max(1, Math.min(100, Math.round(50 + theta * 13.8)))} / 100
              </strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Índice θ Final (EAP)</span>
              <strong style={{ ...styles.kpiVal, color: '#fbbf24' }}>{theta.toFixed(4)}</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Precisión Bayesiana (SEM)</span>
              <strong style={{ ...styles.kpiVal, color: '#38bdf8' }}>±{bayesianSEM.toFixed(4)}</strong>
            </div>
          </div>

          {/* ADN Cognitivo */}
          <div style={styles.narrativeCard}>
            <h4 style={styles.narrativeHeader}>Crónica de ADN Cognitivo de {studentId.toUpperCase()}</h4>
            <p style={styles.narrativeBody}>
              {reporteFinal?.adn_cognitivo?.cronica_narrativa || 'Tu trayectoria adaptativa ha sido consolidada en Supabase con éxito.'}
            </p>
          </div>

          <div style={styles.btnGridRow}>
            <button style={styles.btnGold} onClick={() => window.location.reload()}>
              🔄 Iniciar Nuevo Simulacro
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// 🎨 Estilos CSS-in-JS Modo Oscuro
const styles = {
  dashboardCard: {
    background: '#09090b',
    color: '#f4f4f5',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #27272a',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1000px',
    margin: '20px auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #27272a',
    paddingBottom: '12px'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    background: 'linear-gradient(to right, #fbbf24, #fef08a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800'
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#a1a1aa',
    fontFamily: 'monospace'
  },
  timerBadge: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#fbbf24',
    fontWeight: 'bold'
  },
  workspaceGrid: (hasVisual) => ({
    display: 'grid',
    gridTemplateColumns: hasVisual ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
    gap: '24px'
  }),
  visualCard: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  },
  visualImg: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px'
  },
  sectionTag: {
    fontSize: '10px',
    color: '#71717a',
    fontFamily: 'monospace',
    display: 'block',
    marginBottom: '10px'
  },
  questionCard: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '24px'
  },
  subTag: {
    fontSize: '11px',
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  preguntaTexto: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#f4f4f5',
    marginBottom: '20px'
  },
  opcionesStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  opcionBtn: {
    display: 'flex',
    alignItems: 'center',
    background: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '10px',
    padding: '14px',
    color: '#e4e4e7',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  opcionBtnSelected: {
    borderColor: '#fbbf24',
    background: 'rgba(251, 191, 36, 0.1)',
    color: '#fff',
    boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)'
  },
  opcionBadge: {
    background: '#27272a',
    color: '#fbbf24',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontWeight: 'bold',
    marginRight: '12px',
    fontFamily: 'monospace'
  },
  accionesRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  btnGold: {
    background: 'linear-gradient(to right, #f59e0b, #d97706)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  metaBox: {
    marginTop: '20px',
    padding: '16px',
    background: '#09090b',
    border: '1px solid #fbbf24',
    borderRadius: '10px',
    textAlign: 'center'
  },
  metaTitle: {
    fontSize: '13px',
    color: '#fbbf24',
    marginBottom: '12px',
    fontWeight: 'bold'
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px'
  },
  btnMeta: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    color: '#f4f4f5',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'monospace'
  },
  retryBox: {
    marginTop: '20px',
    padding: '16px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid #fbbf24',
    borderRadius: '10px'
  },
  retryHeader: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '6px',
    fontFamily: 'monospace'
  },
  retryTxt: {
    fontSize: '13px',
    color: '#a1a1aa'
  },
  pistaCaja: {
    background: '#09090b',
    borderLeft: '4px solid #fbbf24',
    padding: '10px',
    fontSize: '12px',
    margin: '12px 0',
    borderRadius: '4px'
  },
  feedbackBox: {
    marginTop: '20px',
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid #ef4444',
    borderRadius: '10px'
  },
  feedbackHeader: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: '13px',
    fontFamily: 'monospace'
  },
  metricsContainer: {
    background: '#18181b',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #27272a',
    textAlign: 'center'
  },
  metricsTitle: {
    color: '#fbbf24',
    fontSize: '16px',
    margin: 0,
    fontWeight: 'bold'
  },
  metricsSubtitle: {
    color: '#71717a',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginBottom: '20px'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    margin: '20px 0'
  },
  kpiCard: {
    background: '#09090b',
    border: '1px solid #27272a',
    padding: '12px',
    borderRadius: '8px'
  },
  kpiCardHighlight: {
    background: '#09090b',
    border: '1px solid #22c55e',
    padding: '12px',
    borderRadius: '8px',
    gridColumn: '1 / -1'
  },
  kpiLabel: {
    fontSize: '10px',
    color: '#a1a1aa',
    display: 'block',
    fontFamily: 'monospace'
  },
  kpiVal: {
    fontSize: '15px',
    color: '#fff',
    fontFamily: 'monospace',
    marginTop: '4px',
    display: 'block'
  },
  kpiValBig: {
    fontSize: '28px',
    color: '#22c55e',
    fontFamily: 'monospace',
    display: 'block',
    marginTop: '4px'
  },
  finalReportContainer: {
    background: '#18181b',
    padding: '28px',
    borderRadius: '12px',
    border: '1px solid #27272a',
    textAlign: 'center'
  },
  reportTitle: {
    color: '#fbbf24',
    fontSize: '22px',
    margin: 0
  },
  reportSub: {
    color: '#71717a',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginBottom: '20px'
  },
  bannerAlert: {
    background: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid #38bdf8',
    color: '#e0f2fe',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    textAlign: 'left',
    marginBottom: '20px'
  },
  narrativeCard: {
    background: '#09090b',
    borderLeft: '4px solid #fbbf24',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'left',
    margin: '20px 0'
  },
  narrativeHeader: {
    color: '#fbbf24',
    fontSize: '13px',
    margin: '0 0 8px 0',
    fontFamily: 'monospace'
  },
  narrativeBody: {
    fontSize: '13px',
    color: '#d4d4d8',
    lineHeight: '1.6',
    margin: 0
  },
  btnGridRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  centerContainer: {
    color: '#a1a1aa',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '40px'
  },
  errorContainer: {
    color: '#ef4444',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '20px'
  }
};

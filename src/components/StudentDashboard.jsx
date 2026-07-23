// src/components/StudentDashboard.jsx - Interfaz Adaptativa Dinámica Dante OS
import React, { useState, useEffect } from 'react';
import { useTwin } from '../context/TwinContext';

export const StudentDashboard = ({ studentId, areaInicial = 'matematicas' }) => {
  const { gemelo, loading: loadingTwin, error: errorTwin, sincronizarGemelo } = useTwin();

  // Estados del Simulacro
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [cargandoPregunta, setCargandoPregunta] = useState(true);
  const [errorPregunta, setErrorPregunta] = useState(null);
  const [numeroPregunta, setNumeroPregunta] = useState(1);
  const [tiempoRestante, setTiempoRestante] = useState(2700); // 45 minutos

  // Sincronización inicial
  useEffect(() => {
    if (studentId) sincronizarGemelo(studentId);
  }, [studentId, sincronizarGemelo]);

  // Reloj regresivo
  useEffect(() => {
    if (tiempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  // Carga inicial de reactivo
  useEffect(() => {
    obtenerSiguientePregunta();
  }, []);

  const obtenerSiguientePregunta = async (respuestaPrevia = null) => {
    setCargandoPregunta(true);
    setErrorPregunta(null);

    try {
      const payload = {
        studentId: studentId || 'estudiante_demo',
        area: areaInicial,
        respuesta: respuestaPrevia
      };

      const res = await fetch('/api/cat/interactuar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error de servidor');

      const data = await res.json();

      if (data.pregunta) {
        setPreguntaActual(data.pregunta);
      } else {
        setErrorPregunta('No hay más reactivos disponibles.');
      }
    } catch (err) {
      console.error(err);
      setErrorPregunta('Error al conectar con Dante OS.');
    } finally {
      setCargandoPregunta(false);
      setOpcionSeleccionada('');
    }
  };

  const handleEnviarRespuesta = () => {
    if (!opcionSeleccionada) return;

    const letraRespuesta = opcionSeleccionada.charAt(0);
    setNumeroPregunta((prev) => prev + 1);

    if (studentId) sincronizarGemelo(studentId);
    obtenerSiguientePregunta({
      itemId: preguntaActual.id,
      opcion: letraRespuesta
    });
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  if (loadingTwin && !gemelo) {
    return <div style={styles.loading}>📡 Sincronizando con Dante OS Gateway...</div>;
  }

  if (errorTwin) {
    return <div style={styles.errorContainer}>🚨 Error perimetral: {errorTwin}</div>;
  }

  const escalonamiento = gemelo?.escalonamiento_icfes || { puntaje_estimado: 250, margen_error: 15, intervalo_95: [235, 265] };
  const tieneRecursoVisual = Boolean(preguntaActual?.recurso_visual || preguntaActual?.estimulo_texto);

  return (
    <div style={styles.dashboardContainer}>
      {/* 1. HEADER & RELEVO */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>DANTE OS // ENGINE CAT</h2>
          <p style={styles.subtitle}>ESTUDIANTE: {studentId || 'VIVIANA'}</p>
        </div>
        <div style={styles.timerBadge}>⏱️ {formatearTiempo(tiempoRestante)}</div>
      </header>

      {/* 2. TERMÓMETRO BAYESIANO */}
      <div style={styles.termometroCard}>
        <div style={styles.termometroHeader}>
          <span style={styles.termometroTitle}>Termómetro de Certeza Bayesian</span>
          <span style={styles.margenText}>±{escalonamiento.margen_error} Puntos</span>
        </div>

        <div style={styles.barraContenedor}>
          <div
            style={{
              ...styles.intervaloRango,
              left: `${(escalonamiento.intervalo_95[0] / 500) * 100}%`,
              width: `${((escalonamiento.intervalo_95[1] - escalonamiento.intervalo_95[0]) / 500) * 100}%`
            }}
          />
          <div
            style={{
              ...styles.marcadorPuntaje,
              left: `${(escalonamiento.puntaje_estimado / 500) * 100}%`
            }}
          />
        </div>

        <div style={styles.metricasGrid}>
          <div style={styles.metricaBox}>
            <span style={styles.metricaLabel}>Mínimo</span>
            <strong style={styles.metricaVal}>{escalonamiento.intervalo_95[0]}</strong>
          </div>
          <div style={styles.metricaBoxHighlight}>
            <span style={styles.metricaLabel}>Puntaje Estimado</span>
            <strong style={styles.metricaValHighlight}>{escalonamiento.puntaje_estimado} / 500</strong>
          </div>
          <div style={styles.metricaBox}>
            <span style={styles.metricaLabel}>Máximo</span>
            <strong style={styles.metricaVal}>{escalonamiento.intervalo_95[1]}</strong>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE PROGRESO */}
      <div style={styles.progresoContenedor}>
        <div style={styles.progresoHeader}>
          <span>Reactivo #{numeroPregunta}</span>
          <span>Módulo: {areaInicial.toUpperCase()}</span>
        </div>
        <div style={styles.progresoTrack}>
          <div style={{ ...styles.progresoFill, width: `${Math.min((numeroPregunta / 30) * 100, 100)}%` }} />
        </div>
      </div>

      {/* 4. PREGUNTA ADAPTATIVA DINÁMICA */}
      <main style={styles.preguntaCard}>
        {cargandoPregunta ? (
          <div style={styles.loadingInner}>⚡ Calculando el ítem con máxima información de Fisher...</div>
        ) : errorPregunta ? (
          <div style={styles.errorInner}>{errorPregunta}</div>
        ) : preguntaActual ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: tieneRecursoVisual ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
            gap: '24px'
          }}>
            {/* Panel Izquierdo: Solo si existe recurso o lectura larga */}
            {tieneRecursoVisual && (
              <div style={styles.visualContainer}>
                {preguntaActual.estimulo_texto && (
                  <p style={styles.estimuloTexto}>{preguntaActual.estimulo_texto}</p>
                )}
                {preguntaActual.recurso_visual && (
                  preguntaActual.recurso_visual.startsWith('data:image/svg+xml') ? (
                    <img
                      src={preguntaActual.recurso_visual}
                      alt="Recurso Ilustrativo"
                      style={styles.visualImage}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: preguntaActual.recurso_visual }} />
                  )
                )}
              </div>
            )}

            {/* Panel Derecho: Pregunta y Opciones */}
            <div style={{ width: '100%' }}>
              <p style={styles.preguntaTexto}>{preguntaActual.texto || preguntaActual.pregunta_texto}</p>

              <div style={styles.opcionesGrid}>
                {(preguntaActual.opciones || preguntaActual.opciones_respuesta || []).map((opcion, idx) => {
                  const estaSeleccionada = opcionSeleccionada === opcion;
                  return (
                    <button
                      key={idx}
                      onClick={() => setOpcionSeleccionada(opcion)}
                      style={{
                        ...styles.opcionButton,
                        ...(estaSeleccionada ? styles.opcionButtonSelected : {})
                      }}
                    >
                      <span style={styles.opcionRadio}>{estaSeleccionada ? '●' : '○'}</span>
                      <span style={styles.opcionTexto}>{opcion}</span>
                    </button>
                  );
                })}
              </div>

              <div style={styles.accionesContainer}>
                <button
                  onClick={handleEnviarRespuesta}
                  disabled={!opcionSeleccionada}
                  style={{
                    ...styles.btnEnviar,
                    ...(!opcionSeleccionada ? styles.btnDisabled : {})
                  }}
                >
                  Confirmar y Siguiente ➔
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

// Estilos CSS-in-JS Modo Oscuro
const styles = {
  dashboardContainer: {
    background: '#09090b',
    color: '#f4f4f5',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #27272a',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1000px',
    margin: '20px auto',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  title: {
    margin: '0',
    fontSize: '20px',
    background: 'linear-gradient(to right, #fbbf24, #fef08a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800'
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#71717a',
    fontFamily: 'monospace'
  },
  timerBadge: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    padding: '8px 14px',
    borderRadius: '9999px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#fbbf24',
    fontWeight: 'bold'
  },
  termometroCard: {
    background: '#18181b',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #27272a',
    marginBottom: '20px'
  },
  termometroHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#a1a1aa',
    marginBottom: '10px'
  },
  termometroTitle: {
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  margenText: {
    fontFamily: 'monospace',
    color: '#71717a'
  },
  barraContenedor: {
    height: '14px',
    background: '#27272a',
    borderRadius: '9999px',
    position: 'relative',
    margin: '15px 0'
  },
  intervaloRango: {
    position: 'absolute',
    height: '100%',
    background: 'rgba(245, 158, 11, 0.3)',
    borderRadius: '9999px'
  },
  marcadorPuntaje: {
    position: 'absolute',
    top: '-5px',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '24px',
    background: '#fbbf24',
    borderRadius: '50%',
    border: '3px solid #09090b',
    boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
  },
  metricasGrid: {
    display: 'flex',
    gap: '8px',
    marginTop: '15px'
  },
  metricaBox: {
    flex: 1,
    background: '#09090b',
    padding: '8px',
    borderRadius: '6px',
    textAlign: 'center'
  },
  metricaBoxHighlight: {
    flex: 1.2,
    background: '#27272a',
    padding: '8px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid #fbbf24'
  },
  metricaLabel: {
    display: 'block',
    fontSize: '10px',
    color: '#a1a1aa'
  },
  metricaVal: {
    fontSize: '13px',
    color: '#fff',
    fontFamily: 'monospace'
  },
  metricaValHighlight: {
    fontSize: '14px',
    color: '#fbbf24',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  progresoContenedor: {
    marginBottom: '20px'
  },
  progresoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#a1a1aa',
    marginBottom: '6px',
    fontFamily: 'monospace'
  },
  progresoTrack: {
    height: '6px',
    background: '#27272a',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progresoFill: {
    height: '100%',
    background: '#3b82f6',
    transition: 'width 0.3s ease'
  },
  preguntaCard: {
    background: '#18181b',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #27272a'
  },
  preguntaTexto: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#f4f4f5',
    marginTop: 0,
    marginBottom: '20px',
    fontWeight: '500'
  },
  estimuloTexto: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#a1a1aa',
    marginBottom: '15px'
  },
  visualContainer: {
    textAlign: 'center',
    background: '#09090b',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  visualImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '6px'
  },
  opcionesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  opcionButton: {
    display: 'flex',
    alignItems: 'center',
    background: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '10px',
    padding: '14px 18px',
    color: '#d4d4d8',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  opcionButtonSelected: {
    borderColor: '#fbbf24',
    background: 'rgba(251, 191, 36, 0.08)',
    color: '#ffffff',
    boxShadow: '0 0 0 1px #fbbf24'
  },
  opcionRadio: {
    marginRight: '12px',
    color: '#fbbf24',
    fontSize: '16px'
  },
  opcionTexto: {
    lineHeight: '1.4'
  },
  accionesContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  btnEnviar: {
    background: 'linear-gradient(to right, #f59e0b, #d97706)',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease'
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  loading: {
    color: '#aaa',
    fontFamily: 'monospace',
    padding: '20px',
    textAlign: 'center'
  },
  loadingInner: {
    color: '#fbbf24',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '40px 0'
  },
  errorContainer: {
    color: '#ff6b6b',
    fontFamily: 'monospace',
    padding: '20px',
    textAlign: 'center'
  },
  errorInner: {
    color: '#ef4444',
    textAlign: 'center',
    padding: '20px'
  }
};

// src/components/StudentDashboard.jsx - Dashboard del Estudiante en JavaScript Puro
import React, { useEffect } from 'react';
import { useTwin } from '../context/TwinContext';

export const StudentDashboard = ({ studentId }) => {
  const { gemelo, loading, error, sincronizarGemelo } = useTwin();

  useEffect(() => {
    if (studentId) sincronizarGemelo(studentId);
  }, [studentId, sincronizarGemelo]);

  if (loading) return <div style={{ color: '#aaa', fontFamily: 'monospace', padding: '20px' }}>📡 Sincronizando con el Gateway...</div>;
  if (error) return <div style={{ color: '#ff6b6b', fontFamily: 'monospace', padding: '20px' }}>🚨 Error perimetral: {error}</div>;
  if (!gemelo) return null;

  const { puntaje_estimado, margen_error, intervalo_95 } = gemelo.escalonamiento_icfes;

  return (
    <div style={{ background: '#09090b', color: '#f4f4f5', padding: '30px', borderRadius: '16px', border: '1px solid #27272a', fontFamily: 'sans-serif', maxWidth: '600px', margin: '20px auto' }}>
      <h2 style={{ margin: '0 0 5px 0', background: 'linear-gradient(to right, #fbbf24, #fef08a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DANTE OS // DIGITAL TWIN</h2>
      <p style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace', margin: '0 0 25px 0' }}>ID: {studentId}</p>
      
      <div style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#a1a1aa', fontSize: '14px', textTransform: 'uppercase' }}>Termómetro de Certeza Bayesian</h4>
        
        <div style={{ height: '16px', background: '#27272a', borderRadius: '9999px', position: 'relative', margin: '30px 0 15px 0' }}>
          <div style={{ position: 'absolute', height: '100%', background: 'rgba(245, 158, 11, 0.25)', left: `${intervalo_95[0]}%`, width: `${intervalo_95[1] - intervalo_95[0]}%`, borderRadius: '9999px' }} />
          <div style={{ position: 'absolute', top: '-6px', left: `${puntaje_estimado}%`, transform: 'translateX(-50%)', width: '28px', height: '28px', background: '#fbbf24', borderRadius: '50%', border: '3px solid #09090b' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontFamily: 'monospace', fontSize: '12px', color: '#a1a1aa', marginTop: '25px', gap: '10px' }}>
          <div style={{ flex: 1, background: '#09090b', padding: '8px', borderRadius: '6px' }}><div>Mínimo</div><strong style={{ color: '#fff' }}>{intervalo_95[0]}</strong></div>
          <div style={{ flex: 1, background: '#09090b', padding: '8px', borderRadius: '6px' }}><div>Puntaje</div><strong style={{ color: '#fbbf24' }}>{puntaje_estimado}</strong></div>
          <div style={{ flex: 1, background: '#09090b', padding: '8px', borderRadius: '6px' }}><div>Máximo</div><strong style={{ color: '#fff' }}>{intervalo_95[1]}</strong></div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#71717a', fontFamily: 'monospace', marginTop: '12px' }}>Margen de Error: ±{margen_error}</div>
      </div>
    </div>
  );
};
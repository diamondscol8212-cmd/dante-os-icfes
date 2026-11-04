// src/context/TwinContext.jsx - Proveedor de Estado en JavaScript Puro
import React, { createContext, useContext, useState, useCallback } from 'react';
import { danteApi } from '../services/api';

const TwinContext = createContext(undefined);

export const TwinProvider = ({ children }) => {
  const [gemelo, setGemelo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sincronizarGemelo = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await danteApi.obtenerGemelo(studentId);
      setGemelo(data);
    } catch (err) {
      setError(err.message || "Error de sincronización.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TwinContext.Provider value={{ gemelo, loading, error, sincronizarGemelo }}>
      {children}
    </TwinContext.Provider>
  );
};

export const useTwin = () => {
  const context = useContext(TwinContext);
  if (!context) throw new Error('useTwin debe usarse bajo un TwinProvider.');
  return context;
};
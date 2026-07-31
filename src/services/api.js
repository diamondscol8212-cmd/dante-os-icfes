// src/services/api.js - Cliente de Consumo Dante OS Gateway en JavaScript Puro
const API_BASE_URL = typeof window !== 'undefined' ? `${window.location.origin}/api/cat` : '/api/cat';

export const danteApi = {
  /**
   * Extrae el Gemelo Digital Cognitivo y Psicométrico de un estudiante en tiempo real
   * @param {string} studentId 
   */
  async obtenerGemelo(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/gemelo/${studentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      return data.gemelo;
    } catch (error) {
      console.error("🚨 [API ERROR]:", error.message);
      throw error;
    }
  }
};
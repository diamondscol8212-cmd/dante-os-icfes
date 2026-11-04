// src/types/danteTypes.ts - Contratos de Tipos Estrictos (Dante OS v23.1.0-ENTERPRISE)
// Bogotá, Colombia

/**
 * Interface inmutable para reactivos de Item Response Theory (IRT / MIRT 3PL).
 */
export interface IRTItem {
    id: string;
    a: number; // Discriminación psicométrica
    b: number; // Dificultad psicométrica (logit)
    c: number; // Pseudo-adivinación
    pregunta_texto: string;
    opciones_respuesta: string[];
    correcta: string;
    target_exam?: string;
    carrera_objetivo?: string;
    sub_competencia?: string;
    imagen_url?: string | null;
    matriz_q?: Record<string, number>;
}

/**
 * Estado en memoria / caché de la sesión activa de un estudiante.
 */
export interface UserSessionState {
    session_id: string;
    student_id: string;
    area_general: string;
    target_exam: string;
    carrera_objetivo?: string | null;
    thetas: {
        algebra: number;
        geometria: number;
        estadistica: number;
        [key: string]: number;
    };
    sem_bayesian: number;
    items_respondidos_count: number;
    priors_dinamicos: Record<string, number>;
    seen_item_ids: string[];
}

/**
 * Perfil completo del estudiante, incluyendo ADN psicométrico y escalonamiento oficial.
 */
export interface StudentProfile {
    student_id: string;
    nombre?: string;
    email?: string;
    target_exam?: string;
    carrera_objetivo?: string | null;
    rendimiento?: {
        saber11_global?: number;
        unal_global?: number;
        thetas?: Record<string, number>;
    };
    adn_empaquetado?: string;
    escalonamiento?: string;
    meta_cognicion?: {
        impulsividad?: number;
        arquetipo?: string;
    };
}

/**
 * Contrato unificado de respuestas API REST del motor CAT/IRT.
 */
export interface CATApiResponse<T = any> {
    success: boolean;
    detenerExamen?: boolean;
    codigo_control?: 'CRITERIO_DE_PARADA_ALCANZADO' | 'BANCO_CONSUMIDO_TOTALMENTE' | string;
    mensaje?: string;
    error?: string;
    item?: IRTItem;
    reporteFinal?: {
        saber11_global?: number;
        unal_global?: number;
        thetas?: Record<string, number>;
        sem?: number;
        intervencion_metacognitiva?: any;
    };
    data?: T;
    meta?: Record<string, any>;
}

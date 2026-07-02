// catTypes.ts - Contratos de Tipos Estrictos para Medición Cognitiva (Dante OS v20.0)

/**
 * Contrato estricto para los reactivos provenientes de la base de datos e indexados en RAM.
 * Previene el descalce clásico 'item.id || item.ID' en toda la aplicación.
 */
export interface CATItem {
    id: string;
    pregunta_texto: string;
    opciones_respuesta: string[];
    a: number; // Parámetro de Discriminación Psicométrica
    b: number; // Parámetro de Dificultad Psicométrica (Logit)
    c: number; // Parámetro de Adivinación / Pseudoadivinación
    sub_competencia: 'algebra' | 'geometria' | 'estadistica' | string;
}

/**
 * Estructura inmutable del Read Model efímero de sesión en RAM o caché.
 */
export interface SessionState {
    session_id: string;
    student_id: string;
    area_general: string;
    theta: number;          // Habilidad latente estimada concurrente
    sem_bayesian: number;   // Error Estándar de Medición (Precisión)
    items_respondidos_count: number;
    seen_item_ids: string[]; // Set de exclusión perimetral para evitar repeticiones
}

/**
 * Metadatos forenses generados por el algoritmo de maximización local de Fisher.
 */
export interface SelectionMetadata {
    distancia_logit: number;
    pool_k_evaluado: number;
    bucket_origen: number;
}

/**
 * Contrato de salida unificado del CAT Selector Engine hacia el controlador y cliente.
 */
export interface SelectorResult {
    success: boolean;
    detenerExamen: boolean;
    codigo_control?: 'CRITERIO_DE_PARADA_ALCANZADO' | 'BANCO_CONSUMIDO_TOTALMENTE';
    item?: CATItem; // Opcional, ausente si detenerExamen es true
    meta_seleccion?: SelectionMetadata;
}
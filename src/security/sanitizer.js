// 🛡️ src/security/sanitizer.js - Sanitizador Zero-Trust de Reactivos
// Dante OS Enterprise Edition - Prevención de Exposición de Claves y Parámetros

/**
 * Retira las respuestas correctas ('ok', 'correcta') y parámetros IRT sensibles (a, b, c, q, trampas)
 * antes de transmitir cualquier ítem al cliente/interfaz de usuario.
 */
export function sanitizeItemForClient(item) {
    if (!item || typeof item !== 'object') return item;

    const {
        ok: _ok,
        correcta: _correcta,
        a: _a,
        b: _b,
        c: _c,
        q: _q,
        trampas: _trampas,
        parametro_a_discriminacion: _pad,
        parametro_b_dificultad: _pbd,
        parametro_c_adivinacion: _pca,
        attr_heuristica_lineal: _ahl,
        attr_inversion_operacional: _aio,
        justificacion_opciones: _justificacion,
        razonesPorTexto: _razones,
        frase_acierto: _frase,
        repaso: _repaso,
        ...itemSanitizado
    } = item;

    return {
        ...itemSanitizado,
        pregunta_texto: itemSanitizado.pregunta_texto || itemSanitizado.texto || itemSanitizado.enunciado || "Pregunta de evaluación",
        opciones_respuesta: Array.isArray(itemSanitizado.opciones_respuesta) && itemSanitizado.opciones_respuesta.length > 0
            ? itemSanitizado.opciones_respuesta
            : (Array.isArray(itemSanitizado.opciones) ? itemSanitizado.opciones : ["Opción A", "Opción B", "Opción C", "Opción D"])
    };
}

/**
 * Sanitiza una colección masiva de preguntas
 */
export function sanitizeItemsCollection(itemsList) {
    if (!Array.isArray(itemsList)) return [];
    return itemsList.map(item => sanitizeItemForClient(item));
}

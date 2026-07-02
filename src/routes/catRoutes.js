// Ruta de Auditoría Global para el Dashboard Premium
router.get('/api/cat/auditoria', async (req, res) => {
    try {
        const { estudiante } = req.query;
        
        let query = supabase
            .from('progreso_estudiantes')
            .select('*')
            .order('created_at', { ascending: true }); // Ascendiente para graficar la curva de aprendizaje en orden

        if (estudiante) {
            query = query.eq('estudiante', String(estudiante).toLowerCase().trim());
        }

        const { data, error } = await query;
        if (error) throw error;

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("🚨 [AUDITOR API EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Fallo al compilar el histórico de auditoría." });
    }
});
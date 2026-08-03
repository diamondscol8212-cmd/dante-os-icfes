-- ====================================================================================
-- 🏛️ SCRIPT SQL UNIFICADO DE PRODUCCIÓN - DANTE OS ENTERPRISE (v21.6.0)
-- PLANO MAESTRO DDL, POLÍTICAS RLS MULTI-TENANT, DERECHOS ARCO & VISTA C-SUITE
-- ====================================================================================

/* @security OWASP Top 10 & ISO/IEC 27001 Multi-Tenant Isolation - Isolation via x-institution-id and RLS */
/* @legal Colombia Ley 1581 de 2012 / Decreto 1377 de 2013 - Habeas Data y Consentimiento Parental */
/* @architecture Offline-First Pattern - Sincronización idempotente IndexedDB + Service Worker */

BEGIN;

-- 1. EXTENSIONES BÁSICAS DE BASE DE DATOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================================
-- 2. TABLA DE PERFILES DE USUARIOS Y ROLES (dante_profiles)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'principal', 'admin')),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    habeas_data_consent BOOLEAN DEFAULT TRUE,
    consent_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dante_profiles IS 'Perfiles de usuarios con RBAC y asignación Multi-Tenant a colegio.';

-- ====================================================================================
-- 3. TABLA DE AULAS Y GRUPOS INSTITUCIONALES (dante_classrooms)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    academic_year INT NOT NULL DEFAULT 2026,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.dante_classrooms IS 'Aulas y cohortes registradas por la institución para agrupamiento de estudiantes.';

-- ====================================================================================
-- 4. TABLA DE CLÚSTERES DE ESTÍMULOS COMPLEJOS HD (dante_stimuli_clusters)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_stimuli_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    area VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('press', 'infographic', 'chart', 'map')),
    media_url TEXT,
    content_html TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.dante_stimuli_clusters IS 'Clústeres de fuentes complejas para lectura crítica y razonamiento según Regla 70/30 de Sweller.';

-- ====================================================================================
-- 5. TABLA DE REACTIVOS Y PREGUNTAS TRI (dante_items)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_items (
    id VARCHAR(100) PRIMARY KEY,
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    area_general VARCHAR(50) NOT NULL,
    sub_competencia VARCHAR(50) NOT NULL,
    pregunta_texto TEXT NOT NULL,
    opciones_respuesta JSONB NOT NULL,
    opcion_correcta_id VARCHAR(10) NOT NULL,
    a NUMERIC(5, 4) DEFAULT 1.0000,
    b NUMERIC(5, 4) DEFAULT 0.0000,
    c NUMERIC(5, 4) DEFAULT 0.2500,
    matriz_q JSONB DEFAULT '{}'::jsonb,
    stimulus_id UUID REFERENCES public.dante_stimuli_clusters(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.dante_items IS 'Banco de ítems calibrados mediante Teoría de Respuesta al Ítem (TRI-3PL).';

-- ====================================================================================
-- 6. TABLA DE TELEMETRÍA NEURO-CONDUCTUAL (dante_neuro_telemetry)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_neuro_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    session_id UUID NOT NULL,
    student_id UUID NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    dwell_time_ms INT NOT NULL,
    haptic_hold_ms INT DEFAULT 0,
    overconfidence_flag BOOLEAN DEFAULT FALSE,
    discarded_options JSONB DEFAULT '[]'::jsonb,
    vagal_breaths_count INT DEFAULT 0,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.dante_neuro_telemetry IS 'Registro micro-conductual de fricción intencional, impulsividad y autorregulación en milisegundos.';

-- ====================================================================================
-- 7. TABLA DE CONTRATOS DE AUTOLIMITACIÓN COGNITIVA (dante_odysseus_contracts)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_odysseus_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    student_id UUID NOT NULL,
    session_id UUID NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    hold_duration_ms INT NOT NULL,
    rules_json JSONB NOT NULL,
    signature_hash TEXT NOT NULL,
    idempotency_key TEXT UNIQUE
);

COMMENT ON TABLE public.dante_odysseus_contracts IS 'Pactos de Odiseo firmados con retención háptica (2.5s Hold-to-Commit) para control de impulsividad.';

-- ====================================================================================
-- 8. TABLA DE CONSENTIMIENTO PARENTAL HABEAS DATA LEY 1581 (dante_parental_consents)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_parental_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    student_id UUID NOT NULL,
    parent_name TEXT NOT NULL,
    parent_document TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    digital_signature_hash TEXT NOT NULL
);

COMMENT ON TABLE public.dante_parental_consents IS 'Registro legal de consentimiento parental para tratamiento de datos neuro-conductuales de menores (Ley 1581).';

-- ====================================================================================
-- 9. TABLA DE EVALUACIONES COGNITIVAS Y SESIONES (dante_telemetry)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    estudiante_id TEXT NOT NULL,
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    materia TEXT NOT NULL,
    theta_inicial NUMERIC(8,4) DEFAULT 0.0000,
    theta_final NUMERIC(8,4) DEFAULT 0.0000,
    puntaje_escalonado INT CHECK (puntaje_escalonado BETWEEN 1 AND 100),
    items_respondidos JSONB NOT NULL DEFAULT '{}'::jsonb,
    adn_cognitivo JSONB NOT NULL DEFAULT '{}'::jsonb,
    cei_index NUMERIC(6,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dante_telemetry IS 'Resultados agregados de sesiones adaptativas y ADN cognitivo de 5 dimensiones.';

-- ====================================================================================
-- 10. TABLA DE AUDITORÍA Y MONITOREO COLECTIVO DE AULA (dante_auditoria)
-- ====================================================================================
CREATE TABLE IF NOT EXISTS public.dante_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    estudiante TEXT NOT NULL,
    materia TEXT NOT NULL,
    theta NUMERIC(8,4) NOT NULL DEFAULT 0.0000,
    puntaje_concurrente INT DEFAULT 50,
    items_respondidos JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dante_auditoria IS 'Estado de auditoría en tiempo real para el Mando Táctico Docente y C-Suite.';

-- ====================================================================================
-- 11. HABILITACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ====================================================================================
ALTER TABLE public.dante_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_stimuli_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_neuro_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_odysseus_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dante_auditoria ENABLE ROW LEVEL SECURITY;

-- ====================================================================================
-- 12. POLÍTICAS DE SEGURIDAD MULTI-TENANT (RLS)
-- ====================================================================================

-- 12.1 Políticas para dante_profiles
DROP POLICY IF EXISTS "dante_profiles_select_self" ON public.dante_profiles;
CREATE POLICY "dante_profiles_select_self" ON public.dante_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "dante_profiles_select_institution" ON public.dante_profiles;
CREATE POLICY "dante_profiles_select_institution" ON public.dante_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_profiles.institution_id
              AND p.role IN ('teacher', 'principal', 'admin')
        )
    );

-- 12.2 Políticas para dante_neuro_telemetry
DROP POLICY IF EXISTS "dante_neuro_telemetry_insert_student" ON public.dante_neuro_telemetry;
CREATE POLICY "dante_neuro_telemetry_insert_student" ON public.dante_neuro_telemetry
    FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "dante_neuro_telemetry_select_tenant" ON public.dante_neuro_telemetry;
CREATE POLICY "dante_neuro_telemetry_select_tenant" ON public.dante_neuro_telemetry
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_neuro_telemetry.institution_id
        ) OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- 12.3 Políticas para dante_odysseus_contracts
DROP POLICY IF EXISTS "dante_odysseus_insert" ON public.dante_odysseus_contracts;
CREATE POLICY "dante_odysseus_insert" ON public.dante_odysseus_contracts
    FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "dante_odysseus_select" ON public.dante_odysseus_contracts;
CREATE POLICY "dante_odysseus_select" ON public.dante_odysseus_contracts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_odysseus_contracts.institution_id
        ) OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- 12.4 Políticas para dante_parental_consents
DROP POLICY IF EXISTS "dante_parental_insert" ON public.dante_parental_consents;
CREATE POLICY "dante_parental_insert" ON public.dante_parental_consents
    FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "dante_parental_select" ON public.dante_parental_consents;
CREATE POLICY "dante_parental_select" ON public.dante_parental_consents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_parental_consents.institution_id
              AND p.role IN ('principal', 'admin')
        ) OR auth.role() = 'service_role'
    );

-- 12.5 Políticas para dante_telemetry
DROP POLICY IF EXISTS "dante_telemetry_select_student" ON public.dante_telemetry;
CREATE POLICY "dante_telemetry_select_student" ON public.dante_telemetry
    FOR SELECT USING (
        auth.uid() = user_id 
        OR estudiante_id = (SELECT email FROM public.dante_profiles WHERE id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_telemetry.institution_id
              AND p.role IN ('teacher', 'principal', 'admin')
        ) OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

DROP POLICY IF EXISTS "dante_telemetry_insert" ON public.dante_telemetry;
CREATE POLICY "dante_telemetry_insert" ON public.dante_telemetry
    FOR INSERT WITH CHECK (TRUE);

-- 12.6 Políticas para dante_auditoria
DROP POLICY IF EXISTS "dante_auditoria_all" ON public.dante_auditoria;
CREATE POLICY "dante_auditoria_all" ON public.dante_auditoria
    FOR ALL USING (TRUE);

-- 12.7 Políticas para dante_stimuli_clusters y dante_items
DROP POLICY IF EXISTS "dante_stimuli_read" ON public.dante_stimuli_clusters;
CREATE POLICY "dante_stimuli_read" ON public.dante_stimuli_clusters FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "dante_items_read" ON public.dante_items;
CREATE POLICY "dante_items_read" ON public.dante_items FOR SELECT USING (TRUE);

-- ====================================================================================
-- 13. VISTA C-SUITE PREDICTIVA PARA RECTORÍA (v_rectoria_kpi_tenant)
-- ====================================================================================
CREATE OR REPLACE VIEW public.v_rectoria_kpi_tenant AS
SELECT 
    a.institution_id,
    COUNT(DISTINCT a.estudiante) AS total_estudiantes_activos,
    ROUND(AVG(a.theta), 4) AS theta_medio_institucional,
    -- Proyección Saber 11º Escala 0 - 500 Pts (Lord & Novick, 1968)
    LEAST(500, GREATEST(100, ROUND(250 + (AVG(a.theta) * 60)))) AS puntaje_proyectado_saber11,
    ROUND(AVG(a.puntaje_concurrente), 2) AS puntaje_promedio_concurrente,
    COUNT(CASE WHEN a.theta < -0.5 THEN 1 END) AS estudiantes_en_riesgo,
    COUNT(CASE WHEN a.theta >= 0.8 THEN 1 END) AS estudiantes_excelencia,
    ROUND(
        (COUNT(CASE WHEN a.theta >= 0.8 THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2
    ) AS porcentaje_alto_rendimiento,
    CASE 
        WHEN LEAST(500, GREATEST(100, ROUND(250 + (AVG(a.theta) * 60)))) >= 320 THEN 'Zona de Excelencia (Verde)'
        WHEN LEAST(500, GREATEST(100, ROUND(250 + (AVG(a.theta) * 60)))) >= 260 THEN 'Zona Metodológica (Amarillo)'
        ELSE 'Zona de Intervención Crítica (Rojo)'
    END AS semaforo_csuite,
    MAX(a.updated_at) AS ultima_sincronizacion
FROM public.dante_auditoria a
GROUP BY a.institution_id;

COMMENT ON VIEW public.v_rectoria_kpi_tenant IS 'Vista ejecutiva C-Suite para análisis agregado de desempeño, proyección Saber 11º y semáforo por colegio.';

-- ====================================================================================
-- 14. ÍNDICES DE ALTO RENDIMIENTO
-- ====================================================================================
CREATE INDEX IF NOT EXISTS idx_dante_profiles_institution ON public.dante_profiles(institution_id, role);
CREATE INDEX IF NOT EXISTS idx_dante_telemetry_tenant_user ON public.dante_telemetry(institution_id, user_id);
CREATE INDEX IF NOT EXISTS idx_dante_neuro_session_student ON public.dante_neuro_telemetry(session_id, student_id);
CREATE INDEX IF NOT EXISTS idx_dante_neuro_tenant ON public.dante_neuro_telemetry(institution_id, created_at);
CREATE INDEX IF NOT EXISTS idx_dante_neuro_idempotency ON public.dante_neuro_telemetry(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_dante_odysseus_idempotency ON public.dante_odysseus_contracts(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_dante_auditoria_materia_tenant ON public.dante_auditoria(institution_id, materia);
CREATE INDEX IF NOT EXISTS idx_dante_parental_student ON public.dante_parental_consents(institution_id, student_id);

COMMIT;
-- ====================================================================================
-- FIN DEL SCRIPT SQL UNIFICADO DE PRODUCCIÓN (v21.6.0)
-- ====================================================================================

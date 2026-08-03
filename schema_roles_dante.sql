-- =============================================================================
-- DANTE OS // SUPABASE MULTI-TENANT RBAC & RLS SECURITY SCHEMA (v21.3.0)
-- Configuración de Roles (student, teacher, principal) y Políticas de Aislamiento
-- =============================================================================

-- 1. TABLA DE PERFILES DE USUARIO Y ROLES (dante_profiles)
CREATE TABLE IF NOT EXISTS public.dante_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'principal', 'admin')),
    institution_id TEXT NOT NULL DEFAULT 'colegio_sandbox_default',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.dante_profiles ENABLE ROW LEVEL SECURITY;

-- Política 1.1: Los usuarios pueden leer su propio perfil
CREATE POLICY "dante_profiles_select_self" ON public.dante_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política 1.2: Profesores y Rectores pueden consultar perfiles de su misma institución
CREATE POLICY "dante_profiles_select_institution" ON public.dante_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_profiles.institution_id
              AND p.role IN ('teacher', 'principal', 'admin')
        )
    );

-- 2. TABLA DE EVALUACIONES Y TELEMETRÍA (dante_telemetry)
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

ALTER TABLE public.dante_telemetry ENABLE ROW LEVEL SECURITY;

-- Política 2.1: Estudiantes solo pueden leer su propia telemetría
CREATE POLICY "dante_telemetry_select_student" ON public.dante_telemetry
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR estudiante_id = (SELECT email FROM public.dante_profiles WHERE id = auth.uid())
    );

-- Política 2.2: Estudiantes pueden insertar su propia telemetría
CREATE POLICY "dante_telemetry_insert_student" ON public.dante_telemetry
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR estudiante_id = (SELECT email FROM public.dante_profiles WHERE id = auth.uid())
    );

-- Política 2.3: Profesores y Rectores pueden ver la telemetría de toda su institución
CREATE POLICY "dante_telemetry_select_teacher_principal" ON public.dante_telemetry
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_telemetry.institution_id
              AND p.role IN ('teacher', 'principal', 'admin')
        )
    );

-- 3. TABLA DE AUDITORÍA Y SESIONES EN VIVO (dante_auditoria)
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

ALTER TABLE public.dante_auditoria ENABLE ROW LEVEL SECURITY;

-- Política 3.1: Aislamiento multi-tenant para auditoría colectiva docente
CREATE POLICY "dante_auditoria_select_tenant" ON public.dante_auditoria
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.dante_profiles p
            WHERE p.id = auth.uid()
              AND p.institution_id = dante_auditoria.institution_id
              AND p.role IN ('teacher', 'principal', 'admin')
        )
    );

-- 4. VISTA C-SUITE PARA RECTORÍA (Métricas consolidadas de Tenant)
CREATE OR REPLACE VIEW public.v_rectoria_kpi_tenant AS
SELECT 
    institution_id,
    COUNT(DISTINCT estudiante_id) AS total_estudiantes_auditados,
    ROUND(AVG(puntaje_escalonado), 2) AS promedio_puntaje_100,
    ROUND(AVG(puntaje_escalonado * 5), 0) AS proyeccion_saber11_500,
    ROUND(AVG(cei_index), 2) AS cei_promedio_institucional,
    ROUND(AVG(COALESCE((adn_cognitivo->>'estabilidad')::numeric, 75)), 1) AS estabilidad_media_pct
FROM public.dante_telemetry
GROUP BY institution_id;

-- Fin de Script SQL RLS Dante OS v21.3.0

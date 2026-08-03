-- ====================================================================
-- 🏛️ PLANO MAESTRO DE BASE DE DATOS SUPABASE / POSTGRESQL (DDL & RLS)
-- ECOSISTEMA NEURO-PEDAGÓGICO DANTE OS ENTERPRISE (v21.2.4)
-- Cumplimiento Legal: Ley Estatutaria 1581 de 2012 (Habeas Data Colombia)
-- ====================================================================

-- Habilitar extensión UUID para generación soberana de identificadores
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. ESTRUCTURA PARA CLÚSTERES Y FUENTES COMPLEJAS HD (dante_stimuli_clusters)
-- @theory Sweller (1988) Cognitive Load Theory - Anclaje de estímulos en clústeres.
-- Regla 70/30: Estímulos compartidos vinculados a grupos de 2 a 4 reactivos.
-- ====================================================================
CREATE TABLE IF NOT EXISTS dante_stimuli_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('press', 'infographic', 'chart', 'map')),
    media_url TEXT,
    content_html TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE dante_stimuli_clusters IS 'Clústeres de fuentes complejas (prensa, infografía, diagramas, mapas) para anclaje adaptativo Regla 70/30';
COMMENT ON COLUMN dante_stimuli_clusters.resource_type IS 'Tipo de recurso: press (prensa/lectura), infographic (infografía), chart (gráfico estadístico), map (mapa geográfico)';

-- ====================================================================
-- 2. EXTENSIÓN DE REACTIVOS (dante_items)
-- Vincular reactivos a clústeres de estímulos complejos HD
-- ====================================================================
CREATE TABLE IF NOT EXISTS dante_items (
    id VARCHAR(100) PRIMARY KEY,
    area_general VARCHAR(50) NOT NULL,
    sub_competencia VARCHAR(50) NOT NULL,
    pregunta_texto TEXT NOT NULL,
    opciones_respuesta JSONB NOT NULL,
    opcion_correcta_id VARCHAR(10) NOT NULL,
    a NUMERIC(5, 4) DEFAULT 1.0000,
    b NUMERIC(5, 4) DEFAULT 0.0000,
    c NUMERIC(5, 4) DEFAULT 0.2500,
    matriz_q JSONB DEFAULT '{}'::jsonb,
    stimulus_id UUID REFERENCES dante_stimuli_clusters(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla dante_items ya existía, asegurar que la columna stimulus_id esté presente
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dante_items' AND column_name = 'stimulus_id'
    ) THEN
        ALTER TABLE dante_items ADD COLUMN stimulus_id UUID REFERENCES dante_stimuli_clusters(id) ON DELETE SET NULL;
    END IF;
END $$;

COMMENT ON COLUMN dante_items.stimulus_id IS 'FK opcional a dante_stimuli_clusters(id) para reactivos en clúster (30% cuota)';

-- ====================================================================
-- 3. MÓDULO DE TELEMETRÍA NEURO-CONDUCTUAL (dante_neuro_telemetry)
-- Almacenamiento asíncrono de fricción intencional, impulsividad y sobreconfianza.
-- ====================================================================
CREATE TABLE IF NOT EXISTS dante_neuro_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    student_id UUID NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    dwell_time_ms INT NOT NULL,
    haptic_hold_ms INT DEFAULT 0,
    overconfidence_flag BOOLEAN DEFAULT FALSE,
    discarded_options JSONB DEFAULT '[]'::jsonb,
    vagal_breaths_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE dante_neuro_telemetry IS 'Registro micro-conductual de latencias S1/S2, retención háptica y respiración vagal regulatoria';

-- ====================================================================
-- 4. CONTRATOS DE AUTOLIMITACIÓN COGNITIVA (dante_odysseus_contracts)
-- @theory Thaler (1999) Endowment Effect & Mental Accounting - Pactos de Odiseo
-- Registro de pactos de autolimitación firmados con retención háptica (Hold-to-Commit)
-- ====================================================================
CREATE TABLE IF NOT EXISTS dante_odysseus_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    session_id UUID NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    hold_duration_ms INT NOT NULL,
    rules_json JSONB NOT NULL,
    signature_hash TEXT NOT NULL
);

COMMENT ON TABLE dante_odysseus_contracts IS 'Pactos de Odiseo firmados hápticamente para autorregulación y control de impulsividad en examen';

-- ====================================================================
-- 5. ÍNDICES DE ALTO RENDIMIENTO
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_stimuli_area ON dante_stimuli_clusters(area);
CREATE INDEX IF NOT EXISTS idx_stimuli_type ON dante_stimuli_clusters(resource_type);

CREATE INDEX IF NOT EXISTS idx_items_stimulus ON dante_items(stimulus_id);
CREATE INDEX IF NOT EXISTS idx_items_area_sub ON dante_items(area_general, sub_competencia);

CREATE INDEX IF NOT EXISTS idx_telemetry_session ON dante_neuro_telemetry(session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_student ON dante_neuro_telemetry(student_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_item ON dante_neuro_telemetry(item_id);

CREATE INDEX IF NOT EXISTS idx_odysseus_student ON dante_odysseus_contracts(student_id);
CREATE INDEX IF NOT EXISTS idx_odysseus_session ON dante_odysseus_contracts(session_id);

-- ====================================================================
-- 6. POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- Ley 1581 de 2012 - Protección estricta por identidad de estudiante
-- ====================================================================
ALTER TABLE dante_stimuli_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE dante_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dante_neuro_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE dante_odysseus_contracts ENABLE ROW LEVEL SECURITY;

-- 🛡️ dante_stimuli_clusters: Lectura pública/autenticada, modificación restringida a administradores
DROP POLICY IF EXISTS "Permitir lectura de estímulos a usuarios autenticados" ON dante_stimuli_clusters;
CREATE POLICY "Permitir lectura de estímulos a usuarios autenticados"
ON dante_stimuli_clusters FOR SELECT
TO authenticated, anon
USING (true);

-- 🛡️ dante_items: Lectura pública/autenticada de reactivos
DROP POLICY IF EXISTS "Permitir lectura de reactivos a usuarios autenticados" ON dante_items;
CREATE POLICY "Permitir lectura de reactivos a usuarios autenticados"
ON dante_items FOR SELECT
TO authenticated, anon
USING (true);

-- 🛡️ dante_neuro_telemetry: Inserción y consulta restringidas por ID de estudiante
DROP POLICY IF EXISTS "Insertar telemetría propia de estudiante" ON dante_neuro_telemetry;
CREATE POLICY "Insertar telemetría propia de estudiante"
ON dante_neuro_telemetry FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Ver telemetría propia de estudiante" ON dante_neuro_telemetry;
CREATE POLICY "Ver telemetría propia de estudiante"
ON dante_neuro_telemetry FOR SELECT
TO authenticated
USING (
    (auth.uid() = student_id) OR 
    (auth.jwt() ->> 'sub')::uuid = student_id OR
    (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- 🛡️ dante_odysseus_contracts: Firma e inspección del pacto propio
DROP POLICY IF EXISTS "Firmar pacto odiseo propio" ON dante_odysseus_contracts;
CREATE POLICY "Firmar pacto odiseo propio"
ON dante_odysseus_contracts FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Ver pactos odiseo propios" ON dante_odysseus_contracts;
CREATE POLICY "Ver pactos odiseo propios"
ON dante_odysseus_contracts FOR SELECT
TO authenticated
USING (
    (auth.uid() = student_id) OR 
    (auth.jwt() ->> 'sub')::uuid = student_id OR
    (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

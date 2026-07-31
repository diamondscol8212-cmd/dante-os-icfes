import { supabase } from './supabaseClient.js';

async function testFetch() {
  const { data, error } = await supabase
    .from('banco_items_irt')
    .select('area_general, sub_competencia, pregunta_texto, opciones_respuesta, recurso_visual')
    .limit(5);

  if (error) {
    console.error('❌ Error consultando Supabase:', error);
  } else {
    console.log('✅ Consulta exitosa! Muestra de 5 ítems:');
    console.dir(data, { depth: null });
  }
}

testFetch();
# views.py - Endpoint de Simulación de Estrés para Dante OS / VottoWin
from django.http import JsonResponse
from django.db import OperationalError

def simular_caida_base_datos(request):
    """
    ENDPOINT DE CONTROL (SANDBOX): Fuerza un error ERR-001 para verificar
    que el UnifiedExceptionMiddleware y el AlertDispatcher funcionen.
    """
    # Forzamos artificialmente la excepción de caída de conexión
    raise OperationalError("Fallo de conexión simulado: Postgres/Supabase connection pool timeout.")
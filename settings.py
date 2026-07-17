MIDDLEWARE = [
    # ... otros middlewares de Django (Seguridad, Sesiones, Auth) ...
    'django.middleware.common.CommonMiddleware',
    
    # Inyección del Middleware Unificado antes del procesamiento final de la vista
    'myapp.middleware.exceptions.UnifiedExceptionMiddleware', 
]

# Configuración del endpoint de la consola de control centralizada
OPERATIONS_CONSOLE_WEBHOOK = "https://api.vottowin.internal/v1/operations/alerts"
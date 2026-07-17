# urls.py
from django.urls import path
from .views import simular_caida_base_datos

urlpatterns = [
    # ... tus otras rutas ...
    path('api/test-fault-injection/', simular_caida_base_datos, name='test_fault_injection'),
]
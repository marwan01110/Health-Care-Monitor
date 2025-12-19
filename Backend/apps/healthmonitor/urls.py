from django.urls import path
from .views import (
    PatientListCreateView,
    PatientDetailView,
    MeasurementListCreateView,
    MeasurementDetailView,
    PredictionForMeasurementView
)

urlpatterns = [
    path('patients/', PatientListCreateView.as_view(), name='patients_list_create'),
    path('patients/<int:id>/', PatientDetailView.as_view(), name='patient_detail'),
    path('patients/<int:patient_id>/measurements/', MeasurementListCreateView.as_view(), name='measurements_create'),
    path('measurements/<int:id>/', MeasurementDetailView.as_view(), name='measurement_detail'),
    path('measurements/<int:measurement_id>/prediction/', PredictionForMeasurementView.as_view(), name='measurement_prediction'),
]

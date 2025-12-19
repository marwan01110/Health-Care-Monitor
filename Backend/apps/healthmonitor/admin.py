from django.contrib import admin
from .models import Patient, Measurement, Prediction
admin.site.register(Patient)
admin.site.register(Measurement)
admin.site.register(Prediction)

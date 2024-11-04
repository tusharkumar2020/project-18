from django.contrib import admin
from .models import CarModel, CarMake
# Register models here with their respective admins
admin.site.register(CarModel)
admin.site.register(CarMake)

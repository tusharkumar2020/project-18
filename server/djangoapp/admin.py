from django.contrib import admin
from .models import CarMake, CarModel

# Register your models here.

# CarModelInline class


# CarModelAdmin class
class CarModelAdmin():
    fields = ['name', 'type', 'year', 'car_make']          

# CarMakeAdmin class with CarModelInline
class CarMakeAdmin():
    fields = ['name', 'description']

# Register models here
admin.site.register(CarMake)
admin.site.register(CarModel)


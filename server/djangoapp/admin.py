# from django.contrib import admin
# from .models import related models

from django.contrib import admin
from .models import CarMake, CarModel
# Registering models with their respective admins


# Register your models here.
admin.site.register(CarMake)
admin.site.register(CarModel)

# CarModelInline class

# CarModelAdmin class

# CarMakeAdmin class with CarModelInline

# Register models here

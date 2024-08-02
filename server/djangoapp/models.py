# Uncomment the following imports before adding the Model code

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
# from django.contrib import admin
# from .models import CarMake, CarModel

# Registering models with their respective admins
# admin.site.register(CarMake)
# admin.site.register(CarModel)
# <HINT> Create a Car Make model `class CarMake(models.Model)`:
# - Name
# - Description
# - Any other fields you would like to include in car make model
# - __str__ method to print a car make object
from django.db import models

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    country_of_origin = models.CharField(max_length=100, blank=True, null=True)
    founded_year = models.IntegerField(blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
# <HINT> Create a Car Model model `class CarModel(models.Model):`:
# - Many-To-One relationship to Car Make model (One Car Make has many
# Car Models, using ForeignKey field)
# - Name
# - Type (CharField with a choices argument to provide limited choices
# such as Sedan, SUV, WAGON, etc.)
# - Year (IntegerField) with min value 2015 and max value 2023
# - Any other fields you would like to include in car model
# - __str__ method to print a car make object
class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Relación de varios a uno
    name = models.CharField(max_length=100)

    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('CONVERTIBLE', 'Convertible'),
        ('HATCHBACK', 'Hatchback'),
        ('TRUCK', 'Truck'),
        # Se pueden agregar más opciones según sea necesario
    ]
    type = models.CharField(max_length=12, choices=CAR_TYPES, default='SUV')

    year = models.IntegerField(
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ]
    )

    engine = models.CharField(max_length=100, blank=True, null=True)  # Tipo de motor
    fuel_type = models.CharField(max_length=50, blank=True, null=True)  # Tipo de combustible
    transmission = models.CharField(max_length=50, blank=True, null=True)  # Tipo de transmisión
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Precio del modelo

    def __str__(self):
        return f"{self.name} ({self.car_make.name})"  # Representación en cadena mostrando el modelo y la marca

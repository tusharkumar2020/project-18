# Uncomment the following imports before adding the Model code

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

# CarMake:
class CarMake(models.Model):

    name = models.CharField(
        max_length=100
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    country = models.CharField(
        max_length=100,
        blank=True
    )

    founded_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    website = models.URLField(
        blank=True
    )

    def __str__(self):
        return self.name


# CarModel:
class CarModel(models.Model):

    car_make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE
    )

    name = models.CharField(
        max_length=100
    )

    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('CONVERTIBLE', 'Convertible'),
        ('SUV', 'SUV'),
        ('VAN', 'Van'),
        ('PICKUP', 'Pickup'),
        ('HATCHBACK', 'Hatchback'),
    ]

    type = models.CharField(
        max_length=20,
        choices=CAR_TYPES,
        default='SUV'
    )

    year = models.IntegerField(
        default=2023,
        validators=[MaxValueValidator(2023), MinValueValidator(2015)]
    )

    ENGINE_TYPES = [
        ('PETROL', 'Benzin'),
        ('DIESEL', 'Diesel'),
        ('ELECTRIC', 'Elektro'),
        ('HYBRID', 'Hybrid'),
    ]

    engine_type = models.CharField(
        max_length=10,
        choices=ENGINE_TYPES,
        default='PETROL'
    )

    transmission = models.CharField(
        max_length=10,
        choices=[('AUTO', 'Automatik'), ('MANUAL', 'Manuell')],
        default='AUTO'
    )

    color = models.CharField(
        max_length=30,
        blank=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

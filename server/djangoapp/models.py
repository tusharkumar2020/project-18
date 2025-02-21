# Uncomment the following imports before adding the Model code

# from django.db import models
# from django.utils.timezone import now
# from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

# <HINT> Create a Car Make model `class CarMake(models.Model)`:
# - Name
# - Description
# - Any other fields you would like to include in car make model
# - __str__ method to print a car make object


# <HINT> Create a Car Model model `class CarModel(models.Model):`:
# - Many-To-One relationship to Car Make model (One Car Make has many
# Car Models, using ForeignKey field)
# - Name
# - Type (CharField with a choices argument to provide limited choices
# such as Sedan, SUV, WAGON, etc.)
# - Year (IntegerField) with min value 2015 and max value 2023
# - Any other fields you would like to include in car model
# - __str__ method to print a car make object
from django.db import models
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    """Model representing a car manufacturer."""
    name = models.CharField(max_length = 150, unique = True)
    description = models.TextField(blank=True, null = True) # Store NULL, if no description
    
    def __str__(self):
        return self.name

class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete = models.CASCADE) # Many to one relationship
    dealer_id = models.IntegerField()
    # Name should not be unique globally, but unique within a specific carmake
    name = models.CharField(max_length = 150)

    # Choices for the 'type' field
    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "Wagon"
    CAR_TYPE_CHOICES =[(SEDAN, "Sedan"), (SUV, "SUV"), (WAGON, "Wagon")]

    type = models.CharField(max_length=10, choices=CAR_TYPE_CHOICES, default = SEDAN)
    year = models.IntegerField(default = 2025,
        validators = [
            MaxValueValidator(2025),
            MinValueValidator(1960)
        ]
    )

    class Meta:
        unique_together = ('car_make','name') # Ensures uniqueness within each car brand
    
    def __str__(self):
        return self.name

    
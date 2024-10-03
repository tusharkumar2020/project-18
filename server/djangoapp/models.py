# Uncomment the following imports before adding the Model code

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100)  # Name of the car make
    description = models.TextField()  # Description of the car make

    def __str__(self):
        return f"Car Make: {self.name}"  # String representation of CarMake


# Create the CarModel model
class CarModel(models.Model):
    # Define car types
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    CAR_TYPE_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon')
    ]

    make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Foreign key to CarMake
    dealer_id = models.IntegerField()  # Dealer ID, linked to Cloudant or other dealer info
    name = models.CharField(max_length=100)  # Name of the car model
    car_type = models.CharField(max_length=20, choices=CAR_TYPE_CHOICES, default=SEDAN)  # Type of car
    year = models.DateField()  # Year the car model was made

    def __str__(self):
        return f"{self.make.name} {self.name} ({self.year.year})"  # String representation of CarModel

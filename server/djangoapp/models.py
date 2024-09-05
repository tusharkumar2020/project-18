from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

# CarMake model
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # You can add other fields like country or established year as needed

    def __str__(self):
        return self.name  # Return the name as the string representation of the object


# CarModel model
class CarModel(models.Model):
    # Many-to-one relationship to CarMake model
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  
    name = models.CharField(max_length=100)
    
    # Choices for car types
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more types if necessary
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')

    # Year field with validation
    year = models.IntegerField(
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ]
    )
    
    # Dealer ID (assuming it is an integer for now)
    dealer_id = models.IntegerField(null=True, blank=True)  # Made nullable for flexibility

    def __str__(self):
        # Return a string combining the car make and model name
        return f'{self.car_make.name} {self.name} ({self.year})'

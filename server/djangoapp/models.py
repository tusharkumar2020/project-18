
from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name        = models.CharField(max_length=100)
    description = models.TextField()
    created_at  = models.DateTimeField(default=now)

    def __str__(self):
        return self.name

class CarModel(models.Model):
    car_make  = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        related_name="models",
    )
    name      = models.CharField(max_length=100)
    dealer_id = models.IntegerField(
        null=True,      # ← allow NULL in the database
        blank=True,     # ← allow blank in forms (if you ever use ModelForm)
        help_text="ID of the dealer this model belongs to (from Cloudant)"
    )
    CAR_TYPES = [
        ("SEDAN", "Sedan"),
        ("SUV",   "SUV"),
        ("WAGON", "Wagon"),
        ("TRUCK", "Truck"),
        ("COUPE", "Coupe"),
        # …etc…
    ]
    type       = models.CharField(max_length=10, choices=CAR_TYPES, default="SEDAN")
    year       = models.IntegerField(
        validators=[MinValueValidator(2015), MaxValueValidator(2023)]
    )
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
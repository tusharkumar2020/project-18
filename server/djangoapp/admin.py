from django.contrib import admin
from .models import CarMake, CarModel

# Register your models here.

# CarModelInline class
class CarModelInline(admin.TabularInline): # Use TabularInline to sgow related models inline
    model = CarModel
    extra = 1 # Number of empty forms to display for adding new models

# CarModelAdmin class
@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ("name", "carmake", "type", "year", "dealer_id") #Field to display
    search_fields = ("name", "carmake__name") # Enable search
    list_filter = ("type", "year", "carmake") # Filters for easy access
    ordering = ("carmake", "name") # Order by brand then model name

# CarMakeAdmin class with CarModelInline
@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ("name", "description") # Display brand name and description
    search_fields = ("name",) # Search brands by name
    ordering = ("name",) # Sort brands alphabetically
    inlines = [CarModelInline] # Show related CarModels inline

# Register models here
#admin.site.register(CarMake)
#admin.site.register(CarModel)
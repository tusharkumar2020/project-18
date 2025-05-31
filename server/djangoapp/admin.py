from django.contrib import admin
from .models import CarMake, CarModel


# Register your models here.


class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'year')  # replace with your actual fields
    search_fields = ('name',)

class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name',)  # update based on your fields


# Register models here

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
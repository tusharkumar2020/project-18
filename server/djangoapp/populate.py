from .models import CarMake, CarModel
from datetime import date

def initiate():
    print("Starting data population...")

    # CarMake data
    car_make_data = [
        {"name": "NISSAN", "description": "Great cars. Japanese technology"},
        {"name": "Mercedes", "description": "Great cars. German technology"},
        {"name": "Audi", "description": "Great cars. German technology"},
        {"name": "Kia", "description": "Great cars. Korean technology"},
        {"name": "Toyota", "description": "Great cars. Japanese technology"},
    ]

    # Insert car makes
    car_make_instances = []
    for data in car_make_data:
        car_make = CarMake.objects.create(name=data['name'], description=data['description'])
        car_make_instances.append(car_make)
        print(f"Inserted CarMake: {car_make.name}")

    # CarModel data (ensure all fields including dealer_id are provided)
    car_model_data = [
        {"name":"Pathfinder", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[0], 'dealer_id' : "4"},
        {"name":"Qashqai", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[0], 'dealer_id' : "4"},
        {"name":"XTRAIL", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[0], 'dealer_id' : "4"},
        {"name":"A-Class", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[1], 'dealer_id' : "4"},
        {"name":"C-Class", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[1], 'dealer_id' : "4"},
        {"name":"E-Class", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[1], 'dealer_id' : "4"},
        {"name":"A4", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[2], 'dealer_id' : "3"},
        {"name":"A5", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[2], 'dealer_id' : "3"},
        {"name":"A6", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[2], 'dealer_id' : "3"},
        {"name":"Sorrento", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[3], 'dealer_id' : "2"},
        {"name":"Carnival", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[3], 'dealer_id' : "2"},
        {"name":"Cerato", "car_type":"Sedan", "year": "2023-01-01", "make":car_make_instances[3], 'dealer_id' : "2"},
        {"name":"Corolla", "car_type":"Sedan", "year": "2023-01-01", "make":car_make_instances[4], 'dealer_id' : "1"},
        {"name":"Camry", "car_type":"Sedan", "year": "2023-01-01", "make":car_make_instances[4], 'dealer_id' : "1"},
        {"name":"Kluger", "car_type":"SUV", "year": "2023-01-01", "make":car_make_instances[4],'dealer_id' : "1"},
    ]

    # Insert CarModels
    for data in car_model_data:
        try:
            car_model = CarModel.objects.create(
                name=data['name'],
                make=data['make'],  # ForeignKey to CarMake
                car_type=data['car_type'],
                year=data['year'],
                dealer_id=data['dealer_id']  # Ensure dealer_id is included
            )
            print(f"Inserted CarModel: {car_model.name} ({car_model.make.name})")
        except Exception as e:
            print(f"Failed to insert CarModel: {data['name']}. Error: {e}")

from .models import CarMake, CarModel

def initiate_car_makes():
    # Create a list of Car maker (CarMake)
    car_make_data = [
        {"name":"NISSAN", "description":"Great cars. Japanese technology"},
        {"name":"Mercedes", "description":"Great cars. German technology"},
        {"name":"Audi", "description":"Great cars. German technology"},
        {"name":"Kia", "description":"Great cars. Korean technology"},
        {"name":"Toyota", "description":"Great cars. Japanese technology"},
    ]
    # Create Car Maker Intances
    car_make_instances = []
    for data in car_make_data:
        car_make_instances.append(CarMake.objects.create(name=data['name'], description=data['description']))

def initiate_car_models():
    # Get the CarMake instances
    nissan = CarMake.objects.get(name="NISSAN")
    mercedes = CarMake.objects.get(name="Mercedes")
    audi = CarMake.objects.get(name="Audi")
    kia = CarMake.objects.get(name="Kia")
    toyota = CarMake.objects.get(name="Toyota")

    # Create CarModel instances with the corresponding Car Maker instances
    car_model_data = [
        {"name":"Pathfinder", "type":"SUV", "year": 2023, "car_make":nissan},
        {"name":"Qashqai", "type":"SUV", "year": 2023, "car_make":nissan},
        {"name":"XTRAIL", "type":"SUV", "year": 2023, "car_make":nissan},
        {"name":"A-Class", "type":"SUV", "year": 2023, "car_make":mercedes},
        {"name":"C-Class", "type":"SUV", "year": 2023, "car_make":mercedes},
        {"name":"E-Class", "type":"SUV", "year": 2023, "car_make":mercedes},
        {"name":"A4", "type":"SUV", "year": 2023, "car_make":audi},
        {"name":"A5", "type":"SUV", "year": 2023, "car_make":audi},
        {"name":"A6", "type":"SUV", "year": 2023, "car_make":audi},
        {"name":"Sorrento", "type":"SUV", "year": 2023, "car_make":kia},
        {"name":"Carnival", "type":"SUV", "year": 2023, "car_make":kia},
        {"name":"Cerato", "type":"Sedan", "year": 2023, "car_make":kia},
        {"name":"Corolla", "type":"Sedan", "year": 2023, "car_make":toyota},
        {"name":"Camry", "type":"Sedan", "year": 2023, "car_make":toyota},
        {"name":"Kluger", "type":"SUV", "year": 2023, "car_make":toyota},
    ]

    for data in car_model_data:
        CarModel.objects.create(
            name=data["name"],
            type=data["type"],
            year=data["year"],
            car_make=data["car_make"]
        )

def initiate():
    initiate_car_makes()
    initiate_car_models()

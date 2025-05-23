from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from datetime import datetime
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create a `login_user` view to handle sign in request
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['userName']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
        else:
            data = {"userName": username, "status": "Failed"}
        return JsonResponse(data)
    else:
        return JsonResponse({"status": "Only POST method allowed."}, status=405)

# Logout view
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)

# Registration view to handle user signup and auto login
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['userName']
            password = data['password']
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            email = data.get('email', '')

            if User.objects.filter(username=username).exists():
                return JsonResponse({"userName": username, "error": "Already Registered"})

            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            user.save()
            login(request, user)

            return JsonResponse({"userName": username, "status": "Authenticated"})
        except Exception as e:
            logger.error(f"Error during registration: {e}")
            return JsonResponse({"error": "Registration failed."}, status=400)
    else:
        return JsonResponse({"status": "Only POST method allowed."}, status=405)

# NEW: GET all car models
def get_cars(request):
    if request.method == 'GET':
        cars = CarModel.objects.all()
        results = []
        for car in cars:
            results.append({
                "id": car.id,
                "name": car.name,
                "type": car.type,
                "year": car.year,
                "dealer_id": car.dealer_id,
                "make": {
                    "id": car.car_make.id,
                    "name": car.car_make.name,
                    "description": car.car_make.description
                }
            })
        return JsonResponse(results, safe=False)
    else:
        return JsonResponse({"error": "Only GET method allowed."}, status=405)

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.contrib import messages
from datetime import datetime
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import CarMake, CarModel
from .populate import initiate

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    """
    Handle user login authentication.
    """
    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    except Exception as e:
        logger.error(f"Login error: {e}")
        return JsonResponse({"error": "Invalid request"}, status=400)

@require_http_methods(["GET"])
def get_cars(request):
    """
    Retrieve list of car models and their makes.
    """
    count = CarMake.objects.count()
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = [{"CarModel": cm.name, "CarMake": cm.car_make.name} for cm in car_models]
    return JsonResponse({"CarModels": cars})

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_http_methods(["GET", "POST"])
def logout_request(request):
    """
    Log out the current user.
    """
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return JsonResponse({"success": True})

@csrf_exempt
@require_http_methods(["POST"])
def registration(request):
    """
    Handle user registration.
    """
    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        if User.objects.filter(username=username).exists():
            return JsonResponse({"userName": username, "error": "Already Registered"}, status=409)
        user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=email)
        user.save()
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return JsonResponse({"error": "Invalid request"}, status=400)

@require_http_methods(["GET"])
def get_dealerships(request):
    """
    Return a list of dealerships.
    """
    dealerships = [
        {"id": 1, "full_name": "Dealer One", "city": "City A", "address": "123 Main St", "zip": "12345", "state": "State A"},
        {"id": 2, "full_name": "Dealer Two", "city": "City B", "address": "456 Elm St", "zip": "67890", "state": "State B"},
    ]
    return JsonResponse({"dealerships": dealerships})

@require_http_methods(["GET"])
def get_dealer_reviews(request, dealer_id):
    """
    Return reviews for a specific dealer.
    """
    reviews = [
        {"review_id": 1, "dealer_id": dealer_id, "review": "Great service!", "rating": 5},
        {"review_id": 2, "dealer_id": dealer_id, "review": "Average experience.", "rating": 3},
    ]
    return JsonResponse({"reviews": reviews})

@require_http_methods(["GET"])
def get_dealer_details(request, dealer_id):
    """
    Return details for a specific dealer.
    """
    dealer = {"id": dealer_id, "name": "Dealer Name", "city": "City X", "address": "123 Main St"}
    return JsonResponse({"dealer": dealer})

@csrf_exempt
@require_http_methods(["POST"])
def add_review(request):
    """
    Add a review for a dealer.
    """
    try:
        data = json.loads(request.body)
        dealer_id = data.get('dealer_id')
        review_text = data.get('review')
        rating = data.get('rating')
        user = request.user if request.user.is_authenticated else None

        logger.info(f"Review added for dealer {dealer_id} by user {user}: {review_text} (Rating: {rating})")

        return JsonResponse({"message": "Review submitted successfully."})
    except Exception as e:
        logger.error(f"Add review error: {e}")
        return JsonResponse({"message": "Invalid request."}, status=400)

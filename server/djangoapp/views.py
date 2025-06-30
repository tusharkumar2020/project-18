# Corrected version of views.py

# from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
# from datetime import datetime
import logging
import json
from .populate import initiate
from .models import CarModel  # ,CarMake
from .restapis import get_request, analyze_review_sentiments, post_review

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.


@csrf_exempt
def login_user(request):
    """
    Handles user login requests.
    """
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    return JsonResponse({"userName": username, "status": "Failed"})


def logout_request(request):
    """
    Handles user logout requests.
    """
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    """
    Handles user registration requests.
    """
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')

    try:
        User.objects.get(username=username)
        return JsonResponse({
            "userName": username,
            "error": "Already Registered"
        })
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})


@csrf_exempt
def get_dealerships(request, state="All"):
    """
    Fetches dealerships, optionally filtered by state.
    """
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_reviews(request, dealer_id):
    """
    Fetches and analyzes reviews for a dealer.
    """
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        for review_detail in reviews:
            sentiment_response = analyze_review_sentiments(
                review_detail['review']
            )
            review_detail['sentiment'] = sentiment_response.get('sentiment')
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_details(request, dealer_id):
    """
    Fetches details for a specific dealer.
    """
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def add_review(request):
    """
    Handles adding reviews by authenticated users.
    """
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception as e:
            logger.error(f"Error in posting review: {str(e)}")
            return JsonResponse(
                {"status": 401,
                 "message": "Error in posting review"}
            )
    return JsonResponse({"status": 403, "message": "Unauthorized"})


def get_cars(request):
    """
    Fetches registered cars.
    """
    if not CarModel.objects.exists():
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = [{
        "CarModel": car_model.name,
        "CarMake": car_model.car_make.name
    } for car_model in car_models]
    return JsonResponse({"CarModels": cars})

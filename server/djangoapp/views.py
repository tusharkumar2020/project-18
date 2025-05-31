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
from .models import CarMake, CarModel, Review
from .populate import initiate
from django.views.decorators.cache import never_cache
from django.conf import settings
import os

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    """Handle user login authentication."""
    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    except Exception as e:
        logger.error(f"Login error: {e}")
        return JsonResponse({"error": "Invalid request"}, status=400)

@require_http_methods(["GET"])
def get_cars(request):
    """Retrieve list of car models and their makes."""
    if CarMake.objects.count() == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = [{"CarModel": cm.name, "CarMake": cm.car_make.name} for cm in car_models]
    return JsonResponse({"CarModels": cars})

@require_http_methods(["GET"])
def get_carmakes(request):
    """Retrieve list of distinct car makes."""
    if CarMake.objects.count() == 0:
        initiate()
    car_makes = CarMake.objects.all()
    makes = [cm.name for cm in car_makes]
    return JsonResponse({"CarMakes": makes})

@csrf_exempt
@require_http_methods(["GET", "POST"])
def logout_request(request):
    """Log out the current user."""
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return JsonResponse({"success": True})

@csrf_exempt
@require_http_methods(["POST"])
def registration(request):
    """Handle user registration."""
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

from .restapis import get_request

@require_http_methods(["GET"])
def get_dealerships(request):
    """Return a list of dealerships fetched from external backend service."""
    json_result = get_request("/fetchDealers")
    if json_result:
        return JsonResponse({"status": 200, "dealers": json_result})
    return JsonResponse({"status": 500, "dealers": []})

@require_http_methods(["GET"])
def get_dealer_reviews(request, dealer_id):
    """Return reviews for a specific dealer."""
    try:
        reviews_qs = Review.objects.filter(dealer_id=dealer_id).order_by('-created_at')
        reviews = []
        for r in reviews_qs:
            reviews.append({
                "review_id": r.id,
                "dealer_id": r.dealer_id,
                "name": r.name,
                "review": r.review,
                "rating": r.rating,
                "purchase": r.purchase,
                "purchase_date": r.purchase_date,
                "car_make": r.car_make,
                "car_model": r.car_model,
                "car_year": r.car_year,
                "created_at": r.created_at.isoformat(),
            })
        return JsonResponse({"reviews": reviews})
    except Exception as e:
        logger.error(f"Get dealer reviews error: {e}")
        return JsonResponse({"reviews": []}, status=500)

@require_http_methods(["GET"])
def get_dealer_details(request, dealer_id):
    """Return details for a specific dealer."""
    dealer = {"id": dealer_id, "name": "Dealer Name", "city": "City X", "address": "123 Main St"}
    return JsonResponse({"dealer": dealer})

@csrf_exempt
@require_http_methods(["POST"])
def add_review(request, dealer_id):
    """Add a review for a dealer."""
    try:
        data = json.loads(request.body)
        review_text = data.get('review')
        rating = data.get('rating')
        name = data.get('name', 'Anonymous')
        purchase = data.get('purchase', True)
        purchase_date = data.get('purchase_date', None)
        car_make = data.get('car_make', None)
        car_model = data.get('car_model', None)
        car_year = data.get('car_year', None)
        user = request.user if request.user.is_authenticated else None

        # Save the review to the database
        review_obj = Review(
            dealer_id=dealer_id,
            name=name,
            review=review_text,
            rating=rating,
            purchase=purchase,
            purchase_date=purchase_date,
            car_make=car_make,
            car_model=car_model,
            car_year=car_year,
        )
        review_obj.save()

        logger.info(f"Review added for dealer {dealer_id} by user {user}: {review_text} (Rating: {rating})")

        return JsonResponse({"status": 200, "message": "Review submitted successfully."})
    except Exception as e:
        logger.error(f"Add review error: {e}")
        return JsonResponse({"status": 400, "message": "Invalid request."}, status=400)

from django.http import FileResponse

@never_cache
def serve_react_app(request):
    try:
        with open(os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse(
            "React build not found. Please build the frontend first.",
            status=501,
        )

# Removed obsolete static HTML serving views as React components now handle these pages

# def home_page(request):
#     return FileResponse(open(os.path.join(settings.BASE_DIR, 'frontend', 'static', 'Home.html'), 'rb'))

# def about_page(request):
#     return FileResponse(open(os.path.join(settings.BASE_DIR, 'frontend', 'static', 'About.html'), 'rb'))

# def contact_page(request):
#     return FileResponse(open(os.path.join(settings.BASE_DIR, 'frontend', 'static', 'Contact.html'), 'rb'))

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.contrib import messages
from datetime import datetime
import logging
import json
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        data = {"userName": username}
        if user is not None:
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
        else:
            data = {"error": "Invalid credentials"}
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "GET method not allowed"}, status=405)

from django.http import JsonResponse

def logout_request(request):
    logout(request)
    data = {"success": True}
    messages.info(request, "You have successfully logged out.")
    return JsonResponse(data)

@csrf_exempt
def registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        username_exist = False
        try:
            User.objects.get(username=username)
            username_exist = True
        except User.DoesNotExist:
            logger.debug(f"{username} is new user")

        if not username_exist:
            user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=email)
            user.save()
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
            return JsonResponse(data)
        else:
            data = {"userName": username, "error": "Already Registered"}
            return JsonResponse(data)
    else:
        return JsonResponse({"error": "Invalid method."}, status=405)

def get_dealerships(request):
    dealerships = [
        {"id": 1, "name": "Dealer One", "city": "City A"},
        {"id": 2, "name": "Dealer Two", "city": "City B"},
    ]
    return JsonResponse({"dealerships": dealerships})

def get_dealer_reviews(request, dealer_id):
    reviews = [
        {"review_id": 1, "dealer_id": dealer_id, "review": "Great service!", "rating": 5},
        {"review_id": 2, "dealer_id": dealer_id, "review": "Average experience.", "rating": 3},
    ]
    return JsonResponse({"reviews": reviews})

def get_dealer_details(request, dealer_id):
    dealer = {"id": dealer_id, "name": "Dealer Name", "city": "City X", "address": "123 Main St"}
    return JsonResponse({"dealer": dealer})

@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        dealer_id = data.get('dealer_id')
        review_text = data.get('review')
        rating = data.get('rating')
        user = request.user if request.user.is_authenticated else None

        logger.info(f"Review added for dealer {dealer_id} by user {user}: {review_text} (Rating: {rating})")

        return JsonResponse({"message": "Review submitted successfully."})
    else:
        return JsonResponse({"message": "Invalid method."}, status=405)

# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime
# Remove unused imports and fix import order
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json 
from .populate import initiate
from .models import CarMake, CarModel, Dealership, Review
from .restapis import get_request, analyze_review_sentiments, post_review
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError 


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if(count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name, "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels":cars})

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request
def logout_user(request):
    logout(request)
    data = {"userName":""}
    return JsonResponse(data)

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    context = {}
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))
    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name,password=password, email=email)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName":username,"status":"Authenticated"}
        return JsonResponse(data)
    else :
        data = {"userName":username,"error":"Already Registered"}
        return JsonResponse(data)

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request, state="All"):
 #   if(state == "All"):
 #       endpoint = "/fetchDealers"
 #   else:
 #       endpoint = "/fetchDealers/"+state
 #   dealerships = get_request(endpoint)
 #   return JsonResponse({"status":200,"dealers":dealerships})

def get_dealerships(request, state="All"):
    if state == "All":
        dealerships = Dealership.objects.all()
    else:
        dealerships = Dealership.objects.filter(state__iexact=state)

    dealerships_data = list(dealerships.values(
        'id', 'city', 'state', 'st', 'address', 'zip_code', 'latitude', 'longitude', 'short_name', 'full_name'
    ))

    return JsonResponse({"status": 200, "dealers": dealerships_data})
 
# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
#def get_dealer_reviews(request, dealer_id):
  #  # if dealer id has been provided
  #  if(dealer_id):
   #     endpoint = "/fetchReviews/dealer/"+str(dealer_id)
    #    reviews = get_request(endpoint)
    #    for review_detail in reviews:
     #       response = analyze_review_sentiments(review_detail['review'])
     #       print(response)
      #      review_detail['sentiment'] = response['sentiment']
      #  return JsonResponse({"status":200,"reviews":reviews})
   # else:
   #     return JsonResponse({"status":400,"message":"Bad Request"})

def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        reviews = Review.objects.filter(dealership=dealer_id)
        reviews_list = []
        for review in reviews:
            review_detail = {
                "id": review.id,
                "name": review.name,
                "dealership": review.dealership,
                "review": review.review,
                "purchase": review.purchase,
                "purchase_date": review.purchase_date,
                "car_make": review.car_make,
                "car_model": review.car_model,
                "car_year": review.car_year,
                "sentiment": "Positive"
                #analyze_review_sentiments(review.review)["sentiment"]
            }
            reviews_list.append(review_detail)
        return JsonResponse({"status": 200, "reviews": reviews_list})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})
 
# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
def get_dealer_details(request, dealer_id):
    if(dealer_id):
        endpoint = "/fetchDealer/"+str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status":200,"dealer":dealership})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

# Create a `add_review` view to submit a review
#@csrf_exempt
#def add_review(request):
 #   if(request.user.is_anonymous == False):
  #      data = json.loads(request.body)
  #      try:
  #          response = post_review(data)
  #          return JsonResponse({"status":200})
  #      except:
   #         return JsonResponse({"status":401,"message":"Error in posting review"})
   # else:
   #     return JsonResponse({"status":403,"message":"Unauthorized"})

def fetchDealers(request, state="All"):
    # Query all dealerships
    if state == "All":
        dealerships = Dealership.objects.all()
    else:
        dealerships = Dealership.objects.filter(state__iexact=state)
    # Serialize the data
    dealerships_data = list(dealerships.values(
        'id', 'city', 'state', 'st', 'address', 'zip', 'lat', 'long', 'short_name', 'full_name'
    ))
    return JsonResponse({"dealerships": dealerships_data})

def post_review(data):
    try:
        # Extract data from the JSON input
        name = data.get("name")
        dealership_id = data.get("dealership")
        review_text = data.get("review")
        purchase = data.get("purchase")
        purchase_date = data.get("purchase_date")
        car_make = data.get("car_make")
        car_model = data.get("car_model")
        car_year = data.get("car_year")

        # Create a new review entry
        review = Review(
            name=name,
            dealership_id=dealership_id,
            review=review_text,
            purchase=purchase,
            purchase_date=purchase_date,
            car_make=car_make,
            car_model=car_model,
            car_year=car_year
        )
        review.save()  # Save to the database
        return {"status": "success", "review_id": review.id}
    except IntegrityError as e:
        # Handle integrity errors (e.g., unique constraint violations)
        return {"status": "error", "message": "Database integrity error", "error": str(e)}
    except Exception as e:
        # Handle any other exceptions
        return {"status": "error", "message": "An error occurred", "error": str(e)}

@csrf_exempt
def add_review(request):
    if not request.user.is_anonymous:
        try:
            data = json.loads(request.body)
            response = post_review(data)
            return JsonResponse({"status": 200})
        except IntegrityError as e:
            return JsonResponse({"status": 401, "message": "Error in posting review", "error": str(e)})
        except Exception as e:
            return JsonResponse({"status": 500, "message": "An internal server error occurred", "error": str(e)})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})







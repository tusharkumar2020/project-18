# Uncomment the required imports before adding the code
from django.contrib.auth.models import User
from django.contrib.auth import logout

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate

# MODEL IMPORTS:
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments

# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# LOGIN VIEW
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("userName")
            password = data.get("password")
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse(
                    {"userName": username, "status": "Authenticated"}
                )
            else:
                return JsonResponse(
                    {"error": "Invalid credentials"},
                    status=401
                )
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON"},
                status=400
            )
        except KeyError:
            return JsonResponse(
                {"error": "Missing username or password"},
                status=400
            )
    else:
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )


# Logout:
# #############################################################################

@csrf_exempt
def logout_user(request):
    if request.method in ["POST", "GET"]:
        logout(request)  # Django killt die Session
        return JsonResponse({"userName": ""})
    else:
        return JsonResponse({"error": "POST request required"}, status=405)


# Registration:
# #############################################################################

@csrf_exempt
def registration(request):

    # Load JSON data from the request body
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    try:
        # Check if the user already exists
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))

    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name, password=password,
            email=email
        )
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


# Dealerships:
# #############################################################################

def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# Dealer Details:
# #############################################################################

def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Dealer Reviews:
# #############################################################################

def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            if response and 'sentiment' in response:
                review_detail['sentiment'] = response['sentiment']
            else:
                review_detail['sentiment'] = 'unknown'
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Add Review:
# #############################################################################

def add_review(request):

    if not request.user.is_anonymous:
        try:
            return JsonResponse({"status": 200})
        except Exception as e:
            logger.error(f"Error posting review: {e}")
            return JsonResponse(
                {"status": 401, "message": "Error in posting review"})

    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})


# GET CARS:
# #############################################################################
def get_cars(request):

    count = CarMake.objects.filter().count()

    print(count)

    if (count == 0):
        initiate()

    car_models = CarModel.objects.select_related('car_make')

    cars = []

    for car_model in car_models:
        cars.append(
            {"CarModel": car_model.name, "CarMake": car_model.car_make.name}
        )
    return JsonResponse({"CarModels": cars})

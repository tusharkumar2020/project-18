from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import logging
import json
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, post_review
from .models import CarMake, CarModel

# Configurar el logger
logger = logging.getLogger(__name__)

# View para obtener los coches
def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = [{"CarModel": car_model.name, "CarMake": car_model.car_make.name} for car_model in car_models]
    return JsonResponse({"CarModels": cars})

# View para manejar el inicio de sesión
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"userName": username, "status": "Authenticated"})
            else:
                return JsonResponse({"userName": username, "status": "Failed"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return JsonResponse({"error": "An error occurred during login"}, status=500)
    else:
        return JsonResponse({"error": "This endpoint only accepts POST requests"}, status=405)

# View para manejar el cierre de sesión
def logout_request(request):
    logout(request)
    return JsonResponse({"status": "Logged out"})

# View para manejar el registro de usuarios
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')

            if User.objects.filter(username=username).exists():
                return JsonResponse({"userName": username, "error": "Already Registered"}, status=400)

            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                password=password,
                email=email
            )
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return JsonResponse({"error": "An error occurred during registration"}, status=500)
    else:
        return JsonResponse({"error": "This endpoint only accepts POST requests"}, status=405)

# View para obtener concesionarios
def get_dealerships(request, state="All"):
    endpoint = f"/fetchDealers/{state}" if state != "All" else "/fetchDealers"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})

# View para obtener detalles del concesionario
def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})

# View para obtener reseñas del concesionario
def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        try:
            reviews = get_request(endpoint)
            if not isinstance(reviews, list):
                return JsonResponse({"status": 500, "message": "Error fetching reviews."})
            for review_detail in reviews:
                if 'review' in review_detail:
                    response = analyze_review_sentiments(review_detail['review'])
                    review_detail['sentiment'] = response.get('sentiment', 'No sentiment available')
                else:
                    review_detail['sentiment'] = 'No sentiment available'
            return JsonResponse({"status": 200, "reviews": reviews})
        except Exception as e:
            logger.error(f"Error fetching dealer reviews: {str(e)}")
            return JsonResponse({"status": 500, "message": str(e)})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})

# View para añadir una reseña
def add_review(request):
    if not request.user.is_anonymous:
        try:
            data = json.loads(request.body)
            response = post_review(data)
            return JsonResponse({"status": 200, "message": "Review posted successfully"})
        except Exception as e:
            logger.error(f"Error posting review: {str(e)}")
            return JsonResponse({"status": 401, "message": "Error in posting review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})

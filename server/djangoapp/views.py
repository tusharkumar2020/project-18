# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review


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


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        response_data['status'] = "Authenticated"
        response_data['message'] = "Login successful."
        #logger.info(f"User{username} logged in successfully.")
        #data = {"userName": username, "status": "Authenticated"}
    else:
        response_data['status'] = "Failed"
        response_data['message'] = "Login failed. Check username and password."
    return JsonResponse(response_data)



# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"userName":""}
    return JsonResponse(data)

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Username a already registered"},status=409)
    if User.objects.filter(email=email).exists():
        return JsonResponse({"email":email,"error":"Email already registered"},status=409)
    
    user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
    login(request,user)
    return JsonResponse({"userName": username, "status": "Authenticated"}, status=201)


# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
#Update the `get_dealerships` render list of dealerships all by default, particular state if state is passed
def get_dealerships(request, state="All"):
    if(state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    # endpoint = "/fetchDealers" if state == "All" else "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status":200,"dealers":dealerships})

# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request,dealer_id):
    if (dealer_id):
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status": 200,"reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message" : "Enter a valid ID"})


    


# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    if (dealer_id):
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200,"dealer":dealership})
    else:
        return JsonResponse({"status": 400, "message" : "Enter a valid ID"})

# Create a `add_review` view to submit a review
# 定义 Django 视图函数 add_review，接受一个 HttpRequest 对象作为参数
def add_review(request):
    # 检查当前用户是否已经登录，使用 Django 内置的 user 对象的 is_anonymous 属性判断
    if(request.user.is_anonymous == False):  # 如果用户已登录
        # 从请求体中解析 JSON 数据
        data = json.loads(request.body)
        try:
            # 尝试通过 post_review 函数将解析得到的数据发送到指定的后端服务
            response = post_review(data)
            # 如果调用成功，返回一个 JsonResponse 对象，状态码为 200，表示成功处理
            return JsonResponse({"status": 200})
        except:
            # 如果在 post_review 过程中发生异常，返回一个 JsonResponse 对象，状态码为 401，带有错误信息
            return JsonResponse({"status": 401, "message": "Error in posting review"})
    else:
        # 如果用户未登录，返回一个 JsonResponse 对象，状态码为 403，表示未授权访问
        return JsonResponse({"status": 403, "message": "Unauthorized"})



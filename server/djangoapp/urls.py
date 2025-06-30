from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),
    path('register/', views.registration, name='register'),
    path('cars/', views.get_cars, name='get_cars'),
    path('get_dealers/', view=views.get_dealerships, name='get_dealers'),
    path(
        'get_dealers/<str:state>/',
        views.get_dealerships,
        name='get_dealers_by_state'
    ),
    path(
        'dealer/<int:dealer_id>/',
        views.get_dealer_details,
        name='get_dealer_details'
    ),
    path(
        'dealer/<int:dealer_id>/reviews/',
        views.get_dealer_reviews,
        name='get_dealer_reviews'
    ),
    path(
        'dealer/<int:dealer_id>/postreview/',
        views.add_review,
        name='add_review'
    ),
]

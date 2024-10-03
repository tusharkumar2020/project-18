# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Path for login view
    path('login/', views.login_user, name='login'),

    # Path for logout view
    path('logout/', views.logout_request, name='logout'),

    # Path for registration view
    path('register/', views.registration, name='register'),


    path('get_cars/', views.get_cars, name ='getcars'),

    path('get_dealers', views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),

    # Route for getting dealer details
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),

    # Route for getting dealer reviews
    path('reviews/<int:dealer_id>', views.get_dealer_reviews, name='dealer_reviews'),

    path('add_review/', views.add_review, name='add_review'),

    # Paths for dealer reviews and other views can go here
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

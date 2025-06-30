from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # User Authentication
    path('register/', views.registration, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),

    # Local Car Models
    path('get_cars/', views.get_cars, name='getcars'),

    # Dealership Endpoints
    path('get_dealers/', views.get_dealerships, name='get_dealers'),

    path('get_dealers/<str:state>/', views.get_dealerships, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details'),

    # Review Endpoints
    path('reviews/dealer/<int:dealer_id>/', views.get_dealer_reviews, name='dealer_reviews'),
    path('add_review/', views.add_review, name='add_review'),
]

# Static and media URL config
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

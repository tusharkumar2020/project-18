from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # path for root URL serving React frontend build
    path('', views.serve_react_app, name='home'),

    # path for registration
    path('register/', views.registration, name='registration'),

    # path for login
    path('login/', views.login_user, name='login'),

    # path for logout
    path('logout/', views.logout_request, name='logout'),

    # path for dealer reviews view
    path('dealer/<int:dealer_id>/reviews/', views.get_dealer_reviews, name='dealer_reviews'),

    # path for add a review view
    path('dealer/<int:dealer_id>/add_review/', views.add_review, name='add_review'),

    # path for get dealerships
    path('dealerships/', views.get_dealerships, name='dealerships'),

    # path for get dealer details
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details'),

    path('get_cars', views.get_cars, name='getcars'),
    path('get_carmakes', views.get_carmakes, name='getcarmakes'),

    path('get_dealers', views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

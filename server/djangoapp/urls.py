# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Registration:
    path(
        route='register',
        view=views.registration,
        name='register'
    ),

    # Login
    path(
        route='login',
        view=views.login_user,
        name='login'
    ),

    # Logout
    path(
        route='logout',
        view=views.logout_user,
        name='logout'
    ),

    # GET CARS:
    path(
        route='get_cars',
        view=views.get_cars,
        name='getcars'
    ),

    # Dealerships:
    path(
        route='get_dealers',
        view=views.get_dealerships,
        name='get_dealers'
    ),

    # Dealershops by state:
    path(
        route='get_dealers/<str:state>',
        view=views.get_dealerships,
        name='get_dealers_by_state'
    ),

    # Dealer Details:
    path(
        route='dealer/<int:dealer_id>',
        view=views.get_dealer_details,
        name='dealer_details'
    ),
    # Dealer Reviews:
    path(
        route='reviews/dealer/<int:dealer_id>',
        view=views.get_dealer_reviews,
        name='dealer_details'
    ),

    # Add Review:
    path(
        route='add_review',
        view=views.add_review,
        name='add_review'
    ),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

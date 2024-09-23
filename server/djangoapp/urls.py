from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Uncomment or add any other necessary paths

    # Path for login
    path(route='login', view=views.login_user, name='login'),

    # Path for logout
    path(route='logout', view=views.logout_request, name='logout'),

    # Path for registration
    path(route='register', view=views.registration, name='register'),
    
    # Add other paths as needed for dealer reviews or adding a review
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


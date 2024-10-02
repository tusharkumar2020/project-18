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

    # Paths for dealer reviews and other views can go here
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

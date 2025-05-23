from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Path for user registration
    path('register/', views.registration, name='register'),

    # Path for user login
    path('login/', views.login_user, name='login'),

    # Path for user logout
    path('logout/', views.logout_request, name='logout'),

    # Future: Paths for dealer reviews and adding review
]

# Serving media files during development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Path for registration
    path(route='registration/', view=views.registration, name='registration'),  # Ensure to include trailing slash

    # Path for login
    path(route='login/', view=views.login_user, name='login'),  # Ensure to include trailing slash

    # Path for logout
    path(route='logout/', view=views.logout_request, name='logout'),  # Ensure to include trailing slash

    # Additional paths can be added here
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

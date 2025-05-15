from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from djangoapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('about/', TemplateView.as_view(template_name="About.html")),
    path('contact/', TemplateView.as_view(template_name="Contact.html")),
    path('', TemplateView.as_view(template_name="Home.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),  # Serve login page on GET
    path('register/', TemplateView.as_view(template_name="index.html")),  # Serve registration page on GET
    path('djangoapp/login', views.login_user, name='login'),  # API endpoint for login POST
    path('djangoapp/register', views.registration, name='registration'),  # API endpoint for registration POST
    path('logout/', views.logout_request, name='logout'),
    path('dealerships/', views.get_dealerships, name='dealerships'),
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details'),
    path('dealer/<int:dealer_id>/reviews/', views.get_dealer_reviews, name='dealer_reviews'),
    path('dealer/<int:dealer_id>/add_review/', views.add_review, name='add_review'),
    path('djangoapp/', include('djangoapp.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from djangoapp import views
import os
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def serve_react_app(request, *args, **kwargs):
    try:
        with open(os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse("React app not built", status=501)

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('about/', views.about, name='about'),
    # path('contact/', views.contact, name='contact'),
    # path('', views.index, name='index'),
    path('djangoapp/login', views.login_user, name='login'),  # API endpoint for login POST
    path('djangoapp/register', views.registration, name='registration'),  # API endpoint for registration POST
    path('logout/', views.logout_request, name='logout'),
    path('djangoapp/logout/', views.logout_request, name='djangoapp_logout'),
    path('dealerships/', views.get_dealerships, name='dealerships'),
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details'),
    path('dealer/<int:dealer_id>/reviews/', views.get_dealer_reviews, name='dealer_reviews'),
    path('dealer/<int:dealer_id>/add_review/', views.add_review, name='add_review'),
    path('djangoapp/', include('djangoapp.urls')),
    # path('login/', serve_react_app),  # Serve React login page
    # path('register/', serve_react_app),  # Serve React register page
    path('dealers/', serve_react_app),  # Serve React dealers page
    path('dealer/<int:dealer_id>', serve_react_app),
    path('postreview/<int:dealer_id>', serve_react_app),
]

# Serve static and media files in development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all route to serve React app for other frontend routes, excluding static and media
# Move catch-all route to the end to avoid intercepting API calls
urlpatterns += [
    re_path(r'^(?!static/|media/|djangoapp/).*$', serve_react_app),
]

# Serve React app only at root URL
# urlpatterns += [
#     path('', serve_react_app),
# ]
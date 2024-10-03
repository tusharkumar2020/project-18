from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Admin path
    path('admin/', admin.site.urls),
    
    # Include djangoapp URLs
    path('djangoapp/', include('djangoapp.urls')),
    
    # Paths for React app (all point to React's index.html)
    path('register/', TemplateView.as_view(template_name="index.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('contact/', TemplateView.as_view(template_name="index.html")),
    path('about/', TemplateView.as_view(template_name="index.html")),
    
    # Root URL should also point to React's index.html
    path('', TemplateView.as_view(template_name="index.html")),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

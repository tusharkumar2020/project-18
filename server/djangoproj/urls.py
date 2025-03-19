1| """djangoproj URL Configuration
2| 
3| The `urlpatterns` list routes URLs to views. For more information please see:
4|     https://docs.djangoproject.com/en/3.2/topics/http/urls/
5| Examples:
6| Function views
7|     1. Add an import:  from my_app import views
8|     2. Add a URL to urlpatterns:  path('', views.home, name='home')
9| Class-based views
10|     1. Add an import:  from other_app.views import Home
11|     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
12| Including another URLconf
13|     1. Import the include() function: from django.urls import include, path
14|     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
15| """
16| from django.contrib import admin
17| from django.urls import path, include
18| from django.views.generic import TemplateView
19| from django.conf.urls.static import static
20| from django.conf import settings
21| 
22| urlpatterns = [
23|     path('admin/', admin.site.urls),
24|     path('djangoapp/', include('djangoapp.urls')),
25|     path('', TemplateView.as_view(template_name="Home.html")),
26|     path('about/', TemplateView.as_view(template_name="About.html")),
27|     path('contact/', TemplateView.as_view(template_name="Contact.html")),
28|     path('login/', TemplateView.as_view(template_name="index.html")),
29|     path('register/', TemplateView.as_view(template_name="index.html")),
30|     path('dealers/', TemplateView.as_view(template_name="index.html")),
31|     path('dealer/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),
32|     path('postreview/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),
33| ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
34| 
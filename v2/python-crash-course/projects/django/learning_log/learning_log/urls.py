"""learning_log URL Configuration

projects/django/learning_log/learning_log/urls.py


The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

# defines urls accessible, 1st argument being subpath's root
urlpatterns = [

    # default
    path('admin/', admin.site.urls),

    # my schemas
    path('users/', include('users.urls')),
    path('', include('learning_logs.urls')),
]

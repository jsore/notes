"""
Supplementary url patterns for user account functionality.
Defines URL patterns for users endpoint.

projects/django/learning_log/users/urls.py
"""

from django.urls import path, include

from . import views


app_name = 'users'

urlpatterns = [

    # example view paths for the 'users' namespace:
    #   url.com/users/login
    #   url.com/users/logout

    # default auth urls that Django has defined
    path('', include('django.contrib.auth.urls')),

    # user registration page
    path('register/', views.register, name='register'),

]

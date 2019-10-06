"""
Defines URL patterns for learning_logs.

projects/django/learning_log/learning_logs/urls.py

Take note of the plural on _logs, this is not the default urls.py
"""

from django.urls import path

from . import views

# help Django distinguish this urls.py from other app's urls.py
# within this same project
app_name = 'learning_logs'

urlpatterns = [

    # home page
    path('', views.index, name='index'),
]

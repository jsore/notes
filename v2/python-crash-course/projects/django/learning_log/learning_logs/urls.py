"""
Defines URL patterns for learning_logs.

projects/django/learning_log/learning_logs/urls.py

Take note of the plural on _logs, this is not the default urls.py
"""

# path() method provides the actual URL pattern
from django.urls import path

from . import views


# this project's Namespace
#
# help Django distinguish this urls.py from other app's urls.py
# within this same project
app_name = 'learning_logs'


# forwards requests with a matching URL to methods from views.py
urlpatterns = [

    # path(
    #     'url_to_match',
    #     function_to_call_from_views.py,
    #     name_of_this_url_pattern='use_this_to_reference_this_url'
    #)

    # home page
    path('', views.index, name='index'),

    # shows all topics
    path('topics/', views.topics, name='topics'),

    # details for specific topic, stores topic ID in topic_id
    path('topics/<int:topic_id>/', views.topic, name='topic'),
]

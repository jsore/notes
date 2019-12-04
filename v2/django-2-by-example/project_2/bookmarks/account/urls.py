# …/project_2/bookmarks/account/urls.py
#
# url schema the 'account' application requires for requests
# routed to this app from the 'bookmarks' project


from django.urls import path
from . import views


urlpatterns = [

    # POST views
    path('login/', views.user_login, name='login'),
]

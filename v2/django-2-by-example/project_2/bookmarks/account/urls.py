# …/project_2/bookmarks/account/urls.py
#
# url schema the 'account' application requires for requests
# routed to this app from the 'bookmarks' project


from django.urls import path
# Django's baked-in user authorization/management views
from django.contrib.auth import views as auth_views

from . import views


urlpatterns = [

    # POST views

    # hand-rolled view as an example
    # path('login/', views.user_login, name='login'),
    # using Django's builtin views, these views expect to
    # find their templates in a directory called
    # 'templates/registration' by default
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('password_change/',
         auth_views.PasswordChangeView.as_view(),
         name='password_change'),
    path('password_change/done/',
         auth_views.PasswordChangeDoneView.as_view(),
         name='password_change_done'),

    path('password_reset',
         auth_views.PasswordResetView.as_view(),
         name='password_reset'),
    path('password_reset/done',
         auth_views.PasswordResetDoneView.as_view(),
         name='password_reset_done'),
    path('reset/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('reset/done',
         auth_views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),

    path('', views.dashboard, name='dashboard'),
]

# …/blog/packtblog/blog/urls.py

from django.urls import path
from . import views


# define a namespace for URL organization/reference
app_name = 'blog'


urlpatterns = [

    # URL patterns for views for posts

    # doesn't take any args and is mapped to post_list view
    #path('', views.post_list, name='post_list'),
    #
    # use a class-based view instead for demostration
    path('', views.PostListView.as_view(), name='post_list'),

    # takes four args and is mapped to post_detail view
    path(
        # brackets capture values from URL
        #
        # ex of a SEO-friendly URL built with this pattern:
        # blog/2019/11/19/post-from-shell-with-published-status
        '<int:year>/<int:month>/<int:day>/<slug:post>',
        views.post_detail,
        name='post_detail'
    ),

    # sharing posts via email
    path('<int:post_id>/share/', views.post_share, name='post_share'),
]

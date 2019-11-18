# …/blog/packtblog/blog/admin.py
#
# models to register with this app's Django admin site

from django.contrib import admin

from .models import Post


# admin.site.register(Post)
#
# replace this register() function with a decorator that
# does the same thing, registering the ModelAdmin class
# its decorating
#
# use a custom class for customizing how models are displayed
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):

    # attributes that set the fields of the model to display
    # in the admin object list page
    #
    # what to show for each Post object
    list_display = (
        'title',
        'slug',
        'author',
        'publish',
        'status'
    )
    # filter-by sidebar
    list_filter = (
        'status',
        'created',
        'publish',
        'author'
    )
    # search bar
    search_fields = ('title', 'body')
    # autogenerate the slug field based on Post title's input
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    # include navigation links to run through posts by date
    date_hierarchy = 'publish'
    ordering = ('status', 'publish')

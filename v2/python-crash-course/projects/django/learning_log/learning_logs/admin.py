from django.contrib import admin

from .models import Topic

# register Topic with admin site
admin.site.register(Topic)

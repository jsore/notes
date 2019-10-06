from django.contrib import admin

from .models import Topic, Entry

# register Topic with admin site
admin.site.register(Topic)
admin.site.register(Entry)

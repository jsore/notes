# project/learning_log/learning_logs/views.py

from django.shortcuts import render

from .models import Topic


def index(request):
    """The home page for Learning Log."""

    return render(request, 'learning_logs/index.html')


def topics(request):
    """Show all topics."""

    # queryset to hold data
    topics = Topic.objects.order_by('date_added')

    # context dictionary supplies names as keys for template's
    # data access, values are data needed to be sent to template
    context = {'topics': topics}
    return render(request, 'learning_logs/topics.html', context)


def topic(request, topic_id):
    """Show a single topic and all its entries."""

    # our db queries for this endpoint
    topic = Topic.objects.get(id=topic_id)
    entries = topic.entry_set.order_by('-date_added')

    # send the data to the view
    context = {'topic': topic, 'entries': entries}
    return render(request, 'learning_logs/topic.html', context)


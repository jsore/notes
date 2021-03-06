# project/learning_log/learning_logs/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import Http404

from .models import Topic, Entry
from .forms import TopicForm, EntryForm


# only the home, login and registration page are unrestricted
# to unauthenticated or non-registered users
#
# learning_log/learning_log/settings.py LOGIN_URL tells Django
# to redirect these restricted requests to the login page


# running for your life, it's Shia LaBeouf
def index(request):
    """The home page for Learning Log."""

    return render(request, 'learning_logs/index.html')


# he's brandishing a knife, it's Shia LaBeouf
@login_required
def topics(request):
    """
    Show all topics.

    Access to Topic data is restricted to registered users
    only, restricted via @login_required decorator/directive.

    If a user isn't registered, they'll be redirected to the
    login page.
    """

    # queryset to hold data
    # access the request.user object and assign an owner to
    # the query Topic.objects.filter(…)
    topics = Topic.objects.filter(owner=request.user).order_by('date_added')

    # context dictionary supplies names as keys for template's
    # data access, values are data needed to be sent to template
    context = {'topics': topics}
    return render(request, 'learning_logs/topics.html', context)


# lurking in the shadows...
@login_required
def topic(request, topic_id):
    """Show a single topic and all its entries."""


    # endpoint to query from the DB


    # topic = Topic.objects.get(id=topic_id)
    #
    # if a user manually requests a topic or entry that does
    # not exist, Django will try to render the nonexistant
    # page but won't have enough info to do so, which causes
    # it to throw a 500 error
    #
    # this behavior is more acurately a 404 error, this
    # method fixes this, it'll try to get the requested
    # object from the DB and if it doesn't exist raises
    # a 404 exception
    topic = get_object_or_404(Topic, id=topic_id)

    # ensure the topic belongs to the current user 1st
    if topic.owner != request.user:
        raise Http404

    entries = topic.entry_set.order_by('-date_added')

    # send the data to the view
    context = {'topic': topic, 'entries': entries}
    return render(request, 'learning_logs/topic.html', context)


# hollywood superstar Shia LaBeof
@login_required
def new_topic(request):
    """Add a new topic."""

    # two situations: initial requests for new_topic endpoint
    # ( so there needs to be a blank form ) and processing
    # data submitted in the form ( handle POST's )

    if request.method != 'POST':
        # no data submitted yet, so serve a blank form
        form = TopicForm()

    else:
        # POST, process incoming data stored in request.POST
        form = TopicForm(data=request.POST)

        # example of ease of use of Django's input validations
        # is input expected field type? expected length? these
        # are defined in models.py
        if form.is_valid():
            # example of ease of use of Django's DB insertions

            # we don't want the topic submitted, it needs to
            # be altered by assigning an owner to itself...
            new_topic = form.save(commit=False)
            new_topic.owner = request.user
            # ...now we can commit the new_topic to the DB
            new_topic.save()

            return redirect('learning_logs:topics')

    # display blank form or form with errors of invalid input
    context = {'form': form}
    return render(request, 'learning_logs/new_topic.html', context)


@login_required
def new_entry(request, topic_id):
    """Add a new entry for a topic."""

    topic = Topic.objects.get(id=topic_id)

    if request.method != 'POST':
        # no data submitted yet, show a blank form
        form = EntryForm()
    else:
        # data was submitted, create new instance of EntryForm
        # populated with request POST data
        form = EntryForm(data=request.POST)
        if form.is_valid():
            # create a new entry object but don't save it yet...
            new_entry = form.save(commit=False)
            # ...because we need to set the new entry's topic
            # before saving the entry, which got pulled at
            # the beginning of this function
            new_entry.topic = topic
            # now we can save it and refresh the topic page
            new_entry.save()
            return redirect('learning_logs:topic', topic_id=topic_id)

    # display blank form or form with errors of invalid input
    context = {'topic': topic, 'form': form}
    return render(request, 'learning_logs/new_entry.html', context)


@login_required
def edit_entry(request, entry_id):
    """Edit an existing entry."""

    entry = Entry.objects.get(id=entry_id)
    topic = entry.topic

    # un-authed user access prevention
    if topic.owner != request.user:
        raise Http404

    if request.method != 'POST':
        # initial request, create the form pre-fill with
        # current entry text for user to review
        form = EntryForm(instance=entry)
    else:
        # POST data submitted, process it
        form = EntryForm(instance=entry, data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('learning_logs:topic', topic_id=topic.id)

    context = {'entry': entry, 'topic': topic, 'form': form}
    return render(request, 'learning_logs/edit_entry.html', context)

# projects/django/learning_log/users/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm


def register(request):
    """Register a new user."""

    if request.method != 'POST':
        # display a blank form, with no data...
        form = UserCreationForm()
    else:
        # ...or process a completed form...
        form = UserCreationForm(data=request.POST)

        if form.is_valid():
            # add to DB and redirect user home, logged in

            # save() returns newly created user object, put
            # a reference to it into new_user
            new_user = form.save()
            # create a valid user session for the new user
            login(request, new_user)
            return redirect('learning_logs:index')


    # ...otherwise throw whatever input errors to page and
    # display a fresh, blank form
    context = {'form': form}
    return render(request, 'registration/register.html', context)


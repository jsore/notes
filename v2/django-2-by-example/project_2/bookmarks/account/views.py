# …/project_2/bookmarks/account/views.py


from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from .forms import LoginForm


def user_login(request):
    """Render the user login page."""

    # instantiate a form with the POST data sumbitted
    if request.method == 'POST':
        form = LoginForm(request.POST)

        # any errors encountered here will be handled and
        # displayed as dictacted in this view's template
        if form.is_valid():
            cd = form.cleaned_data

            # this method returns the User object if it was
            # able to auth the user against the DB, or 'None'
            user = authenticate(request,
                                username=cd['username'],
                                password=cd['password'])

            if user is not None:
                if user.is_active:
                    # good to go, set a new auth'ed session
                    login(request, user)
                    return HttpResponse('Authenticated successfully')
                else:
                    # auth for the User was a success but
                    # the user account isn't active
                    return HttpResponse('Disabled account')
            else:
                # user couldn't be authenticated, show error
                return HttpResponse('Invalid login')

    # the call was a GET, instantiate a new form
    else:
        form = LoginForm()

    return render(request, 'account/login.html', {'form': form})

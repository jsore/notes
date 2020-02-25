# …/project_2/bookmarks/account/views.py


from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
# from django.core.mail import send_mail
from django.core import mail

from .forms import LoginForm, PwResetEmailForm, UserRegistrationForm

import logging
logger = logging.getLogger(__name__)



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



# decorator checks if the current user is authenticated and
# only executes the decorated view if true, redirects to the
# login URL with the original requested URL as a GET param
# named 'next' ( redirects to the URL they tried accessing )
@login_required
def dashboard(request):
    """Display the user's dashboard after they log in."""

    return render(request,
                  'account/dashboard.html',
                  # define this variable to track the section
                  # of the site the user was browsing, a
                  # simple way to define the section that
                  # each view corresponds to
                  {'section': 'dashboard'})



def password_reset(request):
    if request.method == 'POST':
        form = PwResetEmailForm(request.POST)

        if form.is_valid():
            clean = form.cleaned_data
            # connection = mail.get_connection()
            connection = mail.get_connection()
            connection.open()
            email_message = mail.EmailMessage(
                'Hello',
                'Test body goes here',
                'webmaster@localhost',
                [clean['email']],
                connection=connection,)
            email_message.send()
            connection.close()

            logger.info("Simple info")

            return render(request,
                         'account/password_reset_done.html',
                         {'clean': clean})

    else:
        form = PwResetEmailForm()

    return render(request,
                  'password_reset',
                  {'form': form})



def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)

        # check for forms.ValidationError()'s
        if user_form.is_valid():
            # create a new user object but don't save it to
            # the DB yet, needs a password set with it 1st…
            new_user = user_form.save(commit=False)
            # …set the chosen password to the user, using
            # Django's set_password() to handle encryption…
            new_user.set_password(user_form.cleaned_data['password'])
            # …now save it to the DB
            new_user.save()

            return render(request,
                          'account/register_done.html',
                          {'new_user': new_user})
    else:
        user_form = UserRegistrationForm()

    return render(request,
                  'account/register.html',
                  {'user_form': user_form})

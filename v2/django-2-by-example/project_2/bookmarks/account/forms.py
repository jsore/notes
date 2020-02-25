# …/project_2/bookmarks/account/forms.py
#
# forms that the 'account' application uses


from django import forms
from django.contrib.auth.models import User


class LoginForm(forms.Form):
    """Authenticate the user against the DB."""

    username = forms.CharField()
    # include a type="password" attribute
    password = forms.CharField(widget=forms.PasswordInput)


class PwResetEmailForm(forms.Form):
    email = forms.EmailField()


class UserRegistrationForm(forms.ModelForm):
    """
    Form for new users.

    Custom view can be swapped out with UserCreationForm
    from django.contrib.auth.forms but is very similar to this.
    """

    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput
    )
    password2 = forms.CharField(label='Confirm Password',
                                widget=forms.PasswordInput
    )

    class Meta:
        model = User
        # note: username field is defined with unique=True
        # validation errors get thrown if a user tries to
        # sign up with a username already taken
        #
        # as normal, check for validation errors with
        # is_valid() in this form's view
        fields = ('username', 'first_name', 'email')

    def clean_password2(self):
        """Simple method to check a user's new passwords match."""

        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Passwords do not match')
        return cd['password2']

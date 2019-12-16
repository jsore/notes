# …/project_2/bookmarks/account/forms.py
#
# forms that the 'account' application uses


from django import forms


class LoginForm(forms.Form):
    """Authenticate the user against the DB."""

    username = forms.CharField()
    # include a type="password" attribute
    password = forms.CharField(widget=forms.PasswordInput)


# class PasswordResetEmailForm(forms.Form):
class PwResetEmailForm(forms.Form):
    email = forms.EmailField()

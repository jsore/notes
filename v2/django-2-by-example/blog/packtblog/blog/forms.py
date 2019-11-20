# …/blog/packtblog/blog/forms.py
#
# forms for the blog app

from django import forms

from .models import Comment


# example usage of the standard Form class
class EmailPostForm(forms.Form):

    # rendered as <input type="text">
    name = forms.CharField(max_length=25)
    email = forms.EmailField()
    to = forms.EmailField()

    # override the default widget with the widget attribute
    # default was <input> new widget is a <textarea>
    comments = forms.CharField(required=False, widget=forms.Textarea)


# example usage of building a form from a model
class CommentForm(forms.ModelForm):

    # just indicate which model to use to build the form here
    class Meta:
        model = Comment
        fields = ('name', 'email', 'body')

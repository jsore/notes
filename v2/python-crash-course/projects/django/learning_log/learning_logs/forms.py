# projects/django/learning_log/learning_logs/forms.py
#
# user data submissions

from django import forms

# the model that needs a form
from .models import Topic, Entry


class TopicForm(forms.ModelForm):
    """For users to submit new topics."""

    # tell django what model to base the form on and which
    # fields to include in the form
    class Meta:
        model = Topic
        # what to build from this model
        fields = ['text']
        # no label
        labels = {'text': ''}


class EntryForm(forms.ModelForm):
    """For users to submit entries for topics."""

    class Meta:
        model = Entry
        fields = ['text']
        labels = {'text': 'Entry:'}
        # HTML widget form element, overrides Django's
        # default widget choices to stretch the input
        widgets = {'text': forms.Textarea(attrs={'cols': 80})}

# how to work with data stored in the app
#
# users create topics and entries supporting the topic, to be
# displayed as text along with the timestamp of the entry

from django.db import models


class Topic(models.Model):
    """A topic the user is learning about."""

    # remember to specify max size of field in DB
    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Return a string representation of the model."""

        return self.text

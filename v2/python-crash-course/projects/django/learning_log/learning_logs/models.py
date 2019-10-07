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


class Entry(models.Model):
    """Something specific learned about a topic."""

    # many-to-one relation ship, topics can have multi entries

    # this is the actual relationship definition
    #
    # use a reference to a Topic's auto-generated key ( ID )
    # to connect each entry to a specific Topic
    #
    # if a Topic should be deleted, use a cascading delete to
    # delete all entries to that Topic as well
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)


    class Meta:
        """Extra info for managing this model."""

        # tell Django to use 'Entries' when referring to more
        # than one entry instead of 'Entrys'
        verbose_name_plural = 'entries'


    def __str__(self):
        """Return a string representation of the model."""

        # tell Django what to show when referring to an entry
        txt = f"{self.text}"
        return f"{txt[:50]}..." if len(txt) >= 50 else f"{txt}"

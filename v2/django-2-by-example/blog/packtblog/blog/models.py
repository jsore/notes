# …/blog/packtblog/blog/models.py
#
# data models for blog application in packtblog project

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Post(models.Model):
    """Data model for blog posts."""

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )

    # post title, translates to VARCHAR column in SQL DB
    title = models.CharField(max_length=250)

    # used in URLs, labels for defining friendly and SEO
    # friendly URLs for a blog post
    #
    # use the unique_for_date parameter to this field so URLs
    # can be built using publish date and its slug
    #
    # Django prevents slug name clashes for a given date
    slug = models.SlugField(max_length=250, unique_for_date='publish')

    # tell Django to create a foreign key in the DB using
    # the primary key of the reltated model
    author = models.ForeignKey(
        # rely on User model of Django's auth system...
        User,
        # ...SQL standard behavior, delete a user's posts if
        # the user is deleted from the DB...
        on_delete=models.CASCADE,
        # ...the reverse relationship, from User to Post
        related_name='blog_posts'
    )

    # translates to a TEXT column in SQL DB
    body = models.TextField()

    # similair to Python's datetime.now method
    publish = models.DateTimeField(default=timezone.now)

    # auto_now_add specifies to save the date automatically
    # when creating an object
    created = models.DateTimeField(auto_now_add=True)

    # auto_now specifies to update the date when saving an obj
    updated = models.DateTimeField(auto_now=True)

    status = models.CharField(
        max_length=10,
        # choices parameter ensures there's only specific
        # parameters to choose from, set in the supplied obj
        choices=STATUS_CHOICES,
        default='draft'
    )


    class Meta:

        # sort results in reverse by default when querying
        # the database, recent to oldest
        ordering = ('-publish',)


    def __str__(self):
        """Method to set a human-readable representation of this obj."""

        return self.title


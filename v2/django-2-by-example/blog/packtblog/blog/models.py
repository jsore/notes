# …/blog/packtblog/blog/models.py
#
# data models for blog application in packtblog project

from django.db import models
# from django.utils import timezone, reverse
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User


class PublishedManager(models.Manager):
    """Custom QuerySet model manager to retrieve any published Post."""

    # get_queryset() method of a manager returns the QuerySet
    # that will be executed
    #
    # override that method to include a custom filter in the
    # final QuerySet
    def get_queryset(self):
        return super(
            PublishedManager,
            self
        ).get_queryset()\
         .filter(status='published')


# will have a relationship with Django's django.contrib.auth
# authentication framework's User model, a relationship
# defined by the author field ( ForeignKey )
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


    # use the default 'objects' manager to get results
    objects = models.Manager()
    # ex: >>> Post.objects.all()

    # use custom manager we've defined, which filters Post
    # objects retrieved from the DB for posts that have a
    # status of only 'published'
    published = PublishedManager()
    # ex: >>> Post.published.filter(title__startswith='First')


    class Meta:

        # sort results in reverse by default when querying
        # the database, recent to oldest
        ordering = ('-publish',)


    def __str__(self):
        """Method to set a human-readable representation of this obj."""

        return self.title


    # return the canonical URL of the Post object
    #
    # this method is used in this app's templates to link
    # to specific posts
    def get_absolute_url(self):

        # reverse() allows for building URLs by their name
        return reverse(
            'blog:post_detail',
            args=[
                self.publish.year,
                self.publish.month,
                self.publish.day,
                self.slug
            ]
        )


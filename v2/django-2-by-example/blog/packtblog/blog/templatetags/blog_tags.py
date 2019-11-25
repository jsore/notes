# …/blog/packtblog/blog/templatetags/blog_tags.py
#
# custom template tags for this app

from django import template
from django.db.models import Count

# Python Markdown module
from django.utils.safestring import mark_safe
import markdown

from ..models import Post


# register is the var required for each template tag module
# in order for it to be a valid tag library
register = template.Library()


# simple_tag's just return a string...
@register.simple_tag
def total_posts():
    """Retrieve the total posts published in this blog."""

    return Post.published.count()


# inclusion_tag's render a template with context vars that
# are returned by the template tag
#
# register the tag and spcify the template to be rendered
#
# this tag accepts an optional count param, defaulted to 5
#
# for example of usage, {% show_latest_posts 3 %}
# passes the int 3 as the 'count' variable's value
@register.inclusion_tag('blog/post/latest_posts.html')
def show_latest_posts(count=5):
    """For displaying the latest posts in the blog's sidebar."""

    # use the count variable to limit results of the
    # Post.published() query...
    latest_posts = Post.published.order_by('-publish')[:count]
    # ...this function should return a dictionary of variables
    # instead of a simple value
    return {'latest_posts': latest_posts}


# store the result of this template tag function which can
# be reused rather than directly outputting the returned result
@register.simple_tag
def get_most_commented_posts(count=5):

    # use annotate() function to build a QuerySet and
    # aggregate total number of comments for each post,
    # which is stored in computed field total_comments for
    # each Post object
    return Post.published.annotate(
            total_comments=Count('comments')
        ).order_by('-total_comments')[:count]


# tag filter to be used when converting markdown to HTML
@register.filter(name='markdown')
def markdown_format(text):
    return mark_safe(markdown.markdown(text))

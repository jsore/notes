# …/blog/packtblog/blog/feeds.py
#
# RSS/Atom feeds for the blog app


from django.contrib.syndication.views import Feed
from django.template.defaultfilters import truncatewords
from .models import Post


class LatestPostsFeed(Feed):

    # define attributes corresponding to <title> <link> and
    # <descripton> RSS elements
    title = 'DJ2 Example Blog'
    link = '/blog/'
    description = 'New posts from this example blog.'

    # return most recent 5 posts, the objects to be included
    # in the feed
    def items(self):
        return Post.published.all()[:5]

    # both item_title and item_description methods will
    # receive each object returned by items()
    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return truncatewords(item.body, 30)

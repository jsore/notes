# …/blog/packtblog/blog/sitemaps.py


from django.contrib.sitemaps import Sitemap
from .models import Post


#
# don't forget to add the sitemap's URL to this project's
# urls.py file:
#
#   …/blog/packtblog/packtblog/urls.py  ( project-wide )
#
# not:
#
#   …/blog/packtblog/blog/urls.py  ( application-wide )
#


class PostSitemap(Sitemap):

    # attributes indicating the change frequency of post
    # pages and their relevance to the website, taken from
    # the builtin PostSitemap class
    #
    # can also be methods not just attributes
    changefreq = 'weekly'
    priority = 0.9

    # returns the QuerySet of objs to include in this sitemap...
    def items(self):

        # Django will call the get_absolute_url() ( that got
        # defined in blog.models.Post(models.Model) ) method
        # on each object to retrieve it's canonical URL
        #
        # the URL for each Post gets built with its
        # get_absolute_url() method
        return Post.published.all()

    # ...method receives each object returned by items() and
    # returns the last object that was modified
    def lastmod(self, obj):

        # corresponds with blog.models.Post.updated attribute
        return obj.updated

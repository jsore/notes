# …/blog/packtblog/blog/views.py
#
# functions defining logic to consume requests and return a
# rendered template after passing required variables and
# data to the template


from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.generic import ListView

from .models import Post


def post_list(request):
    """View to display a list of posts."""

    # use custom model manager defined in Post
    object_list = Post.published.all()

    # instantiate Paginator class with the number of objects
    # to display per page
    paginator = Paginator(object_list, 3)
    # get the page GET param that indicates current page number
    page = request.GET.get('page')

    # obtain objects for desired page with Paginator.page()
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        # if page isn't an int deliver the first page
        posts = paginator.page(1)
    except EmptyPage:
        # if page is out of range deliver last page of results
        posts = paginator.page(paginator.num_pages)

    # render the retrieved list of posts with given template
    #
    # returns an HttpResponse object with rendered text
    # ( usually HTML )
    #
    # since render is fed the request context any variables
    # set by template context processors are accessible by
    # the given template
    return render(
        # everything here gets passed to the template
        request,
        'blog/post/list.html',
        # context variables for template, page number and
        # the retrieved objects
        {'page': page, 'posts': posts}
    )


# instead of a function for views, here's a simple example
# of a class-based view that uses a generic Django class
#
# the post_list endpoint in urls.py should be commented out
# and replaced with a call to this class's endpoint
class PostListView(ListView):

    # use a specific QuerySet instead of retrieving all
    # objects ( objects.all() )
    queryset = Post.published.all()

    # use context variable 'posts' for the query results
    # which normally defaults to 'object_list' if the
    # 'context_object_name' isn't specified
    context_object_name = 'posts'

    paginate_by = 3

    # use a custom template for rendering, ListView defaults
    # to using blog/post_list.html if not specified
    template_name = 'blog/post/list.html'


def post_detail(request, year, month, day, post):
    """Display a single post."""

    post = get_object_or_404(
        Post,
        # slugs are unique due to unique_for_date parameter
        slug=post,
        status='published',
        publish__year=year,
        publish__month=month,
        publish__day=day
    )

    return render(
        request,
        'blog/post/detail.html',
        {'post': post}
    )

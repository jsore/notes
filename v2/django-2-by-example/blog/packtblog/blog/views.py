# …/blog/packtblog/blog/views.py
#
# functions defining logic to consume requests and return a
# rendered template after passing required variables and
# data to the template


from django.shortcuts import render, get_object_or_404

from .models import Post


def post_list(request):
    """View to display a list of posts."""

    # use custom model manager defined in Post
    posts = Post.published.all()

    # render the retrieved list of posts with given template
    #
    # returns an HttpResponse object with rendered text
    # ( usually HTML )
    #
    # since render is fed the request context any variables
    # set by template context processors are accessible by
    # the given template
    return render(
        request,
        'blog/post/list.html',
        # context variables to render the template with
        {'posts': posts}
    )


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

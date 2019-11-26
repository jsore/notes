# …/blog/packtblog/blog/views.py
#
# functions defining logic to consume requests and return a
# rendered template after passing required variables and
# data to the template


# Count aggregation function of Django ORM
from django.db.models import Count  # includes Avg, Max, Min, Count

from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.mail import send_mail
from django.views.generic import ListView
from django.contrib.postgres.search import SearchVector
from taggit.models import Tag

from .models import Post, Comment
from .forms import EmailPostForm, CommentForm, SearchForm


def post_list(request, tag_slug=None):
    """View to display a list of posts."""

    # use custom model manager defined in Post
    object_list = Post.published.all()

    # taggit manager placeholder
    tag = None
    # check if there's any tags included in the URL
    if tag_slug:
        tag = get_object_or_404(Tag, slug=tag_slug)
        # filter list of posts by the ones that contain
        # the given tag
        object_list = object_list.filter(tags__in=[tag])

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
        {'page': page, 'posts': posts, 'tag': tag}
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

    # QuerySet to retrieve all active comments for this post
    comments = post.comments.filter(active=True)
    # instantiate a placeholder for adding a new comment
    new_comment = None
    print(f'requested: {request}')
    # a new comment was POSTed
    if request.method == 'POST':
        comment_form = CommentForm(data=request.POST)

        if comment_form.is_valid():
            # create a Comment object but don't save to DB yet...
            new_comment = comment_form.save(commit=False)
            # ...edit comment to assign current post to the it...
            new_comment.post = post
            # ...and then we can save it to the DB
            new_comment.save()
    else:
        comment_form = CommentForm()

    # list all similar posts
    #
    # the values_list() QuerySet returns tuples and specify
    # we want the list flattened ( a list like [1, 2, 3, …] )
    post_tags_ids = post.tags.values_list('id', flat=True)
    # exclude current post from list of retrieved posts
    similar_posts = Post.published.filter(tags__in=post_tags_ids)\
            .exclude(id=post.id)
    # use our Count() aggregrate func to generate a calculated
    # field ( same_tags ) containing number of tags shared
    similar_posts = similar_posts.annotate(same_tags=Count('tags'))\
            .order_by('-same_tags', '-publish')[:4]

    return render(
        request,
        'blog/post/detail.html',
        {'post': post,
         'comments': comments,
         'new_comment': new_comment,
         'comment_form': comment_form,
         'similar_posts': similar_posts})


def post_share(request, post_id):
    """Handle this Form form and send an email when successfully submitted."""

    # retrieve post by ID
    post = get_object_or_404(Post, id=post_id, status='published')
    sent = False

    # form submitted, capture the input data and validate
    if request.method == 'POST':
        form = EmailPostForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data

            post_url = request.build_absolute_uri(post.get_absolute_url())
            subject = '{} ({}) recommends you read "{}"'.format(
                cd['name'],
                cd['email'],
                post.title
            )
            message = 'Read "{}" at {}\n\n{}\'s comments: {}'.format(
                post.title,
                post_url,
                cd['name'],
                cd['comments']
            )
            send_mail(
                subject,
                message,
                'jus.a.sorensen@gmail.com',
                [cd['to']]
            )
            sent = True

        # if the form isn't valid, the form will be rendered
        # again, but with the submitted data populated and
        # validation errors as defined in the view's template

    # display an initial form, create a new form instance
    else:
        form = EmailPostForm()

    return render(
        request,
        'blog/post/share.html',
        {'post': post, 'form': form, 'sent': sent}
    )


def post_search(request):

    # instantiate our form
    form = SearchForm()
    query = None
    results = []

    # submit it with a GET to include the 'query' parameter
    # in the request.GET dictionary
    if 'query' in request.GET:

        # now we can instantiate the form with GET data
        form = SearchForm(request.GET)

        # if the data is valid search for posts with a
        # custom SearchVector instance and title/body fields
        if form.is_valid():
            query = form.cleaned_data['query']
            results = Post.objects.annotate(
                search=SearchVector('title', 'body'),
            ).filter(search=query)

    return render(
        request,
        'blog/post/search.html',
        {'form': form, 'query': query, 'results': results}
    )

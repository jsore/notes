# Blogging Application

My notes covering chapters 1-3 of Django 2 by Example.

<br><br><br><br>

## ch1. Building The Basics


<br>


--------------------------------------------------------------------------------
### Installing & Project Creation

These notes assume a host that already has Python 3 installed.

Sanity checks first: review the packages already installed and make sure your `pip` package manager is updated

  ```
  …/django-2-by-example/blog$ pip list

  …/django-2-by-example/blog$ pip install --upgrade pip
  ```


<br><br>


__Environment setup__

We want to use `virtualenv` to create isolated Python environments. This lets us use different package versions for different projects ( more practical than installing Python packages system-wide ).

  ```
  …/django-2-by-example/blog$ pip install virtualenv
  ```

After `^ installing ^`, create an isolated environment

  ```
  …/django-2-by-example/blog$ virtualenv my_env_name
  ```

Any Python libraries you install while this is active will go into an automatically created dir:

  ```
  my_env_name/lib/python3.7/site-packages
  ```

Make sure to tell `virtualenv` to use Python 3.x instead of 2.x, locate the path where Python 3 is installed and create the virtual env appropriately

  ```
  …/django-2-by-example/blog$ which python3
  /Library/…/3.7/bin/python3

  …/django-2-by-example/blog$ virtualenv my_env_name -p /Library/…/3.7/bin/python3
  Running …
  …
  done.

  …/django-2-by-example/blog$ ls
  blog_env  # this is what I chose in place of my_env_name
  ```


<br><br>


After the environment is created, it has to be activated

  ```
  …/django-2-by-example/blog$ source blog_env/bin/activate
  ```

You'll notice the shell prompt updating to include the name of the current environment

  ```
  (current_env) …/blog$
  ```

To deactivate this environment, run:

  ```
  (current_env) …/blog$ deactivate
  ```


<br><br>


__Install Django__

Preferred Django install method: `pip` package manager.

  ```
  (current_env) …/blog$ pip install Django==2.0.5
  ```

Verify the installation

  ```
  (current_env) …/blog$ python

  >>> import django
  >>> django.get_version()
  ```

Again, anything installed in this environment goes into `site-packages`


<br><br>


__Create a Django project__

1st project = a complete blog, then refactor for improvements.

To create an intial project file structure, run Django's `startproject` command:

  ```
  (current_env) …/blog$ ls
  blog_env/

  (current_env) …/blog$ django-admin startproject sitename  # <packtblog>

  (current_env) …/blog$ ls
  blog_env/   packtblog/

  (current_env) …/blog$ tree packtblog
  packtblog
  ├── manage.py
  └── packtblog
      ├── __init__.py
      ├── settings.py
      ├── urls.py
      └── wsgi.py
  ```


<br><br>


  ```
  <project_root>
  ├── manage.py
  ```

  - CLI util to ineract with the project
  - Wrapper around `django-admin.py` tool
  - Don't need to edit

  ```
  <project_root>
  …
  └── packtblog
  ```

  - Project directoy

  ```
  <project_root>
  …
      ├── __init__.py
  ```

  - Empty file
  - Tells Python `project_root` directory should be treated as a Python module

  ```
  <project_root>
  …
      ├── settings.py
  ```

  - Settings and configurations for the project with initial default settings

  ```
  <project_root>
  …
      ├── urls.py
  ```

  - Where URL patterns are defined
  - Each URL is mapped to a view

  ```
  <project_root>
  …
      └── wsgi.py
  ```

  - Configuration to run the project as a __Web Server Gateway Interface__ application


<br><br>


Complete the project setup by creating the tables in the included SLQlite3 DB required by the applications listed in `settings.py`'s `INSTALLED_APPS` list.

  ```
  (current_env) …/blog$ cd packtblog

  (current_env) …/blog/packtblog$ python manage.py migrate
  ```

This creates ( makes the migrations and applies them ) the tables for the initial applications in the DB.


<br><br>


Django's included web server is good for developing, don't need to spend time configuring a prod server. It will reload upon changes to existing project files but needs to be restarted manually sometimes, for example, when new files are added.

Start the dev server:

  ```
  (current_env) …/blog/packtblog$ python manage.py runserver
  ```

In production, opt to run a project as a WSGI application using a real web server ( Apache, Gunicorn, uWSGI )

Django can run the dev server on a different settings file. Usefule for dealing with multiple environments that require different configurations. Each one can have their own settings file.

  ```
  (current_env) …/blog/packtblog$ python manage.py runserver 127.0.0.1:8001 \
  --settings=sitename.settings
  ```


<br><br>


__Regarding some project settings ( `<project_root>/settings.py` )__

- `DEBUG`
  + boolean showing if debugging is on or off

- `ALLOWED_HOSTS`
  + ignored if `DEBUG = False`
  + domain/host needs to be added here in prod in order to serve the project

- `INSTALLED_APPS`
  + edit this for all projects
  + tells Django what applications are active for this site
  + includes some sane defaults


<br><br>

A __project__ is a Django installation and some settings.

An __application__ is a group of models, views, templates and URLs.

  > A __project__ is a website containing several __applications__ such as a blog, wiki, forum, etc, that can be used by other projects as well.


<br><br>


__Create an application__

From project's root, run

  ```
  (current_env) …/blog/packtblog$ python manage.py startapp blog

  (current_env) …/blog/packtblog$ tree blog
  blog
  ├── __init__.py
  ├── admin.py      <-- register models to include in optional admin site
  ├── apps.py       <-- main configuration of 'blog' application
  ├── migrations    <-- DB migrations of this app, can track and synchronize the DB
  │   └── …
  ├── models.py     <-- data models for this app, required but can be left empty
  ├── tests.py      <-- tests for this app
  └── views.py      <-- app logic, views receives HTTP req, processes it, returns a response
  ```


<br><br>


--------------------------------------------------------------------------------
### Models & Generating Model Migrations

Start the project with designing blog data schema by defining the data models for the blog.

Model's are a Python class that subclasses `django.db.models.Model`, each attribute within represting a DB field. Django creates a table for each model defined within `models.py` and provides a practical API to query objects in the DB.

  > `…/blog/packtblog/blog/models.py`
  >
  > - Define a `Post` model

  > `…/blog/packtblog/blog/settings.py`
  >
  > - Activate the blog model within INSTALLED_APPS


<br><br>


After defining the first model and activating it by including it in `INSTALLED_APPS` list, we'll need a DB table for it. Django includes a migration system for tracking changes to models and allows to propagte them into the DB. The `migrate` command applies migrations for all apps listed in `INSTALLED_APPS` and synchronizes the DB with the current models and existing migrations.

Create an initial migration for the new `Post` model from project's root

  ```
  (current_env) …/blog/packtblog$ python manage.py makemigrations blog
  ```

The SQL that Django executes in the DB to create the table for the model can be reviewed with

  ```
  (current_env) …/blog/packtblog$ python manage.py sqlmigrate blog 0001
  ```

Now sync the DB with the new model, by applying the existing migrations

  ```
  (current_env) …/blog/packtblog$ python manage.py migrate
  ```

The migrations for apps in `INSTALLED_APPS` are now applied, including our `blog` app; the DB should now reflect the current status of our models.

Each time a field is added removed or changed or if new models are added a new migration needs to be created and applied to keep the DB in sync with your models.

<br><br>


--------------------------------------------------------------------------------
### Admin Sites for Models

Begin by creating a new superuser `python manage.py createsuperuser` and register the first model in the admin site

  > `…/blog/packtblog/blog/admin.py`
  >
  > - Register Post model
  > - Add a post at `http://localhost:8000/admin/blog/post/add/`
  > - Customize how models are displayed by using a custom class that inherits from `ModelAdmin`


<br><br>


--------------------------------------------------------------------------------
### Working With QuerySet & Managers

Django's __Object-relational mapper__ ( __ORM__ ) is a DB abstraction API to create retrieve, update and delete objects easily, compatible with MySQL, PostgreSQL, SQLite, Oracle ( DB of choice should be defined in `DATABASES` in the project's settings file ).

  > `https://docs.djangoproject.com/en/2.0/ref/models/`

The Django ORM is based on QuerySets, a collection of objects from your DB that can have several filters to limit the results. __Each Django model has at least one model manager__, the default being `objects` for DB object retrieval. You get a `QuerySet` object using your model manager.


<br><br>


Examples: creating objects via the shell

  ```
  (current_env) …/blog/packtblog$ python manage.py shell

  >>> from django.contrib.auth.models import User
  >>> from blog.models import Post
  >>> user = User.objects.get(username='admin')
  >>> post = Post(
  >>>     title='New Post object via shell',
  >>>     slug='new-post-object-via-shell',
  >>>     body='Post body.',
  >>>     author=user
  >>> )
  >>> post.save()
  ```

The Post object is in memory and is not persisted to the database until `.save()` is called, which does an `INSERT` statement on the SQL DB. This step can be skipped and the object can be created and persisted in one step by instead calling `Post.objects.create(title=…)`.

The SQL statement ran by calling the `save()` method differs depending on if it's being called on an object that is already existing or a new one. If called on an existing object, a `UPDATE` statement is called instead.


<br><br>


  > Reminder: changes made to an object are not persisted to the DB until `save()`'ed


<br><br>


  ```python
  # create a QuerySet to get one
  one_post = Post.objects.get(what_to_retrieve='some_id')

  # create a QuerySet to get many
  all_posts = Post.objects.all()
  # QuerySets are lazy, this one hasn't been evaulated yet...
  print(all_posts)  # ...until it's forced to evaulate by something
  ```

Queries with field lookup methods are built using two underscores:

  ```python
  # another example QuerySet, using the filter() method
  Post.objects.filter(publish__year=2018)
  # or:
  Post.objects.filter(publish__year=2018, author__username='admin')
  # which equates to building a QuerySet with chained filters
  Post.objects.filter(publish__year=2018) \
              .filter(author__username='admin')
  ```


<br><br>


QuerySet filters can be concat'ed as many times as you like, they won't hit the DB until they're evaulated. Cases when QuerySets are actually evaulated, hitting the DB:

  - The first time you iterate over them
  - When you slice them, for instance, `Post.objects.all()[:3]`
  - When you pickle or cache them
  - When you call `repr()` or `len()` on them
  - When you explicitly call `list()` on them
  - When you test them in a statement, such as `bool()`, `or` , `and`, or `if`


<br><br>


Custom model managers can be created.

  > `…/blog/packtblog/blog/models.py`
  >
  > - Build custom model manager to retrieve all posts with a `published` status.


<br><br>


--------------------------------------------------------------------------------
### Building Views, Templates, URLs


__Views__

A Django view is just a __Python function that receives a web request and returns a web response__. The logic to return the desired response goes inside the view. Each view will render a template passing variables to it and will reutnr an HTTP response with the rendered output.


<br><br>


Build process:

  1. Create the application's views
  2. Define a URL pattern for each view
  3. Create HTML templates to render data generated by the views

  > `…/blog/packtblog/blog/views.py`
  >
  > - Request for a list of posts and render it in return

  > `…/blog/packtblog/blog/urls.py` ( new file )
  >
  > - Map the `post_list` and `post_detail` views to URLs


<br><br>


__URL Patterns__

URL patterns map URLs to views, comprised of

  - a string pattern
  - a view
  - ( optionally ) a name that allows you to name the URL project-wide

Django runs through the list of URL patterns and stops at the first match upon a request. After matching, Django imports the view of the matching URL pattern and executes it passing an instance of the `HttpRequest` class or positional arguments.

  > Using a `urls.py` file for each app is the best way to make apps reusable by other projects

After defining the URLs for this application ( thus far ) here:

```
…/blog/packtblog/blog/urls.py

app_name = 'blog'
urlpatterns = [
    path('', views.post_list, name='post_list'),
    path(
        # brackets capture values from URL
        '<int:year>/<int:month>/<int:day>/<slug:post>',
        views.post_detail,
        name='post_detail'
  ),
]
```

Add the app's patterns to the whole project here:

```
…/blog/packtblog/packtblog/urls.py
```

Django convention denotes that a `get_absolute_url()` method should be added to the model that returns the canonical URL of the object. The `post_detail` method has just been defined in the preceeding codeblocks, which can be used to build the canonical URL for `Post` objects. The `reverse()` method lets you build URLs by their name ( with optional params ).

  > `…/blog/packtblog/blog/models.py`
  >
  > - Update `Post` class to define the `get_absolute_url()` method
  > - This method is used in this app's templates to link to specific posts


<br><br>


__Creating the preliminary templates__

As expected, a parent template is used an all the others inherit from it

  ```
  …/blog/packtblog/blog/templates
  └── blog
      ├── base.html
      └── post
          ├── detail.html
          └── list.html
  ```


<br><br>


Django has a built in - powerful - __template language__ to specify how data is displayed, including:

  - __template tags__ `{% tagname %}` to control rendering of the template
  - __template variables__ `{{ variable }}` that are replaced with values when rendered
  - __template filters__ `{{ variable|filter }}` for modifying displated variables

List of tags and filters: `https://docs.djangoproject.com/en/2.0/ref/templates/builtins/`

Djaneiro ( Sublime ) cheat sheet: `https://packagecontrol.io/packages/Djaneiro`

<br><br>


--------------------------------------------------------------------------------
### Pagination in List Views

Example usage: blog grows, need to split the list of posts across pages.

Django has a built-in pagination classe to manage paginated data easily.

  > `…/blog/packtblog/blog/views.py`
  >
  > - Edit to include `Paginator` classes

  > `…/blog/packtblog/blog/templates/blog/pagination.html`
  >
  > - Pagination template for any template that requires it

<br><br>


--------------------------------------------------------------------------------
### Django's class-based views

Instead of defining functions for views, use class-based views as Python objects. A view is a callable that takes a web request and returns a response, you can define your views as class methods. Django provides base view classes for this, all inheriting from `View` class, which handles HTTP method dispatching and other common functions. Class based views let you:

  - Organize code by HTTP methods ( `GET`, `POST`, etc ) in separate methods instead of conditional branching
  - Use multiple inheritance to create reusable view classes ( __mixins__ )




<br><br><br><br>




## ch2. Enhancing The Basics

Add advanced features such as:

  - Sharing posts via email
  - Adding comments
  - Tagging posts
  - Retrieve posts by similarity

<br>


--------------------------------------------------------------------------------
### Sending Email With Django

Add functionality to allow users to use a form to share posts via email, using Django's built-in forms framework. The framework lets you:

  - Define fields of the form
  - Specify how the fields have to be displayed
  - Indicate how they have to validate input data

To build standard forms, use the `Form` class, to build a form tied to model instances use `ModelForm` class. To abide by standard Django convention, place all forms for each app in a project inside `<project_root>/<app_root>/forms.py`.

  > `…/blog/packtblog/blog/forms.py` ( new file )
  >
  > - Preliminary first form

List of all available form field types: `https://docs.djangoproject.com/en/2.0/ref/forms/fields/`


<br><br>


To send mail, a local SMTP server is needed or the configuration of an external SMTP server needs to be defined in `settings.py`. Example usage for gmail:

  ```python
  EMAIL_HOST = 'smtp.gmail.com'
  EMAIL_HOST_USER = 'jus.a.sorensen@gmail.com'
  EMAIL_HOST_PASSWORD = 'password'
  EMAIL_PORT = 587
  EMAIL_USE_TLS = True
  ```

You also might have to enable the 'Allow less secure apps' setting on your account.

If you can't use an SMTP server, add this to `settings.py` instead to pipe all emails to the shell

  ```python
  EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
  ```

Now the form just needs a view and template.


<br><br>


--------------------------------------------------------------------------------
### Create Forms & Handling Them in Views

  > `…/blog/packtblog/blog/views.py`
  >
  > - Define `post_share()` to handle the `blog/forms.EmailPostForm(form.Form)` class


<br><br>


__Building a comment system__

Will comprise of the following steps

  1. Create a __model__ to save comments

After creating the model don't forget to migrate to synchronize itself into the DB. Generate the migration to reflect the creation of a new model:

  ```
  (current_env) …/blog/packtblog$ python manage.py makemigrations blog
  ```

Then create the related DB schema and apply the changes to the DB

  ```
  (current_env) …/blog/packtblog$ python manage.py migrate
  ```

This will create a `blog_comment` table in the DB. Afterwards, add this new model to the administration site to let you manage comments through a simple interface.


<br><br>


--------------------------------------------------------------------------------
### Creating Forms From Models

  2. Create a __form__ to submit comments and validate input data
  3. Add a __view__ to process the form and save the new comment to the DB

Because we want Django to build a form dynamically from the `Comment` model, use `ModelForm` base class for building this form. To do this, all that's required is to indicate which model to use to build the form in the `Meta` class of the form ( `forms.py` ).

The `Comment` model and `CommentForm` form will be instantiated and handled in `views.post_detail`


<br><br>


  4. Edit the post detail __template__ to display the list of comments and the add comment form

The template needs to be able to display the total number of comments for a post, display the list of comments and display a form for users to add a new comment.


<br><br>


--------------------------------------------------------------------------------
### Integrating 3rd Party Apps

Using the `django-taggit` module, a reusable application that gives a `Tag` model and a manager to add tags to any model. First, install it and add it to your `INSTALLED_APPS`

  ```
  (current_env) …/blog/packtblog$ pip install django_taggit
  ```


<br><br>


--------------------------------------------------------------------------------
### Building Complex QuerySets

Build a functionality to retrieve posts based on similarity. To do this:

  - Retrieve all tags for the current post
  - Get all posts tagged with any of those tags
  - Exclude the current post from that list to avoid recommending the same post
  - Order results by number of tags shared with the current post
  - Recommend the most recent post for posts that share two or more tags
  - Limit the query to the number of posts we want to recommend

This all translates into a complex QuerySet that will be included in the `post_detail` view.




<br><br><br><br>




## ch3. Extending The Application

Create custom template tags and filters for the tags, build a custom sitemap, implement a full text search functionality for the blog posts with __PostgreSQL__.

<br>


--------------------------------------------------------------------------------
### Custom Template Tags & Filters

__Hand-rolled Tags__

Django provides `simple_tag` ( to process data and return a string ) and `inclusion_tag` ( to process data and return a rendered template ) helper functions that allow for you to create your own template tags.

Build your tag using this structure

  ```
  (current_env) …/blog/packtblog$ ls
  blog/       db.sqlite3  manage.py   packtblog/

  …

  ├── blog
  │   ├── __init__.py
  │   ├── models.py
  │   …
  │   └── templatetags      <- new dir
  │       ├── __init__.py   <- empty file you should create
  │       └── blog_tags.py  <- name of your new tag to be loaded into your templates
  …
  ```

These tags built in `blog_tags` can be used in any template and can be stored in a variable captured by a QuerySet within the template. Example:

  ```html
  <!-- …/blog/packtblog/blog/templates/blog/base.html -->
  …
  <h3>Most commented posts</h3>
  <!-- store the result of this QuerySet in most_commented_posts -->
  {% get_most_commented_posts as most_commented_posts %}
  <ul>
    {% for post in most_commented_posts %}
      <li>
        <a href="{{ post.get_absolute_url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
  ```


<br><br>


__Hand-rolled Tag Filters__

Filters let you modify variables in templates. These are Python functions that take one or two params...

  - Value of the variable the filter is to be applied to
  - Optional argument to apply to the filter function

...and return a value that can be displayed or treated by another filter.

  ```html
  # example_filter.html
  {{ variable_name|my_filter_to_apply }}

  # example_filter_with_argument.html
  {{ variable_name|my_filter_to_apply:"some_argument" }}

  # example_with_multiple_filters
  {{ variable_name|my_filter_to_apply|another_filter_to_apply }}
  ```


<br><br>


__Create Custom Filter To Use `.md` In Posts …__

…then convert those contents to HTML in the templates. Turns out Markdown was intended to be converted to HTML. This can be done by installing the Python markdown module via `pip`

  > Author sidenote: dig into this notes repo and see how hard a conversion would be.

Now the `markdown` module and `django.utils.safestring.mark_safe` function can be used, the latter required in order for Django to not escape HTML returned by our filter in `admin/blog/post/`.


<br><br>


__Using Django's Sitemap Framework__

Allows for creating sitemaps dynamically. This XML file helps web crawlers index your site's content. Add `django.contrib.sites` ( to allow you to associate objects to particular websites ) and `django.contrib.sitemaps` to your `INSTALLED_APPS` to use it. These let you more easily run multiple sites in a single project. Don't forget to `migrate` afterwards to sync the `sites` application with your DB. You'll use it in `…/blog/packtblog/blog/sitemaps.py`

By default Django uses a `http://example.com` domain in the `<url><loc>` attribute for denoting where the object lives, defined by a `Site` object automatically stored in the DB, which was automatically created when we synced the site's framework with the DB. Review this at `http://localhost:8000/admin/sites/site` where you can change ( to, for example on our local environment: `localhost:8000` )

  ```
  http://localhost:8000/sitemap.xml

  …
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
    <loc>
      http://example.com/blog/2019/11/26/post-formatted-markdown
    </loc>
  …
  ```

See comments in `…/blog/packtblog/blog/sitemaps.py` for more details


<br><br>


__Dynamically Creating RSS Feeds__

Using Django's builtin syndication feed framework. Its basically just a data format that provides users with updated content, accessed/subscribed to using a feed aggregator.

  > `…/blog/packtblog/blog/feeds.py`

Don't forget to add the endpoint for this RSS feed to your application's ( `blog` ) `urls.py` file.

  > Author protip: with `jq` installed use homebrew to install `yq` which contains an executable wrapper around `jq` for parsing XML data into JSON, then hit the RSS endpoint with `curl`.


<br><br>


__Django's ORM For Matching Operations__

For example: the `contains` filter ( or for case-insensitive: `icontains` )

  ```
  (current_env) …/blog/packtblog$ python manage.py shell
  >>> from blog.models import Post
  >>> # search for posts containing the text 'framework' in its body
  >>> Post.objects.filter(body__contains='framework')
  ```

Not ideal for complex search lookups. Instead use Django's search functionality built on top of PostgreSQL ( `django.contrib.postgres` ). This module provides functions offered by PostgreSQL that are not shared with other Django supported DB's.

  ```
  https://www.postgresql.org/docs/10/textsearch.html
  ```


<br><br>


  > Note: Django is still indeed a database-agnostic web framework


<br><br>


The currently installed SQLite is fine for dev, but doesn't scale up for prod. DL & Install Postgre

  ```
  https://www.postgresql.org/download/macosx/
  ```

Then install the Psycopg2 PostgreSQL adapter for Python

  ```
  (current_env) …/blog/packtblog$ pip install psycopg2
  ```

...or at least try to. Got an error about Postgre binaries not being found in `PATH`. First, find the binaries

  ```
  $ find / -name pg_config 2>/dev/null
  /Library/PostgreSQL/12/debug_symbols/bin/pg_config.dSYM/Contents/Resources/DWARF/pg_config
  /Library/PostgreSQL/12/bin/pg_config
  ```

Add them to your PATH

  ```
  $ export PATH=/usr/local/bin:/Library/PostgreSQL/12/bin/:$PATH
  ```

Restart your shell, verify the installation and restart a new `virtualenv` environment and install `psycopg2`

  ```
  …/blog/packtblog$ pg_config --version
  PostgreSQL 12.1

  …/blog/packtblog$ source ../blog_env/bin/activate

  (current_env) …/blog/packtblog$ pip install psycopg2
  …
  Successfully installed psycopg2-2.8.4

  (current_env) …/blog/packtblog$ python manage.py runserver
  ```


<br><br>


Once installed, start by creating a  `blog` user for the Postgre DB

  ```
  (current_env) …/blog/packtblog$ sudo su postgres
  Password: <password>
  (current_env) /Users/…/blog/packtblog$

  (current_env) /Users/…/blog/packtblog$ createuser -dP blog
  Enter password for new role:
  Enter it again:
  Password:
  ```

Then create the `blog` database and assign it to that new `blog` user

  ```
  (current_env) …/blog/packtblog$ createdb -E utf8 -U blog blog
  ```

Then add the `django.db.backends.postgresql` engine and attributes to `settings.DATABASES.default` and `migrate` all database migrations.


  ```
  (current_env) …/blog/packtblog$ python manage.py migrate
  ```

Create a superuser:

  ```
  (current_env) …/blog/packtblog$ python manage.py createsuperuser
  Username: postgre_admin
  ```

Then the development server can be ran again and `localhost:8000/admin` should be accessible with that new super user. Since the DB is empty ( we just finished switching it ) recreate some posts to let you perform searches against the DB.

Remember, you're logged in to the postgre user right now ( `sudo su postgres` ). That user needs to be used to start the development server. Use `login` to log back into another user account, sudo su postgres to switch back ( restart of the virtualenv is needed )


<br><br>


Postgres then needs to be included in your `INSTALLED_APPS`. Afterwards, simple searches can already be done with the `search` QuerySet lookup

  ```
  >>> from blog.models import Post
  >>> # creates a search vector for body field and a search
  >>> # query for the term django using Postgres
  >>> Post.objects.filter(body__search='django')
  ```

Or by defining `SearchVector` to build a vector for searching against multiple fields

  ```
  >>> from django.contrib.postgres.search import SearchVector
  >>> Post.objects.annotate(search=SearchVector('title', 'body'),).filter(search='django')
  ```

This can be accessed publicly using a new `search` view and form.

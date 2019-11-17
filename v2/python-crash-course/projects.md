# Projects

Assignments from the book

<br>

__Alien Invasion__ Ch 12, 13, 14

Making a 2d game with Python and Pygame: shoot down a fleet of aliens with increasing difficulty.

<br>

__Data Visualization__ Ch 15, 16, 17

Use Matplotlib and Plotly to build visualizations of data, generated locally and accessed online manually and automatically, breaking into the field of data mining.

<br>

__Web Applications__ Ch 18, 19, 20

With Django, let users keep a journal of topics they've learned and deploy the app.


<br><br>


--------------------------------------------------------------------------------
### Project 1

  > Alien Invasion

Pygame helps with visuals, we'll focus on the actual logic. Basically a re-make of Galaga. Install Pygame first

  ```
  $ python -m pip install --user pygame
  ```


<br><br>


#### ch12. Pygame window & user input responses

  > `alien_invasion.py`

  - Class representing the game for an empty Pygame window
  - Pygame surfaces, where game elements can be displayed
  - Setting up an 'event loop' ( not the same as JS ) with a `for` loop
  - __Helper Methods__ does work inside a class but shouldn't be called through an instance, denoted by a leading underscore `_some_method`
  - Keypress are registered as `KEYDOWN` events

  > `settings.py`

  - Put Settings in a modular class

  > `ship.py`

  - Class representing the player's ship
  - All game elements in Pygame are `rect`s ( rectangles )

  > `bullet.py`

  - Sprites
  - Using `copy()` on a `for` loop to modify a list while it's being looped over


<br><br>


#### ch13. Element interaction

Create moving enemy alien fleet, with collision detection for interactions with bullets/aliens/ship.

  > `alien.py`

  - Call each element's `update()` method to move a large set of elements
  - Collision detection ( `sprite.groupcollide()` )

  > `alien_invasion.py`

  - Order that methods are placed in a class doesn't matter to the program itself
  - __Floor division__, `x // y`, divide two numbers and drop any remainders, whole numbers only
  - Nested `for` loops
  - `if not <condition_to_test>:` blocks and `pygame_element.empty()`

  > `game_stats.py`

  - Class for tracking statistics for current game


<br><br>


#### ch14. Play button & increasing game difficulty

  > `button.py`

  - Pygame doesn't have a builtin class for buttons, creates a filled & labeled rectangle
  - Text rendering with Pygame, string is converted to an image
  - Using `rect.collidepoint()` to check if a collision happens at a certain cordinate
  - `if <condition_to_test> and not <condition_to_test>`


<br><br>


--------------------------------------------------------------------------------
### Project 2

  > Visualizing Data

Exploring data through visual representations, using mathematical plotting library __Matplotlib__.

  ```
  $ mkdir mpl && cd mpl
  $ python -m pip install --user matplotlib
  ```


<br><br>


#### ch15. Generating data

Example basic syntax

  > `mpl_squares.py`

  ```python
  # simple line graph
  import matplotlib.pyplot as plt

  squares = [1, 4, 9, 16, 25]  # 1 -> 5 squared

  # fig represents entire figure or collection of plots
  # ax represents a single plot in the figure
  fig, ax = plt.subplots()
  ax.plot(squares)

  # open Matplotlib's viewer
  plt.show()
  ```

  > `scatter_squares.py`

  - A list comprehension to generate a list of values automatically
  - Colormaps

  > `random_walk.py`

  - RandomWalk class to make random decisions
  - Practical use cases: nature, physics, biology, chemistry, economics
  - Styling scatter plots

  > `die.py`

  - Use __Plotly__ for interactive visualizations ( useful for visualizing in browsers )
  - Visualize a dice being rolled

  ```
  $ python -m pip install --user plotly
  ```

  - Histograms to show how often a result occurs
  - Using `list()` to convert to a list explicitly
  - My first original __list comprehension__


<br><br>


#### ch16. Downloading data ( CSV and JSON )

Python includes a `csv` module for parsing CSV, which will be used with Matplotlib to chart downloaded weather data from two different climates. The `json` module will be used with Plotly to display JSON earthquake data. Obviously CSV is harder for humans to read but easy for programs.

Python parses a CSV file's headers first, as the first line.

  > `sitka_highs.py`

  - Using `enumerate()` to extract values
  - Accessing values from a specific column from a `for` loop
  - Shadows between plotted series with `fill_between()`

  > `quit.py`

  - Custom module to easily quit pygame, matplotlib, plottly, etc etc

  > `eq_explore_data.py`

  - Basic pything -> JSON syntax, display a map filled with earthquake data
  - Python converts JSON to a disctionary


<br><br>


#### ch17. API basics in Python

Python's Requests package simplifies API calls

  ```
  $ python -m pip install --user requests
  python-crash-course/projects/mpl $ mkdir api
  ```

  > `python_repos.py`

  - Basic API syntax with Requests module

  ```python
  # automatically issue API calls to grab most starred Python
  # projects on GitHub and process responses

  import requests

  url = 'https://api.github.com/search/repositories?q=language:python&sort=stars'
  headers = {'Accept': 'application/vnd.github.v3+json'}

  # the call
  r = requests.get(url, headers=headers)
  print(f"Status code: {r.status_code}")

  # storing the response
  response_dict = r.json()

  print(response_dict.keys())
  ```

  - Failed attempt at using lambdas in a ternary
  - Monitor rate limits available

  ```
  https://api.github.com/rate_limit
  ```

  > `python_repos_visual.py`

  - Using raw HTML in Plotly on text elements

  > `hn_article.py`

  - Parsing API responses from Hacker News, for a single article

  > `hn_submissions.py`

  - Parsing API responses for top articles from Hacker News
  - The `operator.itemgetter()` method


<br><br>


--------------------------------------------------------------------------------
### Project 3

  > Web Apps

Using the Django __web framework__ to build a journal system that lets users track information they've learned.


<br><br>


#### ch18. Spec and general setup

Specs describe a project's goals, it's functionality, appearance and interface.

  > Write a web app called Learning Log that allows users to log topics they're interested in and to make journal entries about each topic. The home page will describe the site and invite users to register or log in. Once logged in the user can create new topics, add new entries and read and edit existing entries.


<br><br>


Spin up an isolated virtual environment '`ll_env`' using `venv` module

  ```
  $ mkdir learning_log && cd learning_log

  $ python -m venv ll_env
  ```

Now activate it using `activate` script

  ```
  $ source ll_env/bin/activate

  (ll_env)…/learning_log$
  ```

Enter `deactivate` command to deeactivate a virtual environment.

Now install django with the environment activated

  ```
  (ll_env)…/learning_log$ pip install django
  ```

Django and anything else you install in this environment will only be available when it's active.


<br><br>


Create a new Django project, which builds a new directory titled `learning_log` under the current directory `learning_log` ( so, `learning_log/learning_log` )

  ```
  (ll_env)…/learning_log$ django-admin startproject learning_log .

  (ll_env)…/learning_log$ ls
  > learning_log/  ll_env/  manage.py

  (ll_env)…/learning_log$ ls learning_log
  > __init__.py  settings.py  urls.py  wsgi.py

  ```

  - `manage.py`  takes in commands and feeds them to Django to run
  - `settings.py`  how Django interacts with your system and manages the project
  - `urls.py`  what pages to build when an endpoint is hit
  - `wsgi.py`  web server gateway interface, helps Django serve files it builds

Django stores most project info in a SQLite database. Anytime the DB is modified, it's referred as having been __migrated__. Use `python` command anytime a `manage.py` command is run

  ```
  (ll_env)…/learning_log$ python manage.py migrate  # builds the DB
  ```

After the initial DB migration, review project's current state

  ```
  (ll_env)…/learning_log$ python manage.py runserver
  > Watching for file changes with StatReloader
  > Performing system checks...
  >
  > System check identified no issues (0 silenced).
  > October 02, 2019 - 22:21:07
  > Django version 2.2.6, using settings 'learning_log.settings'
  > Starting development server at http://127.0.0.1:8000/
  > Quit the server with CONTROL-C.
  ```

With the server running, go to the splash page at the specified address. Django builds the page at that URL when a URL is visited.

Django __projects__ are groups of __apps__ working together. Tell Django to create the initial app files

  ```
  (ll_env)…/learning_log$ python manage.py startapp learning_logs

  (ll_env)…/learning_log$ ls
  > db.sqlite3     learning_log/  learning_logs/<--new  ll_env/        manage.py

  (ll_env)…/learning_log$ ls learning_logs
  > __init__.py  admin.py     apps.py      migrations/  models.py    tests.py     views.py
  ```


<br><br>

__The `Topic` model__

  > `projects/django/learning_log/learning_logs/models.py`

  - Tell Django how to work with the data stored in the app
  - Three main steps anytime we want to modify the data Learning Log or other Django apps manage:
    1. modify `models.py`
    2. call `makemigrations` on `learning_logs` ( or whatever you called `startapp` on )
    3. tell Django to `migrate` the project to commit the created migrations


<br><br>


Models need to be activated from `settings.py` under `INSTALLED_APPS[]`. Place your apps *before* the default Django apps in order to override default behaviors if required. Then you need to tell Django to modify the DB so it can store info related to the model you've added:

  ```
  (ll_env)…/learning_log$ python manage.py makemigrations learning_logs
  > Migrations for 'learning_logs':
  >   learning_logs/migrations/0001_initial.py
  >     - Create model Topic
  ```

^ That ^ migration will create a table for the new model, `Topic`, in the DB, and the `makemigrations` command will tell Django how to modify the DB in order to store that info, via creating a new file '`0001_initial.py`'

  ```
  (ll_env)…/learning_log$ ls learning_logs/migrations
  > 0001_initial.py  __init__.py      __pycache__/
  ```

The migrration then needs to be applied to have Django update the DB

  ```
  (ll_env)…/learning_log$ python manage.py migrate
  > Operations to perform:
  >   Apply all migrations: admin, auth, contenttypes, learning_logs, sessions
  > Running migrations:
  >   Applying learning_logs.0001_initial... OK  <-- confirmation of successful migration
  ```


<br><br>


Models can be manipulated through Django's __admin site__, dependent on a user's priveleges. Create a superuser

  ```
  (ll_env)…/learning_log$ python manage.py createsuperuser
  > Username (leave blank to use 'justin'): ll_admin
  > Email address:  <-- optionally leave blank
  > Password:  <-- will get stored as a hash
  > Password (again):
  > Superuser created successfully.
  ```

The `User` and `Group`, among some others, are models Django creates in the admin site automatically. Any models we create need to be added ( registered ) manually, via `learning_logs/admin.py`. Example:

  ```python
  from django.contrib import admin

  # import the module you want to register
  from .models import Topic

  # register Topic with admin site
  admin.site.register(Topic)
  ```

The superuser account we created should now be able to access the admin site at

  ```
  http://localhost:8000/admin/
  Manage users and groups and work with data related to models you've added.
  ```


<br><br>


__The `Entry` model__

  > `projects/django/learning_log/learning_logs/models.py`

  - __Many-to-one__ relationships, for example, each entry needs to be associated with a Topic
  - Using __cascading deletes__ on sub-associations if a Topic key is deleted
  - Python ternaries!

To demonstrate the connectoin between Topics and their Entries, after migrating the DB to include the new `Entry` class, which contains a `models.ForeignKey(Topic, …)` attribute, register the model in the admin site and click 'Add' next to the Entry listing. Each entry you add will have a drop down selection box containing a Topic to choose from.


<br><br>



----
__Django's shell__

Work with a project's data in a terminal session. Useful for testing and troubleshooting a project. Bring up the shell's interactive environment with `manage.py`

  ```
  (ll_env)…/learning_log$ python manage.py shell  # launches a Python interpreter

  # example usage
  >>> from learning_logs.models import Topic
  >>> Topic.objects.all()  # method returns a queryselect list
  <QuerySet [<Topic: Chess>, <Topic: Rock Climbing>]>

  # loop to get topic ID's
  >>> topics = Topic.objects.all()
  >>> for topic in topics:
  ...   print(topic.id, topic)
  ...
  1 Chess
  2 Rock Climbing

  # now that we know ID's, we can access a spcific object
  >>> t = Topic.objects.get(id=1)
  >>> t.text
  'Chess'
  >>> t.date_added
  datetime.datetime(2019, 10, 3, 20, 47, 39, 163140, tzinfo=<UTC>)
  ```

A note about accessing attributes that defines a `ForeignKey` connection between datapoints: use the name of the related model followed by `_set`:

  ```
  >>> t = Topic.objects.get(id=1)
  …
  >>> t.entry_set.all()  # get all entry models for this topic
  <QuerySet [<Entry: The opening is the first part of the game, roughly...>, <Entry: In the opening phase of the game, it's important t...>]>
  ```

Remember to `CTRL D` and restart the shell after a model is modified to see the changes you've made reflect.


<br><br>


----
__Webpages__

Require three stages: defining URL patterns, writing views, writing templates.

  > `projects/django/learning_log/learning_log/urls.py`
  >
  > `projects/django/learning_log/learning_logs/urls.py`

  - Define URL maps

  > `projects/django/learning_log/learning_logs/views.py`

  - Writing custom views

View functions should take in info from a request, prep the data needed to generate a page then send the data back to the browser, often by using a template for defining what a page looks like


<br><br>


----
__Templates, best practices__

Directory structure: with `app_name` being the name of the directory Django creates when the initial `python manage.py startapp`:

  ```
project_root
.
└── app_name  (learning_logs)
    └── templates
        ├── app_name  (learning_logs)
        │   ├── base.html          <-- parent inherited template
        │   ├── some_view.html     <-- a urls.py endpoint
        │   ├── another_view.html  <-- a urls.py endpoint
        │   └── index.html         <-- home page
        ├── another_app_name
        │   ├── base.html
        │   ├── some_view.html
        │   ├── another_view.html
        │   └── index.html
        _
  ```

Django uses __template tags__ ( `{% %}` ) to generate dynamic content. Child templates define what gets inserted into the parent by using `block` tags ( `{% block content %}{% endblock content %}` )

  ```html
  <p>
    <!-- using a url block template -->
    <a href="{% url 'learning_logs:index' %}">Learning Log</a>
  </p>

  <!-- the child will define 'content' to be inserted here -->
  {% block content %}{% endblock content %}

  ```


<br><br>


#### ch19. User Accounts

User registration, authentication and form-based attack preventions tactics. Django automates a lot of validation and DB insertions, simplest method of creating a form is with __ModelForm__

  > `# projects/django/learning_log/learning_logs/forms.py`

  - Examples of ease of use of Django's input validations and DB insertions
  - Nested `Meta` classes
  - Dealing with POST requests in Python/Django

  > `projects/learning_log/learning_logs/templates/learning_logs/new_topic.html`

  - Example of a basic input form
  - Cross site forgery prevention template tags `{% csrf_token %}`
  - Render form elements as a paragraph with `{{ form.as_p }}`


<br><br>


----
__The user management app's basic functions__

Isolate user interaction functionalities under a new app in this project.

  ```
  # just as a recap, make sure your environment is active
  …/learning_log$ source ll_env/bin/activate  # not active
  (ll_env)…/learning_log$  # active, ready for commands

  (ll_env)…/learning_log$ ls
  db.sqlite3     learning_log/  learning_logs/ ll_env/        manage.py

  # tell Django to build a new app for this business logic
  (ll_env)…/learning_log$ python manage.py startapp users

  (ll_env)…/learning_log$ ls
  db.sqlite3     learning_log/  learning_logs/ ll_env/        manage.py      users/
  ```

Then don't forget that we need a link to the `edit_entry` page from within each entry

  ```html
  <!-- projects/learning_log/learning_logs/templates/learning_logs/topic.html -->

  …
  {% for entry in entries %}
    <li>
      …
      <p>
        <a href="{% url 'learning_logs:edit_entry' entry.id %}">Edit entry</a>
      </p>
    </li>
  …
  ```


<br><br>


----

__User account registrations__

Setting up user registration and authorization system, primarily using Django's builtin user authentication system. The `Topic` model will also need to be modified, so that every topic belongs to a certain user.


<br><br>


Include the `users` app into the overall project and make an endpoint for it

  ```python
  # projects/django/learning_log/learning_log/settings.py

  …
  # include the new users app in the overall project
  INSTALLED_APPS = [
      'learning_logs',
      'users',
      …
  …
  ```

  ```python
  # projects/django/learning_log/learning_log/urls.py

  …
  urlpatterns = [
      …
      # my schemas
      path('users/', include('users.urls')),
      path('', include('learning_logs.urls')),
      …
  …
  ```

Now URL's starting with `users` can be hit, such as `localhost/users/login/`


<br><br>


Django includes a default `login` page for us to use.

For example: `http://localhost:8000/users/login`. The word `users` in a URL would tell Django to look in `users/urls.py` and `login` tells it to send requests to Django's default `login` view.

  ```python
  # new urls.py from within learning_log/users for urls in this namespace

  from django.urls import path, include
  app_name = 'users'

  urlpatterns = [
      # default auth urls that Django has defined
      path('', include('django.contrib.auth.urls')),
  ]
  ```


<br><br>


Note that what Django is actually providing is a view function for `users/…` requests, a template still needs to be created. By default the auth views look for templates inside a `registration` folder.

  ```
  (ll_env)…/learning_log$ mkdir users/templates
  (ll_env)…/learning_log$ mkdir users/templates/registration
  (ll_env)…/learning_log$ touch users/templates/registration/login.html
  ```

The login view sends a form to the template, it's up to us to display the form and add a submit button, which is done via `.../registration/login.html`


<br><br>


After adding templates and functionalities to login/logout ( and testing it actually works by using the user I've already created for the admin.py page ), utilize Django's `UserCreationForm` for user registrations, with a custom view function and template.

Similar to how the urls schema was defined in `users/urls.py`, add the route for the registration page first.

  ```python
  from . import views
  ...
  urlpatterns = [
      ...
      # url.com/users/register
      path('register/', views.register, name='register'),
  ```

Note that it's best practice to include a confirmation user registration email or method.


<br><br>


Users should be able to own their data, access can be restricted by using `@login_required` decorator. A __decorator__ is a directive placed just before a function definition that Python will apply to the function before it runs, to alter how the function code behaves.

  ```python
  # project/django/learning_log/learning_logs/views.py
  …
  from django.contrib.auth.decorators import login_required
  …
  @login_required
  def topics(request):
    """Show all topics."""
    …
  ```


<br><br>


----

__Connecting data to specific users__

Connect data to users that submitted the data. Data ownership is a heirarchy, topics being parents to each entry submitted about the topic. This means the topics are the highest level of data available, which does the job of tracing back down to every individual topic entry.

Update the `Topic` model by adding a foriegn key relationship to a user, then migrate the DB and update the views to only show data associated with the currently logged in user.

  ```python
  # projects/django/learning_log/learning_logs/models.py

  …
  from django.contrib.auth.models import User
  …
  class Topic(models.Model):
      …
      owner = models.ForeignKey(User, on_delete=models.CASCADE)
  ```


<br><br>


Now migrate the DB for it to store the connection between each topic and a user.

Bring up a shell session to review existing user IDs. Import the User model into the shell session then review the users' username and ID.

  ```
  (ll_env)…/learning_log$ python manage.py shell
  >>> from django.contrib.auth.models import User
  >>> User.objects.all()
  <QuerySet [<User: ll_admin>, <User: jsore>, <User: basic_test_account>]>

  >>> for user in User.objects.all():
  >>>     print(user.username, user.id)
  ll_admin 1
  jsore 2
  basic_test_account 3
  ```

With this info we can migrate the DB. Provide Python with a arbitrary user to tie the existing topics into.

  ```
  (ll_env)…/learning_log$ python manage.py makemigrations learning_logs
    You are trying to add a non-nullable field 'owner' to topic without a default; we can't do that (the database needs something to populate existing rows).
  Please select a fix:
   1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
   2) Quit, and let me add a default in models.py
  Select an option: 1  <-- HERE is telling to use a default user for existing DB entries
  Please enter the default value now, as valid Python
  The datetime and django.utils.timezone modules are available, so you can do e.g. timezone.now
  Type 'exit' to exit this prompt
  >>> 1  <-- HERE is giving Python the ID of the user to assign the existing topics to
  Migrations for 'learning_logs':
    learning_logs/migrations/0003_topic_owner.py
      - Add field owner to topic
  ```

We're trying to add a required, '`non-nullable`', field to an existing model ( `topic` ) without a default specified. Django let's you set it at this point.

Now execute the migration

  ```
  (ll_env)…/learning_log$ python manage.py migrate
  ```

Verify the results are as expected

  ```
  (ll_env)…/learning_log$ python manage.py shell

  >>> from learning_logs.models import Topic
  >>> for topic in Topic.objects.all():
  >>>     print(topic, topic.owner)
  Chess ll_admin
  Rock Climbing ll_admin
  Python ll_admin
  ```


<br><br>


Time to restrict topic access to the appropriate users, only display the topics that logged in user wrote. Add to the `topics()` function:

  ```python
  …
  def topics(request):
      topics = Topic.objects.filter(owner=request.user).order_by('date+added')
  ```

Then be sure to protect against random URL guessing for a logged in user different from a Topic's owner, both the `/topics/<id>` and `/edit_entry/<id>` endpoints in `topic()` and `edit_entry()` functions. They should both throw 404's.

After that, all that's left is to fix the `new_topic` endpoint and associate new topics to the current user.


<br><br>


This project's functionality is now complete, only styles are left and the actual deployment.


<br><br>


#### ch20. Styles and Deployment

Using Django-bootstrap4. This app downloads Bootstrap's dependencies, places them appropriately in the project and makes styling directives available in your project's templates.

  ```
  (ll_env)…/learning_log$ pip install django-bootstrap4
  ```

Then add `bootstrap4` to `settings.py`'s installed app list and rewrite your HTML to include Bootstrap selectors as needed.


<br><br>


----

__Deploying with Heroku__

1. Signup with a free account and download the Heroku CLI

  ```
  https://devcenter.heroku.com/articles/heroku-cli/
  ```

Follow the install instructions for your OS.

  ```
  $ brew tap heroku/brew && brew install heroku
  ```


<br><br>


2. Instal packges Django needs in order to serve projects

For managing the DB Heroku uses

  ```
  (ll_env)…/learning_log$ pip install psycopg2==2.7.*
  ```

Handles configurations for the app to run properly on Heroku servers

  ```
  (ll_env)…/learning_log$ pip install django-heroku
  ```

Provides the server capable of serving apps in a live environment

  ```
  (ll_env)…/learning_log$ pip install gunicorn
  ```


<br><br>


3. Use `freeze` to generate a `requirements.txt`

The `freeze` command writes out the names of the packages currently installed in the project. Pipe it out to a new file.

  ```
  (ll_env)…/learning_log$ pip freeze > requirements.txt
  ```

Some of these packages were installed manually by yourself or automatically as dependencies of these packages.

Heroku installs all these packages when the application is deployed, recreating our environment.


<br><br>


4. Specify the Python runtime Heroku should use

Make sure to use the correct ( your current ) Python version, saved in a file `runtime.txt`

  ```
  (ll_env)…/learning_log$ echo python-3.7.2 > runtime.txt
  ```


<br><br>


5. Define Heroku environment settings in `settings.py`


<br><br>


6. Tell Heroku what process it needs to start to properly serve the project

This will be defined in what's called a `Procfile` file ( binary, no extension ). We need to tell Heroku to use gunicorn as a server and to use the settings from `projects/django/learning_log/wsgi.py` to launch the app, with a `log-file` flag to tell Heroku what kinds of events to log.

  ```
  (ll_env)…/learning_log$ echo 'web: gunicorn learning_log.wsgi --log-file -' > Procfile
  ```


<br><br>


7. Git version control

Git is already configured on my system, not getting into install steps here. But, the book's recommended `gitignore` files are

  ```
  # we can recreate this directory automatically at anytime
  ll_env/

  # contains the .pyc files generated when Django runs .py files
  __pycache__/

  # bad habbit to track changes to the local DB, might accidentally
  # overwrite a live DB when local is pushed to to the server
  *.sqlite3
  ```

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

<br>

__ch12. Pygame window & user input responses__

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

<br>

__ch13. Element interaction__

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

<br>

__ch14. Play button & increasing game difficulty__

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

<br>

__ch15. Generating data__

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

<br>

__ch16. Downloading data__ ( CSV and JSON )

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

<br>

__ch17. API basics in Python__

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

<br>

__Spec and setup__

Specs describe a project's goals, it's functionality, appearance and interface.

  > Write a web app called Learning Log that allows users to log topics they're interested in and to make journal entries about each topic. The home page will describe the site and invite users to register or log in. Once logged in the user can create new topics, add new entries and read and edit existing entries.

Spin up an isolated virtual environment '`ll_env`' using `venv` module

  ```
  $ mkdir learning_log && cd learning_log
  $ python -m venv ll_env
  ```

Now activate it using `activate` script

  ```
  $ source ll_env/bin/activate
  (ll_env) $
  ```

Enter `deactivate` command to deeactivate a virtual environment.

Now install django with the environment activated

  ```
  (ll_env)$ pip install django
  ```

Django and anything else you install in this environemtn will only be available when it's active.

<br>

Create a new Django project

  ```
  (ll_env)$ django-admin startproject learning_log .
  (ll_env)$ ls
  > learning_log/  ll_env/  manage.py
  (ll_env)$ ls learning_log
  > __init__.py  settings.py  urls.py  wsgi.py
  ```

  - `manage.py`  takes in commands and feeds them to Django to run
  - `settings.py`  how Django interacts with your system and manages the project
  - `urls.py`  what pages to build when an endpoint is hit
  - `wsgi.py`  web server gateway interface, helps Django serve files it builds

Django stores most project info in a SQLite database. Anytime the DB is modified, it's referred as having been __migrated__. Use `python` command anytime a `manage.py` command is run

  ```
  (ll_env)$ python manage.py migrate  # builds the DB
  ```

After the initial DB migration, review project's current state

  ```
  (ll_env)$ python manage.py runserver
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

<br>

Django __projects__ are groups of __apps__ working together. Tell Django to create the initial app files

  ```
  (ll_env)$ python manage.py startapp learning_logs
  (ll_env)$ ls
  > db.sqlite3     learning_log/  learning_logs/<--new  ll_env/        manage.py
  (ll_env)$ ls learning_logs
  > __init__.py  admin.py     apps.py      migrations/  models.py    tests.py     views.py
  ```

  > `models.py`

  - Tell Django how to work with the data stored in the app



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

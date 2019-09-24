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


<br>

--------------------------------------------------------------------------------
### Project 1

  > Alien Invasion

Pygame helps with visuals, we'll focus on the actual logic. Basically a re-make of Galaga. Install Pygame first

  ```
  $ python -m pip install --user pygame
  ```

<br>

__Pygame window & user input responses__

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

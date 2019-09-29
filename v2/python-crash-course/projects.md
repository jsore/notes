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

# Ch. 2. Variables & Simple Data Types


<br>

--------------------------------------------------------------------------------
### Naming Conventions

Differences from JS:

- Use `_` for word separations, not camelCase
- ...


<br><br>

--------------------------------------------------------------------------------
### Super Basic Strings & Var Assignments

__Methods for adjusting case__

  ```python
  variable = "some untrusted User inPut"
  print(variable.title())  # Some Untrusted User Input
  print(variable.upper())
  print(variable.lower())
  ```

<br>

__Variables in strings__

`f-strings` ( "format"-strings )

  ```python
  first_var = "string one"
  second_var = "string two"

  concat_strings = f"{first_var}, {second_var}"
  print(concat_strings)  # string one, string two

  message = f"These are: {concat_strings.title()}"
  print(message)  # These are: String One, String Two
  ```

<br>

  > __NOTE: f-strings is only for Python 3.6+__
  >
  > For 3.5 and earlier, use `format()` method
  >
  > `concat_strings = "{} + {}".format(first_var, second_var)  # string one + string two`

<br>

__Whitespace because Python doesn't believe in semicolons__

  - Strings: insert tab: `\t`
  - Strings: insert newline: `\n`
  - Strings: strip extra ending whitespace: `variable_with_extra_space.rstrip()`
  - Strings: strip extra begining whitespace: `variable_with_extra_space.lstrip()`
  - Strings: strip all extra whitespace: `variable_with_extra_space.strip()`

<br>

__Multiple Assignemnts__

  ```
  x, y, z = 1, 2, 3  # initializes three vars
  # x = 1
  # y = 2
  # z = 3
  ```

<br>

__Constants__

Python doesn't have a method for storing constants, arbitrarily name your const's in UPPERCASE

  ```
  SOMETHING_I_DONT_WANT_CHANGED = value
  ```


<br><br>

--------------------------------------------------------------------------------
### Zen Of Python

Python community's philosophy for writing good code can be accessed with the `import this` command, enterred into a Python interpreter

  ```
  $ python3
  >>> import this
  >>> > The Zen of Python, by Tim Peters
  >>> > Beautiful is better than ugly.
  >>> > Explicit is better than implicit.
  >>> > Simple is better than complex.
  >>> > Complex is better than complicated.
  >>> > Flat is better than nested.
  >>> > Sparse is better than dense.
  >>> > Readability counts.
  >>> > Special cases aren't special enough to break the rules.
  >>> > Although practicality beats purity.
  >>> > Errors should never pass silently.
  >>> > Unless explicitly silenced.
  >>> > In the face of ambiguity, refuse the temptation to guess.
  >>> > There should be one-- and preferably only one --obvious way to do it.
  >>> > Although that way may not be obvious at first unless you're Dutch.
  >>> > Now is better than never.
  >>> > Although never is often better than *right* now.
  >>> > If the implementation is hard to explain, it's a bad idea.
  >>> > If the implementation is easy to explain, it may be a good idea.
  >>> > Namespaces are one honking great idea -- let's do more of those!
  ```


<br><br>

--------------------------------------------------------------------------------
# Ch. 3 & 4. Lists

> `lists.py`

  ```python
  bicycles = ['trek', 'cannondale', 'redline', 'specialized']

  print(bicycles)  # ['trek', 'cannondale', 'redline', 'specialized']
  print(bicycles[1].title())  # Cannondale
  print(bicycles[-1])  # specialized
  print(bicycles[-3])  # cannondale

  # also works like JS string literals for Python 3.6+
  message = f"My first bike was a {bicycles[3].title()}"
  print(message)  # My first bike was a Specialized
  ```

__adding to lists__

  ```python
  bicycles.append('huffy')  # ['trek', 'cannondale', 'redline', 'specialized', 'huffy']

  bikes = []
  bikes.append('honda')   # ['honda']
  bikes.append('yamaha')  # ['honda', 'yamaha']
  bikes.append('suzuki')  # ['honda', 'yamaha', 'suzuki']

  bikes.insert(1, 'ducati')  # ['honda', 'ducati', 'yamaha', 'suzuki']
  ```

__removing from lists__

  ```python
  del bikes[0]  # ['ducati', 'yamaha', 'suzuki']
  ```

__popping off the stack ( last item is top of stack )__

  ```python
  print(bikes)              # ['ducati', 'yamaha', 'suzuki']
  less_bikes = bikes.pop()
  print(bikes)              # ['ducati', 'yamaha']
  print(less_bikes)         # suzuki
  my_first = bikes.pop(1)
  print(bikes)              # ['ducati']
  print(my_first)           # yamaha
  ```

__removing by value__

  ```python
  print(bikes)                      # ['ducati', 'yamaha', 'suzuki']
  removed = bikes.remove('yamaha')  # deletes only 1st ocurrence of value
  print(bikes)                      # ['ducati', 'suzuki']
  print(removed)                    # yamaha
  ```

__sorting__

  ```python
  print(bikes)                      # ['ducati', 'yamaha', 'suzuki']

  bikes.sort()              # a-zA-Z, immutable
  bikes.sort(reverse=True)  # z-aZ-A, immutable

  print(bikes.sorted)  # original stays the same

  bikes.reverse()  # reverses the order, call again to revert
  ```

__return length__

  ```python
  len(bikes)  # 3
  ```


<br><br>

--------------------------------------------------------------------------------
### Lists & Loops

  > `loops.py`

__basic syntax__

  ```python
  items = ['val1', 'val2', 'val3']
  for item in items:
      print(item)  # don't forget Python loves whitespace

  print('this is outside the loop')
  ```

__ranges__

  ```python
  for value in range(1, 5):
      print(value)
  # 1
  # 2
  # 3
  # 4
  ```

__list from ranges__

  ```python
  numbers = list(range(1, 6))  # [1, 2, 3, 4, 5]
  ```

__set step size for skipping numbers in range__

  ```python
  even_numbers = list(range(2, 11))     # 2, 3, ... 10
  even_numbers = list(range(2, 11, 2))  # adds 2: [2, 4, 6, 8, 10]
  ```

__squaring integers in a range__

  ```python
  squares = []
  for value in range(1, 11):    # square ints 1-10
      # square = value ** 2     # two asterisks represent exponents
      # squares.append(square)
      # or, just:
      squares.append(value**2)
  print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
  ```

__List comprehension for simpler list generating__

Combines `for` and creation of new elements, auto-appends each

  ```python
  squares = [value**2 for value in range(1, 11)]  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
  ```

<br>

__Slices__

  > `slices.py`

  ```python
  # ['charles', 'martina', 'michael', 'florence', 'eli']

  some_list[0:3]  # returns items 0, 1, 2
  some_list[1:4]  # returns items 1, 2, 3

  # left-right, start slicing from index X
  some_list[:4]   # returns items 0, 1, 2, 3

  # right-left, start slicing from index X
  some_list[2:]   # returns all from 3rd item from right to start of list
  some_list[-3:]  # returns last 3


  # associations
  new_list = some_list[:]       # copies entire list
  new_list.append('some item')  # lists stay different
  some_list.append('other item')

  new_list = some_list  # reference to same some_list val, they're 'linked'


  # looping slices
  for player in players[:3]:
      print(player.title())  # first three players only
  ```


<br>

__Tuples__

Lists with immutable values

  ```python
  dimensions = (200, 50)
  print(dimensions)
  print(dimensions[0])  # 200
  print(dimensions[1])  # 50
  ```

Values can't be modified, but the entire variable can be re-defined

  ```
  dimensions = (200, 50)
  print(dimensions)
  dimensions[0] = 250      # invalid
  dimensions = (400, 100)  # valid
  print(dimensions)
  ```

Tuples are defined by the presence of a comma, remember to include trailing comma if using tuple with single value


<br><br>

--------------------------------------------------------------------------------
# Ch. 5. If Statements

Basic syntax

  ```python
  if conditional_test:  # if
      do something
  if diff_conditional_test:
      do other thing

  if conditional_test:  # if-else
      do something
  else:
      something different

  if conditional_test:  # if-elif-else
      do something
  elif diff_conditional_test:
      # breaks out of if chain if passing
      do a new thing
  else:
      something different

  cars = ['audi', 'bmw', 'subaru', 'toyota']
  if cars:
      print('list is not empty')
      for car in cars:
          if car == 'bmw':
              print(car.upper())
          else:
              print(car.title())
  ```

Python's conditional evaluations are `True` and `False`, 1st letter capitalized

__Equality__

  - `=` statement, for assignments
  - `==` conditional, case sensitive
  - `car.lower() == 'value'` conditional, case insensitive, doesn't alter original
  - `!=` inequality conditional
  - `<  <=  >  >=` less, less/equal, greater, greater/equal
  - `in` check if a value is in a list ( `if user not in banned_users:` )

__Multiple conditions__, ( `val1` and `val2` are conditions in the examples )

  - `(val1) and (val2)` multipe conditions, True/False if overall is `True/False`, parens optional
  - `(val1) or (val2)` multiple conditions, passes if either or both passes, fails when both fail

__Multiple Lists__

Watch for nonsensical input before acting on it

  ```python
  available_toppings = ['mushrooms', 'olives', 'green peppers',
                      'pepperoni', 'pineapple', 'extra cheese']
  requested_toppings = ['mushrooms', 'french fries', 'extra cheese']

  # check each requested topping against available toppings
  for requested_topping in requested_toppings:
      if requested_topping in available_toppings:
          print(f"Adding {requested_topping}")
      else:
          print(f"Sorry, {requested_topping} isn't available")
  ```

<br><br>

--------------------------------------------------------------------------------
# Ch. 6. Disctionaries

Store relatable data, key-value pairs

Values can be any object creatable in Python e.g. strings, lists, other dictionaries

  > `dictionaries.py`


__Dictionary__

  ```python
  alien_0 = {'color': 'green', 'points': 5}
  ```

__Set__

  ```python
  alien_2 = {'green', 'orange', 10}
  print(alien_0['color'])   # green
  print(alien_0['points'])  # 5
  ```

__Get a value after a dictionary is defined__

  ```python
  new_points = alien_0['points']
  print(f"You got {new_points}")
  ```

__Add new values__

  ```python
  alien_0['x_position'] = 0
  alien_0['y_position'] = 25
  print(alien_0)
  ```

__Modify values__

  ```python
  alien_1 = {'x_pos': 0, 'y_pos': 25, 'speed': 'medium'}
  print(f"Start pos: {alien_1['x_pos']}")
  if alien_1['speed'] == 'slow':  # move the alien right
      x_increment = 1
  elif alien_1['speed'] == 'medium':
      x_increment = 2
  else:
      x_increment = 3
  alien_1['x_pos'] = alien_1['x_pos'] + x_increment  # old+new
  print(f"New pos: {alien_1['x_pos']}")
  ```

__Delete values__

  ```python
  del alien_1['x_pos']
  ```

__Get values__

  ```python
  print(alien_1)            # {'x_pos': 0, 'y_pos': 25, 'speed': 'medium'}
  print(alien_1['points'])  # Traceback: KeyError 'points'

  point_value = alien_1.get('points', 'Some default value')
  print(point_value)        # Some default value

  point_value = alien_1.get('points')  # no default argument
  print(point_value)  # "None" ( "no value exists" )
  ```

<br>

__Looping Dictionaries__

  > `dictionary-loops.py`

  - `for key, value in some_dictionary`

  ```python
  friends = ['phil', 'sarah']
  for name in favorite_languages.keys():
      print(f"Hi {name.title()}.")
      if name in friends:
          language = favorite_languages[name].title()
          print(f"\t{name.title()}, your favorite language is {language}")
      if 'erin' not in favorite_languages.keys():
          print("Please finish survey")
  ```

<br><br>

--------------------------------------------------------------------------------
# Ch. 7. User Input

The `input()` method awaits input from `STDIN` and pauses an application until it gets it

  > `input.py`

  - `+=` to update variable value
  - `input()` interprets strings by default, convert the value with `int()` for numbers
  - Modulo operator `%` returns remainder after dividing a number
  - is something divisible by 2?
  - `while` loops
  - Quit values for exiting prompts
  - Flags, determine whether or not the entire program is active, allows for there to be multiple exit events across multiple conditional tests
  - Break'ing out of any kind of loop, for directing the flow of the program
  - Using Continue to return to beginning of loop
  - Use `while` loops with modifying lists and dictionaries, not `for`, difficult for Python to track the list's items


<br><br>

--------------------------------------------------------------------------------
# Ch. 8. Functions

  > `functions.py`
  > `modifying_list_args.py`
  > `pizza.py` & `making_pizzas.py`

  - Positional vs keyword arguments, dictionaries and lists of values as args
  - Default values in definition parameters
  - Python returning from a function
  - `None` to set a variable without a value assigned to it
  - Individual functions should have singular individual task
  - Send copy of list to a function to preserve the original variable, preventing the function from mutating a list with slices
  - Passing arbitrary number of args with `*some_parameter` `**a_key_value_pair`
  - Function modules


<br><br>

--------------------------------------------------------------------------------
# Classes

  > `classes.py`

OOP style dictates that __classes__ should represent real-world things and situations, __objects__ should be based off those classes. Classes define general behavior that a whole category of objects can have. Each object is automatically equipped with the general behavior with whatever unique traits desired.

Objects: __instantiations__

Classes: __instances__

Classes should be stored in individual modules and their instances imported.

<br>

Model a class representing a dog. What do I know about pet dogs? They have a name, and age,  ( the information ), most sit and roll over ( the behaviors ).

  ```python
  class Dog:
      """
      A simple model of a dog.
      """

      def __init__(self, name, age):
          """
          Initialize name and age attributes.
          """
          self.name = name
          self.age = age

      def sit(self):
          """
          Simulate a dog sitting in response to a command.
          """
          print(f"{self.name.title()} is now sitting. Arf.")

      def roll_over(self):
          """
          Simulate a dog rolling over in response to a command.
          """
          print(f"{self.name.title()} rolled over! Bark.")

      ...
  ```

__The `__init__(self, params)` method__

Python runs this automatically when a new instance is created. The `self` parameter is mandatory, it gives that instance access to attributes and methods in the class. Every method call on an instance automatically passes it.

__Calling Dog()__

The `self` parameter is passed to `Dog()` automatically, don't need to pass it. It'll need to be passed whatever parameters ( the parameters with the instance's `__init__()` method ), which is the information we want stored within the class.

__Any variable prepended with `self`__

These are called __attributes__. Example: `self.name`, `self.age`. These are available to every method in the class and can be accessed from any created instance of the class. The parameters passed to the class when instnace is created are assigned to these `self` variables.

<br>

  > A class is a set of instructions for Python on how to make an instance

<br>

__Example of creating an instance__

  ```python
  from dog import Dog

  # create instances
  # __init__() will set these args as attributes
  my_dog = Dog('Willie', 6)
  your_dog = Dog('Stella', 5)

  # access some attributes
  print(f"My dog's name is {my_dog.name}")
  print(f"My dog is {my_dog.age} years old")

  # access some methods on the class
  my_dog.sit()        # Willie is now sitting. Arf.
  my_dog.roll_over()  # Willie rolled over! Bark.

  # access some attributes
  print(f"\nYour dog's name is {your_dog.name}")
  print(f"Your dog is {your_dog.age} years old")

  # access some methods on the class
  your_dog.sit()        # Stella is now sitting. Arf.
  your_dog.roll_over()  # Stella rolled over! Bark.
  ```

<br>

  > `car.py, my_car.py, my_electric_car.py`

  - importing classes
  - inheritance
  - instances as attributes
  - call methods from parent class with `super()`
  - overriding parent class methods
  - importing module classes for file brevity instead of having overly-long class definitions
  - Python Standard Library

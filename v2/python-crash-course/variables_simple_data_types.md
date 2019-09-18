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

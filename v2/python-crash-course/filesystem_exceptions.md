# Filesystem, Exceptions & Code Tests

Using the filesystem to analyze data big and small and exceptions for error management.

<br>

--------------------------------------------------------------------------------
### Reading Files

Basic syntax:

  ```python
  # open a file, read it, print contents
  with open('pi_digits.txt') as file_object:
      contents = file_object.read()
  print(contents)
  ```

  - `open()` returns a file object representing `<filename>`
  - `with` keyword closes the file once access is no longer needed
  - `close()` could be used to do that, but it's easier to let Python manage when to close the file, after `with` is done executing
  - `read()` returns a blank string when it reaches the end of the file, can be removed by appending the `rstrip()` method on the variable referencing `read()`
  - Python has no hard memory limit on file size, any limits on large datasets are dictated by your system


<br><br>

--------------------------------------------------------------------------------
### Exception Objects

Are created when an error occurs, managed with `try-except` blocks, similar to `try/catch`, Promises

  ```python
  # basic example, 0 division exception
  try:
      print(5/0)
  except ZeroDivisionError:
      print("Can't divide by 0")
  ```

Best practice is to not display tracebacks and explicitly handle the error somehow, for example, failing the program silently

  ```python
  try:
      ...
  except FileNotFoundError:
      pass  # ssshhhh
  ```


<br><br>

--------------------------------------------------------------------------------
### Data Storage Basics

Python's `json` module lets you dump simple data structures into a file and load that data the next time the program runs.

  ```python
  # store some stuff
  import json
  numbers = [2, 3, 5, 7, 11, 13]
  filename = 'numbers.json'
  with open(filename, 'w') as f:
    json.dump(numbers, f)  # stores, as formatted: [2, 3, 5, 7, 11, 13]

  # read some stuff
  import json
  filename = 'numbers.json'
  with open(filename) as f:
      numbers = json.load(f)

  print(numbers)
  ```

  > `remember_me.py`

  - Basic user input storage and reading
  - Using an `else` block after `try-except` block, without `if`
  - Best practice: verbosely return `None` on functions that return null-ish values for easier testing

  ```python
  # load a username if one has been stored previously or
  # prompt for one and store it
  import json

  filename = 'username.json'

  try:
      with open(filename) as f:
          username = json.load(f)

  except FileNotFoundError:
      username = input("Feed me a name: ")
      with open(filename, 'w') as f:
          json.dump(username, f)
          print(f"Stored, thanks {username.title()}")

  else:
      print(f"Welcome back {username.title()}")
  ```


--------------------------------------------------------------------------------
### Code Tests

Python uses `unittest` ( from the std library ) for tests, which are automated.

__Unit Tests__ tests an aspect of a function's behavior

__Test Cases__ are collections of unit tests testing a function's behavior program-wide, preferably with full coverage of all possible ways to use a function

  > `name_function.py` - a basic function to be tested

  > `names.py` - something that uses that function

  > `test_name_function.py` - test case with class methods that do the testing

  - Methods starting with `test_` get ran automatically
  - Testing frameworks import test files before running them, which means the interpreter will exec the file as it's being imported. `__name__` gets set when the program is executed. If the testing file is being run as the main program, `__name__` gets set to `__main__`. Frameworks don't set it `__main__`

<br>

  > `survey.py`, `language_survey.py`

  - Testing classes
  - Use `unittest.TestCase.setUp()` for creating objects that are used in multiple methods instead of repeating

<br>

__Assert methods__ for testing something you think is true is true at some point

  ```
  assertEqual(a, b)         Verify that a == b
  assertNotEqual(a, b)      Verify that a != b
  assertTrue(x)             Verify that x is True
  assertFalse(x)            Verify that x is False
  assertIn(item, list)      Verify that item is in list
  assertNotIn(item, list)   Verify that item is not in list
  ```

# Filesystem & Exceptions

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

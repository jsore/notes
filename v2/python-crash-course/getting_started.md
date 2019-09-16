# Getting Started

<br>

--------------------------------------------------------------------------------
### Installation

Check for current installation

  ```
  $ python
  > Python 2.7.10 (default, Feb 22 2019, 21:55:15)
  >>> (exit() or CTRL + D to exit)

  $ python3
  > Python 3.7.4 (v3.7.4:e09359112e, Jul  8 2019, 14:54:52)
  >>> (exit() or CTRL + D to exit)
  ```

Turns out I'm good to go already.

<br>


__Sublime Text setup__

Use my system's `python3` command when running Python files.

  ```
  Tools -> Build System -> New Build System
  ```

`Python3.sublime-build`

  ```
  {
    "cmd": ["python3", "-u", "$file"],
  }
  ```

Then select the new Build System, run Python files with `CMD + B`

<br>

And because I got annoyed, I set an alias for `python='python3'`

<br><br>

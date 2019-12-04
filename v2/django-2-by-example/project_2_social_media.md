# Social Media Site

Notes covering chapters 4, 5 and 6 of _Django 2 by Example_. The project being built should...

  - ...have an authentication system for user logins, registration, profile edits & PW resets
  - ...have a 'followers' system to allow users to follow each other
  - ...have the ability to display shared images and use a bookmarklet for image sharing from any website
  - ...have an activity stream to let users see content uploaded by users they follow



<br><br><br><br>




## ch4. Authentication Systems

<br>

--------------------------------------------------------------------------------
### Project Init


<br>

  > Current structure:
  >
  > ```
  > $ tree
  > django-2-by-example
  > .
  > ├── book_src
  > │   └── …
  > ├── project_1
  > │   └── …       <-- blog_env/ & packtblog/
  > ├── project_2
  > ├── project_2_social_media.md
  > └── sublime_project_history
  > ```


<br>


Create a virtual environment for this project

  ```
  …/project_2$ mkdir env  # build a home for the environment...

  …/project_2$ virtualenv env/bookmarks  # ...create it...

  …/project_2$ source env/bookmarks/bin/activate  # ...then spin it up

  (current_env) …/project_2$
  ```



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

Setup the environemnt for the base of this project.



<br><br>



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



<br><br>



Create a virtual environment for this project. Build a home for the environment...

  ```
  …/project_2$ mkdir env
  ```

...create it...

  ```
  …/project_2$ virtualenv env/bookmarks
  ```

...then spin it up

  ```
  …/project_2$ source env/bookmarks/bin/activate

  (current_env) …/project_2$
  ```

The `current_env` should be `bookmarks`. Install Django and create a new project using the `admin` framework

  ```
  (current_env) …/project_2$ pip install Django  # book says to use Django==2.0.5

  (current_env) …/project_2$ python  # verify the installation
  >>> import django
  >>> django.get_version()

  (current_env) …/project_2$ django-admin startproject bookmarks
  ```



<br><br>



The initial project structure is created by Django. Create a new ( the first custom ) app

  ```
  (current_env) …/project_2$ cd bookmarks

  (current_env) …/project_2/bookmarks$ django-admin startapp account
  ```

Don't forget to actiavte the new app in the project...

  ```python
  # ./bookmarks/settings.py
  INSTALLED_APPS [
      # brings in ./account/apps.py
      'account.apps.AccountConfig',
  ]
  ```

...and migrate it to sync the DB with our models

  ```
  (current_env) …/project_2/bookmarks$ python manage.py migrate
  ```



<br><br>



Structure automatically created, in the arbitrary directory `project_2` ( created to organize my notes )

  > ```
  > …/project_2/
  > .
  > ├── bookmarks/           <-- project's encapsulation
  > │   │
  > │   ├── bookmarks/       <-- project-wide configuration options
  > │   │   ├── __init__.py
  > │   │   ├── asgi.py
  > │   │   ├── settings.py
  > │   │   ├── urls.py      <-- url schema for applications, top level
  > │   │   └── wsgi.py
  > │   │
  > │   ├── account/         <-- an app, define config options like app-specific URLs, etc etc
  > │   │   │
  > │   │   ├── migrations/
  > │   │   │   └── …
  > │   │   │
  > │   │   ├~~ templates/          <-- HTML and data to be rendered passed from app's views
  > │   │   │   ├~~ account/        <-- name of the app to avoid namespace collisions
  > │   │   │   │   ├~~ login.html  <-- an example child that inherits from the base
  > │   │   │   │   …
  > │   │   │   └~~ base.html       <-- all app templates should inherit this parent
  > │   │   │
  > │   │   ├── __init__.py
  > │   │   ├── admin.py     <-- register this app's models with the project's admin site
  > │   │   ├── apps.py      <-- defines this app's namespace
  > │   │   ├── models.py    <-- how to handle this app's data
  > │   │   ├── tests.py
  > │   │   ├── views.py     <-- how to render templates/HTML
  > │   │   ├~~ urls.py *    <-- app endpoint definitions, routed to this app by the project
  > │   │   └~~ forms.py *   <-- the forms this app uses
  > │   │
  > │   └── manage.py
  > │
  > └── env/                 <-- where virtualenv's will reside
  >     └── bookmarks/       <-- an isolated virtual environment for the bookmarks project
  >         ├── bin/
  >         …
  > …
  >
  > Files marked as " ├~~ filename * " will be created in later sections of this book
  >
  > ```








<br><br><br><br>








--------------------------------------------------------------------------------
### Django's Auth Framework

The framework handles user authentication, sessions, permissions, user groups plus it includes pre-baked views for common user interactions ( login, logout, password change/reset ).

It's located at `django.contrib.auth` and is included in the default settings when a Django project is created with `startproject`. It consists of the application itself and two middleware classes found in `MIDDLEWARE` in the project's settings: `AuthenticationMiddleware` for associating users with requests using sessions and `SessionMiddleware` to handle the current session across requests. There's also the `User`, `Group` and `Permission` models included.

Remember that middleware is a class that are globally executed during the req or res phase.



<br><br>



__Login and logout views__

Example: a custom login view that should 1. Get the username/password by posting a form 2. Auth the user against data stored in DB 3. Check user's active/inactive status 4. Log user into website and start an authenticated session.

Use `django.contrib.auth.authenticate()` to check user credentials against the DB, returns a `User` object if credentials were correct regardless of the user account's state. Use `django.contrib.auth.login()` to set the user's current session.

  - Define a URL schema for the project to route requests to the `account` application
  - Define the app's `login/` endpoint
  - Define what to display and capture in the `forms.LoginForm` class
  - Write the `user_login` view
  - Create the app's base template to be extended by `templates/account/login.html`
  - Create a superuser for access to the admin site to manage other users `manage.py createsuperuser`
  - Run the server and test `http://localhost:8000/admin/`, logging in as `bookmarks_admin`

If the last step is successful, you now have a working example of using a custom view for user authentication. As an alternative, Django's auth framework has some pretty sane default forms and views. Django provides class-based views to deal with authentication should you not want to make a full custom view class:

  > https://docs.djangoproject.com/en/2.0/topics/auth/default/#all-authentication-views

Example usage of Django's builtin login, which by default will use the `Authentication Form` form at `django.contrib.auth.forms`, see:

  > `…/project_2/bookmarks/account/forms.py`

That form tries to auth the user and raises a validation error if unsuccessful.

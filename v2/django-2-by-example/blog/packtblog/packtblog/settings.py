"""
Django settings for packtblog project.


…/django-2-by-example/blog/packtblog/packtblog/settings.py


Generated by 'django-admin startproject' using Django 2.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 't0=7ux$bzcv9t2^*0k#v^5&#7jt2%ih0%+ntalf610lq@(&2=r'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition


# this ( blog ) site's site ID
SITE_ID = 1


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # to map objects to specific sites
    'django.contrib.sites',
    'django.contrib.sitemaps',

    # switching away from SQLite
    'django.contrib.postgres',

    # my apps for Django to activate to let it track the app
    # and create DB tables for its models
    #
    # …/blog/packtblog$ cat blog/apps.py
    #    ────┬───────────────────
    #        │ File: blog/apps.py
    #    ────┼───────────────────
    #    1   │ from django.apps import AppConfig
    #    2   │
    #    3   │
    #    4   │ class BlogConfig(AppConfig):
    #    5   │     name = 'blog'
    'blog.apps.BlogConfig',  # the app configuration

    # 3rd party integrations
    'taggit',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'packtblog.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'packtblog.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

with open(f"{os.path.join(BASE_DIR, 'packtblog/etc/dp.txt')}") as dbf:
    d_user = dbf.read().strip()

DATABASES = {
    'default': {

        # use PostgreSQL instead for scalability
        #'ENGINE': 'django.db.backends.sqlite3',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),

        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'blog',
        'USER': 'blog',
        'PASSWORD': d_user,
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'


# mail settings for external SMTP server ( gmail )
#
# bring in gitgnore'ed data
#
# example usage in shell, to confirm what data got imported
#
#   >>> import packtblog.settings
#   >>> print(packtblog.settings.EMAIL_HOST)
with open(f"{os.path.join(BASE_DIR, 'packtblog/etc/p.txt')}") as f:
    user = f.read().strip()
#
# example shell usage tos end an email
#
#   >>> from django.core.mail import send_mail
#   >>> send_mail('subject', 'body', 'sender', ['list', 'of', 'recipients'], fail_silently=False)
#
# send_mail() returns a '1' if no errors
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'jus.a.sorensen@gmail.com'
EMAIL_HOST_PASSWORD = user
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# or replace all this with the following to spit to console
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

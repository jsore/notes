# Over-Engineering A Website

Why build something in a manner that <i>doesn't</i> allow you to learn while you build?

My site - `jsore.com` - is a simple portfolio/blogging site I've decided to make, but packed with
technologies and created with an original mindset that I wanted to make this an opportunity to
really get my hands dirty with Node. Purposfully not being a simple place where some static files
get served, as is common with these kinds of sites.

Further, to account for the future implementation of a side-project, Break Room Ramen, a web app
I'll be creating for me and a few buddies to review unique flavors of ramen, this is gonna be a bit
overly fleshed out and thought through.

<br>

## Site Architecture

## Project Structure

> Organize files around features, not roles

```
.
|-- .git
|   `-- ...
|-- .gitignore
|-- breakroomramen
|   |-- utils               // 2nd leve Postgre access, etc
|   |   `-- ...
|   |-- auth
|   |   `-- ...             // user management
|   |-- index.js
|   |-- common.js
|   `-- templates.js
|-- jsore
|   |-- welcome
|   |   `-- welcome.js
|   |-- resume
|   |   `-- resume.js
|   |-- ramblings
|   |   |-- utils           // 2nd leve Postgre access, etc
|   |   |   `-- ...
|   |   `-- ramblings.js
|   `-- templates.js
|-- config
|   |-- webpack.config.js
|   |-- development.config.js
|   `-- ...
|-- db                      // top-level Postgres management
|   `-- ...
|-- scripts                 // deployment automation (npm scripts)
|   `-- deploy.js
|-- tests                   // unit testing
|   |-- jsore.welcome.js
|   |-- jsore.resume.js
|   |-- jsore.ramblings.js
|   `-- breakroomramen.js
|-- server.js               // main entry
|-- package.json
|-- README.md
```

<br>


## Key Modules

<i>items with --> * <-- are maybes</i>

Express
- expose app data
- manage HTTP requests
- handle HTTPS security
- routing API endpoints

Passport *
- user authentication
- session management
    (possible replacement: Axios)

Webpack *
- production vs development environment management
- config options handler
    (possible replacement: PM2)

Mocha
- unit testing

<br>


## Reasons why I've decided to...

## Other things I'm interested in using or doing

## TODO
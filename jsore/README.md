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
<hr>

## Site Architecture

- It will not process a lot of data
- Mostly middleware, other services do heavy lifting
- Async nature for handling multiple requests from different sources

```
.-------------------. .--------------------.
|    web browser    | |   mobile browser   |    <-- what needs to be visually pleasing & accessible
'-------------------' '--------------------'
.------------------------------------------.
|             REST API service             |    <-- what needs to be developed
'------------------------------------------'
.-----------------. .----------------------.
|       DB        | |    REST middleware   |    <-- what needs to be secured
|  Postgre SQL    | |       & services     |
'-----------------' '----------------------'
```


<br>
<hr>

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
<hr>

## Key Modules

<i>items with --> * <-- are maybes</i>

#### Express
- expose app data
- manage HTTP requests
- handle HTTPS security
- routing API endpoints

#### Passport *
- user authentication
- session management
    (possible replacement: Axios)

#### Webpack *
- production vs development environment management
- config options handler
    (possible replacement: PM2)

#### Mocha
- unit testing

<br>
<hr>

## Reasons why I've decided to...

<br>
<hr>

## Things I want to look into

#### Passport authentication
https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/


<br>
<hr>

## Snippets

#### Simple async/await

```javascript
const main = async (paramsA, paramsB, paramsC) => {
    const resA = await funcA(paramsA);
    // need to uniquely handle an error?
    const resB = await funcB(paramsB).catch(e => { /* things unique to this error */ });
    const resC = await funcC(paramsC);

    return { resA, resB, resC };
};

main()
    .then(d => { // do things with the result })
    // handle the rest of the catch clauses for each await
    .catch(e => { // handle all other errors!! });
```



<br>
<hr>

## TODO
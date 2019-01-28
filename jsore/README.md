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

#### Development Flow
( & some other things I've come across )

<br>

<b>HTTPS in development environments</b><br>
One of the first things I ran into was getting HTTPS set up correctly in production (running on
a Linode VM) <b>AND</b> in development (locally, on my macbook).

Let's Encrypt got my production environment and domain set up easy-peasy, but my local development
space...not so much.

Problem?

Getting HTTPS recognized on `localhost` because I wanted development and production mirrored as
much as possible, to help mitigate any future issues I might come across deploying my code from
an HTTP based environment to one secured with HTTPS.

Finally, instead of self-signing a cert and forcing my browser to accept it, I found this:<br>
https://github.com/FiloSottile/mkcert

Again, my development environment is on a macOS.

<br><br>

Install:
> `$ brew install mkcert`

<br>

I wanted this working in Firefox too, not just Chrome:
> `$ brew install nss`

<br>

Create the psuedo/local CA:
> ```
> $ mkcert -install
> > Using the local CA at "/Users/jsorensen/Library/Application Support/mkcert"
> > Password: (for sudo)
> > The local CA is now installed in the system trust store!
> > The local CA is now installed in the Firefox trust store (requires browser restart)!
> ```

<br>

Sign some certs, optionally adding additional domains or aliases if you have any configured:
> ```
> $ mkcert somedomain.com localhost 127.0.0.1 ::1
> > Using the local CA at "/Users/jsorensen/Library/Application Support/mkcert"
> >
> > Created a new certificate valid for the following names
> >  - "somedomain.com"
> >  - "localhost"
> >  - "127.0.0.1"
> >  - "::1"
> >
> > The certificate is at "./somedomain.com+3.pem" and the key at "./somedomain.com+3-key.pem"
> ```

<br><br>

Since I'm using a Node.js architecture, I also had to tell Node where to look for the new CA by
setting a specific Node environment variable...
> `$ export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"    # <-- from your project's root`

<br>

...and because I prefer not to tack on a port number at the end of the URL where my Node server can
be reached, it's required that the Node server is started with `sudo` permissions to get around a pesky
`EACCES` error message, where Node isn't able to access port 443
> `$ sudo npm start`

<br>

Now, set the path to your newly created certificate and key files when you call `createServer()`
> ```javascript
> // bring in modules
> const fs = require('fs');
> const https = require('https');
> const express = require('express');
> // start an express instance
> const app = express();
> const httpsOptions = {
>     // by default, these files are found at your
>     // user's root directory ( ~/ )
>     key: fs.readFileSync('path/to/the-key.pem'),
>     cert: fs.readFileSync('path/to/the-cert.pem'),
> };
> // tell the server to start listening
> https.createServer(httpsOptions, app).listen(443, () => console.log('https ready'));
> ```

<br>

Kind of dirty, since Chrome still throws a warning that the sight is untrusted, but my goal has
essentially been acheived - get traffic flowing through HTTPS in dev.

<br><br>

<b>Note:</b><br>
Be <i>abunduntly</i> aware that the key this tool generates needs to be
absolutely secured. At this time, I'm gonna be paranoid and not publicly detail the steps I took.

<br><br>

<b>Moving from Apache to Node.js/Express</b><br>

<br><br>
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

#### DB Schema

<br><br>
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

<br><br>
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

<br><br>
<hr>

## Reasons why I've decided to...

<br><br>
<hr>

## Things I want to look into

#### Passport authentication
https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/


<br><br>
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



<br><br>
<hr>

## TODO
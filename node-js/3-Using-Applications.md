<br><br>

> Note: any files quoted here can be found in the project-files directory<br>
> https://github.com/jsore/notes/tree/master/node-js/project-files/...

<br><br>

# Part 3 - Implementing Applications
<b>Summarizing this chapter's focus-points</b>
- Crafting web app end-to-end

- Develop web services that provide bi-directional access to DB's and messaging infrastructure

- Develop and harden web-based user interface


<br><br>


<hr>

## Chapter 1 - RESTful web services
#### Implementing RESTful web services into a web app


<br>


<b>Node.js core modules</b><br>
> - Async functions, an ECMAScript feature
>
>     - suspend execution to await an async result
>     - simplifies programming sequences


<br>


<b>Patterns</b><br>
> - Develop RESTful APIs
>
>     - via <b>Express</b> and Elasticsearch
>     - <b>Express</b> middleware
>     - <b>Express</b> route handlers
>     - Elasticsearch's query API's
>
> - Reinforce HTTP methods and status codes for user communication


<br>


<b>JavaScript-isms</b><br>
> - Promises
>
>     - special objects to deal with sync and async functions
>     - use Promise factories for HTTP request issuance
>
> - Destructuring assignment and computed property names


<br>


<b>Supporting code</b><br>
> - `ncomf` module for easier service configuration
>
> - `nodemon` module for program monitoring and auto restart upon file changes
>
> - Express for easier web service development on the `http` module


<br>


<hr>

#### 2.a. Express - Intro
Express: web app framework for simplifying the running of web servers

<br>

Some - a very few - example usages:
- URL paths for routing
- Sessions via cookies
- Parsing incoming requests (ie: JSON, form data)
- Rejection of bad requests

<br>

<b>Short example of `http` usage - A basic web server</b><br>
`./project-files/web-services/server.js`<br>

<br>

<b>Short example of Express usage - Hello World REST/JSON service</b><br>
`./project-files/web-services/express-hello/server.js`<br>

>Introduces:
> - Express' usage of <b>middleware</b>, functions to manipulate `request` and `response` objects
>
> - Named route parameters, ex: `:name` in `/hello/:name` path, when the API is hit Express yoinks
>   that chunk of the URL and makes it available in `req.params`

<br>

Before building above file, install Express and Morgan (HTTP request logging utility):
> `$ npm install express@4.14.1 morgan@1.8.1`

Then, like always, bring them into your project with `require()` statements


<br><br>


<hr>

#### 2.b. Express - RESTful modular Express services ("B4")
<b>"Better Book Bundle Builder (B4)"</b> to manage <b>book bundles</b>
> `example book bundle`
> ```
> {
>     "name": "light reading",          // user-defined identifier
>     "books": [{                       // field containing books in this bundle
>         "id": "pg132:",
>         "title": "The Art of War"
>     },{
>         "id": "pg2680",
>         "title": "Meditations",
>     },{
>         "id": "pg6456",
>         "title": "Public Opinion"
>     }]
> }
> ```


This app will use two Elasticsearch indexes...
> - Index `books` from `./project-files/databases` section
> - Index for `b4` (this app)

...to do
> - Communicates with indices `books` and `b4`
> - For B4 app, `books` is read-only
> - User data including book bundles goes into `b4`

<br>

<b>Create new index for this app</b><br>
Make sure Elastic search is running:
> ```
> $ curl 'http://localhost:9200/?pretty'
> > {
> >   "name" : "sqJNKn-",
> >   "cluster_name" : "elasticsearch",
> >   "cluster_uuid" : "NQzPZQmhSr-t5CvMXdwdGg",
> >   "version" : {
> >     "number" : "6.5.2",
> >     ...
> ```

From `./project-files/esclu` issue command to `index.js` via `esclu` executable:
> ```
> $ ./esclu create-index -i b4
> > {"acknowledged":true,"shards_acknowledged":true,"index":"b4"}
> ```

<br>

<b>Create or bring in necessary items</b>
> `./project-files/web-services/express-b4/`
> ```
> // for package.json (use defaults for now)
> $ npm init
>
> // Express, Morgan for HTTP logging, nconf for config management
> $ npm install --save --save-exact express@4.14.1 morgan@1.8.1 nconf@0.8.4
> ```
> `/express-b4/config.json` for some config options for nconf
>
> `/express-b4/server.js` for the main entry point

Now we can test our options thus far to ensure Express can connect properly
> ```
> $ npm start
> > express-b4@1.0.0 start /var/www/github_notes/notes/node-js/project-files/web-services/express-b4
> > node server.js
> >
> > Ready...
> ```

<br>

<b>Explaining `nconf` order of precedence</b><br>
The `nconf` module manages config details in a hierarchy of config files, env variables and CLI args,
setting precedence via source load order - later values don't overwrite earlier values

`web-services/express-b4/server.js`:
> ```javascript
> /**
>  * allows for 'es' options in 'config.json' to be over-ridden
>  *   when program is invoked
>  *
>  * example over-ride invocations:
>  *   $ node server.js --es:host=a.different.host    // CLI args
>  *   $ es__host=a.different.host node server.js     // env var
>  *
>  * load arg variables first, then environemnt variables, and
>  *   use two underscores (__) to identify object hierarchy
>  *   within environment variables
>  */
> nconf.argv().env('__');
> ```

> ```javascript
> /**
>  * specify the config.json file for options not over-ridden at
>  *   invocation, using the file located within the current
>  *   directory if that path isn't over-ridden at invocation
>  *
>  * example over-ride invocation:
>  *   $ node server.js --conf=/path/to/different/config.json
>  */
> nconf.defaults({conf: `${__dirname}/config.json`});
> ```

> ```javascript
> /**
>  * finally, load whatever file is specified within the path
>  *   inside our `conf` object for non-over-ridden values
>  */
> nconf.file(nconf.get('conf'));
> ```

<br>

<b>Using `nodemon` ("Node Monitor") to auto restart app</b><br>
From `web-services/express-b4`:
> `$ npm install --save --save-exact nodemon@1.11.0`    <br>

From `web-services/express-b4/package.json` add to `scripts:start`:
> ```JSON
>   "scripts": {
>       "start": "nodemon server.js",
>       "test": "echo \"Error: no test specified\" && exit 1"
>   },
> ```

Then start `nodemon` on `server.js` (as specified within `package.json`):
> `$ npm start`                                     <br>
> `> express-b4@1.0.0 start /path/to/__dirname`     <br>
> `> nodemon server.js`                             <br>
>                                                   <br>
> `[nodemon] 1.11.0`                                <br>
> `[nodemon] to restart at any time, enter 'rs'`    <br>
> `[nodemon] watching: *.*`                         <br>
> `[nodemon] starting 'node server.js'`             <br>
> `Ready...`                                        <br>
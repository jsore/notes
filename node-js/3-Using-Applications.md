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

#### 1.a. Express - Intro
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

#### 1.b. Express - RESTful modular Express services ("B4")
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

<br>

<b>API's - searches</b><br>
`./project-files/web-services/express-b4/lib/search.js`<br>

Introduces:
> - `require`ing a module with passed args ( `server.js`: `require('search.js')(app, nconf.get('es'));` )
>
> - <b>Computed property names</b> in object literal keys ( `[req.params.field]` ) which are computed
>   at runtime to determine what that object key should be
>
> - <b>Destructuring assignments</b> in function parameters ( `function({_source})` ) tells the function
>   to expect an object that has a property with the same name as the value in the `{}` and that it
>   should create a local variable with the same name and same value
>
>   You can also use the same destructuring assignment technique for naming variables:
>   ```javascript
>   resBody.hits.hits.map(aVar => {
>       const {_source} = aVar;
>       return _source;         // returns the new const
>       });
>
>   // ^^ is the same as saying:
>   esResBody.hits.hits.map(({_source}) => _source);
>   ```
>
> - <b>Promises</b> to manage async flow instead of callbacks, used in `./lib/search.js` for a
>   `/suggest` API to hit Elasticsearch cluster for more info (see next section)

<br>

<b>API's - suggestions, Promises & JS code flow</b><br>
( adding on to `./lib/search.js` )

Introduces:
> - Elasticsearch's <b>Suggest</b> API and <b>Suggester</b> feature
>
> - Using `request` module with Promises instead of callbacks

Node.js callbacks use two arguments - `err`, `data` - to reflect JS code successes or failures, while
EventEmitters use two types (`data`, `error`) to distinguish between the two modes

Promises are another method of async result management - objects that encapsulates success/failure results,
using `resolve` or `reject` for the results, each calling callback functions (`.then()`, `.catch()` )

Example:
> ```javascript
> // create a new Promise, invoking a callback immediately
> const promise = new Promise((resolve, reject) => {
>     // passing, resolve the Promise, and
>     // send a value to .then()
>     resolve(aSuccessValue);
>     // failure, reject the Promise, and
>     // or send a value to .catch()
>     reject(anErrorValue);
> });
>
> // after promise has been settled...
> promise.then(aSuccessValue => { /* do something */ });
> promise.catch(anErrorValue => { /* do something */ });
>```

The pass/fail handlers will either be called immediately upon the Promise being settled or will be
called later once it's been settled, regardless of where those handlers are attached, versuses
`.on('error')` handlers for EventEmitters where there is a specific place where that handler needs
to exist in order to be used

<br>

<b>API's - manage book bundles, `request-promise`</b><br>
An example book bundle to manage (each bundle has a name & maintains collections of books)
> ```JSON
> {
>   ​"name"​: ​"light reading"​,
>   ​"books"​: [{
>     ​"id"​: ​"pg132"​,
>     ​"title"​: ​"The Art of War"​
>   },{
>     ​"id"​: ​"pg2680"​,
>     ​"title"​: ​"Meditations"​,
>   },{
>     ​"id"​: ​"pg6456"​,
>     ​"title"​: ​"Public Opinion"​
>   }]
> }
> ```

<br>

<b>Manipulating book bundles (documents) RESTfully</b><br>
`./project-files/web-services/express-b4/lib/bundle.js`<br>

Introduces:
> - Using `request-promise`'s Promise factory method for Promise creation
>
> - HTTP POST usage
>
> - How Elasticsearch auto creates an `_id` field for POST requests
>
> - Creating and using environment variables

To quote from the book, regarding considerations for handling async failures and responses:
> Consider an API to update the name of a bundle.
> Roughly speaking, yourNode.js code will need to
> do the following:
>
>   - Retrieve the bundle from Elasticsearch.
>   - Update the name field on the object in memory.
>   - Put the updated object back into Elasticsearch.
>
> In addition to handling these asynchronously and
> in order, you’ll have to deal with various failure
> modes:
>
>   - What if Elasticsearch is down?
>   - What if the bundle doesn’t exist?
>   - What if the bundle changed between the time Node.js
>     downloaded it and the time it reuploaded it?
>   - What if Elasticsearch fails to update for some
>     other reason?
>   - What HTTP code most closely explains the situation?
>   - What kind of error message should you present?


<br><br>


<hr>

#### 1.c. Express - B4 - async/await functions
Benefit of using Promises for simplifying code flow while structuring code in a more readable way

Async functions can be suspended to wait on a Promise to be settled, unblocking the event loop to
await a Promise - note, this does not violate JS's single-threaded nature

Will use them to perform functions without having to hit Elasticsearch directly

<b>Previous usage, adding then reviewing a book bundle:</b><br>
Create a document within b4 index for a bundle of books titled 'light reading', then pipe the
output from .express-b4/lib/bundle.js to console:
> ```
> $ curl -s -X POST localhost:60702/api/bundle?name=light%20reading | jq '.'
> > {
> >   "_index": "b4",
> >   "_type": "bundle",
> >   "_id": "FtDUvWcBI5eETnsx9d0j",      <-- NOTE: auto created by Elasticsearch for new docs
> >   "_version": 1,
> >   "result": "created",
> >   "_shards": {
> >     "total": 2,
> >     "successful": 1,
> >     "failed": 0
> >   },
> >   "_seq_no": 0,
> >   "_primary_term": 1
> > }
> ```
Copying the _id field from above, create an environment variable for easier use:
> ```
> $ BUNDLE_ID=FtDUvWcBI5eETnsx9d0j
> $ echo $BUNDLE_ID
> > FtDUvWcBI5eETnsx9d0j
> $ curl -s localhost:9200/b4/bundle/$BUNDLE_ID | jq '.'
> > {
> >   "_index": "b4",
> >   "_type": "bundle",
> >   "_id": "FtDUvWcBI5eETnsx9d0j",
> >   "_version": 1,
> >   "found": true,
> >   "_source": {
> >     "name": "light reading",
> >     "books": []
> >   }
> > }
> ```

<br>

<b>API's - retrieve book bundles</b><br>
( adding on to `./lib/bundle.js` )

Introduces:
> - Using `async` and `await` in a GET request (through Express)
>
> - Bad vs good implementation of `async` Express handler, Always provide a `try/catch` block when
>   using async functions as Express route handlers
>> ```javascript
>> // BAD - no try/catch block, any rejections won't
>> //   get handled properly
>> app.get('/api/bundle/:id', async (req, res) => {
>>     const options = {
>>         url: `${url}/${req.params.id}`,
>>         json: true,
>>     };
>>     const esResBody = await rp(options);
>>     res.status(200).json(esResBody);
>> });
>> ```

<br>

<b>API's - changing bundle name</b><br>
( adding on to `./lib/bundle.js` )

Introduces:
> - Complex expression usage of results of an await'ed Promise
>> ```javascript
>> const bundle = (await rp({url: bundleUrl, json: true}))._source;
>> ```

<br>

<b>API's - adding book to bundle</b><br>
( adding on to `./lib/bundle.js` )

Introduces:
> - Complex route handlers
>
> - Managing concurrent unsettled Promises for simultaneous async requests ( `Promise.all([]);` method )
>> ```javascript
>> // async'ly requesting
>> const [bundleRes, bookRes] = await Promise.all([
>>     rp({url: bundleUrl, json: true}),
>>     rp({url: bookUrl, json: true}),
>> ]);
>>
>> // still works, but book is only grabbed after bundle
>> const bundleRes = rp({url: bundleUrl, json: true});
>> const bookRes = rp({url: bookUrl, json: true});
>> ```
>
> - Using version number to detect race conditions on doc update
>
> - Method `Array.findIndex` to determine if book is already in the index

<br>

<b>API's - delete a bundle</b><br>
( adding on to `./lib/bundle.js` )

Introduces:
> - HTTP DELETE

<br>

<b>API's - delete a book from a bundle</b><br>
( adding on to `./lib/bundle.js` )

Introduces:
> - `array.splice`


<br><br>


<hr>

## Chapter 2 - UX
#### Giving users a friendly method of app interaction


<br>


<b>Node.js core modules</b><br>
> - <b>Peer dependencies</b>, a new module dependancy type for framework/plugin relationship descriptors


<br>


<b>Patterns</b><br>
> - Examples of framework-and-plugin usage for front end JS
>
> - <b>Typescript</b>, code transpilation to work with other languages and type-checking code


<br>


<b>JavaScript-isms</b><br>
> - Promise producer `fetch` method for async requests between browser and server
>
> - DOM API's for user interaction and navigation


<br>


<b>Supporting code</b><br>
> - <b>Bootstrap</b> (from Twitter) for styles
>
> - Dynamic HTML rendering with <b>Handlebars</b> library


<br>


<hr>

#### 2.a. Webpack intro
Webpack takes front end code and its related dependencies then bundles it up

Example: taking a few JS files and related libraries, sqishing them together to allow for just a
single packaged file to be sent across to the browser

Web pages/apps of course can be thrown up without bundling assets together, but it's becoming
common practice to do so (ex: for JS version control, reduced latency)

Typical prod/dev deployment routine:

> 1.a. Development
>
> 1.b. Locally - make changes
>
> 1.c. Locally - bundle assets & push to production repo branch within version manager of choice
>
> 3.a. Deployment
>
> 3.b. Remote server - pull down changes from production branch
>
> 3.c. Remote server - Run package manager (npm) to install the appropriate versions of packages


<br>

<b>Regarding licenses and public app licenses...</b><br>
https://medium.com/@vovabilonenko/licenses-of-npm-dependencies-bacaa00c8c65

<br>

<b>Front-end project root setup</b><br>
New directory: `./project-files/ux/b4-app`

Begin building our app as a Node.js project
> `./project-files/ux/b4-app/package.json`<br>
> ```
> $ npm init
> > {
> >   "name": "b4",
> >   "version": "1.0.0",
> >   "description": "Better Book Bundle Builder front-end app",
> >   "main": "index.js",
> >   "scripts": {
> >     "test": "echo \"Error: no test specified\" && exit 1"
> >   },
> >   "author": "",
> >   "license": "ISC"
> > }
> ```

Normally, bundling would occur before deployment to production, but we'll use a `webpack` plugin, the
`webpack-dev-server`, for on demand bundling during the development process and a look into using
<b>peer dependencies</b>

Peer dependencies are for plugins, which add functionality into a large unit or framework and to
augment libriaries (commonly found in frontend tech), whereas regular dependencies support smaller
units of functionality

Peer dependencies operate at a 'sibling' level to their related module - rather than the 'child'
relationship of other dependencies, where they're nested into subdirectories of `node_modules`,
they instead must reside at the same level of the module

Install the dependency:
> `$ npm install --save-dev --save-exact webpack-dev-server@2.9.1`

Add a `start` script to `package.json`:
> ```JSON
> "scripts": {
>     "start": "webpack-dev-server",
>     "test": "echo \"Error: no test specified\" && exit 1"
>   },
> ```

Then install `webpack`
> `$ npm install --save --save-exact webpack@3.6.0`

And allow the project to use `webpack` through a `config` file:
> `./project-files/ux/b4-app/webpack.config.js`<br>
> ```
> 'use strict';
> module.exports = {
>     entry: './entry.js',
> };
> ```

Set up an empty file for testing purposes, start npm and verify page loads in browser
> `$ touch entry.js`    <br>
> `$ npm start`         <br>

Finally, install a module to generate the HTML
> `$ npm install --save-dev --save-exact html-webpack-plugin@2.30.1`

<br>

#### Note - Project changes
Because of issues with VirtualBox and webpack, I've given up fighting the two of them and will be moving
files within `project-files` locally onto my Macbokk and continuing the project there. However, these
notes will still record my progress and thoughts throughout the remainder of this side project.

Git `master` branch has now been branched to reflect this migration, new branch: `mac-notes`

For the sake of my sanity, I'll document the process and the actions I took to get everything back
up and running locally, along with some CL commands I wanted to earmark 

(this is me mainly dealing with Elasticsearch and porting DB's over)
> - cli pretty config, alias addition for `ls=ls -Gp` (superficial changes but still wanted to document)
>
> - create project root
>
> - `git clone`
>
> - rebuilt the `webpack` files and verified Express connection success
>
> - re-downloaded epub files for `databases/data` since `.gitignore` was set to ignore them
>
> - testing Elasticsearch connection....failed
>
> - testing Elasticsearch installation....failed (duh)
>
> - install ( for MacOS ) then run Elasticsearch
>> `./project-files/esclu`
>> ```
>> $ curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.4.3.zip
>> $ unzip elasticsearch-5.4.3.zip
>> $ cd elasticsearch-5.4.3
>> $ ./bin/elasticsearch
>> > ...running...
>> $ ./bin/elasticsearch
>>
>> // different terminal
>> $ curl http://127.0.0.1:9200
>> > {
>> >   "name" : "S8imSB6",
>> >   "cluster_name" : "elasticsearch",
>> >   "cluster_uuid" : "eHW1OjVHQSqO3rtGxbpk6w",
>> >   "version" : {
>> >     "number" : "5.4.3",
>> >     "build_hash" : "eed30a8",
>> >     "build_date" : "2017-06-22T00:34:03.743Z",
>> >     "build_snapshot" : false,
>> >     "lucene_version" : "6.5.1"
>> >   },
>> >   "tagline" : "You Know, for Search"
>> > }
>> ```
>
> - test Elasticsearch connection again....success
>
> - make sure `esclu` still executable ( `chmod +x esclue` )
>
> - refamiliarize myself with `esclu` CL program ( `$ ./esclu -h` )
>
>   Note: use `$ ./esclu get '_cat'` for non-JSON'ed API cluster details
>
> - recreate index ( `$ ​​./esclu​​ ​​create-index​​ ​​--index​​ ​​books​` )
>
> - list indices to verify the addition ( `$ ​​./esclu​​ ​​get​​ ​​'_cat/indices?v'​` ) <br>
>   another method: `$ ./esclu get _stats | jq '.indices' | head -n 20`
>
> - re-installed `jq` at this point
>
> - bulk add the books to index, this time putting the result file into `databases/data`  <br>
>   `$ ./esclu bulk ../data/bulk_pg.ldj -i books -t book > ../data/bulk_result.json`
>
> - verify data import....failed:
>> ```
>> cat ../databases/data/bulk_result.json | jq '.' | head -n 20
>> {
>>   "error": {
>>     "root_cause": [
>>       {
>>         "type": "json_parse_exception",
>> ```
>>   error: there was a line at the top of `bulk_pg.ldj`, the file I'm trying to import using `bulk` <br>
>>   ....removed it, tried `bulk` again, tested....success
>
> - remainder of files checked for usability....failed<br>
>   need to build "B4" index
>
> - b4 index built <br>
>>  ```
>>  // ( from ./project-files/web-services/express-b4 )
>>
>>  // create
>>  $ ../../esclu/esclu create-index -i b4
>>
>>  // verify
>>  $ ../../esclu/esclu list-indices
>>
>>  // ./project-files/web-services/express-b4
>>  $ npm start
>>  > [nodemon] 1.11.0
>>  > [nodemon] to restart at any time, enter `rs`
>>  > [nodemon] watching: *.*
>>  > [nodemon] starting `node server.js`
>>  > Ready...
>>  $ curl -s 'http://localhost:60702/api/version'
>>  > 1.0.0
>>  $ curl -s http://localhost:60702/api/search/books/authors/Shakespeare | jq '.[].title'
>>  > "Venus and Adonis"
>>  > "The Second Part of King Henry the Sixth"
>>  > "King Richard the Second"
>>  > "The Tragedy of Romeo and Juliet"
>>  > "A Midsummer Night's Dream"
>>  > "Much Ado about Nothing"
>>  > "The Tragedy of Julius Caesar"
>>  > "As You Like It"
>>  > "The Tragedy of Othello, Moor of Venice"
>>  > "The Tragedy of Macbeth"
>>  ```
>
> - book bundle `Light Reading` re-added to b4 index, `$BUNDLE_ID` set in `./express-b4`
>>  ```
>>  $ curl -s -X POST localhost:60702/api/bundle?name=Light%20Reading | jq '.'
>>  $ BUNDLE_ID=AWfczkDIf7nyNwJluzYW
>>  $ curl -s localhost:9200/b4/bundle/$BUNDLE_ID | jq '.'
>>  ```
>
> - put book into index and test
>>  ```
>>  curl -s -X PUT localhost:60702/api/bundle/$BUNDLE_ID/book/pg132 | jq '.'
>>  curl -s localhost:60702/api/bundle/$BUNDLE_ID | jq '._source'
>>  ```
>
> - remainder of files checked for usability....success


<br><br>


Okay, back on track


<br><br>


<b>Generate a webpack bundle</b><br>
`./ux/b4-app/webpack.config.js`<br>
> - HTML file generation through `HtmlWebpackPlugin` class

Now, after `$ npm start`'ing the app, the project should be reachable in a browser at `localhost:60800`

<br>

<b>Generate a webpack bundle</b><br>
( adding on to `./ux/b4-app/webpack.config.js` )

>Introduces:
> - CSS dependencies for webpack to work with CSS and for assets CSS will reference (images, fonts, etc)<br>
>   ex: `style-loader`, `css-loader` plugins for webpack, `url-loader`, `file-loader` plugins for CSS
>> ```
>> $ npm install --save-dev --save-exact \
>> > style-loader@0.19.0 \
>> > css-loader@0.28.7 \
>> > url-loader@0.6.2 \
>> > file-loader@1.1.5
>> ```
>> Then load these into `webpack.config.js.exports.module[]`
>
> - Bootstrap ( `$ npm install --save-dev --save-exact bootstrap@3.3.7` )
>
> - Using Bootstrap components
>
> - `import`'ing based on rules set in `webpack.config.js_module.rules`
>
> - Bootstrap JS (via jQuery) for dynamic Bootsrap behaviors<br>
>   `$ npm install --save-dev --save-exact jquery@3.2.1`
>>  ```javascript
>>  // ./ux/b4-app/webpack.config.js
>>  const webpack = require('webpack');
>>  new webpack.ProvidePlugin({
>>      $: 'jquery',
>>      jQuery: 'jquery'
>>  }),
>>
>>  // ./ux/b4-app/entry.js
>>  import 'bootstrap';
>>  ```

<br>

<b>TypeScript</b><br>
`./ux/b4-app/tsconfig.json`<br>
`./ux/b4-app/templates.ts`<br>
`./ux/b4-app/index.ts`<br>

>Introduces:
> - Transpiling JS with TypeScript for browser compability ( install with npm --save-dev and install
>   `ts-loader` plugin for webpack to use TypeScript )
>
> - `tsconfig.json` for transpiling TypeScript >> JS
>
> - ES6 `export` keyword instead of `module.exports` because we're using TS now
>
> - `import * as <name> from '<../path/to/file.ts';`


<br>

<b>Handlebars - secure & dynamic HTML templating</b><br>
( adding on to `./ux/b4-app/templates.ts` )<br>
( adding on to `./ux/b4-app/index.ts`) <br>

Goal: render HTML for dynamic strings

Continuing to use template strings to inject values into strings leaves the app vulnerable to XSS
> ```javascript
> // example: render items dynamically per user
>
> // what not to do:
> export const bundleName = name => `<h2>${name}</h2>`;
>
> // or, even worse using an <img> tag where it's
> //   possible someone may inject an image you
> //   didn't put there, or an onload event, which
> //   could allow for arbitrary JS to run on the page
> ```

Handlebars is a lightweight templating library to help with this, running client-side or at build-time
with Node and webpack ( via the `handlebars-loader` webpack plugin )

Instead of referencing a DOM element and passing in a string of values, run all your HTML items
through `Handlebars.compile()` to sanitize and validate items then get the returned computed string
from `compile()` by calling your DOM elements with method calls

Example:
> ```javascript
> /*----------  templates.ts  ----------*/
>
> // instead of...
> export const alert = `
> <div class="alert alert-success alert-dismissible fade in" role="alert">
>     <button class="close" data-dismiss="alert" aria-label="Close">
>         <span aria-hidden="true">&times;</span>
>     </button>
>     <strong>Success!</strong> Bootstrap is working.
> </div>
> `;
>
> // ...do this:
> export const alert = Handlebars.compile(`
>     <div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
>         <button class="close" data-dismiss="alert" aria-label="Close">
>             <span aria-hidden="true">&times;</span>
>         </button>
>         {{message}}
>     </div>
> `);
>
>
> /*----------  index.ts  ----------*/
>
> // instead of...
> alertsElement.innerHTML = templates.alert;
>
> // ...do this:
> alertsElement.innerHTML = templates.alert({
>     type: 'info',
>     message: 'Handlebars is working!',
> });
> ```

<br>

<b>Hash-based navigation</b><br>
( adding on to `./ux/b4-app/index.ts`) <br>

Instead of requesting new pages from the server that live at different URLs, this app is essentially
a single-page application, with the user requesting a single page and all the content at once, forcing
us to come up with a method of tracking navigation...

...which brings us to hash (#) based navigation, each section of the URL after the # providing a
<b>view</b>

>Introduces:
> - `window.location.hash.split('/')`

There's also a need to update `webpack.config.js` to use proxies for service access and redirection

<br>

<b>Retrieving data - Bundle viewer</b>
( adding on to `./ux/b4-app/index.ts`) <br>
( adding on to `./ux/b4-app/templates.ts`) <br>

>Introduces:
> - Promise-producing method `fetch()` to issue HTTP requests
>
> - Hitting API endpoints that get served by webpack-dev-server via proxies

Add a bundle: `curl -s -X POST localhost:60702/api/bundle/?name=Heavy%20Reading | jq '.'`

<br>

<b>Saving data with forms - Bundle adder</b>
( adding on to `./ux/b4-app/index.ts`) <br>
( adding on to `./ux/b4-app/templates.ts`) <br>

>Introduces:
> - `<form>` for input capture
>
> - `element.insertAdjacentHTML('beforeend', content);`
>
> - `POST`'ing via `fetch()`
>
> - Handling <b>eventual consistency</b> properly, an artifact related to databases and probable delays
>   between adding content to a DB and having that content showing up in a query<br>
>   Example:
>> ```javascript
>> // bad - POST'ing first then querying for bundles
>> const url = `/api/bundle?name=${encodeURIComponent(name)}`;
>> const res = await fetch(url, {method: 'POST'});
>> const resBody = await res.json();
>> // failure point:
>> const bundles = await getBundles();
>> listBundles(bundles);    // oops, new one not not found
>>
>> // good - querying, editing local copy, then POST'ing
>> const bundles = await getBundles();
>> const url = `/api/bundle?name=${encodeURIComponent(name)}`;
>> const res = await fetch(url, {method: 'POST'});
>> const resBody = await res.json();
>> bundles.push({id: resBody._id, name});
>> listBundles(bundles);
>> ```
>   You always want to maintain content locally *first*, then mirror the changes async'ly upstream
>
> - Webpack plugin `extract-text-webpack-plugin` for CSS text


<br><br>


<hr>

## Chapter 3 - Bringing it all in
#### Un-separating the core code into a web app


<br>


<b>Node.js core modules</b><br>
> - Module `url` and its `URL` class for URL creation
>
> - Node environment variable `NODE_ENV` for dev/prod differentiation
>
> - Filesystem path manipulation with `path` module


<br>


<b>Patterns</b><br>
> - Express middleware
>   - stacking middleware and routes into Express Routers
>
> - Passport
>   - user auth
>   - session management via `express-session` module


<br>


<b>JavaScript-isms</b><br>
> - More async
>   - handling sync and async functions properly
>
> - Authenticated API hits via `fetch()` API


<br>


<b>Supporting code</b><br>
> - `localhost` aliases
>
> - UI components
>   - Social Bootstrap
>   - Font Awesome
>
> - Redis DB and caching server for prod user session management


<br>


<hr>

#### 3.a. Project init

```
./project-files/fortify/....       <-- the 'consolidated' directory
./project-files/fortify/B4         <-- my base version of the book's code
```

Per the book, this is where our final app will live, however, instead of copy/pasting files over
as directed within the book, I'm using my files and updating the code where required while commenting
out my previous code - but keeping all the notes I've layed out throughout building up my files in an
attempt to keep my understanding as lucid as possible

<br>

<b>example.com</b><br>
For inconsistencies with localhost/127.0.0.1 usage with OAuth/providers, set localhost alias to
`b4.example.com`, taking advantage of `example.com` 2nd level domain which is reserved by IANA
for illustrative purposes
```
/etc/hosts

127.0.0.1 b4.example.com
```

So, after `$ npm start`'ing in project root, http://b4.example.com:60900/#welcome is reachable


<br><br>


<hr>

#### 3.b. Express user sessions
An identifying token persisting across requests, authentication and linking requests to previous requests

Will be using Express middleware for cookie/ID assignment, which links to session data, allowing user
agents (browsers) to include cookie value to point to a user's session<br>

`$ npm install --save -E express-session@1.15.6 session-file-store@1.1.2`

`express-session`: uses cookies for session association, but with poorly formatted memory management<br>
`session-file-store`: better session/memory-storage funcitonality, via JSON files for each cookie

With the session config info added to `server.js`, a `sessions` directory should now be in the project
root, with JSON file(s) created under a matching session ID containing session data

Session data can be reviewed with:
```
$ cat sessions/*.json | jq '.'
```


<br><br>

<hr>

<b>Note: Firewall warnings on MacOS</b><br>

Yet another fun 'issue' encountered in this section, continuous notifications to allow Node (n) through
my Mac's firewall was blocking access to this app and the enpoints it was trying to hit

Documenting the fix here: https://github.com/tj/n/issues/394#issuecomment-312510914
```
- SHIFT + CMD + G
- go to: /usr/local/n/versions/node/<version>/bin
- copy node binary there to: /usr/local/bin
- remove references to node in System Preferences > Security > Firewall
- add firewall option for /usr/local/bin/node
```
There was something up with Node n copying the binary

<br><br>


Back to it.


<br><br>


<hr>

<br><br>

<b>Authenticating the user sessions</b><br>
( adding on to `app/templates.ts` )<br>
( adding on to `app/index.ts` )<br>

Frontend portion of user auth

Do an `$ npm install --save -E` for Bootstrap's social buttons and Font Awesome, which it depends on,
for user interaction on the frontend

>Introduces:
> - Bootstrap/Font Awesome icon usage

<br>

<b>Passport</b><br>
( adding on to `server.js` )<br>

Backend portion of user auth

Express-based app authentication middleware, specifically for Facebook/Twitter/Google OAth flows
instead of a self-managed auth system

>Introduces:
> - Configuring Passport to go from user ident token to an actual user object and vice versa
>
> - Setting Express session routes `/auth/session`, `/auth/signout`
>
> - Passport <b>Strategies</b>, auth mechanisms, coupled with a `Strategy` class provided within
>   plugins for the authentication providers that itself plugs into Passport
>
> - Express route `/auth/facebook`, where users are shunted to when clicking 'Sign In' with facebook
>
> - Express route `/auth/facebook/callback`, where Facebook redirects authed users

<br>

<b>Note: Be sure to `.gitignore` the `development.config.json` file to keep your secret key secret</b><br>
I've set a backup of the config file for future public reference in `backup-development.config.json`
that holds everything prior to adding the secret key

<br>

<b>Passport config steps</b><br>
1. Create app with the provider
> ```
> https://developers.facebook.com/apps/344489913000130/dashboard/
> ```
2. Add to our config the app's identifier and secret info
> ```JSON
> "auth": {
>     "facebook": {
>         "appID": "344489913000130",
>         "appSecret": "<secret>"
>     }
> }
> ```
3. Install the Passport Strategy for that provider
> ```
> $ npm install --save -E passport-facebook@2.1.1
> ```
4. Configure the Strategy instance in `server.js`
> ```javascript
> const FacebookStrategy = require('passport-facebook').Strategy;
> passport.use(new FacebookStrategy({
>     clientID: nconf.get('auth:facebook:appID'),
>     clientSecret: nconf.get('auth:facebook:appSecret'),
>     callbackURL: new URL('/auth/facebook/callback', serviceUrl).href,
> }, (accessToken, refreshToken, profile, done) => done(null, profile)));
> ```

<br>

That is the basic config process for all auth providers, replacing 'facebook' as required

<br>

<b>Local sign on</b><br>
Localhost won't serve HTTPS, which is unaceptable to these providers

`server.js` and `development.config.json` have been updated to serve a `passport-local` auth
mechanism to allow me to sign in using a username/password, so has the front end scripts

This will be changed on launch

<br>

<b>Google Auth</b>
- Google Cloud Platform >> IAM & admin (sidebar) >> Manage resources
- Create Project, named `b4-dev`, Create
- APIs & Services > Dashboard, select the project in drop down from top-left
- Enable APIs and Services button
- Use Google+ API under 'Social'
- Add `example.com` to Authorized Domains
- Go to Credentials, Create Credentials
- Select Web Application, ignore the name and Authorized Javascript origins
- Set `http://b4.example.com:60900/auth/google/callback` as the Authorized redirect URI, Create
- Add keys to `development.config.json`
- `$ npm install` the `passport-google-oath20` module, build the Strategy

<br>

<b>Express Routers</b><br>
`../../project-files/fortify/B4/lib/bundle.js`<br>

Allows for modular, maintainable management of API endpoints

Example: `app.use` is a delegation of a Router

>Introduces:
> - Building custom Routes
>
> - Only serving routes after auth check
>
> - Building custom middleware for a Router
>> ```javascript
>> // lib/bundle.js
>> router.use((req, res, next) => {
>>     // auth check...
>>     next();
>> )};
>> ```

<br>

<b>Moving to Prod</b><br>
Dev mode is being flagged with `isDev` variable check

>Introduces:
> - Swapping session data management via <b>Redis</b>, a fast in-memory key/value storage tool, instead
>   of the filesystem (our `session/*.json` files)
>
>   Note: Since Redis can also be used as a DB, cache, message broker and it can be told if it syncs
>   to disk, we'll use it to store session data when `NODE_ENV` is set to `production`
>>  ```
>> // Redis install - Ubuntu
>> $ sudo apt install redis-server redis-tools
>>
>> // Redis install - Mac
>> $ brew install redis
>> // force Redis to launch on PC boot
>> $ ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
>>
>> // start it via launchctl...
>> $ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
>> // ...or start it via config file
>> $ redis-server /usr/local/etc/redis.conf
>>
>> // test the install
>> $ redis-cli ping
>> // Redis package info
>> $ brew info redis
>> ```




<br><br><br><br>

#### TODO

- for all sections, use hard line breaks ( `<br>` ) at columns 100, 80 & 60    <br>
  depending on structure of section and/or 'sub-section'

- normalize style across all sections

- more elaboration within the earlier sections, explain my thoughts better
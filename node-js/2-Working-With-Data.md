<br><br>

> Note: any files quoted here can be found in the project-files directory<br>
> https://github.com/jsore/notes/tree/master/node-js/project-files/file-changes

<br><br>

# Part 2 - Working With Data & Databases
<b>Summarizing this chapter's focus-points</b>
- Parse some data

- Organize some data

- Transport some data

- Node.js debugging

- Developing logical, clear command line programs


<br><br>


<hr>

## Chapter 1 - Data transformation: Obtaining & formatting data
#### XML data `-->` JSON
<b>Converting raw data from an external source ( formatted in XML ) into an intermediate format ( JSON )</b><br>

When working with external data, break down the process of handling/storing the data into two parts:
- transform the raw data into a workable format `  <-- this chapter focuses on this part`
- import that formatted data into the datastore

<br>

> <b>Node.js core modules</b><br>
> - Debugging with Chrome's DevTools debug
>
>     - setting breakpoints
>     - stepping over code chunks
>     - review scoped variables

<br>

> <b>Patterns</b><br>
> - `Cheerio`, a DOM-based XML parser
>     - extracting XML data and transforming it into JSON for document DB insertion
>
> - CSS selectors

<br>

> <b>JavaScript-isms</b><br>
> - More BDD techniques
>
>     - creating modules that export specific functions, instead of the module's entire architecture

<br>

> <b>Supporting code</b><br>
> - Automate launching Mocha tests
>     - Mocha standalone mode
>     - Mocha continuous testing mode
>     - Mocha debug mode
>
> - `Chai`, an assertion library
>     - pair the library with Mocha



<br>


<hr>

#### 1.a. Getting the data + establishing initial tests
Start off by getting a feel for the data you obtain ( in this case, from Project Gutenberg ), pick
through it for an understanding

<br>

> <b>Take Note:</b><br>
> - The catalog files we're getting from Project Gutenberg, who is essentially a provider of ebooks, are in
>   an XML based format named RDF
> - Project root for this chapter:<br>
>       `./project-files/databases/...`
>
> - Supportive, raw data files to work with:<br>
>       `./project-files/databases/data...`

<br>

<b>Download and unzip the data files</b><br>
> `$ curl -O http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2`<br>
> `$ tar -xvjf rdf-files.tar.bz2`

<br>

<b>Fields of importance within any RDF file</b>
- The Gutenberg ID ( ex: 132 for the file `data/cache/epub/132/pg132.rdf` )
- The book's title
- The list of authors
- The list of subjects

<br>

<b>Exploring the Behavior Driven Development pattern while testing</b><br>
In testing, denote the behavior you expect out of a program before running or even implementing the tests

<br>

Demonstration of testing while implementing BDD and Chai's `expect` syntax assertion style:
>   ```javascript
>   // "book should have authors, which should be an array of 2 members"
>   expect(book).to.have.a.property('authors')
>       .that.is.an('array').with.lengthOf(2);
>
>   // or, using Node's `assert` module instead:
>   assert.ok(book.authors, 'book should have authors');
>   assert.ok(Array.isArray(book.authors), 'authors should be an array');
>   assert.equal(book.authors.length, 2, 'authors length should be 2');
>   ```

<br>

To use Mocha and Chai, install them as development dependencies:
> <b>`./project-files/databases`</b>                                    <br>
> `$ npm init -y`                                                       <br>
> `$ npm install --save-dev --save-exact mocha@2.4.5 chai@3.5.0`        <br>

Then update the `scripts` section of your `package.json` file, making `test` invoke Mocha with default arguments:
>   ```JSON
>   "scripts": {
>       "test": "mocha"
>   }
>   ```

<br>

<b>First (failing) test with Chai</b><br>
`./project-files/databases/test/parse-rdf-test.js`<br>

>Introduces:
> - `expect` method on the Chai module


<br><br>


#### 1.b. Wireframing an infrastructure that continuously runs Mocha tests
Approach the tests using BDD & Chai

<br>

<b>Setting up Continuous Testing</b><br>
`./project-files/databases/lib/parse-rdf.js`<br>

>Introduces:
> - Establishing a good development pattern:                            <br>
>>      1. add criteria to test                                         <br>
>>      2. run the test to see failures                                 <br>
>>      3. modify code being tested                                     <br>
>>      4. run test again and see what happens                          <br>
>
> - Invoking Mocha with `--watch` to have it continuously monitor `.js` files when they change <br>
>>      "../databases/package.json"
>
>>      "scripts": {
>>          "test": "mocha",
>>          "test:watch": "mocha --watch --reporter min"
>>      }
>
>>      "$ npm run test:watch"


<br><br>


#### 1.c. Querying raw XML with Cheerio & CSS selectors
Using Cheerio, a module that uses CSS selectors for finding elements in HTML and XML in a manner similar
to jQuery's API, parse our RDF files, implement more test and relevant libraries

<br>

<b>Specifying XML extraction options</b><br>
RDF/XML: rich data format, popularly preferred to be converted to JSON if being worked with (or
JSON-LD: JSON for Linked Data, best for preserving the data's relationship structure)

Cheerio                                                                 <br>
> - Fast, for smaller files                                             <br>
> - DOM-like XML parser without the browser (sees the doc as a whole)   <br>
> - CSS selectors, jQuery similarities for working HTML/XML docs        <br>
> - Similar popular options: `xmldom`, `jsdom`                          <br>
> - Does <b>not</b> allow for extracting remote data                    <br>

<br>

Streaming SAX parsers                                                   <br>
> - "Simple API for XML"                                                <br>
> - Sees XML as a stream of tokens (chunks the doc)                     <br>
> - Programs must keep track of doc structure while running             <br>
> - Example: `sax` Node module                                          <br>

<br>

<b>Cheerio</b><br>
<br>
Install:
> `$ npm install --save --save-exact cheerio@0.22.0`

<br>

We want Cheerio to pull out four 'Fields of importance'

<br>

Book ID:
> The XML
> ```XML
> <pgterms:ebook rdf:about=​"ebooks/132"​>
> ```
> The JS
> ```javascript
> /** "use Cheerio's API to extract book ID then format it..." */
> //book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
> book.id =                     // set the ID property
>     +                         // unary to cast final result as int
>     $('pgterms\\:ebook')      // query for this tag, escaping JS literals and CSS selectors
>     .attr('rdf:about')        // get value of this attribute
>     .replace('ebooks/', '');  // strip off this substring
> ```

<br>

Book title:
> The XML
> ```XML
> <dcterms:title>The Art of War</dcterms:title>
> ```
> The JS
> ```javascript
> /** "...and to extract book title" */
> book.title = $('dcterms\\:title').text();
> ```

<br>

Book authors:
> The XML
> ```XML
> <pgterms:agent rdf:about=​"2009/agents/4349"​>
>    <pgterms:name>Sunzi, active 6th century B.C.</pgterms:name>
> </pgterms:agent>
> <pgterms:agent rdf:about=​"2009/agents/5101"​>
>    <pgterms:name>Giles, Lionel</pgterms:name>
> </pgterms:agent>
> ```
> The JS
> ```javascript
> /** "...and to extract the book's authors" */
> book.authors = $('pgterms\\:agent pgterms\\:name')  // find child :name> under :agents>
>     .toArray().map(elem => $(elem).text());         // convert to array of text strings
> ```

<br>

Book subjects:
> The XML
> ```XML
> <dcterms:subject>
>     <rdf:Description rdf:nodeID=​"N26bb21da0c924e5abcd5809a47f231e7"​>
>         <dcam:memberOf rdf:resource=​"http://purl.org/dc/terms/LCSH"​/>
>         <rdf:value>Military art and science -- Early works to 1800</rdf:value>
>     </rdf:Description>
> </dcterms:subject>
> 
> <dcterms:subject>
>     <rdf:Description rdf:nodeID=​"N269948d6ecf64b6caf1c15139afd375b"​>
>         <rdf:value>War -- Early works to 1800</rdf:value>
>         <dcam:memberOf rdf:resource=​"http://purl.org/dc/terms/LCSH"​/>
>     </rdf:Description>
> </dcterms:subject>
> ```
> The JS
> ```javascript
> /** "...and to extract the book's subject(s)" */
> book.subjects = $('[rdf\\:resource$="/LCSH"]')  // select tag with CSS attribute selector
>     .parent().find('rdf\\:value')               // review parent, find all of matching childs
>     .toArray().map(elem => $(elem).text());     // convert to array of text strings
> ```


<br><br>


#### 1.d. Grabbing all data instead of a specific file
We need to dig through the collection of RDF files, read each one, pass it through `parseRDF` then
grab the JSON objects into a single file for DB insertion, which will be inserted using Elasticsearch's
bulk insert API (which is faster than importing one file at a time)

<br>

<b>Grabbing all items within a directory</b><br>
`./project-files/databases/rdf-to-bulk.js`<br>

>Introduces:
> - `node-dir` module, includes tools to walk a directory tree (`npm install --save --save-exact node-dir@0.1.16`)
>
> - `node-dir`'s `readFiles` method, sequentially operates on files as it encounters them
>
> - `options` object for `readFiles` and its `match` and `exclude` properties










<br><br>

<hr>

## Chapter 2 - Data transformation: Storing the gathered data
#### JSON `-->` Elasticsearch
<b>Moving our formatted data into a database, Elasticsearch - a JSON object indexed NoSQL database</b><br>

When working with external data, break down the process of handling/storing the data into two parts:
- transform the raw data into a workable format
- import that formatted data into the datastore `  <-- this chapter focuses on this part`

<br>

Elasticsearch is a <b>RESTful</b> NoSQL database that indexes JSON documents over HTTP, parsing JSON
files into JSON objects and storing those objects

RESTful API's are HTTP-based with resources identified as URLs, HTTP requests (ex: `GET`, `PUT`) must
be made to change or retrieve a resource

Elasticsearch's RESTful resources are JSON docs, each doc living in an index with a type for doc class definition

This chapter focuses on building a CLI utitity for interaction with this service

<br>

<b>Node.js core modules</b><br>
> - Data streams
>
>     - pipe streams to remote services over HTTP
>
> - Diving deeper into `package.json` files

<br>

<b>Patterns</b><br>
> - `Commander` module
>
>     - building CLI programs with this module's method-chaining pattern
>
> - `Request` module
>
>     - performing HTTP requests

<br>

<b>JavaScript-isms</b><br>
> - Defining default parameters for JS function calls
>
> - Array methods `filter` and `join`

<br>

<b>Supporting code</b><br>
> - Elasticsearch, a JSON doc datastore
>
> - `jq`, a CLI tool for JSON manipulation

<br>


<hr>

#### 2.a. Project configuration

<b>Elasticsearch</b><br>
Elasticsearch runs on Java, it's recommended to use Oracle's Java Development Kit (JDK) v1.8.0_73 or higher
> `$ yum install java-1.8.0-openjdk-devel`

<br>

Then, download and install Elasticsearch itself (v5.2 for this book)
> Create `elasticsearch.repo` in `/etc/yum.repos.d/` and enter this:
>>  ```
>>  [elasticsearch-6.x]
>>  name=Elasticsearch repository for 6.x packages
>>  baseurl=https://artifacts.elastic.co/packages/6.x/yum
>>  gpgcheck=1
>>  gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
>>  enabled=1
>>  autorefresh=1
>>  type=rpm-md
>>  ```
>
> Get Elasticsearch started and confirm installation/process status
>> `$ /bin/systemctl daemon-reload`                                                                         <br>
>>
>> `$ /bin/systemctl enable elasticsearch.service`                                                          <br>
>> `> Created symlink from /etc/systemd/system/multi-user.target.wants/elasticsearch.service to`            <br>
>> `> /usr/lib/systemd/system/elasticsearch.service.`                                                       <br>
>>
>> `$ systemctl start elasticsearch.service`                                                                <br>
>>
>> `$ systemctl status elasticsearch.service`                                                               <br>
>> `> ● elasticsearch.service - Elasticsearch`                                                              <br>
>> `>   Loaded: loaded (/usr/lib/systemd/system/elasticsearch.service; enabled; vendor preset: disabled)`   <br>
>> `>   Active: active (running) since Mon 2018-12-10 13:04:24 EST; 2s ago`

<br>

<b>File `package.json`</b><br>
Now, get the `package.json` file started from `./project-files/esclu` with an appropriate `description`
> `$ npm init`                                                                                  <br>
> ...                                                                                           <br>
> `> package name: (esclu)`                                                                     <br>
> `> version: (1.0.0)`                                                                          <br>
> `> description: Elasticsearch Command Line Utility`                                           <br>
> ...                                                                                           <br>
> `> About to write to /var/www/github_notes/notes/node-js/project-files/esclu/package.json:`   <br>
> `>`                                                                                           <br>
> `> {`                                                                                         <br>
> `>   "name": "esclu",`                                                                        <br>
> `>   "version": "1.0.0",`                                                                     <br>
> `>   "description": "Elasticsearch Command Line Utility",`                                    <br>
> `>   "main": "index.js",`                                                                     <br>
> `>   "scripts": {`                                                                            <br>
> `>     "test": "echo \"Error: no test specified\" && exit 1"`                                 <br>
> `>   },`                                                                                      <br>
> `>   "author": "",`                                                                           <br>
> `>   "license": "ISC"`                                                                        <br>
> `> }`                                                                                         <br>
> `>`
> `> Is this OK? (yes) yes`

<br>

<b>Modules `Commander` and `Request`</b><br>
(for easier CL program creation, for easier HTTP request issuance and response handling)
> `$ npm install --save --save-exact commander@2.9.0 request@2.79.0`


<br><br>


<hr>

#### 2.b. `Commander`-based command line program
Commander: enforces required parameters, parses CL options, interprets aliases for flags, and more

Goal: create `esclu` file as an extensionless executable

<br>

<b>Executable to run separated JS</b><br>
`./project-files/esclu/esclu`

Then make it executable
> `$ chmod +x esclu`

<br>

<b>The JS to run when exe is called</b><br>
`./project-files/esclu/index.js`

>Introduces:
> - ...a lot `      <-- TODO`

<br>

<b>Using `jq` program for pretty-fying JSON data</b><br>
Install:
> `$ yum install jq -y`

Example usage, using simplest query of `'.'`:
> `$ ./esclu li -j | jq '.'`

> ```
> {
>   "books": {
>     "aliases": {},
>     "mappings": {},
>     "settings": {
>       "index": {
>         "creation_date": "1544471974796",
>         "number_of_shards": "5",
>         "number_of_replicas": "1",
>         "uuid": "7P9by0wmRF6S4HI7VhYDOQ",
>         "version": {
>           "created": "6050299"
>         },
>         "provided_name": "books"
>       }
>     }
>   }
> }
> ```

Another example, extracting keys of an object as an array:
> `$ ./esclu li -j | jq 'keys'`

> ```
> [
>   "books"
> ]
> ```

<br>

See source file for more example usages

<br><br>

## TODO: elaborate in final section 2.b.
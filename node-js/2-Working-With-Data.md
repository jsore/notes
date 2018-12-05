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

<br><br>

<b>Download and unzip the data files</b><br>
> `$ curl -O http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2`<br>
> `$ tar -xvjf rdf-files.tar.bz2`

<br><br>

<b>Fields of importance within any RDF file</b>
- The Gutenberg ID ( ex: 132 for the file `data/cache/epub/132/pg132.rdf` )
- The book's title
- The list of authors
- The list of subjects

<br><br>

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

<br><br>

<b>First (failing) test with Chai</b><br>
`./project-files/databases/test/parse-rdf-test.js`<br>

>Introduces:
> - `expect` method on the Chai module

<br>

<b>Setting up Continuous Testing</b><br>
`./project-files/databases/lib/parse-rdf.js`<br>

>Introduces:
> 








<br><br>


#### 1.b. Wireframing an infrastructure that continuously runs Mocha tests
Approach the tests using BDD & Chai


<br><br>


#### 1.c. Querying raw XML with Cheerio & CSS selectors
Using Cheerio, a module that uses CSS selectors for finding elements in HTML and XML


<br><br>


#### 1.d. Parsing raw data & producing newly formatted data
Getting the data ready for database insertion by combing through the already procured data and
reformatting it into an acceptable style

<br><br>

<hr>

## Chapter 2 - Data transformation: Storing the gathered data
#### JSON `-->` Elasticsearch
<b>Moving our formatted data into a database, Elasticsearch - a JSON object indexed NoSQL database</b><br>

When working with external data, break down the process of handling/storing the data into two parts:
- transform the raw data into a workable format
- import that formatted data into the datastore `  <-- this chapter focuses on this part`

<br>

> <b>Node.js core modules</b><br>
>

> <b>Patterns</b><br>
>

> <b>JavaScript-isms</b><br>
>

> <b>Supporting code</b><br>
>


<br>


<hr>

#### 2.a. 


<br>



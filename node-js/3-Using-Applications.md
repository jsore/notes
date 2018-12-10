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

#### 2.a. Express
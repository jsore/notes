# End To End Testing

__Pre-summary__

Using a TDD approach, develop backend API for a client CRUD app off an Elasticsearch DB.

- Types of tests
- Implement TDD workflow __Red-Green-Refactor__ cycle
  + Write failing tests `Red: test failed`
  + Rewrite to pass tests `Green: test is now passing`
  + Improve implementation quality `Refactor: work on code elegance` ( app's AND test's code )
- E2E tests with `Cucumber` and `Gherkin`

<br><br>



--------------------------------------------------------------------------------
### Types Of Tests

__Unit Tests__

- small and specific
- testing of a singular snippet ( unit ) of code functionality
- doesn't call on other parts of the app
- only care of unit functionality independent of of external dependencies
  + ex: if unit acts on a DB, substitute fake one, we don't care about the DB


__Integration Tests__

- testing interaction of two or more units


__E2E/Functional Tests__

- flow of app from start to finish as if we were the end consumers


__UI Tests__

- testing the frontend portion
- automated tests mimicking behavior of user interaction ( scrolling, clicking, etc )
- generic browser automation: `Selenium`
- framework specific: `Enzyme` for React


__Manual Tests__

- costly, not deterministic ( one-off issues )
- cannot be automated
- can be used to catch bugs or bad UX


__Acceptance Tests__

- focused on business needs and requirements/justifications
  + ex: "95% of visitors must be able to load the page in 3 seconds"
- drives technical decisions
- requires some Behavior Driven Development test formats
  + focuses on steps users take when interacting with the platform
  + ex: "Given an auth'ed user is on a product page, 'Add To Cart' button should add product to the cart"

<br>

- try balancing test suite to have more granular tests than large/vague ones
- does not mean unit testing is the most important
  + __When implementing a new feature, write the E2E tests first__
- set Unit Tests to run every time code changes

<br><br>



--------------------------------------------------------------------------------
### Requirements and Specifications

__Requirements__ outline high level goals a business wants an app to achieve

__Technical Specifications__ help developers understand the basis of how to implement

> Create a web application that allows users to log in and
> update their own profiles
>
> Requirement:
> 1. Create API server with an endpoint to create new users
>
> Specifications:
> - Authentication: user registration, login
> - Profile: user profile edits, view other user profiles
> - Database: user data storage
> - API Server: interface between internal services >> external consumers

__Maintenance__ also needs to be considered, which is in essence a way of tracking
and squashing bugs. Example: Bug found that `age` returns as a `float`, write a
test case asserting that `age` is always a positive integer.

<br>

This section's requirement:

> Create an API end-point ( `/users` ) that accepts `POST`'s and stores JSON
> payload of the request ( representing the user ) into a database.
>
> Constraints:
> - user payload must include email address and password fields
> - user payload may optionally provide a profile object...
> - ...otherwise, an empty profile will be created for them

<br><br>



--------------------------------------------------------------------------------
### E2E Tests With Cucumber

Cucumber is an automated test runner executing tests written in the Gherkin DSL,
a language similar to plain English

```
$ yarn add cucumber --dev
```

<br>


__File Formats & Usage__

Best Practice: Separate the platform into multiple features each having defined
scenarios to test for.

Each testing scenario is defined within a `.feature` file, denoted with keywords
in the Gherkin language.

<br>


__Create User Feature__ scenarios:

- Client sends `POST` to `/users` with empty payload
  + API responds with `400 Bad Request` & JSON object with error message
- Client sends `POST` to `/users` with non-JSON payload
  + API responds with `415 Unsupported Media Type` & JSON object with error message
- Client sends `POST` to `/users` with malformed JSON payload
  + API responds with `400 Bad Request` & JSON object with error message

```
$ mkdir -p spec/cucumber/features/users/create
$ touch spec/cucumber/features/users/create/main.feature    # feature defined in Gherkin
```

Example, a single specification from an early form of `main.feature`:
```
# some feature and a description of what it should do
Feature: Create User

 Clients should be able to send a request to our API in
 order to create a user. Our API should also validate the
 structure of the payload and respond with an error if it is
 invalid.

 Scenario: Empty Payload

 If the client sends a POST request to /users with an
 unsupported payload, it should receive a response with a
 4xx status code.

# the steps to test this scenario
 When the client creates a POST request to /users
 And attaches a generic empty payload
 And sends the request
 Then our API should respond with a 400 HTTP status code
 And the payload of the response should be a JSON object
 And contains a message property which says "Payload should not be empty"
```

<br>


Cucumber looks for the `features` directory in the project's root by default, to
run all `.feature` files within it. Pass our custom path `spec/cucumber/features`
when running Cucumber
```
$ npx cucumber-js spec/cucumber/features
```

The `.feature` files are spread across folders denoting a feature and different
aspects of that feature.

Example: the ability for consumers to create a new user profile is a subfeature
of the `users` feature,
```
spec/cucumber/features/users/create/main.feature
```

<br>


Cucumber can't parse instructions in Gherkin out of the box. The steps need to
be defined in JS code as __step definitions__
```
spec/cucumber/steps
```

Run with:
```
$ npx cucumber-js spec/cucumber/features --require spec/cucumber/steps
( oops, syntax error )
$ yarn add @babel/register --dev    # 1st set Babel as compiler for ES6 usage
$ npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
```

<br>


Note to self: the `npx` command above threw an error about `semver` and
`utils/unsupported.js`. Fixed with:
```
# https://stackoverflow.com/questions/44363066/error-cannot-find-module-lib-utils-unsupported-js-while-using-ionic
$ sudo rm -rf /usr/local/lib/node_modules/npm
$ brew reinstall node
( postinstall error )
$ sudo chown -R $(whoami):admin /usr/local/lib/node_modules
$ brew postinstall node    # now I can run what I originally wanted:
$ npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
```

<br><br>



--------------------------------------------------------------------------------
### Implementing Step Definitions Testing

Install `superagent` package for easier HTTP request testing
- compose requests by chaining steps together
- initiate a request object at init to get modified on each step
- those modifications compose the final request

```javascript
// hobnob/spec/cucumber/steps/index.js

/** 1st step definition... */
When('the client creates a POST request to /users', function () {
  /** start a new request object */
  request = superagent('POST', 'localhost:8080/users');
});

/** ...2nd step definition... */
When('attaches a generic empty payload', function () {
  /** sending empty payloads is superagent's default behavior */
  return undefined;
});

/** ...3rd step definition... */
When('sends the request', function (callback) {
  /** specify a callback so the next step doesn't run prematurely */

  /** send request from 1st & 2nd steps to testing API server... */
  request
    .then((response) => {
      /** ...and save the response elsewhere... */
      result = response.res;
      /** ...then finally callback() after response received and saved */
      callback();
    })
    .catch((errResponse) => {
      error = errResponse.response;
      callback();
    });
});
```

<br><br>



--------------------------------------------------------------------------------
### Chrome DevTools In Node

Pass `--inspect` when running node app and go to `chrome://inspect/#devices` and
select 'Open dedicated DevTools for Node', then
```
$ yarn global add ndb     # install this globally cause it's a cool tool
$ npx ndb .               # run the ndb binary
( bottom left, run node command 'watch' )
```

<br><br>



--------------------------------------------------------------------------------
### Using `.env` To Replace Hardcoded Values

Example, removing hardcoded API server names:
```
# hobnob/.env
SERVER_PROTOCOL=http
SERVER_HOSTNAME=localhost
SERVER_PORT=8080
```

Use `dotenv-cli` package to load the variables into our code
```
$ yarn add dotenv-cli --dev
$ dotenv <node command you want to run>    # load the .env file
( or add dotenv to package.json serve & test:e2e scripts )
```

<br><br>



--------------------------------------------------------------------------------
### Keep Testing Schema DRY

Within a __Scenario Outline__ in `.feature` files, use a __Datatable__
```
  | payloadType | statusCode | message                                                       |
  | empty       | 400        | "Payload should not be empty"                                 |
  | non-JSON    | 415        | 'The "Content-Type" header must always be "application/json"' |
  | malformed   | 400        | "Payload should be in JSON format"                            |
```
Cucmber will loop through each row and run through the test `row.length` times,
using the value in each column for that row. Access those values by using
__placeholders__ in your test's steps
```
# placeholders denoted by <variable>
When the client creates a POST request to /users
And attaches a generic <payloadType> payload
And sends the request
Then our API should respond with a <statusCode> HTTP status code
And the payload of the response should be a JSON object
And contains a message property which says <message>
```
This keeps you from having to repeat steps shared between multiple scenarios

<br>


In your step definitions, use __parameters__ in strings to avoid duplicating code
```javascript
/** indicate that the pattern should match an integer */
Then('our API should respond with a {int} HTTP status code', function (statusCode) {
  /** pass the value into the callback to do the checking */
  assert.equal(this.response.statusCode, statusCode);
});
```
Or, using regex
```javascript
Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
```

<br><br>



--------------------------------------------------------------------------------
### Migrate API To Web Framework Express

Reasons for refactoring for Express migration:
- the API is messy and not even that functional, and yet...
- ...code is not very readable
- ...PITA to work with low level constructs like streams and buffers
- ...performance and security has yet to be addressed
- ...__Server Side Rendering__ with React frontend needs to be accounted for

<br><br>



--------------------------------------------------------------------------------
### Aside: Git Flow Update

I wasn't thinking reasonably about branch structure, I'm taking notes on more
than one book in this repo and each book will have its own separate sections.

<br>


__Old Structure__

So, after merging updates up to this point to `sections -> dev -> master`:
```
$ git branch
    dev
  * master
    sections
    sections.end-to-end-testing
    sections.the-development-environment
```

<br>


__New Structuure__

```.
└── master
    └── dev
        ├── books/main
        │   ├── books/some-book
        │   │   ├── books/some-book.section-title-a
        │   │   └── books/some-book.section-title-b
        │   ├── books/a-different-book
        │   │   ├── books/some-book.section-title-a
        │   │   ├── books/some-book.section-title-b
        │   │   ├── books/some-book.section-title-c
        │   │   ├── books/some-book.section-title-d
        │   │   └── books/some-book.section-title-e
        │   └── books/book-over-topic-xyz
        │       ├── books/some-book.section-title-a
        │       ├── books/some-book.section-title-b
        │       └── books/some-book.section-title-c
        └── ramblings/main
            ...
```

<br>


Steps taken/process to revise and re-org into a better future proofed structure:

- idk, play it safe and let's do this off `dev`'s branch
    ```
    $ git checkout dev
      Switched to branch 'dev'
    ```

- delete sub-feature branches ( __REMINDER__: check `master` is up to date first )
    ```
    $ git branch -D sections.end-to-end-testing sections.the-development-environment
      Deleted branch sections.end-to-end-testing (was 812b6bd).
      Deleted branch sections.the-development-environment (was 024b989).

    $ git branch
      * dev
        master
        sections
    ```

- then ditch the main feature branch that was there
    ```
    $ git branch -D sections
      Deleted branch sections (was 812b6bd).

    $ git branch
      * dev
        master
    ```

- begin again, fresh start
    ```
    $ git checkout -b books/main dev
      Switched to a new branch 'books/main'

    $ git branch
      * books/main
        dev
        master

    $ git checkout -b books/enterprise-js books/main
      Switched to a new branch 'books/enterprise-js'

    $ git branch
      * books/enterprise-js
        books/main
        dev
        master

    $ git checkout -b books/enterprise-js.end-to-end-testing
      Switched to a new branch 'books/enterprise-js.end-to-end-testing'

    $ git branch
        books/enterprise-js
      * books/enterprise-js.end-to-end-testing
        books/main
        dev
        master
    ```

<br>

`thats-better.png`

<br><br>



--------------------------------------------------------------------------------
### Summary

__Red__
- begin by writing test scenarios
- implement any undefined steps
- run tests, see them fail
- implement enough application code to make them pass

__Green__
- all tests are passing

__Refactor__
- DRY not adhered to?
- Should a custom supportive module be created for modularization?

<br>


__The whole point of TDD is to translate system design into requirements__



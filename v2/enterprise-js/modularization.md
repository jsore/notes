# Modularization

<br><br>



--------------------------------------------------------------------------------
### Content Type Middleware

Start with moving middleware for payload checking to `src/middlewares`

Dead simple, just move functions into separate files and export them as the
`default` export.

<br><br>



--------------------------------------------------------------------------------
### Request Handlers

Example: `POST` request handler for `/users` endpoint, `src/handlers/users/create.js`

__Higher Order Functions__: functions that return or operate on other functions
- `src/utils/inject-handler-dependencies`

<br><br>



--------------------------------------------------------------------------------
### Single Responsibility Principle

As of now, the middleware for request handlers serves three functions

1. Validates the request
2. Writes to a DB
3. Generates the response

Stay __SOLID__

- __S__ ingle responsibility

> Modules perform one and only one function

We need to pull out validation and database logic into other modules.

- __O__ pen/closed
- __L__ iskov substitution
- __I__ nterface segragation
- __D__ ependency inversion

<br>


The validation logic is __tightly coupled__ with response logic because it
directly modifies the response object. A common __interface__ between the
validation logic and response handler needs to be defined.

The validation logic will produce an object that conforms to the shared
interface and the response handler will consume this object to produce the `res`.

Status and response headers will be handled by the request handlers.

<br>


Consider request validation failures as type errors; client provided incorrect
payload. We can extend the native `Error` object to create a new
`ValidationError` object to act as the shared interface.

The class extension lets us distinguish between:

- __Validation errors__ which should return `400` responses for bad requests
- __Code errors__ which should return `500` responses for server errors

Define the `ValidationError` class in `src/validators/errors/validation-error.js`

<br><br>



--------------------------------------------------------------------------------
### Engines

Example engine: process a request from a request handler and respond with the
operation's result. Then the request handler issues appropriate responses to the
awaiting client based on that operation.

This will factor out:

- processing the results of the validator
- interacting with the DB
- sending back the response

The handler's sole job should be to pass ( handle ) the request to the engine.

`src/engines/users/create.js`

<br><br>



--------------------------------------------------------------------------------
### Current Project Structure

Noting down the current structure before moving forward with feature additions.

( alphabetical order, directories first )

<br>



__Transpiled code for distribution__

( see 'src' directory for file info )

    .
    ├── dist    <-- completely mirrors 'src' but w/transpiled code
    │   ...
    ...

These are created with `package.json` scripts.

    "scripts": {
      ...
      "build": "rimraf dist && babel src -d dist",
      ...
      "serve": "yarn run build && dotenv -e envs/.env node dist/index.js",
      ...
      "watch": "nodemon -w src --exec yarn run serve"
    }

So, essentially, everything is triggered with simply `$ yarn run watch`.

<br>



__Dynamic Environment values__

    ...
    ├── envs
    │   ├── .env                <-- variables for development, .gitignore'ed
    │   ├── .env.example        <-- examples for public distribution
    │   ├── test.env            <-- variables for testing dev, .gitignore'ed
    │   └── test.env.example    <-- examples for public distribution
    ...

These values are brought in at run- or build-time, using the `dotenv` package.

Example, from `package.json` `scripts`
```
"test:e2e": "dotenv -e envs/test.env -e envs/.env ./scripts/e2e.test.sh",
```

<br>



__CLI command automation__

    ...
    ├── scripts
    │   ├── e2e.test.sh
    │   ...
    ...

Automates initiating and running through end-to-end tests.

Checks for processes that should or shouldn't be running, kills or executes them
as necessary then runs `yarn run serve` with the `test.env` values loaded, to
spin up the testing API server and run tests under the `test` database so that
I'm not interfering with the dev DB.

Once the tests are done, the test API is shut down and processes are cleaned up.

This allows for a normal development API to continue running and keeps me from
having to write out commands using proper environment variables each time a test
needs to be ran. All I need to do now is:
```
$ yarn run test:e2e
```

<br>



__Adherence to application specifications__

    ...
    ├── spec
    │   └── cucumber
    │       ├── features                    <-- Gherkin-based specifications
    │       │   ├── main.feature
    │       │   └── users                   <-- a broad application feature
    │       │       ├── create              <-- a specific sub-feature
    │       │       │   └── main.feature    <-- bottom-level specificity
    │       │       ├── login               <-- another supportive sub-feature
    │       │       │   ...
    │       │       ...
    │       └── steps           <-- js implementations of Gherkin tests
    │           ├── index.js    <-- Gherkin scenario translations
    │           └── utils.js    <-- supportive DRY code for translations
    ...

I'm running tests with the Cucumber package.

The specifications for the application are laid out in `.feature` files, which
are written in Gherkin for easier human-readability. The Gherkin specifications
are then translated into JavaScript. Each JS block translates a Gherkin Step,
each Step belonging to a Scenario.

Example:

_A specification says clients should be able to create user profiles,_
_which mandates specific development requirements, one of which references the_
_need to validate payloads and handle bad incoming requests._

<details>
<summary>The Gherkin specification snippet</summary>

```gherkin
Feature: Create User

  Clients should be able to send a request to our API in
  order to create a user. Our API should also validate the
  structure of the payload and respond with an error if it
  is invalid.

  # what is to be checked for:
  Scenario Outline: Bad Request Payload

    # this will require 6 steps:
    When the client creates a POST request to /users
    And attaches a Create User payload which is missing the <missingFields> field
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload must contain at least the email and password fields"

    # platform will loop until all <parameter>'s are checked:
    Examples:

    | missingFields |
    | email         |
    | password      |
```
</details>

<br>

<details>
<summary>The JS translation of step 2, "And attaches a Create User payload ..."</summary>

```javascript
When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
  /** attach dummy user payload with a field missing */
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  /** convert extracted parameter str to arr... */
  const fieldsToDelete = missingFields.split(',')
    /** ...loop through each object prop and clean it... */
    .map(s => s.trim()).filter(s => s !== '');
    /** ...delete one and feed incomplete payload into req */
  fieldsToDelete.forEach(field => delete payload[field]);
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});
```
</details>

<br>

<details>
<summary>App code snippet that ( mostly ) manages adherence to the JS translation</summary>

```javascript
  // ...
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    return new ValidationError(
      'Payload must contain at least the email and password fields',
    );
  }
  // ...
```
</details>

<br>

The specifications are outlined in a parent-level `.feature` file which applies
generally across the entire application, then drills down to specify specs for
every feature implemented under the application, then drills down even further
into sub-features which support their parent feature in specific manners.

The Gherkin Scenarios define the utilities, roles or requirements that are to be
tested when the testing platform is initiated.

The JS translations are checked against the Scenarios, a sort of pseudo-code that
the platform runs through and makes sure outcomes expected from the Scenarios
are roughly outlined in JS.

The translations are then checked against the application code. Not everything
should be tested, some supportive roles ( packages ) are there only to ensure
there's a foundation to allow these test or development flows to work cohesively.
Only code within `src` is tested.


<br>



__Source development code__

    ...
    ├── src
    │   ├── engines
    │   │   └── users
    │   │       └── create.js
    │   ├── handlers
    │   │   └── users                   <-- a feature that will require API calls
    │   │       └── create.js           <-- routes POST requests to /users API endpoint
    │   ├── middlewares
    │   │   ├── check-content-type-is-json.js
    │   │   ├── check-content-type-is-set.js
    │   │   ├── check-empty-payload.js
    │   │   └── error-handler.js
    │   ├── utils
    │   │   └── inject-handler-dependencies.js
    │   ├── validators
    │   │   ├── errors                  <-- handles request/payload errors
    │   │   │   └── validation-error.js
    │   │   └── users
    │   │       └── create.js
    │   └── index.js                    <-- main application entry point
    ...

This is the main development logic.

- `engines` operate and process on client requests, responses, DB calls, etc etc
- `handlers` take care of purely routing requests and responses only
- `middlewares` are custom supportive modules, partially helping to keep DRY
- `utils` hold the main DRY adherence responsibility. Re-usable code
- `validators` are what the Engines use for payload format checks
  + if a validator sees an error: client request payload issue
  + other ( HTTP 500 Server Error ) errors are codebase issues, checked for inline

The feature/sub-feature/code-for-specific-thing pattern is repeated often.

<br>



__Other root and `.` files__

    .
    ├── ...
    ...
    ├── .babelrc          <-- rules for transpiling
    ├── .eslintrc.json    <-- rules for linter
    ├── .gitignore        <-- self explanatory
    ├── .nvmrc            <-- useful for other devs using nvm with this
    ├── package.json      <-- rules for packaging and dependencies
    ├── yarn-error.log    <-- i prefer yarn over npm
    └── yarn.lock         <-- lockfile for yarn packages

<br>

Complete but brief overview of `package.json` and dependencies

```
{
  "name": "hobnob",
  "version": "0.1.0",
  "description": "Back end for a simple user directory API with recommendation engine",
  "main": "index.js",
  "scripts": {
    "build": "rimraf dist && babel src -d dist",
    "fix": "eslint src --fix",
    "lint": "eslint src",
    "precommit": "yarn run lint",
    "serve": "yarn run build && dotenv -e envs/.env node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "test:e2e": "dotenv -e envs/test.env -e envs/.env ./scripts/e2e.test.sh",
    "watch": "nodemon -w src --exec yarn run serve"
  },
  "repository": {
    "type": "git",
    "url": "git@github.com-jsore:jsore/hobnob.git"
  },
  "author": "Justin Sorensen <justin@jsore.com> (https://jsore.com)",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.4.4",
    "@babel/core": "^7.4.5",
    "@babel/preset-env": "^7.4.5",
    "@babel/register": "^7.4.4",
    "cucumber": "^5.1.0",
    "dotenv-cli": "^2.0.0",
    "eslint": "^5.16.0",
    "husky": "^2.3.0",
    "nodemon": "^1.19.0",
    "rimraf": "^2.6.3",
    "superagent": "^5.0.5"
  },
  "dependencies": {
    "@babel/polyfill": "^7.4.4",
    "body-parser": "^1.19.0",
    "elasticsearch": "^16.1.1",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.17.3",
    "express": "^4.17.1"
  }
}
```

<br>


Scripts for Yarn to run:

    "scripts": {
        "build": "rimraf dist && babel src -d dist",
> Recompile transpiled src after deleting old distribution package

    "fix": "eslint src --fix",
> Run the linter on `src` files and fix problems it can fix on its own

    "lint": "eslint src",
> Run the linter on `src` files to find errors or formatting problems

    "precommit": "yarn run lint",
> Git hook to run `src` through linter before commiting `git commit`'s

    "serve": "yarn run build && dotenv -e envs/.env node dist/index.js",
> Run `build` script using the development environment's variables

    "test:e2e": "dotenv -e envs/test.env -e envs/.env ./scripts/e2e.test.sh",
> Fire end-to-end testing script using test environement variables

    "watch": "nodemon -w src --exec yarn run serve"
> Run server using nodemon for live reload upon change of codebase

<br>


Dependencies used only while devloping, not packaged with distribution:

    "devDependencies": {
        "@babel/cli"            <-- transpiling, CLI tool
        "@babel/core"           <-- transpiling, main logic
        "@babel/preset-env"     <-- transpiling, handle env variables
        "@babel/register"       <-- transpiling, specify file types
        "cucumber"              <-- testing platform
        "dotenv-cli"            <-- helps with loading env files
        "eslint"                <-- linter
        "husky"                 <-- helps with git hooks
        "nodemon"               <-- watch for file changes, reload server
        "rimraf"                <-- 'rm -rf' but for node, used on dist dir
        "superagent"            <-- helps form mock client requests
      },

<br><br>



--------------------------------------------------------------------------------
### Writing Specificaionts As Tests

So far, only scenarios where user profiles are not supplied have been implemented.

What should constitute a valid profile? Choice:

```
{
  "name": {
    "first": <string>,
    "last": <string>,
    "middle": <string>
  },
  "summary": <string>,
  "bio": <string>
}
```

<br><br>



--------------------------------------------------------------------------------
### Refactor: Validate With Data Schema

Instead of validating using `if` blocks, use a schema ( declarative data
structure ) to define how request data objects should be formed

__JSON Schema__: define a schema written in JSON and compare data object using a
llibrary.

Consider __interoperability__ ( how easy the schema can be consumed by frameworks
libraries or languages ) and __expressiveness__ ( the functionality to validate
or operate on data 'if x is y then x needs to be type c' ) when picking a schema.

<br>


A JSON Schema is itself a JSON object, simplest example:
```
{}
```

Which is useless, any data type can be used in here. Define the data type with
the `type` keyword:
```
{ "type": "object" }    <-- allows strings or array of strings
```

Inputs for user profile objects are expected to be `objects` only.

Keywords can share type-specific keywords or other descriptive keywords.
```
{
  "type": "object",
  "properties": {                       <-- type-specific keyword, object props go here
    "bio": { "type": "string" },        <-- properties must be objects with sub-schema
    "summary": { "type": "string" },
    "name": { "type": "object" }
  }
}
```

Objects with keys not defined in `properties` can be rejected:
```
{
  "type": "object",
  "properties": {
    "bio": { "type": "string" },
    "summary": { "type": "string" },
    "name": { "type": "object" }
  },
  "additionalProperties": false         <-- another object-specific keyword
}
```

This keyword is required here because of Elasticsearch using __dynamic mapping__
to infer data types for documents to generate its indexes. What it infers is
what it uses for an index's type mapping.

<br>


Define better, more specific property constraints with sub-schemas
```
{
  "type": "object",
  "properties": {
    "bio": { "type": "string" },
    "summary": { "type": "string" },
    "name": {
      "type": "object",
      "properties": {
        "first": { "type": "string" },
        "last": { "type": "string" },
        "middle": { "type": "string" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

But this is still unclear that it's a Schema, not just a JSON object. Supply to
users additional context explaining what the purpose of this JSON block is
```
"title": "User Profile Schema",
"description": "For validating client-provided user profile object when create and/or updating an user",

"$schema": "http://json-schema.org/schema#"    <-- specifying meta-schema

"$id": "http://example.com"    <-- unique referer to our schema
```

<br>


Finished Schema `src/schema/users/profile.json`
```
{
  "$schema": "http://json-schema.org/schema#",
  "$id": "http://api.hobnob.social/schemas/users/profile.json",
  "title": "User Profile Schema",
  "description": "For validating client-provided user profile object when create and/or updating an user",
  "type": "object",
  "properties": {
    "bio": { "type": "string" },
    "summary": { "type": "string" },
    "name": {
      "type": "object",
      "properties": {
        "first": { "type": "string" },
        "last": { "type": "string" },
        "middle": { "type": "string" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

This Schema can now be used with a `$ref` reference. Example, from the
Create User schema
```
{
  "$schema": "http://json-schema.org/schema#",
  "$id": "http://api.hobnob.social/schemas/users/profile.json",
  "title": "Create User Schema",
  "description": "For validating client-provided create user object",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": { "type": "string" },
    "profile": { "$ref": "profile.json#" }    <-- use the already defined profile
  },
  "required": ["email", "password"],    <-- also, fail validation if not included
  "additionalProperties": false
}
```

<br>


JSON Schema __validation libraries__ can be chosen from `json-schema.org`

( json-schema.org/implementations.html )

<br><br>



--------------------------------------------------------------------------------
### Refactor: Validating The Schema With Ajv Library

`$ yarn add ajv`

- Refactor `src/validators/users/create.js`
- Add `src/validators/errors/messages.js`
- Refactor `And` statements in `features/users/create/main.feature` for general usage
- Workaround for Babel not using Schema files, update `build` script
  + from:  `"build": "rimraf dist && babel src -d dist",`
  + to:    `"build": "rimraf dist && babel src -d dist --copy-files"`
  + this will allow Babel to copy over non-compatible files to `dist/`

<br>

<details>
<summary><strong>Tests Are Failing Now</strong></summary>
Not sure what's wrong, but 12 tests are failing now, the server or the ES DB is
returning with 404's instead of whatever is expected to be received.

<br>

<details>
<summary>Test results</summary>

```
$ yarn run test:e2e

> yarn run v1.16.0
> $ dotenv -e envs/test.env -e envs/.env ./scripts/e2e.test.sh
> Elasticsearch running and ready for tests
> $ yarn run build && dotenv -e envs/.env node dist/index.js
> $ rimraf dist && babel src -d dist --copy-files
> Successfully compiled 11 files with Babel.
> Hobnob API server running on port 8888...
> node    75495 justin   23u  IPv6 0x193734643c001ea3      0t0  TCP *:8888 (LISTEN)

 1) Scenario: Bad Request Payload # spec/cucumber/features/users/create/main.feature:49
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 2) Scenario: Bad Request Payload # spec/cucumber/features/users/create/main.feature:50
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 3) Scenario: Request Payload with Properties of Unsupported Type # spec/cucumber/features/users/create/main.feature:65
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 4) Scenario: Request Payload with Properties of Unsupported Type # spec/cucumber/features/users/create/main.feature:66
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 5) Scenario: Request Payload with invalid email format # spec/cucumber/features/users/create/main.feature:82
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 6) Scenario: Request Payload with invalid email format # spec/cucumber/features/users/create/main.feature:83
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 7) Scenario: Request Payload with invalid email format # spec/cucumber/features/users/create/main.feature:84
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 8) Scenario: Minimal Valid User # spec/cucumber/features/users/create/main.feature:87
    ✖ Then our API should respond with a 201 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '201'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 9) Scenario: Invalid Profile # spec/cucumber/features/users/create/main.feature:111
    ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
        AssertionError [ERR_ASSERTION]: 404 == '400'
            at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 10) Scenario: Invalid Profile # spec/cucumber/features/users/create/main.feature:112
     ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
         AssertionError [ERR_ASSERTION]: 404 == '400'
             at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 11) Scenario: Invalid Profile # spec/cucumber/features/users/create/main.feature:113
     ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
         AssertionError [ERR_ASSERTION]: 404 == '400'
             at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
 12) Scenario: Invalid Profile # spec/cucumber/features/users/create/main.feature:114
     ✖ Then our API should respond with a 400 HTTP status code # spec/cucumber/steps/index.js:206
         AssertionError [ERR_ASSERTION]: 404 == '400'
             at World.equal (/Users/justin/Core/Dev/Pub/hobnob/spec/cucumber/steps/index.js:207:10)
```

</details>

<br>

<details>
<summary>Current Elasticsearch indexes and documents</summary>

```
hobnob
  hobnob.user
    hobnob.user.email
    hobnob.user.password

test
  test.user
    test.user.email
    test.user.password
    test.user.profile
      test.user.profile.bio
      test.user.profile.foo
      test.user.profile.name
        test.user.profile.name.a
        test.user.profile.name.foo
      test.user.profile.summary

.
├── HOBNOB
│   └── USER
│       └── properties
│           ├── EMAIL
│           │   ├── type:text
│           │   └── keyword
│           │       └── type:keyword
│           └── PASSWORD
│               ├── type:text
│               └── keyword
│                   └── type:keyword
└── TEST
    └── USER
        └── properties
            ├── EMAIL
            │   ├── type:text
            │   └── keyword
            │       └── type:keyword
            ├── PASSWORD
            │   ├── type:text
            │   └── keyword
            │       └── type:keyword
            └── PROFILE
                └── properties
                    ├── BIO
                    │   └── type:long
                    ├── FOO
                    │   ├── type:text
                    │   └── keyword
                    │       └── type:keyword
                    ├── NAME
                    │   └── properties
                    │       ├── A
                    │       │   ├── type:text
                    │       │   └── keyword
                    │       │       └── type:keyword
                    │       └── FIRST
                    │           ├── type:text
                    │           └── keyword
                    │               └── type:keyword
                    └── SUMMARY
                        └── type:long
```

</details>

<br>

And there's items in both indexes that shouldn't exist.

<details>
<summary>Index 'test'</summary>

```
curl "http://localhost:9200/test/_search?pretty"
{
  "took" : 8,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 9,
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "3P5rdmsBVWzSnxJzrVl8",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@ma.il",
          "password" : "abc",
          "profile" : {
            "foo" : "bar"
          }
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "IpL6UmsBuYJdXTgp6zwG",
        "_score" : 1.0,
        "_source" : {
          "email" : "a,b,c@!!",
          "password" : "password"
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "3f5rdmsBVWzSnxJzsVlE",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@ma.il",
          "password" : "abc",
          "profile" : {
            "name" : {
              "first" : "Jane",
              "a" : "b"
            }
          }
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "IZL6UmsBuYJdXTgp6zwF",
        "_score" : 1.0,
        "_source" : {
          "email" : "a@1.2.3.4",
          "password" : "password"
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "IJL6UmsBuYJdXTgp6zwE",
        "_score" : 1.0,
        "_source" : {
          "email" : "a238juqy2",
          "password" : "password"
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "3_5rdmsBVWzSnxJzsllP",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@ma.il",
          "password" : "abc",
          "profile" : {
            "bio" : 0
          }
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "I5L6UmsBuYJdXTgp6zwG",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@ma.il",
          "password" : "password"
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "JJL6UmsBuYJdXTgp6zxp",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@mai.il",
          "password" : 10
        }
      },
      {
        "_index" : "test",
        "_type" : "user",
        "_id" : "3v5rdmsBVWzSnxJzsVmh",
        "_score" : 1.0,
        "_source" : {
          "email" : "e@ma.il",
          "password" : "abc",
          "profile" : {
            "summary" : 0
          }
        }
      }
    ]
  }
}
```
</details>

</details>

<br>

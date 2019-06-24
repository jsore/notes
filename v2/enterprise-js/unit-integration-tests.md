# Unit/Integration Tests

- Lower-level testing support that works at the module level
- Ensure modules work as distinct standalone units ( __Unit Tests__ )
- Ensure modules can work together as a logical unit ( __Integration Tests__ )
- Boost confidence in each module we've created
- Make it easier to pinpoint source of errors in failed E2E tests

__Mocha__ will be used for these tests, with __Chai__ for assertion

__Sinon__ library adds support for:

- Recording function calls with __spies__
- Simulate behavior with __stubs__
- Stub out dependencies in unit tests using __dependency injection__, __monkey patching__

__Istanbul/nyc__ to measure test coverage

This all adds up to be a very common __testing stack__

<br>

Install as development dependency
```
$ yarn add mocha --dev
```
This installs an executable to run at
```
node_modules/mocha/bin/mocha
```

<br><br>



--------------------------------------------------------------------------------
### Structure Of Test Files

- Unit tests for a module should go next to the module itself
- a generic `test` directory is for application level integration tests
  + example: for testing integration with extenal resources like databases

```
$ tree
.
├── src
│   └── feature
│       ├── index.js
│       └── index.unit.test.js
└── test
    ├── db.integration.test.js
    └── app.integration.test.js
```
Take note of the extension to indicate a test file

> `*.test.js`

and explicit naming of the type of test that to be ran

> `*.unit.test.js` vs `integration.test.js`

<br><br>



--------------------------------------------------------------------------------
### First Unit Test

`generateValidationErrorMessage`

Its file should be converted into a directory
```
$ cd src/validators/errors
$ mkdir messages
$ mv messages.js messages/index.js
$ touch messages/index.unit.test.js
```

Mocha's installation provides `mocha` command and `describe`, `it` global vars

`describe` lets us group relevant test cases together
`it` defines the actual test case

    import assert from 'assert';
    import generateValidationErrorMessage from '.';

    /**
     * describe: group of relevant test cases, just here to give
     * context to readers, has no influence on test outcome
     */
    describe('generateValidationErrorMessage', function () {
      /**
       * it: test case, holds the assertions, which should all
       * throw AssertionErrors on failure, otherwise Mocha
       * assumes the test passed
       */
      it('should return the correct string when error.keyword is "required"', function () {
        /** dummy errors array, mimics Ajv's errors array */
        const errors = [{
          keyword: 'required',
          dataPath: '.test.path',
          params: {
            missingProperty: 'property',
          },
        }];
        const actualErrorMessage = generateValidationErrorMessage(errors);
        const expectedErrorMessage = "The '.test.path.property' field is missing";
        assert.equal(actualErrorMessage, expectedErrorMessage);
      });
    });

Be sure to add `overrides` for test files in top level `.eslintrc.json`

<br>

Run, but pass __glob__ that matches test files to tell Mocha where to look

    $ npx mocha
    > Warning: Could not find any test files matching pattern: test
    $ npx mocha "src/**/*.test.js"
    > /Users/justin/Core/Dev/Pub/hobnob/src/validators/errors/messages/index.unit.test.js:9
    > import assert from 'assert';
    >        ^^^^^^
    >
    > SyntaxError: Unexpected identifier

Also remember: Babel needs to transpile the code before running

    $ npx mocha "src/**/*.test.js" --require @babel/register
    >
    >  generateValidationErrorMessage
    >    ✓ should return the correct string when error.keyword is "required"
    >
    >
    >  1 passing (15ms)

Or, run the tests as an npm script

    // package.json
    "scripts": {
      ...
      "test:unit": "mocha 'src/**/*.test.js' --require @babel/register",
      ...
      // also update default test script to run all the tests
      // from:
      "test": "echo \"Error: no test specified\" && exit 1",
      // to:
      "test": "yarn run test:unit && yarn run test:e2e",

    $ yarn run test:unit    # run just the unit tests
    $ yarn run test         # run them all

<br><br>



--------------------------------------------------------------------------------
### Spies To Assert Function Calls

A spy is a function that records info about every call made to it.

__Sinon__ is the def facto spy library

Used together with `beforeEach`, a global-scoped Mocha-injected function:

    $ yarn add sinon --dev

  ```javascript
  // src/middlewares/check-empty-payload/index.unit.test.js
  import assert from 'assert';
  import deepClone from 'lodash.clonedeep';
  import deepEqual from 'lodash.isequal';
  import checkEmptyPayload from '.';
  import { spy } from 'sinon';  // "named export" from sinon package
  describe('checkEmptyPayload', function () {
    let req;
    let res;
    let next;
    /**
     * POST, PATCH, PUT requests should always carry a
     * non-empty payload, if request is a GET res shouldn't be
     * modified and next() should be invoked once
     */
    describe('When req.method is not one of POST, PATCH or PUT', function () {
      /** check res before and after checkEmptyPayload call */
      let clonedRes;
      /** runs before each it() block */
      beforeEach(function () {
        req = { method: 'GET' };
        res = {};
        /** assign next() a new spy for func call recording */
        next = spy();
        clonedRes = deepClone(res);
        checkEmptyPayload(req, res, next);
      });
      ...
      it('should call next() once', function () {
        /** check calledOnce property on spy for truthfullness */
        assert(next.calledOnce);
      });
      ...
  ```

<br><br>



--------------------------------------------------------------------------------
### Stubs To Simulate Behavior

We need to make sure middleware returns output of `res.json()`

For testing, we don't care about the content of `res.json` , just that its
returned faithfully

In Sinon, stubs are an extension of spies

<br><br>



--------------------------------------------------------------------------------
### File Structure Refactoring

So that unit tests can lay side-by-side to the module its testing.

Example of new structure:

    ...
    ├── middlewares
    │   ├── check-content-type-is-json
    │   │   ├── index.js                <-- module being tested
    │   │   └── index.unit.test.js      <-- the unit tests
    │   ├── check-content-type-is-set
    │   │   ├── index.js
    │   │   └── index.unit.test.js
    │   ...
    ...
    └── validators
        ├── errors
        │   ├── messages
        │   │   ├── index.js
        │   │   └── index.unit.test.js
        │   └── validation-error
        │       ├── index.js
        │       └── index.unit.test.js
        ...

All code files need to be updated to use this format, paths needs to be updated
in the code. Here's the updated project structure with unit tests created and
completed for each supportive module, including refactoring for the dependency
injection method that will be used moving forward:

    hobnob/src: $ tree
    .
    ├── engines
    │   └── users
    │       └── create
    │           ├── index.js
    │           └── index.unit.test.js
    ├── handlers
    │   └── users
    │       └── create
    │           ├── index.js
    │           └── index.unit.test.js
    ├── middlewares
    │   ├── check-content-type-is-json
    │   │   ├── index.js
    │   │   └── index.unit.test.js
    │   ├── check-content-type-is-set
    │   │   ├── index.js
    │   │   └── index.unit.test.js
    │   ├── check-empty-payload
    │   │   ├── index.js
    │   │   └── index.unit.test.js
    │   └── error-handler
    │       ├── index.js
    │       └── index.unit.test.js
    ├── schema
    │   └── users
    │       ├── create.json
    │       └── profile.json
    ├── utils
    │   └── inject-handler-dependencies.js
    ├── validators
    │   ├── errors
    │   │   ├── messages
    │   │   │   ├── index.js
    │   │   │   └── index.unit.test.js
    │   │   └── validation-error
    │   │       ├── index.js
    │   │       └── index.unit.test.js
    │   └── users
    │       └── create.js
    └── index.js


<br><br>



--------------------------------------------------------------------------------
### Use Stubs Not Module Dependencies

When writing unit tests, be sure to only test the relevant unit.

For example, `createUser` in `src/handlers/users/create/index.js` relies on the
`create` function. This means the result of our tests would also rely on the
`create` function. If we were to use this dependency plainly, the test would
no longer be a unit test, it'd be an integration test.

Get around dependency requirements with dependency injection.

( Monkey Patching is an alternative, but is harder to implement correctly ).

<br>


Dependency injection, how to go about actually replacing dependency usage?
  > Every dependency should be a parameter of the function.

So, remove the dependency's `import` statements, import them all into the API
entrypoint `src/index.js`

  ```javascript
  ...
  /** dependency injection */
  import injectHandlerDependencies from './utils/inject-handler-dependencies';
  /** ./handlers/.../index.createUser() dependency */
  /** ./engines/.../index.create() dependency */
  import ValidationError from './validators/errors/validation-error';
  /** users/createUser() handler for app.post() */
  import createUserHandler from './handlers/users/create';
  /** users/create() engine for handler.createUesr() */
  import createUserEngine from './engines/users/create';
  /** ./handlers/.../index.createUser() dependency, sent to engine via create() */
  import createUserValidator from './validators/users/create'; // create.js
  ...
  ```

Map the handlers to the engine and the validator so they can communicate

  ```javascript
  ...
  const handlerToEngineMap = new Map([
    [createUserHandler, createUserEngine],
  ]);
  const handlerToValidatorMap = new Map([
    [createUserHandler, createUserValidator],
  ]);
  ...
  ```

Then inject them all when invoking the /user/ POST handler

  ```javascript
  ...
  app.post('/users', injectHandlerDependencies(
    createUserHandler,        // <-- POST handler
    client,                   // <-- ES DB pointer
    handlerToEngineMap,       // <-- handler will call to the engine
    handlerToValidatorMap,    // <-- handler will pass validator to engine to use
    ValidationError           // <-- general error message dependency
  ));
  ...
  ```

The `injectHandlerDependencies` function is a high order function for operating
on functions:

  ```javascript
  // src/utils/inject-handler-dependencies.js

  /**
   * this is the thing doing the actual invocation of the
   * create user handler
   */

  function injectHandlerDependencies(
    handler,
    db,
    handlerToEngineMap,
    handlerToValidatorMap,
    ValidationError
  ) {
    const engine = handlerToEngineMap.get(handler);
    const validator = handlerToValidatorMap.get(handler);
    /** refactor: following the dependency inject pattern */
    // return (req, res) => { handler(req, res, db); };  // <-- from when import's were used
    return (req, res) => { handler(req, res, db, engine, validator, ValidationError); };
  }
  export default injectHandlerDependencies;
  ```

This gives the handler access to the injected dependencies, which it can then
pass along. Meaning, in the handler, we haven't lost access to the previously
imported dependencies

  ```javascript
  // src/handlers/users/create/index.js

  /** Note: NO IMPORT STATEMENTS */

  function createUser(req, res, db, create, validator, ValidationError) {
    /**
     * create engine and ValidationError class get injected
     * into this handler from
     * src/index.js & injectHandlerDependencies()
     */

    /** call to the engine should be a Promise */
    return create(req, db, validator, ValidationError)
      .then(onPromiseFulfilled, onPromiseRejected)
      .catch( /** handle codebase error */ );
    ...
  ```

All of our dependencies are available all the way down the chain

  ```javascript
  // src/engines/users/create/index.js

  /**
   * validate the request and write the user document to the
   * database, returns result back to request handler
   */
  function create(req, db, validator, ValidationError) {

    /** remember, dependency access has changed... */
    // const validationResults = validate(req); // <-- ReferenceError
    const validationResults = validator(req);
    if (validationResults instanceof ValidationError) {
      return Promise.reject(validationResults);
    }

    /**
     * operate on the request ( try to index the supplied user
     * document ) and return the result
     */
    return db.index({ ... });
  ```

Now, we can use stubs to mimic the abilities of our dependencies in unit tests

  ```javascript
  // src/engines/users/create/index.unit.test.js
  // the unit test for my create user engine

  import assert from 'assert';
  import { stub } from 'sinon';
  import ValidationError from '../../../validators/errors/validation-error';
  import create from '.';

  describe('User Create Engine', function () {
    let req;
    let db;
    let validator;
    const dbIndexResult = {};
    beforeEach(function () {
      req = {};
      db = {
        index: stub().resolves(dbIndexResult),
      };
    });
    describe('When invoked and validator returns with undefined', function () {
      let promise;
      beforeEach(function () {
        validator = stub().returns(undefined);
        promise = create(req, db, validator, ValidationError);
        return promise;
      });
      describe('should call the validator', function () {
        it('once', function () {
          assert(validator.calledOnce);
        });
        it('with req as the only argument', function () {
          assert(validator.calledWithExactly(req));
        });
      });
      it('should relay the promise returned by db.index()', function () {
        promise.then(res => assert.strictEqual(res, dbIndexResult));
      });
    });

    describe('When validator returns with an instance of ValidationError', function () {
      it('should reject with the ValidationError returned from validator', function () {
        const validationError = new ValidationError();
        validator = stub().returns(validationError);
        return create(req, db, validator, ValidationError)
          .catch(err => assert.strictEqual(err, validationError));
      });
    });
  });
  ```

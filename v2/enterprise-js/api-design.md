# API Design

Will be adding functionality to the user directory application:

  - retrieve users
  - edit users
  - delete users
  - search for users

<br><br>



--------------------------------------------------------------------------------
### API Design Principle: What is __REST__?

A set of _architectual styles_ that dictate the manners and patterns for
constructing the API, a generic set of patterns that can be applied to any API.
It does NOT impose low-level implementation details.

<br>

1. __Client-server__ requirement:

_Defines a clear separation of concerns between client and server._

The client provides the interface, the server provides the data.

<br>

2. __Stateless__ requirement:

_No transient info about the client should be held on the server._

The server should not persist client sessions, this must be done on the client.
Any requests that arrive at the server must contain all the info required to
process that request. Servers can still persist _resource state_ inside DB's,
but servers should not store temporary _application state_ in memory.

This constraint has a main drawback: clients must repeatedly send authentication
information ( __JSON Web Token, JWT__ ) with each request, which increases the
bandwidth being used.

<br>

3. __Cacheable__ requirement:

_Repeatable responses should be cached by the client and/or any intermediaries._

Response messages must include indication of whether the response should be
cached and for how long. This is beneficial as it helps reduce bandwidth and
reduces server load, freeing it up to service more requests.

<br>

4. __Layered System__ requirement:

_The client should not have to care about the implementation of the server._

Example: Node application that is reverse proxied by a web server ( __NGINX__ ).
A request passes through layers consisting of web server(s), load balancers
( __HAProxy__ ) and a caching server ( __Varnish__ ) before reaching the app.

<br>

5. __Code On Demand__ requirement ( optional extension of client-server constraint ):

_Allows the server to return non-server-specific code for the client to execute._

<br>

6. __Uniform Interface__ requirement:

_Adherence to the same interface between clients and server to exchange information._


<br><br>



--------------------------------------------------------------------------------
### API Design Principle: Be __Consistent__

The client should be able to expect the API to reply with a specific type of
response for specific request types.

<br>

1. __Common Consistency__: _Being consistent with the world_

Conform to well-established or authoritative standards. If there are none, stick
with community consensus. API usage deterence can likely happen if developers
are forced to learn a new way of thinking because the API isn't consistent with
the world.

Example: For an HTTP API, use `HTTP/1.1` specification ( sanctioned by W3C, the
standards organization for the web )

__HTTP Specification__: Responses must have a status code to let programs
determine the response's nature.

  ```
  .-----------------------------------------------------------------------------------------------.
  | Code | Response Class | Description                                                           |
  |-----------------------------------------------------------------------------------------------|
  | 1xx  | Informational  | Request received but not yet fully processed, no client action needed |
  |------|----------------|-----------------------------------------------------------------------|
  | 2xx  | Success        | Request successfully received, understood and accepted                |
  |------|----------------|-----------------------------------------------------------------------|
  | 3xx  | Redirection    | Resource has moved, client needs to take further actions on request   |
  |------|----------------|-----------------------------------------------------------------------|
  | 4xx  | Client Error   | Request syntactically/semantically bad, server refused to process it  |
  |------|----------------|-----------------------------------------------------------------------|
  | 5xx  | Server Error   | Request likely valid but there was an error on the server             |
  '-----------------------------------------------------------------------------------------------'
  ```

Common status codes the API will be restricted to using:

  ```
  .---------------------------------------------------------------------------------------------------.
  | Code | Code Msg     | Description                                                                 |
  |---------------------------------------------------------------------------------------------------|
  | 200  | OK           | Generic successful operation                                                |
  |------|--------------|-----------------------------------------------------------------------------|
  | 201  | Created      | Successful operation where a resource is created                            |
  |------|--------------|-----------------------------------------------------------------------------|
  | 400  | Bad Request  | Request syntatically or semantically incorrect                              |
  |------|--------------|-----------------------------------------------------------------------------|
  | 401  | Unauthorized | Request w/o auth creds, sender is unkown to server, client action needed    |
  |------|--------------|-----------------------------------------------------------------------------|
  | 403  | Forbidden    | Server understands the request but does not authorize it                    |
  |------|--------------|-----------------------------------------------------------------------------|
  | 404  | Not Found    | Resource is not found or endpoint path invalid                              |
  |------|--------------|-----------------------------------------------------------------------------|
  | 409  | Conflict     | Resource was modified after client last retrieved it, new version available |
  |------|--------------|-----------------------------------------------------------------------------|
  | 415  | Unsupported  | Payload for endpoint is in an unsupported format                            |
  |      | Media Type   |                                                                             |
  '---------------------------------------------------------------------------------------------------'
  ```

__HTTP Specification__: Requests must contain a verb

  ```
  .-----------------------------------------------------------------------------------------.
  | Method | Action To Take                                      | Method Concepts          |
  |-----------------------------------------------------------------------------------------|
  | GET    | Retrieve a representation of a resource             | Safe and Idempotent      |
  |--------|-----------------------------------------------------|--------------------------|
  | POST   | Create new resources and sub-resources              | Not Safe, not Idempotent |
  |--------|-----------------------------------------------------|--------------------------|
  | PUT    | Update existing resources                           | Idempotent but not Safe  |
  |--------|-----------------------------------------------------|--------------------------|
  | PATCH  | Update existing resources, only the fields supplied | Not Safe, not Idempotent |
  |--------|-----------------------------------------------------|--------------------------|
  | DELETE | Delete existing resources                           | Idempotent but not Safe  |
  '-----------------------------------------------------------------------------------------'

  * Safe methods won't modify a resource's representation
  * Idempotent methods can be repeated but produces as if there was only one request sent
  ```

API paths should be structured for a consistent URL: `/<collection>/<id>`

The collection should be a plural noun denoting a class of resources, the id is
the identifier for a particular resource within that collection.

  ```
  .------------------------------------------------------------------------------------------------.
  | Resource    | GET               | POST        | PUT         | PATCH          | DELETE          |
  |------------------------------------------------------------------------------------------------|
  | /users      | Get list of users | Create user | Error       | Error          | Error           |
  |-------------|-------------------|-------------|-------------|----------------|-----------------|
  | /users/<id> | Get single user   | Error       | Full update | Partial update | Delete user Obj |
  '------------------------------------------------------------------------------------------------'
  ```

<br>


2. __Local Consistency__: _Being consistent within the same API_

API behaviors and conventions are the same across all of its parts.

  - kebab-case for URLs
  - camelCase for paramters within the query string
  - structure nested resources with `/resource/id/sub-resource/id`
  - for non-CRUD endpoints, URL should be `/verb-noun` ( `/search-articles` )
  - consistent data exchange formats, ex: don't use JSON on one endpoint and XML elsewhere
  - every error payload follows same format for easier err message processing

<br>

3. __Transversal Consistency__: _Being consistent across APIs by the same organization_

Similar to local consistency.

<br>

4. __Domain Consistency__: _Being consistent within a specific domain_

Structure API's to follow norms specific to what's being used by other services
of the same type.

<br>

5. __Perennial Consistency__: _Being consistent across time_

API structure should stay the same for a long time, but not forever. Avoid
breaking changes in the API, use a data structure that can be compatible with
all versions of the API. URL's should be future-proofed

<br><br>



--------------------------------------------------------------------------------
### API Design Principle: Be __Intuitive__

The API should be self explanatory and as obvious as possible. Users don't want
to learn new behaviors.

Follow the __Principle of Least Astonishment, POLA__: the result of performing
some operation should be obvious, consistent, and predictable, based upon the
name of the operation and other clues.

Related endpoints should be grouped, endpoint functionality should be obvious

<br><br>



--------------------------------------------------------------------------------
### API Design Principle: Be __Simple__

APIs should abstract the implementation details away from the end user.

Don't expose internal functions to the user, this adds unnecessary complexity.

<br><br>



--------------------------------------------------------------------------------
### Completing The API

- All request data must be transmitted in JSON
- All response data payloads must be in JSON or plain text

<br>

- [x] E2E tests
  - [x] features
  - [x] steps
- [ ] Delete User
  > - User must provide a user ID to delete
- [ ] Search Users
  > - Defaults to the last 10 users who've registered
- [x] Create User
  > - User must provide email address and password
  > - User may optionally provide a profile, otherwise create empty profile
- [ ] Retrieve User
  > - Return profile of user specified when a user ID is provided
- [ ] Update User
  > - When user provides user ID and complete user object, replace old user object with it
  > - When user provides user ID and a partial user object, merge the partial into existing object
- [ ] Unit tests
- [ ] Integration tests

Things to install or implement as I come across them

- [x] jsonfile
  `spec/cucumber/steps/index.js`

- [x] objectPath
  `spec/cucumber/steps/index.js`

- [x] processPath ( custom )
  `spec/cucumber/steps/index.js`

- [x] Chance
  `spec/cucumber/steps/preparation.js`

<br>


__1. E2E tests__ ( Remember: TDD )

  ```
  ├── spec
  │   └── cucumber
  │       ├── features
  │       │   ├── main.feature               [X]
  │       │   ├── profile
  │       │   │   ├── replace
  │       │   │   │   └── main.feature       [X]
  │       │   │   └── update
  │       │   │       └── main.feature       [X]
  │       │   └── users
  │       │       ├── create
  │       │       │   └── main.feature       [X]
  │       │       ├── delete
  │       │       │   └── main.feature       [X]
  │       │       ├── retrieve
  │       │       │   └── main.feature       [X]
  │       │       └── search
  │       │           └── main.feature       [X]
  │       ├── sample-data
  │       │   └── javascript-experts.json    [X]
  │       └── steps
  │           ├── preparation.js             [?]
  │           ├── cleanup.js                 [?]
  │           ├── request.js                 [?]
  │           ├── response.js                [?]
  │           ├── index.js                   [-] commented out
  │           ├── profile.js                 [-] commented out
  │           └── utils.js                   [X]

  64 scenarios (30 failed, 8 undefined, 26 passed)
  553 steps (30 failed, 9 undefined, 77 skipped, 437 passed)
  ```

<br>


__2. Implementation & implementation tests__

  ```
  └── src
      ├── index.js                                 [ ]
      ├── engines                                      ENGINES
      │   ├── profile                                  ENGINES -> PROFILE
      │   │   ├── replace                              ENGINES -> PROFILE -> REPLACE
      │   │   │   ├── index.js                     [ ]
      │   │   │   ├── index.integration.test.js    [ ]
      │   │   │   └── index.unit.test.js           [ ]
      │   │   └── update                               ENGINES -> PROFILE -> UPDATE
      │   │       ├── index.js                     [ ]
      │   │       ├── index.integration.test.js    [ ]
      │   │       └── index.unit.test.js           [ ]
      │   └── users                                    ENGINES -> USERS
      │       ├── create                               ENGINES -> USERS -> CREATE
      │       │   ├── index.js                     [X]
      │       │   ├── index.integration.test.js    [X]
      │       │   └── index.unit.test.js           [X]
      │       ├── delete                               ENGINES -> USERS -> DELETE
      │       │   ├── index.js                     [ ]
      │       │   ├── index.integration.test.js    [ ]
      │       │   └── index.unit.test.js           [ ]
      │       ├── retrieve                             ENGINES -> USERS -> RETRIEVE
      │       │   ├── index.js                     [X]
      │       │   ├── index.integration.test.js    [ ]
      │       │   └── index.unit.test.js           [X]
      │       └── search                               ENGINES -> USERS -> SEARCH
      │           ├── index.js                     [ ]
      │           ├── index.integration.test.js    [ ]
      │           └── index.unit.test.js           [ ]
      ├── handlers                                     HANDLERS
      │   ├── index.js                             [-]
      │   ├── profile                                  HANDLERS -> PROFILE
      │   │   ├── index.js                         [-]
      │   │   ├── replace                              HANDLERS -> PROFILE -> REPLACE
      │   │   │   ├── index.js                     [ ]
      │   │   │   └── index.unit.test.js           [ ]
      │   │   └── update                               HANDLERS -> PROFILE -> UPDATE
      │   │       ├── index.js                     [ ]
      │   │       └── index.unit.test.js           [ ]
      │   └── users                                    HANDLERS -> USERS
      │       ├── index.js                         [-]
      │       ├── create                               HANDLERS -> USERS -> CREATE
      │       │   ├── index.js                     [X]
      │       │   └── index.unit.test.js           [X]
      │       ├── delete                               HANDLERS -> USERS -> DELETE
      │       │   ├── index.js                     [ ]
      │       │   └── index.unit.test.js           [ ]
      │       ├── retrieve                             HANDLERS -> USERS -> RETRIEVE
      │       │   ├── index.js                     [X]
      │       │   └── index.unit.test.js           [X]
      │       └── search                               HANDLERS -> USERS -> SEARCH
      │           ├── index.js                     [ ]
      │           └── index.unit.test.js           [ ]
      ├── middlewares                                  MIDDLEWARES
      │   ├── index.js                             [-] doesn't actually exist in project src
      │   ├── check-content-length                     MIDDLEWARES -> CHECK-CONTENT-LENGTH
      │   │   ├── index.js                         [X]
      │   │   └── index.unit.test.js               [X]
      │   ├── check-content-type                       MIDDLEWARES -> CHECK-CONTENT-TYPE
      │   │   ├── index.js                         [X]
      │   │   └── index.unit.test.js               [X]
      │   └── error-handler                            MIDDLEWARES -> ERROR-HANDLER
      │       ├── index.js                         [X]
      │       └── index.unit.test.js               [X]
      ├── schema                                       SCHEMA
      │   └── users                                    SCHAME -> USERS
      │       ├── create.json                      [X]
      │       ├── profile.json                     [X]
      │       └── search.json                      [X]
      ...                                          [ ]
      └── validators                                   VALIDATORS
          ├── errors                                   VALIDATORS -> ERRORS
          │   ├── messages                             VALIDATORS -> ERRORS -> MESSAGES
          │   │   ├── index.js                     [X]
          │   │   └── index.unit.test.js           [X]
          │   └── validation-error                     VALIDATORS -> ERRORS -> VALIDATION-ERROR
          │       ├── index.js                     [X]
          │       └── index.unit.test.js           [X]
          ├── profile                                  VALIDATORS -> PROFILE
          │   ├── replace.js                       [ ]
          │   └── update.js                        [ ]
          └── users                                    VALIDATORS -> USERS
              ├── create.js                        [X]
              └── search.js                        [ ]
  ```

<br>


__3. Integration tests & supportive functions__

  ```
  .
  ├── .env.example                        [ ]
  ├── package.json                        [ ]
  ├── scripts
  │   └── e2e.test.sh                     [ ]
  └── src
      ...
      ├── tests
      │   ├── spies
      │   │   └── res
      │   │       └── index.js            [X]
      │   └── stubs
      │       ├── elasticsearch
      │       │   ├── client
      │       │   │   ├── delete
      │       │   │   │   └── index.js    [ ]
      │       │   │   ├── get
      │       │   │   │   └── index.js    [X]
      │       │   │   ├── index
      │       │   │   │   └── index.js    [X]
      │       │   │   ├── search
      │       │   │   │   └── index.js    [ ]
      │       │   │   └── update
      │       │   │       └── index.js    [ ]
      │       │   └── errors
      │       │       └── not-found
      │       │           └── index.js    [X]
      │       ├── engines
      │       │   ├── profile
      │       │   │   ├── replace
      │       │   │   │   └── index.js    [ ]
      │       │   │   └── update
      │       │   │       └── index.js    [ ]
      │       │   └── users
      │       │       ├── create
      │       │       │   └── index.js    [X]
      │       │       ├── delete
      │       │       │   └── index.js    [ ]
      │       │       ├── retrieve
      │       │       │   └── index.js    [X]
      │       │       └── search
      │       │           └── index.js    [ ]
      │       └── validate
      │           └── index.js            [X]
      ...
  ```

<br>


__Current Structure `vs` Book Structure__

`$ tree -a -I 'node_modules|coverage|dist*|.git*|.nvmrc|.nyc_output|yarn*|*txt|*lock.json'`

  ```
  ~/Core/Dev/Pub/hobnob                          ...Pub/hobnob-book-source/hobnob/Chapter06
  .                                              .
  ├── package.json                               ├── package.json
  …                                              ├── .env.example
  ├── scripts                                    ├── scripts
  │   └── e2e.test.sh                            │   └── e2e.test.sh
  ├── spec                                       ├── spec
  │   └── cucumber                               │   └── cucumber
  │       ├── features                           │       ├── features
  │       │   ├── main.feature                   │       │   ├── main.feature
  │       │   └── users                          │       │   └── users
  │       │       └── create                     │       │       ├── create
  │       │       …   └── main.feature           │       │       │   └── main.feature
  …       …       …                              │       │       ├── delete
  …       …       …   …                          │       │       │   └── main.feature
  …       …       …                              │       │       ├── retrieve
  …       …       …   …                          │       │       │   └── main.feature
  …       …       …                              │       │       └── search
  …       …           …                          │       │           └── main.feature
  │       └── steps                              │       └── steps
  │           ├── index.js                       │           ├── index.js
  …           …                                  │           ├── profile.js
  │           └── utils.js                       │           └── utils.js
  └── src                                        └── src
      ├── index.js                                   ├── index.js
      ├── engines                                    ├── engines
      …   …                                          │   ├── profile
      …   …   …                                      │   │   ├── replace
      …   …   …   …                                  │   │   │   ├── index.integration.test.js
      …   …   …   …                                  │   │   │   ├── index.js
      …   …   …   …                                  │   │   │   └── index.unit.test.js
      …   …   …                                      │   │   └── update
      …   …       …                                  │   │       ├── index.integration.test.js
      …   …       …                                  │   │       ├── index.js
      …   …       …                                  │   │       └── index.unit.test.js
      │   └── users                                  │   └── users
      │       └── create                             │       ├── create
      │       …   ├── index.js                       │       │   ├── index.js
      │       …   ├── index.integration.test.js      │       │   ├── index.integration.test.js
      │       …   └── index.unit.test.js             │       │   └── index.unit.test.js
      …       …                                      │       ├── delete
      …       …   …                                  │       │   ├── index.js
      …       …   …                                  │       │   ├── index.integration.test.js
      …       …   …                                  │       │   └── index.unit.test.js
      …       …                                      │       ├── retrieve
      …       …   …                                  │       │   ├── index.js
      …       …   …                                  │       │   ├── index.integration.test.js
      …       …   …                                  │       │   └── index.unit.test.js
      …       …                                      │       └── search
      …           …                                  │           ├── index.js
      …           …                                  │           ├── index.integration.test.js
      …           …                                  │           └── index.unit.test.js
      ├── handlers                                   ├── handlers
      …   …                                          │   ├── index.js
      …   …                                          │   ├── profile
      …   …   …                                      │   │   ├── index.js
      …   …   …                                      │   │   ├── replace
      …   …   …   …                                  │   │   │   ├── index.js
      …   …   …   …                                  │   │   │   └── index.unit.test.js
      …   …   …                                      │   │   └── update
      …   …       …                                  │   │       ├── index.js
      …   …       …                                  │   │       └── index.unit.test.js
      │   └── users                                  │   └── users
      …       …                                      │       ├── index.js
      │       └── create                             │       ├── create
      │       …   ├── index.js                       │       │   ├── index.js
      │       …   └── index.unit.test.js             │       │   └── index.unit.test.js
      …       …                                      │       ├── delete
      …       …   …                                  │       │   ├── index.js
      …       …   …                                  │       │   └── index.unit.test.js
      …       …                                      │       ├── retrieve
      …       …   …                                  │       │   ├── index.js
      …       …   …                                  │       │   └── index.unit.test.js
      …       …                                      │       └── search
      …           …                                  │           ├── index.js
      …           …                                  │           └── index.unit.test.js
      ├── middlewares                                ├── middlewares
      …   …                                          │   ├── index.js
      │   ├── check-content-type-is-json             │   ├── check-content-length
      │   │   ├── index.js                           │   │   ├── index.js
      │   │   └── index.unit.test.js                 │   │   └── index.unit.test.js
      │   ├── check-content-type-is-set              │   ├── check-content-type
      │   │   ├── index.js                           │   │   ├── index.js
      │   │   └── index.unit.test.js                 │   │   └── index.unit.test.js
      │   ├── check-empty-payload                    │   └── error-handler
      │   │   ├── index.js                           │       ├── index.js
      │   │   └── index.unit.test.js                 │       └── index.unit.test.js
      │   └── error-handler                          …
      │       ├── index.js                           …
      │       └── index.unit.test.js                 …
      ├── schema                                     ├── schema
      │   └── users                                  │   └── users
      │       ├── create.json                        │       ├── create.json
      │       └── profile.json                       │       ├── profile.json
      …       …                                      │       └── search.json
      ├── tests                                      ├── tests
      │   ├── spies                                  │   ├── spies
      │   │   └── res                                │   │   └── res
      │   │       └── index.js                       │   │       └── index.js
      │   └── stubs                                  │   └── stubs
      …       …                                      │       ├── elasticsearch
      …       …   …                                  │       │   ├── client
      …       …   …   …                              │       │   │   ├── delete
      …       …   …   …   …                          │       │   │   │   └── index.js
      …       …   …   …                              │       │   │   ├── get
      …       …   …   …   …                          │       │   │   │   └── index.js
      …       …   …   …                              │       │   │   ├── index
      …       …   …   …   …                          │       │   │   │   └── index.js
      …       …   …   …                              │       │   │   ├── search
      …       …   …   …   …                          │       │   │   │   └── index.js
      …       …   …   …                              │       │   │   └── update
      …       …   …       …                          │       │   │       └── index.js
      …       …   …                                  │       │   └── errors
      …       …       …                              │       │       └── not-found
      …       …           …                          │       │           └── index.js
      │       └── engines                            │       ├── engines
      …       …   …                                  │       │   ├── profile
      …       …   …   …                              │       │   │   ├── replace
      …       …   …   …   …                          │       │   │   │   └── index.js
      …       …   …   …                              │       │   │   └── update
      …       …   …       …                          │       │   │       └── index.js
      │       …   └── users                          │       │   └── users
      │       …       └── create                     │       │       ├── create
      │       …       …   └── index.js               │       │       │   └── index.js
      …       …       …                              │       │       ├── delete
      …       …       …   …                          │       │       │   └── index.js
      …       …       …                              │       │       ├── retrieve
      …       …       …   …                          │       │       │   └── index.js
      …       …       …                              │       │       └── search
      …       …           …                          │       │           └── index.js
      …       …                                      │       └── validate
      …           …                                  │           └── index.js
      ├── utils                                      …       …
      │   └── inject-handler-dependencies.js         …            …
      └── validators                                 └── validators
          ├── errors                                     ├── errors
          │   ├── messages                               │   ├── messages
          │   │   ├── index.js                           │   │   ├── index.js
          │   │   └── index.unit.test.js                 │   │   └── index.unit.test.js
          │   └── validation-error                       │   └── validation-error
          │       ├── index.js                           │       ├── index.js
          │       └── index.unit.test.js                 │       └── index.unit.test.js
          …   …                                          ├── profile
          …   …   …                                      │   ├── replace.js
          …       …                                      │   └── update.js
          └── users                                      └── users
          …   └── create.js                                  ├── create.js
          …       …                                          └── search.js

  35 directories, 39 files                       69 directories, 82 files
  ```

<br>


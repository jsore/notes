# End To End Testing

__Pre-summary__

Using a TDD approach, develop backend API for a client CRUD app off an Elasticsearch DB.

- Types of tests
- Implement TDD workflow __Red-Green-Refactor__ cycle
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

Separate the platform into multiple features each having defined scenarios to test for.

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
# The Development Environment

- Node overview
- JS modules overview
- `npm` vs `yarn`
- Transpiling with Babel
- `nodemon` for project file changes
- Linting with ESLint

<br><br>



--------------------------------------------------------------------------------
### Module Standards

<strong>CommonJS</strong>: The format NodeJS modules are written.

- provides two global objects for module encapsulation: `require` and `exports`
- `require` uses a module's `exports`
- Node invokes a wrapper around a module's code, only exported objects are
accessible outside the module

<br>

Module formats were standardized by ECMA in <strong>ECMAScript 2015</strong>
( ES6 ), which uses keywords `import` and `export` instead of CommonJS's keywords

<br>

<strong>Babel</strong> is the de facto ES6 >> CommonJS transpiler

<br><br>



--------------------------------------------------------------------------------
### Yarn Package Manager

Main differentiating factor is how dependencies are resolved and downloaded.

Yarn installs packages and saves a copy of it at `~/.yarn-cache` for package
cache'ing

<br><br>



Installing:
```
$ brew install yarn
$ yarn --version
```

_See this for `PATH` problems:_ https://yarnpkg.com/en/docs/install#mac-stable

<br><br>



Usage:
```
-------------------------------------------------------------------------------------
Yarn            npm CLI               Description
-------------------------------------------------------------------------------------
yarn            npm                   Alias for yarn install
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn install    npm install           Install dependencies in yarn.lock, package.json
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn add        npm install           Install the package, add it to the dependencies
<package>       <package>             list and generates lock files (npm --save)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn remove     npm uninstall         Uninstalls the package
<package>       <package>
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn global     npm install           Installs a package globally
add <package>   <pkg> --global
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn            rm -rf node_modules   Upgrades all packages to the latest version,
upgrade         && npm install        as allowed by package.json version flag
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn            npm init              Initializes the development of a package by
init                                  following a short wizard
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
yarn            -                     Graph to see why a package was downloaded
why                                   ( ex: was it a dependency of a dependency? )
-------------------------------------------------------------------------------------
```

<br><br>



--------------------------------------------------------------------------------
### Babel ES6 Transpiling

<br>

Babel service `@babel/cli`
- transpile source code before runtime
- gives an executable ( `babel` ) for transpiling in terminals
- copies files around
- use `.bashrc` to add plugins for functionality
- `plugins` tell Babel how to transform your code
- `presets` are predefined groups of `plugins`

<br>

Babel service `@babel/polyfill`
- pollyfills for newer un-supported code ( `fetch -> XMLHTTPRequest`, etc )

<br>

Babel service `@babel/register`
- transpile at runtime
- useful for testing, lets you write ESNext inside tests, which is transpiled down
Note: this isn't used in this project

<br>

Babel service `@babel/preset-env`
- gives you the `env` preset, dynamically download Babel plugins based on the
environment's compatibilities

<br><br>



Install & usage:
```
$ yarn add @babel/core --dev        # core logic
$ yarn add @babel/cli --dev         # another development dependency
$ yarn add @babel/polyfill          # non-dev, so prod dependency
$ babel example.js -o compiled.js   # transpile a file
$ babel src -d build                # transpile a directory

$ npx babel index.js -o compiled.js   # allows running binaries locally, same as:
$ ./node_modules/.bin/babel index.js -o compile.js
```

`npx` command builds a compiled version of the file in the same dir, side by side:
```javascript
// index.js
import http from 'http';
const requestHandler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  /** finsih prepping response and send to client */
  res.end('Yo');
}
const server = http.createServer(requestHandler);
server.listen(8080);
```
```javascript
// compile.js
import http from 'http';

const requestHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  /** finsih prepping response and send to client */

  res.end('Yo');
  };

  const server = http.createServer(requestHandler);
  server.listen(8080);
```

<br><br>



Using the `@babel/preset-env` package and updating our `.babelrc` file makes
it even easier to transpile. Install it:
```
$ yarn add @babel/preset-env --dev
```

Now update `.babelrc`:
```
{
  "presets": [
    ["@babel/env", {
      "targets": {
        "node": "current"   // API will only run on Node server, specify that
      }
    }]
  ]
}
```

Then you can run the npx command to build the file and run it, while cleaning up
any possible artificats remaining from any previous builds with
`rm -rf dist/ && npx babel src -d dist`

```
$ npx babel index.js -o compiled.js   # build without separating src/dist
$ node compiled.js                    # open browser, see results

$ rm compiled.js compile.js           # remove old builds
$ mkdir src dist                      # set somewhere to accept our Babel code
$ mv index.js src/                    # move our ES6 code
$ rm -rf dist/ && npx babel src -d dist     # rebuild after accounting for artifacts
$ node dist/index.js                        # browser: yo
```

<br><br>



--------------------------------------------------------------------------------
### Cross Platform Compatibility

Make sure your npm scripts work accross other architectures ( Windows, Linux, etc ).
Example:
```
$ rm -rf dist ...       # fine for Mac & *Nix, but...
$ rd /s /q dist         # ...windows would shit itself
```

The npm package `rimraf` helps  with this:
```
$ yarn add rimraf --dev
```

Then update `build` script: `"build": "rimraf dist && babel src -d dist",`

<br><br>



--------------------------------------------------------------------------------
### Automate Refreshing The Build

Use `nodemon` to watch for changes to your project's files and re-run after a change
```
$ yarn add nodemon --dev
```

Update `scripts`: `"watch": "nodemon -w src --exec yarn run serve"`

Nodemon will now watch for changes to files in `src` then run `yarn run serve`
and restart the server.

Run it with `yarn run watch`, test it by making a small change to `src/index.js`

<br><br>



--------------------------------------------------------------------------------
### Set Up Linting with ESLint

Standardized your styles for readability & to account for another dev's style prefs

Rules for code styles are set in `.eslintrc`. The flag `--init` gives you a
wizard for composing the file, `--fix` automatically fixes violations that can
be done without a human.

<br><br>


Linter of choice: Airbnb JavaScript https://github.com/airbnb/javascript

<br>

Install and configure ( from the book ):
```
$ yarn add eslint --dev
$ npx eslint --init
( select use popular )
( select airbnb )
( select no react )
( select json config )
( select yes install )
( .eslintrc.json created in proj root )
```

<br>

Install and configure ( IRL ):
```
$ npx eslint --init
> ? How would you like to use ESLint? To check syntax, find problems, and enforce code style
> ? What type of modules does your project use? JavaScript modules (import/export)
> ? Which framework does your project use? None of these
> ? Where does your code run? Browser, Node
> ? How would you like to define a style for your project? Use a popular style guide
> ? Which style guide do you want to follow? Airbnb (https://github.com/airbnb/javascript)
> ? What format do you want your config file to be in? JSON
> Checking peerDependencies of eslint-config-airbnb-base@latest
> The config that you've selected requires the following dependencies:
>
> eslint-config-airbnb-base@latest
> ? Would you like to install them now with npm? Yes
> Installing eslint-config-airbnb-base@latest
> internal/modules/cjs/loader.js:584
>     throw err;
>     ^
>
> Error: Cannot find module '../lib/utils/unsupported.js'

.eslintrc.json
{
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
    }
}
```

The additional dependencies didn't install, had to do them manually:
```
$ yarn add eslint-config-airbnb-base@latest
$ yarn add eslint-plugin-import@latest
$ npx eslint src/index.js     # finally runs
> ...
> ✖ 8 problems (7 errors, 1 warning)
>   7 errors and 0 warnings potentially fixable with the `--fix` option.
$ npx eslint --fix src/index.js
```

<br><br>


Optional additions:

 - add the linting script to `package.json.scripts`
 - install the eslint IDE extension for your IDE/text editor
 - force a git commit to fail if linter errors by using a git hook ( `.git/hooks` )
 - __automate the creation of a new hook with `Husky` ( `$ yarn add husky --dev` )__
   + remember to add the `precommit` script to `package.json` that `Husky` watches for

<br><br>



--------------------------------------------------------------------------------
### Setup Git To Finish Project Bootrapping

I made a mistake here, got ahead of the book and started commiting stuff to a
`dev` branch I made. I had no idea this portion of a project was considered
__Bootstrapping__ and shouldnt be considered features....makes sense in hindsight.

Already have a `.gitignore` for `node_modules`.

To remove the other files I don't want Git to track anymore:
```
# keep the file in workind directory but make it fall off Git
$ git rm --cached dist/index.js dist    # can be recreated from src/index.js
```

Then I deleted my existing `dev` branch and just touched or updated files to stage
a commit similar to the book's
```
$ git status
  ( 7 files untracked )
$ git add -A && git commit -m "Initial project setup"
```

<br><br>



--------------------------------------------------------------------------------
### Summary

Beacuse I have a feeling I'll forget eventually...

- barebones HTTP server with `http` module
- Babel to transpile ESNext -> local environment support
- `nodemon` for change watch
- setup ESLint for code management
- pre-commit Git hook to run the linter before commiting

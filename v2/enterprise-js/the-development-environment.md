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


Install and configure:
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
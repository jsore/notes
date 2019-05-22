# The Development Environment

- Node overview
- JS modules overview
- `npm` vs `yarn`
- Transpiling with Babel
- `nodemon` for project file changes
- Linting with ESLint

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

<br>

### Yarn Package Manager

Main differentiating factor is how dependencies are resolved and downloaded.

Yarn installs packages and saves a copy of it at `~/.yarn-cache` for package
cache'ing

<br>

Installing:
```
$ brew install yarn
$ yarn --version
```

See this for `PATH` problems: https://yarnpkg.com/en/docs/install#mac-stable

<br>

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

<br>

### Babel ES6 Transpiling

Pre-Babel:
```javascript
/** hobnob/index.js */
const http = require('http');   // CommonJS syntax
import http from 'http';        // ES6 syntax, SyntaxError: Unexpected token

const requestHandler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  /** finsih prepping response and send to client */
  res.end('Yo');
}
const server = http.createServer(requestHandler);
server.listen(8080);
```

<br>

<strong>Babel service `@babel/cli`</strong>
- transpile source code before runtime
- gives an executable ( `babel` ) for transpiling in terminals
- copies files around
- use `.bashrc` to add plugins for functionality
- `plugins` tell Babel how to transform your code
- `presets` are predefined groups of `plugins`

<strong>Babel service `@babel/polyfill`</strong>
- pollyfills for newer un-supported code ( `fetch -> XMLHTTPRequest`, etc )

<strong>Babel service `@babel/register`</strong>
- transpile at runtime
- useful for testing, lets you write ESNext inside tests, which is transpiled down
Note: this isn't used in this project

<strong>Babel service `@babel/preset-env`</strong>
- gives you the `env` preset, dynamically download Babel plugins based on the
environment's compatibilities

<br>

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

```
// index.js                                            |  // compile.js
//const http = require('http');                        |  //const http = require('http');
import http from 'http';                               |  import http from 'http';
const requestHandler = function (req, res) {           |
  res.writeHead(200, {'Content-Type': 'text/plain'});  |  const requestHandler = function (req, res) {
  /** finsih prepping response and send to client */   |    res.writeHead(200, {
  res.end('Yo');                                       |      'Content-Type': 'text/plain'
}                                                      |    });
const server = http.createServer(requestHandler);      |    /** finsih prepping response and send to client */
server.listen(8080);                                   |
                                                       |    res.end('Yo');
                                                       |  };
                                                       |
                                                       |  const server = http.createServer(requestHandler);
                                                       |  server.listen(8080);
```

Using the `@babel/preset-env` package and updating our `.babelrc` file makes
it even easier to transpile

```
    install it

$ yarn add @babel/preset-env --dev

    now update .babelrc

{
  "presets": [
    ["@babel/env", {
      "targets": {
        "node": "current"   // API will only run on Node server, specify that
      }
    }]
  ]
}

    now, run the npx command to build the file and run it

$ npx babel index.js -o compiled.js
$ node compiled.js    # open browser, see results
```
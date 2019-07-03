# Snippets

Some stuff I might want to use on v2 of my site.

<br>

### Directory walker

```javascript
const fs = require('fs');

/** IIFE version for mapping single directory listing */
//(dir => {
//  /** get all files in a directory listing */
//  fs.readdir(dir, (err, list) => {
//    list.forEach(file => {
//      /** read file metadata to determine file type from file list */
//      fs.stat(path.join(dir, file), (err, stat) => {
//        if (stat.isDirectory()) {
//          /** everything's a file, including directories */
//          return console.log(`Found director: ${file}`);
//        }
//        console.log(`Found file: ${file}`);
//      });
//    });
//  });
//})(".");  // "." is the dir argument of the anon IIFE


/**
 * map directories within directories, returns JSON object
 * reflecting dir hierarchy ( tree ), each leaf a file object
 */
let walk = (dir, done, emitter) => {
  /** create object to publish events when dir or file encountered */
  emitter = emitter || new (require('events').EventEmitter);
  let results = {};
  fs.readdir(dir, (err, list) => {
    let pending = list.length;
    if (err || !pending) {
      return done(err, results);
    }
    list.forEach(file => {
      let dfile = require('path').join(dir, file);
      fs.stat(dfile, (err, stat) => {
        if(stat.isDirectory()) {
          /** broadcast that directory is found... */
          emitter.emit('directory', dfile, stat);
          /** ...recursively step through subdirectories... */
          return walk(dfile, (err, res) => {
            results[file] = res;
            /**
             * this fuckery bothered me a bit
             *
             * decrement pending and evaluate if true
             * fall through to done() if pending not true
             * !--var false until var === 0
             * so, if pending isn't 0, we're not done()
             *
             * https://stackoverflow.com/questions/34323527/what-does-do-in-javascript
             */
            !--pending && done(null, results);
          }, emitter);
        }
        /** ...or broadcast that normal file is found */
        emitter.emit('file', dfile, stat);
        results[file] = stat;
        !--pending && done(null, results);
        return emitter;
      });
    });
  });
};
/**
 * call walk method passing a callback that receives directory
 * graph or error after walk is complete
 */
//walk(".", (err, res) => {
//  console.log(require('util').inspect(res, {depth: null}));
//});
walk("usr/local", (err, res) => {
  console.log(require('util').inspect(res, {depth: null}));
}).on("directory", (path, stat) => {
  /** if a directory event is emitted... */
  console.log(`Directory: ${path} - size: ${stat.size}`);
}).on("file", (path, stat) => {
  console.log(`File: ${path} - size: ${stat.size}`);
});
```

<br>

### Error Class Extension

    ```javascript
    /**
     * hobnob/src/validators/errors/validation-error.js
     *
     * extension of Error object to define a custom error
     */

    class ValidationError extends Error {
      constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ValidationError);
        }
      }
    }

    export default ValidationError;

    ````

<br>


### Checking `Object.dataPath`

```
if (error.dataPath.indexOf('.profile') === 0) {
    return 'The profile provided is invalid.';
  }
```

<br>

### Lodash for deep object cloning and comparison

related: `src/middlewares/check-empty-payload/index.unit.test.js`
```
$ yarn add lodash.isequal lodash.clonedeep --dev
```

<br>

### Str -> Arr, payload generator, processPath

  ```javascript
  /**
   * hobnob/spec/cucumber/steps/utils.js
   *
   * general testing support, generate test payloads
   */

  /**
   * generate a valid Create User payload when called
   */
  function getValidPayload(type) {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
      case 'create user':
        return {
          email: 'e@ma.il',
          password: 'password',
        };
      case 'replace user profile':
        return {
          summary: 'foo'
        };
      case 'update user profile':
        return {
          name: {
            middle: 'd4nyll'
          }
        };
      // //// default:
      // ////   return undefined;
    }
  }

  function convertStringToArray(string) {
    return string
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
  }

  function substitutePath (context, path) {
    /** split the path into parts */
    return path.split('/').map(part => {
      /**
       * if the path starts with a colon, value should be an ID
       * substitute it with the value of the context property
       * of the same name
       */
       if (part.startsWith(':')) {
        const contextPath = part.substr(1);
        return context[contextPath];
       }
       return part;
    }).join('/');
  }

  function processPath (context, path) {
    /** no substitution needed for paths not starting with ':' */
    if (!path.includes(':')) {
      return path;
    }
    return substitutePath(context, path);
  }

  export {
    getValidPayload,
    convertStringToArray,
    processPath,
  };

  ```

<br>

### Ternaries in RegEx

  ```
  Given(/^all documents of type (?:"|')([\w-]+)(?:"|') are deleted$/, function ...
  When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function ...
  ```

<br>

### Easy walk array to delete item

  ```javascript
  // spec/cucumber/steps/index.js

  function (responseProperty, contextProperty, missingFields) {
    if (responseProperty === 'root') {
      responseProperty = '';
    }
    const contextObject = objectPath.get(this, contextProperty);
    const fieldsToDelete = convertStringToArray(missingFields);

    fieldsToDelete.forEach(field => delete contextObject[field]);

    assert.deepEqual( ...
  ```



###  New Hotness vs Old Busted Hotness

https://i.redd.it/mm20olnsjd731.jpg

  ```javascript
  /*===============================================================
  =            'Cause ever since I left the city youuu            =
  ===============================================================*/
  const values = {
    "nDogs": 10,
    "nCats": 20
  };
  console.log("nDogs: " + values["nDogs"]); // 10
  console.log("nDogs: " + values["nCats"]); // 20

  /*===============================================================
  =            Started wearing less and goin' out more            =
  ===============================================================*/
  const keys = ["nDogs", "nCats"];
  const values = [10, 20];
  const getValue = (key) => {
    for (let i = 0; i < keys.length; i++) {
      if (key == keys[i]) {
        return values[i];
      }
    };
  };
  console.log(getValue("nDogs")); // 10
  console.log(getValue("nCats")); // 20

  ```

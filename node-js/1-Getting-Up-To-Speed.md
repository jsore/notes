# Part 1 - Getting Up To Speed With Node.js


> Note: any files quoted here can be found in the project-files directory
>
> https://github.com/jsore/notes/tree/master/node-js/project-files/file-changes


- CLI Node.js code
- Microservices
- Proper code structure (module-based structures)
- Using 3rd party NPM modules
- ECMAScript updates


<br><br>


<hr>

#### JS spectrum and where Node fits within it
```javascript
/**
 * |- - - - - - - - - - - - - - - - - - - - JS - - - - - - - - - - - - - - - - - - -|
 *                              |- - - - - Node - - - - -|
 *  <------------------------------------------------------------------------------->
 *       DB's                    Middleware      Robotics       User interaction
 *       Doc stores              APIs            Drones         Animation
 *       Data serialization      Web Services    IOT            Dynamic content
 */
```


<br><br>


<hr>

#### Event-driven programming with nonblocking APIs & Node's single-threaded event loop
Using this simple function...
```javascript
console.log('Starting app');
setTimeout(() => {
    console.log('2 second timeout callback');
}, 2000);
setTimeout(() => {
    console.log('0 second timeout callback');
}, 0);
console.log('Finishing app');
```
I'll explain what's happening in Node while a program runs.

<br>

<b>TODO: make each explaination block smaller, chunk out the 'call stack' areas per section?</b>


<br>


1. What's happening?
```javascript
/**
 * 4 items of note at play here:
 * -- Call Stack
 * -- Node APIs
 * -- Callback Queue
 * -- Event Loop
 */

/**
 * The Call Stack can only run one thing at a time. But there can be other
 *   events waiting to get processed while the Call Stack executes.
 */
```


<br>


2. First statement
```javascript
console.log('Starting app');
/**
 * We run the first c.log statement: it gets added onto the Call Stack, on
 *   top of main() - the V8 wrapper function - it finishes running, then the
 *   Call Stack removes it after its done
 *
 *   --- Call Stack ---
 *   console.log('..')
 *   main()
 */
```


<br>


3. Second statement
```javascript
setTimeout(() => {
    console.log('2 second timeout callback');
}, 2000);
/**
 * The 1st setTimeout() is called and added to the Call Stack.
 *
 *   --- Call Stack ---
 *   setTimeout(2sec)
 *   main()
 *
 *
 * setTimeout() is a node API. When the function is called, the event/callback
 *   pair is registered in the Node APIs. The event is to wait the specified
 *   amount of time, the callback is the function we provided in arg[0]
 *
 *
 * The Call Stack executes the setTimeout, registering with the Node APIs, and
 *   removes that call from the stack
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   main()                setTimeout(2sec)
 */
```


<br>


4. Third statement
```javascript
setTimeout(() => {
    console.log('0 second timeout callback');
}, 0);
/**
 * The next statement, another setTimeout, is reached and added to Call Stack
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   setTimeout(0sec)      setTimeout(2sec)
 *   main()
 *
 *
 * That statement is ran, which adds another register to the Node APIs, then
 *   that statement is removed from the Call Stack
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   main()                setTimeout(2sec)
 *                         setTimeout(0sec)
 *
 *
 * Once a call for a Node API is finished, it will be added to the Callback
 *   queue, its not executed right away. The Callback queue is where all
 *   callback functions go when they're ready to be fired while the Call
 *   Stack is working on emptying its stack of statements
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   main()                setTimeout(2sec)
 *
 *         ----- Callback  Queue -----
 *         setTimeout(0sec) callback
 *
 *
 * The Event Loop watches the Call Stack. Once the Call Stack is empty,
 *   the Event Loop sees if there is anything else to run.
 *
 *
 * NOTE: a callback function is, loosely, a function that gets passed as
 *   an argument to another function to be executed after some event happens
 */
```


<br>


5. Final statement
```javascript
console.log('Finishing app');
/**
 * Now we get to the 'Finishing up' c.log statement. It's added to the
 *   Call Stack, then runs.
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   console.log('..')     setTimeout(2sec)
 *   main()
 *
 *         ----- Callback  Queue -----
 *         setTimeout(0sec) callback
 *
 *
 * Once that last statement runs, its removed from the Stack. There are
 *   no more statements to run, so main() completes and the Call Stack
 *   removes it
 *
 *   --- Call Stack ---    --- Node APIs ---
 *                         setTimeout(2sec)
 *
 *         ----- Callback  Queue -----
 *         setTimeout(0sec) callback
 *
 *
 * The Event Loops tells the Call Stack it has something for it, and
 *   moves the functions its holding (right now, just the one setTimeout)
 *   to the Call Stack to execute
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   callback()            setTimeout(2sec)
 *
 *         ----- Callback  Queue -----
 *
 */


/**
 * That callback runs and gets removed from the Call Stack. Because there's
 *   still something running (Node API event) there's still an event
 *   listener running. Eventually, the 2nd setTimeout will finish, the
 *   Node APIs remove it from their stack and moves it to the Callback
 *   Queue
 *
 *   --- Call Stack ---    --- Node APIs ---
 *
 *         ----- Callback  Queue -----
 *         setTimeout(2sec)
 *
 *
 * Event Loop then sends that to the Call Stack to execute. There's
 *   a single statement in that callback, it runs, gets removed, then
 *   the callback implicitly returns to finish its execution
 *
 *   --- Call Stack ---    --- Node APIs ---
 *   console.log('..')
 *   callback()
 *
 *         ----- Callback  Queue -----
 *
 *
 * The Event Loop keeps trying to add items to the Call Stack as long
 *   as there is an active listener awaiting for something else to end
 */
```


<br>


Everything happens in parrallel, in the background, managed by Node.js, except your
application's code, which is never executed at the same time as anything else.


Instead of waiting line-by-line for an operation to finish, you create a callback
function to be invoked when the operation is finished, allowing for your code to
run while whatever needs to be gathered or processed gets gathered/processed.


Your code should do what it needs to do, then hand control back to the event
loop ASAP for Node to work on something else.


<br><br>


<hr>

## Aspects of Node.js development to think about while developing


<br>


#### Practical programming
Producing useful code (eg: filesystem interaction, establishing socket connections, serving web apps)


<br>


#### Node.js Core modules
How modules shuttle information between JS application environment and the C-based event loop
(eg: using `Buffer` to transport data between the two)


<br>


#### Patterns
Callbacks, error-handling techniques, `EventEmitter` & `Stream` classes for event dispatching


<br>


#### JavaScript-isms
JS-based features and best practices ...and weirdness


<br>


#### Supporting code
Unit testing, script deployement for making programs more robust, scalable, manageable


<br><br>


<hr>

## Chapter 1 - Filesystem access
> <b>Node.js core modules</b><br>
> Event loops dictating program's flow, `Buffer`s for data transport, work with core Node modules

> <b>Patters</b><br>
> Callbaks, async events, `EventEmitter` and `Stream` classes for data transport

> <b>JavaScript-isms</b><br>
> Block scoping, arrow function expressions


<br>


<hr>

#### 1.a. Watching for file changes asynchronously
Key Node classes `EventEmitter`, `Stream`, `ChildProcess`, `Buffer`


<br>


<b>`./project-files/file-changes/watcher.js`</b>
<br>
Watches a file for changes then print something to console

><b>Introduces:</b>
> - `const` vs. `let` vs. `var` for variable declarations (see next section block)
>
> - `const` is preferred declaration, always use if variable data won't change at runtime after declaration
>
> - `let` is preferred over and similiar to `var` but is scoped to <b>blocks</b>, NOT functions or modules
>
> - `var` is no longer preffered, is scoped to <b>functions or modules</b>, NOT blocks and is <b>hoisted</b>
>   from its declared block to the nearest function or module scope
> ```javascript
> // picturing var being hoisted:
> if (true){
>     var myVar = "hellow";   // will be available outside of if(true)
>     let myLet = "world";    // will not be available outside of if(true)
> }
> console.log(myVar);  // "hello"
> console.log(myLet);  // ReferenceError
> ```
>
> - JS functions are first class objects, can be assigned to variables, passed as params to functions
>
> - ECMA2015 arrow function expressions (fat arrow functions, arrow functions) don't create
> new scopes for `this` & should be your go-to for function expression declaration
>
> - CLI command `$ node scriptName.js` to run `scriptName.js`


<br><br>


<b>`./project-files/file-changes/watcher-argv.js`</b>
<br>
Basically `watcher.js` but accepts CLI argument

><b>Introduces:</b>
> - `process` global object, exception handling
>
> - Using backticks (template strings) around strings to denote stringified version of a `${variable}`
>
> - `process.argv[0,1,2,3...]`


<br><br>


<b>`./project-files/file-changes/watcher-spawn.js`</b>
<br>
Basically `watcher-argv.js` but spawns a child process in response to a change and pipes a returned
Streaam to our command line's `stdout`

><b>Introduces:</b>
> - Node.js `child-process` module
>
> - Node.js patterns, classes
>
> - `stream`s (a type of `EventEmitter` class) to pipe data around, in this case the
>   `stdin, stdout, stderr` properties of `ChildProcess` class
>
> - `require('module').method;` to import only a single thing from a module, ignoring the rest
>
> - Arrow function with multiple lines, necessitating `{}` after the `() =>` instead of single
> line functions, where the expression `() => console.log()` is valid instead of: 
> `() => { console.log('1'); console.log('2'); }`


<br><br>


<b>`./project-files/file-changes/watcher-spawn-parse.js`</b>
<br>
Continuance of `watcher-spawn.js` but captures data from a Stream instead of just passing it on

><b>Introduces:</b>
> - Node.js `EventEmitter` class (provides a channel for dispatching events and notifying listeners)
>
> - `Buffer` objects, passed as params from `data` events, are Node's method (outside of the JS
>   engine) of representing binary data, must be encoded/decoded to convert to/from JS strings but it
>   might be a better idea for performance to work with the binary data itself instead of string conversion
>
> - Cements understanding of key Node classes `EventEmitter`, `Stream`, `ChildProcess`, `Buffer`


<br><br>


<hr>

#### 1.b. Reading and writing files asynchronously
Common Node.js error handling problems: error events on `EventEmitters` and `err` callback arguments


<br>


<b>`./project-files/file-changes/read-simple.js`</b>
<br>
<b>`./project-files/file-changes/write-simple.js`</b>
<br>
Simplest method of reading/writing: read/write entire file at once (good for small files)

><b>Introduces:</b>
> - `err` object (Node.js uncaught exception) containing an `Error` object


<br><br>


<b>`./project-files/file-changes/read-stream.js`</b>
<br>
Working with streams, listens for `data` events from file stream

><b>Introduces:</b>
> - Calling methods directly on `require()` instead of first assigning a module to a variable
>
> - <i>Chaining</i> handlers one after another because `on()` returns the same emitter object:
>   `require('fs').someEvent(someArg).chainedHandler(/*do something*/).chainedHandler(/*do something*/);`


<br><br>


<hr>

#### 1.c. Reading and writing files synchronously (not preferred for I/O in Node)
Forcing Node to <i>block</i> processing until I/O finishes, using `*Sync` versions of async methods
that are often provided in a module (ex: `readFileSync` in the `fs` module)

Simpler to use because you're not forced to work with callbacks, synch methods either return successfully
or throw an exception, and are okay to be used in some cases but mostly just cause programs to run
longer than necessary - Only if your program couldn't possibly succeed with a file should a sync method be used


<br><br>


<hr>

## Chapter 2 - TCP Sockets & building a TCP server program
> <b>Node.js core modules</b><br>
> More async techniques, extending Node.js classes (`EventEmitter`, etc), custom modules for reusability

> <b>Patterns</b><br>
> Two endpoints in a network connection: server and client, JSON-based protocol for server/client communication

> <b>JavaScript-isms</b><br>
> Inheritance, creating class heirarchies with Node utilities

> <b>Supporting code</b><br>
> Unit testing with npm's `Mocha`

<br>


<hr>

#### 2.a. Listening for socket connections
Networked (socket-based) services exist to connect endpoints and transmit info between them, and regardless
of the type of info in transmission, a connection between endpoints must first be made

One endpoint <b>binds</b> to a numbered port and the other endpoint <b>connects</b> to a port


<br>


<b>Example of using `net`, a Node module for bind & connect operations, to bind a listening TCP port:</b>
> ```javascript
> 'use strict';
> const
>     net = require('net'),
>     server = net.createServer(connection => {
>         // use the connection object for data transfer
>     });
> server.listen(60300);
> ```
> Method `net.createServer` takes a callback and returns a `Server` object, Node invokes provided callback
> when another endpoint connects, the `connection` parameter in the callback is a `Socket` object that
> can be used to send or receive data via the connection between specified TCP port and the `Server`
>
> To picture this:
> ```
> client1  client2  client3    <-- can be any # of client connections/Node processes
>         \   |   /
>          \  |  /
>            TCP
>             |
>             |
>         .--------.
>         | Server |    <-- `server` object with bound TCP port
>         | ------ |
>         |  Node  |
>         | app.js |    <-- Node.js process that bound `server`
>         '--------'
> ```


<br><br>


<b>`./project-files/networking/net-watcher.js`</b>
<br>
Use code from chapter 1, specifying when a file changes, to give us some sort of data to work with
in our connection

>Note: You may need to install netcat for this section, or use `telnet` instead
>
><br>
>
><b><b>Introduces:</b></b>
> - Writing data to a listening socket server
>
> - Sending plain-text messages for human reading
>
> - Requires 3 terminal sessions: one for the service (.js file), the client (via netcat utility `nc`),
>   and another to trigger changes to file being watched
>
> - Optional Unix socket connection information in source file
>
><br>
>
><b>Once built, to get this working:</b>
>
>> <b>Terminal session 1</b><br>
>> start modifying target file<br>
>> `$ watch -n 1 touch target.txt`<br>
>> `>> Every 1.0s: touch target.txt`<br>
>>
>><br>
>>
>> <b>Terminal session 2</b><br>
>> start program to create service listening @ TCP:60300<br>
>> `$ node net-watcher.js target.txt`<br>
>> `>> Listening for subscribers`<br>
>> <br>
>> someone/thing connects to the listening port?<br>
>> `>> Subsriber connected`<br>
>> <br>
>> a connection gets terminated (`CTRL C` on `nc` terminal)?<br>
>> `>> Subscriber disconnected`<br>
>>
>><br>
>>
>> <b>Terminal session 3</b><br>
>> start netcat session to connect to the listening port<br>
>> `$ nc localhost 60300`<br>
>> `>> Now watching target.txt for changes...`<br>
>> <br>
>> the watch command from session 1 touches the target file?<br>
>> `>> File changed: Day Mon DD YYYY HH:MM:01 GMT-0500 (EST)`<br>
>> `>> File changed: Day Mon DD YYYY HH:MM:02 GMT-0500 (EST)`<br>
>> `>> File changed: Day Mon DD YYYY HH:MM:03 GMT-0500 (EST)`<br>
>> `>> File changed: Day Mon DD YYYY HH:MM:04 GMT-0500 (EST)`<br>
>> ...repeats<br>
>
><br>
>
><b>Visualizing the setup we've created, using the previous example:</b>
> ```
>                client terminal
>                       |
>                       |
>                 $ netcat util
>                       |
>                       |
>  .------------. .-----------.
>  |   Server   |-| TCP:60300 |    <-- resource defined by net-watcher.js
>  | ---------  | '-----------'
>  |            |
>  |    Node    |    $ touch
>  |   app.js   |       |
>  |            |       |
>  |  --------  | .-----------.
>  | fs.watch() |-| text file |    <-- resource defined by net-watcher.js
>  '------------' '-----------'
> ```


<br><br>


<hr>

#### 2.b. Design and implement an upgraded messaging protocol
Any networked application developed in Node requires you to work with one or more protocols - rules
that define how endpoints communicate

This version will be based on passing JSON messages (JSON-serialized objects) over TCP, implementing
client/server endpoints to accept the new protocol


<br>


<b>`./project-files/networking/net-watcher-json-service.js`</b>
<br>
<b>`./project-files/networking/net-watcher-json-client.js`</b>
<br>
Transform data into a parsable format, net-watcher.js but sending JSON encoded messages to connected client
(working with the server side of Node sockets) and receiving JSON messages (on the client side)

Very basic, only listens to `data` events, not `end` or `error` events, purposefully including a bug
regarding assumptions made about message boundaries

>Introduces:
> - JSON encoding and writing
>
> - Line-delimted JSON ("LDJ" - separating each JSON message with newline chars, no other whitespace)
>
> - JSON messages receival, pretty printing JSON into human readable format
>
> - Building client socket via `connect()`
>
> - `new Date()` using a provided Unix timestamp


<br><br>


<hr>

#### 2.c.1. Unit tests - Messaging protocol
Ensure your code does what is expected, handle network problems (ex: split inputs, broken connections,
some bad data) gracefully

Extending core Node classes (current client code doesn't buffer its inputs), creating custom modules,
developing on top of the `EventEmitter` class


<br>


<b>`./project-files/networking/test-json-service.js`</b>
<br>
Purposefully send splits message to visualize network problem

>Introduces:
> - `clearTimeout()` to unschedule callback from `setTimeout()` because calls to `connection.write`
>   will trigger error events after the connection is closed


<br><br>


<b>`./project-files/networking/lib/ldj-client.js`</b>
<br>
Fix client code to buffer incoming data into messages and handle each message once it arrives properly,
while moving the buffer section of the code to a custom module, then incorporate that into network-watcher client

Now, each message event, complete or not, will cause `message` events on the `LDJClient` invocation

>Introduces:
> - Separating jobs into Node.js modules, one to buffer messages, one to handle messages at arrival
>
> - Begin the extension of core Node modules & creating custom modules
>
> - Inheritance in Node
>
> - Creating class w/inheritance: `class CustomClass extends SomeCoreClass {constructor(stream)}`
>
> - Creating instance of ^^ class: `new CustomClass(stream)`
>
> - Using `stream` (object that emits `data` events such as a `Socket`) within `constructor(stream)`
>
> - Taking incoming raw data from `stream` and convert it into message events of the parsed message objects.
>
> - Start `constructor` with `super()` to invoke `SomeCoreClass`'s constructor (which is best practice
>   when implementing a class that extends another)
>
> - <b>prototypal inheritance</b> in JS to establish relationship between extended class and the class
>   it was extended by (hierarchies), should a property be looked for that doesn't exist on new extending class, go
>   look at the parent that new class extends (ex: create `client` invocation of `LDJClient` and attempt
>   to call `client.on`, even though `LDJClient`'s prototype doesn't include a `on` method, JS will
>   go look for it (and will find it) within the `EventEmitter` class)
>
> - Put `CustomClass` into a Node.js module for upstream client (exposing `LDJClient` as a module)


<br><br>


<b>`./project-files/networking/net-watcher-ldj-client.js`</b>
<br>
Implement the custom module created in `./lib/ldj-client.js`, instead of sending `data` buffers straight
to `JSON.parse` in `net-watcher-json-client`, relying on `ldj-client.js` module to produce `message` events

Should now have a server and client that use a custom message format to communicate


<br><br>


<hr>

#### 2.c.2. Unit tests - Mocha
npm module `Mocha`, popular testing framework for Node.js, in this instance we'll use the <b>behavior driven
development (BDD)</b> style


<br>


<b>Installing the npm module</b>
<br>
npm = Node.js's built in package manager, relies on config file `package.json`, and that needs to be
created first

<br>

<b>a - </b>Create a default `package` file in project's root (`./project-files/networking` in this case):
> `$ npm init -y`

<br>

<b>b - </b>We're not worrying about diving deep into npm or npm configuration right now, move on to installing Mocha:
> `$ npm install --save-dev --save-exact mocha@3.4.2`
>
> <b>Note: </b>You can ignore the warnings generated for now, npm is just suggesting you add info to `package.json`

<br>

Upon running `ls` you can see a few changes have been made.
- `node_modules` directory created, containing Mocha and its dependencies
- In your `package.json` file, you should see a new section `devDependencies` and Mocha should be listed therein
- File `package-lock.json` also created, containing exact version of every module Mocha depends on (note:
  if you don't want Node to automatically mess with the versions of whatever packages you use via its
  semantic versioning practices, be sure to `git commmit` this file)

Node provides regular dependencies, which are used at runtime (with `require`) and are installed in npm
with a `--production` flag in `npm install`

There are also dev dependencies, which are programs the project needs during development. We installed
Mocha as a Dev-style with the `--save-dev` flag in the `npm install` command

If no flags are used during package installation, both types are installed.


<br>


<b>Unit test for `ldj-client`</b>
<br>
`./project-files/networking/test/ldj-client-test.js`

>Introduces:
> - `test` directory, the place Mocha looks for by default for tests
>
> - Node module `assert` for easier comparison testing
>
> - How to run Mocha tests from npm

<br>

To run the Mocha test in npm:
><b>Add an entry to `package.json` under `scripts` section</b>
>
>>```json
>>"scripts": {
>>    "test": "mocha"
>>},
>>```
>
><b>run the `npm run test` command under npm's alias `npm test`</b>
>
>> ```
>> path/to/project $ npm test
>> networking@1.0.0 test /var/www/github_notes/notes/node-js/project-files/networking
>> mocha
>>
>>  LDJClient
>>    ✓ should emit a message event from a single data event
>>
>>  1 passing (11ms)
>> ```


<br>


<b>Upgrading `test-json-service.js` into a Mocha test</b>
<br>
`./project-files/networking/test/ldj-client-test.js`

>Introduces:
> - Adding multiple tests to one test framework, each within its own `it()` clause within the test
>   file's `describe` block


<br><br>


<hr>

## Chapter 3 - Connections and interactions between Node Microservices
> <b>Node.js core modules</b><br>
> Using pool of processes (Node.js workers) to mimic multi-threading (using Node's `cluster` module)

> <b>Patterns</b><br>
> Messaging patterns, `publish/subscribe`, `request/reply`, `ROUTER` & `DEALER`, `push/pull`, and
> when or how to apply them

> <b>JavaScript-isms</b><br>
> JS `rest` parameter syntax for arbitrary function argument capture

> <b>Supporting code</b><br>
> Use and manage npm modules, with or without external depencies

<br>


<hr>

#### 3.a. ØMQ (ZeroMQ)
Alternative to working with HTTP (and the more complicated `http` module), use ØMQ to expose higher-level
messaging patterns and low-level networking concerns

Uses the ZeroMQ Message Transport Protocol (ZMTP) for message exchange, which uses frames for message
composure

<br>

<b>ØMQ (ZeroMQ) advanatages:</b>
> - Auto reconnect attempts between ØMQ endpoints
> - Only delivers whole messages, don't have to create buffers to deal with chunked data
> - Takes care of routing details (ex: sending responses back to correct clients)
> - Allows for exploration of several messaging pattern types, which can be applied to HTTP practices later
> - Patterns and approaches also apply to embedded Node.js systems (IoT, Raspberry Pi OS Raspbian)

<br>

<b>Installing ØMQ</b>

<b>a - </b>Create an initial `package.json` file from `./package-files/microservices`<br>
> `$ npm init -y`

<br>

<b>b - </b>Use <b>`zeromq`</b> Node.js module, the official Node.js binding for npm's ØMQ<br>
> `$ npm install --save --save-exact zeromq@4.2.1`

Note: remember, use `--save` flag to tell npm to remember this dependancy in `package.json` as a runtime dependency

<br>

<b>c - </b>Now you can test the installation, making sure `zeromq` and its depencies were downloaded to `node_modules`
> `$ node -p -e "require('zeromq').version"`

Note: `-p` flag to print output, `-e` to tell Node.js to evealuate string as JS


<br><br>


<hr>

#### 3.b. ØMQ Messaging Patterns - `publish/subscribe` (or `PUB/SUB`)
In previous sections, a networded file-watching service and its client was created that communicated
with TCP by sending LDJ (Line-deliniated JSON) messages - the server <b>published</b> information in
that format and client programs could <b>subscrive</b> to it for information

While our client code safely handled the message/boundary problem, we had to create a separate module
for buffering chunked data and emitting messages, and still had liabilities such as 'how to handle
network interupts or server restarts'

We'll demonstrate how much easier it is to just use ØMQ instead of naked TCP

<br>

<b>Publishing (PUB) messages over TCP using `zeromq`</b>
<br>
`./project-files/microservices/zmq-watcher-pub.js`

>Introduces:
> - The publisher, `zmq.socket('pub');`
>
> - Because `zmq.socket` is used, either a `bind` method (typically for the publisher) or a `connect` method (
>   typically for the subscriber) can be used, but either can be used interchangeably for each PUB/SUB pair
>
> - Easy TCP port listening, example: "listen for any tcp connection over 60400":
>>  ```javascript
>>  publisher.bind('tcp://60400', err => {
>>      //take err argument if found....
>>      if (err) { throw err; }
>>      //...or, if no error...
>>      console.log('listening...');
>>  });
>>  ```
>
> - Uses single call to filesystem with `fs.watch` instead of invoking `watch` for each connected client
>
> - This ØMQ server requires an ØMQ client, can't just use `nc` or `telnet` for the client

<br>

<b>Subscribing (SUB) to a publisher</b>
<br>
`./project-files/microservices/zmq-watcher-sub.js`

>Introduces:
> - The subscriber, `zmq.socket('sub');`
>
> - `zmq.socket('sub').subscribe('');` will subscribe you to every message, replace the empty string with
>   a string to filter results, but either way, `subscribe()` must be called at some point or you'll never
>   recieve messages at all
>
> - The `subscriber` object inherits from `EventEmitter`, emits a `message` event when it receives one from a publisher
>
> - ØMQ doesn't care which boots first, the PUB or SUB, it'll automatically establish and reestablish connection
>   when either endpoint comes online 


<br><br>


<hr>

#### 3.c. ØMQ Messaging Patterns - `request/reply` (or `REQ/REP`)
Very common pattern in Node networked programming, plays into the 'Q' portion of ØMQ

`REQ/REP` pairs communicate in lockstep - request comes in, replies go out and additional request are
queued and later dispatched by ØMQ, leaving your application aware of only one request at a time

Synchronous (operates sequentially), no parallelism with requests/replies, probably not great for
a high performance requirement but is easy to code

<br>

<b>The responder (REP)</b>
<br>
`./project-files/microservices/zmq-filer-rep.js`<br>
Will wait for a request for file data then serves up the content when asked

>Introduces:
> - Locking down the stable listener endpoint of the pair to localhost for security reasons:
>   `responder.bind('tcp://127.0.0.1...`
>
> - Listening to Unix signal `SIGINT` (signal interrupt) events, which signify a process receving an
>   interupt signal from the user (ie, hitting `CTRL` + `c` to kill a terminal process), then handle
>   the event cleanly by asking the responder to gracefully close any outstanding connections

<br>

<b>The request (REQ)</b>
<br>
`./project-files/microservices/zmq-filer-req.js`<br>


<br><br>


<hr>

#### 3.d. ØMQ Messaging Patterns - `ROUTER` and `DEALER`
Advanced socket types for parallel messaging

<br>

<b>The `ROUTER` socket type</b><br>
Are essentially parallell `REP` sockets, can handle multiple requests simultaneously by remembering
which connection each request came from and route the replies accordingly (by using ZMTP frames)

The simpler socket types only need one frame per message and the handlers use `data` parameters, `ROUTER`
sockets use multiple frames and its handlers take an array of frames instead of `data`

An example implementation:
>   ```javascript
>   // create the socket
>   const router = zmq.socket('router');
>   // on message event...
>   router.on('message', (...frames) => {
>       // ...do something with the frames, then:
>       dealer.send(frames);
>   });
>   ```

> <b>Note: </b>the `...` is ES5 syntax called <b>rest parameters</b>, when used in function declarations
> the syntax will collect any number of arguments passed into the function as an array

<br>

<b>The `DEALER` socket type</b><br>
Basically a parallelt `REQ` socket, can send multiple requests in parallel

Using the `DEALER` socket is almost the same as the `ROUTER` implementation, except `router` gets
swapped with `dealer`:
>   ```javascript
>   //const router = zmq.socket('router');
>   const dealer = zmq.socket('dealer');
>   //router.on('message', (...frames) => {
>   dealer.on('message', (...frames) => {
>       //dealer.send(frames);
>       router.send(frames);
>   });
>   ```

There is a passthrough relationship between the `DEALER` and `ROUTER` sockets; requests to the router
get passed off to the dealer to send out to its connections and replies to the dealer will be forwarded
back to the router to direct each reply to the connections that requested it

<br>

<b>Picturing the `DEALER/ROUTER` relationship</b>
>```
>                 .--------------------.
>                 |      .------>.     |
> REQ socket ---> | ROUTER      DEALER | <-- REP socket
>                 |      '<------'     |
>                 '--------------------'
>
> - An incoming REQ socket connects to ROUTER
> - REQ socket issues a request, ROUTER passes it to DEALER
> - DEALER picks the next REP socket connected to it & forwards the request
>
> - REP socket produces a reply, DEALER passes it to ROUTER
> - ROUTER reviews the message's frames to determine origin
> - ROUTER passes the message to the REQ that sent the initial request
>```


<br><br>


<hr>

#### 3.e. ØMQ Messaging Patterns - Clustering Node.js processes
Node's event loop is single threaded, clustering is spinning up more Node processes, which is synonymous
with using more threads when needed in a multithreaded system, and is managed with Node's `cluster` module

Clustering is useful for scaling an app up when theres unused CPU capacity available

<br>

<b>Demonstration of clustering processes</b><br>
Goal: to manage a pool of worker processes to respond to ØMQ requests, using `ROUTER`, `DEALER`, `REP`
sockets to distribute requests to workers for a cluster-based multiprocess work distribution and
load-balanced message-passing program

Forking (`fork` is a method on the `cluster` module and is a special case of `spawn` - see chapter
1's usage of `child_process` module's `spawn` method - ) will be used to spin up copies of the same
Node.js program


<br><br>


<hr>

#### 3.f. ØMQ Messaging Patterns - `PUSH` and `PULL`

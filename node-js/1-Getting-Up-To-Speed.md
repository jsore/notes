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


<br><br>


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
> - Writing data to a socket
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
> client terminal
>        |
>        |
>  $ netcat util
>        |
>        |
>  .-----------.
>  | TCP:60300 |    <-- resource defined by net-watcher.js
>  '-----------'
>        |
>        |
>  .------------.
>  |   Server   |
>  | ---------  |   $ touch
>  |    Node    |      |
>  |   app.js   |      |
>  |  --------  | .---------.
>  | fs.watch() |-| txtFile |    <-- resource defined by net-watcher.js
>  '------------' '---------'
> ```


<br><br>


<b>`./project-files/networking/...`</b>
<br>
Transform data into a parsable format, allows for customer client applications










































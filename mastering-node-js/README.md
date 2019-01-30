# Mastering Node

Snippets & thoughts about Packt Publishing's "Mastering Node.js - Second Edition".

<br>

<b>Note</b>

These are just for personal use, I am not affiliated with Packt in any way. I just enjoy writing.

Not everything in the book will be documented, just things I thought were interesting, laid out in
my own words.

Supportive docs and code are rooted in this repo's `project-files` directory.


<br><br><hr>


# The low-level - Some Basics

<br>

### POSIX
Old, simple and well known definition for the standard API for Unix OS'es.

Node uses wrappers around POSIX for file I/O instead of reinventing the wheel, allowing for
greater familiarity for developers trained in other languages.

<br>

### Threads and Events
System programmers access computing tasks via the thread, which Node mimics with a <b>single</b>
event loop-bound thread. Callbacks are utilized to have tasks enter/leave the execution context,
the event loop popping tasks into the context until the lowest level task has been executed. Events
are created by I/O operations generating them within data streams.

<br>

### Standard C Libraries
Node isn't having JavaScript actually doing the low-level work, JavaScript is calling down to
the C code version of the library you're using, which gets included and compiled into Node.

Again, the intention being to not reinvent the wheel.

<br>

### Node's Extension of JS
Applications written in a more systematic language (C, Java) want to know the outcome in some
future event and are notified when that event occurs. JavaScript similarily asks for notification
upon an I/O event emission, not blocking the execution of other events. Node imported this JS
event model to build interfaces for system operations.

<br>

### Object `EventEmitter`
This is where events live, being instances of `events.EventEimitters`. Node brought this `EventEmitter`
object to JS and made it an object your objects can extend, letting that object handle I/O data streams.

Node implements I/O operations as asynchronous evented data streams, producing good performance.
Instead of managing a thread or processes for long tasks, the only resource there needs to be is
for hanlding callbacks.

<br>

### CommonJS
CommonJS Gave JavaScript packages, a modular method of writing applications. Packages are collections
of JS files, defined via Metadata residing in `package.json`. A portion of that Metadata is the
package's version, which is dictated by <b>Semantic Versioning</b> rules ( Major.Minor.Patch ).
Defined in the book as:

> <b>Major</b>: There's a change in the purpose or outcome of the API. If your code<br>
> calls an updated function, it may break or produce an unintended result. Figure<br>
> out what's changed, and determine if it affects your code.<br>
>
> <b>Minor</b>: The package has added functionality, but remains compatible. Run<br>
> all your tests, and you're good to go. Check out the documentation if you're<br>
> curious, as there might be new, more advanced parts of the API alongside the<br>
> functions and objects you're familiar with.<br>
>
> <b>Patch</b>: The package fixed a bug, improved performance, or refactored a<br>
> little. Run all your tests, and you're good to go.<br>

Node needed a way to manage those packages: npm, a registry of packages. npm lets you install
packages, can create/read/edit `package.json` files, build out an empty package, add its required
dependencies, download all the code and keep everything up to date.

<br>

### Code Optimizations To Help The Compiler
Make sure your code is seen by V8 as utterly predictable as possible.

- don't create arrays with gaps between indexes

- arrays should start a index `0`

- try not to populate arrays with empty data, ensuring external data to be pushed<br>
into an array is not incomplete

- grow arrays as you go, don't preallocate large arrays

- new (hidden) classes are created when a property is added to an object, try to<br>
avoid adding properties to an object after the object is instantiated ( initiialize<br>
all properties in constructor functions in the same order )

- functions should be the prime focus for possible optimizations

- try/catch'es are not optimizable

- no polymorphic functions

- Promises > callbach hell

<br>

### Variables, Functions, `this`

- the `var` variable declaration type is not block scoped, but `let` is

```javascript
let foo = 'bar';
if (foo == 'bar') {
    let foo = 'baz';
    console.log(foo);  // baz
}
console.log(foo);  // bar
```

- use `const` where you can if a variable won't change in the future

```javascript
// it's illegal to mutate a constant variable after assignment...
const foo = 1;
foo = 2;  // Error
// ...but if the const's value is an object, it's members aren't
// under that same restriction
const foo = { bar: 1 }
console.log(foo.bar)  // 1
foo.bar = 2;
console.log(foo.bar)  // 2
```

- in arrow functions, `this` is bound to the callsite

```javascript
function Counter() {
    this.count = 0;

    // old, setInterval has no reference to Counter.count
    setInterval(function() {
        console.log(this.count++);  // oops
    }, 1000);
}
new Counter();
```
```javascript
// replace that with this arrow func and setInterval
// now sees Counter's this reference
function Counter() {
    this.count = 0;

    setInterval(() => {
        // yup!
        console.log(this);
        // Counter { count: 0 }
        // 0
        console.log(this.count++);
        // Counter { count: 1 }
        // 1
        }, 1000);
}
// does it work?
new Counter();
```

- string manipulation has improved greatly

```javascript
// template literals
let str = 'some math';
console.log(`${str}: 2 + 2 = ${2+2}`);  // some math: 2 + 2 = 4

// strings are now iterable
for (let c of 'NodeJS') {
    console.log(c);
    // N
    // o
    // d
    // e
    // J
    // S
}

// spread operator, explode string >> array
console.log([...'NodeJS']);  // ['N', 'o', 'd', 'e', 'J', 'S']

// new string search methods
let target = 'It is very windy outside tonight';
console.log(target.startsWith('It', 0));  // true
console.log(target.startsWith('It', 1));  // false
console.log(target.endsWith('tonight'));  // true
console.log(target.includes('is', 4));  // false
```


<br><br><hr>


# The low-level - Asynchronous Event-Driven Programming
& concurrency management with Promises, Generators, async/await

<br>

### Fast I/O With Node
Node handles it's I/O workers by attempting to never let there be any idle system resources. Typically,
a worker would just sit idle until it can then move forward, but instead if a worker becomes idle
due to an I/O block, it can advertise it is available to work on another job from another client.
That is Node's approach. The environment can cooperatively schedule many client jobs to be cooperative.

Efficiencies are found for Node's single threaded design by delegating as mnay blocking operations
as possible to OS subsystems ( via the Event Loop using `libuv` package ) and only touching the main
V8 thread - your executing Node program - when, after something decides it wants some data by passing
a callback within a request, data has become available.

The Event Loop essentially stacks each process, handing off a request for a worker or a request for
data only when what is in essence a virtual switchboard has available workers. When a worker
becomes available, the Event Loop takes the top-most process of the top of the stack, hands it to
that switchboard and gets it assigned to a worker. `libuv` handles the actual gathering of triggered
events or monitoring other sources of events, the user registering callbacks when the event occurs.

<br>

### Signals, Processes, File Events
Signals: A form of communication used in Unix & POSIX compliant systems, an asynchronous notification
sent to a process to notify it that an event has occurred. Node's `process` object exposes to a Node
process OS system signal events, using standard POSIX signal names.

`SIGINT` = `CTRL + C`'ing a process via it's terminal. The keystrike fires, the signal tells a
process that an interrupt has been requested. If you subscribe to that event in some code:

`process.on("SIGINT", () => { ... });`

Node can intercept that signal. You can send this signal via the command line or through another
process ( called <b>Inter-Process Communication</b> ).

<br>

An example of CL communications:
```javascript
/**
 * example.js
 */

/**
 * just leave Node hanging for 16 minutes before making
 * it fire the empty function, leaving the process running,
 * giving us time to work with it elsewhere
 */
setInterval(() => {}, 1e6);

/**
 * SIGUSR1, SIGUSR2 are arbitrary user-defined signals, not
 * triggered by the OS
 */
process.on("SIGUSR1", () => {
    console.log("Signal received");
});
```

Run it:

`$ node example.js`

Which runs that as a process, which will run through Node. In a new terminal, get it's PID:

```
$ ps aux | grep example.js
> USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND
> <username>       40588   0.0  0.1  4549104  23648 s001  S+    1:06PM   0:00.15 node example.js
```

Send that process, specified via it's PID, a `SIGUSR1` signal, which as an example can be via `kill`:

```
$ kill -s SIGUSR1 40588
( back in the original terminal )
> Signal received
```

<br>

<b>Processes are fundamental to Node.</b> Need to parallel execution or scale up? Fork a process, creating
a child process, don't create a thread pool.

<b>`parent.js`</b><br>
<b>`lovechild.js`</b><br>
> a forking process (`parent`) sends messsages to `child`, telling `child` to reply, which it does

<b>`net-parent.js`</b><br>
<b>`net-child.js`</b><br>
> parent starts a server, passes a handle to it down to a forked child, which load balances the server
> connection for any services that hit the port the server is listening on

<br>

### Timer Gotchya's
Node uses a single low level timer object for each timeout value. If you attach multiple callbacks
for a single timeout value, they'll occur in order because they're sitting in a queue. However, if
they're on different timeout values, they'll be subject to the CPU scheduler.

So:
```javascript
// b won't necessarily follow a and a won't necessarily proceed b...
setTimeout(a, 1000);
setTimeout(b, 1001);

// ...to get that predictable result:
setTimeout(a, 1000);
setTimeout(b, 1000);  // queued behind a

// however, this is still not the case for every situation
```

Consider a use case for periodically re-running a function - for example, hitting a data source
every few seconds and pushing updates, or garbage collection. You could use `setInterval`:

```javascript
// note: this snippet would run forever
let intervalId = setInterval(() => { ... }, 100);
```

But you're still bound to the Event Loop. If something blocks the loop at some point, your intervals
will still be running, but will be just getting queued up on the stack. Once ( if ) the Event Loop
clears up, your timing delays will be lost, all of those interval'ed callbacks get fired at once.

Use `clearInterval(intervalId)` to clear an interval, `intervalId.unref();` if you want a process
to end when that timer is the only event source remaining for the Event Loop to process, `ref()` to
do the opposite ( timer will go back to be running forever ).

Demonstration:
```javascript
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
let pos = 0;
let messenger = new EventEmitter();

// Listener for EventEmitter
messenger.on("message", (msg) => {
  console.log(++pos + " MESSAGE: " + msg);
});

// (A) FIRST
console.log(++pos + " FIRST");

//  (B) NEXT
process.nextTick(() => {
  console.log(++pos + " NEXT")
})

// (C) QUICK TIMER
setTimeout(() => {
  console.log(++pos + " QUICK TIMER")
}, 0)

// (D) LONG TIMER
setTimeout(() => {
  console.log(++pos + " LONG TIMER")
}, 10)

// (E) IMMEDIATE
setImmediate(() => {
  console.log(++pos + " IMMEDIATE")
})

// (F) MESSAGE HELLO!
messenger.emit("message", "Hello!");

// (G) FIRST STAT
fs.stat(__filename, () => {
  console.log(++pos + " FIRST STAT");
});

// (H) LAST STAT
fs.stat(__filename, () => {
  console.log(++pos + " LAST STAT");
});

// (I) LAST
console.log(++pos + " LAST");

/**
 * FIRST (A).              // 1st console.log()
 * MESSAGE: Hello! (F).    // messenger.emit()
 * LAST (I).               // 2nd console.log(), call stack exhausted, time for I/O
 * NEXT (B).               // 1st queued process.nextTicket()
 * QUICK TIMER (C).        // setTimeout(0) (1 milsec)
 * FIRST STAT (G).         // 1st queued fs.stat()
 * LAST STAT (H).          // 2nd queued fs.stat()
 * IMMEDIATE (E).          // no more I/O or timers, setImmediate()
 * LONG TIMER (D).         // setTimeout(10)
 */
```

<br>

### Good Concurrency - Callbacks

- the first argument returned to a callback should be any error message:

```javascript
API.getUser(loginInfo, aCallback(err, user) {
    // handle error, then
    API.getProfile(user, anotherCallback(err, profile) {
        // handle error, then
        // ...
    }
});
```

- that error should preferrably be formed as an object:

```javascript
new Error("This should be a String");
```

- if there's no error to report, the first slot should contain a `null` value

- when passing a callback to a function, it should be the last in the function signature

<br>

### Good Concurrency - Promises

- Promises excute only once, either error ( unfulfilled ) or fulfilled, then via `then` that last
immutable value is accessed

```javascript
// Promise chain
let promiseProfile = API.getUser(loginInfo)
.then(user => API.getProfile(user))
.then(profile => {
    // do something with the profile
})
// this will handle all errors, don't have to manage
// them individually
.catch(err => console.log(err))
```

- use `Promise.all` to run Promises in parallel for efficiency

```javascript
// block of Promises, all of them DB calls, which always
// run serially, regardless of how Promises are handled
const db = {
    // anything match any of these queries?
    getFullName: Promise.resolve('John Doe'),
    getAddress: Promise.resolve('10th street'),
    getFavorites: Promise.resolve('Lean'),
};

// trigger the Promise block simultaneously, run the
// Promises in parallel while DB calls are made
Promise.all([
    db.getFullName()
    db.getAddress()
    db.getFavourites()
])
.then(results => {
    // results = ['John Doe', '10th street', 'Lean']
})
.catch(err => { ... })
```

- `Promise.all` will always return a Promise

<br>

### Good Concurrency - async/await

- these do not block the process ( asynchronous execution ) but still halt a program until resolved
( synchronous )

```javascript
const db = {
    getFullName: Promise.resolve('John Doe'),
    getAddress: Promise.resolve('10th street'),
    getFavorites: Promise.resolve('Lean'),
}

// will produce a Promise
async function profile() {
    // these expect to find a Promise
    let fullName = await db.getFullName()
    let address = await db.getAddress()
    let favorites = await db.getFavorites()

    return {fullName, address, favorites};
}

// produce the Promise and access the value of it
profile().then(res => console.log(res))  // results = ['John Doe', '10th street', 'Lean']
```

- `async` always returns a Promise

- `await` expects a Promise

<br>

### Generators, Iterators
Generator functions can be paused and resumed. It will yield a value, then stop, without destroying
the context of the function. This lets you re-enter the Generator later for further results. They
expose a `next` method, which is used to pull out values from the Generator, returning an object
with two properties: a value and `done`.

Iterators, objects that provide a `next()` method, know how to access items from a collection one at
a time, keeping track of it's current position. Generators implement the JavaScript Iteration protocol
and are factories for Iterators.

```javascript
// denote Generator with *
function* threeThings() {
    // yield is synonymous with return
    yield 'one';
    yield 'two';
    yield 'three';
}

// haven't executed anything yet, just built a reference...
let tt = threeThings();

// ...now, create the (empty) Generator object...
console.log(tt);  // {}
// ...and start working through it
console.log(tt.next());  // { value: 'one', done: false }
console.log(tt.next());  // { value: 'two', done: false }
console.log(tt.next());  // { value: 'three', done: false }
console.log(tt.next());  // { value: undefined, done: true }
```

<b>Generators are to a sequence of future values as Promises are to a single future value.</b> They
can both be passed around the instant they're generated even if some values haven't been resolved yet
or haven't been queued yet, one being accessible via `next()`, the other `then()`.

<br>

### Applying ^ That ^

- [ ] it should create a process to query Twitter for `#nodejs`
- [ ] it should write any messages to `tweets.txt` in 140-byte chunks
- [ ] it should create a server to broadcast these messages to a client using <b>Server Sent Events</b>
- [ ] it should trigger those broadcasts with write events to `tweets.txt`
- [ ] it should asynchronously read 140-byte chunks from last-known client read pointer on write event
- [ ] it should continue until EOF, recursively broadcasting
- [ ] it should have a place to display these broadcasts, `client.html`

Finally, it should demonstrate...
- [ ] listening to filesystem for changes, then responding
- [ ] using data stream events for read/writing files
- [ ] responding to network events
- [ ] using timeouts for polling state
- [ ] using a Node server as a network event broadcaster

<b>`twitter/server.js`</b><br>

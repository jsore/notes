# Mastering Node

Snippets & thoughts about Packt Publishing's "Mastering Node.js - Second Edition".

<br>

<b>Note</b>

These are just for personal use, I am not affiliated with Packt in any way. I just enjoy writing.

Not everything in the book will be documented, just things I thought were interesting, laid out in
my own words.

Supportive docs and code are rooted in this repo's `project-files` directory.


<br><br><hr>


# The low-level

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


# Asynchronous event-driven programming
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
let intervalId = setInterval(() => { ... }, 100);
```

But you're still bound to the Event Loop. If something blocks the loop at some point, your intervals
will still be running, but will be just getting queued up on the stack. Once ( if ) the Event Loop
clears up, your timing delays will be lost, all of those interval'ed callbacks get fired at once.
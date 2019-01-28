# Mastering Node

Snippets & thoughts about Packt Publishing's "Mastering Node.js - Second Edition".

<br>

<b>Note</b>

These are just for personal use, I am not affiliated with Packt in any way. I just enjoy writing.

Not everything in the book will be documented, just things I thought were interesting, laid out in
my own words.

Supportive docs and code are rooted in this repo's `project-files` directory.


<br><br><hr>


## The low-level

<br>

#### POSIX
Old, simple and well known definition for the standard API for Unix OS'es.

Node uses wrappers around POSIX for file I/O instead of reinventing the wheel, allowing for
greater familiarity for developers trained in other languages.

<br>

#### Threads and Events
System programmers access computing tasks via the thread, which Node mimics with a <b>single</b>
event loop-bound thread. Callbacks are utilized to have tasks enter/leave the execution context,
the event loop popping tasks into the context until the lowest level task has been executed. Events
are created by I/O operations generating them within data streams.

<br>

#### Standard C libraries
Node isn't having JavaScript actually doing the low-level work, JavaScript is calling down to
the C code version of the library you're using, which gets included and compiled into Node.

Again, the intention being to not reinvent the wheel.

<br>

#### Node's extensions of JS
Applications written in a more systematic language (C, Java) want to know the outcome in some
future event and are notified when that event occurs. JavaScript similarily asks for notification
upon an I/O event emission, not blocking the execution of other events. Node imported this JS
event model to build interfaces for system operations.

<br>

#### Object `EventEmitter`
This is where events live, being instances of `events.EventEimitters`. Node brought this `EventEmitter`
object to JS and made it an object your objects can extend, letting that object handle I/O data streams.

Node implements I/O operations as asynchronous evented data streams, producing good performance.
Instead of managing a thread or processes for long tasks, the only resource there needs to be is
for hanlding callbacks.

<br>

#### CommonJS
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

#### Code optimizations to help the compiler
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

#### Variables, functions, `this`
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


## Asynchronous event-driven programming
& concurrency management with Promises, Generators, async/await

<br>

#### Fast I/O with Node
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
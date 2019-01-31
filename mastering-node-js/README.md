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
> a forking process (`parent`) sends messsages to `child`, telling `child` to<br>
> reply, which it does<br>

<b>`net-parent.js`</b><br>
<b>`net-child.js`</b><br>
> parent starts a server, passes a handle to it down to a forked child, which<br>
> load balances the server connection for any services that hit the port the<br>
> server is listening on<br>


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
 * LAST (I).               // 2nd console.log(), JS call stack exhausted
 * NEXT (B).               // process.nextTick(), inserted to head of event queue just before I/O
 * QUICK TIMER (C).        // setTimeout(0) (1 milsec), 1st to be after queued nextTick()'s
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

- when passing a callback to a function, it should be the last parameter or<br>
object in the function signature

<br>

### Good Concurrency - Promises

- Promises excute only once, either error ( unfulfilled ) or fulfilled, then<br>
via `then` that last immutable value is accessed

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

- these do not block the process ( asynchronous execution ) but still halt a<br>
program until resolved ( synchronous )

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
- [ ] it should create a server to broadcast these messages to a client using<br>
SSE's, <b>Server Sent Events</b>
- [ ] it should trigger those broadcasts with write events to `tweets.txt`
- [-] it should asynchronously read 140-byte chunks from last-known client read<br>
pointer on write event
- [-] it should continue until EOF, recursively broadcasting
- [ ] it should have a place to display these broadcasts, `client.html`

Finally, it should demonstrate...
- [-] listening to file system for changes, then responding
- [-] using data stream events for read/writing files
- [-] responding to network events
- [-] using timeouts for polling state
- [-] using a Node server as a network event broadcaster

<b>`twitter/server.js`</b> `<-- did not finish, Twitter API is garbage` <br>
<b>`twitter/twitter.txt`</b><br>
Spin up a server, watch for file changes to `twitter.txt`, watch for client connects and write to
client-accessible site

As mentioned, this one was never finished because of issues with Twitter developer accounts

An example of using SSE, as was listed in the 'it should's, within the client page:
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>

<script>

window.onload = () => {
  let list = document.getElementById("list");
  let evtSource = new EventSource("http://localhost:8080/events");

  evtSource.onmessage = (e) => {
    let newElement = document.createElement("li");
    newElement.innerHTML = e.data;
    list.appendChild(newElement);
  }
}

</script>
<body>

<ul id="list"></ul>

</body>
</html>
```

<br><br><hr>


# Data From Files

<br>

### Purpose of Streams
Consider copying a file. Files can be large and it's easy to block other processes if you just
straightforward copy the entire file at once then create a new destination file. Streams let you
break the file up into small ( fast ) chunks, and also let you properly avoid Buffer `RangeError`s
while not blocking the event loop.

```javascript
// copy a file with streams
// bad, you can't read the whole file into memory and
// you're blocking the event loop while this runs
console.log('Copying...');
let block = fs.readFileSync("source.bin");
console.log('Size: ' + block.length);
fs.writeFileSync("destination.bin", block);
console.log('Done.');

// good
console.log('Copying...');
fs.createReadStream('source.bin')
    .pipe(fs.createWriteStream('destination.bin'))
    .on('close', () => { console.log('Done.'); });
```

<br>

Remember:

- <b>Managing I/O in Node involves managing data events bound to data streams</b>

- Stream objects are instances of `EventEmitter` & are representations of data<br>
flows that we can read/write to

- A stream is just a sequence - a buffer - of bytes, of 0 or greater length

- Typically, network I/O in Node is going to be handled with one particular<br>
Stream implementation: the HTTP module

<br>

Node's Stream module is the preferred way to manage asynchronous data streams, since it handles the
data buffers and stream events so the implementer doesn't have to. In addition to byte streams -
chunking memory through streams, passing serialized data like streaming media - there are also
<b>object streams</b> - Javascript objects, structured like JSON.

<br>

### Implementing `Readable` Streams
These are Streams that produce data that another process may want.

<b>NOTE:</b> every `Readable` implementation MUST provide a `private _read` method that services the `public
read` method exposed to the API. Further, the `readable` event is emitted as long as data is being
pushed to the stream to alert the consumer to check for new data via the `read` method of `Readable`.

- you should carefully consider how volume is managed along the stream to<br>
avoid exceeding memory

- all stream implementations should be aware of and respond to `push` operations,<br>
and if it returns `false`, the implementation should cease reading from the<br>
source and `push`ing until the next `_read`

<br>

Parsed from `streams/Readable.js`:

Scenario:

- create a `Feed` object, its instance inheriting the `Readable` stream interface

- implement abstract `_read` method of `Readable` to push data to a consumer until<br>
there's nothing left to push

- trigger `Readable` stream to send an `end` event with `null`

<br>

Readable with defaults
```javascript
const stream = require('stream');
let Feed = function (channel) {
    /** inheritance */
    let readable = new stream.Readable({ /* defaults */ });
    /** passed as chunks of bytes */
    let news = [
        "Big Win!",
        "Stocks Down!",
        "Actor Sad!"
    ];
    /** abstract implementation */
    readable._read = () => {
        if (news.length) {
            return readable.push(news.shift() + "\n");
        }
        /** end trigger */
        readable.push(null);
    };
    return readable;
};
/** instantiation */
let feed = new Feed();
feed.on("readable", () => {
    let data = feed.read();
    data && process.stdout.write(data);
)};
feed.on("end", () => console.log("No more news"));
/** chunked bytes */
// Big Win!
// Stocks Down!
// Actor Sad!
// No more news
```

<br>

Readable with objects
```javascript
const stream = require('stream');
let Feed = function(channel) {
    /** inheritance */
    let readable = new stream.Readable({
        objectMode : true
    });
    /** passed as objects */
    let prices = [{price : 1},{price : 2}];
    /** abstract implementation */
    readable._read = () => {
        if (prices.length) {
            return readable.push(prices.shift());
        }
        readable.push(null);
    };
    return readable;
};
let feed = new Feed();
feed.on("readable", () => {
    let data = feed.read();
    data && console.log(data);
});
feed.on("end", () => console.log("No more"));
/** objects */
// { price: 1 }
// { price: 2 }
// No more news
```

<br>

### Implementing `Writable` Streams
These are responsible for accepting some value (byte stream, string) and writing that data to a
destination. Example: streaming data into a file container.

<b>NOTE:</b> every `Writable` implementation MUST provide a `_write` handler which will be passed
the arguments sent to the `write` method of instances.

- think of these as a data target

- Stream will emit a `drain` event when its safe to write again should `write`<br>
return false ( the 'stream of water' is about to overflow, stop pouring more<br>
water into it until it drains ).

- respect warnings emitted by write events

- wait for the drain

<br>

Parsed from `streams/Writable.js`:

Scenario:

- create a `Writeable` stream with a `highWaterMark` value of 10 bytes to be<br>
conscious of data size

- push a string of data to `stdout` larger than the `highWaterMark` a few times

- catch buffer overflows & wait for drain events to fire before re-engaging


<br>

Writable with default string conversion
```javascript
const stream = require('stream');
let writable = new stream.Writable({
    highWaterMark: 10
});
writable._write = (chunk, encoding, callback) => {
    process.stdout.write(chunk);
    callback();
};

/**
 * for every write event, check if the stream write action
 * returned false, wait for next drain before running
 * the wright method again
 */
function writeData(iterations, writer, data, encoding, cb) {
    (function write() {
        if (!iterations--) {
            return cb()
        }
        if (!writer.write(data, encoding)) {
            console.log(` <wait> highWaterMark of ${writable.writableHighWaterMark} reached...`);
            writer.once('drain', write);
        }
    })()
}
writeData(4, writable, 'String longer than highWaterMark', 'utf8', () => console.log('finished'));
```

<br>

### Implementing `Duplex` Streams
These are both readable and writable. Demonstration of an implementation that combines independent
processes. Most common example being a Node TCP server.

- options for this implementation are the `Readable` and `Writable` options<br>
combined with no additions

- because of ^ that ^ any implementation will need `_write` and `_read` methods

<br>

Parsed from `streams/Duplex.js`

```javascript
// note to self: unhandled error event on connection break

const stream = require("stream");
const net = require("net");

/**
 * return us a server, which will also return an instance
 * of the server's socket, which is the actual Duplex stream
 */
net.createServer(socket => {
    /** tell the connected client to do something */
    socket.write("Type something now\n");
    socket.setEncoding("utf8");
    socket.on("readable", function() {
        /** tell the host process something else */
        process.stdout.write(this.read());
    });
}).listen(8080);
```

<br>

### Transforming ( `Transform` ) streams
On the fly data stream transformations, `Transform`'s act as a `Duplex` between a `Readable` and
`Writable` stream.

- initialized with `Duplex` stream options, except the only method a custom<br>
implementation needs to provide is a `_transform` method

- the `_transform` method receives three arguments: the sent buffer, an ( optional )<br>
character encoding argument, a callback to call after transformation is complete

<br>

Take note of the dead simple usage of `pipe`:
```javascript
// convert ASCII codes to corresponding characters
const stream = require('stream');
let converter = new stream.Transform();
converter._transform = function (num, encoding, callback) {
    this.push(String.fromCharCode(new Number(num)) + "\n");
    callback();
};
process.stdin.pipe(converter).pipe(process.stdout);
// $ 65
// > A
// $ 66
// > B
// $ 257
// > ā
```

<br>

Another implementation of `Transform` streams are `PassThrough` streams. They're in essence the exact
same, except for two items of note: there's no transformations taken place and there's no requirements
to include an abstract base class. The only upside being that you can easily use `pipe` to toss
data around.

```javascript
// an event spy using a PassThrough stream
const fs = require('fs');
const stream = require('stream');
const spy = new stream.PassThrough();

spy
.on('error', (err) => console.error(err))
.on('data', function (chunk) {
    console.log(`spied data -> ${chunk}`);
})
.on('end', () => console.log('\nsomething finished'));
// place the watcher onto a stream
fs.createReadStream('./passthrough.txt').pipe(spy).pipe(process.stdout);
```

<br>

### HTTP - Create Server
HTTP: stateless data transfer protocol on a request/response model.

```javascript
const http = require('http');

/**
 * createServer() returns an object, http.Server, an
 * extension of EventEmitter that broadcasts network events
 * as they occur such as client connection or request
 */
let server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write("PONG");
    response.end();
}).listen(8080);

server.on("request", (request, response) => {
    request.setEncoding("utf8");
    request.on("readable", () => console.log(request.read()));
    request.on("end", () => console.log("DONE"));
});
```
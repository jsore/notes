# Part 1 - Getting Up To Speed With Node.js


- CLI Node.js code
- Microservices
- Proper code structure (module-based structures)
- Using 3rd party NPM modules
- ECMAScript updates
<br>

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


<br>


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


<br>


<hr>


/**
 * ./lovechild.js
 */

process.on("message", (m) => {
    /** child got a message down from the parent */
    console.log("Parent said: ", m);
    /** send message up to the parent */
    process.send("I love you too");
});
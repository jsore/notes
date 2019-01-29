/**
 * ./example.js
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
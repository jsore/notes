/**
 * streams/Writable.js
 */

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
        /**
         * "if there's no iterations after subtracting
         * the current value"
         */
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

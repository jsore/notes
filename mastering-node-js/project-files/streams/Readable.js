/**
 * streams/Readable.js
 *
 * demonstrating methods of implementing Readable Streams
 *
 * ALL Readable implementations must provide a private _read
 * method that services the public read method the API exposes!
 */

/*----------  Readable with defaults  ----------*/
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
    /**
     * the readable event is emitted as long as data is being
     * pushed to the stream, accesses private _read method
     */
    return readable;
};
/** instantiation */
let feed = new Feed();
feed.on("readable", () => {
    let data = feed.read();
    data && process.stdout.write(data);
)};
feed.on("end", () => console.log("No more news"));
// Big Win!
// Stocks Down!
// Actor Sad!
// No more news


/*----------  Readable with objects  ----------*/
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

/** ../networking/lib/ldj-client.js */

/** set up LDJClient inheritance from EventEmitter */
const EventEmitter = require('events').EventEmitter;

/** new class extending const EventEmitter */
class LDJClient extends EventEmitter {

    /**
     * constructor will append incoming data chunks to a running
     *   buffer string while scanning and breaking data on \n
     *   using the stream object to emit data events
     */
    constructor(stream) {

        /** call super() to invoke extended class's constructor */
        super();

        /** capture incoming data */
        let buffer = '';

        /** handle the incoming data events */
        stream.on('data', data => {
            /**
             * append raw data to end of buffer then, starting from
             *   the front backwards, look for complete messages
             */
            buffer += data;
            let boundary = buffer.indexOf('\n');
            /**
             * JSON.parse each message string and emit as message
             *   event by LDJclient via this.emit
             */
            while (boundary !== -1) {
                const input = buffer.substring(0, boundary);
                buffer = buffer.substring(boundary + 1);
                this.emit('message', JSON.parse(input));
                boundary = buffer.indexOf('\n');
            }
        });
    }
    /**
     * add static method called connect, now the new operator doesn't
     *   need to be used to create an instance of LDJClient
     */
    static connect(stream) {
        /** give whoever request()'s this our class using a socket data event when calling */
        return new LDJClient(stream);
    }
}
/** expose our new class as a module for upstream use */
module.exports = LDJClient;


/**
 * So, to use this module, you could do
 *   const LDJClient = require('./lib/ldj-client.js');
 *   const client = new LDJClient(networkStream);
 *
 * Or, using the connect method
 *   const client = require('./lib/ldj-client.js').connect(networkStream);
 */
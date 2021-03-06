/** Mocha test for ./lib/ldj-client.js */

'use strict';

/** makes comparing values easier */
const assert = require('assert');

/** bring in the thing we want to test (LDJClient) and supporting packages */
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client.js');

/**
 * Mocha's `describe` method to create a named context for our LDJClient tests
 */
describe('LDJClient', () => {
    /** inside the 2nd argument to 'describe' method, the test content */

    /** for the appropriate EventEmitter, a synthetic 'stream' */
    let stream = null;
    /** for LDJClient instance 'client' */
    let client = null;
    /** then give fresh instances to those vars */
    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    /** testing a specific class behavior */
    /** test 1, emit message for message received as 1 event */
    it('should emit a message event from a single data event', done => {
        /** invoking done() callback that Mocha provides when test is done... */

        /** set up a message event handler... */
        client.on('message', message => {
            /** handler uses assert's deepEqual method for ensuring match */
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });

        /** make the synthetic stream emit a data event, will fire the message handler */
        stream.emit('data', '{"foo":"bar"}\n');
    });

    /** test 1, emit message for message received as multiple events */
    it('should emit a message event from split data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":');

        /** similar to setTimeout(0) */
        process.nextTick(() => stream.emit('data', '"bar"}\n'));
    });
});
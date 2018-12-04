/**
 * Distributes requests to pool of workers, master process opens
 *   ROUTER/DEALER sockets and binds workers and endpoints for
 *   the clients of the service to connect to
 */

'use strict';
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {

    /** master process creates ROUTER/DEALER sockets, binds endpoints */
    const router = zmq.socket('router').bind('tcp://127.0.0.1:60401');
    /** will create filer-dealer.ipc if not created already */
    const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc'); /** "Inter-process Connection" */

    /** forward messages ROUTER >> DEALER and DEALER >> ROUTER */
    router.on('message', (...frames) => dealer.send(frames));
    dealer.on('message', (...frames) => router.send(frames));

    /** listen for new workers */
    cluster.on('online',
        worker => console.log(`Worker ${worker.process.pid} is online`));

    /** each CPU gets a forked worker */
    for (let i=0; i<numWorkers; i++) {
        cluster.fork();
    }

} else {

    /** workers create a REP socket connected to DEALER */
    const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

    responder.on('message', data => {

        /** parse the inbound message */
        const request = JSON.parse(data);
        console.log(`${process.pid} received request for: ${request.path}`);

        /** read file and reply with content */
        fs.readFile(request.path, (err, content) => {
            console.log(`${process.pid} sending response`);
            responder.send(JSON.stringify({
                content: content.toString(),
                timestamp: Date.new(),
                pid: process.pid
            }));
        });
    });
}
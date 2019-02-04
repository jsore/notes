/**
 * http/http-post.js
 */

const http = require('http');
const qs = require('querystring');

http.createServer((request, response) => {
    let body = " ";
    /** root path, so the form is needed */
    if (request.url === "/") {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        /** set the form to POST sometext to path /submit */
        return response.end(
            '<form action="/submit" method="post">\
            <input type="text" name="sometext">\
            <input type="submit" value="Send some text">\
            </form>'
        );
    }
    /** posted path, so the data needs parsing */
    if (request.url === "/submit") {
        /** POST has begun a Readable stream, grab it */
        request.on('readable', () => {
            let data = request.read();
            /** return new content and concat the rest */
            data && (body += data);
        });
        /** once POST's _read sends null, echo what POST'ed */
        request.on('end', () => {
            let fields = qs.parse(body);
            response.end(`Thanks for sending: ${fields.sometext}`);
        });
    }
}).listen(8080);
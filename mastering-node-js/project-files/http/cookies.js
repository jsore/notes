/**
 * http/cookies.js
 */

const http = require('http');
const url = require('url');

let server = http.createServer((request, response) => {
    /** cookie value of request header's key/value mappings */
    let cookies = request.headers.cookie;

    /** if no cookies found for domain, create one */
    if (!cookies) {
        /** name it and give it a value */
        let cookieName = "session";
        let cookieValue = "123456";
        /** expire the cookie after 4 days from today */
        let numberOfDays = 4;
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + numberOfDays);

        /**
         * we've set this cookie for the first time, use
         * HTTP 302 Found (redirect) to tell the client
         * to call the server again
         */
        let cookieText = `${cookieName}=${cookieValue};expires=${expiryDate.toUTCString()};`;
        response.setHeader('Set-Cookie', cookieText);
        response.writeHead(302, {'Location': '/'});
        /** we used request, so verbosely end() */
        return response.end();
    }

    /** there will now always be a cookie for this domain */
    cookies.split(';').forEach(cookie => {
        let m = cookie.match(/(.*?)=(.*)$/);
        cookies[m[1].trim()] = (m[2] || '').trim();
    });

    /**
     * end the connection after printing this string to a
     * web browser pointed to http://localhost:8080
     */
    response.end(`Cookie set: ${cookies.toString()}`);  // Cookie set: session=123456
}).listen(8080);
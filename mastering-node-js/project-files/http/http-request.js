/**
 * http/http-request.js
 */

/** fetch HTML front page of example.org */
const http = require('http');
http.request({
    host: 'www.example.org',
    method: 'GET',
    path: "/"
}, function (response) {
    response.setEncoding("utf8");
    /** open a Readable stream */
    response.on("readable", () => console.log(response.read()));
}).end();


/*----------  or, use Node's shortcut  ----------*/
http.get("http://www.example.org", response => {
    console.log(`Status: ${response.statusCode}`);
}).on('error', err => {
    console.log("Error: " + err.message);
});
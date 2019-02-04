/**
 * http/http-stream/server.js
 */

/*
jsdom.env({
    ...
    // client sends querystring arguments indicating values for the graph
    // server generates the virtual dom using jsdom
    // the D3 graphics library is inserted into the jsdom DOM
    // pie.js takes the values received and draws the SVG chart using D3 inside the jsdom DOM
    // grab the SVG code and convert it to PNG using ImageMagick
    // cache that, storing the PNG with a filenmae formed from cache values as cashKey
    // while writing that cached file stream the PNG to the client
    html : `<!DOCTYPE html><div id="pie" style="width:${width}px;height:${height}px;"></div>`,
    scripts : ['d3.min.js','d3.layout.min.js','pie.js'],
    ...
})
*/

/** bring everything in */
const http = require('http');
const url = require('url');
//const jsdom = require('jsdom/lib/old-api.js');
const jsdom = require('jsdom');
const spawn = require('child_process').spawn;
const fs = require('fs');
const stream = require('stream');
let width = 200;
let height = 200;

/** remember to always end() your requests */
var writer = (request, response) => {

    /** handle the inevitable favicon GET */
    if (request.url === '/favicon.ico') {
        response.writeHead(200, {
            'Content-Type': 'image/x-icon'
        });
        return response.end();
    }

    /** get the slices of pie sent via querystring by client */
    let values = url.parse(request.url, true).query['values'].split(",");
    /** create an ID of organized values because 2+3+1 == 1+2+3 */
    let cacheKey = values.sort().join('.');

    /** begin rendering then send or send pre-rendered data */
    fs.exists(cacheKey, exists => {
        response.writeHead(200, {
            'Content-Type': 'image/png'
        });

        /** handle the cache and send already rendered PNGs */
        if (exists) {
            /** start broadcasting a Readable stream for GET */
            fs.createReadStream(cacheKey)
            /** we want a blocked 'this' scope, so no arrow func */
            .on('readable', function() {
                let chunk;
                /** keep reading until _read sends null... */
                while(chunk = this.read()) {
                    /** ...while writing to client */
                    response.write(chunk);
                }
            })
            .on('end', () => response.end());
            return;
        }

        /** PNG doesn't exist, spin up a jsdom DOM */
        jsdom.env({
            features: {
                QuerySelector : true
            },
            html : `<!DOCTYPE html><div id="pie" style="width:${width}px;height:${height}px;"></div>`,
            scripts : ['d3.min.js', 'd3.layout.min.js', 'pie.js'],
            /** begin rendering to that DOM */
            done : (err, window) => {
                let svg = window.insertPie("#pie", width, height, values).innerHTML;
                /** begin new child_process to use ImageMaker */
                let svgToPng = spawn("convert", ["svg:", "png:-"]);
                /** begin new Writeable stream to cache the file */
                let filewriter = fs.createWriteStream(cacheKey);

                filewriter.on("open", err => {
                    /** set up a Readable and Writable stream */
                    let streamer = new stream.Transform();

                    streamer._transform = function(data, enc, cb) {
                        /**
                         * expecting input from stdout of the ImageMagick
                         * stream, write that data to the filesystem...
                         */
                        filewriter.write(data);
                        /**
                         * ...then re-push that data back into the
                         * streamer stream...
                         */
                        this.push(data);
                        /**
                         * ...keep repeating this until there's nothing
                         * left to write to the stream streamer...
                         */
                        cb();
                    };
                    /**
                     * ...pipe what you've written in the streamer
                     * stream to stdout which is then piped further
                     * on to the response stream (stream chaining)
                     */
                    svgToPng.stdout.pipe(streamer).pipe(response);
                    svgToPng.stdout.on('finish', () => response.end());

                    // jsdom lowercase's element names
                    svg = svg.replace(/radialgradient/g,'radialGradient');

                    svgToPng.stdin.write(svg);
                    svgToPng.stdin.end();
                    window.close();
                });
            }
        });
    })
}
http.createServer(writer).listen(8080);
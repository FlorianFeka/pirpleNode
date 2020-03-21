/*
 * Primary file for the API
 *
 */

// Dependecies
var http = require('http');
var url = require('url');

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {

    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log('Request received on path: ' + trimmedPath);

    // Send the response
    res.end('Hello World!');

    // Log the request Path

});


// start the server, and have it listen on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 ...");
});
/*
 * Primary file for the API
 *
 */

// Dependecies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiate the HTTP Server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function() {
    console.log(`The server is listening on port ${config.httpPort} ...`);
});

// Instantiate the HTTPS Server
var httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});

// Start the HTTPS Server
httpsServer.listen(config.httpsPort, function() {
    console.log(`The server is listening on port ${config.httpsPort} ...`);
});

// All the server logic for both http and https server
var unifiedServer = function(req, res) {
    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the Http Method
    var method = req.method.toUpperCase();

    // Get the heasders as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        // choose hander this request goes to, choose the not Found hander if none is found
        var choosedHandler = router[trimmedPath] !== undefined ? router[trimmedPath] : handlers.notFound;

        var data = {
            trimmedpath: trimmedPath,
            queryStringObejct: queryStringObject,
            method: method,
            headers: headers,
            payload: buffer
        };

        // Route the request to the handler specified in the router
        choosedHandler(data, function(statusCode, payload) {
            // use the status code by the handler or default 200
            statusCode = typeof statusCode == 'number' ? statusCode : 200;

            // use the payload by the handler or default empty object
            payload = typeof payload == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //return the response;
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request Path
            console.log('Request received with this payload :\n' + buffer);

            // Log the response payload
            console.log('Returning this payload :\n' + statusCode, JSON.stringify(payload, null, 4));
        });
    });
};

// define handlers

var handlers = {};

handlers.sample = function(data, callback) {
    // Callback a http status and a payload object
    callback(406, { name: 'samplehander' });
};

handlers.notFound = function(data, callback) {
    callback(404);
};

// define a request router
var router = {
    sample: handlers.sample
};

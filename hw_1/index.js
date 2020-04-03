const http = require('http');
var url = require('url');

const server = http.createServer(function(req, res) {
    // Get the path
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Select a handler
    handler = handlers[trimmedPath] !== undefined ? handlers[trimmedPath] : handlers.notFound;

    // Execute selected handler
    handler(function(statusCode, payload) {
        statusCode = typeof statusCode == 'number' ? statusCode : 500;

        var stringPayload = JSON.stringify(payload);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(stringPayload);
    });
});

server.listen(3000, function() {
    console.log('Server started on port 3000 ...');
});

var handlers = {};

handlers.hello = function(callback) {
    callback(200, { welcomeMessage: 'Do what I do. Hold tight and pretend it’s a plan!' });
};

handlers.notFound = function(callback) {
    callback(404);
};

var router = {
    hello: handlers.hello
};

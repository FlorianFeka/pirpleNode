/*
 * Request handlers
 *
 */

//Dependendies
var _data = require('./data');
var helpers = require('./helpers');

// define handlers
var handlers = {};

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method.toLowerCase()) > -1) {
        handlers._users[data.method.toLowerCase()](data, callback);
    } else {
        callback(405);
    }
};

// Container for user submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
    // Check that all required fields are filled out
    var firstName = helpers.validateString(data.payload.firstName);
    var lastName = helpers.validateString(data.payload.lastName);
    var phone = typeof data.payload.phone == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = helpers.validateString(data.payload.password);
    var tosAgreement = typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashedPassword: hashedPassword,
                        tosAgreement: true,
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { error: 'Could not create the new user' });
                        }
                    });
                } else {
                    callback(500, { error: "Could not hash the user's password" });
                }
            } else {
                callback(400, { error: 'A user with that phone number already exists' });
            }
        });
    } else {
        callback(400, { error: 'Missing required fields' });
    }
};

// Users - get
// Required data: phone
// Optional data: none
// TODO Only let an authenticated user access theior object
handlers._users.get = function (data, callback) {
    // Check that the phone number provided is valid
    var phone = typeof data.queryStringObject.phone == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup user
        _data.read('users', phone, function (err, data) {
            if (!err) {
                // Remove the hashed passord before returning it to the requester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { error: 'Missing required fields' });
    }
};

// Users - put
// Users data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// TODO Only let authenticated user update their own object
// TODO Pirple left of "41:00"
handlers._users.put = function (data, callback) {};

// Users - delete
handlers._users.delete = function (data, callback) {};

// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;

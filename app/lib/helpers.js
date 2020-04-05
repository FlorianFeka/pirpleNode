/*
 * Helpers for various tasks
 *
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container for all the helpers
var helpers = {};

//Create a SHA256 has
helpers.hash = function (string) {
    if (typeof string == 'string' && string.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Pase a JSON string to an object in all cases without trowing
helpers.parseJsonToObject = function (string) {
    try {
        var obj = JSON.parse(string);
        return obj;
    } catch (e) {
        return {};
    }
};

helpers.validateString = function (string) {
    return typeof string == 'string' && string.trim().length > 0 ? string.trim() : false;
};

module.exports = helpers;

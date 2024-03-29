/*
 *Library for storing and editing data
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for the Module
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
    // Open the file for writing (we use 'wy' so an error is return when the file DOES exisit)
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string
            var stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', function (err, data) {
        if (!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

// Update data inside a file
lib.update = function (dir, file, data, callback) {
    // open the file for writing (we use 'r+' so an error is return when the file DOES NOT exists)
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string
            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor, function (err) {
                if (!err) {
                    // write to the file an close it
                    fs.writeFile(fileDescriptor, stringData, function (err) {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            });
                        } else {
                            callback('Error wring to exisiting file');
                        }
                    });
                } else {
                    callback('error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
};

// Delete a file
lib.delete = function (dir, file, callback) {
    // Unlinke the file from the file system
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, function (err) {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};

module.exports = lib;

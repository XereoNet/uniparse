var properties  = require('properties');
var _           = require('lodash');
var EXTS        = ['properties'];

function readConfig(file, options, cb) {
    options.path = true;
    properties.parse(file, options, function (err, object) {
        if (err) {
            return cb(err);
        }
        cb(null, object);
    });
}

function writeConfig(file, object, options, cb) {
    options.path = file;

    if (options.extend) {
        // Extend the config file
        readConfig(file, options, function (err, fileObject) {
            if (err) {
                return cb(err);
            }
            _.extend(fileObject, object);
            properties.stringify(fileObject, options, function (err) {
                cb(err);
            });
        });
    } else {
        properties.stringify(object, options, function (err) {
            cb(err);
        });
    }
}

function parseConfig(string, options, cb) {
    if (typeof string !== 'string') {
        return cb(new Error('First argument must be a string when using ' + 
            'the data option.'));
    }
    properties.parse(string, options, function (err, object) {
        if (err) {
            return cb(err);
        }
        cb(null, object);
    });
}

function stringifyConfig(object, options, cb) {
    var str = properties.stringify(object, options);

    if (!str) {
        return cb(new Error('Invalid object provided.'));
    }
    cb(null, str);
}

module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig,
    parseConfig: parseConfig,
    stringifyConfig: stringifyConfig,
    extensions: EXTS
};

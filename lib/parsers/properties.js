var properties  = require('properties');
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
    properties.stringify(object, options, function (err) {
        cb(err);
    });
}

function parseConfig(string, options, cb) {
    properties.parse(file, options, function (err, object) {
        if (err) {
            return cb(err);
        }
        cb(null, object);
    });
}

function stringifyConfig(object, options, cb) {
    properties.stringify(object, function (err) {
        cb(err);
    });
}

module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig,
    parseConfig: parseConfig,
    stringifyConfig: stringifyConfig,
    extensions: EXTS
};

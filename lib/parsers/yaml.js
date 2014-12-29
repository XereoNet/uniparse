var yaml        = require('js-yaml');
var fs          = require('fs');
var _           = require('lodash');
var EXTS        = ['yaml', 'yml'];

function parseConfig(string, options, cb) {
    if (typeof string !== 'string') {
        return cb(new Error('First argument must be a string when using ' + 
            'the data option.'));
    }
    try {
        var object = yaml.safeLoad(string, options);
        cb(null, object);
    } catch (err) {
        return cb(err);
    }
}

function stringifyConfig(object, options, cb) {
    try {
        var string = yaml.safeDump(object, options);
        cb(null, string);
    } catch (err) {
        return cb(err);
    }
}

function readConfig(file, options, cb) {
    fs.readFile(file, function (err, data) {
        if (err) {
            return cb(err);
        }
        data = data.toString('UTF8');
        parseConfig(data, options, cb);
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
            options.extend = false;
            writeConfig(file, fileObject, options, cb);
        });
    } else {
        stringifyConfig(object, options, function (err, string) {
            if (err) {
                return cb(err);
            }
            fs.writeFile(file, string, cb);
        });
    }
}


module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig,
    parseConfig: parseConfig,
    stringifyConfig: stringifyConfig,
    extensions: EXTS
};

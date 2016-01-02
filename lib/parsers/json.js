var fs          = require('fs');
var _           = require('lodash');
var json_honey  = require('json-honey');
var EXTS        = ['json'];

function parseConfig(string, options, cb) {
    if (typeof string !== 'string') {
        return cb(new Error('First argument must be a string when using ' + 
            'the data option.'));
    }
    try {
        var object = JSON.parse(string);
        cb(null, object);
    } catch (err) {
        return cb(err);
    }
}

function stringifyConfig(object, options, cb) {
    try {
        if (options.pretty) {
            cb(null, json_honey(object, options));
        } else {
            var string = JSON.stringify(object);
            cb(null, string);
        }
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
    if (options.pretty !== false) {
        options.pretty = true;
    }
    if (options.extend) {
        // Extend the config file
        readConfig(file, options, function (err, fileObject) {
            if (err && err.code !== 'ENOENT') {
                return cb(err);
            }
            fileObject = _.extend({}, fileObject, object);
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

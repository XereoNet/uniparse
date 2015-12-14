var properties  = require('properties');
var path        = require('path');
var _           = require('lodash');
var EXTS        = ['properties', 'ini'];

function extendINI(file, options) {
    var extension = options.extension || options.ext ||
        (file) ? path.extname(file) : '';
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }
    if (extension === 'ini') {
        options.sections = true;
        options.strict = true;
        options.comments = ';';
        options.separators = '=';
    }

    return options;
}

function readConfig(file, options, cb) {
    options = extendINI(file, options);
    options.path = true;
    properties.parse(file, options, function (err, object) {
        if (err) {
            return cb(err);
        }
        cb(null, object);
    });
}

function writeConfig(file, object, options, cb) {
    options = extendINI(file, options);

    options.path = file;

    if (options.extend) {
        // Extend the config file
        readConfig(file, _.clone(options), function (err, fileObject) {
            if (err) {
                return cb(err);
            }
            _.extend(fileObject, object);
            properties.stringify(fileObject, _.clone(options), function (err) {
                cb(err);
            });
        });
    } else {
        properties.stringify(object, _.clone(options), function (err) {
            cb(err);
        });
    }
}

function parseConfig(string, options, cb) {
    if (typeof string !== 'string') {
        return cb(new Error('First argument must be a string when using ' +
            'the data option.'));
    }
    options = extendINI(null, options);
    properties.parse(string, options, function (err, object) {
        if (err) {
            return cb(err);
        }
        cb(null, object);
    });
}

function stringifyConfig(object, options, cb) {
    options = extendINI(null, options);
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

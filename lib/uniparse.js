var _       = require('lodash');
var path    = require('path');
var fs      = require('fs');

var extensions = [];
var files = fs.readdirSync(path.join(__dirname, 'parsers'));

var parsers = {};
files.forEach(function (file) {
    parsers[file] = require('./parsers/' + file);
    extensions = extensions.concat(parsers[file].extensions);
});


function readConfig(file, options, cb) {
    if (options instanceof Function) {
        cb = options;
        options = {};
    }
    options = options || {};
    var extension = options.extension || options.ext || path.extname(file);
    if (!extension) {
        return cb(new Error("No filetype defined."));
    }
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }

    var parser = getParser(extension);
    if (!parser) {
        return cb(new Error('Filetype not supported. Please check ' + 
            'uniparse.extensions for supported extensions.'));
    }

    parser.readConfig(file, options, cb);
}

function writeConfig(file, data, options, cb) {
    if (options instanceof Function) {
        cb = options;
        options = {};
    }
    options = options || {};

    var extension = options.extension || options.ext || path.extname(file);
    if (!extension) {
        return cb(new Error("No filetype defined."));
    }
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }

    var parser = getParser(extension);
    if (!parser) {
        return cb(new Error('Filetype not supported. Please check ' + 
            'uniparse.extensions for supported extensions.'));
    }

    parser.writeConfig(file, data, options, cb);
}

function getParser(ext) {
    for (var p in parsers) {
        if (parsers[p].extensions.indexOf(ext) !== -1) {
            return parsers[p];
        }
    }

    return null;
}

module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig,
    extensions: extensions
};
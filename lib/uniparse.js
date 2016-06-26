'use strict';
const path    = require('path');
const fs      = require('fs');

const extensions = [];
const files = fs.readdirSync(path.join(__dirname, 'parsers'));

const parsers = {};
files.forEach(function (file) {
    parsers[file] = require('./parsers/' + file);
    extensions = extensions.concat(parsers[file].extensions || []);
});

function getParser(ext) {
    for (let p in parsers) {
        if (parsers.hasOwnProperty(p) &&
            (parsers[p].extensions || []).indexOf(ext) !== -1) {
            return parsers[p];
        }
    }

    return null;
}

function readConfig(file, options, cb) {
    if (options instanceof Function) {
        cb = options;
        options = {};
    }
    options = options || {};
    let extension = options.extension || options.ext || path.extname(file);
    if (!extension) {
        return cb(new Error('No filetype defined.'));
    }
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }

    const parser = getParser(extension);
    if (!parser) {
        return cb(new Error('Filetype not supported. Please check ' +
            'uniparse.extensions for supported extensions.'));
    }

    if (options.data) {
        parser.parseConfig(file, options, cb);
    } else {
        parser.readConfig(file, options, cb);
    }

}

function writeConfig(file, data, options, cb) {
    if (options instanceof Function) {
        cb = options;
        options = {};
    }
    options = options || {};

    let extension = options.extension || options.ext || path.extname(file);
    if (!extension) {
        return cb(new Error('No filetype defined.'));
    }
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }

    const parser = getParser(extension);
    if (!parser) {
        return cb(new Error('Filetype not supported. Please check ' +
            'uniparse.extensions for supported extensions.'));
    }

    parser.writeConfig(file, data, options, cb);
}

function stringifyConfig(data, options, cb) {
    if (options instanceof Function) {
        cb = options;
        options = {};
    }
    options = options || {};

    let extension = options.extension || options.ext;
    if (!extension) {
        return cb(new Error('No filetype defined.'));
    }
    if (extension.charAt(0) === '.') {
        extension = extension.substr(1);
    }

    const parser = getParser(extension);
    if (!parser) {
        return cb(new Error('Filetype not supported. Please check ' +
            'uniparse.extensions for supported extensions.'));
    }

    parser.stringifyConfig(data, options, cb);
}

module.exports = {
    readConfig: readConfig,
    writeConfig: writeConfig,
    stringifyConfig: stringifyConfig,
    extensions: extensions
};

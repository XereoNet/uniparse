# uniparse

Config parsing library with a unified API for different types of configs.

Supported filetypes:
- Yaml
- Properties
- JSON

## Usage

Install the module:

```
npm install uniparse
```

Use the module:

```javascript
var uniparse = require('uniparse');

var serverConfig = '/path/to/config/file/server.properties';
uniparse.readConfig(serverConfig, function(err, config) {
	// config is a plain JS object. You can easily JSON encode and decode it and no data will be lost.

	config['server-port'] = 25566;
	config['gamemode'] = 1;

	uniparse.writeConfig(serverConfig, config, function(err) {
		// Saved if there is no error
	});
});
```

## API

___uniparse_.readConfig(file[, options], callback)__

Reads a file as a config and returns the object representation via the callback.

- `file` can be either a file path (String) or the file contents as either a String or a Buffer. For the latter please provide the `extension` and `data` properties. `extension` should be the extension of the file (with or without leading dot) and `data` should be set to true.

The options parameter is optional.

Options:

- __data__ - _Boolean_ 
By default `readConfig()` assumes that the first argument is a file path, if you are prividing a String or a Buffer object with the actual config data this option needs to be set to true. When using this option, make sure to also set the `extension` option.

- __extension__ | __ext__ - _String_ 
This option forces a certain extension to be used. When used uniparse will use the parser for this type of file.

Example:

```javascript
uniparse.readConfig('{"some": "JSON", "object": true}', {extension: 'json', data: true}, function(err, object) {});
```

___uniparse_.writeConfig(file, object[, options], callback)__

Writes a config to disk.

Options:

- __extension__ | __ext__ - _String_ 
This option forces a certain extension to be used. When used uniparse will use the parser for this type of file.

- __extend__ - _Boolean_ 
Will extend the config file with the object. This uses `lodash.extend(fileConfig, yourExtension)`. Extend will overwrite properties that are already defined in the original file.

- __pretty__ - _Boolean_ 
Returns a pretty version of the config (where applicable, like JSON). Will prettify by default.

___uniparse_.stringifyConfig(object[, options], callback)__

Stringifies a config object. Useful when sending the config file.

Options:

- __extension__ | __ext__ - _String_
This option forces a certain extension to be used. When used uniparse will use the parser for this type of file.

- __pretty__ - _Boolean_ 
Returns a pretty version of the config (where applicable, like JSON).

## Writing your own parser

- Create a new file in the lib/parsers folder. Make sure to name it something meaningful.
- Make sure to write the following 4 methods:
	- readConfig(file, options, callback) // Options: none - 
	Reads the config from a file.
	- writeConfig(file, data, options, callback) // Options: extend, pretty - 
	Writes the config to a file
	- parseConfig(string, options, callback) // Options: none - 
	Parses the config from a string.
	- stringifyConfig(object, options, callback) // Options: pretty - 
	Converts a plain JS object to a string.
- The methods don't need to worry about undefined parameters, the main program handles those.
- Make sure you pass on the options object to the parsing library, so the user can provide extra options for that too.
- Export a property called `extensions` that includes all the extensions you support (without leading dot).
- Make sure `gulp lint` doesn't throw errors.
- Submit a PR.

## Exceptions to GPLv2 license

If the config format you're coding is proprietary, you are not required to disclose the source.

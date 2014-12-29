# uniparse

Config parsing library with a unified API for different types of configs.

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

Example:

```javascript
uniparse.readConfig('{"some": "JSON", "object": true}', {extension: 'json', data: true}, function(err, object) {});
```

___uniparse_.writeConfig(file, object[, options], callback)__

Writes a config to disk.

## Coming soon

- Extending of configs
- More file types
#logging-factory
===========

A factory wrapping around tracer to facilitate handling of logging to a log file and replacing the standard 'console.XXX' print functions with those from tracer.

## Installation
-----
```javascript
npm install logging-factory --save
```

## Usage
-----
```javascript
var LF = require('logging-factory')({level:'info',color:true,file:'mylog.log'});

level : a log level compatible with tracer -> [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ]
color : boolean to set of you want colors (colors are removed from lines outputted to a log file)
file  : a file to log to

Now 'console.XXX' functions are replaced with thos from tracer.
They are also accessible through global variable 'LOGGER'

Th returned object has a close function in case the process handlers are being called.
```

## Release History
-----

* 0.0.2 Add close handler
* 0.0.1 Initial Release

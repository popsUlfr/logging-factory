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
var LF = require('logging-factory')({level:'info',color:true,file:'logfile',filemode:'0600'})

level : a log level compatible with tracer -> [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ], default is 'log'
color : boolean to set of you want colors (colors are removed from lines outputted to a log file), default is false
file : a file to log to, default is none
filemode : chmod compatible file mode, default is '0600'

Returns an object with a close function in case the process handlers are not getting called

Now 'console.XXX' functions are replaced with those from tracer.
They are also accessible through global variable 'LOGGER'
```

## Release History
-----

* 0.0.4 Add filemode option and set console.log to tracer.log
* 0.0.2 Add close handler
* 0.0.1 Initial Release

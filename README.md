logging-factory
===============

A factory wrapping around tracer to facilitate handling of logging to a log file and replacing the standard 'console.XXX' print functions with those from tracer.

## Installation

  npm install logging-factory --save

## Usage

  require('logging-factory')({level:'info',color:true,file:'mylog.log'});

  level : a log level compatible with tracer -> [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ]
  color : boolean to set of you want colors (colors are removed from lines outputted to a log file)
  file  : a file to log to

  Now 'console.XXX' functions are replaced with thos from tracer.
  They are also accessible through global variable 'LOGGER'

## Release History

* 0.0.1 Initial Release

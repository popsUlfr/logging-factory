/**
 * Created by Philipp Richter on 07/10/15.
 *
 * Usage:
 * var LF = require('logging-factory')({level:'info',color:true,file:'logfile'})
 *
 * level : a log level compatible with tracer -> [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ]
 * color : boolean to set of you want colors (colors are removed from lines outputted to a log file)
 * file : a file to log to
 *
 * Returns an object with a close function in case the process handlers are not getting called
 */

function toBoolean (value) {
	return (!(!value
		|| String(value).trim().toLowerCase() === 'off'
		|| String(value).trim().toLowerCase() === 'false'
		|| String(value).trim().toLowerCase() === '0'));
}

var defMethod = 'info';
var methods = [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ];

function getMethod (value) {
	return ((value
	&& methods.indexOf((value = String(value).trim().toLowerCase())) > -1)?value:defMethod);
}

function getFile (value) {
	return ((value && (value = String(value).trim()).length > 0)?value:undefined);
}

function defaultTransport (data) {
	if (data.level === 5) { // tracer error level
		process.stderr.write(data.output + '\n');
	}
	else {
		process.stdout.write(data.output + '\n');
	}
}

module.exports = function (options) {
	process.stderr.write('[#] Start LOGGER\n');
	if (typeof options != 'object') {
		options = {};
	}
	var tracerOptions = {
		level: getMethod(options.level),
		transport: defaultTransport
	};
	var color = toBoolean(options.color);
	var file = getFile(options.file);
	var ret = {
		close: function () {}
	};
	if (file) {
		var fs = require('fs');
		var colors = require('colors/safe');
		try {
			var fd = fs.openSync(file,'a',0600);
			var exitHandler = function (exit, err) {
				if (fd) {
					process.stderr.write('[#] LOGGER closing file : ' + file + '\n');
					try {
						fs.closeSync(fd);
						fd = undefined;
					}
					catch (err) {}
				}
				if (exit) process.exit();
			}
			process.on('exit',exitHandler.bind(null,false));
			process.on('SIGINT',exitHandler.bind(null,true));
			process.on('SIGTERM',exitHandler.bind(null,true));
			process.on('SIGHUP',exitHandler.bind(null,true));
			process.on('uncaughtException', exitHandler.bind(null, true));
			ret.close = exitHandler.bind(null,false);
			process.stderr.write('[#] LOGGER writing to file : ' + file + '\n');
			tracerOptions.transport = function (data) {
				defaultTransport(data);
				try {
					fs.writeSync(fd, colors.strip(data.output) + '\n', null, 'utf8');
				}
				catch (err) {
					process.stderr.write('[#] LOGGER error : ' + err.message + '\n');
				}
			};
		}
		catch (err) {
			process.stderr.write('[#] LOGGER error : ' + err.message + '\n');
		}
	}
	if (color) {
		global.LOGGER = require('tracer').colorConsole(tracerOptions);
	}
	else {
		global.LOGGER = require('tracer').console(tracerOptions);
	}
	global.console.log = global.LOGGER.info;
	global.console.info = global.LOGGER.info;
	global.console.warn = global.LOGGER.warn;
	global.console.error = global.LOGGER.error;
	global.console.debug = global.LOGGER.debug;
	return ret;
};
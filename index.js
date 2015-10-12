/**
 * Created by Philipp Richter on 07/10/15.
 *
 * Usage:
 * var LF = require('logging-factory')({level:'info',color:true,file:'logfile',filemode:'0600'})
 *
 * level : a log level compatible with tracer -> [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ], default is 'log'
 * color : boolean to set of you want colors (colors are removed from lines outputted to a log file), default is false
 * file : a file to log to, default is none
 * filemode : chmod compatible file mode, default is '0600'
 *
 * Returns an object with a close function in case the process handlers are not getting called
 */

function toBoolean (value) {
	return (!(!value
		|| String(value).trim().toLowerCase() === 'off'
		|| String(value).trim().toLowerCase() === 'false'
		|| String(value).trim().toLowerCase() === '0'));
}

var defMethod = 'log';
var defFilemode = '0600';
var methods = [ 'log', 'trace', 'debug', 'info', 'warn', 'error' ];

function getMethod (value) {
	return ((value
	&& methods.indexOf((value = String(value).trim().toLowerCase())) > -1)?value:defMethod);
}

function getNormalizedValue (value) {
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
	var file = getNormalizedValue(options.file);
	var filemode = getNormalizedValue(options.filemode);
	var ret = {
		close: function () {}
	};
	if (file) {
		var fs = require('fs');
		var colors = require('colors/safe');
		try {
			var fd = fs.openSync(file,'a',((filemode)?filemode:defFilemode));
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
			//process.on('uncaughtException', exitHandler.bind(null, true));
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
	global.console.log = global.LOGGER.log;
	global.console.info = global.LOGGER.info;
	global.console.warn = global.LOGGER.warn;
	global.console.error = global.LOGGER.error;
	global.console.debug = global.LOGGER.debug;
	return ret;
};

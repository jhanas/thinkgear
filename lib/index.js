'use strict';

var events = require('events');
var net = require('net');
var util = require('util');
var debug = require('debug')('thinkgear');

//DEBUG=thinkgear node example

// enableRawOutput include raw sensor output in the response
// format the format of data in response

var Thinkgear = function(opts) {

	debug('Creating thinkgear client');

	if (!opts || !opts.appName) {
		throw new Error('error: please provide an app name');
	}

	if (!opts || !opts.appKey) {
		throw new Error('error: please provide an app key');
	}

	this.client = null;

	this.port = opts.port || 13854;
	this.host = opts.host || '127.0.0.1';

	debug('Running on port', this.port);
	debug('Running on host', this.host);

	this.auth = {};
	this.auth.appName = opts.appName;
	this.auth.appKey  = opts.appKey;

	debug('Application name', this.auth.appName);
	debug('Application key', this.auth.appKey);

	this.formats = {};
	this.formats.BinaryPacket = 'BinaryPacket';
	this.formats.Json = 'Json';

	this.config = {};
	this.config.enableRawOutput = (typeof opts.enableRawOutput === 'boolean') ? opts.enableRawOutput : false;
	this.config.format = opts.format || this.formats.Json;

	debug('Config for enable raw output', this.config.enableRawOutput);
	debug('Config for format', this.config.format);

	this.setMaxListeners(0);
	events.EventEmitter.call(this);
};

util.inherits(Thinkgear, events.EventEmitter);

exports.create = function(opts) {
	return new Thinkgear(opts);
};

Thinkgear.prototype.connect = function() {
	var self = this;

	this.client = net.connect(this.port, this.host, function(){
		debug('Sending auth');
		self._send(self.auth);
	});

	this.client.on('data',function(data) {
		self._data(data);
		debug('Data ', data);
	});

	this.client.on('error', function(err) {
		self._error(err);
		debug('Error ', err);
	});

	this.client.on('close', function() {
	    self._close();
	    debug('Closing ');
	});
};

Thinkgear.prototype._send = function(message) {
	this.client.write(JSON.stringify(message));
};

Thinkgear.prototype._data = function(data) {
	try {
		if (this.config.format === 'Json') {
			this.emit('data', JSON.parse(data));
		} else {
			this.emit('data', data);
		}
	} catch(e) {
		debug('Sending config', this.config);
		this._send(this.config);
	}
};

Thinkgear.prototype._error = function(error) {
	this.emit('error', error);
};

Thinkgear.prototype._close = function() {
	this.client.destroy();
};

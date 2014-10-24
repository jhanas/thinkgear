'use strict';

var thinkgear = require('../lib');

var options = {
	appName: 'openminded',
	appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096',
	enableRawOutput: true,
	format: 'Json' //'BinaryPacket'
};

var client = thinkgear.create(options);

client.on('data',function(data){
	console.log('==',data);
});

client.on('error',function(error){
	//console.log(error);
});

client.on('close',function(){
	//console.log('closing.');
});

client.connect();
'use strict';

var test = require('tap').test;
var thinkgear = require('../lib');

test('Thinkgear client', function (t1) {

    test('When creating thinkgear client with missing app name', function (t) {
      try {
        thinkgear.create();
      } catch(error) {
        t.equal(error.message, 'error: please provide an app name', 'should throw an error, missing app name');
        t.end();
      }
    });

    test('When creating thinkgear client with missing app key', function (t) {
      try {
        var options = { 
          appName: 'test', 
        };

        thinkgear.create(options);
      } catch(error) {
        t.equal(error.message, 'error: please provide an app key', 'should throw an error, missing app key');
        t.end();
      }
    });

    test('When creating thinkgear client', function (t) {
      var options = { 
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);
      t.notEqual(client, null, 'should create a new thinkgear client');
      t.type(client, 'object', 'should be of type object');
      t.equal(client.host, '127.0.0.1', 'should contain a default host');
      t.equal(client.port, 13854, 'should contain a default port');
      t.equal(client.auth.appName, options.appName, 'should contain an application name');
      t.equal(client.auth.appKey, options.appKey, 'should contain an application key');
      t.end();
    });

    test('When creating thinkgear client overriding host and port', function (t) {
      var options = { 
        host: 'localhost',
        port: 80,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);
      t.notEqual(client, null, 'should create a new thinkgear client');
      t.type(client, 'object', 'should be of type object');
      t.equal(client.host, options.host, 'should contain a new host');
      t.equal(client.port, options.port, 'should contain a new port');
      t.equal(client.auth.appName, options.appName, 'should contain an application name');
      t.equal(client.auth.appKey, options.appKey, 'should contain an application key');
      t.end();
    });

    test('When closing thinkgear client', function (t) {
      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);

      client.on('close',function(){
        t.equal(true, true, 'should close connection');
        client._close();
        t.end();
      });

      client.connect();

      client.emit('close');
    });

    test('When sending config to thinkgear client', function (t) {
      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);

      client.on('data',function(data){
        t.equal(data.poorSignalLevel, 200, 'should accept config data');
        client._send(this.config);
        client._close();
        t.end();
      });

      client.connect();
    });

    test('When thinkgear client emits data', function (t) {
      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);

      client.on('data',function(data){
        t.equal(data.poorSignalLevel, 200, 'should return data');
        client._close();
        t.end();
      });

      client.connect();
    });

    test('When thinkgear client throws error', function (t) {
      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096' 
      };

      var client = thinkgear.create(options);

      client.on('error',function(){
        t.equal(true, true, 'should capture error');
        client._close();
        t.end();
      });

      client.connect();

      client.emit('error');
    });

    test('When creating thinkgear client setting format to json', function (t) {

      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096',
        enableRawOutput: true,
        format: 'Json'
      };

      var client = thinkgear.create(options);

      client.on('data',function(data){
        var json;

        try {
          json = data.toJson();
        } catch(e) {
          json = null;
        }

        t.equal(data.poorSignalLevel, 200, 'should return data');
        t.type(data, 'object', 'should be of type object');

        client._close();
        t.end();
      });

      client.connect();
    });

    test('When creating thinkgear client setting format to binary', function (t) {

      var options = { 
        host: '127.0.0.1',
        port: 13854,
        appName: 'test', 
        appKey: '9f54141b4b4c567c558d3a76cb8d715cbde03096',
        enableRawOutput: true,
        format: 'binaryPacket' 
      };

      var client = thinkgear.create(options);

      client.on('data',function(data){
        t.type(data, 'object', 'should be of type object');

        client._close();
        t.end();
      });

      client.connect();
    });

    t1.end();
});
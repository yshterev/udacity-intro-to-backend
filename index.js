'use strict';
var Hapi = require("hapi");
var server = new Hapi.Server();
server.connection({ port: 3000 });
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('hello world!');
    }
});
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log("Server running at: " + server.info.uri);
});

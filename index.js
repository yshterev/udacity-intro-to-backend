'use strict';
var Hapi = require("hapi");
var Inert = require("inert");
var server = new Hapi.Server();
server.connection({ port: 3000 });
server.register(Inert, function (err) {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });
});
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log("Server running at: " + server.info.uri);
});

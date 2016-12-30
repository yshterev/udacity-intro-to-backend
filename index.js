'use strict';
var Hapi = require("hapi");
var Inert = require("inert");
var Good = require("good");
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
server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});
server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                            response: '*',
                            log: '*'
                        }]
                }, {
                    module: 'good-console'
                }, 'stdout']
        }
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start(function (err) {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

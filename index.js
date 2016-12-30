'use strict';
var Hapi = require("hapi");
var Good = require("good");
var Vision = require("vision");
var Handlebars = require("handlebars");
// create new server instance
var server = new Hapi.Server();
// setup host and port
server.connection({
    port: Number(process.argv[2] || 3000),
    host: 'localhost'
});
// register vision to your server instance
server.register(Vision, function (err) {
    if (err) {
        throw err;
    }
    // configure template support
    server.views({
        engines: {
            html: {
                module: Handlebars,
                isCached: false
            }
        },
        isCached: false,
        relativeTo: __dirname,
        path: './views',
        layout: true,
        layoutPath: './views/layout',
        partialsPath: './views/partials'
    });
});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var data = {
            title: 'My homepage',
            message: 'Hello from Future Studio'
        };
        reply.view('index', data);
    }
});
server.register({
    register: Good,
    options: {
        reporters: {
            console: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                            response: '*',
                            log: '*'
                        }]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ]
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

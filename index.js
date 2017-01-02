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
    host: '192.168.1.102'
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
        path: './views/pages',
        layout: true,
        layoutPath: './views/layout',
        partialsPath: './views/partials'
    });
});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
        var data = {
            title: 'My homepage',
            message: "Hello " + name
        };
        reply.view('index', data);
    }
});
server.route({
    method: 'GET',
    path: '/unit2/rot13',
    handler: function (request, reply) {
        var name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
        var data = {
            title: 'My homepage',
            message: "Hello " + name
        };
        reply.view('rot13', data);
    }
});
server.route({
    method: 'POST',
    path: '/unit2/rot13',
    handler: function (request, reply) {
        var text = request.payload.text;
        // ROT13 encrypt
        text = text.replace(/[a-zA-Z]/g, function (c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
        var data = {
            title: 'ROT13 Demopage',
            message: "" + text
        };
        reply.view('rot13', data);
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

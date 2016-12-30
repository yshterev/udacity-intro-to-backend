'use strict';

declare var __dirname: any;
declare var process: any;

import * as Hapi from "hapi";
import * as Inert from "inert";
import * as Good from "good";
import * as Vision from "vision";
import * as Handlebars from "handlebars";

// create new server instance
const server: Hapi.Server = new Hapi.Server();

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
        partialsPath: './views/partials',
        // helpersPath: './views/helpers'
    })
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        const data = {
            title: 'My homepage',
            message: 'Hello from Future Studio'
        };

        reply.view('index', data)
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
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
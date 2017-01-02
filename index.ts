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
        partialsPath: './views/partials',
        // helpersPath: './views/helpers'
    })
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        const name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
        const data = {
            title: 'My homepage',
            message: `Hello ${name}`
        };

        reply.view('index', data)
    }
});

server.route({
    method: 'GET',
    path: '/unit2/rot13',
    handler: function (request, reply) {
        const name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
        const data = {
            title: 'My homepage',
            message: `Hello ${name}`
        };

        reply.view('rot13', data)
    }
});

server.route({
    method: 'POST',
    path: '/unit2/rot13',
    handler: function (request, reply) {
        let text = request.payload.text;

        // ROT13 encrypt
        text = text.replace(/[a-zA-Z]/g, function(c){
            return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);
        });

        const data = {
            title: 'ROT13 Demopage',
            message: `${text}`
        };

        reply.view('rot13', data)
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
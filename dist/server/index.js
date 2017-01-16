'use strict';
var Hapi = require("hapi");
var Good = require("good");
var Vision = require("vision");
var Handlebars = require("handlebars");
var routes_1 = require("./routes");
var server = new Hapi.Server();
server.connection({
    port: Number(process.argv[2] || 3000),
    host: 'localhost'
});
console.log(__dirname);
server.register(Vision, function (err) {
    if (err) {
        throw err;
    }
    server.views({
        engines: {
            html: {
                module: Handlebars,
                isCached: true
            }
        },
        isCached: false,
        relativeTo: __dirname,
        path: '../../views/pages',
        layout: true,
        layoutPath: '../../views/layout',
        partialsPath: '../../views/partials'
    });
});
server.route(routes_1.Routes);
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
        throw err;
    }
    server.start(function (err) {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running at11: ' + server.info.uri);
    });
});

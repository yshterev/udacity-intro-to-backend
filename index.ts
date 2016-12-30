'use strict';

import * as Hapi from "hapi"
import * as Inert from "inert"

const server: Hapi.Server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(Inert, (err) => {

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

server.start((err) => {

    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
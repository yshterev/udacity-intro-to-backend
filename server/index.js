import Hapi from "hapi";
import Inert from "inert";
import Good from "good";
import Vision from "vision";
import Handlebars from "handlebars";

import {Routes} from "./routes/index";

const server = new Hapi.Server();

server.connection({
  port: Number(process.argv[2] || 3000),
  host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/hello',
    handler: ( request, reply ) => {
        reply( 'Hello World!' );
    }
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
        isCached: true
      }
    },
    isCached: false,
    relativeTo: __dirname,
    path: '../views/pages',
    layout: true,
    layoutPath: '../views/layout',
    partialsPath: '../views/partials'
  })
});

server.route(Routes);

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

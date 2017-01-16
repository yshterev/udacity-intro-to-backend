'use strict';

declare var __dirname: any;
declare var process: any;

import * as Hapi from "hapi";
import * as Inert from "inert";
import * as Good from "good";
import * as Vision from "vision";
import * as Handlebars from "handlebars";

import {Routes} from "./routes";

// create new server instance
const server: Hapi.Server = new Hapi.Server();

// setup host and port
server.connection({
  port: Number(process.argv[2] || 3000),
  host: 'localhost'
});

console.log(__dirname);

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
    path: '../../views/pages',
    layout: true,
    layoutPath: '../../views/layout',
    partialsPath: '../../views/partials',
    // helpersPath: './views/helpers'
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
    server.log('info', 'Server running at11: ' + server.info.uri);
  });
});

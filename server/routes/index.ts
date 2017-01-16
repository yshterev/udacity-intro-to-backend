import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from "boom";

export const Routes: any[] = [{
  method: 'GET',
  path: '/',
  handler: function (request: Hapi.Request, reply: Hapi.IReply) {
    const name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
    const data = {
      title: 'My homepage',
      message: `Hello ${name}`
    };

    reply.view('index', data)
  }
}, {
  method: 'GET',
  path: '/unit2/rot13',
  handler: function (request: Hapi.Request, reply: Hapi.IReply) {
    const name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
    const data = {
      title: 'My homepage',
      message: `Hello ${name}`
    };

    reply.view('rot13', data)
  }
}, {
  method: 'POST',
  path: '/unit2/rot13',
  handler: function (request: Hapi.Request, reply: Hapi.IReply) {
    let text = request.payload.text;

    // ROT13 encrypt
    text = text.replace(/[a-zA-Z]/g, function (c) {
      return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });

    const data = {
      title: 'ROT13 Demopage',
      message: `${text}`
    };

    reply.view('rot13', data)
  }
}, {
  method: 'GET',
  path: '/unit2/signup-form',
  handler: function (request: Hapi.Request, reply: Hapi.IReply) {
    const name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
    const data = {
      title: 'My homepage',
      error: false
    };

    reply.view('signup-form', data);
  }
}, {
  method: 'POST',
  path: '/unit2/signup-form',
  handler: function (request: Hapi.Request, reply: Hapi.IReply) {
    reply.view('welcome');
  },
  config: {
    validate: {
      failAction: (request, reply, source, error) => {
        const keys: Array<string> = error.output.payload.validation.keys;
        let message: string = error.output.payload.message.match(/\[(.*?)\]/)[1];
        let data: Object = {};

        message = message.replace(/"/g,'');

        console.log(message, keys);
        console.log(request.payload);

        keys.map((key) => {
          switch(key) {
            case 'username':
              data = {
                error_username: message
              };
              break;

            case 'password':
              data = {
                error_password: message
              };
              break;

            case 'verify':
              data = {
                error_verify: message
              };
              break;
          }
        });

        reply.view('signup-form', data);
      },
      payload: {
        username: Joi.string().min(3).max(10),
        password: Joi.string(),
        verify: Joi.string(),
        email: Joi.string().email()
      }
    }
  }
}];

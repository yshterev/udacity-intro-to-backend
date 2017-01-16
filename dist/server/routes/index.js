"use strict";
var Joi = require("joi");
exports.Routes = [{
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
    }, {
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
    }, {
        method: 'POST',
        path: '/unit2/rot13',
        handler: function (request, reply) {
            var text = request.payload.text;
            text = text.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });
            var data = {
                title: 'ROT13 Demopage',
                message: "" + text
            };
            reply.view('rot13', data);
        }
    }, {
        method: 'GET',
        path: '/unit2/signup-form',
        handler: function (request, reply) {
            var name = request.params.name ? encodeURIComponent(request.params.name) : 'Stranger';
            var data = {
                title: 'My homepage',
                error: false
            };
            reply.view('signup-form', data);
        }
    }, {
        method: 'POST',
        path: '/unit2/signup-form',
        handler: function (request, reply) {
            var data = {
                username: request.payload.username
            };
            reply.view('welcome', data);
        },
        config: {
            validate: {
                failAction: function (request, reply, source, error) {
                    var keys = error.output.payload.validation.keys;
                    var message = error.output.payload.message.match(/\[(.*?)\]/)[1];
                    var data = {};
                    message = message.replace(/"/g, '');
                    data = {
                        username: request.payload.username,
                        email: request.payload.email
                    };
                    keys.map(function (key) {
                        switch (key) {
                            case 'username':
                                data.error_username = message;
                                break;
                            case 'password':
                                var passRegex = new RegExp(/with value\s\S+/, 'g');
                                if (passRegex.test(message)) {
                                    message = "Password contains invalid characters";
                                }
                                data.error_password = message;
                                break;
                            case 'verify':
                                message = "Your passwords do not match";
                                data.error_verify = message;
                                break;
                            case 'email':
                                data.error_email = message;
                                break;
                        }
                    });
                    reply.view('signup-form', data);
                },
                payload: {
                    username: Joi.string().required().min(3).max(10),
                    password: Joi.string().required().min(5).regex(/^[a-zA-Z0-9_-]{3,30}$/),
                    verify: Joi.ref('password'),
                    email: Joi.string().email()
                }
            }
        }
    }];



/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {(req: ExpressRequest, res: ExpressResponse) => void} ExpressHandler
 */

import { authenticateToken } from '../auth.js';

export class ApiBaseController {
    /** @type {import('express').Application} */
    _app;
    _service;

    constructor(app, service) {
        this._app = app;
        this._service = service;

        // ПОЛЬЗОВАТЕЛИ
        // получает список всех пользователей сервиса
        this.GET_PUBLIC('/users', (req, res) => {
            service.getAllUsers(req.query).then((result) => {
                console.log(result);
                res.send(result);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        });
        // вход
        this.POST_PUBLIC('/login', (req, res) => {
            service.login(req.body).then((result) => {
                console.log(result);
                res.send(result);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        });
        // аутентификация
        this.POST('/auth', (req, res) => {
            const { user } = req;
            res.send({
                message: `Проверка аутентификации прошла успешно, добро пожаловать ${user.email}`,
            });
        });
        // аутентификация
        this.GET('/me', (req, res) => {
            const { user } = req;
            res.send({ ...user, iat: undefined, exp: undefined });
        });
    }
    GET_PUBLIC(endpoint, /** @type {ExpressHandler} */action) {
        this._app.get(endpoint, action);
    }
    GET(endpoint, /** @type {ExpressHandler} */action) {
        this._app.get(endpoint, authenticateToken, action);
    }
    POST(endpoint, /** @type {ExpressHandler} */action) {
        this._app.post(endpoint, authenticateToken, action);
    }
    POST_PUBLIC(endpoint, /** @type {ExpressHandler} */action) {
        this._app.post(endpoint, action);
    }
    DELETE(endpoint, /** @type {ExpressHandler} */action) {
        this._app.delete(endpoint, authenticateToken, action);
    }

}

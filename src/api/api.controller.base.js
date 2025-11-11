

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

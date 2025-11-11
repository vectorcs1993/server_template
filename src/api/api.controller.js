import { ApiBaseController } from './api.controller.base.js';

export class ApiController extends ApiBaseController {
    /**
     * @param {import('express').Application} app
     * @param {import('./api.service.js').ApiService} service
     */
    constructor(app, service) {
        super(app, service)

        // здесь обработка маршрутов
        this.POST('/hello', (req, res) => {
        });
        // аутентификация
        this.GET('/hello', (req, res) => {
        });
    }
}

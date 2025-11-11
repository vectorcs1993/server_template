import { ApiBaseController } from './api.controller.base.js';

export class ApiController extends ApiBaseController {
    /**
     * @param {import('express').Application} app
     * @param {import('./api.service.js').ApiService} service
     */
    constructor(app, service) {
        super(app, service)
        // ЗАПИСИ
        this.GET_PUBLIC('/all_records', (req, res) => {
            service.getAllRecords(req.query).then((result) => {
                res.send(result);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        });

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
            res.send({...user, iat: undefined, exp: undefined});
        });
    }
}

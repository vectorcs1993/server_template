import { ApiController } from './api.controller.js';
import { ApiService } from './api.service.js'
import { Database } from './db/database.service.js';
import config from '../../config.js';

export default (app) => {
    new ApiController(app, new ApiService(new Database(
        config.DB_DATABASE, 
        config.DB_USERNAME, 
        config.DB_PASSWORD, 
        config.DB_HOST,
        config.DB_PORT)));
};
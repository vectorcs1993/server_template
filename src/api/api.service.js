import { compare } from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../auth.js';

export class ApiService {
    /** @type {import('./db/database.service.js').Database} */
    #db;

    constructor(db) {
        this.#db = db;
    }

    getDatabase() {
        return this.#db;
    }
    getAllUsers(reqQuery) {
        // console.log(reqQuery);
        return new Promise((resolve, reject) => {
            
            const w = [];
            let o = undefined;

            if (reqQuery.branch) {
                if (Number(reqQuery.branch) !== -1) w.push(`branch = ${Number(reqQuery.branch)}`);
            }

            if (reqQuery.order === 'ASC' || reqQuery.order === 'DESC') {
                o = `ORDER BY createdAt ${reqQuery.order}`;
            }

            const query = `
                SELECT id, name, role, email, branch
                FROM users
                ${w.length > 0 ? `WHERE ${w.join(' AND ')}` : ''}
                ${o || ''} 
                `;

            this.getDatabase().query(query).then((res) => {
                resolve(res);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    getSendUserData(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            branch: user.branch,
        }
    }
    login(data) {
        return new Promise((resolve, reject) => {
            const { email, password } = data;
            this.getDatabase().query(`SELECT id, email, role, branch, password, name FROM users WHERE email = ?`, [email]).then((user) => {
                if (user[0]) {
                    compare(password, user[0].password).then((result) => {
                        if (result) {
                            // создаём токен доступа
                            const accesToken = generateAccessToken(this.getSendUserData(user[0]));
                            // создаём токен обновления
                            const refreshToken = generateRefreshToken(this.getSendUserData(user[0]));

                            const query = `
                                UPDATE users
                                SET refresh = ?, updatedAt = NOW()
                                WHERE id = ?
                                `;
                            this.getDatabase().query(query, [refreshToken, user[0].id]).then((updated) => {
                                console.log(updated);
                                resolve({ token: accesToken })
                            }).catch((err) => {
                                console.log(err);
                                reject({
                                    message: 'Ошибка БД',
                                });
                            });
                        } else {
                            reject({
                                message: 'Неверный логин или пароль',
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        reject({
                            message: 'Неверный логин или пароль',
                        });
                    });
                } else {
                    reject({
                        message: 'Пользователь не найден',
                    });
                }
            }).catch((err) => {
                console.log(err);
                reject({
                    message: 'Ошибка запроса авторизации'
                });
            });
        });
    }
}
import mysql from 'mysql2/promise';

export class Database {
  #pool;

  constructor(database, user, password, host, port) {
    // создаем пул
    this.#pool = mysql.createPool({
      host, 
      port, 
      user, 
      password, 
      database, 
      connectionLimit: 10,
      charset: 'utf8mb4'
    });

    // this.#pool.on('acquire', (connection) => {
    //   console.log('Connection acquired:', connection.threadId);
    // });

    // this.#pool.on('release', (connection) => {
    //   console.log('Connection released:', connection.threadId);
    // });
  }
  // запрос в БД
  async query(sql, params) {
    try {
      const [results] = await this.#pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', {
        error: error.message,
        code: error.code,
        sql: sql.substring(0, 100)
      });
      throw error;
    }
  }
  // возвращает текущее соединение
  async getConnection() {
    return await this.#pool.getConnection();
  }
  // закрытие пула соединений
  async close() {
    try {
      await this.#pool.end();
    } catch (error) {
      console.error('Error closing pool:', error);
    }
  }
}
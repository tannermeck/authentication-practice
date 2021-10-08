const pool = require('../utils/pool');


module.exports = class User {
  constructor(row){
    this.id = row.id;
    this.email = row.email;
    this.password = row.password;
  }

  static async getEmail({ email }){
    const { rows } = await pool.query(
      'SELECT email FROM users WHERE email = ($1)',
      [email]
    );
    if (!rows) return null;
    return new User(rows[0]);
  }
  static async insert({ email, password }){
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    return new User(rows[0]);
  }

};

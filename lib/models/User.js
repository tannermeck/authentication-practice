const pool = require('../utils/pool');


module.exports = class User {
  constructor(row){
    this.id = row.id;
    this.email = row.email;
    this.password = row.password;
  }

  static async getEmail({ email }){
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = ($1)',
      [email]
    );
    //forgot rows[0]
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
  static async insert({ email, passwordHash }){
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );
    return new User(rows[0]);
  }
  static async getById(id){
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = ($1)',
      [id]
    );
    return new User(rows[0]);
  }


  toJSON(){
    return {
      id: this.id,
      email: this.email
    };
  }
};

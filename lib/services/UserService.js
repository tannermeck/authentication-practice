const User = require('../models/User.js');
const bcrypt = require('bcryptjs');


module.exports = class UserService {
  static async verify({ email, password }){
    const user = User.getEmail({ email });
    if (user) return 'Email already in use';

    const passwordHash = bcrypt.hash(password, 10);
    const newUser = User.insert({ email, passwordHash });
    return newUser;
  }


};


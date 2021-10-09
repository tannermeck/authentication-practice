const User = require('../models/User.js');
const bcrypt = require('bcryptjs');


module.exports = class UserService {
  static async verify({ email, password }){
    const user = await User.getEmail({ email });
    //forgot throw new Error
    if (user) {
      throw new Error('User already exists');
    }
    //forgot await
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.insert({ email, passwordHash });
    return newUser;
  }
  static async login({ email, password }){
    const user = await User.getEmail({ email });
    if(!user){
      throw new Error('Invalid email/password');
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass){
      throw new Error('Invalid email/password');
    }
    return user;

  }

};


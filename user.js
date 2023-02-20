const uuid = require('uuid');

class User {
  constructor(name, email, passwordHash) {
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.token = null;
  }

  generateToken() {
    this.token = uuid.v4();
    return this.token;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      token: this.token
    };
  }
}

module.exports = User;

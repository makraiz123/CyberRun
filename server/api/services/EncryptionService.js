const promise = require('bluebird');
const bcrypt = require('bcrypt');
const salt = 10;

module.exports = {
  encryptPassword: (password) => {
    return bcrypt.hash(password, salt)
    .then((hash) => { 
      return promise.resolve(hash);
    }).catch((err) => {
      console.log(err);
    });
  }
};


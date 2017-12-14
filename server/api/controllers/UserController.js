/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },
  getUsers: (req, res) => {
    User.find()
      .then((users) => {
        if (!users || users.length == 0) {
          res.error(5);
        } else {
          res.ok(users);
        }
      }).catch((err) => {
        res.error(0);
      });
  },
  postUser: (req, res) => {
    const data = req.param('data');
    const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regx.test(data.email);
    if (!validEmail) {
      res.error(3);
    } else if (data.password.length < 4 || data.password.length > 20) {
      res.error(4);
    } else {
      EncryptionService.encryptPassword(data.password)
        .then((hash) => {
          data.password = hash;
          User.create(data)
            .then((newUser) => {
              res.ok(newUser);
            }).catch((err) => {
              const invalidAttributes = err.invalidAttributes;
              if (invalidAttributes.email) {
                res.error(1);
              } else if (invalidAttributes.phone) {
                res.error(2);
              } else {
                res.error(0)
              }
            });

        }).catch((err) => {
          console.log(err);
        });
    }
  },
  getUser: (req, res) => {
    const params = {
      userId: req.param('userId')
    };
    User.findOne(params)
      .then((user) => {
        if (user) {
          res.ok(user);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });
  },
  putUser: (req, res) => {
    const criteria = {
      userId: req.param('userId')
    };
    const data = req.param('data');
    const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regx.test(data.email);

    if (!validEmail) {
      res.error(3);
    } else if (data.password.length < 4 || data.password.length > 20) {
      res.error(4);
    } else {
      EncryptionService.encryptPassword(data.password)
        .then((hash) => {
          data.password = hash;
          User.update(criteria, data)
            .then((updatedUsers) => {
              if (updatedUsers && updatedUsers.length > 0) {
                res.ok(updatedUsers[0]);
              } else {
                res.error(6);
              }
            }).catch((err) => {
              const invalidAttributes = err.invalidAttributes;
              if (invalidAttributes.email) {
                res.error(1);
              } else if (invalidAttributes.phone) {
                res.error(2);
              } else {
                res.error(0);
              }
            });
        });
    }
  },
  deleteUser: (req, res) => {
    const params = {
      userId: req.param('userId')
    };

    User.destroy(params)
      .then((deletedUsers) => {
        if (deletedUsers && deletedUsers.length > 0) {
          res.ok(deletedUsers[0]);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });
  }
};


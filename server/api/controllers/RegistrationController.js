/**
 * RegistrationController
 *
 * @description :: Server-side logic for managing Registrations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  postRegistration: (req, res) => {
    const data = req.param('data');

    Registration.create(data)
      .then((registration) => {
        res.ok(registration);
      }).catch((err) => {
        res.error(0);
      });
  }
};


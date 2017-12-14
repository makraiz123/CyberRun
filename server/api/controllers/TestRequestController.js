/**
 * TestRequestController
 *
 * @description :: Server-side logic for managing Testrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const promise = require('bluebird');

module.exports = {
  SQL: (req, res) => {
    const testRequest = promise.promisify(TestRequest.query);
    testRequest(req.param('sql'), [])
      .then((sqlResult) => {
        res.ok();
      });
  }
};


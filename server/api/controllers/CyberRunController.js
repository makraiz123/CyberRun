/**
 * CyberRunController
 *
 * @description :: Server-side logic for managing Cyberruns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getCyberRuns: (req, res) => {
    CyberRun.find()
      .then((runs) => {
        if (runs && runs.length > 0) {
          res.ok(runs);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });
  },
  getCyberRun: (req, res) => {
    const params = {
      cyberRunId: req.param('cyberRunId')
    };

    CyberRun.findOne(params)
      .then((run) => {
        if (run) {
          res.ok(run);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });
  },
  postCyberRun: (req, res) => {
    const data = req.param('data');

    CyberRun.create(data)
      .then((run) => {
        res.ok(run);
      }).catch((err) => {
        res.error(0);
      });
  },
  putCyberRun: (req, res) => {
    const criteria = {
      cyberRunId: req.param('cyberRunId')
    };
    const data = req.param('data');

    CyberRun.update(criteria, data)
      .then((runs) => {
        if (runs && runs.length > 0) {
          res.ok(runs[0]);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });
  },
  deleteCyberRun: (req, res) => {
    const criteria = {
      cyberRunId: req.param('cyberRunId')
    };

    CyberRun.destroy(criteria)
      .then((runs) => {
        if (runs && runs.length > 0) {
          res.ok(runs[0]);
        } else {
          res.error(5);
        }
      }).catch((err) => {
        res.error(0);
      });;
  }
};


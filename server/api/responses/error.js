const responses = [
  { //0
    code: 500,
    error: {
      code: 500,
      message: 'Server error, please try again later'
    }
  },
  { // 1
    code: 400,
    error: {
      code: 400,
      message: 'Email already exists'
    }
  }, 
  { // 2
    code: 400,
    error: {
      code: 400,
      message: 'Mobile number already exists'
    }
  },
  { // 3
    code: 400,
    error: {
      code: 400,
      message: 'Must enter a valid email address'
    }
  },
  { // 4
    code: 400,
    error: {
      code: 400,
      message: 'Password must be between 4 and 20 characters only'
    }
  },
  { // 5
    code: 404,
    error: {
      code: 404,
      message: 'No data available'
    }
  },
  { // 6
    code: 404,
    error: {
      code: 404,
      message: 'No data found to be updated'
    }

  }
];

module.exports = function error(index) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  const response = responses[index];
  res.status(response.code);
  res.jsonx(response)
}
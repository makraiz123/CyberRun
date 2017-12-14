/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  autoPK: false,
  attributes: {
    userId: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'text',
      required: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      unique: true
    },
    shippingAddress: {
      type: 'text'
    },
    userType: {
      model: 'usertype',
      columnName: 'userTypeId',
      defaultsTo: 2
    }
  }
};


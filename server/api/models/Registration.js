/**
 * Registration.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  autoPK: false,
  attributes: {
    registrationId: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    shirtSize: {
      type: 'string',
      required: true,
      enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    isApproved: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    user: {
      type: 'user',
      columnName: 'userId',
      required: true
    },
    cyberRun: {
      type: 'cyberrun',
      columnName: 'cyberRunId',
      required: true
    }
  }
};


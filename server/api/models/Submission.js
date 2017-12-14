/**
 * Submission.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  autoPK: false,
  attributes: {
    submissionId: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    distance: {
      type: 'float',
      required: true
    },
    time: {
      type: 'string',
      required: true
    },
    proofURL: {
      type: 'text',
      required: true
    },
    status: {
      type: 'status',
      columnName: 'statusId',
      required: true,
      defaultsTo: 1
    },
    registration: {
      type: 'registration',
      columnName: 'registrationId',
      required: true
    }
  }
};


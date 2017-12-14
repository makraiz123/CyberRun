/**
 * CyberRun.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  autoPK: false,
  attributes: {
    cyberRunId: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    title: {
      type: 'string',
      required: true
    },
    startDate: {
      type: 'date',
      required: true
    },
    endDate: {
      type: 'date',
      required: true
    },
    fee: {
      type: 'integer',
      required: true
    }
  }
};


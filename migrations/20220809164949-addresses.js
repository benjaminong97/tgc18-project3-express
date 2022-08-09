'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('addresses', {
    id: { 
      type: 'int', 
      primaryKey:true, 
      autoIncrement:true, 
      unsigned: true
    },
    postal_code: {
      type: "string",
      length: 15
    },
    unit_number: {
      type: "string",
      length: 15
    },
    country: {
      type: 'string',
      length: 45
    },
    street_name: {
      type: 'string',
      length: 100
    },
    state: {
      type: 'string',
      length: 45
    },
    city: {
      type: 'string',
      length: 45
    },
    block_number: {
      type: "string",
      length: 15,
      nonNull: false
    }


  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

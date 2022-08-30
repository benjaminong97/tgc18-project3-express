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
  return null
  // return db.createTable('users', {
  //   id: { 
  //     type: 'int', 
  //     primaryKey:true, 
  //     autoIncrement:true, 
  //     unsigned: true
  //   },
  //   first_name : {
  //     type: 'string',
  //     length: 100
  //   },
  //   last_name : {
  //     type: "string",
  //     length: 100
  //   },
  //   email: {
  //     type: 'string',
  //     length: 320
  //   },
  //   password: {
  //     type: "string",
  //     length: 64
  //   }

  // })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

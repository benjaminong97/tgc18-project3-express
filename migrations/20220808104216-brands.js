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
  // return db.createTable('brands', {
  //   id :
  //   { 
  //     type: 'int', 
  //     primaryKey:true, 
  //     autoIncrement:true, 
  //     unsigned: true
  //   },
  //   name: 
  //   {
  //     type: 'string',
  //     length: 100
  //   },
  //   image_url: 
  //   {
  //     type: 'string',
  //     length: 2000
  //   }
  // })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

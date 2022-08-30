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
  // return db.createTable('mouses', {
  //   id: { 
  //     type: 'int', 
  //     primaryKey:true, 
  //     autoIncrement:true, 
  //     unsigned: true
  //   },
  //   name: {
  //     type: 'string',
  //     length: 100
  //   },
  //   weight: {
  //     type: 'smallint'
  //   },
  //   dpi: {
  //     type: "int"
  //   },
  //   cost: {
  //     type: "int"
  //   },
  //   features: {
  //     type: "string",
  //     notNull: false
  //   },
  //   backlighting: {
  //     type: "string",
  //     length: 45
  //   },
  //   numberOfButtons: {
  //     type: "smallint"
  //   },
  //   connectivity: {
  //     type: "string",
  //     length: 8
  //   },
  //   height : {
  //     type: "smallint"
  //   },
  //   width: {
  //     type: "smallint"
  //   },
  //   length: {
  //     type: "smallint"
  //   },
  //   shape: {
  //     type: "string",
  //     length: 15
  //   },
  //   description: {
  //     type:'string',
  //     length: 450
  //   }

  // })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

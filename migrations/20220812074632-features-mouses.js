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
  // return db.createTable('features_mouses', {
  //   id: {
  //     type: 'int',
  //     primaryKey: true,
  //     autoIncrement: true
  //   },
  //   feature_id: {
  //     type: 'int',
  //     notNull: true,
  //     unsigned: true,
  //     foreignKey : {
  //       'name': 'features_mouses_feature_fk',
  //       'table': 'features',
  //       rules: {
  //         onDelete: "CASCADE",
  //         onUpdate: "RESTRICT"
  //       },
  //       mapping: 'id'
  //     }
  //   },
  //   mouse_id: {
  //     type: 'int',
  //     notNull: true,
  //     unsigned: true, 
  //     foreignKey: {
  //       name: 'features_mouses_mouse_fk',
  //       table: 'mouses',
  //       rules: {
  //         onDelete: "CASCADE",
  //         onUpdate: "RESTRICT"
  //       },
  //       mapping: 'id'
  //     }
  //   }
  // })
  return null
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

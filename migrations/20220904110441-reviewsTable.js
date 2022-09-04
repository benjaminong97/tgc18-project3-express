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
  return db.createTable('reviews', {
    id: { 
      type: 'int', 
      primaryKey:true, 
      autoIncrement:true, 
      unsigned: true
    },
    review_datetime: {
      type: 'datetime'
    },
    rating: {
      type: "smallint"
    },
    comment: {
      type: "string",
      length: 320
    },
    mouse_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'review_mouse_fk',
        table: 'mouses',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

const bookshelf = require('../bookshelf')

const Mouse = bookshelf.model('Mouse', {
    tableName:'mouses'
});

module.exports = { Mouse };
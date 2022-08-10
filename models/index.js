const bookshelf = require('../bookshelf')

const Mouse = bookshelf.model('Mouse', {
    tableName:'mouses',
    brand() {
        return this.belongsTo('Brand')
    }
});

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    brands() {
        return this.hasMany('Mouse')
    }
})

module.exports = { Mouse, Brand };
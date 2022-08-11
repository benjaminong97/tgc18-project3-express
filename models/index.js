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

const User = bookshelf.model('User', {
    tableName: 'users'
})

module.exports = { Mouse, Brand, User };
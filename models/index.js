const bookshelf = require('../bookshelf')

const Mouse = bookshelf.model('Mouse', {
    tableName:'mouses',
    brand() {
        return this.belongsTo('Brand')
    },
    variant() {
        return this.belongsTo('Variant')
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

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    color() {
        return this.belongsTo('Color')
    },
    mouse() {
        return this.belongsTo('Mouse')
    }
})

const Color = bookshelf.model('Colors', {
    tableName: 'colors',
    variants() {
        return this.hasMany('variants')
    }
})

module.exports = { Mouse, Brand, User, Variant, Color };
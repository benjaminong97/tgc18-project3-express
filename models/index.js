const bookshelf = require('../bookshelf')

const Mouse = bookshelf.model('Mouse', {
    tableName:'mouses',
    brand() {
        return this.belongsTo('Brand')
    },
    variant() {
        return this.belongsTo('Variant')
    },
    features() {
        return this.belongsToMany('Feature')
    },
    backlighting() {
        return this.belongsTo('Backlighting')
    },
    gameType() {
        return this.belongsTo('GameType')
    }
});

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    mouses() {
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

const Color = bookshelf.model('Color', {
    tableName: 'colors',
    variants() {
        return this.hasMany('Variant')
    }
})

const Feature = bookshelf.model('Feature', {
    tableName: 'features', 
    mouses() {
        return this.belongsToMany('Mouse')
    }
})

const Backlighting = bookshelf.model('Backlighting', {
    tableName: 'backlightings',
    mouses() {
        return this.hasMany("Mouse")
    }
})

const GameType = bookshelf.model('GameType', {
    tableName: 'gameTypes',
    mouses() {
        return this.hasMany('Mouse')
    }
})

const Cart = bookshelf.model('Cart', {
    tableName: "carts",
    mouse() {
        return this.belongsTo('Mouse')
    }
})

module.exports = { Mouse, Brand, User, Variant, Color, Feature, Backlighting, GameType, Cart};
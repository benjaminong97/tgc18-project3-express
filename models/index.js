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
    tableName: 'users',
    orders() {
        return this.hasMany('Order')
    },
    carts() {
        return this.hasMany('Cart')
    }
})

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    color() {
        return this.belongsTo('Color')
    },
    mouse() {
        return this.belongsTo('Mouse')
    },
    orderItems() {
        return this.hasMany('OrderItem', 'variant_id')
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
    },
    variant() { 
        return this.belongsTo('Variant')
    },
    user() {
        return this.belongsTo('User')
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName : 'blacklisted_tokens'
})

const Status = bookshelf.model('Status', {
    tableName: 'statuses',
    orders() {
        return this.hasMany('Order')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    variants() {
        return this.belongsToMany('Variant')
    },
    user() {
        return this.belongsTo('User')
    },

    status() {
        return this.belongsTo('Status')
    },
    address() {
        return this.belongsTo('Address')
    },
    orderItems() {
        return this.hasMany('OrderItem')
    }
})

const Address = bookshelf.model('Address', {
    tableName: 'addresses',
    order() {
        return this.hasOne('Order')
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    order() {
        return this.belongsTo('Order')
    },
    variant() {
        return this.belongsTo('Variant', 'variant_id')
    }
})

module.exports = { 
    Mouse, Brand, User, Variant, Color, Feature, Backlighting, GameType, Cart, BlacklistedToken, 
    Order, Address, OrderItem, Status
};
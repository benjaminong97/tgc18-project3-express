const cartDataLayer = require('../dal/carts')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async addToCart (variantId, mouseId, quantity) {
        //check if mouse is already in the cart
        let cart = await cartDataLayer.getCartByUserAndVariant(
            this.user_id, variantId, quantity)

        if (cart) {
            return await cartDataLayer.updateQuantity(
                this.user_id, mouseId, cart.get('quantity')
            )
        } else {
            let newCart = cartDataLayer.createCart(
                this.user_id, mouseId, variantId, quantity
            )
            return newCart
        }
    }

    async remove(mouseId) {
        return await cartDataLayer.removeFromCart(
            this.user_id, mouseId
        )
    }

    async setQuantity(mouseId, quantity) {
        return await cartDataLayer.updateQuantity(
            this.user_id, mouseId, quantity
        )
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id)
    }
}

module.exports = CartServices
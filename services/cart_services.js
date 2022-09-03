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
                this.user_id, variantId, (cart.get('quantity') + 1)
            )
        } else {
            let newCart = cartDataLayer.createCart(
                this.user_id, mouseId, variantId, quantity
            )
            return newCart
        }
    }

    async remove(variantId) {
        return await cartDataLayer.removeFromCart(
            
            this.user_id, variantId
        )
    }

    async setQuantity(variantId, quantity) {
        return await cartDataLayer.updateQuantity(
            this.user_id, variantId, quantity
        )
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id)
    }

}

module.exports = CartServices
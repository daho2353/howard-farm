import React from "react";
import { Product } from "./StorePage";

interface Props {
    product : Product;
    removeFromCart : (product:Product) => void; 
}

const CartCard: React.FC<Props> = ({product, removeFromCart}) => (
    <div className="product-card">
        <img src={product.imageURL} className="product-image" />
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price.toFixed(2)}</p>
        <p className="product-quantity">Number in cart: {product.quantityInCart} </p> {/*next add buttons to increase/decrease quantityInCart, also maybe let users input desired quanity? Also need to check that quantity is less than stock */}
        <p className="product-description">{product.description}</p>
        <p>
            {product.localPickupOnly ? 'item is for local pickup only' : 'item can be shipped to the US'}
        </p>
        <button onClick={() => removeFromCart(product)}> Remove All From Cart </button>
    </div>
)

export default CartCard; 
import React from "react";
import { Product } from "./StorePage";

interface Props {
    product : Product;
    removeFromCart : (product:Product) => void; 
    decreaseCartQuantity: (product:Product) => void;
    increaseCartQuantity: (product:Product) => void;
}

const CartCard: React.FC<Props> = ({product, removeFromCart, decreaseCartQuantity, increaseCartQuantity}) => (
    <div className="product-card">
        <img src={product.imageURL} className="product-image" />
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price.toFixed(2)}</p>
        <p className="product-quantity">Number in cart: <button onClick={() => decreaseCartQuantity(product)}> - </button> {product.quantityInCart} <button onClick={() => increaseCartQuantity(product)}> + </button> </p>
        <p className="product-description">{product.description}</p>
        <p>
            {product.localPickupOnly ? 'item is for local pickup only' : 'item can be shipped to the US'}
        </p>
        <button onClick={() => removeFromCart(product)}> Remove All From Cart </button>
    </div>
)

export default CartCard; 
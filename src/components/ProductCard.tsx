import React, { useState } from "react";
import { Product } from "./StorePage";
import './ProductCard.css';

interface Props {
    product : Product;
    cart: Product[];
    addToCart : (product:Product) => void; 
}

const ProductCard: React.FC<Props> = ({product, addToCart, cart}) => {
    const isStockExceeded = product.stock === 0 || cart.some(
        (cartItem) => cartItem.name === product.name && cartItem.quantityInCart >= product.stock
    );
    return(
     <div className="product-card">
        <img src={product.imageURL} className="product-image" />
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price.toFixed(2)}</p>
        <p className="product-stock">Number in stock: {product.stock}</p>
        <p className="product-description">{product.description}</p>
        <p>
            {product.localPickupOnly ? 'item is for local pickup only' : 'item can be shipped to the US'}
        </p>
        <button onClick={() => addToCart(product)} disabled={isStockExceeded} className={isStockExceeded ? 'disabled-button' : ''}>{isStockExceeded ? 'Out of Stock' : 'Add to Cart'}</button>
    </div>
    )
}

export default ProductCard
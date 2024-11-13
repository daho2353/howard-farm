import React from "react";
import { Product } from "./StorePage";

interface Props {
    product : Product;
}

const ProductCard: React.FC<Props> = ({product}) => (
    <div className="product-card">
        <img src={product.imageURL} className="product-image" />
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <p>
            {product.localPickupOnly ? 'item is for local pickup only' : 'item can be shipped to the US'}
        </p>
    </div>
)

export default ProductCard
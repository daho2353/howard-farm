import React from "react";
import { Product } from "./StorePage";
import "./CartCard.css";

interface Props {
  product: Product;
  removeFromCart: (product: Product) => void;
  decreaseCartQuantity: (product: Product) => void;
  increaseCartQuantity: (product: Product) => void;
}

const CartCard: React.FC<Props> = ({
  product,
  removeFromCart,
  decreaseCartQuantity,
  increaseCartQuantity,
}) => {
  const isStockExceeded = product.quantityInCart >= product.stock;

  return (
    <div className="product-card-horizontal">
      <div className="product-image-wrapper">
        <img
          src={product.imageURL}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-details">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>

        <div className="product-quantity">
          <span>Number in cart:&nbsp;</span>
          <div className="quantity-controls">
            <button
              onClick={() => decreaseCartQuantity(product)}
              disabled={product.quantityInCart <= 1}
            >
              −
            </button>
            <span>{product.quantityInCart}</span>
            <button
              onClick={() => increaseCartQuantity(product)}
              disabled={isStockExceeded}
            >
              +
            </button>
          </div>
        </div>

        <p className="product-stock">Number in stock: {product.stock}</p>
        <p className="product-description"><em>{product.description}</em></p>
        <p className="product-shipping">
          {product.localPickupOnly
            ? "Item is for local pickup only"
            : "Item can be shipped to the US"}
        </p>

        <button className="add-to-cart remove-btn" onClick={() => removeFromCart(product)}>
          Remove All from Cart
        </button>
      </div>
    </div>
  );
};

export default CartCard;



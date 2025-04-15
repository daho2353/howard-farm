import React, { useState, useEffect } from "react";
import { Product } from "./StorePage";
import "./ProductCard.css";

interface Props {
  product: Product;
  cart: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, cart, addToCart }) => {
  const cartItem = cart.find((item) => item.name === product.name);
  const quantityInCart = cartItem?.quantityInCart || 0;

  const totalStock = Number(product.stock) || 0;
  const availableStock = Math.max(totalStock - quantityInCart, 0);

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const canAdd = selectedQuantity > 0 && selectedQuantity <= availableStock;
  const showLowStock = availableStock > 0 && availableStock <= 5;

  useEffect(() => {
    // Ensure selected quantity never exceeds remaining available stock
    if (selectedQuantity > availableStock) {
      setSelectedQuantity(Math.max(availableStock, 1));
    }
  }, [availableStock, selectedQuantity]);

  const handleIncrease = () => {
    if (selectedQuantity < availableStock) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (canAdd) {
      addToCart(product, selectedQuantity);
    }
  };

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
        <p className="product-description">
          <em>{product.description}</em>
        </p>
        <p className="product-stock">
          Availability: <strong>{availableStock > 0 ? "In Stock" : "Out of Stock"}</strong>
        </p>

        {showLowStock && (
          <p className="low-stock">Only {availableStock} left in stock!</p>
        )}

        {quantityInCart > 0 && (
          <p style={{ color: "green" }}>
            You have {quantityInCart} {quantityInCart === 1 ? "item" : "items"} currently in your cart.
          </p>
        )}

        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-shipping">
          {product.localPickupOnly ? "Local pickup only" : "Shipping available"}
        </p>

        <div className="cart-controls">
          <div className="quantity-controls">
            <button onClick={handleDecrease} disabled={selectedQuantity <= 1}>
              −
            </button>
            <span>{selectedQuantity}</span>
            <button
              onClick={handleIncrease}
              disabled={selectedQuantity >= availableStock}
            >
              +
            </button>
          </div>
          <button
            className="add-to-cart"
            onClick={handleAddToCart}
            disabled={!canAdd}
          >
            Add to Basket 🧺
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;









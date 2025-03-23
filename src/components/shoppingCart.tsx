import React from "react";
import { Product } from "./StorePage";
import CartCard from "./CartCard";

interface Props {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ShoppingCart: React.FC<Props> = ({ cart, setCart }) => {
  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      // Remove the product from the cart by filtering it out
      return prevCart.filter((cartItem) => cartItem.name !== product.name);
    });
  };

  const decreaseCartQuantity = (product: Product) => {
    setCart((prevCart) => {
      return prevCart.reduce<Product[]>((acc, cartItem) => {
        if (cartItem.name === product.name) {
          // If quantity is 1 or less, remove it from cart.
          if (cartItem.quantityInCart <= 1) {
            return acc;
          }
          // Otherwise, decrease quantity
          acc.push({ ...cartItem, quantityInCart: cartItem.quantityInCart - 1 });
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, []);
    });
  };

  const increaseCartQuantity = (product: Product) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.name === product.name
          ? { ...cartItem, quantityInCart: cartItem.quantityInCart + 1 }
          : cartItem
      )
    );
  };

  return (
    <div>
      {cart.map((product) => (
        <div key={product.name}>
          <CartCard
            product={product}
            removeFromCart={() => removeFromCart(product)}
            decreaseCartQuantity={() => decreaseCartQuantity(product)}
            increaseCartQuantity={() => increaseCartQuantity(product)}
          />
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;

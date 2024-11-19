import React from "react";
import { Product } from "./StorePage";
import { products } from "./data";
import ProductCard from "./ProductCard";
import CartCard from "./CartCard";

interface Props{
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ShoppingCart: React.FC<Props> = ({cart, setCart}) => {
    
    const removeFromCart = (products: Product) => {
            setCart((prevCart: Product[]) => {
                const index = prevCart.findIndex(cartItem => cartItem.name === products.name);
                if (index !== -1) {
                    // Remove the item at the found index
                    return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
                }
                return prevCart; // If not found, return the cart unchanged
            });
        
    };

   return (
    <div>
        {cart.map(product => (
            <div>
                <CartCard removeFromCart={() => removeFromCart(product)} product={product} key={product.name} />
            </div>    

    ))}
    </div>
   )
};

export default ShoppingCart;
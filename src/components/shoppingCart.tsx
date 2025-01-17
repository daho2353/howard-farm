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
    
    const removeFromCart = (products: Product) => { //edit this function to reduce quantity variable that needs to be added still
            setCart((prevCart: Product[]) => {
                const index = prevCart.findIndex(cartItem => cartItem.name === products.name);
                if (index !== -1) {
                    // Remove the item at the found index
                    products.quantityInCart = 0; 
                    return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
                }
                return prevCart; // If not found, return the cart unchanged
            });
        
    };

    const decreaseCartQuantity = (product: Product) => {
        setCart((prevCart: Product[]) => {
            return prevCart.map((cartItem) => {
                if (cartItem.name === product.name) {
                    if (cartItem.quantityInCart <= 1) {
                        removeFromCart(product);
                    }
                    return { ...cartItem, quantityInCart: cartItem.quantityInCart - 1 };
                }
                return cartItem; // Return unchanged items
            })
        });
    };

    const increaseCartQuantity = (product: Product) => {
        setCart((prevCart: Product[]) => {
            return prevCart.map((cartItem) => {
                if (cartItem.name === product.name) { //next need to implement stock into the product then check if this number is less than the available stock
                    return { ...cartItem, quantityInCart: cartItem.quantityInCart + 1 };
                }
                return cartItem;
            })
        });
    };

   return (
    <div>
        {cart.map(product => (
            <div>
                <CartCard removeFromCart={() => removeFromCart(product)} decreaseCartQuantity={() => decreaseCartQuantity(product)} increaseCartQuantity={() => increaseCartQuantity(product)} product={product} key={product.name} />
            </div>    

    ))}
    </div>
   )
};

export default ShoppingCart;
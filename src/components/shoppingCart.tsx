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
        setCart((prevCart: Product[]) =>  prevCart.filter(cartItem => cartItem.name !== products.name));
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
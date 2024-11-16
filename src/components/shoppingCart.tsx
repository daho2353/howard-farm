import React from "react";
import { Product } from "./StorePage";
import { products } from "./data";
import ProductCard from "./ProductCard";

interface Props{
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ShoppingCart: React.FC<Props> = ({cart, setCart}) => {
   return (
    <div>
        {cart.map(product => (
            <p> {product.name} </p>
        ))}
    </div>
   )
};

export default ShoppingCart;
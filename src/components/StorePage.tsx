import React from "react";
import { useState  } from "react";
import { products } from "./data"; //placeholder data until a backend can be set up with client information. 
import ProductCard from "./ProductCard";

export interface Product{ // placeholder product typing until backend is created. 
    name: string;
    description: string;
    price: number;
    imageURL: string;
    visible: boolean;
    localPickupOnly: boolean;
    quantityInCart: number;
    stock: number; 
}

interface StoreProps {
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const StorePage: React.FC<StoreProps> = ({cart, setCart}) => {
    const [search, setSearch] = useState<string>("");
    const [localToggle, setLocalToggle] = useState<boolean>(true);

    const SearchProduct = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setSearch(event.target.value.toLowerCase());
      }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search) && (localToggle || !product.localPickupOnly)
    );

    const handleCheckboxChange = () => {
        setLocalToggle(prevState => !prevState);
    }

    const addToCart = (products: Product) => {
        if (products.stock > 0) //need to find a way to check if the next add to cart press will push the current product in the cart's quantityInCart value over the allowed stock number
        {
            setCart((prevCart: Product[]) => {
                // Check if the product is already in the cart
                const productIndex = prevCart.findIndex(cartItem => cartItem.name === products.name);
        
                if (productIndex !== -1) {
                    // If product exists, increment quantityInCart
                    const updatedCart = [...prevCart];
                    updatedCart[productIndex] = {
                        ...updatedCart[productIndex],
                        quantityInCart: (updatedCart[productIndex].quantityInCart || 0) + 1,
                    }; //could possibly add the check here for whether quanity will push over stock and return prevCart otherwise
                    return updatedCart;
                } else {
                    // If product does not exist, add it with quantityInCart set to 1
                    return [...prevCart, { ...products, quantityInCart: 1 }];
                }
            });
            console.log(cart);
        }

    };

    return(
        <div>
            <label>
                <input 
                    type="checkbox"
                    checked={localToggle}
                    onChange={handleCheckboxChange}
                />
                Show items for Local Pickup only
            </label>
            <p>Search for item: <input onChange={SearchProduct} /></p>
            {filteredProducts.map(product => (
                <ProductCard addToCart={() => addToCart(product)} product={product} key={product.name} />
            ))}
        </div> 

    ) 
}

export default StorePage;
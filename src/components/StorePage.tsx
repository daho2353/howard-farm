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
}

interface StoreProps {
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const StorePage: React.FC<StoreProps> = ({setCart}) => {
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
        setCart((prevCart: Product[]) => [...prevCart, products]);
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
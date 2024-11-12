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
}

const StorePage = () => {
    const [search, setSearch] = useState<string>("");

    const SearchProduct = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setSearch(event.target.value.toLowerCase());
      }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    return(
        <div>
            <p>Search for item: <input onChange={SearchProduct} /></p>
            {filteredProducts.map(product => (
                <ProductCard product={product} key={product.name} />
            ))}
        </div>

    ) 
}

export default StorePage;
import React, { useState, ChangeEvent } from "react";
import { products } from "./data"; // Placeholder data until a backend is set up.
import ProductCard from "./ProductCard";

export interface Product { // Placeholder product typing until backend is created.
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

const StorePage: React.FC<StoreProps> = ({ cart, setCart }) => {
  const [search, setSearch] = useState<string>("");
  const [localToggle, setLocalToggle] = useState<boolean>(true);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value.toLowerCase());
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search) &&
      (localToggle || !product.localPickupOnly)
  );

  const handleCheckboxChange = (): void => {
    setLocalToggle((prevState) => !prevState);
  };

  const addToCart = (product: Product): void => {
    if (product.stock > 0) {
      setCart((prevCart: Product[]) => {
        const productIndex = prevCart.findIndex(
          (cartItem) => cartItem.name === product.name
        );
        if (productIndex !== -1) {
          if (prevCart[productIndex].quantityInCart < prevCart[productIndex].stock) {
            const updatedCart = [...prevCart];
            updatedCart[productIndex] = {
              ...updatedCart[productIndex],
              quantityInCart:
                (updatedCart[productIndex].quantityInCart || 0) + 1,
            };
            return updatedCart;
          }
          return [...prevCart];
        } else {
          return [...prevCart, { ...product, quantityInCart: 1 }];
        }
      });
    }
  };

  return (
    <div className="store-page">
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={localToggle}
            onChange={handleCheckboxChange}
          />
          Show items for Local Pickup only
        </label>
        <div className="search-section">
          <label htmlFor="search-input">Search for item:</label>
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard
            addToCart={() => addToCart(product)}
            product={product}
            key={product.name}
            cart={cart}
          />
        ))}
      </div>
    </div>
  );
};

export default StorePage;

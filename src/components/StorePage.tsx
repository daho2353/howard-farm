import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import apiBaseUrl from "../config";

export interface Product {
  productId?: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  visible?: boolean;
  localPickupOnly: boolean;
  quantityInCart: number;
  stock: number;
  displayOrder?: number;
}

interface StoreProps {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

const StorePage: React.FC<StoreProps> = ({ cart, setCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [localToggle, setLocalToggle] = useState<boolean>(true);

  // Fetch products from backend on mount
  useEffect(() => {
    axios.get(`${apiBaseUrl}/products`).then((response) => {
      const formatted: Product[] = response.data
        .map((p: any): Product => ({
          productId: p.ProductId,
          name: p.Name,
          description: p.Description,
          price: p.Price,
          stock: p.StockQty,
          imageURL: p.ImageUrl,
          localPickupOnly: p.LocalPickupOnly,
          quantityInCart: 0,
          displayOrder: p.DisplayOrder ?? 0,
        }))
        .sort((a: Product, b: Product) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  
      setProducts(formatted);
    });
  }, []);
  

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleCheckboxChange = (): void => {
    setLocalToggle((prevState) => !prevState);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search) &&
      (localToggle || !product.localPickupOnly)
  );

  const addToCart = (product: Product, quantity: number): void => {
    if (product.stock <= 0 || quantity <= 0) return;
  
    setCart((prevCart: Product[]) => {
      const index = prevCart.findIndex((item) => item.name === product.name);
  
      if (index !== -1) {
        const existing = prevCart[index];
        const newQuantity = Math.min(existing.quantityInCart + quantity, product.stock);
  
        const updatedCart = [...prevCart];
        updatedCart[index] = { ...existing, quantityInCart: newQuantity };
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantityInCart: Math.min(quantity, product.stock) }];
      }
    });
  };
  

  const removeFromCart = (product: Product): void => {
    setCart((prevCart) => {
      const productIndex = prevCart.findIndex((item) => item.name === product.name);
      if (productIndex !== -1) {
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[productIndex].quantityInCart || 0;

        if (currentQty <= 1) {
          updatedCart.splice(productIndex, 1); // remove item from cart
        } else {
          updatedCart[productIndex].quantityInCart = currentQty - 1;
        }

        return updatedCart;
      }
      return prevCart;
    });
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
          Show items for Local Pickup only in the Saint Helens area
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
          addToCart={(product, quantity) => addToCart(product, quantity)}        
            removeFromCart={() => removeFromCart(product)}
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



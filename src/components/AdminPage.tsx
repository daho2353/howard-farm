import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.css";
import apiBaseUrl from "../config";

interface Product {
  productId?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageURL: string;
  localPickupOnly: boolean;
  displayOrder: number;
  isArchived?: boolean;
}

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const fetchProducts = async () => {
    const endpoint = showArchived
      ? `${apiBaseUrl}/products/all`
      : `${apiBaseUrl}/products`;
  

    const res = await axios.get(endpoint, { withCredentials: true });
    const data = res.data.map((p: any) => ({
      productId: p.ProductId,
      name: p.Name,
      description: p.Description,
      price: p.Price,
      stock: p.StockQty,
      imageURL: p.ImageUrl,
      localPickupOnly: p.LocalPickupOnly,
      displayOrder: p.DisplayOrder ?? 0,
      isArchived: p.IsArchived === true,
    }));
    setProducts(data.sort((a: Product, b: Product) => a.displayOrder - b.displayOrder));
  };

  useEffect(() => {
    fetchProducts();
  }, [showArchived, fetchProducts]);
  

  const handleChange = (
    id: number | undefined,
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.productId === id ? { ...p, [field]: value } : p))
    );
  };

  const saveProduct = async (product: Product) => {
    if (
      product.imageURL &&
      !product.imageURL.startsWith("http://") &&
      !product.imageURL.startsWith("https://")
    ) {
      alert("Please enter a valid image URL starting with http:// or https://");
      return;
    }

    try {
      await axios.put(`${apiBaseUrl}/products/${product.productId}`, product, {
        withCredentials: true,
      });
      alert("Product updated successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };
    

  const addProduct = async () => {
    try {
      const newProduct: Product = {
        name: "New Product",
        description: "",
        price: 0,
        stock: 0,
        imageURL: "",
        localPickupOnly: false,
        displayOrder: products.length + 1,
      };
      const res = await axios.post(`${apiBaseUrl}/products`, newProduct, {
        withCredentials: true,
      });
      if (res.status === 201) fetchProducts();
      } catch (err) {
        console.error(err);
        alert("Failed to add product.");
      }
      };

      const toggleArchive = async (product: Product) => {
        const newStatus = !product.isArchived;
        try {
          await axios.put(
            `${apiBaseUrl}/products/${product.productId}/archive`,
            { isArchived: newStatus },
            { withCredentials: true }
          );
      
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update archive status.");
    }
  };

  return (
    <div className="admin-container max-w-5xl mx-auto px-4 md:px-6">
      <h1 className="admin-title">🛠️ Product Admin</h1>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived((prev) => !prev)}
          />
          Show Archived Products
        </label>
      </div>

      <button className="admin-add-btn" onClick={addProduct}>
        ➕ Add Product
      </button>

      {products.map((product) => (
        <div key={product.productId} className="admin-product-card">
          <div className="admin-field">
            <label>Display Order</label>
            <input
              type="number"
              value={product.displayOrder}
              onChange={(e) =>
                handleChange(product.productId, "displayOrder", parseInt(e.target.value))
              }
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="admin-field">
            <label>Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) =>
                handleChange(product.productId, "name", e.target.value)
              }
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="admin-field">
            <label>Description</label>
            <input
              type="text"
              value={product.description}
              onChange={(e) =>
                handleChange(product.productId, "description", e.target.value)
              }
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="admin-field">
            <label>Price ($)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                handleChange(product.productId, "price", parseFloat(e.target.value))
              }
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="admin-field">
            <label>Stock Quantity</label>
            <input
              type="number"
              value={product.stock}
              onChange={(e) =>
                handleChange(product.productId, "stock", parseInt(e.target.value))
              }
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="admin-field">
            <label>Image URL</label>
            <input
              type="text"
              value={product.imageURL}
              onChange={(e) =>
                handleChange(product.productId, "imageURL", e.target.value)
              }
              className="border rounded px-2 py-1"
            />
            {product.imageURL && (
              <img
                src={product.imageURL}
                alt="Preview"
                className="admin-img-preview"
              />
            )}
          </div>

          <div className="admin-checkbox">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.localPickupOnly}
                onChange={(e) =>
                  handleChange(product.productId, "localPickupOnly", e.target.checked)
                }
              />
              Local Pickup Only
            </label>
          </div>

          <div className="admin-actions">
            <button className="save-btn" onClick={() => saveProduct(product)}>
              💾 Save
            </button>
            <button
              className={product.isArchived ? "recover-btn" : "delete-btn"}
              onClick={() => toggleArchive(product)}
            >
              {product.isArchived ? "♻️ Recover" : "🗃️ Archive"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;








import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import apiBaseUrl from "../config";

interface Props {
  user: any;
  setPage: (page: string) => void;
  refreshUser?: () => void;
}

interface Order {
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price?: number;
  orderStatus: string;
  trackingNumber: string;
  createdAt: string;
  shippedAt: string | null;
}

const AccountPage: React.FC<Props> = ({ user, setPage, refreshUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    street: user?.street || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || ""
  });

  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
        const res = await fetch(`${apiBaseUrl}/api/auth/account/update`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

      if (res.ok) {
        setMessage("✅ Address updated successfully!");
        refreshUser?.();
      } else {
        setMessage("❌ Failed to update address.");
      }
    } catch (err) {
      console.error("Error updating account:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
        const res = await fetch(`${apiBaseUrl}/api/orders`, {
            credentials: "include"
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Error fetching orders:", errorData.error);
            return;
          }
          
      

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>You are not logged in.</h2>
        <button className="login-btn" onClick={() => setPage("Login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2 className="login-title">My Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} disabled />

        <label>Street</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} />

        <label>City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} />

        <label>State</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} />

        <label>Zip</label>
        <input type="text" name="zip" value={formData.zip} onChange={handleChange} />

        <button className="login-btn" type="submit">💾 Save</button>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </form>

      <h3 className="login-title" style={{ marginTop: "2rem" }}>📦 My Orders</h3>
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} className="admin-product-card">
            <p><strong>Order ID:</strong> {order.orderId ?? "—"}</p>
<p><strong>Product:</strong> {order.productName || "—"}</p>
<p><strong>Qty:</strong> {order.quantity ?? 0} @ ${order.price?.toFixed(2) ?? "0.00"}</p>

            <p><strong>Status:</strong> {order.orderStatus || "—"}</p>
            <p><strong>Tracking:</strong> {order.trackingNumber || "N/A"}</p>
            <p>
              <strong>Placed At:</strong>{" "}
              {order.createdAt && !isNaN(Date.parse(order.createdAt))
                ? new Date(order.createdAt).toLocaleString()
                : "—"}
            </p>
            {order.shippedAt && !isNaN(Date.parse(order.shippedAt)) && (
              <p><strong>Shipped At:</strong> {new Date(order.shippedAt).toLocaleString()}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AccountPage;






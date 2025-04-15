import React, { useState, useEffect } from "react";
import { Product } from "./StorePage";
import CartCard from "./CartCard";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./shoppingCart.css";
import apiBaseUrl from "../config";

interface Props {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  user?: any;
  setPage?: (page: string) => void;
  setLastOrder?: (order: any) => void; // ✅ Add this line
}

const ShoppingCart: React.FC<Props> = ({ cart, setCart, user, setPage, setLastOrder }) => {
  const [shipping, setShipping] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
  });

  const [useAccountAddress, setUseAccountAddress] = useState(false);
  const guestCheckout = !user;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (user && !guestCheckout) {
      setUseAccountAddress(true);
      setShipping({
        fullName: user.name || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, guestCheckout]);

  useEffect(() => {
    if (user && useAccountAddress && !guestCheckout) {
      setShipping({
        fullName: user.name || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } else if (!useAccountAddress && !guestCheckout) {
      setShipping({
        fullName: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        email: user?.email || "",
        phone: "",
      });
    }
  }, [user, useAccountAddress, guestCheckout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const removeFromCart = (product: Product) => {
    setCart((prev) => prev.filter((item) => item.name !== product.name));
  };

  const decreaseCartQuantity = (product: Product) => {
    setCart((prev) =>
      prev.reduce<Product[]>((acc, item) => {
        if (item.name === product.name && item.quantityInCart > 1) {
          acc.push({ ...item, quantityInCart: item.quantityInCart - 1 });
        } else if (item.name !== product.name) {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const increaseCartQuantity = (product: Product) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === product.name
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantityInCart || 1),
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (!stripe || !elements) {
        alert("Stripe not loaded");
        return;
      }

      const paymentRes = await fetch(`${apiBaseUrl}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalAmount * 100) }),
      });
      

      const { clientSecret } = await paymentRes.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: shipping.fullName,
            email: shipping.email,
          },
        },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        alert("Payment did not complete.");
        return;
      }

      const orderRes = await fetch(`${apiBaseUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingInfo: shipping,
          cartItems: cart.map((p) => ({
            productId: p.productId,
            quantity: p.quantityInCart,
            price: p.price,
          })),
        }),
      });
      

      const orderData = await orderRes.json();
      //console.log("🧾 Final Order Data:", orderData); // <--- Add this line
      if (!orderRes.ok) throw new Error(orderData.error || "Order failed");

      setSuccess(true);
      setCart([]);
      setLastOrder?.(orderData);
      setPage?.("Confirmation"); // 👈 navigate to confirmation


      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = (field: string): boolean => {
    if (field === "email") return user && !guestCheckout;
    return user && !guestCheckout && useAccountAddress;
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {success ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "green" }}>✅ Thank you for your order!</h2>
          <p>You’ll receive a confirmation email shortly.</p>
        </div>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : null}

      {cart.map((product) => (
        <CartCard
          key={product.name}
          product={product}
          removeFromCart={() => removeFromCart(product)}
          decreaseCartQuantity={() => decreaseCartQuantity(product)}
          increaseCartQuantity={() => increaseCartQuantity(product)}
        />
      ))}

      {cart.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Total: ${totalAmount.toFixed(2)}</h3>

          <h3>Shipping Information</h3>

          {user && (
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                checked={useAccountAddress}
                onChange={(e) => setUseAccountAddress(e.target.checked)}
                disabled={guestCheckout}
                style={{ marginRight: "0.5rem" }}
              />
              Use my account address
            </label>
          )}

          {!user && (
            <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
              You’re checking out as a guest.{" "}
              <button
                type="button"
                onClick={() => setPage?.("CreateAccount")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#007BFF",
                  textDecoration: "underline",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                Create an account
              </button>{" "}
              to track your orders.
            </p>
          )}

          <form>
            <input name="fullName" placeholder="Full Name" value={shipping.fullName} onChange={handleChange} readOnly={isReadOnly("fullName")} required />
            <input name="street" placeholder="Street Address" value={shipping.street} onChange={handleChange} readOnly={isReadOnly("street")} required />
            <input name="city" placeholder="City" value={shipping.city} onChange={handleChange} readOnly={isReadOnly("city")} required />
            <input name="state" placeholder="State" value={shipping.state} onChange={handleChange} readOnly={isReadOnly("state")} required />
            <input name="zip" placeholder="Zip Code" value={shipping.zip} onChange={handleChange} readOnly={isReadOnly("zip")} required />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={shipping.email}
              onChange={handleChange}
              readOnly={isReadOnly("email")}
              required
            />
            <input name="phone" placeholder="Phone Number" value={shipping.phone} onChange={handleChange} readOnly={isReadOnly("phone")} required />
          </form>

          <h3>Payment</h3>
          <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <CardElement />
          </div>

          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Submit Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;











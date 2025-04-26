import React, { useState } from "react";
import "./LoginPage.css"; // Reuse login styles for consistency
import apiBaseUrl from "../config";

interface Props {
  setPage: (page: string) => void;
}

const CreateAccount: React.FC<Props> = ({ setPage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("✅ Account created! You can now log in.");
      setTimeout(() => setPage("Login"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Create Account</h2>
      <form className="login-form" onSubmit={handleRegister}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirm}
          placeholder="Confirm password"
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && <p style={{ marginTop: "1rem", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <span
            onClick={() => setPage("Login")}
            style={{ color: "#4a3a28", textDecoration: "underline", cursor: "pointer" }}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default CreateAccount;

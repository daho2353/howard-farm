import React, { useState } from "react";
import "./LoginPage.css";
import apiBaseUrl from "../config";

interface Props {
  setUser: (user: any) => void;
  setPage: (page: string) => void;
}

const LoginPage: React.FC<Props> = ({ setUser, setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        setUser(data.user);
        setPage("Home"); // ✅ redirect after login
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
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
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="create-account-text">
        Don't have an account?{" "}
        <button
          type="button"
          className="link-button"
          onClick={() => setPage("CreateAccount")}
        >
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginPage;




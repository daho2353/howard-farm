import './App.css';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StorePage, { Product } from './components/StorePage';
import ShoppingCart from './components/shoppingCart';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';
import CreateAccount from './components/CreateAccount';
import AccountPage from './components/AccountPage';
import Navbar from './components/Navbar';
import AdminOrdersPage from './components/AdminOrdersPage';
import OrderConfirmation from './components/OrderConfirmation'; // ✅ Import
import apiBaseUrl from "./config";

const App = () => {
  const [currentPage, setPage] = useState<string>('Home');
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [lastOrder, setLastOrder] = useState<any>(null); // ✅ Add state for last order

  
const fetchUser = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  } catch (err) {
    console.error("Error fetching current user:", err);
  }
};


  useEffect(() => {
    fetchUser();
  }, []);

  const renderPage = (): JSX.Element => {
    switch (currentPage) {
      case 'Home':
        return <HomePage setPage={setPage} />;
      case 'About':
        return <AboutPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Shop':
        return <StorePage cart={cart} setCart={setCart} />;
      case 'Checkout':
        return (
          <ShoppingCart
            cart={cart}
            setCart={setCart}
            user={user}
            setPage={setPage}
            setLastOrder={setLastOrder} // ✅ Pass the order setter
          />
        );
      case 'Confirmation':
        return <OrderConfirmation order={lastOrder} />; // ✅ Pass order to confirmation
      case 'Admin':
        return user?.isAdmin ? (
          <AdminPage />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>🚫 Access Denied</h2>
            <p>You must be an admin to view this page.</p>
          </div>
        );
      case 'AdminOrders':
        return user?.isAdmin ? (
          <AdminOrdersPage />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>🚫 Access Denied</h2>
            <p>You must be an admin to view this page.</p>
          </div>
        );
      case 'Login':
        return <LoginPage setUser={setUser} setPage={setPage} />;
      case 'CreateAccount':
        return <CreateAccount setPage={setPage} />;
      case 'Account':
        return <AccountPage user={user} setPage={setPage} refreshUser={fetchUser} />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <Navbar setPage={setPage} user={user} setUser={setUser} />
      </header>
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;













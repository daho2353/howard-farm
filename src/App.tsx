import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StorePage, { Product } from './components/StorePage';
import ShoppingCart from './components/shoppingCart';

const App = () => {
  const [currentPage, setPage] = useState<string>('About');
  const [cart, setCart] = useState<Product[]>([]);

  const renderPage = (): JSX.Element => {
    if (currentPage === "About") {
      return <AboutPage setPage={setPage} />;
    } else if (currentPage === "Shop") {
      return <StorePage cart={cart} setCart={setCart} />;
    } else if (currentPage === "Contact") {
      return <ContactPage />;
    }
    // Default to Checkout page, displaying the shopping cart
    return (
      <div>
        <ShoppingCart cart={cart} setCart={setCart} />
      </div>
    );
  };

  return (
    <div className="App">
      <header>
        <img
          src={NavIcon}
          id="header-icon"
          height="175px"
          alt="Navigation Icon"
        />
        <nav>
          <button onClick={() => setPage('About')}>About Us</button>
          <button onClick={() => setPage('Contact')}>Contact Us</button>
          <button onClick={() => setPage('Shop')}>Shop</button>
          <button onClick={() => setPage('Checkout')}>Check Out</button>
        </nav>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;


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
    switch (currentPage) {
      case 'About':
        return <AboutPage setPage={setPage} />;
      case 'Shop':
        return <StorePage cart={cart} setCart={setCart} />;
      case 'Contact':
        return <ContactPage />;
      case 'Checkout':
      default:
        return <ShoppingCart cart={cart} setCart={setCart} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-container">
          <img src={NavIcon} alt="Howard's Farm Logo" className="logo" />
        </div>
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


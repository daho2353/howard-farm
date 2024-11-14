import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StorePage from './components/StorePage';

const App = () => {
  const[currentPage, setPage] = useState<string>('About');

  const renderPage = (): JSX.Element => {
    if (currentPage === "About")
    {
      return <AboutPage setPage={setPage}/>
    }
    else if (currentPage === "Shop")
    {
      return <StorePage/>
    }
    else if (currentPage === "Contact")
    {
      return <ContactPage/>
    }
    return <></>
  };

  return (
    <div className="App">
      <header>
      <img src={NavIcon} id="header-icon" height="175px" alt="profile image"/> 
        <nav>
          <button onClick = {() => setPage('About')}> About Us </button>
          <button onClick = {() => setPage("Contact")}> Contact Us </button>
          <button onClick = {() => setPage('Shop')}> Shop </button>
          <button onClick = {() => setPage('Checkout')}> Check Out </button>
        </nav>
      </header>
      <div> {renderPage()} </div>
    </div>
  );
}

export default App;

import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

const App = () => {
  const[currentPage, setPage] = useState<string>('About');

  const renderPage = (): JSX.Element => {
    if (currentPage === "About")
    {
      return <AboutPage setPage={setPage}/>
    }
    else if (currentPage === "Shop")
    {
      return <p> placeholder - Shop </p>
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
          <button onClick = {() => setPage('Shop')}> Shop </button>
          <button onClick = {() => setPage("Contact")}> Contact Us </button>
        </nav>
      </header>
      <div> {renderPage()} </div>
    </div>
  );
}

export default App;

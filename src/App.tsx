import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import AboutPage from './components/AboutPage';

const App = () => {
  const[currentPage, setPage] = useState<string>('About');

  const renderPage = (): JSX.Element => {
    if (currentPage === "About")
    {
      return <AboutPage/>
    }
    else
    {
      return <p> placeholder </p>
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

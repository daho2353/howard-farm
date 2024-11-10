import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import AboutPage from './components/AboutPage';

const App = () => {
  const[currentPage, setPage] = useState<string>('Home');

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
      <AboutPage/>
    </div>
  );
}

export default App;

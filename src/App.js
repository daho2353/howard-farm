import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import NavIcon from './img/logo.png'

function App() {
  const[currentPage, setPage] = useState('Home');
  return (
    <div className="App">
      <header>
      <img src={NavIcon} id="header-icon" height="75px" alt="profile image"/> 
        <nav>
          <button onClick = {() => setPage('About')}> About Us </button>
          <button onClick = {() => setPage('Shop')}> Shop </button>
          <button onClick = {() => setPage("Contact")}> Contact Us </button>
        </nav>
      </header>
    </div>
  );
}

export default App;

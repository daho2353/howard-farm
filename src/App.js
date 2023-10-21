import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import NavIcon from './img/icon.png';
import ImageSlider from "./components/ImageSlider";
import Hero from './img/hero.jpg';
import Home from './img/home.jpg';
import Produce from './img/produce.jpg';
import Product from './img/product.jpg';



const App = () => {
  const[currentPage, setPage] = useState('Home');
  const slides = [
    {url: Hero, title: "hero"},
    {url: Home, title: "home"},
    {url: Produce, title: "produce"},
    {url: Product, title: "product"},
  ]

  const sliderContainer ={
    height: "100%",
    width: "100%",
    position:"relative",
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
        <div style={sliderContainer}>
          <ImageSlider slides={slides} />
        </div>
        <div>
          <p> about us </p>
          <p> wow we are so cool, we have a green house</p>
          <p> we use the eggs from our chickens as well</p>
          <p> we use spices from all around the world and recipe's from generations of cooks</p>
        </div>
    </div>
  );
}

export default App;

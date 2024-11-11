import React from "react";
import ImageSlider from "./ImageSlider";
import Hero from '../img/hero.jpg';
import Home from '../img/home.jpg';
import Produce from '../img/produce.jpg';
import Product from '../img/product.jpg';

export interface Slide {
    url: string;
}

interface Props{
    setPage: (page: string) => void;
  }
  

const AboutPage = ({setPage}: Props): JSX.Element => {
    const slides: Slide[] = [
        {url: Hero},
        {url: Home},
        {url: Produce},
        {url: Product},
      ]

      return (
        <div> 
        <div className="slider-container">
            <ImageSlider slides={slides} />
        </div>
        <div>
        <h2> about us </h2>
        <p> Welcome to Howard Farm! Since 2022, we've been dedicated to growing fresh, quality produce and sharing the flavors of our heritage with our community. At Howard Farm, we not only cultivate our own fruits, vegetables, and herbs, but we also use them to create delicious, homemade recipes inspired by a lineage of skilled chefs and cooks in our family. Each product we offer is crafted with care, combining generations of culinary expertise with the freshest ingredients straight from our fields. Join us in celebrating the art of homegrown food and family-inspired cooking!</p>
        <button onClick={() => setPage("Shop")}> Go to Shop →</button> 
        </div>    
    </div>
      )
}

export default AboutPage;
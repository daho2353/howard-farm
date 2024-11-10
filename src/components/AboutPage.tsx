import React from "react";
import ImageSlider from "./ImageSlider";
import Hero from '../img/hero.jpg';
import Home from '../img/home.jpg';
import Produce from '../img/produce.jpg';
import Product from '../img/product.jpg';

export interface Slide {
    url: string;
}

const AboutPage = () => {
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
        <p> about us </p>
        <p> wow we are so cool, we have a green house</p>
        <p> we use the eggs from our chickens as well</p>
        <p> we use spices from all around the world and recipe's from generations of cooks</p>
        </div>    
    </div>
      )



}

export default AboutPage;
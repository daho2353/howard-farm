import React from "react";
import ImageSlider from "./ImageSlider";
import Hero from "../img/hero.jpg";
import Home from "../img/home.jpg";
import Produce from "../img/produce.jpg";
import Product from "../img/product.jpg";

export interface Slide {
  url: string;
  alt: string;
}

interface Props {
  setPage: (page: string) => void;
}

const AboutPage: React.FC<Props> = ({ setPage }) => {
  const slides: Slide[] = [
    { url: Hero, alt: "Scenic view of the farm in the morning" },
    { url: Home, alt: "Exterior view of the farmhouse" },
    { url: Produce, alt: "Fresh produce harvested from the farm" },
    { url: Product, alt: "A selection of farm products" },
  ];

  return (
    <div>
      <div className="slider-container">
        <ImageSlider slides={slides} />
      </div>
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          Welcome to Howard Farm! Since 2022, we've been dedicated to growing fresh, quality produce and sharing the flavors of our heritage with our community. At Howard Farm, we not only cultivate our own fruits, vegetables, and herbs, but we also use them to create delicious, homemade recipes inspired by a lineage of skilled chefs and cooks in our family. Each product we offer is crafted with care, combining generations of culinary expertise with the freshest ingredients straight from our fields. Join us in celebrating the art of homegrown food and family-inspired cooking!
        </p>
        <button onClick={() => setPage("Shop")}>Go to Shop →</button>
      </div>
    </div>
  );
};

export default AboutPage;

import React from "react";
import ImageSlider from "./ImageSlider";

export interface Slide {
  url: string;
  alt: string;
}

interface Props {
  setPage: (page: string) => void;
}

const HomePage: React.FC<Props> = ({ setPage }) => {
  const slides: Slide[] = [
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/hero.jpg",
      alt: "Scenic view of the farm in the morning",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/home.jpg",
      alt: "Exterior view of the farmhouse",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/produce.jpg",
      alt: "Fresh produce harvested from the farm",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/Tomatoes.jpg",
      alt: "Freshly picked tomatoes from the field",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/peppers.jpg",
      alt: "Colorful peppers grown at Howard Farm",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/dogs.jpg",
      alt: "The farm dogs relaxing near the barn",
    },
    {
      url: "https://howardfarmblob.blob.core.windows.net/websiteimages/peacock.jpg",
      alt: "A peacock wandering around the farm",
    },
  ];

  return (
    <div className="home-page">
      <div className="slider-container">
        <ImageSlider slides={slides} />
      </div>
      <div className="home-content">
        <h2>Welcome to Howard Farm</h2>
        <p>
          Since 2022, we've been dedicated to growing fresh, quality produce and sharing the
          flavors of our heritage with our community. At Howard Farm, we not only cultivate our own
          fruits, vegetables, and herbs, but we also use them to create delicious, homemade recipes
          inspired by a lineage of skilled chefs and cooks in our family. Each product we offer is
          crafted with care, combining generations of culinary expertise with the freshest
          ingredients straight from our fields.
        </p>
        <button onClick={() => setPage("Shop")}>Go to Shop →</button>
      </div>
    </div>
  );
};

export default HomePage;




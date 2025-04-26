import React, { useState } from 'react';
import { Slide } from './HomePage';
import './imageSlider.css';

interface Props {
  slides: Slide[];
}

const ImageSlider: React.FC<Props> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slider">
      <button className="arrow left-arrow" onClick={goToPrevious} aria-label="Previous Slide">
      <span aria-hidden="true">❰</span>
        ❰
      </button>
      <div className="slide">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].alt}
          className="slide-image"
        />
      </div>
      <button className="arrow right-arrow" onClick={goToNext} aria-label="Next Slide">
      <span aria-hidden="true">❰</span>
        ❱
      </button>
    </div>
  );
};

export default ImageSlider;


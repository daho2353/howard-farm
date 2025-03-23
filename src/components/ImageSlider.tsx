import React, { useState } from 'react';
import { Slide } from './AboutPage';
import './imageSlider.css';

interface Props {
  slides: Slide[];
}

const ImageSlider: React.FC<Props> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="slider">
      <div className="left-arrow" onClick={goToPrevious}>
        ❰
      </div>
      <div className="right-arrow" onClick={goToNext}>
        ❱
      </div>
      <div className="slide">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].alt || ''}
        />
      </div>
    </div>
  );
};

export default ImageSlider;

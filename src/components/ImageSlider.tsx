import React from 'react';
import {useState} from 'react';
import { Slide } from './AboutPage';
import './imageSlider.css';

interface Props {
  slides: Slide[];
}

const ImageSlider: React.FC<Props> = ({slides}) => {
    const [CurrentIndex, setCurrentIndex] = useState(0);

    const slideStyles = {
        backgroundImage: `url(${slides[CurrentIndex].url})`,
    };

      const goToPrevious = () => {
        const isFirstSlide = CurrentIndex === 0
        const newIndex = isFirstSlide ? slides.length - 1 : CurrentIndex - 1; 
        setCurrentIndex(newIndex);
      }

      const goToNext = () => {
        const isLastSlide = CurrentIndex === slides.length - 1 
        const newIndex = isLastSlide ? 0 : CurrentIndex + 1; 
        setCurrentIndex(newIndex);
      }

    return (
    <div className='slider'>
        <div className='left-arrow' onClick={goToPrevious}> ❰</div>
        <div className='right-arrow' onClick={goToNext}> ❱</div>
        <div style={slideStyles} className='slide'></div>
    </div>
    );
};

export default ImageSlider;
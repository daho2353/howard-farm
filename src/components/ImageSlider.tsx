import React from 'react';
import {useState} from 'react';
import { Slide } from './AboutPage';
import './imageSlider.css';

interface Props {
  slides: Slide[];
}

const ImageSlider: React.FC<Props> = ({slides}) => {
    const [CurrentIndex, setCurrentIndex] = useState<number>(0);

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
        <div className='slide'>
          <img src={slides[CurrentIndex].url} />
        </div>
    </div>
    );
};

export default ImageSlider;
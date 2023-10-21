import {useState} from 'react';

const ImageSlider = ({slides}) => {
    const [CurrentIndex, setCurrentIndex] = useState(0);

    const sliderStyles ={
        minHeight: "850px",
        height: "100%",
        position:"relative",
    };

    const slideStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${slides[CurrentIndex].url})`,
    };

    const rightArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: "32px",
        fontSize: "45px",
        color: "#fff",
        zIndex: 1,
        cursor: "pointer",
      };
      
      const leftArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        left: "32px",
        fontSize: "45px",
        color: "#fff",
        zIndex: 1,
        cursor: "pointer",
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
    <div style={sliderStyles}>
        <div style={leftArrowStyles} onClick={goToPrevious}> ❰</div>
        <div style={rightArrowStyles} onClick={goToNext}> ❱</div>
        <div style={slideStyles}></div>
    </div>
    );
};

export default ImageSlider;
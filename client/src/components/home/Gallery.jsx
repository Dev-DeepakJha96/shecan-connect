import React, { useState, useEffect, useCallback, useRef } from 'react';

import slide1 from '../../assets/gallery02.jpg';
import slide2 from '../../assets/gallery03.jpg';
import slide3 from '../../assets/gallery04.jpg';
import slide4 from '../../assets/gallery05.jpg';
import slide5 from '../../assets/gallery01.jpg';

// Custom hook for carousel logic
const useCarousel = (totalSlides, autoSlideInterval = 3000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const resetAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
  }, [nextSlide, autoSlideInterval]);

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [resetAutoSlide]);

  return { currentSlide, nextSlide, prevSlide, goToSlide, resetAutoSlide };
};

const ImageGallery = () => {
  const slides = [
    slide1,
    slide2,
    slide3,
    slide4,
    slide5
  ];

  const { currentSlide, nextSlide, prevSlide, goToSlide, resetAutoSlide } = useCarousel(slides.length);
  const sliderRef = useRef(null);

  // Update slider transform
  useEffect(() => {
    if (sliderRef.current?.children[0]) {
      const slideWidth = sliderRef.current.children[0].clientWidth;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
  }, [currentSlide]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current?.children[0]) {
        const slideWidth = sliderRef.current.children[0].clientWidth;
        sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide]);

  return (
    <div className="w-full bg-gray-900 py-7 px-4"> {/* Removed gradient and full-screen height */}
      <div className="max-w-6xl mx-auto"> {/* Centered container with proper max width */}
        {/* Optional: Add a title for the gallery section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Our Gallery</h2>
          <p className="text-gray-300">Explore our collection of beautiful moments</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center w-full">
            <button
              onClick={() => {
                prevSlide();
                resetAutoSlide();
              }}
              className="md:p-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 mx-2 md:mx-4 overflow-hidden relative rounded-xl shadow-2xl">
              <div ref={sliderRef} className="flex transition-transform duration-500 ease-in-out">
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img 
                      src={slide} 
                      className="w-full h-auto object-cover" 
                      alt={`Slide ${index + 1}`}
                      style={{ maxHeight: '500px' }} // Controls maximum height
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                nextSlide();
                resetAutoSlide();
              }}
              className="md:p-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2 md:gap-3 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index);
                  resetAutoSlide();
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                  index === currentSlide
                    ? 'bg-blue-500 w-8 md:w-10 h-1.5 md:h-2'
                    : 'bg-gray-400 hover:bg-gray-300 w-2 md:w-3 h-1.5 md:h-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
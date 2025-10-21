"use client";
import { useState, useEffect } from 'react';
import { PropertyImage } from './PropertyImage';

interface ImageCarouselProps {
  mainImage?: string | null;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  displayId: number;
  enabled: boolean;
  duration: number; // in milliseconds
  transition: 'none' | 'fade';
}

export function ImageCarousel({ 
  mainImage, 
  image1, 
  image2, 
  image3, 
  displayId, 
  enabled, 
  duration, 
  transition 
}: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Collect all available images (excluding null/undefined)
  const images = [
    mainImage,
    image1,
    image2,
    image3
  ].filter((img): img is string => img != null && img !== '');
  
  // If carousel is disabled or no images, just show the main image
  if (!enabled || images.length <= 1) {
    return (
      <div className="aspect-[4/3] relative bg-gray-200 rounded-lg overflow-hidden">
        <PropertyImage 
          src={mainImage ? `uploads/${displayId}/${mainImage}` : ''}
          alt="Main Property Image"
          fallbackText="Main Property Image"
          fill={true}
        />
      </div>
    );
  }
  
  // Auto-advance carousel
  useEffect(() => {
    if (!enabled || images.length <= 1) return;
    
    // Ensure duration is at least 1 second (1000ms) to prevent rapid flickering
    const safeDuration = Math.max(duration, 1000);
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, safeDuration);
    
    return () => clearInterval(interval);
  }, [enabled, images.length, duration]);
  
  const currentImage = images[currentImageIndex];
  const imageAlt = currentImageIndex === 0 ? 'Main Property Image' : `Interior Image ${currentImageIndex}`;
  
  return (
    <div className="aspect-[4/3] relative bg-gray-200 rounded-lg overflow-hidden">
      {/* Image with transition */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          transition === 'fade' ? 'opacity-100' : 'opacity-100'
        }`}
        key={currentImageIndex} // Force re-render for fade effect
      >
        <PropertyImage 
          src={`uploads/${displayId}/${currentImage}`}
          alt={imageAlt}
          fallbackText={imageAlt}
          fill={true}
        />
      </div>
      
      {/* Carousel indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Carousel info overlay */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  );
}

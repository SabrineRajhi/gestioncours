import React from 'react';

import './ImageGallery.css';

const ImageGallery = () => {
  const images = [
    {
      id: 1,
      src: '/images/image1.jpg',
      alt: 'Nature landscape'
    },
    {
      id: 2,
      src: '/images/image2.jpg',
      alt: 'City street'
    },
    {
      id: 3,
      src: '/images/image3.jpg',
      alt: 'Winter scene'
    },
    {
      id: 4,
      src: '/images/image4.jpg',
      alt: 'Mountain view'
    }
  ];

  return (
    <div className="image-gallery">
      <h2 className="gallery-title">IMAGES</h2>
      
      <div className="color-filters">
        <div className="color-filter purple" title="Purple filter" />
        <div className="color-filter blue" title="Blue filter" />
        <div className="color-filter green" title="Green filter" />
        <div className="color-filter red" title="Red filter" />
        <div className="color-filter orange" title="Orange filter" />
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img
              src={image.src}
              alt={image.alt}
              className="gallery-image"
            />
          </div>
        ))}
      </div>

      <a href="#" className="download-button">
        DOWNLOAD FREE!
      </a>
      
      <a href="#" className="pro-button">
        GET PRO VERSION
      </a>
      
      <a href="#" className="docs-button">
        DOCUMENTATION
      </a>
    </div>
  );
};

export default ImageGallery; 
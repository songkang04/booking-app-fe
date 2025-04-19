import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

/**
 * Component hiển thị carousel hình ảnh của homestay
 * @param {Object} props - Component props
 * @param {Array} props.images - Mảng URL hình ảnh
 */
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  // Nếu không có ảnh, hiển thị ảnh placeholder
  const imageList = images && images.length 
    ? images 
    : ['https://via.placeholder.com/800x500?text=Không+có+hình+ảnh'];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
  };

  const toggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Carousel chính */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-gray-200">
        <img 
          src={imageList[currentIndex]} 
          alt={`Hình ảnh homestay ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay thông tin */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1}/{imageList.length}
          </div>
          
          <button 
            onClick={toggleFullImage}
            className="bg-black/70 text-white p-2 rounded-full"
            aria-label="Xem ảnh đầy đủ"
          >
            <FaExpand />
          </button>
        </div>

        {/* Nút điều hướng */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          onClick={prevSlide}
          aria-label="Ảnh trước"
        >
          <FaChevronLeft className="text-gray-800" />
        </button>
        
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          onClick={nextSlide}
          aria-label="Ảnh tiếp theo"
        >
          <FaChevronRight className="text-gray-800" />
        </button>
      </div>

      {/* Thumbnail preview */}
      {imageList.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
          {imageList.map((image, index) => (
            <div 
              key={index}
              className={`relative w-24 h-16 shrink-0 cursor-pointer 
                ${index === currentIndex ? 'ring-2 ring-primary' : 'opacity-70'}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal xem ảnh đầy đủ */}
      {showFullImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={toggleFullImage}
                className="bg-white text-black rounded-full p-2"
                aria-label="Đóng"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
              <img 
                src={imageList[currentIndex]} 
                alt={`Hình ảnh homestay ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <button
                className="bg-white text-black rounded-full p-2"
                onClick={prevSlide}
                aria-label="Ảnh trước"
              >
                <FaChevronLeft />
              </button>
              
              <div className="text-white text-sm">
                {currentIndex + 1}/{imageList.length}
              </div>
              
              <button
                className="bg-white text-black rounded-full p-2"
                onClick={nextSlide}
                aria-label="Ảnh tiếp theo"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

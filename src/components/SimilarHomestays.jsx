import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency } from '../utils/format';

/**
 * Component hiển thị một card homestay trong danh sách homestay tương tự
 * @param {Object} props - Component props
 * @param {Object} props.homestay - Thông tin homestay
 */
const HomestayCard = ({ homestay }) => {
  return (
    <Link 
      to={`/homestays/${homestay.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Ảnh thumbnail */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={homestay.images?.[0] || 'https://via.placeholder.com/300x200?text=Homestay'} 
          alt={homestay.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center text-white">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-medium">
              {homestay.rating || '4.5'} 
              <span className="text-white/80 font-normal text-sm">
                ({homestay.reviewCount || '0'})
              </span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Thông tin homestay */}
      <div className="p-3">
        {/* Tên và giá */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 line-clamp-1">{homestay.name}</h3>
          <div className="text-right font-bold text-primary whitespace-nowrap ml-2">
            {formatCurrency(homestay.price)}
          </div>
        </div>
        
        {/* Địa điểm */}
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <FaMapMarkerAlt className="text-red-500 mr-1" /> 
          <span className="line-clamp-1">{homestay.location}</span>
        </div>
        
        {/* Tiện nghi nổi bật */}
        {homestay.amenities && homestay.amenities.length > 0 && (
          <div className="mt-2 text-sm text-gray-600 line-clamp-1">
            {homestay.amenities.slice(0, 3).join(' · ')}
            {homestay.amenities.length > 3 && ` và ${homestay.amenities.length - 3} tiện nghi khác`}
          </div>
        )}
      </div>
    </Link>
  );
};

/**
 * Component hiển thị danh sách homestay tương tự
 * @param {Object} props - Component props
 * @param {Array} props.homestays - Mảng homestay tương tự
 * @param {string} props.className - className bổ sung
 */
const SimilarHomestays = ({ homestays = [], className = '' }) => {
  // Nếu không có homestay tương tự, không hiển thị gì
  if (!homestays || homestays.length === 0) {
    return null;
  }
  
  return (
    <div className={`${className}`}>
      <h2 className="text-xl font-bold mb-4">Homestay tương tự</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {homestays.map(homestay => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))}
      </div>
    </div>
  );
};

export default SimilarHomestays;

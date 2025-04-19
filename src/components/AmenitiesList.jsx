import React, { useState } from 'react';
import { FaWifi, FaTv, FaSnowflake, FaParking, FaSwimmingPool, FaUtensils, FaLock, FaWater, FaCoffee, FaBath } from 'react-icons/fa';
import { AMENITIES_CATEGORIES, AMENITIES_BY_CATEGORY } from '../constants/amenities';

/**
 * Map tên tiện nghi với icon tương ứng
 */
const amenityIcons = {
  'Wifi': <FaWifi />,
  'TV': <FaTv />,
  'Điều hòa': <FaSnowflake />,
  'Bãi đỗ xe': <FaParking />,
  'Hồ bơi': <FaSwimmingPool />,
  'Nhà bếp': <FaUtensils />,
  'Khóa cửa an toàn': <FaLock />,
  'Nóng lạnh': <FaWater />,
  'Máy pha cà phê': <FaCoffee />,
  'Bồn tắm': <FaBath />,
  // Thêm các icon khác tại đây
};

/**
 * Component hiển thị danh sách tiện nghi theo nhóm
 * @param {Object} props - Component props 
 * @param {Array} props.amenities - Mảng tiện nghi của homestay
 * @param {string} props.className - className bổ sung
 */
const AmenitiesList = ({ amenities = [], className = '' }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Nếu không có tiện nghi, hiển thị thông báo
  if (!amenities || amenities.length === 0) {
    return (
      <div className={`bg-white rounded-lg ${className}`}>
        <h2 className="text-xl font-bold mb-4">Tiện nghi</h2>
        <p className="text-gray-500">Không có thông tin về tiện nghi.</p>
      </div>
    );
  }

  // Hàm render icon cho tiện nghi
  const renderIcon = (amenity) => {
    return amenityIcons[amenity] || null;
  };

  // Phân loại tiện nghi theo nhóm
  const categorizedAmenities = {};
  
  AMENITIES_CATEGORIES.forEach(category => {
    categorizedAmenities[category] = [];
  });

  // Thêm các tiện nghi vào nhóm tương ứng
  amenities.forEach(amenity => {
    for (const category in AMENITIES_BY_CATEGORY) {
      if (AMENITIES_BY_CATEGORY[category].includes(amenity)) {
        categorizedAmenities[category].push(amenity);
        break;
      }
    }
  });

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <h2 className="text-xl font-bold mb-4">Tiện nghi</h2>
      
      <div className="space-y-6">
        {/* Hiển thị tiện nghi theo từng nhóm */}
        {AMENITIES_CATEGORIES.map(category => {
          const categoryAmenities = categorizedAmenities[category];
          
          // Bỏ qua nhóm nếu không có tiện nghi nào
          if (categoryAmenities.length === 0) return null;
          
          return (
            <div key={category} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-gray-700 mb-3">{category}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryAmenities.slice(0, showAll ? categoryAmenities.length : 6).map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <span className="mr-2 text-gray-600">
                      {renderIcon(amenity)}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              
              {/* Hiển thị button "Xem thêm" nếu có nhiều tiện nghi */}
              {!showAll && categoryAmenities.length > 6 && (
                <button 
                  className="text-primary font-medium mt-2 hover:underline"
                  onClick={() => setShowAll(true)}
                >
                  Xem tất cả {categoryAmenities.length} tiện nghi
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Button thu gọn */}
      {showAll && (
        <button 
          className="text-primary font-medium mt-4 hover:underline"
          onClick={() => setShowAll(false)}
        >
          Thu gọn
        </button>
      )}
    </div>
  );
};

export default AmenitiesList;

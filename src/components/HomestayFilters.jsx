import React, { useState } from 'react';
import { AmenitiesCategories } from '../constants/amenities';

const HomestayFilters = ({ onFilter }) => {
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [showAmenities, setShowAmenities] = useState(false);

  const handleFilter = (e) => {
    e.preventDefault();
    const filterParams = {
      location: location || undefined,
      name: name || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      amenities: amenities.length > 0 ? amenities.join(',') : undefined, 
      page: 1,
      limit: 12
    };
    
    console.log('Tham số tìm kiếm:', filterParams);
    
    onFilter(filterParams);
  };

  // Hàm xóa tất cả các tiêu chí tìm kiếm
  const clearAllFilters = () => {
    setLocation('');
    setName('');
    setMinPrice('');
    setMaxPrice('');
    setAmenities([]);
    
    // Gọi API để lấy lại tất cả homestay không có bộ lọc
    onFilter({
      page: 1,
      limit: 12
    });
  };

  // Danh sách 63 tỉnh thành Việt Nam
  const provinces = [
    "An Giang", 
    "Bà Rịa - Vũng Tàu", 
    "Bắc Giang", 
    "Bắc Kạn", 
    "Bạc Liêu", 
    "Bắc Ninh", 
    "Bến Tre", 
    "Bình Định", 
    "Bình Dương", 
    "Bình Phước", 
    "Bình Thuận", 
    "Cà Mau", 
    "Cần Thơ", 
    "Cao Bằng", 
    "Đà Nẵng", 
    "Đắk Lắk", 
    "Đắk Nông", 
    "Điện Biên", 
    "Đồng Nai", 
    "Đồng Tháp", 
    "Gia Lai", 
    "Hà Giang", 
    "Hà Nam", 
    "Hà Nội", 
    "Hà Tĩnh", 
    "Hải Dương", 
    "Hải Phòng", 
    "Hậu Giang", 
    "Hòa Bình", 
    "Hưng Yên", 
    "Khánh Hòa", 
    "Kiên Giang", 
    "Kon Tum", 
    "Lai Châu", 
    "Lâm Đồng", 
    "Lạng Sơn", 
    "Lào Cai", 
    "Long An", 
    "Nam Định", 
    "Nghệ An", 
    "Ninh Bình", 
    "Ninh Thuận", 
    "Phú Thọ", 
    "Phú Yên", 
    "Quảng Bình", 
    "Quảng Nam", 
    "Quảng Ngãi", 
    "Quảng Ninh", 
    "Quảng Trị", 
    "Sóc Trăng", 
    "Sơn La", 
    "Tây Ninh", 
    "Thái Bình", 
    "Thái Nguyên", 
    "Thanh Hóa", 
    "Thừa Thiên Huế", 
    "Tiền Giang", 
    "Thành phố Hồ Chí Minh", 
    "Trà Vinh", 
    "Tuyên Quang", 
    "Vĩnh Long", 
    "Vĩnh Phúc", 
    "Yên Bái"
  ];

  const toggleAmenity = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleAmenitiesView = () => {
    setShowAmenities(!showAmenities);
  };

  return (
    <form onSubmit={handleFilter} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tên homestay
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Nhập tên homestay"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Địa điểm
          </label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">-- Chọn tỉnh thành --</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Giá tối thiểu
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="VNĐ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Giá tối đa
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="VNĐ"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={toggleAmenitiesView}
          className="flex items-center justify-between w-full p-2 rounded-lg text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Tiện nghi ({amenities.length} đã chọn)
          </span>
          {amenities.length > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-1 rounded-full">
              {amenities.length}
            </span>
          )}
        </button>

        {showAmenities && (
          <div className="mt-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            {AmenitiesCategories.map((category) => (
              <div key={category.category} className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
                        ${
                          amenities.includes(amenity)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button 
          type="button"
          onClick={clearAllFilters}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Xóa bộ lọc
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default HomestayFilters;

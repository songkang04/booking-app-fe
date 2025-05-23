import React from 'react';
import { FaStar, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { formatCurrency } from '../utils/format';

/**
 * Component hiển thị thông tin cơ bản của homestay
 * @param {Object} props - Component props
 * @param {Object} props.homestay - Thông tin homestay
 */
const HomestayInfo = ({ homestay }) => {
  // Xử lý trường hợp chưa có dữ liệu
  if (!homestay) return null;

  return (
    <div className="bg-white rounded-lg">
      {/* Tên homestay */}
      <h1 className="text-3xl font-bold text-gray-800">{homestay.name}</h1>

      {/* Đánh giá và địa điểm */}
      <div className="flex items-center mt-2 flex-wrap gap-2">
        <div className="flex items-center mr-4">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-medium">
            {homestay.rating || '4.5'} 
            <span className="text-gray-500 font-normal">
              ({homestay.reviewCount || '0'} đánh giá)
            </span>
          </span>
        </div>

        <div className="flex items-center text-gray-700">
          <FaMapMarkerAlt className="mr-1 text-red-500" />
          <span>{homestay.location}</span>
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <p className="mt-1 text-gray-600">{homestay.address}</p>

      {/* Thông tin chủ homestay */}
      <div className="mt-4 flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
          {homestay.owner?.avatar ? (
            <img 
              src={homestay.owner.avatar} 
              alt={homestay.owner.fullName || 'Chủ homestay'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white">
              <FaUser />
            </div>
          )}
        </div>
        <div className="ml-2">
          <div className="font-medium">
            {homestay.owner?.fullName || 'Chủ homestay'}
          </div>
          <div className="text-sm text-gray-500">
            Tham gia từ {new Date(homestay.owner?.createdAt || new Date()).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Giá */}
      <div className="mt-4 border-t pt-4">
        <div className="text-xl font-bold text-primary">
          {formatCurrency(homestay.price)} 
          <span className="text-sm font-normal text-gray-600">/ đêm</span>
        </div>
      </div>
    </div>
  );
};

export default HomestayInfo;
